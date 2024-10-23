import { Component, OnDestroy, OnInit , ViewChild, ElementRef } from '@angular/core';
import { VehicleService } from 'src/app/service/vehicle.service';
import { MiscService } from 'src/app/service/misc.service';
import { MessageService } from 'primeng/api';
import { SessionService } from 'src/app/service/session.service';
import { WebsocketService } from '../../../service/websocket.service';


@Component({
    templateUrl: './monitoring.dashboard.component.html',
})

export class MonitoringDashboardComponent implements OnInit, OnDestroy{
    title = 'Mapa de Coordenadas';
    listVehicles : any[] = [];
    listFilteredVehicles : any[] = [];
    userId = this.sessionService.getUserId();
    filteredByAdmin = this.sessionService.getUseriSAdmin();
    data: any[] = [];
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
        private websocketService: WebsocketService,
        )
    {
        

    }


    ngOnInit(): void
    {
        // Actualiza los datos en tiempo real
        this.websocketService.getDataUpdates().subscribe((data: any[]) => {

            //Filtra los vehiculos por administrador o por usuario normal
            if( this.filteredByAdmin == "true"){
                this.locations = data
            } else {
                for (let i= 0; i< data.length; i++) {
                    if ( data[i].id == this.userId) {
                        this.locations = [...this.locations, data[i]];
                    }
                }
            }
            console.log(data) 
          });
    }


    ngOnDestroy()
    {
        //this.subscription.unsubscribe();
    }
}
