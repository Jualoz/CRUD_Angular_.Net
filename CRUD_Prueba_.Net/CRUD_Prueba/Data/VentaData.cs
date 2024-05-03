using CRUD_Prueba.Models;
using System.Data;
using System.Data.SqlClient;

namespace CRUD_Prueba.Data
{
    public class VentaData
    {
        private readonly string conexion;
        public VentaData(IConfiguration configuration)
        {
            conexion = configuration.GetConnectionString("CadenaSQL")!;
        }

        public async Task<List<Venta>> Lista()
        {
            List<Venta> lista = new List<Venta>();

            using (var con = new SqlConnection(conexion))
            {
                await con.OpenAsync();
                SqlCommand cmd = new SqlCommand("listaVenta", con);
                cmd.CommandType = CommandType.StoredProcedure;
            
                using (var reader = await cmd.ExecuteReaderAsync()) 
                {
                    while (await reader.ReadAsync())
                    {
                        lista.Add(new Venta
                        {
                            IdVenta = Convert.ToInt32(reader["IdVenta"]),
                            Cantidad = Convert.ToInt32(reader["Cantidad"]),
                            ValorVenta = Convert.ToDecimal(reader["ValorVenta"]),
                            Fecha = reader["Fecha"].ToString(),
                            IdProductoFk = Convert.ToInt32(reader["IdProductoFk"])
                        });
                    }   
                }

                return lista;
            }
        }

        public async Task<Venta> ObtenerVenta(int Id)
        {
            Venta Objeto = new Venta();

            using (var con = new SqlConnection(conexion))
            {
                await con.OpenAsync();
                SqlCommand cmd = new SqlCommand("ObtenerVenta", con);
                cmd.Parameters.AddWithValue("@IdVenta", Id);
                cmd.CommandType = CommandType.StoredProcedure;

                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        Objeto = new Venta
                        {
                            IdVenta = Convert.ToInt32(reader["IdVenta"]),
                            Cantidad = Convert.ToInt32(reader["Cantidad"]),
                            ValorVenta = Convert.ToDecimal(reader["ValorVenta"]),
                            Fecha = reader["Fecha"].ToString(),
                            IdProductoFk = Convert.ToInt32(reader["IdProductoFk"])
                        };
                    }
                }

                return Objeto;
            }
        }

        public async Task<bool> RealizarVenta(Venta venta)
        {
            bool respuesta = true;

            using (var con = new SqlConnection(conexion))
            {
                SqlCommand cmd = new SqlCommand("RealizarVenta", con);
                cmd.Parameters.AddWithValue("@IdProducto", venta.IdProductoFk);
                cmd.Parameters.AddWithValue("@Cantidad", venta.Cantidad);
                cmd.Parameters.AddWithValue("@Fecha", venta.Fecha);
                cmd.CommandType = CommandType.StoredProcedure;

                try
                {
                    await con.OpenAsync();
                    respuesta = await cmd.ExecuteNonQueryAsync() > 0 ? true : false;
                }
                catch
                {
                    respuesta = false;
                }

                return respuesta;
            }
        }
    }
}
