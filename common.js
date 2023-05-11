var buttons = [];

function updateButtons(configMode = true) {
    // empty the container with the buttons
    if (configMode) {
        $('#draggable-area').empty();
        $("#download-textarea").val(JSON.stringify(buttons));
    } else {
	    $('#button-container').empty();
    }
    
    buttons.forEach(function(buttonData) {
        buttonData["userId"] = userId;

        console.log(buttonData);
        
        // Create the button element
        const $button = $('<button>').text(buttonData.text);
        $button.data('buttonData', buttonData);
        $button.addClass('custom-button');
        $button.addClass('resizable-button');
        
        function updateData() {
            $button.css({
                width: buttonData.width + 'px',
                height: buttonData.height + 'px',
                position: 'absolute',
                left: buttonData.posX + 'px',
                top: buttonData.posY + 'px',
                borderStyle: buttonData.borderStyle,
                borderRadius: buttonData.borderRadius + 'px',
                borderWidth: buttonData.borderWidth + 'px',
                font: buttonData.font,
                fontSize: buttonData.fontSize + 'px',
                color: buttonData.color,
                backgroundColor: buttonData.backgroundColor,
                'word-wrap': 'break-word', 
                'border-color': buttonData.color
            });
    
            // overwrite with provided custom css
            const parsedObject = JSON.parse(buttonData.css);
            $.each(parsedObject, function(property, value) {
                $button.css(property, value);
            });

            // set the text
            $button.text(buttonData.text);

            // make sure the buttons stay in the same spot regardless of video size
            if (!configMode) resizeButtons();
        }

        // draggable when in the configuration
        if (configMode) {       
            $($button).draggable({
                cancel:false,
                containment: 'parent',
                stop: function() {
                    // Get the button's position relative to the draggable area
                    var offset = $button.offset();
                    var xPos = offset.left - $button.parent().offset().left;
                    var yPos = offset.top - $button.parent().offset().top;

                    var _button = findButtonById(buttonData.id);
                    _button.posX = xPos;
                    _button.posY = yPos;

                    updateData();
                }
            })
        }
        

        // Add an event listener to the button
        $button.on('click', function(event) {
            event.stopPropagation(); // Prevent clicking the draggable area

            // only use the buttons if the checkbox on config.html is selected
            if (!configMode || $("#click-check-box").is(':checked'))
            {
                const info = {}
                if (buttonData.method == "POST") {
                    info.data = JSON.stringify(buttonData);
                    info.contentType = "application/json; charset=utf-8";
                } else 
                    info.data = buttonData;
                    
                console.log("INFO: ",info);
    
                // Make the HTTP request based on the button attributes
                $.ajax({
                    url: buttonData.url,
                    method: buttonData.method,
                    data: info.data,
                    contentType: info.contentType,
                    success: function(response) {
                        if (typeof response === 'object') {
                            // set the values to what was provided
                            $.each(response, function(property, value) {
                                buttonData[property] = value;
                            })
        
                            // actually change the button
                            updateData();
                        }
                    },
                    error: function(error) {
                        console.error("Error when clicking button:", error);
                    }
                });
            }

            // only select when not editing a button
            if (configMode && !$('#edit-button').hasClass("edit-mode")) 
                selectButton(buttonData);
        });

        if (configMode)
            $('#draggable-area').append($button);
        else
            $('#button-container').append($button);

        updateData();
    })
}
