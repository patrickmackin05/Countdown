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
        letterElement.classList.add('letter'); // This class now includes the lottery effect
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
            calculateScore(); // Calculate final score and update word list
            // Show the game end pop-up here, when the game actually ends
            document.getElementById('gameEndPopup').style.display = 'block';
            playAgainBtn.style.display = 'block';
        }
    }, 1000);
}

submitBtn.addEventListener('click', async () => {
    const word = answerInput.value.toUpperCase();
    if (word) {
        submitBtn.disabled = true; // Disable the submit button immediately to prevent multiple submissions
        if (wordsSubmitted.includes(word)) {
            showNotification('This word has already been submitted.');
            answerInput.value = ''; // Clear input
            submitBtn.disabled = false; // Re-enable the submit button
            return; // Exit the function to prevent re-submission
        }
        const isValid = await isValidWord(word);
        if (isValid) {
            wordsSubmitted.push(word);
            answerInput.value = ''; // Clear input after submission

            // Update the score and display the words with their scores
            calculateScore();
            showNotification('Word submitted successfully!', true); // Show success notification
        } else {
            showNotification('Invalid word or word cannot be formed from the given letters, or it does not exist in the dictionary.');
        }
        submitBtn.disabled = false; // Re-enable the submit button after validation
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
    const finalWordsList = document.getElementById('finalWordsList');
    finalWordsList.innerHTML = ''; // Clear the word list

    wordsSubmitted.forEach(word => {
        let wordScore = 0;
        let baseScorePerLetter = 1; // Base score for each letter
        let lengthMultiplier = 1; // Default multiplier

        if (word.length > 3) {
            // Increase the multiplier for longer words
            // For example, words longer than 3 letters get an additional 0.5 multiplier for each letter above 4
            lengthMultiplier += (word.length - 4) * 0.5;
        }

        wordScore = word.length * baseScorePerLetter * lengthMultiplier;
        score += wordScore;

        // Update the display for each word with its score
        let wordElement = document.createElement('div');
        wordElement.textContent = `${word} (${wordScore} points)`;
        finalWordsList.appendChild(wordElement);
    });

    // Update the total score display
    document.getElementById('finalScore').textContent = `Final Score: ${score}`;
}





playAgainBtn.addEventListener('click', () => {
    document.getElementById('gameEndPopup').style.display = 'none';
    lettersChosen = 0;
    lettersArray = [];
    wordsSubmitted = [];
    timeLeft = 30;
    timerDiv.textContent = '';
    timerDiv.style.display = 'none';
    lettersDiv.innerHTML = '';
    document.getElementById('wordList').innerHTML = '';
    document.getElementById('finalWordsList').innerHTML = '';
    document.getElementById('score').textContent = '';
    document.getElementById('finalScore').textContent = '';
    answerInput.disabled = true;
    submitBtn.disabled = true;
    consonantBtn.disabled = false;
    vowelBtn.disabled = false;
});



// Close the pop-up when the user clicks on <span> (x)
document.querySelector('.close').addEventListener('click', () => {
    document.getElementById('gameEndPopup').style.display = 'none';
    window.location.href = 'index.html';
});


function showCountdown() {
    let countdownValue = 3;
    const countdownElement = document.getElementById('countdownNumber');
    const countdownContainer = document.getElementById('countdown');
    countdownContainer.style.display = 'flex'; // Show the countdown
    countdownElement.textContent = countdownValue; // Reset the countdown display to 3

    const countdownInterval = setInterval(() => {
        countdownValue--;
        if (countdownValue >= 0) {
            countdownElement.textContent = countdownValue;
        } else {
            clearInterval(countdownInterval);
            countdownContainer.style.display = 'none'; // Hide the countdown
            startGame(); // Start the game
        }
    }, 1000);
}

function startGame() {
    answerInput.disabled = false;
    submitBtn.disabled = false;
    timerDiv.style.display = 'block';
    consonantBtn.disabled = true;
    vowelBtn.disabled = true;
    startTimer();
}

document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', () => {
        const sound = document.getElementById('buttonSound');
        sound.currentTime = 0; // Rewind to the start
        sound.play();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('fade-in');
});

document.querySelectorAll('.back-button').forEach(button => {
    button.addEventListener('click', function (e) {
        e.preventDefault();
        const target = this.getAttribute('href');
        document.body.classList.add('fade-out');
        setTimeout(() => {
            window.location.href = target;
        }, 500);
    });
});

function showNotification(message, isSuccess = false) {
    const notification = isSuccess ? document.getElementById('successNotification') : document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    if (isSuccess) {
        const successSound = document.getElementById('successSound');
        successSound.currentTime = 0; // Rewind to the start
        successSound.play();
    }
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

async function saveScore(name, score) {
    const leaderboardUrl = '/save-score';
    try {
        const response = await fetch(leaderboardUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, score })
        });

        if (!response.ok) {
            throw new Error('Failed to save score');
        }

        showNotification('Score saved successfully!', true); // Show success notification

        // Hide the name input field and save score button
        document.getElementById('playerName').style.display = 'none';
        document.getElementById('saveScore').style.display = 'none';
    } catch (error) {
        console.error('Error saving score:', error);
        showNotification('Score Not Submitted');
    }
}

document.getElementById('saveScore').addEventListener('click', () => {
    const playerName = document.getElementById('playerName').value.trim();
    const finalScore = parseInt(document.getElementById('finalScore').textContent.split(': ')[1]);

    if (playerName && !isNaN(finalScore)) {
        saveScore(playerName, finalScore);
    } else {
        showNotification('Please enter a valid name and score.');
    }
});