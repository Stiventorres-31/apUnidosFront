import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EncryptionService } from '../encryption/encryption.service';
import { AppComponent } from '../../../app.component';
import { LoginService } from '../../../pages/auth/services/login/login.service';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { project_interface } from '../../models/project/project.interface';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private headers_json: HttpHeaders = new HttpHeaders();
  private headers_file = new HttpHeaders();


  constructor(
    private http: HttpClient,
    private encriptacion: EncryptionService,
    private AppComponent: AppComponent,
    private LoginService: LoginService
  ) {
    this.headers_json = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + this.encriptacion.loadData("token")
    })
    this.headers_file = new HttpHeaders({
      'Accept': 'application/json',
      'Authorization': 'Bearer ' + this.encriptacion.loadData("token")
    })
  }

  index(): Observable<{ data: project_interface[] }> {
    return this.http.get<{ data: project_interface[] }>(environment.backend + `api/project/list`, { headers: this.headers_json })
      .pipe(
        map((rs) => {
          return rs;
        }), catchError((error: HttpErrorResponse) => {
          this.LoginService.unauthorized(error)
          return [];
        })
      )

  }

  indexUser(): Observable<{ data: project_interface[] }> {
    return this.http.get<{ data: project_interface[] }>(environment.backend + `api/user/projects`, { headers: this.headers_json })
      .pipe(
        map((rs) => {
          return rs;
        }), catchError((error: HttpErrorResponse) => {
          this.LoginService.unauthorized(error)
          return [];
        })
      )

  }



  store(project: { nombre: string }): Observable<{ status: boolean, message: string }> {
    this.AppComponent.alert({ summary: "Operación en proceso", detail: " Por favor, espere mientras se completa la operación.", severity: "warn" })
    return this.http.post<{ status: boolean, message: string }>(environment.backend + `api/project/store`, { ...project }, { headers: this.headers_json })
      .pipe(
        map((rs: { status: boolean, message: string }) => {

          return rs;

        }), catchError((error: HttpErrorResponse) => {
          this.LoginService.unauthorized(error)
          if (error.status == 422) {
            return of({ status: false, message: error.error.message });
          }

          return of({ status: false, message: "No se puedo realizar la operación, por favor intenta mas tarde" });
        })
      )

  }

  search(id: number): Observable<project_interface> {
    return this.http.get<{ data: project_interface }>(environment.backend + `api/project/show/${id}`, { headers: this.headers_json })
      .pipe(
        map((rs) => {
          return rs.data;

        }), catchError((error: HttpErrorResponse) => {
          this.LoginService.unauthorized(error)
          return [];
        })
      )

  }

  update(project: { nombre: string }, id: number): Observable<{ status: boolean, message: string }> {
    this.AppComponent.alert({ summary: "Operación en proceso", detail: " Por favor, espere mientras se completa la operación.", severity: "warn" })
    return this.http.patch<{ status: boolean, message: string }>(environment.backend + `api/project/update/${id}`, { ...project }, { headers: this.headers_json })
      .pipe(
        map((rs: { status: boolean, message: string }) => {

          return rs;

        }), catchError((error: HttpErrorResponse) => {
          this.LoginService.unauthorized(error)
          if (error.status == 422) {
            return of({ status: false, message: error.error.message });
          }

          return of({ status: false, message: "No se puedo realizar la operación, por favor intenta mas tarde" });
        })
      )

  }

  deactivate(estado: number, id: number): Observable<{ status: boolean, message: string }> {
    this.AppComponent.alert({ summary: "Operación en proceso", detail: " Por favor, espere mientras se completa la operación.", severity: "warn" })
    return this.http.patch<{ status: boolean, message: string }>(environment.backend + `api/project/deactivate/${id}`, { estado }, { headers: this.headers_json })
      .pipe(
        map((rs: { status: boolean, message: string }) => {

          return rs;

        }), catchError((error: HttpErrorResponse) => {
          this.LoginService.unauthorized(error)
          if (error.status == 422) {
            return of({ status: false, message: error.error.message });
          }

          return of({ status: false, message: "No se puedo realizar la operación, por favor intenta mas tarde" });
        })
      )
  }

  delete(id: number): Observable<{ status: boolean, message: string }> {
    this.AppComponent.alert({ summary: "Operación en proceso", detail: " Por favor, espere mientras se completa la operación.", severity: "warn" })
    return this.http.delete<{ status: boolean, message: string }>(environment.backend + `api/project/delete/${id}`, { headers: this.headers_json })
      .pipe(
        map((rs: { status: boolean, message: string }) => {

          return rs;

        }), catchError((error: HttpErrorResponse) => {
          this.LoginService.unauthorized(error)
          if (error.status == 422) {
            return of({ status: false, message: error.error.message });
          }

          return of({ status: false, message: "No se puedo realizar la operación, por favor intenta mas tarde" });
        })
      )
  }
}
