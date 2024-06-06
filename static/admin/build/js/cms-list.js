$(function() {
    // call cms list once everything ready
    ajax_cms_list()

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

        if (page_type == "cms") {
            if (page_sub_type == "cms_list") {
                $("#page-cms-list").val(page_number);
                ajax_cms_list();
            }
        }
    })
    // on enter input key
    .on("keyup", "#search", function(e) {
        e.preventDefault();
        if (e.which == 13) {
            $("#page-cms-list").val(1)
            ajax_cms_list();
        }
    })
    // on submit search query
    .on("click", ".searchBtn", function(e) {
        e.preventDefault();
        $("#page-cms-list").val(1)
        ajax_cms_list();
    })

    .on("change", "#prop_filter_status, #site, #per_page_record", function(e) {
        e.preventDefault();
        $("#page-cms-list").val(1)
        ajax_cms_list();
    });

});

function ajax_cms_list() {
    var page = $("#page-cms-list").val();
    var search = $("#search").val();
    $(".loaderDiv").show();
    $.ajax({
        url: "/admin/ajax-cms-list/",
        type: "POST",
        data: { 
            'page': page,
            'count': $('#per_page_record').val(),
            'search': search,
            'status': $('#prop_filter_status').val(), 
            'site_id': $('#site').val()     
        },
        cache: false,
        success: function(data) {
            $("#span-ajax-cms-list").html(data)
        },
        complete: function(jqXhr) {
            $(".loaderDiv").hide();
            // redirectLogin(jqXhr)
        }
    });
}