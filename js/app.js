const allParcelles = Array.from(document.querySelectorAll(".parcelle"));
const allParcellesImg = Array.from(document.querySelectorAll(".parcelle img"));
const affScore = document.querySelector(".score");
const affBestScore = document.querySelector(".bestScore");
let meilleurScore = 0;
let score = 0;
const resetBtn = document.querySelector(".reset");
const playBtn = document.querySelector(".play");
let isPlaying = false;

const timeDifficulty = [650, 500, 350];
let difficulty = 1;
let respawnTime = timeDifficulty[difficulty -1];

let intervApparition;
let timeoutKill;

// Animation si perte d'un point (une taupe qui rentre)
const animPointEnMoins = gsap.to (affScore, {

    paused: true,
    
    keyframes : [
        {duration: 0.1, x: -4},
        {duration: 0.1, x: 4},
        {duration: 0.1, x: -4},
        {duration: 0.1, x: 0},
    ]
})


// Fonction qui renvoie une parcelle aléatoire
function randomParcelle () {
    let randomIndex =  Math.floor(Math.random() * allParcelles.length);
    return randomIndex;
}

// Apparition aléatoire d'une taupe
function randomApparition () {


    // Une taupe qui apparaît toutes les "respawnTime" : Défini 
    intervApparition = setInterval(() => {

        console.log(respawnTime);

        // Augmentation de la difficulté en fonction du score
        if (score >= 10 && score < 20) {
            difficulty = 2;
            respawnTime = timeDifficulty[difficulty -1]; 

            clearInterval(intervApparition);
            randomApparition ();
        }

        if (score >= 20) {
            difficulty = 3;
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
                    let index = allParcelles.indexOf(parcelle);
                    
                    gsap.to(allParcellesImg[index], {
                        y:150,
                        duration: 0.2
                    })
            
                    score++;
                    affScore.innerText = `Score : ${score}`;

                    parcelle.childNodes[1].setAttribute("data-visible", "false");
                }

                // Sinon on fait rien
                else {
                    return
                }
            })
        })

        // Si une taupe n'est pas touchée (donc au bout de 2s)
        timeoutKill = setTimeout(() => {

            
            if (allParcellesImg[index].getAttribute("data-visible") === "true" && isPlaying) {
                
                gsap.to(allParcellesImg[index], {
                    y:150,
                    duration: 0.2
                })

                score--;
                affScore.innerText = `Score : ${score}`;
                animPointEnMoins.seek(0);
                animPointEnMoins.play();

                allParcellesImg[index].setAttribute("data-visible", "false");
            }

        }, 2000);

    }, respawnTime);

}


// Boutout reset
resetBtn.addEventListener("click", () => {

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
})


// Bouton play
playBtn.addEventListener("click", () => {

    if (isPlaying) {
        return;
    } else {
        isPlaying = true;
        randomApparition();
    }
})
