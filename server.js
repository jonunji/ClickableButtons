const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

app.use(cors()); // Enable CORS

const htmlFiles = [
  'mobile.html',
  'video_overlay.html',
  'config.html'
];

// Define a route for button 1
app.get('/button1', (req, res) => {
    // Handle button 1 logic here
    const id = req.query.id;
    console.log("Button 1 was clicked! with id: " + id);
    res.status(200).send("Button 1 was clicked! with id: " + id);
});

// Define a route for button 2
app.get('/button2', (req, res) => {
    // Handle button 2 logic here
    const id = req.query.id;
    console.log("Button 2 was clicked! with id: " + id);
    res.status(200).send("Button 2 was clicked! with id: " + id);
});

app.get('/', (req, res) => {
    // Handle root URL logic here
    res.send('Welcome to the homepage!');
});

app.get('/:filename', (req, res) => {
    const filename = req.params.filename;
    if (htmlFiles.includes(filename)) {
      res.sendFile(path.join(__dirname, `${filename}`));
    } else {
      res.status(404).send('File not found');
    }
});

const port = 8080;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

