$(function() {
    // call listing list list once everything ready
    ajax_bidders_list()

    $('select[multiple]').selectize(
        {
            plugins: ['remove_button'],
            delimiter: ',',
            persist: false,
            create: false,
        }
    );
    $('#prop_num_record, #filter_data').selectize({
        create: false,
        sortField: 'text'
    });

    $(document).on("click", ".page-link", function(e) {
        var page_number = $(this).attr('data');
        var page_type = $(this).attr('data-type');
        var page_sub_type = $(this).attr('data-sub-type');

        if (page_type == "bidders") {
            if (page_sub_type == "bidders_list") {
                $("#page-bidders-list").val(page_number);
                ajax_bidders_list();
            }
        }
    })
    // on enter input key
    .on("keyup", "#search", function(e) {
        e.preventDefault();
        if (e.which == 13) {
            $("#page-bidders-list").val(1)
            ajax_bidders_list();
        }
    })
    // on submit search query
    .on("click", ".searchBtn", function(e) {
        e.preventDefault();
        $("#page-bidders-list").val(1)
            ajax_bidders_list();
    })

    .on("change", "#asset_type, #filter_data, #prop_num_record, #site", function(e) {
        e.preventDefault();
        $("#page-bidders-list").val(1);
        ajax_bidders_list();
    })

    .on('change','.listing_change_status', function(){
        var status_id = $('option:selected',this).val();
        var status_name = $('option:selected',this).text();
        var property_id = Number($(this).attr('data-property'));
        data = {property_id: property_id, status_id : status_id, status_name: status_name};
        $.ajax({
         url: '/admin/change-property-status/',
         type: 'post',
         dateType: 'json',
         cache: false,
         data: data,
         beforeSend: function(){
            $(".loaderDiv").show();
         },
         success: function(response){
            $(".loaderDiv").hide();
             if(response.error == 0){
                var property_id = response.property_id.toString();
                var status_id = response.status_id;
                var status_name = response.status_name;
                var btn_class='btn-warning';
                if(status_id == 5){
                     btn_class = 'btn-danger';
                }else if(status_id == 1){
                     btn_class = 'btn-success';
                }
                $('#change_status_'+property_id).hide();
                $('#statusText'+property_id).html('<i class="fa fa-edit"></i>' + status_name);
                $('#statusText'+property_id).removeClass('btn-success btn-success btn-warning').addClass(btn_class);
                $('#display_status_'+property_id).show();
                 showAlert(response.msg, 0)
             }else{
                showAlert(response.msg, 1)
             }
         }
     });
   })
   
   
   .on('change','.listing_change_approval', function(){
        var approval_id = $('option:selected',this).val();
        var approval_name = $('option:selected',this).text();
        var property_id = Number($(this).attr('data-property'));
        data = {property_id: property_id, approval_id : approval_id, approval_name: approval_name};
        $.ajax({
         url: '/admin/change-approval-status/',
         type: 'post',
         dateType: 'json',
         cache: false,
         data: data,
         beforeSend: function(){
            $(".loaderDiv").show();
         },
         success: function(response){
            $(".loaderDiv").hide();
             if(response.error == 0){
                var property_id = response.property_id.toString();
                var approval_id = response.approval_id;
                var approval_name = response.approval_name;
                var btn_class='btn-success';
                if(approval_id != 1){
                    btn_class = 'btn-warning';
                }
                $('#change_approval_'+property_id).hide();
                $('#approvalStatusText'+property_id).html('<i class="fa fa-edit"></i>' + approval_name);
                $('#approvalStatusText'+property_id).removeClass('btn-success btn-success btn-warning').addClass(btn_class);
                $('#approval_status_'+property_id).show();
                showAlert(response.msg, 0)
            }else{
                showAlert(response.msg, 1)
            }
         }
     });
   })

    .on('click', '.confirm_bidder_doc_delete', function(e){
        e.preventDefault()
        var section = $(this).attr('data-image-section');
        var image_id = $(this).attr('data-image-id');
        var image_name = $(this).attr('data-image-name');
        $('#confirmBidderDocDeleteModal #popup_section').val(section);
        $('#confirmBidderDocDeleteModal #popup_image_id').val(image_id);
        $('#confirmBidderDocDeleteModal #popup_image_name').val(image_name);
        $('#confirmBidderDocDeleteModal').modal('show');
    })

    .on('click', '#del_bidder_doc_false', function(){
        $('#confirmBidderDocDeleteModal #popup_section').val('');
        $('#confirmBidderDocDeleteModal #popup_image_id').val('');
        $('#confirmBidderDocDeleteModal #popup_image_name').val('');
        $('#confirmBidderDocDeleteModal').modal('hide');
    })

    .on('click', '#del_bidder_doc_true', function(){

        var section= $('#confirmBidderDocDeleteModal #popup_section').val();
        var id = $('#confirmBidderDocDeleteModal #popup_image_id').val();
        var name = $('#confirmBidderDocDeleteModal #popup_image_name').val();
        del_params = {
            section: section,
            id: id,
            name: name,
        }
        delete_bidder_document(del_params);

        $('#confirmBidderDocDeleteModal').modal('hide');

    })

    .on('click', '#saveChanges', function(e) {
        e.preventDefault();

        $('#bidderUpdateFrm').parsley().validate();
        if (true === $('#bidderUpdateFrm').parsley().isValid()) {
            $('.bs-callout-info').removeClass('hidden');
            $('.bs-callout-warning').addClass('hidden');

            $.ajax({
                url: '/admin/update-registration-details/',
                type: 'post',
                dateType: 'json',
                cache: false,
                data: $('#bidderUpdateFrm').serialize(),
                beforeSend: function() {
                    $(".loaderDiv").show();
                },
                success: function(response) {
                    console.log(response)
                    if (response.error == 0 || response.status == 200 || response.status == 201) {
                        window.setTimeout(function () {
                            window.location.href='/admin/bidders-list/';
                        }, 1500);
                        showAlert(response.msg, 0)
                    } else {
                        showAlert(response.msg, 1)
                    }
                    $(".loaderDiv").hide();

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
                    $(".loaderDiv").hide();
                    showAlert(msg, 1)
                }
            });

        } else {
            $('.bs-callout-info').addClass('hidden');
            $('.bs-callout-warning').removeClass('hidden');
            // toggle section 
            var $BOX_PANEL = $('.collapse-link').closest('.x_panel'),
                $ICON = $('.collapse-link').find('i'),
                $BOX_CONTENT = $BOX_PANEL.find('.x_content');

            // fix for some div with hardcoded fix class
            if ($BOX_PANEL.attr('style')) {
                $BOX_CONTENT.show(200, function() {
                    $BOX_PANEL.removeAttr('style');
                });
            } else {
                $BOX_CONTENT.show(200);
                $BOX_PANEL.css('height', 'auto');
            }

            $ICON.addClass('fa-chevron-down');
            $(".loaderDiv").hide();
            showAlert('Please Fill out all required fields', 1)

        }
    })

    .on('click', '.del_bidder_btn', function(){
        var row_id = $(this).attr('rel_id');
        if($(this).attr('id') == 'del_bidder_true'){
            $.ajax({
                url: '/admin/delete-bidder-reg/',
                type: 'post',
                dataType: 'json',
                cache: false,
                data: {'row_id': row_id},
                beforeSend: function(){
                    $(".loaderDiv").show();
                },
                success: function(response){
                    $(".loaderDiv").hide();
                    if(response.error == 0){
                        $('#confirmBidderDeleteModal').modal('hide');
                        try{
                            custom_response = {
                            'site_id': site_id,
                            'user_id': $('#confirmBidderDeleteModal #user_id').val(),
                            'property_id': $('#confirmBidderDeleteModal #property_id').val(),
                            'auction_id': $('#confirmBidderDeleteModal #auction_id').val(),
                        };
                            customCallBackFunc(update_bidder_socket, [custom_response]);
                        }catch(ex){
                            //console.log(ex);
                        }
                        showAlert('Deleted successfully', 0);
                        $("#page-bidders-list").val(1)
                        ajax_bidders_list();
                        // window.setTimeout(function () {
                        //     window.location.reload();
                        // }, 2000);
                    }else{
                        $('#confirmBidderDeleteModal').modal('hide');
                        showAlert("Bidder Registration", 1);
                    }
                }
            });
        }else{
            $('#confirmBidderDeleteModal #user_id').val('');
            $('#confirmBidderDeleteModal #auction_id').val('');
            $('#confirmBidderDeleteModal #property_id').val('');
            $('#del_bidder_true').removeAttr('rel_id');
            $('#del_bidder_false').removeAttr('rel_id');
            $('#confirmBidderDeleteModal').modal('hide');
            return false;
        }
    });
});

