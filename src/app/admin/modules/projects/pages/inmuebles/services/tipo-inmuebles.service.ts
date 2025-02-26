import { Injectable } from '@angular/core';
import { HeadersService } from '../../../../../../shared/services/utilities/headers.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EncryptionService } from '../../../../../../shared/services/encryption/encryption.service';
import { LoginService } from '../../../../../../auth/services/login.service';
import { Router } from '@angular/router';
import { AppComponent } from '../../../../../../app.component';
import { SingletonService } from '../../../../../../shared/services/singleton/singleton.service';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../../../../../environments/environment';
import { tipo_inmueble, tipo_inmueble_form, TipoInmuebleResponse, TipoInmueblesResponse } from '../models/inmuebles.interface';

@Injectable({
  providedIn: 'root'
})
export class TipoInmueblesService {

  constructor(
    private http: HttpClient,
    private encryption: EncryptionService,
    private LoginService: LoginService,
    private router: Router,
    private appComponent: AppComponent,
    private singletonService: SingletonService,
    private headersService: HeadersService) { }


  index(): Observable<tipo_inmueble[]> {
    return this.http
      .get<TipoInmueblesResponse>(environment.backend + `api/tipo_inmueble`, {
        headers: this.headersService.getJsonHeaders(),
      })
      .pipe(
        map((rs) => {
          return rs.result.tipo_inmuebles.map((type, index) => ({
            ...type,
            index,
          }));
        }),
        catchError((error: HttpErrorResponse) => {
          this.LoginService.unauthorized(error);
          return [];
        })
      );
  }

  search(id: string): Observable<tipo_inmueble | null> {
    return this.http.get<TipoInmuebleResponse>(environment.backend + `api/tipo_inmueble/${id}`, {
      headers: this.headersService.getJsonHeaders()
    })
      .pipe(
        map((rs) => {
          return rs.result.tipo_inmueble;

        }), catchError((error: HttpErrorResponse) => {
          this.LoginService.unauthorized(error)
          return of(null);
        })
      )

  }


  store(tipo_inmueble: tipo_inmueble_form): Observable<{ isError: boolean, message: string }> {
    this.appComponent.alert({ summary: "Operación en proceso", detail: " Por favor, espere mientras se completa la operación.", severity: "warn" })
    return this.http.post<TipoInmuebleResponse>(environment.backend + `api/tipo_inmueble`, { ...tipo_inmueble }, { headers: this.headersService.getJsonHeaders() })
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

  update(tipo_inmueble: tipo_inmueble_form): Observable<{ isError: boolean, message: string }> {
    this.appComponent.alert({ summary: "Operación en proceso", detail: " Por favor, espere mientras se completa la operación.", severity: "warn" })
    return this.http.put<TipoInmuebleResponse>(environment.backend + `api/tipo_inmueble/${tipo_inmueble?.id}`, { ...tipo_inmueble }, { headers: this.headersService.getJsonHeaders() })
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

  delete(id: number): Observable<{ isError: boolean, message: string }> {
    this.appComponent.alert({ summary: "Operación en proceso", detail: " Por favor, espere mientras se completa la operación.", severity: "warn" })
    return this.http.delete<TipoInmuebleResponse>(environment.backend + `api/tipo_inmueble`, {
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
