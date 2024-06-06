$(function() {
    // call contact us list once everything ready
    ajax_contact_us_list()

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

        if (page_type == "contact_us") {
            if (page_sub_type == "contact_us_list") {
                $("#page-contact-us-list").val(page_number);
                ajax_contact_us_list();
            }
        }
    })
    // on enter input key
    .on("keyup", "#search", function(e) {
        e.preventDefault();
        if (e.which == 13) {
            $("#page-contact-us-list").val(1)
            ajax_contact_us_list();
        }
    })
    // on submit search query
    .on("click", ".searchBtn", function(e) {
        e.preventDefault();
        $("#page-contact-us-list").val(1)
            ajax_contact_us_list();
    })

    .on("change", "#site, #user_type, #per_page_record", function(e) {
        e.preventDefault();
        $("#page-contact-us-list").val(1);
        ajax_contact_us_list();
    })

    .on('click', '.view-message', function(){
        dataMsg= $(this).data("msg")
        // set data sets
        $('#messageBody').html(dataMsg)
        $('.messageModal').modal('show')
    })

});

function ajax_contact_us_list() {
    var page = $("#page-contact-us-list").val();
    var search = $("#search").val();
    $(".loaderDiv").show();
    $.ajax({
        url: "/admin/ajax-contact-us-list/",
        type: "POST",
        data: { 'page': page, 'search': search, 'site_id': $('#site').val(), 'user_type': $('#user_type').val(), 'count': $('#per_page_record').val()},
        cache: false,
        success: function(data) {
            $("#span-ajax-contact-us-list").html(data)
        },
        complete: function(jqXhr) {
            $(".loaderDiv").hide();
            // redirectLogin(jqXhr)
        }
    });
}