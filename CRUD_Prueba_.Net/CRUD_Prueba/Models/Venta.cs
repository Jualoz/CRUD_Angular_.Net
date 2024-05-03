namespace CRUD_Prueba.Models
{
    public class Venta
    {
        public int IdVenta { get; set; }
        public int Cantidad { get; set; }
        public decimal ValorVenta { get; set; }
        public string? Fecha { get; set; }
        public int IdProductoFk { get; set; }
    }
}
