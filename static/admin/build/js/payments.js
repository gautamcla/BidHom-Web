$(function() {
    // call user seller list once everything ready
    ajax_payments()

    $('select[multiple]').selectize(
        {
            plugins: ['remove_button'],
            delimiter: ',',
            persist: false,
        }
    );
    $('#prop_num_record').selectize({
        create: false,
        sortField: 'text'
    });

    $(document).on("click", ".page-link", function(e) {
        var page_number = $(this).attr('data');
        var page_type = $(this).attr('data-type');
        var page_sub_type = $(this).attr('data-sub-type');

        if (page_type == "users") {
            if (page_sub_type == "users_list") {
                $("#page-buyer-seller-list").val(page_number);
                ajax_payments();
            }
        }
    })
    // on enter input key
    .on("keyup", "#search", function(e) {
        e.preventDefault();
        if (e.which == 13) {
            $("#page-buyer-seller-list").val(1)
            ajax_payments();
        }
    })
    // on submit search query
    .on("click", ".searchBtn", function(e) {
        e.preventDefault();
        $("#page-buyer-seller-list").val(1)
            ajax_payments();
    })

    // on status filter
    .on("change", "#domain, #prop_num_record", function(e){
        e.preventDefault();
        $("#page-buyer-seller-list").val(1)
        ajax_payments();
    });

});

function ajax_payments() {
    var page = $("#page-buyer-seller-list").val();
    var search = $("#search").val();
    $(".loaderDiv").show();
    $.ajax({
        url: "/admin/ajax-payments/",
        type: "POST",
        data: { 
            'page': page,
            'search': search,
            'domain': $('#domain').val(),
            'count': $('#prop_num_record').val(),
        },
        cache: false,
        success: function(data) {
            $("#ajax-content").html(data);
        },
        complete: function(jqXhr) {
            $(".loaderDiv").hide();
            // redirectLogin(jqXhr)
        }
    });
}