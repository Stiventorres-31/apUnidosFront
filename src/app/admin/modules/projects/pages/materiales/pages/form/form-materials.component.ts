import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AppComponent } from '../../../../../../../app.component';
import { MaterialsService } from '../../services/materials.service';
import { EncryptionService } from '../../../../../../../shared/services/encryption/encryption.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadCrumbService } from '../../../../../../../shared/services/breadcrumbs/bread-crumb.service';
import { LabelsService } from '../../../../../../../shared/services/labels/labels.service';
import { ValidationsService } from '../../../../../../../shared/services/validations/validations.service';
import { form_inventario, form_lot } from '../../models/materials.interface';

@Component({
  selector: 'app-form-materials',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, MatProgressSpinnerModule, AngularSvgIconModule],
  templateUrl: './form-materials.component.html',
  styles: ''
})
export class FormMaterialsComponent {
  public form: FormGroup;
  public inputs: { [key: string]: boolean } = {};
  public showPassword: boolean = false;
  public isLoading: boolean = true;
  public isSending: boolean = false;
  public isUpdate: boolean = false;
  public isUpdateLots: boolean = false;
  public isNewLot: boolean = false;
  private ref: string = '';


  constructor(
    private fb: FormBuilder,
    private AppComponent: AppComponent,
    private materialsService: MaterialsService,
    private EncryptionService: EncryptionService,
    private router: Router,
    private parametros: ActivatedRoute,
    private BreadCrumbService: BreadCrumbService,
    private labels: LabelsService,
    private ValidationsService: ValidationsService
  ) {
    this.form = this.fb.group({
      id: [''],
      consecutivo: [''],
      referencia_material: [''],
      materiale_id: ['', Validators.required],
      nombre_material: ['', Validators.required],
      costo: ['', Validators.required],
      cantidad: ['', Validators.required],
      nit_proveedor: ['', Validators.required],
      nombre_proveedor: ['', Validators.required],
      descripcion_proveedor: ['', [Validators.minLength(6)]],
    });
    this.inputs = this.labels.inputs_data;
  }

