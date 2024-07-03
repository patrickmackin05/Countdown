const consonants = "BCDFGHJKLMNPQRSTVWXYZ";
const vowels = "AEIOU";
const maxLetters = 9;
let lettersChosen = 0;
let lettersArray = [];

const consonantBtn = document.getElementById('consonantBtn');
const vowelBtn = document.getElementById('vowelBtn');
const lettersDiv = document.getElementById('letters');
const answerInput = document.getElementById('answer');
const submitBtn = document.getElementById('submit');
const timerDiv = document.getElementById('timer');
const playAgainBtn = document.getElementById('playAgain');

function addLetter(letter) {
    if (lettersChosen < maxLetters) {
        lettersArray.push(letter);
        const letterElement = document.createElement('span');
        letterElement.classList.add('letter', 'letter-animate');
        letterElement.style.animationDelay = `${lettersChosen * 0.2}s`; // Adjust delay based on order
        letterElement.textContent = letter;
        lettersDiv.appendChild(letterElement);
        lettersChosen++;
        if (lettersChosen === maxLetters) {
            showCountdown(); // Show the countdown before starting the game
        }
    }
}


consonantBtn.addEventListener('click', () => {
    const randomConsonant = consonants[Math.floor(Math.random() * consonants.length)];
    addLetter(randomConsonant);
});

vowelBtn.addEventListener('click', () => {
    const randomVowel = vowels[Math.floor(Math.random() * vowels.length)];
    addLetter(randomVowel);
});

let timeLeft = 30; // 30 seconds for the countdown
let wordsSubmitted = [];

function startTimer() {
    const timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            timerDiv.textContent = `Time left: ${timeLeft}s`;
        } else {
            clearInterval(timerInterval);
            answerInput.disabled = true;
            submitBtn.disabled = true;
            calculateScore();
            // Show play again button after 5 seconds
            setTimeout(() => {
                playAgainBtn.style.display = 'block';
                playAgainBtn.classList.add('fade-in');
            }, 5000);
        }
    }, 1000);
}

submitBtn.addEventListener('click', async () => {
    const word = answerInput.value.toUpperCase();
    if (word) {
        if (wordsSubmitted.includes(word)) {
            alert('This word has already been submitted.');
            answerInput.value = ''; // Clear input
            return; // Exit the function to prevent re-submission
        }
        const isValid = await isValidWord(word);
        if (isValid) {
            wordsSubmitted.push(word);
            answerInput.value = ''; // Clear input after submission

            // Update the score and display the words with their scores
            calculateScore();
        } else {
            alert('Invalid word or word cannot be formed from the given letters, or it does not exist in the dictionary.');
        }
    }
});


answerInput.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent the default action to avoid form submission if applicable
        submitBtn.click(); // Trigger the click event on the submit button
    }
});


async function isValidWord(word) {
    let tempLetters = lettersArray.slice(); // Copy of lettersArray
    for (let letter of word) {
        const index = tempLetters.indexOf(letter);
        if (index === -1) {
            return false; // Letter not found or already used
        }
        tempLetters.splice(index, 1); // Remove used letter
    }

    // Check with dictionary API
    const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Word not found');
        }
        // If the word exists, the API will return details about it
        return true;
    } catch (error) {
        console.error('Error checking word:', error);
        return false;
    }
}

function calculateScore() {
    let score = 0;
    let wordListDiv = document.getElementById('wordList');
    wordListDiv.innerHTML = ''; // Clear the word list before adding updated entries
    wordsSubmitted.forEach(word => {
        score += word.length; // Simple scoring: word length
        let wordElement = document.createElement('div');
        wordElement.textContent = `${word} (${word.length} points)`; // Display word with its score
        wordListDiv.appendChild(wordElement);
    });
    let scoreDiv = document.getElementById('score');
    scoreDiv.textContent = `Score: ${score}`;
}


playAgainBtn.addEventListener('click', () => {
    // Reset game state
    lettersChosen = 0;
    lettersArray = [];
    wordsSubmitted = [];
    timeLeft = 30; // Reset the timer
    timerDiv.textContent = ''; // Clear the timer display
    timerDiv.style.display = 'none'; // Hide timer display
    lettersDiv.innerHTML = ''; // Clear the letters
    wordListDiv.innerHTML = ''; // Clear the word list
    scoreDiv.textContent = ''; // Clear the score
    answerInput.disabled = true; // Disable input until letters are chosen
    submitBtn.disabled = true; // Disable submit button until game starts
    playAgainBtn.style.display = 'none'; // Hide the play again button
    playAgainBtn.classList.remove('fade-in');
});

function showCountdown() {
    let countdownValue = 3;
    const countdownElement = document.getElementById('countdownNumber');
    const countdownContainer = document.getElementById('countdown');
    countdownContainer.style.display = 'flex'; // Show the countdown

    const countdownInterval = setInterval(() => {
        countdownElement.textContent = countdownValue;
        countdownValue--;

        if (countdownValue < 0) {
            clearInterval(countdownInterval);
            countdownContainer.style.display = 'none'; // Hide the countdown
            startGame(); // Start the game
        }
    }, 1000);
}

function startGame() {
    // Your logic to start the game, e.g., enable inputs, start timer, etc.
    answerInput.disabled = false;
    submitBtn.disabled = false;
    timerDiv.style.display = 'block';
    startTimer();
}

document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
        const sound = document.getElementById('buttonSound');
        sound.currentTime = 0; // Rewind to the start
        sound.play();
    });
});