using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CRUD_Prueba.Data;
using CRUD_Prueba.Models;

namespace CRUD_Prueba.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InventarioController : ControllerBase
    {
        private readonly InventarioData _data;
        
        public InventarioController(InventarioData data)
        {
            _data = data;
        }

        [HttpGet]
        public async Task<IActionResult> Lista()
        {
            List<Inventario> Lista =  await _data.Lista();
            return StatusCode(StatusCodes.Status200OK, Lista);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> ObtenerProducto(int id)
        {
            Inventario Producto = await _data.ObtenerProducto(id);
            return StatusCode(StatusCodes.Status200OK, Producto);
        }

        [HttpPost]
        public async Task<IActionResult> CrearProducto([FromBody]Inventario producto)
        {
            bool respuesta = await _data.CrearProducto(producto);
            return StatusCode(StatusCodes.Status200OK, new { isSuccess = respuesta });
        }

        [HttpPut]
        public async Task<IActionResult> EditarProducto([FromBody] Inventario producto)
        {
            bool respuesta = await _data.EditarProducto(producto);
            return StatusCode(StatusCodes.Status200OK, new { isSuccess = respuesta });
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> EliminarProducto(int id)
        {
            bool respuesta = await _data.EliminarProducto(id);
            return StatusCode(StatusCodes.Status200OK, new { isSuccess = respuesta });
        }
    }
}
