$(function() {

    curr_url =  window.location.href

    if (curr_url.indexOf('o_type') != -1) {
        var objectType = getQueryVariable('o_type');
        if (objectType != false) {
            window.history.pushState({}, "", curr_url.split("?")[0]);
            var valueExists = 0 != $('#lookup_object option[value='+objectType+']').length;
            if (valueExists){
                $('#lookup_object').val(objectType)
                ajax_lookup_object_status(objectType) 
            }
        }
    }

    // on select property feature
    $('#lookup_object').change(function(){
        // clear search strings and filters
        $('#search').val('')
        if(this.value != '')
            ajax_lookup_object_status(this.value) 
    });

    $(document).on("click", ".page-link", function(e) {
        var page_number = $(this).attr('data');
        var page_type = $(this).attr('data-type');
        var page_sub_type = $(this).attr('data-sub-type');

        if (page_type == "lookup_object") {
            if (page_sub_type == "lookup_object_list") {
                $("#page-lookup-object-status").val(page_number);
                ajax_lookup_object_status($('#lookup_object').val());
            }
        }
    })

    // on enter input key
    .on("keyup", "#search", function(e) {
        e.preventDefault();
        if (e.which == 13) {
            $("#page-lookup-object-status").val(1)
            ajax_lookup_object_status($('#lookup_object').val());
        }
    })
    // on submit search query
    .on("click", ".searchBtn", function(e) {
        e.preventDefault();
        $("#page-lookup-object-status").val(1)
        ajax_lookup_object_status($('#lookup_object').val());
    })

    .on("change", "#per_page_record", function(e) {
        e.preventDefault();
        $("#page-lookup-object-status").val(1)
        ajax_lookup_object_status($('#lookup_object').val());
    })


    .on('submit', '#addLookupObjectStatus', function(event){
        event.preventDefault();
        $(".loaderDiv").show();
        $.ajax({
            type: $(this).attr('method'),
            url: $(this).attr('action'),
            data: $(this).serialize(),
            success: function (data) {
                // change html buttons
                showAlert(data.msg, data.error)
                if(data.error == 0){
                    $('.add-lookup-object-status-modal').modal('hide');
                    ajax_lookup_object_status($('#lookup_object').val()); 
                } else {
                    $('.add-lookup-object-status-modal').modal('show');
                    $(".loaderDiv").hide();
                }
            },
            error: function(jqXHR, exception) {
                var msg = '';
                if (jqXHR.status === 0) {
                    msg = 'Not connect.\n Verify Network.';
                } else if (jqXHR.status == 404) {
                    msg = 'Requested page not found. [404]';
                } else if (jqXHR.status == 500) {
                    msg = 'Internal Server Error [500].';
                } else if (exception === 'parsererror') {
                    msg = 'Requested JSON parse failed.';
                } else if (exception === 'timeout') {
                    msg = 'Time out error.';
                } else if (exception === 'abort') {
                    msg = 'Ajax request aborted.';
                } else {
                    msg = 'Uncaught Error.\n' + jqXHR.responseText;
                }
                showAlert(msg, 1)
                $(".loaderDiv").hide();

            }
        });
    })

    .on('submit', '#editLopkupObjectStatus', function(event){
        event.preventDefault();
        $(".loaderDiv").show();
        $.ajax({
            type: $(this).attr('method'),
            url: $(this).attr('action'),
            data: $(this).serialize(),
            success: function (data) {
                // change html buttons
                showAlert(data.msg, data.error)
                if(data.error == 0){
                    $('.edit-lookup-object-status-modal').modal('hide');
                    ajax_lookup_object_status($('#lookup_object').val()); 
                } else {
                    $('.edit-lookup-object-status-modal').modal('show');
                    $(".loaderDiv").hide();
                }
            },
            error: function(jqXHR, exception) {
                var msg = '';
                if (jqXHR.status === 0) {
                    msg = 'Not connect.\n Verify Network.';
                } else if (jqXHR.status == 404) {
                    msg = 'Requested page not found. [404]';
                } else if (jqXHR.status == 500) {
                    msg = 'Internal Server Error [500].';
                } else if (exception === 'parsererror') {
                    msg = 'Requested JSON parse failed.';
                } else if (exception === 'timeout') {
                    msg = 'Time out error.';
                } else if (exception === 'abort') {
                    msg = 'Ajax request aborted.';
                } else {
                    msg = 'Uncaught Error.\n' + jqXHR.responseText;
                }
                showAlert(msg, 1)
                $(".loaderDiv").hide();

            }
        });
    })

    .on('click', '.edit-lookup-object-status',  function(){
        dataId= $(this).data("id")
        dataLookupStatusId = $(this).attr("data-status-id")
        dataLookupObjectId = $(this).attr("data-object-id")
        if($(this).data("status") == 'True' || $(this).data("status") == 'true')
            dataStatus = 1;
        else
            dataStatus = 0;
        // set data sets
        $('#editStatusObjectId').val(dataId)
        $('#editIsActive').val(dataStatus)
        $('#editStatusId').val(dataLookupStatusId)
        $('.edit-lookup-object-status-modal').modal('show')
    });

});


const ajax_lookup_object_status = (value) => {
    var page = $("#page-lookup-object-status").val();
    var search = $("#search").val();
    $(".loaderDiv").show();
    $.ajax({
        url: "/admin/settings/ajax-lookup-object-status",
        type: "GET",
        data: { 'page': page, 'search': search, object_id: value, 'count': $('#per_page_record').val() },
        cache: false,
        success: function(data) {
            $("#lookup-object-status-list").html(data)
            $('#per_page_record').selectize({
                create: false,
                sortField: 'text'
            });
        },
        complete: function(jqXhr) {
            $(".loaderDiv").hide();
            // redirectLogin(jqXhr)
        }
    });
}

// const getQueryVariable = (variable) => {
//     var query = window.location.search.substring(1);
//     query = query.replace(/%26/g, '&')
//     query = query.replace('&amp;', '&')
//     var vars = query.split("&");
//     for (var i = 0; i < vars.length; i++) {
//         var pair = vars[i].split("=");
//         if (pair[0] == variable) {
//             return pair[1];
//         }
//     }
//     return false
// }