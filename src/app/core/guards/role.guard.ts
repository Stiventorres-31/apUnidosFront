import { Injectable } from '@angular/core';
import { CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { EncryptionService } from '../../shared/services/encryption/encryption.service';

@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivateChild {

    constructor(private router: Router, private encriptacion: EncryptionService) { }

    canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const allowedRoles: string[] = childRoute.data['allowedRoles'] || [];
        const userRole = this.encriptacion.loadData('role');

        if (allowedRoles.length === 0 || allowedRoles.includes(userRole)) {
            return true;
        } else {
            this.router.navigate(['/unauthorized']);
            return false;
        }
    }
}

