import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, catchError, of } from 'rxjs';
import { environment } from '../../../../../../../environments/environment';
import { AppComponent } from '../../../../../../app.component';
import { EncryptionService } from '../../../../../../shared/services/encryption/encryption.service';
import { SingletonService } from '../../../../../../shared/services/singleton/singleton.service';
import { HeadersService } from '../../../../../../shared/services/utilities/headers.service';
import { InmueblesResponse, inmueble, InmuebleResponse } from '../models/inmuebles.interface';
import { LoginService } from '../../../../../../auth/services/login.service';
import { ApiResponse } from '../../../../../../shared/models/users/users.interface';

@Injectable({
  providedIn: 'root'
})
export class InmueblesService {

  constructor(
    private http: HttpClient,
    private encryption: EncryptionService,
    private LoginService: LoginService,
    private router: Router,
    private appComponent: AppComponent,
    private singletonService: SingletonService,
    private headersService: HeadersService) { }


  index(): Observable<inmueble[]> {
    return this.http
      .get<InmueblesResponse>(environment.backend + `api/inmueble`, {
        headers: this.headersService.getJsonHeaders(),
      })
      .pipe(
        map((rs) => {
          return rs.result.inmuebles.map((inmu, index) => ({
            ...inmu,
            index,
          }));
        }),
        catchError((error: HttpErrorResponse) => {
          this.LoginService.unauthorized(error);
          return [];
        })
      );
  }

  search(id: string): Observable<inmueble | null> {
    return this.http.get<InmuebleResponse>(environment.backend + `api/inmueble/${id}`, {
      headers: this.headersService.getJsonHeaders()
    })
      .pipe(
        map((rs) => {
          return rs.result.inmueble;

        }), catchError((error: HttpErrorResponse) => {
          this.LoginService.unauthorized(error)
          return of(null);
        })
      )

  }

  report(id: string, type: boolean = true): Observable<Blob> {
    let url = 'api/inmueble/report/';
    if (!type) {
      url += `asignacion/`;
    }
    return this.http.get(environment.backend + url + `${id}`, {
      headers: this.headersService.getFileHeaders(),
      responseType: 'blob'  // Esto es importante para recibir el archivo como un blob
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        this.LoginService.unauthorized(error);
        return of(new Blob()); // Devolver un blob vacío en caso de error
      })
    );

  }




  store(tipo_inmueble: inmueble): Observable<{ isError: boolean, message: string }> {
    this.appComponent.alert({ summary: "Operación en proceso", detail: " Por favor, espere mientras se completa la operación.", severity: "warn" })
    return this.http.post<InmuebleResponse>(environment.backend + `api/inmueble`, { ...tipo_inmueble }, { headers: this.headersService.getJsonHeaders() })
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

  update(inmueble: inmueble): Observable<{ isError: boolean, message: string }> {
    this.appComponent.alert({ summary: "Operación en proceso", detail: " Por favor, espere mientras se completa la operación.", severity: "warn" })
    return this.http.put<InmuebleResponse>(environment.backend + `api/inmueble/${inmueble?.id}`, { ...inmueble }, { headers: this.headersService.getJsonHeaders() })
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

  delete(id: number): Observable<{ isError: boolean, message: string }> {
    this.appComponent.alert({ summary: "Operación en proceso", detail: " Por favor, espere mientras se completa la operación.", severity: "warn" })
    return this.http.delete<InmuebleResponse>(environment.backend + `api/inmueble`, {
      body: { id: id },
      headers: this.headersService.getJsonHeaders()
    })
      .pipe(
        map((rs: { isError: boolean, message: string }) => {

          return rs;

        }), catchError((error: HttpErrorResponse) => {
          this.LoginService.unauthorized(error)
          if (error.status == 422) {
            return of({ isError: true, message: error.error.message });
          }

          return of({ isError: true, message: "No se puedo realizar la operación, por favor intenta mas tarde" });
        })
      )
  }
}
