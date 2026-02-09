/* ================================
   DIVISOR ENGINE · LORDCosta
   Define a divisão semanal de treino
   ================================ */

// Resolver JSON via import.meta.url para funcionar em subpastas (GitHub Pages).
const DIVISOES_URL = new URL("../data/divisoes.json", import.meta.url);

let divisoesDB = null;
let carregamentoEmAndamento = null;

/* ================================
   LOADERS
   ================================ */

async function carregarDivisoes() {
  if (divisoesDB) {
    return divisoesDB;
  }

  if (!carregamentoEmAndamento) {
    carregamentoEmAndamento = fetch(DIVISOES_URL).then((res) => res.json());
  }

  divisoesDB = await carregamentoEmAndamento;
  return divisoesDB;
}

/* ================================
   UTILITÁRIOS
   ================================ */

function normalizarDivisao(divisao) {
  if (!divisao) {
    return "";
  }
  return String(divisao).trim().toLowerCase();
}

function criarMapaDeDivisoes(divisoes) {
  const mapa = {};

  Object.values(divisoes || {}).forEach((grupo) => {
    Object.entries(grupo || {}).forEach(([nome, dias]) => {
      if (Array.isArray(dias)) {
        mapa[nome.toUpperCase()] = dias;
      }
    });
  });

  return mapa;
}

function montarResposta(divisao, dias) {
  const diasFormatados = (dias || []).map((grupos, index) => ({
    dia: index + 1,
    grupos
  }));

  return {
    divisao,
    frequenciaSemanal: diasFormatados.length,
    dias: diasFormatados
  };
}

/* ================================
   MOTOR PRINCIPAL
   ================================ */

async function executar(input) {
  const { divisao } = input || {};
  const divisoes = await carregarDivisoes();
  const mapa = criarMapaDeDivisoes(divisoes);

  const chaveSolicitada = normalizarDivisao(divisao).toUpperCase();
  const chaveFallback = mapa.ABC ? "ABC" : Object.keys(mapa)[0] || "ABC";
  const chaveFinal = mapa[chaveSolicitada] ? chaveSolicitada : chaveFallback;

  return montarResposta(chaveFinal, mapa[chaveFinal] || []);
}

/* ================================
   API GLOBAL
   ================================ */

window.DivisorEngine = {
  executar
};
