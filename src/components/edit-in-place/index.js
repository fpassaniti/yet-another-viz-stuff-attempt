const $ = require('jquery');
require('./style.scss');

const loadEIP = function (rendering) {
    var validate = function (a, input) {
        console.log('validate');
        var newValue = input.val();
        a.html(newValue || "Nom du bouton (éditer)");
        rendering.renderUpdate('fieldLinkLabel', newValue);
        input.remove();
    };

    var editListener = function (event) {
        event.preventDefault();

        var a = $(this);
        var previousText = a.text();
        var input = $('<input type="text" value />');
        input.val($.trim(previousText));
        input.on('keydown', function (event) {
            if (event.which == 13 || event.keyCode == 13) {
                validate(a, input);
            }
        });
        input.insertAfter(a);
        input.select();
        input.on('blur', function () {
            if (a.parent().find('input').length && !a.is(':focus')) {
                validate(a, input);
            }
        });
    };

    let checkExistMetas = setInterval(function () {
        if ($(".content-card-button a").first()[0] != app.editinplace['button']) {
            console.log('rebind EIP');
            var button = $(".content-card-button a").first();
            button.on('click', editListener);
            app.editinplace['button'] = $(".content-card-button a").first()[0];
        }
    }, 100); // check every 100ms
    console.log('EIP loaded');
}


module.exports = {loadEIP};