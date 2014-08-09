// TODO

// - add external css feature
// - improve GUI
// - improve client side js code
// - add user signin/signup/signout feature
// - saving system. save user's demo to mongodb. demo sharing system
// - user can upload their js/css/img/others files, in order to include them in the demo
// - support jade and markdown
// - support coffeescript
// - support sass/scss/less  // 5,6,7 convert the code in the client side if possible
// - add private demo
// - create a desktop/offline version, using nodewebkit/static file
// - add instant preview






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

    var libsArr = [];

    var localLibs = {
        jQuery: "/javascripts/jquery-2.1.1.min.js",
        Backbone: "/javascripts/backbone-min.js",
        Underscore: "/javascripts/underscore-min.js",
        Angular: "/javascripts/angular.min.js",
        Ember: "/javascripts/ember.min.js"
    };

    $(".run").on("click", function () {
        if (demoHtml.getValue() === "" && demoCss.getValue() === "" && demoJavascript.getValue() === "") {
            return false;
        }

        var iwindow = document.getElementsByClassName("editor-result")[0].contentWindow.document;

        $(iwindow.head).html("");
        $(iwindow.body).html("");

        var script = document.createElement("script");
        var style = document.createElement("style");
        script.appendChild(document.createTextNode(demoJavascript.getValue()));
        style.type = "text/css";
        style.appendChild(document.createTextNode(demoCss.getValue()));

        var i = 0;
        var responseData = [];

        var loadLibs = function (libs, callback) {
            $.ajax({
                url: libs,
                type: "GET",
                dataType: "html",
                crossDomain: true,
                success: function (data) {
                    i = i + 1;

                    try {
                        responseData.push(data);

                        if (i < libsArr.length) {
                            loadLibs(libsArr[i]);
                        } else {
                            insertScript();
                        }
                    } catch (err) {
                        alert(err);
                        console.log([err, responseData]);
                    }

                },
                error: function (xhr, status, err) {
                    console.log([status, err]);
                }
            });
        };

        var insertScript = function () {
            responseData.push(demoJavascript.getValue());
            $.each(responseData, function (index, data) {
                var s = document.createElement("script");
                s.appendChild(document.createTextNode(data));
                iwindow.body.appendChild(s);
            });
            iwindow.body.innerHTML = demoHtml.getValue();
            iwindow.head.appendChild(style);
        };

        if (libsArr.length === 0) {
            insertScript();
        } else {
            loadLibs(libsArr[0]);
        }

        return false;
    });

    $(".select-libs a").on("click", function () {
        var libName = $(this).data("lib");

        libsArr.push(localLibs[libName]);

        console.log(libsArr);

        var lib = $("<a href='javascript:;'></a>").addClass("list-group-item").html(libName);

        $(".libs-list").append(lib);
    });

    $(".libs-list").on("click", "a",  function () {
        var position = $(".libs-list a").index($(this));
        libsArr.splice(position, 1);

        console.log(libsArr);
        $(this).remove();
    });

    $(".add-external").on("click", function () {
        libsArr.push($(".external-lib").val());
        console.log(libsArr);

        var lib = $("<a href='javascript:;'></a>").addClass("list-group-item").html($(".external-lib").val());

        $(".libs-list").append(lib);
    });

    $(".editor-window").hover(function () {
        $(this).find(".editor-label").css({"opacity":"0.3"});
    }, function () {
        $(this).find(".editor-label").css({"opacity":"1"});
    });

})(jQuery, window);