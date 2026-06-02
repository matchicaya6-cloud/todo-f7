// ============================================================
//  Ma ToDo — point de départ
//  Écran unique, sans routage.
// ============================================================

var $$ = Dom7; // utilitaire DOM intégré à Framework7

var app = new Framework7({
    el: '#app',
    name: 'MaToDo',
    theme: 'auto',
    routes: routes,
});

var mainView = app.views.create('.view-main', { url: '/' });

// ============================================================
//  SÉANCE 2 — déclarer le tableau des tâches, puis :
//    - une fonction afficher() qui construit la liste
//    - une fonction ajouterTache(texte)
//    - une fonction supprimerTache(id)
// ============================================================
/*let taches = [
    { id: 1, texte: "Module F7 - Introduction", fait: true },
    { id: 2, texte: "Module F7 - Session 1", fait: true },
    { id: 3, texte: "Module F7 - Session 2", fait: false },
    { id: 4, texte: "Module F7 - Session 3", fait: false },
];*/

let filtreActif = 'toutes';

//cle utilise pour sauvegarder les tâches dans localStorage
const LS_CLE = 'todo-list';
let taches = chargerTaches();

//localstorage

//sauvegarder objet --- texte
function sauvegarder() {
    localStorage.setItem(LS_CLE, JSON.stringify(taches));
}
// Charger : texte -> objet (ou tâches d'exemple la première fois)
function chargerTaches() {
 const data = localStorage.getItem(LS_CLE);
 if (data) return JSON.parse(data);
 return [ ];
}


function tachesVisibles() {
 if (filtreActif === 'afaire') return taches.filter(function (t) { return !t.fait; });
 if (filtreActif === 'faites') return taches.filter(function (t) { return t.fait; });
 return taches;
}

function ligneTache(t) {
    return `
        <li class="item-content" data-id="${t.id}">
            <div class="item-media">
                <label class="checkbox">
                    <input type="checkbox" ${t.fait ? 'checked' : ''} />
                    <i class="icon-checkbox"></i>
                </label>
            </div>
            <div class="item-inner">
                <div class="item-title ${t.fait ? 'tache-faite' : ''}">
                    ${t.texte}
                </div>
                <div class="item-after">
                    <a href="#" class="btn-suppr"><i class="icon f7-icons">trash</i></a>
                </div>
            </div>
        </li>
    `;
}

function afficherTaches() {
    $$('.liste-taches').empty();

    let tacheVisibles = tachesVisibles();

    tacheVisibles.map(tache => {
        const li = ligneTache(tache);
        $$('.liste-taches').append(li);
    });

    //compteur de tâches restantes
const nbreTachesRestantes = tachesVisibles().filter(function (t) { return !t.fait; }).length;
$$('.compteur').text(nbreTachesRestantes + ' tâche(s) restante(s)');
   
}
 
    
    $$(document).on('click', '.filtre-btn', function () {
 $$('.filtre-btn').removeClass('button-active');
 $$(this).addClass('button-active');
 filtreActif = $$(this).attr('data-filtre');
 afficherTaches();
});



function ajouterTache() {
    const champTache = $$('#saisie-tache');
    const saisieTache = champTache.val()

    if (saisieTache.trim() === '') return;

    const newId = taches.reduce(function (m, t) { return Math.max(m, t.id); }, 0) + 1;

    const newTache = {
        id: newId,
        texte: saisieTache.trim(),
        fait: false,
    }

    taches.push(newTache);

    //ajouter tableau de taches
    sauvegarder();

    afficherTaches();

    champTache.val('');
    app.toast.create({ text: 'Tâche ajoutée !', closeTimeout: 1200 }).open();
}


function supprimerTache(id) {
   const taches = taches.filter(function (t) { return t.id !== parseInt(id, 10); });

    sauvegarder();
    afficherTaches();
}

$$(document).on('click', '#btn-ajouter', function () {
    ajouterTache();
});

// Ajout en appuyant sur Entrée
$$(document).on('keypress', '#saisie-tache', function (e) {
    if (e.keyCode === 13) {
        e.preventDefault();

        ajouterTache();
    }
});

function basculerTache(id) {
 var tache = taches.find(function (x) { return x.id === parseInt(id, 10); });
 if (tache) { tache.fait = !tache.fait; 
    sauvegarder();
    afficherTaches(); }
}



$$(document).on('click', '.btn-suppr', function (e) {
    e.preventDefault();

    const id = $$(this).parents('.item-content').attr('data-id');
    supprimerTache(id);
});

$$(document).on('page:init', '.page[data-name="taches"]', function () {
    afficherTaches(); // premier appel de la fonction
});


// Cochage / décochage d'une tâche

$$(document).on('change', '.liste-taches input[type="checkbox"]', function () {
 var id = $$(this).parents('.item-content').attr('data-id');
 basculerTache(id);

});







//  SÉANCE 3 — ajouter :
//    - basculerTache(id) pour cocher / décocher
//    - le compteur de tâches restantes
//    - les filtres (Toutes / À faire / Faites)
//    - chargerTaches() et sauvegarder() avec localStorage
// ------------------------------------------------------------

// Exemple de structure de données (à activer en séance 2) :
// var taches = [
//   { id: 1, texte: "Réviser l'algorithmique", fait: false },
// ];