const $ = require("jquery");
const Quill = require('quill');
require('./style.scss');

const loadWYSIWYG = function () {
    const options = {
        modules: {
            toolbar: [
                [{header: [1, 2, 3, 4, 5, false]}],
                ['bold', 'italic', 'underline', 'strike'],
                ['image', 'code-block'],
                ['link'],
                [{'list': 'ordered'}, {'list': 'bullet'}],
                ['clean']
            ]
        },
        placeholder: '...',
        theme: 'snow'  // or 'bubble'
    };

    let checkExistIntro = setInterval(function () {
        if ($("#intro").length) {
            clearInterval(checkExistIntro);

            var quill = new Quill('#intro', options);
            quill.enable(false);

            var toolbar = $('.ql-toolbar');
            toolbar.addClass('inactive');

            var onButton = $('#quill-on'),
                offButton = $('#quill-off');

            onButton.on('click', function () {
                toolbar.removeClass('inactive')
                quill.enable(true);
            });

            offButton.on('click', function () {
                toolbar.addClass('inactive');
                quill.enable(false);

                app.intro = getQuillHtml();
                updateHtmlOutput();
            });

            var getQuillHtml = function () {
                return quill.root.innerHTML;
            };

            var updateHtmlOutput = function () {
                app.ouput = $($(app.output)).find('#intro').html(getQuillHtml());
                console.log(app.output);
            };

            quill.on('text-change', function (delta, source) {
                updateHtmlOutput();
            });
        }
    }, 100);
}

module.exports = { loadWYSIWYG };