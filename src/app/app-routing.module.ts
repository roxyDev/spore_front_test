import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import {AuthGuard} from "./guard/auth.guard";

const routerOptions: ExtraOptions = {
    anchorScrolling: 'enabled'
};

const routes: Routes = 
[ 
    {
        path: '', component: AppLayoutComponent, canActivateChild : [AuthGuard],
        children: [
            { path: '', loadChildren: () => import('./components/dashboards/dashboards.module').then(m => m.DashboardsModule), data:{ module: 'dashboards' } },
            { path: 'a', loadChildren: () => import('./components/a/a.module').then(m => m.AModule), data:{ module: 'a' } },
			{ path: 'users', loadChildren: () => import('./components/users/users.module').then(m => m.UsersModule), data:{ module: 'users' } },
		    { path: 'vehicles', loadChildren: () => import('./components/vehicles/vehicle.module').then(m => m.VehicleModule), data:{ module: 'vehicles' } },


        ]

    },
		
    { path: 'auth', loadChildren: () => import('./components/auth/auth.module').then(m => m.AuthModule) },
    { path: 'notfound', loadChildren: () => import('./components/notfound/notfound.module').then(m => m.NotfoundModule) },
	{ path: 'error', loadChildren: () => import('./components/error/error.module').then(m => m.ErrorModule) },
    { path: '**', redirectTo: '/notfound' }
];

@NgModule
({
    imports: [RouterModule.forRoot(routes, routerOptions)], //It enables an Angular module to use functionality that was defined in another Angular module
    exports: [RouterModule], //It enables an Angular module to expose some of its components
//	providers:[AuthGuard], //guard para control de acceso
})

export class AppRoutingModule { }
