const autoComplete = require("@tarekraafat/autocomplete.js/dist/js/autoComplete");

var dnd = require('../../components/drag-n-drop');
var rendering = require('../../components/rendering');
const wysiwyg = require('../../components/wysiwyg');
const editinplace = require('../../components/edit-in-place');

const loadAC = function (dnd, reset) {
    app.ac = new autoComplete({
        data: {
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
        threshold: 0, // Min. Chars length to start Engine | (Optional)
        debounce: 300, // Post duration for engine to start | (Optional)
        searchEngine: function(query,record) { return true }, //"loose", // Search Engine type/mode           | (Optional)
        maxResults: 10, // Max. number of rendered results | (Optional)
        resultsList: {
            render: true,
            container: function (source) {
                source.setAttribute("id", "autoComplete_list");
            },
            element: "ul",
            destination: document.querySelector("#autoComplete"),
            position: "afterend"
        },
        resultItem: {
            content: function (data, source) {
                source.innerHTML = data.value.metas.title + ' (' + data.value.metas.source_domain_title + ')';
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
            reset();

            app.datasetid = feedback.selection.value.datasetid;
            app.title = feedback.selection.value.metas.title;
            app.description = feedback.selection.value.metas.description;

            document.querySelector(".selection").innerHTML = app.datasetid;
            document.querySelector("#autoComplete").value = "";
            // Change placeholder with the selected value
            document
                .querySelector("#autoComplete")
                .setAttribute("placeholder", feedback.selection.value.metas.title);

            var availablefilters = $("#availablefilters");
            availablefilters.html("");
            var availablemetas = $("#availablemetas");
            availablemetas.html("");
            var availableimages = $("#availableimages");
            availableimages.html("");

            rendering.renderInit();
            dnd.loadDnD(rendering);
            wysiwyg.loadWYSIWYG();
            editinplace.loadEIP(rendering);

            feedback.selection.value.fields.forEach(function (field) {
                var li = document.createElement("li");
                li.className = "field meta";
                li.id = field.name;
                li.innerText = field.label;

                availablemetas.append(li);

                if (field['annotations'] && field.annotations.length > 0) {
                    let facet = field.annotations.find(function (annotation) {
                        return annotation.name.indexOf("facet") >= 0;
                    });
                    if (facet) {
                        let licopy = li.cloneNode(true);
                        licopy.className = "field filter";
                        availablefilters.append(licopy);
                    }

                    let image = field.annotations.find(function (annotation) {
                        return annotation.name.indexOf("has_thumbnails") >= 0;
                    });
                    if (image) {
                        let licopy = li.cloneNode(true);
                        licopy.className = "field image";
                        availableimages.append(licopy);
                    }
                }
            });
        }
    });

    ["focus", "blur"].forEach(function (eventType) {
        const resultsList = document.querySelector("#autoComplete_list");

        document
            .querySelector("#autoComplete")
            .addEventListener(eventType, function () {
                if (eventType === "blur") {
                    resultsList.style.display = "none";
                } else if (eventType === "focus") {
                    resultsList.style.display = "block";
                }
            });
    });
};


module.exports = {loadAC};