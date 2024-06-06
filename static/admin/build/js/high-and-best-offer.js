$(function() { 

    $(document).on('submit', '#send_loi_frm', function(event){
        event.preventDefault();
        $.ajax({
            url: '/admin/send-loi/',
            type: 'post',
            dataType: 'json',
            cache: false,
            data: $('#send_loi_frm').serialize(),
            beforeSend: function(){
                $(".loaderDiv").show();
            },
            success: function(response){
                $(".loaderDiv").hide();
                if(response.error == 0){
                    showAlert(response.msg, 0)
                    $('#sendLoiModal').modal('hide');
                    //$('body').addClass('modal-open');
                }else{
                    showAlert(response.msg, 1)
                }
            }
        });
        return false;
    })

});


function propertyBestOfferDetails(negotiated_id,el){

    $('.offer_checbox').each(function(){
        $(this).prop('checked',false);
    });
    $('.block-item').each(function(){
        $(this).removeClass('current');
    });
    $(el).prop('checked',true);
    $(el).closest('.block-item').addClass('current');
    $.ajax({
        url: '/admin/property-best-offer-details/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {'negotiated_id': negotiated_id},
        beforeSend: function(){
            $(".loaderDiv").show();
        },
        success: function(response){
            $(".loaderDiv").hide();
            $("#offer_details").empty();
            $("#offer_details").html(response.offer_details_html);
            $("#offer_details").find('script').remove();
        }
    });
}

function get_best_offer_history_details(property_id,best_offers_id){
    $.ajax({
        url: '/admin/best-offer-history-details/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {'property_id': property_id,'best_offers_id': best_offers_id},
        beforeSend: function(){
            $(".loaderDiv").show();
        },
        success: function(response){
            $(".loaderDiv").hide();
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
                showAlert(response.msg, 1)
            }
            $('#newOfferHistoryDetailModal').modal('show');
        }
    });

}


function get_offer_documents(property_id,negotiated_id){
    $.ajax({
        url: '/admin/get-offer-doc-details/',
        type: 'post',
        dataType: 'json',
        data: {'property_id': property_id,'negotiated_id': negotiated_id},
        cache: false,
        beforeSend: function(){
            $(".loaderDiv").show();
        },
        success: function(response){
            $(".loaderDiv").hide();
            $('#offer_doc_list').empty();
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

function send_loi_popup(property_id, negotiated_id, user_id){
    $('#loi_property_id').val(property_id);
    $('#loi_negotiated_id').val(negotiated_id);
    $('#loi_user_id').val(user_id);
    $('#sendLoiModal').modal('show');

}


function formatPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    if (match) {
      return '(' + match[1] + ') ' + match[2] + '-' + match[3];
    }
    return null;
}


function numberFormat(x) {
    x = x.toString();
   var pattern = /(-?\d+)(\d{3})/;
   while (pattern.test(x))
       x = x.replace(pattern, "$1,$2");
   return x;
}