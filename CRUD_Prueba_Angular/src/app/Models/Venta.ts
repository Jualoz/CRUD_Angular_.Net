export interface Venta {
  idVenta: number;
  cantidad: number;
  valorVenta: number;
  fecha: string;
  idProductoFk: number;
}
