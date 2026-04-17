var APP_CONFIG = { gasEndpoint: 'https://script.google.com/macros/s/AKfycbzbO9kONhY7MIq1jVI1RxQ1gkrCJCL2IFpmNFekGyRQNMCFif03Jheshx2pEt8mHeJtfw/exec' };

var app = { prestadores: [] };

function fetchPrestadores() {
    fetch(APP_CONFIG.gasEndpoint, { method: 'GET' })
        .then(function(response) {
            return response.json();
        })
        .then(function(json) {
            if (json.status === 'success') {
                app.prestadores = json.data;
                renderizarCards(app.prestadores);
            } else {
                console.error(json.message);
                mostrarEstadoVazio();
            }
        })
        .catch(function(error) {
            console.error(error);
            mostrarEstadoVazio();
        });
}

function renderizarCards(prestadores) {
    var container = document.getElementById('resultsContainer');
    container.innerHTML = '';
    for (var i = 0; i < prestadores.length; i++) {
        var prestador = prestadores[i];
        var card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = '<h3>' + prestador.prestador + '</h3>' +
                         '<p>Especialidade: ' + prestador.especialidade + '</p>' +
                         '<p>Cidade: ' + prestador.cidade + '</p>' +
                         '<p>Endereço: ' + prestador.endereco + '</p>' +
                         '<p>Bairro: ' + prestador.bairro + '</p>' +
                         '<p>Telefone: ' + prestador.telefone + '</p>';
        container.appendChild(card);
    }
}

function filtrarPrestadores() {
    var filterName = document.getElementById('filterName').value.toLowerCase();
    var filterSpecialty = document.getElementById('filterSpecialty').value.toLowerCase();
    var filterCity = document.getElementById('filterCity').value.toLowerCase();
    var filtered = [];
    for (var i = 0; i < app.prestadores.length; i++) {
        var p = app.prestadores[i];
        if (p.prestador.toLowerCase().indexOf(filterName) !== -1 &&
            p.especialidade.toLowerCase().indexOf(filterSpecialty) !== -1 &&
            p.cidade.toLowerCase().indexOf(filterCity) !== -1) {
            filtered.push(p);
        }
    }
    renderizarCards(filtered);
}

function toggleJornada(jornada) {
    var filtered = [];
    for (var i = 0; i < app.prestadores.length; i++) {
        var p = app.prestadores[i];
        if (p.especialidade.toLowerCase().indexOf(jornada.toLowerCase()) !== -1) {
            filtered.push(p);
        }
    }
    renderizarCards(filtered);
}

function configurarEventListeners() {
    var filterNameEl = document.getElementById('filterName');
    if (filterNameEl) {
        filterNameEl.addEventListener('input', filtrarPrestadores);
    }
    var filterSpecialtyEl = document.getElementById('filterSpecialty');
    if (filterSpecialtyEl) {
        filterSpecialtyEl.addEventListener('input', filtrarPrestadores);
    }
    var filterCityEl = document.getElementById('filterCity');
    if (filterCityEl) {
        filterCityEl.addEventListener('input', filtrarPrestadores);
    }
    // Assuming jornada buttons have class 'jornada-btn' and data-jornada attribute
    var jornadaBtns = document.querySelectorAll('.jornada-btn');
    for (var i = 0; i < jornadaBtns.length; i++) {
        jornadaBtns[i].addEventListener('click', function() {
            toggleJornada(this.getAttribute('data-jornada'));
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    configurarEventListeners();
    fetchPrestadores();
});