const questions = [
    {
        fr: "Quelle est la vitesse maximale sur autoroute par temps sec?",
        en: "What is the maximum speed on the motorway in dry conditions?",
        options: ["90 km/h", "110 km/h", "120 km/h", "130 km/h"],
        answer: 3
    }
];

let currentQuestion = 0;
let language = 'fr';

const questionContainer = document.getElementById('question-container');
const optionsContainer = document.getElementById('options-container');
const progressTracker = document.getElementById('progress-tracker');
const languageToggle = document.getElementById('language-toggle');

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
        alert('Correct!');
    } else {
        alert('Wrong answer!');
    }
    currentQuestion = (currentQuestion + 1) % questions.length;
    showQuestion();
}

languageToggle.addEventListener('click', () => {
    language = language === 'fr' ? 'en' : 'fr';
    showQuestion();
});

document.getElementById('next-question').addEventListener('click', showQuestion);

showQuestion();
