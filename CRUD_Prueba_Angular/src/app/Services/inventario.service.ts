import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { appsettings } from '../Settings/appsettings';
import { Inventario } from '../Models/Inventario';
import { RespuestaAPI } from '../Models/RespuestaAPI';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private http = inject(HttpClient);
  private apiUrl : string = appsettings.apiUrl + "Inventario"
  constructor() { }

  lista(){
    return this.http.get<Inventario[]>(this.apiUrl); 
  }

  obtenerProducto(id : number){
    return this.http.get<Inventario>(`${this.apiUrl}/${id}`); 
  }
  
  crearProducto(objeto : Inventario){
    return this.http.post<RespuestaAPI>(this.apiUrl, objeto); 
  }

  editarProducto(objeto : Inventario){
    return this.http.put<RespuestaAPI>(this.apiUrl, objeto); 
  }

  eliminarProducto(id : number){
    return this.http.delete<Inventario>(`${this.apiUrl}/${id}`); 
  }
}
