const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

app.use(cors()); // Enable CORS

// Define a route for button 1
app.get('/button1', (req, res) => {
    // Handle button 1 logic here
    const id = req.query.id;
    console.log("Button 1 was clicked! with id: " + id);
    res.status(200).send(req.query);
});

// Define a route for button 2
app.get('/button2', (req, res) => {
    data = req.query;
    // Handle button 2 logic here
    const id = data.id;
    console.log("Button 2 was clicked! with id: " + id);

    sendPubSubUpdate();

    res.status(200).send(data);
});

app.get('/', (req, res) => {
    // Handle root URL logic here
    res.send('Welcome to the homepage!');
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

// Load configuation
const config = JSON.parse(fs.readFileSync(path.join(
    __dirname,
    'config.json'
)));

// Prepare the Extension secret for use
// it's base64 encoded and we need to decode it first
const ext_secret = Buffer.from(config.extension_secret, 'base64');
const channelId = "92181806";

const sigPubSubPayload = {
    "exp": Math.floor(new Date().getTime() / 1000) + 10,
    "user_id": config.owner,
    "role": "external",
    "channel_id": channelId,
    "pubsub_perms": {
        "send": [
            "broadcast"
        ]
    }
}
const sigPubSub = jwt.sign(sigPubSubPayload, ext_secret);
var content = JSON.stringify([
    {
        id: '1683651672490',
        text: 'I CHANGED IT!'
    }
]);

function sendPubSubUpdate() {
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
                    event: "update",
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
        console.error('Relay PubSub OK', resp.status, resp.headers.get('ratelimit-remaining'), '/', resp.headers.get('ratelimit-limit'), resp);
    })
    .catch(err => {
        console.error('Relay Error', err);
    });
}