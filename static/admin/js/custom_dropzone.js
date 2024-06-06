try{
    Dropzone.autoDiscover = false;
}catch(ex){
    //console.log(ex);
}
function initdrozone(params){
    Dropzone.autoDiscover = false;
    var upload_multiple = false;
    var url = '/admin/save-images/';
    var field_name = 'file';
    var file_accepted = '.png, .jpg, .jpeg, .svg';
    var element = '';
    var max_files = 1;
    var count = '';
    var call_function;
    if(params.element){
        element = '#'+params.element;
    }
    if(params.upload_multiple){
        upload_multiple = params.upload_multiple;
    }
    if(params.url){
        action_url = params.url;
    }
    if(params.field_name){
        field_name = params.field_name;
    }
    if(params.file_accepted){
        file_accepted = params.file_accepted;
    }
    if(params.call_function){
        call_function = params.call_function;
    }
    if(params.max_files){
        max_files = params.max_files;
    }
    default_message = '<i class="fa fa-upload" aria-hidden="true"></i> Upload File';
    if(params.default_message){
        default_message = params.default_message;
    }
    if(params.default_message){
        default_message = params.default_message;
    }
    if(params.count != "" && params.count != "undefined"){
        count = params.count;
    }
    if(upload_multiple === true){
        var init_drozone = new Dropzone(element, {
            uploadMultiple: upload_multiple,
            url: action_url,
            paramName: field_name,
            acceptedFiles: file_accepted,
            maxFiles: 100,
            //dictDefaultMessage: default_message,
            previewsContainer: element,
            parallelUploads: 4,
            init: function() {
                var drop = this; // Closure
                this.on("addedfiles", function (file) {
                    var total_uploaded = 0;
                    if(element == '#BannerImgFrm'){
                        var total_uploaded = parseInt($('#bannerImgList li').length);
                        var current_upload = drop.files.length;
                        var remain_upload = current_upload+total_uploaded;
                        if(remain_upload > 4){
                            this.removeAllFiles();
                            var error_msg = 'You can not upload more files.<br> Allowed file type: '+file_accepted+'. <br> Maximum '+max_files+' files can be uploaded.';
                            $.growl.error({title: "Upload error ", message: error_msg, size: 'large'});
                            $(element).removeClass('dz-started');
                            $(element).find('.dz-preview').remove();
                            drop.removeFile(file);
                        }
                    }

                });

                this.on("sending", function(file, xhr, formData){

                     file_size = parseFloat((file.size / (1024*1024)).toFixed(2));
                     formData.append("file_length", drop.files.length);
                     formData.append("file_size", file_size);
                });

                this.on('successmultiple', function(file, response) {
                   count = parseInt(element.charAt(element.length-1));
                   if(count >= 0){
                    count = count;
                   }else{
                    count = '';
                   }
                   //$(element).removeClass('dz-started');
                   //$(element).find('.dz-preview').remove();
                   //drop.removeFile(file);
                   custom_response = {
                        status: response.status,
                        uploaded_file_list: response.uploaded_file_list,
                        count: count,
                   }
                   customCallBackFunc(call_function, [custom_response]);
                });
                this.on("complete", function (file) {
                  if (this.getUploadingFiles().length === 0 && this.getQueuedFiles().length === 0) {
                    this.removeAllFiles();
                  }
                });

            }

        });
    }else{

        var init_drozone = new Dropzone(element, {
            uploadMultiple: upload_multiple,
            url: action_url,
            paramName: field_name,
            acceptedFiles: file_accepted,
            maxFiles: 1,
            //dictDefaultMessage: default_message,
            previewsContainer: element,
            init: function() {
                var drop = this; // Closure

                this.on('error', function(file, errorMessage) {
                    var error_msg = errorMessage+'<br> Allowed file type: '+file_accepted+'. <br> Maximum '+max_files+' files can be uploaded.';
                    $.growl.error({title: "Upload error ", message: error_msg, size: 'large'});
                    $(element).removeClass('dz-started');
                    $(element).find('.dz-preview').remove();
                    drop.removeFile(file);
                });

                this.on("sending", function(file, xhr, formData){

                     file_size = parseFloat((file.size / (1024*1024)).toFixed(2));
                     formData.append("file_length", drop.files.length);
                     formData.append("file_size", file_size);
                });
                this.on('success', function(file, response) {
                    count = parseInt(element.charAt(element.length-1));
                   if(count >= 0){
                    count = count;
                   }else{
                    count = '';
                   }
                   $(element).removeClass('dz-started');
                   $(element).find('.dz-preview').remove();
                   drop.removeFile(file);
                   custom_response = {
                        status: response.status,
                        uploaded_file_list: response.uploaded_file_list,
                        count: count,
                   }
                   customCallBackFunc(call_function, [custom_response]);

                });

                this.on("complete", function (file) {
                  if (this.getUploadingFiles().length === 0 && this.getQueuedFiles().length === 0) {
                    this.removeAllFiles();
                  }
                });

            }

        });
    }

}
function delete_image(params){
   var image_id = '';
   var image_name = '';
   var new_ids = '';
   var new_names = '';
   try{
        var article_id = params.article_id;
   }catch(ex){
        var article_id = '';
   }
   try{
        var agent_id = params.agent_id;
   }catch(ex){
        var agent_id = '';
   }
   try{
        var popup_user_id = params.popup_user_id;
   }catch(ex){
        var popup_user_id = '';
   }
   try{
        var loggedin_user_id = params.loggedin_user_id;
   }catch(ex){
        var loggedin_user_id = '';
   }
   try{
        var request_from = params.request_from;
   }catch(ex){
        var request_from = '';
   }
   var section = params.section;
   var id = params.id;
   var name = params.name;
   var count = params.count;
   var delete_for = params.delete_for;


    if(section == 'about_us_img'){
        image_id = $('#about_us_image_id').val();
        image_name = $('#about_us_image_name').val();
        new_ids = remove_string(image_id,id,',');
        new_names = remove_string(image_name,name,',');
        $('li[rel_id="'+id+'"]').remove();
        $('#about_us_image_id').val(new_ids);
        $('#about_us_image_name').val(new_names);
        if($('#about_us_image_id').val() == ''){
            $('#aboutUsImgDiv').hide();
        }

   }else if(section == 'banner_img'){
        image_id = $('#banner_image_id').val();
        image_name = $('#banner_image_name').val();
        new_ids = remove_string(image_id,id,',');
        new_names = remove_string(image_name,name,',');
        $('li[rel_id="'+id+'"]').remove();
        $('#banner_image_id').val(new_ids);
        $('#banner_image_name').val(new_names);
        if($('#banner_image_id').val() == ''){
            $('#bannerImgDiv').hide();
        }
   }else if(section == 'company_partner_img'){
        image_id = $('#footer_company_parter_logo_id').val();
        image_name = $('#footer_company_parter_logo_name').val();
        new_ids = remove_string(image_id,id,',');
        new_names = remove_string(image_name,name,',');
        $('li[rel_id="'+id+'"]').remove();
        $('#footer_company_parter_logo_id').val(new_ids);
        $('#footer_company_parter_logo_name').val(new_names);
        if($('#footer_company_parter_logo_id').val() == ''){
            $('#footerCompanyImgDiv').hide();
        }
   }else if(section == 'favicons'){
        image_id = $('#favicon_img_id').val();
        image_name = $('#favicon_img_name').val();
        new_ids = remove_string(image_id,id,',');
        new_names = remove_string(image_name,name,',');
        $('#favicon_img_id').val(new_ids);
        $('#favicon_img_name').val(new_names);
        if($('#favicon_img_id').val() == ''){
            $('#favIconImg').hide();
            $('#faviconDelBtn').hide();
        }
   }else if(section == 'website_logo'){
        image_id = $('#website_logo_id').val();
        image_name = $('#website_logo_name').val();
        new_ids = remove_string(image_id,id,',');
        new_names = remove_string(image_name,name,',');
        $('#website_logo_id').val(new_ids);
        $('#website_logo_name').val(new_names);
        if($('#website_logo_id').val() == ''){
            $('#websiteLogoImg').hide();
            $('#websiteLogoDelBtn').hide();
        }
   }else if(section == 'testimonial_img'){
        image_id = $('#article_image_id').val();
        image_name = $('#article_image_name').val();
        new_ids = remove_string(image_id,id,',');
        new_names = remove_string(image_name,name,',');
        $('#article_image_id').val(new_ids);
        $('#article_image_name').val(new_names);
        if($('#article_image_id').val() == ''){
            $('#articleImg').hide();
            $('#articleDelImgBtn').hide();
        }
   }else if(section == 'testimonial_author_img'){
        image_id = $('#article_author_image_id').val();
        image_name = $('#article_author_image_name').val();
        new_ids = remove_string(image_id,id,',');
        new_names = remove_string(image_name,name,',');
        $('#article_author_image_id').val(new_ids);
        $('#article_author_image_name').val(new_names);
        if($('#article_author_image_id').val() == ''){
            $('#articleAuthorImg').hide();
            $('#articleAuthorDelImgBtn').hide();
        }
   }else if(section == 'profile_image'){
        if(request_from == "personalModal" && loggedin_user_id != ""){
            image_id = $('#loggedin_user_img_id').val();
            image_name = $('#loggedin_user_img_name').val();
            new_ids = remove_string(image_id,id,',');
            new_names = remove_string(image_name,name,',');
            $('#loggedin_user_img_id').val(new_ids);
            $('#loggedin_user_img_name').val(new_names);
            if($('#loggedin_user_img_id').val() == ''){
                $('#loggedInUserImgDiv').hide();
            }
        }else if(typeof($('#agent_img_id').val()) != "undefined" && $('#agent_img_id').val() != ""){

            image_id = $('#agent_img_id').val();
            image_name = $('#agent_img_name').val();
            new_ids = remove_string(image_id,id,',');
            new_names = remove_string(image_name,name,',');
            $('#agent_img_id').val(new_ids);
            $('#agent_img_name').val(new_names);
            if($('#agent_img_id').val() == ''){
                $('#agentImageDiv').hide();
            }
        }else{
            image_id = $('#user_img_id').val();
            image_name = $('#user_img_name').val();
            new_ids = remove_string(image_id,id,',');
            new_names = remove_string(image_name,name,',');
            $('#user_img_id').val(new_ids);
            $('#user_img_name').val(new_names);
            if($('#user_img_id').val() == ''){
                $('#editUserImg').hide();
                $('#editUserImageDelBtn').hide();
            }
        }

   }else if(section == 'home_auctioin'){
        image_id = $('#auction_image_id_'+count).val();
        image_name = $('#auction_image_name_'+count).val();
        new_ids = remove_string(image_id,id,',');
        new_names = remove_string(image_name,name,',');
        $('#auction_image_id_'+count).val(new_ids);
        $('#auction_image_name_'+count).val(new_names);
        if($('#auction_image_id_'+count).val() == ''){
            $('#auctionTypeImgDiv'+count).hide();
        }
   }else if(section == 'home_expertise'){
        image_id = $('#expertise_image_id_'+count).val();
        image_name = $('#expertise_image_name_'+count).val();
        new_ids = remove_string(image_id,id,',');
        new_names = remove_string(image_name,name,',');
        $('#expertise_image_id_'+count).val(new_ids);
        $('#expertise_image_name_'+count).val(new_names);
        if($('#expertise_image_id_'+count).val() == ''){
            $('#expertiseImgDiv'+count).hide();
        }
   }else if(section == 'property_image'){
        image_id = $('#property_image_id').val();
        image_name = $('#property_image_name').val();
        new_ids = remove_string(image_id,id,',');
        new_names = remove_string(image_name,name,',');
        $('li[rel_id="'+id+'"]').remove();
        $('#property_image_id').val(new_ids);
        $('#property_image_name').val(new_names);
        if($('#property_image_id').val() == ''){
            $('#PropertyImgDiv').hide();
        }
   }else if(section == 'property_document'){
        image_id = $('#property_doc_id').val();
        image_name = $('#property_doc_name').val();
        new_ids = remove_string(image_id,id,',');
        new_names = remove_string(image_name,name,',');
        $('li[rel_id="'+id+'"]').remove();
        $('#property_doc_id').val(new_ids);
        $('#property_doc_name').val(new_names);
        if($('#property_doc_id').val() == ''){
            $('#PropertyDocDiv').hide();
        }
   }else if(section == 'property_video'){
        image_id = $('#property_video_id').val();
        image_name = $('#property_video_name').val();
        new_ids = remove_string(image_id,id,',');
        new_names = remove_string(image_name,name,',');
        $('li[rel_id="'+id+'"]').remove();
        $('#property_video_id').val(new_ids);
        $('#property_video_name').val(new_names);
        if($('#property_video_id').val() == ''){
            $('#PropertyVideoDiv').hide();
        }
   }else if(section == 'company_logo' && request_from == ''){

        image_id = $('#agent_logo_img_id').val();
        image_name = $('#agent_logo_img_name').val();
        new_ids = remove_string(image_id,id,',');
        new_names = remove_string(image_name,name,',');
        $('#agent_logo_img_id').val(new_ids);
        $('#agent_logo_img_name').val(new_names);
        if($('#agent_logo_img_id').val() == ''){
            $('#agentLogoImageDiv').hide();
        }
    }else if(section == 'company_logo' && request_from == 'business_info'){

        image_id = $('#business_logo_img_id').val();
        image_name = $('#business_logo_img_name').val();
        new_ids = remove_string(image_id,id,',');
        new_names = remove_string(image_name,name,',');
        $('#business_logo_img_id').val(new_ids);
        $('#business_logo_img_name').val(new_names);
        if($('#business_logo_img_id').val() == ''){
            $('#businessLogoImageDiv').hide();
        }
    }else if(section == 'portfolio' && request_from == ''){

        image_id = $('#portfolio_image_id').val();
        image_name = $('#portfolio_image_name').val();
        new_ids = remove_string(image_id,id,',');
        new_names = remove_string(image_name,name,',');
        $('li[rel_id="'+id+'"]').remove();
        $('#portfolio_image_id').val(new_ids);
        $('#portfolio_image_name').val(new_names);
        if($('#portfolio_image_id').val() == ''){
            $('#portfolioImgDiv').hide();
        }
    }
   data = {'article_id': article_id, 'image_id': id, 'image_name': name, 'section': section, 'agent_id': agent_id, 'user_id': popup_user_id, loggedin_user_id: loggedin_user_id, request_from: request_from, delete_for: delete_for}
    if(name && section && id){
        $.ajax({
            url: '/admin/delete-images/',
            type: 'post',
            dateType: 'json',
            async: false,
            cache: false,
            data: data,
            beforeSend: function(){
                $('.overlay').show();
            },
            success: function(response){
                $('.overlay').hide();
                var title = '';
                var msg = '';
                if(response.error == 0){
                    if(section == 'property_video'){
                        title = 'Delete Video';
                        msg = 'Video deleted successfully';
                    }else if(section == 'property_document'){
                        title = 'Delete Document';
                        msg = 'Document deleted successfully';
                    }else if(section == 'banner_img'){
                        title = 'Delete Image';
                        $('#BannerImgFrm').removeClass('dz-max-files-reached');
                        msg = 'Deleted Successfully';
                    }else{
                        title = 'Delete Image';
                        msg = response.msg;
                    }
                }else{
                    if(section == 'property_video'){
                        title = 'Delete Video';
                    }else if(section == 'property_document'){
                        title = 'Delete Document';
                    }else{
                        title = 'Delete Image';

                    }
                    msg = response.msg;
                }

                if(response.error == 0 || response.status == 200 || response.status == 201){
                    $('#confirmImageDeleteModal #popup_article_id').val('');
                    $('#confirmImageDeleteModal #popup_section').val('');
                    $('#confirmImageDeleteModal #popup_image_id').val('');
                    $('#confirmImageDeleteModal #popup_image_name').val('');
                    $('#confirmImageDeleteModal #popup_count').val('');
                    $('#confirmImageDeleteModal #popup_agent_id').val('');
                    $.growl.notice({title: title, message: msg, size: 'large'});


                }else{
                    window.setTimeout(function () {
                        $.growl.error({title: title, message: msg, size: 'large'});
                    }, 2000);
                }
            }
        });
    }

}