import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response.interface';
import { MessageInterface } from '../interfaces/message.response.interface';

@Injectable({
  providedIn: 'root',
})
export class MessagesService {
  private http = inject(HttpClient);
  private baseUrl = '/messages';

  getAll(): Observable<ApiResponse<MessageInterface[]>> {
    return this.http.get<ApiResponse<MessageInterface[]>>(`${this.baseUrl}`);
  }
}
