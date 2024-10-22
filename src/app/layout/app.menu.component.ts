import { OnInit } from '@angular/core';
import { Component } from '@angular/core';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Dashboards',
                icon: 'pi pi-home',
                items: [
                            { 
                                label: 'Mapa', 
                                icon: 'pi pi-map-marker',
                                routerLink: ['/']
                            },
                        ]
            },
			{ separator: true },
            {
                label: 'Administración',
                items: [
                    {
                        label: 'Usuarios',
                        icon: 'pi pi-users',
                        routerLink: ['/users']
                    },
                    {
                        label: 'Vehiculos',
                        icon: 'pi pi-car',
                        routerLink: ['/vehicles']
                    }
              ],
			}
        ];
    }
}
