$(function() {

    Dropzone.autoDiscover = false;


    setTimeout(function() {
        $(".alert").hide();
    }, 3000);

    /* tooltip image enbale */
    $('.customToolTip').tooltip({
        animated: 'fade',
        placement: 'right',
        html: true,
        track: true
    }).on("mouseenter", function () {
        var $this = $(this),
        tooltip = $this.next(".tooltip");
        tooltip.find(".tooltip-inner").css({
            maxWidth: "100%"
        });
    });


    $('.expertise_icon_dropdown').selectize({
        create: false,
        sortField: 'text',
        valueField: 'id',
        labelField: 'name',
        searchField: ['name'],
        placeholder: 'Select Icon',
        render: {
            option: function (item, escape) {
                return '<div class="option">' +
                        '<span class="'+ escape(item.icon_name) +'"/></span>' +
                    '</div>';
            }
        }
    });

    // init selectize
    $('.expertise_icon_type').selectize({
        create: false,
        sortField: 'text'
    });
    // check select all check on auction type and expertise
    check_auction();
    check_expertise();


    // init tinymce to  description
    tinymce.init({
        selector: 'textarea',
        height: 350,
        menubar: 'file edit view insert format tools table help',
        plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount'
        ],
        toolbar: 'undo redo | formatselect | ' +
            'bold italic backcolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        setup: function(ed) {
            ed.on('keyup', function(e) {
                tinyMCE.triggerSave();

            });
        }
    });

    $('#website_setting_form').parsley();

    initdrozone({
        url: '/admin/save-images/',
        field_name: 'favicon_image',
        file_accepted: '.png, .jpg, .jpeg, .svg',
        element: 'faviconImgFrm',
        upload_multiple: false,
        dictDefaultMessage : 'Drop files here to upload <br> Preferred size 32 X 32 px',
        max_files: 1,
        call_function: set_favicon_details
    });

    initdrozone({
        url: '/admin/save-images/',
        field_name: 'website_logo',
        file_accepted: '.png, .jpg, .jpeg, .svg',
        element: 'websiteLogoFrm',
        upload_multiple: false,
        dictDefaultMessage : 'Drop files here to upload <br> Preferred size 226 X 76 px',
        max_files: 1,
        call_function: set_logo_details
    });

    initdrozone({
        url: '/admin/save-images/',
        field_name: 'banner_img',
        file_accepted: '.png, .jpg, .jpeg, .svg',
        element: 'BannerImgFrm',
        upload_multiple: true,
        dictDefaultMessage : 'Drop files here to upload <br> Preferred size 1920 X 1080 px',
        max_files: 4,
        call_function: set_banner_details
    });

    initdrozone({
        url: '/admin/save-images/',
        field_name: 'company_partner_img',
        file_accepted: '.png, .jpg, .jpeg, .svg',
        element: 'footerCompanyImgFrm',
        upload_multiple: true,
        max_files: 4,
        dictDefaultMessage : 'Drop files here to upload <br> Preferred size 190 X 78 px',
        call_function: set_footer_image_details
    });

    $('.auctionTypeImgFrm').each(function(index){
        try{
            initdrozone({
                url: '/admin/save-images/',
                field_name: 'home_auction_image',
                file_accepted: '.png, .jpg, .jpeg, .svg',
                element: "auctionTypeImgFrm"+index,
                upload_multiple: false,
                max_files: 1,
                call_function: set_auction_section_details,
                dictDefaultMessage : 'Drop files here to upload <br> Preferred size 400 X 500  px',
                count: index,
            });
        }catch(ex){
            console.log(ex);
        }

    });

//     $('.expertiseTypeImgFrm').each(function(index){
//         try{
//             initdrozone({
//                 url: '/admin/save-images/',
//                 field_name: 'expertise_image',
//                 file_accepted: '.png, .jpg, .jpeg, .svg',
//                 element: "expertiseTypeImgFrm"+index,
//                 upload_multiple: false,
//                 max_files: 1,
//                 call_function: set_expertise_section_details,
//                 count: index,
//                 dictDefaultMessage : 'Drop files here to upload <br> Preferred size 400 X 500  px',
//             });
//         }catch(ex){
//             console.log(ex);
//         }

