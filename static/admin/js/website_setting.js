Dropzone.autoDiscover = false;
$(document).ready(function(){
    try{
        CKEDITOR.env.isCompatible = true;
    }catch(ex){
        console.log("cked: "+ex);
    }
    CKEDITOR.on( 'instanceReady', function(e) {
        $('iframe', e.editor.container.$).contents().on('click', function() {
            e.editor.focus();
        });
    });
    $.validator.addMethod("extDesc", function (value, element) {
        if(CKEDITOR.instances['extend_description'].getData() == "" ){
          return false;
        } else {
            return true;
        }
    }, "Description is required.");
    $.validator.addMethod("abtDesc", function (value, element) {
        if(CKEDITOR.instances['about_us_description'].getData() == "" ){
          return false;
        } else {
            return true;
        }
    }, "Description is required.");
    favicon_image_params = {
        url: '/admin/save-images/',
        field_name: 'favicon_image',
        file_accepted: '.png, .jpg, .jpeg, .ico',
        element: 'faviconImgFrm',
        upload_multiple: false,
        max_files: 1,
        call_function: set_favicon_details,
        default_message: '<i class="fa fa-upload" aria-hidden="true"></i> Upload Favicon',
    }
    initdrozone(favicon_image_params);
    logo_image_params = {
        url: '/admin/save-images/',
        field_name: 'website_logo',
        file_accepted: '.png, .jpg, .jpeg',
        element: 'websiteLogoFrm',
        upload_multiple: false,
        max_files: 1,
        call_function: set_logo_details,
        default_message: '<i class="fa fa-upload" aria-hidden="true"></i> Upload Company Logo',
    }
    initdrozone(logo_image_params);

    banner_image_params = {
        url: '/admin/save-images/',
        field_name: 'banner_img',
        file_accepted: '.png, .jpg, .jpeg, .svg',
        element: 'BannerImgFrm',
        upload_multiple: true,
        max_files: 4,
        call_function: set_banner_details,
        default_message: '<i class="fa fa-upload" aria-hidden="true"></i> Upload Photos',
    }
    initdrozone(banner_image_params);

    footer_image_params = {
        url: '/admin/save-images/',
        field_name: 'company_partner_img',
        file_accepted: '.png, .jpg, .jpeg, .svg',
        element: 'footerCompanyImgFrm',
        upload_multiple: true,
        max_files: 3,
        call_function: set_footer_image_details,
        default_message: '<i class="fa fa-upload" aria-hidden="true"></i> Upload Logo',
    }
    initdrozone(footer_image_params);
    $('.auctionTypeImgFrm').each(function(index){
        try{
            auction_image_params = {
                url: '/admin/save-images/',
                field_name: 'home_auction_image',
                file_accepted: '.png, .jpg, .jpeg, .svg',
                element: "auctionTypeImgFrm"+index,
                upload_multiple: false,
                max_files: 1,
                call_function: set_auction_section_details,
                count: index,
                default_message: '<i class="fa fa-upload" aria-hidden="true"></i> Upload Photos',
            }
            initdrozone(auction_image_params);
        }catch(ex){
            //console.log(ex);
        }

    });
   /*$('.expertiseTypeImgFrm').each(function(index){
        try{
            expertise_image_params = {
                url: '/admin/save-images/',
                field_name: 'expertise_image',
                file_accepted: '.png, .jpg, .jpeg, .svg',
                element: "expertiseTypeImgFrm"+index,
                upload_multiple: false,
                max_files: 1,
                call_function: set_expertise_section_details,
                count: index,
                default_message: '<i class="fa fa-upload" aria-hidden="true"></i> Upload Photos',
            }
            initdrozone(expertise_image_params);
        }catch(ex){
            console.log(ex);
        }

   });*/
    /*var aboutUsImgFrm = new Dropzone("#aboutUsImgFrm", {
        uploadMultiple: true,
        url: "/admin/save-images/",
        paramName: 'about_us_img',
        acceptedFiles: '.png, .jpg, .jpeg, .svg',
        maxFiles: 3,
        init: function() {
            var drop = this; // Closure
            *//*this.on('error', function(file, errorMessage) {

                drop.removeFile(file);
            });*//*
            this.on("sending", function(file, xhr, formData){
                 file_size = parseFloat((file.size / (1024*1024)).toFixed(2));
                 formData.append("file_length", drop.files.length);
                 formData.append("file_size", file_size);
            });
            this.on('successmultiple', function(file, message) {
                drop.removeFile(file);
            });
        },
        successmultiple: function(file, response){

            var image_name = '';
            var upload_id = '';
            var actual_image = '';
            var actual_id = '';
            var about_us_image_name = $('#about_us_image_name').val();
            var about_us_image_id = $('#about_us_image_id').val();
            if(response.status == 200){
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
                            var img_src = aws_url+"about_us_img/"+item.file_name;
                        }

                        if(item.upload_date){
                            try{
                                var upload_date = new Date(item.upload_date);
                                var month = upload_date.toLocaleString('default', { month: 'short' });
                                var year = upload_date.getFullYear();
                                var date = upload_date.getDate();

                                var dt = (upload_date.getDate() < 10)?'0'+upload_date.getDate():upload_date.getDate();
                                var hrs = (upload_date.getHours() < 10)?'0'+upload_date.getHours():upload_date.getHours();
                                var mins = (upload_date.getMinutes() < 10)?'0'+upload_date.getMinutes():upload_date.getMinutes();
                                var secs = (upload_date.getSeconds() < 10)?'0'+upload_date.getSeconds():upload_date.getSeconds();
                                var timeStp = '';
                                var mer = (parseInt(hrs) >= 12)?'p.m':'a.m';
                                hrs = parseInt(hrs) % 12;
                                hrs = (hrs)?hrs:12;
                                //timeStp = month +"-"+dt+"-"+year+" at "+hrs+":"+mins+" "+mer;
                                timeStp = month +" "+dt+", "+year+" "+hrs+":"+mins+""+mer;

                            }catch(ex){
                                console.log(ex);
                                var timeStp = '';
                            }
                        }

                        $('#aboutUsImgList').append('<li><a href="#" class="close-btn"><i class="fas fa-times"></i></a><img src="'+img_src+'" alt="" width="211" height="113"><figcaption><h6>'+item.file_name+'</h6><p>File Size: '+item.file_size+' <br>Uploaded: '+timeStp+'</p><div class="move"><i class="fas fa-expand-arrows-alt"></i> Move</div></figcaption></li>');
                    });

                    image_name = image_name+','+about_us_image_name;
                    upload_id = upload_id+','+about_us_image_id;
                    actual_image = image_name.replace(/(^,)|(,$)/g, "");
                    actual_id = upload_id.replace(/(^,)|(,$)/g, "");
                    $('#about_us_image_name').val(actual_image);
                    $('#about_us_image_id').val(actual_id);
                    $('#aboutUsImgDiv').show();


                    *//*actual_image = image_name.replace(/(^,)|(,$)/g, "");
                    actual_id = upload_id.replace(/(^,)|(,$)/g, "");
                    $('#about_us_image_name').val(actual_image);
                    $('#about_us_image_id').val(actual_id);
                    $('#aboutUsImgDiv').show();*//*
                }
            }
        }
    });*/


    $(document).on('click', ".add_more", function () {
            var new_div = $(".add_more_div:last").clone().insertAfter(".add_more_div:last");
            var count = new_div.find('.sec_count').val();
            new_div.find('#cke_testimonial_description_'+count).remove();
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

            $('#testimonialImgFrm_'+count).removeClass('dz-started dz-max-files-reached');
            $('#testimonialAuthorImgFrm_'+count).removeClass('dz-started dz-max-files-reached');
            $('#testimonialImgFrm_'+count).find('.dz-preview').remove();
            $('#testimonialAuthorImgFrm_'+count).find('.dz-preview').remove();

            $('#testimonial_title_'+count).val();
            $('#author_name_'+count).val();
            $('#testimonial_description_'+count).val();
            $('#testimonialAuthorImgDiv_'+count).hide();
            $('#testimonialImgDiv_'+count).hide();

            CKEDITOR.replace('testimonial_description_' + count);

            var myDropzone = new Dropzone("#testimonialImgFrm_"+count, {
                url: "/admin/save-images/",
                paramName: 'testimonial_img',
                acceptedFiles: '.png, .jpg, .jpeg, .svg',
                maxFiles: 1,
                init: function() {
                    var drop = this; // Closure
                    /*this.on('error', function(file, errorMessage) {

                        drop.removeFile(file);
                    });*/
                    this.on("sending", function(file, xhr, formData){
                         file_size = parseFloat((file.size / (1024*1024)).toFixed(2));
                         formData.append("file_length", drop.files.length);
                         formData.append("file_size", file_size);
                    });
                    this.on('success', function(file, message) {
                        /*if (drop.files.length > 1) {
                            drop.removeFile(drop.files[0]);
                        }*/
                        drop.removeFile(file);
                    });
                },
                success: function(file, response){
                    cnt = parseInt(count)-1;
                    var image_name = '';
                    var upload_id = '';
                    var actual_image = '';
                    var actual_id = '';
                    var testimonial_image_name = $('#testimonial_image_name_'+cnt).val();
                    if(response.status == 200){
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
                            });
                            actual_image = image_name.replace(/(^,)|(,$)/g, "");
                            actual_id = upload_id.replace(/(^,)|(,$)/g, "");

                            $('#testimonial_image_name_'+cnt).val(actual_image);
                            $('#testimonial_image_id_'+cnt).val(actual_id);
                            if(actual_image){
                                var testi_img = aws_url+"testimonial_img/"+actual_image;
                                $('#testimonialImg_'+cnt).attr('src', testi_img);
                                $('#testimonialImgDiv_'+cnt).show();
                            }
                        }
                    }
                }
             });
             var myDropzone1 = new Dropzone("#testimonialAuthorImgFrm_"+count, {
                url: "/admin/save-images/",
                paramName: 'testimonial_author_img',
                acceptedFiles: '.png, .jpg, .jpeg, .svg',
                maxFiles: 1,
                init: function() {
                    var drop = this; // Closure
                    this.on('error', function(file, errorMessage) {
                        drop.removeFile(file);
                        //$.growl.error({title: "Author Image ", message: "Maximum upload exceed", size: 'large'});
                    });
                    this.on("sending", function(file, xhr, formData){
                         file_size = parseFloat((file.size / (1024*1024)).toFixed(2));
                         formData.append("file_length", drop.files.length);
                         formData.append("file_size", file_size);
                    });
                    this.on('success', function(file, message) {
                        /*if (drop.files.length > 1) {
                            drop.removeFile(drop.files[0]);
                        }*/
                        drop.removeFile(file);
                    });
                },
                success: function(file, response){
                    cnt = parseInt(count)-1;
                    var image_name = '';
                    var upload_id = '';
                    var actual_image = '';
                    var actual_id = '';
                    var testimonial_image_name = $('#testimonial_author_image_name_'+cnt).val();
                    if(response.status == 200){
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
                            });
                            actual_image = image_name.replace(/(^,)|(,$)/g, "");
                            actual_id = upload_id.replace(/(^,)|(,$)/g, "");
                            $('#testimonial_author_image_name_'+cnt).val(actual_image);
                            $('#testimonial_author_image_id_'+cnt).val(actual_id);
                            if(actual_image){
                                var author_img = aws_url+"testimonial_author_img/"+actual_image;
                                $('#testimonialAuthorImg_'+cnt).attr('src', author_img);
                                $('#testimonialAuthorImgDiv_'+cnt).show();
                            }
                        }
                    }
                }
             });
            new_div.find('.sec_count').val(count);
            count = count+1
            $('#total_section').val(count);
        });
        $(document).on("click", ".remove", function () {
            $(this).closest(".add_more_div").remove();
            var total_section = $('div.add_more_div').length;


            $(".add_more_div").each(function(index){
              //$(this).find('#cke_testimonial_description_'+index).remove();
              $(this).find('.sec_count').attr('id','sec_count_'+index).val(index);
              $(this).find('.testimonial_title').attr('id','testimonial_title_'+index).attr('name','testimonial_title_'+index).siblings('label').attr('for','testimonial_title_'+index);
              $(this).find('.testimonial_description').attr('id','testimonial_description_'+index).attr('name','testimonial_description_'+index).siblings('label').attr('for','testimonial_description_'+index);
              $(this).find('.testimonialImgFrm').attr('id','testimonialImgFrm_'+index);
              $(this).find('.testimonial_image_id').attr('id','testimonial_image_id_'+index).attr('name','testimonial_image_id_'+index);
              $(this).find('.testimonial_image_name').attr('id','testimonial_image_name_'+index).attr('name','testimonial_image_name_'+index);
              $(this).find('.testimonial_image_div').attr('id','testimonial_image_div_'+index).attr('name','testimonial_image_div_'+index);
              $(this).find('.testimonialImgDiv').attr('id','testimonialImgDiv_'+index);
              //$(this).find('.testimonialImgDiv').attr('id','testimonialImgDiv_'+count).attr('name','testimonial_image_div_'+count).siblings('label').attr('for','testimonial_description_'+count);
              $(this).find('.author_name').attr('id','author_name_'+index).attr('name','author_name_'+index).siblings('label').attr('for','author_name_'+index);
              $(this).find('.testimonialAuthorImgFrm').attr('id','testimonialAuthorImgFrm_'+index);
              $(this).find('.testimonial_author_image_id').attr('id','testimonial_author_image_id_'+index).attr('name','testimonial_author_image_id_'+index);
              $(this).find('.testimonial_author_image_name').attr('id','testimonial_author_image_name_'+index).attr('name','testimonial_author_image_name_'+index);
              $(this).find('.testimonial_author_image_div').attr('id','testimonial_author_image_div_'+index).attr('name','testimonial_author_image_div_'+index);
              $(this).find('.testimonialAuthorImgDiv').attr('id','testimonialAuthorImgDiv_'+index);
              initialize_article_img(index);
              initialize_author_img(index);


                CKEDITOR.replace('testimonial_description_'+index);


            });
            $('#total_section').val(total_section);
        });
        $(document).on('click', '#manageDomainBtn', function(){
            if($('#primary_domain').attr('readonly')){
                $('#primary_domain').removeAttr('readonly', false);
            }else{
                $('#primary_domain').attr('readonly', true);
            }
        });

        $('#website_setting_form').validate({
            ignore: [],
            errorElement: 'p',
            rules: {
                primary_domain:{
                    required: true
                },
                favicon_img:{
                    required: true
                },
                website_title:{
                    required: true,
                    accept: true
                },
                call_action:{
                    required: true
                },
                banner_headline:{
                    required: true
                },
                website_name:{
                    required:true
                },
                extend_description:{
                    extDesc: true
                },
                /*headline:{
                    required: function(){
                        CKEDITOR.instances['headline'].updateElement();
                    }
                },*/
                about_us_title:{
                    required: true
                },
                about_us_description:{
                    abtDesc: true
                },
                asset_type:{
                    required:true
                },
                api_key:{
                    required: function(element) {
                        if($("#mls_type").val()){
                            return true;
                        }
                    }
                },
                originating_system:{
                    required: function(element) {
                        if(parseInt($("#mls_type").val()) == 3){
                            return true;
                        }
                    }
                }

            },
            messages: {
                primary_domain:{
                    required: "Primary domain is required."
                },
                favicon_img:{
                    required: true
                },
                website_title:{
                    required: "Website title is required.",
                    accept: "Invalid website title"
                },
                banner_headline:{
                    required: "Banner Headline is required."
                },
                website_name:{
                    required:"Website name is required."
                },
                extend_description:{
                    extDesc:"Extended description is required."
                },
                /*headline:{
                    required:"Headline is required."
                },*/
                about_us_title:{
                    required: "Title is required."
                },
                about_us_description:{
                    abtDesc: "Description is required."
                },
                asset_type:{
                    required:"This field is required"
                }
            },
            errorPlacement: function(error, element) {
                if(element.is('#extend_description')){
                    error.insertAfter(element.siblings('[id*="cke_extend_description"]:eq(0)'));
                }else if(element.is('#about_us_description')){
                    error.insertAfter(element.siblings('[id*="cke_about_us_description"]:eq(0)'));
                }else if(element.attr('name') == 'asset_type'){
                    error.insertAfter(element.closest('.bot-check'));
                }else{
                    error.insertAfter(element);
                }
            },
            submitHandler: function(form){


            }
        });




         $('#website_setting_form').on('submit', function(event) {
            var flag = true;
            $('input.auction_type').each(function(index) {
                var input = $(this).attr('id');
                if($('#check_auction_type_'+index).is(':checked') === true){
                    $('#'+input).rules("add",
                    {
                        required: true,
                        messages: {
                            required: "Auction Name is required",
                        }
                    });
                }
            });
            /*$('input.auction_image_id').each(function(index) {
                var input = $(this).attr('id');
                console.log($('#check_auction_type_'+index).is(':checked'));
                if($('#check_auction_type_'+index).is(':checked') === true){
                    if($('#'+input).val() == ''){
                        flag = false;
                        $('#custom_auction_image_error_'+index).show();
                    }else{
                        $('#custom_auction_image_error_'+index).hide();
                    }
                }
            });*/
            $('input.expertise_type').each(function(index) {
                var input = $(this).attr('id');
                if($('#check_expertise_'+index).is(':checked') === true){
                    $('#'+input).rules("add",
                    {
                        required: true,
                        messages: {
                            required: "Expertise Name is required",
                        }
                    });
                }
            });
            /*$('input.expertise_image_id').each(function(index) {
                var input = $(this).attr('id');
                console.log($('#check_expertise_'+index).is(':checked'));
                if($('#check_expertise_'+index).is(':checked') === true){
                    if($('#'+input).val() == ''){
                        flag = false;
                        $('#custom_expertise_image_error_'+index).show();
                    }else{
                        $('#custom_expertise_image_error_'+index).hide();
                    }
                }
            });*/
            $('input.number_title').each(function(index) {
                var input = $(this).attr('id');
                $('#'+input).rules("add",
                {
                    required: true,
                    messages: {
                        required: "Title is required",
                    }
                });
            });
            $('input.number_value').each(function(index) {
                var input = $(this).attr('id');
                $('#'+input).rules("add",
                {
                    required: true,
                    messages: {
                        required: "Value is required",
                    }
                });
            });

            var fav_image = $('#favicon_img_name').val();
            var logo_image = $('#website_logo_name').val();
            var banner_image = $('#banner_image_name').val();
            var footer_company_parter_logo = $('#footer_company_parter_logo_name').val();
            if(fav_image == ""){
                $('#custom_favicon_error').show();
                flag = false;
            }else{
                $('#custom_favicon_error').hide();
            }
            if(logo_image == ""){
                $('#custom_logo_error').show();
                flag = false;
            }else{
                $('#custom_logo_error').hide();
            }
            /*if(banner_image == ""){
                $('#custom_banner_error').show();
                flag = false;
            }else{
                $('#custom_banner_error').hide();
            }
            if(footer_company_parter_logo == ""){
                $('#custom_partner_error').show();
                flag = false;
            }else{
                $('#custom_partner_error').hide();
            }*/
            if(flag === true && $('#website_setting_form').valid()){
                for (instance in CKEDITOR.instances){
                    CKEDITOR.instances[instance].updateElement();
                }
                $.ajax({
                    url: '/admin/save-website-setting/',
                    type: 'post',
                    dataType: 'json',
                    cache: false,
                    data: $('#website_setting_form').serialize(),
                    beforeSend: function(){
                        $('.overlay').show();
                    },
                    success: function(response){
                        $('.overlay').hide();
                        if(response.error == 0 || response.status == 200 || response.status == 201){

                            $.growl.notice({title: "Website ", message: response.msg, size: 'large'});


                        }else{
                            window.setTimeout(function () {
                                $.growl.error({title: "Website ", message: response.msg, size: 'large'});
                            }, 2000);
                        }
                    }
                });
            }
         });
        $("#website_setting_form").validate();
        /*Auction dynamic add more section */
        /*$(document).on('click', ".add_more_auction", function () {
            var new_div = $(".add_more_auction_div:last").clone().insertAfter(".add_more_auction_div:last");
            var count = new_div.find('.auc_sec_count').val();
            count++;
            $(".auction_plus_div").hide();
            $(".auction_plus_div:last").show();
            $(".auction_minus_div").show();
            $(".auction_minus_div:last").hide();

            new_div.find(".auc_sec_count").attr('id', 'auc_sec_count_' + count).val('');
            //new_div.find(".testimonial_title").siblings('label').attr('for', 'testimonial_title_' + count).val('');
            new_div.find(".auction_type").attr('id', 'auction_type_' + count).attr('name', 'auction_type_' + count).siblings('label').attr('for', 'auction_type_' + count).val('');
            new_div.find(".AuctionImgFrm").attr('id', 'AuctionImgFrm_' + count);
            new_div.find(".AuctionImgDiv").attr('id', 'AuctionImgDiv_' + count);
            new_div.find(".AuctionImg").attr('id', 'AuctionImg_' + count).val('');
            new_div.find(".auction_image_id").attr('id', 'auction_image_id_' + count).attr('name', 'auction_image_id_' + count).val('');
            new_div.find(".auction_image_name").attr('id', 'auction_image_name_' + count).attr('name', 'auction_image_name_' + count).val('');

            new_div.find(".auction_image_field").attr('id', 'auction_image_field_' + count).attr('name', 'auction_image_field_' + count);
            $('#AuctionImgDiv_'+count).val();
            $('#AuctionImgFrm_'+count).removeClass('dz-started dz-max-files-reached');
            $('#AuctionImgFrm_'+count).find('.dz-preview').remove();
            try{
                auction_type_image_params = {
                    url: '/admin/save-images/',
                    field_name: 'website_auction_image',
                    file_accepted: '.png, .jpg, .jpeg, .svg',
                    element: "AuctionImgFrm_"+count,
                    upload_multiple: false,
                    max_files: 1,
                    call_function: set_auction_section_details,
                    count: count
                }
                initdrozone(auction_type_image_params);
            }catch(ex){
                console.log(ex);
            }
            new_div.find('.auc_sec_count').val(count);
            count = count+1
            $('#total_website_auction').val(count);
        });
        $(document).on("click", ".remove_auction", function () {
            $(this).closest(".add_more_auction_div").remove();
            var total_section = $('div.add_more_auction_div').length;


            $(".add_more_auction_div").each(function(index){
              $(this).find('.auc_sec_count').attr('id','auc_sec_count_'+index).val(index);
            $(this).find(".auction_type").attr('id', 'auction_type_' + index).attr('name', 'auction_type_' + index).siblings('label').attr('for', 'auction_type_' + index);
            $(this).find(".AuctionImgFrm").attr('id', 'AuctionImgFrm_' + index);
            $(this).find(".AuctionImgDiv").attr('id', 'AuctionImgDiv_' + index);
            $(this).find(".AuctionImg").attr('id', 'AuctionImg_' + index);
            $(this).find(".auction_image_id").attr('id', 'auction_image_id_' + index).attr('name', 'auction_image_id_' + index);
            $(this).find(".auction_image_name").attr('id', 'auction_image_name_' + index).attr('name', 'auction_image_name_' + index);
            $(this).find(".auction_image_field").attr('id', 'auction_image_field_' + index).attr('name', 'auction_image_field_' + index);
            try{
                auction_type_image_params = {
                    url: '/admin/save-images/',
                    field_name: 'website_auction_image',
                    file_accepted: '.png, .jpg, .jpeg, .svg',
                    element: "AuctionImgFrm_"+index,
                    upload_multiple: false,
                    max_files: 1,
                    call_function: set_auction_section_details,
                    count: index,
                }
                initdrozone(auction_type_image_params);
            }catch(ex){
                console.log(ex);
            }


            });
            $('#total_website_auction').val(total_section);
        });

        $('.AuctionImgFrm').each(function(index){
            console.log(index);
            try{
                auction_type_image_params = {
                    url: '/admin/save-images/',
                    field_name: 'website_auction_image',
                    file_accepted: '.png, .jpg, .jpeg, .svg',
                    element: "AuctionImgFrm_"+index,
                    upload_multiple: false,
                    max_files: 1,
                    call_function: set_auction_section_details,
                    count: index,
                }
                initdrozone(auction_type_image_params);
            }catch(ex){
                console.log(ex);
            }

        });*/

        /* Auction dynamic add more section end */

        /* Area of expertise dynamic add more section */
        /*$(document).on('click', ".add_more_area", function () {
            var new_div = $(".add_more_area_div:last").clone().insertAfter(".add_more_area_div:last");
            var count = new_div.find('.area_sec_count').val();
            count++;
            $(".area_plus_div").hide();
            $(".area_plus_div:last").show();
            $(".area_minus_div").show();
            $(".area_minus_div:last").hide();

            new_div.find(".area_sec_count").attr('id', 'area_sec_count_' + count).val('');
            new_div.find(".area_expertise_name").attr('id', 'area_expertise_name_' + count).attr('name', 'area_expertise_name_' + count).siblings('label').attr('for', 'area_expertise_name_' + count).val('');
            new_div.find(".areaExpertiseImgFrm").attr('id', 'areaExpertiseImgFrm_' + count);
            new_div.find(".areaExpertiseImgDiv").attr('id', 'areaExpertiseImgDiv_' + count);
            new_div.find(".areaExpertiseImg").attr('id', 'areaExpertiseImg_' + count).attr('src','');
            new_div.find(".area_expertise_image_id").attr('id', 'area_expertise_image_id_' + count).attr('name', 'area_expertise_image_id_' + count).val('');
            new_div.find(".area_expertise_image_name").attr('id', 'area_expertise_image_name_' + count).attr('name', 'area_expertise_image_name_' + count).val('');

            new_div.find(".area_expertise_image_field").attr('id', 'area_expertise_image_field_' + count).attr('name', 'area_expertise_image_field_' + count);
            $('#areaExpertiseImgDiv_'+count).val();
            $('#areaExpertiseImgFrm_'+count).removeClass('dz-started dz-max-files-reached');
            $('#areaExpertiseImgFrm_'+count).find('.dz-preview').remove();
            try{
                area_image_params = {
                    url: '/admin/save-images/',
                    field_name: 'website_area_image',
                    file_accepted: '.png, .jpg, .jpeg, .svg',
                    element: "areaExpertiseImgFrm_"+count,
                    upload_multiple: false,
                    max_files: 1,
                    call_function: set_area_section_details,
                    count: count,
                }
                initdrozone(area_image_params);
            }catch(ex){
                console.log(ex);
            }

            new_div.find('.area_sec_count').val(count);
            count = count+1
            $('#total_area_expertise').val(count);
        });
        $(document).on("click", ".remove_area", function () {
            $(this).closest(".add_more_area_div").remove();
            var total_section = $('div.add_more_area_div').length;


            $(".add_more_area_div").each(function(index){
              $(this).find('.area_sec_count').attr('id','area_sec_count_'+index).val(index);
            $(this).find(".area_expertise_name").attr('id', 'area_expertise_name_' + index).attr('name', 'area_expertise_name_' + index).siblings('label').attr('for', 'area_expertise_name_' + index);
            $(this).find(".areaExpertiseImgFrm").attr('id', 'areaExpertiseImgFrm_' + index);
            $(this).find(".areaExpertiseImgDiv").attr('id', 'areaExpertiseImgDiv_' + index);
            $(this).find(".areaExpertiseImg").attr('id', 'areaExpertiseImg_' + index);
            $(this).find(".area_expertise_image_id").attr('id', 'area_expertise_image_id_' + index).attr('name', 'area_expertise_image_id_' + index);
            $(this).find(".area_expertise_image_name").attr('id', 'area_expertise_image_name_' + index).attr('name', 'area_expertise_image_name_' + index);
            $(this).find(".area_expertise_image_field").attr('id', 'area_expertise_image_field_' + index).attr('name', 'area_expertise_image_field_' + index);
            try{
                area_image_params = {
                    url: '/admin/save-images/',
                    field_name: 'website_area_image',
                    file_accepted: '.png, .jpg, .jpeg, .svg',
                    element: "areaExpertiseImgFrm_"+count,
                    upload_multiple: false,
                    max_files: 1,
                    call_function: set_area_section_details,
                    count: index,
                }
                initdrozone(area_image_params);
            }catch(ex){
                console.log(ex);
            }

            });
            $('#total_area_expertise').val(total_section);
        });

        $('.areaExpertiseImgFrm').each(function(index){
            console.log(index);
            try{
                area_image_params = {
                    url: '/admin/save-images/',
                    field_name: 'website_area_image',
                    file_accepted: '.png, .jpg, .jpeg, .svg',
                    element: "areaExpertiseImgFrm_"+index,
                    upload_multiple: false,
                    max_files: 1,
                    call_function: set_area_section_details,
                    count: index,
                }
                initdrozone(area_image_params);
            }catch(ex){
                console.log(ex);
            }

        });*/
        /* Area of expertise dynamic add more section end */

        /*$('.testimonialImgFrm').each(function(index){
            initialize_article_img(index);
        });
        $('.testimonialAuthorImgFrm').each(function(index){
            initialize_author_img(index);
        });*/
    /*add_expertise_icon();
    $(document).on('change', '.icon_name', function(){
        change();
    });*/
    $(document).on('change', '.expertise_icon_type', function(){

        var icon_type_id = $(this).val();
        var position = $(this).attr('rel_pos');
        $.ajax({
            url: '/admin/icon-by-type/',
            type: 'post',
            dataType: 'json',
            cache: false,
            data: {icon_type_id: icon_type_id, position: position},
            beforeSend: function(){
                $('.overlay').show();
            },
            success: function(response){
                $('.overlay').hide();
                if(response.error == 0){
                    var position = response.position.toString();
                    $('#expertise_icon_dropdown_'+position).empty();
                    $.each(response.icon_list, function(i, item) {

                        $('#expertise_icon_dropdown_'+position).append('<li class="icon_dropdown_li" rel_id="'+item.id+'" rel_name="'+item.icon_name+'" position="'+position+'"><a href="javascript:void(0)"><span class="'+item.icon_name+'"></span></a></li>');
                    });

                    //$('#expertise_icon_dropdown_'+position).trigger("chosen:updated");
                }else{
                }
            }
        });
    });
    $(document).on('click', '.icon_dropdown_li', function(){
        var position = $(this).attr('position');
        var expertise_icon_id = $(this).attr('rel_id');
        var expertise_icon_name = $(this).attr('rel_name');
        $('#expertise_icon_dropdown_'+position+' li').removeClass('active');
        $(this).addClass('active');
        //$('#expertise_icon_selected_'+position).html(expertise_icon_name);
        $('#expertise_icon_'+position).val(expertise_icon_id);
        $('#expertise_icon_selected_'+position).html('Icon Selected');
    });
    /*add_expertise_icon();
    $(document).on('change', '.expertise_icon', function(){
        add_expertise_icon();
    });*/

    $(document).on('change', '#mls_type', function(){
        if($(this).val()){
            $(".mls_api_key").show();
            if(parseInt($(this).val()) == 3){
                $(".originating_system").show();
            }else{
                $(".originating_system").hide();
            }
        }else{
            $(".mls_api_key").hide();
            $(".originating_system").hide();
        }
    });
});
function add_expertise_icon(elment){
    icon_list = [];

    $('.expertise_icon').each(function() {
        var el_id = '#'+$(this).attr('id');
        $(el_id).on('chosen:showing_dropdown', function(e){
            //$(this).next().find('li.active-result:contains(Residencial)').html('<i class="icon residential-icon"></i> Residencial');
            exp_element = $(this);
            $(".expertise_icon > option").each(function() {
                if(this.value != ""){
                    exp_element.next().find('li.active-result:contains('+this.value+')').html('<i class="'+this.value+'"></i>');
                }

            });
            /*$(this).find('li.active-result').each(function(){
                console.log("$(this).html()");
                console.log($(this).html());
                console.log("$(this).html()");
            });*/

        });

    });
}
/*function initialize_article_img(count){
    try{
        Dropzone.autoDiscover = false;
        var dropzone1 = new Dropzone("#testimonialAuthorImgFrm_"+count, {
            uploadMultiple: false,
            url: "/admin/save-images/",
            paramName: 'testimonial_author_img',
            acceptedFiles: '.png, .jpg, .jpeg, .svg',
            init: function() {
                var drop = this; // Closure
                *//*this.on('error', function(file, errorMessage) {

                    drop.removeFile(file);
                });*//*
                this.on("sending", function(file, xhr, formData){
                     file_size = parseFloat((file.size / (1024*1024)).toFixed(2));
                     formData.append("file_length", drop.files.length);
                     formData.append("file_size", file_size);
                });
                this.on('success', function(file, message) {
                    if (drop.files.length > 1) {
                        drop.removeFile(file);
                    }
                });
            },
            success: function(file, response){
                //var cnt = count-1;
                var cnt = count;
                var image_name = '';
                var upload_id = '';
                var actual_image = '';
                var actual_id = '';
                var testimonial_author_image_name = $('#testimonial_author_image_name_'+cnt).val();
                if(response.status == 200){
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
                        });
                        actual_image = image_name.replace(/(^,)|(,$)/g, "");
                        actual_id = upload_id.replace(/(^,)|(,$)/g, "");
                        $('#testimonial_author_image_name_'+cnt).val(actual_image);
                        $('#testimonial_author_image_id_'+cnt).val(actual_id);
                        if(actual_image){
                            var author_img = aws_url+"testimonial_author_img/"+actual_image;
                            $('#testimonialAuthorImg_'+cnt).attr('src', author_img);
                            $('#testimonialAuthorImgDiv_'+cnt).show();
                        }
                    }
                }
            }
        });
    }catch(ex){
        console.log(ex);
    }
}


function initialize_author_img(count){
    try{
        Dropzone.autoDiscover = false;
    var dropzone2 = new Dropzone("#testimonialImgFrm_"+count, {
        uploadMultiple: false,
        url: "/admin/save-images/",
        paramName: 'testimonial_img',
        acceptedFiles: '.png, .jpg, .jpeg, .svg',
        init: function() {
            var drop = this; // Closure
            *//*this.on('error', function(file, errorMessage) {

                drop.removeFile(file);
            });*//*
            this.on("sending", function(file, xhr, formData){
                 file_size = parseFloat((file.size / (1024*1024)).toFixed(2));
                 formData.append("file_length", drop.files.length);
                 formData.append("file_size", file_size);
            });
            this.on('success', function(file, message) {
                drop.removeFile(file);
            });
        },
        success: function(file, response){
            //var cnt = count-1;
            var cnt = count;
            var image_name = '';
            var upload_id = '';
            var actual_image = '';
            var actual_id = '';
            var testimonial_image_name = $('#testimonial_image_name_'+cnt).val();
            if(response.status == 200){
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

                    });
                    actual_image = image_name.replace(/(^,)|(,$)/g, "");
                    actual_id = upload_id.replace(/(^,)|(,$)/g, "");
                    $('#testimonial_image_name_'+cnt).val(actual_image);
                    $('#testimonial_image_id_'+cnt).val(actual_id);
                    if(actual_image){
                        var testi_img = aws_url+"testimonial_img/"+actual_image;
                        $('#testimonialImg_'+cnt).attr('src', testi_img);
                        $('#testimonialImgDiv_'+cnt).show();
                    }
                }
            }
        }
    });
    }catch(ex){
        console.log(ex);
    }

}*/
function set_favicon_details(response){
    var image_name = '';
    var upload_id = '';
    var actual_image = '';
    var actual_id = '';
    var upload_to = '';
    var favicon_img_name = $('#favicon_img_name').val();
    if(response.status == 200){
        $('#custom_favicon_error').hide();
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
            $('#favicon_img_name').val(actual_image);
            $('#favicon_img_id').val(actual_id);
            if(actual_image){
                var fav_img = aws_url+"favicons/"+actual_image;
                $('#favIconImg').attr('src', fav_img);
                $('#favIconImg').show();
                $('#faviconDelBtn').show();

            }
            $('#favIconImgDiv .fav-icon a').attr({ 'data-image-id': $('#favicon_img_id').val(), 'data-image-name':$('#favicon_img_name').val(), 'data-image-section': upload_to, 'data-count': '' }).addClass('confirm_image_delete');
        }
    }
}
function set_logo_details(response){

    var image_name = '';
    var actual_image = '';
    var upload_id = '';
    var actual_id = '';
    var upload_to = '';
    var website_logo_name = $('#website_logo_name').val();
    if(response.status == 200){
        $('#custom_logo_error').hide();
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
            $('#website_logo_name').val(actual_image);
            $('#website_logo_id').val(upload_id);
            if(actual_image){
                var logo_img = aws_url+"website_logo/"+actual_image;
                $('#websiteLogoImg').attr('src', logo_img);
                $('#websiteLogoImg').show();
                $('#websiteLogoDelBtn').show();
            }
            $('#websiteLogoImgDiv .website-logo a').attr({ 'data-image-id': $('#website_logo_id').val(), 'data-image-name':$('#website_logo_name').val(), 'data-image-section': upload_to, 'data-count': '' }).addClass('confirm_image_delete');
        }
    }
}

