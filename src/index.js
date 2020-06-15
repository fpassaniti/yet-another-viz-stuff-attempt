import "./normalize.css";
import "./ods.css";

import "./style.css";

var $ = require("jquery");

var datasetid = "";

const autoComplete = require("@tarekraafat/autocomplete.js/dist/js/autoComplete");

new autoComplete({
  data: {
    // Data src [Array, Function, Async] | (REQUIRED)
    src: async () => {
      const query = document.querySelector("#autoComplete").value;
      const source = await fetch(
        `https://data.opendatasoft.com/api/datasets/1.0/search/?q=${query}`
      );
      const data = await source.json();
      return data.datasets;
    },
    key: ["datasetid"],
    cache: false
  },
  placeHolder: "Search...", // Place Holder text                 | (Optional)
  threshold: 3, // Min. Chars length to start Engine | (Optional)
  debounce: 300, // Post duration for engine to start | (Optional)
  searchEngine: "strict", // Search Engine type/mode           | (Optional)
  maxResults: 10, // Max. number of rendered results | (Optional)
  resultsList: {
    render: true,
    container: function(source) {
      source.setAttribute("id", "autoComplete_list");
    },
    element: "ul",
    destination: document.querySelector("#autoComplete"),
    position: "afterend"
  },
  resultItem: {
    content: function(data, source) {
      source.innerHTML = data.value.metas.title;
    },
    element: "li"
  },
  noResults: () => {
    // Action script on noResults      | (Optional)
    const result = document.createElement("li");
    result.setAttribute("class", "no_result");
    result.setAttribute("tabindex", "1");
    result.innerHTML = "No Results";
    document.querySelector("#autoComplete_list").appendChild(result);
  },
  onSelection: feedback => {
    datasetid = feedback.selection.value.datasetid;
    document.querySelector(".selection").innerHTML = datasetid;
    document.querySelector("#autoComplete").value = "";
    // Change placeholder with the selected value
    document
      .querySelector("#autoComplete")
      .setAttribute("placeholder", feedback.selection.value.metas.title);

    var filters = document.getElementById("filters");
    filters.innerHTML = "";
    var availablefilters = document.getElementById("availablefilters");
    availablefilters.innerHTML = "";
    var metas = document.getElementById("metas");
    metas.innerHTML = "";
    var availablemetas = document.getElementById("availablemetas");
    availablemetas.innerHTML = "";
    
    feedback.selection.value.fields.forEach(function(field) {
      var li = document.createElement("li");
      li.className = "list-group-item list-group-item-action";
      li.id = field.name;
      li.innerText = field.label;
      
      availablemetas.append(li);
      
      if (field['annotations'] && field.annotations.length > 0) {
        field.annotations.forEach(function (annot) {
          if (annot.name.indexOf("facet") >= 0) {
            availablefilters.append(li.cloneNode(true));
          }
        });
      }
    });
    console.log(feedback);
  }
});

["focus", "blur"].forEach(function(eventType) {
  const resultsList = document.querySelector("#autoComplete_list");

  document
    .querySelector("#autoComplete")
    .addEventListener(eventType, function() {
      if (eventType === "blur") {
        resultsList.style.display = "none";
      } else if (eventType === "focus") {
        resultsList.style.display = "block";
      }
    });
});


const Sortable = require("sortablejs").Sortable;

var ulavailablemetas = document.getElementById("availablemetas");
var ulmetas = document.getElementById("metas");

var ulavailablefilters = document.getElementById("availablefilters");
var ulfilters = document.getElementById("filters");

new Sortable(ulavailablemetas, {
  group: "metas",
  pull: "clone",
  animation: 150
});
new Sortable(ulmetas, {
  group: "metas",
  animation: 150
});

new Sortable(ulavailablefilters, {
  group: "filters",
  pull: "clone",
  animation: 150
});
new Sortable(ulfilters, {
  group: "filters",
  animation: 150
});












/* RENDERING */

var Mustache = require("mustache");

var output = '';

$("#render").on("click", function() {
  var settings = {};

  settings["datasetid"] = datasetid;
  settings["view"] = document.getElementById("view").value;

  settings["filters"] = '';
  var tmpfilters = [];
  document.getElementById('filters').childNodes.forEach(function (child) {
    tmpfilters.push(child.id);
  });
  if (tmpfilters.length > 0)
    settings["filters"] = '[\'' + tmpfilters.join('\',\'') + '\']';
  else 
    settings["filters"] = '\'\'';
  
  settings["fields"] = '';
  var tmpfields = [];
  document.getElementById('metas').childNodes.forEach(function (child) {
    tmpfields.push(child.id);
  });
  settings["fields"] = '[\'' + tmpfields.join('\',\'') + '\']';
  
  $.get("templates/list-gen", function(templates) {
    var template = $(templates).html();
    var customTags = ["<%", "%>"];
    output = Mustache.render(template, settings, {}, customTags);

    console.log(output);

    var app = document.getElementById("app");
    var el = document.createElement("div");
    el.id = 'output';
    el.innerHTML = output;
    app.append(el);

    angular
      .element(app)
      .injector()
      .invoke(function($rootScope, $compile) {
        var res = $compile(el)($rootScope);
        console.log(res);
      });
  });
});


function copy() {
  var $temp = $("<textarea>");
  $("body").append($temp);
  $temp.val(output).select();
  document.execCommand("copy");
  $temp.remove();
}

$("#copy").on("click", copy);
