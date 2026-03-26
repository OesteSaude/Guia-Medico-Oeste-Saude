// ==================== DADOS ====================

const DADOS_COMPLETOS = window.DADOS_COMPLETOS || { prestadores: [], especialidades: [], cidades: [], tipos: [] };

// ==================== ESTADO GLOBAL ====================

let prestadores = [];
let especialidades = [];
let cidades = [];
let tipos = [];
let localizacaoUsuario = null;
let tipoFiltroAtivo = null;
let jornadaAtiva = null;
let estadoFiltroAtivo = null; // 'SP' ou 'MS'
let exclusivoAtivo = false;

// Dados temporários para upload dos JSONs
let jsonRede = null;
let jsonTipos = null;
let jsonEspecialidades = null;

// ==================== CONSTANTES ====================

const CORES_TIPO = {
    'MEDICO': { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
    'CLINICA': { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
    'HOSPITAL': { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
    'HOSPITAL DIA': { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
    'HOSPITAL MATERNIDADE': { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
    'LABORATORIO': { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
    'CENTRO DE DIAGNOSTICOS': { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
    'PROFISSIONAL DE SAUDE': { bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-200' },
    'NUTRICIONISTA': { bg: 'bg-lime-100', text: 'text-lime-700', border: 'border-lime-200' },
    'FONOAUDIOLOGO': { bg: 'bg-cyan-100', text: 'text-cyan-700', border: 'border-cyan-200' }
};

const REDE_EXCLUSIVA = [
    "ANA JULIA ELORZA MORAES DOS SANTOS","ANA RAQUEL JESUS FRANCISCHETI","BARBARA GONCALES OLIVO",
    "BRUNA CERAVOLO LEMOS","CADRI CENTRO AVANCADO DE RADIOLOGIA LTDA",
    "CENTRO ANALISES CLINICAS UNILAB S/C LTDA","CENTRO FRATURAS SAO LUCAS",
    "CENTRO MEDICO DE ESPECIALIDADES PRES. PRUDENTE","CENTRO PRUDENTINO DE ONCOLOGIA  LTDA",
    "CLARA TAMANINI COELHO","CLINICA MEDICA SANTA HELENA","CLINICA TAMARA SILVA",
    "DEBORA MENDES LOPES","ESTAR BEM CLINICA DE PSICOLOGIA","FISIOCLINICA S/S LTDA",
    "GABRIELA FERNANDES ZAGALLO","GABRIELLE SILVA MATSU","GUILHERME DOS SANTOS GOMES ALVES",
    "GUILHERME MARTINS NANCI","GUILHERME ZIMMERER LORENTZ","HIDEIO URASAKI",
    "HOSP. BEZERRA DE MENEZES - CLINICA VIVA","HOSPITAL ESPERANCA","HOSPITAL IAMADA PRES. PRUDENTE",
    "INSTITUTO DO RIM - PRES. PRUDENTE","INSTITUTO DO RIM DE PRESIDENTE PRUDENTE LTDA",
    "INSTITUTO RH HEMAT. HEMOTERAPIA S/C LTDA","IRIS FELISBERTO DE SOUZA",
    "JANAINA GABRIEL MARCELINO DA ROCHA","JOSE ANTONIO NASCIMENTO BRESSA",
    "LAB. ANAT. PATOL E CITOPATOLOGIA S/S LTD","LACMEN MEDICINA NUCLEAR LTDA",
    "LEONARDO DE CASTILHO","LOISE ANE CARDOSO","MARCELO BASTOS DEL HOYO",
    "MARCOS VINICIUS NOGUEIRA DE JESUS","MARIA ANGELA MARTINS CABRERA","MATHEUS GUALBERTO",
    "MED RAD - SERV. DE RADIO E ULTRAS P. PTE","MED RAD - SERV. DE RADIO E ULTRAS P. PTE.",
    "MICROMED ANATOMIA PATOLOGICA E CITOPATO","MITSUJI SEKI","PAULO JOSE MASCARENHAS MAZARO",
    "REBECA CARVALHO BRESSA","SANTA CASA MIS. PRES PRUDENTE","VANESSA CAROLINA VICENTE DA PAZ",
    "VIRGINIA OLIVEIRA TIROLI","WILLIAM MARASCA"
];

const CIDADES_POR_ESTADO = {
    'SP': [
        'PRESIDENTE PRUDENTE','ALFREDO MARCONDES','ALVARES MACHADO','ANHUMAS','CAIABU',
        'EMILIANOPOLIS','ESTRELA DO NORTE','EUCLIDES DA CUNHA PAULISTA','IEPE','INDIANA',
        'JOAO RAMALHO','MARTINOPOLIS','MIRANTE DO PARANAPANEMA','NANTES','NARANDIBA',
        'PIRAPOZINHO','PRESIDENTE BERNARDES','QUATA','RANCHARIA','REGENTE FEIJO',
        'RIBEIRAO DOS INDIOS','ROSANA','SANDOVALINA','DRACENA','ADAMANTINA','OSVALDO CRUZ',
        'INUBIA PAULISTA','LUCELIA','FLORIDA PAULISTA','PACAEMBU','PARAPUA','RINOPOLIS',
        'JUNQUEIROPOLIS','PANORAMA','TUPI PAULISTA','PRESIDENTE VENCESLAU','PRESIDENTE EPITACIO',
        'CAIUA','TEODORO SAMPAIO','MARAPOAMA','FERNANDOPOLIS','VOTUPORANGA','JALES',
        'SANTA FE DO SUL','SAO JOSE DO RIO PRETO','MIRASSOL','BIRIGUI','ARACATUBA',
        'PENAPOLIS','GUARARAPES'
    ],
    'MS': [
        'NOVA ANDRADINA','BATAGUASSU','ANAURILANDIA','IVINHEMA','DOURADOS','CAMPO GRANDE',
        'TRES LAGOAS','CORUMBA','PONTA PORA','NAVIRAI','AQUIDAUANA','COXIM',
        'PARANAIBA','CASSILANDIA','CHAPADAO DO SUL'
    ]
};

const JORNADAS = {
    crianca: {
        match: (esp) => {
            const lower = esp.toLowerCase();
            return lower.includes('pediatr') || lower.includes('infanto') ||
                   lower.includes('infantil') || lower.includes('fonoaud') ||
                   lower.includes('nutric') || lower.includes('alergia');
        }
    },
    mulher: {
        match: (esp) => {
            const lower = esp.toLowerCase();
            return lower.includes('ginecolog') || lower.includes('mastolog') ||
                   lower.includes('obstetr');
        }
    },
    mente: {
        match: (esp) => {
            const lower = esp.toLowerCase();
            return lower.includes('psico') || lower.includes('psiqu') ||
                   lower.includes('terapia ocup') || lower.includes('psicoped') ||
                   lower.includes('psicana');
        }
    },
    longevidade: {
        match: (esp) => {
            const lower = esp.toLowerCase();
            return lower.includes('geriatr') || lower.includes('cardio') ||
                   lower.includes('ortoped') || lower.includes('fisioter') ||
                   lower.includes('oftalm') || lower.includes('neurolog') ||
                   lower.includes('reumat');
        }
    },
    diagnostico: {
        match: (esp, tipo) => {
            if (tipo === 'LAB' || tipo === 'CDI') return true;
            const lower = esp.toLowerCase();
            return lower.includes('radiolog') || lower.includes('diagnos') ||
                   lower.includes('analises') || lower.includes('laborat');
        }
    }
};

const POLOS_SAUDE = [
    'PRESIDENTE PRUDENTE','DRACENA','OSVALDO CRUZ','PRESIDENTE EPITACIO','NOVA ANDRADINA'
];

const MEDICOS_CENTRO_MEDICO = [
    {"nome":"DANIELA SGRINGNOLI RENA ","especialidade":"ALERGOLOGISTA","idade":"0 a 17 ANOS"},
    {"nome":"CANDIDA PELLEGINI SOUZA P DE SIQUEIRA","especialidade":"ALERGOLOGISTA","idade":"TODAS AS IDADES"},
    {"nome":"MARIA EDUARDA FAUSTINO B. FERNANDES","especialidade":"CARDIOLOGISTA INFANTIL","idade":"0 a 17 ANOS"},
    {"nome":"BRUNO LUIZ DOS SANTOS ZANONI","especialidade":"CARDIOLOGISTA","idade":"A PARTIR DOS 12 ANOS"},
    {"nome":"RODRIGO BARCELOS DEVERLAN","especialidade":"CARDIOLOGISTA","idade":"A PARTIR DOS 18 ANOS"},
    {"nome":"RENATA MILANO SANTOS JACOB","especialidade":"CARDIOLOGISTA","idade":"A PARTIR DOS 16 ANOS"},
    {"nome":"ARHUR ANGELO ZOGHEIB PINATTO","especialidade":"CARDIOLOGISTA","idade":"A PARTIR DOS 18 ANOS"},
    {"nome":"KAREN CAROLINE KOP MALUF DA SILVA","especialidade":"CLINICA GERAL","idade":"A PARTIR DOS 18 ANOS"},
    {"nome":"PATRICIA DI SANTI TEIXEIRA CERESINI","especialidade":"CLINICA GERAL","idade":"A PARTIR DOS 18 ANOS"},
    {"nome":"NATALIA BRAGA AMORIM","especialidade":"CLINICA GERAL","idade":"A PARTIR DOS 18 ANOS"},
    {"nome":"CAROLINA SOARES CERÁVOLO","especialidade":"CLINICA GERAL","idade":"A PARTIR DOS 18 ANOS"},
    {"nome":"RONALD FERNANDO FUNES PRADA","especialidade":"CLINICA GERAL","idade":"A PARTIR DOS 18 ANOS"},
    {"nome":"CRISTIANE VELASQUES LOPES","especialidade":"CLINICA GERAL","idade":"A PARTIR DOS 18 ANOS"},
    {"nome":"HELOISA DE CAMPOS PINTO ","especialidade":"CLINICA GERAL","idade":"A PARTIR DOS 18 ANOS"},
    {"nome":"FELIPE ROMÃO HATISUKA","especialidade":"CLINICA GERAL","idade":"A PARTIR DOS 18 ANOS"},
    {"nome":"FERNANDA MELLO TAVARES","especialidade":"CIRURGIA GERAL","idade":"A PARTIR DOS 16 ANOS"},
    {"nome":"GEOVANA PELUSO BUCCHI","especialidade":"CIRURGIA PLÁSTICA","idade":"TODAS AS IDADES"},
    {"nome":"EDSON LUIZ OHIRA","especialidade":"CIRURGIA PLÁSTICA","idade":"TODAS AS IDADES"},
    {"nome":"KAREN CAROLINE K MALUF DA SILVA","especialidade":"DERMATOLOGISTA","idade":"TODAS AS IDADES"},
    {"nome":"PRISCILA GOMES VIEIRA","especialidade":"DERMATOLOGISTA","idade":"TODAS AS IDADES"},
    {"nome":"CAROLINA LARANJEIRA DOS S GENARO","especialidade":"DERMATOLOGISTA","idade":"TODAS AS IDADES"},
    {"nome":"NATALY GEORGINA MUCHON","especialidade":"DERMATOLOGISTA","idade":"TODAS AS IDADES"},
    {"nome":"ANA CAROLINA GONÇALVES DE  PAIVA","especialidade":"DERMATOLOGISTA","idade":"TODAS AS IDADES"},
    {"nome":"FERNANDA ROSSI ZANATTA DE MORAES","especialidade":"ENDOCRINOLOGISTA INFANTIL","idade":"0 a 17 ANOS"},
    {"nome":"AMELIA ALVES DO NASCIMENTO COUTINHO","especialidade":"ENDOCRINOLOGISTA ","idade":"A PARTIR DOS 18 ANOS"},
    {"nome":"NERY CRISTINA SCARSI HERMENEGILDO","especialidade":"ENDOCRINOLOGISTA ","idade":"A PARTIR DOS 15 ANOS"},
    {"nome":"JESSICA MARTUCCI","especialidade":"ENDOCRINOLOGISTA ","idade":"A PARTIR DOS 18 ANOS"},
    {"nome":"MARIANA APARECIDA OLIVEIRA","especialidade":"FONOAUDIOLOGA","idade":"TODAS AS IDADES"},
    {"nome":"CLICIA FERNANDA DE MELO A DURAN ","especialidade":"FONOAUDIOLOGA","idade":"TODAS AS IDADES"},
    {"nome":"PEDRO MEIRA DOLFINI","especialidade":"GASTRO/ CIRURGIA GERAL","idade":"A PARTIR DOS 16 ANOS"},
    {"nome":"DIEGO GARCIA MUCHON","especialidade":"GASTRO/ CIRURGIA GERAL","idade":"A PARTIR DOS 13 ANOS"},
    {"nome":"GUILHERME MORAES TEIXEIRA","especialidade":"GASTRO/ CIRURGIA GERAL","idade":"A PARTIR DOS 14 ANOS"},
    {"nome":"JOÃO LUCAS RIBEIRO CRISTOVAN","especialidade":"GASTRO/CIRURGIA GERAL","idade":"A PARTIR DOS 15 ANOS"},
    {"nome":"MAIRA TENCA SANCHES VICENTE","especialidade":"GASTRO INFANTIL","idade":"ATE 17 ANOS "},
    {"nome":"JUSSARA COUTINHO NEVES","especialidade":"GERIATRA","idade":"A PARTIR DOS 30 ANOS"},
    {"nome":"MARIA LUISA MARTINS ROSSI","especialidade":"GERIATRA","idade":"A PARTIR DOS 40 ANOS"},
    {"nome":"MARILIA FERRUZI EDERLI","especialidade":"GERIATRA","idade":"A PARTIR DOS 45 ANOS"},
    {"nome":"ANA LUIZA DALEFI ANDRADE","especialidade":"GINECOLOGISTA/OBSTETRA","idade":"TODAS AS IDADES"},
    {"nome":"ANA PAULA DAMIAO DOS SANTOS","especialidade":"GINECOLOGISTA/OBSTETRA","idade":"A PARTIR DOS 14 ANOS"},
    {"nome":"ANNA CLARA R PETERMANN BUGALHO ","especialidade":"GINECOLOGISTA/OBSTETRA","idade":"A PARTIR DOS 16 ANOS"},
    {"nome":"ANDRESSA MARTIN LOUZADA","especialidade":"GINECOLOGISTA/OBSTETRA","idade":"TODAS AS IDADES"},
    {"nome":"ANGÉLICA CALVO ALESSI","especialidade":"GINECOLOGISTA/OBSTETRA","idade":"A PARTIR DOS 18 ANOS"},
    {"nome":"CAMILA FRANÇA MACHARETH CHRISTOVAM","especialidade":"GINECOLOGISTA/OBSTETRA","idade":"A PARTIR DOS 7 ANOS"},
    {"nome":"KAREN LETISSA FRANCISCHETT GABRIEL","especialidade":"GINECOLOGISTA/OBSTETRA","idade":"A PARTIR DOS 13 ANOS"},
    {"nome":"LARISSA ORLANDI MARQUES MELO","especialidade":"GINECOLOGISTA/OBSTETRA","idade":"A PARTIR DOS 16 ANOS"},
    {"nome":"MARIHA LUCHTENBERG K VENDRAMINI","especialidade":"GINECOLOGISTA/OBSTETRA","idade":"A PARTIR DOS 10 ANOS"},
    {"nome":"JOÃO MARCELO MARTINS COLUNA ","especialidade":"GINECOLOGISTA/OBSTETRA","idade":"A PARTIR DOS 10 ANOS"},
    {"nome":"ANDRÉ INÊS GERALDO","especialidade":"GINECOLOGISTA/OBSTETRA","idade":"A PARTIR DOS 14 ANOS"},
    {"nome":"PAULA RENATA GARCIA SILVA","especialidade":"GINECOLOGISTA/OBSTETRA","idade":"A PARTIR DOS 14 ANOS"},
    {"nome":"THAISE MARIA GIASANTE DE OLIVEIRA","especialidade":"GINECOLOGISTA/UROGINECOLOGIA","idade":"TODAS AS IDADES"},
    {"nome":"NATHALIA RODRIGUES DE MELLO","especialidade":"INFECTOLOGISTA","idade":"A PARTIR DOS 16 ANOS"},
    {"nome":"CAMILA ALVES MENDONÇA BRAVO","especialidade":"INFECTOLOGISTA","idade":"A PARTIR DOS 12 ANOS"},
    {"nome":"BRUNO FREITAS CERAVOLO ","especialidade":"MASTOLOGISTA","idade":"TODAS AS IDADES"},
    {"nome":"BARBARA CRISTINA BARROS","especialidade":"NEUROLOGISTA INFANTIL","idade":"0 A 15 ANOS"},
    {"nome":"MATHEUS DE SOUZA ROSA","especialidade":"NEUROLOGISTA INFANTIL","idade":"0 a 17 ANOS"},
    {"nome":"TATIANA ARROYO LOPES ALVES DE JESUS","especialidade":"NEUROLOGISTA (CLINICA)","idade":"A PARTIR DE 15 ANOS"},
    {"nome":"DINA ANDRESSA MARTINS MONTEIRO","especialidade":"NEUROLOGISTA (CLINICA)","idade":"A PARTIR DE 16 ANOS"},
    {"nome":"LORENNA I. C. M. GONZALES REYES FERRARI","especialidade":"NEUROCIRUGIÃO","idade":"A PARTIR DOS 18 ANOS"},
    {"nome":"ADIB SARATY MALVEIRA","especialidade":"NEUROCIRUGIÃO","idade":"A PARTIR DOS 15 ANOS"},
    {"nome":"FELIPE FRANCO PINHEIRO GAIA","especialidade":"NEUROCIRUGIÃO","idade":"ADULTO"},
    {"nome":"SIMONE DE CASSIA CASADEI BUCHALLA","especialidade":"NUTRICIONISTA","idade":"A PARTIR DOS 06 MESES"},
    {"nome":"THAIS SCHADEK COSTA PIFFER","especialidade":"NUTRICIONISTA","idade":"TODAS AS IDADES"},
    {"nome":"GABRIEL COUTO SENRA","especialidade":"OFTALMOLOGISTA","idade":"TODAS AS IDADES"},
    {"nome":"RAPHAEL BAPTISTA GIRIO","especialidade":"OFTALMOLOGISTA","idade":"A PARTIR DOS 7 ANOS"},
    {"nome":"VANESSA MENEZES","especialidade":"OFTALMOLOGISTA","idade":"TODAS AS IDADES"},
    {"nome":"VANESSA QUEIROZ LOUREIRO SEVERINO","especialidade":"OFTALMOLOGISTA","idade":"TODAS AS IDADES"},
    {"nome":"FABIO JHEAN SANCHES SOARES","especialidade":"ORTOPEDISTA INFANTIL","idade":"TODAS AS IDADES"},
    {"nome":"DELTON EUSTACIO FERRAZ","especialidade":"ORTOPEDISTA","idade":"TODAS AS IDADES"},
    {"nome":"RAPHAEL LAMEIRÃO GOMIDE","especialidade":"ORTOPEDISTA","idade":"TODAS AS IDADES"},
    {"nome":"FERNANDO ZANI GARCIA","especialidade":"ORTOPEDISTA","idade":"A PARTIR DOS 12 ANOS"},
    {"nome":"GUILHERME MARTINS NANCI","especialidade":"ORTOPEDISTA","idade":"TODAS AS IDADES"},
    {"nome":"MARCELO HAMAD HUSEIN VIEIRA","especialidade":"ORTOPEDISTA","idade":"A PARTIR DOS 12 ANOS"},
    {"nome":"GUILHERME DOS SANTOS GOMES ALVES","especialidade":"OTORRINOLARINGOLOGISTA","idade":"A PARTIR DE 01 ANO"},
    {"nome":"GERALDO CESAR ALVES","especialidade":"OTORRINOLARINGOLOGISTA","idade":"A PARTIR DOS 16 ANOS"},
    {"nome":"TALIA PEGOLARO MARTIN","especialidade":"OTORRINOLARINGOLOGISTA","idade":"TODAS AS IDADES"},
    {"nome":"NATALIA GIORGI DE SANTANA","especialidade":"PEDIATRA","idade":"0 a 17 ANOS"},
    {"nome":"TALITA BOTTA CALMONA","especialidade":"PEDIATRA","idade":"0 a 17 ANOS"},
    {"nome":"DANIELA DE FARIA MARIA YOSHIYASU","especialidade":"PEDIATRA","idade":"0 a 17 ANOS"},
    {"nome":"BEATRIZ DE CASTILHO OLIVEIRA PRADO","especialidade":"PEDIATRA","idade":"0 a 17 ANOS"},
    {"nome":"TATIANE RIBEIRO NAGLE FERREIRA","especialidade":"PEDIATRA","idade":"0 a 17 ANOS"},
    {"nome":"DENISE LUNHANI","especialidade":"PEDIATRA","idade":"0 a 17 ANOS"},
    {"nome":"BARBARA GONÇALVES OLIVO","especialidade":"PNEUMOLOGISTA","idade":"A PARTIR 10 ANOS"},
    {"nome":"PEDRO HENRIQUE BAUTH SILVA","especialidade":"PROCTOLOGISTA","idade":"A PARTIR DOS 16 ANOS"},
    {"nome":"RODOLFO DAHLEM MELO","especialidade":"PROCTOLOGISTA","idade":"A PARTIR DOS 16 ANOS"},
    {"nome":"ANA LUIZA FERRARI","especialidade":"PSICOLOGO","idade":"PREVENTIVA"},
    {"nome":"BRUNA PORTÃO DA SILVA","especialidade":"PSIQUIATRA","idade":"A PARTIR DOS 5 ANOS"},
    {"nome":"GRAZIELA CRISTINI D ANGELO MOTA","especialidade":"PSIQUIATRA","idade":"A PARTIR DOS 10 ANOS"},
    {"nome":"CAROLINA POYANE PEIXOTO DE FARIAS","especialidade":"PSIQUIATRA","idade":"A PARTIR DOS 16 ANOS"},
    {"nome":"MARILIA ANANIAS BARROS","especialidade":"PSIQUIATRA","idade":"A PARTIR DOS 18 ANOS"},
    {"nome":"MICHELE MEDEIROS LIMA SALIONE","especialidade":"PSIQUIATRA","idade":"A PARTIR DOS 15 ANOS"},
    {"nome":"CAMILA SANTOS MELLO VILELLA","especialidade":"PSIQUIATRA","idade":"A PARTIR DOS 8 ANOS"},
    {"nome":"LUIZA MALAMAO PAIOLA","especialidade":"REUMATOLOGISTA","idade":"A PARTIR DOS 18 ANOS"},
    {"nome":"CAROLINA ALMEIDA DO PRADO SILVA","especialidade":"REUMATOLOGISTA","idade":"A PARTIR DOS 15 ANOS"},
    {"nome":"RAÍ  MONTANHOLI BUENO ","especialidade":"UROLOGISTA","idade":"A PARTIR DOS 10 ANOS"},
    {"nome":"MATHEUS ALMEIDA SPERINI","especialidade":"UROLOGISTA","idade":"A PARTIR DOS 10 ANOS"},
    {"nome":"FABIO PERETTI PRIETO FERNANDES","especialidade":"UROLOGISTA","idade":"A PARTIR DOS 10 ANOS"},
    {"nome":"MARIA PAOLA PICCAROLO CERAVOLO","especialidade":"VASCULAR","idade":"TODAS AS IDADES"},
    {"nome":"LARISSA MARTUCCI","especialidade":"VASCULAR","idade":"TODAS AS IDADES"}
];

// ==================== INICIALIZAÇÃO ====================

async function init() {
    document.getElementById('loading').classList.remove('hidden');

    const dadosArmazenados = localStorage.getItem('oeste_prestadores_v2');

    if (dadosArmazenados) {
        const dados = JSON.parse(dadosArmazenados);
        prestadores = dados.prestadores;
        especialidades = dados.especialidades;
        cidades = dados.cidades;
        tipos = dados.tipos || [];
    } else if (window.DADOS_COMPLETOS && window.DADOS_COMPLETOS.prestadores.length > 0) {
        prestadores = window.DADOS_COMPLETOS.prestadores;
        especialidades = window.DADOS_COMPLETOS.especialidades;
        cidades = window.DADOS_COMPLETOS.cidades;
        tipos = window.DADOS_COMPLETOS.tipos || [];
        localStorage.setItem('oeste_prestadores_v2', JSON.stringify(window.DADOS_COMPLETOS));
    }

    popularFiltros();
    criarBadgesFiltro();
    renderizarPrestadores(prestadores);

    document.getElementById('loading').classList.add('hidden');
}

// ==================== FILTROS ====================

function popularFiltros() {
    const selectEspecialidade = document.getElementById('selectEspecialidade');
    const selectCidade = document.getElementById('selectCidade');

    selectEspecialidade.innerHTML = '<option value="">Todas as especialidades</option>';
    selectCidade.innerHTML = '<option value="">Todas as cidades</option>';

    especialidades.forEach(esp => {
        const option = document.createElement('option');
        option.value = esp;
        option.textContent = esp;
        selectEspecialidade.appendChild(option);
    });

    cidades.forEach(cidade => {
        const option = document.createElement('option');
        option.value = cidade;
        option.textContent = cidade;
        selectCidade.appendChild(option);
    });
}

function criarBadgesFiltro() {
    const container = document.getElementById('containerBadgesFiltro');
    container.querySelectorAll('.badge-filter').forEach(b => b.remove());

    const tiposPrincipais = ['MEDICO', 'CLINICA', 'HOSPITAL', 'LABORATORIO'];

    tiposPrincipais.forEach(tipo => {
        const count = prestadores.filter(p => p.classificacao === tipo).length;
        if (count === 0) return;

        const cores = CORES_TIPO[tipo] || { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' };

        const badge = document.createElement('span');
        badge.className = `badge-filter inline-block px-3 py-1 rounded-full text-xs font-bold ${cores.bg} ${cores.text} border-2 ${cores.border}`;
        badge.setAttribute('data-tipo', tipo);
        badge.textContent = `${tipo} (${count})`;
        badge.onclick = () => filtrarPorTipo(tipo);

        container.appendChild(badge);
    });
}

function filtrarPorTipo(tipo) {
    if (tipoFiltroAtivo === tipo) {
        tipoFiltroAtivo = null;
        document.querySelectorAll('.badge-filter').forEach(b => {
            b.classList.remove('active', 'ring-2', 'ring-offset-2');
        });
    } else {
        tipoFiltroAtivo = tipo;
        document.querySelectorAll('.badge-filter').forEach(b => {
            b.classList.remove('active', 'ring-2', 'ring-offset-2');
            if (b.getAttribute('data-tipo') === tipo) {
                b.classList.add('active', 'ring-2', 'ring-offset-2');
            }
        });
    }
    aplicarFiltros();
}

function aplicarFiltros() {
    const nome = document.getElementById('inputNome').value.toLowerCase();
    const especialidade = document.getElementById('selectEspecialidade').value;
    const cidade = document.getElementById('selectCidade').value;

    let resultado = prestadores;

    if (nome) {
        resultado = resultado.filter(p =>
            p.nome.toLowerCase().includes(nome) ||
            p.especialidade.toLowerCase().includes(nome) ||
            p.cidade.toLowerCase().includes(nome)
        );
    }

    if (especialidade) {
        resultado = resultado.filter(p => p.especialidade.includes(especialidade));
    }

    if (cidade) {
        resultado = resultado.filter(p => p.cidade === cidade);
    }

    if (tipoFiltroAtivo) {
        resultado = resultado.filter(p => p.classificacao === tipoFiltroAtivo);
    }

    if (jornadaAtiva) {
        const jornada = JORNADAS[jornadaAtiva];
        if (jornada) {
            resultado = resultado.filter(p => {
                const esps = p.especialidade.split(',').map(e => e.trim());
                return esps.some(esp => jornada.match(esp, p.tipo_codigo));
            });
        }
    }

    if (estadoFiltroAtivo) {
        resultado = resultado.filter(p =>
            CIDADES_POR_ESTADO[estadoFiltroAtivo].includes(p.cidade.toUpperCase())
        );
    }

    if (exclusivoAtivo) {
        resultado = resultado.filter(p =>
            REDE_EXCLUSIVA.includes(p.nome.toUpperCase())
        );
    }

    // Fallback geográfico
    if (cidade && resultado.length === 0) {
        const fallback = aplicarFallbackGeografico(resultado, cidade);
        resultado = fallback.prestadores;
        if (fallback.mensagemFallback) {
            exibirAvisoFallback(fallback.mensagemFallback);
        }
    }

    renderizarPrestadores(resultado);
}

function limparFiltros() {
    document.getElementById('inputNome').value = '';
    document.getElementById('selectEspecialidade').value = '';
    document.getElementById('selectCidade').value = '';
    localizacaoUsuario = null;
    tipoFiltroAtivo = null;
    jornadaAtiva = null;
    estadoFiltroAtivo = null;
    exclusivoAtivo = false;

    const btnGeo = document.getElementById('btnGeolocalizacao');
    btnGeo.classList.remove('bg-green-600', 'hover:bg-green-700');
    btnGeo.classList.add('bg-gradient-to-r', 'from-[#003D58]', 'to-[#00A8B0]');
    btnGeo.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
        </svg>
        <span class="hidden sm:inline">Usar Localização</span>
    `;

    document.getElementById('botaoUrgencia').classList.add('hidden');

    document.querySelectorAll('.badge-filter').forEach(b => {
        b.classList.remove('active', 'ring-2', 'ring-offset-2');
    });
    document.querySelectorAll('.jornada-card').forEach(c => c.classList.remove('active'));

    const btnSP = document.getElementById('btnFiltroSP');
    const btnMS = document.getElementById('btnFiltroMS');
    const btnExclusivo = document.getElementById('btnFiltroExclusivo');
    [btnSP, btnMS, btnExclusivo].forEach(btn => {
        btn.classList.remove('bg-[#00A8B0]', 'text-white');
        btn.classList.add('bg-white', 'text-[#003D58]');
    });

    aplicarFiltros();
}

function filtrarPorEstado(estado) {
    const btnSP = document.getElementById('btnFiltroSP');
    const btnMS = document.getElementById('btnFiltroMS');

    if (estadoFiltroAtivo === estado) {
        estadoFiltroAtivo = null;
        [btnSP, btnMS].forEach(btn => {
            btn.classList.remove('bg-[#00A8B0]', 'text-white');
            btn.classList.add('bg-white', 'text-[#003D58]');
        });
    } else {
        estadoFiltroAtivo = estado;
        if (estado === 'SP') {
            btnSP.classList.add('bg-[#00A8B0]', 'text-white');
            btnSP.classList.remove('bg-white', 'text-[#003D58]');
            btnMS.classList.remove('bg-[#00A8B0]', 'text-white');
            btnMS.classList.add('bg-white', 'text-[#003D58]');
        } else {
            btnMS.classList.add('bg-[#00A8B0]', 'text-white');
            btnMS.classList.remove('bg-white', 'text-[#003D58]');
            btnSP.classList.remove('bg-[#00A8B0]', 'text-white');
            btnSP.classList.add('bg-white', 'text-[#003D58]');
        }
    }
    aplicarFiltros();
}

function filtrarPorExclusivo() {
    const btnExclusivo = document.getElementById('btnFiltroExclusivo');
    const btnSP = document.getElementById('btnFiltroSP');
    const btnMS = document.getElementById('btnFiltroMS');

    if (exclusivoAtivo) {
        exclusivoAtivo = false;
        btnExclusivo.classList.remove('bg-[#00A8B0]', 'text-white');
        btnExclusivo.classList.add('bg-white', 'text-[#003D58]');
    } else {
        exclusivoAtivo = true;
        estadoFiltroAtivo = null;
        [btnSP, btnMS].forEach(btn => {
            btn.classList.remove('bg-[#00A8B0]', 'text-white');
            btn.classList.add('bg-white', 'text-[#003D58]');
        });
        btnExclusivo.classList.add('bg-[#00A8B0]', 'text-white');
        btnExclusivo.classList.remove('bg-white', 'text-[#003D58]');
    }
    aplicarFiltros();
}

// ==================== RENDERIZAÇÃO ====================

function renderizarPrestadores(lista) {
    const container = document.getElementById('containerResultados');
    const estadoVazio = document.getElementById('estadoVazio');
    const infoResultados = document.getElementById('infoResultados');

    container.innerHTML = '';

    if (lista.length === 0) {
        estadoVazio.classList.remove('hidden');
        infoResultados.classList.add('hidden');
        return;
    }

    estadoVazio.classList.add('hidden');
    infoResultados.classList.remove('hidden');

    // Reset estilo do banner de info
    infoResultados.classList.remove('bg-orange-50', 'border-orange-200');
    infoResultados.classList.add('bg-blue-50', 'border-blue-200');
    const svgInfo = infoResultados.querySelector('svg');
    if (svgInfo) { svgInfo.classList.remove('text-orange-600'); svgInfo.classList.add('text-blue-600'); }
    document.getElementById('textoResultados').classList.remove('text-orange-700');
    document.getElementById('textoResultados').classList.add('text-blue-700');

    document.getElementById('textoResultados').textContent =
        `${lista.length} prestador${lista.length !== 1 ? 'es' : ''} encontrado${lista.length !== 1 ? 's' : ''}`;

    // Centro Médico sempre primeiro
    lista = [...lista].sort((a, b) => {
        const aIsCentro = a.nome.toUpperCase().includes('CENTRO MEDICO DE ESPECIALIDADES PRES. PRUDENTE');
        const bIsCentro = b.nome.toUpperCase().includes('CENTRO MEDICO DE ESPECIALIDADES PRES. PRUDENTE');
        if (aIsCentro && !bIsCentro) return -1;
        if (!aIsCentro && bIsCentro) return 1;
        if (a.distancia && b.distancia) return a.distancia - b.distancia;
        return 0;
    });

    if (localizacaoUsuario) {
        lista = lista.map(p => {
            const coords = obterCoordenadas(p);
            if (coords) {
                p.distancia = calcularDistancia(
                    localizacaoUsuario.latitude, localizacaoUsuario.longitude,
                    coords.lat, coords.lon
                );
            }
            return p;
        });

        lista.sort((a, b) => {
            const aIsCentro = a.nome.toUpperCase().includes('CENTRO MEDICO DE ESPECIALIDADES PRES. PRUDENTE');
            const bIsCentro = b.nome.toUpperCase().includes('CENTRO MEDICO DE ESPECIALIDADES PRES. PRUDENTE');
            if (aIsCentro && !bIsCentro) return -1;
            if (!aIsCentro && bIsCentro) return 1;
            return (a.distancia || 999) - (b.distancia || 999);
        });

        document.getElementById('textoLocalizacao').textContent =
            'Ordenado por proximidade da sua localização';
    } else {
        document.getElementById('textoLocalizacao').textContent = '';
    }

    lista.forEach(prestador => {
        const card = criarCardPrestador(prestador);
        container.appendChild(card);
    });
}

function criarCardPrestador(prestador) {
    const isCentroMedico = prestador.nome.toUpperCase().includes('CENTRO MEDICO DE ESPECIALIDADES PRES. PRUDENTE');

    const div = document.createElement('div');
    div.className = `bg-white rounded-2xl shadow-xl p-6 card-hover fade-in ${isCentroMedico ? 'centro-medico-premium' : ''}`;

    const enderecoCompleto = `${prestador.endereco}${prestador.bairro ? ', ' + prestador.bairro : ''}, ${prestador.cidade}`;
    const telefoneFormatado = prestador.telefone.replace(/\D/g, '');
    const whatsappLink = `https://wa.me/55${telefoneFormatado}`;
    const mapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(enderecoCompleto)}`;

    const cores = CORES_TIPO[prestador.classificacao] || { bg: 'bg-gray-100', text: 'text-gray-700' };

    div.innerHTML = `
        <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
                <h3 class="text-xl font-bold text-gray-800 mb-2">${prestador.nome}</h3>
                <div class="flex flex-wrap gap-2 mb-3">
                    ${isCentroMedico ? `
                        <span class="badge-complexo inline-block px-3 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-amber-400 to-amber-500 text-white shadow-lg border-2 border-amber-600">
                            ⭐ Complexo de Especialidades
                        </span>
                    ` : `
                        <span class="inline-block px-3 py-1 rounded-full text-xs font-bold ${cores.bg} ${cores.text}">
                            ${prestador.classificacao}
                        </span>
                    `}
                    ${prestador.distancia ? `
                        <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
                            📍 ${prestador.distancia.toFixed(1)} km
                        </span>
                    ` : ''}
                </div>
            </div>
        </div>

        <div class="space-y-3 mb-4">
            ${prestador.especialidade ? `
                <div class="flex items-start gap-3">
                    <svg class="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                    </svg>
                    <p class="text-sm text-gray-700 font-semibold">${prestador.especialidade}</p>
                </div>
            ` : ''}
            <div class="flex items-start gap-3">
                <svg class="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <p class="text-sm text-gray-600">${enderecoCompleto}</p>
            </div>
            ${prestador.telefone ? `
                <div class="flex items-center gap-3">
                    <svg class="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                    </svg>
                    <p class="text-sm text-gray-600 font-semibold">${prestador.telefone}</p>
                </div>
            ` : ''}
        </div>

        ${isCentroMedico ? `
            <div class="mt-4 mb-2">
                <button onclick="abrirModalCentroMedico()" class="w-full px-4 py-3 bg-gradient-to-r from-[#003D58] to-[#00A8B0] text-white rounded-lg hover:opacity-90 font-bold shadow-md transition-all flex items-center justify-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    Ver Corpo Clínico Completo (102 profissionais)
                </button>
            </div>
        ` : ''}

        <div class="flex gap-3 pt-4 border-t border-gray-200">
            ${prestador.telefone ? `
                <a href="${whatsappLink}" target="_blank" class="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold shadow-md transition-all flex items-center justify-center gap-2">
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    WhatsApp
                </a>
            ` : ''}
            <a href="${mapsLink}" target="_blank" class="flex-1 px-4 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 font-bold shadow-md transition-all flex items-center justify-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/>
                </svg>
                Maps
            </a>
        </div>
    `;

    return div;
}

// ==================== GEOLOCALIZAÇÃO ====================

function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function obterCoordenadas(prestador) {
    const coordenadas = {
        'PRESIDENTE PRUDENTE': { lat: -22.1217, lon: -51.3881 },
        'CAMPO GRANDE': { lat: -20.4697, lon: -54.6201 },
        'ADAMANTINA': { lat: -21.6842, lon: -51.0719 },
        'ASSIS': { lat: -22.6615, lon: -50.4121 },
        'DOURADOS': { lat: -22.2211, lon: -54.8056 },
        'DRACENA': { lat: -21.4843, lon: -51.5346 },
        'TRES LAGOAS': { lat: -20.7867, lon: -51.6783 },
        'RANCHARIA': { lat: -22.2297, lon: -50.8939 }
    };

    const cidadeUpper = prestador.cidade.toUpperCase();
    for (let cidade in coordenadas) {
        if (cidadeUpper.includes(cidade)) return coordenadas[cidade];
    }
    return null;
}

function usarGeolocalizacao() {
    if (!navigator.geolocation) {
        alert('Geolocalização não é suportada pelo seu navegador');
        return;
    }

    const btn = document.getElementById('btnGeolocalizacao');
    btn.disabled = true;
    btn.innerHTML = `<div class="loading-spinner w-5 h-5 border-2"></div><span class="hidden sm:inline">Localizando...</span>`;

    navigator.geolocation.getCurrentPosition(
        (position) => {
            localizacaoUsuario = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };
            btn.disabled = false;
            btn.innerHTML = `
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span class="hidden sm:inline">Localização Ativa</span>
            `;
            btn.classList.remove('from-[#003D58]', 'to-[#00A8B0]');
            btn.classList.add('bg-green-600', 'hover:bg-green-700');
            document.getElementById('botaoUrgencia').classList.remove('hidden');
            aplicarFiltros();
        },
        () => {
            alert('Não foi possível obter sua localização. Por favor, permita o acesso à localização.');
            btn.disabled = false;
            btn.innerHTML = `
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <span class="hidden sm:inline">Usar Localização</span>
            `;
        }
    );
}

function filtrarUrgencia() {
    if (!localizacaoUsuario) {
        alert('Por favor, ative sua localização primeiro');
        return;
    }
    let resultado = prestadores.filter(p => p.tipo_codigo === 'HOS');
    if (resultado.length === 0) {
        alert('Nenhum hospital encontrado na base. Em caso de emergência, ligue 192 (SAMU).');
        return;
    }
    document.getElementById('containerResultados').scrollIntoView({ behavior: 'smooth' });
    renderizarPrestadores(resultado);
}

// ==================== FALLBACK GEOGRÁFICO ====================

function aplicarFallbackGeografico(resultado, cidadeFiltro) {
    if (resultado.length > 0 || !cidadeFiltro) return { prestadores: resultado, mensagemFallback: null };

    const prestadoresPolos = prestadores.filter(p => POLOS_SAUDE.includes(p.cidade.toUpperCase()));
    if (prestadoresPolos.length > 0) {
        return {
            prestadores: prestadoresPolos,
            mensagemFallback: `Não encontramos em ${cidadeFiltro}. Veja opções nos polos de saúde da região:`
        };
    }
    return { prestadores, mensagemFallback: `Não encontramos em ${cidadeFiltro}. Veja todas as opções disponíveis:` };
}

function exibirAvisoFallback(mensagem) {
    const infoResultados = document.getElementById('infoResultados');
    infoResultados.classList.remove('hidden', 'bg-blue-50', 'border-blue-200');
    infoResultados.classList.add('bg-orange-50', 'border-orange-200');
    document.getElementById('textoResultados').classList.remove('text-blue-700');
    document.getElementById('textoResultados').classList.add('text-orange-700');
    document.getElementById('textoResultados').textContent = mensagem;
}

// ==================== MODAL CENTRO MÉDICO ====================

function abrirModalCentroMedico() {
    document.getElementById('modalCentroMedico').classList.remove('hidden');
    renderizarMedicosCentro(MEDICOS_CENTRO_MEDICO);
}

function fecharModalCentroMedico() {
    document.getElementById('modalCentroMedico').classList.add('hidden');
}

function renderizarMedicosCentro(lista) {
    const container = document.getElementById('listaMedicosCentro');
    container.innerHTML = '';

    const porEspecialidade = {};
    lista.forEach(m => {
        if (!porEspecialidade[m.especialidade]) porEspecialidade[m.especialidade] = [];
        porEspecialidade[m.especialidade].push(m);
    });

    Object.keys(porEspecialidade).sort().forEach(esp => {
        const secao = document.createElement('div');
        secao.className = 'mb-4 pb-2 border-b-2 border-[#00A8B0]';
        secao.innerHTML = `
            <h3 class="text-lg font-bold text-[#003D58] flex items-center gap-2">
                <svg class="w-5 h-5 text-[#00A8B0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                </svg>
                ${esp} <span class="text-sm font-normal text-gray-500">(${porEspecialidade[esp].length})</span>
            </h3>
        `;
        container.appendChild(secao);

        porEspecialidade[esp].forEach(m => {
            const item = document.createElement('div');
            item.className = 'bg-gray-50 rounded-lg p-4 mb-3 hover:shadow-md transition-all';
            item.innerHTML = `
                <p class="font-bold text-[#003D58]">${m.nome}</p>
                <p class="text-sm text-gray-600 mt-1">👤 ${m.idade}</p>
            `;
            container.appendChild(item);
        });
    });

    document.getElementById('totalMedicosCentro').textContent = lista.length;
}

// ==================== PDF ====================

async function gerarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.setTextColor(0, 61, 88);
    doc.setFont(undefined, 'bold');
    doc.text('OESTE SAÚDE', 105, 20, { align: 'center' });

    doc.setFontSize(14);
    doc.setTextColor(0, 168, 176);
    doc.text('Rede Credenciada de Prestadores', 105, 28, { align: 'center' });

    doc.setDrawColor(0, 168, 176);
    doc.setLineWidth(0.5);
    doc.line(20, 32, 190, 32);

    const nome = document.getElementById('inputNome').value.toLowerCase();
    const especialidade = document.getElementById('selectEspecialidade').value;
    const cidade = document.getElementById('selectCidade').value;

    let prestadoresPDF = prestadores;
    if (nome) prestadoresPDF = prestadoresPDF.filter(p =>
        p.nome.toLowerCase().includes(nome) || p.especialidade.toLowerCase().includes(nome) || p.cidade.toLowerCase().includes(nome)
    );
    if (especialidade) prestadoresPDF = prestadoresPDF.filter(p => p.especialidade.includes(especialidade));
    if (cidade) prestadoresPDF = prestadoresPDF.filter(p => p.cidade === cidade);
    if (tipoFiltroAtivo) prestadoresPDF = prestadoresPDF.filter(p => p.classificacao === tipoFiltroAtivo);
    if (estadoFiltroAtivo) prestadoresPDF = prestadoresPDF.filter(p => CIDADES_POR_ESTADO[estadoFiltroAtivo].includes(p.cidade.toUpperCase()));
    if (exclusivoAtivo) prestadoresPDF = prestadoresPDF.filter(p => REDE_EXCLUSIVA.includes(p.nome.toUpperCase()));

    prestadoresPDF.sort((a, b) => a.cidade !== b.cidade ? a.cidade.localeCompare(b.cidade) : a.nome.localeCompare(b.nome));

    let y = 40;
    doc.setFontSize(10);
    doc.setTextColor(100, 116, 139);
    doc.setFont(undefined, 'normal');
    let filtroInfo = `Total de prestadores: ${prestadoresPDF.length}`;
    if (cidade) filtroInfo += ` | Cidade: ${cidade}`;
    if (estadoFiltroAtivo) filtroInfo += ` | Estado: ${estadoFiltroAtivo}`;
    doc.text(filtroInfo, 105, y, { align: 'center' });
    y += 10;

    let cidadeAtual = '';
    prestadoresPDF.forEach(prestador => {
        if (y > 270) { doc.addPage(); y = 20; }

        if (prestador.cidade !== cidadeAtual) {
            cidadeAtual = prestador.cidade;
            if (y > 40) y += 5;
            doc.setFillColor(0, 61, 88);
            doc.rect(20, y, 170, 8, 'F');
            doc.setFontSize(11);
            doc.setTextColor(255, 255, 255);
            doc.setFont(undefined, 'bold');
            doc.text(cidadeAtual.toUpperCase(), 25, y + 5.5);
            y += 12;
        }

        doc.setFontSize(10); doc.setTextColor(0, 61, 88); doc.setFont(undefined, 'bold');
        doc.text(prestador.nome, 25, y); y += 5;
        doc.setFontSize(8); doc.setTextColor(0, 168, 176); doc.setFont(undefined, 'bold');
        doc.text(prestador.classificacao, 25, y); y += 4;
        doc.setFontSize(8); doc.setTextColor(71, 85, 105); doc.setFont(undefined, 'normal');
        const espTexto = prestador.especialidade.substring(0, 80) + (prestador.especialidade.length > 80 ? '...' : '');
        doc.text(espTexto, 25, y); y += 4;
        const endTexto = `${prestador.endereco}${prestador.bairro ? ', ' + prestador.bairro : ''}`.substring(0, 70);
        doc.text(`Endereço: ${endTexto}`, 25, y); y += 4;
        if (prestador.telefone) { doc.text(`Tel: ${prestador.telefone}`, 25, y); y += 4; }
        doc.setDrawColor(226, 232, 240); doc.setLineWidth(0.1); doc.line(25, y + 1, 185, y + 1); y += 6;
    });

    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8); doc.setTextColor(148, 163, 184);
        doc.text(`Página ${i} de ${totalPages}`, 105, 287, { align: 'center' });
        doc.text(`Gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, 105, 292, { align: 'center' });
    }

    const nomeArquivo = cidade ? `Rede_Oeste_Saude_${cidade.replace(/\s+/g, '_')}.pdf` : 'Rede_Oeste_Saude_Completa.pdf';
    doc.save(nomeArquivo);
}

function gerarPDFCentroMedico() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFontSize(20); doc.setTextColor(0, 61, 88); doc.setFont(undefined, 'bold');
    doc.text('OESTE SAÚDE', 105, 20, { align: 'center' });
    doc.setFontSize(16); doc.setTextColor(0, 168, 176);
    doc.text('Centro Médico de Especialidades', 105, 28, { align: 'center' });
    doc.setFontSize(12); doc.setTextColor(71, 85, 105); doc.setFont(undefined, 'normal');
    doc.text('Corpo Clínico Completo', 105, 35, { align: 'center' });
    doc.setDrawColor(0, 168, 176); doc.setLineWidth(0.5); doc.line(20, 39, 190, 39);
    doc.setFontSize(10); doc.setTextColor(100, 116, 139);
    doc.text('Rua Fagundes Varella, 185, Vila Lessa, Presidente Prudente', 105, 45, { align: 'center' });
    doc.text('Telefone: (18) 3300-0100', 105, 50, { align: 'center' });

    let y = 58;
    const porEspecialidade = {};
    MEDICOS_CENTRO_MEDICO.forEach(m => {
        if (!porEspecialidade[m.especialidade]) porEspecialidade[m.especialidade] = [];
        porEspecialidade[m.especialidade].push(m);
    });

    Object.keys(porEspecialidade).sort().forEach(esp => {
        const medicos = porEspecialidade[esp];
        if (y > 270) { doc.addPage(); y = 20; }
        doc.setFillColor(0, 61, 88); doc.rect(20, y, 170, 8, 'F');
        doc.setFontSize(11); doc.setTextColor(255, 255, 255); doc.setFont(undefined, 'bold');
        doc.text(`${esp} (${medicos.length})`, 25, y + 5.5); y += 12;

        medicos.forEach(m => {
            if (y > 275) { doc.addPage(); y = 20; }
            doc.setFontSize(10); doc.setTextColor(0, 61, 88); doc.setFont(undefined, 'bold');
            const nomeTexto = m.nome.length > 60 ? m.nome.substring(0, 60) + '...' : m.nome;
            doc.text(nomeTexto, 25, y); y += 4;
            doc.setFontSize(8); doc.setTextColor(100, 116, 139); doc.setFont(undefined, 'normal');
            doc.text(`Atende: ${m.idade}`, 25, y); y += 6;
            doc.setDrawColor(226, 232, 240); doc.setLineWidth(0.1); doc.line(25, y, 185, y); y += 2;
        });
        y += 3;
    });

    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8); doc.setTextColor(148, 163, 184);
        doc.text(`Página ${i} de ${totalPages}`, 105, 287, { align: 'center' });
        doc.text(`Total: ${MEDICOS_CENTRO_MEDICO.length} profissionais | Gerado em ${new Date().toLocaleDateString('pt-BR')}`, 105, 292, { align: 'center' });
    }
    doc.save('Centro_Medico_Oeste_Saude_Corpo_Clinico.pdf');
}

// ==================== PAINEL ADMINISTRATIVO ====================

function toggleModalAdm() {
    const modal = document.getElementById('modalAdm');
    const isVisible = !modal.classList.contains('hidden');
    if (isVisible) {
        modal.classList.add('hidden');
    } else {
        modal.classList.remove('hidden');
        atualizarEstatisticas();
    }
}

function atualizarEstatisticas() {
    document.getElementById('statTotalPrestadores').textContent = prestadores.length.toLocaleString('pt-BR');
    document.getElementById('statTotalEspecialidades').textContent = especialidades.length.toLocaleString('pt-BR');
    document.getElementById('statTotalCidades').textContent = cidades.length.toLocaleString('pt-BR');
    document.getElementById('statTotalHospitais').textContent = prestadores.filter(p => p.tipo_codigo === 'HOS').length.toLocaleString('pt-BR');
}

function exportarExcel() {
    try {
        const wb = XLSX.utils.book_new();
        const dadosExport = prestadores.map(p => ({
            'PRESTADOR / MÉDICO': p.nome,
            'CLASSIFICAÇÃO': p.classificacao,
            'ESPECIALIDADE': p.especialidade,
            'CIDADE': p.cidade,
            'ENDEREÇO': p.endereco,
            'BAIRRO': p.bairro,
            'TELEFONE': p.telefone
        }));
        const ws = XLSX.utils.json_to_sheet(dadosExport);
        ws['!cols'] = [{ wch: 40 }, { wch: 20 }, { wch: 30 }, { wch: 25 }, { wch: 40 }, { wch: 20 }, { wch: 15 }];
        XLSX.utils.book_append_sheet(wb, ws, 'Rede Credenciada');
        XLSX.writeFile(wb, `Rede_Credenciada_Oeste_${new Date().toISOString().split('T')[0]}.xlsx`);
        alert('✅ Excel exportado com sucesso!');
    } catch (error) {
        alert('❌ Erro ao exportar Excel.');
    }
}

function setupUploadJson(inputId, btnId, statusId, target) {
    document.getElementById(btnId).addEventListener('click', () => {
        document.getElementById(inputId).click();
    });

    document.getElementById(inputId).addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target.result);
                if (target === 'rede') jsonRede = json;
                else if (target === 'tipos') jsonTipos = json;
                else if (target === 'especialidades') jsonEspecialidades = json;
                document.getElementById(statusId).innerHTML = '✅ ' + file.name;
                if (jsonRede && jsonTipos && jsonEspecialidades) {
                    document.getElementById('btnProcessarJsons').disabled = false;
                }
            } catch {
                alert(`❌ Erro ao ler ${file.name}: JSON inválido`);
                document.getElementById(statusId).innerHTML = '❌ Erro';
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    });
}

