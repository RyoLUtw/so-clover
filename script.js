document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners to all buttons
    const buttons = document.querySelectorAll('button[data-direction]');
    buttons.forEach(button => {
        button.addEventListener('click', swapTextCards);
        //console.log(button)
    });
});
// Get the input elements by their ID
const inputD_L = document.getElementById('inputD_L');
const inputD_R = document.getElementById('inputD_R');
const builtInTW = [
    "animal", "apple", "arrow", "basket", "beach", "bear", "bird", "book", "bottle", "box",
    "boy", "branch", "bridge", "butterfly", "button", "cake", "camera", "car", "cat", "chair",
    "chicken", "child", "church", "circle", "clock", "cloud", "clown", "coat", "corn", "cow",
    "crowd", "crown", "cup", "deer", "desk", "door", "duck", "egg", "elephant", "eye",
    "family", "fish", "flag", "flower", "frog", "game", "garden", "gate", "ghost", "giraffe",
    "girl", "glass", "glove", "grape", "grass", "hat", "hill", "horse", "house", "island",
    "jewel", "kangaroo", "kite", "lake", "leaf", "lion", "lizard", "man", "map", "moon",
    "mountain", "mouse", "mouth", "mushroom", "nest", "net", "nose", "ocean", "orange", "owl",
    "panda", "park", "pen", "pencil", "piano", "pig", "pineapple", "pizza", "planet", "plant",
    "plate", "rabbit", "rainbow", "ring", "river", "road", "robot", "rock", "rocket", "roof",
    "room", "rope", "rose", "seed", "shark", "sheep", "shelf", "ship", "shirt", "shoe",
    "snake", "spider", "spoon", "star", "street", "sun", "table", "tail", "tree", "watch",
    "water", "whale", "window", "zebra"
]
// Function to synchronize the values
function synchronizeValues(source, target) {
    target.value = source.value;
}

// Listen for changes on inputD_L and update inputD_R accordingly
inputD_L.addEventListener('input', function () {
    synchronizeValues(inputD_L, inputD_R);
});

// Listen for changes on inputD_R and update inputD_L accordingly
inputD_R.addEventListener('input', function () {
    synchronizeValues(inputD_R, inputD_L);
});


function loadVoc() {
    let defaultTW = JSON.parse(JSON.stringify(builtInTW)); // Deep clone builtInTW
    // Split input text into array by comma
    let inputText = document.getElementById('textInput').value;
    let inputTW = inputText.split(',').map(item => item.trim());

    // Replace empty strings in inputTW with values from defaultTW
    inputTW = inputTW.map(item => {
        if (item === '') {
            // Ensure we have values to replace from defaultTW
            if (defaultTW.length > 0) {
                let randomIndex = Math.floor(Math.random() * defaultTW.length);
                let replacementValue = defaultTW[randomIndex];
                defaultTW.splice(randomIndex, 1); // Remove to avoid reuse
                return replacementValue;
            } else {
                console.error("defaultTW is empty, cannot replace '' with a value from defaultTW.");
                return item; // Return the item itself if defaultTW is empty
            }
        }
        return item;
    });

    // Combine and shuffle the inputTW with necessary elements from defaultTW
    while (inputTW.length < 16) {
        // Ensure we have enough unique values to fill inputTW without duplicates.
        if (defaultTW.length === 0) {
            console.error("Not enough unique values in defaultTW to fill inputTW without duplicates.");
            break;
        }

        // Add random element from defaultTW if inputTW doesn't have enough values
        let randomIndex = Math.floor(Math.random() * defaultTW.length);
        let candidateValue = defaultTW[randomIndex];

        // Check if candidateValue is not already in inputTW to avoid repetition
        if (!inputTW.includes(candidateValue)) {
            inputTW.push(candidateValue);
            // Remove the added element from defaultTW
            defaultTW.splice(randomIndex, 1);
        } else {
            // If the candidate value is a duplicate, remove it from defaultTW to prevent infinite loops
            // and try again with a different value in the next iteration.
            defaultTW.splice(randomIndex, 1);
        }
    }

    // Shuffle the inputTW array to randomize distribution
    inputTW.sort(() => Math.random() - 0.5);

    // Assign values to answerCards
    for (let i = 1; i <= 4; i++) {
        for (let j = 1; j <= 4; j++) {
            let cardId = `answerCard${i}-${j}`;
            let cardElement = document.getElementById(cardId);
            if (cardElement) {
                cardElement.textContent = inputTW.pop(); // Assign and remove the last element
            }
        }
    }
}

