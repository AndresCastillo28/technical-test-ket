import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse } from '../interfaces/api-response.interface';
import { RoleInterface } from '../interfaces/role.interface';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private http = inject(HttpClient);
  private baseUrl = '/roles';

  getAllRoles(): Observable<ApiResponse<RoleInterface[]>> {
    return this.http.get<ApiResponse<RoleInterface[]>>(`${this.baseUrl}`)
  }

}
