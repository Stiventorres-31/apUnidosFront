import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from '../../../../../../app.component';
import { EncryptionService } from '../../../../../../shared/services/encryption/encryption.service';
import { SingletonService } from '../../../../../../shared/services/singleton/singleton.service';
import { HeadersService } from '../../../../../../shared/services/utilities/headers.service';
import { LoginService } from '../../../../../../auth/services/login.service';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../../../../../environments/environment';
import { ApiResponse } from '../../../../../../shared/models/users/users.interface';

@Injectable({
  providedIn: 'root'
})
export class BudgetsService {

  constructor(
    private http: HttpClient,
    private encryption: EncryptionService,
    private LoginService: LoginService,
    private router: Router,
    private appComponent: AppComponent,
    private singletonService: SingletonService,
    private headersService: HeadersService
  ) { }


  storeCSV(budget: FormData): Observable<{ isError: boolean, message: string }> {
    this.appComponent.alert({ summary: "Operación en proceso", detail: " Por favor, espere mientras se completa la operación.", severity: "warn" })
    return this.http.post<ApiResponse<{}>>(environment.backend + `api/presupuesto/file`, budget, { headers: this.headersService.getFileHeaders() })
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
}


