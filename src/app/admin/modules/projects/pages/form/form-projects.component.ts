import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AppComponent } from '../../../../../app.component';
import { ProjectService } from '../../../../../shared/services/project/project.service';
import { EncryptionService } from '../../../../../shared/services/encryption/encryption.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadCrumbService } from '../../../../../shared/services/breadcrumbs/bread-crumb.service';
import { LabelsService } from '../../../../../shared/services/labels/labels.service';
import { ValidationsService } from '../../../../../shared/services/validations/validations.service';

@Component({
  selector: 'app-form-projects',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, MatProgressSpinnerModule, AngularSvgIconModule],
  templateUrl: './form-projects.component.html',
  styles: ''
})
export class FormProjectsComponent {
  public form: FormGroup;
  public inputs: { [key: string]: boolean } = {};
  public showPassword: boolean = false;
  public isLoading: boolean = true;
  public isSending: boolean = false;
  public isUpdate: boolean = false;

  constructor(
    private fb: FormBuilder,
    private AppComponent: AppComponent,
    private ProjectService: ProjectService,
    private EncryptionService: EncryptionService,
    private router: Router,
    private parametros: ActivatedRoute,
    private BreadCrumbService: BreadCrumbService,
    private labels: LabelsService,
    private ValidationsService: ValidationsService
  ) {
    this.form = this.fb.group({
      id: [''],
      codigo_proyecto: ['', Validators.required],
      departamento_proyecto: ['', Validators.required],
      ciudad_municipio_proyecto: ['', Validators.required],
      direccion_proyecto: ['', Validators.required],
      fecha_inicio_proyecto: ['', Validators.required],
      fecha_final_proyecto: ['', Validators.required],
    });
    this.inputs = this.labels.inputs_data;
  }

  ngOnInit() {
    this.parametros.params.subscribe((params) => {
      if (params['id']) {
        const id = this.EncryptionService.decrypt(params['id']);
        if (!id) {
          this.router.navigate(['/admin/projects']);
          return;
        }
        this.isUpdate = true;
        this.ProjectService.search(id).subscribe((rs) => {
          if (rs) {
            this.form.patchValue(rs);
            this.isLoading = false;

            const breadcrumbs = [
              // { label: 'Dashboard', url: '/admin/dashboard' },
              { label: 'Proyecto', url: '/admin/projects/' },
              { label: 'Actualizar', url: '/admin/projects/update/' + this.EncryptionService.encrypt(`${rs.codigo_proyecto}`) },
              { label: rs.codigo_proyecto, url: '/admin/projects/update/' },

            ];
            this.reset();
            this.BreadCrumbService.setBreadcrumbs(breadcrumbs);

          } else {
            this.router.navigate(['/admin/projects']);
            return;
          }

        });
      } else {
        this.isLoading = false;
        const breadcrumbs = [
          // { label: 'Dashboard', url: '/admin/dashboard' },
          { label: 'Proyectos', url: '/admin/projects/' },
          { label: 'Agregar', url: '/admin/projects/new/' },
        ];
        this.BreadCrumbService.setBreadcrumbs(breadcrumbs);
        this.reset();
      }
    });


  }

  store() {
    this.isSending = true;
    if (!this.form.valid) {
      this.AppComponent.alert({
        summary: "Formulario invalido",
        detail: "Por favor, Asegurese que la información es valida.",
        severity: 'warn'
      })
      this.isSending = false;
      return;
    }
    const form = this.form.value;

    this.ProjectService.store(form).subscribe((rs) => {
      if (rs.isError) {
        this.isSending = false;
        this.AppComponent.alert({ summary: "Operación fallida", detail: rs.message, severity: 'error' });
      } else {
        this.router.navigate(['/admin/projects']);
        this.AppComponent.alert({ summary: "Operación exitosa", detail: rs.message, severity: 'success' });
      }
    });

  }

  update() {
    this.isSending = true;
    if (!this.form.valid) {
      this.AppComponent.alert({
        summary: "Formulario invalido",
        detail: "Por favor, Asegurese que la información del proyecto es valida.",
        severity: 'warn'
      })
      this.isSending = false;
      return;
    }
    const form = this.form.value;

    this.ProjectService.update(form).subscribe((rs) => {

      if (rs.isError) {
        this.isSending = false;
        this.AppComponent.alert({ summary: "Operación fallida", detail: rs.message, severity: 'error' });
      } else {
        this.router.navigate(['/admin/projects']);
        this.AppComponent.alert({
          summary: "Operación exitosa",
          detail: rs.message,
          severity: 'success'
        });
      }
    });

  }

  numeric(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = this.ValidationsService.numeric(input.value);

  }

  ngOnDestroy(): void {
    this.BreadCrumbService.setBreadcrumbs([]);
  }

  labelFocus(campo: string) {
    this.labels.labelFloatFocus(campo)
  }

  labelBlur(campo: string, event: Event) {
    this.labels.labelFloatBlur(campo, event);
  }

  reset() {
    Object.keys(this.form.controls).forEach(key => {
      this.inputs[key] = !!this.form.get(key)?.value;
    });
  }
}
