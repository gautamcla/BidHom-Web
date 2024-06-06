var cropped = false;
let myDropzone = '';

$(function() {
    window.Cropper;

    try{
        initdrozone({
            url: '/admin/save-images/',
            field_name: 'agent_image',
            file_accepted: '.png, .jpg, .jpeg, .svg',
            element: 'uploadAgentImgFrm',
            upload_multiple: false,
            max_files: 1,
            call_function: set_agent_details
        });
    }catch(ex){
        console.log(ex);
    }

    // delete user profile image
    $(document).on('click', '.confirm_image_delete', function(e) {
        e.preventDefault();
        var data_count = '';
        var data_article_id = '';
        var agent_id = '';
        var section = $(this).attr('data-image-section');
        var image_id = $(this).attr('data-image-id');
        var image_name = $(this).attr('data-image-name');
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
        delete_image({
            article_id: article_id,
            section: section,
            id: id,
            name: name,
            count: count,
            agent_id: agent_id,
        });
        $('#confirmImageDeleteModal').modal('hide');
    })

    .on('click', '.rotate-right', function() {
        $('.img-profile').cropper('rotate', 90);
    })
    .on('click', '.rotate-left', function() {
        $('.img-profile').cropper('rotate', -90);
    })
    .on('click', '.reset', function() {
        $('.img-profile').cropper('reset');
    })
    .on('click', '.scale-x', function() {
        if (!$('.img-profile').data('horizontal-flip')) {
        $('.img-profile').cropper('scale', -1, 1);
        $('.img-profile').data('horizontal-flip', true);
        } else {
        $('.img-profile').cropper('scale', 1, 1);
        $('.img-profile').data('horizontal-flip', false);
        }
    })
    .on('click', '.scale-y', function() {
        if (!$('.img-profile').data('vertical-flip')) {
        $('.img-profile').cropper('scale', 1, -1);
        $('.img-profile').data('vertical-flip', true);
        } else {
        $('.img-profile').cropper('scale', 1, 1);
        $('.img-profile').data('vertical-flip', false);
        }
    })
});

