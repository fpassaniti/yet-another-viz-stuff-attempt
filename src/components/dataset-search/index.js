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
        app.datasetid = feedback.selection.value.datasetid;
        document.querySelector(".selection").innerHTML = app.datasetid;
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
