import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleService } from 'src/app/service/vehicle.service';
import { EditVehicleComponent } from './edit.vehicle.component';
import { EditVehicleRoutigModule } from './edit.vehicle-routing.module';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { MessageModule } from 'primeng/message';
import { DropdownModule } from 'primeng/dropdown';
import { RadioButtonModule } from 'primeng/radiobutton';
import { GoogleMapsModule } from '@angular/google-maps';

@NgModule({
	imports: [
		CommonModule,
		EditVehicleRoutigModule,
		FormsModule,
		ButtonModule,
		InputTextModule,
		ToastModule,
		RippleModule,
		MessageModule,
		ReactiveFormsModule,
		DropdownModule,
		RadioButtonModule,
		GoogleMapsModule	
	],
	declarations: [EditVehicleComponent],
	providers: [ VehicleService, MessageService, ConfirmationService]
})
export class EditVehicleModule { }
