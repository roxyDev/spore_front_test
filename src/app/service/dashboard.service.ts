import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class DashboardService
{
    backendUrl:string = `${environment.apiUrl}/dashboard`;

    constructor(private http: HttpClient)
    {
    }
    //Dashboard administrtativo
    getModelBrand():Observable<any[]>
    {
        return this.http.get<any[]>(this.backendUrl+"/model-brand");
    }

    getSupplyStatus():Observable<any[]>
    {
        return this.http.get<any[]>(this.backendUrl+"/supply-status");
    }

    getCategory():Observable<any[]>
    {
        return this.http.get<any[]>(this.backendUrl+"/category");
    }

    getActiveClients():Observable<any[]>
    {
        return this.http.get<any[]>(this.backendUrl+"/active-clients");
    }

    getQuotationSale():Observable<any[]>
    {
        return this.http.get<any[]>(this.backendUrl+"/quotation-sale");
    }

    getSaleOrders():Observable<any[]>
    {
        return this.http.get<any[]>(this.backendUrl+"/sale-orders");
    }

    //Dashboard de monitoreo

    getTicketStatus():Observable<any[]>
    {
        return this.http.get<any[]>(this.backendUrl+"/ticket-status");
    }
    getIncidences():Observable<any[]>
    {
        return this.http.get<any[]>(this.backendUrl+"/incidence");
    }



}
