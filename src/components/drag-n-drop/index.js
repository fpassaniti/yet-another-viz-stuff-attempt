const $ = require("jquery");

const Sortable = require("sortablejs").Sortable;

var imgdropzoneleft = $("<div id=\"content-card-img-dropzone-left\"></div>"),
    imgdropzonetop  = $("<div id=\"content-card-img-dropzone-top\"></div>");

const loadDnD = function(rendering) {

    var ulavailablemetas = document.getElementById("availablemetas");
    var ulavailablefilters = document.getElementById("availablefilters");
    var ulavailableimages = document.getElementById("availableimages");

    app.sortable['metapick'] = new Sortable(ulavailablemetas, {
        group: { name: "metas", pull: "clone", put: false},
        animation: 350,
        onStart: function (evt) {
            if (app.metas.indexOf(evt.item.id) < 0) {
                $("#content-card-fields").first().addClass("dnd__dropzone");
            }
            if (app.recordTitle.length <= 0) {
                $('.content-card-title').first().addClass("dnd__dropzone");
            }
        },
        onEnd: function (evt) {
            $("#content-card-fields").first().removeClass("dnd__dropzone");
            $('.content-card-title').first().removeClass("dnd__dropzone");
        }
    });

    app.sortable['filterpick'] = new Sortable(ulavailablefilters, {
        group: { name: "filters", pull: "clone", put: false},
        pull: "clone",
        animation: 350,
        onStart: function (evt) {
            if (app.filters.indexOf(evt.item.id) < 0) {
                $("#filter-list").addClass("dnd__dropzone");
            }
        },
        onEnd: function (evt) {
            $("#filter-list").removeClass("dnd__dropzone");
        }
    });

    app.sortable['imagepick'] = new Sortable(ulavailableimages, {
        group: { name: "images", pull: "clone", put: false},
        animation: 350,
        onStart: function (evt) {
            if (app.image.length <= 0) {
                $('.cards-view .content-card').first().append(imgdropzoneleft);
                $('.cards-view .content-card').first().append(imgdropzonetop);
            }
        },
        onEnd: function (evt) {
            if ($('.cards-view .content-card').first().find(imgdropzoneleft).length > 0) {
                imgdropzoneleft.detach();
            }
            if ($('.cards-view .content-card').first().find(imgdropzonetop).length > 0) {
                imgdropzonetop.detach();
            }
        }
    });

    app.sortable['imagedropleft'] = new Sortable(imgdropzoneleft[0], {
        group: "images",
        animation: 350,
        onMove: function(evt) {
            if (app.image.length > 0) {
                return false;
            }
        },
        onAdd: function (evt) {
            console.log('New image drop : ' + evt.item.id);
            // let img = $(".content-card-img");
            if (imgdropzoneleft[0] === evt.to && app.image.length <= 0) {
                app.image = evt.item.id;
                rendering.renderUpdate('imagePosition','left');
                rendering.renderUpdate('fieldPhoto',app.image);
                console.debug('new image: ' + app.image);
            }
            evt.item.parentNode.removeChild(evt.item);
            /*loadDnDInTemplate(rendering);*/
        }
    });

    app.sortable['imagedroptop'] = new Sortable(imgdropzonetop[0], {
        group: "images",
        animation: 350,
        onMove: function(evt) {
            if (app.image.length > 0) {
                return false;
            }
        },
        onAdd: function (evt) {
            console.log('New image drop : ' + evt.item.id);
            // let img = $(".content-card-img");
            if (imgdropzonetop[0] === evt.to && app.image.length <= 0) {
                app.image = evt.item.id;
                rendering.renderUpdate('imagePosition','top');
                rendering.renderUpdate('fieldPhoto',app.image);
                console.debug('new image: ' + app.image);
            }
            evt.item.parentNode.removeChild(evt.item);
            /*loadDnDInTemplate(rendering);*/
        }
    });

    loadDnDInTemplate(rendering);
};