function ajax_bidders_list(listing_id='') {
    var page = $("#page-bidders-list").val();
    var search = $("#search").val();
    $(".loaderDiv").show();
    $.ajax({
        url: "/admin/ajax-bidders-list/",
        type: "POST",
        data: { 
            'page': page,
            'search': search,
            'asset_id': $('#asset_type').val(), 
            'status': $('#filter_data').val(), 
            'property_count': $('#prop_num_record').val(),
            'site_id': $('#site').val(),
            'listing_id': listing_id
        },
        cache: false,
        success: function(data) {
            $("#span-ajax-bidders-list").html(data)
        },
        complete: function(jqXhr) {
            $(".loaderDiv").hide();
            // redirectLogin(jqXhr)
        }
    });
}

function delete_bidder_document(params){
    var image_id = '';
    var image_name = '';
    var new_ids = '';
    var new_names = '';
 
    var section = params.section;
    var id = params.id;
    var name = params.name;
 
 
     image_id = $('#bidder_doc_id').val();
     image_name = $('#bidder_doc_name').val();
     new_ids = remove_string(image_id,id,',');
     new_names = remove_string(image_name,name,',');
    //  $('li[rel_id="'+id+'"]').remove();
     $('#bidder_doc_id').val(new_ids);
     $('#bidder_doc_name').val(new_names);
     if($('#bidder_doc_id').val() == ''){
         $('#bidderDocDiv').hide();
     }
     var reg_id = $('#reg_id').val();
    data = {'image_id': id, 'image_name': name, 'section': section, 'reg_id': reg_id}
     if(name && section && id){
         $.ajax({
             url: '/admin/delete-bidder-document/',
             type: 'post',
             dateType: 'json',
             async: false,
             cache: false,
             data: data,
             beforeSend: function(){
 
             },
             success: function(response){
                 if(response.error == 0){
                     $('#confirmImageDeleteModal #popup_section').val('');
                     $('#confirmImageDeleteModal #popup_image_id').val('');
                     $('#confirmImageDeleteModal #popup_image_name').val('');
                     $('li[rel_id="'+id+'"]').remove();
                     showAlert('File Deleted successfully', 0)
                 }else{
                     showAlert('Some error occurs, please try again', 1)
                 }
             }
         });
     }
 
 }

function bidder_delete_confirmation(row_id, auction_id='', property_id='', user_id,bid_count){
    if(parseInt(bid_count) > 0){
        showAlert("Can\'t Delete because buyer placed a bid", 1);
    }else{
        $('.personalModalwrap').modal('hide');
        $('#confirmBidderDeleteModal #user_id').val(user_id);
        $('#confirmBidderDeleteModal #auction_id').val(auction_id);
        $('#confirmBidderDeleteModal #property_id').val(property_id);
        $('#confirmBidderDeleteModal').modal('show');
        $('.del_bidder_btn').attr('rel_id', row_id);
    }
}

function update_bidder_socket(response){
    socket.emit("checkBid", {"user_id": response.user_id, "property_id": response.property_id, "auction_id": response.auction_id, "domain_id": response.site_id});
}