"use strict;"

var ruling_questions = null;

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

function generateQuizOfSize(questions,size) {
    shuffleArray(questions);
    return questions.slice(0,size);
}

document.addEventListener("DOMContentLoaded",function(e) {

});