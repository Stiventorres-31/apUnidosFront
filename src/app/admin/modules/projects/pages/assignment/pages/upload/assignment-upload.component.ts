import { Component } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ActivatedRoute, Router } from '@angular/router';
import { AppComponent } from '../../../../../../../app.component';
import { BreadCrumbService } from '../../../../../../../shared/services/breadcrumbs/bread-crumb.service';
import { EncryptionService } from '../../../../../../../shared/services/encryption/encryption.service';
import { ProjectService } from '../../../../../../../shared/services/project/project.service';
import { AssignmentService } from '../../services/assignment.service';

@Component({
  selector: 'app-assignment-upload',
  standalone: true,
  imports: [AngularSvgIconModule],
  templateUrl: './assignment-upload.component.html',
  styles: `
  `
})
export class AssignmentsUploadComponent {
  public isLoading: boolean = true;
  public fileName: string | null = null;
  public errorMessage: string | null = null;
  public file: File | null = null;
  public id: string = "";

  constructor(private AppComponent: AppComponent,
    private BreadCrumbService: BreadCrumbService,
    private parametros: ActivatedRoute,
    private EncryptionService: EncryptionService,
    private ProjectService: ProjectService,
    private Router: Router,
    private AssignmentService: AssignmentService) { }

  ngOnInit() {

    this.parametros.params.subscribe((params) => {
      if (params['id']) {
        const id = this.EncryptionService.decrypt(params['id']);

        if (!id) {
          this.Router.navigate(['/admin/workshops']);
          return;
        }

        this.ProjectService.search(id).subscribe((rs) => {
          if (rs) {
            this.id = `${rs.id}`;
            this.isLoading = false;
            const breadcrumbs = [
              // { label: 'Dashboard', url: '/admin/dashboard' },
              { label: 'Talleres', url: '/admin/workshops' },
              { label: 'Asignaciones CSV', url: '/admin/workshops/assignments/' + this.EncryptionService.encrypt(`${rs.codigo_proyecto}`) },
              { label: rs.codigo_proyecto + ' - ' + rs.ciudad_municipio_proyecto + ', ' + rs.departamento_proyecto, url: '/admin/workshops/assignments/' },
            ];
            this.BreadCrumbService.setBreadcrumbs(breadcrumbs);

          } else {
            this.AppComponent.alert({
              summary: "Taller no encontrado",
              detail: "El taller solicitado no existe o ha sido eliminado.",
              severity: "error"
            });
            this.Router.navigate(['/admin/workshops']);
            return;
          }

        });
      } else {
        this.Router.navigate(['/admin/workshops']);
        return;


      }
    });


  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
        this.fileName = file.name;
        this.errorMessage = null;
        this.file = file;
      } else {
        this.fileName = null;
        this.errorMessage = 'Solo se permiten archivos CSV';
        this.file = null;
      }
      if (this.errorMessage) {
        this.AppComponent.alert({ summary: "Error al cargar archivo", detail: this.errorMessage, severity: 'error' });
      } else {
        this.AppComponent.alert({ summary: "Archivo cargado exitosamente", detail: this.fileName ?? '', severity: 'success' });
      }

    }
  }

  uploadFile() {
    if (!this.file) return;
    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('proyecto_id', this.id);

    this.AssignmentService.storeCSV(formData).subscribe((rs) => {
      if (!rs.isError) {
        this.AppComponent.alert({ summary: "Operación exitosa", detail: rs.message, severity: 'success' });
        this.Router.navigate(['/admin/workshops']);
      } else {
        this.AppComponent.alert({ summary: "Operación fallida", detail: rs.message, severity: 'error' });
      }

    })

  }

  downloadFile() {
    this.AssignmentService.downloadCSVTemplate();
  }

  ngOnDestroy(): void {
    this.BreadCrumbService.setBreadcrumbs([]);

  }
}
