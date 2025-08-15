// ------------------------------
// VARIABLES PRINCIPALES
// ------------------------------

// Zone où on va placer les nombres
const zoneNombres = document.getElementById('zoneNombres');

// Info affichée dans le HTML
const affichageJoueurActuel = document.getElementById('joueurActuel');
const affichageProchainNombre = document.getElementById('prochainNombre');
const affichageScoreJoueur1 = document.getElementById('scoreJoueur1');
const affichageScoreJoueur2 = document.getElementById('scoreJoueur2');
const popupFin = document.getElementById('popupFin');
const messagePopup = document.getElementById('messagePopup'); 
const boutonFermerPopup = document.getElementById('fermerPopup');


// Boutons et sélection
const boutonDemarrer = document.getElementById('demarrer');
const boutonReinitialiser = document.getElementById('reinitialiser');
const selectNombreMax = document.getElementById('nombreMax');

// Variables du jeu
let tempsRestant = 8;      // secondes par tour
let intervalTimer = null;   // pour stocker l'intervalle
let joueurActuel = 1;        // 1 ou 2
let scoreJoueur1 = 0;
let scoreJoueur2 = 0;
let prochainNombre = 1;      // nombre que le joueur doit cliquer
let nombres = [];            // tableau contenant tous les nombres
let nombreMax = Number(selectNombreMax.value); // nombre maximum choisi



// Mélange un tableau avec 
function melanger(tableau) {
    for (let i = tableau.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [tableau[i], tableau[j]] = [tableau[j], tableau[i]];
    }
    return tableau;
}


// Génère et affiche les nombres aléatoirement sur la page
function genererNombres() {
    zoneNombres.innerHTML = '';
    
    nombres = [];
    for (let i = 1; i <= nombreMax; i++) {
        nombres.push(i);
    }
    
    melanger(nombres);

    // tableau pour stocker les positions déjà prises
    const positionsOccupees = [];

    nombres.forEach(nombre => {
        const element = document.createElement('button');
        element.textContent = nombre;
        element.classList.add('nombre');

        const zoneW = zoneNombres.clientWidth;
        const zoneH = zoneNombres.clientHeight;
        const boutonW = 50; // largeur du bouton
        const boutonH = 50; // hauteur du bouton

        let positionTrouvee = false;
        let essais = 0;
        while (!positionTrouvee && essais < 200) {
            essais++;
            const x = Math.random() * (zoneW - boutonW);
            const y = Math.random() * (zoneH - boutonH);

            const nouveauRect = {x, y, w: boutonW, h: boutonH};
            let chevauche = false;

            for (const rect of positionsOccupees) {
                if (!(x + boutonW <= rect.x || rect.x + rect.w <= x || y + boutonH <= rect.y || rect.y + rect.h <= y)) {
                    chevauche = true;
                    break;
                }
            }

            if (!chevauche) {
                positionTrouvee = true;
                positionsOccupees.push(nouveauRect);
                element.style.left = x + 'px';
                element.style.top = y + 'px';
            }
        }

        // si pas trouvé après 200 essais, placer quand même
        if (!positionTrouvee) {
            const x = Math.random() * (zoneW - boutonW);
            const y = Math.random() * (zoneH - boutonH);
            element.style.left = x + 'px';
            element.style.top = y + 'px';
            positionsOccupees.push({x, y, w: boutonW, h: boutonH});
        }

        // clic sur le nombre
        element.addEventListener('click', () => clicNombre(element, nombre));

        zoneNombres.appendChild(element);
    });
}



// Fonction appelée quand un joueur clique sur un nombre
function clicNombre(element, nombre) {
    if (nombre === prochainNombre) {
        // clic correct
        element.style.backgroundColor = joueurActuel === 1 ? '#60a5fa' : '#f87171';
        element.style.color = 'white';
        element.disabled = true;

        
        element.classList.add('fini');

        if (joueurActuel === 1) scoreJoueur1++;
        else scoreJoueur2++;

        prochainNombre++;
        affichageProchainNombre.textContent = prochainNombre;
        miseAJourScores();

        if (prochainNombre > nombreMax) {
            finDuJeu();
            clearInterval(intervalTimer); // stop timer si fin
            return;
        }

        // passe au joueur suivant
        changerJoueur();
        tempsRestant = 8;
        demarrerTimer(); // relance le timer pour le nouveau joueur
    } else {
        // clic incorrect → petit effet
        element.style.transform = 'scale(1.3)';
        setTimeout(() => element.style.transform = 'scale(1)', 200);

        // passe aussi au joueur suivant
        changerJoueur();
        tempsRestant = 8;
        demarrerTimer();
    }
}


// Met à jour les scores dans l'interface
function miseAJourScores() {
    affichageScoreJoueur1.textContent = scoreJoueur1;
    affichageScoreJoueur2.textContent = scoreJoueur2;
}

// Change de joueur
function changerJoueur() {
    joueurActuel = joueurActuel === 1 ? 2 : 1;
    affichageJoueurActuel.textContent = joueurActuel;

    // couleur du joueur actuel
    affichageJoueurActuel.style.color = joueurActuel === 1 ? '#2563eb' : '#ef4444';
}

// Gerer le timing 
function demarrerTimer() {
    // affiche le temps initial
    document.getElementById('timer').textContent = tempsRestant;

    // clear si un timer était déjà lancé
    if (intervalTimer) clearInterval(intervalTimer);

    intervalTimer = setInterval(() => {
        tempsRestant--;
        document.getElementById('timer').textContent = tempsRestant;

        if (tempsRestant <= 0) {
            clearInterval(intervalTimer);
            // temps écoulé → changer de joueur
            changerJoueur();
            // remettre le timer à 8 secondes pour le prochain joueur
            tempsRestant = 8;
            demarrerTimer();
        }
    }, 1000);
}

function afficherPopup(message) {
    messagePopup.textContent = message; // afficher le texte
    popupFin.classList.add('show');
 
}





// Fonction appelée quand le jeu est terminé
function finDuJeu() {
    let message = '';
    if (scoreJoueur1 > scoreJoueur2) message = '🎉 Le Joueur 1 gagne !';
    else if (scoreJoueur2 > scoreJoueur1) message = '🎉 Le Joueur 2 gagne !';
    else message = '🤝 Égalité !';

    afficherPopup(message);
}




// Réinitialise le jeu
function reinitialiserJeu() {
    joueurActuel = 1;
    scoreJoueur1 = 0;
    scoreJoueur2 = 0;
    prochainNombre = 1;
    nombreMax = Number(selectNombreMax.value);
    affichageJoueurActuel.textContent = joueurActuel;
    affichageProchainNombre.textContent = prochainNombre;
    miseAJourScores();
    zoneNombres.innerHTML = '';
}

boutonFermerPopup.addEventListener('click', () => {
    popupFin.classList.remove('show');
    reinitialiserJeu();
});


// ÉVÉNEMENTS BOUTONS

boutonDemarrer.addEventListener('click', () => {
    reinitialiserJeu();
    genererNombres();
    demarrerTimer();
});

boutonReinitialiser.addEventListener('click', reinitialiserJeu);
