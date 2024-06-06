$(function() {
    // call subdomain list once everything ready
    ajax_timezone_list()

    $('#per_page_record').selectize({
        create: false,
        sortField: 'text'
    });

    $(document).on("click", ".page-link", function(e) {
        var page_number = $(this).attr('data');
        var page_type = $(this).attr('data-type');
        var page_sub_type = $(this).attr('data-sub-type');

        if (page_type == "time_zones") {
            if (page_sub_type == "time_zones_list") {
                $("#page-timezone-list").val(page_number);
                ajax_timezone_list();
            }
        }
    })
    // on enter input key
    .on("keyup", "#search", function(e) {
        e.preventDefault();
        if (e.which == 13) {
            $("#page-timezone-list").val(1)
            ajax_timezone_list();
        }
    })
    // on submit search query
    .on("click", ".searchBtn", function(e) {
        e.preventDefault();
        $("#page-timezone-list").val(1)
            ajax_timezone_list();
    })

    .on("change", " #per_page_record", function(e) {
        e.preventDefault();
        $("#page-timezone-list").val(1)
        ajax_timezone_list();
    });

});

function ajax_timezone_list() {
    var page = $("#page-timezone-list").val();
    var search = $("#search").val();
    $(".loaderDiv").show();
    $.ajax({
        url: "/admin/settings/ajax-time-zones/",
        type: "GET",
        data: { 'page': page, 'search': search, 'count': $('#per_page_record').val() },
        cache: false,
        success: function(data) {
            $("#span-ajax-timezone-list").html(data)
        },
        complete: function(jqXhr) {
            $(".loaderDiv").hide();
            // redirectLogin(jqXhr)
        }
    });
}