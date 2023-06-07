// This is the width of the draggable area in config.html
var targetWidth = 640;

$(document).ready(function() {
    $(window).on('resize', function() { resizeButtons() } );
}) 

function resizeButtons() {
    // Will always be 16:9, so we only need to consider one dimension
    const windowWidth = $(window).width();
    const scale = windowWidth / targetWidth;

    // Iterate over each button
    $('.custom-button').each(function() {
        // Get the current button position and size
        const buttonLeft = parseFloat($(this).data('buttonData').posX);
        const buttonTop = parseFloat($(this).data('buttonData').posY);
        const buttonWidth = parseFloat($(this).data('buttonData').width);
        const buttonHeight = parseFloat($(this).data('buttonData').height);
        const buttonBorderRadius = parseFloat($(this).data('buttonData').borderRadius);
        const buttonBorderWidth = parseFloat($(this).data('buttonData').borderWidth);
        const buttonFontSize = parseFloat($(this).data('buttonData').fontSize);
        
        // Calculate the new button position/height based on the scale factor
        const newButtonLeft = scale * buttonLeft;
        const newButtonTop = scale * buttonTop;
        const newButtonWidth = scale * buttonWidth;
        const newButtonHeight = scale * buttonHeight;
        const newButtonBorderRadius = scale * buttonBorderRadius;
        const newButtonBorderWidth = scale * buttonBorderWidth;
        const newButtonFontSize = scale * buttonFontSize;

        // Set the new button position
        $(this).css({
            left : newButtonLeft + 'px',
            top : newButtonTop + 'px',
            width: newButtonWidth + 'px',
            height: newButtonHeight + 'px',
            borderRadius: newButtonBorderRadius + 'px',
            borderWidth: newButtonBorderWidth + 'px',
            fontSize: newButtonFontSize + 'px',
        });
    });
}