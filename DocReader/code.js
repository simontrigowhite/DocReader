// Code - the functionality. Written in JavaScript language.


$(document).ready(runPage);


function handleSummary(summary) {
    $("#byte_range").text(summary);
    $("#cancel_read").hide();
}

function handleText(textContents) {
    $("#byte_content").text(textContents);
}

function handleDocumentXml(xmlContents) {
    $("#xml_content").text(xmlContents);
}

function runPage() {

    var progress = $("#progress_bar");

    setUpFileInput(handleText, handleDocumentXml, progress);

}
