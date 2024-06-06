historypage = 1;
historyperpage = 10;
$(document).ready(function(){
    /*$(document).on('click', '#changePlanBtn', function(){
        $('.dashboard_section').hide();
        $('.plan_section').show();
    });*/


    $(document).on('click', '#planNextBtn', function(){
        var selected_plan = 0;
        var plan_name = "";
        var plan_cost = '';
        $(".selectPlanBtn").each(function(){
          if($(this).parent().find('.selected-plan').is(':visible') === true){
            selected_plan = selected_plan+1;
          }
        });
        if(selected_plan > 0){
            var current_plan_id = $("#current_plan_id").val()
            var selected_plan_id = $('#plan_id').val();
            var plan_price_id = $('#plan_price_id').val();
            if (selected_plan_id < current_plan_id & false){  // ----------This section is not in use-------------
                // --------------------------Update package for next payment-----------------------
                $.ajax({
                    url: '/admin/update-subscription-plan/',
                    type: 'post',
                    dataType: 'json',
                    cache: false,
                    data: {"plan_price_id": plan_price_id},
                    beforeSend: function(){
                        $('.overlay').show();
                    },
                    success: function(response){
                        $('.overlay').hide();
                        window.setTimeout(function () {
                            $.growl.error({title: "Payment Subscription ", message: response.msg, size: 'large'});
                        }, 2000);
                    }
                });
            }else if(false){ // ----------This section is not in use-------------
                // --------------------------Package quick update-----------------------
                plan_name = $('.selectPlanBtn').parent().find('.selected-plan:visible').attr('rel_name');
                plan_cost = $('.selectPlanBtn').parent().find('.selected-plan:visible').attr('rel_cost');
                var plan_cost_html = 'Setup fee: $0';
                if(plan_cost){
                    var plan_cost_html = 'Setup fee: $'+ plan_cost;
                }
                $('#selectedPlanName').html(plan_name);
                $('#selectedPlanCost').html(plan_cost_html);

                $('.dashboard_section').hide();
                $('.theme_section').show();
            }else{
                   var plan_price_id = $("#plan_price_id").val();
                   var theme_id = $('#theme_id').val();
                   $.ajax({
                        url: '/admin/save-plan-change/',
                        type: 'post',
                        //dataType: 'json',
                        cache: false,
                        data: {"plan_price_id": plan_price_id, "theme_id": theme_id},
                        beforeSend: function(){
                            $('.overlay').show();
                        },
                        success: function(response){
                            $('.overlay').hide();
                            if(response.error == 0){
                                //$.growl.notice({title: "User Plan ", message: response.msg, size: 'large'});
                                window.location.href = '/admin/pay-now/';
                            }else{
                                window.setTimeout(function () {
                                    $.growl.error({title: "User Plan ", message: response.msg, size: 'large'});
                                }, 2000);
                            }
                        }
                   });
            }
        }else{
            $.growl.error({title: "Choose Plan ", message: "Please select a plan", size: 'large'});
        }

    });
    $(document).on('click', '#change_theme_pass_false,#change_theme_pass_false_top', function(){
        $('#changeThemeSecurityModal').modal('hide');
    });
    // ---------------------This is not working changed from "themeNextBtn" to "themeNextBtnOld"-----------------
    $(document).on('click', '#themeNextBtnOld', function(){
        var selected_theme = 0;
        var theme_name = 'Selected Design: Real State';
        $(".selectThemeBtn").each(function(){
          if($(this).hasClass('selected_theme') === true){
            selected_theme = selected_theme+1;
          }
        });
        if(selected_theme > 0){
           theme_name = $('.selected_theme').attr('rel_name');
           theme_id = $('.selected_theme').attr('rel');
           theme_name_html = 'Selected Design: '+theme_name;
           $('#selectedThemeName').html(theme_name_html);
           $('.theme_img').hide();
           if(parseInt(theme_id) == 1){
                $('#theme_1').show();
           } else if(parseInt(theme_id) == 5){
                $('#theme_2').show();
           } else{
                $('#theme_3').show();
           }
           $('.dashboard_section').hide();
           $('.payment_section').show();
        }else{
            $.growl.error({title: "Choose Theme ", message: "Please select a Theme", size: 'large'});
        }
    });

    $(document).on('click', '#themeNextBtn', function(){
        var selected_theme = 0;
        var theme_name = 'Selected Design: Real State';
        $(".selectThemeBtn").each(function(){
          if($(this).hasClass('selected_theme') === true){
            selected_theme = selected_theme+1;
          }
        });
        if(selected_theme > 0){
           var plan_price_id = $("#plan_price_id").val();
           var theme_id = $('#theme_id').val();
           $.ajax({
                url: '/admin/save-plan-change/',
                type: 'post',
                //dataType: 'json',
                cache: false,
                data: {"plan_price_id": plan_price_id, "theme_id": theme_id},
                beforeSend: function(){
                    $('.overlay').show();
                },
                success: function(response){
                    $('.overlay').hide();
                    if(response.error == 0){
//                        $.growl.notice({title: "User Plan ", message: response.msg, size: 'large'});
                        window.location.href = '/admin/pay-now/';
                    }else{
                        window.setTimeout(function () {
                            $.growl.error({title: "User Plan ", message: response.msg, size: 'large'});
                        }, 2000);
                    }
                }
           });
        }else{
            $.growl.error({title: "Choose Theme ", message: "Please select a Theme", size: 'large'});
        }
    });

    $(document).on('click', '.makePaymentBtn', function(){
        $('.dashboard_section').hide();
        $('.payment_success_section').show();
    });
    $(document).on('click', '.dashboard_back_btn', function(){
        //$('.dashboard_section').hide();
        if($('.payment_section').is(':visible') === true){
            $('.dashboard_section').hide();
            $('.theme_section').show();
        }else if($('.plan_section').is(':visible') === true){
            $('.dashboard_section').hide();
            $('.change_plan_section').show();
        }else if($('.theme_section').is(':visible') === true){
            $('.dashboard_section').hide();
            $('.plan_section').show();
        }else{
            $('.dashboard_section').hide();
            $('.change_plan_section').show();
        }

    });
    $(document).on('click', '.selectPlanBtn', function(){

        var rel_id = $(this).attr('rel');
        var plan_price_id = $(this).attr('rel_plan_price');
        $(this).parent().find('.selectPlanBtn').hide();
        $(this).siblings('.selected-plan').show();
        $('#plan_id').val(rel_id);
        $('#plan_price_id').val(plan_price_id);
        var rel_stripe_button_id = $(this).attr('rel_stripe_button_id');
        $("#stripe_button_id").attr("buy-button-id", rel_stripe_button_id);

        $(".selectPlanBtn").each(function(){
          var each_plan_id = $(this).attr('rel');
          if(each_plan_id == rel_id && each_plan_id == current_plan_id){
               $(this).parent().find('.selectPlanBtn').hide();
               $(this).parent().find('.choose-plan').hide();
               $(this).parent().find('.selected-plan').show();
          }else{
            if(each_plan_id == rel_id && each_plan_id != current_plan_id){
               $(this).parent().find('.selectPlanBtn').hide();
               $(this).parent().find('.choose-plan').hide();
               $(this).parent().find('.selected-plan').show();
            }else if(each_plan_id != rel_id && each_plan_id == current_plan_id){
               $(this).parent().find('.selectPlanBtn').hide();
               $(this).parent().find('.choose-plan').hide();
               $(this).parent().find('.current-plan').show();
            }else{
                $(this).parent().find('.selectPlanBtn').hide();
                $(this).parent().find('.selected-plan').hide();
                $(this).parent().find('.choose-plan').show();
            }
          }
          /*if(each_plan_id != rel_id ){

                $(this).parent().find('.selectPlanBtn').hide();
                $(this).parent().find('.selected-plan').hide();
                $(this).parent().find('.choose-plan').show();
          }
          if(each_plan_id == rel_id){
               $(this).parent().find('.selectPlanBtn').hide();
               $(this).parent().find('.choose-plan').hide();
               $(this).parent().find('.selected-plan').show();
          }*/

        });
    });

    $('#update_membership_frm').validate({
            errorElement: 'p',
            rules: {
                card_number:{
                    required:function () {
                        if ($('.payment_section').is(':visible') === true) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                    number:function () {
                        if ($('.payment_section').is(':visible') === true) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                    minlength:function () {
                        if ($('.payment_section').is(':visible') === true) {
                            return 16;
                        } else {
                            return false;
                        }
                    },
                    maxlength:function () {
                        if ($('.payment_section').is(':visible') === true) {
                            return 16;
                        } else {
                            return false;
                        }
                    }
                },
                card_expiry_month:{
                    required:function () {
                        if ($('.payment_section').is(':visible') === true) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                    range: [1, 13],
                    number:function () {
                        if ($('.payment_section').is(':visible') === true) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                    // min:function () {
                    //     if ($('.payment_section').is(':visible') === true) {
                    //         return 1;
                    //     } else {
                    //         return false;
                    //     }
                    // },
                    // max:function () {
                    //     if ($('.payment_section').is(':visible') === true) {
                    //         return 12;
                    //     } else {
                    //         return false;
                    //     }
                    // },
                    ccexp:function () {
                        if ($('.payment_section').is(':visible') === true) {
                            return {'month': '#card_expiry_month', 'year': '#card_expiry_yr'}
                        } else {
                            return false;
                        }
                    }
                },
                card_expiry_yr:{
                    required:function () {
                        if ($('.payment_section').is(':visible') === true) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                    number:function () {
                        if ($('.payment_section').is(':visible') === true) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                    minlength:function () {
                        if ($('.payment_section').is(':visible') === true) {
                            return 4;
                        } else {
                            return false;
                        }
                    },
                    maxlength:function () {
                        if ($('.payment_section').is(':visible') === true) {
                            return 4;
                        } else {
                            return false;
                        }
                    },
                    ccexp:function () {
                        if ($('.payment_section').is(':visible') === true) {
                            return {'month': '#card_expiry_month', 'year': '#card_expiry_yr'}
                        } else {
                            return false;
                        }
                    },
                    yearcheck:function (){
                        if ($('.payment_section').is(':visible') === true) {
                            return  true
                        } else {
                            return false;
                        }
                    }
                },
                card_cvv_no:{
                    required:function () {
                        if ($('.payment_section').is(':visible') === true) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                    number:function () {
                        if ($('.payment_section').is(':visible') === true) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                    min:function () {
                        if ($('.payment_section').is(':visible') === true) {
                            return 1;
                        } else {
                            return false;
                        }
                    },
                    minlength:function () {
                        if ($('.payment_section').is(':visible') === true) {
                            return 3;
                        } else {
                            return false;
                        }
                    },
                    maxlength:function () {
                        if ($('.payment_section').is(':visible') === true) {
                            return 3;
                        } else {
                            return false;
                        }
                    }
                },
                card_user_name:{
                    required:function () {
                        if ($('.payment_section').is(':visible') === true) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                    accept:function () {
                        if ($('.payment_section').is(':visible') === true) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }
            },
            messages:{
                card_number:{
                    required: "Card Number is required.",
                    number: "Please Enter valid Card Number",
                    minlength: "Please enter 16 digit card no",
                    maxlength: "Please enter 16 digit card no"
                },
                card_expiry_month:{
                    required: "Exp. Month is required.",
                    number: "Invalid month.",
                    // min: "Invalid month.",
                    // max: "Invalid month.",
                    ccexp: "Invalid Month/Year."
                },
                card_expiry_yr:{
                    required: "Exp Year is required.",
                    number: "Invalid year.",
                    minlength: "Invalid Year.",
                    maxlength: "Invalid Year.",
                    ccexp: "Invalid Month/Year.",
                    yearcheck:"Invalid Year."
                },
                card_cvv_no:{
                    required: "CVV number is required.",
                    number: "Please enter valid CVV.",
                    min: "Please enter valid CVV.",
                    minlength: "Please enter 3 digit CVV no",
                    maxlength: "Please enter 3 digit CVV no"
                },
                card_user_name:{
                    required: "Name is required.",
                    accept: "Please enter valid name."
                },
            },
            submitHandler:function(){
                $.ajax({
                    url: '/admin/save-user-plan/',
                    type: 'post',
                    dataType: 'json',
                    cache: false,
                    data: $('#update_membership_frm').serialize(),
                    beforeSend: function(){
                        $('.overlay').show();
                    },
                    success: function(response){
                        $('.overlay').hide();
                        if(response.error == 0 || response.status == 200 || response.status == 201){

                            $.growl.notice({title: "User Plan ", message: response.msg, size: 'large'});
                            var cost = '$0';
                            if(response.data.amount){
                                cost = '$'+response.data.amount;
                            }
                            $('#subsAmtPaid').html(cost);
                            $('#subsOrdId').html(response.data.order_id);
                            $('#subsTransId').html(response.data.transaction_id);
                            $('.dashboard_section').hide();
                            $('.payment_success_section').show();
                        }else{
                            window.setTimeout(function () {
                                $.growl.error({title: "User Plan ", message: response.msg, size: 'large'});
                            }, 2000);
                        }
                    }
                });
            }
    });
    $('#checkPassFrm').validate({
            errorElement: 'p',
            rules: {
                user_pass:{
                    required:true,
                    minlength:6,
                    maxlength:12,
                }
            },
            messages:{
                user_pass:{
                    required: "Password is required.",
                    minlength: "Please Enter at least 6 char",
                    maxlength: "Please Enter maximum 12 char",
                }
            },
            submitHandler:function(){
                $.ajax({
                    url: '/admin/check-user-pass/',
                    type: 'post',
                    dataType: 'json',
                    cache: false,
                    data: $('#checkPassFrm').serialize(),
                    beforeSend: function(){
                        $('.overlay').show();
                    },
                    success: function(response){
                        $('.overlay').hide();
                        if(response.error == 0){
                            $('.dashboard_section').hide();
                            $('.change_theme_section').show();
                        }else{
                            $.growl.error({title: "Password ", message: response.msg, size: 'large'});
                        }
                        $('#changeThemeSecurityModal').modal('hide');
                    }
                });
            }
    });

    $(document).on('click', '.selectThemeBtn', function(){
        var theme_id = $(this).attr('rel')
        $('.selectThemeBtn').removeClass('selected_theme');
        $(this).addClass('selected_theme');
        $('#theme_id').val(theme_id);
    });

    $(document).on('click', '#returnBtn', function(){
        window.location.href = '/admin/';
    });
    $(document).on('blur', '#card_number', function(){
        var card_num = $(this).val();
        if(card_num.length > 3){
            card_type = identify_card(card_num);
            if(typeof(card_type) != 'undefined'){
                $('#card_type').addClass(card_type);
            }else{
                $('#card_type').attr('class', '');
            }
        }
    });

    $(document).on('keyup', '#card_number', function(){
        var card_num = $(this).val();
        if(card_num.length > 3){
            card_type = identify_card(card_num);
            if(typeof(card_type) != 'undefined'){
                $('#card_type').addClass(card_type);
            }else{
                $('#card_type').attr('class', '');
            }
        }

    });

    // -----------------------------Cancel Member--------------------------
    $(document).on('click', '#cancel_member', function(){
        $("#cancel_member_popup").modal('show');
    });
});
function change_plan(){
    $('.dashboard_section').hide();
    $('.plan_section').show();
}
function plan_history_list(page){
    var historypage = page;
    /*if(perpage === ''){
        historyperpage =  10;
    }*/
    $.ajax({
        url: '/admin/get-plan-history/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {perpage: historyperpage, page: page},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            if(response.error == 0){
                $("#history_listing_pagination_list").empty();
                $('#planHistory').empty();
                $('#planHistory').html(response.history_html);
                $("#history_listing_pagination_list").html(response.pagination_html);

            }else{
                $('#planHistory').html('<tr><td colspan="5" class="center"><span class="text-danger"><img src="/static/admin/images/no-data-image.png" alt=""></span></td></tr>');
                $("#history_listing_pagination_list").html('');
            }
        }
    });
}

function change_theme(el){
    var theme_id = $(el).attr('rel')
    $('.changeThemeBtn').removeClass('selected_theme');
    $(el).addClass('selected_theme');
    $('#selected_theme_id').val(theme_id);
}
function submit_theme(){
    var selected_theme = 0;
        var theme_name = 'Selected Design: Real State';
        $(".changeThemeBtn").each(function(){
          if($(this).hasClass('selected_theme') === true){
            selected_theme = selected_theme+1;
          }
        });
        if(selected_theme > 0){
            //$.growl.error({title: "Theme ", message: 'Server error, Please try after some time.', size: 'large'});
            //return false;
            var theme_id = $('#selected_theme_id').val();
            $.ajax({
                url: '/admin/change-theme/',
                type: 'post',
                dataType: 'json',
                cache: false,
                data: {theme_id: theme_id},
                beforeSend: function(){
                    $('.overlay').show();
                },
                success: function(response){
                    $('.overlay').hide();
                    if(response.error == 0){
                        $.growl.notice({title: "Theme ", message: response.msg, size: 'large'});
                        window.setTimeout(function () {
                            window.location.reload();
                        }, 2000);
                    }else{
                        $.growl.error({title: "Theme ", message: response.msg, size: 'large'});
                    }
                }
            });
        }else{
            $.growl.error({title: "Theme ", message: "Please select a Theme", size: 'large'});
        }
}
function show_theme_section(){
    /*$('.dashboard_section').hide();
    $('.change_theme_section').show();*/
    $('p.error').hide();
    $('#user_pass').val('');
    $('#changeThemeSecurityModal').modal('show');
}
function show_dashboard_section(){
    $('.dashboard_section').hide();
    $('.change_plan_section').show();

}


function checkPayment(){
    $.ajax({
        url: '/admin/check-payment/',
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
            console.log(response);
        }
    });
}