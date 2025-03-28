import { Routes } from "@angular/router";
import { AdminLayoutComponent } from "./admin-layout.component";
import { DashboardComponent } from "./modules/dashboard/dashboard.component";
import { authGuard } from "../core/guards/auth.guard";
import { ProjectsComponent } from "./modules/projects/projects.component";
import { UsersComponent } from "./modules/users/users.component";
import { FormUserComponent } from "./modules/users/pages/form/form-user.component";
import { TipoInmueblesComponent } from "./modules/projects/pages/inmuebles/pages/tipo/tipo-inmuebles.component";
import { FormTipoInmuebleComponent } from "./modules/projects/pages/inmuebles/pages/tipo/form/form-tipo-inmueble.component";
import { MaterialsComponent } from "./modules/projects/pages/materiales/materials.component";
import { FormMaterialsComponent } from "./modules/projects/pages/materiales/pages/form/form-materials.component";
import { InmueblesComponent } from "./modules/projects/pages/inmuebles/inmuebles.component";
import { FormProjectsComponent } from "./modules/projects/pages/form/form-projects.component";
import { FormInmueblesComponent } from "./modules/projects/pages/inmuebles/pages/form/form-inmuebles.component";
import { BudgetsProjectsComponent } from "./modules/projects/pages/presupuestos/budgets-projects.component";
import { BudgetsInmueblesComponent } from "./modules/projects/pages/presupuestos/pages/inmuebles/budgets-inmuebles.component";
import { LotsComponent } from "./modules/projects/pages/materiales/pages/lotes/lots.component";
import { BudgetsUploadComponent } from "./modules/projects/pages/presupuestos/pages/upload/budgets-upload.component";
import { FormBudgetComponent } from "./modules/projects/pages/presupuestos/pages/form/form-budget.component";
import { AssignmentComponent } from "./modules/projects/pages/assignment/assignment.component";
import { AssignmentsUploadComponent } from "./modules/projects/pages/assignment/pages/upload/assignment-upload.component";
import { AssignmentsInmueblesComponent } from "./modules/projects/pages/assignment/pages/inmuebles/assignments-inmuebles.component";
import { FormAssignmentComponent } from "./modules/projects/pages/assignment/pages/form/form-assignment.component";
import { RoleGuard } from "../core/guards/role.guard";

export const ADMIN_ROUTES: Routes = [

    {
        path: "",
        canActivateChild: [authGuard, RoleGuard],
        data: { allowedRoles: ['OPERARIO', 'CONSULTOR', 'ADMINISTRADOR', 'SUPER ADMIN'] },
        component: AdminLayoutComponent,
        children: [
            {
                path: '',
                redirectTo: 'workshops',
                pathMatch: 'full'
            },
            // { path: 'dashboard', component: DashboardComponent },
            {
                path: 'workshops',
                children: [
                    { path: '', component: ProjectsComponent },
                    {
                        path: 'update/:id', component: FormProjectsComponent,
                        data: { allowedRoles: ['ADMINISTRADOR', 'SUPER ADMIN'] }
                    },
                    { path: 'budget/:id', component: BudgetsProjectsComponent },
                    {
                        path: 'budget/new/:id/:cod', component: FormBudgetComponent,
                        data: { allowedRoles: ['ADMINISTRADOR', 'SUPER ADMIN'] }
                    },
                    {
                        path: 'budgets/:id', component: BudgetsUploadComponent,
                        data: { allowedRoles: ['ADMINISTRADOR', 'SUPER ADMIN'] }
                    },
                    {
                        path: 'new', component: FormProjectsComponent,
                        data: { allowedRoles: ['ADMINISTRADOR', 'SUPER ADMIN'] }
                    },
                    { path: 'assignment/:id', component: AssignmentComponent },
                    {
                        path: 'assignments/:id', component: AssignmentsUploadComponent,
                        data: { allowedRoles: ['ADMINISTRADOR', 'SUPER ADMIN', 'OPERARIO'] }
                    },
                    {
                        path: 'assignment/new/:id/:cod', component: FormAssignmentComponent,
                        data: { allowedRoles: ['ADMINISTRADOR', 'SUPER ADMIN', 'OPERARIO'] }
                    },
                ]
            },
            {
                path: 'users',
                data: { allowedRoles: ['ADMINISTRADOR', 'SUPER ADMIN'] },
                children: [
                    { path: '', component: UsersComponent },
                    { path: 'update/:id', component: FormUserComponent },
                    { path: 'new', component: FormUserComponent },
                    { path: 'change-password/:user', component: FormUserComponent },
                ]
            },
            {
                path: 'type-vehicles',
                data: { allowedRoles: ['ADMINISTRADOR', 'SUPER ADMIN'] },
                children: [
                    { path: '', component: TipoInmueblesComponent },
                    { path: 'new', component: FormTipoInmuebleComponent },
                    { path: 'update/:id', component: FormTipoInmuebleComponent },
                ]
            },
            {
                path: 'vehicles',
                children: [
                    { path: '', component: InmueblesComponent },
                    {
                        path: 'new', component: FormInmueblesComponent,
                        data: { allowedRoles: ['ADMINISTRADOR', 'SUPER ADMIN'] },
                    },
                    {
                        path: 'update/:id', component: FormInmueblesComponent,
                        data: { allowedRoles: ['ADMINISTRADOR', 'SUPER ADMIN'] },
                    },
                    { path: 'view/budget/:id', component: BudgetsInmueblesComponent },
                    { path: 'view/assignment/:id', component: AssignmentsInmueblesComponent },
                ]
            },
            {
                path: 'materials',
                data: { allowedRoles: ['ADMINISTRADOR', 'SUPER ADMIN'] },
                children: [
                    { path: '', component: MaterialsComponent },
                    { path: 'new', component: FormMaterialsComponent },
                    { path: 'update/:ref', component: FormMaterialsComponent },
                    { path: 'lots/:id', component: LotsComponent },
                    { path: 'lots/new/:id/:ref', component: FormMaterialsComponent },
                    { path: 'lots/update/:lot/:ref', component: FormMaterialsComponent },
                ]
            }

        ]
    }
];
