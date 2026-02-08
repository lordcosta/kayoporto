/* ================================
   TREINO ENGINE · LORDCosta
   TORETTO EDITION 🏁
   ================================ */

const DATA_PATH = "data/";

let exerciciosDB = {};
let regrasDB = {};

/* ================================
   LOADERS
   ================================ */

async function carregarJSONs() {
  const [exRes, regrasRes] = await Promise.all([
    fetch(DATA_PATH + "exercicios.json"),
    fetch(DATA_PATH + "regras.json")
  ]);

  exerciciosDB = await exRes.json();
  regrasDB = await regrasRes.json();

  console.log("✔ Exercícios carregados");
  console.log("✔ Regras carregadas");
}

/* ================================
   UTILITÁRIOS
   ================================ */

function nivelPermitido(exercicio, nivelUsuario) {
  const ordem = ["iniciante", "intermediario", "avancado"];
  return (
    ordem.indexOf(exercicio.nivel_minimo) <=
    ordem.indexOf(nivelUsuario)
  );
}

function filtrarEquipamentos(exercicio, equipamentos) {
  if (!equipamentos || equipamentos.length === 0) return true;
  return exercicio.equipamento.some(e => equipamentos.includes(e));
}

function ordenarPorPrioridade(lista) {
  return [...lista].sort((a, b) => a.prioridade - b.prioridade);
}

function embaralhar(lista) {
  return [...lista].sort(() => Math.random() - 0.5);
}

/* ================================
   MOTOR PRINCIPAL
   ================================ */

function gerarTreino(config) {
  const {
    grupo,
    nivel,
    objetivo,
    equipamentos = []
  } = config;

  if (!exerciciosDB[grupo]) {
    console.error("❌ Grupo muscular não encontrado:", grupo);
    return [];
  }

  /* ================================
     QUANTIDADE DE EXERCÍCIOS
     ================================ */

  const qtd =
    regrasDB.quantidade_exercicios_por_grupo?.[grupo]?.[nivel] ??
    regrasDB.fallbacks?.exercicios ??
    4;

  /* ================================
     FILTRAGEM BASE
     ================================ */

  let lista = exerciciosDB[grupo]
    .filter(e => nivelPermitido(e, nivel))
    .filter(e => filtrarEquipamentos(e, equipamentos));

  if (lista.length === 0) {
    console.warn("⚠ Nenhum exercício após filtros. Usando fallback.");
    lista = exerciciosDB[grupo];
  }

  /* ================================
     ORDEM DOS EXERCÍCIOS
     ================================ */

  const ordemPreferida =
    regrasDB.ordem_exercicios?.[objetivo] ||
    regrasDB.ordem_exercicios?.padrao ||
    ["composto", "isolador", "isometrico"];

  lista = lista.sort((a, b) =>
    ordemPreferida.indexOf(a.tipo) -
    ordemPreferida.indexOf(b.tipo)
  );

  /* ================================
     PRIORIDADE + ALEATORIEDADE
     ================================ */

  lista = ordenarPorPrioridade(lista);
  lista = embaralhar(lista);

  /* ================================
     SELEÇÃO FINAL
     ================================ */

  const selecionados = lista.slice(0, qtd);

  /* ================================
     PARÂMETROS DE EXECUÇÃO
     ================================ */

  const series =
    regrasDB.limites?.series?.[objetivo]?.[nivel] ??
    regrasDB.fallbacks?.series ??
    3;

  const repeticoes =
    regrasDB.limites?.repeticoes?.[objetivo]?.[nivel] ??
    regrasDB.fallbacks?.repeticoes ??
    "8–12";

  const descanso =
    regrasDB.limites?.descanso?.[objetivo]?.[nivel] ??
    regrasDB.fallbacks?.descanso ??
    "60–90s";

  /* ================================
     TREINO FINAL
     ================================ */

  const treino = selecionados.map((e, index) => ({
    ordem: index + 1,
    exercicio: e.nome,
    tipo: e.tipo,
    series,
    repeticoes,
    descanso
  }));

  console.log("🔥 TREINO GERADO (TORETTO MODE):", treino);
  return treino;
}

/* ================================
   API GLOBAL
   ================================ */

window.TreinoEngine = {
  carregarJSONs,
  gerarTreino
};
