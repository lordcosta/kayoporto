/* ================================
   MENSAGENS ENGINE · LORDCosta
   Mensagens instrucionais e motivacionais
   ================================ */

const mensagensDB = {
  hipertrofia: {
    AB: {
      iniciante:
        "Este treino em divisão AB foi estruturado para distribuir o volume semanal de forma equilibrada, permitindo adaptação progressiva e recuperação adequada. Concentre-se na execução correta e na progressão gradual das cargas.",
      intermediario:
        "A divisão AB permite maior foco por sessão, mantendo boa frequência semanal. Priorize intensidade controlada, boa técnica e consistência ao longo das semanas.",
      avancado:
        "Neste modelo AB, o foco está na intensidade e na qualidade do estímulo. Trabalhe próximo da falha de forma consciente e respeite os intervalos de descanso."
    },

    ABC: {
      iniciante:
        "A divisão ABC é ideal para organizar o treino em blocos claros, facilitando a recuperação muscular. Execute os exercícios com atenção à técnica e mantenha regularidade semanal.",
      intermediario:
        "Neste treino ABC, o volume é distribuído para maximizar hipertrofia com recuperação adequada. Busque progressão de cargas e controle de execução.",
      avancado:
        "A divisão ABC permite alto foco muscular por sessão. Ajuste cargas, intensidade e descanso de forma estratégica para otimizar os resultados."
    },

    ABCD: {
      iniciante:
        "A divisão ABCD aumenta o foco por grupo muscular, mantendo o volume semanal sob controle. Ideal para evolução gradual com sessões bem direcionadas.",
      intermediario:
        "Neste modelo ABCD, cada grupo muscular recebe atenção específica. Trabalhe com intensidade moderada a alta e acompanhe sua recuperação.",
      avancado:
        "A divisão ABCD é indicada para alto nível de controle de volume e intensidade. Priorize estímulos eficientes, técnica refinada e recuperação."
    }
  },

  emagrecimento: {
    AB: {
      iniciante:
        "Este treino AB foi estruturado para estimular grandes grupos musculares, aumentando o gasto energético. Mantenha ritmo constante e atenção aos descansos.",
      intermediario:
        "A divisão AB permite sessões mais intensas e eficientes para emagrecimento. Controle os intervalos e mantenha foco na execução.",
      avancado:
        "Neste modelo AB, o objetivo é maximizar o gasto calórico com intensidade e eficiência. Trabalhe com foco e constância."
    },

    ABC: {
      iniciante:
        "A divisão ABC ajuda a manter regularidade e equilíbrio no treino, favorecendo a queima calórica e a adaptação gradual.",
      intermediario:
        "Este treino ABC permite boa combinação entre intensidade e recuperação, otimizando o processo de emagrecimento.",
      avancado:
        "No modelo ABC, mantenha intensidade elevada, controle de descanso e foco na qualidade do movimento."
    }
  },

  condicionamento: {
    ABC: {
      iniciante:
        "Este treino foi estruturado para melhorar o condicionamento geral, respeitando a adaptação do corpo ao esforço físico.",
      intermediario:
        "A divisão ABC favorece evolução gradual do condicionamento. Trabalhe com atenção ao ritmo e à recuperação.",
      avancado:
        "Neste modelo ABC, o foco está na performance e resistência. Ajuste intensidade e volume conforme sua capacidade."
    }
  }
};

/* ================================
   GERADOR DE MENSAGEM
   ================================ */

function gerarMensagem(config) {
  const { objetivo, divisor, nivel } = config;

  return (
    mensagensDB?.[objetivo]?.[divisor]?.[nivel] ||
    "Siga o treino com foco, respeite os intervalos de descanso e mantenha consistência ao longo das semanas. A disciplina é fundamental para alcançar bons resultados."
  );
}

/* ================================
   API GLOBAL
   ================================ */

window.MensagemEngine = {
  gerarMensagem
};
