/**
 * Módulo de Gerenciamento de Dados
 * Responsável por: carregar, armazenar e atualizar dados
 */

const DataManager = (() => {
    let prestadores = [];
    let especialidades = [];
    let cidades = [];
    let tipos = [];

    const init = async () => {
        const dadosArmazenados = localStorage.getItem('oeste_prestadores_v2');

        if (dadosArmazenados) {
            const dados = JSON.parse(dadosArmazenados);
            prestadores = dados.prestadores;
            especialidades = dados.especialidades;
            cidades = dados.cidades;
            tipos = dados.tipos || [];
        } else if (window.DADOS_COMPLETOS?.prestadores.length > 0) {
            prestadores = window.DADOS_COMPLETOS.prestadores;
            especialidades = window.DADOS_COMPLETOS.especialidades;
            cidades = window.DADOS_COMPLETOS.cidades;
            tipos = window.DADOS_COMPLETOS.tipos || [];
            salvar();
        }
    };

    const salvar = () => {
        localStorage.setItem('oeste_prestadores_v2', JSON.stringify({
            prestadores,
            especialidades,
            cidades,
            tipos
        }));
    };

    const atualizar = (novosPrestadores, novasEspecialidades, novasCidades, novosTipos) => {
        prestadores = novosPrestadores;
        especialidades = novasEspecialidades;
        cidades = novasCidades;
        tipos = novosTipos;
        salvar();
    };

    const limpar = () => {
        localStorage.removeItem('oeste_prestadores_v2');
        prestadores = [];
        especialidades = [];
        cidades = [];
        tipos = [];
    };

    return {
        init,
        salvar,
        atualizar,
        limpar,
        getPrestadores: () => prestadores,
        getEspecialidades: () => especialidades,
        getCidades: () => cidades,
        getTipos: () => tipos,
        setPrestadores: (data) => { prestadores = data; salvar(); },
        setEspecialidades: (data) => { especialidades = data; salvar(); },
        setCidades: (data) => { cidades = data; salvar(); },
        setTipos: (data) => { tipos = data; salvar(); }
    };
})();