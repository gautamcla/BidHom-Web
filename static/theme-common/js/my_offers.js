$(document).ready(function(){
    $(document).on('click', '#msg_true,#msg_close_true', function(){
        $('#viewMsgHistoryModal').modal('hide');
        $('body').addClass('modal-open');
    });
    $(".show-more").click(function () {
      if($(".text").hasClass("show-more-height")) {
          $(this).text("Show Less");
          $(this).addClass("less");
          $(this).removeClass("more");
      } else {
          $(this).text("Show More");
          $(this).removeClass("less");
          $(this).addClass("more");
      }
      $(".text").toggleClass("show-more-height");
    });
    $('#counter_offer_frm #offer_price').on('input',function(e){
        $(this).val(function (index, value) {
            if(value == "$"){
                return "";
            }else{
                //return '$' + value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                return '$' + value.replace(/(?!\.)\D/g, "").replace(/(?<=\..*)\./g, "").replace(/(?<=\.\d\d).*/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
        });

    });
    // Reject offer functionality
    $(document).on('click', '#reject_offer_true', function(){
        var property_id = $('#rej_property_id').val();
        var negotiated_id = $('#rej_negotiated_id').val();
        reject_offer(property_id,negotiated_id);
    });
    $(document).on('click', '#reject_offer_false,#reject_offer_false_top', function(){
        $('#rej_property_id').val('');
        $('#rej_negotiated_id').val('');
        $('body').addClass('modal-open');
        $('#confirmRejectOfferModal').modal('hide');
    });

    // Accept offer functionality
    $(document).on('click', '#accept_offer_false,#accept_offer_false_top', function(){
        $('#accept_property_id').val('');
        $('#accept_negotiated_id').val('');
        $('body').addClass('modal-open');
        $('#confirmAcceptOfferModal').modal('hide');
    });
    $(document).on('click', '#accept_offer_true', function(){
        var property_id = $('#accept_property_id').val();
        var negotiated_id = $('#accept_negotiated_id').val();
        accept_offer(property_id,negotiated_id);
    });
    $(document).on('hidden.bs.modal','#notAgentModal,#offerSubmitModal,#confirmOfferDocDeleteModal,#viewMsgHistoryModal,#confirmAcceptOfferModal,#confirmRejectOfferModal,#counterOfferModal', function (e) {

      $('body').addClass('modal-open');
   });
    $('#counter_offer_frm').validate({
            ignore: [],
            errorElement: 'p',
            rules:{
                offer_price:{
                    required: true,
                    thousandsepratornum: true,
                    minvalue: 1,
                    maxlength:19
                }
            },
            messages:{
                offer_price:{
                    required: "Offer amount is required.",
                    thousandsepratornum: "Please enter valid offer amount",
                    maxlength: "Please enter max 14 digit number"
                }
            },
            submitHandler: function(){
                $.ajax({
                    url: '/counter-offer/',
                    type: 'post',
                    dataType: 'json',
                    cache: false,
                    data: $('#counter_offer_frm').serialize(),
                    beforeSend: function(){
                        $('.overlay').show();
                    },
                    success: function(response){
                        $('.overlay').hide();
                        if(response.error == 0){
                            $.growl.notice({title: "Offer ", message: response.msg, size: 'large'});

                            window.setTimeout(function () {
                                $('#viewofferModal').modal('hide');
                                $('#counterOfferModal').modal('hide');
                                window.location.reload();
                            }, 2000);
                        }else{
                            window.setTimeout(function () {
                                $.growl.error({title: "Offer ", message: response.msg, size: 'large'});
                            }, 2000);
                        }
                    }
                });
            }

        });
        $(document).on('click', '#close_counter_popup_top,#close_counter_popup', function(){
            $('#counterOfferModal').modal('hide');
            $('body').addClass('modal-open');
        });
        $(document).on('click', '#close_offer_doc_popup,#close_offer_doc_popup_top', function(){
            $('#viewOfferDocumentModal').modal('hide');
            $('body').addClass('modal-open');
        });
});
function show_offer_message(msg){
    $('#viewMsgHistoryModal #user_msg').html(msg);
    $('#viewMsgHistoryModal').modal('show');
}
function counter_offer(property_id,negotiated_id, offer_status){
    $.ajax({
        url: '/counter-offer-details/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {'property_id': property_id,'negotiated_id': negotiated_id, 'offer_status': offer_status},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            var offer_status = 0;
            if(response.error == 0){

                var negotiated_id = '';
                var property_id = '';
                var offer_amount = '';

                $('p.error').hide();
                $('#counter_offer_frm #negotiated_id').val('');
                $('#counter_offer_frm #counter_property_id').val('');
                $('#counter_offer_frm #offer_price').val('');
                $('#counter_offer_frm #existing_offer_price').val('');
                if(response.offer && response.offer.property_id){
                    property_id = response.offer.property_id;
                }
                if(response.offer && response.offer.offer_amount){
                    offer_amount = response.offer.offer_amount;
                    if(offer_amount > parseInt(offer_amount)){
                        offer_amount = offer_amount;
                    }else{
                        offer_amount = parseInt(offer_amount);
                    }
                    offer_amount = numberFormat(offer_amount);

                }
                if(response.offer && response.offer.negotiated_id){
                    negotiated_id = response.offer.negotiated_id;
                }
                if(response.offer && response.offer.offer_status){
                    offer_status = parseInt(response.offer.offer_status);
                }
                $('#counter_offer_frm #negotiated_id').val(negotiated_id);
                $('#counter_offer_frm #counter_property_id').val(property_id);
                //$('#counter_offer_frm #offer_price').val(offer_amount);
                $('#counter_offer_frm #existing_offer_price').val('$'+offer_amount);
                $('#counter_offer_frm #offer_comment').val('');

            }else{
                $.growl.error({title: "Offer ", message: response.msg, size: 'large'});
            }
            //new to change this only if button and heading text changes not required
            if(offer_status == 1){
                $('#counterOfferModal .modal-title').html('Make Offer');
                $('#counterOfferModal #submit_counter_offer').html('Submit Offer');
            }else{
                $('#counterOfferModal .modal-title').html('Counter Offer');
                $('#counterOfferModal #submit_counter_offer').html('Submit Counter Offer');
            }
            $('#counterOfferModal').modal('show');
        }
    });

}
function viewOfferDetails(property_id){
    $.ajax({
        url: '/property-offer-details/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {'property_id': property_id,'from_page':'my_offers'},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            if(response.offer_details_html){
                $("#viewofferModal #offer_details").empty();
                $("#viewofferModal #offer_details").html(response.offer_details_html);
            }
            $("#viewofferModal #offer_details").find('script').remove();
            $("#viewofferModal").modal('show');
        }
    });
}
function accept_offer(property_id,negotiated_id){

    $.ajax({
        url: '/accept-offer/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {'property_id': property_id,'negotiated_id': negotiated_id},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            if(response.error == 0){
                $.growl.notice({title: "Offer ", message: response.msg, size: 'large'});
                window.setTimeout(function () {
                    $('#confirmAcceptOfferModal').modal('hide');
                    $('#viewofferModal').modal('hide');
                    window.location.reload();
                }, 2000);
            }else{
                $.growl.error({title: "Offer ", message: response.msg, size: 'large'});
            }
        }
    });
}

