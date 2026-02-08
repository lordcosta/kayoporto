/* ================================
   SEMANA ENGINE · LORDCosta
   Orquestrador geral de treinos
   ================================ */

async function gerarSemana(config) {
  const {
    divisor,
    nivel = "iniciante",
    objetivo = "hipertrofia",
    equipamentos = []
  } = config;

  // Garantir dados carregados
  await TreinoEngine.carregarJSONs();

  const estrutura = DivisorEngine.gerarDivisao({ tipo: divisor });
  if (!estrutura) return null;

  const semana = [];
  let abdomenUsado = 0;
  const maxAbdomen = estrutura.abdomen?.frequencia || 0;

  estrutura.dias.forEach((dia, index) => {
    const treinoDia = [];

    dia.grupos.forEach(grupo => {
      const treinoGrupo = TreinoEngine.gerarTreino({
        grupo,
        nivel,
        equipamentos
      });

      treinoDia.push({
        grupo,
        exercicios: treinoGrupo
      });
    });

    // Injeção de abdômen (camada transversal)
    if (
      maxAbdomen > 0 &&
      abdomenUsado < maxAbdomen &&
      !dia.grupos.includes("pernas")
    ) {
      const treinoAbdomen = TreinoEngine.gerarTreino({
        grupo: "abdomen",
        nivel,
        equipamentos
      });

      treinoDia.push({
        grupo: "abdomen",
        exercicios: treinoAbdomen
      });

      abdomenUsado++;
    }

    semana.push({
      dia: `Dia ${dia.dia}`,
      grupos: dia.grupos,
      treino: treinoDia
    });
  });

  console.log("📆 SEMANA GERADA:", semana);
  return semana;
}

/* ================================
   API GLOBAL
   ================================ */

window.SemanaEngine = {
  gerarSemana
};
