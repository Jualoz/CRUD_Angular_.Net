import { Injectable, inject } from '@angular/core';
import { appsettings } from '../Settings/appsettings';
import { HttpClient } from '@angular/common/http';
import { Venta } from '../Models/Venta';
import { RespuestaAPI } from '../Models/RespuestaAPI';

@Injectable({
  providedIn: 'root'
})
export class VentaService {

  private http = inject(HttpClient);
  private apiUrl : string = appsettings.apiUrl + "Venta"
  constructor() { }

  lista(){
    return this.http.get<Venta[]>(this.apiUrl); 
  }

  obtenerVenta(id : number){
    return this.http.get<Venta>(`${this.apiUrl}/${id}`); 
  }

  realizarVenta(objeto : Venta){
    return this.http.post<RespuestaAPI>(this.apiUrl, objeto); 
  }
}
