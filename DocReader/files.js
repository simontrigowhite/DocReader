// Code for files

var thisProgress;

function setUpFileInput(handleDocumentXml, progress) {

    thisProgress = progress;
    
    $("#byte_range").hide();
    $("#byte_content").hide();
    $("#cancel_read").hide();
    $("#progress_bar").hide();

    addClick($("cancel-read"), abortRead);

    if (!(window.File && window.FileReader && window.FileList && window.Blob))
        alert("The File APIs are not fully supported in this browser.");

    document.getElementById("files").addEventListener("change", handleFileSelectBrowse, false);

    var dropZone = document.getElementById("drop_zone");
    dropZone.addEventListener("drop", handleFileSelectDrop, false);
    dropZone.addEventListener("dragover", handleFileSelectDragOver, false);
}

function handleFileSelectBrowse(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    handleFile(evt.target.files, thisProgress);
}

function handleFileSelectDrop(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    handleFile(evt.dataTransfer.files, thisProgress);
}

function handleFileSelectDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = "copy";
}

function FileSummary(files) {
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
        output.push("<li><strong>", escape(f.name), "</strong> (", f.type || "n/a", ") - ",
            f.size, " bytes, last modified: ",
            f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : "n/a",
            "</li>");
    }
    return output.join("");
}

function handleFile(files) {
    
    document.getElementById("list").innerHTML = "<ul>" + FileSummary(files) + "</ul>";

    $("#xml_content").text("");
    readFiles(files);

}

function readFiles(files) {
    
    var file = files[0];
    readFile(file);
}

function getReader(file, start, stop, progress) {
    
    $("#cancel_read").show();
    $("#progress_bar").show();

    // Reset progress indicator on new file selection.
    progress.style.width = '0%';
    progress.textContent = '0%';

    var reader = new FileReader();
    reader.onerror = errorHandler;
    reader.onprogress = updateProgress;
    reader.onabort = function (e) {
        alert('File read cancelled');
    };
    reader.onloadstart = function (e) {
        document.getElementById('progress_bar').className = 'loading';
    };
    reader.onload = function (e) {
        progress.style.width = '100%';
        progress.textContent = '100%';
        setTimeout("document.getElementById('progress_bar').className='';", 2000);
    };

    // If we use onloadend, we need to check the readyState.
    reader.onloadend = function (evt) {
        if (evt.target.readyState == FileReader.DONE) {
            document.getElementById('byte_content').textContent = evt.target.result;
            document.getElementById('byte_range').textContent =
                ['Read bytes: ', start + 1, ' - ', stop + 1,
                 ' of ', file.size, ' byte file'].join('');

            //zippedContents = evt.target.result;

        }
    };
    return reader;
}

function readFile(file) {
    
    var start = 0;
    var stop = file.size - 1;

    $("#byte_range").show();
    $("#byte_content").show();

    var reader = getReader(file, start, stop, thisProgress);

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

function abortRead() {
    reader.abort();
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

function updateProgress(evt) {
    // evt is an ProgressEvent.
    if (evt.lengthComputable) {
        var percentLoaded = Math.round((evt.loaded / evt.total) * 100);
        // Increase the progress bar length.
        if (percentLoaded < 100) {
            thisProgress.style.width = percentLoaded + '%';
            thisProgress.textContent = percentLoaded + '%';
        }
    }
}
