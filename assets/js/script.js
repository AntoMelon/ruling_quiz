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

function insertCardNamesLinks(string,names,links) {
    let size = names.length;
    let res = string;

    for (let i = 0; i < size; ++i) {
        const replaceNow = "${" + i + "}";
        console.log(replaceNow);

        res = res.replaceAll(replaceNow,"<a href=\"" + links[i] + "\" target=\"_blank\">" + names[i] + "</a>");
    }

    return res
}

document.addEventListener("DOMContentLoaded",function(e) {

});