import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { EncryptionService } from '../encryption/encryption.service';
import { AppComponent } from '../../../app.component';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { LoginService } from '../../../auth/services/login.service';
import { Router } from '@angular/router';
import { SingletonService } from '../singleton/singleton.service';
import { HeadersService } from '../utilities/headers.service';
import { ProjectResponse, projects, ProjectSelectsResponse, projectsForm, ProjectsResponse, ProjectsResponse_, selectProjects } from '../../models/projects/projects.interface';
import { pagination_interface } from '../../models/pagination/pagination.interface';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(
    private http: HttpClient,
    private encryption: EncryptionService,
    private LoginService: LoginService,
    private router: Router,
    private AppComponent: AppComponent,
    private singletonService: SingletonService,
    private headersService: HeadersService
  ) { }

  // index(): Observable<projects[]> {
  //   return this.http.get<ProjectsResponse>(environment.backend + `api/proyecto`, { headers: this.headersService.getJsonHeaders() })
  //     .pipe(
  //       map((rs) => {
  //         return rs.result.proyectos.map((project, index) => ({
  //           ...project,
  //           index,
  //         }));
  //       }), catchError((error: HttpErrorResponse) => {
  //         this.LoginService.unauthorized(error)
  //         return [];
  //       })
  //     )

  // }

  projects(): Observable<selectProjects[]> {
    return this.http.get<ProjectSelectsResponse>(environment.backend + `api/proyecto/select`, { headers: this.headersService.getJsonHeaders() })
      .pipe(
        map((rs) => {
          return rs.result.map((project, index) => ({
            ...project
          }));
        }), catchError((error: HttpErrorResponse) => {
          this.LoginService.unauthorized(error)
          return [];
        })
      )

  }

  index(link: string = ""): Observable<ProjectsResponse> {
    return this.http.get<ProjectsResponse>(link, { headers: this.headersService.getJsonHeaders() })
      .pipe(
        map((response: ProjectsResponse) => {
          return response;

        }),
        catchError((error) => {
          if (error.status == 401) {
            this.LoginService.unauthorized(error)
          }
          return of({} as ProjectsResponse);
        })
      );
  }

  searchCode(id: string): Observable<ProjectsResponse> {
    return this.http.get<ProjectsResponse>(environment.backend + `api/proyecto/similitud/${id}`, {
      headers: this.headersService.getJsonHeaders()
    })
      .pipe(
        map((response: ProjectsResponse) => {
          return response;

        }), catchError((error: HttpErrorResponse) => {
          this.LoginService.unauthorized(error)
          return of({} as ProjectsResponse);
        })
      )

  }

  search(id: string): Observable<projects | null> {
    return this.http.get<ProjectResponse>(environment.backend + `api/proyecto/${id}`, {
      headers: this.headersService.getJsonHeaders()
    })
      .pipe(
        map((rs) => {
          return rs.result.proyecto;

        }), catchError((error: HttpErrorResponse) => {
          this.LoginService.unauthorized(error)
          return of(null);
        })
      )

  }

  budget(id: string): Observable<projects | null> {
    return this.http.get<ProjectResponse>(environment.backend + `api/proyecto/presupuesto/${id}`, {
      headers: this.headersService.getJsonHeaders()
    })
      .pipe(
        map((rs) => {
          return rs.result.proyecto;

        }), catchError((error: HttpErrorResponse) => {
          this.LoginService.unauthorized(error)
          return of(null);
        })
      )

  }

  assignment(id: string): Observable<projects | null> {
    return this.http.get<ProjectResponse>(environment.backend + `api/proyecto/asignacion/${id}`, {
      headers: this.headersService.getJsonHeaders()
    })
      .pipe(
        map((rs) => {
          return rs.result.proyecto;

        }), catchError((error: HttpErrorResponse) => {
          this.LoginService.unauthorized(error)
          return of(null);
        })
      )

  }

  report(id: string): Observable<Blob> {
    return this.http.get(environment.backend + 'api/proyecto/report/' + `${id}`, {
      headers: this.headersService.getFileHeaders(),
      responseType: 'blob'  // Esto es importante para recibir el archivo como un blob
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        this.LoginService.unauthorized(error);
        return of(new Blob()); // Devolver un blob vacío en caso de error
      })
    );

  }


  store(project: projectsForm): Observable<{ isError: boolean, message: string }> {
    this.AppComponent.alert({ summary: "Operación en proceso", detail: " Por favor, espere mientras se completa la operación.", severity: "warn" })
    return this.http.post<ProjectResponse>(environment.backend + `api/proyecto`, { ...project }, { headers: this.headersService.getJsonHeaders() })
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

  update(project: projectsForm): Observable<{ isError: boolean, message: string }> {
    this.AppComponent.alert({ summary: "Operación en proceso", detail: " Por favor, espere mientras se completa la operación.", severity: "warn" })
    return this.http.put<ProjectResponse>(environment.backend + `api/proyecto/${project?.codigo_proyecto}`, { ...project }, { headers: this.headersService.getJsonHeaders() })
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
    this.AppComponent.alert({ summary: "Operación en proceso", detail: " Por favor, espere mientras se completa la operación.", severity: "warn" })
    return this.http.delete<ProjectResponse>(environment.backend + `api/proyecto`, {
      body: { codigo_proyecto: id },
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