function startGame() {
    // Copy values from answerCards to textCards
    for (let i = 1; i <= 4; i++) {
        for (let j = 1; j <= 4; j++) {
            const answerCardId = `answerCard${i}-${j}`;
            
            const textCardId = `textCard${i}-${j}`;
            
            const answerCardElement = document.getElementById(answerCardId);
           
            const textCardElement = document.getElementById(textCardId);
            
            if (answerCardElement && textCardElement) {
                textCardElement.textContent = answerCardElement.textContent;
            }
        }
    }

    // Get all buttons within the div with id "playInterface"
    const buttons = document.querySelector('#textCardHolder').getElementsByTagName('button');

    // Simulate clicking each button a random number of times
    for (let button of buttons) {
        const randomClicks = Math.floor(Math.random() * 3) + 1; // Random number of clicks between 1 and 5
        for (let i = 0; i < randomClicks; i++) {
            button.click();
        }
    }
    syncDivTextContents();
    document.getElementById('setupInterface').style.display = "none";
    document.getElementById('playInterface').style.display = "block"
}


function swapTextCards(event) {
    //console.log("swapInitiated")
    const button = event.currentTarget;
    const direction = button.getAttribute('data-direction');
    const row = button.getAttribute('data-row');
    const maxRows = 4; // Assuming you have 4 rows of text cards
    //console.log("direction:",direction)
    let sourceRow = parseInt(row);
    let targetRow = direction === 'left' ? sourceRow - 1 : sourceRow + 1;

    // Wraparound logic
    if (sourceRow === 1 && direction === 'left') {
        // If the first card's left button is clicked, swap with the last card
        targetRow = maxRows;
    } else if (sourceRow === maxRows && direction === 'right') {
        // If the last card's right button is clicked, swap with the first card
        targetRow = 1;
    }

    // Proceed with swap if the target exists
    const sourceCard = `textCard${sourceRow}`;
    const targetCard = `textCard${targetRow}`;
    //console.log("sourceCard:", sourceCard)
    //console.log("targetCard:", targetCard)
    if (document.getElementById(sourceCard) && document.getElementById(targetCard)) {
        //console.log("cards found, swapping")
        for (let i = 1; i <= 4; i++) {
            let sourceItem = document.getElementById(`${sourceCard}-${i}`);
            let targetItem = document.getElementById(`${targetCard}-${i}`);

            if (sourceItem && targetItem) {
                // Swap the textContent of each item
                let temp = sourceItem.textContent;
                sourceItem.textContent = targetItem.textContent;
                targetItem.textContent = temp;
            }
        }
    }
}

function rotateTextCard(event) {
    const button = event.currentTarget;
    const cardId = button.getAttribute('data-card');
    const card = document.getElementById(`textCard${cardId}`);
    //console.log(card)
    // Collect the current text from the card's grid items.
    const texts = [];
    for (let i = 1; i <= 4; i++) {
        let item = document.getElementById(`textCard${cardId}-${i}`);
        //console.log(item)
        texts.push(item.textContent);
    }

    // Rotate the text within the card
    for (let i = 0; i < 4; i++) {
        let item = document.getElementById(`textCard${cardId}-${i + 1}`);
        item.textContent = texts[(i + 3) % 4]; // This rotates the text
    }
}

function checkAnswer() {
    // Iterate through the grid
    for (let i = 1; i <= 4; i++) {
        for (let j = 1; j <= 4; j++) {
            const answerCardId = `answerCard${i}-${j}`;
            const textCardId = `textCard${i}-${j}`;
            const answerCardElement = document.getElementById(answerCardId);
            const textCardElement = document.getElementById(textCardId);

            if (answerCardElement && textCardElement) {
                // Compare the textContent of both elements
                if (answerCardElement.textContent === textCardElement.textContent) {
                    // If they match, set the background color to green
                    textCardElement.style.backgroundColor = 'green';
                } else {
                    // If they differ, set the background color to red
                    textCardElement.style.backgroundColor = 'red';
                }
            }
        }
    }
}

function syncDivTextContents() {
    // Find both container divs
    const inputLabelContainer = document.getElementById('inputLabelContainer');
    const groupLabelContainer = document.getElementById('groupLabelContainer');

    // Check if both containers exist
    if (!inputLabelContainer || !groupLabelContainer) {
        console.error('One or both containers not found!');
        return;
    }

    // Get all child divs of inputLabelContainer
    const inputLabels = inputLabelContainer.querySelectorAll('input');
    console.log(inputLabels)
    // Iterate through each child div of inputLabelContainer
    inputLabels.forEach(inputLabel => {
        // Construct the corresponding ID for groupLabelContainer based on current inputLabel ID
        const correspondingId = inputLabel.id.replace('input', 'group');

        // Find the matching div in groupLabelContainer
        const groupLabel = groupLabelContainer.querySelector(`#${correspondingId}`);

        // If matching div found, synchronize the textContent
        if (groupLabel) {
            groupLabel.textContent = inputLabel.value;
        } else {
            console.error(`No matching div found for ID ${correspondingId} in groupLabelContainer.`);
        }
    });
}
