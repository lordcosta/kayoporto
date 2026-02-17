/* ================================
   SEMANA ENGINE · LORDCosta
   Orquestrador geral de treinos
   ================================ */

async function gerarSemana(input) {
  const {
    divisao,
    nivel = "iniciante",
    objetivo = "",
    equipamentos = []
  } = input || {};

  // Garantir dados carregados no TreinoEngine
  if (typeof TreinoEngine?.init === "function") {
    await TreinoEngine.init();
  }

  // Obtém os dias dinamicamente do divisor selecionado.
  // Mantém compatibilidade com versões anteriores do DivisorEngine.
  let diasSemana = [];
  try {
    if (typeof DivisorEngine?.obterDiasDaDivisao === "function") {
      const estrutura = await DivisorEngine.obterDiasDaDivisao(divisao);
      diasSemana = Array.isArray(estrutura?.dias) ? estrutura.dias : [];
    } else {
      const estrutura = await DivisorEngine.executar({ divisao });
      diasSemana = Array.isArray(estrutura?.dias) ? estrutura.dias : [];
    }
  } catch {
    diasSemana = [];
  }

  const semana = [];
  let ultimoExtra = null;
  const extrasPossiveis = ["abdomen", "lombar"];

  diasSemana.forEach((diaInfo, index) => {
    const gruposDia = Array.isArray(diaInfo?.grupos) ? diaInfo.grupos : [];
    const exerciciosDia = [];

    // Para cada grupo muscular do dia -> TreinoEngine.gerarTreino()
    gruposDia.forEach((grupo) => {
      const lista = TreinoEngine.gerarTreino({
        grupoMuscular: grupo,
        nivel,
        equipamentos,
        objetivo
      });

      exerciciosDia.push({
        grupo,
        lista
      });
    });

    // Extra opcional de core/lombar (mantido para compatibilidade atual)
    const jaTemExtra = gruposDia.includes("abdomen") || gruposDia.includes("lombar");
    if (!jaTemExtra && gruposDia.length > 0) {
      const proximoExtra = extrasPossiveis.find((extra) => extra !== ultimoExtra);
      if (proximoExtra) {
        const listaExtra = TreinoEngine.gerarTreino({
          grupoMuscular: proximoExtra,
          nivel,
          equipamentos,
          objetivo
        });

        if (Array.isArray(listaExtra) && listaExtra.length > 0) {
          exerciciosDia.push({
            grupo: proximoExtra,
            lista: listaExtra
          });
          ultimoExtra = proximoExtra;
        }
      }
    }

    semana.push({
      dia: `Dia ${diaInfo?.dia ?? index + 1}`,
      grupos: gruposDia,
      exercicios: exerciciosDia
    });
  });

  // Fallback obrigatório: nunca retornar estrutura vazia
  if (semana.length === 0) {
    return [
      {
        dia: "Dia 1",
        grupos: [],
        exercicios: []
      }
    ];
  }

  return semana;
}

/* ================================
   API GLOBAL
   ================================ */

window.SemanaEngine = {
  gerarSemana
};
