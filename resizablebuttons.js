// $(document).ready(function() {
//     // Function to update button size and position based on screen size
//     function updateButtonSizeAndPosition() {
//         var screenWidth = $(window).width();
//         var screenHeight = $(window).height();

//         $('.custom-button').each(function() {
//             var button = $(this);
//             var curWidth = button.width();
//             var curHeight = button.height();
//             var curPosX = button.position().left;
//             var curPosY = button.position().top;

//             var widthPercentage = (curWidth / screenWidth) * 100;
//             var heightPercentage = (curHeight / screenHeight) * 100;
//             var posXPercentage = (curPosX / screenWidth) * 100;
//             var posYPercentage = (curPosY / screenHeight) * 100;

//             var buttonWidth = screenWidth * (widthPercentage / 100);
//             var buttonHeight = screenHeight * (heightPercentage / 100);
//             var buttonPosX = screenWidth * (posXPercentage / 100) - (buttonWidth / 2);
//             var buttonPosY = screenHeight * (posYPercentage / 100) - (buttonHeight / 2);

//             button.css({
//                 width: buttonWidth,
//                 height: buttonHeight,
//                 left: buttonPosX,
//                 top: buttonPosY
//             });
//         });
//     }

//     // Call the update function initially
//     updateButtonSizeAndPosition();

//     // Call the update function on window resize
//     $(window).resize(function() {
//         updateButtonSizeAndPosition();
//     });
// });
