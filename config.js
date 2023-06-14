var token, userId, channelId;
var selectedButton;

// so we don't have to write this out everytime 
const twitch = window.Twitch.ext;

// onAuthorized callback called each time JWT is fired
twitch.onAuthorized((auth) => {
    // save our credentials
    token = auth.token; //JWT passed to backend for authentication 
    userId = auth.userId; //opaque userID 
    channelId = auth.channelId;
    
    console.log("Authorized!")

    loadButtons();
});


// when the config changes, save the new changes! 
twitch.configuration.onChanged(function() {
    console.log(twitch.configuration.broadcaster)

    if (twitch.configuration.broadcaster) {
        console.log("config exists")
        try {
            var config = JSON.parse(twitch.configuration.broadcaster.content)
            if (typeof config === "object") {
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

// makes the button data and adds it to the screen
function createButton() {

    // don't make a button if the fields are invalid
    if (!validateForm()) return;

    var button = {};
    button.id = new Date().getTime();

    setButtonVal(button);
    buttons.push(button);

    // refresh the screen
    updateButtons();
    selectButton(button);
}

// Gets rid of the currently selected button
function destroyButton() {
    var id = selectedButton.data('buttonData').id;

    var index = buttons.findIndex(button => button.id == id);
    if (index !== -1) {
      buttons.splice(index, 1);
    }

    updateButtons();
    selectButton();
}

// Function to find a button by its ID
function findButtonById(id) {
    return buttons.find(button => button.id == id);
}

// Sets the given button as selected
function selectButton(buttonData = undefined) {
    const id = buttonData ? buttonData.id : null;

    // Remove live editing the button's properties
    removeOnInputChange('.edit');

    if (selectedButton)
    {
        selectedButton.removeClass('highlight');
        $('#button-id').text("Button ID: ")

        selectedButton = null;
    } 
    
    $('.custom-button').each(function() {
        var buttonId = $(this).data('buttonData').id;

        if (buttonId == id) 
            selectedButton = $(this)
    });
    
    if (selectedButton) 
    {
        selectedButton.addClass('highlight');
        var buttonId = $("<u>").text(selectedButton.data('buttonData').id);
        buttonId.css('color', 'red');

        $('#button-id').html("Button ID: ").append(buttonId);

        populateFields(selectedButton.data('buttonData'));
        $('#create-button').text("Duplicate Button");

        const selectedButtonData = selectedButton.data('buttonData');

        // Add live view of editing the button's properties
        addOnInputChange('.edit', function() {
            setButtonVal(selectedButtonData);
            updateButtons();
        })
    }
    else
    {
        $('#config-form')[0].reset();
        $('#create-button').text("Create Button");
    }
}
  
// Sets the properties of a given button's data to the fields in config.html
function setButtonVal(button) {
    button.text = $('#button-text').val();
    button.width = parseInt($('#button-width').val());
    button.height = parseInt($('#button-height').val());
    button.borderStyle = $('#button-border-style').val();
    button.borderRadius = $('#button-border-radius').val();
    button.borderWidth = $('#button-border-width').val();
    button.font = $('#button-font').val();
    button.fontSize = $('#button-font-size').val();
    button.color = $('#button-color').val();
    button.backgroundColor = $('#button-background-color').val();
    button.url = $('#button-url-endpoint').val();
    button.css = '{' + $('#button-css').val() + '}';
}

// Sets the fields in config.html to the provided button's properties
function populateFields(button) {
    $('#button-text').val(button.text);
    $('#button-width').val(button.width);
    $('#button-height').val(button.height);
    $('#button-border-style').val(button.borderStyle),
    $('#button-border-radius').val(button.borderRadius),
    $('#button-border-width').val(button.borderWidth),
    $('#button-font').val(button.font),
    $('#button-font-size').val(button.fontSize),
    $('#button-color').val(button.color),
    $('#button-background-color').val(button.backgroundColor),
    $('#button-url-endpoint').val(button.url);
    $('#button-css').val(button.css.slice(1, -1));

    validateForm();
}

// Call this at the start so we can load what is currently loaded by the broadcaster
function loadButtons() {
    if(twitch.configuration.broadcaster){
        console.log("config exists")
        try {
            var config = JSON.parse(twitch.configuration.broadcaster.content)
            if(typeof config === "object"){
                console.log(config)
                buttons = config;
                loadButtonsArray(config);
            } else {
                console.log('invalid config')
            }
        } catch(e) {
            console.log('invalid config')
        }
    }
}

// if we are loading in an existing configuration
function loadButtonsArray(arr)
{
    buttons = arr;
    updateButtons();
}

// Called when submitting the config form
function updateConfig() {
    // refresh the screen
    updateButtons();

    twitch.configuration.set("broadcaster", "1", JSON.stringify(buttons))

    // live refresh the screen
    sendPubSubConfig();

    // Display success message
    var successMessage = $("#submit");
    successMessage.val("Successfully submitted");

    // Hide the success message after 5 seconds
    setTimeout(function() {
      successMessage.val("Submit");
    }, 5000);
}

// The POST request to support live config
function sendPubSubConfig() {
    $.post({
        url: 'https://clickablebuttons.onrender.com/updateconfig',
        method: 'POST',
        data: JSON.stringify({ buttons, channelId }),
        contentType: "application/json; charset=utf-8",
        success: function(response) {
            console.log("Success: ", response);
        },
        error: function(error) {
            console.error("Error when clicking button:", error);
        }
    });
}

// checks that all fields are valid
function validateForm() {
    const font = $('#button-font');
    const url = $('#button-url-endpoint');
    const css = $('#button-css');

    // Remove the previous error highlighting
    $('.error-field').removeClass('error-field');
    $('.error-message').remove();

    var isValid = true;
    
    if (font.val().trim() === '') {
        font.addClass('error-field');
        font.after('<span class="error-message">Please enter a valid font.</span>');
        isValid = false;
    }

    // test the endpoint field
    var urlPattern = /^https?:\/\/(?:www\.)?(?:localhost|(?:[a-zA-Z0-9-]+\.){1,}[a-zA-Z]{2,})(?::\d+)?\/[a-zA-Z0-9_/-]+$/;
    if (!urlPattern.test(url.val())) {
        url.addClass('error-field');
        url.after('<span class="error-message">Please enter a valid endpoint URL.');
        isValid = false;
    }

    if (!isValidJson(css.val()))
    {
        css.addClass('error-field');
        css.after('<span class="error-message">Please enter all CSS attributes surrounded by quotes, separated by commas, with a colon between the attribute and value. (Ex. "color" : "blue", "width" : "10px")</span>');
        isValid = false;
    }
    
    return isValid;
}

function isValidJson(input) {
    const jsonString = `{${input}}`;

    try {
        JSON.parse(jsonString);
        return true;
    } catch (error) {
        return false;
    }
}

$(document).ready(function() {
    
    // Add event listeners to the input fields to trigger validation on change
    addOnInputChange('.validation', function() { validateForm() });

    $('#create-button').on('click', createButton);
    $('#destroy-button').on('click', destroyButton);
    $('#draggable-area').on('dblclick', uploadPicture);
    $('#draggable-area').on('click', selectButton);
    $('#submit').on('click', function() { if (validateForm()) updateConfig()});
    $('#upload-file').on('change', function() {
        uploadButtons(this.files);
    });
});

// Adds listeners to input in the provided namespace to the provided callback
function addOnInputChange(namespace = '', callback) {
    $('#button-text').on(('input' + namespace), callback);
    $('#button-width').on(('input' + namespace), callback);
    $('#button-height').on(('input' + namespace), callback);
    $('#button-border-style').on(('input' + namespace), callback);
    $('#button-border-radius').on(('input' + namespace), callback);
    $('#button-border-width').on(('input' + namespace), callback);
    $('#button-font').on(('input' + namespace), callback);
    $('#button-font-size').on(('input' + namespace), callback);
    $('#button-url-endpoint').on(('input' + namespace), callback);
    $('#button-css').on(('input' + namespace), callback);
    $('#button-color').on(('input' + namespace), callback);
    $('#button-background-color').on(('input' + namespace), callback);
}

// Removes listeners to input of the provided namespace
function removeOnInputChange(namespace = '') {
    $('#button-text').off('input' + namespace);
    $('#button-width').off('input' + namespace);
    $('#button-height').off('input' + namespace);
    $('#button-border-style').off('input' + namespace);
    $('#button-border-radius').off('input' + namespace);
    $('#button-border-width').off('input' + namespace);
    $('#button-font').off('input' + namespace);
    $('#button-font-size').off('input' + namespace);
    $('#button-url-endpoint').off('input' + namespace);
    $('#button-css').off('input' + namespace);
    $('#button-color').off('input' + namespace);
    $('#button-background-color').off('input' + namespace);
}

// Allows for uploading a config in case someone else made one you like
function uploadButtons(files) {
    if (files.length === 0) {
        console.log('No file selected.');
        return;
    }

    const file = files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        try {
            const content = e.target.result;
            
            // Parse the uploaded JSON file
            const uploadedButtons = JSON.parse(content);

            // Validate if the uploaded content is an array
            if (Array.isArray(uploadedButtons)) {
                loadButtonsArray(uploadedButtons);
                console.log('Buttons uploaded successfully.');
            } else {
                console.log('Invalid button data. Please upload a valid JSON file containing an array of buttons.');
            }
        } catch (error) {
            console.log('Error while parsing the uploaded file.', error);
        }
    };

    // Read the uploaded file as text
    reader.readAsText(file);
}

// Allows for uploading picture to the draggable area
function uploadPicture() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    fileInput.onchange = function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function() {
            const draggableArea = document.getElementById('draggable-area');
            draggableArea.style.backgroundImage = `url(${reader.result})`;
            draggableArea.style.backgroundSize = '100% 100%';
            draggableArea.style.backgroundPosition = 'center';
            draggableArea.style.backgroundRepeat = 'no-repeat';
        };
        reader.readAsDataURL(file);
    };

    fileInput.click();
}


