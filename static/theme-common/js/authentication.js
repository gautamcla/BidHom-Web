var recaptchachecked = false;

$(function(){
    window.addEventListener( "pageshow", function ( event ) {
      var historyTraversal = event.persisted ||
                             ( typeof window.performance != "undefined" &&
                                  window.performance.navigation.type === 2 );
      if(historyTraversal){
        // Handle page restore.
        //window.location.reload();
        $('.form-input').each(function(){
            var value = $(this).val();
            if(this.value != ''){
                $(this).parents('.form-group').addClass('focused');
            }else{
                $(this).parents('.form-group').removeClass('focused');
            }
        });
      }
    });
    //add_focused_class();
    $(".chosen-select").chosen().change(function () {
        $("#user_register_frm").validate().element(".chosen-select");
    });

    $('.alphaAccpt').on('keypress', function(event) {
        var key = event.keyCode;
        return ((key >= 65 && key <= 90) || (key == 8) || (key >= 97 && key <= 122));
      });

    $.validator.addMethod("uppercasepass",
        function(value, element, param) {
            if (!/[A-Z]/.test(value)) {
                return false;
            } 
            return true
    },"Include at least 1 uppercase letter.");


    $.validator.addMethod("validate_email", function(value, element) {

        if (/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(value)) {
            return true;
        } else {
            return false;
        }
    }, "Please enter a valid Email.");

    $.validator.addMethod("acceptcharacters", function (value, element)
        {
            return this.optional(element) || /^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-,.!_@ ])*$/.test(value);
        }, "Only Letters is allowed");


    $.validator.addMethod("numberpass",
        function(value, element, param) {
           if (!/[0-9]/.test(value)) {
                return false;
            }
            return true;
    },"Include at least 1 number.");

    $.validator.addMethod("noSpace", function(value, element) { 
        return value.indexOf(" ") < 0 && value != ""; 
      }, "No space required");
      

    $('.form-input').focus(function(){
      $(this).parents('.form-group').addClass('focused');
    });

    $('.form-input').blur(function(){
      var inputValue = $(this).val();
      if ( inputValue == "" ) {
        $(this).removeClass('filled');
        $(this).parents('.form-group').removeClass('focused');
      } else {
        $(this).addClass('filled');
      }
    });

    $(document).on('click', '#btn_reg', function(e){
        e.preventDefault();
        $("#user_register_frm").submit();
    })

    .on('click', '#agreeTerm', function(){
        if($(this).is(":checked")){
            $('#btn_reg').prop('disabled', false);
        } else {
            $('#btn_reg').prop('disabled', true);
        }
    })

    .on('change', '#describedBy', function(){
        if($(this).val() == 3 || $(this).val() == '3'){
            $('.broker-agent-inputs').show()
        } else {
            $('.broker-agent-inputs').hide()
        }
    });

    $('#user_register_frm').validate({
        ignore: ":hidden:not(select)",
        errorElement: 'p',
        onkeyup: false,
        errorPlacement: function(error, element) {
            if (element.attr("name") == "described_by" ){
                //error.insertAfter(element.siblings(".chosen-container"));
                error.insertAfter(element.next('.chosen-container'));
            }
            else if(element.attr("name") == "agree_term"){
                error.insertAfter(".check-label");
            }
            else{
                error.insertAfter(element);
            }


        },
        rules: {
            described_by:{
                required:true,
            },
            first_name:{
                required:true,
                acceptcharacters: true,
                noSpace:true
            },
            last_name:{
                required:true,
                acceptcharacters:true,
                noSpace:true
            },
            brokerage_name:{
                required:true  
            },
            licence_number:{
                required:true  
            },
            email:{
                required:true,
                email: true,  
                validate_email: true,    
                remote:{
                    type: 'post',
                    url: '/check-user-exists/',
                    dataType: 'json',
                    async:false,
                    data: {
                        email: function() {
                            return $('#email').val();
                        },
                        phone: '',
                        check_type: 'main'
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
            password:{
                required:true,
                minlength:6,
                maxlength:12,
                uppercasepass:true,
                numberpass:true
            },
            phone:{
                required:true,
                minlength:10,
                maxlength:10,
                number: true,
//                remote:{
//                    type: 'post',
//                    url: '/check-user-exists/',
//                    dataType: 'json',
//                    async:false,
//                    data: {
//                        email: '',
//                        phone: function() {
//                            return $('#phone').val();
//                        },
//                        check_type: 'main'
//                    },
//                    dataFilter: function(data) {
//                        var response = JSON.parse(data);
//                        if(response.error == 0 && typeof(response.data.exists) != 'undefined'&& response.data.exists === true){
//                            return false;
//                        }else{
//                            return true;
//                        }
//
//                    }
//                }
            },
            agree_term:{
                required:true
            }
           
        },
        messages: {
            described_by:{
                required:"This field is required.",
            },
            first_name:{
                required: "First Name is required.",
                acceptcharacters: "Please Enter Valid First Name.",
            },
            last_name:{
                required: "Last Name is required.",
                acceptcharacters: "Please Enter Valid Last Name."
            },
            email:{
                required: "Email is required",
                email: "Please Enter Valid Email Address.",
                remote: 'Email Address already in use'
            },
            password:{
                required: "Password is required.",
                maxlength: "Please enter not more than 12 characters."
            },
            phone:{
                required: "Phone no is required.",
                minlength: "Please enter valid phone no",
                maxlength: "Please enter valid phone no",
                number: "Please enter valid phone no",
                remote: 'Phone no already in use.'
            },
            agree_term:{
                required: "Please agree to Term & Conditions before register",
            }
        },
        submitHandler: function(e){
            $.ajax({
                url: '/save-user/',
                type: 'post',
                dateType: 'json',
                cache: false,
                data: $('#user_register_frm').serialize(),
                beforeSend: function(){
                    $("#btn_reg").attr("disabled", true);
                    $('.overlay').show();
                },
                success: function(response){
                    if(response.error == 0 || response.status == 200 || response.status == 201){
                        $.growl.notice({title: "User Registration ", message: response.msg, size: 'large'});
                        $('#regSection').removeClass('register-wrap').empty();
                        $('#regSection').html(response.reg_success_html)
                    }else{
                        //  reset recapctha on ajax failed
                        if (typeof $('#grecaptcha') != "undefined") { grecaptcha.reset(); } 
                        window.setTimeout(function () {
                            $.growl.error({title: "User Registration ", message: response.msg, size: 'large'});
                        }, 2000);
                    }
                },
                complete: function(jqXhr) {
                    $("#btn_reg").attr("disabled", false);
                    $('.overlay').hide();
                }
            });
        }
    });
   

    $('#user_login_frm').validate({
        errorElement: 'p',
        rules: {
            email:{
                required:true,
                email:true,
                validate_email: true
            },
            password:{
                required:true,
            }
        },
        messages: {
            email:{
                required: "Email is required",
                email: "Please Enter Valid Email Address"
            },
            password:{
                required: "Password is required"
            }
        },
        submitHandler: function(){
            $.ajax({
                url: '/login/',
                type: 'post',
                dateType: 'json',
                cache: false,
                data: $('#user_login_frm').serialize(),
                beforeSend: function(){
                    $("#btn_login").attr("disabled", true);
                    $('.overlay').show();
                },
                success: function(response){
                    if(response.error == 0 || response.status == 200 || response.status == 201){
                        $.growl.notice({title: "User Login ", message: response.msg, size: 'large'});
                        if(response.next){
                            window.setTimeout(function () {
                                window.location.href = response.next;
                            }, 2000);
                        } else {
                            window.setTimeout(function () {
                                window.location.reload();
                            }, 2000);
                        }
                    }else{
                        window.setTimeout(function () {
                            $.growl.error({title: "User Login ", message: response.msg, size: 'large'});
                        }, 2000);
                        $("#btn_login").attr("disabled", false);
                    }
                },
                complete: function(jqXhr) {
                    $("#btn_login").attr("disabled", false);
                    $('.overlay').hide();
                }
            });
        }
    });

    $('#user_forget_pass_frm').validate({
        errorElement: 'p',
        rules: {
            email:{
                required:true,
                email:true,
                validate_email: true
            }
        },
        messages: {
            email:{
                required: "Email is required",
                email: "Please Enter Valid Email Address"
            }
        },
        submitHandler: function(){
            $.ajax({
                url: '/forgot-password/',
                type: 'post',
                dateType: 'json',
                cache: false,
                data: $('#user_forget_pass_frm').serialize(),
                beforeSend: function(){
                    $("#forgotBtn").attr("disabled", true);
                    $('.overlay').show();
                },
                success: function(response){
                    if(response.error == 0){
                        $.growl.notice({title: "Forget password ", message: response.msg, size: 'large'});
                        $("#email").val("");

                    }else{
                        window.setTimeout(function () {
                            $.growl.error({title: "Forget password ", message: response.msg, size: 'large'});
                        }, 2000);
                    }
                },
                complete: function(jqXhr) {
                    $("#forgotBtn").attr("disabled", false);
                    $('.overlay').hide();
                }
            });
        }
    });

    $('#user_pass_reset_frm').validate({
        errorElement: 'p',
        rules: {
            password:{
                required:true,
                minlength:6,
                maxlength:12,
                uppercasepass:true,
                numberpass:true
            },
            confirm_password:{
                required:true,
                minlength:6,
                maxlength:12,
                uppercasepass:true,
                numberpass:true,
                equalTo: "#password"
            },
        },
        messages: {
            password:{
                required: "New Paassword is required"
            },
            confirm_password:{
                required: "Confirm Paassword is required",
                equalTo: "Confirm Password should be same as New Password",
            }
        },
        submitHandler: function(){
            $.ajax({
                url: '/reset-password/',
                type: 'post',
                dateType: 'json',
                cache: false,
                data: $('#user_pass_reset_frm').serialize(),
                beforeSend: function(){
                    $("#resetBtn").attr("disabled", true);
                    $('.overlay').show();
                },
                success: function(response){
                    if(response.error == 0){
                        $.growl.notice({title: "Reset password ", message: response.msg, size: 'large'});
                        window.setTimeout(function () {
                            window.location.href = '/login/';
                        }, 2000);
                    }else{
                        window.setTimeout(function () {
                            $.growl.error({title: "Forget password ", message: response.msg, size: 'large'});
                        }, 2000);
                    }
                },
                complete: function(){
                    $("#resetBtn").attr("disabled", true);
                    $('.overlay').hide();
                },
            });

        }
    });
    $('.form-input').blur(function(){
          var inputValue = $(this).val();
          if ( inputValue == "" ) {
            $(this).removeClass('filled');
            $(this).parents('.form-group').removeClass('focused');
          } else {
            $(this).addClass('filled');
          }
        });

    $('.form-input').on('input',function(e){
        if(this.value != ''){
            $(this).parents('.form-group').addClass('focused');
        }else{
            $(this).parents('.form-group').removeClass('focused');
        }
    });
});

function view_password(element){
    if($('#'+element).attr('type') == 'password'){
        $('#'+element).attr('type', 'text');
    }else{
        $('#'+element).attr('type', 'password');
    }
}

function remove_view_password(element){
    $('#'+element).attr('type', 'password');
}

function recaptchaCallback() {
    //If we managed to get into this function it means that the user checked the checkbox.
    recaptchachecked = true;
}
