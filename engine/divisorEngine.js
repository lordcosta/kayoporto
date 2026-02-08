/* ================================
   DIVISOR ENGINE · LORDCosta
   Organiza a semana de treino
   ================================ */

const divisores = {
  AB: {
    dias: [
      { dia: "A", grupos: ["peitorais", "triceps"] },
      { dia: "B", grupos: ["costas", "biceps"] }
    ],
    abdomen: { frequencia: 2 }
  },

  ABC: {
    dias: [
      { dia: "A", grupos: ["peitorais", "triceps"] },
      { dia: "B", grupos: ["costas", "biceps"] },
      { dia: "C", grupos: ["pernas", "ombros"] }
    ],
    abdomen: { frequencia: 2 }
  },

  ABCD: {
    dias: [
      { dia: "A", grupos: ["peitorais"] },
      { dia: "B", grupos: ["costas"] },
      { dia: "C", grupos: ["pernas"] },
      { dia: "D", grupos: ["ombros", "biceps", "triceps"] }
    ],
    abdomen: { frequencia: 3 }
  }
};

/* ================================
   GERADOR DE SEMANA
   ================================ */

function gerarDivisao(config) {
  const { tipo } = config;

  const divisor = divisores[tipo];
  if (!divisor) {
    console.error("Divisor não encontrado:", tipo);
    return null;
  }

  return divisor;
}

/* ================================
   API GLOBAL
   ================================ */

window.DivisorEngine = {
  gerarDivisao
};
