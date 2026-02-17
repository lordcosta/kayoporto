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
    carregamentoEmAndamento = fetch(DIVISOES_URL)
      .then((res) => {
        if (!res?.ok) {
          return {};
        }
        return res.json();
      })
      .catch(() => ({}));
  }

  divisoesDB = await carregamentoEmAndamento;
  return divisoesDB;
}

/* ================================
   UTILITÁRIOS
   ================================ */

function normalizarChaveDivisao(divisao) {
  if (!divisao) {
    return "";
  }

  // Remove separadores para permitir equivalências como:
  // "Full Body", "full-body", "full_body" => "FULLBODY"
  return String(divisao)
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase();
}

function criarMapaDeDivisoes(divisoes) {
  const mapa = {};

  Object.values(divisoes || {}).forEach((grupoPorNivel) => {
    Object.entries(grupoPorNivel || {}).forEach(([nomeDivisao, dias]) => {
      if (!Array.isArray(dias)) {
        return;
      }

      const chave = normalizarChaveDivisao(nomeDivisao);
      if (!chave) {
        return;
      }

      mapa[chave] = dias;
    });
  });

  return mapa;
}

function montarDias(dias) {
  return (dias || []).map((grupos, index) => ({
    dia: index + 1,
    grupos: Array.isArray(grupos) ? grupos : []
  }));
}

function obterChaveFinal(chaveSolicitada, mapa) {
  if (chaveSolicitada && mapa[chaveSolicitada]) {
    return chaveSolicitada;
  }

  if (mapa.ABC) {
    return "ABC";
  }

  return Object.keys(mapa)[0] || "ABC";
}

/* ================================
   MOTOR PRINCIPAL
   ================================ */

async function obterDiasDaDivisao(divisao) {
  const divisoes = await carregarDivisoes();
  const mapa = criarMapaDeDivisoes(divisoes);

  const chaveSolicitada = normalizarChaveDivisao(divisao);
  const chaveFinal = obterChaveFinal(chaveSolicitada, mapa);

  return {
    divisao: chaveFinal,
    dias: montarDias(mapa[chaveFinal] || [])
  };
}

async function executar(input) {
  const { divisao } = input || {};
  const resultado = await obterDiasDaDivisao(divisao);

  return {
    divisao: resultado.divisao,
    frequenciaSemanal: resultado.dias.length,
    dias: resultado.dias
  };
}

/* ================================
   API GLOBAL
   ================================ */

window.DivisorEngine = {
  executar,
  obterDiasDaDivisao
};
