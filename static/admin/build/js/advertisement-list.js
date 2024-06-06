$(function() {
    // call ads list once everything ready
    ajax_ads_list()

    $('select[multiple]').selectize(
        {
            plugins: ['remove_button'],
            delimiter: ',',
            persist: false,
            create: false,
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

        if (page_type == "advertisement") {
            if (page_sub_type == "advertisement_list") {
                $("#page-advertisement-list").val(page_number);
                ajax_ads_list();
            }
        }
    })
    // on enter input key
    .on("keyup", "#search", function(e) {
        e.preventDefault();
        if (e.which == 13) {
            $("#page-advertisement-list").val(1)
            ajax_ads_list();
        }
    })
    // on submit search query
    .on("click", ".searchBtn", function(e) {
        e.preventDefault();
        $("#page-advertisement-list").val(1)
            ajax_ads_list();
    })

    .on("change", "#site, #prop_filter_status, #per_page_record", function(e) {
        e.preventDefault();
        $("#page-advertisement-list").val(1);
        ajax_ads_list();
    })

    .on('submit', '.add-advertisement-form, .edit-advertisement-form', function(event){
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
                    setTimeout(function(){ location.reload(); }, 2000);
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
                showAlert(msg, 1)
                $(".loaderDiv").hide();

            }
        });
        return false;

    })


    .on('click','.edit-advertisement', function(e){
        e.preventDefault();
        $(".loaderDiv").show();
        dataId= $(this).data("id")
        $.ajax({
            type: 'POST',
            url: '/admin/ajax-get-advertisement-details/',
            dataType: 'json',
            async: false,
            data: {id : dataId},
            success: function (response) {
                if(response.error == 0){
                    data = response.data.data
                    console.log(data)
                    $('#advertisement_id').val(data.id)
                    $('#editSiteId').val(data.domain)
                    $('#editCompanyName').val(data.company_name)
                    $('#editAdUrl').val(data.url)
                    $('#editStatus').val(data.status)

                    if(!$.isEmptyObject(data.image)){
                        //setup image section
                        set_edit_ad_image({
                            "status": 200,
                            "uploaded_file_list": [
                                {
                                    "file_name": data.image.doc_file_name,
                                    "upload_id": data.image.id,
                                    "upload_to": "ad_image"
                                }
                            ]
                        })
                    } else {
                        $('#editUploadName').val('');
                        $('#editUploadID').val('');
                        $('#editAdImgDiv').hide();
                    }
                    
                    $('.edit-advertisement-modal').modal('show')
                } else {
                    showAlert(data.msg, 1)
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
                showAlert(msg, 1)
                $(".loaderDiv").hide();

            }
        });
    })

    .on('click', '.confirm_image_delete', function(e) {
        e.preventDefault();
        var data_count = '';
        var data_article_id = '';
        var agent_id = '';
        var section = $(this).attr('data-image-section');
        var image_id = $(this).attr('data-image-id');
        var image_name = $(this).attr('data-image-name');
        var action = $(this).attr('data-action');
        if ($(this).attr('data-count')) {
            data_count = $(this).attr('data-count');
        }
        if ($(this).attr('data-article-id')) {
            data_article_id = $(this).attr('data-article-id');
        }
        var agent_id = $('#add_agent_form #agent_id').val();
        $('#confirmImageDeleteModal #popup_article_id').val(data_article_id);
        $('#confirmImageDeleteModal #popup_section').val(section);
        $('#confirmImageDeleteModal #popup_image_id').val(image_id);
        $('#confirmImageDeleteModal #popup_image_name').val(image_name);
        $('#confirmImageDeleteModal #popup_count').val(data_count);
        $('#confirmImageDeleteModal #popup_agent_id').val(agent_id);
        $('#confirmImageDeleteModal #action').val(action);
        $('#confirmImageDeleteModal').modal('show');
    })

    .on('click', '#del_image_false', function(e) {
        e.preventDefault();
        $('#confirmImageDeleteModal #popup_article_id').val('');
        $('#confirmImageDeleteModal #popup_section').val('');
        $('#confirmImageDeleteModal #popup_image_id').val('');
        $('#confirmImageDeleteModal #popup_image_name').val('');
        $('#confirmImageDeleteModal #popup_count').val('');
        $('#confirmImageDeleteModal #popup_agent_id').val('');
        $('#confirmImageDeleteModal #action').val('');
        $('#confirmImageDeleteModal').modal('hide');
    })

    .on('click', '#del_image_true', function(e) {
        e.preventDefault();

        var article_id = $('#confirmImageDeleteModal #popup_article_id').val();
        var section = $('#confirmImageDeleteModal #popup_section').val();
        var id = $('#confirmImageDeleteModal #popup_image_id').val();
        var name = $('#confirmImageDeleteModal #popup_image_name').val();
        var count = $('#confirmImageDeleteModal #popup_count').val();
        var agent_id = $('#confirmImageDeleteModal #popup_agent_id').val();
        var action = $('#confirmImageDeleteModal #action').val();
        delete_image({
            article_id: article_id,
            section: section,
            id: id,
            name: name,
            count: count,
            agent_id: agent_id,
            action: action
            // site_id: $('#site_id').val()
        });
        $('#confirmImageDeleteModal').modal('hide');
    })


    initdrozone({
        uploadMultiple: false,
        url: "/admin/admin-save-images/",
        field_name: 'ad_image',
        file_accepted: '.png, .jpg, .jpeg, .svg',
        element: "addImgFrm",
        max_files: 1,
        call_function: set_ad_image,
        dictDefaultMessage : 'Drop files here to upload',
    });

    initdrozone({
        uploadMultiple: false,
        url: "/admin/admin-save-images/",
        field_name: 'ad_image',
        file_accepted: '.png, .jpg, .jpeg, .svg',
        element: "editImgFrm",
        max_files: 1,
        call_function: set_edit_ad_image,
        dictDefaultMessage : 'Drop files here to upload',
    });


//     .on('change','.listing_change_status', function(){
//         var status_id = $('option:selected',this).val();
//         var status_name = $('option:selected',this).text();
//         var property_id = Number($(this).attr('data-property'));
//         data = {property_id: property_id, status_id : status_id, status_name: status_name};
//         $.ajax({
//          url: '/admin/change-property-status/',
//          type: 'post',
//          dateType: 'json',
//          cache: false,
//          data: data,
//          beforeSend: function(){
//             $(".loaderDiv").show();
//          },
//          success: function(response){
//             $(".loaderDiv").hide();
//              if(response.error == 0){
//                 var property_id = response.property_id.toString();
//                 var status_id = response.status_id;
//                 var status_name = response.status_name;
//                 var btn_class='btn-warning';
//                 if(status_id == 5){
//                      btn_class = 'btn-danger';
//                 }else if(status_id == 1){
//                      btn_class = 'btn-success';
//                 }
//                 $('#change_status_'+property_id).hide();
//                 $('#statusText'+property_id).html('<i class="fa fa-edit"></i>' + status_name);
//                 $('#statusText'+property_id).removeClass('btn-success btn-success btn-warning').addClass(btn_class);
//                 $('#display_status_'+property_id).show();
//                  showAlert(response.msg, 0)
//              }else{
//                 showAlert(response.msg, 1)
//              }
//          }
//      });
//    })
   
   
//    .on('change','.listing_change_approval', function(){
//         var approval_id = $('option:selected',this).val();
//         var approval_name = $('option:selected',this).text();
//         var property_id = Number($(this).attr('data-property'));
//         data = {property_id: property_id, approval_id : approval_id, approval_name: approval_name};
//         $.ajax({
//          url: '/admin/change-approval-status/',
//          type: 'post',
//          dateType: 'json',
//          cache: false,
//          data: data,
//          beforeSend: function(){
//             $(".loaderDiv").show();
//          },
//          success: function(response){
//             $(".loaderDiv").hide();
//              if(response.error == 0){
//                 var property_id = response.property_id.toString();
//                 var approval_id = response.approval_id;
//                 var approval_name = response.approval_name;
//                 var btn_class='btn-success';
//                 if(approval_id != 1){
//                     btn_class = 'btn-warning';
//                 }
//                 $('#change_approval_'+property_id).hide();
//                 $('#approvalStatusText'+property_id).html('<i class="fa fa-edit"></i>' + approval_name);
//                 $('#approvalStatusText'+property_id).removeClass('btn-success btn-success btn-warning').addClass(btn_class);
//                 $('#approval_status_'+property_id).show();
//                 showAlert(response.msg, 0)
//             }else{
//                 showAlert(response.msg, 1)
//             }
//          }
//      });
//    })

//     .on('click', '.confirm_bidder_doc_delete', function(e){
//         e.preventDefault()
//         var section = $(this).attr('data-image-section');
//         var image_id = $(this).attr('data-image-id');
//         var image_name = $(this).attr('data-image-name');
//         $('#confirmBidderDocDeleteModal #popup_section').val(section);
//         $('#confirmBidderDocDeleteModal #popup_image_id').val(image_id);
//         $('#confirmBidderDocDeleteModal #popup_image_name').val(image_name);
//         $('#confirmBidderDocDeleteModal').modal('show');
//     })

//     .on('click', '#del_bidder_doc_false', function(){
//         $('#confirmBidderDocDeleteModal #popup_section').val('');
//         $('#confirmBidderDocDeleteModal #popup_image_id').val('');
//         $('#confirmBidderDocDeleteModal #popup_image_name').val('');
//         $('#confirmBidderDocDeleteModal').modal('hide');
//     })

//     .on('click', '#del_bidder_doc_true', function(){

//         var section= $('#confirmBidderDocDeleteModal #popup_section').val();
//         var id = $('#confirmBidderDocDeleteModal #popup_image_id').val();
//         var name = $('#confirmBidderDocDeleteModal #popup_image_name').val();
//         del_params = {
//             section: section,
//             id: id,
//             name: name,
//         }
//         delete_bidder_document(del_params);

//         $('#confirmBidderDocDeleteModal').modal('hide');

//     })

//     .on('click', '#saveChanges', function(e) {
//         e.preventDefault();

//         $('#bidderUpdateFrm').parsley().validate();
//         if (true === $('#bidderUpdateFrm').parsley().isValid()) {
//             $('.bs-callout-info').removeClass('hidden');
//             $('.bs-callout-warning').addClass('hidden');

//             $.ajax({
//                 url: '/admin/update-registration-details/',
//                 type: 'post',
//                 dateType: 'json',
//                 cache: false,
//                 data: $('#bidderUpdateFrm').serialize(),
//                 beforeSend: function() {
//                     $(".loaderDiv").show();
//                 },
//                 success: function(response) {
//                     console.log(response)
//                     if (response.error == 0 || response.status == 200 || response.status == 201) {
//                         window.setTimeout(function () {
//                             window.location.href='/admin/bidders-list/';
//                         }, 1500);
//                         showAlert(response.msg, 0)
//                     } else {
//                         showAlert(response.msg, 1)
//                     }
//                     $(".loaderDiv").hide();

//                 },
//                 error: function(jqXHR, exception) {
//                     var msg = '';
//                     if (jqXHR.status === 0) {
//                         msg = 'Not connect.\n Verify Network.';
//                     } else if (jqXHR.status == 404) {
//                         msg = 'Requested page not found. [404]';
//                     } else if (jqXHR.status == 500) {
//                         msg = 'Internal Server Error [500].';
//                     } else if (exception === 'parsererror') {
//                         msg = 'Requested JSON parse failed.';
//                     } else if (exception === 'timeout') {
//                         msg = 'Time out error.';
//                     } else if (exception === 'abort') {
//                         msg = 'Ajax request aborted.';
//                     } else {
//                         msg = 'Uncaught Error.\n' + jqXHR.responseText;
//                     }
//                     $(".loaderDiv").hide();
//                     showAlert(msg, 1)
//                 }
//             });

//         } else {
//             $('.bs-callout-info').addClass('hidden');
//             $('.bs-callout-warning').removeClass('hidden');
//             // toggle section 
//             var $BOX_PANEL = $('.collapse-link').closest('.x_panel'),
//                 $ICON = $('.collapse-link').find('i'),
//                 $BOX_CONTENT = $BOX_PANEL.find('.x_content');

//             // fix for some div with hardcoded fix class
//             if ($BOX_PANEL.attr('style')) {
//                 $BOX_CONTENT.show(200, function() {
//                     $BOX_PANEL.removeAttr('style');
//                 });
//             } else {
//                 $BOX_CONTENT.show(200);
//                 $BOX_PANEL.css('height', 'auto');
//             }

//             $ICON.addClass('fa-chevron-down');
//             $(".loaderDiv").hide();
//             showAlert('Please Fill out all required fields', 1)

//         }
//     });

});

