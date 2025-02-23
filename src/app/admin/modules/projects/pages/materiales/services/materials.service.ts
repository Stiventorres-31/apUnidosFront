import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EncryptionService } from '../../../../../../shared/services/encryption/encryption.service';
import { LoginService } from '../../../../../../auth/services/login.service';
import { Router } from '@angular/router';
import { AppComponent } from '../../../../../../app.component';
import { SingletonService } from '../../../../../../shared/services/singleton/singleton.service';
import { HeadersService } from '../../../../../../shared/services/utilities/headers.service';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../../../../../environments/environment';
import { form_inventario, form_lot, form_materials, InventarioResponse, MaterialResponse, materials, MaterialsResponse } from '../models/materials.interface';
import { invetario } from '../../../../../../shared/models/inventory/inventory.interface';
import { ApiResponse } from '../../../../../../shared/models/users/users.interface';


@Injectable({
  providedIn: 'root'
})
export class MaterialsService {

  constructor(
    private http: HttpClient,
    private encryption: EncryptionService,
    private LoginService: LoginService,
    private router: Router,
    private appComponent: AppComponent,
    private singletonService: SingletonService,
    private headersService: HeadersService) { }


  index(): Observable<materials[]> {
    return this.http
      .get<MaterialsResponse>(environment.backend + `api/materiale`, {
        headers: this.headersService.getJsonHeaders(),
      })
      .pipe(
        map((rs) => {
          return rs.result.materiales.map((material: materials, index: number) => ({
            ...material,
            index,
          }));
        }),
        catchError((error: HttpErrorResponse) => {
          this.LoginService.unauthorized(error);
          return [];
        })
      );
  }

  search(id: string): Observable<materials | null> {
    return this.http.get<MaterialResponse>(environment.backend + `api/materiale/${id}`, {
      headers: this.headersService.getJsonHeaders()
    })
      .pipe(
        map((rs) => {
          return rs.result.materiale;

        }), catchError((error: HttpErrorResponse) => {
          this.LoginService.unauthorized(error)
          return of(null);
        })
      )

  }

  searchLot(id: string): Observable<invetario | null> {
    return this.http.get<InventarioResponse>(environment.backend + `api/inventario/${id}`, {
      headers: this.headersService.getJsonHeaders()
    })
      .pipe(
        map((rs) => {
          return rs.result.inventario;

        }), catchError((error: HttpErrorResponse) => {
          this.LoginService.unauthorized(error)
          return of(null);
        })
      )

  }




  updateLote(materials: materials): Observable<{ isError: boolean, message: string }> {
    this.appComponent.alert({ summary: "Operación en proceso", detail: " Por favor, espere mientras se completa la operación.", severity: "warn" })
    return this.http.put<ApiResponse<{}>>(environment.backend + `api/inventario/${materials.id}`, { ...materials }, { headers: this.headersService.getJsonHeaders() })
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

  store(materials: form_materials): Observable<{ isError: boolean, message: string }> {
    this.appComponent.alert({ summary: "Operación en proceso", detail: " Por favor, espere mientras se completa la operación.", severity: "warn" })
    return this.http.post<MaterialResponse>(environment.backend + `api/materiale`, { ...materials }, { headers: this.headersService.getJsonHeaders() })
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

  storeLot(materials: form_lot): Observable<{ isError: boolean, message: string }> {
    this.appComponent.alert({ summary: "Operación en proceso", detail: " Por favor, espere mientras se completa la operación.", severity: "warn" })
    return this.http.post<MaterialResponse>(environment.backend + `api/inventario`, { ...materials }, { headers: this.headersService.getJsonHeaders() })
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

  update(materials: form_materials): Observable<{ isError: boolean, message: string }> {
    this.appComponent.alert({ summary: "Operación en proceso", detail: " Por favor, espere mientras se completa la operación.", severity: "warn" })
    return this.http.put<MaterialResponse>(environment.backend + `api/materiale/${materials?.referencia_material}`, { ...materials }, { headers: this.headersService.getJsonHeaders() })
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

  delete(id: string): Observable<{ isError: boolean, message: string }> {
    this.appComponent.alert({ summary: "Operación en proceso", detail: " Por favor, espere mientras se completa la operación.", severity: "warn" })
    return this.http.delete<MaterialResponse>(environment.backend + `api/materiale/`, {
      body: { referencia_material: id },
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

  deleteLot(id: string): Observable<{ isError: boolean, message: string }> {
    this.appComponent.alert({ summary: "Operación en proceso", detail: " Por favor, espere mientras se completa la operación.", severity: "warn" })
    return this.http.delete<ApiResponse<{}>>(environment.backend + `api/inventario/`, {
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
