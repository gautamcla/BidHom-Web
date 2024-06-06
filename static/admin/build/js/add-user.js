$(function() {
    // check for user type
    var tech = getUrlParameter('user_type')
    if(tech)
      setTimeout(function(){ $('#user_type').val(tech).change(); }, 1000);

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

     //add user 
    $(document).on('submit', '#addUser', function(event){
        event.preventDefault();
        $(".loaderDiv").show();
        $('#user_type, #subscription_id').attr('disabled', false)
        data = $(this).serialize()
        $('#user_type, #subscription_id').attr('disabled', true)
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
                    } else {
                        window.location.href = "/admin/agent-broker"
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

    .on('input', "#email, #business_email, #telephone, #business_phone_no", function(){
        $(this).parsley().removeError("myCustomError");
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

    $("#email, #business_email").blur(function(){
        $(this).parsley().removeError("myCustomError");
        check_type = ($('#user_type').val() == '2')? 'business':'user';
        check_user_exists(this.value, '', check_type, element=$(this))
    });
    
    $("#telephone, #business_phone_no").blur(function(){
        $(this).parsley().removeError("myCustomError");
        check_type = ($('#user_type').val() == '2')? 'business':'user';
        check_user_exists('', this.value, check_type, element=$(this))
    });

    
});

$('.alphaAccpt').on('keypress', function(event) {
    var key = event.keyCode;
    return ((key >= 65 && key <= 90) || (key == 8) || (key >= 97 && key <= 122));
  });

// let getUrlParameter = (sParam) => {
//     var sPageURL = window.location.search.substring(1),
//         sURLVariables = sPageURL.split('&'),
//         sParameterName,
//         i;

//     for (i = 0; i < sURLVariables.length; i++) {
//         sParameterName = sURLVariables[i].split('=');

//         if (sParameterName[0] === sParam) {
//             return typeof sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
//         }
//     }
//     return false;
// };


//  show alert AFTER ajax call
// const showAlert = (msg, error) => {
//     new PNotify({
//         title: (error == 1 )?'Error':'Success',
//         text: msg,
//         type: (error == 1)? 'error':'success',
//         styling: 'bootstrap3'
//     });
// }


const check_user_exists = (email='', phone='', check_type='user', element) => {
    if (email == '' && phone == ''){
        return false
    }
    return $.ajax({
        url: '/admin/check-user-exists/',
        type: 'post',
        dataType: 'json',
        async: false,
        data: {email: email, phone: phone, check_type:check_type},
        success: function(data){
            if(data.error == 1 ){
                // check for availability
                var object_text = (email == '')? 'Phone no': 'Email';
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