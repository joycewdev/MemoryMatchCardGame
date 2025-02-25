/**
 * These are the functions and features of the Memory Match Card Game
 */

// Executes on load
window.addEventListener("load", function (event) {
    let name = document.getElementById("name");
    let age = document.getElementById("age");
    let colour = document.getElementById("colour");
    let inputInfo = document.getElementById("inputInfo");
    let startBtn = document.getElementById("startBtn");

    document.getElementById("startScreen").classList.add("active");

    // Verifies that user input is valid every time input fields are changed
    inputInfo.addEventListener("input", function (event) {
        if (colour.value === "" || name.value === "" || age.value === "" || name.value.length > 12 || String(age.value).includes(".") || age.value < 3 || age.value > 120) {
            startBtn.disabled = true;
            startBtn.textContent = "Missing or Invalid Input";
            startBtn.style.color = "red";
        } else {
            startBtn.disabled = false;
            startBtn.textContent = "Start Game";
            startBtn.style.color = "#087fe7";
        }
    });

    // Gets the colour that the user selected from the dropdown menu when the field is changed
    colour.addEventListener("input", function (event) {
        colour.style.color = colour.value;
    });

    // game function is called to begin the game once start button is clicked
    startBtn.addEventListener("click", function (event) {
        let selectedColour = colour.value;
        let inputtedName = name.value;
        game(inputtedName, selectedColour);
    });
});

/**
 * Starts the game frame and removes the user input screen from view
 * Customizes menu bar with user details
 * @param {string} inputtedName 
 * @param {string} selectedColour 
 */
function game(inputtedName, selectedColour) {
    let matches, moveCount = 0;
    let bestScore = Number.MAX_SAFE_INTEGER;
    let secondCard, card1, card2;
    let disableCards = false;
    let moves = document.getElementById("moves");
    let bestMoves = document.getElementById("bestMoves");
    let helpBtn = document.getElementById("helpBtn");
    let resetBtn = document.getElementById("resetBtn");
    let result = document.getElementById("result");
    let x = document.getElementById("x");
    const cards = document.querySelectorAll('.card');

    document.getElementById("startScreen").classList.remove("active");
    document.getElementById("gameScreen").classList.add("active");
    document.getElementById("menu").style.color = selectedColour;

    bestMoves.textContent = "Best:"
    reset();

    // Help panel is displayed once help button is clicked
    helpBtn.addEventListener("click", function (event) {
        cards.forEach(card => card.style.display = "none");
        result.textContent = "Match all of the cards with their pairs in the least number of moves. If you miss a match, both cards are turned over again. As a bonus activity, try to identify the shapes. Improve your memory and pattern recognition skills!"
        resultContent.style.display = "flex";
    });

    // Help panel is removed once x button is clicked
    x.addEventListener("click", function (event) {
        cards.forEach(card => card.style.display = "flex");
        resultContent.style.display = "none";
    });

    // reset function is called to restart the game once reset button is clicked
    resetBtn.addEventListener("click", function (event) {
        reset();
    });

    /**
    * Sets/resets the game to the original state
    * - Resets total number of moves
    * - Displays cards face down and shuffles card order
    */
    function reset() {
        card1 = card2 = null;
        secondCard = disableCards = false;
        matches = moveCount = 0;
        moves.textContent = inputtedName + "'s Moves: 0";
        // flipCard function is called once card is clicked
        cards.forEach(card => card.addEventListener('click', flipCard));
        cards.forEach(card => card.style.transition = "none");
        setTimeout(function () {
            cards.forEach(card => card.style.transition = "transform 0.5s");
        }, 200);
        cards.forEach(card => card.classList.remove("flip"));
        shuffleCards();
    }

    /**
    * Flips the current card if the following conditions are met: 
    * - Card is not the same one that was just clicked 
    * - Other cards are not currently being flipped over
    * Identifies which card was flipped and increments the total number of moves
    */
    function flipCard() {
        if (this != card1 && !disableCards) {
            this.classList.add("flip");
            if (secondCard) {
                secondCard = false;
                card2 = this;
                disableCards = true;
                moveCount += 1;
                moves.textContent = inputtedName + "'s Moves: " + moveCount;
            } else {
                secondCard = true;
                card1 = this;
                return;
            }
            checkMatch();
        }
    }

    /**
    * Shuffles the order of cards by assigning random integers to each card and 
    * arranging the cards (flexboxes) based on their value from least to greatest
    */
    function shuffleCards() {
        cards.forEach(card => {
            let randomOrder = Math.floor(Math.random() * 30);
            card.style.order = randomOrder;
        })
    }

    /**
    * Checks if the two most recently clicked cards are the same by comparing their classes
    * - If they are the same, leaves the cards face up and disables re-clicks
    * - If not the same, cards are flipped over again
    * Reset button is disabled during this time to prevent cheating
    */
    function checkMatch() {
        resetBtn.disabled = true;
        if (card1.querySelector(".front").className == card2.querySelector(".front").className) {
            card1.removeEventListener("click", flipCard);
            card2.removeEventListener("click", flipCard);
            card1 = card2 = null;
            disableCards = false;
            resetBtn.disabled = false;
            matches += 1;
        } else {
            setTimeout(() => {
                card1.classList.remove("flip");
                card2.classList.remove("flip");
                secondCard = false;
                card1 = card2 = null;
                disableCards = false;
                resetBtn.disabled = false;
            }, 1000);
        }

        if (matches == 8) {
            gameOver();
        }
    }

    /**
    * Game over state where the end game frame is displayed 
    * with updated user stats (least amount of moves played)
    */
    function gameOver() {
        cards.forEach(card => card.style.display = "none");
        if (moveCount < bestScore) {
            bestScore = moveCount;
            bestMoves.textContent = "Best: " + bestScore;
        }
        result.textContent = "You have successfully matched all of the cards! Click the reset button to play again. Your best score is " + bestScore + " moves."
        resultContent.style.display = "flex";
    }
}