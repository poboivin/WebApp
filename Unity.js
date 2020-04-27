const fs = require('fs');
const http = require('http');
const WebSocket = require('ws');

const server = http.createServer(function (req, res) {
    res.write('Hello World!'); //write a response to the client
    res.end(); //end the response
  })


var id = 0;
var lookup = {};
const wss = new WebSocket.Server({ server  }) //port: 8080
console.log(`ServerStarted`)
var currentEmotion = 3;

wss.on('connection', ws => 
{
    console.log(`connection incomming`)

    ws.id = id++;
    lookup[ws.id] = ws;
    ws.send('Welcome To PierChat')
    var EmotionMessage = {};
    EmotionMessage.type = "emotion";
    EmotionMessage.Emotion = currentEmotion;
   
    ws.send(JSON.stringify(EmotionMessage));

    ws.on('message', message => {
        console.log(`Received message => ${message}`)
        try{
            var EmotionMessage =  JSON.parse(message);
            if(EmotionMessage.type == "emotion"){
                currentEmotion = EmotionMessage.Emotion;
            }
        }
        catch{

        }
        
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
              client.send(message);
            }
       
        // ws.send("copy that sir")
        })

    })
})

setInterval(() =>{
    wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
            currentEmotion = 0;
            var EmotionMessage = {};
            EmotionMessage.type = "emotion";
            EmotionMessage.Emotion = currentEmotion;
   
            client.send(JSON.stringify(EmotionMessage));
        }
   
    // ws.send("copy that sir")
    })

} , 5000);

server.listen(8080);

//lookup[0].send('message');

