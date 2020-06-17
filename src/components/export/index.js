function copy() {
    var $temp = $("<textarea>");
    $("body").append($temp);
    $temp.val(app.output).select();
    document.execCommand("copy");
    $temp.remove();
}

$("#copy").on("click", copy);
