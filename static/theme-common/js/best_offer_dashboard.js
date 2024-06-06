var recordPerpage = 9;
$(document).ready(function(){
     //$('#counterModal').modal('show');
     $('.select').chosen();
    $(document).on('click', '#close_counter_best_popup_top,#close_best_counter_popup', function(){
        $('#offer_price').val('');
        $('#offer_comment').val('');
        $('#counter_property_id').val('');
        $('#negotiated_id').val('');
        $('#existing_offer_price').val('');
        $('#newcounterOfferModal').modal('hide');
        //$('body').addClass('modal-open');
    });
    $(document).on('click', '#close_seller_counter_popup_top', function(){
        $('#sellerCounterOfferDetailModal').modal('hide');
    });
    $(document).on('click', '#close_best_counter_popup_top,#close_best_counter_popup,#counter_cancel_offer', function(){
        $('#newcounterOfferModal').modal('hide');
    });
    $(document).on('click', '#close_declined_offer_top,#close_declined_offer', function(){
        $('#offerDeclinedModal').modal('hide');
    });
    $(document).on('click', '#close_offer_history_detail_popup_top,#close_offer_history_detail_popup', function(){
        $('#newOfferHistoryDetailModal').modal('hide');
    });
    $(document).on('click', '#declined_submit_new_offer', function(){
        $('#offerDeclinedModal').modal('hide');
        window.location.href = '/asset-details/?property_id='+$('#declined_property_id').val();
    });
    $('#counter_offer_price').on('input',function(e){
        $(this).val(function (index, value) {
            if(value == "$" || value == ""){
                return "$";
            }else{
                //return '$' + value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                return '$' + value.replace(/(?!\.)\D/g, "").replace(/(?<=\..*)\./g, "").replace(/(?<=\.\d\d).*/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
        });

    });
    $('#counter_earnest_deposit').on('input',function(e){
        var deposit_type = $('#counter_earnest_deposit_type').val();
        $(this).val(function (index, value) {
            if(parseInt(deposit_type) == 1){
                if(value == "$" || value == ""){
                    return "$";
                }else{
                    //return '$' + value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    return '$' + value.replace(/(?!\.)\D/g, "").replace(/(?<=\..*)\./g, "").replace(/(?<=\.\d\d).*/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }
            }else{
                return value;
            }

        });

    });
    $('#counter_down_payment').on('input',function(e){
        $(this).val(function (index, value) {
            if(value == "$" || value == ""){
                return "$";
            }else{
                //return '$' + value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                return '$' + value.replace(/(?!\.)\D/g, "").replace(/(?<=\..*)\./g, "").replace(/(?<=\.\d\d).*/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }

        });

    });
    /*$(".show-more").click(function () {
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
    });*/
    $(document).on('click', '#reject_best_offer_true', function(){
        var property_id = $('#rej_property_id').val();
        var negotiated_id = $('#rej_negotiated_id').val();
        reject_best_offer(property_id,negotiated_id);
    });
    $(document).on('click', '#reject_best_offer_false,#reject_best_offer_false_top', function(){
        $('#rej_property_id').val('');
        $('#rej_negotiated_id').val('');
        $('body').addClass('modal-open');
        $('#confirmRejectBestOfferModal').modal('hide');
    });
    $(document).on('click', '#msg_true,#msg_close_true', function(){
        $('#viewMsgHistoryModal').modal('hide');
       // $('body').addClass('modal-open');
    });
    $(document).on('click', '#select_offer_close_btn', function(){
        $('#select_user_name').html('');
        $('#select_phone').html('');
        $('#select_price').html('');
        $('#select_due_diligence').html('');
        $('#select_closing').html('');
        $('#select_earnest_deposit').html('');
        $('#select_property_id').val('');
        $('#select_negotiated_id').val('');
        $('#bestOfferSelectModal').modal('hide');
    });
    $(document).on('click', '#accept_offer_true', function(){
        var property_id = $('#accept_property_id').val();
        var negotiated_id = $('#accept_negotiated_id').val();
        accept_best_offer(property_id,negotiated_id);
    });
    $(document).on('click', '#accept_offer_false,#accept_offer_false_top', function(){
        $('#accept_property_id').val('');
        $('#accept_negotiated_id').val('');
        $('#confirmAcceptOfferModal').modal('hide');
        $('body').addClass('modal-open');
    });
    $(document).on('hidden.bs.modal','#confirmAcceptOfferModal', function (e) {

          $('body').addClass('modal-open');
       });
    $('#counter_best_offer_frm').validate({
            ignore: [],
            errorElement: 'p',
            rules:{
                offer_price:{
                    required: true,
                    thousandsepratornum: true,
                    minvalue: 1,
                },
                offer_contingent:{
                    required: true,
                },
                earnest_deposit:{
                     required: true,
                     thousandsepratornum: true,
                     minvalue: 1,
                },
                appraisal_contingent:{
                    required: true,
                },
                sale_contingency:{
                    required: true,
                },
                closing_period:{
                    required: true,
                },
                due_diligence:{
                    required: true,
                },
                closing_cost:{
                    required: true
                },
                financing:{
                    required: true
                }
            },
            messages:{
                offer_price:{
                    required: "Offer amount is required.",
                    thousandsepratornum: "Please enter valid offer amount",
                },
                offer_contingent:{
                    required: "This field is required",
                },
                earnest_deposit:{
                     required: "Earnest Money Deposit is required.",
                     thousandsepratornum: "Please enter valid Amount.",
                },
                appraisal_contingent:{
                    required: "This field is required",
                },
                sale_contingency:{
                    required: "This field is required",
                },
                closing_period:{
                    required: "Closing Date is required.",
                },
                due_diligence:{
                    required: "Inspection Contingency is required."
                },
                closing_cost:{
                    required: "This field is required."
                },
                financing:{
                    required: "This field is required."
                }
            },
            errorPlacement: function(error, element) {
                var radio_arr = ['offer_contingent', 'sale_contingency', 'appraisal_contingent'];

                if(element.hasClass('select')){
                    error.insertAfter(element.next('.chosen-container'));
                }else if(element.attr('id') == 'offer_contigency'){
                    //error.insertAfter(element.next('label'));
                }else if(element.attr('id') == 'terms'){
                    //error.insertAfter(element.next('label'));
                }else if(jQuery.inArray(element.attr('name'), radio_arr) !== -1){
                    error.insertAfter(element.closest('.lh45'));
                }else if(element.attr('name') == 'closing_cost'){
                    error.insertAfter($('#counter_closing_cost_thrd').parent('.form-group'));
                }else{
                    error.insertAfter(element);
                }
            },
            submitHandler: function(){
                $.ajax({
                    url: '/buyer-best-offer-counter/',
                    type: 'post',
                    dataType: 'json',
                    cache: false,
                    data: $('#counter_best_offer_frm').serialize(),
                    beforeSend: function(){
                        $('.overlay').show();
                    },
                    success: function(response){
                        $('.overlay').hide();
                        if(response.error == 0){
                            $.growl.notice({title: "Offer ", message: response.msg, size: 'large'});

                            window.setTimeout(function () {
                                $('#newcounterOfferModal').modal('hide');
                                window.location.reload();
                            }, 1000);
                        }else{
                            window.setTimeout(function () {
                                $.growl.error({title: "Offer ", message: response.msg, size: 'large'});
                            }, 2000);
                        }
                    }
                });
            }

        });

});
function bestOfferListingSearch(current_page){
    var search = '';
    var currpage = current_page;
    var page_size = 10;

    $.ajax({
        url: '/best-offers/',
        type: 'post',
        dateType: 'json',
        cache: false,
        data: {'search': search, 'page': currpage, 'page_size': page_size},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            if(response.error == 0){
                $('#best_offer_listing').empty();
                $(".pagination").empty();
                $("#best_offer_listing").html(response.offer_listing_html);
                $("#best_offer_pagination_block").html(response.pagination_html);
            }else{
                $('#best_offer_listing').html('<li><img src="/static/admin/images/no-data-image.png" alt=""></li>');
            }
            $('#best_offer_listing').find('script').remove();
        }
    });
}
function counter_best_offer(property_id,negotiated_id){
    $.ajax({
        url: '/counter-best-offer-details/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {'property_id': property_id,'negotiated_id': negotiated_id},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            $('p.error').hide();
            $("#counter_offer_price_text").html('NA');
            $("#counter_earnest_deposit_text").html('NA');
            $("#counter_down_payment_text").html('NA');
            $("#counter_loan_type_text").html('NA');
            $("#counter_inspection_contigency_text").html('NA');
            $("#counter_financing_contigent_ext").html('NA');
            $("#counter_appraisal_contigency_text").html('NA');
            $("#counter_sale_contigency_text").html('NA');
            $("#counter_closing_date_text").html('NA');
            $("#counter_closing_cost_text").html('NA');
            $('#counter_offer_price').val('$');

            //buyer and agent info
            $("#counter_buyer_name").html('NA');
            $("#counter_buyer_email").html('NA');
            $("#counter_buyer_phone").html('NA');
            $("#counter_agent_name").html('NA')
            $("#counter_agent_email").html('NA')
            $("#counter_agent_phone").html('NA')
            $("#counter_agent_address").html('NA')
            if(response.data.behalf_of_buyer == true){
                $("#counter_buyer_company").html('NA').show();
                $("#counter_buyer_address").html('NA').hide();
                $("#counter_agent_info_section").html('NA').show();
            }else{
                $("#counter_buyer_company").html('NA').hide();
                $("#counter_buyer_address").html('NA').show();
                $("#counter_agent_info_section").html('NA').hide();
            }

            if(parseInt(response.data.earnest_deposit_type) == 1){
                $('#counter_earnest_deposit').attr('maxlength',14);
                $('#counter_earnest_deposit').attr('placeholder','Any dollar amount');
                $('#counter_earnest_deposit').val('$');
            }else{
                $('#counter_earnest_deposit').attr('maxlength',6).attr('max',100);
                $('#counter_earnest_deposit').attr('placeholder','Any %');
                $('#counter_earnest_deposit').val('');
            }
            $('input[name="offer_contingent"]').prop('checked',false);
            $('input[name="appraisal_contingent"]').prop('checked',false);
            $('input[name="sale_contingency"]').prop('checked',false);
            $('input[name="closing_cost"]').prop('checked',false);
            $('#counter_down_payment').val('$');
            $('#counter_closing_period').val('');
            $('#counter_due_diligence').val('');
            $('#counter_financing').val("");
            $('#counter_offer_comment').val("");
            $('#counter_financing').trigger("chosen:updated");
            $('#counter_closing_period').trigger("chosen:updated");
            $('#counter_due_diligence').trigger("chosen:updated");
            var offer_price = '';
            var due_diligence = '';
            var earnest_money_deposit = '';
            var earnest_money_deposit_percent = '';
            var closing_date = '';
            var loan_type = '';
            var down_payment = '';
            var offer_contingent = '';
            var appraisal_contingent = '';
            var closing_cost = '';

            var buyer_name = '';
            var buyer_email = '';
            var buyer_phone = '';
            var buyer_address = '';
            var buyer_company = '';
            var agent_name = '';
            var agent_email = '';
            var agent_phone = '';
            var agent_address = '';
            $("#counter_earnest_deposit_type").val(1);
            if(response.error == 0){
                $("#counter_best_property_id").val(response.data.property_id);
                $("#counter_best_negotiated_id").val(response.data.negotiated_id);
                $("#counter_earnest_deposit_type").val(response.data.earnest_deposit_type);
                if(response.data.offer_price){
                    offer_price = response.data.offer_price;
                    offer_price = numberFormat(offer_price);
                    $("#counter_offer_price_text").html('$'+offer_price);

                }
                if(response.data.earnest_money_deposit){
                    earnest_money_deposit = response.data.earnest_money_deposit;
                    earnest_money_deposit = numberFormat(earnest_money_deposit);
                    earnest_money_deposit_percent = response.data.earnest_money_deposit_percent;
                    $("#counter_earnest_deposit_text").html('$'+earnest_money_deposit+' or '+earnest_money_deposit_percent+' %');
                }
                if(response.data.down_payment){
                    down_payment = response.data.down_payment;
                    down_payment = numberFormat(down_payment);
                    $("#counter_down_payment_text").html('$'+down_payment);
                }
                if(response.data.loan_type){
                    loan_type = response.data.loan_type;
                    $("#counter_loan_type_text").html(loan_type);
                }

                if(response.data.due_diligence){
                    due_diligence = response.data.due_diligence;
                    $("#counter_inspection_contigency_text").html(due_diligence);
                }
                if(response.data.offer_contingent){
                    offer_contingent = response.data.offer_contingent;
                    $("#counter_financing_contigent_ext").html(offer_contingent);
                }
                if(response.data.appraisal_contingent){
                    appraisal_contingent = response.data.appraisal_contingent;
                    $("#counter_appraisal_contigency_text").html(appraisal_contingent);
                }
                if(response.data.sale_contingency){
                    sale_contingency = response.data.sale_contingency;
                    $("#counter_sale_contigency_text").html(sale_contingency);
                }
                if(response.data.closing_cost){
                    closing_cost = response.data.closing_cost;
                    $("#counter_closing_cost_text").html(closing_cost);
                }
                if(response.data.closing_date){
                    closing_date = response.data.closing_date;
                    $("#counter_closing_date_text").html(closing_date);
                }
                try{
                    $('#counter_financing').empty();
                    $('#counter_financing').html('<option value="">Select</option>');
                    $.each(response.data.loan_type_list, function(i, item) {
                        $('#counter_financing').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#counter_financing').trigger("chosen:updated");
                }catch(ex){
                    //console.log(ex);
                }
                if(response.data.behalf_of_buyer == true){
                    if(response.data.buyer_detail_info.first_name){
                        buyer_name = response.data.buyer_detail_info.first_name+' '+response.data.buyer_detail_info.last_name;
                        $('#counter_buyer_name').html(buyer_name);
                    }
                    if(response.data.buyer_detail_info.email){
                        buyer_email = response.data.buyer_detail_info.email;
                        $('#counter_buyer_email').html(buyer_email);
                    }
                    if(response.data.buyer_detail_info.phone_no){
                        buyer_phone = response.data.buyer_detail_info.phone_no;
                        buyer_phone = formatPhoneNumber(buyer_phone);
                        $('#counter_buyer_phone').html(buyer_phone);
                    }
                    $('#counter_buyer_company_section').show();
                    $('#counter_buyer_address_section').hide();
                    $('#counter_buyer_company').show();
                    $('#counter_buyer_address').hide();
                    if(response.data.buyer_detail_info.company){
                        buyer_company = response.data.buyer_detail_info.company;
                        $('#counter_buyer_company').html(buyer_company);
                    }
                    $('.counter_agent_info_section').show();
                    if(response.data.agent_detail_info.first_name){
                        agent_name = response.data.agent_detail_info.first_name+' '+response.data.agent_detail_info.last_name;
                        $('#counter_agent_name').html(agent_name);
                    }
                    if(response.data.agent_detail_info.email){
                        agent_email = response.data.agent_detail_info.email;
                        $('#counter_agent_email').html(agent_email);
                    }
                    if(response.data.agent_detail_info.phone_no){
                        agent_phone = response.data.agent_detail_info.phone_no;
                        agent_phone = formatPhoneNumber(agent_phone);
                        $('#counter_agent_phone').html(agent_phone);
                    }
                    if(response.data.agent_detail_info.address_first){
                        agent_address = response.data.agent_detail_info.address_first+', '+response.data.agent_detail_info.city+', '+response.data.agent_detail_info.state+', '+response.data.agent_detail_info.postal_code;
                        $('#counter_agent_address').html(agent_address);
                    }
                }else{
                    $('.counter_agent_info_section').hide();
                    $('#counter_buyer_company_section').hide();
                    $('#counter_buyer_address_section').show();
                    $('#counter_buyer_company').hide();
                    $('#counter_buyer_address').show();
                    if(response.data.buyer_detail_info.first_name){
                        buyer_name = response.data.buyer_detail_info.first_name+' '+response.data.buyer_detail_info.last_name;
                        $('#counter_buyer_name').html(buyer_name);
                    }
                    if(response.data.buyer_detail_info.email){
                        buyer_email = response.data.buyer_detail_info.email;
                        $('#counter_buyer_email').html(buyer_email);
                    }
                    if(response.data.buyer_detail_info.phone_no){
                        buyer_phone = response.data.buyer_detail_info.phone_no;
                        buyer_phone = formatPhoneNumber(buyer_phone);
                        $('#counter_buyer_phone').html(buyer_phone);
                    }
                    if(response.data.buyer_detail_info.address_first){
                        agent_address = response.data.buyer_detail_info.address_first+', '+response.data.buyer_detail_info.city+', '+response.data.buyer_detail_info.state+', '+response.data.buyer_detail_info.postal_code;
                        $('#counter_buyer_address').html(agent_address);
                    }
                    $('#counter_agent_name').html('NA');
                    $('#counter_agent_email').html('NA');
                    $('#counter_agent_phone').html('NA');
                    $('#counter_agent_address').html('NA');
                }
            }else{
                $.growl.error({title: "Offer ", message: response.msg, size: 'large'});
            }
            $('#sellerCounterOfferDetailModal').modal('hide');
            $('#newcounterOfferModal').modal('show');
        }
    });

}
function reject_best_offer(property_id,negotiated_id){
    var reason = $('#best_reject_reason').val();
    $.ajax({
        url: '/reject-best-offer/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {'property_id': property_id,'negotiated_id': negotiated_id, 'reason': reason},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            if(response.error == 0){
                $.growl.notice({title: "Offer ", message: response.msg, size: 'large'});
                window.setTimeout(function () {
                    $('#confirmRejectBestOfferModal').modal('hide');
                    window.location.reload();
                }, 2000);
            }else{
                $.growl.error({title: "Offer ", message: response.msg, size: 'large'});
            }
        }
    });
}
function confirm_buyer_reject_best_offer(property_id,negotiated_id){
    $('#rej_property_id').val(property_id);
    $('#rej_negotiated_id').val(negotiated_id);
    $('#best_reject_reason').val('');
    $('#confirmRejectBestOfferModal').modal('show');
}
function buyer_select_best_offer(property_id, negotiated_id, first_name, last_name, phone_no, asking_price, user_offer_price, earnest_deposit_type, earnest_money_deposit, earnest_money_deposit_percent, due_diligence_period, closing_period, user_type_name){
    var user_name_text = first_name+' '+last_name+' <span>'+user_type_name+'</span>';

    var earnest_deposit_text = '-';
    var due_diligence_text = '-';
    var closing_period_text = '-';
    var offer_price_text = '-';
    if(user_offer_price){
        var offer_price = numberFormat(user_offer_price);
        offer_price_text = offer_price+' USD';
    }

    if(earnest_money_deposit){
        earnest_deposit_text = '$'+earnest_money_deposit+' or '+earnest_money_deposit_percent+' %';
    }
    /*if(parseInt(due_diligence_period) == 1){
        due_diligence_text = '1-5 Days';
    }else if(parseInt(due_diligence_period) == 2){
        due_diligence_text = '6-15 Days';
    }else if(parseInt(due_diligence_period) == 3){
        due_diligence_text = '16+ Days';
    }else if(parseInt(due_diligence_period) == 4){
        due_diligence_text = 'Waive Inspection';
    }*/
    /*if(parseInt(closing_period) == 1){
        closing_period_text = '1-30 Days';
    }else if(parseInt(closing_period) == 2){
        closing_period_text = '31-45 Days';
    }else if(parseInt(closing_period) == 3){
        closing_period_text = '46-60 Days';
    }else if(parseInt(closing_period) == 4){
        closing_period_text = '61+ Days';
    }*/
    closing_period_text = closing_period
    $('#select_user_name').html(user_name_text);
    $('#select_phone').html(phone_no);
    $('#select_price').html(offer_price_text);
    $('#select_due_diligence').html(due_diligence_period);
    $('#select_closing').html(closing_period_text);
    $('#select_earnest_deposit').html(earnest_deposit_text);
    $('#select_property_id').val(property_id);
    $('#select_negotiated_id').val(negotiated_id);
    $('#bestOfferSelectModal').modal('show');
}
function confirm_buyer_accept_offer(property_id,negotiated_id){
    $('#accept_property_id').val(property_id);
    $('#accept_negotiated_id').val(negotiated_id);
    $('#confirmAcceptOfferModal').modal('show');
}
function accept_best_offer(property_id,negotiated_id){

    $.ajax({
        url: '/accept-best-offer/',
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
function show_offer_message(msg){
    $('#viewMsgHistoryModal #user_msg').html(msg);
    $('#viewMsgHistoryModal').modal('show');
}
function toggle_history(property_id,element){

    if($('#history_table_'+property_id).is(':visible') === true){
        //$('#history_table_'+property_id).hide();
        $(element).html('Show History');
    }else{
        //$('#history_table_'+property_id).show();
        $(element).html('Hide History');
    }
    $('#history_table_'+property_id).slideToggle("slow");
}
function show_more(property_id,element){
    if($("#show_more_tbl_"+property_id).hasClass("show-more-height")) {
          $(element).text("Show Less");
          $(element).addClass("less");
          $(element).removeClass("more");
          $('#show_history_btn_'+property_id).html('Show History').show();
      } else {
          $(element).text("Show More");
          $(element).removeClass("less");
          $(element).addClass("more");
          $('#history_table_'+property_id).hide();
          $('#show_history_btn_'+property_id).html('Show History').hide();
      }
      $("#show_more_tbl_"+property_id).toggleClass("show-more-height");
}
function get_declined_reason(property_id){
    $.ajax({
        url: '/counter-best-offer-details/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {'property_id': property_id},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            $('p.error').hide();
            //buyer and agent info
            $("#declined_buyer_name").html('NA');
            $("#declined_buyer_email").html('NA');
            $("#declined_buyer_phone").html('NA');
            $("#declined_agent_name").html('NA')
            $("#declined_agent_email").html('NA')
            $("#declined_agent_phone").html('NA')
            $("#declined_agent_address").html('NA')
            $("#declined_reason").html('NA');
            $("#declined_property_id").val('');
            if(response.data.behalf_of_buyer == true){
                $("#declined_buyer_company").html('NA').show();
                $("#declined_buyer_address").html('NA').hide();
                $("#declined_agent_info_section").html('NA').show();
            }else{
                $("#declined_buyer_company").html('NA').hide();
                $("#declined_buyer_address").html('NA').show();
                $("#declined_agent_info_section").html('NA').hide();
            }
            if(response.data.property_id){
                $("#declined_property_id").val(response.data.property_id);
            }

            var buyer_name = '';
            var buyer_email = '';
            var buyer_phone = '';
            var buyer_address = '';
            var buyer_company = '';
            var agent_name = '';
            var agent_email = '';
            var agent_phone = '';
            var agent_address = '';
            var cancel_reason = '';
            if(response.error == 0){

                if(response.data.behalf_of_buyer == true){
                    if(response.data.buyer_detail_info.first_name){
                        buyer_name = response.data.buyer_detail_info.first_name+' '+response.data.buyer_detail_info.last_name;
                        $('#declined_buyer_name').html(buyer_name);
                    }
                    if(response.data.buyer_detail_info.email){
                        buyer_email = response.data.buyer_detail_info.email;
                        $('#declined_buyer_email').html(buyer_email);
                    }
                    if(response.data.buyer_detail_info.phone_no){
                        buyer_phone = response.data.buyer_detail_info.phone_no;
                        buyer_phone = formatPhoneNumber(buyer_phone);
                        $('#declined_buyer_phone').html(buyer_phone);
                    }
                    $('#declined_buyer_company_section').show();
                    $('#declined_buyer_address_section').hide();
                    $('#declined_buyer_company').show();
                    $('#declined_buyer_address').hide();
                    if(response.data.buyer_detail_info.company){
                        buyer_company = response.data.buyer_detail_info.company;
                        $('#declined_buyer_company').html(buyer_company);
                    }
                    $('.declined_agent_info_section').show();
                    if(response.data.agent_detail_info.first_name){
                        agent_name = response.data.agent_detail_info.first_name+' '+response.data.agent_detail_info.last_name;
                        $('#declined_agent_name').html(agent_name);
                    }
                    if(response.data.agent_detail_info.email){
                        agent_email = response.data.agent_detail_info.email;
                        $('#declined_agent_email').html(agent_email);
                    }
                    if(response.data.agent_detail_info.phone_no){
                        agent_phone = response.data.agent_detail_info.phone_no;
                        agent_phone = formatPhoneNumber(agent_phone);
                        $('#declined_agent_phone').html(agent_phone);
                    }
                    if(response.data.agent_detail_info.address_first){
                        agent_address = response.data.agent_detail_info.address_first+', '+response.data.agent_detail_info.city+', '+response.data.agent_detail_info.state+', '+response.data.agent_detail_info.postal_code;
                        $('#declined_agent_address').html(agent_address);
                    }
                }else{
                    $('.declined_agent_info_section').hide();
                    $('#declined_buyer_company_section').hide();
                    $('#declined_buyer_address_section').show();
                    $('#declined_buyer_company').hide();
                    $('#declined_buyer_address').show();
                    if(response.data.buyer_detail_info.first_name){
                        buyer_name = response.data.buyer_detail_info.first_name+' '+response.data.buyer_detail_info.last_name;
                        $('#declined_buyer_name').html(buyer_name);
                    }
                    if(response.data.buyer_detail_info.email){
                        buyer_email = response.data.buyer_detail_info.email;
                        $('#declined_buyer_email').html(buyer_email);
                    }
                    if(response.data.buyer_detail_info.phone_no){
                        buyer_phone = response.data.buyer_detail_info.phone_no;
                        buyer_phone = formatPhoneNumber(buyer_phone);
                        $('#declined_buyer_phone').html(buyer_phone);
                    }
                    if(response.data.buyer_detail_info.address_first){
                        agent_address = response.data.buyer_detail_info.address_first+', '+response.data.buyer_detail_info.city+', '+response.data.buyer_detail_info.state+', '+response.data.buyer_detail_info.postal_code;
                        $('#declined_buyer_address').html(agent_address);
                    }

                    $('#declined_agent_name').html('NA');
                    $('#declined_agent_email').html('NA');
                    $('#declined_agent_phone').html('NA');
                    $('#declined_agent_address').html('NA');
                }
                if(response.data.cancel_reason){
                    cancel_reason = response.data.cancel_reason;
                    $('#declined_reason').html(cancel_reason);
                }
            }else{
                $.growl.error({title: "Offer ", message: response.msg, size: 'large'});
            }
            $('#offerDeclinedModal').modal('show');
        }
    });
}
function get_declined_history_details(property_id,best_offers_id){
    $.ajax({
        url: '/best-offer-history-details/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {'property_id': property_id,'best_offers_id': best_offers_id},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            $('p.error').hide();
            //buyer and agent info
            $("#declined_buyer_name").html('NA');
            $("#declined_buyer_email").html('NA');
            $("#declined_buyer_phone").html('NA');
            $("#declined_agent_name").html('NA')
            $("#declined_agent_email").html('NA')
            $("#declined_agent_phone").html('NA')
            $("#declined_agent_address").html('NA')
            $("#declined_reason").html('NA');
            $("#declined_property_id").val('');
            if(response.data.behalf_of_buyer == true){
                $("#declined_buyer_company").html('NA').show();
                $("#declined_buyer_address").html('NA').hide();
                $("#declined_agent_info_section").html('NA').show();
            }else{
                $("#declined_buyer_company").html('NA').hide();
                $("#declined_buyer_address").html('NA').show();
                $("#declined_agent_info_section").html('NA').hide();
            }
            if(response.data.property_id){
                $("#declined_property_id").val(response.data.property_id);
            }

            var buyer_name = '';
            var buyer_email = '';
            var buyer_phone = '';
            var buyer_address = '';
            var buyer_company = '';
            var agent_name = '';
            var agent_email = '';
            var agent_phone = '';
            var agent_address = '';
            var cancel_reason = '';
            if(response.error == 0){

                if(response.data.behalf_of_buyer == true){
                    if(response.data.buyer_detail_info.first_name){
                        buyer_name = response.data.buyer_detail_info.first_name+' '+response.data.buyer_detail_info.last_name;
                        $('#declined_buyer_name').html(buyer_name);
                    }
                    if(response.data.buyer_detail_info.email){
                        buyer_email = response.data.buyer_detail_info.email;
                        $('#declined_buyer_email').html(buyer_email);
                    }
                    if(response.data.buyer_detail_info.phone_no){
                        buyer_phone = response.data.buyer_detail_info.phone_no;
                        buyer_phone = formatPhoneNumber(buyer_phone);
                        $('#declined_buyer_phone').html(buyer_phone);
                    }
                    $('#declined_buyer_company_section').show();
                    $('#declined_buyer_address_section').hide();
                    $('#declined_buyer_company').show();
                    $('#declined_buyer_address').hide();
                    if(response.data.buyer_detail_info.company){
                        buyer_company = response.data.buyer_detail_info.company;
                        $('#declined_buyer_company').html(buyer_company);
                    }
                    $('.declined_agent_info_section').show();
                    if(response.data.agent_detail_info.first_name){
                        agent_name = response.data.agent_detail_info.first_name+' '+response.data.agent_detail_info.last_name;
                        $('#declined_agent_name').html(agent_name);
                    }
                    if(response.data.agent_detail_info.email){
                        agent_email = response.data.agent_detail_info.email;
                        $('#declined_agent_email').html(agent_email);
                    }
                    if(response.data.agent_detail_info.phone_no){
                        agent_phone = response.data.agent_detail_info.phone_no;
                        agent_phone = formatPhoneNumber(agent_phone);
                        $('#declined_agent_phone').html(agent_phone);
                    }
                    if(response.data.agent_detail_info.address_first){
                        agent_address = response.data.agent_detail_info.address_first+', '+response.data.agent_detail_info.city+', '+response.data.agent_detail_info.state+', '+response.data.agent_detail_info.postal_code;
                        $('#declined_agent_address').html(agent_address);
                    }
                }else{
                    $('.declined_agent_info_section').hide();
                    $('#declined_buyer_company_section').hide();
                    $('#declined_buyer_address_section').show();
                    $('#declined_buyer_company').hide();
                    $('#declined_buyer_address').show();
                    if(response.data.buyer_detail_info.first_name){
                        buyer_name = response.data.buyer_detail_info.first_name+' '+response.data.buyer_detail_info.last_name;
                        $('#declined_buyer_name').html(buyer_name);
                    }
                    if(response.data.buyer_detail_info.email){
                        buyer_email = response.data.buyer_detail_info.email;
                        $('#declined_buyer_email').html(buyer_email);
                    }
                    if(response.data.buyer_detail_info.phone_no){
                        buyer_phone = response.data.buyer_detail_info.phone_no;
                        buyer_phone = formatPhoneNumber(buyer_phone);
                        $('#declined_buyer_phone').html(buyer_phone);
                    }
                    if(response.data.buyer_detail_info.address_first){
                        agent_address = response.data.buyer_detail_info.address_first+', '+response.data.buyer_detail_info.city+', '+response.data.buyer_detail_info.state+', '+response.data.buyer_detail_info.postal_code;
                        $('#declined_buyer_address').html(agent_address);
                    }

                    $('#declined_agent_name').html('NA');
                    $('#declined_agent_email').html('NA');
                    $('#declined_agent_phone').html('NA');
                    $('#declined_agent_address').html('NA');
                }
                if(response.data.declined_reason){
                    cancel_reason = response.data.declined_reason;
                    $('#declined_reason').html(cancel_reason);
                }
            }else{
                $.growl.error({title: "Offer ", message: response.msg, size: 'large'});
            }
            $('#offerDeclinedModal').modal('show');
        }
    });
}
function get_best_offer_history_details(property_id,best_offers_id){
    $.ajax({
        url: '/best-offer-history-details/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {'property_id': property_id,'best_offers_id': best_offers_id},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            $('p.error').hide();
            $("#offer_offer_price_text").html('NA');
            $("#offer_earnest_deposit_text").html('NA');
            $("#offer_down_payment_text").html('NA');
            $("#offer_loan_type_text").html('NA');
            $("#offer_inspection_contigency_text").html('NA');
            $("#offer_financing_contigent_ext").html('NA');
            $("#offer_appraisal_contigency_text").html('NA');
            $("#offer_sale_contigency_text").html('NA');
            $("#offer_closing_date_text").html('NA');
            $("#offer_closing_cost_text").html('NA');

            //buyer and agent info
            $("#offer_buyer_name").html('NA');
            $("#offer_buyer_email").html('NA');
            $("#offer_buyer_phone").html('NA');
            $("#offer_agent_name").html('NA');
            $("#offer_agent_email").html('NA');
            $("#offer_agent_phone").html('NA');
            $("#offer_agent_address").html('NA');
            $("#offer_msg").html('');
            if(response.data.behalf_of_buyer == true){
                $("#offer_buyer_company").html('NA').show();
                $("#offer_buyer_address").html('NA').hide();
                $("#offer_agent_info_section").html('NA').show();
            }else{
                $("#offer_buyer_company").html('NA').hide();
                $("#offer_buyer_address").html('NA').show();
                $("#offer_agent_info_section").html('NA').hide();
            }

            if(parseInt(response.data.earnest_deposit_type) == 1){
                $('#offer_earnest_deposit').attr('maxlength',14);
                $('#offer_earnest_deposit').val('$');
            }else{
                $('#offer_earnest_deposit').attr('maxlength',6).attr('max',100);
                $('#offer_earnest_deposit').val('');
            }

            var offer_price = '';
            var due_diligence = '';
            var earnest_money_deposit = '';
            var earnest_money_deposit_percent = '';
            var closing_date = '';
            var loan_type = '';
            var down_payment = '';
            var offer_contingent = '';
            var appraisal_contingent = '';
            var closing_cost = '';

            var buyer_name = '';
            var buyer_email = '';
            var buyer_phone = '';
            var buyer_address = '';
            var buyer_company = '';
            var agent_name = '';
            var agent_email = '';
            var agent_phone = '';
            var agent_address = '';
            var offer_msg = '';
            $("#offer_earnest_deposit_type").val(1);
            if(response.error == 0){
                $("#offer_best_property_id").val(response.data.property_id);
                $("#offer_best_negotiated_id").val(response.data.negotiated_id);
                $("#offer_earnest_deposit_type").val(response.data.earnest_deposit_type);
                if(response.data.offer_price){
                    offer_price = response.data.offer_price;
                    offer_price = numberFormat(offer_price);
                    $("#offer_offer_price_text").html('$'+offer_price);

                }
                if(response.data.earnest_money_deposit){
                    earnest_money_deposit = response.data.earnest_money_deposit;
                    earnest_money_deposit = numberFormat(earnest_money_deposit);
                    earnest_money_deposit_percent = response.data.earnest_money_deposit_percent;
                    $("#offer_earnest_deposit_text").html('$'+earnest_money_deposit+' or '+earnest_money_deposit_percent+' %');
                }
                if(response.data.down_payment){
                    down_payment = response.data.down_payment;
                    down_payment = numberFormat(down_payment);
                    $("#offer_down_payment_text").html('$'+down_payment);
                }
                if(response.data.loan_type){
                    loan_type = response.data.loan_type;
                    $("#offer_loan_type_text").html(loan_type);
                }

                if(response.data.due_diligence){
                    due_diligence = response.data.due_diligence;
                    $("#offer_inspection_contigency_text").html(due_diligence);
                }
                if(response.data.offer_contingent){
                    offer_contingent = response.data.offer_contingent;
                    $("#offer_financing_contigent_ext").html(offer_contingent);
                }
                if(response.data.appraisal_contingent){
                    appraisal_contingent = response.data.appraisal_contingent;
                    $("#offer_appraisal_contigency_text").html(appraisal_contingent);
                }
                if(response.data.sale_contingency){
                    sale_contingency = response.data.sale_contingency;
                    $("#offer_sale_contigency_text").html(sale_contingency);
                }
                if(response.data.closing_cost){
                    closing_cost = response.data.closing_cost;
                    $("#offer_closing_cost_text").html(closing_cost);
                }
                if(response.data.closing_date){
                    closing_date = response.data.closing_date;
                    $("#offer_closing_date_text").html(closing_date);
                }
                if(response.data.offer_msg){
                    offer_msg = response.data.offer_msg;
                    $("#offer_msg").html(offer_msg);
                }
                if(parseInt(response.data.offer_by) == 1){
                    $("#offer_by_text").html('Buyer\'s Offer');
                }else if(parseInt(response.data.offer_by) == 2){
                    $("#offer_by_text").html('Seller\'s Offer');
                }
                if(response.data.behalf_of_buyer == true){
                    if(response.data.buyer_detail_info.first_name){
                        buyer_name = response.data.buyer_detail_info.first_name+' '+response.data.buyer_detail_info.last_name;
                        $('#offer_buyer_name').html(buyer_name);
                    }
                    if(response.data.buyer_detail_info.email){
                        buyer_email = response.data.buyer_detail_info.email;
                        $('#offer_buyer_email').html(buyer_email);
                    }
                    if(response.data.buyer_detail_info.phone_no){
                        buyer_phone = response.data.buyer_detail_info.phone_no;
                        buyer_phone = formatPhoneNumber(buyer_phone);
                        $('#offer_buyer_phone').html(buyer_phone);
                    }
                    $('#offer_buyer_company_section').show();
                    $('#offer_buyer_address_section').hide();
                    $('#offer_buyer_company').show();
                    $('#offer_buyer_address').hide();
                    if(response.data.buyer_detail_info.company){
                        buyer_company = response.data.buyer_detail_info.company;
                        $('#offer_buyer_company').html(buyer_company);
                    }
                    $('.offer_agent_info_section').show();
                    if(response.data.agent_detail_info.first_name){
                        agent_name = response.data.agent_detail_info.first_name+' '+response.data.agent_detail_info.last_name;
                        $('#offer_agent_name').html(agent_name);
                    }
                    if(response.data.agent_detail_info.email){
                        agent_email = response.data.agent_detail_info.email;
                        $('#offer_agent_email').html(agent_email);
                    }
                    if(response.data.agent_detail_info.phone_no){
                        agent_phone = response.data.agent_detail_info.phone_no;
                        agent_phone = formatPhoneNumber(agent_phone);
                        $('#offer_agent_phone').html(agent_phone);
                    }
                    if(response.data.agent_detail_info.address_first){
                        agent_address = response.data.agent_detail_info.address_first+', '+response.data.agent_detail_info.city+', '+response.data.agent_detail_info.state+', '+response.data.agent_detail_info.postal_code;
                        $('#offer_agent_address').html(agent_address);
                    }
                }else{
                    $('.offer_agent_info_section').hide();
                    $('#offer_buyer_company_section').hide();
                    $('#offer_buyer_address_section').show();
                    $('#offer_buyer_company').hide();
                    $('#offer_buyer_address').show();
                    if(response.data.buyer_detail_info.first_name){
                        buyer_name = response.data.buyer_detail_info.first_name+' '+response.data.buyer_detail_info.last_name;
                        $('#offer_buyer_name').html(buyer_name);
                    }
                    if(response.data.buyer_detail_info.email){
                        buyer_email = response.data.buyer_detail_info.email;
                        $('#offer_buyer_email').html(buyer_email);
                    }
                    if(response.data.buyer_detail_info.phone_no){
                        buyer_phone = response.data.buyer_detail_info.phone_no;
                        buyer_phone = formatPhoneNumber(buyer_phone);
                        $('#offer_buyer_phone').html(buyer_phone);
                    }
                    if(response.data.buyer_detail_info.address_first){
                        agent_address = response.data.buyer_detail_info.address_first+', '+response.data.buyer_detail_info.city+', '+response.data.buyer_detail_info.state+', '+response.data.buyer_detail_info.postal_code;
                        $('#offer_buyer_address').html(agent_address);
                    }
                    $('#offer_agent_name').html('NA');
                    $('#offer_agent_email').html('NA');
                    $('#offer_agent_phone').html('NA');
                    $('#offer_agent_address').html('NA');
                }
            }else{
                $.growl.error({title: "Offer ", message: response.msg, size: 'large'});
            }
            $('#newOfferHistoryDetailModal').modal('show');
        }
    });

}
function view_seller_counter_details(property_id){
    $.ajax({
        url: '/counter-best-offer-details/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {'property_id': property_id},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            $('p.error').hide();
            $("#seller_offer_price_text").html('NA');
            $("#seller_earnest_deposit_text").html('NA');
            $("#seller_down_payment_text").html('NA');
            $("#seller_loan_type_text").html('NA');
            $("#seller_inspection_contigency_text").html('NA');
            $("#seller_financing_contigent_ext").html('NA');
            $("#seller_appraisal_contigency_text").html('NA');
            $("#seller_sale_contigency_text").html('NA');
            $("#seller_closing_date_text").html('NA');
            $("#seller_closing_cost_text").html('NA');
            $('#seller_offer_price').val('$');
            if(parseInt(response.data.earnest_deposit_type) == 1){
                $('#seller_earnest_deposit').attr('maxlength',14);
                $('#seller_earnest_deposit').val('$');
            }else{
                $('#seller_earnest_deposit').attr('maxlength',6).attr('max',100);
                $('#seller_earnest_deposit').val('');
            }
            $("#seller_counter_msg").html('');
            var offer_price = '';
            var due_diligence = '';
            var earnest_money_deposit = '';
            var earnest_money_deposit_percent = '';
            var closing_date = '';
            var loan_type = '';
            var down_payment = '';
            var offer_contingent = '';
            var appraisal_contingent = '';
            var closing_cost = '';

            var buyer_name = '';
            var buyer_email = '';
            var buyer_phone = '';
            var buyer_address = '';
            var buyer_company = '';
            var agent_name = '';
            var agent_email = '';
            var agent_phone = '';
            var agent_address = '';
            var property_id = '';
            var negotiated_id = '';
            var comments = '';
            //$("#seller_earnest_deposit_type").val(1);
            if(response.error == 0){
                //$("#counter_best_property_id").val(response.data.property_id);
                //$("#counter_best_negotiated_id").val(response.data.negotiated_id);
                //$("#counter_earnest_deposit_type").val(response.data.earnest_deposit_type);
                property_id = response.data.property_id;
                negotiated_id = response.data.negotiated_id;
                if(response.data.offer_price){
                    offer_price = response.data.offer_price;
                    offer_price = numberFormat(offer_price);
                    $("#seller_offer_price_text").html('$'+offer_price);

                }
                if(response.data.earnest_money_deposit){
                    earnest_money_deposit = response.data.earnest_money_deposit;
                    earnest_money_deposit = numberFormat(earnest_money_deposit);
                    earnest_money_deposit_percent = response.data.earnest_money_deposit_percent;
                    $("#seller_earnest_deposit_text").html('$'+earnest_money_deposit+' or '+earnest_money_deposit_percent+' %');
                }
                if(response.data.down_payment){
                    down_payment = response.data.down_payment;
                    down_payment = numberFormat(down_payment);
                    $("#seller_down_payment_text").html('$'+down_payment);
                }
                if(response.data.loan_type){
                    loan_type = response.data.loan_type;
                    $("#seller_loan_type_text").html(loan_type);
                }

                if(response.data.due_diligence){
                    due_diligence = response.data.due_diligence;
                    $("#seller_inspection_contigency_text").html(due_diligence);
                }
                if(response.data.offer_contingent){
                    offer_contingent = response.data.offer_contingent;
                    $("#seller_financing_contigent_ext").html(offer_contingent);
                }
                if(response.data.appraisal_contingent){
                    appraisal_contingent = response.data.appraisal_contingent;
                    $("#seller_appraisal_contigency_text").html(appraisal_contingent);
                }
                if(response.data.sale_contingency){
                    sale_contingency = response.data.sale_contingency;
                    $("#seller_sale_contigency_text").html(sale_contingency);
                }
                if(response.data.closing_cost){
                    closing_cost = response.data.closing_cost;
                    $("#seller_closing_cost_text").html(closing_cost);
                }
                if(response.data.closing_date){
                    closing_date = response.data.closing_date;
                    $("#seller_closing_date_text").html(closing_date);
                }
                if(response.data.comments){
                    comments = response.data.comments;
                    $("#seller_counter_msg").html(comments);
                }
                $('#seller_offer_btns').html('<button class="btn btn-green" id="accept_seller_offer" onclick="confirm_buyer_accept_offer(\''+property_id+'\',\''+negotiated_id+'\')">Accept Offer</button><button class="btn btn-primary" id="counter_seller_offer" onclick="counter_best_offer(\''+property_id+'\',\''+negotiated_id+'\')">Counter Back</button><button class="btn btn-secondary" id="reject_seller_offer" onclick="confirm_buyer_reject_best_offer(\''+property_id+'\',\''+negotiated_id+'\')">Decline Offer</button>');
            }else{
                $.growl.error({title: "Offer ", message: response.msg, size: 'large'});
            }
            $('#sellerCounterOfferDetailModal').modal('show');
        }
    });

}