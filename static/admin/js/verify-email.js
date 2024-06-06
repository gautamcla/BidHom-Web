$(document).on('click', '#check_email_template_submit', function(){
    var template_list = $("#template_list").val();
    if (template_list == ""){
        $.growl.notice({title: "Validation Error ", message: "Please Select Event Type.", size: 'large'});
        return false;
    }
    var email_to = $("#email_to").val();
    if (email_to == ""){
        $.growl.notice({title: "Validation Error ", message: "Please Enter Email.", size: 'large'});
        return false;
    }
    var params_data = $("#params_data").val();
    csrf_token = $('input[name="csrfmiddlewaretoken"]').val();
    $.ajax({
            url: '/admin/verify-email/',
            type: 'post',
            dataType: 'json',
            cache: false,
            data: {'params_data': params_data, 'template_list': template_list, 'email_to': email_to, 'csrfmiddlewaretoken': csrf_token},
            beforeSend: function(){
                $('.overlay').show();
            },
            success: function(response){
                $('.overlay').hide();
                $.growl.notice({title: "Verify Email ", message: response.msg, size: 'large'});
            }
    });


});