using Microsoft.AspNetCore.Mvc;

namespace ClyvoApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IAController : ControllerBase
    {
        [HttpPost("analisar-saude")]
        public IActionResult AnalisarSaudePet([FromBody] PetAnaliseDto dados)
        {
            if (string.IsNullOrEmpty(dados.Nome) || string.IsNullOrEmpty(dados.Sintomas))
            {
                return BadRequest(new { erro = "Nome e sintomas são obrigatórios para a análise da IA." });
            }

            // Lógica inteligente simulada/integrada para recomendação veterinária personalizada
            string recomendacaoIA = $"[IA Clyvo Vet]: Com base nos sintomas informados ('{dados.Sintomas}') para o pet {dados.Nome}, " +
                                    "recomenda-se monitorar a temperatura nas próximas 4 horas, garantir hidratação constante " +
                                    "e agendar uma avaliação preventiva caso os sintomas persistam.";

            var resultado = new
            {
                Sucesso = true,
                Pet = dados.Nome,
                AnaliseClinica = recomendacaoIA,
                NivelUrgencia = dados.Sintomas.Contains("dor", StringComparison.OrdinalIgnoreCase) ? "Alto" : "Moderado",
                DataAnalise = DateTime.Now
            };

            return Ok(resultado);
        }
    }

    public class PetAnaliseDto
    {
        public string Nome { get; set; }
        public string Especie { get; set; }
        public string Sintomas { get; set; }
    }
}