function set_banner_details(response){
    var image_name = '';
    var upload_id = '';
    var actual_image = '';
    var actual_id = '';
    var banner_image_name = $('#banner_image_name').val();
    var banner_image_id = $('#banner_image_id').val();
    if(response.status == 200){
        $('#custom_banner_error').hide();
        var count = parseInt($('#bannerImgList li').length);
        if(response.uploaded_file_list){
            var all_banner_images = '';
            count = count+1;
            $.each(response.uploaded_file_list, function(i, item) {
                var total_uploaded = $('#bannerImgList li').length;
                if(total_uploaded <= 3){
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
                        var img_src = aws_url+"banner_img/"+item.file_name;
                    }
                    if(item.upload_date){
                        try{
                            var upload_date = new Date(item.upload_date);
                            var month = upload_date.toLocaleString('default', { month: 'short' });
                            var year = upload_date.getFullYear();
                            var date = upload_date.getDate();

                            var dt = (upload_date.getDate() < 10)?'0'+upload_date.getDate():upload_date.getDate();
                            var hrs = (upload_date.getHours() < 10)?'0'+upload_date.getHours():upload_date.getHours();
                            var mins = (upload_date.getMinutes() < 10)?'0'+upload_date.getMinutes():upload_date.getMinutes();
                            var secs = (upload_date.getSeconds() < 10)?'0'+upload_date.getSeconds():upload_date.getSeconds();
                            var timeStp = '';
                            var mer = (parseInt(hrs) >= 12)?'p.m':'a.m';
                            hrs = parseInt(hrs) % 12;
                            hrs = (hrs)?hrs:12;
                            //timeStp = month +"-"+dt+"-"+year+" at "+hrs+":"+mins+" "+mer;
                            timeStp = month +" "+dt+", "+year+" "+hrs+":"+mins+""+mer;

                        }catch(ex){
                            //console.log(ex);
                            var timeStp = '';
                        }
                    }

                $('#bannerImgList').append('<li rel_id="'+item.upload_id+'" rel_position="'+count+'"><a href="javascript:void(0)" data-image-id="'+item.upload_id+'" data-image-name="'+item.file_name+'" data-image-section="'+item.upload_to+'"  class="close-btn confirm_image_delete"><i class="fas fa-times"></i></a><img src="'+img_src+'" alt=""><figcaption><h6>'+item.file_name+'</h6><p>File Size: '+item.file_size+' <br>Uploaded: '+timeStp+'</p><div class="move"><i class="fas fa-expand-arrows-alt"></i> Move</div></figcaption></li>');
                var post_total_uploaded = $('#bannerImgList li').length;
                if(parseInt($('#bannerImgList li').length) > 3){
                    $('#BannerImgFrm').addClass('dz-max-files-reached');
                }
                }else{
                    $('#BannerImgFrm').addClass('dz-max-files-reached');
                }


            });
            image_name = image_name+','+banner_image_name;
            upload_id = upload_id+','+banner_image_id;
            actual_image = image_name.replace(/(^,)|(,$)/g, "");
            actual_id = upload_id.replace(/(^,)|(,$)/g, "");
            $('#banner_image_name').val(actual_image);
            $('#banner_image_id').val(actual_id);
            $('#bannerImgDiv').show();
            reindex_banner_list();

        }
    }
}