  ngOnInit() {
    this.parametros.params.subscribe((params) => {
      if (params['lot'] && params['ref']) {
        /***
         * Actualizar Lotes
         */
        const lot = this.EncryptionService.decrypt(params['lot']);
        const ref = this.EncryptionService.decrypt(params['ref']);

        if (!lot || !ref) {
          this.router.navigate(['/admin/materials']);
          return;
        }
        this.ref = ref;
        this.isUpdateLots = true;
        this.materialsService.searchLot(lot).subscribe((rs) => {
          if (rs) {

            this.form.patchValue({
              id: rs.id,
              consecutivo: rs.consecutivo,
              costo: rs.costo,
              cantidad: rs.cantidad,
              nit_proveedor: rs.nit_proveedor,
              materiale_id: rs.materiale_id,
              nombre_proveedor: rs.nombre_proveedor
            }, { emitEvent: true });

            this.form.get("nombre_material")?.setValidators([]);
            this.form.get("nombre_material")?.updateValueAndValidity();

            this.form.get("materiale_id")?.setValidators([]);
            this.form.get("materiale_id")?.setValidators([]);

            let costo = Math.round(Number(rs.costo));

            this.form.patchValue({
              costo: this.ValidationsService.format_moneda(costo || 0, false)
            }, { emitEvent: true });

            this.isLoading = false;

            const breadcrumbs = [
              // { label: 'Dashboard', url: '/admin/dashboard' },
              { label: 'Materiales', url: '/admin/materials/' },
              { label: 'Lotes', url: '/admin/materials/lots/' + this.EncryptionService.encrypt(`${this.ref}`) },
              { label: 'Actualizar', url: '/admin/materials/lots/update/' + this.EncryptionService.encrypt(`${rs.id}`) },
              { label: rs.nombre_proveedor, url: '/admin/materials/lots/update/' },

            ];
            this.reset();
            this.BreadCrumbService.setBreadcrumbs(breadcrumbs);


          } else {

            this.router.navigate(['/admin/materials']);
            return;
          }

        });
      } else if (params['id'] && params['ref']) {
        /***
         * Agregar lote 
         */
        const id = this.EncryptionService.decrypt(params['id']);
        const ref = this.EncryptionService.decrypt(params['ref']);

        if (!id || !ref) {
          this.router.navigate(['/admin/materials']);
          return;
        }

        this.form.patchValue({
          materiale_id: id,
          referencia_material: ref
        }, { emitEvent: true });

        this.form.get("nombre_material")?.setValidators([]);
        this.form.get("nombre_material")?.updateValueAndValidity();

        this.isLoading = false;
        this.isNewLot = true;
        const breadcrumbs = [
          // { label: 'Dashboard', url: '/admin/dashboard' },
          { label: 'Materiales', url: '/admin/materials/' },
          { label: 'Lotes', url: '/admin/materials/lots/' + this.EncryptionService.encrypt(`${ref}`) },
          { label: 'Agregar', url: '/admin/materials/lots/new/' },

        ];
        this.reset();
        this.BreadCrumbService.setBreadcrumbs(breadcrumbs);


      } else if (params['ref']) {
        /***
         * Actualizar Materiles
         */
        const id = this.EncryptionService.decrypt(params['ref']);

        if (!id) {
          this.router.navigate(['/admin/materials']);
          return;
        }
        this.isUpdate = true;
        this.materialsService.search(id).subscribe((rs) => {

          if (rs) {
            this.form.patchValue(rs, { emitEvent: true });
            this.form.get("costo")?.setValidators([]);
            this.form.get("cantidad")?.setValidators([]);
            this.form.get("nit_proveedor")?.setValidators([]);
            this.form.get("materiale_id")?.setValidators([]);
            this.form.get("nombre_proveedor")?.setValidators([]);

            this.form.get("materiale_id")?.updateValueAndValidity();
            this.form.get("costo")?.updateValueAndValidity();
            this.form.get("cantidad")?.updateValueAndValidity();
            this.form.get("nit_proveedor")?.updateValueAndValidity();
            this.form.get("nombre_proveedor")?.updateValueAndValidity();

            // let costo = Math.round(Number(rs.costo));
            // this.form.patchValue({
            //   costo: this.ValidationsService.format_moneda(costo || 0, false)
            // }, { emitEvent: true });

            this.isLoading = false;

            const breadcrumbs = [
              // { label: 'Dashboard', url: '/admin/dashboard' },
              { label: 'Materiales', url: '/admin/materials/' },
              { label: 'Actualizar', url: '/admin/materials/update/' + this.EncryptionService.encrypt(`${rs.referencia_material}`) },
              { label: rs.nombre_material, url: '/admin/materials/update/' },

            ];
            this.reset();
            this.BreadCrumbService.setBreadcrumbs(breadcrumbs);


          } else {
            this.router.navigate(['/admin/materials']);
            return;
          }

        });
      }
      else {
        this.isLoading = false;
        this.form.get("materiale_id")?.setValidators([]);
        this.form.get("referencia_material")?.setValidators([Validators.required]);

        this.form.get("referencia_material")?.updateValueAndValidity();
        this.form.get("materiale_id")?.updateValueAndValidity();

        const breadcrumbs = [
          // { label: 'Dashboard', url: '/admin/dashboard' },
          { label: 'Materiales', url: '/admin/materials/' },
          { label: 'Agregar', url: '/admin/materials/new/' },
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
    form.costo = this.parseMoneda(form.costo);

    this.materialsService.store(form).subscribe((rs) => {
      if (rs.isError) {
        this.isSending = false;
        this.AppComponent.alert({ summary: "Operación fallida", detail: rs.message, severity: 'error' });
      } else {
        this.router.navigate(['/admin/materials']);
        this.AppComponent.alert({ summary: "Operación exitosa", detail: rs.message, severity: 'success' });
      }
    });

  }

  updateLot() {
    this.isSending = true;

    if (!this.form.valid) {
      this.AppComponent.alert({
        summary: "Formulario invalido",
        detail: "Por favor, Asegurese que la información del material es valida.",
        severity: 'warn'
      })
      this.isSending = false;
      return;
    }
    const form = this.form.value;
    form.costo = this.parseMoneda(form.costo);

    this.materialsService.updateLote(form).subscribe((rs) => {

      if (rs.isError) {
        this.isSending = false;
        this.AppComponent.alert({ summary: "Operación fallida", detail: rs.message, severity: 'error' });
      } else {

        this.router.navigate(['/admin/materials/lots', this.EncryptionService.encrypt(`${this.ref}`)]);
        this.AppComponent.alert({
          summary: "Operación exitosa",
          detail: rs.message,
          severity: 'success'
        });
      }
    });
  }

  storeLot() {
    this.isSending = true;
    if (!this.form.valid) {
      this.AppComponent.alert({
        summary: "Formulario invalido",
        detail: "Por favor, Asegurese que la información del material es valida.",
        severity: 'warn'
      })
      this.isSending = false;
      return;
    }
    const form = this.form.value;
    form.costo = this.parseMoneda(form.costo);

    const body: form_lot = {
      materiale_id: form.materiale_id,
      nit_proveedor: form.nit_proveedor,
      nombre_proveedor: form.nombre_proveedor,
      descripcion_proveedor: form.descripcion_proveedor,
      costo: form.costo,
      cantidad: form.cantidad,
    }

    this.materialsService.storeLot(body).subscribe((rs) => {

      if (rs.isError) {
        this.isSending = false;
        this.AppComponent.alert({ summary: "Operación fallida", detail: rs.message, severity: 'error' });
      } else {

        this.router.navigate(['/admin/materials/lots', this.EncryptionService.encrypt(`${form.referencia_material}`)]);
        this.AppComponent.alert({
          summary: "Operación exitosa",
          detail: rs.message,
          severity: 'success'
        });
      }
    });
  }

  update() {
    this.isSending = true;
    if (!this.form.valid) {
      this.AppComponent.alert({
        summary: "Formulario invalido",
        detail: "Por favor, Asegurese que la información del material es valida.",
        severity: 'warn'
      })
      this.isSending = false;
      return;
    }
    const form = this.form.value;
    form.costo = this.parseMoneda(form.costo);

    this.materialsService.update(form).subscribe((rs) => {

      if (rs.isError) {
        this.isSending = false;
        this.AppComponent.alert({ summary: "Operación fallida", detail: rs.message, severity: 'error' });
      } else {
        this.router.navigate(['/admin/materials']);
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

  moneda(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^0-9]/g, '');
    input.value = this.ValidationsService.format_moneda(value, false);

  }

  private parseMoneda(value: string | number | null | undefined): number {
    if (value == null) return 0; // Si es null o undefined, devolver 0
    return Number(value.toString().replace(/[^0-9]/g, '') || 0);
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
