// Code - the functionality. Written in JavaScript language.


$(document).ready(runPage);

function runPage() {

    $("#byte_range").hide();
    $("#byte_content").hide();

    setUpFileInput(handleStartReadFile, handleList, handleText, handleDocumentXml);
}

function handleStartReadFile() {
    $("#xml_content").text("");

    $("#byte_range").show();
    $("#byte_range").text("");

    $("#byte_content").show();
    $("#byte_content").text("");
}

function handleList(list) {
    $("#list").html(list);
}

function handleSummary(summary) {
    $("#byte_range").text(summary);
}

function handleText(textContents) {
    $("#byte_content").text(textContents);
}

function handleDocumentXml(xmlContents) {
    $("#xml_content").text(xmlContents);
}
