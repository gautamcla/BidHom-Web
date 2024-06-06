$(function() {
    // call email template list once everything ready
    ajax_email_template_list()

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

        if (page_type == "email-template") {
            if (page_sub_type == "email_template_list") {
                $("#page-email-template-list").val(page_number);
                ajax_email_template_list();
            }
        }
    })
    // on enter input key
    .on("keyup", "#search", function(e) {
        e.preventDefault();
        if (e.which == 13) {
            $("#page-email-template-list").val(1)
            ajax_email_template_list();
        }
    })
    // on submit search query
    .on("click", ".searchBtn", function(e) {
        e.preventDefault();
        $("#page-email-template-list").val(1)
        ajax_email_template_list();
    })

    .on("change", "#prop_filter_status, #site, #per_page_record", function(e) {
        e.preventDefault();
        $("#page-email-template-list").val(1)
        ajax_email_template_list();
    });

});

function ajax_email_template_list() {
    var page = $("#page-email-template-list").val();
    var search = $("#search").val();
    $(".loaderDiv").show();
    $.ajax({
        url: "/admin/ajax-email-template-list/",
        type: "POST",
        data: { 
            'page': page,
            'search': search,
            'count': $('#per_page_record').val(),
            'status': $('#prop_filter_status').val(), 
            'site_id': $('#site').val()     
        },
        cache: false,
        success: function(data) {
            $("#span-ajax-email-template-list").html(data)
        },
        complete: function(jqXhr) {
            $(".loaderDiv").hide();
            // redirectLogin(jqXhr)
        }
    });
}