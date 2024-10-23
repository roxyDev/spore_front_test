import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private socket = io('http://localhost:3000'); // Cambia a la URL de tu servidor
  private dataSubject = new Subject<any[]>();

  constructor() {
    this.socket.on('dataUpdate', (data: any[]) => {
      this.dataSubject.next(data);
    });
  }

  getDataUpdates() {
    return this.dataSubject.asObservable();
  }
}
