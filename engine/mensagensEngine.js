/* ================================
   MENSAGENS ENGINE · LORDCosta
   Mensagens instrucionais e motivacionais
   ================================ */

const OBJETIVOS = {
  hipertrofia: {
    introducao:
      "Este plano foi estruturado para estimular o desenvolvimento muscular com organização e consistência.",
    orientacoes:
      "Priorize a execução controlada, respeite a recuperação entre sessões e acompanhe sua evolução de forma progressiva."
  },
  emagrecimento: {
    introducao:
      "Este plano foi pensado para favorecer o condicionamento e o gasto energético de forma sustentável.",
    orientacoes:
      "Mantenha um ritmo estável, cuide da postura durante os movimentos e preserve a regularidade semanal."
  },
  condicionamento: {
    introducao:
      "Este plano foi desenhado para melhorar resistência e capacidade funcional ao longo das semanas.",
    orientacoes:
      "Ajuste o ritmo conforme sua adaptação, priorize a técnica e valorize a recuperação."
  }
};

const NIVEIS = {
  iniciante:
    "Comece com foco em aprender o movimento, criando uma base sólida antes de evoluir.",
  intermediario:
    "Mantenha constância e atenção aos sinais do corpo para seguir avançando com segurança.",
  avancado:
    "Ajuste intensidade e volume com responsabilidade para sustentar performance e evolução."
};

const DIVISOES = {
  AB: "A divisão AB concentra grupos musculares em sessões equilibradas.",
  ABC: "A divisão ABC distribui o treino em três blocos bem definidos.",
  ABCD: "A divisão ABCD amplia o foco por sessão e favorece organização semanal.",
  ABCDE: "A divisão ABCDE maximiza o foco por sessão com alta especificidade.",
  FULLBODY: "O modelo fullbody trabalha o corpo de forma integrada em cada sessão."
};

/* ================================
   UTILITÁRIOS
   ================================ */

function normalizarTexto(valor) {
  if (!valor) {
    return "";
  }
  return String(valor).trim();
}

function normalizarChave(valor) {
  return normalizarTexto(valor).toLowerCase();
}

function obterDivisaoTexto(divisao) {
  const chave = normalizarTexto(divisao).toUpperCase();
  return DIVISOES[chave] || "A divisão escolhida organiza o treino ao longo da semana.";
}

function obterObjetivo(chave) {
  return OBJETIVOS[chave] || {
    introducao:
      "Este plano foi organizado para apoiar sua evolução com consistência e segurança.",
    orientacoes:
      "Mantenha a boa execução, respeite a recuperação e acompanhe seu progresso."
  };
}

function obterNivel(chave) {
  return NIVEIS[chave] || "Mantenha foco, disciplina e progressão gradual ao longo do tempo.";
}

function obterFrequenciaTexto(frequenciaSemanal) {
  if (Number.isFinite(frequenciaSemanal) && frequenciaSemanal > 0) {
    return `A frequência semanal prevista é de ${frequenciaSemanal} sessão${frequenciaSemanal > 1 ? "ões" : ""}.`;
  }
  return "A frequência semanal será ajustada conforme sua rotina e disponibilidade.";
}

/* ================================
   GERADOR DE MENSAGEM
   ================================ */

function gerarMensagem(input) {
  const { objetivo, divisao, nivel, frequenciaSemanal } = input || {};

  const objetivoChave = normalizarChave(objetivo);
  const nivelChave = normalizarChave(nivel);

  const objetivoTexto = obterObjetivo(objetivoChave);
  const nivelTexto = obterNivel(nivelChave);
  const divisaoTexto = obterDivisaoTexto(divisao);
  const frequenciaTexto = obterFrequenciaTexto(frequenciaSemanal);

  return {
    introducao: `${objetivoTexto.introducao} ${divisaoTexto}`.trim(),
    orientacoesGerais: `${objetivoTexto.orientacoes} ${frequenciaTexto}`.trim(),
    mensagemMotivacional:
      `Continue com constância e atenção à qualidade do treino. ${nivelTexto}`.trim()
  };
}

/* ================================
   API GLOBAL
   ================================ */

window.MensagensEngine = {
  gerarMensagem
};
