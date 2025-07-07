let questions = [];
let currentQuestion = 0;
let language = 'fr';
let score = 0;
let timer;

const questionContainer = document.getElementById('question-container');
const optionsContainer = document.getElementById('options-container');
const answerContainer = document.getElementById('answer-container');
const progressTracker = document.getElementById('progress-tracker');
const languageToggle = document.getElementById('language-toggle');
const timerDisplay = document.getElementById('timer');
const nextButton = document.getElementById('next-question');
const showAnswerButton = document.getElementById('show-answer');

async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        questions = await response.json();

        // Shuffle the questions randomly
        questions.sort(() => Math.random() - 0.5);

        // Start timer (40 minutes)
        startTimer(40 * 60);

        showQuestion();
    } catch (error) {
        alert("Error loading questions: " + error.message);
    }
}

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
        questionContainer.innerText = 'No more questions.';
        answerContainer.innerText = '';
        progressTracker.innerText = `Questions: ${questions.length}`;
        nextButton.disabled = true;
        showAnswerButton.disabled = true;
        return;
    }

    const q = questions[currentQuestion];

    // Clear previous question and display image
    questionContainer.innerHTML = '';
    const img = document.createElement('img');
    img.src = q.image || 'images/placeholder.png';
    img.alt = language === 'fr' ? q.fr : q.en;
    img.className = 'question-image';
    questionContainer.appendChild(img);

    // Display question text
    const p = document.createElement('p');
    p.innerText = language === 'fr' ? q.fr : q.en;
    questionContainer.appendChild(p);

    // Display options
    optionsContainer.innerHTML = '';
    const opts = language === 'fr' ? q.options : q.options_en;
    opts.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = option;
        button.onclick = () => checkAnswer(index);
        optionsContainer.appendChild(button);
    });

    answerContainer.innerText = '';
    progressTracker.innerText = `Question ${currentQuestion + 1} of ${questions.length}`;
}

function checkAnswer(selected) {
    const q = questions[currentQuestion];
    const correct = q.answer;
    const opts = language === 'fr' ? q.options : q.options_en;
    if (selected === correct) {
        score++;
        alert('Correct!');
    } else {
        alert(`Wrong! The correct answer was: ${opts[correct]}`);
    }

}

function showResults() {
    alert(`You scored ${score} out of ${questions.length}`);
    progressTracker.innerText = `Final Score: ${score}/${questions.length}`;
}


showAnswerButton.addEventListener('click', () => {
    if (currentQuestion < questions.length) {
        const q = questions[currentQuestion];
        answerContainer.innerText = language === 'fr' ? q.answer_fr : q.answer_en;
    }
});

nextButton.addEventListener('click', () => {
    currentQuestion++;
    if (currentQuestion >= questions.length) {
        showResults();
    } else {
        showQuestion();
    }
});

languageToggle.addEventListener('click', () => {
    language = language === 'fr' ? 'en' : 'fr';
    showQuestion();
});

loadQuestions();
