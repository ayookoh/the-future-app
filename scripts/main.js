let questions = [];
let currentQuestion = 0;
let language = 'fr';
let score = 0;
let timer;

const questionContainer = document.getElementById('question-container');
const optionsContainer = document.getElementById('options-container');
const progressTracker = document.getElementById('progress-tracker');
const languageToggle = document.getElementById('language-toggle');
const timerDisplay = document.getElementById('timer');

// Mock question data for testing
const mockQuestions = [
    {
        fr: "Quelle est la vitesse maximale sur autoroute par temps sec?",
        en: "What is the maximum speed on the motorway in dry conditions?",
        options: ["90 km/h", "110 km/h", "120 km/h", "130 km/h"],
        answer: 3
    },
    {
        fr: "À quelle distance doit-on placer le triangle de signalisation?",
        en: "At what distance should the warning triangle be placed?",
        options: ["30 m", "50 m", "100 m", "150 m"],
        answer: 1
    }
];

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
    if (currentQuestion >= questions.length) {
        clearInterval(timer);
        showResults();
        return;
    }

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
        alert(`Wrong! The correct answer was: ${questions[currentQuestion].options[correct]}`);
    }
    currentQuestion++;
    showQuestion();
}

function showResults() {
    alert(`You scored ${score} out of ${questions.length}`);
    progressTracker.innerText = `Final Score: ${score}/${questions.length}`;
}

languageToggle.addEventListener('click', () => {
    language = language === 'fr' ? 'en' : 'fr';
    showQuestion();
});

document.getElementById('next-question').addEventListener('click', () => {
    questions = mockQuestions;
    startTimer(40 * 60);
    showQuestion();
});

showQuestion();
