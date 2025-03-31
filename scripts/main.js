// Firebase Configuration (Replace with your own if needed)
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_APP.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_APP.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

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

async function loadQuestions() {
    try {
        const querySnapshot = await db.collection("questions").get();
        querySnapshot.forEach((doc) => {
            questions.push(doc.data());
        });

        // Shuffle the questions for randomization
        questions.sort(() => Math.random() - 0.5);

        // Start the timer and show the first question
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

document.getElementById('next-question').addEventListener('click', showQuestion);

// Load questions from the database
loadQuestions();
