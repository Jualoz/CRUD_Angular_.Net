import { Component, inject } from '@angular/core';
import { InventarioService } from '../../Services/inventario.service';
import { Inventario } from '../../Models/Inventario';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { VentaService } from '../../Services/venta.service';
import { Venta } from '../../Models/Venta';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})

export class InicioComponent {
  private inventarioServicio = inject(InventarioService);
  private ventaServicio = inject(VentaService);
  public listaProductos : Inventario[] = [];
  public listaVentas : Venta[] = [];
  public displayedColumnsInventario : string[] = ["id", "nombre", "valorCompra", "stock", "accion"];
  public displayedColumnsVenta : string[] = ["id", "cantidad", "valorVenta", "fecha"];
  public currentPage: number = 1;
  public currentPageVenta: number = 1;
  public itemsPerPage: number = 3;

  obtenerProductos(){
    this.inventarioServicio.lista().subscribe({
      next : (data) => {
        if (data.length > 0){
          this.listaProductos = data;
          this.dibujarStock();
        }
      },
      error : (err) => {
        console.log(err.message);
      }
    });
  }

  obtenerVentas(){
    this.ventaServicio.lista().subscribe({
      next : (data) => {
        if (data.length > 0){
          this.listaVentas = data;
          this.procesarVentasPorDia();
          this.dibujarVentasPorDia();
        }
      },
      error : (err) => {
        console.log(err.message);
      }
    });
  }

  constructor(private router : Router){
    this.obtenerProductos();
    this.obtenerVentas();
  }

  nuevo(){
    this.router.navigate(["/inventario",0]);
  }

  nuevaVenta(){
    this.router.navigate(["/venta",0]);
  }
  
  editar(objeto : Inventario){
    this.router.navigate(["/inventario",objeto.idProducto]);
  }

  eliminar(objeto : Inventario){
    if(confirm("Desea eliminar el producto" + objeto.nombre)){
      this.inventarioServicio.eliminarProducto(objeto.idProducto).subscribe({
        next : (data) => {
          if(data.isSuccess){
            this.obtenerProductos();
          }else{
            alert("No se pudo eliminar el producto");
          }
        },
        error : (err) => {
          console.log(err.message);
        }
      });
    }
  }
  get paginatedData(): Inventario[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.listaProductos.length);
    return this.listaProductos.slice(startIndex, endIndex);
  }

  get paginatedDataVenta(): Venta[] {
    const startIndex = (this.currentPageVenta - 1) * this.itemsPerPage;
    const endIndex = Math.min(startIndex + this.itemsPerPage, this.listaVentas.length);
    return this.listaVentas.slice(startIndex, endIndex);
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  nextPageVenta(): void {
    if (this.currentPageVenta < this.totalPagesVenta) {
      this.currentPageVenta++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  prevPageVenta(): void {
    if (this.currentPageVenta > 1) {
      this.currentPageVenta--;
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  goToPageVenta(page: number): void {
    if (page >= 1 && page <= this.totalPagesVenta) {
      this.currentPageVenta = page;
    }
  }

  get totalPages(): number {
    return Math.ceil(this.listaProductos.length / this.itemsPerPage);
  }
  
  get totalPagesVenta(): number {
    return Math.ceil(this.listaVentas.length / this.itemsPerPage);
  }
  
  get pages(): number[] {
    const pagesArray = [];
    for (let i = 1; i <= this.totalPages; i++) {
      pagesArray.push(i);
    }
    return pagesArray;
  }

  get pagesVenta(): number[] {
    const pagesArray = [];
    for (let i = 1; i <= this.totalPagesVenta; i++) {
      pagesArray.push(i);
    }
    return pagesArray;
  }

  ventasPorDia: { [fecha: string]: number } = {};

  procesarVentasPorDia() {
    console.log(this.listaVentas);
    this.listaVentas.forEach(venta => {
      const fecha = venta.fecha;
      if (!this.ventasPorDia[fecha]) {
        this.ventasPorDia[fecha] = 0;
      }
      this.ventasPorDia[fecha] += venta.cantidad;
    });
  }
  
  dibujarVentasPorDia() {
    const ctx = document.getElementById('ventasChart') as HTMLCanvasElement;
    if (!ctx) return;

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: Object.keys(this.ventasPorDia),
        datasets: [{
          label: 'Ventas por día',
          data: Object.values(this.ventasPorDia),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: false
          }
        }
      }
    });
  }

  dibujarStock() {
    const labels = this.listaProductos.map(producto => producto.nombre);
  const stock = this.listaProductos.map(producto => producto.stock);

  const ctx = document.getElementById('stockChart') as HTMLCanvasElement;
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Stock de Productos',
        data: stock,
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }]
    },
    options: {
      indexAxis: 'y', // Cambia el eje del gráfico para que las etiquetas estén en el eje Y
      scales: {
        x: {
          beginAtZero: true
        }
      },
      layout: {
        padding: {
          left: 20, // Ajusta el espacio izquierdo del gráfico
          right: 20, // Ajusta el espacio derecho del gráfico
          top: 20, // Ajusta el espacio superior del gráfico
          bottom: 20 // Ajusta el espacio inferior del gráfico
        }
      }
    }
    });
  }
}