//    });


    $("#domain_name").blur(function(e) {
        e.preventDefault();
        $(this).parsley().removeError("myCustomError");
        // check if the value is already current one
        if (this.value == '' || this.value == domain_name && $(this).attr('id') == 'domain_name') {
            return false
        }
        check_user_exists(domain_name=this.value, element=$(this))
    });

    $(document).on('click', ".add_more", function(e) {
        e.preventDefault();
        var new_div = $(".add_more_div:last").clone().insertAfter(".add_more_div:last");
        var count = new_div.find('.sec_count').val();
        new_div.find('#cke_testimonial_description_' + count).remove();
        count++;
        $(".plus_div").hide();
        $(".plus_div:last").show();
        $(".minus_div").show();
        $(".minus_div:last").hide();

        new_div.find(".testimonial_title").attr('id', 'testimonial_title_' + count).attr('name', 'testimonial_title_' + count).siblings('label').attr('for', 'testimonial_title_' + count).val('');
        //new_div.find(".testimonial_title").siblings('label').attr('for', 'testimonial_title_' + count).val('');
        new_div.find(".author_name").attr('id', 'author_name_' + count).attr('name', 'author_name_' + count).siblings('label').attr('for', 'author_name_' + count).val('');
        new_div.find(".sec_count").attr('id', 'sec_count_' + count);
        new_div.find(".testimonial_description").attr('id', 'testimonial_description_' + count).attr('name', 'testimonial_description_' + count).siblings('.clearfix').find('label').attr('for', 'testimonial_description_' + count).val('');
        //new_div.find(".testimonial_description").siblings('label').attr('for', 'testimonial_description_' + count).val('');
        new_div.find(".testimonialImgFrm").attr('id', 'testimonialImgFrm_' + count).val('');
        new_div.find(".testimonialAuthorImgFrm").attr('id', 'testimonialAuthorImgFrm_' + count).val('');
        new_div.find(".testimonial_image_div").attr('id', 'testimonial_image_div_' + count).attr('name', 'testimonial_image_div_' + count).val('');
        new_div.find(".testimonial_image_name").attr('id', 'testimonial_image_name_' + count).attr('name', 'testimonial_image_name_' + count).val('');

        new_div.find(".testimonial_author_image_div").attr('id', 'testimonial_author_image_div_' + count).attr('name', 'testimonial_author_image_div_' + count).val('');
        new_div.find(".testimonial_author_image_name").attr('id', 'testimonial_author_image_name_' + count).attr('name', 'testimonial_author_image_name_' + count).val('');

        new_div.find(".testimonialImgDiv").attr('id', 'testimonialImgDiv_' + count).hide().val('');
        new_div.find(".testimonialImg").attr('id', 'testimonialImg_' + count).val('');
        new_div.find(".testimonialAuthorImgDiv").attr('id', 'testimonialAuthorImgDiv_' + count).hide().val('');
        new_div.find(".testimonialAuthorImg").attr('id', 'testimonialAuthorImg_' + count).val('');
        new_div.find(".testimonial_image_id").attr('id', 'testimonial_image_id_' + count).attr('name', 'testimonial_image_id_' + count).val('');
        new_div.find(".testimonial_author_image_id").attr('id', 'testimonial_author_image_id_' + count).attr('name', 'testimonial_author_image_id_' + count).val('');

        $('#testimonialImgFrm_' + count).removeClass('dz-started dz-max-files-reached');
        $('#testimonialAuthorImgFrm_' + count).removeClass('dz-started dz-max-files-reached');
        $('#testimonialImgFrm_' + count).find('.dz-preview').remove();
        $('#testimonialAuthorImgFrm_' + count).find('.dz-preview').remove();

        $('#testimonial_title_' + count).val();
        $('#author_name_' + count).val();
        $('#testimonial_description_' + count).val();
        $('#testimonialAuthorImgDiv_' + count).hide();
        $('#testimonialImgDiv_' + count).hide();


        var myDropzone = new Dropzone("#testimonialImgFrm_" + count, {
            url: "/admin/save-images/",
            paramName: 'testimonial_img',
            acceptedFiles: '.png, .jpg, .jpeg, .svg',
            maxFiles: 1,
            init: function() {
                var drop = this; // Closure
                /*this.on('error', function(file, errorMessage) {

                    drop.removeFile(file);
                });*/
                this.on("sending", function(file, xhr, formData) {
                    file_size = parseFloat((file.size / (1024 * 1024)).toFixed(2));
                    formData.append("file_length", drop.files.length);
                    formData.append("file_size", file_size);
                    formData.append("site_id", $('#site_id').val());

                });
                this.on('success', function(file, message) {
                    /*if (drop.files.length > 1) {
                        drop.removeFile(drop.files[0]);
                    }*/
                    drop.removeFile(file);
                });
            },
            success: function(file, response) {
                cnt = parseInt(count) - 1;
                var image_name = '';
                var upload_id = '';
                var actual_image = '';
                var actual_id = '';
                var testimonial_image_name = $('#testimonial_image_name_' + cnt).val();
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
                        });
                        actual_image = image_name.replace(/(^,)|(,$)/g, "");
                        actual_id = upload_id.replace(/(^,)|(,$)/g, "");

                        // console.log('#testimonial_image_name_' + cnt);

                        $('#testimonial_image_name_' + cnt).val(actual_image);
                        $('#testimonial_image_id_' + cnt).val(actual_id);
                        if (actual_image) {
                            var testi_img = aws_url + "testimonial_img/" + actual_image;
                            $('#testimonialImg_' + cnt).attr('src', testi_img);
                            $('#testimonialImgDiv_' + cnt).show();
                        }
                    }
                }
            }
        });
        var myDropzone1 = new Dropzone("#testimonialAuthorImgFrm_" + count, {
            url: "/admin/save-images/",
            paramName: 'testimonial_author_img',
            acceptedFiles: '.png, .jpg, .jpeg, .svg',
            maxFiles: 1,
            init: function() {
                var drop = this; // Closure
                this.on('error', function(file, errorMessage) {
                    drop.removeFile(file);
                });
                this.on("sending", function(file, xhr, formData) {
                    file_size = parseFloat((file.size / (1024 * 1024)).toFixed(2));
                    formData.append("file_length", drop.files.length);
                    formData.append("file_size", file_size);
                    formData.append("site_id", $('#site_id').val());

                });
                this.on('success', function(file, message) {
                    /*if (drop.files.length > 1) {
                        drop.removeFile(drop.files[0]);
                    }*/
                    drop.removeFile(file);
                });
            },
            success: function(file, response) {
                cnt = parseInt(count) - 1;
                var image_name = '';
                var upload_id = '';
                var actual_image = '';
                var actual_id = '';
                var testimonial_image_name = $('#testimonial_author_image_name_' + cnt).val();
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
                        });
                        actual_image = image_name.replace(/(^,)|(,$)/g, "");
                        actual_id = upload_id.replace(/(^,)|(,$)/g, "");
                        $('#testimonial_author_image_name_' + cnt).val(actual_image);
                        $('#testimonial_author_image_id_' + cnt).val(actual_id);
                        if (actual_image) {
                            var author_img = aws_url + "testimonial_author_img/" + actual_image;
                            $('#testimonialAuthorImg_' + cnt).attr('src', author_img);
                            $('#testimonialAuthorImgDiv_' + cnt).show();
                        }
                    }
                }
            }
        });
        new_div.find('.sec_count').val(count);
        count = count + 1
        $('#total_section').val(count);
    })

    .on("click", '.remove', function(event) {
        event.preventDefault();
        $(this).closest(".add_more_div").remove();
        var total_section = $('div.add_more_div').length;

        $(".add_more_div").each(function(index) {
            //$(this).find('#cke_testimonial_description_'+index).remove();
            $(this).find('.sec_count').attr('id', 'sec_count_' + index).val(index);
            $(this).find('.testimonial_title').attr('id', 'testimonial_title_' + index).attr('name', 'testimonial_title_' + index).siblings('label').attr('for', 'testimonial_title_' + index);
            $(this).find('.testimonial_description').attr('id', 'testimonial_description_' + index).attr('name', 'testimonial_description_' + index).siblings('label').attr('for', 'testimonial_description_' + index);
            $(this).find('.testimonialImgFrm').attr('id', 'testimonialImgFrm_' + index);
            $(this).find('.testimonial_image_id').attr('id', 'testimonial_image_id_' + index).attr('name', 'testimonial_image_id_' + index);
            $(this).find('.testimonial_image_name').attr('id', 'testimonial_image_name_' + index).attr('name', 'testimonial_image_name_' + index);
            $(this).find('.testimonial_image_div').attr('id', 'testimonial_image_div_' + index).attr('name', 'testimonial_image_div_' + index);
            $(this).find('.testimonialImgDiv').attr('id', 'testimonialImgDiv_' + index);
            //$(this).find('.testimonialImgDiv').attr('id','testimonialImgDiv_'+count).attr('name','testimonial_image_div_'+count).siblings('label').attr('for','testimonial_description_'+count);
            $(this).find('.author_name').attr('id', 'author_name_' + index).attr('name', 'author_name_' + index).siblings('label').attr('for', 'author_name_' + index);
            $(this).find('.testimonialAuthorImgFrm').attr('id', 'testimonialAuthorImgFrm_' + index);
            $(this).find('.testimonial_author_image_id').attr('id', 'testimonial_author_image_id_' + index).attr('name', 'testimonial_author_image_id_' + index);
            $(this).find('.testimonial_author_image_name').attr('id', 'testimonial_author_image_name_' + index).attr('name', 'testimonial_author_image_name_' + index);
            $(this).find('.testimonial_author_image_div').attr('id', 'testimonial_author_image_div_' + index).attr('name', 'testimonial_author_image_div_' + index);
            $(this).find('.testimonialAuthorImgDiv').attr('id', 'testimonialAuthorImgDiv_' + index);
            initialize_article_img(index);
            initialize_author_img(index);

        });
        $('#total_section').val(total_section);
    })

    .on('click', '.confirm_image_delete', function(e) {
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
            site_id: $('#site_id').val()
        });
        $('#confirmImageDeleteModal').modal('hide');
    })

    .on('click', '#saveChanges', function(e) {
        e.preventDefault();

        $(".loaderDiv").show();
        $('#website_setting_form').parsley().validate();
        if (true === $('#website_setting_form').parsley().isValid()) {
            $('.bs-callout-info').removeClass('hidden');
            $('.bs-callout-warning').addClass('hidden');

            $.ajax({
                url: '/admin/save-website-setting/',
                type: 'post',
                dateType: 'json',
                cache: false,
                data: $('#website_setting_form').serialize(),
                beforeSend: function() {

                },
                success: function(response) {
                    if (response.error == 0 || response.status == 200 || response.status == 201) {
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

    .on('click', '.social-media-icons, #addButton', function(e) {
        e.preventDefault();
        var url_text = $(this).attr('data-url');
        var link_type = $(this).attr('data-id');
        // edit or add
        if(url_text && link_type){
            // update text and show remove button
            $('#addSocilMediaIconsLabel2').html('Update link');
            $('#submitButtonMediaIcon').html('<i class="fa fa-plus"></i> Update');
            $('#removeButtonMediaIcon').show();
            $('#account_type_temp').val(link_type);
            $('#addSocilMediaIcons #account_type').val(link_type);
            $('#addSocilMediaIcons #url').val(url_text);
        } else {
            $('#addSocilMediaIconsLabel2').html('Add new link');
            $('#submitButtonMediaIcon').html('<i class="fa fa-plus"></i> Add');
            $('#removeButtonMediaIcon').hide();
            $('#account_type_temp').val('');
        }
       
        $('#addSocilMediaIcons').modal('show');
    })

    .on('submit', '#tempAddSocialMedia', function(e){
        e.preventDefault();
        $('#addSocilMediaIcons').modal('hide');
        // get link type and url to render
        let link_type = $('#account_type').val();
        let link_url = $('#url').val();
        let link_icon = get_link_icon(link_type)
        if($('#account_type_temp').val() != ''){
            //check if already exist
            if($('#iconType'+ link_type).length > 0 && $('#iconType'+ $('#account_type_temp').val()).length > 0 ){
                alert('You can add only one of each link type')
                return false;
            }
            $('#iconType'+ $('#account_type_temp').val() +'').remove();
        } else {
            //check if already exist
            if($('#iconType'+ link_type).length > 0){
                alert('You can add only one of each link type')
                return false;
            }
        }
        
        socialMediaButton = '<span id="iconType'+ link_type +'" rel_position="" >' +
                                '<input type="hidden" name="account_type'+ link_type +'" value="'+ link_type +'">'+
                                '<input type="hidden" name="url'+ link_type +'" value="'+ link_url +'">'+
                                '<input type="hidden" class="position"  name="position'+ link_type +'" value="">'+
                                '<a href="javascript:void(0);" class="social-media-icons" data-url="' + link_url + '" data-id="' + link_type + '"><i class="'+ link_icon +'"></i></a>' +
                                ' </span>'
        $('#socialmediaIcons').append(socialMediaButton);
        sort_social_link_position();

    })

    .on('click', '#removeButtonMediaIcon', function(e){
        e.preventDefault();
        try {
            $('#iconType'+ $('#account_type_temp').val() +'').remove();
        } catch (error) {
            console.log('nothing to remove')
        }
        $('#addSocilMediaIcons').modal('hide');
        sort_social_link_position();

    })

    .on('ifChanged', '#auctionTypeAll', function(){
        if($(this).prop("checked") === true){

            $('.check_auction_type').prop('checked', true).iCheck('update');
            $('.check_auction_type').each(function(){
                if($(this).prop("checked") === true){
                $(this).parent().siblings('.selected_auction_type').val(1);
                }
            });
        }else{
            $('.check_auction_type').prop('checked', false).iCheck('update');
            $('.check_auction_type').each(function(){
                if($(this).prop("checked") === false){
                $(this).parent().siblings('.selected_auction_type').val(2);
                }
            });
        }
    })

    .on('ifChanged', '#expertiseTypeAll', function(){
        if($(this).prop("checked") === true){
          $('.check_expertise').prop('checked', true).iCheck('update');
          $('.check_expertise').each(function(){
              if($(this).prop("checked") === true){
                $(this).parent().siblings('.selected_expertise').val(1);
              }
          });
        }else{
          $('.check_expertise').prop('checked', false).iCheck('update');
          $('.check_expertise').each(function(){
              if($(this).prop("checked") === false){
                $(this).parent().siblings('.selected_expertise').val(2);
              }
          });
        }

    })

    .on('ifChanged', '.check_auction_type', function(){
        check_auction();
    })

    .on('ifChanged', '.check_expertise', function(){
        check_expertise();
    })

    .on('change', '.expertise_icon_type', function(){

        var icon_type_id = $(this).val();
        var position = $(this).attr('rel_pos');
        $.ajax({
            url: '/admin/icon-by-type/',
            type: 'post',
            dateType: 'json',
            cache: false,
            data: {icon_type_id: icon_type_id, position: position},
            beforeSend: function(){
                $(".loaderDiv").show();
            },
            success: function(response){
                $(".loaderDiv").hide();
                if(response.error == 0){
                    var position = response.position.toString();
                    $('#expertise_icon_'+position)[0].selectize.destroy();
                    $('#expertise_icon_' +position).empty()
                    $('#expertise_icon_' +position).append('<option value="" selected readonly>Select Icon</option>')
                    $.each(response.icon_list, function(i, item) {
                        $('#expertise_icon_'+position).append(`<option class="` + item.icon_name + `" value="` + item.id + `" data-data='{"icon_name" : "`+ item.icon_name  +`"}' rel_id="` + item.id + `" rel_name="` + item.icon_name + `" position="` + position + `">Icon Selected</option>`);
                    });


                    $('#expertise_icon_'+position).selectize({
                        create: false,
                        sortField: 'text',
                        valueField: 'id',
                        labelField: 'name',
                        searchField: ['name'],
                        placeholder: 'Select Icon',
                        // options: response.icon_list,
                        render: {
                            option: function (item, escape) {
                                return '<div class="option">' +
                                        '<span class="'+ escape(item.icon_name) +'"/></span>' +
                                    '</div>';
                            }
                        }
                    });
                }else{
                }
            }
        });
    });


    $('.social-drags').sortable({
        stop: function(e, ui) {
            sort_social_link_position();
        }
    })

    $('#bannerImgDiv').sortable({
        stop: function(e, ui) {
            $.map($(this).find('.col-md-55'), function(el) {
                var custom_index = parseInt($(el).index())+1;
                $(el).attr('rel_position', custom_index);

            });
            reindex_banner_list();
        }

    });


    // $('.testimonialImgFrm').each(function(index) {
    //     initialize_article_img(index);
    // });
    // $('.testimonialAuthorImgFrm').each(function(index) {
    //     initialize_author_img(index);
    // });

});

const sort_social_link_position = (element='.social-drags') => {
    $.map($(element).find('span'), function(el) {
        var custom_index = parseInt($(el).index())+1;
        // change rel postion of current span
        $(el).attr('rel_position', custom_index);
        // change hidden fiel position value
        $(el).find('.position').val(custom_index)
    });
}

const reindex_banner_list = () => {
    var img_id_list = [];
    var img_name_list = [];
    var str_img_id = '';
    var str_img_name = '';
    $('#bannerImgDiv .col-md-55').each(function(index){
      var rel_id = $(this).find('a').attr('data-image-id');
      var rel_name = $(this).find('a').attr('data-image-name');
      img_id_list.push(rel_id);
      img_name_list.push(rel_name);
    });
    str_img_id = img_id_list.toString();
    str_img_name = img_name_list.toString();
    $('#banner_image_id').val(str_img_id);
    $('#banner_image_name').val(str_img_name);
  }


const check_user_exists = (email = '', phone = '', domain_name = '', check_type='user', element) => {
    return $.ajax({
        url: '/admin/check-user-exists/',
        type: 'post',
        dataType: 'json',
        async: false,
        data: { email: email, phone: phone, domain_name: domain_name, check_type:check_type },
        success: function(data) {
            if (data.error == 1) {
                // check for availability
                var object_text = (email == '') ? 'Phone no' : 'Email';
                if (domain_name != '') {
                    object_text = 'Domiain Name'
                }
                //show error
                $(element).parsley().addError("myCustomError", { 'message': 'This ' + object_text + ' is already exists', updateClass: true });
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

// const initialize_author_img = (count) => {
//     try {
//         Dropzone.autoDiscover = false;
//         var dropzone1 = new Dropzone("#testimonialAuthorImgFrm_" + count, {
//             uploadMultiple: false,
//             url: "/admin/save-images/",
//             paramName: 'testimonial_author_img',
//             acceptedFiles: '.png, .jpg, .jpeg, .svg',
//             init: function() {
//                 var drop = this; // Closure
//                 /*this.on('error', function(file, errorMessage) {

//                     drop.removeFile(file);
//                 });*/
//                 this.on("sending", function(file, xhr, formData) {
//                     file_size = parseFloat((file.size / (1024 * 1024)).toFixed(2));
//                     formData.append("file_length", drop.files.length);
//                     formData.append("file_size", file_size);
//                     formData.append("site_id", $('#site_id').val());

//                 });
//                 this.on('success', function(file, message) {
//                     if (drop.files.length > 1) {
//                         drop.removeFile(file);
//                     }
//                 });
//             },
//             success: function(file, response) {
//                 var cnt = count;
//                 var image_name = '';
//                 var upload_id = '';
//                 var actual_image = '';
//                 var actual_id = '';
//                 var testimonial_author_image_name = $('#testimonial_author_image_name_' + cnt).val();
//                 if (response.status == 200) {
//                     if (response.uploaded_file_list) {
//                         $.each(response.uploaded_file_list, function(i, item) {
//                             if (i == 0) {
//                                 if (item.file_name != "") {
//                                     image_name = item.file_name;
//                                     upload_id = item.upload_id.toString();
//                                 }
//                             } else {
//                                 if (item.file_name != "") {
//                                     image_name = image_name + ',' + item.file_name;
//                                     upload_id = upload_id + ',' + item.upload_id;
//                                 }
//                             }
//                             upload_to = item.upload_to;

//                         });
//                         actual_image = image_name.replace(/(^,)|(,$)/g, "");
//                         actual_id = upload_id.replace(/(^,)|(,$)/g, "");
//                         $('#testimonial_author_image_name_' + cnt).val(actual_image);
//                         $('#testimonial_author_image_id_' + cnt).val(actual_id);
//                         if (actual_image) {
//                             var author_img = aws_url + "testimonial_author_img/" + actual_image;
//                             $('#testimonialAuthorImg_' + cnt).attr('src', author_img);
//                             $('#testimonialAuthorImgDiv_' + cnt).show();
//                         }
//                         $('#testimonialAuthorImgDiv_' + cnt + ' .fav-icon a').attr({ 'data-image-id': actual_id, 'data-image-name': actual_image, 'data-image-section': upload_to, 'data-count': cnt }).addClass('confirm_image_delete');

//                     }
//                 }
//             }
//         });
//     } catch (ex) {
//         console.log(ex);
//     }
// }

// const initialize_article_img = (count) => {
//     try {
//         Dropzone.autoDiscover = false;
//         var dropzone2 = new Dropzone("#testimonialImgFrm_" + count, {
//             uploadMultiple: false,
//             url: "/admin/save-images/",
//             paramName: 'testimonial_img',
//             acceptedFiles: '.png, .jpg, .jpeg, .svg',
//             init: function() {
//                 var drop = this; // Closure
//                 /*this.on('error', function(file, errorMessage) {

//                     drop.removeFile(file);
//                 });*/
//                 this.on("sending", function(file, xhr, formData) {
//                     file_size = parseFloat((file.size / (1024 * 1024)).toFixed(2));
//                     formData.append("file_length", drop.files.length);
//                     formData.append("file_size", file_size);
//                     formData.append("site_id", $('#site_id').val());

//                 });
//                 this.on('success', function(file, message) {
//                     drop.removeFile(file);
//                 });
//             },
//             success: function(file, response) {
//                 //var cnt = count-1;
//                 var cnt = count;
//                 console.log(cnt);
//                 var image_name = '';
//                 var upload_id = '';
//                 var actual_image = '';
//                 var actual_id = '';
//                 var upload_to = '';
//                 var testimonial_image_name = $('#testimonial_image_name_' + cnt).val();
//                 if (response.status == 200) {
//                     if (response.uploaded_file_list) {
//                         $.each(response.uploaded_file_list, function(i, item) {
//                             if (i == 0) {
//                                 if (item.file_name != "") {
//                                     image_name = item.file_name;
//                                     upload_id = item.upload_id.toString();
//                                 }
//                             } else {
//                                 if (item.file_name != "") {
//                                     image_name = image_name + ',' + item.file_name;
//                                     upload_id = upload_id + ',' + item.upload_id;
//                                 }
//                             }
//                             upload_to = item.upload_to;

//                         });
//                         actual_image = image_name.replace(/(^,)|(,$)/g, "");
//                         actual_id = upload_id.replace(/(^,)|(,$)/g, "");
//                         $('#testimonial_image_name_' + cnt).val(actual_image);
//                         $('#testimonial_image_id_' + cnt).val(actual_id);
//                         if (actual_image) {
//                             var testi_img = aws_url + "testimonial_img/" + actual_image;
//                             $('#testimonialImg_' + cnt).attr('src', testi_img);
//                             $('#testimonialImgDiv_' + cnt).show();
//                         }
//                         $('#testimonialImgDiv_' + cnt + ' .fav-icon a').attr({ 'data-image-id': actual_id, 'data-image-name': actual_image, 'data-image-section': upload_to, 'data-count': cnt }).addClass('confirm_image_delete');

//                     }
//                 }
//             }
//         });
//     } catch (ex) {
//         console.log(ex);
//     }

// }

const set_favicon_details = (response) => {
    console.log("from fav details");
    console.log(response);
    console.log("from fav details end");
    var image_name = '';
    var upload_id = '';
    var actual_image = '';
    var actual_id = '';
    var upload_to = '';
    var favicon_img_name = $('#favicon_img_name').val();
    if (response.status == 200) {
        $('#custom_favicon_error').hide();
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
            $('#favicon_img_name').val(actual_image);
            $('#favicon_img_id').val(actual_id);
            if (actual_image) {
                var fav_img = aws_url + "favicons/" + actual_image;
                $('#favIconImg').attr('src', fav_img);
                $('#favIconImgDiv').show();

            }
            $('#favIconImgDiv .fav-icon a').attr({ 'data-image-id': $('#favicon_img_id').val(), 'data-image-name': $('#favicon_img_name').val(), 'data-image-section': upload_to, 'data-count': '' }).addClass('confirm_image_delete');
        }
    }
}

const set_logo_details = (response) => {
    console.log("from logo details");
    console.log(response);
    console.log("from logo details end");
    var image_name = '';
    var actual_image = '';
    var upload_id = '';
    var actual_id = '';
    var upload_to = '';
    var website_logo_name = $('#website_logo_name').val();
    if (response.status == 200) {
        $('#custom_logo_error').hide();
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
            $('#website_logo_name').val(actual_image);
            $('#website_logo_id').val(upload_id);
            if (actual_image) {
                var logo_img = aws_url + "website_logo/" + actual_image;
                $('#websiteLogoImg').attr('src', logo_img);
                $('#websiteLogoImgDiv').show();
            }
            $('#websiteLogoImgDiv .fav-icon a').attr({ 'data-image-id': upload_id, 'data-image-name': actual_image, 'data-image-section': upload_to, 'data-count': '' }).addClass('confirm_image_delete');
        }
    }
}

const set_banner_details = (response) => {
    console.log("from banner details");
    console.log(response);
    console.log("from banner details end");
    var image_name = '';
    var upload_id = '';
    var actual_image = '';
    var actual_id = '';
    var banner_image_name = $('#banner_image_name').val();
    var banner_image_id = $('#banner_image_id').val();
    if (response.status == 200) {
        $('#custom_banner_error').hide();
        var count = parseInt($('#bannerImgDiv .col-md-55').length);
        if (response.uploaded_file_list) {
            var all_banner_images = '';
            count = count+1;
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
                if (item.file_name != "") {
                    var img_src = aws_url + "banner_img/" + item.file_name;
                }
                if (item.upload_date) {
                    try {
                        var upload_date = new Date(item.upload_date);
                        var month = upload_date.toLocaleString('default', { month: 'short' });
                        var year = upload_date.getFullYear();
                        var date = upload_date.getDate();

                        var dt = (upload_date.getDate() < 10) ? '0' + upload_date.getDate() : upload_date.getDate();
                        var hrs = (upload_date.getHours() < 10) ? '0' + upload_date.getHours() : upload_date.getHours();
                        var mins = (upload_date.getMinutes() < 10) ? '0' + upload_date.getMinutes() : upload_date.getMinutes();
                        var secs = (upload_date.getSeconds() < 10) ? '0' + upload_date.getSeconds() : upload_date.getSeconds();
                        var timeStp = '';
                        var mer = (parseInt(hrs) >= 12) ? 'p.m' : 'a.m';
                        hrs = parseInt(hrs) % 12;
                        hrs = (hrs) ? hrs : 12;
                        //timeStp = month +"-"+dt+"-"+year+" at "+hrs+":"+mins+" "+mer;
                        timeStp = month + " " + dt + ", " + year + " " + hrs + ":" + mins + "" + mer;

                    } catch (ex) {
                        console.log(ex);
                        var timeStp = '';
                    }
                }

                $('#bannerImgDiv').append(
                    '<div class="col-md-55" rel_id="'+item.upload_id+'" rel_position="'+count+'" >' +
                    '<div class="thumbnail">' +
                       '<div class="image view view-first">'+
                          '<img src="' + img_src + '" alt="" style="width: 100%;  display: block; min-height:150px">'+
                       '</div>'+
                       '<div class="caption">'+
                          '<p>' + item.file_name + '</p>'+
                          '<p>'+
                             'File Size: ' + item.file_size + ' <br>'+
                             'Uploaded: ' + timeStp +
                          '</p>'+
                          '<div class="move">'+
                             '<i class="fa fa-arrows-alt"></i> Move'+
                             '<a href="javascript:void(0)" data-image-id="' + item.upload_id + '" data-image-name="' + item.file_name + '" data-image-section="' + item.upload_to + '"  class="close-btn confirm_image_delete" style="float:right;"><i class="fa fa-remove"></i> Remove</a>'+
                          '</div>'+
                       '</div>'+
                    '</div>' +
                 '</div>'
                );
                reindex_banner_list();


            });
            image_name = image_name + ',' + banner_image_name;
            upload_id = upload_id + ',' + banner_image_id;
            actual_image = image_name.replace(/(^,)|(,$)/g, "");
            actual_id = upload_id.replace(/(^,)|(,$)/g, "");
            $('#banner_image_name').val(actual_image);
            $('#banner_image_id').val(actual_id);
            $('#bannerImgDiv').show();

        }
    }
}


const set_footer_image_details = (response) => {
    var image_name = '';
    var upload_id = '';
    var actual_image = '';
    var actual_id = '';
    var footer_company_parter_logo_name = $('#footer_company_parter_logo_name').val();
    var footer_company_parter_logo_id = $('#footer_company_parter_logo_id').val();
    if (response.status == 200) {
        $('#custom_partner_error').hide();
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
                if (item.file_name != "") {
                    var img_src = aws_url + "company_partner_img/" + item.file_name;
                }
                if (item.upload_date) {
                    try {
                        var upload_date = new Date(item.upload_date);
                        var month = upload_date.toLocaleString('default', { month: 'short' });
                        var year = upload_date.getFullYear();
                        var date = upload_date.getDate();

                        var dt = (upload_date.getDate() < 10) ? '0' + upload_date.getDate() : upload_date.getDate();
                        var hrs = (upload_date.getHours() < 10) ? '0' + upload_date.getHours() : upload_date.getHours();
                        var mins = (upload_date.getMinutes() < 10) ? '0' + upload_date.getMinutes() : upload_date.getMinutes();
                        var secs = (upload_date.getSeconds() < 10) ? '0' + upload_date.getSeconds() : upload_date.getSeconds();
                        var timeStp = '';
                        var mer = (parseInt(hrs) >= 12) ? 'p.m' : 'a.m';
                        hrs = parseInt(hrs) % 12;
                        hrs = (hrs) ? hrs : 12;
                        //timeStp = month +"-"+dt+"-"+year+" at "+hrs+":"+mins+" "+mer;
                        timeStp = month + " " + dt + ", " + year + " " + hrs + ":" + mins + "" + mer;

                    } catch (ex) {
                        console.log(ex);
                        var timeStp = '';
                    }
                }

                $('#footerCompanyImgDiv').append('<div class="col-md-55" rel_id="'+item.upload_id+'">' +
                    '<div class="thumbnail">'+
                        '<div class="view view-first">'+
                            '<img src="' + img_src + '" alt="" style="width: 100%; height:90px; display: block; background:#29303e">'+
                        '</div>'+
                        '<div class="caption">'+
                            '<p>' + item.file_name + '</p>'+
                            '<p>'+
                            'File Size: ' + item.file_size + ' <br>'+
                            'Uploaded: ' + timeStp +
                            '</p>'+
                            '<div class="move">'+
                            '<a href="javascript:void(0)" data-image-id="' + item.upload_id + '" data-image-name="' + item.file_name + '" data-image-section="' + item.upload_to + '"  class="close-btn confirm_image_delete" ><i class="fa fa-remove"></i> Remove</a>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                    '</div>'
                );

            });
            image_name = image_name + ',' + footer_company_parter_logo_name;
            upload_id = upload_id + ',' + footer_company_parter_logo_id;
            actual_image = image_name.replace(/(^,)|(,$)/g, "");
            actual_id = upload_id.replace(/(^,)|(,$)/g, "");
            $('#footer_company_parter_logo_name').val(actual_image);
            $('#footer_company_parter_logo_id').val(actual_id);
            $('#footerCompanyImgDiv').show();
        }
    }
}


const set_auction_section_details = (response) => {
    var image_name = '';
    var upload_id = '';
    var actual_image = '';
    var actual_id = '';

    try{
        var count = response.count;
    }catch(ex){
        var count = '';
        console.log(ex);
    }

    var auction_image_name = $('#auction_image_name_'+count).val();
    var auction_image_id = $('#auction_image_id_'+count).val();
    if(response.status == 200){
        //$('#custom_partner_error').hide();
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
                if(item.file_name != ""){
                    var img_src = aws_url+ item.upload_to +  "/"+item.file_name;
                }
                if (item.upload_date) {
                    try {
                        var upload_date = new Date(item.upload_date);
                        var month = upload_date.toLocaleString('default', { month: 'short' });
                        var year = upload_date.getFullYear();
                        var date = upload_date.getDate();

                        var dt = (upload_date.getDate() < 10) ? '0' + upload_date.getDate() : upload_date.getDate();
                        var hrs = (upload_date.getHours() < 10) ? '0' + upload_date.getHours() : upload_date.getHours();
                        var mins = (upload_date.getMinutes() < 10) ? '0' + upload_date.getMinutes() : upload_date.getMinutes();
                        var secs = (upload_date.getSeconds() < 10) ? '0' + upload_date.getSeconds() : upload_date.getSeconds();
                        var timeStp = '';
                        var mer = (parseInt(hrs) >= 12) ? 'p.m' : 'a.m';
                        hrs = parseInt(hrs) % 12;
                        hrs = (hrs) ? hrs : 12;
                        //timeStp = month +"-"+dt+"-"+year+" at "+hrs+":"+mins+" "+mer;
                        timeStp = month + " " + dt + ", " + year + " " + hrs + ":" + mins + "" + mer;

                    } catch (ex) {
                        console.log(ex);
                        var timeStp = '';
                    }
                }

                $('#auctionTypeImgDiv' + count).html(
                    '<div class="col-md-12" rel_id="'+item.upload_id+'">' +
                    '<div class="thumbnail">' +
                       '<div class="image view view-first">'+
                          '<img src="' + img_src + '" alt="" style="width: 100%;  display: block; min-height:150px">'+
                       '</div>'+
                       '<div class="caption">'+
                          '<p>' + item.file_name + '</p>'+
                          '<p>'+
                             'File Size: ' + item.file_size + ' <br>'+
                             'Uploaded: ' + timeStp +
                          '</p>'+
                          '<div class="move">'+
                             '<a href="javascript:void(0)" data-count="'+count+'"  data-image-id="' + item.upload_id + '" data-image-name="' + item.file_name + '" data-image-section="' + item.upload_to + '"  class="close-btn confirm_image_delete"><i class="fa fa-remove"></i> Remove</a>'+
                          '</div>'+
                       '</div>'+
                    '</div>' +
                 '</div>'
                );

            });
            actual_image = image_name.replace(/(^,)|(,$)/g, "");
            actual_id = upload_id.replace(/(^,)|(,$)/g, "");
            $('#auction_image_name_'+count).val(actual_image);
            $('#auction_image_id_'+count).val(actual_id);
            $('#auctionTypeImgDiv'+count).show();
        }
    }
}

