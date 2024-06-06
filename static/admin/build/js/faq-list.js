$(function() {
    // call faq list once everything ready
    ajax_faq_list()

    init_selectize();

    $(document).on("click", ".page-link", function(e) {
        var page_number = $(this).attr('data');
        var page_type = $(this).attr('data-type');
        var page_sub_type = $(this).attr('data-sub-type');

        if (page_type == "faq") {
            if (page_sub_type == "faq_list") {
                $("#page-faq-list").val(page_number);
                ajax_faq_list();
            }
        }
    })
    // on enter input key
    .on("keyup", "#search", function(e) {
        e.preventDefault();
        if (e.which == 13) {
            $("#page-faq-list").val(1)
            ajax_faq_list();
        }
    })
    // on submit search query
    .on("click", ".searchBtn", function(e) {
        e.preventDefault();
        $("#page-faq-list").val(1)
            ajax_faq_list();
    })

    .on("change", "#prop_filter_status, #site, #per_page_record", function(e) {
        e.preventDefault();
        $("#page-faq-list").val(1);
        ajax_faq_list();
    });

});

function ajax_faq_list() {
    var page = $("#page-faq-list").val();
    var search = $("#search").val();
    $(".loaderDiv").show();
    $.ajax({
        url: "/admin/ajax-faq-list/",
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
            $("#span-ajax-faq-list").html(data)
        },
        complete: function(jqXhr) {
            $(".loaderDiv").hide();
            // redirectLogin(jqXhr)
        }
    });
}

const init_selectize = () => {
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
}