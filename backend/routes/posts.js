const express = require("express");
const Post = require("../models/post");
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");

    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE_MAP[file.mimetype];

    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

router.post(
  "",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
      creator: req.userData.userID,
    });

    post.save().then((result) => {
      res.status(201).json({
        id: result._id,
        title: result.title,
        content: result.content,
        imagePath: result.imagePath,
      });
    });
  }
);

router.get("", (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  let postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then((posts) => {
      fetchedPosts = posts;
      return Post.count();
    })
    .then((count) => {
      res.status(200).json({ posts: fetchedPosts, maxPosts: count });
    });
});

router.delete("/:id", checkAuth, (req, res, next) => {
  const ID = req.params.id;
  Post.deleteOne({ _id: ID, creator: req.userData.userID }).then(
    (deleteRes) => {
      if (deleteRes.deletedCount) {
        res.status(200).json({ message: "SUCCESS", deleteRes });
        return;
      }
      res.status(401).json({ message: "Not Authorized" });
    }
  );
});

router.get("/:id", (req, res, next) => {
  const id = req.params.id;
  return Post.findById(id)
    .then((post) => {
      if (post) {
        return res.json({ status: 200, post });
      }
      return res.status(404).json();
    })
    .catch(() => {
      return res.status(404).json();
    });
});

router.put(
  "/:id",
  checkAuth,
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }

    const post = new Post({
      _id: req.params.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
    });
    Post.updateOne({ _id: req.params.id, creator: req.userData.userID }, post)
      .then((result) => {
        if (result.matchedCount) {
          res.status(200).json({
            id: post._id,
            imagePath: post.imagePath,
            title: post.title,
            content: post.content,
          });
          return;
        }
        res.status(401).json({
          message: "Not Authorized",
        });
      })
      .catch(console.log);
  }
);

module.exports = router;