function processarJsons() {
    if (!jsonRede || !jsonTipos || !jsonEspecialidades) {
        alert('Por favor, carregue os 3 arquivos JSON');
        return;
    }

    try {
        const tiposLookup = {};
        jsonTipos.tiposPrestador.forEach(t => { tiposLookup[t.tipo_prestador] = t.descricao; });

        const espLookup = {};
        jsonEspecialidades.especialidades.forEach(e => {
            e.codigo_especialidade.split(',').forEach(cod => { espLookup[cod.trim()] = e.descricao; });
        });

        const novosPrestadores = [];
        const novasEspecialidades = new Set();
        const novasCidades = new Set();
        const novosTipos = new Set();

        jsonRede.redeCredenciada.forEach(p => {
            const enderecoPartes = [p.endereco || ''];
            if (p.numero) enderecoPartes.push(p.numero);
            const enderecoCompleto = enderecoPartes.filter(Boolean).join(', ');

            const especialidadesCod = (p.especialidades_atendidas || '').split(',');
            const especialidadesDesc = [];
            especialidadesCod.forEach(cod => {
                cod = cod.trim();
                if (cod && espLookup[cod]) { especialidadesDesc.push(espLookup[cod]); novasEspecialidades.add(espLookup[cod]); }
            });

            const tipoCod = p.tipo_prestador || '';
            const tipoDesc = tiposLookup[tipoCod] || tipoCod;
            if (tipoDesc) novosTipos.add(tipoDesc);

            const prestador = {
                nome: p.nome_prestador || '',
                classificacao: tipoDesc,
                tipo_codigo: tipoCod,
                especialidade: especialidadesDesc.join(', '),
                cidade: p.municipio || '',
                endereco: enderecoCompleto,
                bairro: p.bairro || '',
                telefone: p.telefone || '',
                email: p.email || ''
            };

            novosPrestadores.push(prestador);
            if (prestador.cidade) novasCidades.add(prestador.cidade);
        });

        prestadores = novosPrestadores;
        especialidades = Array.from(novasEspecialidades).sort();
        cidades = Array.from(novasCidades).sort();
        tipos = Array.from(novosTipos).sort();

        localStorage.setItem('oeste_prestadores_v2', JSON.stringify({ prestadores, especialidades, cidades, tipos }));

        popularFiltros();
        criarBadgesFiltro();
        aplicarFiltros();
        atualizarEstatisticas();

        jsonRede = jsonTipos = jsonEspecialidades = null;
        document.getElementById('statusRede').innerHTML = 'rede.json';
        document.getElementById('statusTipos').innerHTML = 'tipos.json';
        document.getElementById('statusEspecialidades').innerHTML = 'especialidades.json';
        document.getElementById('btnProcessarJsons').disabled = true;

        alert(`✅ Base atualizada com sucesso!\n\n${prestadores.length} prestadores importados`);
        toggleModalAdm();
    } catch (error) {
        console.error('Erro ao processar:', error);
        alert('❌ Erro ao processar JSONs. Verifique o console.');
    }
}

