// Code for files

function setUpFileInput(clearThem, handleList, handleText, handleDocumentXml) {

    var reader;
    
    var progress = $("#progress_bar");
    var cancelRead = $("#cancel_read");
    
    cancelRead.hide();
    progress.hide();

    addClick(cancelRead, abortRead);

    if (!(window.File && window.FileReader && window.FileList && window.Blob))
        alert("The File APIs are not fully supported in this browser.");

    document.getElementById("files").addEventListener("change", handleFileSelectBrowse, false);

    var dropZone = document.getElementById("drop_zone");
    dropZone.addEventListener("drop", handleFileSelectDrop, false);
    dropZone.addEventListener("dragover", handleFileSelectDragOver, false);
    
    function handleFileSelectBrowse(evt) {
        evt.stopPropagation();
        evt.preventDefault();

        handleFile(evt.target.files, progress);
    }

    function handleFileSelectDrop(evt) {
        evt.stopPropagation();
        evt.preventDefault();

        handleFile(evt.dataTransfer.files, progress);
    }

    function handleFileSelectDragOver(evt) {
        evt.stopPropagation();
        evt.preventDefault();
        evt.dataTransfer.dropEffect = "copy";
    }

    function handleFile(files) {

        handleList(fileSummary(files));

        cancelRead.show();
        progress.show();

        clearThem();
        
        readFiles(files);
    }

    function readFiles(files) {

        var file = files[0];
        readFile(file);
    }

    function readFile(file) {

        var start = 0;
        var stop = file.size - 1;

        reader = getReader(file, start, stop, progress);

        var blob = file.slice(start, stop + 1);
        reader.readAsBinaryString(blob);

        zip.createReader(new zip.BlobReader(blob), function (reader) {

            // get all entries from the zip
            reader.getEntries(function (entries) {
                if (entries.length) {

                    for (var i = 0; i < entries.length; i++) {
                        var entry = entries[i];

                        if (entry.filename == "word/document.xml") {
                            entry.getData(new zip.TextWriter(), function (text) {
                                // text contains the entry data as a String
                                handleDocumentXml(text);

                                // close the zip reader
                                reader.close(function () {
                                    // onclose callback
                                });

                            }, function (current, total) {
                                // onprogress callback
                            });
                        }
                    }
                }
            });
        }, function (error) {
            // onerror callback
        });
    }


    function getReader(file, start, stop) {

        // Reset progress indicator on new file selection.
        progress.css("width: 0%;");
        progress.text('0%');

        var newReader = new FileReader();
        newReader.onerror = errorHandler;
        newReader.onprogress = updateProgress;
        newReader.onabort = function (e) {
            alert('File read cancelled');
        };
        newReader.onloadstart = function (e) {
            progress.addClass('loading');
        };
        newReader.onload = function (e) {
            progress.css("width: 100%;");
            progress.text('100%');
            var progressId = progress.attr("id");
            setTimeout("document.getElementById('progress_bar').className='';", 2000);
        };

        // If we use onloadend, we need to check the readyState.
        newReader.onloadend = function (evt) {
            if (evt.target.readyState == FileReader.DONE) {
                handleText(evt.target.result);
                handleSummary(['Read bytes: ', start + 1, ' - ', stop + 1,
                     ' of ', file.size, ' byte file'].join(''));

                cancelRead.hide();
            }
        };
        return newReader;
    }

    function abortRead() {
        reader.abort();
    }

    function updateProgress(evt) {
        // evt is an ProgressEvent.
        if (evt.lengthComputable) {
            var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
            // Increase the progress bar length.
            if (percentLoaded < 100) {
                progress.css("width: " + percentLoaded + "%;");
                progress.text(percentLoaded + "%");
            }
        }
    }

    function errorHandler(evt) {
        switch (evt.target.error.code) {
            case evt.target.error.NOT_FOUND_ERR:
                alert('File Not Found!');
                break;
            case evt.target.error.NOT_READABLE_ERR:
                alert('File is not readable');
                break;
            case evt.target.error.ABORT_ERR:
                break; // noop
            default:
                alert('An error occurred reading this file.');
        };
    }
}



function fileSummary(files) {
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
        output.push("<li><strong>", escape(f.name), "</strong> (", f.type || "n/a", ") - ",
            f.size, " bytes, last modified: ",
            f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : "n/a",
            "</li>");
    }
    return "<ul>" + output.join("") + "</ul>";
}
