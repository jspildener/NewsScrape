$.getJSON("/scrape", function(data) {});

$("#scrape").on("click", function() {
    $.getJSON("/articles", function(data) {
        console.log(data);
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