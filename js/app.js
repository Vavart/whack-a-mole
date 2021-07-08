const allParcelles = Array.from(document.querySelectorAll(".parcelle"));
const allParcellesImg = Array.from(document.querySelectorAll(".parcelle img"));
const affScore = document.querySelector(".score");
const affBestScore = document.querySelector(".bestScore");
let meilleurScore = 0;
let score = 0;
const para = document.querySelector("body p:nth-of-type(1)");
const resetBtn = document.querySelector(".reset");
const playBtn = document.querySelector(".play");
let isPlaying = false;
let isLoose = false;

const timeDifficulty = [400, 300, 200, 100, 65];
let difficulty = 1;
let respawnTime = timeDifficulty[difficulty -1];

let intervApparition;
let timeoutKill;

function isFull () {

    tabCheck = [];

    for (let i = 0; i < allParcelles.length; i++) {
        if (allParcelles[i].childNodes[1].getAttribute("data-visible") === "true") {
         tabCheck.push(allParcelles[i]);
        }       
    }

    console.log(tabCheck);

    if (tabCheck.length === allParcelles.length) {

        isLoose = true;
        return isLoose;
    }

    return isLoose;
}

// Fonction qui renvoie une parcelle aléatoire
function randomParcelle () {
    let randomIndex =  Math.floor(Math.random() * allParcelles.length);
    return randomIndex;
}

// Apparition aléatoire d'une taupe
function randomApparition () {


    // Une taupe qui apparaît toutes les "respawnTime" : Défini 
    intervApparition = setInterval(() => {

        if (isFull()) {

            endGame ();
            return;
        }

        // Augmentation de la difficulté en fonction du score
        if (score >= 10 && score < 20) {
            difficulty = 2;
            respawnTime = timeDifficulty[difficulty -1]; 

            clearInterval(intervApparition);
            randomApparition ();
        }

        else if (score >= 20 && score < 30) {
            difficulty = 3;
            respawnTime = timeDifficulty[difficulty -1];

            clearInterval(intervApparition);
            randomApparition ();
        }

        else if (score >= 30 && score < 40) {
            difficulty = 4;
            respawnTime = timeDifficulty[difficulty -1];

            clearInterval(intervApparition);
            randomApparition ();
        }

        else if (score >= 50) {
            difficulty = 5;
            respawnTime = timeDifficulty[difficulty -1];

            clearInterval(intervApparition);
            randomApparition ();
        }
        
        let index = randomParcelle ();
        
        // Taupe qui monde
        gsap.to(allParcellesImg[index], {
            y:0,
            duration: 0.2
        })

        allParcellesImg[index].setAttribute("data-visible", "true");

        // Pour chaque parcelle on vérifie s'il une taupe est bien présente dessus
        // pour qu'elle redescende si on clique dessus
        allParcelles.forEach(parcelle => {
            parcelle.addEventListener("click", () => {

                // On vérifie si l'on clique sur une taupe
                if (parcelle.childNodes[1].getAttribute("data-visible") === "true") {

                    // On récupère la parcelle en question pour faire rentrer la taupe en question
                    let indexParcelle = allParcelles.indexOf(parcelle);
                    
                    gsap.to(allParcellesImg[indexParcelle], {
                        y:150,
                        duration: 0.2
                    })
            
                    score++;
                    affScore.innerText = `Score : ${score}`;

                    parcelle.childNodes[1].setAttribute("data-visible", "false");
                    return;
                }

                // Sinon on fait rien
                else {
                    return
                }
            })
        })

    }, respawnTime);

}

function endGame () {

    isPlaying = false;
    clearTimeout(timeoutKill);
    clearInterval(intervApparition);

    // Affichage meilleur score
    if ((score !== 0) && (score > meilleurScore)) {
        affBestScore.innerText = `Meilleur Score : ${score}`;
        meilleurScore = score;
    }

    // On reset le score...
    score = 0;
    affScore.innerText = `Score : ${score}`;

    // ...et la grille
    allParcelles.forEach((parcelle, index) => {

        gsap.to(allParcellesImg[index], {
            y:150,
            duration: 0.1
        })
    });

    // Message perdu
    para.innerText = `C'est perdu pour cette fois, appuyez sur 'Play' pour rejouer!`
}

function init () {
    isPlaying = true;
    isLoose = false;

    para.innerHTML = `Tapez sur les taupes qui apparaissent avec votre souris ! <br> Bon courage! `;

    allParcelles.forEach((parcelle, index) => {

        gsap.to(allParcellesImg[index], {
            y:150,
            duration: 0.1
        })

        allParcellesImg[index].setAttribute("data-visible", "false");
    });
}


// Boutout reset
resetBtn.addEventListener("click", () => {
    endGame();
});

// Bouton play
playBtn.addEventListener("click", () => {

    if (isPlaying) {
        return;
    } else {
        init ();
        randomApparition();
    }
});
