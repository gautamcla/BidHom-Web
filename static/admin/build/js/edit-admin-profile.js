$(function() {

    $('#editProfile').parsley();
    
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
    $(document).on('submit', '#editProfile', function(event){
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

    $("#email").blur(function(){
        $(this).parsley().removeError("myCustomError");
        // check if the value is already current one
        if(this.value == current_email && $(this).attr('id') == 'email'){
            return false
        }
        check_user_exists(this.value, '', $(this))
    });

    // chnage user pass
    $(document).on('submit', '#changeMyPass', function(event){
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

    .on('hidden.bs.modal', '.change-user-pass', function (e) {
        $('#changeMyPass')[0].reset()
        $('#changeMyPass').parsley().reset()
    })


    
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


const check_user_exists = (email='', phone='', element) => {
    return $.ajax({
        url: '/admin/check-user-exists/',
        type: 'post',
        dataType: 'json',
        async: false,
        data: {email: email, phone: phone},
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