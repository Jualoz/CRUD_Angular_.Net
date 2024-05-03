import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VentaService } from '../../Services/venta.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Venta } from '../../Models/Venta';

@Component({
  selector: 'app-venta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './venta.component.html',
  styleUrl: './venta.component.css'
})
export class VentaComponent implements OnInit {
  @Input("id") idVenta! : number;
  private VentaServicio = inject(VentaService);
  public formBuilder = inject(FormBuilder);

  public formVenta : FormGroup = this.formBuilder.group({
    cantidad: [0],
    valorVenta: [0],
    fecha: [""],
    idProductoFk: [0],
  });

  constructor(private router : Router) {}

  ngOnInit(): void {
    if (this.idVenta !=0){
      this.VentaServicio.obtenerVenta(this.idVenta).subscribe({
        next : (data) => {
          this.formVenta.patchValue({
            cantidad : data.cantidad,
            valorVenta : data.valorVenta,
            fecha : data.fecha,
            idProductoFk : data.idProductoFk
          });
        },
        error : (err) => {
          console.log(err);
        }
      })
    }
  }

  guardar(){
    const objeto : Venta = {
      idVenta: this.idVenta,
      cantidad: this.formVenta.value.cantidad,
      valorVenta: this.formVenta.value.valorVenta,
      fecha: this.formVenta.value.fecha,
      idProductoFk: this.formVenta.value.idProductoFk,
      // isSuccess: undefined
    }

    this.VentaServicio.realizarVenta(objeto).subscribe({
      next : (data) => {
        if (data.isSuccess){
          this.router.navigate(["/"]);
        }else{
          alert("Error al crear.")
        }
      },
      error : (err) => {
        console.log(err);
      }
    })
    
  }

  volver(){
    this.router.navigate(["/"]);
  }
}
