/**** STYLING ****/
import "./ods.css";
import "./style.scss";
import 'bootstrap/dist/css/bootstrap.min.css';

import "./components/drag-n-drop/style.scss";

/**** UTILS ****/
import $ from "jquery";
window.$ = $;
require('./utils');

/**** Global vars / setup / loading modules ****/
global.app = {};
app.datasetid = '';

app.filters = [];
app.metas = [];
app.recordTitle = '';

app.output = '';

const dnd = require('./components/drag-n-drop');

const ac = require("./components/dataset-search");
ac.loadAC(dnd);

const rendering = require('./components/rendering');


$("#refresh").on("click", function() {
    rendering.render();
    dnd.loadDnDInTemplate();
});

require('./components/export');


/*
var dummy = require('./components/dummy');
dummy.dummy_sub_function();
dummy.dummy_assign();
*/


$("#test").on("click", function() {

    const Quill = require('quill');

    var quill = new Quill($('.page-subtitle')[0], {
        modules: {
            toolbar: [
                [{ header: [1, 2, 3, 4, 5, 6,  false] }],
                ['bold', 'italic', 'underline','strike'],
                ['image', 'code-block'],
                ['link'],
                [{ 'script': 'sub'}, { 'script': 'super' }],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['clean']
            ]
        },
        placeholder: 'Compose an epic...',
        theme: 'snow'  // or 'bubble'
    });

    var getQuillHtml = function () { return quill.root.innerHTML; };

    var updateHtmlOutput = function ()
    {
        let html = getQuillHtml();
        console.log ( html );
        document.getElementById('output-html').innerText = html;
    };

    updateHtmlOutput();

    quill.on('text-change', function(delta, source) {
        updateHtmlOutput()
    });
});