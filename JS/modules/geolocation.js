/**
 * Módulo de Geolocalização
 * Responsável por: calcular distâncias e obter coordenadas
 */

const GeolocationManager = (() => {
    let localizacaoUsuario = null;

    const COORDENADAS_CIDADES = {
        'PRESIDENTE PRUDENTE': { lat: -22.1217, lon: -51.3881 },
        'CAMPO GRANDE': { lat: -20.4697, lon: -54.6201 },
        'ADAMANTINA': { lat: -21.6842, lon: -51.0719 },
        'DRACENA': { lat: -21.4843, lon: -51.5346 },
        'TRES LAGOAS': { lat: -20.7867, lon: -51.6783 },
        'NOVA ANDRADINA': { lat: -21.2, lon: -55.5 },
        'DOURADOS': { lat: -22.2211, lon: -54.8056 },
        // ... adicionar todas as cidades
    };

    const calcularDistancia = (lat1, lon1, lat2, lon2) => {
        const R = 6371;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    };

    const obterCoordenadas = (prestador) => {
        const cidadeUpper = prestador.cidade.toUpperCase();
        for (let cidade in COORDENADAS_CIDADES) {
            if (cidadeUpper.includes(cidade)) return COORDENADAS_CIDADES[cidade];
        }
        return null;
    };

    const usarGeolocalizacao = () => {
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
                EventManager.aplicarFiltros();
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
    };

    const filtrarUrgencia = () => {
        if (!localizacaoUsuario) {
            alert('Por favor, ative sua localização primeiro');
            return;
        }
        let resultado = DataManager.getPrestadores().filter(p => p.tipo_codigo === 'HOS');
        if (resultado.length === 0) {
            alert('Nenhum hospital encontrado na base. Em caso de emergência, ligue 192 (SAMU).');
            return;
        }
        document.getElementById('containerResultados').scrollIntoView({ behavior: 'smooth' });
        RenderManager.renderizarPrestadores(resultado, localizacaoUsuario);
    };

    const limpar = () => {
        localizacaoUsuario = null;
    };

    return {
        calcularDistancia,
        obterCoordenadas,
        usarGeolocalizacao,
        filtrarUrgencia,
        limpar,
        getLocalizacao: () => localizacaoUsuario,
        setLocalizacao: (loc) => { localizacaoUsuario = loc; }
    };
})();