// const set_expertise_section_details = (response) => {
//     var image_name = '';
//     var upload_id = '';
//     var actual_image = '';
//     var actual_id = '';
//     try{
//         var count = response.count;
//     }catch(ex){
//         var count = '';
//         console.log(ex);
//     }
//     var auction_image_name = $('#expertise_image_name_'+count).val();
//     var auction_image_id = $('#expertise_image_id_'+count).val();
//     if(response.status == 200){
//         //$('#custom_partner_error').hide();
//         if(response.uploaded_file_list){
//             $.each(response.uploaded_file_list, function(i, item) {
//                 if(i==0){
//                     if(item.file_name != ""){
//                         image_name = item.file_name;
//                         upload_id = item.upload_id.toString();
//                     }
//                 }else{
//                     if(item.file_name != ""){
//                         image_name = image_name+','+item.file_name;
//                         upload_id = upload_id+','+item.upload_id;
//                     }
//                 }
//                 if(item.file_name != ""){
//                     var img_src = aws_url+ item.upload_to +  "/"+item.file_name;
//                 }
//                 if (item.upload_date) {
//                     try {
//                         var upload_date = new Date(item.upload_date);
//                         var month = upload_date.toLocaleString('default', { month: 'short' });
//                         var year = upload_date.getFullYear();
//                         var date = upload_date.getDate();

