import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VehicleService } from 'src/app/service/vehicle.service';
import { AddVehicleComponent } from './add.vehicle.component';
import { AddVehicleRoutigModule } from './add.vehicle-routing.module';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MessageModule } from 'primeng/message';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { GoogleMapsModule } from '@angular/google-maps';


@NgModule({
	imports: [
		CommonModule,
		AddVehicleRoutigModule,
		FormsModule,
		ButtonModule,
		InputTextModule,
		ToastModule,
		RippleModule,
		RadioButtonModule,
		MessageModule,
		ReactiveFormsModule,
		DropdownModule,
		FileUploadModule,
		GoogleMapsModule
	],
	declarations: [AddVehicleComponent],
	providers: [VehicleService, MessageService, ConfirmationService]
})
export class AddVehicleModule { }
