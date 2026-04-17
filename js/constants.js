// js/constants.js
window.CONSTANTS = {
  especialidades: {
    'ALERGOLOGISTA': 'Longevidade',
    'CARDIOLOGISTA INFANTIL': 'Criança',
    'CARDIOLOGISTA': 'Longevidade',
    'CIRURGIA GERAL': 'Diagnóstico',
    'CIRURGIA PLASTICA': 'Mulher',
    'CLINICA GERAL': 'Longevidade',
    'DERMATOLOGISTA': 'Diagnóstico',
    'ENDOCRINOLOGISTA': 'Longevidade',
    'ENDOCRINOLOGISTA INFANTIL': 'Criança',
    'FONOAUDIOLOGA': 'Longevidade',
    'GASTRO INFANTIL': 'Criança',
    'GASTRO/ CIRURGIA GERAL': 'Diagnóstico',
    'GERIATRA': 'Longevidade',
    'GINECOLOGISTA/OBSTETRA': 'Mulher',
    'GINECOLOGISTA/UROGINECOLOGIA': 'Mulher',
    'INFECTOLOGISTA': 'Diagnóstico',
    'MASTOLOGISTA': 'Mulher',
    'NEUROCIRURGIAO': 'Longevidade',
    'NEUROLOGISTA (CLINICA)': 'Longevidade',
    'NEUROLOGISTA INFANTIL': 'Criança',
    'NUTRICIONISTA': 'Longevidade',
    'OFTALMOLOGISTA': 'Diagnóstico',
    'ORTOPEDISTA INFANTIL': 'Criança',
    'ORTOPEDISTA': 'Longevidade',
    'OTORRINOLARINGOLOGISTA': 'Diagnóstico',
    'PEDIATRA': 'Criança',
    'PNEUMOLOGISTA': 'Longevidade',
    'PROCTOLOGISTA': 'Diagnóstico',
    'PSICOLOGO': 'Mente',
    'PSIQUIATRA': 'Mente',
    'REUMATOLOGISTA': 'Longevidade',
    'UROLOGISTA': 'Mulher',
    'VASCULAR': 'Longevidade'
  },
  cores: {
    'Criança': '#10b981',
    'Mulher': '#ec4899',
    'Mente': '#8b5cf6',
    'Longevidade': '#3b82f6',
    'Diagnóstico': '#f97316'
  },
  descricoes: {
    'Criança': 'Pediatria & Desenvolvimento',
    'Mulher': 'Cuidado Integral',
    'Mente': 'Saúde Mental',
    'Longevidade': 'Movimento & Senior',
    'Diagnóstico': 'Exames & Laboratórios'
  },
  obterCategoria: function(especialidade) {
    return this.especialidades[especialidade] || null;
  },
  filtrarPorCategoria: function(especialidades, categoria) {
    var filtradas = [];
    for (var i = 0; i < especialidades.length; i++) {
      if (this.especialidades[especialidades[i]] === categoria) {
        filtradas.push(especialidades[i]);
      }
    }
    return filtradas;
  },
  normalizarEspecialidade: function(especialidade) {
    return especialidade.toUpperCase().replace(/[^A-Z\s]/g, '').trim();
  }
};