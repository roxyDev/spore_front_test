import { Component, OnDestroy, OnInit , ViewChild, ElementRef } from '@angular/core';
import { VehicleService } from 'src/app/service/vehicle.service';
import { MiscService } from 'src/app/service/misc.service';
import { catchError  } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
import { forkJoin, of } from 'rxjs';
import { SessionService } from 'src/app/service/session.service';
/*import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';*/

import { Subscription } from 'rxjs';
import { AppConfig, LayoutService } from 'src/app/layout/service/app.layout.service';
import { DashboardService } from '../../../service/dashboard.service';
import { Table } from 'primeng/table';
import { MenuItem } from 'primeng/api';
import { ChartModule } from 'primeng/chart';

@Component({
    templateUrl: './monitoring.dashboard.component.html'
})

export class MonitoringDashboardComponent implements OnInit, OnDestroy{
    title = 'Mapa de Coordenadas';
    listVehicles : any[] = [];
    listFilteredVehicles : any[] = [];
    userId = this.sessionService.getUserId();
    filteredByAdmin = this.sessionService.getUseriSAdmin();
    locations = [];
    center = { lat: 20.6751707, lng: -103.4177999 };
    zoom = 10; // Nivel de zoom
    // Definición del marcador con ícono personalizado
    markerOptions: google.maps.MarkerOptions = {
        title: 'Marcador Personalizado',
        /*label: {
                color: 'black',
                fontWeight: 'bold',
                text: '¡Hola Mundo!' // El texto de la etiqueta
            },*/
        icon: {
        url: '././assets/layout/images/car-4.svg', // URL de tu ícono
        scaledSize: new google.maps.Size(40, 40) // Tamaño del ícono
        }
    };

    constructor(
        private vehicleService: VehicleService,
        private miscService: MiscService,
        private messageService: MessageService,
        private sessionService:SessionService,
        //private http: HttpClient,
        private _dashboardService: DashboardService, 
        private layoutService: LayoutService)
    {
        

    }


    ngOnInit(): void
    {
        this.getLists();
        
    }

    getLists(){

        this.miscService.startRequest();
      
        const vehicles = this.vehicleService.getAll(0,1,'[{"id":"asc"}]')
        .pipe(
            catchError((error) => 
            {
                this.messageService.add({ life:5000, key: 'msg', severity: 'error', summary: "Error al cargar el catálogo de clientes", detail:error.message });
                return of(null); 
            })
        );
        
        forkJoin([vehicles]).subscribe(  ([dataVehicles])=>
        {
            if(dataVehicles != null )
            {             
                console.log(dataVehicles)
              dataVehicles['object']['records'].forEach(element => 
                {
                    this.listVehicles.push({
                        id: element['vehicleUserId'].id,
                        userName: element['vehicleUserId'].userFullName,
                        brand: element['vehicleBrand'],
                        model: element['vehicleModel'],
                        plate: element['vehiclePlateNumber'],
                        lat: element['vehicleLat'],
                        lng: element['vehicleLng'],
                    });
                });

                //Filtra los vehiculos por administrador o por usuario normal
                if( this.filteredByAdmin == "true"){
                    this.listFilteredVehicles = this.listVehicles
                } else {
                    for (let i= 0; i< this.listVehicles.length; i++) {
                        if ( this.listVehicles[i].id == this.userId) {
                            this.listFilteredVehicles = [...this.listFilteredVehicles, this.listVehicles[i]];
                        }
                    }
                }
                //Ingresa las coordenadas al mapa
                this.listFilteredVehicles.forEach(element => 
                    {
                        this.locations.push({
                            lat: element['lat'],
                            lng: element['lng'],
                        });
                    });
                
            }
            this.miscService.endRquest();	
        },
        (err : any) =>
        {
            this.messageService.add({ severity: 'error',key: 'msg', summary: 'Error', detail: 'Error al generar los catalogos', life: 3000 });
            this.miscService.endRquest();
        });
          
    
      }

    ngOnDestroy()
    {
        //this.subscription.unsubscribe();
    }
}
