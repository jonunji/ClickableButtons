var token, userId;
updateButtons(false);

// so we don't have to write this out everytime 
const twitch = window.Twitch.ext;

// onAuthorized callback called each time JWT is fired
twitch.onAuthorized((auth) => {
    // save our credentials
    token = auth.token; // JWT passed to backend for authentication 
    userId = auth.userId; // opaque userID 
    
    updateButtons(false);
});

twitch.onError(function(error) {
    console.log(error);
})  

// when the config changes, save the new changes! 
twitch.configuration.onChanged(function(){
    console.log(twitch.configuration.broadcaster)
    console.log("in onChanged")

    if(twitch.configuration.broadcaster){
        console.log("config exists")
        try {
            var config = JSON.parse(twitch.configuration.broadcaster.content)
            if(typeof config === "object"){
                buttons = config
                updateButtons()
            } else {
                console.log('invalid config')
            }
        } catch(e) {
            console.log('invalid config')
        }
    }
})

// Function to find a button by its ID
function findButtonById(id) {
    return buttons.find(button => button.id == id);
}


// listen for incoming broadcast message from our EBS
twitch.listen('broadcast', function (target, contentType, message) {
    console.log(target)
    console.log(contentType)
    console.log(message)
    try {
        message = JSON.parse(message);
    } catch (e) {
        // this accounts for JSON parse errors
        return;
    }

    pubSubUpdate(message.data);
});

function pubSubUpdate(data)
{
    try {
        data = JSON.parse(data);
    } catch (e) {
        // this accounts for JSON parse errors
        console.log('Error while parsing the data.', error);
        return;
    }
    
    // update all the buttons
    data.forEach(newData => {
        const button = findButtonById(newData.id);
        
        if (button) {
            // set the values to what was provided
            $.each(newData, function(property, value) {
                button[property] = value;
            })
        }
    })

    // actually make the change visible
    updateButtons(false);
}

function pubSubConfig() 
{
    
}
