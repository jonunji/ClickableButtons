const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

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
    console.log("The req is ", req.query)
    // Handle button 2 logic here
    const id = data.id;
    data.text = "33333";
    data.fontSize = 300;
    console.log("The string data is ", data);
    console.log("Button 2 was clicked! with id: " + id);

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

