function updateButtons() {
    if (buttons.length == 0)
    {
        console.log("buttons empty");
        buttons = [
            {
                name : 1,
                width : 100,
                height : 50,
                posX : 10,
                posY : 10,
                borderStyle: 'solid',
                borderRadius: 5,
                borderWidth: 5,
                font: 'Ariel',
                fontSize: 20,
                color: '#ffff00',
                backgroundColor: '#0f630f',
                url : 'http://localhost:8080/button1',
                method : 'GET',
                data : '{id:userId}',
                function : 'console.log("button 1      omg")',
            },
            {
                name : 2,
                width : 100,
                height : 100,
                posX : 500,
                posY : 5,
                borderStyle: 'solid',
                borderRadius: 20,
                borderWidth: 2,
                font: 'Ariel',
                fontSize: 16,
                color: '#ff0000',
                backgroundColor: '#0063ff',
                url : 'http://localhost:8080/button2',
                method : 'GET',
                data : '{id:userId}',
                function : 'console.log("button 2      omg")',
                css: '{"color": "red", "position": "absolute"}'
            },
            {
                name : 3,
                width : 350,
                height : 500,
                posX : 1000,
                posY : 500,
                borderStyle: 'solid',
                borderRadius: 20,
                borderWidth: 2,
                font: 'Ariel',
                fontSize: 16,
                color: '#ff00ff',
                backgroundColor: '#f063af',
                url : 'http://localhost:8080/button2',
                method : 'GET',
                data : '{id:userId}',
                function : 'console.log("button 2      omg")',
                css: '{"color": "red", "position": "absolute"}'
            },
        ]
    }

    console.log(buttons);

	// empty the container with the buttons
	$('#button-container').empty();

	console.log("JUST EMPTIED THE HOME PAGE");

    buttons.forEach(function(buttonData) {
        // Create the button element
        const $button = $('<button>').text(buttonData.name);
        $button.addClass('custom-button');
        $button.addClass('resizable-button');
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
        });
        
        // Add an event listener to the button
        $button.on('click', function() {
            // Make the HTTP request based on the button attributes
            $.ajax({
                url: buttonData.url,
                method: buttonData.method,
                data: eval('(' + buttonData.data + ')'),
                success: function(response) {
                    eval(buttonData.function);
                    console.log('Button clicked:', response);
                    // Handle success response
                },
                error: function(error) {
                    console.error("Error:", error);
                    // Handle error response
                }
            });
        });

        $button.data('buttonData', buttonData);

        $('#button-container').append($button);
    })
}