$(document).ready(function(){
  setInterval(function(){
    checkPayment();
  }, 10000);
});

function admin_journey(){
    $.ajax({
        url: '/demo/set-tour-session/',
        type: 'post',
        dataType: 'json',
        cache: false,
        beforeSend: function () {
            $('.overlay').show();
        },
        complete: function () {
        },
        success: function(response){
            $('.overlay').hide();
            if(response.error == 0){
                window.location = "/demo/admin/dashboard/";
            }
         }
    });
}

function user_journey(){
    $.ajax({
        url: '/demo/set-tour-session/',
        type: 'post',
        dataType: 'json',
        cache: false,
        beforeSend: function () {
            $('.overlay').show();
        },
        complete: function () {
        },
        success: function(response){
            $('.overlay').hide();
            if(response.error == 0){
                window.location = "/demo/?journey=front";
            }
         }
    });
}

function checkPayment(){
    $.ajax({
        // url: '/demo/check-payment/',
        url: '/check-payment/',
        type: 'post',
        //dataType: 'json',
        cache: false,
        data: {},
        beforeSend: function(){

        },
        success: function(response){
            if(response.error == 0){
                window.location.href = '/admin/payment/success-payment/';
            }
        }
    });
}


function payment(){
    $.ajax({
        url: "/demo/payment/",
        type: "post",
        dataType: "json",
        cache: false,
        data: {},
        beforeSend: function () {
            $('.overlay').show();
        },
        complete: function(){
        },
        success: function (response) {
            $('.overlay').hide();
            console.log(response);
            if (response.status == 200){
                setTimeout(function(){
                    if(response.status == 200){
                         window.open(response.data.stripe_active_payment_link+"?prefilled_email="+response.email, '_blank');
                         //window.open(response.data.stripe_payment_link+"?prefilled_email="+response.email, '_blank');
                    }
                }, 1000);
            }
        }
    });
}
