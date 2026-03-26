/**
 * Módulo de PDF
 * Responsável por: gerar PDFs
 */

const PDFManager = (() => {
    const gerarPDF = () => {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        const prestadores = DataManager.getPrestadores();
        const filtros = FilterManager.getFiltro();

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

        let prestadoresPDF = FilterManager.aplicar(prestadores);
        prestadoresPDF.sort((a, b) => 
            a.cidade !== b.cidade ? a.cidade.localeCompare(b.cidade) : a.nome.localeCompare(b.nome)
        );

        let y = 40;
        doc.setFontSize(10);
        doc.setTextColor(100, 116, 139);
        doc.setFont(undefined, 'normal');
        let filtroInfo = `Total de prestadores: ${prestadoresPDF.length}`;
        if (filtros.cidade) filtroInfo += ` | Cidade: ${filtros.cidade}`;
        if (filtros.estado) filtroInfo += ` | Estado: ${filtros.estado}`;
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

        const nomeArquivo = filtros.cidade ? `Rede_Oeste_Saude_${filtros.cidade.replace(/\s+/g, '_')}.pdf` : 'Rede_Oeste_Saude_Completa.pdf';
        doc.save(nomeArquivo);
    };

    const gerarPDFCentroMedico = () => {
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
    };

    return {
        gerarPDF,
        gerarPDFCentroMedico
    };
})();