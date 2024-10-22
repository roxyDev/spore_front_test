import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MonitoringDashboardComponent } from './monitoring.dasboard.component';
import { ConfirmationService, MessageService } from 'primeng/api';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: MonitoringDashboardComponent }
    ])],
    providers: [MessageService, ConfirmationService],
    exports: [RouterModule]
})
export class MonitoringDashboardRoutigModule { }
