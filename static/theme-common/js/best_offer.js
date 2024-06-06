$(document).ready(function(){
    $('.select').chosen();
    $("#phone_no").inputmask('(999) 999-9999');
    $("#user_phone_no").inputmask('(999) 999-9999');
    $("#agent_buyer_phone_no").inputmask('(999) 999-9999');
    $("#buyer_phone_no").inputmask('(999) 999-9999');
    $('#offer_price').on('input',function(e){
        $(this).val(function (index, value) {
            if(value == "$" || value == ""){
                return "$";
            }else{
                //return '$' + value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                return '$' + value.replace(/(?!\.)\D/g, "").replace(/(?<=\..*)\./g, "").replace(/(?<=\.\d\d).*/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
        });

    });
    $('#earnest_deposit').on('input',function(e){
        var deposit_type = $('#earnest_deposit_type').val();
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
    $('#down_payment').on('input',function(e){
        $(this).val(function (index, value) {
            if(value == "$" || value == ""){
                return "$";
            }else{
                //return '$' + value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                return '$' + value.replace(/(?!\.)\D/g, "").replace(/(?<=\..*)\./g, "").replace(/(?<=\.\d\d).*/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }

        });

    });

    $(document).on('click', '#backStepOne', function(){
        var is_current_offer = $('#is_current_offer').val();
        var highest_best_format = $('#highest_best_format').val();
        $('#non_binding_offer_details').hide();
        if(parseInt(highest_best_format) == 3){
            $('#current_private_offer_detail').hide();
            $('#current_price_detail').show();
            if(parseInt(is_current_offer) == 1){
                $('#user_best_offer_heading').html('Current Highest and Best Offer').show();
                $('#current_highest_offer_detail').show();
            }else{
                $('#user_best_offer_heading').hide();
                $('#current_highest_offer_detail').hide();
            }
        }else{
            $('#current_price_detail').hide();
            $('#user_best_offer_heading').hide();
            $('#current_highest_offer_detail').hide();
            $('.current_private_offer_section_step2').hide();
            $('#current_private_offer_detail').show();
        }

        $('p.error').remove();
        $('input,select').removeAttr('aria-describedby').removeAttr('aria-invalid');
        $('#earnest_deposit').removeAttr('max maxlength');
        $('.steps').hide();
        $('.step').removeClass('current complete');
        $('#step_1').addClass('current');
        $('#step_1').addClass('complete');
        $('#steps-1').show();
        $('#current_step').val(1);

        $(window).scrollTop(0);
    });

    $(document).on('click', '#backStepTwo', function(){
        var is_current_offer = $('#is_current_offer').val();
        var highest_best_format = $('#highest_best_format').val();
        $('#non_binding_offer_details').hide();

        if(parseInt(highest_best_format) == 3){
            $('#current_private_offer_detail').hide();
            $('#current_price_detail').show();
            if(parseInt(is_current_offer) == 1){
                $('#user_best_offer_heading').html('Current Highest and Best Offer').show();
                $('#current_highest_offer_detail').show();
            }else{
                $('#user_best_offer_heading').hide();
                $('#current_highest_offer_detail').hide();
            }
        }else{
            $('#current_price_detail').hide();
            $('#user_best_offer_heading').hide();
            $('#current_highest_offer_detail').hide();
            $('.current_private_offer_section_step2').show();
            $('#current_private_offer_detail').show();
        }

        $('p.error').remove();
        $('input,select').removeAttr('aria-describedby').removeAttr('aria-invalid');

        var earnest_deposit_type = $('#earnest_deposit_type').val();
        if(parseInt(earnest_deposit_type) == 2){
            $('#earnest_deposit').attr({max: 100, maxlength: 6});
        }else{
            $('#earnest_deposit').removeAttr('max');
            $('#earnest_deposit').attr({maxlength: 14});

        }
        $('#user_best_offer_terms').show();
        $('.steps').hide();

        $('.step').removeClass('current complete');
        $('#step_2').addClass('current');
        $('#step_1,#step_2').addClass('complete');
        $('#steps-2').show();
        $('#current_step').val(2);

        $(window).scrollTop(0);
    });
    $(document).on('click', '#backStepThree', function(){
        var is_current_offer = $('#is_current_offer').val();
        $('#current_price_detail').hide();
        $('#current_highest_offer_detail').hide();
        $('#current_private_offer_detail').hide();
        $('#non_binding_offer_details').show();
        $('#user_best_offer_heading').html('Your Non-Binding Highest & Best Offer').show();
        $('#earnest_deposit').removeAttr('max maxlength');
        $('#current_step').val(3);
        $('p.error').remove();
        $('input,select').removeAttr('aria-describedby').removeAttr('aria-invalid');
        $('.steps').hide();
        $('.step').removeClass('current complete');
        $('#step_3').addClass('current');
        $('#step_1,#step_2,#step_3').addClass('complete');
        $('#steps-3').show();
        $(window).scrollTop(0);
    });
    $(document).on('click', '#backStepFour', function(){
        var is_current_offer = $('#is_current_offer').val();
        $('#current_price_detail').hide();
        $('#current_highest_offer_detail').hide();
        $('#current_private_offer_detail').hide();
        $('#non_binding_offer_details').show();
        $('#user_best_offer_heading').html('Your Non-Binding Highest & Best Offer').show();
        $('p.error').remove();
        $('input,select').removeAttr('aria-describedby').removeAttr('aria-invalid');
        $('#earnest_deposit').removeAttr('max maxlength');

        //$('#user_best_offer_terms').show();
        if($('#offer_price').val() == "" || ($('#offer_price').val() != "" && $('#offer_price').val() == "$")){
            var offer_price = $('#pre_offer_price').val();
        }else{
            var offer_price = $('#offer_price').val();
        }
        var down_payment = $('#down_payment').val();
        var due_diligence = $('#due_diligence').val();
        var closing_period = $('option:selected','#closing_period').val();
        var closing_cost =  $('input[name="closing_cost"]:checked').val();
        var earnest_deposit = $('#earnest_deposit').val();
        var earnest_deposit_type = $('#earnest_deposit_type').val();
        var loan_type_text = $('option:selected','#financing').text();
        var financing = $('option:selected','#financing').val();
        var due_diligence_text = '';
        var closing_period_text = '';
        var offer_contingent_text = 'No';
        var financing_text = 'No';
        var appraisal_contingent_text = '';
        var sale_contingency_text = '';
        var closing_cost_text = '';

        offer_price = offer_price.toString().replace(/,/g, '').replace('$', '');
        down_payment = down_payment.toString().replace(/,/g, '').replace('$', '');
        var offer_price_words = convert_number_to_words(offer_price);
        var down_payment_words = convert_number_to_words(down_payment);
        offer_price_words = offer_price_words.toUpperCase();
        down_payment_words = down_payment_words.toUpperCase();
        due_diligence = due_diligence.toString().replace(/,/g, '');
        closing_period = closing_period.toString().replace(/,/g, '');
        //$('#offer_price_col').html('<strong>'+offer_price_words+'('+$('#offer_price').val()+')</strong>');
        $('#offer_price_col').html($('#offer_price').val());
        //$('#down_payment_col').html('<strong>'+down_payment_words+'('+$('#down_payment').val()+')</strong>');
        $('#down_payment_col').html($('#down_payment').val());
        $('#loan_type_col').html(loan_type_text);
        /*if(parseInt(earnest_deposit_type) == 1){
            earnest_deposit = earnest_deposit.toString().replace(/,/g, '').replace('$', '');
            earnest_deposit_words = convert_number_to_words(earnest_deposit);
            earnest_deposit_words = earnest_deposit_words.toUpperCase();
            var earnest_html = '<strong>'+earnest_deposit_words+'('+$('#earnest_deposit').val()+')</strong> will be placed in escrow at the mutual execution of a Purchase and Sale Agreement. Following the expiration of the Due Diligence Period, the Deposit shall be non-refundable to Buyer.';
        }else{
            var earnest_html = '<strong>'+$('#earnest_deposit').val()+' %</strong> will be placed in escrow at the mutual execution of a Purchase and Sale Agreement. Following the expiration of the Due Diligence Period, the Deposit shall be non-refundable to Buyer.';
        }*/
        var str_offer_price = offer_price.toString().replace(/,/g, '').replace('$', '');
        if(parseInt(earnest_deposit_type) == 1){

            earnest_money_deposit = earnest_deposit.replace('$','').replace('%','').replace(/,/g, '');
            earnest_money_deposit_percent = ((parseFloat(earnest_money_deposit)*100)/parseFloat(str_offer_price)).toFixed(2);
            earnest_html = earnest_deposit+' or '+ earnest_money_deposit_percent+' %';
        }else{
            earnest_money_deposit_percent = earnest_deposit.replace('$','').replace('%','').replace(/,/g, '');
            earnest_money_deposit = (parseFloat(str_offer_price)*parseFloat(earnest_money_deposit_percent))/parseFloat(100);
            earnest_money_deposit = numberFormat(earnest_money_deposit);
            earnest_html = '$'+earnest_money_deposit+' or '+ earnest_deposit+' %';
        }

        if(parseInt(due_diligence) == 1){
            due_diligence_text = 'Yes, complete inspections at buyer(s) expense.';
        }else if(parseInt(due_diligence) == 2){
            due_diligence_text = 'No, waive inspections.';
        }
        if(parseInt(closing_period) == 1){
            closing_period_text = '1-30 Days';
        }else if(parseInt(closing_period) == 2){
            closing_period_text = '30-45 Days';
        }else if(parseInt(closing_period) == 3){
            closing_period_text = '45-60 Days';
        }else{
            closing_period_text = '-';
        }
        if(parseInt(closing_cost) == 1){
            closing_cost_text = 'Buyer agrees to pay for all loan-related closing costs and half of the transaction closing costs.';
        }else if(parseInt(closing_cost) == 2){
            closing_cost_text = 'Buyer agrees to pay for all loan-related closing costs and all of the transaction closing costs.';
        }else if(parseInt(closing_cost) == 3){
            closing_cost_text = 'Seller to pay for all loan-related closing costs and all of the transaction closing costs.';
        }else{
            closing_cost_text = '-';
        }
        var offer_contingent = $('input[name="offer_contingent"]:checked').val();
        var working_with_buyer = $('input[name="working_with_buyer"]:checked').val();
        var appraisal_contingent = $('input[name="appraisal_contingent"]:checked').val();
        var sale_contingency = $('input[name="sale_contingency"]:checked').val();
        if(parseInt(offer_contingent) == 1){
            offer_contingent_text = 'Yes';
        }else if(parseInt(offer_contingent) == 2){
            offer_contingent_text = 'No';
        }else if(parseInt(offer_contingent) == 3){
            offer_contingent_text = 'Cash Buyer';
        }
        if(parseInt(appraisal_contingent) == 1){
            appraisal_contingent_text = 'Yes';
        }else{
            appraisal_contingent_text = 'No';
        }
        if(parseInt(sale_contingency) == 1){
            sale_contingency_text = 'Yes';
        }else{
            sale_contingency_text = 'No';
        }
        if(parseInt(financing) == 6){
            financing_text = 'Yes';
        }

        $('#earnest_deposit_col').html(earnest_html);
        //$('#due_diligence_col').html('The Buyer shall have <strong>'+due_diligence_text+'</strong> beginning at the effective date of the PSA to inspect and perform Due Diligence as Buyer deems reasonably necessary to further evaluate the Purchase of Property(s).');
        $('#due_diligence_col').html(due_diligence_text);
        $('#closing_period_col').html(closing_period_text);
        $('#closing_cost_col').html(closing_cost_text);
        if(parseInt(working_with_buyer) == 1){
            var buyer_info = $('#agent_buyer_first_name').val()+' '+$('#agent_buyer_last_name').val()+'<br>'+$('#agent_buyer_phone_no').val()+'<br>'+$('#agent_buyer_user_email').val();
            var agent_info = $('#first_name').val()+' '+$('#last_name').val()+'<br>'+$('#user_phone_no').val()+'<br>'+$('#user_email').val();
            $('#buyer_contact_info').html(buyer_info).show();
            $('#agent_contact_info').html(agent_info).show();
            $('#agent_contact_info_section').show();
        }else{
            var buyer_info = $('#first_name').val()+' '+$('#last_name').val()+'<br>'+$('#user_phone_no').val()+'<br>'+$('#user_email').val();
            var agent_info = '-';
            $('#buyer_contact_info').html(buyer_info).show();
            $('#agent_contact_info').hide();
            $('#agent_contact_info_section').hide();
        }

        if(parseInt(working_with_buyer) == 1){
            $('#buyer_sign').html('Signature <i>'+$('#agent_buyer_first_name').val()+' '+$('#agent_buyer_last_name').val()+'</i>');
            $('#buyer_name_sign').html('Buyer '+$('#agent_buyer_first_name').val()+' '+$('#agent_buyer_last_name').val());
        }else{
            $('#buyer_sign').html('Signature <i>'+$('#first_name').val()+' '+$('#last_name').val()+'</i>');
            $('#buyer_name_sign').html('Buyer '+$('#first_name').val()+' '+$('#last_name').val());
        }
        $('#offer_contingent_col').html(offer_contingent_text);
        $('#appraisal_contingency_col').html(appraisal_contingent_text);
        $('#sale_contingency_col').html(sale_contingency_text);
        $('#exchange_col').html(financing_text);

        var date = new Date();
        var fullyear = date.getFullYear();
        var halfYear = parseInt(date.getFullYear().toString().substr(2,2), 10);
        var mts = date.getMonth()+1;
        var short_month_name = date.toLocaleString('default', { month: 'short' })
        var long_month_name = date.toLocaleString('default', { month: 'long' })
        var month_num = (mts < 10)?'0'+mts:mts;
        var dt = (date.getDate() < 10)?'0'+date.getDate():date.getDate();
        var hrs = (date.getHours() < 10)?'0'+date.getHours():date.getHours();
        var mins = (date.getMinutes() < 10)?'0'+date.getMinutes():date.getMinutes();
        var secs = (date.getSeconds() < 10)?'0'+date.getSeconds():date.getSeconds();
        var timeStp = short_month_name+', '+dt+' '+fullyear;
        $('#buyer_date').html('Date '+timeStp);

        $('.steps').hide();
        $('.step').removeClass('current complete');
        $('#step_4').addClass('current');
        $('#step_1,#step_2,#step_3,#step_4').addClass('complete');
        $('#steps-4').show();
        $('#current_step').val(4);
        $(window).scrollTop(0);
    });
    $(document).on('click', '.can_navigate', function(){
        var step = $(this).attr('rel_position');
        var current_step = $('#current_step').val();
        if(parseInt(current_step) == 1 && parseInt(step) > 1){
            $('#earnest_deposit').removeAttr('max maxlength');
            $('p.error').remove();
            $('input,select').removeAttr('aria-describedby').removeAttr('aria-invalid');
            data = {
                first_name: 'first_name',
                last_name: 'last_name',
                user_phone_no: 'user_phone_no',
                user_email: 'user_email',
                address_1: 'address_1',
                zip_code: 'zip_code',
                city: 'city',
                state: 'state',
                trad_user_type: 'trad_user_type',
            }
            if(parseInt($('#trad_user_type').val()) == 2){
                data.working_with_agent = 'working_with_agent';
                data.property_in_person = 'property_in_person';
                data.buyer_pre_qualified = 'buyer_pre_qualified';
            }
            if(parseInt($('#trad_user_type').val()) == 4){
                data.agent_property_in_person = 'agent_property_in_person';
                data.agent_pre_qualified = 'agent_pre_qualified';
                data.working_with_buyer = 'working_with_buyer';
                if(parseInt($('input[name="working_with_buyer"]:checked').val()) == 1){
                    data.agent_buyer_first_name = 'agent_buyer_first_name';
                    data.agent_buyer_last_name = 'agent_buyer_last_name';
                    data.agent_buyer_user_email = 'agent_buyer_user_email';
                    data.agent_buyer_phone_no = 'agent_buyer_phone_no';
                }
            }

            validate_best_offer_form(data);

        }
        if(parseInt(current_step) == 2 && parseInt(step) > 2){
            $('p.error').remove();
            $('input,select').removeAttr('aria-describedby').removeAttr('aria-invalid');
            var earnest_deposit_type = $('#earnest_deposit_type').val();
            if(parseInt(earnest_deposit_type) == 2){
                $('#earnest_deposit').attr({max: 100, maxlength: 6});
            }else{
                $('#earnest_deposit').removeAttr('max');
                $('#earnest_deposit').attr({maxlength: 14});

            }
            data = {
                offer_price: 'offer_price',
                earnest_deposit: 'earnest_deposit',
                due_diligence: 'due_diligence',
                closing_period: 'closing_period',
                financing: 'financing',
                offer_contingent: 'offer_contingent',
                sale_contingency: 'sale_contingency',
                appraisal_contingent: 'appraisal_contingent',
                closing_cost: 'closing_cost',
            }
            validate_best_offer_form(data);
        }
        if(parseInt(current_step) == 4  && parseInt(step) > 4){
            $('#earnest_deposit').removeAttr('max maxlength');
            data = {
                terms: 'terms',
            }
            validate_best_offer_form(data);
            $('p.error').remove();
            $('input,select').removeAttr('aria-describedby').removeAttr('aria-invalid');
        }

        if(typeof(step) != 'undefined' && step != "" && $('#best_offer_frm').valid()){
            $('#earnest_deposit').removeAttr('max maxlength');
            if(parseInt(step) == 1){
                //$('#user_best_offer_terms').hide();
                var is_current_offer = $('#is_current_offer').val();
                var highest_best_format = $('#highest_best_format').val();
                $('#non_binding_offer_details').hide();
                /*$('#current_price_detail').show();
                if(parseInt(is_current_offer) == 1){
                    $('#user_best_offer_heading').html('Current Highest and Best Offer').show();
                    $('#current_highest_offer_detail').show();
                }else{
                    $('#user_best_offer_heading').hide();
                    $('#current_highest_offer_detail').hide();
                }*/
                if(parseInt(highest_best_format) == 3){
                    $('#current_private_offer_detail').hide();
                    $('#current_price_detail').show();
                    if(parseInt(is_current_offer) == 1){
                        $('#user_best_offer_heading').html('Current Highest and Best Offer').show();
                        $('#current_highest_offer_detail').show();
                    }else{
                        $('#user_best_offer_heading').hide();
                        $('#current_highest_offer_detail').hide();
                    }
                }else{
                    $('#current_price_detail').hide();
                    $('#user_best_offer_heading').hide();
                    $('#current_highest_offer_detail').hide();
                    $('.current_private_offer_section_step2').hide();
                    $('#current_private_offer_detail').show();
                }

                $('p.error').remove();
                $('input,select').removeAttr('aria-describedby').removeAttr('aria-invalid');
                $('.steps').hide();
                $('.step').removeClass('current complete');
                $('#step_1').addClass('current');
                $('#step_1').addClass('complete');
                $('#steps-1').show();
                $(window).scrollTop(0);
                $('#current_step').val(1);
            }else if(parseInt(step) == 2){
                var is_current_offer = $('#is_current_offer').val();
                var highest_best_format = $('#highest_best_format').val();
                $('#non_binding_offer_details').hide();
                if(parseInt(highest_best_format) == 3){
                    $('#current_private_offer_detail').hide();
                    $('#current_price_detail').show();
                    if(parseInt(is_current_offer) == 1){
                        $('#user_best_offer_heading').html('Current Highest and Best Offer').show();
                        $('#current_highest_offer_detail').show();
                    }else{
                        $('#user_best_offer_heading').hide();
                        $('#current_highest_offer_detail').hide();
                    }
                }else{
                    $('#current_price_detail').hide();
                    $('#user_best_offer_heading').hide();
                    $('#current_highest_offer_detail').hide();
                    $('.current_private_offer_section_step2').show();
                    $('#current_private_offer_detail').show();
                }
                /*$('#current_price_detail').show();
                if(parseInt(is_current_offer) == 1){
                    $('#user_best_offer_heading').html('Current Highest and Best Offer').show();
                    $('#current_highest_offer_detail').show();
                }else{
                    $('#user_best_offer_heading').hide();
                    $('#current_highest_offer_detail').hide();
                }*/
                var earnest_deposit_type = $('#earnest_deposit_type').val();
                if(parseInt(earnest_deposit_type) == 2){
                    $('#earnest_deposit').attr({max: 100, maxlength: 6});
                }else{
                    $('#earnest_deposit').removeAttr('max');
                    $('#earnest_deposit').attr({maxlength: 14});

                }
                $('p.error').remove();
                $('input,select').removeAttr('aria-describedby').removeAttr('aria-invalid');
                $('.steps').hide();

                $('.step').removeClass('current complete');
                $('#step_2').addClass('current');
                $('#step_1,#step_2').addClass('complete');
                $('#steps-2').show();
                $(window).scrollTop(0);
                $('#current_step').val(2);
            }else if(parseInt(step) == 3){
                var is_current_offer = $('#is_current_offer').val();
                $('#current_price_detail').hide();
                $('#current_highest_offer_detail').hide();
                $('#current_private_offer_detail').hide();
                $('#non_binding_offer_details').show();
                $('#user_best_offer_heading').html('Your Non-Binding Highest and Best Offer').show();
                $('p.error').remove();
                $('input,select').removeAttr('aria-describedby').removeAttr('aria-invalid');
                $('.steps').hide();
                $('.step').removeClass('current complete');
                $('#step_3').addClass('current');
                $('#step_1,#step_2,#step_3').addClass('complete');
                $('#steps-3').show();
                $(window).scrollTop(0);
                $('#current_step').val(3);
            }else if(parseInt(step) == 4){
                var is_current_offer = $('#is_current_offer').val();
                $('#current_price_detail').hide();
                $('#current_highest_offer_detail').hide();
                $('#current_private_offer_detail').hide();
                $('#non_binding_offer_details').show();
                $('#user_best_offer_heading').html('Your Non-Binding Highest and Best Offer').show();
                $('p.error').remove();
                $('input,select').removeAttr('aria-describedby').removeAttr('aria-invalid');

                $('#user_best_offer_terms').show();

                /*var offer_price = $('#offer_price').val();
                var due_diligence = $('#due_diligence').val();
                var closing_period = $('#closing_period').val();
                var earnest_deposit = $('#earnest_deposit').val();
                var earnest_deposit_type = $('#earnest_deposit_type').val();
                var financing = $('#financing').val();
                var due_diligence_text = '';
                var closing_period_text = '';
                var offer_contingent_text = 'No';
                var financing_text = 'No';

                offer_price = offer_price.toString().replace(/,/g, '').replace('$', '');
                var offer_price_words = convert_number_to_words(offer_price);
                offer_price_words = offer_price_words.toUpperCase();
                due_diligence = due_diligence.toString().replace(/,/g, '');
                closing_period = closing_period.toString().replace(/,/g, '');
                $('#offer_price_col').html('<strong>'+offer_price_words+'('+$('#offer_price').val()+')</strong>');
                if(parseInt(earnest_deposit_type) == 1){
                    earnest_deposit = earnest_deposit.toString().replace(/,/g, '').replace('$', '');
                    earnest_deposit_words = convert_number_to_words(earnest_deposit);
                    earnest_deposit_words = earnest_deposit_words.toUpperCase();
                    var earnest_html = '<strong>'+earnest_deposit_words+'('+$('#earnest_deposit').val()+')</strong> will be placed in escrow at the mutual execution of a Purchase and Sale Agreement. Following the expiration of the Due Diligence Period, the Deposit shall be non-refundable to Buyer.';
                }else{
                    var earnest_html = '<strong>'+$('#earnest_deposit').val()+' %</strong> will be placed in escrow at the mutual execution of a Purchase and Sale Agreement. Following the expiration of the Due Diligence Period, the Deposit shall be non-refundable to Buyer.';
                }

                if(parseInt(due_diligence) == 1){
                    due_diligence_text = 'Yes, complete inspections at buyer(s) expense.';
                }else if(parseInt(due_diligence) == 2){
                    due_diligence_text = 'No, waive inspections.';
                }
                if(parseInt(closing_period) == 1){
                    closing_period_text = '1-30 Days';
                }else if(parseInt(closing_period) == 2){
                    closing_period_text = '30-45 Days';
                }else if(parseInt(closing_period) == 3){
                    closing_period_text = '45-60 Days';
                }else if(parseInt(closing_period) == 4){
                    closing_period_text = '61+ Days';
                }
                var offer_contingent = $('input[name="offer_contingent"]:checked').val();
                if(parseInt(offer_contingent) == 1){
                    offer_contingent_text = 'Yes';
                }
                if(parseInt(financing) == 6){
                    financing_text = 'Yes';
                }
                $('#earnest_deposit_col').html(earnest_html);
                $('#due_diligence_col').html('The Buyer shall have <strong>'+due_diligence_text+'</strong> beginning at the effective date of the PSA to inspect and perform Due Diligence as Buyer deems reasonably necessary to further evaluate the Purchase of Property(s).');
                $('#closing_period_col').html('Buyer and Seller shall close the Purchase and Sale of the Property <strong>'+closing_period_text+' </strong> after the expiration of the Due Diligence period.');
                $('#buyer_name_col').html($('#first_name').val()+' '+$('#last_name').val());
                $('#buyer_phone_col').html($('#user_phone_no').val());
                $('#buyer_email_col').html($('#user_email').val());
                $('#buyer_sign').html('Signature <span><i>'+$('#first_name').val()+' '+$('#last_name').val()+'</i></span>');
                $('#buyer_name_sign').html('Buyer <span>'+$('#first_name').val()+' '+$('#last_name').val()+'</span>');
                $('#offer_contingent_col').html(offer_contingent_text);
                $('#exchange_col').html(financing_text);

                var date = new Date();
                var fullyear = date.getFullYear();
                var halfYear = parseInt(date.getFullYear().toString().substr(2,2), 10);
                var mts = date.getMonth()+1;
                var short_month_name = date.toLocaleString('default', { month: 'short' })
                var long_month_name = date.toLocaleString('default', { month: 'long' })
                var month_num = (mts < 10)?'0'+mts:mts;
                var dt = (date.getDate() < 10)?'0'+date.getDate():date.getDate();
                var hrs = (date.getHours() < 10)?'0'+date.getHours():date.getHours();
                var mins = (date.getMinutes() < 10)?'0'+date.getMinutes():date.getMinutes();
                var secs = (date.getSeconds() < 10)?'0'+date.getSeconds():date.getSeconds();
                var timeStp = short_month_name+', '+dt+' '+fullyear;
                $('#buyer_date').html('Date <span>'+timeStp+'</span>');*/
                if($('#offer_price').val() == "" || ($('#offer_price').val() != "" && $('#offer_price').val() == "$")){
                    var offer_price = $('#pre_offer_price').val();
                }else{
                    var offer_price = $('#offer_price').val();
                }

                var down_payment = $('#down_payment').val();
                var due_diligence = $('#due_diligence').val();
                var closing_period = $('option:selected','#closing_period').val();
                var closing_cost =  $('input[name="closing_cost"]:checked').val();
                var earnest_deposit = $('#earnest_deposit').val();
                var earnest_deposit_type = $('#earnest_deposit_type').val();

                var loan_type_text = $('option:selected','#financing').text();
                var financing = $('option:selected','#financing').val();
                var due_diligence_text = '';
                var closing_period_text = '';
                var offer_contingent_text = 'No';
                var financing_text = 'No';
                var appraisal_contingent_text = '';
                var sale_contingency_text = '';
                var closing_cost_text = '';

                offer_price = offer_price.toString().replace(/,/g, '').replace('$', '');
                down_payment = down_payment.toString().replace(/,/g, '').replace('$', '');
                var offer_price_words = convert_number_to_words(offer_price);
                var down_payment_words = convert_number_to_words(down_payment);
                offer_price_words = offer_price_words.toUpperCase();
                down_payment_words = down_payment_words.toUpperCase();
                due_diligence = due_diligence.toString().replace(/,/g, '');
                closing_period = closing_period.toString().replace(/,/g, '');
                //$('#offer_price_col').html('<strong>'+offer_price_words+'('+$('#offer_price').val()+')</strong>');
                $('#offer_price_col').html($('#offer_price').val());
                //$('#down_payment_col').html('<strong>'+down_payment_words+'('+$('#down_payment').val()+')</strong>');
                $('#down_payment_col').html($('#down_payment').val());
                $('#loan_type_col').html(loan_type_text);
                /*if(parseInt(earnest_deposit_type) == 1){
                    earnest_deposit = earnest_deposit.toString().replace(/,/g, '').replace('$', '');
                    earnest_deposit_words = convert_number_to_words(earnest_deposit);
                    earnest_deposit_words = earnest_deposit_words.toUpperCase();
                    var earnest_html = '<strong>'+earnest_deposit_words+'('+$('#earnest_deposit').val()+')</strong> will be placed in escrow at the mutual execution of a Purchase and Sale Agreement. Following the expiration of the Due Diligence Period, the Deposit shall be non-refundable to Buyer.';
                }else{
                    var earnest_html = '<strong>'+$('#earnest_deposit').val()+' %</strong> will be placed in escrow at the mutual execution of a Purchase and Sale Agreement. Following the expiration of the Due Diligence Period, the Deposit shall be non-refundable to Buyer.';
                }*/
                var str_offer_price = offer_price.toString().replace(/,/g, '').replace('$', '');
                if(parseInt(earnest_deposit_type) == 1){

                    earnest_money_deposit = earnest_deposit.replace('$','').replace('%','').replace(/,/g, '');
                    earnest_money_deposit_percent = ((parseFloat(earnest_money_deposit)*100)/parseFloat(str_offer_price)).toFixed(2);
                    earnest_html = earnest_deposit+' or '+ earnest_money_deposit_percent+' %';
                }else{
                    earnest_money_deposit_percent = earnest_deposit.replace('$','').replace('%','').replace(/,/g, '');
                    earnest_money_deposit = (parseFloat(str_offer_price)*parseFloat(earnest_money_deposit_percent))/parseFloat(100);
                    earnest_money_deposit = numberFormat(earnest_money_deposit);
                    earnest_html = '$'+earnest_money_deposit+' or '+ earnest_deposit+' %';
                }

                if(parseInt(due_diligence) == 1){
                    due_diligence_text = 'Yes, complete inspections at buyer(s) expense.';
                }else if(parseInt(due_diligence) == 2){
                    due_diligence_text = 'No, waive inspections.';
                }
                if(parseInt(closing_period) == 1){
                    closing_period_text = '1-30 Days';
                }else if(parseInt(closing_period) == 2){
                    closing_period_text = '30-45 Days';
                }else if(parseInt(closing_period) == 3){
                    closing_period_text = '45-60 Days';
                }else{
                    closing_period_text = '-';
                }
                if(parseInt(closing_cost) == 1){
                    closing_cost_text = 'Buyer agrees to pay for all loan-related closing costs and half of the transaction closing costs.';
                }else if(parseInt(closing_cost) == 2){
                    closing_cost_text = 'Buyer agrees to pay for all loan-related closing costs and all of the transaction closing costs.';
                }else if(parseInt(closing_cost) == 3){
                    closing_cost_text = 'Seller to pay for all loan-related closing costs and all of the transaction closing costs.';
                }else{
                    closing_cost_text = '-';
                }
                var offer_contingent = $('input[name="offer_contingent"]:checked').val();
                var working_with_buyer = $('input[name="working_with_buyer"]:checked').val();
                var appraisal_contingent = $('input[name="appraisal_contingent"]:checked').val();
                var sale_contingency = $('input[name="sale_contingency"]:checked').val();
                if(parseInt(offer_contingent) == 1){
                    offer_contingent_text = 'Yes';
                }else if(parseInt(offer_contingent) == 2){
                    offer_contingent_text = 'No';
                }else if(parseInt(offer_contingent) == 3){
                    offer_contingent_text = 'Cash Buyer';
                }
                if(parseInt(appraisal_contingent) == 1){
                    appraisal_contingent_text = 'Yes';
                }else{
                    appraisal_contingent_text = 'No';
                }
                if(parseInt(sale_contingency) == 1){
                    sale_contingency_text = 'Yes';
                }else{
                    sale_contingency_text = 'No';
                }
                if(parseInt(financing) == 6){
                    financing_text = 'Yes';
                }

                $('#earnest_deposit_col').html(earnest_html);
                //$('#due_diligence_col').html('The Buyer shall have <strong>'+due_diligence_text+'</strong> beginning at the effective date of the PSA to inspect and perform Due Diligence as Buyer deems reasonably necessary to further evaluate the Purchase of Property(s).');
                $('#due_diligence_col').html(due_diligence_text);
                $('#closing_period_col').html(closing_period_text);
                $('#closing_cost_col').html(closing_cost_text);
                if(parseInt(working_with_buyer) == 1){
                    var buyer_info = $('#agent_buyer_first_name').val()+' '+$('#agent_buyer_last_name').val()+'<br>'+$('#agent_buyer_phone_no').val()+'<br>'+$('#agent_buyer_user_email').val();
                    var agent_info = $('#first_name').val()+' '+$('#last_name').val()+'<br>'+$('#user_phone_no').val()+'<br>'+$('#user_email').val();
                    $('#buyer_contact_info').html(buyer_info).show();
                    $('#agent_contact_info').html(agent_info).show();
                    $('#agent_contact_info_section').show();
                }else{
                    var buyer_info = $('#first_name').val()+' '+$('#last_name').val()+'<br>'+$('#user_phone_no').val()+'<br>'+$('#user_email').val();
                    var agent_info = '-';
                    $('#buyer_contact_info').html(buyer_info).show();
                    $('#agent_contact_info').hide();
                    $('#agent_contact_info_section').hide();
                }

                if(parseInt(working_with_buyer) == 1){
                    $('#buyer_sign').html('Signature <i>'+$('#agent_buyer_first_name').val()+' '+$('#agent_buyer_last_name').val()+'</i>');
                    $('#buyer_name_sign').html('Buyer '+$('#agent_buyer_first_name').val()+' '+$('#agent_buyer_last_name').val());
                }else{
                    $('#buyer_sign').html('Signature <i>'+$('#first_name').val()+' '+$('#last_name').val()+'</i>');
                    $('#buyer_name_sign').html('Buyer '+$('#first_name').val()+' '+$('#last_name').val());
                }
                $('#offer_contingent_col').html(offer_contingent_text);
                $('#appraisal_contingency_col').html(appraisal_contingent_text);
                $('#sale_contingency_col').html(sale_contingency_text);
                $('#exchange_col').html(financing_text);

                var date = new Date();
                var fullyear = date.getFullYear();
                var halfYear = parseInt(date.getFullYear().toString().substr(2,2), 10);
                var mts = date.getMonth()+1;
                var short_month_name = date.toLocaleString('default', { month: 'short' })
                var long_month_name = date.toLocaleString('default', { month: 'long' })
                var month_num = (mts < 10)?'0'+mts:mts;
                var dt = (date.getDate() < 10)?'0'+date.getDate():date.getDate();
                var hrs = (date.getHours() < 10)?'0'+date.getHours():date.getHours();
                var mins = (date.getMinutes() < 10)?'0'+date.getMinutes():date.getMinutes();
                var secs = (date.getSeconds() < 10)?'0'+date.getSeconds():date.getSeconds();
                var timeStp = short_month_name+', '+dt+' '+fullyear;
                $('#buyer_date').html('Date '+timeStp);

                $('.steps').hide();
                $('.step').removeClass('current complete');
                $('#step_4').addClass('current');
                $('#step_1,#step_2,#step_3,#step_4').addClass('complete');
                $('#steps-4').show();
                $(window).scrollTop(0);
                $('#current_step').val(4);
            }
        }
    });
    $(document).on('keyup', '#best_offer_frm #zip_code', function(){
       var zip_code = $(this).val();
       country_code = $("#country").find(':selected').data('short-code');
       country_id = $("#country").val();
       if(zip_code.length > 4 && country_id == 1){
        params = {
            'zip_code': zip_code,
            'call_function': set_offer_address_by_zipcode,
        }
        get_address_by_zipcode(params);
       }
    });
    $(document).on('click', '#loadStepTwo', function(){
        data = {
            first_name: 'first_name',
            last_name: 'last_name',
            user_phone_no: 'user_phone_no',
            user_email: 'user_email',
            address_1: 'address_1',
            zip_code: 'zip_code',
            city: 'city',
            country: 'country',
            state: 'state',
            trad_user_type: 'trad_user_type',
        }
        if(parseInt($('#trad_user_type').val()) == 2){
            data.working_with_agent = 'working_with_agent';
            data.property_in_person = 'property_in_person';
            data.buyer_pre_qualified = 'buyer_pre_qualified';
        }
        if(parseInt($('#trad_user_type').val()) == 4){
            data.agent_property_in_person = 'agent_property_in_person';
            data.agent_pre_qualified = 'agent_pre_qualified';
            data.working_with_buyer = 'working_with_buyer';
            if(parseInt($('input[name="working_with_buyer"]:checked').val()) == 1){
                data.agent_buyer_first_name = 'agent_buyer_first_name';
                data.agent_buyer_last_name = 'agent_buyer_last_name';
                data.agent_buyer_user_email = 'agent_buyer_user_email';
                data.agent_buyer_phone_no = 'agent_buyer_phone_no';
            }
        }
        validate_best_offer_form(data);

        if($('#best_offer_frm').valid()){
            submit_loi_form(1);
            /*$('.steps').hide();
            $('.step').removeClass('current');
            $('#step_2').addClass('current');

            $('#steps-2').show();
            $(window).scrollTop(0);*/
        }
    });
    $(document).on('click', 'input[name="is_submit_proof_fund"]', function(){
        var is_submit_proof_fund = parseInt($(this).val());
        if(is_submit_proof_fund == 1){
            $('input[name="doc_reason"]').prop('checked',false);
            $('#upload_document_section').show();
            $('#doc_reason_section').hide();
        }else{
            $('#upload_document_section').hide();
            $('input[name="doc_reason"][value="1"]').prop('checked',true);
            $('#doc_reason_section').show();
        }
      });
      $(document).on('click', 'input[name="doc_reason"]', function(){
        $('input[name="is_submit_proof_fund"][value="0"]').prop('checked',true);
        $('#upload_document_section').hide();
      });
    $(document).on('click', '#loadStepThree', function(){
        $('p.error').remove();
        $('input,select').removeAttr('aria-describedby').removeAttr('aria-invalid');
        data = {
            offer_price: 'offer_price',
            earnest_deposit: 'earnest_deposit',
            due_diligence: 'due_diligence',
            closing_period: 'closing_period',
            financing: 'financing',
            offer_contingent: 'offer_contingent',
            sale_contingency: 'sale_contingency',
            appraisal_contingent: 'appraisal_contingent',
            closing_cost: 'closing_cost',
        }
        validate_best_offer_form(data);

        if($('#best_offer_frm').valid()){
            submit_loi_form(2);
        }
    });
    /*$(document).on('click', '#loadStepFour', function(){
        $('p.error').remove();
        $('input,select').removeAttr('aria-describedby').removeAttr('aria-invalid');
        data = {
            offer_doc_id: 'offer_doc_id'
        }
        validate_best_offer_form(data);
        if($('#best_offer_frm').valid()){
            $('.steps').hide();
            $('.step').removeClass('current');
            $('#step_4').addClass('current');
            $('#steps-4').show();
            $(window).scrollTop(0);
        }
    });*/

    $(document).on('click', '#loadStepFour', function(){
        $('p.error').remove();
        $('input,select').removeAttr('aria-describedby').removeAttr('aria-invalid');
        /*data = {
            offer_doc_id: 'offer_doc_id'
        }
        validate_best_offer_form(data);*/
        if($('#best_offer_frm').valid()){
            submit_loi_form(3);

        }
    });
    /*$(document).on('click', '#loadStepFive', function(){
        data = {
            terms: 'terms',
        }
        validate_best_offer_form(data);
        if($('#best_offer_frm').valid()){
            $('.steps').hide();
            $('.step').removeClass('current');
            $('#step_6').addClass('current');
            $('#steps-6').show();
            $(window).scrollTop(0);
        }
    });*/
    /*$(document).on('click', '#loadStepSix', function(){
        data = {
            terms: 'terms',
        }
        validate_best_offer_form(data);
        if($('#best_offer_frm').valid()){
            $('.steps').hide();
            $('.step').removeClass('current');
            $('#step_6').addClass('current');
            $('#steps-6').show();
            $(window).scrollTop(0);
        }
    });*/
    $('#loadStepFive').on('click', function(){
        //var reg_id = $('#bidderRegFrm #reg_id').val();
        var url = '/submit-loi/';
        data = {
            terms: 'terms',
        }
        validate_best_offer_form(data);

        if($('#best_offer_frm').valid()){
            /*$.ajax({
              url: url,
              type: 'post',
              dataType: 'json',
              cache: false,
              data: $('#best_offer_frm').serialize(),
              beforeSend: function(){
                $('.overlay').show();
              },
              success: function(response){
                  $('.overlay').hide();
                  if(response.error == 0){
                      $.growl.notice({title: "Submit LOI ", message: "LOI submitted successfully", size: 'large'});
                      $('.steps').hide();
                      $('.step').removeClass('current');
                      $('#step_5').addClass('current');
                      $('#steps-5').show();
                      $(window).scrollTop(0);
                  }else{
                       $.growl.error({title: "Submit LOI ", message: response.msg, size: 'large'});

                  }
              }
          });*/
          submit_loi_form(4);
        }

    });

    $(document).on('click', '#offer_contigency', function(){
        if($(this).is(':checked') === true){
            $('#explain_financing_section').show();
        }else{
            $('#explain_financing_section').hide();
        }
    });
    offer_doc_params = {
        url: '/save-best-offer-document/',
        field_name: 'best_offer_document',
        file_accepted: '.jpg, .jpeg, .pdf, .doc, .docx',
        element: 'bestOfferDocFrm',
        upload_multiple: true,
        max_files: 10,
        call_function: set_offer_document_details,
        default_message: '<i class="fa fa-upload" aria-hidden="true"></i> Upload Photos',
        set_max_limit: false,
    }

    try{
        initdrozone(offer_doc_params);
    }catch(ex){
       // console.log(ex);
    }

    $('#best_offer_frm').validate({
          errorElement: 'p',
          ignore: [],
          errorPlacement: function(error, element) {
            var radio_arr = ['trad_user_type', 'working_with_agent', 'property_in_person', 'buyer_pre_qualified', 'agent_property_in_person', 'agent_pre_qualified', 'offer_contingent', 'sale_contingency', 'appraisal_contingent', 'working_with_buyer'];

            if(element.hasClass('select')){
                error.insertAfter(element.next('.chosen-container'));
            }else if(element.attr('id') == 'offer_contigency'){
                //error.insertAfter(element.next('label'));
            }else if(element.attr('id') == 'terms'){
                //error.insertAfter(element.next('label'));
            }else if(element.attr('id') == 'offer_doc_id'){
                error.insertAfter(element.closest('.upload-fav'));
            }else if(jQuery.inArray(element.attr('name'), radio_arr) !== -1){
                error.insertAfter(element.closest('.lh45'));
            }else if(element.attr('name') == 'closing_cost'){
                error.insertAfter(element.parent().siblings().find('label[for="closing_cost_thrd"]'));
            }else{
                error.insertAfter(element);
            }
          },
          highlight: function(element, errorClass) {
            var $el = $(element);
            if ($el.is(':checkbox')) {
                $el.next().addClass('checkbox_error').addClass('error');
            } else {
                    /* add code for default*/
            }

         },
         unhighlight: function(element, errorClass) {
            var $el = $(element);
            if ($el.is(':checkbox')) {
                $el.next().removeClass('checkbox_error').removeClass('error');
            }

         },
         invalidHandler: function(e,validator) {
            //console.log(validator.errorList);
            /*$('.panel-default').find('.panel-title a').addClass('collapsed');
            $('.panel-collapse').addClass('collapse').removeClass('in');
            $(validator.errorList[0].element).closest('.panel-default').find('.panel-title a').removeClass('collapsed');

            $(validator.errorList[0].element).closest('.panel-collapse.collapse').collapse('show');*/

         }
      });

      x = setInterval(function() {
        // Get today's date and time
      var now = new Date().getTime();
      // Find the distance between now and the count down date
      var distance = countDownDate - now;

      if(isNaN(distance) || distance < 0){
        distance = countDownEndDate - now;
        $('#offer_timer_text').html('Highest and Best Offer Ends in');
      }else{
        $('#offer_timer_text').html('Highest and Best Offer Starts in');
      }
      if(isNaN(distance) || distance < 0){
        $('.day_remaining').html('00');
        $('.hr_remaining').html('00');
        $('.min_remaining').html('00');
        $('.sec_remaining').html('00');
        $('.best_offer_timer').show();

      }else{

        // Time calculations for days, hours, minutes and seconds
          var days = Math.floor(distance / (1000 * 60 * 60 * 24));
          var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          var seconds = Math.floor((distance % (1000 * 60)) / 1000);
          if(parseInt(days) < 10){
            days = '0'+days.toString();
          }
          if(parseInt(hours) < 10){
            hours = '0'+hours.toString();
          }
          if(parseInt(minutes) < 10){
            minutes = '0'+minutes.toString();
          }
          if(parseInt(seconds) < 10){
            seconds = '0'+seconds.toString();
          }
            $('.day_remaining').html(days);
            $('.hr_remaining').html(hours);
            $('.min_remaining').html(minutes);
            $('.sec_remaining').html(seconds);

          // If the count down is over, write some text
          if (parseInt(distance) < 0 ) {
            clearInterval(x);

            $('.day_remaining').html('00');
            $('.hr_remaining').html('00');
            $('.min_remaining').html('00');
            $('.sec_remaining').html('00');
            $('.best_offer_timer').show();
          }else{
            $('.best_offer_timer').show();
          }
      }
    }, 1000);
    $(document).on('click', '#edit_user_offer', function(){
        $('#offer_price').removeProp('readonly').val('$');
        $(this).hide();
    });
    $(document).on('click', '#edit_earnest_deposit', function(){
        $('#earnest_deposit').removeProp('readonly').val('$');
        $(this).hide();
    });
    $(document).on('click', '#edit_down_payment', function(){
        $('#down_payment').removeProp('readonly').val('$');
        $(this).hide();
    });
    $(document).on('click', '.confirm_offer_document_delete', function(){
        var data_count = '';
        var data_article_id = '';
        var agent_id = '';
        var user_id = '';
        var section = $(this).attr('data-image-section');
        var image_id = $(this).attr('data-image-id');
        var image_name = $(this).attr('data-image-name');
        $('#confirmOfferDocDeleteModal #popup_section').val(section);
        $('#confirmOfferDocDeleteModal #popup_image_id').val(image_id);
        $('#confirmOfferDocDeleteModal #popup_image_name').val(image_name);
        $('#confirmOfferDocDeleteModal').modal('show');
    });
    $(document).on('click', '#del_offer_doc_false', function(){
        $('#confirmOfferDocDeleteModal #popup_section').val('');
        $('#confirmOfferDocDeleteModal #popup_image_id').val('');
        $('#confirmOfferDocDeleteModal #popup_image_name').val('');
        $('#confirmOfferDocDeleteModal').modal('hide');
        $('body').addClass('modal-open');
    });
    $(document).on('click', '#del_offer_doc_true', function(){
        var section= $('#confirmOfferDocDeleteModal #popup_section').val();
        var id = $('#confirmOfferDocDeleteModal #popup_image_id').val();
        var name = $('#confirmOfferDocDeleteModal #popup_image_name').val();
        del_params = {
            section: section,
            id: id,
            name: name,
        }
        delete_offer_document(del_params);
        $('#confirmOfferDocDeleteModal').modal('hide');

    });
    $(document).on('click','input[name="trad_user_type"]', function(){
        var selected_user_type = parseInt($(this).val());
        $('.working_with_agent_no_section').hide();
        $('input[name="working_with_agent"]').prop('checked',false);
        $('input[name="agent_property_in_person"]').prop('checked',false);
        $('input[name="agent_pre_qualified"]').prop('checked',false);
        $('input[name="property_in_person"]').prop('checked',false);
        $('input[name="buyer_pre_qualified"]').prop('checked',false);
        if(selected_user_type == 2){
            $('.agent_question_section').hide();
            $('.buyer_question').show();
            //$('label[for="offer_comment"]').html('Feel free to include any additional comments, questions and any financial documents you may have for the listing agent to review below.');
            $('#offer_question').html('What would you like to offer?');
        }else{
            /*$('.buyer_question').hide();
            $('.agent_question_section').show();
            $('#offer_question').html('What would your client like you to offer on their behalf?');*/
            $('.buyer_question').hide();
            $.ajax({
                url: '/check-agent-user/',
                type: 'post',
                dataType: 'json',
                cache: false,
                beforeSend: function () {
                    /*$(':submit').attr('disabled', 'disabled');
                    $.blockUI({
                        message: '<h4>Please wait!</h4>'
                    });*/
                },
                complete: function () {
                    /*$.unblockUI();
                    $(':submit').removeAttr('disabled');*/
                },
                success: function(response){
                    if(response.data.error == 0){
                        $('.buyer_question').hide();
                        $('.agent_question_section').show();
                        //$('label[for="offer_comment"]').html('Feel free to include any additional comments, questions, and please upload your clients’ written offer for the listing agent to review');
                        $('#offer_question').html('What would your client like you to offer on their behalf?');
                    }else{
                        /*$('input[name="trad_user_type"]').prop('checked', false);
                        $('#offerSubmitModal .modal-title').html('Attention');
                        $('#offerSubmitModal #submit_back_listing').html('Close');
                        $('#offerSubmitModal #submit_msg_content').html('Our records indicate that you are not a licensed real estate agent. Please check your account to make sure that you have signed up as an agent correctly or contact our real estate company if you find this to be an error.');*/
                        $('input[name="trad_user_type"]').prop('checked', false);
                        $('.buyer_question').hide();
                        $('.agent_question_section').hide();
                        $('#notAgentModal').modal('show');
                    }
                 }
            });
        }
      });
      $(document).on('click', 'input[name="working_with_agent"]', function(){
        var working_with_agent = parseInt($(this).val());
        var selected_user_type = parseInt($('#trad_user_type').val());
        $('.working_with_agent_no_section').hide();
        if(selected_user_type == 2){
            if(working_with_agent == 0){
                $('#property_in_person-error').remove();
                $('#buyer_pre_qualified-error').remove();
                $('input[name="property_in_person"]').prop('checked', false);
                $('input[name="buyer_pre_qualified"]').prop('checked', false);
                $('.working_with_agent_no_section').show();
            }else{

                $('.working_with_agent_no_section').hide();
                $('#confirmWorkingAgentModal').modal({
                  backdrop: 'static',
                  keyboard: false,
                  show: true
                });
            }
        }else{
            $('.working_with_agent_no_section').hide();
        }

      });
      $(document).on('click', 'input[name="working_with_buyer"]', function(){
        var working_with_buyer = parseInt($(this).val());
        var selected_user_type = parseInt($('#trad_user_type').val());

        if(selected_user_type == 4){

            if(working_with_buyer == 1){
                $('#agent_buyer_info').show();
            }else{
                $('#agent_buyer_info').hide();
                $('#agent_buyer_first_name').val('');
                $('#agent_buyer_last_name').val('');
                $('#agent_buyer_phone_no').val('');
                $('#agent_buyer_user_email').val('');
                $('#agent_buyer_company').val('');
                $('#agent_buyer_first_name-error').remove();
                $('#agent_buyer_last_name-error').remove();
                $('#agent_buyer_phone_no-error').remove();
                $('#agent_buyer_user_email-error').remove();
                $('#agent_buyer_company-error').remove();
            }
        }else{

            $('#agent_buyer_info').hide();
            $('#agent_buyer_first_name').val('');
            $('#agent_buyer_last_name').val('');
            $('#agent_buyer_phone_no').val('');
            $('#agent_buyer_user_email').val('');
            $('#agent_buyer_company').val('');
            $('#agent_buyer_first_name-error').remove();
            $('#agent_buyer_last_name-error').remove();
            $('#agent_buyer_phone_no-error').remove();
            $('#agent_buyer_user_email-error').remove();
            $('#agent_buyer_company-error').remove();
        }
      });
      //$('#traditionalOfferModal').modal('show');
      $(document).on('click', '#confirm_working_agent_true', function(){
        $('#confirmWorkingAgentModal').modal('hide');
        //here may be need to redirect to asset details if requirment shared
        $('input[name="working_with_agent"]').prop('checked', false);
        window.location.href = '/asset-details/?property_id='+$('#best_offer_frm #property_id').val();
      });
      $(document).on('click', '#confirm_working_agent_false', function(){
        $('input[name="working_with_agent"]').prop('checked', false);
        $('#confirmWorkingAgentModal').modal({
          backdrop: false,
          keyboard: true,
          show: false
        });
        $('#confirmWorkingAgentModal').modal('hide');
      });
      $(document).on('click', '#back_to_offer,#back_to_offer_top', function(){
        $('input[name="trad_user_type"]').prop('checked', false);
        $('#notAgentModal').modal('hide');
        window.location.href = '/asset-details/?property_id='+$('#best_offer_frm #property_id').val();
      });
});

function set_offer_document_details(response){
    var image_name = '';
    var upload_id = '';
    var actual_image = '';
    var actual_id = '';
    var property_doc_id = $('#offer_doc_id').val();
    var property_doc_name = $('#offer_doc_name').val();
    var property_id = $('#property_id').val();
    if(response.status == 200){
        $('#custom_doc_error').hide();
        $('#offer_doc_id-error').hide();
        //$('#bidderRegFrm #offer_doc_id-error').hide();
        if(response.uploaded_file_list){
            var all_banner_images = '';
            var count = parseInt($('#bestOfferDocList li').length);
            $.each(response.uploaded_file_list, function(i, item) {
                count = count+1;
                if(i==0){
                    if(item.file_name != ""){
                        image_name = item.file_name;
                        upload_id = item.upload_id.toString();
                    }
                }else{
                    if(item.file_name != ""){
                        image_name = image_name+','+item.file_name;
                        upload_id = upload_id+','+item.upload_id;
                    }
                }
                if(item.file_name != ""){
                    var img_src = aws_url+"best_and_final_offer/"+item.file_name;
                }
                if(item.upload_date){
                    try{
                        var upload_date = new Date(item.upload_date);
                        var month = upload_date.toLocaleString('default', { month: 'short' });
                        var year = upload_date.getFullYear();
                        var date = upload_date.getDate();

                        var dt = (upload_date.getDate() < 10)?'0'+upload_date.getDate():upload_date.getDate();
                        var hrs = (upload_date.getHours() < 10)?'0'+upload_date.getHours():upload_date.getHours();
                        var mins = (upload_date.getMinutes() < 10)?'0'+upload_date.getMinutes():upload_date.getMinutes();
                        var secs = (upload_date.getSeconds() < 10)?'0'+upload_date.getSeconds():upload_date.getSeconds();
                        var timeStp = '';
                        var mer = (parseInt(hrs) >= 12)?'p.m':'a.m';
                        hrs = parseInt(hrs) % 12;
                        hrs = (hrs)?hrs:12;
                        //timeStp = month +"-"+dt+"-"+year+" at "+hrs+":"+mins+" "+mer;
                        timeStp = month +" "+dt+", "+year+" "+hrs+":"+mins+""+mer;

                    }catch(ex){
                        //console.log(ex);
                        var timeStp = '';
                    }
                }

                //$('#bidderDocList').append('<li rel_id="'+item.upload_id+'" rel_position="'+count+'"><figure><a href="javascript:void(0)" data-article-id="'+property_id+'" data-image-id="'+item.upload_id+'" data-image-name="'+item.file_name+'" data-image-section="'+item.upload_to+'"  class="close-btn confirm_image_delete"><i class="fas fa-times"></i></a><img src="/static/admin/images/pdf.png" alt=""></figure><figcaption><h6>'+item.file_name+'</h6><p>File Size: '+item.file_size+'<br>Uploaded: '+timeStp+'</p><div class="move"><i class="fas fa-expand-arrows-alt"></i> Move</div></figcaption></li>');
                ext = '';
                if(item.file_name.indexOf('.pdf') > 0){
                    //icon = '/static/admin/images/pdf.png';
                    icon = "<i class='fas fa-file-pdf'></i>";
                    ext = '.pdf';
                } else if(item.file_name.indexOf('.docx') > 0){
                    //icon = '/static/admin/images/docs.png';
                    icon = "<i class='far fa-file-alt'></i>";
                    ext = '.docx';
                }else if(item.file_name.indexOf('.doc') > 0){
                    icon = "<i class='fas fa-file-word'></i>";
                    ext = '.doc';
                }else{
                    icon = '<i class="fas fa-file-image"></i>';
                    ext = 'jpeg';
                }
                if(item.file_name.length > 40){
                    item_filename = item.file_name.slice(0, 40) + (item.file_name.length > 40 ? ".._" : "") + ext;
                } else {
                    item_filename = item.file_name;
                }
                if(item_filename){
                    file_name_arr = item_filename.split('_');
                    if(file_name_arr){
                        var doc_name_length = file_name_arr.length;
                        var original_doc_name = ''
                        for(i=0;i < doc_name_length;i++){
                            if(i > 0){
                                original_doc_name = original_doc_name + '_' + file_name_arr[i];
                            }

                        }
                        original_doc_name = original_doc_name.substring(1);
                    }
                }
                //$('#bestOfferDocList').append('<li rel_id="'+item.upload_id+'" rel_position="'+count+'"><figure>'+icon+'</figure><figcaption><a href="javascript:void(0)" data-article-id="'+property_id+'" data-image-id="'+item.upload_id+'" data-image-name="'+item.file_name+'" data-image-section="'+item.upload_to+'"  class="close-btn confirm_image_delete"><i class="fas fa-times"></i></a><h6>'+item_filename+'</h6><p>File Size: '+item.file_size+'<br>Uploaded: '+timeStp+'</p></figcaption></li>');
                $('#bestOfferDocList').append('<li rel_id="'+item.upload_id+'" rel_position="'+count+'"><figure>'+icon+'</figure><figcaption><h6>'+original_doc_name+'</h6><p>File Size: '+item.file_size+'<br>Uploaded: '+timeStp+'</p><div class="actions-btn"><div class="badge-success"><i class="fas fa-check-circle"></i></div><a href="javascript:void(0)" data-article-id="'+property_id+'" data-image-id="'+item.upload_id+'" data-image-name="'+item.file_name+'" data-image-section="'+item.upload_to+'"  class="close-btn confirm_offer_document_delete"><i class="fas fa-times"></i></a></div></figcaption></li>');
            });
            image_name = image_name+','+property_doc_name;
            upload_id = upload_id+','+property_doc_id;
            actual_image = image_name.replace(/(^,)|(,$)/g, "");
            actual_id = upload_id.replace(/(^,)|(,$)/g, "");
            $('#offer_doc_name').val(actual_image);
            $('#offer_doc_id').val(actual_id);
            $('#bestOfferDocDiv').show();
            //reindex_prop_doc_list();
        }
    }
}
function validate_best_offer_form(data){
    $('#offer_doc_id').rules("add",
    {
        required: false
    });
    $('#earnest_deposit').rules("add",
    {
        required: false,
        thousandsepratornum: false,
        checkMinValue: false,
    });
    $('#due_diligence').rules("add",
    {
        required: false
    });
    $('#closing_period').rules("add",
    {
        required: false
    });
    $('#offer_price').rules("add",
    {
        required: false
    });
    $('#financing').rules("add",
    {
        required: false
    });
    $('#terms').rules("add",
    {
        required: false
    });

    if(data.first_name){
        $('#first_name').rules("add",
        {
            required: true,
            acceptcharacters: true,
            noSpace:true,
            maxlength:40,
            messages: {
                required: "First name is required.",

            }
        });
    }else{
        $('#first_name').rules("add",
        {
            required: false,
            acceptcharacters: false,
            noSpace:false,
        });
    }
    if(data.last_name){
        $('#last_name').rules("add",
        {
            required: true,
            acceptcharacters: true,
            noSpace:true,
            maxlength:40,
            messages: {
                required: "Last name is required.",

            }
        });
    }else{
        $('#last_name').rules("add",
        {
            required: false,
            acceptcharacters: false,
            noSpace:false,
        });
    }
    if(data.user_phone_no){
        $('#user_phone_no').rules("add",
        {
            required: true,
            phoneminlength: 10,
            phonemaxlength: 10,
            messages: {
                required: "Phone no is required.",
                phoneminlength: "Please enter valid phone no",
                phonemaxlength: "Please enter valid phone no"
            }
        });
    }else{
        $('#user_phone_no').rules("add",
        {
            required: false
        });
    }
    if(data.user_email){
        $('#user_email').rules("add",
        {
            required: true,
            email: true,
            messages: {
                required: "Email is required.",
                email: "Please enter valid email"
            }
        });
    }else{
        $('#user_email').rules("add",
        {
            required: false
        });
    }
    if(data.address_1){
        $('#address_1').rules("add",
        {
            required: true,
            messages: {
                required: "Address is required"
            }
        });
    }else{
        $('#address_1').rules("add",
        {
            required: false
        });
    }

    if(data.city){
        $('#city').rules("add",
        {
            required: true,
            messages: {
                required: "City is required"
            }
        });
    }else{
        $('#city').rules("add",
        {
            required: false
        });
    }
    if(data.country){
        $('#country').rules("add",
        {
            required: true,
            messages: {
                required: "Country is required"
            }
        });
    }else{
        $('#country').rules("add",
        {
            required: false
        });
    }
    if(data.state){
        $('#state').rules("add",
        {
            required: true,
            messages: {
                required: "State is required"
            }
        });
    }else{
        $('#state').rules("add",
        {
            required: false
        });
    }
    if(data.zip_code){
        $('#zip_code').rules("add",
        {
            required: true,
            //minlength: 5,
            maxlength: 6,
            messages: {
                required: "Zip Code is required",
                //minlength: "Please enter at least 5 char",
                maxlength: "Please enter at most 6 char"
            }
        });
    }else{
        $('#zip_code').rules("add",
        {
            required: false
        });
    }
    if(data.trad_user_type){
        $('input[name="trad_user_type"]').rules("add",
        {
            required: true,
            messages: {
                required: "This field is required",
            }
        });
    }else{
        $('input[name="trad_user_type"]').rules("add",
        {
            required: false
        });
    }
    if(data.working_with_agent){
        $('input[name="working_with_agent"]').rules("add",
        {
            required: true,
            messages: {
                required: "This field is required",
            }
        });
    }else{
        $('input[name="working_with_agent"]').rules("add",
        {
            required: false
        });
    }
    if(data.property_in_person){
        $('input[name="property_in_person"]').rules("add",
        {
            required: true,
            messages: {
                required: "This field is required",
            }
        });
    }else{
        $('input[name="property_in_person"]').rules("add",
        {
            required: false
        });
    }
    if(data.buyer_pre_qualified){
        $('input[name="buyer_pre_qualified"]').rules("add",
        {
            required: true,
            messages: {
                required: "This field is required",
            }
        });
    }else{
        $('input[name="buyer_pre_qualified"]').rules("add",
        {
            required: false
        });
    }
    if(data.agent_property_in_person){
        $('input[name="agent_property_in_person"]').rules("add",
        {
            required: true,
            messages: {
                required: "This field is required",
            }
        });
    }else{
        $('input[name="agent_property_in_person"]').rules("add",
        {
            required: false
        });
    }
    if(data.agent_pre_qualified){
        $('input[name="agent_pre_qualified"]').rules("add",
        {
            required: true,
            messages: {
                required: "This field is required",
            }
        });
    }else{
        $('input[name="agent_pre_qualified"]').rules("add",
        {
            required: false
        });
    }
    if(data.working_with_buyer){
        $('input[name="working_with_buyer"]').rules("add",
        {
            required: true,
            messages: {
                required: "This field is required",
            }
        });
    }else{
        $('input[name="working_with_buyer"]').rules("add",
        {
            required: false
        });
    }

    // in case when agent submitting on behalf of buyer
    if(data.agent_buyer_first_name){
        $('#agent_buyer_first_name').rules("add",
        {
            required: true,
            acceptcharacters: true,
            noSpace:true,
            maxlength:40,
            messages: {
                required: "First name is required.",

            }
        });
    }else{
        $('#agent_buyer_first_name').rules("add",
        {
            required: false,
            acceptcharacters: false,
            noSpace:false,
        });
    }
    if(data.agent_buyer_last_name){
        $('#agent_buyer_last_name').rules("add",
        {
            required: true,
            acceptcharacters: true,
            noSpace:true,
            maxlength:40,
            messages: {
                required: "Last name is required.",

            }
        });
    }else{
        $('#agent_buyer_last_name').rules("add",
        {
            required: false,
            acceptcharacters: false,
            noSpace:false,
        });
    }
    if(data.agent_buyer_phone_no){
        $('#agent_buyer_phone_no').rules("add",
        {
            required: true,
            phoneminlength: 10,
            phonemaxlength: 10,
            messages: {
                required: "Phone no is required.",
                phoneminlength: "Please enter valid phone no",
                phonemaxlength: "Please enter valid phone no"
            }
        });
    }else{
        $('#agent_buyer_phone_no').rules("add",
        {
            required: false
        });
    }
    if(data.agent_buyer_user_email){
        $('#agent_buyer_user_email').rules("add",
        {
            required: true,
            email: true,
            messages: {
                required: "Email is required.",
                email: "Please enter valid email"
            }
        });
    }else{
        $('#agent_buyer_user_email').rules("add",
        {
            required: false
        });
    }
    //step 2 validation
    /*if(data.is_submit_proof_fund){
        $('input[name="is_submit_proof_fund"]').rules("add",
        {
            required: true,
            messages: {
                required: "This field is required",
            }
        });
    }else{
        $('#is_submit_proof_fund').rules("add",
        {
            required: false
        });
    }*/
    if(data.offer_doc_id){
        $('#offer_doc_id').rules("add",
        {
            required: true,
            messages: {
                required: "Document is required"
            }
        });
    }else{
        $('#offer_doc_id').rules("add",
        {
            required: false
        });
    }
    //step 3 validatiion
    if(data.offer_price){
        $('#offer_price').rules("add",
        {
            required: true,
            thousandsepratornum: true,
            minvalue: 1,
            messages: {
                required: "Price is required.",
                thousandsepratornum: "Please enter valid Price.",

            }
        });
    }else{
        $('#offer_price').rules("add",
        {
            required: false,
            thousandsepratornum: false,
            minvalue: false
        });
    }
    if(data.phone_no){
        $('#phone_no').rules("add",
        {
            required: true,
            phoneminlength: 10,
            phonemaxlength: 10,
            messages: {
                required: "Phone no is required.",
                phoneminlength: "Please enter valid phone no",
                phonemaxlength: "Please enter valid phone no"
            }
        });
    }else{
        $('#phone_no').rules("add",
        {
            required: false,
        });
    }
    if(data.earnest_deposit){
        $('#earnest_deposit').rules("add",
        {
            required: true,
            thousandsepratornum: true,
            /*validPercent: function(){
                if (parseInt($('#earnest_deposit_type').val()) == 2) {
                    return true;
                } else {
                    return false;
                }
            },*/
            messages: {
                required: "Earnest Money Deposit is required.",
                thousandsepratornum: "Please enter valid Amount.",
                //checkMinValue: "Please enter a value greater than or equal to "+$('#pre_earnest_deposit').val(),

            }
        });
    }else{
        $('#earnest_deposit').rules("add",
        {
            required: false,
            thousandsepratornum: false,
            //checkMinValue: false,

        });
    }
    if(data.due_diligence){
        $('#due_diligence').rules("add",
        {
            required: true,
            messages: {
                required: "Inspection Contingency is required."
            }
        });
    }else{
        $('#due_diligence').rules("add",
        {
            required: false
        });
    }
    if(data.closing_period){
        $('#closing_period').rules("add",
        {
            required: true,
            messages: {
                required: "Closing Date is required."
            }
        });
    }else{
        $('#closing_period').rules("add",
        {
            required: false
        });
    }
    if(data.financing){
        $('#financing').rules("add",
        {
            required: true,
            messages: {
                required: "This field is required"
            }
        });
    }else{
        $('#financing').rules("add",
        {
            required: false
        });
    }
    if(data.offer_contingent){
        $('input[name="offer_contingent"]').rules("add",
        {
            required: true,
            messages: {
                required: "This field is required",
            }
        });
    }else{
        $('input[name="offer_contingent"]').rules("add",
        {
            required: false
        });
    }
    if(data.sale_contingency){
        $('input[name="sale_contingency"]').rules("add",
        {
            required: true,
            messages: {
                required: "This field is required",
            }
        });
    }else{
        $('input[name="sale_contingency"]').rules("add",
        {
            required: false
        });
    }
    if(data.sale_contingency){
        $('input[name="appraisal_contingent"]').rules("add",
        {
            required: true,
            messages: {
                required: "This field is required",
            }
        });
    }else{
        $('input[name="appraisal_contingent"]').rules("add",
        {
            required: false
        });
    }
    if(data.sale_contingency){
        $('input[name="closing_cost"]').rules("add",
        {
            required: true,
            messages: {
                required: "This field is required",
            }
        });
    }else{
        $('input[name="closing_cost"]').rules("add",
        {
            required: false
        });
    }

    //step 5 validation
    if(data.terms){
        $('#terms').rules("add",
        {
            required: true,
            messages: {
                required: "This field is required"
            }
        });
    }else{
        $('#terms').rules("add",
        {
            required: false
        });
    }

}
function set_offer_address_by_zipcode(response){
    var city = '';
    try{
        var zip_state_iso_code = response.state.toLowerCase();
    }catch(ex){
        //console.log(ex);
        var zip_state_iso_code = '';
    }

    $('#best_offer_frm #state > option').each(function() {
        try{
            var state_iso_code = $(this).attr('data-short-code').toLowerCase();
        }catch(ex){
            //console.log(ex);
            var state_iso_code = '';
        }
        if(state_iso_code == zip_state_iso_code){
           $(this).prop('selected',true);
        }
    });
    $('#best_offer_frm #state').trigger("chosen:updated");
    if(response.city){
        city = response.city;
    }
    $('#best_offer_frm #city').val(city);
    try{
        $('#best_offer_frm #city-error').hide();
    }catch(ex){
        //console.log(ex);
    }
    try{
        $('#best_offer_frm #state-error').hide();
    }catch(ex){
        //console.log(ex);
    }
}
function delete_offer_document(params){
   var image_id = '';
   var image_name = '';
   var new_ids = '';
   var new_names = '';

   var section = params.section;
   var id = params.id;
   var name = params.name;


    image_id = $('#offer_doc_id').val();
    image_name = $('#offer_doc_name').val();
    new_ids = remove_string(image_id,id,',');
    new_names = remove_string(image_name,name,',');
    $('li[rel_id="'+id+'"]').remove();
    $('#offer_doc_id').val(new_ids);
    $('#offer_doc_name').val(new_names);
    if($('#offer_doc_id').val() == ''){
        $('#bestOfferDocDiv').hide();
    }
    $('#bestOfferDocFrm.dropzone').removeClass('dz-max-files-reached');
   data = {'upload_id': id, 'doc_name': name, 'section': section}
    if(name && section && id){
        $.ajax({
            url: '/delete-best-offer-document/',
            type: 'post',
            dataType: 'json',
            async: false,
            cache: false,
            data: data,
            beforeSend: function(){

            },
            success: function(response){
                if(response.error == 0){
                    $('#confirmOfferDocDeleteModal #popup_section').val('');
                    $('#confirmOfferDocDeleteModal #popup_image_id').val('');
                    $('#confirmOfferDocDeleteModal #popup_image_name').val('');
                    $.growl.notice({title: 'Document', message: 'Deleted successfully', size: 'large'});


                }else{
                    window.setTimeout(function () {
                        $.growl.error({title: 'Document', message: 'Some error occurs, please try again', size: 'large'});
                    }, 2000);
                }
            }
        });
    }

}
function submit_loi_form(step){
    $('#current_step').val(step);
    $.ajax({
      url: '/submit-best-offer/',
      type: 'post',
      dataType: 'json',
      cache: false,
      data: $('#best_offer_frm').serialize(),
      beforeSend: function(){
        $('.overlay').show();
      },
      success: function(response){
          $('.overlay').hide();
          if(response.error == 0){
                var current_step = parseInt($('#current_step').val())+1;
                $('#current_step').val(current_step);
                $('#earnest_deposit').removeAttr('max maxlength');
                if(current_step == 2){
                    var earnest_deposit_type = $('#earnest_deposit_type').val();
                    if(parseInt(earnest_deposit_type) == 2){
                        $('#earnest_deposit').attr({max: 100, maxlength: 6});
                    }else{
                        $('#earnest_deposit').removeAttr('max');
                        $('#earnest_deposit').attr({maxlength: 14});

                    }
                    var is_current_offer = $('#is_current_offer').val();
                    var highest_best_format = $('#highest_best_format').val();
                    $('#non_binding_offer_details').hide();
                    /*$('#current_price_detail').show();
                    if(parseInt(is_current_offer) == 1){
                        $('#user_best_offer_heading').html('Current Highest and Best Offer').show();
                        $('#current_highest_offer_detail').show();
                    }else{
                        $('#user_best_offer_heading').hide();
                        $('#current_highest_offer_detail').hide();
                    }*/
                    if(parseInt(highest_best_format) == 3){
                        $('#current_private_offer_detail').hide();
                        $('#current_price_detail').show();
                        if(parseInt(is_current_offer) == 1){
                            $('#user_best_offer_heading').html('Current Highest and Best Offer').show();
                            $('#current_highest_offer_detail').show();
                        }else{
                            $('#user_best_offer_heading').hide();
                            $('#current_highest_offer_detail').hide();
                        }
                    }else{
                        $('#current_price_detail').hide();
                        $('#user_best_offer_heading').hide();
                        $('#current_highest_offer_detail').hide();
                        $('.current_private_offer_section_step2').show();
                        $('#current_private_offer_detail').show();
                    }

                    $('.steps').hide();
                    $('.step').removeClass('current complete');
                    $('#step_2').addClass('current');
                    $('#step_2').addClass('can_navigate');
                    $('#step_1,#step_2').addClass('complete');
                    $('#steps-2').show();
                }else if(current_step == 3){

                    var due_diligence_text = '-';
                    var closing_period_text = '-';
                    var offer_price = $('#offer_price').val();
                    var due_diligence = $('#due_diligence').val();
                    var closing_period = $('#closing_period').val();
                    var earnest_deposit = $('#earnest_deposit').val();
                    var earnest_deposit_type = $('#earnest_deposit_type').val();
                    var user_offer_price = offer_price.replace('$','').replace(/,/g, '');
                    /* new fields added on */
                    var down_payment = $('#down_payment').val();
                    var loan_type = $('option:selected','#financing').text();
                    var offer_contingent = $('input[name="offer_contingent"]:checked').val();
                    var appraisal_contingent = $('input[name="appraisal_contingent"]:checked').val();
                    var sale_contingency = $('input[name="sale_contingency"]:checked').val();
                    var closing_cost = $('input[name="closing_cost"]:checked').val();
                    var offer_contigent_text = 'NA';
                    var appraisal_contingent_text = 'NA';
                    var sale_contingency_text = 'NA';
                    var closing_cost_text = 'NA';
                    var down_payment_text = 'NA';
                    /* new fields added on end */
                    var earnest_money_deposit = 'NA';
                    var earnest_money_deposit_percent = 'NA';
                    var earnest_money_deposit_text = 'NA';
                    /* new fields added on */
                    if(parseInt(offer_contingent) == 1){
                        offer_contigent_text = 'Yes';
                    }else if(parseInt(offer_contingent) == 2){
                        offer_contigent_text = 'No';
                    }else if(parseInt(offer_contingent) == 3){
                        offer_contigent_text = 'Cash Buyer';
                    }else{
                        offer_contigent_text = 'NA';
                    }
                    if(parseInt(appraisal_contingent) == 1){
                        appraisal_contingent_text = 'Yes';
                    }else if(parseInt(appraisal_contingent) == 0){
                        appraisal_contingent_text = 'No';
                    }else{
                        appraisal_contingent_text = 'NA';
                    }
                    if(parseInt(sale_contingency) == 1){
                        sale_contingency_text = 'Yes';
                    }else if(parseInt(sale_contingency) == 0){
                        sale_contingency_text = 'No';
                    }else{
                        sale_contingency_text = 'NA';
                    }
                    if(parseInt(closing_cost) == 1){
                        closing_cost_text = 'Buyer agrees to pay for all loan-related closing costs and half of the transaction closing costs.';
                    }else if(parseInt(closing_cost) == 2){
                        closing_cost_text = 'Buyer agrees to pay for all loan-related closing costs and all of the transaction closing costs.';
                    }else if(parseInt(closing_cost) == 3){
                        closing_cost_text = 'Seller to pay for all loan-related closing costs and all of the transaction closing costs.';
                    }else{
                        closing_cost_text = 'NA';
                    }
                    if(down_payment != "" && down_payment != "$"){
                        $('#best_down_payment').html(down_payment);
                        $('#current_private_down_payment').html(down_payment);
                    }else{
                        $('#best_down_payment').html('NA');
                        $('#current_private_down_payment').html('NA');
                    }


                    if(loan_type != ""){
                        $('#best_loan_type').html(loan_type);
                        $('#current_private_loan_type').html(loan_type);
                    }else{
                        $('#best_loan_type').html('NA');
                        $('#current_private_loan_type').html('NA');
                    }

                    $('#best_offer_contigent').html(offer_contigent_text);
                    $('#current_private_offer_contingent').html(offer_contigent_text);
                    $('#best_appraisal_contigent').html(appraisal_contingent_text);
                    $('#current_private_appraisal_contingent').html(appraisal_contingent_text);
                    $('#best_sale_contigent').html(sale_contingency_text);
                    $('#current_private_sale_contingency').html(sale_contingency_text);
                    $('#best_closing_cost').html(closing_cost_text);
                    $('#current_private_closing_cost').html(closing_cost_text);
                    /* new fields added on end */
                    if(parseInt(earnest_deposit_type) == 1){

                        earnest_money_deposit = earnest_deposit.replace('$','').replace('%','').replace(/,/g, '');
                        earnest_money_deposit_percent = ((parseFloat(earnest_money_deposit)*100)/parseFloat(user_offer_price)).toFixed(2);
                        earnest_money_deposit_text = earnest_deposit+' or '+ earnest_money_deposit_percent+' %';
                    }else{
                        earnest_money_deposit_percent = earnest_deposit.replace('$','').replace('%','').replace(/,/g, '');
                        earnest_money_deposit = (parseFloat(user_offer_price)*parseFloat(earnest_money_deposit_percent))/parseFloat(100);
                        earnest_money_deposit = numberFormat(earnest_money_deposit);
                        earnest_money_deposit_text = '$'+earnest_money_deposit+' or '+ earnest_deposit+' %';
                    }
                    //alert($('#due_diligence').text());
                    if(parseInt(due_diligence) == 1){
                        due_diligence_text = 'Yes, complete inspections at buyer(s) expense.';
                    }else if(parseInt(due_diligence) == 2){
                        due_diligence_text = 'No, waive inspections.';
                    }else{
                        due_diligence_text = 'NA';
                    }
                    if(parseInt(closing_period) == 1){
                        closing_period_text = '1-30 Days';
                    }else if(parseInt(closing_period) == 2){
                        closing_period_text = '30-45 Days';
                    }else if(parseInt(closing_period) == 3){
                        closing_period_text = '45-60 Days';
                    }else if(parseInt(closing_period) == 4){
                        closing_period_text = '61+ Days';
                    }else{
                        closing_period_text = 'NA';
                    }

                    $('#best_asking_price').html(offer_price);
                    $('#best_earnest_deposit').html(earnest_money_deposit_text);
                    $('#best_due_diligence_section').html('Inspection Contingency: <span id="best_due_diligence">'+due_diligence_text+'</span>');
                    $('#current_private_inspection_contigency').html(due_diligence_text);
                    $('#best_closing_period').html(closing_period_text);
                    $('#current_private_closing_period').html(closing_period_text);

                    $('#user_best_offer_heading').html('Your Non-Binding Highest & Best Offer').show();
                    $('#current_price_detail').hide();
                    $('#current_highest_offer_detail').hide();
                    $('#current_private_offer_detail').hide();
                    $('#non_binding_offer_details').show();

                    $('.steps').hide();
                    $('.step').removeClass('current complete');
                    $('#step_3').addClass('current');
                    $('#step_3').addClass('can_navigate');
                    $('#step_1,#step_2,#step_3').addClass('complete');
                    $('#steps-3').show();
                }else if(current_step == 4){
                    $('#user_best_offer_heading').html('Your Non-Binding Highest & Best Offer').show();
                    $('#current_price_detail').hide();
                    $('#current_highest_offer_detail').hide();
                    $('#current_private_offer_detail').hide();
                    $('#non_binding_offer_details').show();



                    if($('#offer_price').val() == "" || ($('#offer_price').val() != "" && $('#offer_price').val() == "$")){
                        var offer_price = $('#pre_offer_price').val();
                    }else{
                        var offer_price = $('#offer_price').val();
                    }
                    var down_payment = $('#down_payment').val();
                    var due_diligence = $('#due_diligence').val();
                    var closing_period = $('option:selected','#closing_period').val();
                    var closing_cost =  $('input[name="closing_cost"]:checked').val();
                    var earnest_deposit = $('#earnest_deposit').val();
                    var earnest_deposit_type = $('#earnest_deposit_type').val();
                    var financing = $('option:selected','#financing').val();
                    var loan_type_text = $('option:selected','#financing').text();
                    var due_diligence_text = '';
                    var closing_period_text = '';
                    var offer_contingent_text = 'No';
                    var financing_text = 'No';
                    var appraisal_contingent_text = '';
                    var sale_contingency_text = '';
                    var closing_cost_text = '';
                    var earnest_money_deposit = '';
                    var earnest_money_deposit_percent = '';
                    var earnest_money_deposit_text = '';

                    offer_price = offer_price.toString().replace(/,/g, '').replace('$', '');
                    down_payment = down_payment.toString().replace(/,/g, '').replace('$', '');
                    var offer_price_words = convert_number_to_words(offer_price);
                    var down_payment_words = convert_number_to_words(down_payment);
                    offer_price_words = offer_price_words.toUpperCase();
                    down_payment_words = down_payment_words.toUpperCase();
                    due_diligence = due_diligence.toString().replace(/,/g, '');
                    closing_period = closing_period.toString().replace(/,/g, '');
                    //$('#offer_price_col').html('<strong>'+offer_price_words+'('+$('#offer_price').val()+')</strong>');

                    $('#offer_price_col').html($('#offer_price').val());
                    //$('#down_payment_col').html('<strong>'+down_payment_words+'('+$('#down_payment').val()+')</strong>');
                    $('#down_payment_col').html($('#down_payment').val());
                    $('#loan_type_col').html(loan_type_text);

                    /*if(parseInt(earnest_deposit_type) == 1){
                        earnest_deposit = earnest_deposit.toString().replace(/,/g, '').replace('$', '');
                        earnest_deposit_words = convert_number_to_words(earnest_deposit);
                        earnest_deposit_words = earnest_deposit_words.toUpperCase();
                        var earnest_html = '<strong>'+earnest_deposit_words+'('+$('#earnest_deposit').val()+')</strong> will be placed in escrow at the mutual execution of a Purchase and Sale Agreement. Following the expiration of the Due Diligence Period, the Deposit shall be non-refundable to Buyer.';

                    }else{
                        var earnest_html = '<strong>'+$('#earnest_deposit').val()+' %</strong> will be placed in escrow at the mutual execution of a Purchase and Sale Agreement. Following the expiration of the Due Diligence Period, the Deposit shall be non-refundable to Buyer.';
                    }*/
                    var str_offer_price = offer_price.toString().replace(/,/g, '').replace('$', '');
                    if(parseInt(earnest_deposit_type) == 1){

                        earnest_money_deposit = earnest_deposit.replace('$','').replace('%','').replace(/,/g, '');
                        earnest_money_deposit_percent = ((parseFloat(earnest_money_deposit)*100)/parseFloat(str_offer_price)).toFixed(2);
                        earnest_html = earnest_deposit+' or '+ earnest_money_deposit_percent+' %';
                    }else{
                        earnest_money_deposit_percent = earnest_deposit.replace('$','').replace('%','').replace(/,/g, '');
                        earnest_money_deposit = (parseFloat(str_offer_price)*parseFloat(earnest_money_deposit_percent))/parseFloat(100);
                        earnest_money_deposit = numberFormat(earnest_money_deposit);
                        earnest_html = '$'+earnest_money_deposit+' or '+ earnest_deposit+' %';
                    }
                    /*var due_diligence_words = convert_number_to_words(due_diligence);
                    due_diligence_words = due_diligence_words.toUpperCase();
                    var closing_period_words = convert_number_to_words(closing_period);
                    closing_period_words = closing_period_words.toUpperCase();*/

                    if(parseInt(due_diligence) == 1){
                        due_diligence_text = 'Yes, complete inspections at buyer(s) expense.';
                    }else if(parseInt(due_diligence) == 2){
                        due_diligence_text = 'No, waive inspections.';
                    }
                    if(parseInt(closing_period) == 1){
                        closing_period_text = '1-30 Days';
                    }else if(parseInt(closing_period) == 2){
                        closing_period_text = '30-45 Days';
                    }else if(parseInt(closing_period) == 3){
                        closing_period_text = '45-60 Days';
                    }else{
                        closing_period_text = '-';
                    }
                    if(parseInt(closing_cost) == 1){
                        closing_cost_text = 'Buyer agrees to pay for all loan-related closing costs and half of the transaction closing costs.';
                    }else if(parseInt(closing_cost) == 2){
                        closing_cost_text = 'Buyer agrees to pay for all loan-related closing costs and all of the transaction closing costs.';
                    }else if(parseInt(closing_cost) == 3){
                        closing_cost_text = 'Seller to pay for all loan-related closing costs and all of the transaction closing costs.';
                    }else{
                        closing_cost_text = '-';
                    }
                    var offer_contingent = $('input[name="offer_contingent"]:checked').val();
                    var working_with_buyer = $('input[name="working_with_buyer"]:checked').val();
                    var appraisal_contingent = $('input[name="appraisal_contingent"]:checked').val();
                    var sale_contingency = $('input[name="sale_contingency"]:checked').val();
                    if(parseInt(offer_contingent) == 1){
                        offer_contingent_text = 'Yes';
                    }else if(parseInt(offer_contingent) == 2){
                        offer_contingent_text = 'No';
                    }else if(parseInt(offer_contingent) == 3){
                        offer_contingent_text = 'Cash Buyer';
                    }
                    if(parseInt(appraisal_contingent) == 1){
                        appraisal_contingent_text = 'Yes';
                    }else{
                        appraisal_contingent_text = 'No';
                    }
                    if(parseInt(sale_contingency) == 1){
                        sale_contingency_text = 'Yes';
                    }else{
                        sale_contingency_text = 'No';
                    }
                    if(parseInt(financing) == 6){
                        financing_text = 'Yes';
                    }

                    $('#earnest_deposit_col').html(earnest_html);
                    //$('#due_diligence_col').html('The Buyer shall have <strong>'+due_diligence_text+'</strong> beginning at the effective date of the PSA to inspect and perform Due Diligence as Buyer deems reasonably necessary to further evaluate the Purchase of Property(s).');
                    $('#due_diligence_col').html(due_diligence_text);
                    $('#closing_period_col').html(closing_period_text);
                    $('#closing_cost_col').html(closing_cost_text);
                    if(parseInt(working_with_buyer) == 1){
                        var buyer_info = $('#agent_buyer_first_name').val()+' '+$('#agent_buyer_last_name').val()+'<br>'+$('#agent_buyer_phone_no').val()+'<br>'+$('#agent_buyer_user_email').val();
                        var agent_info = $('#first_name').val()+' '+$('#last_name').val()+'<br>'+$('#user_phone_no').val()+'<br>'+$('#user_email').val();
                        $('#buyer_contact_info').html(buyer_info).show();
                        $('#agent_contact_info').html(agent_info).show();
                        $('#agent_contact_info_section').show();
                    }else{
                        var buyer_info = $('#first_name').val()+' '+$('#last_name').val()+'<br>'+$('#user_phone_no').val()+'<br>'+$('#user_email').val();
                        var agent_info = '-';
                        $('#buyer_contact_info').html(buyer_info).show();
                        $('#agent_contact_info').hide();
                        $('#agent_contact_info_section').hide();
                    }
                    if(parseInt(working_with_buyer) == 1){
                        $('#buyer_sign').html('Signature <i>'+$('#agent_buyer_first_name').val()+' '+$('#agent_buyer_last_name').val()+'</i>');
                        $('#buyer_name_sign').html('Buyer '+$('#agent_buyer_first_name').val()+' '+$('#agent_buyer_last_name').val());
                    }else{
                        $('#buyer_sign').html('Signature <i>'+$('#first_name').val()+' '+$('#last_name').val()+'</i>');
                        $('#buyer_name_sign').html('Buyer '+$('#first_name').val()+' '+$('#last_name').val());
                    }

                    $('#offer_contingent_col').html(offer_contingent_text);
                    $('#appraisal_contingency_col').html(appraisal_contingent_text);
                    $('#sale_contingency_col').html(sale_contingency_text);
                    $('#exchange_col').html(financing_text);

                    var date = new Date();
                    var fullyear = date.getFullYear();
                    var halfYear = parseInt(date.getFullYear().toString().substr(2,2), 10);
                    var mts = date.getMonth()+1;
                    var short_month_name = date.toLocaleString('default', { month: 'short' })
                    var long_month_name = date.toLocaleString('default', { month: 'long' })
                    var month_num = (mts < 10)?'0'+mts:mts;
                    var dt = (date.getDate() < 10)?'0'+date.getDate():date.getDate();
                    var hrs = (date.getHours() < 10)?'0'+date.getHours():date.getHours();
                    var mins = (date.getMinutes() < 10)?'0'+date.getMinutes():date.getMinutes();
                    var secs = (date.getSeconds() < 10)?'0'+date.getSeconds():date.getSeconds();
                    var timeStp = short_month_name+', '+dt+' '+fullyear;
                    $('#buyer_date').html('Date '+timeStp);

                    $('.steps').hide();
                    $('.step').removeClass('current complete');
                    $('#step_4').addClass('current');
                    $('#step_4').addClass('can_navigate');
                    $('#step_1,#step_2,#step_3,#step_4').addClass('complete');
                    $('#steps-4').show();
                }else if(current_step == 5){
                  $('.steps').hide();
                  $('.step').removeClass('current complete');
                  $('#step_5').addClass('current');
                  $('#step_1,#step_2,#step_3,#step_4,#step_5').addClass('complete');
                  $('#steps-5').show();
                }

              $(window).scrollTop(0);
              $.growl.notice({title: "Highest and Best Offer ", message: response.msg, size: 'large'});

          }else{
               $.growl.error({title: "Highest and Best Offer ", message: response.msg, size: 'large'});

          }
      }
  });
}

function state_list_update(country_id, state_id){
   country_id = $("#"+country_id).val();
   csrf_token = $('input[name="csrfmiddlewaretoken"]').val();
   if (country_id){
        $.ajax({
            url: '/state-list/',
            type: 'post',
            dateType: 'json',
            cache: false,
            data: {country_id: country_id, 'csrfmiddlewaretoken': csrf_token},
            beforeSend: function(){
                $('.overlay').show();
            },
            success: function(response){
                $('.overlay').hide();
                if(response.error == 0){
                    state_lists = response.state_lists;
                    var option_html = "";
                    $('#'+state_id).empty().append("<option value=''>Select</option>");
                    $.each( state_lists, function( key, value ) {
                        $('#'+state_id).append("<option value="+value.id+" data-short-code="+value.iso_name+">"+value.state_name+"</option>");
                    });
                    $('#'+state_id).trigger("chosen:updated");
                }

            }
        });
   }else{
        $('#'+state_id).empty().append("<option value=''>Select</option>");
        $('#'+state_id).trigger("chosen:updated");
   }

}

$("#country").change(function(){
    $("#state").empty().append("<option value=''>Select</option>");
    $("#address_1").val("");
    $("#zip_code").val("");
    $("#city").val("");
    state_list_update("country", "state");
});