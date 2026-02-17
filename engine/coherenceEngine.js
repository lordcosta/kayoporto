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

function capitalizarTexto(texto) {
  if (!texto) {
    return "";
  }
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function ajustarConcordancia(texto, sexo) {
  const mensagem = String(texto || "");
  const sexoNormalizado = normalizarTexto(sexo);

  if (!mensagem) {
    return "";
  }

  if (sexoNormalizado === "feminino") {
    return mensagem
      .replace(/\bpreparado\b/gi, (palavra) => (palavra === "Preparado" ? "Preparada" : "preparada"))
      .replace(/\balinhado\b/gi, (palavra) => (palavra === "Alinhado" ? "Alinhada" : "alinhada"))
      .replace(/\bindicado\b/gi, (palavra) => (palavra === "Indicado" ? "Indicada" : "indicada"));
  }

  if (sexoNormalizado === "outro") {
    return mensagem
      .replace(/\bpreparado\b/gi, "preparado(a)")
      .replace(/\balinhado\b/gi, "alinhado(a)")
      .replace(/\bindicado\b/gi, "indicado(a)");
  }

  return mensagem;
}

function aplicarHumanizacaoMensagem(texto, { nomeAluno, sexo } = {}) {
  const nome = String(nomeAluno || "").trim();
  const base = String(texto || "").trim();

  if (!base) {
    return "";
  }

  let mensagem = base;

  if (nome) {
    mensagem = mensagem.replace(/\bNOME\b/g, nome);
  }

  if (nome && !/\bNOME\b/.test(base)) {
    mensagem = `${nome}, ${mensagem.charAt(0).toLowerCase()}${mensagem.slice(1)}`;
  }

  mensagem = ajustarConcordancia(mensagem, sexo);
  return capitalizarTexto(mensagem);
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
  diasTreino,
  nomeAluno,
  sexo
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

  return mensagens.map((mensagem) => aplicarHumanizacaoMensagem(mensagem, { nomeAluno, sexo }));
}

window.CoherenceEngine = {
  carregarMensagens,
  gerarMensagensCoerencia,
  ajustarConcordancia
};
