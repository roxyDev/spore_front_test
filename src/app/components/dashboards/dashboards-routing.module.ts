import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', data: {breadcrumb: 'Mapa de Visualización'}, loadChildren: () => import('./monitoring/monitoring.dashboard.module').then(m => m.MonitoringDashboardModule) },
    ])],
    exports: [RouterModule]
})
export class DashboardsRoutingModule { }
