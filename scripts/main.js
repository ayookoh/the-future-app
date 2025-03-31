const questions = [
    // Speed Limits
    { fr: "Quelle est la vitesse maximale sur autoroute par temps sec?", en: "What is the maximum speed on the motorway in dry conditions?", options: ["90 km/h", "110 km/h", "120 km/h", "130 km/h"], answer: 3 },
    { fr: "Quelle est la vitesse maximale en agglomération?", en: "What is the maximum speed in urban areas?", options: ["30 km/h", "50 km/h", "70 km/h", "90 km/h"], answer: 1 },

    // Alcohol Limits
    { fr: "Quel est le taux d'alcoolémie maximal autorisé pour un conducteur novice?", en: "What is the maximum blood alcohol level for a novice driver?", options: ["0.2 g/L", "0.5 g/L", "0.8 g/L", "1.0 g/L"], answer: 0 },
    { fr: "Quel est le taux d'alcoolémie maximal pour un conducteur expérimenté?", en: "What is the maximum blood alcohol level for an experienced driver?", options: ["0.2 g/L", "0.5 g/L", "0.8 g/L", "1.0 g/L"], answer: 1 },

    // Priority Rules
    { fr: "A un carrefour sans signalisation, qui a la priorité?", en: "At an intersection without signage, who has the priority?", options: ["Celui venant de gauche", "Celui venant de droite", "Le plus rapide", "Le plus lent"], answer: 1 },
    { fr: "Qui a la priorité sur un rond-point?", en: "Who has priority in a roundabout?", options: ["Les véhicules entrant", "Les véhicules circulant dans le rond-point", "Les piétons", "Les cyclistes"], answer: 1 },

    // Road Signs
    { fr: "Que signifie un panneau triangulaire à bord rouge?", en: "What does a triangular sign with a red border mean?", options: ["Interdiction", "Danger", "Obligation", "Information"], answer: 1 },
    { fr: "Que signifie un panneau bleu rond avec une flèche?", en: "What does a blue round sign with an arrow mean?", options: ["Obligation", "Interdiction", "Danger", "Information"], answer: 0 },

    // Emergency Procedures
    { fr: "Que faire en cas de panne sur autoroute?", en: "What to do in case of a breakdown on the motorway?", options: ["Appeler les secours", "Rester dans le véhicule", "Traverser la voie", "Pousser le véhicule"], answer: 0 },
    { fr: "Que faire en cas d'accident avec blessé?", en: "What to do in case of an accident with injury?", options: ["Fuir", "Porter secours", "Ignorer", "Filmer"], answer: 1 },

    // Eco-Driving
    { fr: "Comment réduire la consommation de carburant?", en: "How to reduce fuel consumption?", options: ["Accélérer fortement", "Maintenir une vitesse constante", "Rouler en surrégime", "Freiner brusquement"], answer: 1 },
    { fr: "Quelle est la meilleure pratique pour économiser le carburant?", en: "What is the best practice to save fuel?", options: ["Gonfler les pneus correctement", "Utiliser des pneus sous-gonflés", "Laisser tourner le moteur à l'arrêt", "Charger le véhicule au maximum"], answer: 0 }
];

// Shuffle Questions for Mock Exam
questions.sort(() => Math.random() - 0.5);

let currentQuestion = 0;
let language = 'fr';
let score = 0;
let timer;

const questionContainer = document.getElementById('question-container');
const optionsContainer = document.getElementById('options-container');
const progressTracker = document.getElementById('progress-tracker');
const languageToggle = document.getElementById('language-toggle');
const timerDisplay = document.getElementById('timer');

function startTimer(duration) {
    let time = duration;
    timer = setInterval(() => {
        let minutes = Math.floor(time / 60);
        let seconds = time % 60;
        timerDisplay.textContent = `Time Left: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        if (--time < 0) {
            clearInterval(timer);
            alert('Time is up!');
            showResults();
        }
    }, 1000);
}

function showQuestion() {
    const question = questions[currentQuestion];
    questionContainer.innerText = language === 'fr' ? question.fr : question.en;
    optionsContainer.innerHTML = '';

    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = option;
        button.onclick = () => checkAnswer(index);
        optionsContainer.appendChild(button);
    });

    progressTracker.innerText = `Question ${currentQuestion + 1} of ${questions.length}`;
}

function checkAnswer(selected) {
    const correct = questions[currentQuestion].answer;
    if (selected === correct) {
        score++;
        alert('Correct!');
    } else {
        alert('Wrong answer!');
    }
    currentQuestion++;
    if (currentQuestion >= questions.length) {
        clearInterval(timer);
        showResults();
    } else {
        showQuestion();
    }
}

function showResults() {
    alert(`You scored ${score} out of ${questions.length}`);
}

languageToggle.addEventListener('click', () => {
    language = language === 'fr' ? 'en' : 'fr';
    showQuestion();
});

document.getElementById('next-question').addEventListener('click', showQuestion);

startTimer(40 * 60);
showQuestion();
