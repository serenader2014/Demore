var Demore = function () {

    if (this instanceof Demore) {

        this.options = {
            javascript: {
                lang: 'javascript',
                libs: []
            },

            html: {
                lang: 'html'
            },

            css: {
                lang: 'css',
                libs: []
            }
        };

        this.HTML = [];
        this.JAVASCRIPT = [];
        this.CSS = [];

    } else {
        return (new Demore()).init();
    }
};

Demore.localLibs = {
    jQuery: "/javascripts/jquery-2.1.1.min.js",
    Backbone: "/javascripts/backbone-min.js",
    Underscore: "/javascripts/underscore-min.js",
    Angular: "/javascripts/angular.min.js",
    Ember: "/javascripts/ember.min.js"
};

Demore.prototype = {

    init: function () {
        var self = this;

        this.aceHTML = ace.edit(self.css.htmlInput);
        this.aceCSS = ace.edit(self.css.cssInput);
        this.aceJAVASCRIPT = ace.edit(self.css.jsInput);
        var emmet = ace.require('ace/ext/emmet');
        var editors = [this.aceHTML, this.aceCSS, this.aceJAVASCRIPT];

        $.each(editors, function (index, e) {
            e.setTheme('ace/theme/monokai');
            e.setShowPrintMargin(false);
            e.getSession().setUseWrapMode(true);
            e.setFontSize(15);
            e.commands.addCommands([
            {
                name: 'run',
                bindKey: {win: 'Ctrl-S'},
                exec: function () {
                    $(self.css.convertBtn).trigger('click');
                }
            },
            {
                name: 'nextline',
                bindKey: {win: 'Ctrl-Enter'},
                exec: function (editor) {
                    editor.navigateLineEnd();
                    editor.insert('\n');
                }
            },
            {
                name: 'switchToNextEditor',
                bindKey: {win: 'Alt-Right'},
                exec: function (editor) {
                    editor.blur();
                    if (editors[index+1]) {
                        editors[index+1].focus();
                        if ($(editor.container).parents('.editor-window').hasClass('fs')) {
                            $(editor.container).parents('.editor-window').removeClass('fs');
                            $(editors[index+1].container).parents('.editor-window').addClass('fs');
                        }                        
                    } else {
                        editors[0].focus();
                        if ($(editor.container).parents('.editor-window').hasClass('fs')) {
                            $(editor.container).parents('.editor-window').removeClass('fs');
                            $(editors[0].container).parents('.editor-window').addClass('fs');
                        }                        
                    }
                }
            },
            {
                name: 'switchToPrevEditor',
                bindKey: {win: 'Alt-Left'},
                exec: function (editor) {
                    editor.blur();
                    if (editors[index-1]) {
                        editors[index-1].focus();
                        if ($(editor.container).parents('.editor-window').hasClass('fs')) {
                            $(editor.container).parents('.editor-window').removeClass('fs');
                            $(editors[index-1].container).parents('.editor-window').addClass('fs');
                        }
                    } else {
                        editors[editors.length-1].focus();
                        if ($(editor.container).parents('.editor-window').hasClass('fs')) {
                            $(editor.container).parents('.editor-window').removeClass('fs');
                            $(editors[editors.length-1].container).parents('.editor-window').addClass('fs');
                        }
                    }
                }
            },
            {
                name: 'fullScreen',
                bindKey: {win: 'F11'},
                exec: function (editor) {
                    if ($(editor.container).parents('.editor-window').hasClass('fs')) {
                        $(editor.container).parents('.editor-window').removeClass('fs');
                        // editor.resize();
                    } else {
                        $('.editor-window').removeClass('fs');
                        $(editor.container).parents('.editor-window').addClass('fs');
                        // editor.resize();
                    }
                }
            },
            {
                name: 'openOptions',
                bindKey: {win: 'Ctrl-Shift-Alt-O'},
                exec: function (editor) {
                    $(editor.container).prev().click();
                }
            },
            {
                name: 'resultFullScreen',
                bindKey: {win: 'Alt-F11'},
                exec: function (editor) {
                    if ($('.result').hasClass('fs')) {
                        $('.result').removeClass('fs');
                    } else {
                        $('.result').addClass('fs');
                    }
                }
            }
            ]);

            e.on('focus', function () {
                $(e.container).siblings('.editor-label').css({
                    opacity: 0.3
                });
            });
            e.on('blur', function () {
               $(e.container).siblings('.editor-label').css({
                    opacity: 1
                }); 
            });
        });
        this.aceHTML.getSession().setMode('ace/mode/html');
        this.aceHTML.setOption('enableEmmet', true);

        this.aceCSS.getSession().setMode('ace/mode/css');

        this.aceJAVASCRIPT.getSession().setMode('ace/mode/javascript');

        this.eventBinding();

        return this;
    },

    setLanguage: function (name, lang) {

        this.options[name].lang = lang || '' ;

        return this;

    },

    addLib: function (name, lib) {
        this.options[name].libs.push(lib);

        return this;
    },

    removeLib: function (name, index) {
        this.options[name].libs.splice(index, 1);

        return this;
    },

    updateUI: function (type) {
        var self = this;
        var containerId = '#' + type + '-setting';
        var container = $(containerId).find(self.css.libsList);

        container.html('');

        $.each(self.options[type].libs, function (index, lib) {
            var item = $('<a href="javascript:;">').addClass(self.css.libsListItem.substring(1)).html(lib);
            container.append(item);
        });

        return this;
    },

    run: function () {
        var self = this;

        self.HTML = [];
        self.CSS = [];
        self.JAVASCRIPT = [];

        self.loadExternal(function () {


            self.complieLanguage(function () {
                var css = self.CSS;
                var html = self.HTML;
                var js = self.JAVASCRIPT;

                var idocument = document.getElementsByClassName("editor-result")[0].contentWindow.document;

                idocument.body.innerHTML = html[0];

                css.forEach(function (c) {
                    var style = idocument.createElement('style');
                    style.innerHTML = c;
                    idocument.head.appendChild(style);
                });



                js.forEach(function (j) {
                    var script = idocument.createElement('script');
                    script.innerHTML = j;
                    idocument.body.appendChild(script);
                });

            });
        });
        
    },

    loadExternal: function (callback) {
        var self = this;

        if (self.options.css.libs.length === 0 && self.options.javascript.libs.length !== 0) {
            loadJS(callback);
            return ;
        } else if (self.options.css.libs.length !== 0 && self.options.javascript.libs.length === 0) {
            loadCSS(callback);

        } else if (self.options.css.libs.length === 0 && self.options.javascript.libs.length === 0) {
            callback();
        } else {
            loadCSS(function () {
                loadJS(callback);
            });
        }
         function loadCSS () {
            $.each(self.options.css.libs, function (idx, css) {
                $.ajax({
                    url: css,
                    type: 'GET',
                    dataType: 'html',
                    crossDomain: true,
                    success: function (d) {
                        self.CSS.push(d);

                        if (idx === self.options.css.libs.length - 1) {
                            callback();
                        }
                    },
                    error: function (err) {
                        alert('Cannot load external css file');
                        console.log(err);
                    }
                });
            });
        }

        function loadJS () {
            $.each(self.options.javascript.libs, function (index, url) {
                $.ajax({
                    url: url,
                    type: 'GET',
                    dataType: 'html',
                    crossDomain: true,
                    success: function (data) {
                        self.JAVASCRIPT.push(data);

                        if (index === self.options.javascript.libs.length - 1) {
                            callback();
                        }

                    },
                    error: function (err) {
                        alert('Cannot load external js file');
                        console.log(err);
                    }
                });
            });
        }

    },

    complieLanguage: function (callback) {
        var self = this;

        var htmlAreaValue = self.aceHTML.getValue();
        var cssAreaValue = self.aceCSS.getValue();
        var jsAreaValue = self.aceJAVASCRIPT.getValue();


        var finalType = [
            {
                type: self.options.html.lang,
                code: htmlAreaValue,
                compiled: 'html'
            },
            {
                type: self.options.css.lang,
                code: cssAreaValue,
                compiled: 'css'
            },
            {
                type: self.options.javascript.lang,
                code: jsAreaValue,
                compiled: 'javascript'
            }
        ];


        $.each(finalType, function (index, item) {
            $.ajax({
                url: '/compile',
                type: 'POST',
                data: {
                    name: item.type.toLowerCase(),
                    tmpl: item.code
                },
                success: function (data) {
                    if (data.err) {
                        alert(item.type.toUpperCase() + ' Compile error: ' + data.err);
                    }
                    self[data.compiled.toUpperCase()].push(data.code);

                    if (index === finalType.length - 1) {
                        callback();
                    } 
                    
                },
                error: function (err) {
                    alert('Cannot connet to server: ' + err);
                    return false;
                }
            });
        });        
    },

    css: {
        htmlInput: 'editor-html',
        cssInput: 'editor-css',
        jsInput: 'editor-javascript',
        resultIframe: '.editor-result',
        resultContainer: '.result',
        convertBtn: '.run',
        containers: '.editor-window',
        windowWrapper: '.window-wrapper',
        libsOptions: '.select-libs a',
        libsList: '.libs-list',
        libsListItem: '.list-group-item',
        addExternal: '.add-external',
        externalLib: '.external-lib',
        languageSelect: '.language-select a',
        editorLabel: '.editor-label'
    },

    eventBinding: function () {
        var css = this.css;
        var self = this;


        $(css.libsOptions).on('click', function () {
            console.log('select');
            var libName = $(this).data("lib");

            self.addLib('javascript', Demore.localLibs[libName]).updateUI('javascript');

        });

        $(css.addExternal).on('click', function () {
            var type = $(this).parents('.modal').attr('id').split('-')[0];
            var lib = $(this).parents('.modal').find(css.externalLib).val();

            self.addLib(type, lib).updateUI(type);
        });

        $(css.libsList).on('click', 'a', function () {
            var type = $(this).parents('.modal').attr('id').split('-')[0];
            var position = $(css.libsList).index($(this));

            self.removeLib(type, position).updateUI(type);
        });


        $(css.languageSelect).on('click', function () {
            var lang = $(this).data('lang');
            var type = $(this).parents('.modal').data('type');

            self.setLanguage(type, lang);

            $(this).siblings().removeClass('active').end().addClass('active');
            $('.'+type).find(css.editorLabel).find('span').html(lang);

            self['ace'+type.toUpperCase()].getSession().setMode({
                path: 'ace/mode/'+lang.toLowerCase(),
                v: Date.now()
            });

            $(this).parents('.modal').find('.modal-footer button').trigger('click');

        });


        $(css.convertBtn).on('click', function () {
            var iframe = $(self.css.resultIframe).detach();
            $(self.css.resultContainer).find(self.css.windowWrapper).append(iframe);
            self.run();
        });


        $('.fs-btn').on('click', function (event) {
            event.stopPropagation();
            if ($(this).parents('.editor-window').hasClass('fs')) {
                $(this).parents('.editor-window').removeClass('fs');
            } else {
                $('.editor-window').removeClass('fs');
                $(this).parents('.editor-window').addClass('fs');
            }
        });

        return this;
    }


};


var demore = Demore();