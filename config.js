var token, userId;
var buttons = [];

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

    loadButtons();
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

function createButton() {
    // Get the values from the form inputs
    var button = {};

    setButtonVal(button);
    buttons.push(button);

    $('#button-dropdown').append(`<option id="${button.id}" value="${button.name}">${button.name}</option>`);
}

function editButton() {
    const editButton = $('#edit-button');
    const createButton = $('#create-button');
    const destroyButton = $('#destroy-button');
    const id = $('#button-dropdown option:selected').attr('id');
    const selectedButton = buttons[id];

    if (!selectedButton) {
        // Handle case when no matching button is found
        console.log("Selected button not found.");
        return;
    }

    // Save button was pressed
    if (editButton.hasClass('edit-mode')) {
        setButtonVal(selectedButton);

        // Remove edit mode class and update button text
        editButton.removeClass('edit-mode');
        editButton.text('Edit Button');

        destroyButton.show();
        createButton.show();
        
    // Edit button was pressed, toggle to save mode
    } else {
        populateFields(selectedButton);

        // Add edit mode class and update button text
        editButton.addClass('edit-mode');
        editButton.text('Save Button');

        destroyButton.hide();
        createButton.hide();
    }
}
  
function setButtonVal(button)
{
    button.id = buttons.length;
    button.name = $('#button-name').val();
    button.width = parseInt($('#button-width').val());
    button.height = parseInt($('#button-height').val());
    button.posX = parseInt($('#button-posx').val());
    button.posY = parseInt($('#button-posy').val());
    button.border = $('#button-border').val();
    button.font = $('#button-font').val();
    button.fontSize = $('#button-font-size').val();
    button.color = $('#button-color').val();
    button.backgroundColor = $('#button-background-color').val();
    button.url = $('#button-url').val();
    button.method = $('#button-method').val();
    button.data = $('#button-data').val();
    button.function = $('#button-function').val();
}

function populateFields(button)
{
    $('#button-name').val(button.name);
    $('#button-width').val(button.width);
    $('#button-height').val(button.height);
    $('#button-posx').val(button.posX);
    $('#button-posy').val(button.posY);
    $('#button-border').val(button.border),
    $('#button-font').val(button.font),
    $('#button-font-size').val(button.fontSize),
    $('#button-color').val(button.color),
    $('#button-background-color').val(button.backgroundColor),
    $('#button-url').val(button.url);
    $('#button-method').val(button.method);
    $('#button-data').val(button.data);
    $('#button-function').val(button.function);
}

// Gets rid of the currently selected button
function destroyButton() {
    var name = $('#button-dropdown option:selected').attr('value');

    buttons = buttons.filter(button => button.name !== name);

    // Remove the currently selected option from the dropdown
    $('#button-dropdown option:selected').remove();
}

// Call this at the start so we can load what is currently loaded by the broadcaster
function loadButtons() {
    //reset the dropdown
    $('#button-dropdown').empty();

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

    // Update the dropdown options
    buttons.forEach((button) => {
        $('#button-dropdown').append(`<option value="${button.name}">${button.name}</option>`);
    });
    }
}

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