function limparCache() {
    if (!confirm('⚠️ ATENÇÃO: Isso removerá TODOS os dados salvos localmente.\n\nApós confirmar, a página será recarregada.\n\nDeseja continuar?')) return;
    localStorage.removeItem('oeste_prestadores_v2');
    alert('✅ Cache limpo! A página será recarregada.');
    location.reload();
}

// ==================== EVENT LISTENERS ====================

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('inputNome').addEventListener('input', aplicarFiltros);
    document.getElementById('selectEspecialidade').addEventListener('change', aplicarFiltros);
    document.getElementById('selectCidade').addEventListener('change', aplicarFiltros);
    document.getElementById('btnGeolocalizacao').addEventListener('click', usarGeolocalizacao);
    document.getElementById('btnLimpar').addEventListener('click', limparFiltros);
    document.getElementById('btnUrgencia').addEventListener('click', filtrarUrgencia);
    document.getElementById('btnFiltroSP').addEventListener('click', () => filtrarPorEstado('SP'));
    document.getElementById('btnFiltroMS').addEventListener('click', () => filtrarPorEstado('MS'));
    document.getElementById('btnFiltroExclusivo').addEventListener('click', filtrarPorExclusivo);
    document.getElementById('btnGerarPDF').addEventListener('click', gerarPDF);

    document.getElementById('btnFecharAdm').addEventListener('click', toggleModalAdm);
    document.getElementById('btnExportar').addEventListener('click', exportarExcel);
    document.getElementById('btnProcessarJsons').addEventListener('click', processarJsons);
    document.getElementById('btnLimparCache').addEventListener('click', limparCache);

    document.getElementById('btnFecharModalCentro').addEventListener('click', fecharModalCentroMedico);
    document.getElementById('modalCentroMedico').addEventListener('click', (e) => {
        if (e.target.id === 'modalCentroMedico') fecharModalCentroMedico();
    });
    document.getElementById('inputBuscaMedico').addEventListener('input', (e) => {
        const t = e.target.value.toLowerCase();
        renderizarMedicosCentro(MEDICOS_CENTRO_MEDICO.filter(m =>
            m.nome.toLowerCase().includes(t) || m.especialidade.toLowerCase().includes(t)
        ));
    });
    document.getElementById('btnGerarPDFModal').addEventListener('click', gerarPDFCentroMedico);

    document.getElementById('modalAdm').addEventListener('click', (e) => {
        if (e.target.id === 'modalAdm') toggleModalAdm();
    });

    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.shiftKey && e.key === 'A') { e.preventDefault(); toggleModalAdm(); }
    });

    document.querySelectorAll('.jornada-card').forEach(card => {
        card.addEventListener('click', function () {
            const jornada = this.getAttribute('data-jornada');
            if (jornadaAtiva === jornada) {
                jornadaAtiva = null;
                document.querySelectorAll('.jornada-card').forEach(c => c.classList.remove('active'));
            } else {
                jornadaAtiva = jornada;
                document.querySelectorAll('.jornada-card').forEach(c => c.classList.remove('active'));
                this.classList.add('active');
            }
            aplicarFiltros();
        });
    });

    setupUploadJson('inputRede', 'btnImportarRede', 'statusRede', 'rede');
    setupUploadJson('inputTipos', 'btnImportarTipos', 'statusTipos', 'tipos');
    setupUploadJson('inputEspecialidades', 'btnImportarEspecialidades', 'statusEspecialidades', 'especialidades');

    init();
});
