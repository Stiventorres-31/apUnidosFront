import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import { NgClass } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AppComponent } from '../../../../../../app.component';
import { TipoInmueblesService } from '../../services/tipo-inmuebles.service';
import { EncryptionService } from '../../../../../../shared/services/encryption/encryption.service';
import { BreadCrumbService } from '../../../../../../shared/services/breadcrumbs/bread-crumb.service';
import { LabelsService } from '../../../../../../shared/services/labels/labels.service';
import { ValidationsService } from '../../../../../../shared/services/validations/validations.service';


@Component({
  selector: 'app-form-tipo-inmueble',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, MatProgressSpinnerModule, AngularSvgIconModule],
  templateUrl: './form-tipo-inmueble.component.html',
  styles: ``
})
export class FormTipoInmuebleComponent {
  public form: FormGroup;
  public inputs: { [key: string]: boolean } = {};
  public showPassword: boolean = false;
  public isLoading: boolean = true;
  public isSending: boolean = false;
  public isUpdate: boolean = false;

  constructor(
    private fb: FormBuilder,
    private AppComponent: AppComponent,
    private tipoInmueblesService: TipoInmueblesService,
    private EncryptionService: EncryptionService,
    private router: Router,
    private parametros: ActivatedRoute,
    private BreadCrumbService: BreadCrumbService,
    private labels: LabelsService,
    private ValidationsService: ValidationsService
  ) {
    this.form = this.fb.group({
      id: [''],
      nombre_tipo_inmueble: ['', Validators.required],
    });
    this.inputs = this.labels.inputs_data;
  }

  ngOnInit() {
    this.parametros.params.subscribe((params) => {
      if (params['id']) {
        const id = this.EncryptionService.decrypt(params['id']);
        console.log(id);
        if (!id || isNaN(parseInt(id))) {
          this.router.navigate(['/admin/type-property']);
          return;
        }
        this.isUpdate = true;
        this.tipoInmueblesService.search(id).subscribe((rs) => {
          if (rs) {
            this.form.patchValue(rs);
            this.isLoading = false;

            this.form.get("password")?.setValidators([]);
            this.form.get("password_confirmation")?.setValidators([]);


            this.form.get("password")?.updateValueAndValidity();
            this.form.get("password_confirmation")?.updateValueAndValidity();

            const breadcrumbs = [
              { label: 'Dashboard', url: '/admin/dashboard' },
              { label: 'Tipo inmueble', url: '/admin/type-property/' },
              { label: 'Actualizar', url: '/admin/type-property/update/' + this.EncryptionService.encrypt(`${rs.id}`) },
              { label: rs.nombre_tipo_inmueble, url: '/admin/type-property/update/' },

            ];
            this.reset();
            this.BreadCrumbService.setBreadcrumbs(breadcrumbs);
            console.log(this.form.value)

          } else {
            this.router.navigate(['/admin/type-property']);
            return;
          }

        });
      } else {
        this.isLoading = false;
        const breadcrumbs = [
          { label: 'Dashboard', url: '/admin/dashboard' },
          { label: 'Tipo inmueble', url: '/admin/type-property/' },
          { label: 'Agregar', url: '/admin/type-property/new/' },
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

    this.tipoInmueblesService.store(form).subscribe((rs) => {
      if (rs.isError) {
        this.isSending = false;
        this.AppComponent.alert({ summary: "Operación fallida", detail: rs.message, severity: 'error' });
      } else {
        this.router.navigate(['/admin/type-property']);
        this.AppComponent.alert({ summary: "Operación exitosa", detail: rs.message, severity: 'success' });
      }
    });

  }

  update() {
    this.isSending = true;
    if (!this.form.valid) {
      this.AppComponent.alert({
        summary: "Formulario invalido",
        detail: "Por favor, Asegurese que la información del usuario es valida.",
        severity: 'warn'
      })
      this.isSending = false;
      return;
    }
    const form = this.form.value;


    const body = {
      id: form.id,
      nombre_tipo_inmueble: form.nombre_tipo_inmueble,
    }

    this.tipoInmueblesService.update(body).subscribe((rs) => {
      console.log(rs);
      if (rs.isError) {
        this.isSending = false;
        this.AppComponent.alert({ summary: "Operación fallida", detail: rs.message, severity: 'error' });
      } else {
        this.router.navigate(['/admin/type-property']);
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