function ajax_ads_list(listing_id='') {
    var page = $("#page-advertisement-list").val();
    var search = $("#search").val();
    $(".loaderDiv").show();
    $.ajax({
        url: "/admin/ajax-advertisement-list/",
        type: "POST",
        data: { 
            'page': page,
            'search': search,
            'count': $('#per_page_record').val(),
            'site_id': $('#site').val(),
            'status': $('#prop_filter_status').val(),
        },
        cache: false,
        success: function(data) {
            $("#span-ajax-advertisement-list").html(data)
        },
        complete: function(jqXhr) {
            $(".loaderDiv").hide();
            // redirectLogin(jqXhr)
        }
    });
}

const initdrozone = (params) => {
    Dropzone.autoDiscover = false;
    var upload_multiple = false;
    var url = '/admin/admin-save-images/';
    var field_name = 'file';
    var file_accepted = '.png, .jpg, .jpeg, .svg';
    var element = '';
    var max_files = 1;
    var call_function;
    var count = '';
    var dictDefaultMessage;

    if (params.dictDefaultMessage){
        dictDefaultMessage = params.dictDefaultMessage
    }
    if (params.element) {
        element = '#' + params.element;
    }
    if (params.upload_multiple) {
        upload_multiple = params.upload_multiple;
    }
    if (params.url) {
        action_url = params.url;
    }
    if (params.field_name) {
        field_name = params.field_name;
    }
    if (params.file_accepted) {
        file_accepted = params.file_accepted;
    }
    if (params.call_function) {
        call_function = params.call_function;
    }
    if (params.max_files) {
        max_files = params.max_files;
    }
    if(params.count != "" && params.count != "undefined"){
        count = params.count;
    }

    var init_drozone = new Dropzone(element, {
        uploadMultiple: upload_multiple,
        url: action_url,
        paramName: field_name,
        acceptedFiles: file_accepted,
        dictDefaultMessage: (dictDefaultMessage)?dictDefaultMessage:'Drop files here to upload',
        maxFiles: max_files,
        init: function() {
            var drop = this; // Closure

            /*this.on('error', function(file, errorMessage) {

                drop.removeFile(file);
            });*/

            this.on("sending", function(file, xhr, formData) {
                file_size = parseFloat((file.size / (1024 * 1024)).toFixed(2));
                formData.append("file_length", drop.files.length);
                formData.append("file_size", file_size);
                // formData.append("site_id", $('#site_id').val());
            });
            if (upload_multiple === false) {
                this.on('success', function(file, response) {
                    count = parseInt(element.charAt(element.length-1));
                    if(count >= 0){
                        count = count;
                    }else{
                        count = '';
                    }
                    drop.removeFile(file);
                    custom_response = {
                        status: response.status,
                        uploaded_file_list: response.uploaded_file_list,
                        count: count,
                    }
                    customCallBackFunc(call_function, [custom_response]);

                });
            }
            if (upload_multiple) {
                this.on('successmultiple', function(file, response) {
                    count = parseInt(element.charAt(element.length-1));
                    if(count >= 0){
                        count = count;
                    }else{
                        count = '';
                    }
                    drop.removeFile(file);
                    custom_response = {
                        status: response.status,
                        uploaded_file_list: response.uploaded_file_list,
                        count: count,

                    }
                    customCallBackFunc(call_function, [custom_response]);
                });
            }

        }

    });
        $('#addArticle').parsley();
}