const loadDnDInTemplate = function(rendering) {
    console.debug('reload DnD in template');
    let checkExistFilters = setInterval(function () {
        if ($("#filter-list").length) {
            clearInterval(checkExistFilters);

            var ulfilterlistdrop = document.getElementById("filter-list");
            app.sortable['filterdrop'] = new Sortable(ulfilterlistdrop, {
                group: "filters",
                animation: 350,
                onEnd: function (evt) {
                    /* reordering */
                    if (evt.from == evt.to) {
                        app.filters.move(evt.oldIndex, evt.newIndex);
                    }
                    loadDnDInTemplate(rendering);
                },
                onAdd: function (evt) {
                    console.log('New filter drop : ' + evt.item.id);
                    let filterlist = $("#filter-list");
                    if (filterlist[0] === evt.to && app.filters.indexOf(evt.item.id) < 0) {
                        app.filters.splice(evt.newIndex, 0, evt.item.id);
                        rendering.renderUpdate('filters',app.filters);
                        console.debug('new filters: ' + app.filters);
                    }
                    evt.item.parentNode.removeChild(evt.item);
                    loadDnDInTemplate(rendering);
                }
            });
        }
    }, 100); // check every 100ms

    let checkExistMetas = setInterval(function () {
        if ($("#content-card-fields").length && (!('metadrop' in app.sortable) || (app.sortable['metadrop'].el != $("#"+app.sortable['metadrop'].el.id)[0]))) {
            //clearInterval(checkExistMetas);

            var ulmetalistdrop = document.getElementById("content-card-fields");
            app.sortable['metadrop'] = new Sortable(ulmetalistdrop, {
                group: "metas",
                animation: 350,
                onEnd: function (evt) {
                    /* reordering */
                    if (evt.from == evt.to) {
                        app.metas.move(evt.oldIndex, evt.newIndex);
                    }
                    loadDnDInTemplate(rendering);
                },
                onAdd: function (evt) {
                    console.log('New meta drop : ' + evt.item.id);
                    let metaslist = $("#content-card-fields");
                    if (metaslist[0] === evt.to && app.metas.indexOf(evt.item.id) < 0) {
                        app.metas.splice(evt.newIndex, 0, evt.item.id);
                        rendering.renderUpdate('fieldsList',app.metas);
                        console.debug('new metas: ' + app.metas);
                    }
                    evt.item.parentNode.removeChild(evt.item);
                    loadDnDInTemplate(rendering);
                }
            });
        }
    }, 100); // check every 100ms

    let checkExistTitle = setInterval(function () {
        if ($(".content-card-title").length && !('titledrop' in app.sortable && app.sortable['titledrop'].el == $(".content-card-title")[0])) {
            //clearInterval(checkExistTitle);

            var cardTitleEl = document.getElementsByClassName("content-card-title")[0];
            app.sortable['titledrop'] = new Sortable(cardTitleEl, {
                group: "metas",
                animation: 350,
                onMove: function(evt) {
                    if (app.recordTitle.length > 0) {
                        return false;
                    }
                },
                onEnd: function (evt) {
                    loadDnDInTemplate(rendering);
                },
                onAdd: function (evt) {
                    console.log('New title drop : ' + evt.item.id);
                    let title = $(".content-card-title");
                    if (cardTitleEl === evt.to && app.recordTitle.length <= 0) {
                        app.recordTitle = evt.item.id;
                        rendering.renderUpdate('cardTitle',app.recordTitle);
                        console.debug('new title: ' + app.recordTitle);
                    }
                    evt.item.parentNode.removeChild(evt.item);
                    loadDnDInTemplate(rendering);
                }
            });
        }
    }, 100); // check every 100ms

    /*let checkExistImg = setInterval(function () {
        if ($(".content-card-img").length && !('imagedrop' in app.sortable && app.sortable['imagedrop'].el == $(".content-card-img")[0])) {

            var cardImgEl = document.getElementsByClassName("content-card-img")[0];
            app.sortable['imagedrop'] = new Sortable(cardTitleEl, {
                group: "images",
                animation: 350,
                onMove: function(evt) {
                    if (app.image.length > 0) {
                        return false;
                    }
                },
                onEnd: function (evt) {
                    loadDnDInTemplate(rendering);
                },
                onAdd: function (evt) {
                    console.log('New image drop : ' + evt.item.id);
                    let img = $(".content-card-img");
                    if (cardImgEl === evt.to && app.image.length <= 0) {
                        app.image = evt.item.id;
                        rendering.renderUpdate('fieldPhoto',app.image);
                        console.debug('new image: ' + app.image);
                    }
                    evt.item.parentNode.removeChild(evt.item);
                    loadDnDInTemplate(rendering);
                }
            });
        }
    }, 100); // check every 100ms*/
};

module.exports = { loadDnD, loadDnDInTemplate };