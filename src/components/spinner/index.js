require('./style.scss');

const spinner =
    '         <div id="rods-spinner">\n' +
    '            <div class="rods-spinner__circle rods-spinner__circle--c1"></div>\n' +
    '            <div class="rods-spinner__circle rods-spinner__circle--c2"></div>\n' +
    '            <div class="rods-spinner__circle rods-spinner__circle--c3"></div>\n' +
    '            <div class="rods-spinner__circle rods-spinner__circle--c4"></div>\n' +
    '        </div>';


var el = $(spinner);
el.addClass('rods-spinner--light-700');

$('body').append(el);

var on = function () {
    $('#rods-spinner').addClass('rods-spinner--on');
}
var off = function () {
    $('#rods-spinner').removeClass('rods-spinner--on');
}

module.exports = { on, off };