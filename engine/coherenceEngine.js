/* ================================
   COERÊNCIA ENGINE · LORDCosta
   Camada modular de coerência clínica
   ================================ */

const COHERENCE_JSON_PATH = "./data/coerenciaMensagens.json";

let mensagensCache = null;
let mensagensPromise = null;

function normalizarTexto(valor) {
  return String(valor || "").trim().toLowerCase();
}

function escolherAleatoria(lista) {
  if (!Array.isArray(lista) || lista.length === 0) {
    return null;
  }
  const indice = Math.floor(Math.random() * lista.length);
  return lista[indice];
}

async function carregarMensagens() {
  if (mensagensCache) {
    return mensagensCache;
  }

  if (!mensagensPromise) {
    mensagensPromise = fetch(COHERENCE_JSON_PATH)
      .then((resposta) => {
        if (!resposta.ok) {
          throw new Error(`Falha ao carregar JSON de coerência (${resposta.status}).`);
        }
        return resposta.json();
      })
      .then((dados) => {
        mensagensCache = dados || {};
        return mensagensCache;
      })
      .catch((erro) => {
        mensagensPromise = null;
        throw erro;
      });
  }

  return mensagensPromise;
}

async function gerarMensagensCoerencia({
  imc,
  estrategiaNutricional,
  enfaseTreino,
  nivelTreino,
  diasTreino
} = {}) {
  const mensagensBase = await carregarMensagens();
  const mensagens = [];

  const estrategia = normalizarTexto(estrategiaNutricional);
  const enfase = normalizarTexto(enfaseTreino);
  const nivel = normalizarTexto(nivelTreino);
  const dias = Number(diasTreino);
  const imcNumero = Number(imc);

  if (estrategia === "déficit calórico" && enfase === "hipertrofia") {
    const categoria = mensagensBase?.deficit_hipertrofia;
    const subcategoria = categoria?.[nivel] || categoria?.iniciante;
    const mensagem = escolherAleatoria(subcategoria);
    if (mensagem) {
      mensagens.push(mensagem);
    }
  }

  if (imcNumero >= 30 && estrategia === "superávit calórico") {
    const mensagem = escolherAleatoria(mensagensBase?.imc_elevado_superavit?.default);
    if (mensagem) {
      mensagens.push(mensagem);
    }
  }

  if (dias >= 5) {
    const mensagem = escolherAleatoria(mensagensBase?.alta_frequencia?.default);
    if (mensagem) {
      mensagens.push(mensagem);
    }
  }

  return mensagens;
}

window.CoherenceEngine = {
  carregarMensagens,
  gerarMensagensCoerencia
};
