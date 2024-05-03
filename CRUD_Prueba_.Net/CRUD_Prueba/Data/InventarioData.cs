using CRUD_Prueba.Models;
using System.Data;
using System.Data.SqlClient;

namespace CRUD_Prueba.Data
{
    public class InventarioData
    {
        private readonly string conexion;
        public InventarioData(IConfiguration configuration)
        {
            conexion = configuration.GetConnectionString("CadenaSQL")!;
        }

        public async Task<List<Inventario>> Lista()
        {
            List<Inventario> lista = new List<Inventario>();

            using (var con = new SqlConnection(conexion))
            {
                await con.OpenAsync();
                SqlCommand cmd = new SqlCommand("listaInventario", con);
                cmd.CommandType = CommandType.StoredProcedure;
            
                using (var reader = await cmd.ExecuteReaderAsync()) 
                {
                    while (await reader.ReadAsync())
                    {
                        lista.Add(new Inventario
                        {
                            IdProducto = Convert.ToInt32(reader["IdProducto"]),
                            Nombre = reader["Nombre"].ToString(),
                            Stock = Convert.ToInt32(reader["Stock"]),
                            ValorCompra = Convert.ToDecimal(reader["ValorCompra"])
                        });
                    }   
                }

                return lista;
            }
        }

        public async Task<Inventario> ObtenerProducto(int Id)
        {
            Inventario Producto = new Inventario();

            using (var con = new SqlConnection(conexion))
            {
                await con.OpenAsync();
                SqlCommand cmd = new SqlCommand("ObtenerProducto", con);
                cmd.Parameters.AddWithValue("@IdProducto", Id);
                cmd.CommandType = CommandType.StoredProcedure;

                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        Producto = new Inventario
                        {
                            IdProducto = Convert.ToInt32(reader["IdProducto"]),
                            Nombre = reader["Nombre"].ToString(),
                            Stock = Convert.ToInt32(reader["Stock"]),
                            ValorCompra = Convert.ToDecimal(reader["ValorCompra"])
                        };
                    }
                }

                return Producto;
            }
        }

        public async Task<bool> CrearProducto(Inventario producto)
        {
            bool respuesta = true;

            using (var con = new SqlConnection(conexion))
            {
                SqlCommand cmd = new SqlCommand("CrearProducto", con);
                cmd.Parameters.AddWithValue("@Nombre", producto.Nombre);
                cmd.Parameters.AddWithValue("@ValorCompra", producto.ValorCompra);
                cmd.Parameters.AddWithValue("@Stock", producto.Stock);
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

        public async Task<bool> EditarProducto(Inventario producto)
        {
            bool respuesta = true;

            using (var con = new SqlConnection(conexion))
            {
                SqlCommand cmd = new SqlCommand("EditarProducto", con);
                cmd.Parameters.AddWithValue("@IdProducto", producto.IdProducto);
                cmd.Parameters.AddWithValue("@Nombre", producto.Nombre);
                cmd.Parameters.AddWithValue("@Stock", producto.Stock);
                cmd.Parameters.AddWithValue("@ValorCompra", producto.ValorCompra);
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

        public async Task<bool> EliminarProducto(int id)
        {
            bool respuesta = true;

            using (var con = new SqlConnection(conexion))
            {
                SqlCommand cmd = new SqlCommand("EliminarProducto", con);
                cmd.Parameters.AddWithValue("@IdProducto", id);
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
