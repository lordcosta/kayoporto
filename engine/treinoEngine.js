/* ================================
   TREINO ENGINE · LORDCosta
   Motor de geração de treinos
   TORETTO MODE™
   ================================ */

const DATA_PATH = "../data/";

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

function filtrarPorNivel(lista, nivel) {
  const ordem = ["iniciante", "intermediario", "avancado"];
  const nivelIndex = ordem.indexOf(nivel);

  return lista.filter(e =>
    ordem.indexOf(e.nivel_minimo) <= nivelIndex
  );
}

function filtrarPorEquipamento(lista, equipamentos) {
  if (!equipamentos || equipamentos.length === 0) return lista;

  return lista.filter(e =>
    e.equipamento.some(eq => equipamentos.includes(eq))
  );
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
    nivel = "iniciante",
    equipamentos = []
  } = config;

  if (!exerciciosDB[grupo]) {
    console.error("❌ Grupo muscular não encontrado:", grupo);
    return [];
  }

  let lista = exerciciosDB[grupo];

  // Aplicar filtros
  lista = filtrarPorNivel(lista, nivel);
  lista = filtrarPorEquipamento(lista, equipamentos);

  if (lista.length === 0) {
    console.warn("⚠ Nenhum exercício disponível após filtros");
    return [];
  }

  // Ordenar + leve aleatoriedade
  lista = ordenarPorPrioridade(lista);
  lista = embaralhar(lista);

  // Quantidade de exercícios (engine moderno)
  const quantidade =
    regrasDB.quantidade_exercicios_por_grupo?.[grupo] ||
    regrasDB.fallbacks?.quantidade_exercicios ||
    4;

  // Parâmetros padrão (fallback seguro)
  const series = regrasDB.fallbacks?.series || "3–4";
  const repeticoes = regrasDB.fallbacks?.repeticoes || "8–12";
  const descanso = regrasDB.fallbacks?.descanso || "60–90s";

  const treino = lista.slice(0, quantidade).map((e, index) => ({
    ordem: index + 1,
    exercicio: e.nome,
    series,
    repeticoes,
    descanso
  }));

  console.log("🔥 TREINO GERADO (TORETTO MODE):", treino);
  return treino;
}

/* ================================
   API GLOBAL (browser-safe)
   ================================ */

window.TreinoEngine = {
  carregarJSONs,
  gerarTreino
};
