try{
    Dropzone.autoDiscover = false;

}catch(ex){
    //console.log(ex);
}
var x = null;
var offer_flag = false;
$(document).ready(function(){
    //$('[data-toggle="tooltip"]').tooltip();
    $('.select').chosen();
    if(parseInt(asset_sale_type) == 1){
        change_timer_text();
    }
    //$('#newcounterOfferModal').modal('show');
    $(document).on('click', '#close_offer_terms', function(){
        $('#viewCurrentOfferModal').modal('hide');
    });
    $("#user_phone").inputmask('(999) 999-9999');
    $("#traditional_offer_frm #trad_phone").inputmask('(999) 999-9999');

    $('#confirm_bid_false').click(function(){
        $('#confirmBidModal').modal('hide');
    });
    $('#confirm_insider_bid_false').click(function(){
        $('#confirmInsiderBidModal').modal('hide');
    });
    $('#confirm_dutch_bid_false').click(function(){
        $('#confirmDutchBidModal').modal('hide');
    });
    $('#close_dutch_winner_modal').click(function(){
        $('#roundOneModal').modal('hide');
    });
    $('#error_bid_close').click(function(){
        $('#biddingErrorBidModal').modal('hide');
    });
    $(document).on('click', '#close_offer_history_detail_popup_top,#close_offer_history_detail_popup', function(){
        $('#newOfferHistoryDetailModal').modal('hide');
        $('body').addClass('modal-open');
    });
    //--------------Click on body popup close-------
    $('body').click(function(e) {
        if ($(e.target).closest('#newOfferHistoryDetailModal').length){
            $('body').addClass('modal-open');
        }
    });
    $(document).on('click', '#close_seller_counter_popup_top', function(){
        $('#sellerCounterOfferDetailModal').modal('hide');
    });

    $(document).on('keyup', '#traditional_offer_frm #zip_code', function(){
       var zip_code = $(this).val();
       country_code = $("#traditional_country").find(':selected').data('short-code');
       country_id = $("#traditional_country").val();
       if(zip_code.length > 4 && country_id == 1){
        params = {
            'zip_code': zip_code,
            'call_function': set_offer_address_by_zipcode,
        }
        get_address_by_zipcode(params);
       }
    });
    $('#counter_offer_frm #offer_price,#traditional_offer_frm #user_offer').on('input',function(e){
        $(this).val(function (index, value) {
            if(value == "$"){
                return "";
            }else{
                //return '$' + value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                return '$' + value.replace(/(?!\.)\D/g, "").replace(/(?<=\..*)\./g, "").replace(/(?<=\.\d\d).*/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
        });

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

    offer_doc_params = {
        url: '/save-offer-document/',
        field_name: 'offer_document',
        file_accepted: '.jpg, .jpeg, .pdf, .doc, .docx',
        element: 'offerDocFrm',
        upload_multiple: true,
        max_files: 10,
        call_function: set_offer_document_details,
        default_message: '<i class="fas fa-upload"></i> Upload Document',
    }

    chta_to_agent_params = {
        url: '/save-chat-docs/',
        field_name: 'chat_document',
        file_accepted: '.jpg, .jpeg, .pdf, .doc, .docx',
        element: 'bidderDocFrm',
        upload_multiple: true,
        max_files: 4,
        call_function: set_chat_to_agent_details,
        default_message: '<i class="fas fa-upload"></i> Upload Document',
    }

    try{
        initdrozone(offer_doc_params);
    }catch(ex){
        //console.log(ex);
    }

    try{
        initdrozone(chta_to_agent_params);
    }catch(ex){
        //console.log(ex);
    }

    $('.format_start_end_date').each(function(){
        try{
            response = asset_details_conversation_start_end_date($(this).attr('data-start-date'), $(this).attr('data-end-date'))
            $(this).html(response);
        }catch(ex){
            //console.log(ex);
        }
    });

    $('.month_date_year').each(function(){
        try{
            response = month_date_year($(this).attr('start_date'))
            $(this).html(response);
        }catch(ex){
            //console.log(ex);
        }
    });


    $(document).on('mouseenter','#countdown_text .tooltipPop',function(){
        $('.tooltipPopdesc').css('visibility', 'hidden');
        if($('#countdown_tooltip .popcontent').text().trim(" ") != ""){
            $('.time_remaining .tooltipPopdesc').css('visibility', 'visible');
        }

    });
    $(document).on('mouseenter','#bid_increment .tooltipPop',function(){
        $('.tooltipPopdesc').css('visibility', 'hidden');
        $('#bid_increment .tooltipPopdesc').css('visibility', 'visible');
    });
    $(document).on('mouseenter','.headings .tooltipPop',function(){
        $('.tooltipPopdesc').css('visibility', 'hidden');
        $('.headings .tooltipPopdesc').css('visibility', 'visible');
    });

    /*$(document).on('mouseleave','#countdown_text .tooltipPop',function(){
          $('.time_remaining .tooltipPopdesc').css('visibility', 'hidden');
    });
    $(document).on('mouseleave','#bid_increment .tooltipPop',function(){
          $('#bid_increment .tooltipPopdesc').css('visibility', 'hidden');
    });
    $(document).on('mouseleave','.headings .tooltipPop',function(){
          $('.headings .tooltipPopdesc').css('visibility', 'hidden');
    });*/


    /*check_flash_time = setInterval(function(){
        var new_today = new Date().getTime();
        if(new_today > countDownEndDate){
            clearInterval(check_flash_time);
        }else{
            var flashtime = countDownEndDate - new_today;
            var flash_time_sec = parseInt(flash_timer)/1000;
            if(flashtime <= parseInt(flash_timer)){
                $('.timing').blink({times:flash_time_sec});
                clearInterval(check_flash_time);
            }

        }

    }, 1000);*/
    // Update the count down every 1 second
    /*if(parseInt(asset_sale_type) == 2){
        x = setInterval(function() {
          if(parseInt(auction_status_id) == 1 && parseInt(property_status_id) == 1){
            // Get today's date and time
            var dutch_distance = 0;
            var sealed_distance = 0;
            var english_distance = 0;
            var auction_start = 0;
          var now = new Date().getTime();
          // Find the distance between now and the count down date
          var distance = countDownDate - now;
          if(distance > 0){
            $('#countdown_text').html('Bidding Starts In <div class="tooltipPop"><i class="fas fa-info-circle"></i></div>');
          }
          if(isNaN(distance) || distance < 0){
            distance = countDownDutchEndDate - now;
            if((!isNaN(distance) || distance > 0)){
                auction_start = 1;
                $('#countdown_text').html('Bidding Ends In <div class="tooltipPop"><i class="fas fa-info-circle"></i></div>');
            }
          }
          if(isNaN(distance) || distance < 0){
            distance = countDownSealedStartDate - now;
            if((!isNaN(distance) || distance > 0)){
                $('#countdown_text').html('Bidding Starts In <div class="tooltipPop"><i class="fas fa-info-circle"></i></div>');
            }
          }
          if(isNaN(distance) || distance < 0){
            distance = countDownSealedEndDate - now;
            if((!isNaN(distance) || distance > 0)){
                $('#countdown_text').html('Bidding Ends In <div class="tooltipPop"><i class="fas fa-info-circle"></i></div>');
            }
          }
          if(isNaN(distance) || distance < 0){
            distance = countDownEnglishStartDate - now;
            if((!isNaN(distance) || distance > 0)){
                $('#countdown_text').html('Bidding Starts In <div class="tooltipPop"><i class="fas fa-info-circle"></i></div>');
            }
          }
          if(isNaN(distance) || distance < 0){
            distance = countDownEndDate - now;
            if((!isNaN(distance) || distance > 0)){
                $('#countdown_text').html('Bidding Ends In <div class="tooltipPop"><i class="fas fa-info-circle"></i></div>');
            }
          }
          if(now < countDownDutchEndDate){
            //code
          }
          if(isNaN(distance) || distance < 0){

            $('.day_remaining').html('00');
            $('.hr_remaining').html('00');
            $('.day_remaining_li').hide();
            $('.hr_remaining_li').hide();
            $('.min_remaining').html('00');
            $('.sec_remaining').html('00');
            $('.time_remaining').show();
            $('#countdown_text').html('Auction Completed <div class="tooltipPop"><i class="fas fa-info-circle"></i></div>');
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
                if(parseInt(asset_sale_type) == 2 && auction_start == 1){
                    $('.day_remaining_li').hide();
                    $('.hr_remaining_li').hide();
                }else{
                    $('.day_remaining_li').show();
                    $('.hr_remaining_li').show();
                }
                $('.min_remaining').html(minutes);
                $('.sec_remaining').html(seconds);

              // If the count down is over, write some text
              if (parseInt(distance) < 0 || (typeof(auction_status) != 'undefined' && parseInt(auction_status) !=1)) {
                clearInterval(x);
                $('#countdown_text').html('Auction Completed <div class="tooltipPop"><i class="fas fa-info-circle"></i></div>');
                $('.day_remaining').html('00');
                $('.hr_remaining').html('00');
                if(parseInt(asset_sale_type) == 2 && auction_start == 1){
                    $('.day_remaining_li').hide();
                    $('.hr_remaining_li').hide();
                }else{
                    $('.day_remaining_li').show();
                    $('.hr_remaining_li').show();
                }
                $('.min_remaining').html('00');
                $('.sec_remaining').html('00');
                $('.time_remaining').show();
              }else{
                $('.time_remaining').show();
              }
          }
          }else{
            $('.day_remaining').html('00');
            $('.hr_remaining').html('00');
            $('.min_remaining').html('00');
            $('.sec_remaining').html('00');
            $('.time_remaining').show();
            clearInterval(x);
          }
        }, 1000);
    }*/
    if(parseInt(asset_sale_type) != 1 && parseInt(asset_sale_type) != 2){
        x = setInterval(function() {
          if(parseInt(asset_sale_type) != 4 && parseInt(asset_sale_type) != 6){
          if(parseInt(auction_status_id) == 1 && parseInt(property_status_id) == 1){


            // Get today's date and time
          var now = new Date().getTime();
          // Find the distance between now and the count down date
          var distance = countDownDate - now;

          if(isNaN(distance) || distance < 0){
            distance = countDownEndDate - now;
            if((!isNaN(distance) || distance > 0) && asset_sale_type && parseInt(asset_sale_type) == 7){
                $('#countdown_text').html('Offer Ends In <div class="tooltipPop"><i class="fas fa-info-circle"></i></div>');
            }
          }
          if(isNaN(distance) || distance < 0){
            $('.day_remaining').html('00');
            $('.hr_remaining').html('00');
            $('.min_remaining').html('00');
            $('.sec_remaining').html('00');
            $('.time_remaining').show();
            if(asset_sale_type && parseInt(asset_sale_type) == 1){
                $('#countdown_text').html('Auction Completed <div class="tooltipPop"><i class="fas fa-info-circle"></i></div>');
            }else if(asset_sale_type && parseInt(asset_sale_type) == 7){
                $('#countdown_text').html('Offer Ended <div class="tooltipPop"><i class="fas fa-info-circle"></i></div>');
            }
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
              if (parseInt(distance) < 0 || (typeof(auction_status) != 'undefined' && parseInt(auction_status) !=1)) {
                clearInterval(x);
                if(asset_sale_type && parseInt(asset_sale_type) == 1){
                    $('#countdown_text').html('Auction Completed <div class="tooltipPop"><i class="fas fa-info-circle"></i></div>');
                }
                $('.day_remaining').html('00');
                $('.hr_remaining').html('00');
                $('.min_remaining').html('00');
                $('.sec_remaining').html('00');
                $('.time_remaining').show();
              }else{
                $('.time_remaining').show();
              }
          }
          }else{
            $('.day_remaining').html('00');
            $('.hr_remaining').html('00');
            $('.min_remaining').html('00');
            $('.sec_remaining').html('00');
            $('.time_remaining').show();
            clearInterval(x);
          }
          }else{
            $('.day_remaining').html('00');
            $('.hr_remaining').html('00');
            $('.min_remaining').html('00');
            $('.sec_remaining').html('00');
            $('.time_remaining').hide();
            clearInterval(x);
          }
        }, 1000);
    }

    try{
        $('.date').datetimepicker({
          format: 'MM-DD-YYYY hh:mm A',
          minDate: new Date()
      }).on('dp.change',function(e){
          var virtual_date_element = $(this).find('input:first').attr('id');
          var date_element = $(this).find('input:last').attr('id');
          var dates = $("#"+virtual_date_element).val();
          if(dates != ""){
            var actualStartDate = dates.split(" ");
            //new lines
            var mdy_format = actualStartDate[0].split("-");
            mdy_date = mdy_format[2]+"-"+mdy_format[0]+"-"+mdy_format[1];

            //actualStartDate = mdy_date+' '+convert_to_24h(actualStartDate[1]+' '+actualStartDate[2]);
            actualStartDate = actualStartDate[0]+' '+convert_to_24h(actualStartDate[1]+' '+actualStartDate[2]);



            //var utc_date = convert_to_utc_datetime(actualStartDate);
            var utc_date = convert_to_utc_date(actualStartDate, 'mm-dd-yyyy', 'datetime');
            $("#"+date_element+"_local").val(actualStartDate);
            $("#"+date_element).val(utc_date);
          }

      });
    }catch(ex){

    }
    try{
        $('.schedule_date').datetimepicker({
          format: 'MM-DD-YYYY',
          minDate: new Date()
      }).on('dp.change',function(e){
          /*var virtual_date_element = $(this).find('input:first').attr('id');
          var date_element = $(this).find('input:last').attr('id');
          var dates = $("#"+virtual_date_element).val();
          if(dates != ""){
            var actualStartDate = dates.split(" ");
            //new lines
            var mdy_format = actualStartDate[0].split("-");
            mdy_date = mdy_format[2]+"-"+mdy_format[0]+"-"+mdy_format[1];

            //actualStartDate = mdy_date+' '+convert_to_24h(actualStartDate[1]+' '+actualStartDate[2]);
            actualStartDate = actualStartDate[0]+' '+convert_to_24h(actualStartDate[1]+' '+actualStartDate[2]);



            //var utc_date = convert_to_utc_datetime(actualStartDate);
            var utc_date = convert_to_utc_date(actualStartDate, 'mm-dd-yyyy', 'datetime');
            $("#"+date_element+"_local").val(actualStartDate);
            $("#"+date_element).val(utc_date);
          }*/

      });
    }catch(ex){

    }
    $('#new_bid_amt').on('input',function(e){
        var deposit_type = $('#new_bid_amt').val();
        $(this).val(function (index, value) {
            if(value == "$" || value == ""){
                return "";
            }else{
                //return '$' + value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                return '$' + value.replace(/(?!\.)\D/g, "").replace(/(?<=\..*)\./g, "").replace(/(?<=\.\d\d).*/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }

        });

    });
    $('#insider_new_bid_amt').on('input',function(e){
        var deposit_type = $('#insider_new_bid_amt').val();
        $(this).val(function (index, value) {
            if(value == "$" || value == ""){
                return "";
            }else{
                //return '$' + value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                return '$' + value.replace(/(?!\.)\D/g, "").replace(/(?<=\..*)\./g, "").replace(/(?<=\.\d\d).*/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }

        });
    });
      $('#bidNowFrm').validate({
        ignore: [],
        errorElement: 'p',
        rules:{
            new_bid_amt:{
                required: true,
                thousandsepratornum: true,
                maxlength:14
            }
        },
        messages:{
            new_bid_amt:{
                required: "Bid Amount is required",
                thousandsepratornum: "Please enter valid offer amount"
            }
        }
      });
      $('#insiderbidNowFrm').validate({
        ignore: [],
        errorElement: 'p',
        rules:{
            insider_new_bid_amt:{
                required: true,
                thousandsepratornum: true,
                maxlength:14
            }
        },
        messages:{
            insider_new_bid_amt:{
                required: "Bid Amount is required",
                thousandsepratornum: "Please enter valid offer amount"
            }
        }
      });
      $('#person_tour_frm').validate({
        ignore: [],
        errorElement: 'p',
        rules:{
            user_first_name: {
                required: true,
                accept: true
            },
            user_last_name: {
                required: true,
                accept: true
            },
            user_email: {
                required: true,
                email: true
            },
            user_phone: {
                required: true,
                phoneminlength: 10,
                phonemaxlength: 10,
            },
            availability: {
                required: true
            },
            tour_date: {
                required: true,
            }
        },
        messages: {
            user_first_name: {
                required: "First Name is required",
                accept: "Please enter valid First Name"
            },
            user_last_name: {
                required: "Last Name is required",
                accept: "Please enter valid Last Name"
            },
            user_email: {
                required: "Email is required",
                email: "Please enter valid Email"
            },
            user_phone: {
                required: "Phone No. is required",
                phoneminlength: "Please enter valid Phone No.",
                phonemaxlength: "Please enter valid Phone No.",
            },
            availability: {
                required: "This field is required.",
            },
            tour_date: {
                required: "Date is required.",
                /*lessThan: "Must be less than open house end date",
                greaterThan: "Must be greater than open house start date."*/
            }
        },
        errorPlacement: function(error, element) {
            if(element.attr('name') == 'availability'){
                error.insertAfter(element.closest('.availabity-steps'));
            }else if(element.parent().hasClass('date')){
                error.insertAfter(element.parent());
            }else{
                error.insertAfter(element);
            }
        },
        submitHandler:function(){
            var flag = true;
            var start_dates = $("#virtual_tour_date").val();
            if (start_dates != "") {
                var actualStartDate = start_dates.split(" ");
                var change_format = actualStartDate[0].split("-");
                var new_format = change_format[2]+"-"+change_format[0]+"-"+change_format[1];
                /*actualStartDate = new_format + ' ' + convert_to_24h(actualStartDate[1] + ' ' + actualStartDate[2]);
                var actualStartDateUtc = convert_to_utc_datetime(actualStartDate, 'datetime');
                $("#tour_date").val(actualStartDateUtc);
                $("#tour_date_local").val(actualStartDate);*/

                $("#tour_date").val(new_format);
                $("#tour_date_local").val(new_format);
            }else{
                $("#virtual_tour_date").val('');
                $("#tour_date").val('');
                $("#tour_date_local").val('');
            }
            if(flag == true && $('#person_tour_frm').valid() === true){
                $.ajax({
                    url: '/save-schedule-tour/',
                    type: 'post',
                    dataType: 'json',
                    cache: false,
                    data: $('#person_tour_frm').serialize(),
                    beforeSend: function () {
                        $(':submit').attr('disabled', 'disabled');
                        /*$.blockUI({
                            message: '<h4>Please wait!</h4>'
                        });*/
                        $('.overlay').show();
                    },
                    complete: function () {
                        //$.unblockUI();
                        $(':submit').removeAttr('disabled');

                    },
                    success: function(response){
                        $('.overlay').hide();
                        if(response.error == 0){
                            $("#virtual_tour_date").val('');
                            $("#tour_date").val('');
                            $("#tour_date_local").val('');
                            $("#tour_message").val('');
                            $.growl.notice({title: "Scheduled Tour ", message: response.msg, size: 'large'});
                            window.setTimeout(function () {
                                $('#personModal').modal('hide');
                            }, 2000);

                        }else{
                            window.setTimeout(function () {
                            try{
                                $.growl.error({title: "Scheduled Tour ", message: response.msg.schedule_date, size: 'large'});
                            }catch(ex){
                                $.growl.error({title: "Scheduled Tour ", message: response.msg.message, size: 'large'});
                            }

                            }, 2000);
                        }
                    }
                });
            }

        }
      });
      $(document).on('click', '#redirect_doc_url', function(){
        var property_id = $(this).data('property');
        var doc_id = $(this).data('doc-id');
        var upload_id = $(this).data('upload-id');
        var doc_url = $(this).data('url');
        view_document(property_id, upload_id, doc_id, doc_url);
      });
      /*$(document).on('click','#traditional_offer_btn', function(){
        $('#traditionalOfferModal').modal('show');
      });*/
      $(document).on('click','input[name="trad_user_type"]', function(){
        var selected_user_type = parseInt($(this).val());
        $('.working_with_agent_no_section').hide();
        $('input[name="working_with_agent"]').prop('checked',false);
        if(selected_user_type == 2){
            $('.agent_question_section').hide();
            $('.buyer_question').show();
            //$('label[for="offer_comment"]').html('Feel free to include any additional comments, questions and any financial documents you may have for the listing agent to review below.');
            $('#offer_question').html('What would you like to offer?');
        }else{
            /*$('.buyer_question').hide();
            $('.agent_question_section').show();
            $('#offer_question').html('What would your client like you to offer on their behalf?');*/
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
        var selected_user_type = parseInt($('input[name="trad_user_type"]:checked').val());
        $('.working_with_agent_no_section').hide();
        if(selected_user_type == 2){
            if(working_with_agent == 0){
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
      //$('#traditionalOfferModal').modal('show');
      $(document).on('click', '#confirm_working_agent_true', function(){
        $('#traditionalOfferModal').modal('hide');
        $('#confirmWorkingAgentModal').modal('hide');

      });
      $(document).on('click', '#confirm_working_agent_false', function(){
        $('input[name="working_with_agent"]').prop('checked', false);
        $('#confirmWorkingAgentModal').modal({
          backdrop: false,
          keyboard: true,
          show: false
        });
        $('#confirmWorkingAgentModal').modal('hide');
        $('body').addClass('modal-open');
      });
      $('#traditional_offer_frm').validate({
        ignore: [],
        errorElement: 'p',
        rules:{
            first_name: {
                required: true,
                accept: true
            },
            last_name: {
                required: true,
                accept: true
            },
            trad_email: {
                required: true,
                email: true
            },
            trad_phone: {
                required: true,
                phoneminlength: 10,
                phonemaxlength: 10,
            },
            address_1: {
                required: true
            },
            city: {
                required: true
            },
            traditional_country: {
                required: true
            },
            state: {
                required: true
            },
            zip_code: {
                required: true,
                //minlength: 5,
                maxlength: 6,
            },
            trad_user_type: {
                required: true
            },
            working_with_agent: {
                required: function(){
                    if ($('input[name="working_with_agent"]').is(':visible') === true) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            property_in_person: {
                required: function(){
                    if ($('input[name="property_in_person"]').is(':visible') === true) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            buyer_pre_qualified: {
                required: function(){
                    if ($('input[name="buyer_pre_qualified"]').is(':visible') === true) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            agent_property_in_person: {
                required: function(){
                    if ($('input[name="agent_property_in_person"]').is(':visible') === true) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            agent_pre_qualified: {
                required: function(){
                    if ($('input[name="agent_pre_qualified"]').is(':visible') === true) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            user_offer:{
                required: true,
                thousandsepratornum: true,
                minvalue: 1,
                maxlength:14
            }
        },
        messages: {
            first_name: {
                required: "First Name is required",
                accept: "Please enter valid First Name"
            },
            last_name: {
                required: "Last Name is required",
                accept: "Please enter valid Last Name"
            },
            trad_email: {
                required: "Email is required",
                email: "Please enter valid Email"
            },
            trad_phone: {
                required: "Phone No. is required",
                phoneminlength: "Please enter valid Phone No.",
                phonemaxlength: "Please enter valid Phone No.",
            },
            address_1: {
                required: "Address is required"
            },
            city: {
                required: "City is required"
            },
            traditional_country: {
                required: "Country is required"
            },
            state: {
                required: "State is required"
            },
            zip_code: {
                required: "Zip Code is required",
                //minlength: "Please enter at least 5 char",
                maxlength: "Please enter at most 6 char"
            },
            trad_user_type: {
                required: "This field is required"
            },
            working_with_agent: {
                required: "This field is required"
            },
            property_in_person: {
                required: "This field is required"
            },
            buyer_pre_qualified: {
                required: "This field is required"
            },
            agent_property_in_person: {
                required: "This field is required"
            },
            agent_pre_qualified: {
                required: "This field is required"
            },
            user_offer:{
                required: "Offer amount is required.",
                maxlength: "Please enter max 10 digit number",
                thousandsepratornum: "Please enter valid offer amount"
            }

        },
        errorPlacement: function(error, element) {
            if(element.attr('type') == 'radio'){
                error.insertAfter(element.closest('.choice_type'));
            }else{
                error.insertAfter(element);
            }
        },
        submitHandler:function(){
            var flag = true;

            if(flag == true && $('#traditional_offer_frm').valid() === true){
                $.ajax({
                    url: '/save-traditional-offer/',
                    type: 'post',
                    dataType: 'json',
                    cache: false,
                    data: $('#traditional_offer_frm').serialize(),
                    beforeSend: function () {
                        $(':submit').attr('disabled', 'disabled');
                        /*$.blockUI({
                            message: '<h4>Please wait!</h4>'
                        });*/
                        $('.overlay').show();
                    },
                    complete: function () {
                        //$.unblockUI();

                    },
                    success: function(response){
                        $('.overlay').hide();
                        $(':submit').removeAttr('disabled');
                        if(response.error == 0){
                            var selected_user_type = parseInt($('input[name="trad_user_type"]:checked').val());
                            //$.growl.notice({title: "Offer ", message: response.msg, size: 'large'});
                            $('#offerSubmitModal .modal-title').html('Offer Submitted');
                            $('#offerSubmitModal #submit_back_listing').html('Back To Listing');
                            if(selected_user_type == 2){
                                $('#offerSubmitModal #submit_msg_content').html('Congratulations on completing and starting the process towards purchasing this property. Our listing agent will be contacting the seller to review and assess the strength of your offer. The seller has up to 24 hours to either accept, counter or decline your offer. The listing agent may contact you within the next 24 hours to discuss your offer. In the mean time you can track your offer status on your account dashboard. Thank You for your Offer!!');
                            }else{
                                $('#offerSubmitModal #submit_msg_content').html('Congratulations on completing and starting the process towards your client purchasing this property. Our listing agent will be contacting the seller to review and assess the strength of the offer. The seller has up to 24 hours to either accept, counter or decline your clients offer. The listing agent may contact you within the next 24 hours to discuss your clients offer. In the mean time you can track your clients offer status on your account dashboard. Thank You for the Offer!!');
                            }
                            offer_flag = true;
                            $('#offerSubmitModal').modal({
                              backdrop: 'static',
                              keyboard: false,
                              show: true
                            });
                            /*window.setTimeout(function () {
                                $('#traditionalOfferModal').modal('hide');
                            }, 2000);*/

                        }else{
                            window.setTimeout(function () {
                                $.growl.error({title: "Offer ", message: response.msg, size: 'large'});
                            }, 2000);
                        }
                    }
                });
            }

        }
      });
      $(document).on('click', '#edit_user_offer', function(){
        $('#user_offer').removeProp('readonly');
        $(this).hide();
      });
      $(document).on('click', '#submit_back_listing,#submit_back_listing_top', function(){
        $('#offerSubmitModal').modal('hide');
        $('#traditionalOfferModal').modal('hide');
        $(window).scrollTop(0);
        window.location.reload();
      });
      $(document).on('click', '#cancel_offer', function(){
        $('#offerSubmitModal').modal('hide');
        $('#traditionalOfferModal').modal('hide');
        $(window).scrollTop(0);
      });
      $(document).on('click', '#back_to_offer,#back_to_offer_top', function(){
        $('input[name="trad_user_type"]').prop('checked', false);
        $('#notAgentModal').modal('hide');
        $('body').addClass('modal-open');
      });
      $(document).on('click', '#del_bid_false_top,#del_bid_false', function(){
        $('#confirmDeleteBidModal').modal('hide');
      });
       $(document).on('hidden.bs.modal','#notAgentModal,#offerSubmitModal,#confirmOfferDocDeleteModal,#viewMsgHistoryModal,#confirmAcceptOfferModal,#confirmRejectOfferModal,#counterOfferModal,#newcounterOfferModal,#confirmRejectBestOfferModal,#confirmAcceptBestOfferModal', function (e) {

          $('body').addClass('modal-open');
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
        if(section == 'chat_document'){
            delete_chat_agent_document(del_params)
        } else {
            delete_offer_document(del_params);
        }
        $('#confirmOfferDocDeleteModal').modal('hide');
        $('body').addClass('modal-open');

    });

    $(document).on('click', '#msg_true,#msg_close_true', function(){
        $('#viewMsgHistoryModal').modal('hide');
        $('body').addClass('modal-open');
    });
    // reject offer functionality
    $(document).on('click', '#reject_offer_true', function(){
        var property_id = $('#rej_property_id').val();
        var negotiated_id = $('#rej_negotiated_id').val();

        reject_offer(property_id,negotiated_id);
    });
    $(document).on('click', '#reject_best_offer_true', function(){
        var property_id = $('#rej_best_property_id').val();
        var negotiated_id = $('#rej_best_negotiated_id').val();
        reject_best_offer(property_id,negotiated_id);
    });
    $(document).on('click', '#reject_offer_false,#reject_offer_false_top', function(){
        $('#rej_property_id').val('');
        $('#rej_negotiated_id').val('');
        $('#confirmRejectOfferModal').modal('hide');
        $('body').addClass('modal-open');
    });
    $(document).on('click', '#reject_best_offer_false,#reject_best_offer_false_top', function(){
        $('#rej_best_property_id').val('');
        $('#rej_best_negotiated_id').val('');
        $('#confirmRejectBestOfferModal').modal('hide');
        $('body').addClass('modal-open');
    });
    // Accept offer functionality
    $(document).on('click', '#accept_offer_false,#accept_offer_false_top', function(){
        $('#accept_property_id').val('');
        $('#accept_negotiated_id').val('');
        $('#confirmAcceptOfferModal').modal('hide');
        $('body').addClass('modal-open');
    });
    $(document).on('click', '#accept_best_offer_false,#accept_best_offer_false_top', function(){
        $('#accept_best_property_id').val('');
        $('#accept_best_negotiated_id').val('');
        $('#confirmAcceptBestOfferModal').modal('hide');
        $('body').addClass('modal-open');
    });
    $(document).on('click', '#accept_offer_true', function(){
        var property_id = $('#accept_property_id').val();
        var negotiated_id = $('#accept_negotiated_id').val();
        accept_offer(property_id,negotiated_id);
    });
    $(document).on('click', '#accept_best_offer_true', function(){
        var property_id = $('#accept_best_property_id').val();
        var negotiated_id = $('#accept_best_negotiated_id').val();
        accept_best_offer(property_id,negotiated_id);
    });

    $('#counter_offer_frm').validate({
            ignore: [],
            errorElement: 'p',
            rules:{
                offer_price:{
                    required: true,
                    thousandsepratornum: true,
                    minvalue: 1,
                    maxlength:14
                }
            },
            messages:{
                offer_price:{
                    required: "Offer amount is required.",
                    thousandsepratornum: "Please enter valid offer amount",
                    maxlength: "Please enter max 10 digit number"
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
                                $('#viewofferModal').modal('hide');
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
        $(document).on('click', '#close_counter_popup_top,#close_counter_popup', function(){
            $('#counterOfferModal').modal('hide');
            $('body').addClass('modal-open');
        });
        $(document).on('click', '#close_best_counter_popup_top,#close_best_counter_popup,#counter_cancel_offer', function(){
            $('#newcounterOfferModal').modal('hide');
            $('body').addClass('modal-open');
        });
        $(document).on('click', '#close_declined_offer_top,#close_declined_offer', function(){
            $('#offerDeclinedModal').modal('hide');
            $('body').addClass('modal-open');
        });
        $(document).on('click', '#declined_submit_new_offer', function(){
            $('#offerDeclinedModal').modal('hide');
            $('#viewofferModal').modal('hide');
        });
        $(document).on('hidden.bs.modal','#traditionalOfferModal', function (e) {
            if(offer_flag == true){
                window.location.reload();
            }
        });
        $(document).on('click', '#close_offer_doc_popup,#close_offer_doc_popup_top', function(){
            $('#viewOfferDocumentModal').modal('hide');
            $('body').addClass('modal-open');
        });
});
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
        $('#offerDocDiv').hide();
    }
    $('#offerDocFrm.dropzone').removeClass('dz-max-files-reached');
   data = {'upload_id': id, 'doc_name': name, 'section': section}
    if(name && section && id){
        $.ajax({
            url: '/delete-offer-document/',
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
                $('body').addClass('modal-open');
            }
        });
    }

}

function delete_chat_agent_document(params){
    var image_id = '';
    var image_name = '';
    var new_ids = '';
    var new_names = '';
 
    var section = params.section;
    var id = params.id;
    var name = params.name;
 
 
     image_id = $('#chat_doc_id').val();
     image_name = $('#chat_doc_name').val();
     new_ids = remove_string(image_id,id,',');
     new_names = remove_string(image_name,name,',');
     $('li[rel_id="'+id+'"]').remove();
     $('#chat_doc_id').val(new_ids);
     $('#chat_doc_name').val(new_names);
     if($('#chat_doc_id').val() == ''){
         $('#bidderDocDiv').hide();
     }
     $('#bidderDocFrm.dropzone').removeClass('dz-max-files-reached');
    data = {'image_id': id, 'image_name': name, 'section': section, 'article_id': ''}
     if(name && section && id){
         $.ajax({
             url: '/delete-chat-docs/',
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
                 $('body').addClass('modal-open');
             }
         });
     }
 
 }
function set_asset_bidding_details(params){
    $('.overlay').show();
  var today = new Date().getTime();
  var start_date = '';
  var end_date = '';
  var start_date_time = 0;
  var end_date_time = 0;
  var start_bid = 0;
  var next_bid = 0;
  var bid_increments = 0;
  var bid_count = 0;
  var is_registered = "False";
  var registration_approved = "False";
  var session_user_id = "";
  var asset_sale_type = "";
  var is_approved = 0;
  var is_reviewed = false;
  var my_bid_count = 0;
  var auction_status = 0;

  if(params.start_date){
    start_date = params.start_date;
  }

  if(params.end_date){
    end_date = params.end_date;
  }

  if(params.start_date_time){
    start_date_time = params.start_date_time;
  }

  if(params.start_date_time){
    end_date_time = params.end_date_time;
  }

  if(params.start_bid){
    start_bid = params.start_bid;
  }

  if(params.next_bid){
    next_bid = params.next_bid;
  }

  if(params.bid_increments){
    bid_increments = params.bid_increments;
  }

  if(params.bid_count){
    bid_count = params.bid_count;
  }

  if(params.is_registered){
    is_registered = params.is_registered;

  }

  if(params.registration_approved){
    registration_approved = params.registration_approved;
  }
  if(params.session_user_id){
    session_user_id = params.session_user_id;
  }

  if(params.asset_sale_type){
    asset_sale_type = params.asset_sale_type;
  }

  if(params.is_approved){
    is_approved = parseInt(params.is_approved);
  }

  if(params.is_reviewed){
    is_reviewed = params.is_reviewed;
  }

  if(params.my_bid_count){
    my_bid_count = params.my_bid_count;
  }

  if(params.auction_status){
    auction_status = params.auction_status;
  }

    $('#bidNowFormSection').hide();
    $('#preFinalBiddingSection').show();
    $('#finalBiddingSection').hide();
    //$('#registerBidBtn').addClass('btn-secondary').removeClass('btn-primary-bdr').removeClass('approval_pending');

  if(session_user_id){
        //when user logged in
        if(parseInt(asset_sale_type) != 4 && parseInt(asset_sale_type) != 7){
            if((today >= start_date_time && today <= end_date_time && is_approved == 1 && (is_reviewed == 'False' || is_reviewed == 'True')) || (today < start_date_time && is_approved == 1 && (is_reviewed == 'False' || is_reviewed == 'True')) || (today < start_date_time && is_approved == 2 && is_reviewed == 'False') || (today >= start_date_time && today <= end_date_time && is_approved == 2 && is_reviewed == 'False')){
                //when bidding started and registraton approval in pending state
                $('#registerBidBtn').html('Registration Pending Approval').css('cursor','initial');
                //$('#registerBidBtn').addClass('approval_pending').addClass('btn-primary-bdr').removeClass('btn-secondary');
                $('#registerBidBtn').show();
                $('#registerBidBtn').attr('href','javascript:void(0)');
                //$('#bidder_msg_section').hide();
          }else if(is_approved == 3 || is_approved == 4){
                //when registration declined
                $('#registerBidBtn').html('Registration Declined').css('cursor','initial');
                $('#registerBidBtn').show();
                $('#registerBidBtn').attr('href','javascript:void(0)');
                //$('#bidder_msg_section').hide();
          }else if(today >= start_date_time && today <= end_date_time  && is_approved == 2 && is_reviewed == 'True'){
                //when bidding started and registraton approved
                $('#bidNowFormSection').show();
                $('#registerBidBtn').hide();
                $('#registerBidBtn').attr('href','javascript:void(0)');

                /*if(parseInt(bid_count) > 0){
                    $('#bidder_msg_section').hide();
                }else{
                    $('#bidder_msg').html('<i class="fas fa-check-circle"></i> You are registered and approved to bid. Place your first bid now.');
                    $('#bidder_msg_section').show();
                }*/

          }else if(today < start_date_time && is_approved == 2 && is_reviewed == 'True'){
                //when bidding not started and registraton approved
                $('#registerBidBtn').html('Auction Has Not Started').css('cursor','initial');
                $('#registerBidBtn').show();
                $('#registerBidBtn').attr('href','javascript:void(0)');

                //$('#bidder_msg').html('<i class="fas fa-check-circle"></i> Registration Approved But Auction Not Started Yet.');
                //$('#bidder_msg_section').show();

          }else if(today > end_date_time){
                //when bidding end
                $('#preFinalBiddingSection').hide();
                $('#registerBidBtn').hide();
                $('#finalBiddingSection').show();
                $('#registerBidBtn').attr('href','javascript:void(0)');
                //$('#bidder_msg_section').hide();
          }else{
                //default condition when no criteria matches
                $('#registerBidBtn').html('Register For Auction').css('cursor','pointer');
                $('#registerBidBtn').show();
                var bidder_reg_url = '/bid-registration/?property='+property_id;
                $('#registerBidBtn').attr('href',bidder_reg_url);
                //$('#bidder_msg_section').hide();

          }
        }else{
            if(parseInt(asset_sale_type) != 4){

            }else{
                if((is_approved == 1 && (is_reviewed == 'False' || is_reviewed == 'True')) || (is_approved == 2 && is_reviewed == 'False')){
                        //when bidding started and registraton approval in pending state
                        $('#registerBidBtn').html('Registration Pending Approval').css('cursor','initial');
                        //$('#registerBidBtn').addClass('approval_pending').addClass('btn-primary-bdr').removeClass('btn-secondary');
                        $('#registerBidBtn').show();
                        $('#registerBidBtn').attr('href','javascript:void(0)');
                        //$('#bidder_msg_section').hide();
                  }else if(is_approved == 2 && is_reviewed == 'True'){
                        //when bidding started and registraton approved
                        $('#bidNowFormSection').show();
                        $('#registerBidBtn').hide();
                        $('#registerBidBtn').attr('href','javascript:void(0)');
                        /*if(parseInt(bid_count) > 0){
                            $('#bidder_msg_section').hide();
                        }else{
                            $('#bidder_msg').html('<i class="fas fa-check-circle"></i> You are registered and approved to bid. Place your first bid now.');
                            $('#bidder_msg_section').show();
                        }*/
                  }else if(is_approved == 3 || is_approved == 4){
                    //when registration declined
                    $('#registerBidBtn').html('Registration Declined').css('cursor','initial');
                    $('#registerBidBtn').show();
                    $('#registerBidBtn').attr('href','javascript:void(0)');
                    //$('#bidder_msg_section').hide();
                  }else{
                        //default condition when no criteria matches
                        $('#registerBidBtn').html('Register For Auction').css('cursor','pointer');
                        $('#registerBidBtn').show();
                        var bidder_reg_url = '/bid-registration/?property='+property_id;
                        $('#registerBidBtn').attr('href',bidder_reg_url);
                        //$('#bidder_msg_section').hide();
                  }
            }

        }
  }else{
      //when user not logged in
      $('#registerBidBtn').html('Register For Auction').css('cursor','pointer');
      $('#registerBidBtn').show();
      var bidder_reg_url = '/login/?next=/asset-details/?property_id='+property_id;
      $('#registerBidBtn').attr('href',bidder_reg_url);
      //$('#bidder_msg_section').hide();
  }

  if(today >= start_date_time && today <= end_date_time && parseInt(asset_sale_type) != 4 && parseInt(asset_sale_type) != 7){
       //$('#starting_bid').show();
       //$('#next_bid').show();
       $('#bid_increment').show();
       $('#bid_count').show();
       //$('#bid_start_date').hide();
       //$('#bid_end_date').hide();
       var next_bid_formated = numberFormat(parseInt(start_bid));
       if(start_bid > parseInt(start_bid)){
        next_bid_formated = numberFormat(start_bid);
       }
       if(parseInt(bid_count)>0 && today >= start_date_time){
        var bid_amt = '<span>Current Bid</span>'+'$'+next_bid_formated;
        var auction_bid_amt = '$'+next_bid_formated+'<span>Current Bid</span>';
       }else{
       var bid_amt = '<span>Starting Bid</span>'+'$'+next_bid_formated;
       var auction_bid_amt = '$'+next_bid_formated+'<span>Starting Bid</span>';
       }

       $('#header_bid_price').html(bid_amt);
       $('#auction_starting_bid').html(auction_bid_amt);
  }else if(parseInt(asset_sale_type) == 4){
       //$('#starting_bid').show();
       //$('#next_bid').show();
       $('#bid_increment').show();
       $('#bid_count').show();
       //$('#bid_start_date').hide();
       //$('#bid_end_date').hide();
       var next_bid_formated = numberFormat(parseInt(start_bid));
       if(start_bid > parseInt(start_bid)){
        next_bid_formated = numberFormat(start_bid);
       }
       var bid_amt = '<span>Asking Price</span>'+'$'+next_bid_formated;
       var auction_bid_amt = '$'+next_bid_formated+'<span>Asking Price</span>';
       $('#header_bid_price').html(bid_amt);
       $('#auction_starting_bid').html(auction_bid_amt);
  }else{
        //$('#starting_bid').show();
       //$('#next_bid').hide();
       $('#bid_increment').show();
       $('#bid_count').hide();
       //$('#bid_start_date').show();
       //$('#bid_end_date').show();
       var start_bid_formated = numberFormat(parseInt(start_bid));
       if(start_bid > parseInt(start_bid)){
        start_bid_formated = numberFormat(start_bid);
       }
       if(parseInt(bid_count)>0 && today >= start_date_time){
        var bid_amt = '<span>Current Bid</span>'+'$'+start_bid_formated;
        var auction_bid_amt = '$'+start_bid_formated+'<span>Current Bid</span>';
       }else{
       var bid_amt = '<span>Starting Bid</span>'+'$'+start_bid_formated;
       var auction_bid_amt = '$'+start_bid_formated+'<span>Starting Bid</span>';
       }
       $('#header_bid_price').html(bid_amt);
       $('#auction_starting_bid').html(auction_bid_amt);
  }


  $('.overlay').hide();

}
function save_watch_list(element, property_id){
    $.ajax({
            url: '/save-watch-property/',
            type: 'post',
            dataType: 'json',
            cache: false,
            data: {'property': property_id},
            beforeSend: function(){

            },
            success: function(response){
                if(response.error == 0 && response.status == 200){
                    if($(element).find('span').hasClass('check') === true){
                        $(element).find('span').removeClass('check');
                        //property_id = property.toString();

                        $.growl.notice({title: "Watch Property ", message: "Removed from watch list", size: 'large'});
                    }else{
                        $(element).find('span').addClass('check');

                        $.growl.notice({title: "Watch Property ", message: "Added to watch list", size: 'large'});
                    }

                }else{
                    $.growl.error({title: "Watch Property ", message: response.msg, size: 'large'});
                }
            }
        });
}
function get_tour_person_details(tour_type){
        $.ajax({
            url: '/get-tour-person-details/',
            type: 'post',
            dataType: 'json',
            cache: false,
            beforeSend: function () {
                $(':submit').attr('disabled', 'disabled');
                $.blockUI({
                    message: '<h4>Please wait!</h4>'
                });
                try {
                    $("#person_tour_frm").validate().resetForm();   
                } catch (error) {
                    
                }
            },
            complete: function () {
                $.unblockUI();
                $(':submit').removeAttr('disabled');
            },
            success: function(response){
                $("#tour_type_checked").val(tour_type);
                $("input[name='tour_type'][value='" + tour_type + "']").prop("checked", true);
                $("#virtual_tour_date").val('');
                $("#tour_date").val('');
                $("#tour_date_local").val('');
                $("#tour_message").val('');
                $('#personModal').modal('show');
                if(response.error == 0){
                    $('#user_first_name').val(response.user_info_data.first_name);
                    $('#user_last_name').val(response.user_info_data.last_name);
                    $('#user_email').val(response.user_info_data.email);
                    $('#user_phone').val(response.user_info_data.phone_no);
                }else{
                    $('#user_first_name').val('');
                    $('#user_last_name').val('');
                    $('#user_email').val('');
                    $('#user_phone').val('');
                }
                /*else{
                    $('#tour_user_personal_info').empty();
                    $('#tour_user_personal_info').html(response.user_info_html);
                    window.setTimeout(function () {
                        $.growl.error({title: "Schedule Tour ", message: "Some error occurs, please try again", size: 'large'});
                    }, 2000);

                }*/

            }
        });
}
function track_advertisement(element, adv_id, adv_url, property_id){
    try{
        window.open('http://'+adv_url);
    }catch(ex){
        //console.log(ex);
    }
    data = {advertisement:adv_id,adv_url:adv_url,property_id:property_id};
    $.ajax({
        url: '/track-advertisement/',
        type: 'post',
        dataType: 'json',
        data: data,
        cache: false,
        success: function(response){

        }
    });


}
function view_document(property_id, upload_id, doc_id, doc_url){


    data = {document:doc_id,property_id:property_id,upload_id:upload_id,doc_url:doc_url};
    $.ajax({
        url: '/track-document-visitor/',
        type: 'post',
        dataType: 'json',
        data: data,
        cache: false,
        success: function(response){

        }
    });

}
function reset_tour_form(){
    var selected_tour_type = $('#tour_type_checked').val();
    document.getElementById("person_tour_frm").reset();

    $("input[name='tour_type'][value='" + selected_tour_type + "']").prop("checked", true);
}

function format_currency(element){
    var id = $(element).attr('id');
    if(parseInt($(element).val())){
        var x = parseInt($(element).val());

        x = x.toString();
        var pattern = /(-?\d+)(\d{3})/;
        while (pattern.test(x))
            x = x.replace(pattern, "$1,$2");
    }else{
        x = '';
    }

    $('#'+id).val(x);

}


function make_favourite_listing_details(property, element){
    $.ajax({
        url: '/make-favourite-listing/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {'property': property},
        beforeSend: function(){

        },
        success: function(response){
            if(response.error == 0 && response.status == 200){
                var element_id = $(element).attr('id');
                if($('#'+element_id).hasClass('active') == true){
                    //$(element).removeClass('active');
                    try{
                        $('#watch_property_btn').removeClass('active');
                        $('#favorite_property_btn').removeClass('active');
                    }catch(ex){
                        //console.log(ex);
                    }

                    $.growl.notice({title: "Listing ", message: "Removed from favorite listing", size: 'large'});
                }else{
                    try{

                        $('#watch_property_btn').addClass('active');
                        $('#favorite_property_btn').addClass('active');
                    }catch(ex){
                        //console.log(ex);
                    }
                    $.growl.notice({title: "Listing ", message: response.msg, size: 'large'});
                }

            }else{
                $.growl.error({title: "Listing ", message: response.msg, size: 'large'});
            }
        }
    });
}
function confirm_bid(){
    if($("#bidNowFrm").valid()){
        var amount = $('#new_bid_amt').val();
        amount = numberFormat(amount);
        $('#popup_bid_amt').html(amount);
        $('#confirm_bid_true').html('Confirm Bid of '+amount);
        $('#confirmBidModal').modal('show');
    }
}
function confirm_insider_bid(){
    if($("#insiderbidNowFrm").valid()){
        var amount = $('#insider_new_bid_amt').val();
        amount = numberFormat(amount);
        $('#popup_insider_bid_amt').html(amount);
        $('#confirm_insider_bid_true').html('Confirm Bid of '+amount);
        $('#confirmInsiderBidModal').modal('show');
    }
}
function confirm_dutch_bid(){
    var amount = $('#decreased_price').val();
    amount = numberFormat(amount);
    $('#popup_dutch_bid_amt').html(amount);
    $('#confirm_dutch_bid_true').html('Confirm Bid of '+amount);
    $('#confirmDutchBidModal').modal('show');
}

function change_timer_text(){

    var today = new Date().getTime();
    /*if(is_log_time_extension == 'True' && remain_time_to_add_extension != "" && log_time_extension != ""){

    }*/

    if(today < countDownDate){
        if(asset_sale_type && parseInt(asset_sale_type) == 7){
            $('#countdown_text').html('Offer Starts In <div class="tooltipPop"><i class="fas fa-info-circle"></i></div>');

        }else{
            $('#countdown_text').html('Bidding Starts In <div class="tooltipPop"><i class="fas fa-info-circle"></i></div>');
        }
    }else if(today >= countDownDate && today <= countDownEndDate){
        if(asset_sale_type && parseInt(asset_sale_type) == 7){
            $('#countdown_text').html('Offer Ends In <div class="tooltipPop"><i class="fas fa-info-circle"></i></div>');
        }else{
            $('#countdown_text').html('Bidding Ends In <div class="tooltipPop"><i class="fas fa-info-circle"></i></div>');
        }
    }else{
        $('#countdown_text').html('Auction Completed <div class="tooltipPop"><i class="fas fa-info-circle"></i></div>');
        $('#countdown_text').show();
    }
    //$('#countdown_tooltip').html('<div class="uparrow"></div><div class="popcontent">If any bids are placed within the last <b class="red-text">2</b> minutes of the auction, the clock will automatically be reset to <b class="red-text">5</b> minutes. Once the final <b class="red-text">2</b> minutes passes with no new bids placed the auction will end.</div>');
}
function increment_bid(bid_increment){
    if($('#new_bid_amt').val()){
        var bid_amt = $('#new_bid_amt').val();
    }else{
        var bid_amt = 0;
    }
    bid_amt = bid_amt.toString().replace('$', '').replace(/,/g, '');
    bid_increment = bid_increment.toString().replace('$', '').replace(/,/g, '');
    var new_val = parseInt(bid_amt) + parseInt(bid_increment);
    new_val = numberFormat(new_val);
    $('#new_bid_amt').val('$'+new_val);
}
function decrement_bid(bid_increment){
    if($('#new_bid_amt').val()){
        var bid_amt = $('#new_bid_amt').val();
    }else{
        var bid_amt = 0;
    }


    bid_amt = bid_amt.toString().replace('$', '').replace(/,/g, '');
    bid_increment = bid_increment.toString().replace('$', '').replace(/,/g, '');

    var new_val = parseInt(bid_amt) - parseInt(bid_increment);
    if(new_val <= 0){
        new_val = 0;
    }
    new_val = numberFormat(new_val);
    $('#new_bid_amt').val('$'+new_val);
}
function insider_increment_bid(){
    var bid_increment = $('#insider_increment_decrement_by').val();
    if($('#insider_new_bid_amt').val()){
        var bid_amt = $('#insider_new_bid_amt').val();
    }else{
        var bid_amt = 0;
    }
    bid_amt = bid_amt.toString().replace('$', '').replace(/,/g, '');
    bid_increment = bid_increment.toString().replace('$', '').replace(/,/g, '');
    var new_val = parseInt(bid_amt) + parseInt(bid_increment);
    new_val = numberFormat(new_val);
    $('#insider_new_bid_amt').val('$'+new_val);
}
function insider_decrement_bid(){
    var bid_increment = $('#insider_increment_decrement_by').val();
    var highest_bid_amount = parseInt($('#sealed_highest_bid_amount').val());
    if($('#insider_new_bid_amt').val()){
        var bid_amt = $('#insider_new_bid_amt').val();
    }else{
        var bid_amt = 0;
    }


    bid_amt = bid_amt.toString().replace('$', '').replace(/,/g, '');
    bid_increment = bid_increment.toString().replace('$', '').replace(/,/g, '');

    var new_val = parseInt(bid_amt) - parseInt(bid_increment);

    if(new_val < highest_bid_amount){
        new_val = $('#insider_new_bid_amt').val();
        new_val = new_val.toString().replace('$', '').replace(/,/g, '');
    }
    new_val = numberFormat(new_val);
    $('#insider_new_bid_amt').val('$'+new_val);
}

function scroll_to_section(element){
    $('html, body').animate({
        scrollTop: $("#"+element).offset().top - 110
    }, 1000);
}
function view_property_bids(property_id){
    $.ajax({
            url: '/get-property-bids/',
            type: 'post',
            dataType: 'json',
            cache: false,
            data: {'property': property_id},
            beforeSend: function(){
                $('.overlay').show();
            },
            success: function(data){
                $('.overlay').hide();

                if(data.error == 0){
                    $('#viewBidModal #bidder_list').html(data.bid_history_html);
                }else{
                    $('#viewBidModal #bidder_list').html('<td colspan="4"><img src="/static/admin/images/no-data-image.png" class=" center mb0" /></td>');
                }
                $('#viewBidModal #bidder_list').find('script').remove();
                $('#viewBidModal').modal('show');
            }
        });
}

function get_offer_details(property_id){
    $.ajax({
        url: '/get-offer-details/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {property_id:property_id},
        beforeSend: function () {
            $(':submit').attr('disabled', 'disabled');
            $.blockUI({
                message: '<h4>Please wait!</h4>'
            });
        },
        complete: function () {
            $.unblockUI();
            $(':submit').removeAttr('disabled');
        },
        success: function(response){
            $('p.error').hide();
            if(response.error == 0){
                data = response.data;
                var asking_price = '';
                var first_name = '';
                var last_name = '';
                var email = '';
                var phone_no = '';
                var address = '';
                var city = '';
                var state = '';
                var zip_code = '';
                if(data.asking_price){
                    asking_price = data.asking_price;
                    asking_price = numberFormat(asking_price);
                }
                if(data.user_detail.first_name){
                    first_name = data.user_detail.first_name;
                }
                if(data.user_detail.last_name){
                    last_name = data.user_detail.last_name;
                }
                if(data.user_detail.email){
                    email = data.user_detail.email;
                }
                if(data.user_detail.phone_no){
                    phone_no = data.user_detail.phone_no;
                }

                if(data.user_detail.address.address_first){
                    address = data.user_detail.address.address_first;
                }
                if(data.user_detail.address.city){
                    city = data.user_detail.address.city;
                }
                if(data.user_detail.address.state){
                    state = data.user_detail.address.state;
                }
                if(data.user_detail.address.postal_code){
                    zip_code = data.user_detail.address.postal_code;
                }
                $('#traditional_offer_frm #trad_first_name').val(first_name);
                $('#traditional_offer_frm #trad_last_name').val(last_name);
                $('#traditional_offer_frm #trad_email').val(email);
                $('#traditional_offer_frm #trad_phone').val(phone_no);
                $('#traditional_offer_frm #trad_asking_price').val(asking_price);
                $('#traditional_offer_frm #user_offer').val('$'+asking_price);

                $('#traditional_offer_frm #address_1').val(address);
                $('#traditional_offer_frm #city').val(city);
                $('#traditional_offer_frm #state').val(state);
                $('#traditional_offer_frm #zip_code').val(zip_code);
                $('#traditional_offer_frm #state').trigger("chosen:updated");

                $('#traditional_offer_frm #offer_comment').val('');
            }
            $('input[name="working_with_agent"]').prop('checked',false);
            $('input[name="trad_user_type"]').prop('checked',false);
            $('input[name="property_in_person"]').prop('checked',false);
            $('input[name="agent_property_in_person"]').prop('checked',false);
            $('input[name="buyer_pre_qualified"]').prop('checked',false);
            $('input[name="agent_pre_qualified"]').prop('checked',false);
            $('.buyer_question').hide();
            $('.working_with_agent_no_section').hide();
            $('.agent_question_section').hide();
            $('#edit_user_offer').show();
            $('#offer_doc_id').val('');
            $('#offer_doc_name').val('');
            $('#offerDocList').empty();
            $('#offerDocDiv').hide();
            $('#user_offer').prop('readonly', true);
            $('#traditionalOfferModal').modal('show');
        }
    });
}
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
        $('#offerDocFrm #offer_doc_id-error').hide();
        if(response.uploaded_file_list){
            var all_banner_images = '';
            var count = parseInt($('#offerDocList li').length);
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
                    var img_src = aws_url+"banner/"+item.file_name;
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
                }else if(item.file_name.indexOf('.docx') > 0){
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
                //$('#offerDocList').html('<li rel_id="'+item.upload_id+'" rel_position="'+count+'"><figure>'+icon+'</figure><figcaption><a href="javascript:void(0)" data-article-id="'+property_id+'" data-image-id="'+item.upload_id+'" data-image-name="'+item.file_name+'" data-image-section="'+item.upload_to+'"  class="close-btn confirm_offer_document_delete"><i class="fas fa-times"></i></a><h6>'+original_doc_name+'</h6><p>File Size: '+item.file_size+'<br>Uploaded: '+timeStp+'</p></figcaption></li>');
                /*if(ext == 'jpeg'){
                    $('#offerDocList').append('<li rel_id="'+item.upload_id+'" rel_position="'+count+'"><a href="javascript:void(0)" data-article-id="'+property_id+'" data-image-id="'+item.upload_id+'" data-image-name="'+item.file_name+'" data-image-section="'+item.upload_to+'"  class="close-btn confirm_offer_document_delete"><i class="fas fa-times"></i></a><img src="'+img_src+'" alt=""><figcaption><h6>'+original_doc_name+'</h6><p>File Size: '+item.file_size+' <br>Uploaded: '+timeStp+'</p></figcaption></li>');
                }else{
                    $('#offerDocList').append('<li rel_id="'+item.upload_id+'" rel_position="'+count+'"><figure>'+icon+'</figure><figcaption><a href="javascript:void(0)" data-article-id="'+property_id+'" data-image-id="'+item.upload_id+'" data-image-name="'+item.file_name+'" data-image-section="'+item.upload_to+'"  class="close-btn confirm_offer_document_delete"><i class="fas fa-times"></i></a><h6>'+original_doc_name+'</h6><p>File Size: '+item.file_size+'<br>Uploaded: '+timeStp+'</p></figcaption></li>');
                }*/
                $('#offerDocList').append('<li rel_id="'+item.upload_id+'" rel_position="'+count+'"><figure>'+icon+'</figure><figcaption><h6>'+original_doc_name+'</h6><p>File Size: '+item.file_size+'<br>Uploaded: '+timeStp+'</p><div class="actions-btn"><div class="badge-success"><i class="fas fa-check-circle"></i></div><a href="javascript:void(0)" data-article-id="'+property_id+'" data-image-id="'+item.upload_id+'" data-image-name="'+item.file_name+'" data-image-section="'+item.upload_to+'"  class="close-btn confirm_offer_document_delete"><i class="fas fa-times"></i></a></div></figcaption></li>');


            });
            /*image_name = image_name;
            upload_id = upload_id;
            actual_image = image_name;
            actual_id = upload_id;
            $('#offer_doc_name').val(actual_image);
            $('#offer_doc_id').val(actual_id);
            $('#offerDocDiv').show();*/
            image_name = image_name+','+property_doc_name;
            upload_id = upload_id+','+property_doc_id;
            actual_image = image_name.replace(/(^,)|(,$)/g, "");
            actual_id = upload_id.replace(/(^,)|(,$)/g, "");
            $('#offer_doc_name').val(actual_image);
            $('#offer_doc_id').val(actual_id);
            $('#offerDocDiv').show();
        }
    }
}

function set_chat_to_agent_details(response){
    var image_name = '';
    var upload_id = '';
    var actual_image = '';
    var actual_id = '';
    var property_doc_id = $('#chat_doc_id').val();
    var property_doc_name = $('#chat_doc_name').val();
    var property_id = $('#property_id').val();
    if(response.status == 200){
        $('#custom_chat_doc_error').hide();
        $('#bidderDocFrm #chat_doc_id-error').hide();
        if(response.uploaded_file_list){
            var count = parseInt($('#bidderDocList li').length);
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
                if(item.upload_date){
                    try{
                        var upload_date = new Date(item.upload_date);
                        var month = upload_date.toLocaleString('default', { month: 'short' });
                        var year = upload_date.getFullYear();

                        var dt = (upload_date.getDate() < 10)?'0'+upload_date.getDate():upload_date.getDate();
                        var hrs = (upload_date.getHours() < 10)?'0'+upload_date.getHours():upload_date.getHours();
                        var mins = (upload_date.getMinutes() < 10)?'0'+upload_date.getMinutes():upload_date.getMinutes();
                        var secs = (upload_date.getSeconds() < 10)?'0'+upload_date.getSeconds():upload_date.getSeconds();
                        var timeStp = '';
                        var mer = (parseInt(hrs) >= 12)?'p.m':'a.m';
                        hrs = parseInt(hrs) % 12;
                        hrs = (hrs)?hrs:12;
                        timeStp = month +" "+dt+", "+year+" "+hrs+":"+mins+""+mer;

                    }catch(ex){
                        var timeStp = '';
                    }
                }

                //$('#bidderDocList').append('<li rel_id="'+item.upload_id+'" rel_position="'+count+'"><figure><a href="javascript:void(0)" data-article-id="'+property_id+'" data-image-id="'+item.upload_id+'" data-image-name="'+item.file_name+'" data-image-section="'+item.upload_to+'"  class="close-btn confirm_image_delete"><i class="fas fa-times"></i></a><img src="/static/admin/images/pdf.png" alt=""></figure><figcaption><h6>'+item.file_name+'</h6><p>File Size: '+item.file_size+'<br>Uploaded: '+timeStp+'</p><div class="move"><i class="fas fa-expand-arrows-alt"></i> Move</div></figcaption></li>');
                ext = '';
                if(item.file_name.indexOf('.pdf') > 0){
                    //icon = '/static/admin/images/pdf.png';
                    icon = "<i class='fas fa-file-pdf'></i>";
                    ext = '.pdf';
                }else if(item.file_name.indexOf('.docx') > 0){
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
                //$('#offerDocList').html('<li rel_id="'+item.upload_id+'" rel_position="'+count+'"><figure>'+icon+'</figure><figcaption><a href="javascript:void(0)" data-article-id="'+property_id+'" data-image-id="'+item.upload_id+'" data-image-name="'+item.file_name+'" data-image-section="'+item.upload_to+'"  class="close-btn confirm_offer_document_delete"><i class="fas fa-times"></i></a><h6>'+original_doc_name+'</h6><p>File Size: '+item.file_size+'<br>Uploaded: '+timeStp+'</p></figcaption></li>');
                /*if(ext == 'jpeg'){
                    $('#offerDocList').append('<li rel_id="'+item.upload_id+'" rel_position="'+count+'"><a href="javascript:void(0)" data-article-id="'+property_id+'" data-image-id="'+item.upload_id+'" data-image-name="'+item.file_name+'" data-image-section="'+item.upload_to+'"  class="close-btn confirm_offer_document_delete"><i class="fas fa-times"></i></a><img src="'+img_src+'" alt=""><figcaption><h6>'+original_doc_name+'</h6><p>File Size: '+item.file_size+' <br>Uploaded: '+timeStp+'</p></figcaption></li>');
                }else{
                    $('#offerDocList').append('<li rel_id="'+item.upload_id+'" rel_position="'+count+'"><figure>'+icon+'</figure><figcaption><a href="javascript:void(0)" data-article-id="'+property_id+'" data-image-id="'+item.upload_id+'" data-image-name="'+item.file_name+'" data-image-section="'+item.upload_to+'"  class="close-btn confirm_offer_document_delete"><i class="fas fa-times"></i></a><h6>'+original_doc_name+'</h6><p>File Size: '+item.file_size+'<br>Uploaded: '+timeStp+'</p></figcaption></li>');
                }*/
                $('#bidderDocList').append('<li rel_id="'+item.upload_id+'" rel_position="'+count+'"><figure>'+icon+'</figure><figcaption><h6>'+original_doc_name+'</h6><p>File Size: '+item.file_size+'<br>Uploaded: '+timeStp+'</p><div class="actions-btn"><div class="badge-success"><i class="fas fa-check-circle"></i></div><a href="javascript:void(0)" data-article-id="'+property_id+'" data-image-id="'+item.upload_id+'" data-image-name="'+item.file_name+'" data-image-section="'+item.upload_to+'"  class="close-btn confirm_offer_document_delete"><i class="fas fa-times"></i></a></div></figcaption></li>');


            });
            image_name = image_name+','+property_doc_name;
            upload_id = upload_id+','+property_doc_id;
            actual_image = image_name.replace(/(^,)|(,$)/g, "");
            actual_id = upload_id.replace(/(^,)|(,$)/g, "");
            $('#chat_doc_name').val(actual_image);
            $('#chat_doc_id').val(actual_id);
            $('#bidderDocDiv').show();
        }
    }
}

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
                $('#counter_offer_frm #counter_offer_comment').val('');


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
            $('#best_counter_offer_comment').val("");

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
            //$('#sellerCounterOfferDetailModal').modal('hide');
            $('#newcounterOfferModal').modal('show');
        }
    });

}
function viewOfferDetails(property_id){
    $.ajax({
        url: '/property-offer-details/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {'property_id': property_id,'from_page':'asset_details'},
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
                    $('#confirmAcceptBestOfferModal').modal('hide');
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
function confirm_buyer_accept_best_offer(property_id,negotiated_id){
    $('#accept_best_property_id').val(property_id);
    $('#accept_best_negotiated_id').val(negotiated_id);
    $('#confirmAcceptBestOfferModal').modal('show');
}
function confirm_buyer_reject_best_offer(property_id,negotiated_id){
    $('#rej_best_property_id').val(property_id);
    $('#rej_best_negotiated_id').val(negotiated_id);
    $('#best_reject_reason').val('');
    $('#confirmRejectBestOfferModal').modal('show');
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
function fb_share(link, desc, page_title, image){
  var appId= '1218187165258212';
  var pageURL = 'https://www.facebook.com/dialog/feed?app_id='+appId+'&&link='+link+'&&v=1';
  var w = 600;
  var h = 400;
  var left = (screen.width / 2) - (w / 2);
  var top = (screen.height / 2) - (h / 2);

  //window.open(pageURL,page_title,'toolbar=no, location=no, directories=no, status=no, menubar=yes, scrollbars=no, resizable=no, copyhistory=no, width='+800+',height='+650+', top='+top+', left='+left);
  window.open('http://www.facebook.com/sharer.php?s=100&p[title]=' + page_title + '&p[summary]=' + desc + '&p[url]=' + link + '&p[images][0]=' + image, 'sharer'+'target=_blank');
  return false;

}
function set_offer_address_by_zipcode(response){
        var city = '';
        try{
            var zip_state_iso_code = response.state.toLowerCase();
        }catch(ex){
            //console.log(ex);
            var zip_state_iso_code = '';
        }

        $('#traditional_offer_frm #state > option').each(function() {
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
        $('#traditional_offer_frm #state').trigger("chosen:updated");
        if(response.city){
            city = response.city;
        }
        $('#traditional_offer_frm #city').val(city);
        try{
            $('#traditional_offer_frm #city-error').hide();
        }catch(ex){
            //console.log(ex);
        }
        try{
            $('#traditional_offer_frm #state-error').hide();
        }catch(ex){
            //console.log(ex);
        }
    }

function viewBestOfferDetails(property_id){
    $.ajax({
        url: '/property-best-offer-details/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {'property_id': property_id,'from_page':'asset_details'},
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
function delete_user_bid(user_id,property_id){
    if(user_id){
        $('#confirmDeleteBidModal').modal('show');
    }

}
function viewCurrentBestOffer(property_id){

    $.ajax({
        url: '/current-best-offer-details/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {'property_id': property_id},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            $("#highest_offer_price").html('NA');
            $("#highest_earnest_deposit").html('NA');
            $("#highest_down_payment").html('NA');
            $("#highest_loan_type").html('NA');
            $("#highest_due_diligence").html('NA');
            $("#highest_financing_contingency").html('NA');
            $("#highest_appraisal_contingency").html('NA');
            $("#highest_sale_contigency").html('NA');
            $("#highest_closing_date").html('NA');
            $("#highest_closing_cost").html('NA');
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
            if(response.error == 0){
                if(response.data.offer_price){
                    offer_price = response.data.offer_price;
                    offer_price = numberFormat(offer_price);
                    $("#highest_offer_price").html('$'+offer_price);
                }
                if(response.data.earnest_money_deposit){
                    earnest_money_deposit = response.data.earnest_money_deposit;
                    earnest_money_deposit = numberFormat(earnest_money_deposit);
                    earnest_money_deposit_percent = response.data.earnest_money_deposit_percent;
                    $("#highest_earnest_deposit").html('$'+earnest_money_deposit+' or '+earnest_money_deposit_percent+' %');
                }
                if(response.data.down_payment){
                    down_payment = response.data.down_payment;
                    down_payment = numberFormat(down_payment);
                    $("#highest_down_payment").html('$'+down_payment);
                }
                if(response.data.loan_type){
                    loan_type = response.data.loan_type;
                    $("#highest_loan_type").html(loan_type);
                }

                if(response.data.due_diligence){
                    due_diligence = response.data.due_diligence;
                    $("#highest_due_diligence").html(due_diligence);
                }
                if(response.data.offer_contingent){
                    offer_contingent = response.data.offer_contingent;
                    $("#highest_financing_contingency").html(offer_contingent);
                }
                if(response.data.appraisal_contingent){
                    appraisal_contingent = response.data.appraisal_contingent;
                    $("#highest_appraisal_contingency").html(appraisal_contingent);
                }
                if(response.data.sale_contingency){
                    sale_contingency = response.data.sale_contingency;
                    $("#highest_sale_contigency").html(sale_contingency);
                }
                if(response.data.closing_cost){
                    closing_cost = response.data.closing_cost;
                    $("#highest_closing_cost").html(closing_cost);
                }
                if(response.data.closing_date){
                    closing_date = response.data.closing_date;
                    $("#highest_closing_date").html(closing_date);
                }
            }
            $("#viewCurrentOfferModal").modal('show');
        }
    });
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
            $("#seller_counter_msg").html('');
            $('#seller_offer_price').val('$');
            if(parseInt(response.data.earnest_deposit_type) == 1){
                $('#seller_earnest_deposit').attr('maxlength',14);
                $('#seller_earnest_deposit').val('$');
            }else{
                $('#seller_earnest_deposit').attr('maxlength',6).attr('max',100);
                $('#seller_earnest_deposit').val('');
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
            var property_id = '';
            var negotiated_id = '';
            var comments = '';
            if(response.error == 0){
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
                $('#seller_offer_btns').html('<button class="btn btn-green" id="accept_seller_offer" onclick="confirm_buyer_accept_best_offer(\''+property_id+'\',\''+negotiated_id+'\')">Accept Offer</button><button class="btn btn-primary-black" id="counter_seller_offer" onclick="counter_best_offer(\''+property_id+'\',\''+negotiated_id+'\')">Counter Back</button><button class="btn btn-secondary" id="reject_seller_offer" onclick="confirm_buyer_reject_best_offer(\''+property_id+'\',\''+negotiated_id+'\')">Decline Offer</button>');
            }else{
                $.growl.error({title: "Offer ", message: response.msg, size: 'large'});
            }
            $('#sellerCounterOfferDetailModal').modal('show');
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


$("#traditional_country").change(function(){
    $("#state").empty().append("<option value=''>Select</option>");
    $("#address_1").val("");
    $("#zip_code").val("");
    $("#city").val("");
    state_list_update("traditional_country", "state");
});