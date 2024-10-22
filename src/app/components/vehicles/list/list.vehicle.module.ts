import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleService } from 'src/app/service/vehicle.service';
import { ListVehicleComponent } from './list.vehicle.component';
import { ListVehicleRoutigModule } from './list.vehicle-routing.module';
import { TableModule } from 'primeng/table';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { RippleModule } from 'primeng/ripple';
import { ToastModule } from 'primeng/toast';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip'; 


@NgModule({
	imports: [
		CommonModule,
		ListVehicleRoutigModule,
		TableModule,
		ButtonModule,
		ConfirmDialogModule,
		ToolbarModule,
		DialogModule,
		RippleModule,
		ToastModule,
		TagModule,
		TooltipModule
	],
	declarations: [ListVehicleComponent],
	providers: [VehicleService, MessageService, ConfirmationService]
})
export class ListVehicleModule { }
