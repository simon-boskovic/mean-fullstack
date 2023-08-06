import { HttpClient, HttpEvent, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private _http: HttpClient) {}

  get<T>(urlPath: string, params?: HttpParams): Observable<T> {
    return this._http.get<T>(urlPath.replace(/\s/g, ''), {
      params: params,
    });
  }

  delete<T>(urlPath: string, body: unknown = null): Observable<T> {
    const options = { headers: {} };
    if (body) {
      options['body'] = body;
    }
    return this._http.delete<T>(urlPath.replace(/\s/g, ''), options);
  }

  put<T>(urlPath: string, body: {} = {}): Observable<T> {
    return this._http.put<T>(urlPath.replace(/\s/g, ''), body);
  }

  uploadFile<T>(urlPath: string, formData: FormData): Observable<HttpEvent<T>> {
    return this._http.post<T>(urlPath.replace(/\s/g, ''), formData, {
      reportProgress: true,
      observe: 'events',
    });
  }

  post<T>(urlPath: string, body: {} = {}): Observable<T> {
    return this._http.post<T>(urlPath.replace(/\s/g, ''), body);
  }
}
