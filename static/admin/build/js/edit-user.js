$(function() {

    // try{
    //     initdrozone({
    //         url: '/admin/save-images/',
    //         field_name: 'agent_image',
    //         file_accepted: '.png, .jpg, .jpeg, .svg',
    //         element: 'uploadAgentImgFrm',
    //         upload_multiple: false,
    //         max_files: 1,
    //         call_function: set_agent_details
    //     });
    // }catch(ex){
    //     console.log(ex);
    // }

    // handle edit address type 
    $('#user_type').change(function(){
        if(this.value == '2'){
            $('#businedInfo').show()
            $('#addMoreAddress').show()
            $('.add_more_address').show();
        } else {
            $('#businedInfo').hide()
            $('#addMoreAddress').hide()
            $('.add_more_address').not(':first').hide();
        }
    });

    $('#addUser').parsley();
    
    // If this code is commented, there will be two validation messages (one for each field).
    $.listen('parsley:field:validated', function(fieldInstance){
        if (fieldInstance.$element.is(":hidden")) {
            // hide the message wrapper
            fieldInstance._ui.$errorsWrapper.css('display', 'none');
            // set validation result to true
            fieldInstance.validationResult = true;
            return true;
        }
    });

     //active inactive 
    $(document).on('submit', '#addUser', function(event){
        event.preventDefault();
        $(".loaderDiv").show();
        var is_agent = $("#is_agent").val();
        $('#user_type, #subscription_id').attr('disabled', false);
        data = $(this).serialize();
        $('#user_type, #subscription_id').attr('disabled', true);
        $.ajax({
            type: $(this).attr('method'),
            url: $(this).attr('action'),
            data: data,
            success: function (data) {
                // change html buttons
                showAlert(data.msg, data.error)
                if(data.error == 0){
                    if ($('#user_type').val() == 1){
                        //window.location.href = "/admin/buyer-seller"
                        window.location.href = "/admin/users"
                    } else if(parseInt(is_agent) == 1) {
                        //window.location.href = "/admin/agent-broker"
                        window.location.href = "/admin/agent-list"

                    }else{
                        window.location.href = "/admin/broker-list"
                    }
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


    // check if domain name is blank
    .on('keyup change', '#domain_name', function(){
        if (this.val == ''){
            $('#hiddendomainUrl, #domainUrl').val('')
        }
    });

    $("#email, #business_email").blur(function(){
        $(this).parsley().removeError("myCustomError");
        // check if the value is already current one
        if(this.value == current_email && $(this).attr('id') == 'email'){
            return false
        }
        if(this.value == current_business_email && $(this).attr('id') == 'business_email'){
            return false
        }
        check_type = ($('#user_type').val() == '2')? 'business':'user';
        check_user_exists(email=this.value, check_type=check_type, element=$(this))
    });
    
    $("#telephone, #business_phone_no").blur(function(){
        $(this).parsley().removeError("myCustomError");
        // check if the value is already current one
        if(this.value == '' || this.value == phone && $(this).attr('id') == 'telephone'){
            return false
        }
        if(this.value == '' || this.value == business_phone && $(this).attr('id') == 'business_phone_no'){
            return false
        }
        check_type = ($('#user_type').val() == '2')? 'business':'user';
        check_user_exists(phone=this.value, check_type=check_type, element=$(this))
    });

    $("#domain_name").blur(function(){
        $(this).parsley().removeError("myCustomError");
        // check if the value is already current one
        if( this.value == '' || this.value == domain_name && $(this).attr('id') == 'domain_name'){
            return false
        }
        check_user_exists(domain_name=this.value, element=$(this))
    });


    // chnage user pass
    $(document).on('submit', '#changeUserPass', function(event){
        event.preventDefault();
        $(".loaderDiv").show();
        $.ajax({
            type: $(this).attr('method'),
            url: $(this).attr('action'),
            data: $(this).serialize(),
            success: function (data) {
                // change html buttons
                showAlert(data.msg, data.error)
                $(".loaderDiv").hide();
                $('.change-user-pass').modal('hide')
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


    // .on('click', '.confirm_image_delete', function(e) {
    //     e.preventDefault();
    //     var data_count = '';
    //     var data_article_id = '';
    //     var agent_id = '';
    //     var section = $(this).attr('data-image-section');
    //     var image_id = $(this).attr('data-image-id');
    //     var image_name = $(this).attr('data-image-name');
    //     if ($(this).attr('data-count')) {
    //         data_count = $(this).attr('data-count');
    //     }
    //     if ($(this).attr('data-article-id')) {
    //         data_article_id = $(this).attr('data-article-id');
    //     }
    //     var agent_id = $('#add_agent_form #agent_id').val();
    //     $('#confirmImageDeleteModal #popup_article_id').val(data_article_id);
    //     $('#confirmImageDeleteModal #popup_section').val(section);
    //     $('#confirmImageDeleteModal #popup_image_id').val(image_id);
    //     $('#confirmImageDeleteModal #popup_image_name').val(image_name);
    //     $('#confirmImageDeleteModal #popup_count').val(data_count);
    //     $('#confirmImageDeleteModal #popup_agent_id').val(agent_id);
    //     $('#confirmImageDeleteModal').modal('show');
    // })

    // .on('click', '#del_image_false', function(e) {
    //     e.preventDefault();
    //     $('#confirmImageDeleteModal #popup_article_id').val('');
    //     $('#confirmImageDeleteModal #popup_section').val('');
    //     $('#confirmImageDeleteModal #popup_image_id').val('');
    //     $('#confirmImageDeleteModal #popup_image_name').val('');
    //     $('#confirmImageDeleteModal #popup_count').val('');
    //     $('#confirmImageDeleteModal #popup_agent_id').val('');
    //     $('#confirmImageDeleteModal').modal('hide');
    // })

    // .on('click', '#del_image_true', function(e) {
    //     e.preventDefault();

    //     var article_id = $('#confirmImageDeleteModal #popup_article_id').val();
    //     var section = $('#confirmImageDeleteModal #popup_section').val();
    //     var id = $('#confirmImageDeleteModal #popup_image_id').val();
    //     var name = $('#confirmImageDeleteModal #popup_image_name').val();
    //     var count = $('#confirmImageDeleteModal #popup_count').val();
    //     var agent_id = $('#confirmImageDeleteModal #popup_agent_id').val();
    //     delete_image({
    //         article_id: article_id,
    //         section: section,
    //         id: id,
    //         name: name,
    //         count: count,
    //         agent_id: agent_id,
    //         // site_id: $('#site_id').val()
    //     });
    //     $('#confirmImageDeleteModal').modal('hide');
    // })

    .on('click', ".plus_addr_div", function () {
        var new_div = $(".add_more_address:last").clone().insertAfter(".add_more_address:last");
        var count = parseInt($('#total_section').val());
        $(".plus_addr_div").hide();
        $(".plus_addr_div:first").show();
        $(".minus_addr_div").show();
        $(".minus_addr_div:first").hide();

        new_div.attr('id', 'add_more_address_' + count).attr('rel_position', count);
        new_div.find(".state").attr('id', 'state_' + count).attr('name','state_'+count).siblings('label').attr('for', 'state_' + count);
        new_div.find('.chosen-container').remove();
        new_div.find(".zip_code").attr('id', 'zip_code_' + count).attr('name','zip_code_'+count).siblings('label').attr('for', 'zip_code_' + count);
        $('#zip_code_' + count).val('');
        new_div.find(".office_address").attr('id', 'office_address_' + count).attr('name','office_address_'+count).siblings('label').attr('for', 'office_address_' + count);
        new_div.find(".minus_addr_div").attr('elementId', count)
        $('#office_address_' + count).val('');

        count = count+1;
        $('#total_section').val(count);
    })

    .on("click", ".minus_addr_div", function () {
        var row_id = $(this).attr('elementId');
        $('#add_more_address_'+row_id).remove();
        var total_section = parseInt($('div.add_more_address').length);
        $('#confirmAddressDeleteModal').modal('hide');
        $(".add_more_address").each(function(index){
          $(this).find('.office_address').attr('id','office_address_'+index).attr('name','office_address_'+index).siblings('label').attr('for','office_address_'+index);
          $(this).find('.state').attr('id','state_'+index).attr('name','state_'+index).siblings('label').attr('for','state_'+index);
          $(this).find('.zip_code').attr('id','zip_code_'+index).attr('name','zip_code_'+index).siblings('label').attr('for','zip_code_'+index);
          $(this).attr('id','add_more_address_'+index).attr('rel_position', index);
          $(this).find(".minus_addr_div").attr('elementId', index)

        });
        $('#total_section').val(total_section);
    })

    .on('hidden.bs.modal', '.change-user-pass', function (e) {
        $('#changeUserPass')[0].reset()
        $('#changeUserPass').parsley().reset();
    })


    .on('keyup', '.zip_code', function(){
        zip_code = $(this).val();
        if(zip_code.length > 4){
            params = {
            'zip_code': zip_code,
            'call_function': set_user_address_by_zipcode,
            'id': $(this).attr('id').split('_')[2]
            }
            get_user_address_by_zipcode(params);
        }
   });


    
});

$('.alphaAccpt').on('keypress', function(event) {
    var key = event.keyCode;
    return ((key >= 65 && key <= 90) || (key == 8) || (key >= 97 && key <= 122));
  });


//  show alert AFTER ajax call
// const showAlert = (msg, error) => {
//     new PNotify({
//         title: (error == 1 )?'Error':'Success',
//         text: msg,
//         type: (error == 1)? 'error':'success',
//         styling: 'bootstrap3'
//     });
// }

const check_user_exists = (email='', phone='',domain_name='', check_type='user', element) => {
    return $.ajax({
        url: '/admin/check-user-exists/',
        type: 'post',
        dataType: 'json',
        async: false,
        data: {email: email, phone: phone, domain_name: domain_name, check_type:check_type},
        success: function(data){
            if(data.error == 1 ){
                // check for availability
                var object_text = (email == '')? 'Phone no': 'Email';
                if( domain_name != ''){
                    object_text = 'Domain Name'
                }
                //show error
                $(element).parsley().addError("myCustomError", { 'message': 'This '+ object_text  +' is already exists', updateClass: true}); 
            }
        }
    });
}




const get_user_address_by_zipcode = (params) => {
    var call_function;
    var zip_code = params.zip_code;
    if(params.call_function){
        call_function = params.call_function;
    }

    try{
        rel_position = params.rel_position;
    }catch(ex){
        console.log(ex);
        rel_position = '';
    }
    $.ajax({
        url: '/zipcode-address-details/',
        type: 'post',
        dateType: 'json',
        cache: false,
        data: {zip_code: zip_code},
        success: function(response){
            console.log(response);
            if(response.error == 0){
                custom_response = {
                    status: response.status,
                    state: response.state,
                    city: response.city,
                    error: response.error,
                    rel_position: rel_position,
                    id: params.id
                }
               customCallBackFunc(call_function, [custom_response]);
            }

        }
    });
}


function set_user_address_by_zipcode(response){
    $('#city_' + response.id).val(response.city);
    try{
        var zip_state_iso_code = response.state.toLowerCase();
    }catch(ex){
        var zip_state_iso_code = '';
    }
    $("#state_" + response.id +" > option").each(function() {
        try{
            var state_iso_code = $(this).attr('data-short-code').toLowerCase();
        }catch(ex){
            var state_iso_code = '';
        }
        if(state_iso_code == zip_state_iso_code){
           $(this).prop('selected',true);
        }
    });
}