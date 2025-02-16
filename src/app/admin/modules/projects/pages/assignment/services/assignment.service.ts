import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EncryptionService } from '../../../../../../shared/services/encryption/encryption.service';
import { LoginService } from '../../../../../../auth/services/login.service';
import { Router } from '@angular/router';
import { AppComponent } from '../../../../../../app.component';
import { SingletonService } from '../../../../../../shared/services/singleton/singleton.service';
import { HeadersService } from '../../../../../../shared/services/utilities/headers.service';
import { catchError, map, Observable, of } from 'rxjs';
import { ApiResponse } from '../../../../../../shared/models/users/users.interface';
import { environment } from '../../../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {

  constructor(
    private http: HttpClient,
    private encryption: EncryptionService,
    private LoginService: LoginService,
    private router: Router,
    private appComponent: AppComponent,
    private singletonService: SingletonService,
    private headersService: HeadersService
  ) { }


  storeCSV(assignment: FormData): Observable<{ isError: boolean, message: string }> {
    this.appComponent.alert({ summary: "Operación en proceso", detail: " Por favor, espere mientras se completa la operación.", severity: "warn" })
    return this.http.post<ApiResponse<{}>>(environment.backend + `api/asignacion/file`, assignment, { headers: this.headersService.getFileHeaders() })
      .pipe(
        map((rs: { isError: boolean, message: string }) => {
          return rs;
        }), catchError((error: HttpErrorResponse) => {
          console.error(error)
          this.LoginService.unauthorized(error)
          if (error.status == 422 || error.status == 400) {
            return of({ isError: true, message: error.error.message });
          }

          return of({ isError: true, message: "No se puedo realizar la operación, por favor intenta mas tarde" });
        })
      )

  }

  // store(materials: form_assignment): Observable<{ isError: boolean, message: string }> {
  //   this.appComponent.alert({ summary: "Operación en proceso", detail: " Por favor, espere mientras se completa la operación.", severity: "warn" })
  //   return this.http.post<ApiResponse<{}>>(environment.backend + `api/presupuesto`, { ...materials }, { headers: this.headersService.getJsonHeaders() })
  //     .pipe(
  //       map((rs: { isError: boolean, message: string }) => {
  //         return rs;
  //       }), catchError((error: HttpErrorResponse) => {
  //         console.error(error)
  //         this.LoginService.unauthorized(error)
  //         if (error.status == 422 || error.status == 400 || error.status == 404) {
  //           return of({ isError: true, message: error.error.message });
  //         }

  //         return of({ isError: true, message: "No se puedo realizar la operación, por favor intenta mas tarde" });
  //       })
  //     )

  // }

  downloadCSVTemplate(): void {
    const filePath = 'assets/template/template-asignacion-masivo.csv';
    const link = document.createElement('a');
    link.href = filePath;
    link.download = 'template-asignacion-masivo.csv';
    link.click();
  }

  // update(materials: form_update_assignment): Observable<{ isError: boolean, message: string }> {
  //   this.appComponent.alert({ summary: "Operación en proceso", detail: " Por favor, espere mientras se completa la operación.", severity: "warn" })
  //   return this.http.put<ApiResponse<{}>>(environment.backend + `api/presupuesto`, { ...materials }, { headers: this.headersService.getJsonHeaders() })
  //     .pipe(
  //       map((rs: { isError: boolean, message: string }) => {
  //         return rs;
  //       }), catchError((error: HttpErrorResponse) => {
  //         console.error(error)
  //         this.LoginService.unauthorized(error)
  //         if (error.status == 422) {
  //           return of({ isError: true, message: error.error.message });
  //         }

  //         return of({ isError: true, message: "No se puedo realizar la operación, por favor intenta mas tarde" });
  //       })
  //     )

  // }

  delete(id: string, ref: string, cod: string): Observable<{ isError: boolean, message: string }> {
    this.appComponent.alert({ summary: "Operación en proceso", detail: " Por favor, espere mientras se completa la operación.", severity: "warn" })
    return this.http.delete<ApiResponse<{}>>(environment.backend + `api/presupuesto`, {
      body: {
        inmueble_id: id,
        referencia_material: ref,
        codigo_proyecto: cod,
      },
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