const initdrozone = (params) => {
    Dropzone.autoDiscover = false;
    var upload_multiple = false;
    var url = '/admin/save-images/';
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

    myDropzone = new Dropzone(element, {
        uploadMultiple: upload_multiple,
        url: action_url,
        paramName: field_name,
        acceptedFiles: file_accepted,
        dictDefaultMessage: (dictDefaultMessage)?dictDefaultMessage:'Drop files here to upload',
        maxFiles: max_files,
        autoProcessQueue : false,
        createImageThumbnails: true,
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

            // listen to thumbnail event
            this.on('thumbnail', function (file) {
                // ignore files which were already cropped and re-rendered
                // to prevent infinite loop
                if (file.cropped) {
                    return;
                }
                // cache filename to re-assign it to cropped file
                var cachedFilename = file.name;
                // remove not cropped file from dropzone (we will replace it later)
                myDropzone.removeFile(file);

                // dynamically create modals to allow multiple files processing
                var loadedFilePath = getSrcImageFromBlob(file);

                // @formatter:off
                var modalTemplate =
                '<div class="modal fade" tabindex="-1" role="dialog">' +
                '<div class="modal-dialog" role="document">' +
                '<div class="modal-content">' +
                '<div class="modal-header">' +
                '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><i class="fa fa-times" aria-hidden="true"></i></button>' +
                '</div>' +
                '<div class="modal-body">' +
                '<div class="cropper-container cropper-bg">' +
                '<img class="img-profile" src="' + loadedFilePath + '"data-vertical-flip="false" data-horizontal-flip="false">' +
                '</div>' +
                '</div>' +
                '<div class="modal-footer">' +
                '<button type="button" class="btn btn-warning rotate-left"><span class="fa fa-rotate-left"></span></button>' +
                '<button type="button" class="btn btn-warning rotate-right"><span class="fa fa-rotate-right"></span></button>' +
                '<button type="button" class="btn btn-warning scale-x" data-value="-1"><span class="fa fa-arrows-h"></span></button>' +
                '<button type="button" class="btn btn-warning scale-y" data-value="-1"><span class="fa fa-arrows-v"></span></button>' +
                '<button type="button" class="btn btn-warning reset"><span class="fa fa-refresh"></span></button>' +
                '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
                '<button type="button" class="btn btn-primary crop-upload">Crop & upload</button>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '</div>';
                // @formatter:on
                var $cropperModal = $(modalTemplate);
                var $img = $cropperModal.find('.img-profile');

                // 'Crop and Upload' button in a modal
                var $uploadCrop = $cropperModal.find('.crop-upload');
                
                $cropperModal.modal('show').on("shown.bs.modal", function() {
                    var cropper = $img.cropper({
                        autoCropArea: 1,
                        aspectRatio: 1 / 1,
                        cropBoxResizable: false,
                        movable: true,
                        rotatable: true,
                        scalable: true,
                        viewMode: 2,
                        minContainerWidth: 250,
                        maxContainerWidth: 250
                    })

                    .on('hidden.bs.modal', function() {
                        $img.cropper('destroy');
                    });

                    // listener for 'Crop and Upload' button in modal
                    $uploadCrop.on('click', function(e) {
                        e.preventDefault();
                        console.log('file laod')
                        // get cropped image data
                        var blob = $img.cropper('getCroppedCanvas').toDataURL();
                        // transform it to Blob object
                        var newFile = dataURItoBlob(blob);
                        // set 'cropped to true' (so that we don't get to that listener again)
                        newFile.cropped = true;
                        // assign original filename
                        newFile.name = cachedFilename;

                        // add cropped file to dropzone
                        myDropzone.addFile(newFile);
                        // upload cropped file with dropzone
                        myDropzone.processQueue();
                        $cropperModal.modal('hide');
                    });
                });

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
    $('#addUser').parsley();
}

const customCallBackFunc = (callback, args) => {
    //do stuff
    //...
    //execute callback when finished
    callback.apply(this, args);
}

const set_agent_details = (response) => {

    if(response.status == 200){
        var image_name = '';
        var actual_image = '';
        var upload_id = '';
        var actual_id = '';
        var upload_to = '';
        if(response.uploaded_file_list){
            $.each(response.uploaded_file_list, function(i, item) {
                if(i==0){
                    if(item.file_name != ""){
                        image_name = item.file_name;
                        upload_id = item.upload_id.toString();
                    }
                }else{
                    if(item.file_name != ""){
                        image_name = image_name+','+item.file_name;
                        upload_id = upload_id+','+item.upload_id;
                    }
                }
                upload_to = item.upload_to;

            });
            actual_image = image_name.replace(/(^,)|(,$)/g, "");
            actual_id = upload_id.replace(/(^,)|(,$)/g, "");
            $('#agent_img_name').val(actual_image);
            $('#agent_img_id').val(actual_id);
            if(actual_image){
                var testi_img = aws_url+"profile_image/"+actual_image;
                $('#agentImageId').attr('src', testi_img);
                $('#agentImageDiv').show();
            }
            $('#agentImageDiv .fav-icon a').attr({ 'data-image-id': $('#agent_img_id').val(), 'data-image-name':$('#agent_img_name').val(), 'data-image-section': upload_to, 'data-count': '' }).addClass('confirm_image_delete');
        }
    }
}

const delete_image = (params) => {
    var image_id = '';
    var image_name = '';
    var new_ids = '';
    var new_names = '';
    try {
        var article_id = params.article_id;
    } catch (ex) {
        var article_id = '';
    }
    try {
        var agent_id = params.agent_id;
    } catch (ex) {
        var agent_id = '';
    }
    var section = params.section;
    var id = params.id;
    var name = params.name;
    var count = params.count;


    if (section == 'about_us_img') {
        image_id = $('#about_us_image_id').val();
        image_name = $('#about_us_image_name').val();
        new_ids = remove_string(image_id, id, ',');
        new_names = remove_string(image_name, name, ',');
        $('li[rel_id="' + id + '"]').remove();
        $('#about_us_image_id').val(new_ids);
        $('#about_us_image_name').val(new_names);
        if ($('#about_us_image_id').val() == '') {
            $('#aboutUsImgDiv').hide();
        }

    } else if (section == 'banner_img') {
        image_id = $('#banner_image_id').val();
        image_name = $('#banner_image_name').val();
        new_ids = remove_string(image_id, id, ',');
        new_names = remove_string(image_name, name, ',');
        $('div[rel_id="' + id + '"]').remove();
        $('#banner_image_id').val(new_ids);
        $('#banner_image_name').val(new_names);
        if ($('#banner_image_id').val() == '') {
            $('#bannerImgDiv').hide();
        }
    } else if (section == 'company_partner_img') {
        image_id = $('#footer_company_parter_logo_id').val();
        image_name = $('#footer_company_parter_logo_name').val();
        new_ids = remove_string(image_id, id, ',');
        new_names = remove_string(image_name, name, ',');
        $('div[rel_id="' + id + '"]').remove();
        $('#footer_company_parter_logo_id').val(new_ids);
        $('#footer_company_parter_logo_name').val(new_names);
        if ($('#footer_company_parter_logo_id').val() == '') {
            $('#footerCompanyImgDiv').hide();
        }
    } else if (section == 'favicons') {
        image_id = $('#favicon_img_id').val();
        image_name = $('#favicon_img_name').val();
        new_ids = remove_string(image_id, id, ',');
        new_names = remove_string(image_name, name, ',');
        $('#favicon_img_id').val(new_ids);
        $('#favicon_img_name').val(new_names);
        if ($('#favicon_img_id').val() == '') {
            $('#favIconImgDiv').hide();
        }
    } else if (section == 'website_logo') {
        image_id = $('#website_logo_id').val();
        image_name = $('#website_logo_name').val();
        new_ids = remove_string(image_id, id, ',');
        new_names = remove_string(image_name, name, ',');
        $('#website_logo_id').val(new_ids);
        $('#website_logo_name').val(new_names);
        if ($('#website_logo_id').val() == '') {
            $('#websiteLogoImgDiv').hide();
        }
    } else if (section == 'testimonial_img') {
        image_id = $('#testimonial_image_id_' + count).val();
        image_name = $('#testimonial_image_name_' + count).val();
        new_ids = remove_string(image_id, id, ',');
        new_names = remove_string(image_name, name, ',');
        $('#testimonial_image_id_' + count).val(new_ids);
        $('#testimonial_image_name_' + count).val(new_names);
        if ($('#testimonial_image_id_' + count).val() == '') {
            $('#testimonialImgDiv_' + count).hide();
        }
    } else if (section == 'testimonial_author_img') {
        image_id = $('#testimonial_author_image_id_' + count).val();
        image_name = $('#testimonial_author_image_name_' + count).val();
        new_ids = remove_string(image_id, id, ',');
        new_names = remove_string(image_name, name, ',');
        $('#testimonial_author_image_id_' + count).val(new_ids);
        $('#testimonial_author_image_name_' + count).val(new_names);
        if ($('#testimonial_author_image_id_' + count).val() == '') {
            $('#testimonialAuthorImgDiv_' + count).hide();
        }
    } else if (section == 'profile_image') {
        image_id = $('#agent_img_id').val();
        image_name = $('#agent_img_name').val();
        new_ids = remove_string(image_id, id, ',');
        new_names = remove_string(image_name, name, ',');
        $('#agent_img_id').val(new_ids);
        $('#agent_img_name').val(new_names);
        if ($('#agent_img_id').val() == '') {
            $('#agentImageDiv').hide();
        }
    } else if(section == 'home_auctioin'){
        image_id = $('#auction_image_id_'+count).val();
        image_name = $('#auction_image_name_'+count).val();
        console.log(image_id)
        console.log(image_name)
        new_ids = remove_string(image_id,id,',');
        new_names = remove_string(image_name,name,',');
        $('#auction_image_id_'+count).val(new_ids);
        $('#auction_image_name_'+count).val(new_names);
        if($('#auction_image_id_'+count).val() == ''){
            $('#auctionTypeImgDiv'+count).hide();
        }
    } else if(section == 'home_expertise'){
        image_id = $('#expertise_image_id_'+count).val();
        image_name = $('#expertise_image_name_'+count).val();
        new_ids = remove_string(image_id,id,',');
        new_names = remove_string(image_name,name,',');
        $('#expertise_image_id_'+count).val(new_ids);
        $('#expertise_image_name_'+count).val(new_names);
        if($('#expertise_image_id_'+count).val() == ''){
            $('#expertiseImgDiv'+count).hide();
        }
    }
    data = { 'article_id': article_id, 'image_id': id, 'image_name': name, 'section': section, 'agent_id': agent_id }
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
                $('#confirmImageDeleteModal #popup_article_id').val('');
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

// transform cropper dataURI output to a Blob which Dropzone accepts
function dataURItoBlob(dataURI) {
    var byteString = atob(dataURI.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: 'image/jpeg' });
}

function getSrcImageFromBlob(blob) {
    var urlCreator = window.URL || window.webkitURL;
    return urlCreator.createObjectURL(blob);
}
//  const remove_string = (list, value, separator) => {
//     separator = separator || ",";
//     var values = list.split(separator);
//     for (var i = 0; i < values.length; i++) {
//         if (values[i] == value) {
//             values.splice(i, 1);
//             return values.join(separator);
//         }
//     }
//     return list;
// }