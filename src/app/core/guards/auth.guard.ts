import { CanActivateFn, Router } from '@angular/router';
import { EncryptionService } from '../../shared/services/encryption/encryption.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {


  const encriptacion = inject(EncryptionService);
  const token = encriptacion.loadData("token");
  const router = inject(Router);

  if (token && token != '') {
    return true;
  } else {
    router.navigate(["/auth/login"]);
    return false
  }


};

export const isLogged: CanActivateFn = (route, state) => {
  const encriptacion = inject(EncryptionService);
  const router = inject(Router);
  const token = encriptacion.loadData("token");
  const rol = encriptacion.loadData('role');

  if (token && token != '') {
    //Validar roles

    const roles = ["CONSULTOR", "OPERARIO", "ADMINISTRADOR", "SUPER ADMIN"];
    const url = roles.some(r => r === rol) ? '/admin/projects' : '';

    // if (rol == "CONSULTOR") {
    //   url = "/consultant/dashboard";
    // } else if (rol == "OPERARIO") {
    //   url = "/operator/dashboard";
    // } else if (rol == "SUPER ADMIN" || rol == "ADMINISTRADOR") {
    //   url = "/admin/dashboard";
    // }

    router.navigate([url]);
    return false
  } else {
    return true
  }


};