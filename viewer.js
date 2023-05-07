var token, userId = 222;
var buttons = [];
updateButtons();

// so we don't have to write this out everytime 
const twitch = window.Twitch.ext;

// onContext callback called when context of an extension is fired 
twitch.onContext((context) => {
    //console.log(context);
});

// onAuthorized callback called each time JWT is fired
twitch.onAuthorized((auth) => {
    // save our credentials
    token = auth.token; //JWT passed to backend for authentication 
    userId = auth.userId; //opaque userID 
    
    console.log("Authorized!")

    options = JSON.parse(twitch.configuration.broadcaster.content);
    updateButtons();
});


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

function updateConfig(){
    console.log('in set')
    console.log(buttons)
    console.log(typeof buttons)
    console.log(JSON.stringify(buttons))
    twitch.configuration.set("broadcaster", "1", JSON.stringify(buttons))
    console.log("has it been set?")
    console.log(twitch.configuration.broadcaster.content)
}

twitch.onError(function(error) {
    console.log(error);
})  