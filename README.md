# ClickableButtons

This Twitch Extension allows creators to add customizable, clickable buttons for users to press.

Each button can be extensively modifies with some of the following properties:
* Name
* Text
* Width
* Height
* Border Style
* Border Radius
* Border Width
* Font
* Font Size
* Color
* Background Color
* URL (the endpoint upon click)
* Method (GET/POST)
* Additional CSS

## Simple Guide
Configuration:
1. Go to either the live config in the Stream Manager or the Extension config page.
2. Follow the fields to customize the buttons to your liking.
3. For URL and method, it helps if you have an endpoint to test. (ex. URL: "http://localhost:3000/yourendpoint", method: GET)
4. To visualize what the stream will look like, click in the blue area where the buttons get created to upload an image.
5. For additional customization, fill out the css field. Example input: "attribute1": "value1", "attribute2" : "value2", etc.

Using the extension:

6. Once done, make sure the stream is live and active the extension.
7. Clicking the button will send the info the the endpoint specified.
8. If you want to change something about the button on click, the buttons expect in response the attributes you would like to change. It is easy to do this by simply modifying the data you receive at the endpoint.
9. You can also send a PubSub request with the buttons you want to modify. IDs of the buttons are found on the config screen. The payload should be as follows:
```
message = {
    .
    .
    .
    data = [
        { id: <id of the button you want to modify>, 
            attributes you want to change
        },
        { id: <id of the button you want to modify>, 
            attributes you want to change
        },
    ]
}
```
This is useful for resetting buttons, for example.

## How to use
Go to the config page in the Twitch dashboard and modify the buttons as you please.

You can click the blue area where the buttons go to add an image. This is helpful if you want to visualize what your stream will look like with the overlay.

Buttons can be positioned by dragging them with the mouse.

### Endpoints on Button Press
Only 8080 and 3000 are valid ports (ex. http://localhost:8080/mybutton, your port and endpoint would be "8080/mybutton"). If you want to use other URLs, setup an endpoint within localhost which redirects to your desired endpoint.

The data sent to the endpoint is the data of the clicked button:
```
id: '1683651652707',
text: 'This is a button!',
width: 200,
height: 250,
borderStyle: 'none',
borderRadius: '2',
borderWidth: '2',
font: 'Arial',
fontSize: '16',
color: '#000000',
backgroundColor: '#ff0000',
url: 'http://localhost:3000/buttonpress',
method: 'GET',
css: '{}',
userId: 'U12345678',
posX: '495.93333435058594',
posY: '5.9333343505859375'
```

The expected returned data is an object with the same fields, but allowed to be modified. A possible usage is below:

Let's say you start with the structed shown above. After the user clicks the button, we want to change the text to "Clicked!". The response you would return from your endpoint would be as follows:
<pre>
id: '1683651652707',
name: 'Button 1',
<b><i>text: 'Clicked!',</b></i>
.
.
.
posX: '495.93333435058594',
posY: '5.9333343505859375'
</pre>

Any of the properties can be modified except id. It can be modified, but shouldn't as other systems, likely setup by yourself, rely on a consistent ID.

### Sending Other Information
If you want to customize the buttons at any time, you can make use of the Twitch PubSub listening endpoint.

In [viewer.js](viewer.js), we have the following:
```
// listen for incoming broadcast message from our EBS
twitch.listen('broadcast', function (target, contentType, message) {
    try {
        message = JSON.parse(message);
    } catch (e) {
        // this accounts for JSON parse errors
        return;
    }

    update(message.data);
});
```

To call this, you should follow the ideas present within the Twitch PubSub structure to send a "broadcast" request with your message in the following format:
```
message = [
    ...
    ...
    data: {an array of button data}
]
```

The data should be in the format shown above and allows for the specified buttons to be altered. You specify which buttons by including the id and the fields you want to modify.

So if you want to change the text on two separate buttons, you can send a message with the following format:
```
message = [
    ...
    ...
    data: [
        {id: 0000001, text: 'This is button 1!'},
        {id: 0000002, text: 'This is button 2!}
    ]
]
```

Passing this as the message will change the buttons with ids to the specified text. This is also why the IDs should not be changed, as this how they can be referenced.
