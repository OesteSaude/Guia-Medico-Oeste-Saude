/**
 * Módulo de Renderização
 * Responsável por: renderizar cards, filtros, badges, etc.
 */

const RenderManager = (() => {
    const CORES_TIPO = {
        'MEDICO': { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-200' },
        'CLINICA': { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200' },
        'HOSPITAL': { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-200' },
        'LABORATORIO': { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200' },
        // ... mais tipos
    };

    const renderizarPrestadores = (lista, localizacao = null) => {
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

        // Ordenar: Centro Médico primeiro, depois por distância
        lista = ordenarPrestadores(lista, localizacao);

        // Calcular distâncias se houver localização
        if (localizacao) {
            lista = lista.map(p => {
                const coords = GeolocationManager.obterCoordenadas(p);
                if (coords) {
                    p.distancia = GeolocationManager.calcularDistancia(
                        localizacao.latitude, localizacao.longitude,
                        coords.lat, coords.lon
                    );
                }
                return p;
            });
        }

        atualizarInfoResultados(lista, localizacao);

        lista.forEach(prestador => {
            const card = criarCardPrestador(prestador);
            container.appendChild(card);
        });
    };

    const criarCardPrestador = (prestador) => {
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
                    <button onclick="ModalManager.abrirCentroMedico()" class="w-full px-4 py-3 bg-gradient-to-r from-[#003D58] to-[#00A8B0] text-white rounded-lg hover:opacity-90 font-bold shadow-md transition-all flex items-center justify-center gap-2">
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
    };

    const renderizarFiltros = (especialidades, cidades) => {
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
    };

    const renderizarBadgesFiltro = (prestadores) => {
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
            badge.onclick = () => EventManager.filtrarPorTipo(tipo);

            container.appendChild(badge);
        });
    };

    const atualizarInfoResultados = (lista, localizacao) => {
        const infoResultados = document.getElementById('infoResultados');
        document.getElementById('textoResultados').textContent =
            `${lista.length} prestador${lista.length !== 1 ? 'es' : ''} encontrado${lista.length !== 1 ? 's' : ''}`;

        if (localizacao) {
            document.getElementById('textoLocalizacao').textContent = 'Ordenado por proximidade da sua localização';
        } else {
            document.getElementById('textoLocalizacao').textContent = '';
        }
    };

    const ordenarPrestadores = (lista, localizacao) => {
        return [...lista].sort((a, b) => {
            const aIsCentro = a.nome.toUpperCase().includes('CENTRO MEDICO DE ESPECIALIDADES PRES. PRUDENTE');
            const bIsCentro = b.nome.toUpperCase().includes('CENTRO MEDICO DE ESPECIALIDADES PRES. PRUDENTE');
            if (aIsCentro && !bIsCentro) return -1;
            if (!aIsCentro && bIsCentro) return 1;
            if (localizacao && a.distancia && b.distancia) return a.distancia - b.distancia;
            return 0;
        });
    };

    return {
        renderizarPrestadores,
        criarCardPrestador,
        renderizarFiltros,
        renderizarBadgesFiltro,
        atualizarInfoResultados,
        CORES_TIPO
    };
})();