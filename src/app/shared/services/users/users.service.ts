import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EncryptionService } from '../encryption/encryption.service';
import { Router } from '@angular/router';
import { AppComponent } from '../../../app.component';
import { SingletonService } from '../singleton/singleton.service';
import { HeadersService } from '../utilities/headers.service';
import { catchError, map, Observable, of } from 'rxjs';
import { LoginService } from '../../../auth/services/login.service';
import { environment } from '../../../../environments/environment';
import { Usuario, UsuarioForm, UsuarioPassword, UsuarioResponse, UsuariosResponse } from '../../models/users/users.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private http: HttpClient,
    private encryption: EncryptionService,
    private LoginService: LoginService,
    private router: Router,
    private appComponent: AppComponent,
    private singletonService: SingletonService,
    private headersService: HeadersService
  ) { }

  index(): Observable<Usuario[]> {
    return this.http
      .get<UsuariosResponse>(environment.backend + `api/usuario`, {
        headers: this.headersService.getJsonHeaders(),
      })
      .pipe(
        map((rs) => {
          return rs.result.usuarios.map((user, index) => ({
            ...user,
            index,
          }));
        }),
        catchError((error: HttpErrorResponse) => {
          this.LoginService.unauthorized(error);
          return [];
        })
      );
  }

  search(id: string): Observable<Usuario | null> {
    return this.http.get<UsuarioResponse>(environment.backend + `api/usuario/${id}`, {
      headers: this.headersService.getJsonHeaders()
    })
      .pipe(
        map((rs) => {
          return rs.result.usuario;

        }), catchError((error: HttpErrorResponse) => {
          this.LoginService.unauthorized(error)
          return of(null);
        })
      )

  }

  store(user: UsuarioForm): Observable<{ isError: boolean, message: string }> {
    this.appComponent.alert({ summary: "Operación en proceso", detail: " Por favor, espere mientras se completa la operación.", severity: "warn" })
    return this.http.post<UsuarioResponse>(environment.backend + `api/usuario`, { ...user }, { headers: this.headersService.getJsonHeaders() })
      .pipe(
        map((rs: { isError: boolean, message: string }) => {
          return rs;
        }), catchError((error: HttpErrorResponse) => {
          console.error(error)
          this.LoginService.unauthorized(error)
          if (error.status == 422) {
            return of({ isError: true, message: error.error.message });
          }

          return of({ isError: true, message: "No se puedo realizar la operación, por favor intenta mas tarde" });
        })
      )

  }

  update(user: UsuarioForm): Observable<{ isError: boolean, message: string }> {
    this.appComponent.alert({ summary: "Operación en proceso", detail: " Por favor, espere mientras se completa la operación.", severity: "warn" })
    return this.http.put<UsuarioResponse>(environment.backend + `api/usuario/${user?.numero_identificacion}`, { ...user }, { headers: this.headersService.getJsonHeaders() })
      .pipe(
        map((rs: { isError: boolean, message: string }) => {
          return rs;
        }), catchError((error: HttpErrorResponse) => {
          console.error(error)
          this.LoginService.unauthorized(error)
          if (error.status == 422) {
            return of({ isError: true, message: error.error.message });
          }

          return of({ isError: true, message: "No se puedo realizar la operación, por favor intenta mas tarde" });
        })
      )

  }

  updatePassword(user: UsuarioPassword): Observable<{ isError: boolean, message: string }> {
    this.appComponent.alert({ summary: "Operación en proceso", detail: " Por favor, espere mientras se completa la operación.", severity: "warn" })
    return this.http.put<UsuarioResponse>(environment.backend + `api/usuario/changePasswordAdmin`, { ...user }, { headers: this.headersService.getJsonHeaders() })
      .pipe(
        map((rs: { isError: boolean, message: string }) => {
          return rs;
        }), catchError((error: HttpErrorResponse) => {
          console.error(error)
          this.LoginService.unauthorized(error)
          if (error.status == 422) {
            return of({ isError: true, message: error.error.message });
          }

          return of({ isError: true, message: "No se puedo realizar la operación, por favor intenta mas tarde" });
        })
      )

  }

  delete(id: string): Observable<{ isError: boolean, message: string }> {
    this.appComponent.alert({ summary: "Operación en proceso", detail: " Por favor, espere mientras se completa la operación.", severity: "warn" })
    return this.http.delete<UsuarioResponse>(environment.backend + `api/usuario`, {
      body: { numero_identificacion: id },
      headers: this.headersService.getJsonHeaders()
    })
      .pipe(
        map((rs: { isError: boolean, message: string }) => {

          return rs;

        }), catchError((error: HttpErrorResponse) => {
          this.LoginService.unauthorized(error)
          if (error.status == 422) {
            return of({ isError: false, message: error.error.message });
          }

          return of({ isError: false, message: "No se puedo realizar la operación, por favor intenta mas tarde" });
        })
      )
  }


}
