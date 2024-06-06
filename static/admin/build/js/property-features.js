$(function() {
    curr_url =  window.location.href

    if (curr_url.indexOf('f_type') != -1) {
        var featureType = getQueryVariable('f_type');
        if (featureType != false) {
            console.log(featureType)
            window.history.pushState({}, "", curr_url.split("?")[0]);
            var valueExists = 0 != $('#feature_type option[value='+featureType+']').length;
            if (valueExists){
                $('#feature_type').val(featureType)
                ajax_property_feature_list(featureType) 
            }
        }
    }

    // on select property feature
    $('#feature_type').change(function(){
        // clear search strings and filters
        $('#search').val('')
        $('#asset_id').val('')
        if(this.value != '')
            ajax_property_feature_list(this.value) 
    });

    $(document).on("click", ".page-link", function(e) {
        var page_number = $(this).attr('data');
        var page_type = $(this).attr('data-type');
        var page_sub_type = $(this).attr('data-sub-type');

        if (page_type == "property_Feature") {
            if (page_sub_type == "property_Feature_list") {
                $("#page-property-feature-list").val(page_number);
                ajax_property_feature_list($('#feature_type').val(), page_number);
            }
        }
    })

    // on enter input key
    .on("keyup", "#search", function(e) {
        e.preventDefault();
        if (e.which == 13) {
            $("#page-property-feature-list").val(1)
            ajax_property_feature_list($('#feature_type').val());
        }
    })
    // on submit search query
    .on("click", ".searchBtn", function(e) {
        e.preventDefault();
        $("#page-property-feature-list").val(1)
        ajax_property_feature_list($('#feature_type').val());
    })

    .on("change", "#asset_id, #per_page_record", function(){
        console.log('asset change')
        ajax_property_feature_list($('#feature_type').val()); 
    })

    .on('submit', '#addPropertyFeatureForm', function(event){
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
                    $('.add-property-feature-modal').modal('hide');
                    ajax_property_feature_list($('#feature_type').val()); 
                } else {
                    $('.add-property-feature-modal').modal('show');
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

    .on('submit', '#editPropertyFeatureForm', function(event){
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
                    $('.edit-property-feature-modal').modal('hide');
                    ajax_property_feature_list($('#feature_type').val()); 
                } else {
                    $('.edit-property-feature-modal').modal('show');
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

    .on('click', '.edit-property-feature',  function(){
        dataId= $(this).data("id")
        dataName = $(this).data("name")
        dataAsset = $(this).data("asset")
        if($(this).data("status") == 'True' || $(this).data("status") == 'true')
            dataStatus = 1;
        else
            dataStatus = 0;
        // set data sets
        $('#feature_id').val(dataId)
        $('#edit_name').val(dataName)
        $('#edit_asset').val(dataAsset)
        $('#edit_is_active').val(dataStatus)
        $('.edit-property-feature-modal').modal('show')
    });

});


const ajax_property_feature_list = (value, page_number=1) => {
    //var page = $("#page-property-feature-list").val();
    var page = page_number;
    console.log(page);
    var asset_id = $('#asset_id').val()
    var search = $("#search").val();
    $(".loaderDiv").show();
    $.ajax({
        url: "/admin/settings/ajax-property-features-list",
        type: "GET",
        data: { 'page': page, 'search': search, feature_type: value, asset_id: asset_id, 'count': $('#per_page_record').val() },
        cache: false,
        success: function(data) {
            $("#property-features-list").html(data)
            $('#per_page_record, #asset_id').selectize({
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