namespace CRUD_Prueba.Models
{
    public class Inventario
    {
        public int IdProducto { get; set; }
        public string? Nombre { get; set; }
        public decimal ValorCompra { get; set; }
        public int Stock { get; set; }
    }
}
