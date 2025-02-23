import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { of, throwError } from 'rxjs';

import { response_login } from '../../shared/models/auth/login/login.interface';
import { EncryptionService } from '../../shared/services/encryption/encryption.service';
import { environment } from '../../../environments/environment';
import { AppComponent } from '../../app.component';
import { SingletonService } from '../../shared/services/singleton/singleton.service';
import { HeadersService } from '../../shared/services/utilities/headers.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient,
    private encryption: EncryptionService,
    private router: Router,
    private appComponent: AppComponent,
    private singletonService: SingletonService,
    private headersService: HeadersService
  ) { }

  login(credentials: { numero_identificacion: string, password: string }) {
    localStorage.removeItem("token");
    //localStorage.clear();
    sessionStorage.clear();

    return this.http.post<response_login>(
      `${environment.backend}api/auth/login`,
      credentials,
      { headers: this.headersService.getJsonHeaders() }
    ).pipe(
      map((datos) => {
        // Verifica si la respuesta tiene un error explícito
        if (datos.isError) {
          this.appComponent.alert({
            severity: "error",
            summary: "Ups",
            detail: datos.message
          });
          return { isError: true, message: datos.message };
        }

        // Si no hay error, guarda los datos en localStorage o lo que corresponda
        const { result } = datos;

        this.encryption.saveData("id", `${result.user.id}`);
        this.encryption.saveData("document", `${result.user.numero_identificacion}`);
        this.encryption.saveData("token", `${result.token}`);
        this.encryption.saveData("role", `${result.user.rol_usuario}`);
        this.encryption.saveData("fullname", `${result.user.nombre_completo}`);
        this.encryption.saveData("status", `${result.user.estado}`);

        this.singletonService.shared = {};
        return { isError: false, message: "Se ha iniciado sesión con éxito" };
      }),
      catchError((error: HttpErrorResponse) => {
        // Maneja el error según el código de estado
        if (error.status === 422 || error.status === 401) {
          const { message } = error.error;
          this.appComponent.alert({
            severity: "error",
            summary: "Ups",
            detail: message
          });
          return of({ isError: true, message });
        } else {
          this.appComponent.alert({
            severity: "error",
            summary: "Ups",
            detail: "No se pudo completar la operación, por favor intenta nuevamente"
          });
        }
        return of({ isError: true, message: null });
      })
    );
  }


  unauthorized(error: HttpErrorResponse): void {
    if (error.status !== 401) return;
    if (this.singletonService.shared.unauthorized) {
      this.singletonService.shared.unauthorized += 1;
    } else {
      this.singletonService.shared.unauthorized = 1;
    }
    if (this.singletonService.shared.unauthorized === 3) {
      this.logout().subscribe(() => { });
    }
  }

  logout() {
    return this.http.post(
      `${environment.backend}api/auth/logout`,
      {},
      { headers: this.headersService.getJsonHeaders() }
    ).pipe(
      map(() => {
        this.encryption.removeData(["id", "document", "token", "role", "fullname", "status"]);
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigate(['/']);
      }),
      catchError((error) => {
        this.encryption.removeData(["id", "document", "token", "role", "fullname", "status"]);
        localStorage.clear();
        sessionStorage.clear();
        this.router.navigate(['/']);
        return throwError(error);
      })
    );
  }
}
