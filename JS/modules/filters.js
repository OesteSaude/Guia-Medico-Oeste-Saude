/**
 * Módulo de Filtros
 * Responsável por: aplicar e gerenciar filtros
 */

const FilterManager = (() => {
    let filtroAtivo = {
        nome: '',
        especialidade: '',
        cidade: '',
        tipo: null,
        jornada: null,
        estado: null,
        exclusivo: false
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

    const CIDADES_POR_ESTADO = {
        'SP': ['PRESIDENTE PRUDENTE', 'DRACENA', 'ADAMANTINA', /* ... */],
        'MS': ['NOVA ANDRADINA', 'DOURADOS', 'CAMPO GRANDE', /* ... */]
    };

    const REDE_EXCLUSIVA = [
        "ANA JULIA ELORZA MORAES DOS SANTOS",
        "CENTRO MEDICO DE ESPECIALIDADES PRES. PRUDENTE",
        /* ... */
    ];

    const aplicar = (prestadores) => {
        let resultado = prestadores;

        if (filtroAtivo.nome) {
            const nome = filtroAtivo.nome.toLowerCase();
            resultado = resultado.filter(p =>
                p.nome.toLowerCase().includes(nome) ||
                p.especialidade.toLowerCase().includes(nome) ||
                p.cidade.toLowerCase().includes(nome)
            );
        }

        if (filtroAtivo.especialidade) {
            resultado = resultado.filter(p =>
                p.especialidade.includes(filtroAtivo.especialidade)
            );
        }

        if (filtroAtivo.cidade) {
            resultado = resultado.filter(p => p.cidade === filtroAtivo.cidade);
        }

        if (filtroAtivo.tipo) {
            resultado = resultado.filter(p => p.classificacao === filtroAtivo.tipo);
        }

        if (filtroAtivo.jornada) {
            const jornada = JORNADAS[filtroAtivo.jornada];
            if (jornada) {
                resultado = resultado.filter(p => {
                    const esps = p.especialidade.split(',').map(e => e.trim());
                    return esps.some(esp => jornada.match(esp, p.tipo_codigo));
                });
            }
        }

        if (filtroAtivo.estado) {
            resultado = resultado.filter(p =>
                CIDADES_POR_ESTADO[filtroAtivo.estado].includes(p.cidade.toUpperCase())
            );
        }

        if (filtroAtivo.exclusivo) {
            resultado = resultado.filter(p =>
                REDE_EXCLUSIVA.includes(p.nome.toUpperCase())
            );
        }

        return resultado;
    };

    const setFiltro = (chave, valor) => {
        filtroAtivo[chave] = valor;
    };

    const getFiltro = (chave) => {
        return chave ? filtroAtivo[chave] : filtroAtivo;
    };

    const limpar = () => {
        filtroAtivo = {
            nome: '',
            especialidade: '',
            cidade: '',
            tipo: null,
            jornada: null,
            estado: null,
            exclusivo: false
        };
    };

    return {
        aplicar,
        setFiltro,
        getFiltro,
        limpar,
        JORNADAS,
        CIDADES_POR_ESTADO,
        REDE_EXCLUSIVA
    };
})();