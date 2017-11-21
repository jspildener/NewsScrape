$.getJSON("/scrape", function(data) {});

$("#scrape").on("click", function() {
    $.getJSON("/articles", function(data) {
        $("#articles").empty();
        for (var i = 0; i < data.length; i++) {
            $("#articles").append(
                "<div>" + "<div class='row'>" + "<div class='col-md-9'>" +
                "<h2 data-id='" + data[i]._id + "'>" +
                "<a href=" + data[i].link + ">" + data[i].title + "</a>" +
                "</h2>" + "</div>" + "<div class='col-md-3'>" +
                "<form class='save-form' data-id='" + data[i]._id + "'><button class='btn btn-primary' type='submit'>Save</button></form>" +
                "</div>" + "</div>" + "<p>" + data[i].paragraph + "</p>" + "</div>");
        }
    });
});
$("body").on("submit", ".save-form", function(e) {
    e.preventDefault();
    $.ajax({
        url: '/savearticle/' + $(this).data("id"),
        type: 'post'
    });
});

$("#saved").on("click", function() {
    $.getJSON("/savedarticles", function(data) {
        $("#articles").empty();
        for (var i = 0; i < data.length; i++) {
            $("#articles").append(
                "<div>" + "<div class='row'>" + "<div class='col-md-9'>" +
                "<h2 data-id='" + data[i]._id + "'>" +
                "<a href=" + data[i].link + ">" + data[i].title + "</a>" +
                "</h2>" + "</div>" + "<div class='col-md-3'>" +
                "<form class='delete-form' data-id='" + data[i]._id + "'><button class='btn btn-danger' type='submit'>Delete</button></form>" +
                //"<form class='save-form' data-id='" + data[i]._id + "'><button class='btn btn-primary' class='addnotebutton' type='submit'>Add Note</button></form>" +
                "</div>" + "</div>" + "<p>" + data[i].paragraph + "</p>" + "</div>");
        }
    });
});

$("body").on("submit", ".delete-form", function(e) {
    console.log("deleted");
    e.preventDefault();
    $.ajax({
        url: '/deletearticle/' + $(this).data("id"),
        type: 'post'
    });
});
// $("body").on("click", ".addnotebutton", function() {
//     console.log("click");
//     var thisId = $(this).attr("data-id");
//     console.log(this);
//     $("#notes").append(
//         "<div>" + "<div class='row'>" + "<div class='col-md-9'>" +
//         "<form ><input type='text'><button class='btn btn-primary' type='submit'>Add Note</button></form>" +
//         +"</div>");
// });