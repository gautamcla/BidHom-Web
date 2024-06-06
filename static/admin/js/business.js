try{
    Dropzone.autoDiscover = false;
}catch(ex){
    //console.log(ex);
}
$(document).ready(function(){
    $('.state').chosen();
    business_logo_image_params = {
        url: '/admin/save-images/',
        field_name: 'business_logo_image',
        file_accepted: '.png, .jpg, .jpeg',
        element: 'uploadBusinessLogoImgFrm',
        upload_multiple: false,
        max_files: 1,
        call_function: set_business_logo_details
    }
    try{
        initdrozone(business_logo_image_params);
    }catch(ex){
        //console.log(ex);
    }
    $(document).on('click', ".plus_addr_div", function () {
            var new_div = $(".add_more_address:last").clone().insertAfter(".add_more_address:last");
            var count = parseInt($('#total_section').val());
            $(".plus_addr_div").hide();
            $(".plus_addr_div:first").show();
            $(".minus_addr_div").show();
            $(".minus_addr_div:first").hide();
            new_div.attr('id', 'add_more_address_' + count).attr('rel_position', count);
            new_div.find(".state").attr('id', 'state_' + count).attr('name','state_'+count).siblings('label').attr('for', 'state_' + count);
            new_div.find('.chosen-container').remove();
            $('#state_' + count).chosen();
            $('#state_' + count).removeClass('valid');
            $('#state_' + count).val('').trigger("chosen:updated");
            new_div.find(".zip_code").attr('id', 'zip_code_' + count).attr('name','zip_code_'+count).siblings('label').attr('for', 'zip_code_' + count);
            $('#zip_code_' + count).val('');
            new_div.find(".office_address").attr('id', 'office_address_' + count).attr('name','office_address_'+count).siblings('label').attr('for', 'office_address_' + count);
            $('#office_address_' + count).val('');

            count = count+1;
            $('#total_section').val(count);
        });
        /*$(document).on("click", ".minus_addr_div", function () {
            $(this).closest(".add_more_address").remove();
            var total_section = parseInt($('div.add_more_address').length);
            $(".add_more_address").each(function(index){
              $(this).find('.office_address').attr('id','office_address_'+index).attr('name','office_address_'+index).siblings('label').attr('for','office_address_'+index);
              $(this).find('.state').attr('id','state_'+index).siblings('label').attr('for','state_'+index);
              $(this).find('.zip_code').attr('id','zip_code_'+index).siblings('label').attr('for','zip_code_'+index);
              $(this).attr('id','add_more_address_'+index);

            });
            $('#total_section').val(total_section);
        });*/
        $(document).on('click', '.del_address_btn', function(){
            var row_id = $(this).attr('del_element_id');
            if($(this).attr('id') == 'del_address_true'){
                $('#'+row_id).remove();
                var total_section = parseInt($('div.add_more_address').length);
                $('#confirmAddressDeleteModal').modal('hide');
                $(".add_more_address").each(function(index){
                  $(this).find('.office_address').attr('id','office_address_'+index).attr('name','office_address_'+index).siblings('label').attr('for','office_address_'+index);
                  $(this).find('.state').attr('id','state_'+index).attr('name','state_'+index).siblings('label').attr('for','state_'+index);
                  $(this).find('.zip_code').attr('id','zip_code_'+index).attr('name','zip_code_'+index).siblings('label').attr('for','zip_code_'+index);
                  $(this).attr('id','add_more_address_'+index).attr('rel_position', index);

                });
                $('#total_section').val(total_section);
            }else{
                $(this).attr('del_element_id', '');
                $('#confirmAddressDeleteModal').modal('hide');
            }
        });
        $(document).on('keyup', '.zip_code', function(){
           var zip_code = $(this).val();
           country_code = $("#country").find(':selected').data('short-code');
           country_id = $("#country").val();
           var rel_position = $(this).closest('.add_more_address').attr('rel_position');
           if(zip_code.length > 4 && country_id == 1){
            params = {
                'zip_code': zip_code,
                'call_function': set_business_address_by_zipcode,
                'rel_position': rel_position
            }
            get_address_by_zipcode(params);
           }
        });

        /*$(document).on('blur', '#business_phone', function(){
            $('#custom_business_phone_length_error').hide();
            var phone = $('#business_phone').val().replace(/\D/g,'').length;
            if(phone != 10){
                if(typeof($('#business_phone-error').html()) == 'undefined' || $('#business_phone-error').is(':visible') === false){
                    $('#custom_business_phone_length_error').show();
                 }else{
                    $('#custom_business_phone_length_error').hide();
                 }
                return false;
            }

        });
        $(document).on('blur', '#business_mobile', function(){
            $('#custom_business_mobile_length_error').hide();
            var phone = $('#business_mobile').val().replace(/\D/g,'').length;
            if(phone != 10){
                if(typeof($('#business_mobile-error').html()) == 'undefined' || $('#business_mobile-error').is(':visible') === false){
                    $('#custom_business_mobile_length_error').show();
                 }else{
                    $('#custom_business_mobile_length_error').hide();
                 }
                return false;
            }

        });*/
    /*$('#update_business_frm').validate({
            errorElement: 'p',
            rules: {
                business_first_name:{
                    required: true,
                    accept: true
                },
                business_last_name:{
                    required: true,
                    accept: true
                },
                company_name:{
                    required:true
                },
                business_phone:{
                    required:true,
                    remote:{
                        type: 'post',
                        url: '/admin/check-user-exists/',
                        dataType: 'json',
                        async:true,
                        data: {
                            check_type: function() {
                                return "business";
                            }
                        },
                        dataFilter: function(data) {
                            var response = JSON.parse(data);
                            if(response.error == 0 && typeof(response.data.exists) != 'undefined'&& response.data.exists === true){
                                return false;
                            }else{
                                return true;
                            }

                        }
                    }
                },
                business_mobile:{
                    required:true,
                },
                business_email:{
                    required:true,
                    email:true,
                    remote:{
                        type: 'post',
                        url: '/admin/check-user-exists/',
                        dataType: 'json',
                        async:true,
                        data: {
                            check_type: function() {
                                return "business";
                            }
                        },
                        dataFilter: function(data) {
                            var response = JSON.parse(data);
                            if(response.error == 0 && typeof(response.data.exists) != 'undefined'&& response.data.exists === true){
                                return false;
                            }else{
                                return true;
                            }

                        }
                    }
                },
                broker_license_no:{
                    required:true
                }
            },
            messages: {
                business_first_name:{
                    required: "First Name is required.",
                    accept: "Please Enter Valid First Name."
                },
                business_last_name:{
                    required: "Last Name is required.",
                    accept: "Please Enter Valid First Name."
                },
                company_name:{
                    required: "Company Name is required."
                },
                business_phone:{
                    required: "Phone no is required.",
                    remote: "Phone no already in use."
                },
                business_mobile:{
                    required: "Mobile no is required.",
                },
                business_email:{
                    required: "Email is required.",
                    email: "Please Enter Valid Email Address.",
                    remote: "Email Address already in use."
                },
                broker_license_no:{
                    required: "Broker License No is required."
                }
            }
        });*/
        $('#update_business_frm').validate({
        errorElement: 'p',
        ignore: [],
        errorPlacement: function(error, element) {
            if(element.hasClass('state')){
                error.insertAfter(element.next('.chosen-container'));
            }else{
                error.insertAfter(element);
            }
        }
        });
});
function confirm_delete_address(element){
    var del_element = $(element).closest('.add_more_address').attr('id');
    $('.del_address_btn').attr('del_element_id', del_element);
    $('#confirmAddressDeleteModal').modal('show');
}
function set_business_address_by_zipcode(response){
    try{
        var zip_state_iso_code = response.state.toLowerCase();
    }catch(ex){
        //console.log(ex);
        var zip_state_iso_code = '';
    }
    try{
        var rel_position = response.rel_position;
    }catch(ex){
        //console.log(ex);
        var rel_position = '';
    }
    if(rel_position){
        var element_id = '#update_business_frm #state_'+rel_position.toString();
        var element_opt_id = '#update_business_frm #state_'+rel_position.toString()+' > option';
    }else{
        element_id = '#update_business_frm #state';
        element_opt_id = "#update_business_frm #state > option";
    }
    $(element_opt_id).each(function() {
        try{
            var state_iso_code = $(this).attr('data-short-code').toLowerCase();
        }catch(ex){
            //console.log(ex);
            var state_iso_code = '';
        }
        if(state_iso_code == zip_state_iso_code){
           $(this).prop('selected',true);
        }
    });
    $(element_id).trigger("chosen:updated");
}

