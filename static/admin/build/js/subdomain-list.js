$(function() {
    // call subdomain list once everything ready
    ajax_subdomain_list()

    $('select[multiple]').selectize(
        {
            plugins: ['remove_button'],
            delimiter: ',',
            persist: false,
        }
    );
    $('#per_page_record').selectize({
        create: false,
        sortField: 'text'
    });

    $(document).on("click", ".page-link", function(e) {
        var page_number = $(this).attr('data');
        var page_type = $(this).attr('data-type');
        var page_sub_type = $(this).attr('data-sub-type');

        if (page_type == "subdomain") {
            if (page_sub_type == "subdomain_list") {
                $("#page-subdomain-list").val(page_number);
                ajax_subdomain_list();
            }
        }
    })
    // on enter input key
    .on("keyup", "#search", function(e) {
        e.preventDefault();
        if (e.which == 13) {
            $("#page-subdomain-list").val(1)
            ajax_subdomain_list();
        }
    })
    // on submit search query
    .on("click", ".searchBtn", function(e) {
        e.preventDefault();
        $("#page-subdomain-list").val(1)
        ajax_subdomain_list();
    })

    .on("change", "#status, #per_page_record", function(e) {
        e.preventDefault();
        $("#page-subdomain-list").val(1)
        ajax_subdomain_list();
    });

});

function ajax_subdomain_list() {
    var page = $("#page-subdomain-list").val();
    var search = $("#search").val();
    $(".loaderDiv").show();
    $.ajax({
        url: "/admin/ajax-subdomain-list/",
        type: "POST",
        data: { 
            'page': page,
            'search': search,
            'status': $('#status').val(),
            'count': $('#per_page_record').val()
        },
        cache: false,
        success: function(data) {
            $("#span-ajax-subdomain-list").html(data)
        },
        complete: function(jqXhr) {
            $(".loaderDiv").hide();
            // redirectLogin(jqXhr)
        }
    });
}