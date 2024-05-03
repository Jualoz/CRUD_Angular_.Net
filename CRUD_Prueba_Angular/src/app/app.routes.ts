import { Routes } from '@angular/router';
import { InicioComponent } from './Pages/inicio/inicio.component';
import { InventarioComponent } from './Pages/inventario/inventario.component';
import { VentaComponent } from './Pages/venta/venta.component';

export const routes: Routes = [
    { path : "", component : InicioComponent},
    { path : "inicio", component : InicioComponent},
    { path : "inventario/:id", component : InventarioComponent},
    { path : "venta/:id", component : VentaComponent}
];
