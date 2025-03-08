import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppComponent } from '../../../../../app.component';
import { UsersService } from '../../../../../shared/services/users/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LabelsService } from '../../../../../shared/services/labels/labels.service';
import { EncryptionService } from '../../../../../shared/services/encryption/encryption.service';
import { BreadCrumbService } from '../../../../../shared/services/breadcrumbs/bread-crumb.service';
import { NgClass } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { min } from 'rxjs';
import { ValidationsService } from '../../../../../shared/services/validations/validations.service';

@Component({
  selector: 'app-form-user',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, MatProgressSpinnerModule, AngularSvgIconModule],
  templateUrl: './form-user.component.html',
  styles: ``
})
export class FormUserComponent {
  public form: FormGroup;
  public inputs: { [key: string]: boolean } = {};
  public showPassword: boolean = false;
  public isLoading: boolean = true;
  public isSending: boolean = false;
  public isUpdate: boolean = false;
  public isUpdatePassword: boolean = false;

  public roles: { id: number, name: string }[] = [
    //{ id: 1, name: 'SUPER ADMIN' },
    { id: 2, name: 'ADMINISTRADOR' },
    { id: 3, name: 'OPERARIO' },
    { id: 4, name: 'CONSULTOR' }
  ];
  constructor(
    private fb: FormBuilder,
    private AppComponent: AppComponent,
    private UserService: UsersService,
    private EncryptionService: EncryptionService,
    private router: Router,
    private parametros: ActivatedRoute,
    private BreadCrumbService: BreadCrumbService,
    private labels: LabelsService,
    private ValidationsService: ValidationsService
  ) {
    this.form = this.fb.group({
      id: [''],
      numero_identificacion: ['', Validators.required],
      nombre_completo: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', [Validators.required, Validators.minLength(6)]],
      rol_usuario: ['', Validators.required]//{id, name}
    });
    this.inputs = this.labels.inputs_data;
  }

  ngOnInit() {
    this.parametros.params.subscribe((params) => {
      if (params['id']) {
        const id = this.EncryptionService.decrypt(params['id']);

        if (!id || isNaN(parseInt(id))) {
          this.router.navigate(['/admin/users']);
          return;
        }
        this.isUpdate = true;
        this.index(id);

      }
      else if (params['user']) {
        const id = this.EncryptionService.decrypt(params['user']);

        if (!id || isNaN(parseInt(id))) {
          this.router.navigate(['/admin/users']);
          return;
        }

        this.isUpdatePassword = true;
        this.index(id, false);
      }
      else {
        this.isLoading = false;
        const breadcrumbs = [
          // { label: 'Dashboard', url: '/admin/dashboard' },
          { label: 'usuarios', url: '/admin/users/' },
          { label: 'Agregar', url: '/admin/users/new/' },
        ];
        this.BreadCrumbService.setBreadcrumbs(breadcrumbs);
        this.reset();
      }
    });


  }

  index(id: string, type: boolean = true): void {
    let breadcrumbs: any = [];
    this.UserService.search(id).subscribe((rs) => {
      if (rs) {
        this.isLoading = false;
        if (type) {
          this.form.patchValue(rs);

          this.form.get("password")?.setValidators([]);
          this.form.get("password_confirmation")?.setValidators([]);

          this.form.get("password")?.updateValueAndValidity();
          this.form.get("password_confirmation")?.updateValueAndValidity();

          breadcrumbs = [
            // { label: 'Dashboard', url: '/admin/dashboard' },
            { label: 'usuarios', url: '/admin/users/' },
            { label: 'Actualizar', url: '/admin/users/update/' + this.EncryptionService.encrypt(`${rs.numero_identificacion}`) },
            { label: rs.nombre_completo, url: '/admin/users/update/' },

          ];
          this.reset();
        } else {
          this.form.patchValue(
            {
              numero_identificacion: rs.numero_identificacion,
            }
          );
          this.form.get("nombre_completo")?.setValidators([]);
          this.form.get("rol_usuario")?.setValidators([]);

          this.form.get("nombre_completo")?.updateValueAndValidity();
          this.form.get("rol_usuario")?.updateValueAndValidity();

          breadcrumbs = [
            // { label: 'Dashboard', url: '/admin/dashboard' },
            { label: 'usuarios', url: '/admin/users/' },
            { label: 'Actualizar password', url: '/admin/users/change-password/' + this.EncryptionService.encrypt(`${rs.numero_identificacion}`) },
            { label: rs.nombre_completo, url: '/admin/users/change-password/' },

          ];
        }

        this.BreadCrumbService.setBreadcrumbs(breadcrumbs);


      } else {
        this.router.navigate(['/admin/users']);
        return;
      }

    });
  }

  store() {
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
    if (!(form.password === form.password_confirmation)) {
      this.AppComponent.alert({
        summary: "Contraseñas no coinciden",
        detail: "Por favor, verifique que las contraseñas coincidan.",
        severity: 'error'
      })
      this.isSending = false;
      return;
    }

    const rol = this.roles.find(r => r.name === form.rol_usuario);
    if (rol) {
      form.rol_usuario = rol;
    }

    this.UserService.store(form).subscribe((rs) => {
      if (rs.isError) {
        this.isSending = false;
        this.AppComponent.alert({ summary: "Operación fallida", detail: rs.message, severity: 'error' });
      } else {
        this.router.navigate(['/admin/users']);
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
    const rol = this.roles.find(r => r.name === form.rol_usuario);
    if (rol) {
      const body = {
        id: form.id,
        numero_identificacion: form.numero_identificacion,
        nombre_completo: form.nombre_completo,
        rol_usuario: rol,
      }
      this.UserService.update(body).subscribe((rs) => {

        if (rs.isError) {
          this.isSending = false;
          this.AppComponent.alert({ summary: "Operación fallida", detail: rs.message, severity: 'error' });
        } else {
          this.router.navigate(['/admin/users']);
          this.AppComponent.alert({
            summary: "Operación exitosa",
            detail: rs.message,
            severity: 'success'
          });
        }
      });
    } else {
      this.AppComponent.alert({
        summary: "Rol no encontrado",
        detail: "Por favor, verifique que el rol seleccionado sea valido.",
        severity: 'error'
      });
      this.isSending = false;
      return;
    }


  }

  password() {
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
    if (!(form.password === form.password_confirmation)) {
      this.AppComponent.alert({
        summary: "Contraseñas no coinciden",
        detail: "Por favor, verifique que las contraseñas coincidan.",
        severity: 'error'
      })
      this.isSending = false;
      return;
    }
    const body = {
      numero_identificacion: this.form.get('numero_identificacion')?.value,
      new_password: this.form.get('password')?.value,
      new_password_confirmation: this.form.get('password_confirmation')?.value,
    }

    this.UserService.updatePassword(body).subscribe((rs) => {
      if (rs.isError) {
        this.isSending = false;
        this.AppComponent.alert({ summary: "Operación fallida", detail: rs.message, severity: 'error' });
      } else {
        this.router.navigate(['/admin/users']);
        this.AppComponent.alert({ summary: "Operación exitosa", detail: rs.message, severity: 'success' });
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
