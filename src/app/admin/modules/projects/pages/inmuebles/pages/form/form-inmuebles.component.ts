import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { LabelsService } from '../../../../../../../shared/services/labels/labels.service';
import { AppComponent } from '../../../../../../../app.component';
import { InmueblesService } from '../../services/inmuebles.service';
import { EncryptionService } from '../../../../../../../shared/services/encryption/encryption.service';
import { BreadCrumbService } from '../../../../../../../shared/services/breadcrumbs/bread-crumb.service';
import { ValidationsService } from '../../../../../../../shared/services/validations/validations.service';
import { ProjectService } from '../../../../../../../shared/services/project/project.service';
import { TipoInmueblesService } from '../../services/tipo-inmuebles.service';
import { projects, selectProjects } from '../../../../../../../shared/models/projects/projects.interface';
import { tipo_inmueble } from '../../models/inmuebles.interface';

@Component({
  selector: 'app-form-inmuebles',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, MatProgressSpinnerModule, AngularSvgIconModule],
  templateUrl: './form-inmuebles.component.html',
  styles: ''
})
export class FormInmueblesComponent {
  public form: FormGroup;
  public inputs: { [key: string]: boolean } = {};
  public showPassword: boolean = false;
  public isLoading: boolean = true;
  public isSending: boolean = false;
  public isUpdate: boolean = false;
  public projectList: selectProjects[] = [];
  public tipoInmueblesList: tipo_inmueble[] = [];

  constructor(
    private fb: FormBuilder,
    private AppComponent: AppComponent,
    private InmueblesService: InmueblesService,
    private ProjectService: ProjectService,
    private TipoInmueblesService: TipoInmueblesService,
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
      cantidad_inmueble: [1, Validators.required],
      tipo_inmueble: ['', Validators.required],
    });
    this.inputs = this.labels.inputs_data;
  }

  ngOnInit() {
    this.index();
    this.parametros.params.subscribe((params) => {
      if (params['id']) {
        const id = this.EncryptionService.decrypt(params['id']);

        if (!id || isNaN(parseInt(id))) {
          this.router.navigate(['/admin/property']);
          return;
        }
        this.isUpdate = true;
        this.InmueblesService.search(id).subscribe((rs) => {
          if (rs) {
            this.form.patchValue(rs);
            this.isLoading = false;

            const breadcrumbs = [
              // { label: 'Dashboard', url: '/admin/dashboard' },
              { label: 'Inmuebles', url: '/admin/property/' },
              { label: 'Actualizar', url: '/admin/property/update/' + this.EncryptionService.encrypt(`${rs.id}`) },
              { label: rs.tipo_inmueble.nombre_tipo_inmueble, url: '/admin/property/update/' },

            ];
            this.reset();
            this.BreadCrumbService.setBreadcrumbs(breadcrumbs);


          } else {
            this.router.navigate(['/admin/property']);
            return;
          }

        });
      } else {
        this.isLoading = false;
        const breadcrumbs = [
          // { label: 'Dashboard', url: '/admin/dashboard' },
          { label: 'Inmuebles', url: '/admin/property/' },
          { label: 'Agregar', url: '/admin/property/new/' },
        ];
        this.BreadCrumbService.setBreadcrumbs(breadcrumbs);
        this.reset();
      }
    });


  }

  index() {
    this.ProjectService.projects().subscribe(
      (rs) => {
        this.projectList = rs;
      });

    this.TipoInmueblesService.index().subscribe(
      (rs) => {
        this.tipoInmueblesList = rs;
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

    this.InmueblesService.store(form).subscribe((rs) => {
      if (rs.isError) {
        this.isSending = false;
        this.AppComponent.alert({ summary: "Operación fallida", detail: rs.message, severity: 'error' });
      } else {
        this.router.navigate(['/admin/property']);
        this.AppComponent.alert({ summary: "Operación exitosa", detail: rs.message, severity: 'success' });
      }
    });

  }

  update() {
    this.isSending = true;
    if (!this.form.valid) {
      this.AppComponent.alert({
        summary: "Formulario invalido",
        detail: "Por favor, Asegurese que la información del inmueble es valida.",
        severity: 'warn'
      })
      this.isSending = false;
      return;
    }
    const form = this.form.value;

    this.InmueblesService.update(form).subscribe((rs) => {

      if (rs.isError) {
        this.isSending = false;
        this.AppComponent.alert({ summary: "Operación fallida", detail: rs.message, severity: 'error' });
      } else {
        this.router.navigate(['/admin/property']);
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
