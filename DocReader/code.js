// Code for the quiz - the functionality. Written in JavaScript language.


$(document).ready(runPage);


function runPage() {

    setUpFileInput();
    
    setupQuestion( {
        trueButton: $("#trueButton"),
        falseButton: $("#falseButton"),
        submitButton: $("#submitButton"),
        
        nextBit: $("#question2"),
        cookieName: "answeredQ1"
    } );

    setupQuestion( {
        trueButton: $("#trueButto"),
        falseButton: $("#falseButto"),
        submitButton: $("#submitButto"),
        
        nextBit: $("#question3"),
        cookieName: "answeredQ2"
    } );

    addClick($("#startAgain"), startAgainClick);
}


function setupQuestion(elements) {

    selectTrueOrFalse();

    if (getCookie(elements.cookieName)) 
        elements.submitButton.hide();

    else {
        elements.submitButton.show();

        addClick(elements.trueButton, trueClick);
        addClick(elements.falseButton, falseClick);

        elements.nextBit.hide();
    }

    function trueClick() {

        elements.trueButton.addClass("selected");
        elements.falseButton.removeClass("selected");

        addClick(elements.submitButton, submitClick);
    }

    function falseClick() {

        elements.trueButton.removeClass("selected");
        elements.falseButton.addClass("selected");

        addClick(elements.submitButton, submitClick);
    }

    function submitClick() {

        rememberTrueOrFalse();
        
        removeClick(elements.trueButton);
        removeClick(elements.falseButton);
        removeClick(elements.submitButton);

        elements.submitButton.hide();

        elements.nextBit.show("slow");
    }
    
    function selectTrueOrFalse() {

        if (getCookie(elements.cookieName) == "true") {
            elements.trueButton.addClass("selected");
            elements.falseButton.removeClass("selected");
        }
        else if (getCookie(elements.cookieName) == "false") {
            elements.trueButton.removeClass("selected");
            elements.falseButton.addClass("selected");
        }
        else {
            elements.trueButton.removeClass("selected");
            elements.falseButton.removeClass("selected");
            removeClick(elements.submitButton);
        }
    }

    function rememberTrueOrFalse() {
        
        if (elements.trueButton.hasClass("selected"))
            setCookie(elements.cookieName, "true");

        else if (elements.falseButton.hasClass("selected"))
            setCookie(elements.cookieName, "false");
    }
}


function startAgainClick() {

    resetCookie("answeredQ1");
    resetCookie("answeredQ2");

    runPage();
}
