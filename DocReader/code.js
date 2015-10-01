// Code - the functionality. Written in JavaScript language.


$(document).ready(runPage);


function handleDocumentXml(xmlContents) {
    $("#xml_content").text(xmlContents);
}

function runPage() {

    var progress = document.querySelector('.percent');

    setUpFileInput(handleDocumentXml, progress);

}
