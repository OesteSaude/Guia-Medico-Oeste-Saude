/**
 * Main.js
 * Arquivo de inicialização principal
 * Carrega todos os módulos e inicia a aplicação
 */

document.addEventListener('DOMContentLoaded', async () => {
    try {
        // 1. Carregar dados
        await DataManager.init();

        // 2. Renderizar filtros e badges
        RenderManager.renderizarFiltros(DataManager.getEspecialidades(), DataManager.getCidades());
        RenderManager.renderizarBadgesFiltro(DataManager.getPrestadores());

        // 3. Renderizar prestadores iniciais
        RenderManager.renderizarPrestadores(DataManager.getPrestadores());

        // 4. Inicializar eventos
        EventManager.init();

        // 5. Esconder loading
        document.getElementById('loading').classList.add('hidden');

        console.log('✅ Aplicação inicializada com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao inicializar aplicação:', error);
        alert('Erro ao carregar a aplicação. Verifique o console.');
    }
});