import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventarioService } from '../../Services/inventario.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Inventario } from '../../Models/Inventario';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css'
})
export class InventarioComponent implements OnInit {
  @Input("id") idProducto! : number;
  private inventarioServicio = inject(InventarioService);
  public formBuilder = inject(FormBuilder);

  public formProducto : FormGroup = this.formBuilder.group({
    nombre : [""],
    valorCompra : [0],
    stock : [0]
  });

  constructor(private router : Router) {}

  ngOnInit(): void {
    if (this.idProducto !=0){
      this.inventarioServicio.obtenerProducto(this.idProducto).subscribe({
        next : (data) => {
          this.formProducto.patchValue({
            nombre : data.nombre,
            valorCompra : data.valorCompra,
            stock : data.stock
          });
        },
        error : (err) => {
          console.log(err);
        }
      })
    }
  }

  guardar(){
    const objeto : Inventario = {
      idProducto: this.idProducto,
      nombre: this.formProducto.value.nombre,
      valorCompra: this.formProducto.value.valorCompra,
      stock: this.formProducto.value.stock,
      isSuccess: undefined
    }

    if(this.idProducto == 0){
      this.inventarioServicio.crearProducto(objeto).subscribe({
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
    }else{
      this.inventarioServicio.editarProducto(objeto).subscribe({
        next : (data) => {
          if (data.isSuccess){
            this.router.navigate(["/"]);
          }else{
            alert("Error al editar.")
          }
        },
        error : (err) => {
          console.log(err);
        }
      })
    }
  }

  volver(){
    this.router.navigate(["/"]);
  }
}
