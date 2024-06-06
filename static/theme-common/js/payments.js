$(document).ready(function(){
    var checkoutButton = document.getElementById('pay_now_1');
    checkoutButton.addEventListener('click', function () {
            //var plan_id = document.getElementById('plan_id').value;
            var deposit_amount = ""
            var listing_id = document.getElementById('property_id').value;
            $('.overlay').show();
            console.log($('#bidderRegFrm').serialize());
            fetch("/payment/registration-create-checkout-session/"+listing_id+"/", {
                method: 'POST',
                contentType: "application/json",
                dataType: "json",
                body: JSON.stringify(
                    {"deposit_amount": deposit_amount, "data": $('#bidderRegFrm').serialize()}
                )
            })
            .then(function (response) {
                console.log(response);
                return response.json();
            })
            .then(function (session) {
                if(session.error == 0){
                    return stripe.redirectToCheckout({ sessionId: session.sessionId });
                }else{
                    $('.overlay').hide();
                    window.setTimeout(function () {
                        $.growl.error({title: "Error ", message: session.msg, size: 'large'});
                    }, 2000);
                }
            })
            .then(function (result) {
                // If `redirectToCheckout` fails due to a browser or network
                // error, you should display the localized error message to your
                // customer using `error.message`.
                $('.overlay').hide();
                if (result.error) {
                    alert(result.error.message);
                }
            })
            .catch(function (error) {
                $('.overlay').hide();
                console.error('Error:', error);
            });
        });
    });


    $('#pay_now').on('click', function(){
        var listing_id = document.getElementById('property_id').value;
        var url = '/payment/registration-create-checkout-session/'+listing_id+'/';
        // csrf_token = $('input[name="csrfmiddlewaretoken"]').val();
        // 'csrfmiddlewaretoken': csrf_token
        validation_data = {
            term_accepted: 'term_accepted',
            age_validate: 'age_validate',
        }
        validate_bidder_form(validation_data);

        if($('#bidderRegFrm').valid()){
            $.ajax({
                url: url,
                type: 'post',
                dataType: 'json',
                cache: false,
                data: $('#bidderRegFrm').serialize(),
                beforeSend: function(){
                    $('.overlay').show();
                },
                success: function(response){
                    $('.overlay').hide();
                    if(response.error == 0){
                        // window.open(response.url, '_blank');
                        // window.open(response.url);
                        window.location.href = response.url;
                    }else{
                        $('.overlay').hide();
                        window.setTimeout(function () {
                            $.growl.error({title: "Error ", message: response.msg, size: 'large'});
                        }, 2000);
                    }
                    // if(response.error == 0){
                    //     $('#proff_funds').parent().addClass('tab-activated');
                    //     try{
                    //         $('#bidderRegFrm #reg_id').val(response.reg_id);
                    //     }catch(ex){
                    //         //console.log(ex);
                    //         $('#bidderRegFrm #reg_id').val('');
                    //     }
                    //     try{
                    //         custom_response = {
                    //             'site_id': site_id,
                    //             'user_id': session_user_id,
                    //             'property_id': property_id,
                    //             'auction_id': auction_id,
                    //         };
                    //         customCallBackFunc(update_bidder_socket, [custom_response]);
                    //     }catch(ex){
                    //         //console.log(ex);
                    //     }

                    //     $.growl.notice({title: "Bidder Registration ", message: "Bidder Registration completed successfully", size: 'large'});
                    //     $('#success_paragraph').html(response.sucess_paragraph);
                    //     $(window).scrollTop(0);
                    //     if(response.doc_uploaded == 1){
                    //         $('#backToProofFund').remove();
                    //         $('#is_uploaded').val(1);
                    //     }else{
                    //         $('#backToProofFund').show();
                    //         $('#is_uploaded').val(0);
                    //     }
                    //     $('.bidding-tab li').removeClass('active');
                    //     $('#confirm_reg').parent().addClass('active');
                    //     $('.bidding-body > div:visible').hide();
                    //     $('#confirmation').show();

                    // }else{
                    //    $.growl.error({title: "Bidder Registration ", message: response.msg, size: 'large'});
                    //    $('.bidding-tab li').removeClass('active');
                    //    $('#proff_funds').parent().addClass('active');
                    //    $('.bidding-body > div:visible').hide();
                    //    $('#proff-funds').show();
                    // }
                }
            });
        }

    });