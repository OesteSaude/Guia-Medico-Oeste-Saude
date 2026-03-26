/**
 * Módulo Administrativo
 * Responsável por: importar dados, exportar, limpar cache
 */

const AdminManager = (() => {
    let jsonRede = null;
    let jsonTipos = null;
    let jsonEspecialidades = null;

    const atualizarEstatisticas = () => {
        const prestadores = DataManager.getPrestadores();
        document.getElementById('statTotalPrestadores').textContent = prestadores.length.toLocaleString('pt-BR');
        document.getElementById('statTotalEspecialidades').textContent = DataManager.getEspecialidades().length.toLocaleString('pt-BR');
        document.getElementById('statTotalCidades').textContent = DataManager.getCidades().length.toLocaleString('pt-BR');
        document.getElementById('statTotalHospitais').textContent = prestadores.filter(p => p.tipo_codigo === 'HOS').length.toLocaleString('pt-BR');
    };

    const exportarExcel = () => {
        try {
            const wb = XLSX.utils.book_new();
            const prestadores = DataManager.getPrestadores();
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
    };

    const setupUploadJson = (inputId, btnId, statusId, target) => {
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
    };

    const processarJsons = () => {
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

            DataManager.atualizar(
                novosPrestadores,
                Array.from(novasEspecialidades).sort(),
                Array.from(novasCidades).sort(),
                Array.from(novosTipos).sort()
            );

            RenderManager.renderizarFiltros(DataManager.getEspecialidades(), DataManager.getCidades());
            RenderManager.renderizarBadgesFiltro(DataManager.getPrestadores());
            EventManager.aplicarFiltros();
            atualizarEstatisticas();

            jsonRede = jsonTipos = jsonEspecialidades = null;
            document.getElementById('statusRede').innerHTML = 'rede.json';
            document.getElementById('statusTipos').innerHTML = 'tipos.json';
            document.getElementById('statusEspecialidades').innerHTML = 'especialidades.json';
            document.getElementById('btnProcessarJsons').disabled = true;

            alert(`✅ Base atualizada com sucesso!\n\n${novosPrestadores.length} prestadores importados`);
            ModalManager.fecharAdm();
        } catch (error) {
            console.error('Erro ao processar:', error);
            alert('❌ Erro ao processar JSONs. Verifique o console.');
        }
    };

    const limparCache = () => {
        if (!confirm('⚠️ ATENÇÃO: Isso removerá TODOS os dados salvos localmente.\n\nApós confirmar, a página será recarregada.\n\nDeseja continuar?')) return;
        DataManager.limpar();
        alert('✅ Cache limpo! A página será recarregada.');
        location.reload();
    };

    return {
        atualizarEstatisticas,
        exportarExcel,
        setupUploadJson,
        processarJsons,
        limparCache
    };
})();