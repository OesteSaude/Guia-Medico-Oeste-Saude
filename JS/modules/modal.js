/**
 * Módulo de Modais
 * Responsável por: abrir, fechar e gerenciar modais
 */

const ModalManager = (() => {
    const abrirCentroMedico = () => {
        document.getElementById('modalCentroMedico').classList.remove('hidden');
        renderizarMedicosCentro(MEDICOS_CENTRO_MEDICO);
    };

    const fecharCentroMedico = () => {
        document.getElementById('modalCentroMedico').classList.add('hidden');
    };

    const renderizarMedicosCentro = (lista) => {
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
    };

    const abrirAdm = () => {
        document.getElementById('modalAdm').classList.remove('hidden');
        AdminManager.atualizarEstatisticas();
    };

    const fecharAdm = () => {
        document.getElementById('modalAdm').classList.add('hidden');
    };

    return {
        abrirCentroMedico,
        fecharCentroMedico,
        renderizarMedicosCentro,
        abrirAdm,
        fecharAdm
    };
})();