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

function ajustarInicioAposNome(texto) {
  const mensagem = String(texto || "");

  // Só aplica minúscula inicial quando for padrão "Em", "Para", etc.
  // Evita quebrar siglas no início da frase, como "IMC".
  if (/^[A-ZÀ-Ý][a-zà-ý]/.test(mensagem)) {
    return mensagem.charAt(0).toLowerCase() + mensagem.slice(1);
  }

  return mensagem;
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
      .replace(/\bpreparado\b/gi, "com preparo")
      .replace(/\balinhado\b/gi, "em alinhamento")
      .replace(/\bindicado\b/gi, "recomendável");
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
    mensagem = `${nome}, ${ajustarInicioAposNome(mensagem)}`;
  }

  return ajustarConcordancia(mensagem, sexo);
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
