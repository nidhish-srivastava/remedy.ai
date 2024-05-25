async function sendChat() {
    let userInput = document.getElementById("userInput").value.trim();
    if (!userInput) return; // Don't send empty messages

    // Add user's message to the chat area
    appendMessage(userInput, 'user-message');

    // Clear input after sending
    document.getElementById("userInput").value = '';

    try {
        // Start the POST request to send the message
        const response = await fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: userInput })
        });

        // Get the response JSON
        const jsonResponse = await response.json();

        // Create a container for the bot's message
        let botMessageContainer = createMessageContainer('bot-message');

        // Check if the query was valid
        if (jsonResponse.answer === "Invalid query") {
            botMessageContainer.innerHTML = "Please enter a valid query.";
        } else {
            // Replace newline characters with HTML <br> tags
            const formattedResponse = jsonResponse.answer.replace(/\n/g, '<br>');
            botMessageContainer.innerHTML = formattedResponse;
        }

        // Scroll the bot's message container into view
        botMessageContainer.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error:', error);
    }
}


function appendMessage(text, className) {
    let messageContainer = createMessageContainer(className);
    messageContainer.innerHTML = text.replace(/\n/g, '<br>'); // Replace newlines with <br>
    document.getElementById('chatArea').appendChild(messageContainer);
    messageContainer.scrollIntoView({ behavior: 'smooth' });
}

function createMessageContainer(className) {
    let div = document.createElement('div');
    div.classList.add('message', className);
    document.getElementById('chatArea').appendChild(div);
    return div;
}
