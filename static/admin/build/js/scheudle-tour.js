$(function() {
    // call schedule tour list once everything ready
    ajax_schedule_tour_list()

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

        if (page_type == "schedule_tour") {
            if (page_sub_type == "schedule_tour_list") {
                $("#page-schedule-tour-list").val(page_number);
                ajax_schedule_tour_list();
            }
        }
    })
    // on enter input key
    .on("keyup", "#search", function(e) {
        e.preventDefault();
        if (e.which == 13) {
            $("#page-schedule-tour-list").val(1)
            ajax_schedule_tour_list();
        }
    })
    // on submit search query
    .on("click", ".searchBtn", function(e) {
        e.preventDefault();
        $("#page-schedule-tour-list").val(1)
            ajax_schedule_tour_list();
    })

    .on("change", "#site, #tour_type, #availability, #prop_filter_status, #per_page_record", function(e) {
        e.preventDefault();
        $("#page-schedule-tour-list").val(1);
        ajax_schedule_tour_list();
    })

    .on('click', '.view-message', function(){
        dataMsg= $(this).data("msg")
        // set data sets
        $('#messageBody').html(dataMsg)
        $('.messageModal').modal('show')
    });

});

function ajax_schedule_tour_list() {
    var page = $("#page-schedule-tour-list").val();
    var search = $("#search").val();
    $(".loaderDiv").show();
    $.ajax({
        url: "/admin/ajax-schedule-tour-list/",
        type: "POST",
        data: { 
            'page': page,
            'count': $('#per_page_record').val(),
            'search': search,
            'site_id': $('#site').val(),
            'tour_type': $('#tour_type').val(),
            'availability': $('#availability').val(),
            'status': $('#prop_filter_status').val()
        },
        cache: false,
        success: function(data) {
            $("#span-ajax-schedule-tour-list").html(data)
        },
        complete: function(jqXhr) {
            $(".loaderDiv").hide();
            // redirectLogin(jqXhr)
        }
    });
}