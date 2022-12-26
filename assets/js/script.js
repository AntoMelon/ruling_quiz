"use strict;"

var ruling_questions = null;
var currentQuiz;
var currentQuestion = 0;
var score = 0;

const SIZE = 20;

fetch('./assets/json/questions/ruling_questions.json').then(response => response.json()).then(function (data) {
    ruling_questions = data;
})

function areQuestionsLoaded() {
    return ruling_questions !== null;
}


//Durstenfeld shuffle
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function getRadioValue(radioName) {
    var radios = document.getElementsByName(radioName);

    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {
            return radios[i].value;
        }
    }

    return null;
}

function generateQuizOfSize(questions,size) {
    shuffleArray(questions);
    return questions.slice(0,size);
}

function insertCardNamesLinks(string,names,links) {
    let size = names.length;
    let res = string;

    for (let i = 0; i < size; ++i) {
        const replaceNow = "${" + i + "}";

        res = res.replaceAll(replaceNow,"<a href=\"" + links[i] + "\" target=\"_blank\">" + names[i] + "</a>");
    }

    return res
}

function generateQuestionText(questionObj) {
    res = "";

    res += "<p>" + insertCardNamesLinks(questionObj.question,questionObj.cards,questionObj.links) + "</p>";

    res += "<ul>";

    for (let i = 0; i < questionObj.propositions.length; ++i) {
        res += "<li><label>";
        res += "<input type=\"radio\" name=\"question\" value=\"" + i +"\">"
        let prop = questionObj.propositions[i];
        res += insertCardNamesLinks(prop,questionObj.cards,questionObj.links);
        res += "</label></li>";
    }

    res += "</ul>";

    res += "<div class=\"centerText\"><button id=\"btnCheckAnswer\">Check answer</button></div>";

    return res;
}

function generateExplanationText(questionObj, correctness) {
    res = "";

    res += "<p>You are <i class=\"boldUnderline\">" + (correctness ? "" : "IN") + "CORRECT</i>." + (correctness ? "" : (" The correct answer was: <i class=\"boldUnderline\">" + insertCardNamesLinks(questionObj.propositions[questionObj.correct],questionObj.cards,questionObj.links) + "</i>")) + "</p>";

    res += insertCardNamesLinks(questionObj.explanation,questionObj.cards,questionObj.links);

    if (questionObj.sources.length > 0) {
        res += "<p>Sources:</p><ul>";

        for (let iSource = 0; iSource < questionObj.sources.length; ++iSource) {
            res += "<li>● <a href=\"" + questionObj.sources_links[iSource] + "\" target=\"_blank\">" + questionObj.sources[iSource] + "</a></li>"
        }

        res += "</ul>";
    }

    res += "<div class=\"centerText\"><button id=\"btnNextQuestion\">Next question</button></div>"

    return res;
}

function displayResults() {
    let divQuestion = document.getElementById("question");

    text = "";
    text += "<div class=\"centerText\"><p><i class=\"boldUnderline\">Your results:</i></p>"
    text += "<p>You answered " + score + " questions correctly out of " + ruling_questions.length + " questions. (" + (score/ruling_questions.length)*100 + "%)" + "</p>";
    text += "</div>";

    text += "<p>I hope this quiz helped you better understand some rulings!</p>";

    divQuestion.innerHTML = text;
}

function askQuestion() {
    text = "<p><i class=\"boldUnderline\">Question " + currentQuestion + "/" + currentQuiz.length + " </i></p>";

    text += generateQuestionText(currentQuiz[currentQuestion]);

    let divQuestion = document.getElementById("question");
    divQuestion.innerHTML = text;
        
    let btnCheckAnswer = document.getElementById("btnCheckAnswer");
    btnCheckAnswer.addEventListener("click", function (e) {
        let value = getRadioValue("question");
        if (value === null) return;

        let correctness = value == currentQuiz[currentQuestion].correct;
        if (correctness) ++score;

        divQuestion.innerHTML += generateExplanationText(currentQuiz[currentQuestion],correctness);

        let btnNextQuestion = document.getElementById("btnNextQuestion");
        btnNextQuestion.addEventListener("click", function (e) {
            ++currentQuestion;

            if (currentQuestion == currentQuiz.length) {
                displayResults();
                return;
            }

            askQuestion();
        });
    });
}

document.addEventListener("DOMContentLoaded",function(e) {

    let btnGenerateQuiz = document.getElementById("btnGenerateQuiz")

    btnGenerateQuiz.innerHTML = "Generate " + SIZE + " questions quiz";

    btnGenerateQuiz.addEventListener("click", function(e) {
        if (!areQuestionsLoaded()) {
            alert("Questions could not be loaded.");
            return;
        }
        currentQuiz = generateQuizOfSize(ruling_questions,SIZE);
        currentQuestion = 0;
        
        askQuestion();
    });
});