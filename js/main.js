document.addEventListener('DOMContentLoaded', () => {
    let entradas = 0;
    let saidas = 0;
    let listaDespesas = [];

    // Carrega as despesas salvas no localStorage ao iniciar a página
    if (localStorage.getItem('despesas')) {
        listaDespesas = JSON.parse(localStorage.getItem('despesas'));
        calcularEntradasSaidas();  // Atualiza os valores de entradas e saídas com os dados salvos
        renderizarListaDespesas();  // Renderiza a lista de despesas com os dados salvos
    }

    // Função para atualizar os valores de entradas, saídas e total
    function atualizarTotais() {
        const total = entradas - saidas;
        document.getElementById('entradas').textContent = `R$ ${entradas.toFixed(2)}`;
        document.getElementById('saidas').textContent = `R$ ${saidas.toFixed(2)}`;
        document.getElementById('total').textContent = `R$ ${total.toFixed(2)}`;
    }

    // Função para adicionar uma nova despesa
    function adicionarDespesa(descricao, valor, tipo) {
        const novaDespesa = { descricao, valor, tipo };
        listaDespesas.push(novaDespesa);

        // Salva as despesas no localStorage
        localStorage.setItem('despesas', JSON.stringify(listaDespesas));

        calcularEntradasSaidas();
        atualizarTotais();
        renderizarListaDespesas();
    }

    // Função para calcular entradas e saídas
    function calcularEntradasSaidas() {
        entradas = 0;
        saidas = 0;

        listaDespesas.forEach((despesa) => {
            if (despesa.tipo === 'entrada') {
                entradas += parseFloat(despesa.valor);
            } else if (despesa.tipo === 'saida') {
                saidas += parseFloat(despesa.valor);
            }
        });

        atualizarTotais();
    }

    // Função para renderizar a lista de despesas na tabela
    function renderizarListaDespesas() {
        const tbody = document.getElementById('despesas-lista');
        tbody.innerHTML = '';  // Limpa a tabela

        listaDespesas.forEach((despesa, index) => {
            const tr = document.createElement('tr');
            
            // Descrição
            const tdDescricao = document.createElement('td');
            tdDescricao.textContent = despesa.descricao;
            tr.appendChild(tdDescricao);

            // Valor
            const tdValor = document.createElement('td');
            tdValor.textContent = `R$ ${parseFloat(despesa.valor).toFixed(2)}`;
            tr.appendChild(tdValor);

            // Tipo (entrada ou saída com ícones usando HTML Entities)
            const tdTipo = document.createElement('td');
            const icon = document.createElement('span');
            if (despesa.tipo === 'entrada') {
                icon.innerHTML = '&#9650;';  // Seta para cima (Entrada)
                icon.classList.add('green-arrow');  // Aplica a classe verde
            } else {
                icon.innerHTML = '&#9660;';  // Seta para baixo (Saída)
                icon.classList.add('red-arrow');  // Aplica a classe vermelha
            }
            tdTipo.appendChild(icon);
            tr.appendChild(tdTipo);

            // Ações (botão de excluir)
            const tdAcoes = document.createElement('td');
            const btnExcluir = document.createElement('button');
            btnExcluir.textContent = '🗑️';  // Ícone de lixeira
            btnExcluir.addEventListener('click', () => removerDespesa(index));
            tdAcoes.appendChild(btnExcluir);
            tr.appendChild(tdAcoes);

            tbody.appendChild(tr);
        });
    }

    // Função para remover uma despesa da lista
    function removerDespesa(index) {
        const despesaRemovida = listaDespesas.splice(index, 1)[0];

        // Atualiza o localStorage após a remoção
        localStorage.setItem('despesas', JSON.stringify(listaDespesas));

        calcularEntradasSaidas();
        atualizarTotais();
        renderizarListaDespesas();
    }

    // Evento de clique para adicionar despesa
    document.getElementById('adicionar').addEventListener('click', () => {
        const descricao = document.getElementById('descricao').value;
        const valor = document.getElementById('valor').value;
        const tipo = document.querySelector('input[name="tipo"]:checked').value;

        if (descricao !== '' && valor !== '') {
            adicionarDespesa(descricao, valor, tipo);
            // Limpar os campos após adicionar
            document.getElementById('descricao').value = '';
            document.getElementById('valor').value = '';
        }
    });

    // Inicializa com os valores padrões
    atualizarTotais();
});
