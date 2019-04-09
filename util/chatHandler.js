const apiai = require('apiai');
const chat = apiai(process.env.APIAI_TOKEN); //e31ba42e7b5f43f093842cd860f62f56 - you better hide this
const rn = require('random-number');

var numOptions = {
    min: 200
    , max: 1500
    , integer: true
};
exports.run = async (client, message) => {
    if (message.content.includes('Cancel')) {
        var request = chat.deleteContextsRequest({
            sessionId: message.author.id
        });

        request.on('error', (error) => {
            console.log(error);
        });

        request.end();
        return;
    }

    request = chat.textRequest(message.content, { // here we introduce the "request" to the computer
        sessionId: message.author.id
    });

    request.on('error', (error) => {
        console.log(`${message.guild.name} (${message.guild.id}) made an oopsie: ${error}`); // log the error, I don't know what logger do you use
    });

    request.on('response', async (response) => { // here we async initialize the request        
        const reply = response.result.fulfillment.speech; // grab the response from DialogFlow API
        await message.channel.startTyping(); // nice effect to make the bot look like it's "typing"
        await setTimeout(() => {
            message.channel.send(`${reply}`).catch(console.error); // send the response
            message.channel.stopTyping();
        }, rn(numOptions));
    });

    request.end(); // end the request to make it tidy - we no longer need this
};
