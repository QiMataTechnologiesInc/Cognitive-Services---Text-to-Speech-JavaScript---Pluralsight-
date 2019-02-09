const fs = require('fs');
let Client = require('node-rest-client').Client;
 
let client = new Client();

let auth_request_args = {
    data: "",
    headers: { "Ocp-Apim-Subscription-Key": "{{ Your Subscription Key }}" }
};

let bearer_token = 'Bearer ';

let ssml = `<speak version='1.0' xmlns=\"http://www.w3.org/2001/10/synthesis\" xml:lang='en-US'>
            <voice  name='Microsoft Server Speech Text to Speech Voice (en-US, Jessa24kRUS)'>
            Welcome to Microsoft Cognitive Services <break time=\"100ms\" /> Text-to-Speech API.
            </voice> </speak>`;

client.post("https://eastus.api.cognitive.microsoft.com/sts/v1.0/issuetoken", 
    auth_request_args, 
        function (auth_data, auth_response) {
    
    bearer_token += auth_data.toString();

    let audio_request_args = {
        data: ssml,
        headers: {"Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
        "User-Agent": "PluralsightDemo",
        "Authorization": bearer_token }
    };

    client.post("https://eastus.tts.speech.microsoft.com/cognitiveservices/v1",
                audio_request_args,
                function (audio_data, audio_response) {
            fs.writeFileSync("speech.mpga",audio_data);
    });
});