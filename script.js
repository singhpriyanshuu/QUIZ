// Variables jo data store karenge
var quizData = [];
var currentIndex = 0;
var score = 0;
var timerValue = 15;
var timerId;

// 1. Quiz start karne ka function
function startQuiz() {
    document.getElementById("start-screen").classList.add("hidden");
    document.getElementById("quiz-screen").classList.remove("hidden");

    // Fetch API: Internet se questions lana
    fetch("https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple")
        .then(function(res) { return res.json(); })
        .then(function(data) {
            quizData = data.results;
            showQuestion();
        });
}

// 2. Question display karne ka function
function showQuestion() {
    if (currentIndex >= 10) {
        showResult();
        return;
    }

    // Har sawal par timer 15 se shuru hoga
    resetTimer();

    var currentQ = quizData[currentIndex];
    document.getElementById("question-text").innerHTML = currentQ.question;

    // Options ko ek array mein daal kar shuffle (mix) karna
    var options = [...currentQ.incorrect_answers, currentQ.correct_answer];
    options.sort(function() { return Math.random() - 0.5; });

    var container = document.getElementById("options-container");
    container.innerHTML = ""; // Purane buttons saaf karna

    // Naye buttons banana
    options.forEach(function(opt) {
        var btn = document.createElement("button");
        btn.innerHTML = opt;
        btn.className = "option-btn";
        btn.onclick = function() { checkAnswer(btn, opt); };
        container.appendChild(btn);
    });
}

// 3. Answer check karne ka function
function checkAnswer(clickedBtn, selectedOpt) {
    clearInterval(timerId); // Timer rokna
    var correct = quizData[currentIndex].correct_answer;

    if (selectedOpt === correct) {
        score = score + 1;
        clickedBtn.classList.add("correct");
    } else {
        clickedBtn.classList.add("wrong");
    }

    document.getElementById("score-label").innerText = "Score: " + score;

    // 1 second ka gap taaki user result dekh sake
    setTimeout(function() {
        currentIndex++;
        showQuestion();
    }, 1000);
}

// 4. Timer function
function resetTimer() {
    clearInterval(timerId);
    timerValue = 15;
    document.getElementById("timer").innerText = "Time: " + timerValue + "s";

    timerId = setInterval(function() {
        timerValue--;
        document.getElementById("timer").innerText = "Time: " + timerValue + "s";

        if (timerValue <= 0) {
            clearInterval(timerId);
            currentIndex++;
            showQuestion();
        }
    }, 1000);
}

// 5. Result screen dikhana
function showResult() {
    document.getElementById("quiz-screen").classList.add("hidden");
    document.getElementById("result-screen").classList.remove("hidden");
    document.getElementById("final-score").innerText = score;
}