const delete_image = (params) => {
    var image_id = '';
    var image_name = '';
    var new_ids = '';
    var new_names = '';
    try {
        var agent_id = params.agent_id;
    } catch (ex) {
        var agent_id = '';
    }
    var section = params.section;
    var id = params.id;
    var name = params.name;
    var count = params.count;

   if (section == 'ad_image') {
       if (params.action == 'add'){
            image_id = $('#upload').val();
            image_name = $('#upload_name').val();
            new_ids = remove_string(image_id, id, ',');
            new_names = remove_string(image_name, name, ',');
            $('#upload').val(new_ids);
            $('#upload_name').val(new_names);
            if ($('#upload').val() == '') {
                $('#adImgDiv').hide();
            }
       } else if( params.action == 'edit'){
        image_id = $('#editUploadID').val();
        image_name = $('#editUploadName').val();
        new_ids = remove_string(image_id, id, ',');
        new_names = remove_string(image_name, name, ',');
        $('#editUploadID').val(new_ids);
        $('#editUploadName').val(new_names);
        if ($('#editUploadID').val() == '') {
            $('#editAdImgDiv').hide();
        }
       }
       
    }
    data = { 'article_id': '', 'image_id': id, 'image_name': name, 'section': section, 'agent_id': agent_id }
    console.log(data)
    $.ajax({
        url: '/admin/delete-images/',
        type: 'post',
        dateType: 'json',
        async: false,
        cache: false,
        data: data,
        beforeSend: function() {

        },
        success: function(response) {
            console.log(response);
            if (response.error == 0 || response.status == 200 || response.status == 201) {
                $('#confirmImageDeleteModal #popup_section').val('');
                $('#confirmImageDeleteModal #popup_image_id').val('');
                $('#confirmImageDeleteModal #popup_image_name').val('');
                $('#confirmImageDeleteModal #popup_count').val('');
                $('#confirmImageDeleteModal #popup_agent_id').val('');
                showAlert(response.msg, 0);

            } else {
                showAlert(response.msg, 1);
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
            $(".loaderDiv").hide();
            showAlert(msg, 1)
        }
    });
}


const customCallBackFunc = (callback, args) => {
    //do stuff
    //...
    //execute callback when finished
    callback.apply(this, args);
}


const set_ad_image = (response) => {
    var image_name = '';
    var upload_id = '';
    var actual_image = '';
    var actual_id = '';
    if (response.status == 200) {
        if (response.uploaded_file_list) {
            $.each(response.uploaded_file_list, function(i, item) {
                if (i == 0) {
                    if (item.file_name != "") {
                        image_name = item.file_name;
                        upload_id = item.upload_id.toString();
                    }
                } else {
                    if (item.file_name != "") {
                        image_name = image_name + ',' + item.file_name;
                        upload_id = upload_id + ',' + item.upload_id;
                    }
                }
                upload_to = item.upload_to;

            });
            actual_image = image_name.replace(/(^,)|(,$)/g, "");
            actual_id = upload_id.replace(/(^,)|(,$)/g, "");
            $('#upload_name').val(actual_image);
            $('#upload').val(actual_id);
            if (actual_image) {
                var author_img = aws_url + "ad_image/" + actual_image;
                $('#adImg').attr('src', author_img);
                $('#adImgDiv').show();
            }
            $('#adImgDiv .fav-icon a').attr({ 'data-image-id': actual_id, 'data-image-name': actual_image, 'data-image-section': upload_to, 'data-action': 'add' }).addClass('confirm_image_delete');

        }
    }
}


const set_edit_ad_image = (response) => {
    console.log(response)
    var image_name = '';
    var upload_id = '';
    var actual_image = '';
    var actual_id = '';
    if (response.status == 200) {
        if (response.uploaded_file_list) {
            $.each(response.uploaded_file_list, function(i, item) {
                if (i == 0) {
                    if (item.file_name != "") {
                        image_name = item.file_name;
                        upload_id = item.upload_id.toString();
                    }
                } else {
                    if (item.file_name != "") {
                        image_name = image_name + ',' + item.file_name;
                        upload_id = upload_id + ',' + item.upload_id;
                    }
                }
                upload_to = item.upload_to;

            });
            actual_image = image_name.replace(/(^,)|(,$)/g, "");
            actual_id = upload_id.replace(/(^,)|(,$)/g, "");
            $('#editUploadName').val(actual_image);
            $('#editUploadID').val(actual_id);
            if (actual_image) {
                var author_img = aws_url + "ad_image/" + actual_image;
                $('#editAdImg').attr('src', author_img);
                $('#editAdImgDiv').show();
            }
            $('#editAdImgDiv .fav-icon a').attr({ 'data-image-id': actual_id, 'data-image-name': actual_image, 'data-image-section': upload_to, 'data-action': 'edit'  }).addClass('confirm_image_delete');

        }
    }
}