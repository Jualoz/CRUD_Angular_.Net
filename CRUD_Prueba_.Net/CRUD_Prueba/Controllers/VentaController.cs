using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CRUD_Prueba.Data;
using CRUD_Prueba.Models;

namespace CRUD_Prueba.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VentaController : ControllerBase
    {
        private readonly VentaData _data;
        
        public VentaController(VentaData data)
        {
            _data = data;
        }

        [HttpGet]
        public async Task<IActionResult> Lista()
        {
            List<Venta> Lista =  await _data.Lista();
            return StatusCode(StatusCodes.Status200OK, Lista);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> ObtenerVenta(int id)
        {
            Venta Objeto = await _data.ObtenerVenta(id);
            return StatusCode(StatusCodes.Status200OK, Objeto);
        }

        [HttpPost]
        public async Task<IActionResult> Realizarventa([FromBody]Venta venta)
        {
            bool respuesta = await _data.RealizarVenta(venta);
            return StatusCode(StatusCodes.Status200OK, new { isSuccess = respuesta });
        }
    }
}
