/* ================================
   TREINO ENGINE · LORDCosta
   Motor de geração de treinos
   TORETTO MODE™
   ================================ */

// Resolver JSONs via import.meta.url para funcionar em subpastas (GitHub Pages).
const DATA_BASE_URL = new URL("../data/", import.meta.url);
const EXERCICIOS_URL = new URL("exercicios.json", DATA_BASE_URL);
const REGRAS_URL = new URL("regras.json", DATA_BASE_URL);
const NIVEL_ORDEM = ["iniciante", "intermediario", "avancado"];

let exerciciosDB = {};
let regrasDB = {};

/* ================================
   LOADERS
   ================================ */

async function init() {
  const [exRes, regrasRes] = await Promise.all([
    fetch(EXERCICIOS_URL),
    fetch(REGRAS_URL)
  ]);

  exerciciosDB = await exRes.json();
  regrasDB = await regrasRes.json();
}

/* ================================
   UTILITÁRIOS
   ================================ */

function normalizarNivel(nivel) {
  return NIVEL_ORDEM.includes(nivel) ? nivel : "iniciante";
}

function obterListaDoGrupo(grupoMuscular) {
  const lista = exerciciosDB?.[grupoMuscular];
  if (Array.isArray(lista)) {
    return lista;
  }

  // Fallback seguro: usa todos os grupos disponíveis
  return Object.values(exerciciosDB || {}).flat();
}

function filtrarPorNivel(lista, nivel) {
  const nivelIndex = NIVEL_ORDEM.indexOf(nivel);

  return lista.filter((exercicio) => {
    const minimo = exercicio?.nivel_minimo || "iniciante";
    return NIVEL_ORDEM.indexOf(minimo) <= nivelIndex;
  });
}

function filtrarPorEquipamento(lista, equipamentos) {
  if (!Array.isArray(equipamentos) || equipamentos.length === 0) {
    return lista;
  }

  return lista.filter((exercicio) => {
    const necessario = Array.isArray(exercicio?.equipamento)
      ? exercicio.equipamento
      : [];
    return necessario.length === 0 || necessario.some((eq) => equipamentos.includes(eq));
  });
}

function ordenarPorPrioridade(lista) {
  return [...lista].sort((a, b) => {
    const prioridadeA = Number.isFinite(a?.prioridade) ? a.prioridade : 999;
    const prioridadeB = Number.isFinite(b?.prioridade) ? b.prioridade : 999;
    return prioridadeA - prioridadeB;
  });
}

function obterQuantidade(grupoMuscular) {
  return (
    regrasDB?.quantidade_exercicios_por_grupo?.[grupoMuscular] ||
    regrasDB?.fallbacks?.quantidade_exercicios ||
    4
  );
}

function obterFallbacks() {
  return {
    series: regrasDB?.fallbacks?.series || "3–4",
    repeticoes: regrasDB?.fallbacks?.repeticoes || "8–12",
    descanso: regrasDB?.fallbacks?.descanso || "60–90s"
  };
}

function garantirQuantidade(lista, quantidade, fallbackLista) {
  if (lista.length >= quantidade) {
    return lista.slice(0, quantidade);
  }

  const faltam = quantidade - lista.length;
  const complemento = fallbackLista.filter((item) => !lista.includes(item)).slice(0, faltam);
  return [...lista, ...complemento].slice(0, quantidade);
}

/* ================================
   MOTOR PRINCIPAL
   ================================ */

function gerarTreino(input) {
  const {
    grupoMuscular,
    nivel = "iniciante",
    equipamentos = []
  } = input || {};

  const nivelNormalizado = normalizarNivel(nivel);
  const listaBase = obterListaDoGrupo(grupoMuscular);

  // 1. Filtrar por grupo muscular (já aplicado em obterListaDoGrupo)
  // 2. Filtrar por nível mínimo permitido
  let listaFiltrada = filtrarPorNivel(listaBase, nivelNormalizado);
  // 3. Filtrar por equipamentos disponíveis
  listaFiltrada = filtrarPorEquipamento(listaFiltrada, equipamentos);
  // 4. Ordenar por prioridade (menor valor primeiro)
  listaFiltrada = ordenarPorPrioridade(listaFiltrada);

  const quantidade = obterQuantidade(grupoMuscular);
  const { series, repeticoes, descanso } = obterFallbacks();

  // 5. Aplicar quantidade definida em regras.json
  // 6. Aplicar fallback seguro se não houver exercícios suficientes
  const listaFallback = ordenarPorPrioridade(listaBase);
  const selecionados = garantirQuantidade(listaFiltrada, quantidade, listaFallback);

  // 7. Nunca retornar array vazio
  const fallbackExercicio = listaFallback[0] || { nome: "Exercício" };
  const treinoBase = selecionados.length > 0 ? selecionados : [fallbackExercicio];

  return treinoBase.map((exercicio) => ({
    nome: exercicio.nome,
    series,
    repeticoes,
    descanso
  }));
}

/* ================================
   API GLOBAL (browser-safe)
   ================================ */

window.TreinoEngine = {
  init,
  gerarTreino
};
