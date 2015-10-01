// Useful functions


// Code for cookies - actually uses local storage instead of cookies, because it is more modern

function setCookie(name, value) {
    localStorage.setItem(name, value);
}

function getCookie(name) {
    return localStorage.getItem(name);
}

function resetCookie(name) {
    localStorage.removeItem(name);
}


// Other code

function addClick(element, action) {
    element.click(action);
    element.css( { "cursor": "hand" } );
}

function removeClick(element) {
    element.off("click");
    element.css( { "cursor": "inherit" });
}


