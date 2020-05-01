const fs = require('fs');
const https = require('https');
const WebSocket = require('ws');

const server = https.createServer({
    cert: fs.readFileSync('/Path'),
    key: fs.readFileSync('/Path')
   });


//var lookup = {};
const wss = new WebSocket.Server({ server  }) //port: 8080
console.log(`ServerStarted`)

wss.on('connection', function connection (ws,req) 
{
    console.log(`connection incomming`)

    ip = req.headers['x-forwarded-for'].split(/\s*,\s*/)[0];
    console.log(ip);
    ws.id = ip;


    //console.log(JSON.stringify(ws.ClientOptions.localAddress));
   // var propValue;
   // for(var propName in ws) {
   //     propValue = ws[propName]
    
  //      console.log(propName,propValue);
   // }
    ws.send('Welcome To PierChat')
   // var EmotionMessage = {};
  //  EmotionMessage.type = "emotion";
 //   EmotionMessage.Emotion = currentEmotion;
   
 //   ws.send(JSON.stringify(EmotionMessage));

    ws.on('message', message => {
        console.log(`Received message => ${message}`)
    
        var countMessage = {};
      //  countMessage.test = "test2";
        countMessage.clientNumber =   wss.clients. size;
        ws.send(JSON.stringify(countMessage));
        console.log(JSON.stringify(countMessage));

        var msgTosend;
        try{
            var JsonMessage =  JSON.parse(message);
            JsonMessage.address =    ws.id;
            msgTosend = JSON.stringify(JsonMessage);

        }
        catch{
            msgTosend = message;

        }

        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {

                client.send(msgTosend);
               
            }
       
        // ws.send("copy that sir")
        })

    })
})



server.listen(8080);

//lookup[0].send('message');

