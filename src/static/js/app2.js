document.getElementById('submitBtn').addEventListener('click', async function() {
    var userInput = document.getElementById('userInput').value;
    document.getElementById('response').innerHTML = '<p>Processing...</p>';
    const formData = new FormData();
    formData.append('query', userInput); 
    try {
        const response = await fetch('/get_response', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        document.getElementById('response').innerHTML = `<p>${data.answer}</p><br><pre><b>Context: </b> ${data.source_document}</pre><br><pre><b>Source Document: </b> ${data.doc}</pre>`;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('response').innerHTML = '<p>Error processing your request</p>';
    }
});
