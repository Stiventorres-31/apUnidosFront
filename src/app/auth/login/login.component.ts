import { Component } from '@angular/core';
import { AppComponent } from '../../app.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { LabelsService } from '../../shared/services/labels/labels.service';
import { EncryptionService } from '../../shared/services/encryption/encryption.service';
import { environment } from '../../../environments/environment';
import { NgClass } from '@angular/common';
import { MatRippleModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AngularSvgIconModule } from 'angular-svg-icon';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, MatProgressSpinnerModule, AngularSvgIconModule, MatRippleModule],
  templateUrl: './login.component.html',
  styles: ``
})
export class LoginComponent {

  public inputs: { [key: string]: boolean } = {};
  public showPassword: boolean = false;
  public loanding: boolean = false;
  public isSending: boolean = false;
  public form: FormGroup;
  protected base_url = environment.front;
  public currentYear: number = new Date().getFullYear();

  constructor(private fb: FormBuilder, private loginService: LoginService, private router: Router, private labels: LabelsService, private encryptionService: EncryptionService, private appComponent: AppComponent) {

    this.form = this.fb.group({
      numero_identificacion: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
    this.inputs = this.labels.inputs_data;
  }


  ngOnInit(): void {
    localStorage.clear();
    sessionStorage.clear();

  }

  login() {
    this.isSending = true;
    localStorage.clear();

    if (this.form.invalid) {
      this.appComponent.alert({
        summary: "Formulario invalido",
        detail: "Por favor, Asegurese que la información del usuario es valida.",
        severity: 'warn'
      })
      this.isSending = false;
      return;
    }
    this.loginService.login(this.form.value).subscribe(rs => {
      if (!rs.isError) {
        const rol = this.encryptionService.loadData('role');

        const roles = ["CONSULTOR", "OPERARIO", "ADMINISTRADOR", "SUPER ADMIN"];
        const url = roles.some(r => r === rol) ? '/admin/dashboard' : '';

        // if (rol == "CONSULTOR") {
        //   url = "consultant/dashboard";
        // } else if (rol == "OPERARIO") {
        //   url = "/operator/dashboard";
        // } else if (rol == "SUPER ADMIN" || rol == "ADMINISTRADOR") {
        //   url = "/admin/dashboard";
        // }

        this.router.navigate([url]);
      }
      this.isSending = false;

    })
  }

  labelFocus(campo: string) {
    this.labels.labelFloatFocus(campo)
  }

  labelBlur(campo: string, event: Event) {
    this.labels.labelFloatBlur(campo, event);
  }

}
