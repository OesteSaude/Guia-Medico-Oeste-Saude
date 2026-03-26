/**
 * Módulo de Eventos
 * Responsável por: vincular eventos aos elementos do DOM
 */

const EventManager = (() => {
    const aplicarFiltros = () => {
        const prestadores = DataManager.getPrestadores();
        const resultado = FilterManager.aplicar(prestadores);
        const localizacao = GeolocationManager.getLocalizacao();
        RenderManager.renderizarPrestadores(resultado, localizacao);
    };

    const filtrarPorTipo = (tipo) => {
        if (FilterManager.getFiltro('tipo') === tipo) {
            FilterManager.setFiltro('tipo', null);
            document.querySelectorAll('.badge-filter').forEach(b => {
                b.classList.remove('active', 'ring-2', 'ring-offset-2');
            });
        } else {
            FilterManager.setFiltro('tipo', tipo);
            document.querySelectorAll('.badge-filter').forEach(b => {
                b.classList.remove('active', 'ring-2', 'ring-offset-2');
                if (b.getAttribute('data-tipo') === tipo) {
                    b.classList.add('active', 'ring-2', 'ring-offset-2');
                }
            });
        }
        aplicarFiltros();
    };

    const filtrarPorEstado = (estado) => {
        if (FilterManager.getFiltro('estado') === estado) {
            FilterManager.setFiltro('estado', null);
            document.getElementById('btnFiltroSP').classList.remove('bg-[#00A8B0]', 'text-white');
            document.getElementById('btnFiltroSP').classList.add('bg-white', 'text-[#003D58]');
            document.getElementById('btnFiltroMS').classList.remove('bg-[#00A8B0]', 'text-white');
            document.getElementById('btnFiltroMS').classList.add('bg-white', 'text-[#003D58]');
        } else {
            FilterManager.setFiltro('estado', estado);
            if (estado === 'SP') {
                document.getElementById('btnFiltroSP').classList.add('bg-[#00A8B0]', 'text-white');
                document.getElementById('btnFiltroSP').classList.remove('bg-white', 'text-[#003D58]');
                document.getElementById('btnFiltroMS').classList.remove('bg-[#00A8B0]', 'text-white');
                document.getElementById('btnFiltroMS').classList.add('bg-white', 'text-[#003D58]');
            } else {
                document.getElementById('btnFiltroMS').classList.add('bg-[#00A8B0]', 'text-white');
                document.getElementById('btnFiltroMS').classList.remove('bg-white', 'text-[#003D58]');
                document.getElementById('btnFiltroSP').classList.remove('bg-[#00A8B0]', 'text-white');
                document.getElementById('btnFiltroSP').classList.add('bg-white', 'text-[#003D58]');
            }
        }
        aplicarFiltros();
    };

    const filtrarPorExclusivo = () => {
        const novoValor = !FilterManager.getFiltro('exclusivo');
        FilterManager.setFiltro('exclusivo', novoValor);
        
        const btnExclusivo = document.getElementById('btnFiltroExclusivo');
        if (novoValor) {
            btnExclusivo.classList.add('bg-[#00A8B0]', 'text-white');
            btnExclusivo.classList.remove('bg-white', 'text-[#003D58]');
            FilterManager.setFiltro('estado', null);
            document.getElementById('btnFiltroSP').classList.remove('bg-[#00A8B0]', 'text-white');
            document.getElementById('btnFiltroSP').classList.add('bg-white', 'text-[#003D58]');
            document.getElementById('btnFiltroMS').classList.remove('bg-[#00A8B0]', 'text-white');
            document.getElementById('btnFiltroMS').classList.add('bg-white', 'text-[#003D58]');
        } else {
            btnExclusivo.classList.remove('bg-[#00A8B0]', 'text-white');
            btnExclusivo.classList.add('bg-white', 'text-[#003D58]');
        }
        aplicarFiltros();
    };

    const limparFiltros = () => {
        FilterManager.limpar();
        GeolocationManager.limpar();
        
        document.getElementById('inputNome').value = '';
        document.getElementById('selectEspecialidade').value = '';
        document.getElementById('selectCidade').value = '';

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
    };

    const init = () => {
        document.getElementById('inputNome').addEventListener('input', aplicarFiltros);
        document.getElementById('selectEspecialidade').addEventListener('change', aplicarFiltros);
        document.getElementById('selectCidade').addEventListener('change', aplicarFiltros);
        document.getElementById('btnGeolocalizacao').addEventListener('click', GeolocationManager.usarGeolocalizacao);
        document.getElementById('btnLimpar').addEventListener('click', limparFiltros);
        document.getElementById('btnUrgencia').addEventListener('click', GeolocationManager.filtrarUrgencia);
        document.getElementById('btnFiltroSP').addEventListener('click', () => filtrarPorEstado('SP'));
        document.getElementById('btnFiltroMS').addEventListener('click', () => filtrarPorEstado('MS'));
        document.getElementById('btnFiltroExclusivo').addEventListener('click', filtrarPorExclusivo);
        document.getElementById('btnGerarPDF').addEventListener('click', PDFManager.gerarPDF);

        document.getElementById('btnFecharAdm').addEventListener('click', ModalManager.fecharAdm);
        document.getElementById('btnExportar').addEventListener('click', AdminManager.exportarExcel);
        document.getElementById('btnProcessarJsons').addEventListener('click', AdminManager.processarJsons);
        document.getElementById('btnLimparCache').addEventListener('click', AdminManager.limparCache);

        document.getElementById('btnFecharModalCentro').addEventListener('click', ModalManager.fecharCentroMedico);
        document.getElementById('modalCentroMedico').addEventListener('click', (e) => {
            if (e.target.id === 'modalCentroMedico') ModalManager.fecharCentroMedico();
        });
        document.getElementById('inputBuscaMedico').addEventListener('input', (e) => {
            const t = e.target.value.toLowerCase();
            ModalManager.renderizarMedicosCentro(MEDICOS_CENTRO_MEDICO.filter(m =>
                m.nome.toLowerCase().includes(t) || m.especialidade.toLowerCase().includes(t)
            ));
        });
        document.getElementById('btnGerarPDFModal').addEventListener('click', PDFManager.gerarPDFCentroMedico);

        document.getElementById('modalAdm').addEventListener('click', (e) => {
            if (e.target.id === 'modalAdm') ModalManager.fecharAdm();
        });

        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'A') { 
                e.preventDefault(); 
                ModalManager.abrirAdm(); 
            }
        });

        document.querySelectorAll('.jornada-card').forEach(card => {
            card.addEventListener('click', function () {
                const jornada = this.getAttribute('data-jornada');
                if (FilterManager.getFiltro('jornada') === jornada) {
                    FilterManager.setFiltro('jornada', null);
                    document.querySelectorAll('.jornada-card').forEach(c => c.classList.remove('active'));
                } else {
                    FilterManager.setFiltro('jornada', jornada);
                    document.querySelectorAll('.jornada-card').forEach(c => c.classList.remove('active'));
                    this.classList.add('active');
                }
                aplicarFiltros();
            });
        });

        AdminManager.setupUploadJson('inputRede', 'btnImportarRede', 'statusRede', 'rede');
        AdminManager.setupUploadJson('inputTipos', 'btnImportarTipos', 'statusTipos', 'tipos');
        AdminManager.setupUploadJson('inputEspecialidades', 'btnImportarEspecialidades', 'statusEspecialidades', 'especialidades');
    };

    return {
        init,
        aplicarFiltros,
        filtrarPorTipo,
        filtrarPorEstado,
        filtrarPorExclusivo,
        limparFiltros
    };
})();