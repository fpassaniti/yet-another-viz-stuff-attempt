const autoComplete = require("@tarekraafat/autocomplete.js/dist/js/autoComplete");

var dnd = require('../../components/drag-n-drop');
var rendering = require('../../components/rendering');


const loadAC = function (dnd) {
    app.ac = new autoComplete({
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
            container: function (source) {
                source.setAttribute("id", "autoComplete_list");
            },
            element: "ul",
            destination: document.querySelector("#autoComplete"),
            position: "afterend"
        },
        resultItem: {
            content: function (data, source) {
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
            app.datasetid = feedback.selection.value.datasetid;
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

            rendering.render();
            dnd.loadDnD(rendering);

            feedback.selection.value.fields.forEach(function (field) {
                var li = document.createElement("li");
                li.className = "field meta";
                li.id = field.name;
                li.innerText = field.label;

                /* For each field, create a meta */
                availablemetas.append(li);

                if (field['annotations'] && field.annotations.length > 0) {
                    let found = field.annotations.find(function (annotation) {
                        return annotation.name.indexOf("facet") >= 0;
                    });
                    if (found) {
                        let lif = li.cloneNode(true);
                        lif.className = "field filter";
                        availablefilters.append(lif);
                    }
                    // availablefilters.find("#" + field.id).length
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