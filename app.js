const { OpenAI } = require('openai');
const readline = require('readline');

// Initialize the OpenAI client
const openai = new OpenAI({
    apiKey: '' 
});

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to prompt user for input
function promptUser() {
    rl.question('You: ', async (input) => {
        try {
            // Make a request to the OpenAI API
            const response = await openai.completions.create({
                model: 'text-davinci-003',
                prompt: input,
                max_tokens: 100
            });

            // Display the response
            console.log(`AI: ${response.choices[0].text.trim()}`);
        } catch (error) {
            console.error('Error:', error);
        }

        // Prompt the user again
        promptUser();
    });
}

// Start the prompt
promptUser();
