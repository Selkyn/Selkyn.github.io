let malus = 0;
let randomWord = []; //mot aleatoire
let letterRandomWord = document.getElementsByClassName("letter-random-word");
//  const letters = document.getElementsByClassName("letters");
const statutFault = document.getElementById("statut-fault");
const emptyLetter = document.getElementById("section-empty-letter");
let containerLetter = document.getElementById("container-letter");
const draw = document.getElementById("draw");
let containerRandomLetter = document.getElementById("container-random-letter");
const restart = document.getElementById("restart");
let imagePendu = document.getElementById("div-img");
let letter = "";
let winArray = [];
let gaugWin = 0;
let gauglose = 0;
const winScore = document.getElementById("win-score");
const loseScore = document.getElementById("lose-score");
let gameOver = false


//fonction qui genere mes cases lettres avec une lettre unique
function generateLetter() {
    for (i = 0; i < 26; i++) {
        const letters = document.createElement("button");
        letters.classList = "letters";
        const letter = String.fromCharCode(97 + i);
        letters.innerText = letter;
        containerLetter.appendChild(letters);
        letters.addEventListener('click', function () {
            if (!gameOver) {
                let correctLetter = false;
                for (let y = 0; y < randomWord.length; y++) {
                    if (randomWord[y] === letter) {
                        // console.log(randomWord[y]=== letter)
                        winArray.push(randomWord[y]);
                        // console.log(winArray)
                        letterRandomWord[y].innerText = randomWord[y];
                        letters.style.visibility = "hidden";
                        correctLetter = true;
                        if (winArray.length === letterRandomWord.length) {
                            containerLetter.style.display = "none";
                            statutFault.innerText = "Bravo !!!"
                            restart.style.display = "block"
                            gaugWin++;
                            winScore.innerText = gaugWin;
                            console.log(gaugWin);
                            gameOver = true;
                        }
                    }
                }
                if (correctLetter === false) {
                    letters.style.visibility = "hidden";
                    malus++;
                    if (malus < 9) {

                        statutFault.innerText = "Il te reste " + (9 - malus) + " essai(s)";
                    } else if (malus === 9) {
                        containerLetter.style.display = "none"
                        restart.style.display = "block"
                        const stringRandomWord = randomWord.join("");
                        statutFault.innerText = "Pendu !!! Le mot était : " + stringRandomWord +"."
                        gauglose++;
                        loseScore.innerText = gauglose;
                        gameOver = true;
                    }
                    imagePendu.style.backgroundImage = `url(images/pendu_${malus}.jpg`;

                }
            }
        })
    }
}


//function pour mettre un mot aleatoire dans mon tableau randomWord
function randomWordFunction() {
    randomWord.forEach((element) => {
        const letterRandomWord = document.createElement("div");
        letterRandomWord.classList = "letter-random-word";
        letterRandomWord.innerText = "_";
        containerRandomLetter.appendChild(letterRandomWord);
    })
}


const replaceSpecialChar = (string) => {
    return string
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/œ/g, "oe")
        .replace(/Œ/g, "Oe")
        .replace(/æ/g, "ae")
        .replace(/Æ/g, "AE")
        .replace(/[^a-zA-Z]/g, "")
        .split('');
}

//fonction pour avoir un mot aléatoire :
async function getRandomWord() { // Async pour faire une fonction asynchrone, ça permet de réaliser des Promesses.

    let word = [];
    try { // try => Essaye, si une erreur est detecté alors on passe dans le catch
        const response = await fetch('https://trouve-mot.fr/api/random'); // Promesse pour récuperer l'ensemble des informations de l'URL.

        if (!response.ok) {
            throw new Error(`Erreur HTTP! Statut : ${response.status}`); // Si une erreur est detecté, on utilise throw pour l envoyer dans le catch.
        }

        const data = await response.json(); // Promesse pour récuperer les données dans la réponse des informations récupérées de l'URL.

        const element = data.shift(); // shift() permet d extraire le premier element d'un tableau. Attention l element extrait retire totalement l element du tableau ciblé.
        word = replaceSpecialChar(element.name); // Expression régulire dans le replace afin de remplacer les caractere speciaux d'une String.

    } catch (error) { // catch => erreur "attrapé", on gere l erreur ici.
        console.error('Erreur lors de la récupération des données:', error);
    } finally { // finally, qu'il y ai une erreur ou pas, on passe toujours dans le finally à la fin de l execution de la fonction.
        return word; // Si le try fonction, alors word aura la valeur de ce qui a été récuperé dans la Promesse, autrement, si un erreur est detecté, alors word sera un tableau vide.
    }
}

(async () => { // Pour appeler un fonction qui a un attribut async et qui renvoie une promesse (async function getRandomWord), on doit se trouver dans un contexte async autrement, la valeur ne sera jamais lu.
    randomWord = await getRandomWord();
    generateLetter();
    randomWordFunction();
    // console.log(randomWord);
})();


//fonction pour restart le jeu
async function restartGame() {
    containerLetter.style.display = "flex";
    restart.style.display = "none";
    gameOver = false;
    statutFault.innerText = "Il te reste 9 essais";
    imagePendu.style.backgroundImage = "url(images/pendu_0.jpg"
    malus = 0;
    containerLetter.innerHTML = "";
    containerRandomLetter.innerHTML = "";
    winArray = [];
    word = [];
    randomWord = await getRandomWord();
    generateLetter();
    randomWordFunction();

}
restart.addEventListener("click", restartGame)