//                         var dt = (upload_date.getDate() < 10) ? '0' + upload_date.getDate() : upload_date.getDate();
//                         var hrs = (upload_date.getHours() < 10) ? '0' + upload_date.getHours() : upload_date.getHours();
//                         var mins = (upload_date.getMinutes() < 10) ? '0' + upload_date.getMinutes() : upload_date.getMinutes();
//                         var secs = (upload_date.getSeconds() < 10) ? '0' + upload_date.getSeconds() : upload_date.getSeconds();
//                         var timeStp = '';
//                         var mer = (parseInt(hrs) >= 12) ? 'p.m' : 'a.m';
//                         hrs = parseInt(hrs) % 12;
//                         hrs = (hrs) ? hrs : 12;
//                         //timeStp = month +"-"+dt+"-"+year+" at "+hrs+":"+mins+" "+mer;
//                         timeStp = month + " " + dt + ", " + year + " " + hrs + ":" + mins + "" + mer;

//                     } catch (ex) {
//                         console.log(ex);
//                         var timeStp = '';
//                     }
//                 }

//                 $('#expertiseImgDiv'+count).html(
//                     '<div class="col-md-12" rel_id="'+item.upload_id+'">' +
//                     '<div class="thumbnail">' +
//                        '<div class="image view view-first">'+
//                           '<img src="' + img_src + '" alt="" style="width: 100%;  display: block; min-height:150px">'+
//                        '</div>'+
//                        '<div class="caption">'+
//                           '<p>' + item.file_name + '</p>'+
//                           '<p>'+
//                              'File Size: ' + item.file_size + ' <br>'+
//                              'Uploaded: ' + timeStp +
//                           '</p>'+
//                           '<div class="move">'+
//                              '<a href="javascript:void(0)" data-count="'+count+'" data-image-id="' + item.upload_id + '" data-image-name="' + item.file_name + '" data-image-section="' + item.upload_to + '"  class="close-btn confirm_image_delete"><i class="fa fa-remove"></i> Remove</a>'+
//                           '</div>'+
//                        '</div>'+
//                     '</div>' +
//                  '</div>'
//                 );
//             });
//             image_name = image_name;
//             upload_id = upload_id;
//             actual_image = image_name.replace(/(^,)|(,$)/g, "");
//             actual_id = upload_id.replace(/(^,)|(,$)/g, "");
//             $('#expertise_image_name_'+count).val(actual_image);
//             $('#expertise_image_id_'+count).val(actual_id);
//             $('#expertiseImgDiv'+count).show();
//         }
//     }
// }


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

    var init_drozone = new Dropzone(element, {
        uploadMultiple: upload_multiple,
        url: action_url,
        paramName: field_name,
        // addRemoveLinks: true, 
        acceptedFiles: file_accepted,
        dictDefaultMessage: (dictDefaultMessage)?dictDefaultMessage:'Drop files here to upload',
        maxFiles: max_files,
        init: function() {
            var drop = this; // Closure

            /*this.on('error', function(file, errorMessage) {

                drop.removeFile(file);
            });*/
            this.on("processing", function(file){
                if(element == '#BannerImgFrm'){
                    var total_uploaded = parseInt($('#bannerImgDiv .col-md-55').length);
                    if(total_uploaded >= max_files){
                        drop.removeFile(file);
                    }
                }
                if(element == '#footerCompanyImgFrm'){
                    var footerTotal = parseInt($('#footerCompanyImgDiv .col-md-55').length);
                    if(footerTotal >= max_files){
                        drop.removeFile(file);
                    }
                }
            });
            this.on('error', function(file, errorMessage) {
                var error_msg = errorMessage+'<br> Allowed file type: '+file_accepted+'. <br> Maximum '+max_files+' files can be uploaded.';
                showAlert(error_msg, 1)
                $(element).removeClass('dz-started');
                $(element).find('.dz-image-preview').remove();
                drop.removeFile(file);
            });


            this.on("sending", function(file, xhr, formData) {
                file_size = parseFloat((file.size / (1024 * 1024)).toFixed(2));
                formData.append("file_length", drop.files.length);
                formData.append("file_size", file_size);
                formData.append("site_id", $('#site_id').val());
            });
            if (upload_multiple === false) {
                this.on('success', function(file, response) {
                    count = parseInt(element.charAt(element.length-1));
                    if(count >= 0){
                        count = count;
                    }else{
                        count = '';
                    }
                    $(element).removeClass('dz-started');
                    $(element).find('.dz-image-preview').remove();
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
                    $(element).removeClass('dz-started');
                   $(element).find('.dz-image-preview').remove();
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
        $('#website_setting_form').parsley();
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
    data = { 'article_id': article_id, 'image_id': id, 'image_name': name, 'section': section, 'agent_id': agent_id, 'site_id': params.site_id }
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


const customCallBackFunc = (callback, args) => {
    //do stuff
    //...
    //execute callback when finished
    callback.apply(this, args);
}


// const remove_string = (list, value, separator) => {
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


//  show alert AFTER ajax call
// const showAlert = (msg, error) => {
//     new PNotify({
//         title: (error == 1) ? 'Error' : 'Success',
//         text: msg,
//         type: (error == 1) ? 'error' : 'success',
//         styling: 'bootstrap3'
//     });
// }


// get link icon based on link type id
const get_link_icon = (id) => {
    try {
        icon_string = ''
        if(id == 1){
            icon_string = 'fa fa-facebook-square'
        } else if (id == 2){
            icon_string = 'fa fa-twitter-square'
        } else if (id == 3){
            icon_string = 'fa fa-youtube-square'
        } else if (id == 4){
            icon_string = 'fa fa-linkedin-square'
        } else if (id == 5){
            icon_string = 'fa fa-instagram'
        }
        return icon_string
    } catch (error) {
        return ''
    }
}


const check_auction = () => {
    var flag = true;
    $('.check_auction_type').each(function(){
        if($(this).prop("checked") === false){
          flag = false;
          $(this).parent().siblings('.selected_auction_type').val(2);
        }else{
          $(this).parent().siblings('.selected_auction_type').val(1);
        }
    });
    $(this).parent().siblings('.selected_auction_type').val();
    $('#auctionTypeAll').prop('checked', flag).iCheck('update');
}

const check_expertise = () =>{
    var flag = true;
    $('.check_expertise').each(function(){
        if($(this).prop("checked") === false){
            flag = false;
            $(this).parent().siblings('.selected_expertise').val(2);
        }else{
            $(this).parent().siblings('.selected_expertise').val(1);
        }
    });
    $('#expertiseTypeAll').prop('checked', flag).iCheck('update');
}