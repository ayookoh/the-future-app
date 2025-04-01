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
const mediaContainer = document.getElementById('media-container');
const explanationContainer = document.getElementById('explanation-container');

// Firebase Configuration (Replace with your actual Supabase details)
const supabaseUrl = "https://your-supabase-project-url.supabase.co";
const supabaseKey = "your-supabase-public-anon-key";

async function loadQuestions() {
    try {
        const response = await fetch(`${supabaseUrl}/rest/v1/questions`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
            }
        });
        questions = await response.json();
        questions.sort(() => Math.random() - 0.5); // Shuffle questions
        startTimer(40 * 60); // 40 minutes
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
    mediaContainer.innerHTML = '';
    explanationContainer.innerHTML = '';

    // Display media if available
    if (question.media_url) {
        if (question.media_type === 'image') {
            const img = document.createElement('img');
            img.src = question.media_url;
            img.alt = "Question Visual";
            img.width = 300;
            mediaContainer.appendChild(img);
        } else if (question.media_type === 'video') {
            const video = document.createElement('video');
            video.src = question.media_url;
            video.controls = true;
            video.width = 300;
            mediaContainer.appendChild(video);
        }
    }

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
        const explanation = language === 'fr' ? questions[currentQuestion].explanation_fr : questions[currentQuestion].explanation_en;
        alert(`Wrong! The correct answer was: ${questions[currentQuestion].options[correct]}`);
        explanationContainer.innerText = `Explanation: ${explanation}`;
    }
    currentQuestion++;
    showQuestion();
}

function showResults() {
    alert(`You scored ${score} out of ${questions.length}`);
}

languageToggle.addEventListener('click', () => {
    language = language === 'fr' ? 'en' : 'fr';
    showQuestion();
});

document.getElementById('next-question').addEventListener('click', showQuestion);

loadQuestions();