function set_footer_image_details(response){
    var image_name = '';
    var upload_id = '';
    var actual_image = '';
    var actual_id = '';
    var footer_company_parter_logo_name = $('#footer_company_parter_logo_name').val();
    var footer_company_parter_logo_id = $('#footer_company_parter_logo_id').val();
    if(response.status == 200){
        $('#custom_partner_error').hide();
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
                    var img_src = aws_url+"company_partner_img/"+item.file_name;
                }

                $('#footerCompanyImgList').append('<li rel_id="'+item.upload_id+'"><div class="bdr-logo"><a href="javascript:void(0)" data-image-id="'+item.upload_id+'" data-image-name="'+item.file_name+'" data-image-section="'+item.upload_to+'"  class="close-btn confirm_image_delete"><i class="fas fa-times"></i></a><img src="'+img_src+'" alt=""></div></li>');
            });
            image_name = image_name+','+footer_company_parter_logo_name;
            upload_id = upload_id+','+footer_company_parter_logo_id;
            actual_image = image_name.replace(/(^,)|(,$)/g, "");
            actual_id = upload_id.replace(/(^,)|(,$)/g, "");
            $('#footer_company_parter_logo_name').val(actual_image);
            $('#footer_company_parter_logo_id').val(actual_id);
            $('#footerCompanyImgDiv').show();
        }
    }
}
function set_auction_section_details(response){
    var image_name = '';
    var upload_id = '';
    var actual_image = '';
    var actual_id = '';

    try{
        var count = response.count;
    }catch(ex){
        var count = '';
        //console.log(ex);
    }

    var auction_image_name = $('#auction_image_name_'+count).val();
    var auction_image_id = $('#auction_image_id_'+count).val();
    $('#custom_auction_image_error_'+count).hide();
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
                    var img_src = aws_url+"home_auctioin/"+item.file_name;
                }
                if(item.upload_date){
                    try{
                        var upload_date = new Date(item.upload_date);
                        var month = upload_date.toLocaleString('default', { month: 'short' });
                        var year = upload_date.getFullYear();
                        var date = upload_date.getDate();

                        var dt = (upload_date.getDate() < 10)?'0'+upload_date.getDate():upload_date.getDate();
                        var hrs = (upload_date.getHours() < 10)?'0'+upload_date.getHours():upload_date.getHours();
                        var mins = (upload_date.getMinutes() < 10)?'0'+upload_date.getMinutes():upload_date.getMinutes();
                        var secs = (upload_date.getSeconds() < 10)?'0'+upload_date.getSeconds():upload_date.getSeconds();
                        var timeStp = '';
                        var mer = (parseInt(hrs) >= 12)?'p.m':'a.m';
                        hrs = parseInt(hrs) % 12;
                        hrs = (hrs)?hrs:12;
                        //timeStp = month +"-"+dt+"-"+year+" at "+hrs+":"+mins+" "+mer;
                        timeStp = month +" "+dt+", "+year+" "+hrs+":"+mins+""+mer;

                    }catch(ex){
                        //console.log(ex);
                        var timeStp = '';
                    }
                }

                $('#auctionTypeImgList'+count).html('<li rel_id="'+item.upload_id+'"><a href="javascript:void(0)" data-image-id="'+item.upload_id+'" data-image-name="'+item.file_name+'" data-image-section="'+item.upload_to+'"  data-count="'+count+'"  class="close-btn confirm_image_delete"><i class="fas fa-times"></i></a><img src="'+img_src+'" alt=""></li>');
            });
            actual_image = image_name.replace(/(^,)|(,$)/g, "");
            actual_id = upload_id.replace(/(^,)|(,$)/g, "");
            $('#auction_image_name_'+count).val(actual_image);
            $('#auction_image_id_'+count).val(actual_id);
            $('#auctionTypeImgDiv'+count).show();
        }
    }
}
function set_expertise_section_details(response){
    var image_name = '';
    var upload_id = '';
    var actual_image = '';
    var actual_id = '';
    try{
        var count = response.count;
    }catch(ex){
        var count = '';
        //console.log(ex);
    }
    var auction_image_name = $('#expertise_image_name_'+count).val();
    var auction_image_id = $('#expertise_image_id_'+count).val();
    $('#custom_expertise_image_error_'+count).hide();
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
                    var img_src = aws_url+"home_expertise/"+item.file_name;
                }
                if(item.upload_date){
                    try{
                        var upload_date = new Date(item.upload_date);
                        var month = upload_date.toLocaleString('default', { month: 'short' });
                        var year = upload_date.getFullYear();
                        var date = upload_date.getDate();

                        var dt = (upload_date.getDate() < 10)?'0'+upload_date.getDate():upload_date.getDate();
                        var hrs = (upload_date.getHours() < 10)?'0'+upload_date.getHours():upload_date.getHours();
                        var mins = (upload_date.getMinutes() < 10)?'0'+upload_date.getMinutes():upload_date.getMinutes();
                        var secs = (upload_date.getSeconds() < 10)?'0'+upload_date.getSeconds():upload_date.getSeconds();
                        var timeStp = '';
                        var mer = (parseInt(hrs) >= 12)?'p.m':'a.m';
                        hrs = parseInt(hrs) % 12;
                        hrs = (hrs)?hrs:12;
                        //timeStp = month +"-"+dt+"-"+year+" at "+hrs+":"+mins+" "+mer;
                        timeStp = month +" "+dt+", "+year+" "+hrs+":"+mins+""+mer;

                    }catch(ex){
                        //console.log(ex);
                        var timeStp = '';
                    }
                }

                $('#expertiseImgList'+count).html('<li rel_id="'+item.upload_id+'"><a href="javascript:void(0)" data-image-id="'+item.upload_id+'" data-image-name="'+item.file_name+'" data-image-section="'+item.upload_to+'" data-count="'+count+'" class="close-btn confirm_image_delete"><i class="fas fa-times"></i></a><img src="'+img_src+'" alt=""></li>');
            });
            image_name = image_name;
            upload_id = upload_id;
            actual_image = image_name.replace(/(^,)|(,$)/g, "");
            actual_id = upload_id.replace(/(^,)|(,$)/g, "");
            $('#expertise_image_name_'+count).val(actual_image);
            $('#expertise_image_id_'+count).val(actual_id);
            $('#expertiseImgDiv'+count).show();
        }
    }
}

