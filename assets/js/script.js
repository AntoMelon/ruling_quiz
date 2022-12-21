"use strict;"

var questions = [];

console.log("test");
console.log(fetch('./assets/json/questions/questions.json').then(response => response.json()));

fetch('./assets/json/questions/questions.json').then(response => response.json()).then(function (data) {
    console.log(data);
})