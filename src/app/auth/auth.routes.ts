import { Routes } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { AuthComponent } from "./components/auth/auth.component";
import { isLogged } from "../core/guards/auth.guard";

export const AUTH_ROUTES: Routes = [
    {

        path: '', component: AuthComponent, canActivate: [isLogged], children:
            [
                { path: 'login', component: LoginComponent },
            ]
    },
];