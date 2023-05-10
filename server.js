const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

app.use(cors()); // Enable CORS
app.use(bodyParser.json())

app.post('/updateconfig', (req, res) => {
    // Retrieve data from the request
    const buttons = req.body.buttons;
    const channelId = req.body.channelId;
    console.log(buttons)
    console.log(channelId)

    // Call the sendPubSubConfig() function with the received data
    sendPubSubConfig(buttons, channelId);

    // Respond with a success message
    res.status(200).send('PubSub config sent successfully');
});

app.get('/:filepath(*)', (req, res) => {
  const filepath = req.params.filepath;
  const requestedFile = path.join(__dirname, filepath);

  res.sendFile(requestedFile, (err) => {
      if (err) {
          console.error(err);
          res.status(404).send('File not found');
      }
  });
});

const port = 8080;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

function sendPubSubConfig(configData, channelId) {
    console.log("received the call", configData, channelId);
    // Load configuation
    const config = JSON.parse(fs.readFileSync(path.join(
        __dirname,
        'config.json'
    )));

    // Prepare the Extension secret for use
    // it's base64 encoded and we need to decode it first
    const ext_secret = Buffer.from(config.extension_secret, 'base64');

    const sigPubSubPayload = {
        "exp": Math.floor(new Date().getTime() / 1000) + 5,
        "user_id": config.owner,
        "role": "external",
        "channel_id": channelId,
        "pubsub_perms": {
            "send": [
                "broadcast"
            ]
        }
    }

    var content = JSON.stringify(configData);
    const sigPubSub = jwt.sign(sigPubSubPayload, ext_secret);
    
    fetch(
        "https://api.twitch.tv/helix/extensions/pubsub",
        {
            method: "POST",
            headers: {
                "Client-ID": config.client_id,
                "Authorization": `Bearer ${sigPubSub}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                target: sigPubSubPayload.pubsub_perms.send,
                broadcaster_id: channelId,
                is_global_broadcast: false,
                message: JSON.stringify({
                    event: "config",
                    data: content
                })
            })
        }
    )
    .then(async resp => {
        // Same story here with the rate limit its around 60 per minute per topic
        if (resp.status != 204) {
            console.error('Relay Error', await resp.text());
            return;
        }
        console.error('Relay PubSub OK', resp.status, resp.headers.get('ratelimit-remaining'), '/', resp.headers.get('ratelimit-limit'));
    })
    .catch(err => {
        console.error('Relay Error', err);
    });
}