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
                url : 'http://localhost:8080/button1',
                method : 'GET',
                data : {id:'111'},
                function : 'console.log("button 1      omg")',
            },
            {
                name : 2,
                width : 100,
                height : 100,
                posX : 500,
                posY : 5,
                url : 'http://localhost:8080/button2',
                method : 'GET',
                data : {id:'222'},
                function : 'console.log("button 2      omg")',
                css: '{"color": "red", "position": "absolute"}'
            },
        ]
    }

    console.log(buttons);

	// empty the container with the buttons
	$('#button-container').empty();

	console.log("JUST EMPTIED THE HOME PAGE");

    buttons.forEach(function(buttonDetails) {
        // Create the button element
        const $button = $('<button>').text(buttonDetails.name);
        $button.addClass('custom-button');
        $button.addClass('resizable-button');
        $button.css({
            width: buttonDetails.width + 'px',
            height: buttonDetails.height + 'px',
            position: 'absolute',
            left: buttonDetails.posX + 'px',
            top: buttonDetails.posY + 'px',
        });
        // overwrite stuff with what they request
        // $button.css(JSON.parse(buttonDetails.css));

        // Add an event listener to the button
        $button.on('click', function() {
            // Make the HTTP request based on the button attributes
            $.ajax({
                url: buttonDetails.url,
                method: buttonDetails.method,
                data: buttonDetails.data,
                success: function(response) {
                    eval(buttonDetails.function);
                    console.log('Button clicked:', response);
                    // Handle success response
                },
                error: function(error) {
                    console.error("Error:", error);
                    // Handle error response
                }
            });
        });

        $('#button-container').append($button);
    })
}