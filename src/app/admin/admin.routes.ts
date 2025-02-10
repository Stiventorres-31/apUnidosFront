import { Routes } from "@angular/router";
import { AdminLayoutComponent } from "./admin-layout.component";
import { DashboardComponent } from "./modules/dashboard/dashboard.component";
import { authGuard } from "../core/guards/auth.guard";
import { isAdminGuard } from "../core/guards/admin.guard";
import { ProjectsComponent } from "./modules/projects/projects.component";
import { UsersComponent } from "./modules/users/users.component";
import { FormUserComponent } from "./modules/users/pages/form/form-user.component";
import { TipoInmueblesComponent } from "./modules/projects/pages/inmuebles/pages/tipo/tipo-inmuebles.component";
import { FormTipoInmuebleComponent } from "./modules/projects/pages/inmuebles/pages/tipo/form/form-tipo-inmueble.component";
import { MaterialsComponent } from "./modules/projects/pages/materiales/materials.component";
import { FormMaterialsComponent } from "./modules/projects/pages/materiales/form/form-materials.component";
import { InmueblesComponent } from "./modules/projects/pages/inmuebles/inmuebles.component";
import { FormProjectsComponent } from "./modules/projects/pages/form/form-projects.component";
import { FormInmueblesComponent } from "./modules/projects/pages/inmuebles/pages/form/form-inmuebles.component";
import { BudgetsProjectsComponent } from "./modules/projects/pages/presupuestos/budgets-projects.component";
import { BudgetsUploadComponent } from "./modules/projects/pages/presupuestos/upload/budgets-upload.component";

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
            {
                path: 'projects',
                children: [
                    { path: '', component: ProjectsComponent },
                    { path: 'update/:id', component: FormProjectsComponent },
                    { path: 'budget/:id', component: BudgetsProjectsComponent },
                    { path: 'budgets', component: BudgetsUploadComponent },

                    { path: 'new', component: FormProjectsComponent },
                ]
            },
            {
                path: 'users',
                children: [
                    { path: '', component: UsersComponent },
                    { path: 'update/:id', component: FormUserComponent },
                    { path: 'new', component: FormUserComponent },
                    { path: 'change-password/:user', component: FormUserComponent },
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
                path: 'property',
                children: [
                    { path: '', component: InmueblesComponent },
                    { path: 'new', component: FormInmueblesComponent },
                    { path: 'update/:id', component: FormInmueblesComponent },
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
