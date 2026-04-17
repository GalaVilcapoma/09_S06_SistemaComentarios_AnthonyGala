import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CommentItem {
  id?: number;
  name: string;
  body: string;
  email?: string;
  postId?: number;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = 'https://jsonplaceholder.typicode.com/comments';

  constructor(private readonly http: HttpClient) {}

  getComments(): Observable<CommentItem[]> {
    return this.http.get<CommentItem[]>(this.apiUrl);
  }

  addComment(comment: CommentItem): Observable<CommentItem> {
    return this.http.post<CommentItem>(this.apiUrl, comment);
  }

  deleteComment(id: number): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
