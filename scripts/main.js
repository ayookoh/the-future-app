@@ -72,43 +72,48 @@ function showQuestion() {
    questionContainer.appendChild(p);

    // Display options
    optionsContainer.innerHTML = '';
    q.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.innerText = option;
        button.onclick = () => checkAnswer(index);
        optionsContainer.appendChild(button);
    });

    answerContainer.innerText = '';
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
    showQuestion();
});

languageToggle.addEventListener('click', () => {
    language = language === 'fr' ? 'en' : 'fr';
    showQuestion();
});

loadQuestions();
