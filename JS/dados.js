/**
 * dados.js
 * 
 * Arquivo de dados da Rede Credenciada Oeste Saúde.
 * Cole aqui o conteúdo completo do objeto DADOS_COMPLETOS
 * que estava originalmente embutido no HTML.
 * 
 * Este arquivo expõe a variável global window.DADOS_COMPLETOS
 * que é consumida por app.js na inicialização.
 * 
 * Se houver dados salvos no localStorage (chave 'oeste_prestadores_v2'),
 * eles terão prioridade sobre este arquivo.
 */

window.DADOS_COMPLETOS = {
    "prestadores": [
        // Cole aqui o array completo de prestadores
        // Exemplo de estrutura:
        // {
        //   "nome": "NOME DO PRESTADOR",
        //   "classificacao": "MEDICO",
        //   "tipo_codigo": "MED",
        //   "especialidade": "CARDIOLOGIA",
        //   "cidade": "PRESIDENTE PRUDENTE",
        //   "endereco": "RUA EXEMPLO, 100",
        //   "bairro": "CENTRO",
        //   "telefone": "18 99999-9999",
        //   "email": "exemplo@email.com"
        // }
    ],
    "especialidades": [
        // Cole aqui o array de strings com as especialidades
        // Exemplo: "CARDIOLOGIA", "PEDIATRIA", etc.
    ],
    "cidades": [
        // Cole aqui o array de strings com as cidades
        // Exemplo: "PRESIDENTE PRUDENTE", "DRACENA", etc.
    ],
    "tipos": [
        // Cole aqui o array de strings com os tipos de prestador
        // Exemplo: "MEDICO", "CLINICA", "HOSPITAL", etc.
    ]
};
