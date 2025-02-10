import { Component } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AppComponent } from '../../../../../../app.component';
import { BreadCrumbService } from '../../../../../../shared/services/breadcrumbs/bread-crumb.service';
import { BudgetsService } from '../services/budgets.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-budgets-upload',
  standalone: true,
  imports: [AngularSvgIconModule],
  templateUrl: './budgets-upload.component.html',
  styles: `
  `
})
export class BudgetsUploadComponent {
  fileName: string | null = null;
  errorMessage: string | null = null;
  file: File | null = null;

  constructor(private AppComponent: AppComponent,
    private BreadCrumbService: BreadCrumbService,
    private Router: Router,
    private BudgetsService: BudgetsService) { }

  ngOnInit() {
    const breadcrumbs = [
      { label: 'Dashboard', url: '/admin/dashboard' },
      { label: 'Proyectos', url: '/admin/projects' },
      { label: 'Presupuestos CSV', url: '/admin/projects/budgets' },
    ];
    this.BreadCrumbService.setBreadcrumbs(breadcrumbs);
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

    this.BudgetsService.storeCSV(formData).subscribe((rs) => {
      if (!rs.isError) {
        this.AppComponent.alert({ summary: "Operación exitosa", detail: rs.message, severity: 'success' });
        this.Router.navigate(['/admin/projects']);
      } else {
        this.AppComponent.alert({ summary: "Operación fallida", detail: rs.message, severity: 'error' });
      }

    })

  }

  ngOnDestroy(): void {
    this.BreadCrumbService.setBreadcrumbs([]);

  }
}
