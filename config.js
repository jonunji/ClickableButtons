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

    addButtonToDropDown(button);
}

function addButtonToDropDown(button)
{
    $('#button-dropdown').append(`<option id="${button.id}" value="${button.name}">${button.name}</option>`);
}

function editButton() {
    const editButton = $('#edit-button');
    const createButton = $('#create-button');
    const buttonDropDown = $('#button-dropdown');
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
        buttonDropDown.show();
        
    // Edit button was pressed, toggle to save mode
    } else {
        populateFields(selectedButton);

        // Add edit mode class and update button text
        editButton.addClass('edit-mode');
        editButton.text('Save Button');

        destroyButton.hide();
        createButton.hide();
        buttonDropDown.hide();
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
    button.borderStyle = $('#button-border-style').val();
    button.borderRadius = $('#button-border-radius').val();
    button.borderWidth = $('#button-border-width').val();
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
    $('#button-border-style').val(button.borderStyle),
    $('#button-border-radius').val(button.borderRadius),
    $('#button-border-width').val(button.borderWidth),
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
                loadButtonsArray(config);
                updateButtons();
            } else {
                console.log('invalid config')
            }
        } catch(e) {
            console.log('invalid config')
        }   

        // Update the dropdown options
        buttons.forEach((button) => {
            addButtonToDropDown(button);
        });
    }
}

function loadButtonsArray(arr)
{
    buttons = arr;

    // assign the id's for later use
    for (let i = 0; i < buttons.length; i++)
        buttons[i].id = i;
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

function validateForm() {
    const name = $('#button-name');
    const width = $('#button-width');
    const height = $('#button-height');
    const posX = $('#button-posx');
    const posY = $('#button-posy');
    const borderRadius = $('#button-border-radius');
    const borderWidth = $('#button-border-width');
    const font = $('#button-font');
    const fontSize = $('#button-font-size');
    const url = $('#button-url');
    const data = $('#button-data');
    const func = $('#button-function');

    // Remove the previous error highlighting
    $('.error-field').removeClass('error-field');
    $('.error-message').remove();

    var isValid = true;

    if (name.val().trim() === '') {
        name.addClass('error-field');
        name.after('<span class="error-message">Please enter a button name</span>');
        isValid = false;
    }

    if (isNaN(parseInt(width.val())) || parseInt(width.val()) <= 0) {
        width.addClass('error-field');
        width.after('<span class="error-message">Please enter a number greater than 0.</span>');
        isValid = false;
    }

    if (isNaN(parseInt(height.val())) || parseInt(height.val()) <= 0) {
        height.addClass('error-field');
        height.after('<span class="error-message">Please enter a number greater than 0.</span>');
        isValid = false;
    }

    if (isNaN(parseInt(posX.val())) || parseInt(height.val()) <= 0) {
        posX.addClass('error-field');
        posX.after('<span class="error-message">Please enter a number greater than 0.</span>');
        isValid = false;
    }

    if (isNaN(parseInt(posY.val())) || parseInt(height.val()) <= 0) {
        posY.addClass('error-field');
        posY.after('<span class="error-message">Please enter a number greater than 0.</span>');
        isValid = false;
    }

    
    if (isNaN(parseInt(borderRadius.val())) || parseInt(borderRadius.val()) <= 0)
    {
        borderRadius.addClass('error-field');
        borderRadius.after('<span class="error-message">Please enter a number greater than 0.</span>');
        isValid = false;
    }
    
    if (isNaN(parseInt(borderWidth.val())) || parseInt(borderWidth.val()) <= 0)
    {
        borderWidth.addClass('error-field');
        borderWidth.after('<span class="error-message">Please enter a number greater than 0.</span>');
        isValid = false;
    }
    
    if (font.val().trim() === '') {
        font.addClass('error-field');
        font.after('<span class="error-message">Please enter a valid font.</span>');
        isValid = false;
    }

    if (isNaN(parseInt(fontSize.val())) || parseInt(fontSize.val()) <= 0)
    {
        fontSize.addClass('error-field');
        fontSize.after('<span class="error-message">Please enter a number greater than 0.</span>');
        isValid = false;
    }

    var urlPattern = /^(https?:\/\/)?([\w.-]+)(:\d{1,5})?(\/\S*)?$/i;
    if (!urlPattern.test(url.val())) {
        url.addClass('error-field');
        url.after('<span class="error-message">Please enter a valid url.</span>');
        isValid = false;
    }

    if (!isValidObjectLiteral(data.val()))
    {
        data.addClass('error-field');
        data.after('<span class="error-message">Please enter a valid Javascript object literal.</span>');
        isValid = false;
    }

    if (!validateJavaScriptCode(func.val()))
    {
        func.addClass('error-field');
        func.after('<span class="error-message">Please enter valid Javascript code.</span>');
        isValid = false;
    }
    
    return isValid;
}

function validateJavaScriptCode(code) {
    try {console.log("");
        // Wrapping the code in a function to avoid potential global scope issues
        new Function(code);
        return true; // The code is valid
    } catch (error) {
        return false; // The code is invalid
    }
}
  
function isValidObjectLiteral(str) {
    // Define the regular expression pattern to match object literal syntax
    const objectLiteralPattern = /^\s*\{[\s\S]*\}\s*$/;

    // Test if the string matches the object literal pattern
    return objectLiteralPattern.test(str);
}

$(document).ready(function() {
    // Add event listeners to the input fields to trigger validation on change
    $('#button-name').on('input', validateForm);
    $('#button-width').on('input', validateForm);
    $('#button-height').on('input', validateForm);
    $('#button-posx').on('input', validateForm);
    $('#button-posy').on('input', validateForm);
    $('#button-border-radius').on('input', validateForm);
    $('#button-border-width').on('input', validateForm);
    $('#button-font').on('input', validateForm);
    $('#button-font-size').on('input', validateForm);
    $('#button-url').on('input', validateForm);
    $('#button-data').on('input', validateForm);
    $('#button-function').on('input', validateForm);

    validateForm();
});

