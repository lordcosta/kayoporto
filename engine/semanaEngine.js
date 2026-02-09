/* ================================
   SEMANA ENGINE · LORDCosta
   Orquestrador geral de treinos
   ================================ */

async function gerarSemana(input) {
  const {
    divisao,
    nivel = "iniciante",
    equipamentos = [],
    objetivo = ""
  } = input || {};

  // Garantir dados carregados no TreinoEngine
  if (typeof TreinoEngine?.init === "function") {
    await TreinoEngine.init();
  }

  // 1. Chamar DivisorEngine.executar({ divisao })
  const estrutura = await DivisorEngine.executar({ divisao });
  const diasSemana = Array.isArray(estrutura?.dias) ? estrutura.dias : [];

  const semana = [];
  let ultimoExtra = null;
  const extrasPossiveis = ["abdomen", "lombar"];

  diasSemana.forEach((diaInfo, index) => {
    const gruposDia = Array.isArray(diaInfo?.grupos) ? diaInfo.grupos : [];
    const exerciciosDia = [];

    // 2. Para cada grupo muscular do dia -> TreinoEngine.gerarTreino()
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

    // 4. Injetar abdômen e/ou lombar (sem dia exclusivo e sem repetição consecutiva)
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

    // 3. Agregar os exercícios por dia
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