function reject_offer(property_id,negotiated_id){

    $.ajax({
        url: '/reject-offer/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {'property_id': property_id,'negotiated_id': negotiated_id},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            if(response.error == 0){
                $.growl.notice({title: "Offer ", message: response.msg, size: 'large'});
                window.setTimeout(function () {
                    $('#confirmRejectOfferModal').modal('hide');
                    $('#viewofferModal').modal('hide');
                    window.location.reload();
                }, 2000);
            }else{
                $.growl.error({title: "Offer ", message: response.msg, size: 'large'});
            }
        }
    });
}
function confirm_buyer_reject_offer(property_id,negotiated_id, offer_status){
    $('#rej_property_id').val(property_id);
    $('#rej_negotiated_id').val(negotiated_id);
    var status = parseInt(offer_status);
    if(status == 1){
        $('#confirmRejectOfferModal .modal-title').html('Cancel Confirmation');
        $('#confirmRejectOfferModal #trad_reject_msg').html('Do you want to Cancel Offer?');
    }else{
        $('#confirmRejectOfferModal .modal-title').html('Reject Confirmation');
        $('#confirmRejectOfferModal #trad_reject_msg').html('Do you want to Reject Offer?');
    }
    $('#confirmRejectOfferModal').modal('show');
}
function confirm_buyer_accept_offer(property_id,negotiated_id){
    $('#accept_property_id').val(property_id);
    $('#accept_negotiated_id').val(negotiated_id);
    $('#confirmAcceptOfferModal').modal('show');
}

function get_offer_documents(property_id,negotiated_id){
    $.ajax({
        url: '/get-offer-doc-details/',
        type: 'post',
        dataType: 'json',
        data: {'property_id': property_id,'negotiated_id': negotiated_id},
        cache: false,
        beforeSend: function(){
           $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            if(response.error == 0){
                if(response.doc_listing_html){
                    $('#offer_doc_list').html(response.doc_listing_html);
                }else{
                    $('#offer_doc_list').html('<li class="notiMenu">No Data found!</li>');
                }
                $('#offer_doc_list').find('script').remove();

            }else{
                $('#offer_doc_list').html('<li class="notiMenu">No Data found!</li>');
            }
            $('#viewOfferDocumentModal').modal('show');
        }
    });
}