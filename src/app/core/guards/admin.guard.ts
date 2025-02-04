import { CanActivateFn, Router } from '@angular/router';
import { EncryptionService } from '../../shared/services/encryption/encryption.service';
import { inject } from '@angular/core';

export const isAdminGuard: CanActivateFn = (route, state) => {


    const encriptacion = inject(EncryptionService);
    const rol = encriptacion.loadData('role');

    if (rol && (rol == "SUPER ADMIN" || rol == "ADMINISTRADOR")) {
        return true;
    } else {
        return false
    }


};