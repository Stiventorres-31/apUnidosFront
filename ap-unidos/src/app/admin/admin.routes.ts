import { Routes } from "@angular/router";
import { AdminLayoutComponent } from "./admin-layout.component";
import { DashboardComponent } from "./modules/dashboard/dashboard.component";
import { authGuard } from "../core/guards/auth.guard";
import { isAdminGuard } from "../core/guards/admin.guard";
import { ProjectsComponent } from "./modules/projects/projects.component";
import { UsersComponent } from "./modules/users/users.component";
import { FormUserComponent } from "./modules/users/pages/form/form-user.component";
import { TipoInmueblesComponent } from "./modules/projects/inmuebles/tipo/tipo-inmuebles.component";
import { FormTipoInmuebleComponent } from "./modules/projects/inmuebles/tipo/form/form-tipo-inmueble.component";
import { MaterialsComponent } from "./modules/projects/materiales/materials.component";
import { FormMaterialsComponent } from "./modules/projects/materiales/form/form-materials.component";

export const ADMIN_ROUTES: Routes = [

    {
        path: "",
        canActivate: [authGuard, isAdminGuard],
        component: AdminLayoutComponent,
        children: [
            {
                path: '',
                redirectTo: 'dashboard',
                pathMatch: 'full'
            },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'projects', component: ProjectsComponent },
            {
                path: 'users',
                children: [
                    { path: '', component: UsersComponent },
                    { path: 'update/:id', component: FormUserComponent },
                    { path: 'new', component: FormUserComponent },
                    { path: 'change-password/:id', component: UsersComponent },
                ]
            },
            {
                path: 'type-property',
                children: [
                    { path: '', component: TipoInmueblesComponent },
                    { path: 'new', component: FormTipoInmuebleComponent },
                    { path: 'update/:id', component: FormTipoInmuebleComponent },
                ]
            },
            {
                path: 'materials',
                children: [
                    { path: '', component: MaterialsComponent },
                    { path: 'new', component: FormMaterialsComponent },
                    { path: 'update/:id', component: FormMaterialsComponent },
                ]
            }

        ]
    }
];
