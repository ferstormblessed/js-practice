
let word;
let wordParts;

const letters = document.querySelectorAll(".scoreboard-letter");
const loadingDiv = document.querySelector(".info-bar");
const ANSWER_LENGTH = 5;
const NUMBER_GUESSES = 6;

let currGuessText = '';
let currentRow = 0;

let gameOver = false;

let isLoading = true;

async function getWord() {
    const promise = await fetch("https://words.dev-apis.com/word-of-the-day?random=1");
    const response = await promise.json();
    word = response.word.toUpperCase();
    wordParts = word.split("");
    console.log(`word: ${word}`);
    setLoading(false);
    isLoading = false;
}

function isLetter(letter) {
  return /^[a-zA-Z]$/.test(letter);
}

function addLetter(letter) {
    if (currGuessText.length < ANSWER_LENGTH) {
        currGuessText += letter;
    } else {
        currGuessText = currGuessText.substring(0, currGuessText.length - 1) + letter;
    }

    letters[ANSWER_LENGTH * currentRow + currGuessText.length - 1].innerHTML = letter;
}

function backspace(){
    currGuessText = currGuessText.substring(0, currGuessText.length - 1);
    letters[ANSWER_LENGTH * currentRow + currGuessText.length].innerHTML = '';
}

async function commit() {
    if (currGuessText.length !== ANSWER_LENGTH){
        return;
    }

    isLoading = true;
    setLoading(isLoading);

    const res = await fetch("https://words.dev-apis.com/validate-word", {
        method: "POST",
        body: JSON.stringify({ word: currGuessText }),
    });
    const { validWord } = await res.json();

    isLoading = false;
    setLoading(isLoading);

    // not valid, mark the word as invalid and return
    if (!validWord) {
        markInvalidWord();
        return;
    }

    const guessParts = currGuessText.split("");
    const map = makeMap(wordParts);
    let allRight = true;

    for (let i = 0; i < ANSWER_LENGTH; i++) {
        if (guessParts[i] === wordParts[i]) {
            letters[currentRow * ANSWER_LENGTH + i].classList.add("correct");
            map[guessParts[i]]--;
        }
    }

    for (let i = 0; i < ANSWER_LENGTH; i++) {
        if (guessParts[i] === wordParts[i]) {
            // do nothing
        } else if (map[guessParts[i]] && map[guessParts[i]] > 0) {
            allRight = false;
            letters[currentRow * ANSWER_LENGTH + i].classList.add("close");
            map[guessParts[i]]--;
        } else {
            allRight = false;
            letters[currentRow * ANSWER_LENGTH + i].classList.add("wrong");
        }
    }

    currentRow++;

    if (currGuessText === word) {
        alert("you win");
        gameOver = true;
        return;
    }

    if (currentRow === NUMBER_GUESSES) {
        alert(`game over, the word was ${word}`);
        gameOver = true;
        return;
    }

    currGuessText = '';
}

function setLoading(loading) {
    loadingDiv.classList.toggle("hidden", !loading);
}

function makeMap(array) {
    const obj = {};
    for (let i = 0; i < array.length; i++) {
        if (obj[array[i]]) {
            obj[array[i]]++;
        } else {
            obj[array[i]] = 1;
        }
    }
    return obj;
}

function markInvalidWord(){
    alert("not a valid word");
}

function init() {
    getWord();

    document.addEventListener("keydown", function(event) {
        if (gameOver || isLoading) {
            return;
        }

        const keyPressed = event.key;

        console.log(keyPressed);
        
        if (keyPressed === "Enter") {
            commit();
        }

        if (keyPressed === "Backspace") {
            backspace();
        }

        if (isLetter(keyPressed)) {
            addLetter(keyPressed.toUpperCase());
        }
    });
}

init();
