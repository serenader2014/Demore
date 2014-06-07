(function ($, window, undefined) {
    var demoHtml = CodeMirror.fromTextArea($(".editor-html")[0], {
            mode: "xml",
            lineNumbers: true,
            lineWrapping: true
        }),
        demoCss = CodeMirror.fromTextArea($(".editor-css")[0], {
            mode: "css",
            lineNumbers: true,
            lineWrapping: true
        }),
        demoJavascript = CodeMirror.fromTextArea($(".editor-javascript")[0], {
            mode: "javascript",
            lineNumbers: true,
            lineWrapping: true
        });

    $(".run").on("click", function () {
        if (demoHtml.getValue() === "" && demoCss.getValue() === "" && demoJavascript.getValue() === "") {
            return false;
        }
        var script = document.createElement("script");
        var style = document.createElement("style");
        script.appendChild(document.createTextNode(demoJavascript.getValue()));
        style.type = "text/css";
        style.appendChild(document.createTextNode(demoCss.getValue()));
        var iwindow = document.getElementsByClassName("editor-result")[0].contentWindow.document;
        iwindow.body.innerHTML = demoHtml.getValue();
        iwindow.body.appendChild(script);
        iwindow.head.appendChild(style);

        return false;
    });

    $(".editor-window").hover(function () {
        $(this).find(".editor-label").css({"opacity":"0.3"});
    }, function () {
        $(this).find(".editor-label").css({"opacity":"1"});
    });

})(jQuery, window);