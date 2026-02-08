/* ================================
   TREINO ENGINE · LORDCosta
   Motor de geração de treinos
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

function filtrarPorNivel(lista, nivel) {
  const ordem = ["iniciante", "intermediario", "avancado"];
  const nivelIndex = ordem.indexOf(nivel);

  return lista.filter(e =>
    ordem.indexOf(e.nivel_minimo) <= nivelIndex
  );
}

function filtrarPorEquipamento(lista, equipamentos) {
  return lista.filter(e =>
    e.equipamento.some(eq => equipamentos.includes(eq))
  );
}

function ordenarPorPrioridade(lista) {
  return [...lista].sort((a, b) => a.prioridade - b.prioridade);
}

function embaralhar(lista) {
  return lista.sort(() => Math.random() - 0.5);
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
    console.error("Grupo muscular não encontrado:", grupo);
    return [];
  }

  const regrasGrupo = regrasDB[objetivo]?.[nivel];

  if (!regrasGrupo) {
    console.error("Regras não encontradas para:", objetivo, nivel);
    return [];
  }

  let lista = exerciciosDB[grupo];

  // Filtros
  lista = filtrarPorNivel(lista, nivel);
  lista = filtrarPorEquipamento(lista, equipamentos);

  // Prioridade + aleatoriedade controlada
  lista = ordenarPorPrioridade(lista);
  lista = embaralhar(lista);

  // Quantidade definida pelas regras
  const quantidade = regrasGrupo.exercicios;

  const treino = lista.slice(0, quantidade).map((e, index) => ({
    ordem: index + 1,
    exercicio: e.nome,
    series: regrasGrupo.series,
    repeticoes: regrasGrupo.repeticoes,
    descanso: regrasGrupo.descanso
  }));

  console.log("🔥 Treino gerado:", treino);
  return treino;
}

/* ================================
   API GLOBAL (para testes)
   ================================ */

window.TreinoEngine = {
  carregarJSONs,
  gerarTreino
};
