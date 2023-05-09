var token, userId;
var buttons = [], selectedButton;

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

    if (!validateForm()) return;

    // Get the values from the form inputs
    var button = {};
    button.id = new Date().getTime();

    setButtonVal(button);
    buttons.push(button);

    updateButtons();

    addButtonToDropDown(button);
}

// Gets rid of the currently selected button
function destroyButton() {
    var id = $('#button-dropdown option:selected').attr('id');

    var index = buttons.findIndex(button => button.id == id);
    if (index !== -1) {
      buttons.splice(index, 1);
    }
    
    // Remove the currently selected option from the dropdown
    $('#button-dropdown option:selected').remove();

    updateButtons();
    selectButton();
}

function addButtonToDropDown(button)
{
    $('#button-dropdown').append(`<option id="${button.id}" value="${button.id}">${button.name}</option>`);
    selectButton(button);
}

// Function to find a button by its ID
function findButtonById(id) {
    return buttons.find(button => button.id == id);
}

function editButton() {
    const editButton = $('#edit-button');
    const createButton = $('#create-button');
    const buttonDropDown = $('#button-dropdown');
    const destroyButton = $('#destroy-button');
    const id = $('#button-dropdown option:selected').attr('id');
    const selectedButton = findButtonById(id);

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
        
        removeOnInputChange('.edit');

        updateButtons();
        selectButton();
    // Edit button was pressed, toggle to save mode
    } else {
        populateFields(selectedButton);

        // Add edit mode class and update button text
        editButton.addClass('edit-mode');
        editButton.text('Save Button');

        destroyButton.hide();
        createButton.hide();
        buttonDropDown.hide();
        
        addOnInputChange('.edit', function() {
            setButtonVal(selectedButton); 
            updateButtons();
        })
    }
}

function selectButton(buttonData = undefined) {
    if (buttonData) 
        $('#button-dropdown option[id="' + buttonData.id + '"]').prop('selected', true);            
    
    const id = $('#button-dropdown option:selected').attr('id');

    if (selectedButton) selectedButton.removeClass('highlight');
    
    $('.custom-button').each(function() {
        var buttonId = $(this).data('buttonData').id;

        if (buttonId == id) 
            selectedButton = $(this)
      });
    
    if (selectedButton) selectedButton.addClass('highlight');
}

  
function setButtonVal(button)
{
    button.name = $('#button-name').val();
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
    button.url = $('#button-url').val();
    button.method = $('#button-method').val();
    button.css = '{' + $('#button-css').val() + '}';
}

function populateFields(button)
{
    $('#button-name').val(button.name);
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
    $('#button-url').val(button.url);
    $('#button-method').val(button.method);
    $('#button-css').val(button.css.slice(1, -1));
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

    // Update the dropdown options
    buttons.forEach((button) => {
        addButtonToDropDown(button);
    });
}

function updateConfig(){
    updateButtons();
    console.log('in set')
    console.log(buttons)
    console.log(typeof buttons)
    console.log(JSON.stringify(buttons))
    twitch.configuration.set("broadcaster", "1", JSON.stringify(buttons))
    console.log("has it been set?")
    console.log(twitch.configuration.broadcaster.content)
}

function validateForm() {
    const name = $('#button-name');
    const width = $('#button-width');
    const height = $('#button-height');
    const borderRadius = $('#button-border-radius');
    const borderWidth = $('#button-border-width');
    const font = $('#button-font');
    const fontSize = $('#button-font-size');
    const url = $('#button-url');
    const css = $('#button-css');

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

    if (!isValidJson(css.val()))
    {
        css.addClass('error-field');
        css.after('<span class="error-message">Please enter all CSS attributes as separated by commas, with a colon between the attribute and value.</span>');
        isValid = false;
    }
    
    return isValid;
}

function isValidObjectLiteral(str) {
    // Define the regular expression pattern to match object literal syntax
    const objectLiteralPattern = /^\s*\{[\s\S]*\}\s*$/;

    // Test if the string matches the object literal pattern
    return objectLiteralPattern.test(str);
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

    validateForm();
});

function addOnInputChange(namespace = '', callback) {
    $('#button-name').on(('input' + namespace), callback);
    $('#button-text').on(('input' + namespace), callback);
    $('#button-width').on(('input' + namespace), callback);
    $('#button-height').on(('input' + namespace), callback);
    $('#button-border-style').on(('input' + namespace), callback);
    $('#button-border-radius').on(('input' + namespace), callback);
    $('#button-border-width').on(('input' + namespace), callback);
    $('#button-font').on(('input' + namespace), callback);
    $('#button-font-size').on(('input' + namespace), callback);
    $('#button-url').on(('input' + namespace), callback);
    $('#button-css').on(('input' + namespace), callback);
    $('#button-color').on(('input' + namespace), callback);
    $('#button-background-color').on(('input' + namespace), callback);
}

function removeOnInputChange(namespace = '') {
    $('#button-name').off('input' + namespace);
    $('#button-text').off('input' + namespace);
    $('#button-width').off('input' + namespace);
    $('#button-height').off('input' + namespace);
    $('#button-border-style').off('input' + namespace);
    $('#button-border-radius').off('input' + namespace);
    $('#button-border-width').off('input' + namespace);
    $('#button-font').off('input' + namespace);
    $('#button-font-size').off('input' + namespace);
    $('#button-url').off('input' + namespace);
    $('#button-css').off('input' + namespace);
    $('#button-color').off('input' + namespace);
    $('#button-background-color').off('input' + namespace);
}

function downloadButtons() {
    // Convert the buttons array to JSON string
    const jsonButtons = JSON.stringify(buttons);
    
    // Create a download link
    const link = document.createElement('a');
    link.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(jsonButtons);
    link.download = 'buttons.json';
    
    // Trigger the download
    link.click();
}

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