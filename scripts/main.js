let questions = [];
let currentQuestion = 0;
let language = 'fr';

const questionContainer = document.getElementById('question-container');
const answerContainer = document.getElementById('answer-container');
const progressTracker = document.getElementById('progress-tracker');
const languageToggle = document.getElementById('language-toggle');
const nextButton = document.getElementById('next-question');
const showAnswerButton = document.getElementById('show-answer');

async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        questions = await response.json();
        showQuestion();
    } catch (err) {
        alert('Error loading questions: ' + err.message);
    }
}

function showQuestion() {
    if (currentQuestion >= questions.length) {
        questionContainer.innerText = 'No more questions.';
        answerContainer.innerText = '';
        progressTracker.innerText = `Questions: ${questions.length}`;
        nextButton.disabled = true;
        showAnswerButton.disabled = true;
        return;
    }
    const q = questions[currentQuestion];
    questionContainer.innerText = language === 'fr' ? q.fr : q.en;
    answerContainer.innerText = '';
    progressTracker.innerText = `Question ${currentQuestion + 1} of ${questions.length}`;
}

showAnswerButton.addEventListener('click', () => {
    if (currentQuestion < questions.length) {
        const q = questions[currentQuestion];
        answerContainer.innerText = language === 'fr' ? q.answer_fr : q.answer_en;
    }
});

nextButton.addEventListener('click', () => {
    currentQuestion++;
    showQuestion();
});

languageToggle.addEventListener('click', () => {
    language = language === 'fr' ? 'en' : 'fr';
    showQuestion();
});

loadQuestions();
