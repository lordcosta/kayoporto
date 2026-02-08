// engine/treinoEngine.js
// Motor de geração automática de treino
// LORDCosta • Projeto Kayo Porto

const DATA_PATH = "/data/";

/**
 * Carrega JSON de forma segura
 */
async function loadJSON(file) {
  const res = await fetch(DATA_PATH + file);
  if (!res.ok) {
    throw new Error(`Erro ao carregar ${file}`);
  }
  return await res.json();
}

/**
 * Filtra exercícios com base nas regras
 */
function filtrarExercicios(lista, { nivel, equipamentos }) {
  return lista.filter(ex => {
    const nivelOk =
      ex.nivel_minimo === nivel ||
      (nivel === "intermediario" && ex.nivel_minimo === "iniciante") ||
      (nivel === "avancado");

    const equipamentoOk =
      ex.equipamento.length === 0 ||
      ex.equipamento.some(eq => equipamentos.includes(eq));

    return nivelOk && equipamentoOk;
  });
}

/**
 * Seleciona exercícios respeitando prioridade
 */
function selecionarPorPrioridade(lista, quantidade) {
  return lista
    .sort((a, b) => a.prioridade - b.prioridade)
    .slice(0, quantidade);
}

/**
 * Gera treino completo
 */
export async function gerarTreino({
  grupo,
  nivel,
  objetivo,
  equipamentos
}) {
  const exerciciosData = await loadJSON("exercicios.json");
  const regras = await loadJSON("regras.json");

  const regrasGrupo = regras[grupo];
  if (!regrasGrupo) {
    throw new Error(`Grupo muscular inválido: ${grupo}`);
  }

  const config = regrasGrupo[objetivo];
  if (!config) {
    throw new Error(`Objetivo inválido para ${grupo}: ${objetivo}`);
  }

  const listaBase = exerciciosData[grupo] || [];
  const filtrados = filtrarExercicios(listaBase, {
    nivel,
    equipamentos
  });

  const selecionados = selecionarPorPrioridade(
    filtrados,
    config.quantidade_exercicios
  );

  const treino = selecionados.map(ex => ({
    id: ex.id,
    nome: ex.nome,
    tipo: ex.tipo,
    series: config.series,
    repeticoes: config.repeticoes,
    descanso: config.descanso,
    observacao: ex.tipo === "composto"
      ? "Manter técnica perfeita"
      : "Controle total do movimento"
  }));

  return {
    grupo,
    nivel,
    objetivo,
    total_exercicios: treino.length,
    treino
  };
}
