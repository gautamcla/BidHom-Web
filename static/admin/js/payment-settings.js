$(document).ready(function(){
    $('#payment_frm').validate({
        ignore: [],
        errorElement: 'p',
        rules:{
            stripe_public_key:{
                required: true,
            },
            stripe_secret_key:{
                required: true,
            }
        },
        messages:{
            stripe_public_key:{
                required: "Stripe public key is required.",
            },
            stripe_secret_key:{
                required: "Stripe secret key is required.",
            }
        },
        submitHandler: function(){
            $.ajax({
                url: '/admin/save-payment-settings/',
                type: 'post',
                dataType: 'json',
                cache: false,
                data: $('#payment_frm').serialize(),
                beforeSend: function(){
                    $('.overlay').show();
                },
                success: function(response){
                    if(response.error == 0){
                        $.growl.notice({title: "Payment Settings", message: response.msg, size: 'large'});
                    }else{
                        $.growl.error({title: "Payment Settings", message: response.msg, size: 'large'});
                    }
                    setTimeout(function(){
                        location.reload(true);
                    },2000);
                },
                complete: function(){
                    $('.overlay').hide();
                },
            });
        }

    });
});