function set_business_logo_details(response){

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
            $('#business_logo_img_name').val(actual_image);
            $('#business_logo_img_id').val(actual_id);
            if(actual_image){
                var testi_img = aws_url+"company_logo/"+actual_image;
                $('#businessLogoImageId').attr('src', testi_img);
                $('#businessLogoImageDiv').show();
            }
            $('#businessLogoImageDiv .business-logo a').attr({ 'data-image-id': $('#business_logo_img_id').val(), 'data-image-name':$('#business_logo_img_name').val(), 'data-image-section': upload_to, 'data-count': '' }).addClass('confirm_image_delete');
        }
    }
}
function submit_business_frm(){
    var flag = true;
    $('#business_first_name').rules('add', {
        required: true,
        acceptcharacters: true,
        noSpace:true,
        maxlength:40,
        messages: {
            required: "First name is required.",
            acceptcharacters: "Please enter valid First Name",
            noSpace: "Please enter valid First Name",
            maxlength:"Please enter at most 40 char"
        }
    });
    $('#business_last_name').rules('add', {
        required: true,
        acceptcharacters: true,
        noSpace:true,
        maxlength:40,
        messages: {
            required: "Last name is required.",
            acceptcharacters: "Please enter valid Last Name",
            noSpace: "Please enter valid Last Name",
            maxlength:"Please enter at most 40 char"
        }
    });
    $('#company_name').rules('add', {
        required: true,
        messages: {
            required: "Company Name is required."
        }
    });
    $('#business_phone').rules('add', {
        required: true,
        phoneminlength: 10,
        phonemaxlength: 10,
        remote:{
            type: 'post',
            url: '/admin/check-user-exists/',
            dataType: 'json',
            async:true,
            data: {
                check_type: function() {
                    return "business";
                }
            },
            dataFilter: function(data) {
                var response = JSON.parse(data);
                if(response.error == 0 && typeof(response.data.exists) != 'undefined'&& response.data.exists === true){
                    return false;
                }else{
                    return true;
                }

            }
        },
        messages: {
            required: "Phone no is required.",
            remote: "Phone no already in use.",
            phoneminlength: "Please enter valid Phone no.",
            phonemaxlength: "Please enter valid Phone no.",
        }
    });
    $('#business_mobile').rules('add', {
        required: true,
        phoneminlength: 10,
        phonemaxlength: 10,
        messages: {
            required: "Mobile No. is required.",
            phoneminlength: "Please enter valid Mobile no.",
            phonemaxlength: "Please enter valid Mobile no.",
        }
    });
    $('#business_email').rules('add', {
        required:true,
        email:true,
        remote:{
            type: 'post',
            url: '/admin/check-user-exists/',
            dataType: 'json',
            async:true,
            data: {
                check_type: function() {
                    return "business";
                }
            },
            dataFilter: function(data) {
                var response = JSON.parse(data);
                if(response.error == 0 && typeof(response.data.exists) != 'undefined'&& response.data.exists === true){
                    return false;
                }else{
                    return true;
                }

            }
        },
        messages: {
            required: "Email is required.",
            email: "Please Enter Valid Email Address.",
            remote: "Email Address already in use."
        }
    });
    $('#country').each(function() {
        $(this).rules("add",
            {
                required: true,
                messages: {
                    required: "Country is required",
                }
            });
    });
//    $('#country').rules('add', {
//        required: true,
//        messages: {
//            required: "Countr is required.",
//        }
//    });
    $('#broker_license_no').rules('add', {
        required: true,
        messages: {
            required: "Broker License No. is required."
        }
    });
    $('.state').each(function() {
        $(this).rules("add",
            {
                required: true,
                messages: {
                    required: "State is required",
                }
            });
    });
    $('.office_address').each(function() {
        $(this).rules("add",
            {
                required: true,
                messages: {
                    required: "Address is required",
                }
            });
    });
    $('.zip_code').each(function() {
        $(this).rules("add",
            {
                required: true,
                //minlength:5,
                maxlength:10,
                messages: {
                    required: "Zip Code is required",
                    //minlength: "Please enter at least 5 char",
                    maxlength: "Please enter at most 10 char"
                }
            });
    });
    /*var phone = $('#business_phone').val().replace(/\D/g,'').length;
    var mobile = $('#business_mobile').val().replace(/\D/g,'').length;
    if(phone != 10){
         if(typeof($('#business_phone-error').html()) == 'undefined' || $('#business_phone-error').is(':visible') === false){
            $('#custom_business_phone_length_error').show();
         }else{
            $('#custom_business_phone_length_error').hide();
         }

       flag = false;
    }
    if(mobile != 10){
         if(typeof($('#business_mobile-error').html()) == 'undefined' || $('#business_mobile-error').is(':visible') === false){
            $('#custom_business_mobile_length_error').show();
         }else{
            $('#custom_business_mobile_length_error').hide();
         }

        flag = false;
    }*/
    if(flag == true && $('#update_business_frm').valid()){
        $.ajax({
            url: '/admin/business-info/',
            type: 'post',
            dataType: 'json',
            cache: false,
            data: $('#update_business_frm').serialize(),
            beforeSend: function(){
                $('.overlay').show();
            },
            success: function(response){
                if(response.error == 0){

                    $.growl.notice({title: "Business Info ", message: response.msg, size: 'large'});

                }else{
                    window.setTimeout(function () {
                        $.growl.error({title: "Business Info ", message: response.msg, size: 'large'});
                    }, 2000);
                }
            },
            complete: function(){
                $('.overlay').hide();
            },
        });
    }
}

function state_list_update(){
   country_id = $("#country").val()
   csrf_token = $('input[name="csrfmiddlewaretoken"]').val();
   if (country_id){
        $.ajax({
            url: '/admin/state-list/',
            type: 'post',
            dateType: 'json',
            cache: false,
            data: {country_id: country_id, 'csrfmiddlewaretoken': csrf_token},
            beforeSend: function(){
                $('.overlay').show();
            },
            success: function(response){
                $('.overlay').hide();
                if(response.error == 0){
                    state_lists = response.state_lists;
                    var option_html = "";
                    $('.state').empty();
                    $('.state').append("<option value=''>Select</option>");
                    $.each( state_lists, function( key, value ) {
                        $('.state').append("<option value="+value.id+" data-short-code="+value.iso_name+">"+value.state_name+"</option>");
                    });
                    $('.state').trigger("chosen:updated");
                }

            }
        });
   }else{
        $('.state').empty().append("<option value=''>Select</option>");
   }

}

$("#country").change(function(){
    $(".state").empty().append("<option value=''>Select</option>");
    $(".zip_code").val("");
    state_list_update();
});