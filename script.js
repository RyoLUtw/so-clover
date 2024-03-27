document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners to all buttons
    const buttons = document.querySelectorAll('button[data-direction]');
    buttons.forEach(button => {
        button.addEventListener('click', swapTextCards);
        console.log(button)
    });
});

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
    const sourceCard = `textcard${sourceRow}`;
    const targetCard = `textcard${targetRow}`;
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
    const card = document.getElementById(`textcard${cardId}`);
    console.log(card)
    // Collect the current text from the card's grid items.
    const texts = [];
    for (let i = 1; i <= 4; i++) {
        let item = document.getElementById(`textcard${cardId}-${i}`);
        console.log(item)
        texts.push(item.textContent);
    }

    // Rotate the text within the card
    for (let i = 0; i < 4; i++) {
        let item = document.getElementById(`textcard${cardId}-${i+1}`);
        item.textContent = texts[(i + 3) % 4]; // This rotates the text
    }
}

