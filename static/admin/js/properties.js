var currpage = 1;
var recordPerpage = 10;
$(document).ready(function(){
    $.validator.setDefaults({ ignore: ":hidden:not(select)" })
    $('.select').chosen();
    try{
        CKEDITOR.env.isCompatible = true;
    }catch(ex){
        console.log("cked: "+ex);
    }

    try{
        CKEDITOR.on( 'instanceReady', function(e) {
            $('iframe', e.editor.container.$).contents().on('click', function() {
                e.editor.focus();
            });
        });
    }catch(ex){
        //console.log(ex);
    }
    //$('#insiderbidderrecordModal').modal('show');
    init_auction_start_date();
    init_auction_end_date();
    //convert_insider_auction_date();

    $('.open_house_start').each(function(index){
        init_open_house_start_date(index);
    });
    $('.open_house_end').each(function(index){
        init_open_house_end_date(index);
    });
    $('.insider_dates').each(function(index){
        var virtual_element_id = '';
        var date_element = '';
        var date_value = '';
        virtual_element_id = $(this).find('input:first').attr('id');
        date_element = $(this).find('input:last').attr('id');
        date_value = $(this).attr('data-value');
        if(date_value != ""){
            try{
                var virtual_date = getLocalDate(date_value, 'mm-dd-yyyy','ampm');
                var actualStartDate = virtual_date.split(" ");
                var mdy_format = actualStartDate[0].split("-");
                mdy_date = mdy_format[2]+"-"+mdy_format[0]+"-"+mdy_format[1];
                actualStartDate = mdy_date+' '+convert_to_24h(actualStartDate[1]+' '+actualStartDate[2]);
                var utc_date = convert_to_utc_datetime(actualStartDate, 'datetime');

                $('#'+virtual_element_id).val(virtual_date);
                $("#"+date_element+"_local").val('');
                $("#"+date_element+"_local").val(actualStartDate);
                $("#"+date_element).val('');
                $("#"+date_element).val(utc_date);
            }catch(ex){
                /*$('#'+virtual_element_id).val('');
                $("#"+date_element+"_local").val('');
                $("#"+date_element).val('');*/
                console.log(ex);
            }
        }

    });
    $('#counter_offer_frm #offer_price,#counter_best_offer_frm #offer_price,#property_info_frm #bidding_min_price,#property_info_frm #reserve_amount,#property_info_frm #bid_increments,#property_info_frm #insider_bid_increment, #buyers_premium_min_amount, #deposit_amount').on('input',function(e){
        $(this).val(function (index, value) {
            if(value == "$" || value == ""){
                return "";
            }else{
                //return '$' + value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                return '$' + value.replace(/(?!\.)\D/g, "").replace(/(?<=\..*)\./g, "").replace(/(?<=\.\d\d).*/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
        });

    });

    $('#buyers_premium_percentage').on('input',function(e){
        $(this).val(function (index, value) {
            return value.replace(/(?!\.)\D/g, "").replace(/(?<=\..*)\./g, "").replace(/(?<=\.\d\d).*/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        });
    });

    $('#buyers_premium').on('change',function(){
        if(parseInt($(this).val()) == 0){
            $(".action_section").hide();
        }else{
            $(".action_section").show();
        }
    });

    $('#is_deposit_required').on('change',function(){
        if(parseInt($(this).val()) == 0){
            $(".deposit_amount_section").hide();
        }else{
            $(".deposit_amount_section").show();
        }
    });

    $('#property_info_frm #insider_start_price').on('input',function(e){
        $(this).val(function (index, value) {
            if(value == "$" || value == ""){
                $('#price_decrease_value').html('$0');
                return "";

            }else{
                //return '$' + value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                var input_value =  '$' + value.replace(/(?!\.)\D/g, "").replace(/(?<=\..*)\./g, "").replace(/(?<=\.\d\d).*/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                try{
                    if($('#price_decrease_rate').val() != "" && parseInt($('#price_decrease_rate').val()) != 0){
                        var start_price = parseFloat(input_value.replace('$','').replace(/,/g, ''));
                        var decrease_rate = parseFloat($('#price_decrease_rate').val());
                        var decrease_value = (start_price - ((start_price*decrease_rate)/100));
                        decrease_value = decrease_value.toFixed(2);
                        if(decrease_value > parseInt(decrease_value)){
                            decrease_value = numberFormat(decrease_value);
                        }else{
                            decrease_value = numberFormat(parseInt(decrease_value));
                        }
                        $('#price_decrease_value').html('$'+decrease_value);
                    }else{
                        $('#price_decrease_value').html(input_value);
                    }
                }catch(ex){

                }
                return input_value;
            }
        });

    });
    $('#property_info_frm #price_decrease_rate').on('input',function(e){
        $(this).val(function (index, value) {

            var input_value =  $('#insider_start_price').val();
            if(input_value != "" && (value == "" || value == 0)){
                $('#price_decrease_value').html(input_value);
            }else{
                try{
                    if(value != "" && parseInt(value) != 0){
                        var start_price = parseFloat(input_value.replace('$','').replace(/,/g, ''));
                        var decrease_rate = parseFloat(value);
                        var decrease_value = (start_price - ((start_price*decrease_rate)/100));
                        decrease_value = decrease_value.toFixed(2);
                        if(decrease_value > parseInt(decrease_value)){
                            decrease_value = numberFormat(decrease_value);
                        }else{
                            decrease_value = numberFormat(parseInt(decrease_value));
                        }
                        $('#price_decrease_value').html('$'+decrease_value);
                    }else{
                        $('#price_decrease_value').html(input_value);
                    }
                }catch(ex){

                }
            }
            return value;

        });

    });
    $('#earnest_deposit').on('input',function(e){
        var deposit_type = $('input[name="earnest_deposit_type"]:checked').val()
        $(this).val(function (index, value) {
            if(parseInt(deposit_type) == 1){
                if(value == "$"){
                    return "";
                }else{
                    //return '$' + value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                    return '$' + value.replace(/(?!\.)\D/g, "").replace(/(?<=\..*)\./g, "").replace(/(?<=\.\d\d).*/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                }
            }else{
                return value;
            }

        });

    });


    $('#property_info_frm #dutch_auction_time').on('input',function(e){

        $(this).val(function (index, value) {
            if(value != ""){
                $('#dutch_auction_time_value').html(value+' Min');
            }else{
                $('#dutch_auction_time_value').html('10 Min');
            }

            var dates = $('#virtual_dutch_bidding_start_date').val();
            if(value != "" && dates != ""){
                var actualStartDate = dates.split(" ");
                var mdy_format = actualStartDate[0].split("-");
                mdy_date = mdy_format[2]+"-"+mdy_format[0]+"-"+mdy_format[1];
                actualStartDate = mdy_date+' '+convert_to_24h(actualStartDate[1]+' '+actualStartDate[2]);
                var utc_date = convert_to_utc_datetime(actualStartDate, 'datetime');
                $("#dutch_bidding_start_date_local").val(actualStartDate);
                $("#dutch_bidding_start_date").val(utc_date);
                try{
                   custom_response = {
                    'add_min': value,
                    'actualStartDate': actualStartDate,
                    'date_virtual_element_id': '#virtual_dutch_bidding_end_date',
                    'date_local_element_id': '#dutch_bidding_end_date_local',
                    'date_utc_element_id': '#dutch_bidding_end_date',
                  };
                  customCallBackFunc(calculate_insider_dates, [custom_response]);
                }catch(ex){
                    //console.log(ex);
                }
                var dutch_pause_time =  $('#property_info_frm #dutch_pause_time').val();
                var dutch_end_date = $('#dutch_bidding_end_date_local').val();
                if(dutch_pause_time != "" && dutch_end_date != ""){
                    try{
                       custom_response = {
                        'add_min': dutch_pause_time,
                        'actualStartDate': dutch_end_date,
                        'date_virtual_element_id': '#virtual_sealed_bidding_start_date',
                        'date_local_element_id': '#sealed_bidding_start_date_local',
                        'date_utc_element_id': '#sealed_bidding_start_date',
                      };
                      customCallBackFunc(calculate_insider_dates, [custom_response]);
                    }catch(ex){
                        //console.log(ex);
                    }
                }
                var sealed_auction_time = $('#property_info_frm #sealed_auction_time').val();
                var sealed_start_date = $('#sealed_bidding_start_date_local').val();
                if(sealed_auction_time != "" && sealed_start_date != ""){
                    try{
                       custom_response = {
                        'add_min': sealed_auction_time,
                        'actualStartDate': sealed_start_date,
                        'date_virtual_element_id': '#virtual_sealed_bidding_end_date',
                        'date_local_element_id': '#sealed_bidding_end_date_local',
                        'date_utc_element_id': '#sealed_bidding_end_date',
                      };
                      customCallBackFunc(calculate_insider_dates, [custom_response]);
                    }catch(ex){
                        //console.log(ex);
                    }
                }
                var sealed_pause_time = $('#property_info_frm #sealed_pause_time').val();
                var sealed_end_date = $('#sealed_bidding_end_date_local').val();
                if(sealed_pause_time != "" && sealed_end_date != ""){
                    try{
                       custom_response = {
                        'add_min': sealed_pause_time,
                        'actualStartDate': sealed_end_date,
                        'date_virtual_element_id': '#virtual_english_bidding_start_date',
                        'date_local_element_id': '#english_bidding_start_date_local',
                        'date_utc_element_id': '#english_bidding_start_date',
                      };
                      customCallBackFunc(calculate_insider_dates, [custom_response]);
                    }catch(ex){
                        //console.log(ex);
                    }
                }
                var english_auction_time = $('#property_info_frm #english_auction_time').val();
                var english_start_date = $('#english_bidding_start_date_local').val();
                if(english_auction_time != "" && english_start_date != ""){
                    try{
                       custom_response = {
                        'add_min': english_auction_time,
                        'actualStartDate': english_start_date,
                        'date_virtual_element_id': '#virtual_english_bidding_end_date',
                        'date_local_element_id': '#english_bidding_end_date_local',
                        'date_utc_element_id': '#english_bidding_end_date',
                      };
                      customCallBackFunc(calculate_insider_dates, [custom_response]);
                    }catch(ex){
                        //console.log(ex);
                    }
                }
            }

            return value;
        });

    });
    $('#property_info_frm #dutch_pause_time').on('input',function(e){
        $(this).val(function (index, value) {
            if(value != ""){
                $('#dutch_pause_time_value').html(value+' Min');
            }else{
                $('#dutch_pause_time_value').html('0 Min');
            }
            var dates = $('#virtual_dutch_bidding_end_date').val();
            if(value != "" && dates != ""){
                var actualStartDate = dates.split(" ");
                var mdy_format = actualStartDate[0].split("-");
                mdy_date = mdy_format[2]+"-"+mdy_format[0]+"-"+mdy_format[1];
                actualStartDate = mdy_date+' '+convert_to_24h(actualStartDate[1]+' '+actualStartDate[2]);
                var utc_date = convert_to_utc_datetime(actualStartDate, 'datetime');
                $("#dutch_bidding_end_date_local").val(actualStartDate);
                $("#dutch_bidding_end_date").val(utc_date);
                try{
                   custom_response = {
                    'add_min': value,
                    'actualStartDate': actualStartDate,
                    'date_virtual_element_id': '#virtual_sealed_bidding_start_date',
                    'date_local_element_id': '#sealed_bidding_start_date_local',
                    'date_utc_element_id': '#sealed_bidding_start_date',
                  };
                  customCallBackFunc(calculate_insider_dates, [custom_response]);
                }catch(ex){
                    //console.log(ex);
                }

                var sealed_auction_time = $('#property_info_frm #sealed_auction_time').val();
                var sealed_start_date = $('#sealed_bidding_start_date_local').val();
                if(sealed_auction_time != "" && sealed_start_date != ""){
                    try{
                       custom_response = {
                        'add_min': sealed_auction_time,
                        'actualStartDate': sealed_start_date,
                        'date_virtual_element_id': '#virtual_sealed_bidding_end_date',
                        'date_local_element_id': '#sealed_bidding_end_date_local',
                        'date_utc_element_id': '#sealed_bidding_end_date',
                      };
                      customCallBackFunc(calculate_insider_dates, [custom_response]);
                    }catch(ex){
                        //console.log(ex);
                    }
                }
                var sealed_pause_time = $('#property_info_frm #sealed_pause_time').val();
                var sealed_end_date = $('#sealed_bidding_end_date_local').val();
                if(sealed_pause_time != "" && sealed_end_date != ""){
                    try{
                       custom_response = {
                        'add_min': sealed_pause_time,
                        'actualStartDate': sealed_end_date,
                        'date_virtual_element_id': '#virtual_english_bidding_start_date',
                        'date_local_element_id': '#english_bidding_start_date_local',
                        'date_utc_element_id': '#english_bidding_start_date',
                      };
                      customCallBackFunc(calculate_insider_dates, [custom_response]);
                    }catch(ex){
                        //console.log(ex);
                    }
                }
                var english_auction_time = $('#property_info_frm #english_auction_time').val();
                var english_start_date = $('#english_bidding_start_date_local').val();
                if(english_auction_time != "" && english_start_date != ""){
                    try{
                       custom_response = {
                        'add_min': english_auction_time,
                        'actualStartDate': english_start_date,
                        'date_virtual_element_id': '#virtual_english_bidding_end_date',
                        'date_local_element_id': '#english_bidding_end_date_local',
                        'date_utc_element_id': '#english_bidding_end_date',
                      };
                      customCallBackFunc(calculate_insider_dates, [custom_response]);
                    }catch(ex){
                        //console.log(ex);
                    }
                }
            }
            return value;
        });

    });
    $('#property_info_frm #sealed_auction_time').on('input',function(e){
        $(this).val(function (index, value) {
            if(value != ""){
                $('#sealed_auction_time_value').html(value+' Min');
            }else{
                $('#sealed_auction_time_value').html('0 Min');
            }
            var dates = $('#virtual_sealed_bidding_start_date').val();
            if(value != "" && dates != ""){
                var actualStartDate = dates.split(" ");
                var mdy_format = actualStartDate[0].split("-");
                mdy_date = mdy_format[2]+"-"+mdy_format[0]+"-"+mdy_format[1];
                actualStartDate = mdy_date+' '+convert_to_24h(actualStartDate[1]+' '+actualStartDate[2]);
                var utc_date = convert_to_utc_datetime(actualStartDate, 'datetime');
                $("#sealed_bidding_start_date_local").val(actualStartDate);
                $("#sealed_bidding_start_date").val(utc_date);
                try{
                   custom_response = {
                    'add_min': value,
                    'actualStartDate': actualStartDate,
                    'date_virtual_element_id': '#virtual_sealed_bidding_end_date',
                    'date_local_element_id': '#sealed_bidding_end_date_local',
                    'date_utc_element_id': '#sealed_bidding_end_date',
                  };
                  customCallBackFunc(calculate_insider_dates, [custom_response]);
                }catch(ex){
                    //console.log(ex);
                }

                var sealed_pause_time = $('#property_info_frm #sealed_pause_time').val();
                var sealed_end_date = $('#sealed_bidding_end_date_local').val();
                if(sealed_pause_time != "" && sealed_end_date != ""){
                    try{
                       custom_response = {
                        'add_min': sealed_pause_time,
                        'actualStartDate': sealed_end_date,
                        'date_virtual_element_id': '#virtual_english_bidding_start_date',
                        'date_local_element_id': '#english_bidding_start_date_local',
                        'date_utc_element_id': '#english_bidding_start_date',
                      };
                      customCallBackFunc(calculate_insider_dates, [custom_response]);
                    }catch(ex){
                        //console.log(ex);
                    }
                }
                var english_auction_time = $('#property_info_frm #english_auction_time').val();
                var english_start_date = $('#english_bidding_start_date_local').val();
                if(english_auction_time != "" && english_start_date != ""){
                    try{
                       custom_response = {
                        'add_min': english_auction_time,
                        'actualStartDate': english_start_date,
                        'date_virtual_element_id': '#virtual_english_bidding_end_date',
                        'date_local_element_id': '#english_bidding_end_date_local',
                        'date_utc_element_id': '#english_bidding_end_date',
                      };
                      customCallBackFunc(calculate_insider_dates, [custom_response]);
                    }catch(ex){
                        //console.log(ex);
                    }
                }
            }
            return value;
        });

    });
    $('#property_info_frm #sealed_pause_time').on('input',function(e){
        $(this).val(function (index, value) {
            if(value != ""){
                $('#sealed_pause_time_value').html(value+' Min');
            }else{
                $('#sealed_pause_time_value').html('0 Min');
            }
            var dates = $('#virtual_sealed_bidding_end_date').val();
            if(value != "" && dates != ""){
                var actualStartDate = dates.split(" ");
                var mdy_format = actualStartDate[0].split("-");
                mdy_date = mdy_format[2]+"-"+mdy_format[0]+"-"+mdy_format[1];
                actualStartDate = mdy_date+' '+convert_to_24h(actualStartDate[1]+' '+actualStartDate[2]);
                var utc_date = convert_to_utc_datetime(actualStartDate, 'datetime');
                $("#sealed_bidding_end_date_local").val(actualStartDate);
                $("#sealed_bidding_end_date").val(utc_date);
                try{
                   custom_response = {
                    'add_min': value,
                    'actualStartDate': actualStartDate,
                    'date_virtual_element_id': '#virtual_english_bidding_start_date',
                    'date_local_element_id': '#english_bidding_start_date_local',
                    'date_utc_element_id': '#english_bidding_start_date',
                  };
                  customCallBackFunc(calculate_insider_dates, [custom_response]);
                }catch(ex){
                    //console.log(ex);
                }

                var english_auction_time = $('#property_info_frm #english_auction_time').val();
                var english_start_date = $('#english_bidding_start_date_local').val();
                if(english_auction_time != "" && english_start_date != ""){
                    try{
                       custom_response = {
                        'add_min': english_auction_time,
                        'actualStartDate': english_start_date,
                        'date_virtual_element_id': '#virtual_english_bidding_end_date',
                        'date_local_element_id': '#english_bidding_end_date_local',
                        'date_utc_element_id': '#english_bidding_end_date',
                      };
                      customCallBackFunc(calculate_insider_dates, [custom_response]);
                    }catch(ex){
                        //console.log(ex);
                    }
                }
            }
            return value;
        });

    });
    $('#property_info_frm #english_auction_time').on('input',function(e){
        $(this).val(function (index, value) {
            if(value != ""){
                $('#english_auction_time_value').html(value+' Min');
            }else{
                $('#english_auction_time_value').html('0 Min');
            }
            var dates = $('#virtual_english_bidding_start_date').val();
            if(value != "" && dates != ""){
                var actualStartDate = dates.split(" ");
                var mdy_format = actualStartDate[0].split("-");
                mdy_date = mdy_format[2]+"-"+mdy_format[0]+"-"+mdy_format[1];
                actualStartDate = mdy_date+' '+convert_to_24h(actualStartDate[1]+' '+actualStartDate[2]);
                var utc_date = convert_to_utc_datetime(actualStartDate, 'datetime');
                $("#english_bidding_start_date_local").val(actualStartDate);
                $("#english_bidding_start_date").val(utc_date);
                try{
                   custom_response = {
                    'add_min': value,
                    'actualStartDate': actualStartDate,
                    'date_virtual_element_id': '#virtual_english_bidding_end_date',
                    'date_local_element_id': '#english_bidding_end_date_local',
                    'date_utc_element_id': '#english_bidding_end_date',
                  };
                  customCallBackFunc(calculate_insider_dates, [custom_response]);
                }catch(ex){
                    //console.log(ex);
                }
            }
            return value;
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
    $(document).on('click', '#close_declined_offer_top,#close_declined_offer', function(){
        $('#offerDeclinedModal').modal('hide');
    });
    $(document).on('click', '#close_offer_history_detail_popup_top,#close_offer_history_detail_popup', function(){
        $('#newOfferHistoryDetailModal').modal('hide');
    });
    $('.open_house_start').on('dp.change',function(e){
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
            try{
                var count_index = $(this).closest('.add_more_open_house_date').attr('rel_position');
                count_index = count_index.toString();
                $('#virtual_open_house_end_date_'+count_index).val('');
                $('#open_house_end_date_local_'+count_index).val('');
                $('#open_house_end_date_'+count_index).val('');
                var new_date = actualStartDate.split(" ");

                var newStartDate = new_date[0];

                var new_min_date = new Date(actualStartDate);
                var new_max_date = new Date(newStartDate+' 23:59:59');
                min_max_date(new_min_date, new_max_date, count_index);


            }catch(ex){
                //console.log(ex);
            }

          }
      });
      $('#datetimepicker1').on('dp.change',function(e){
          var virtual_date_element = $(this).find('input:first').attr('id');
          var date_element = $(this).find('input:last').attr('id');
          var dates = $("#"+virtual_date_element).val();
           var auction_type = $('option:selected','#auction_type').val();
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
            if(auction_type != "" && parseInt(auction_type) == 6){
                try{
                $('#virtual_bidding_end_date').val('');
                $('#bidding_end_date_local').val('');
                $('#bidding_end_date').val('');
                var new_date = actualStartDate.split(" ");

                var newStartDate = new_date[0];

                var new_min_date = new Date(actualStartDate);
                var new_max_date = new Date(newStartDate+' 23:59:59');
                live_min_max_date(new_min_date, new_max_date);


            }catch(ex){
                //console.log(ex);
            }
            }


          }
      });

    add_icon_dropdown_new_feature();

    //convert_bidding_date('dutch_bidding_start_date');
    convert_bidding_date('bidding_start_date');
    convert_bidding_date('bidding_end_date');
    convert_bidding_date('lease_exp_date');
    convert_bidding_date('crp_exp_date');
    $('.open_house_start_date').each(function(){
        var element_id = $(this).attr('id');
        convert_bidding_date(element_id);
    });
    $('.open_house_end_date').each(function(){
        var element_id = $(this).attr('id');
        convert_bidding_date(element_id);
    });
    property_image_params = {
        url: '/admin/save-images/',
        field_name: 'property_image',
        file_accepted: '.png, .jpg, .jpeg',
        element: 'propertyImageFrm',
        upload_multiple: true,
        call_function: set_property_image_details,
        default_message: '<i class="fa fa-upload" aria-hidden="true"></i> Upload Photos',
    }
    try{
        initdrozone(property_image_params);
    }catch(ex){
        //console.log(ex);
    }
    property_doc_params = {
        url: '/admin/save-images/',
        field_name: 'property_document',
        file_accepted: '.pdf',
        element: 'propertyDocFrm',
        upload_multiple: true,
        call_function: set_property_doc_details,
        default_message: '<i class="fa fa-upload" aria-hidden="true"></i> Upload Photos',
    }
    try{
        initdrozone(property_doc_params);
    }catch(ex){
        //console.log(ex);
    }
      //$('.listing_change_status').trigger("chosen:updated");
      $(document).on('click', '.display_status', function(){
        $(this).next().show();
        $(this).hide();
      });
      $(document).on('click', '.approval_status', function(){
        $(this).next().show();
        $(this).hide();
      });

    $(document).on('click', 'input[name="asset_type"]', function(){
        var asset_id = $(this).val();
        $('.residential').hide();
        $('.commercial').hide();
        $('.land').hide();
        $('.res_comm_land').hide();
        $('.res_comm').hide();
        $('.res_land').hide();
        $('.comm_land').hide();

        if(parseInt(asset_id) == 1){
            $('.residential').hide();
            $('.commercial').hide();
            $('.land').show();
            $('.res_comm_land').show();
            $('.res_comm').hide();
            $('.res_land').show();
            $('.comm_land').show();
            $('.add_more_open_house_date').hide();
            $('.property_exterior').html('Property Details <span class="icon"></span>');
        }else if(parseInt(asset_id) == 2){
            $('.residential').hide();
            $('.commercial').show();
            $('.land').hide();
            $('.res_comm_land').show();
            $('.res_comm').show();
            $('.res_land').hide();
            $('.comm_land').show();
            $('.add_more_open_house_date').show();
            $('.property_exterior').html('Property Exterior <span class="icon"></span>');
        }else if(parseInt(asset_id) == 3){
            $('.residential').show();
            $('.commercial').hide();
            $('.land').hide();
            $('.res_comm_land').show();
            $('.res_comm').show();
            $('.res_land').show();
            $('.comm_land').hide();
            $('.add_more_open_house_date').show();
            $('.property_exterior').html('Property Exterior <span class="icon"></span>');
        }
        $('p.error').hide();
        $.ajax({
            url: '/admin/get-property-info-data/',
            type: 'post',
            dataType: 'json',
            cache: false,
            data: {asset_id: asset_id},
            beforeSend: function(){
                $('.overlay').show();
            },
            success: function(response){
                $('.overlay').hide();
                if(response.error == 0){
                    $('#property_type').empty();
                    $('#property_type').append('<option value="">Select</option>');
                    //$('#property_type').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.property_type_listing, function(i, item) {
                        $('#property_type').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#property_sub_type').empty();
                    //$('#property_sub_type').append('<option value="">Select</option>');
                    $('#property_sub_type').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.property_sub_type_listing, function(i, item) {
                        $('#property_sub_type').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#lot_size_unit').empty();
                    //$('#lot_size_unit').append('<option value="">Select</option>');
                    $('#lot_size_unit').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.lot_size_units, function(i, item) {
                        $('#lot_size_unit').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#term_accepted').empty();
                    //$('#term_accepted').append('<option value="">Select</option>');
                    $('#term_accepted').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.term_accepted, function(i, item) {
                        $('#term_accepted').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#occupied_by').empty();
                    //$('#occupied_by').append('<option value="">Select</option>');
                    $('#occupied_by').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.occupied_by, function(i, item) {
                        $('#occupied_by').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#ownership').empty();
                    //$('#ownership').append('<option value="">Select</option>');
                    $('#ownership').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.ownership, function(i, item) {
                        $('#ownership').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#possession').empty();
                    //$('#possession').append('<option value="">Select</option>');
                    $('#possession').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.possession, function(i, item) {
                        $('#possession').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#property_style').empty();
                    //$('#property_style').append('<option value="">Select</option>');
                    $('#property_style').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.property_styles, function(i, item) {
                        $('#property_style').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#property_stories').empty();
                    //$('#property_stories').append('<option value="">Select</option>');
                    $('#property_stories').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.property_stories, function(i, item) {
                        $('#property_stories').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#recent_update').empty();
                    //$('#recent_update').append('<option value="">Select</option>');
                    $('#recent_update').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.recent_updates, function(i, item) {
                        $('#recent_update').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#security_feature').empty();
                    //$('#security_feature').append('<option value="">Select</option>');
                    $('#security_feature').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.security_features, function(i, item) {
                        $('#security_feature').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#property_cooling').empty();
                    //$('#property_cooling').append('<option value="">Select</option>');
                    $('#property_cooling').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.property_cooling, function(i, item) {
                        $('#property_cooling').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#property_heating').empty();
                    //$('#property_heating').append('<option value="">Select</option>');
                    $('#property_heating').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.property_heating, function(i, item) {
                        $('#property_heating').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#property_electric').empty();
                    //$('#property_electric').append('<option value="">Select</option>');
                    $('#property_electric').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.property_electric, function(i, item) {
                        $('#property_electric').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#property_gas').empty();
                    //$('#property_gas').append('<option value="">Select</option>');
                    $('#property_gas').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.property_gas, function(i, item) {
                        $('#property_gas').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#property_water').empty();
                    //$('#property_water').append('<option value="">Select</option>');
                    $('#property_water').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.property_water, function(i, item) {
                        $('#property_water').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#property_sewer').empty();
                    //$('#property_sewer').append('<option value="">Select</option>');
                    $('#property_sewer').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.property_sewer, function(i, item) {
                        $('#property_sewer').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#property_zoning').empty();
                    //$('#property_zoning').append('<option value="">Select</option>');
                    $('#property_zoning').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.property_zoning, function(i, item) {
                        $('#property_zoning').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#tax_exemption').empty();
                    //$('#tax_exemption').append('<option value="">Select</option>');
                    $('#tax_exemption').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.tax_exemptions, function(i, item) {
                        $('#tax_exemption').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#hoa_amenties').empty();
                    //$('#hoa_amenties').append('<option value="">Select</option>');
                    $('#hoa_amenties').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.hoa_amenties, function(i, item) {
                        $('#hoa_amenties').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#kitchen_features').empty();
                    //$('#kitchen_features').append('<option value="">Select</option>');
                    $('#kitchen_features').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.kitchen_features, function(i, item) {
                        $('#kitchen_features').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#appliances').empty();
                    //$('#appliances').append('<option value="">Select</option>');
                    $('#appliances').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.appliances, function(i, item) {
                        $('#appliances').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#property_flooring').empty();
                    //$('#property_flooring').append('<option value="">Select</option>');
                    $('#property_flooring').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.property_flooring, function(i, item) {
                        $('#property_flooring').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#property_windows').empty();
                    //$('#property_windows').append('<option value="">Select</option>');
                    $('#property_windows').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.property_windows, function(i, item) {
                        $('#property_windows').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#bedroom_features').empty();
                    //$('#bedroom_features').append('<option value="">Select</option>');
                    $('#bedroom_features').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.bedroom_features, function(i, item) {
                        $('#bedroom_features').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#bathroom_features').empty();
                    //$('#bathroom_features').append('<option value="">Select</option>');
                    $('#bathroom_features').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.bathroom_features, function(i, item) {
                        $('#bathroom_features').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#master_bedroom_features').empty();
                    //$('#master_bedroom_features').append('<option value="">Select</option>');
                    $('#master_bedroom_features').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.master_bedroom_features, function(i, item) {
                        $('#master_bedroom_features').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#basement_features').empty();
                    //$('#basement_features').append('<option value="">Select</option>');
                    $('#basement_features').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.basement_features, function(i, item) {
                        $('#basement_features').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#other_rooms').empty();
                    //$('#other_rooms').append('<option value="">Select</option>');
                    $('#other_rooms').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.other_rooms, function(i, item) {
                        $('#other_rooms').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#other_features').empty();
                    //$('#other_features').append('<option value="">Select</option>');
                    $('#other_features').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.other_features, function(i, item) {
                        $('#other_features').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#other_features_land').empty();
                    //$('#other_features_land').append('<option value="">Select</option>');
                    $('#other_features_land').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.other_features, function(i, item) {
                        $('#other_features_land').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#fire_place_unit').empty();
                    //$('#fire_place_unit').append('<option value="">Select</option>');
                    $('#fire_place_unit').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.fire_place_units, function(i, item) {
                        $('#fire_place_unit').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#handicap_amenities').empty();
                    //$('#handicap_amenities').append('<option value="">Select</option>');
                    $('#handicap_amenities').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.handicap_amenities, function(i, item) {
                        $('#handicap_amenities').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#property_construction').empty();
                    //$('#property_construction').append('<option value="">Select</option>');
                    $('#property_construction').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.property_construction, function(i, item) {
                        $('#property_construction').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#exterior_features').empty();
                    //$('#exterior_features').append('<option value="">Select</option>');
                    $('#exterior_features').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.exterior_features, function(i, item) {
                        $('#exterior_features').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#roofs').empty();
                    //$('#roofs').append('<option value="">Select</option>');
                    $('#roofs').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.roofs, function(i, item) {
                        $('#roofs').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#foundations').empty();
                    //$('#foundations').append('<option value="">Select</option>');
                    $('#foundations').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.foundations, function(i, item) {
                        $('#foundations').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#fence').empty();
                    //$('#fence').append('<option value="">Select</option>');
                    $('#fence').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.fence_list, function(i, item) {
                        $('#fence').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#pools').empty();
                    //$('#pools').append('<option value="">Select</option>');
                    $('#pools').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.pools, function(i, item) {
                        $('#pools').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#garage_parking').empty();
                    //$('#garage_parking').append('<option value="">Select</option>');
                    $('#garage_parking').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.garage_parkings, function(i, item) {
                        $('#garage_parking').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#garage_features').empty();
                    //$('#garage_features').append('<option value="">Select</option>');
                    $('#garage_features').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.garage_features, function(i, item) {
                        $('#garage_features').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#out_buildings').empty();
                    //$('#out_buildings').append('<option value="">Select</option>');
                    $('#out_buildings').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.out_buildings, function(i, item) {
                        $('#out_buildings').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#location_features').empty();
                    //$('#location_features').append('<option value="">Select</option>');
                    $('#location_features').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.location_features, function(i, item) {
                        $('#location_features').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#road_frontages').empty();
                    //$('#road_frontages').append('<option value="">Select</option>');
                    $('#road_frontages').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.road_frontages, function(i, item) {
                        $('#road_frontages').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#property_faces').empty();
                    //$('#property_faces').append('<option value="">Select</option>');
                    $('#property_faces').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.property_faces, function(i, item) {
                        $('#property_faces').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#lease_type').empty();
                    //$('#lease_type').append('<option value="">Select</option>');
                    $('#lease_type').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.lease_types, function(i, item) {
                        $('#lease_type').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#tenant_pays').empty();
                    //$('#tenant_pays').append('<option value="">Select</option>');
                    $('#tenant_pays').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.tenant_pays, function(i, item) {
                        $('#tenant_pays').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#inclusions').empty();
                    //$('#inclusions').append('<option value="">Select</option>');
                    $('#inclusions').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.inclusions, function(i, item) {
                        $('#inclusions').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#building_class').empty();
                    //$('#building_class').append('<option value="">Select</option>');
                    $('#building_class').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.building_classes, function(i, item) {
                        $('#building_class').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#interior_features').empty();
                    //$('#interior_features').append('<option value="">Select</option>');
                    $('#interior_features').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.interior_features, function(i, item) {
                        $('#interior_features').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#mineral_rights').empty();
                    //$('#mineral_rights').append('<option value="">Select</option>');
                    $('#mineral_rights').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.mineral_rights, function(i, item) {
                        $('#mineral_rights').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#easements').empty();
                    //$('#easements').append('<option value="">Select</option>');
                    $('#easements').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.easements, function(i, item) {
                        $('#easements').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#survey').empty();
                    //$('#survey').append('<option value="">Select</option>');
                    $('#survey').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.survey, function(i, item) {
                        $('#survey').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#utilities').empty();
                    //$('#utilities').append('<option value="">Select</option>');
                    $('#utilities').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.utilities, function(i, item) {
                        $('#utilities').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#improvements').empty();
                    //$('#improvements').append('<option value="">Select</option>');
                    $('#improvements').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.improvements, function(i, item) {
                        $('#improvements').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#irrigation_system').empty();
                    //$('#irrigation_system').append('<option value="">Select</option>');
                    $('#irrigation_system').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.irrigation_system, function(i, item) {
                        $('#irrigation_system').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#topography').empty();
                    //$('#topography').append('<option value="">Select</option>');
                    $('#topography').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.topography, function(i, item) {
                        $('#topography').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#wildlife').empty();
                    //$('#wildlife').append('<option value="">Select</option>');
                    $('#wildlife').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.wildlife, function(i, item) {
                        $('#wildlife').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#fish').empty();
                    //$('#fish').append('<option value="">Select</option>');
                    $('#fish').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.fish, function(i, item) {
                        $('#fish').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#recreation').empty();
                    //$('#recreation').append('<option value="">Select</option>');
                    $('#recreation').append('<option value="0"><i class="fa fa-plus" aria-hidden="true"></i> Add New Feature</option>');
                    $.each(response.recreation, function(i, item) {
                        $('#recreation').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#property_type').trigger("chosen:updated");
                    $('#property_sub_type').trigger("chosen:updated");
                    $('#lot_size_unit').trigger("chosen:updated");
                    $('#term_accepted').trigger("chosen:updated");
                    $('#occupied_by').trigger("chosen:updated");
                    $('#ownership').trigger("chosen:updated");
                    $('#possession').trigger("chosen:updated");
                    $('#property_style').trigger("chosen:updated");
                    $('#property_stories').trigger("chosen:updated");
                    $('#recent_update').trigger("chosen:updated");
                    $('#security_feature').trigger("chosen:updated");
                    $('#property_cooling').trigger("chosen:updated");
                    $('#property_heating').trigger("chosen:updated");
                    $('#property_electric').trigger("chosen:updated");
                    $('#property_gas').trigger("chosen:updated");
                    $('#property_water').trigger("chosen:updated");
                    $('#property_sewer').trigger("chosen:updated");
                    $('#property_zoning').trigger("chosen:updated");
                    $('#tax_exemption').trigger("chosen:updated");
                    $('#hoa_amenties').trigger("chosen:updated");
                    $('#kitchen_features').trigger("chosen:updated");
                    $('#appliances').trigger("chosen:updated");
                    $('#property_flooring').trigger("chosen:updated");
                    $('#property_windows').trigger("chosen:updated");
                    $('#bedroom_features').trigger("chosen:updated");
                    $('#bathroom_features').trigger("chosen:updated");
                    $('#master_bedroom_features').trigger("chosen:updated");
                    $('#basement_features').trigger("chosen:updated");
                    $('#other_rooms').trigger("chosen:updated");
                    $('#other_features').trigger("chosen:updated");
                    $('#other_features_land').trigger("chosen:updated");
                    $('#fire_place_unit').trigger("chosen:updated");
                    $('#handicap_amenities').trigger("chosen:updated");
                    $('#property_construction').trigger("chosen:updated");
                    $('#exterior_features').trigger("chosen:updated");
                    $('#roofs').trigger("chosen:updated");
                    $('#foundations').trigger("chosen:updated");
                    $('#fence').trigger("chosen:updated");
                    $('#pools').trigger("chosen:updated");
                    $('#garage_parking').trigger("chosen:updated");
                    $('#garage_features').trigger("chosen:updated");
                    $('#out_buildings').trigger("chosen:updated");
                    $('#location_features').trigger("chosen:updated");
                    $('#road_frontages').trigger("chosen:updated");
                    $('#property_faces').trigger("chosen:updated");
                    $('#lease_type').trigger("chosen:updated");
                    $('#tenant_pays').trigger("chosen:updated");
                    $('#inclusions').trigger("chosen:updated");
                    $('#building_class').trigger("chosen:updated");
                    $('#interior_features').trigger("chosen:updated");
                    $('#mineral_rights').trigger("chosen:updated");
                    $('#easements').trigger("chosen:updated");
                    $('#survey').trigger("chosen:updated");
                    $('#utilities').trigger("chosen:updated");
                    $('#improvements').trigger("chosen:updated");
                    $('#irrigation_system').trigger("chosen:updated");
                    $('#topography').trigger("chosen:updated");
                    $('#fish').trigger("chosen:updated");
                    $('#recreation').trigger("chosen:updated");
                    $('#wildlife').trigger("chosen:updated");
                }else{
                }
            }
        });
    });
    //$.validator.setDefaults({ ignore: "" });
    $('#property_info_frm').validate({
        ignore: [],
        errorElement: 'p',
        rules:{
            asset_type:{
                required: true
            },
//            property_type:{
//                required: true
//            },
            buyers_premium_percentage:{
                //required: true
                required: function(){
                    if ((parseInt($('option:selected','#auction_type').val()) == 7 || parseInt($('option:selected','#auction_type').val()) == 1) && parseInt($('option:selected','#buyers_premium').val()) == 1) {
                        return true;
                    }else {
                        return false;
                    }
                },
                max: 100,
////                min: 1,
                min: function(){
                    if ((parseInt($('option:selected','#auction_type').val()) == 7 || parseInt($('option:selected','#auction_type').val()) == 1) && parseInt($('option:selected','#buyers_premium').val()) == 1) {
                        return 1;
                    }else {
                        return 0;
                    }
                }
            },
            // deposit_amount:{
            //     required: function(){
            //         if ((parseInt($('option:selected','#auction_type').val()) == 2 || parseInt($('option:selected','#auction_type').val()) == 1) && $('option:selected','#is_deposit_required').val() == 1) {
            //             return true;
            //         } else {
            //             return false;
            //         }
            //     },
            //     thousandsepratornum: function(){
            //         if ((parseInt($('option:selected','#auction_type').val()) == 2 || parseInt($('option:selected','#auction_type').val()) == 1) && $('option:selected','#is_deposit_required').val() == 1) {
            //             return true;
            //         } else {
            //             return false;
            //         }
            //     },
            //     maxlength:15,
            //     minvalue: function(){
            //         if ((parseInt($('option:selected','#auction_type').val()) == 2 || parseInt($('option:selected','#auction_type').val()) == 1) && $('option:selected','#is_deposit_required').val() == 1) {
            //             return 1;
            //         } else {
            //             return 0;
            //         }
            //     }

            // },
//            buyers_premium_min_amount:{
//                 required: function(){
//                    if ((parseInt($('option:selected','#auction_type').val()) == 7 || parseInt($('option:selected','#auction_type').val()) == 1) && parseInt($('option:selected','#buyers_premium').val()) == 1) {
//                        return true;
//                    }else {
//                        return false;
//                    }
//                },
//                minvalue: function(){
//                    if ((parseInt($('option:selected','#auction_type').val()) == 7 || parseInt($('option:selected','#auction_type').val()) == 1) && parseInt($('option:selected','#buyers_premium').val()) == 1) {
//                        return 1;
//                    } else {
//                        return 0;
//                    }
//                }
//            },
            property_type:{
                required: function () {
                    if ($('option:selected','#property_type').val() == "") {
                            console.log('error');
                            $("#property_type").parent().append('<p id="property_type-error" class="error">Property Type is required</p>');

                    } else {
                        return false
                    }
                }
            },
            num_beds:{
                required: function () {
                    if (parseInt($('input[name="asset_type"]:checked').val()) == 3) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            num_bath:{
                required: function () {
                    if (parseInt($('input[name="asset_type"]:checked').val()) == 3) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            square_footage:{
                required: function () {
                    if (parseInt($('input[name="asset_type"]:checked').val()) == 2 || parseInt($('input[name="asset_type"]:checked').val()) == 3) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            year_build:{
                required: function () {
                    if (parseInt($('input[name="asset_type"]:checked').val()) == 2 || parseInt($('input[name="asset_type"]:checked').val()) == 3) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            total_land_acres:{
                required: function () {
                    if (parseInt($('input[name="asset_type"]:checked').val()) == 1) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            property_address_one:{
                required: true
            },
            property_city:{
                required: true
            },
//            property_state:{
//                required: true
//            },
            property_state:{
                required: function () {
                    if ($('option:selected','#property_state').val() == "") {
                            $("#property_state").parent().append('<p id="property_state-error" class="error">State is required</p>');

                    } else {
                        return false
                    }
                }
            },
            property_zip_code:{
                required: true
            },
            bid_increments:{
                required: function(){
                    if ($('option:selected','#auction_type').val() == 1) {
                        return true;
                    } else {
                        return false;
                    }
                },
                thousandsepratornum: function(){
                    if ($('option:selected','#auction_type').val() == 1) {
                        return true;
                    } else {
                        return false;
                    }
                },
                maxlength:14,
                minvalue: function(){
                    if ($('option:selected','#auction_type').val() == 1) {
                        return 1;
                    } else {
                        return 0;
                    }
                }

            },
            bidding_start_date:{
                required: function(){
                    if ($('option:selected','#auction_type').val() != 2 && $('option:selected','#auction_type').val() != 4) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            bidding_end_date: {
                required: function(){
                    if ($('option:selected','#auction_type').val() != 2 && $('option:selected','#auction_type').val() != 4) {
                        return true;
                    } else {
                        return false;
                    }
                },
                greaterThan: function(){
                    if ($('#virtual_bidding_end_date').val() != "" && $('option:selected','#auction_type').val() != 2) {
                        return "#bidding_start_date";
                    } else {
                        return false;
                    }
                }
            },
//            auction_type:{
//                required: true
//            },
            auction_type:{
                required: function () {
                    if ($('option:selected','#auction_type').val() == "") {
                            $("#auction_type").parent().append('<p id="auction_type-error" class="error">Auction type is required</p>');

                    } else {
                        return false
                    }
                }
            },
            prop_country:{
                required: function () {
                    if ($('option:selected','#prop_country').val() == "" || typeof($('option:selected','#prop_country').val())  === "undefined") {
                            $("#prop_country").parent().append('<p id="prop_country-error" class="error">Country is required</p>');

                    } else {
                        return false
                    }
                }
            },
            reserve_amount:{
                    greaterThanValue: function(){
                        if (($('#reserve_amount').is(':visible') === true || $.inArray(parseInt($('option:selected','#auction_type').val()), [1,6]) !== -1) && ($('#reserve_amount').val() != "")) {
                            return '#bidding_min_price';
                        } else {
                            return false;
                        }
                    },
                    thousandsepratornum: function(){
                        if (($('#reserve_amount').is(':visible') === true || $.inArray(parseInt($('option:selected','#auction_type').val()), [1,6]) !== -1) && ($('#reserve_amount').val() != "")) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                    maxlength:14,
                    minvalue: function(){
                        if (($('#reserve_amount').is(':visible') === true || $.inArray(parseInt($('option:selected','#auction_type').val()), [1,6]) !== -1) && ($('#reserve_amount').val() != "")) {
                            return 1;
                        } else {
                            return 0;
                        }
                    },
            },
            bidding_min_price:{
                required: function(){
                    if (parseInt($('option:selected','#auction_type').val()) == 7 && $('input[name="offer_unpriced"]').is(':checked') == true) {
                        return false;
                    }else if (parseInt($('option:selected','#auction_type').val()) == 7 && $('input[name="offer_unpriced"]').is(':checked') == false) {
                        return true;
                    }else if(parseInt($('option:selected','#auction_type').val()) == 1 || parseInt($('option:selected','#auction_type').val()) == 4 || parseInt($('option:selected','#auction_type').val()) == 6){
                        return true;
                    }else {
                        if($('input[name="required_all"]').is(':checked') == true){
                            return true;
                        }else{
                            return false;
                        }

                    }
                },
                thousandsepratornum: true,
                minvalue: function(){
                    if (parseInt($('option:selected','#auction_type').val()) == 7 && $('input[name="offer_unpriced"]').is(':checked') == true) {
                        return 0;
                    } else {
                        if($('input[name="required_all"]').is(':checked') == true){
                            return 1;
                        }else{
                            return 0;
                        }
                    }
                },
                maxlength:14
            },
//            auction_status:{
//                required: true
//            },
            auction_status:{
                required: function () {
                    if ($('option:selected','#auction_status').val() == "") {
                            $("#auction_status").parent().append('<p id="auction_status-error" class="error">Auction Status is required</p>');

                    } else {
                        return false
                    }
                }
            },
            prop_listing_status:{
                required: function () {
//                    if (parseInt($('#is_broker').val()) == 1) {
//                        return true;
//                    } else {
//                        return false;
//                    }
                      if ($('option:selected','#prop_listing_status').val() == "") {
                           //return true;
                           $("#prop_listing_status").parent().append('<p id="prop_listing_status-error" class="error">Status is required</p>');
                      } else {
                           return false;
                      }
                }
            },
            auction_location:{
                required: function(){
                    if ($('#auction_location').is(':visible') === true) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            closing_status:{
                required: function(){
//                    if ($('#prop_listing_status').next('.chosen-container').is(':visible') === true && parseInt($('option:selected','#prop_listing_status').val()) == 9) {
//                        //return true;
//                        $("#closing_status").parent().append('<p id="closing_status-error" class="error">This field is required</p>');
//                    } else {
//                        return false;
//                    }
                    if ($('option:selected','#closing_status').val() == "" && $('option:selected','#prop_listing_status').val() == 9) {
                        //return true;
                        $("#closing_status").parent().append('<p id="closing_status-error" class="error">This field is required</p>');
                    } else {
                        return false;
                    }
                }
            },
            due_diligence_period: {
                required: function(){
                    if ($('option:selected','#auction_type').val() == 7 && $('input[name="required_all"]').is(':checked') == true) {
                        return true;
                    } else {
                        return false;
                    }
                },
                number: true,
                maxlength: 4,
                minvalue: function(){
                    if ($('option:selected','#auction_type').val() == 7 && $('input[name="required_all"]').is(':checked') == true) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            },
            escrow_period: {
                required: function(){
                    if ($('option:selected','#auction_type').val() == 7 && $('input[name="required_all"]').is(':checked') == true) {
                        return true;
                    } else {
                        return false;
                    }
                },
                number: true,
                maxlength: 4,
                minvalue: function(){
                    if ($('option:selected','#auction_type').val() == 7 && $('input[name="required_all"]').is(':checked') == true) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            },
            earnest_deposit: {
                required: function(){
                    if ($('option:selected','#auction_type').val() == 7 && $('input[name="required_all"]').is(':checked') == true) {
                        return true;
                    } else {
                        return false;
                    }
                },
                edvalidator: function(){
                    if ($('option:selected','#auction_type').val() == 7 && $('#earnest_deposit').is(':visible') === true) {
                        return true;
                    } else {
                        return false;
                    }
                },
                lessThan: function(){
                    if ($('option:selected','#auction_type').val() == 7 && parseInt($('input[name="earnest_deposit_type"]:checked').val()) == 1  && $('input[name="offer_unpriced"]').is(':checked') == false && $('input[name="required_all"]').is(':checked') == true) {
                        return '#bidding_min_price';
                    } else {
                        return false;
                    }
                },
                minvalue: function(){
                    if ($('option:selected','#auction_type').val() == 7 && $('input[name="required_all"]').is(':checked') == true) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            },
            highest_offer_format: {
                required: function(){
                    if ($('option:selected','#auction_type').val() == 7) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            insider_start_price:{
                required: function(){
                    if(parseInt($('option:selected','#auction_type').val()) == 2){
                        return true;
                    }else{
                        return false;
                    }
                },
                thousandsepratornum: true,
                minvalue: function(){
                    if(parseInt($('option:selected','#auction_type').val()) == 2){
                        return 1;
                    }else{
                        return 0;
                    }
                },
                maxlength:14
            },
            price_decrease_rate:{
                required: function(){
                    if(parseInt($('option:selected','#auction_type').val()) == 2){
                        return true;
                    }else{
                        return false;
                    }
                },
                minvalue: function(){
                    if(parseInt($('option:selected','#auction_type').val()) == 2){
                        return 1;
                    }else{
                        return 0;
                    }
                },
                maxlength:6
            },

            insider_bid_increment:{
                required: function(){
                    if ($('option:selected','#auction_type').val() == 2) {
                        return true;
                    } else {
                        return false;
                    }
                },
                thousandsepratornum: function(){
                    if ($('option:selected','#auction_type').val() == 2) {
                        return true;
                    } else {
                        return false;
                    }
                },
                maxlength:14,
                minvalue: function(){
                    if ($('option:selected','#auction_type').val() == 2) {
                        return 1;
                    } else {
                        return 0;
                    }
                }

            },
            dutch_auction_time:{
                required: function(){
                    if ($('option:selected','#auction_type').val() == 2) {
                        return true;
                    } else {
                        return false;
                    }
                },
                minvalue: function(){
                    if ($('option:selected','#auction_type').val() == 2) {
                        return 1;
                    } else {
                        return 0;
                    }
                },
                maxlength:5,
                number: true,
            },
            dutch_pause_time:{
                required: function(){
                    if ($('option:selected','#auction_type').val() == 2) {
                        return true;
                    } else {
                        return false;
                    }
                },
                minvalue: function(){
                    if ($('option:selected','#auction_type').val() == 2) {
                        return 1;
                    } else {
                        return 0;
                    }
                },
                maxlength:5,
                number: true,
            },
            sealed_auction_time:{
                required: function(){
                    if ($('option:selected','#auction_type').val() == 2) {
                        return true;
                    } else {
                        return false;
                    }
                },
                minvalue: function(){
                    if ($('option:selected','#auction_type').val() == 2) {
                        return 1;
                    } else {
                        return 0;
                    }
                },
                maxlength:5,
                number: true,
            },
            sealed_pause_time:{
                required: function(){
                    if ($('option:selected','#auction_type').val() == 2) {
                        return true;
                    } else {
                        return false;
                    }
                },
                minvalue: function(){
                    if ($('option:selected','#auction_type').val() == 2) {
                        return 1;
                    } else {
                        return 0;
                    }
                },
                maxlength:5,
                number: true,
            },
            english_auction_time:{
                required: function(){
                    if ($('option:selected','#auction_type').val() == 2) {
                        return true;
                    } else {
                        return false;
                    }
                },
                minvalue: function(){
                    if ($('option:selected','#auction_type').val() == 2) {
                        return 1;
                    } else {
                        return 0;
                    }
                },
                maxlength:5,
                number: true,
            },
            dutch_bidding_start_date:{
                required: function(){
                    if ($('option:selected','#auction_type').val() == 2) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
        },
        messages:{
            asset_type:{
                required: "Property Asset is required"
            },
            buyers_premium_percentage:{
                required: "This field is required",
                max: "Value less or equal to 100"
            },
            deposit_amount:{
                required: "This field is required",
                min: "Value greater or equal to 1"
            },
            property_type:{
                required: "Property Type is required"
            },
            num_beds:{
                required: "Bed is required"
            },
            num_bath:{
                required: "Bath is required"
            },
            square_footage:{
                required: "Square Footage is required"
            },
            year_build:{
                required: "Year Build is required"
            },
            total_land_acres:{
                required: "Total acres is required"
            },
            property_address_one:{
                required: "Address is required"
            },
            property_city:{
                required: "City is required"
            },
            property_state:{
                required: "State is required"
            },
            property_zip_code:{
                required: "Zip Code is required"
            },
            bidding_start_date:{
                required: "Start Date is required"
            },
            bidding_end_date: {
                required: "End Date is required",
                greaterThan: "Must be greater than bidding start date"
            },
            auction_type:{
                required: "Auction type is required"
            },
            prop_country:{
                required: "Country is required"
            },
            reserve_amount:{
                greaterThanValue: "must be greater than Bidding min price",
                thousandsepratornum: "Please enter valid amount",
                maxlength: "Please enter max 10 digit number"
            },
            bidding_min_price:{
                required: function(){
                    if ($('option:selected','#auction_type').val() == 4 || $('option:selected','#auction_type').val() == 7) {
                        return "Asking price is required";
                    }else{
                        return "Bid minimum price is required";
                    }
                },
                thousandsepratornum: "Please enter valid amount",
            },
            auction_status:{
                required: "Auction Status is required"
            },
            prop_listing_status:{
                required: "Status is required"
            },
            auction_location:{
                required: "Auction Location is required"
            },
            closing_status:{
                required: "This field is required"
            },
            due_diligence_period: {
                required: "Please enter Due Diligence Period",
                number: "Please enter only number",
                maxlength: "value should be less than or equal to 1000"
            },
            escrow_period: {
                required: "Please enter Escrow Period",
                number: "Please enter only number",
                maxlength: "value should be less than or equal to 1000"
            },
            earnest_deposit: {
                required: "Please enter Earnest Money Deposit",
                edvalidator: "Please enter valid Earnest Money Deposit",
                lessThan: "Please enter value less than or equal to Asking price",
            },
            insider_start_price:{
                required: "Please enter Start Price",
                maxlength: "Please enter max 14 digit number"
            },
            price_decrease_rate:{
                required: "Please enter Price Decrease Rate",
                maxlength: "Please enter max 6 digit number"
            },

            insider_bid_increment:{
                required: "Please enter Bid Increment",
                thousandsepratornum: "Please enter valid Bid Increment",
                maxlength:"Please enter max 14 digit number",

            },
            dutch_auction_time:{
                required: "Please enter Auction Time",
                maxlength:"Please enter max 5 digit",
                number: "Please enter valid Auction Time",
            },
            dutch_pause_time:{
                required: "Please enter Pause Time",
                maxlength:"Please enter max 5 digit",
                number: "Please enter valid Pause Time",
            },
            sealed_auction_time:{
                required: "Please enter Auction Time",
                maxlength:"Please enter max 5 digit",
                number: "Please enter valid Auction Time",
            },
            sealed_pause_time:{
                required: "Please enter Pause Time",
                maxlength:"Please enter max 5 digit",
                number: "Please enter valid Pause Time",
            },
            english_auction_time:{
                required: "Please enter Auction Time",
                maxlength:"Please enter max 5 digit",
                number: "Please enter valid Auction Time",
            },
            dutch_bidding_start_date:{
                required: "Bidding Start Date is required",
            },
        },
        errorPlacement: function(error, element) {
            var range_input_arr = ['price_decrease_rate', 'dutch_auction_time', 'dutch_pause_time', 'sealed_auction_time', 'english_auction_time', 'sealed_pause_time'];
            if(element.hasClass('asset_type_radio')){
                error.insertAfter($('.asset_type_label').closest('.listing-type'));
            }else if(element.hasClass('select')){
                error.insertAfter(element.next('.chosen-container'));
            }else if(element.parent().hasClass('date')){
                error.insertAfter(element.parent());
            }else if(element.parent().hasClass('open_house_start')){
                error.insertAfter(element.parent());
            }else if(element.parent().hasClass('open_house_end')){
                error.insertAfter(element.parent());
            }else if(element.attr('name') == 'highest_offer_format'){
                error.insertAfter(element.closest('.lh46'));
            }else if(jQuery.inArray(element.attr('name'), range_input_arr) !== -1){
                error.insertAfter(element.closest('.range-slide'));
            }else{
                error.insertAfter(element);
            }
        },
        invalidHandler: function(e,validator) {
            // loop through the errors:
            console.log(validator.errorList);
            for (var i=0;i<validator.errorList.length;i++){
                // "uncollapse" section containing invalid input/s:
                $(validator.errorList[i].element).closest('.panel-collapse.collapse').collapse('show');
            }
        }
    });

    $('#property_map_view_frm').validate({
        ignore: [],
        errorElement: 'p',
        rules:{
            /*map_url:{
                required: true
            }*/
        },
        messages:{
            /*map_url:{
                required: "Map Url is required"
            }*/
        }
    });
    $("#property_info_frm").validate();
    $("#property_map_view_frm").validate();
    $("#property_photo_video_frm").validate();
    $("#property_document_frm").validate();
    $(document).on('click', '#property_info_submit_next_btn', function(){
        $('#next_url').val('/admin/property-map-view/');
        try{
            var start_dates = $("#virtual_bidding_start_date").val();
            var end_dates = $("#virtual_bidding_end_date").val();
            var open_house_start_dates = $("#virtual_open_house_start_date").val();
            var open_house_end_dates = $("#virtual_open_house_end_date").val();
            var asset_id = $('input[name="asset_type"]:checked').val();
            if (start_dates != "" && $('option:selected','#auction_type').val() != 4) {
                var actualStartDate = start_dates.split(" ");
                var change_format = actualStartDate[0].split("-");
                var new_format = change_format[2]+"-"+change_format[0]+"-"+change_format[1];
                actualStartDate = new_format + ' ' + convert_to_24h(actualStartDate[1] + ' ' + actualStartDate[2]);
                var actualStartDateUtc = convert_to_utc_datetime(actualStartDate, 'datetime');
                //var actualStartDateUtc = convert_to_utc_date(actualStartDate, 'mm-dd-yyyy', 'datetime');
                $("#bidding_start_date").val(actualStartDateUtc);
                $("#bidding_start_date_local").val(actualStartDate);
            }else{
                $("#virtual_bidding_start_date").val('');
                $("#bidding_start_date").val('');
                $("#bidding_start_date_local").val('');
            }
            if (end_dates != "" && $('option:selected','#auction_type').val() != 4) {
                var actualEndDate = end_dates.split(" ");
                var change_format = actualEndDate[0].split("-");
                var new_format = change_format[2]+"-"+change_format[0]+"-"+change_format[1];
                actualEndDate = new_format + ' ' + convert_to_24h(actualEndDate[1] + ' ' + actualEndDate[2]);
                var actualEndDateUtc = convert_to_utc_datetime(actualEndDate, 'datetime');
                //var actualEndDateUtc = convert_to_utc_date(actualEndDate, 'mm-dd-yyyy', 'datetime');
                $("#bidding_end_date").val(actualEndDateUtc);
                $("#bidding_end_date_local").val(actualEndDate);
            }else{
                $("#virtual_bidding_end_date").val('');
                $("#bidding_end_date").val('');
                $("#bidding_end_date_local").val('');
            }
            $('.open_house_start').each(function(index){
                var open_house_start_dates = $("#virtual_open_house_start_date_"+index).val();
                if (open_house_start_dates != "") {
                    var actualOpenHouseStartDate = open_house_start_dates.split(" ");
                    var change_format = actualOpenHouseStartDate[0].split("-");
                    var new_format = change_format[2]+"-"+change_format[0]+"-"+change_format[1];
                    actualOpenHouseStartDate = new_format + ' ' + convert_to_24h(actualOpenHouseStartDate[1] + ' ' + actualOpenHouseStartDate[2]);
                    var actualOpenHouseStartDateUtc = convert_to_utc_datetime(actualOpenHouseStartDate, 'datetime');
                    //var actualStartDateUtc = convert_to_utc_date(actualStartDate, 'mm-dd-yyyy', 'datetime');
                    $("#open_house_start_date_"+index).val(actualOpenHouseStartDateUtc);
                    $("#open_house_start_date_local_"+index).val(actualOpenHouseStartDate);
                }else{
                    $("#virtual_open_house_start_date_"+index).val('');
                    $("#open_house_start_date_"+index).val('');
                    $("#open_house_start_date_local_"+index).val('');
                }
            });
            $('.open_house_end').each(function(i){
                var open_house_end_dates = $("#virtual_open_house_end_date_"+i).val();
                if (open_house_end_dates != "") {
                    var actualOpenHouseEndDate = open_house_end_dates.split(" ");
                    var change_format = actualOpenHouseEndDate[0].split("-");
                    var new_format = change_format[2]+"-"+change_format[0]+"-"+change_format[1];
                    actualOpenHouseEndDate = new_format + ' ' + convert_to_24h(actualOpenHouseEndDate[1] + ' ' + actualOpenHouseEndDate[2]);
                    var actualOpenHouseEndDateUtc = convert_to_utc_datetime(actualOpenHouseEndDate, 'datetime');
                    //var actualEndDateUtc = convert_to_utc_date(actualEndDate, 'mm-dd-yyyy', 'datetime');
                    $("#open_house_end_date_"+i).val(actualOpenHouseEndDateUtc);
                    $("#open_house_end_date_local_"+i).val(actualOpenHouseEndDate);
                }else{
                    $("#virtual_open_house_end_date_"+i).val();
                    $("#open_house_end_date_"+i).val('');
                    $("#open_house_end_date_local_"+i).val('');
                }
            });
//            $('.open_house_start_date').each(function() {
//                var position = $(this).closest('.add_more_open_house_date').attr('rel_position');
//                var asset_type = $('input[name="asset_type"]:checked').val();
//                if(parseInt(asset_type) == 2 || parseInt(asset_type) == 3){
//                    $(this).rules("add",
//                    {
//                        required: true,
//                        messages: {
//                            required: "Start Date is required",
//                        }
//                    });
//                }
//
//
//            });
            $('.open_house_end_date').each(function() {
                var position = $(this).closest('.add_more_open_house_date').attr('rel_position');
                var asset_type = $('input[name="asset_type"]:checked').val();
                if(parseInt(asset_type) == 2 || parseInt(asset_type) == 3){
                    $(this).rules("add",
                        {
                            //required: true,
                            required: function(){
                                if ($('#virtual_open_house_start_date_'+position).val() != "") {
                                    return true;
                                } else {
                                    return false;
                                }
                            },
                            greaterThan: function(){
                                if ($('#virtual_open_house_start_date_'+position).val() != "") {
                                    return "#open_house_start_date_"+position;
                                } else {
                                    return false;
                                }
                            },
                            messages: {
                                required: "End Date is required",
                                greaterThan: "Must be greater than start date",

                            },

                        });
                }

            });
            if(parseInt(asset_id) == 1 || parseInt(asset_id) == 2){
                var lease_exp_dates = $("#virtual_lease_exp_date").val();
                if(lease_exp_dates != ""){
                    var actualExpDate = lease_exp_dates.split(" ");
                    var change_format = actualExpDate[0].split("-");
                    var new_format = change_format[2]+"-"+change_format[0]+"-"+change_format[1];
                    actualExpDate = new_format + ' ' + convert_to_24h(actualExpDate[1] + ' ' + actualExpDate[2]);
                    var actualExpDateUtc = convert_to_utc_datetime(actualExpDate, 'datetime');
                    //var actualEndDateUtc = convert_to_utc_date(actualEndDate, 'mm-dd-yyyy', 'datetime');
                    $("#lease_exp_date").val(actualExpDateUtc);
                    $("#lease_exp_date_local").val(actualExpDate);
                }
            }else{
                $("#lease_exp_date").val('');
                $("#lease_exp_date_local").val('');
                $("#virtual_lease_exp_date").val('');
            }
            if(parseInt(asset_id) == 1){
                var crp_exp_dates = $("#virtual_crp_exp_date").val();
                if(crp_exp_dates != ""){
                    var actualCrpExpDate = crp_exp_dates.split(" ");
                    var change_format = actualCrpExpDate[0].split("-");
                    var new_format = change_format[2]+"-"+change_format[0]+"-"+change_format[1];
                    actualCrpExpDate = new_format + ' ' + convert_to_24h(actualCrpExpDate[1] + ' ' + actualCrpExpDate[2]);
                    var actualCrpExpDateUtc = convert_to_utc_datetime(actualCrpExpDate, 'datetime');
                    //var actualEndDateUtc = convert_to_utc_date(actualEndDate, 'mm-dd-yyyy', 'datetime');
                    $("#crp_exp_date").val(actualCrpExpDateUtc);
                    $("#crp_exp_date_local").val(actualCrpExpDate);
                }
            }else{
                $("#virtual_crp_exp_date").val('');
                $("#crp_exp_date").val('');
                $("#crp_exp_date_local").val('');
            }

            //functionality for insider auction
            if($('option:selected','#auction_type').val() == 2){
                var dutch_start_date = $("#virtual_dutch_bidding_start_date").val();
                if(dutch_start_date != ""){
                    var actualStartDate = dutch_start_date.split(" ");
                    var change_format = actualStartDate[0].split("-");
                    var new_format = change_format[2]+"-"+change_format[0]+"-"+change_format[1];
                    actualStartDate = new_format + ' ' + convert_to_24h(actualStartDate[1] + ' ' + actualStartDate[2]);
                    var actualStartDateUtc = convert_to_utc_datetime(actualStartDate, 'datetime');
                    //var actualEndDateUtc = convert_to_utc_date(actualEndDate, 'mm-dd-yyyy', 'datetime');
                    $("#dutch_bidding_start_date").val(actualStartDateUtc);
                    $("#dutch_bidding_start_date_local").val(actualStartDate);
                    //var dutch_bidding_start_date
                }else{
                    $("#virtual_dutch_bidding_start_date").val('');
                    $("#dutch_bidding_start_date_local").val('');
                    $("#dutch_bidding_start_date").val('');
                }
                var dutch_end_date = $('#virtual_dutch_bidding_end_date').val();
                if(dutch_end_date != ""){
                    var actualStartDate = dutch_end_date.split(" ");
                    var change_format = actualStartDate[0].split("-");
                    var new_format = change_format[2]+"-"+change_format[0]+"-"+change_format[1];
                    actualStartDate = new_format + ' ' + convert_to_24h(actualStartDate[1] + ' ' + actualStartDate[2]);
                    var actualStartDateUtc = convert_to_utc_datetime(actualStartDate, 'datetime');
                    //var actualEndDateUtc = convert_to_utc_date(actualEndDate, 'mm-dd-yyyy', 'datetime');
                    $("#dutch_bidding_end_date").val(actualStartDateUtc);
                    $("#dutch_bidding_end_date_local").val(actualStartDate);
                    //var dutch_bidding_start_date
                }else{
                    $("#virtual_dutch_bidding_end_date").val('');
                    $("#dutch_bidding_end_date_local").val('');
                    $("#dutch_bidding_end_date").val('');
                }
                var sealed_start_date = $('#virtual_sealed_bidding_start_date').val();
                if(sealed_start_date != ""){
                    var actualStartDate = sealed_start_date.split(" ");
                    var change_format = actualStartDate[0].split("-");
                    var new_format = change_format[2]+"-"+change_format[0]+"-"+change_format[1];
                    actualStartDate = new_format + ' ' + convert_to_24h(actualStartDate[1] + ' ' + actualStartDate[2]);
                    var actualStartDateUtc = convert_to_utc_datetime(actualStartDate, 'datetime');
                    //var actualEndDateUtc = convert_to_utc_date(actualEndDate, 'mm-dd-yyyy', 'datetime');
                    $("#sealed_bidding_start_date").val(actualStartDateUtc);
                    $("#sealed_bidding_start_date_local").val(actualStartDate);
                    //var dutch_bidding_start_date
                }else{
                    $("#virtual_sealed_bidding_start_date").val('');
                    $("#sealed_bidding_start_date_local").val('');
                    $("#sealed_bidding_start_date").val('');
                }
                var sealed_end_date = $('#virtual_sealed_bidding_end_date').val();
                if(sealed_end_date != ""){
                    var actualStartDate = sealed_end_date.split(" ");
                    var change_format = actualStartDate[0].split("-");
                    var new_format = change_format[2]+"-"+change_format[0]+"-"+change_format[1];
                    actualStartDate = new_format + ' ' + convert_to_24h(actualStartDate[1] + ' ' + actualStartDate[2]);
                    var actualStartDateUtc = convert_to_utc_datetime(actualStartDate, 'datetime');
                    //var actualEndDateUtc = convert_to_utc_date(actualEndDate, 'mm-dd-yyyy', 'datetime');
                    $("#sealed_bidding_end_date").val(actualStartDateUtc);
                    $("#sealed_bidding_end_date_local").val(actualStartDate);
                    //var dutch_bidding_start_date
                }else{
                    $("#virtual_sealed_bidding_end_date").val('');
                    $("#sealed_bidding_end_date_local").val('');
                    $("#sealed_bidding_end_date").val('');
                }
                var english_start_date = $('#virtual_english_bidding_start_date').val();
                if(english_start_date != ""){
                    var actualStartDate = english_start_date.split(" ");
                    var change_format = actualStartDate[0].split("-");
                    var new_format = change_format[2]+"-"+change_format[0]+"-"+change_format[1];
                    actualStartDate = new_format + ' ' + convert_to_24h(actualStartDate[1] + ' ' + actualStartDate[2]);
                    var actualStartDateUtc = convert_to_utc_datetime(actualStartDate, 'datetime');
                    //var actualEndDateUtc = convert_to_utc_date(actualEndDate, 'mm-dd-yyyy', 'datetime');
                    $("#english_bidding_start_date").val(actualStartDateUtc);
                    $("#english_bidding_start_date_local").val(actualStartDate);
                    //var dutch_bidding_start_date
                }else{
                    $("#virtual_english_bidding_start_date").val('');
                    $("#english_bidding_start_date_local").val('');
                    $("#english_bidding_start_date").val('');
                }
                var english_end_date = $('#virtual_english_bidding_end_date').val();
                if(english_end_date != ""){
                    var actualStartDate = english_end_date.split(" ");
                    var change_format = actualStartDate[0].split("-");
                    var new_format = change_format[2]+"-"+change_format[0]+"-"+change_format[1];
                    actualStartDate = new_format + ' ' + convert_to_24h(actualStartDate[1] + ' ' + actualStartDate[2]);
                    var actualStartDateUtc = convert_to_utc_datetime(actualStartDate, 'datetime');
                    //var actualEndDateUtc = convert_to_utc_date(actualEndDate, 'mm-dd-yyyy', 'datetime');
                    $("#english_bidding_end_date").val(actualStartDateUtc);
                    $("#english_bidding_end_date_local").val(actualStartDate);
                    //var dutch_bidding_start_date
                }else{
                    $("#virtual_english_bidding_end_date").val('');
                    $("#english_bidding_end_date_local").val('');
                    $("#english_bidding_end_date").val('');
                }

                /*var dutch_auction_time = $('#property_info_frm #dutch_auction_time').val();
                var dutch_pause_time = $('#property_info_frm #dutch_pause_time').val();
                var sealed_auction_time = $('#property_info_frm #sealed_auction_time').val();
                var sealed_pause_time = $('#property_info_frm #sealed_pause_time').val();
                var english_auction_time = $('#property_info_frm #english_auction_time').val();
                var dutch_start_date = $('#dutch_bidding_start_date_local').val();
                if(dutch_auction_time != "" && dutch_start_date != ""){
                    try{
                       custom_response = {
                        'add_min': dutch_auction_time,
                        'actualStartDate': dutch_start_date,
                        'date_virtual_element_id': '#virtual_dutch_bidding_end_date',
                        'date_local_element_id': '#dutch_bidding_end_date_local',
                        'date_utc_element_id': '#dutch_bidding_end_date',
                      };
                      customCallBackFunc(calculate_insider_dates, [custom_response]);
                    }catch(ex){
                        //console.log(ex);
                    }
                }

                var dutch_end_date = $('#dutch_bidding_end_date_local').val();
                if(dutch_pause_time != "" && dutch_end_date != ""){
                    try{
                       custom_response = {
                        'add_min': dutch_pause_time,
                        'actualStartDate': dutch_end_date,
                        'date_virtual_element_id': '#virtual_sealed_bidding_start_date',
                        'date_local_element_id': '#sealed_bidding_start_date_local',
                        'date_utc_element_id': '#sealed_bidding_start_date',
                      };
                      customCallBackFunc(calculate_insider_dates, [custom_response]);
                    }catch(ex){
                        //console.log(ex);
                    }
                }
                var sealed_start_date = $('#sealed_bidding_start_date_local').val();
                if(sealed_auction_time != "" && sealed_start_date != ""){
                    try{
                       custom_response = {
                        'add_min': sealed_auction_time,
                        'actualStartDate': sealed_start_date,
                        'date_virtual_element_id': '#virtual_sealed_bidding_end_date',
                        'date_local_element_id': '#sealed_bidding_end_date_local',
                        'date_utc_element_id': '#sealed_bidding_end_date',
                      };
                      customCallBackFunc(calculate_insider_dates, [custom_response]);
                    }catch(ex){
                        //console.log(ex);
                    }
                }
                var sealed_end_date = $('#sealed_bidding_end_date_local').val();
                if(sealed_pause_time != "" && sealed_end_date != ""){
                    try{
                       custom_response = {
                        'add_min': sealed_pause_time,
                        'actualStartDate': sealed_end_date,
                        'date_virtual_element_id': '#virtual_english_bidding_start_date',
                        'date_local_element_id': '#english_bidding_start_date_local',
                        'date_utc_element_id': '#english_bidding_start_date',
                      };
                      customCallBackFunc(calculate_insider_dates, [custom_response]);
                    }catch(ex){
                        //console.log(ex);
                    }
                }
                var english_start_date = $('#english_bidding_start_date_local').val();
                if(english_auction_time != "" && english_start_date != ""){
                    try{
                       custom_response = {
                        'add_min': english_auction_time,
                        'actualStartDate': english_start_date,
                        'date_virtual_element_id': '#virtual_english_bidding_end_date',
                        'date_local_element_id': '#english_bidding_end_date_local',
                        'date_utc_element_id': '#english_bidding_end_date',
                      };
                      customCallBackFunc(calculate_insider_dates, [custom_response]);
                    }catch(ex){
                        //console.log(ex);
                    }
                }*/


            }else{
                $("#virtual_dutch_bidding_start_date").val('');
                $("#dutch_bidding_start_date_local").val('');
                $("#dutch_bidding_start_date").val('');
                $("#virtual_dutch_bidding_end_date").val('');
                $("#dutch_bidding_end_date_local").val('');
                $("#dutch_bidding_end_date").val('');
                $("#virtual_sealed_bidding_start_date").val('');
                $("#sealed_bidding_start_date_local").val('');
                $("#sealed_bidding_start_date").val('');
                $("#virtual_sealed_bidding_end_date").val('');
                $("#sealed_bidding_end_date_local").val('');
                $("#sealed_bidding_end_date").val('');
                $("#virtual_english_bidding_start_date").val('');
                $("#english_bidding_start_date_local").val('');
                $("#english_bidding_start_date").val('');
                $("#virtual_english_bidding_end_date").val('');
                $("#english_bidding_end_date_local").val('');
                $("#english_bidding_end_date").val('');
            }
        }catch(ex){
            //console.log(ex);
        }
        if($('#property_info_frm').valid()){
            if($("#property_type").val() != "" && $("#property_state").val() != "" && $("#auction_status").val() != "" && $("#prop_listing_status").val() != "" && (($("#prop_listing_status").val() == 9 &&  $("#closing_status").val() != "") || ($("#prop_listing_status").val() != 9 &&  $("#closing_status").val() == ""))){
               save_property('property_info_frm');
            }
        }
    });
    $(document).on('click', '#property_info_submit_exit_btn', function(){
        $('#next_url').val('/admin/listing/');
        try{
            var start_dates = $("#virtual_bidding_start_date").val();
            var end_dates = $("#virtual_bidding_end_date").val();
            var open_house_start_dates = $("#virtual_open_house_start_date").val();
            var open_house_end_dates = $("#virtual_open_house_end_date").val();
            var asset_id = $('input[name="asset_type"]:checked').val();
            if (start_dates != "" && $('option:selected','#auction_type').val() != 4) {
                var actualStartDate = start_dates.split(" ");
                var change_format = actualStartDate[0].split("-");
                var new_format = change_format[2]+"-"+change_format[0]+"-"+change_format[1];
                actualStartDate = new_format + ' ' + convert_to_24h(actualStartDate[1] + ' ' + actualStartDate[2]);
                var actualStartDateUtc = convert_to_utc_datetime(actualStartDate, 'datetime');
                //var actualStartDateUtc = convert_to_utc_date(actualStartDate, 'mm-dd-yyyy', 'datetime');
                $("#bidding_start_date").val(actualStartDateUtc);
                $("#bidding_start_date_local").val(actualStartDate);
            }else{
                $("#virtual_bidding_start_date").val('');
                $("#bidding_start_date").val('');
                $("#bidding_start_date_local").val('');
            }
            if (end_dates != "" && $('option:selected','#auction_type').val() != 4) {
                var actualEndDate = end_dates.split(" ");
                var change_format = actualEndDate[0].split("-");
                var new_format = change_format[2]+"-"+change_format[0]+"-"+change_format[1];
                actualEndDate = new_format + ' ' + convert_to_24h(actualEndDate[1] + ' ' + actualEndDate[2]);
                var actualEndDateUtc = convert_to_utc_datetime(actualEndDate, 'datetime');
                //var actualEndDateUtc = convert_to_utc_date(actualEndDate, 'mm-dd-yyyy', 'datetime');
                $("#bidding_end_date").val(actualEndDateUtc);
                $("#bidding_end_date_local").val(actualEndDate);
            }else{
                $("#virtual_bidding_end_date").val('');
                $("#bidding_end_date").val('');
                $("#bidding_end_date_local").val('');
            }

            $('.open_house_start').each(function(index){
                var open_house_start_dates = $("#virtual_open_house_start_date_"+index).val();
                if (open_house_start_dates != "") {
                    var actualOpenHouseStartDate = open_house_start_dates.split(" ");
                    var change_format = actualOpenHouseStartDate[0].split("-");
                    var new_format = change_format[2]+"-"+change_format[0]+"-"+change_format[1];
                    actualOpenHouseStartDate = new_format + ' ' + convert_to_24h(actualOpenHouseStartDate[1] + ' ' + actualOpenHouseStartDate[2]);
                    var actualOpenHouseStartDateUtc = convert_to_utc_datetime(actualOpenHouseStartDate, 'datetime');
                    //var actualStartDateUtc = convert_to_utc_date(actualStartDate, 'mm-dd-yyyy', 'datetime');
                    $("#open_house_start_date_"+index).val(actualOpenHouseStartDateUtc);
                    $("#open_house_start_date_local_"+index).val(actualOpenHouseStartDate);
                }else{
                    $("#virtual_open_house_start_date_"+index).val('');
                    $("#open_house_start_date_"+index).val('');
                    $("#open_house_start_date_local_"+index).val('');
                }
            });
            $('.open_house_end').each(function(i){
                var open_house_end_dates = $("#virtual_open_house_end_date_"+i).val();
                if (open_house_end_dates != "") {
                    var actualOpenHouseEndDate = open_house_end_dates.split(" ");
                    var change_format = actualOpenHouseEndDate[0].split("-");
                    var new_format = change_format[2]+"-"+change_format[0]+"-"+change_format[1];
                    actualOpenHouseEndDate = new_format + ' ' + convert_to_24h(actualOpenHouseEndDate[1] + ' ' + actualOpenHouseEndDate[2]);
                    var actualOpenHouseEndDateUtc = convert_to_utc_datetime(actualOpenHouseEndDate, 'datetime');
                    //var actualEndDateUtc = convert_to_utc_date(actualEndDate, 'mm-dd-yyyy', 'datetime');
                    $("#open_house_end_date_"+i).val(actualOpenHouseEndDateUtc);
                    $("#open_house_end_date_local_"+i).val(actualOpenHouseEndDate);
                }else{
                    $("#virtual_open_house_end_date_"+i).val();
                    $("#open_house_end_date_"+i).val('');
                    $("#open_house_end_date_local_"+i).val('');
                }
            });
//            $('.open_house_start_date').each(function() {
//                var position = $(this).closest('.add_more_open_house_date').attr('rel_position');
//                var asset_type = $('input[name="asset_type"]:checked').val();
//                if(parseInt(asset_type) == 2 || parseInt(asset_type) == 3){
//                    $(this).rules("add",
//                    {
//                        required: true,
//                        messages: {
//                            required: "Start Date is required",
//                        }
//                    });
//                }
//
//
//            });
            $('.open_house_end_date').each(function() {
                var position = $(this).closest('.add_more_open_house_date').attr('rel_position');
                var asset_type = $('input[name="asset_type"]:checked').val();
                if(parseInt(asset_type) == 2 || parseInt(asset_type) == 3){
                    $(this).rules("add",
                        {
                            //required: true,
                            required: function(){
                                if ($('#virtual_open_house_start_date_'+position).val() != "") {
                                    return true;
                                } else {
                                    return false;
                                }
                            },
                            greaterThan: function(){
                                if ($('#virtual_open_house_start_date_'+position).val() != "") {
                                    return "#open_house_start_date_"+position;
                                } else {
                                    return false;
                                }
                            },
                            messages: {
                                required: "End Date is required",
                                greaterThan: "Must be greater than start date",

                            },

                        });
                }

            });
            if(parseInt(asset_id) == 1 || parseInt(asset_id) == 2){
                var lease_exp_dates = $("#virtual_lease_exp_date").val();
                if(lease_exp_dates != ""){
                    var actualExpDate = lease_exp_dates.split(" ");
                    var change_format = actualExpDate[0].split("-");
                    var new_format = change_format[2]+"-"+change_format[0]+"-"+change_format[1];
                    actualExpDate = new_format + ' ' + convert_to_24h(actualExpDate[1] + ' ' + actualExpDate[2]);
                    var actualExpDateUtc = convert_to_utc_datetime(actualExpDate, 'datetime');
                    //var actualEndDateUtc = convert_to_utc_date(actualEndDate, 'mm-dd-yyyy', 'datetime');
                    $("#lease_exp_date").val(actualExpDateUtc);
                    $("#lease_exp_date_local").val(actualExpDate);
                }
            }else{
                $("#lease_exp_date").val('');
                $("#lease_exp_date_local").val('');
                $("#virtual_lease_exp_date").val('');
            }
            if(parseInt(asset_id) == 1){
                var crp_exp_dates = $("#virtual_crp_exp_date").val();
                if(crp_exp_dates != ""){
                    var actualCrpExpDate = crp_exp_dates.split(" ");
                    var change_format = actualCrpExpDate[0].split("-");
                    var new_format = change_format[2]+"-"+change_format[0]+"-"+change_format[1];
                    actualCrpExpDate = new_format + ' ' + convert_to_24h(actualCrpExpDate[1] + ' ' + actualCrpExpDate[2]);
                    var actualCrpExpDateUtc = convert_to_utc_datetime(actualCrpExpDate, 'datetime');
                    //var actualEndDateUtc = convert_to_utc_date(actualEndDate, 'mm-dd-yyyy', 'datetime');
                    $("#crp_exp_date").val(actualCrpExpDateUtc);
                    $("#crp_exp_date_local").val(actualCrpExpDate);
                }
            }else{
                $("#virtual_crp_exp_date").val('');
                $("#crp_exp_date").val('');
                $("#crp_exp_date_local").val('');
            }

            //functionality for insider auction
            if($('option:selected','#auction_type').val() == 2){
                var dutch_start_date = $("#virtual_dutch_bidding_start_date").val();
                if(dutch_start_date != ""){
                    var actualStartDate = dutch_start_date.split(" ");
                    var change_format = actualStartDate[0].split("-");
                    var new_format = change_format[2]+"-"+change_format[0]+"-"+change_format[1];
                    actualStartDate = new_format + ' ' + convert_to_24h(actualStartDate[1] + ' ' + actualStartDate[2]);
                    var actualStartDateUtc = convert_to_utc_datetime(actualStartDate, 'datetime');
                    //var actualEndDateUtc = convert_to_utc_date(actualEndDate, 'mm-dd-yyyy', 'datetime');
                    $("#dutch_bidding_start_date").val(actualStartDateUtc);
                    $("#dutch_bidding_start_date_local").val(actualStartDate);
                    //var dutch_bidding_start_date
                }else{
                    $("#virtual_dutch_bidding_start_date").val('');
                    $("#dutch_bidding_start_date_local").val('');
                    $("#dutch_bidding_start_date").val('');
                }
                var dutch_end_date = $('#virtual_dutch_bidding_end_date').val();
                if(dutch_end_date != ""){
                    var actualStartDate = dutch_end_date.split(" ");
                    var change_format = actualStartDate[0].split("-");
                    var new_format = change_format[2]+"-"+change_format[0]+"-"+change_format[1];
                    actualStartDate = new_format + ' ' + convert_to_24h(actualStartDate[1] + ' ' + actualStartDate[2]);
                    var actualStartDateUtc = convert_to_utc_datetime(actualStartDate, 'datetime');
                    //var actualEndDateUtc = convert_to_utc_date(actualEndDate, 'mm-dd-yyyy', 'datetime');
                    $("#dutch_bidding_end_date").val(actualStartDateUtc);
                    $("#dutch_bidding_end_date_local").val(actualStartDate);
                    //var dutch_bidding_start_date
                }else{
                    $("#virtual_dutch_bidding_end_date").val('');
                    $("#dutch_bidding_end_date_local").val('');
                    $("#dutch_bidding_end_date").val('');
                }
                var sealed_start_date = $('#virtual_sealed_bidding_start_date').val();
                if(sealed_start_date != ""){
                    var actualStartDate = sealed_start_date.split(" ");
                    var change_format = actualStartDate[0].split("-");
                    var new_format = change_format[2]+"-"+change_format[0]+"-"+change_format[1];
                    actualStartDate = new_format + ' ' + convert_to_24h(actualStartDate[1] + ' ' + actualStartDate[2]);
                    var actualStartDateUtc = convert_to_utc_datetime(actualStartDate, 'datetime');
                    //var actualEndDateUtc = convert_to_utc_date(actualEndDate, 'mm-dd-yyyy', 'datetime');
                    $("#sealed_bidding_start_date").val(actualStartDateUtc);
                    $("#sealed_bidding_start_date_local").val(actualStartDate);
                    //var dutch_bidding_start_date
                }else{
                    $("#virtual_sealed_bidding_start_date").val('');
                    $("#sealed_bidding_start_date_local").val('');
                    $("#sealed_bidding_start_date").val('');
                }
                var sealed_end_date = $('#virtual_sealed_bidding_end_date').val();
                if(sealed_end_date != ""){
                    var actualStartDate = sealed_end_date.split(" ");
                    var change_format = actualStartDate[0].split("-");
                    var new_format = change_format[2]+"-"+change_format[0]+"-"+change_format[1];
                    actualStartDate = new_format + ' ' + convert_to_24h(actualStartDate[1] + ' ' + actualStartDate[2]);
                    var actualStartDateUtc = convert_to_utc_datetime(actualStartDate, 'datetime');
                    //var actualEndDateUtc = convert_to_utc_date(actualEndDate, 'mm-dd-yyyy', 'datetime');
                    $("#sealed_bidding_end_date").val(actualStartDateUtc);
                    $("#sealed_bidding_end_date_local").val(actualStartDate);
                    //var dutch_bidding_start_date
                }else{
                    $("#virtual_sealed_bidding_end_date").val('');
                    $("#sealed_bidding_end_date_local").val('');
                    $("#sealed_bidding_end_date").val('');
                }
                var english_start_date = $('#virtual_english_bidding_start_date').val();
                if(english_start_date != ""){
                    var actualStartDate = english_start_date.split(" ");
                    var change_format = actualStartDate[0].split("-");
                    var new_format = change_format[2]+"-"+change_format[0]+"-"+change_format[1];
                    actualStartDate = new_format + ' ' + convert_to_24h(actualStartDate[1] + ' ' + actualStartDate[2]);
                    var actualStartDateUtc = convert_to_utc_datetime(actualStartDate, 'datetime');
                    //var actualEndDateUtc = convert_to_utc_date(actualEndDate, 'mm-dd-yyyy', 'datetime');
                    $("#english_bidding_start_date").val(actualStartDateUtc);
                    $("#english_bidding_start_date_local").val(actualStartDate);
                    //var dutch_bidding_start_date
                }else{
                    $("#virtual_english_bidding_start_date").val('');
                    $("#english_bidding_start_date_local").val('');
                    $("#english_bidding_start_date").val('');
                }
                var english_end_date = $('#virtual_english_bidding_end_date').val();
                if(english_end_date != ""){
                    var actualStartDate = english_end_date.split(" ");
                    var change_format = actualStartDate[0].split("-");
                    var new_format = change_format[2]+"-"+change_format[0]+"-"+change_format[1];
                    actualStartDate = new_format + ' ' + convert_to_24h(actualStartDate[1] + ' ' + actualStartDate[2]);
                    var actualStartDateUtc = convert_to_utc_datetime(actualStartDate, 'datetime');
                    //var actualEndDateUtc = convert_to_utc_date(actualEndDate, 'mm-dd-yyyy', 'datetime');
                    $("#english_bidding_end_date").val(actualStartDateUtc);
                    $("#english_bidding_end_date_local").val(actualStartDate);
                    //var dutch_bidding_start_date
                }else{
                    $("#virtual_english_bidding_end_date").val('');
                    $("#english_bidding_end_date_local").val('');
                    $("#english_bidding_end_date").val('');
                }

                /*var dutch_auction_time = $('#property_info_frm #dutch_auction_time').val();
                var dutch_pause_time = $('#property_info_frm #dutch_pause_time').val();
                var sealed_auction_time = $('#property_info_frm #sealed_auction_time').val();
                var sealed_pause_time = $('#property_info_frm #sealed_pause_time').val();
                var english_auction_time = $('#property_info_frm #english_auction_time').val();
                var dutch_start_date = $('#dutch_bidding_start_date_local').val();
                if(dutch_auction_time != "" && dutch_start_date != ""){
                    try{
                       custom_response = {
                        'add_min': dutch_auction_time,
                        'actualStartDate': dutch_start_date,
                        'date_virtual_element_id': '#virtual_dutch_bidding_end_date',
                        'date_local_element_id': '#dutch_bidding_end_date_local',
                        'date_utc_element_id': '#dutch_bidding_end_date',
                      };
                      customCallBackFunc(calculate_insider_dates, [custom_response]);
                    }catch(ex){
                        //console.log(ex);
                    }
                }

                var dutch_end_date = $('#dutch_bidding_end_date_local').val();
                if(dutch_pause_time != "" && dutch_end_date != ""){
                    try{
                       custom_response = {
                        'add_min': dutch_pause_time,
                        'actualStartDate': dutch_end_date,
                        'date_virtual_element_id': '#virtual_sealed_bidding_start_date',
                        'date_local_element_id': '#sealed_bidding_start_date_local',
                        'date_utc_element_id': '#sealed_bidding_start_date',
                      };
                      customCallBackFunc(calculate_insider_dates, [custom_response]);
                    }catch(ex){
                        //console.log(ex);
                    }
                }
                var sealed_start_date = $('#sealed_bidding_start_date_local').val();
                if(sealed_auction_time != "" && sealed_start_date != ""){
                    try{
                       custom_response = {
                        'add_min': sealed_auction_time,
                        'actualStartDate': sealed_start_date,
                        'date_virtual_element_id': '#virtual_sealed_bidding_end_date',
                        'date_local_element_id': '#sealed_bidding_end_date_local',
                        'date_utc_element_id': '#sealed_bidding_end_date',
                      };
                      customCallBackFunc(calculate_insider_dates, [custom_response]);
                    }catch(ex){
                        //console.log(ex);
                    }
                }
                var sealed_end_date = $('#sealed_bidding_end_date_local').val();
                if(sealed_pause_time != "" && sealed_end_date != ""){
                    try{
                       custom_response = {
                        'add_min': sealed_pause_time,
                        'actualStartDate': sealed_end_date,
                        'date_virtual_element_id': '#virtual_english_bidding_start_date',
                        'date_local_element_id': '#english_bidding_start_date_local',
                        'date_utc_element_id': '#english_bidding_start_date',
                      };
                      customCallBackFunc(calculate_insider_dates, [custom_response]);
                    }catch(ex){
                        //console.log(ex);
                    }
                }
                var english_start_date = $('#english_bidding_start_date_local').val();
                if(english_auction_time != "" && english_start_date != ""){
                    try{
                       custom_response = {
                        'add_min': english_auction_time,
                        'actualStartDate': english_start_date,
                        'date_virtual_element_id': '#virtual_english_bidding_end_date',
                        'date_local_element_id': '#english_bidding_end_date_local',
                        'date_utc_element_id': '#english_bidding_end_date',
                      };
                      customCallBackFunc(calculate_insider_dates, [custom_response]);
                    }catch(ex){
                        //console.log(ex);
                    }
                }*/


            }else{
                $("#virtual_dutch_bidding_start_date").val('');
                $("#dutch_bidding_start_date_local").val('');
                $("#dutch_bidding_start_date").val('');
                $("#virtual_dutch_bidding_end_date").val('');
                $("#dutch_bidding_end_date_local").val('');
                $("#dutch_bidding_end_date").val('');
                $("#virtual_sealed_bidding_start_date").val('');
                $("#sealed_bidding_start_date_local").val('');
                $("#sealed_bidding_start_date").val('');
                $("#virtual_sealed_bidding_end_date").val('');
                $("#sealed_bidding_end_date_local").val('');
                $("#sealed_bidding_end_date").val('');
                $("#virtual_english_bidding_start_date").val('');
                $("#english_bidding_start_date_local").val('');
                $("#english_bidding_start_date").val('');
                $("#virtual_english_bidding_end_date").val('');
                $("#english_bidding_end_date_local").val('');
                $("#english_bidding_end_date").val('');
            }


        }catch(ex){
            //console.log(ex);
        }
//        if($('#property_info_frm').valid()){
//            save_property('property_info_frm');
//        }
          if($('#property_info_frm').valid()){
                if($("#property_type").val() != "" && $("#property_state").val() != "" && $("#auction_status").val() != "" && $("#prop_listing_status").val() != "" && (($("#prop_listing_status").val() == 9 &&  $("#closing_status").val() != "") || ($("#prop_listing_status").val() != 9 &&  $("#closing_status").val() == ""))){
                   save_property('property_info_frm');
                }
          }
    });
    $(document).on('click', '#property_map_submit_next_btn', function(){
        $('#property_map_view_frm').validate();
        $('#next_url').val('/admin/property-photo-video/');
        if($('#property_map_view_frm').valid()){
            save_property('property_map_view_frm');
        }
    });
    $(document).on('change', '#prop_listing_status', function(){
        var auction_type = $('option:selected','#auction_type').val();
        var current_listing_status = $('#current_listing_status').val();
        $('#property_info_frm  #closing_status').val("");
            $('#property_info_frm  #closing_status').trigger("chosen:updated");
        if(parseInt(auction_type) == 4 && parseInt(current_listing_status) == 9 && parseInt($(this).val()) == 1){
            $('.closing_asterisk').hide();
            $('#confirmChangeStatusModal').modal('show');
            return false;
        }else if(parseInt($(this).val()) == 9){
            $('.closing_asterisk').show();

        }else{
            $('#is_reset_offer').val(0);
            $('.closing_asterisk').hide();
        }

    });
    $(document).on('click', '#change_status_true', function(){
        $('#is_reset_offer').val(1);
        $('#confirmChangeStatusModal').modal('hide');
        return true;

    });
    $(document).on('click', '#change_status_false,#change_status_false_top', function(){
        $('#prop_listing_status').val(9);
        $('#prop_listing_status').trigger("chosen:updated");
        $('#is_reset_offer').val(0);
        $('#confirmChangeStatusModal').modal('hide');

    });
    $("#offer_unpriced").change(function() {
        if(this.checked) {
            $('label[for="bidding_min_price"] span').hide();
            $('#bidding_min_price-error').remove();
        }else
        {
            $('label[for="bidding_min_price"] span').show();

        }
    });
//    $(document).on('click', 'input[name="offer_unpriced"]', function(){
//        if($(this).is(':checked') == true){
//            if($('input[name="required_all"]').is(':checked') == true){
//                $('label[for="bidding_min_price"] span').show();
//            }else{
//                $('label[for="bidding_min_price"] span').hide();
//                $('#bidding_min_price-error').remove();
//            }
//        }else{
//            if($('input[name="required_all"]').is(':checked') == true){
//                $('label[for="bidding_min_price"] span').show();
//            }else{
//                $('label[for="bidding_min_price"] span').hide();
//                $('#bidding_min_price-error').remove();
//            }
//        }
//    });
    $(document).on('click', 'input[name="required_all"]', function(){
        if($(this).is(':checked') == false){
            if($('input[name="offer_unpriced"]').is(':checked') == true){
                $('label[for="bidding_min_price"] span').hide();
                $('#bidding_min_price-error').remove();
            }else{
                $('label[for="bidding_min_price"] span').show();
            }
            $('label[for="due_diligence_period"] span').hide();
            $('#due_diligence_period-error').remove();
            $('label[for="escrow_period"] span').hide();
            $('#escrow_period-error').remove();
            $('label[for="earnest_deposit"] span').hide();
            $('#earnest_deposit-error').remove();
        }else{
            if($('input[name="offer_unpriced"]').is(':checked') == true){
                $('label[for="bidding_min_price"] span').hide();
                $('#bidding_min_price-error').remove();
            }else{
                $('label[for="bidding_min_price"] span').show();
            }
            $('label[for="due_diligence_period"] span').show();
            $('label[for="escrow_period"] span').show();
            $('label[for="earnest_deposit"] span').show();
        }
    });
    $(document).on('change', '#auction_type', function(){
        var auction_type = $(this).val();
        init_auction_start_date();
        init_auction_end_date();

        $('#datetimepicker2').attr('data-value','');
        $('#virtual_bidding_start_date').val('');
        $('#bidding_start_date_local').val('');
        $('#bidding_start_date').val('');
        $('#virtual_bidding_end_date').val('');
        $('#bidding_end_date_local').val('');
        $('#bidding_end_date').val('');
        $('#earnest_deposit').val('');
        $('#due_diligence_period').val('');
        $('#escrow_period').val('');
        //reset hybrid insider fields
        $('#insider_start_price').val('');
        $('#price_decrease_rate').val('0');
        $('#price_decrease_rate_value').html('0 %');
        $('#dutch_auction_time').val('0');
        $('#dutch_auction_time_value').html('10 Min');
        $('#dutch_pause_time').val('0');
        $('#dutch_pause_time_value').html('0 Min');
        $('#datetimepicker5').attr('data-value','');
        $('#virtual_dutch_bidding_start_date').val('');
        $('#dutch_bidding_start_date_local').val('');
        $('#dutch_bidding_start_date').val('');
        $('#datetimepicker6').attr('data-value','');
        $('#virtual_dutch_bidding_end_date').val('');
        $('#dutch_bidding_end_date_local').val('');
        $('#dutch_bidding_end_date').val('');
        $('#sealed_auction_time').val('0');
        $('#sealed_auction_time_value').html('0 Min');
        $('#sealed_pause_time').val('0');
        $('#sealed_pause_time_value').html('0 Min');
        $('#datetimepicker7').attr('data-value','');
        $('#virtual_sealed_bidding_start_date').val('');
        $('#sealed_bidding_start_date_local').val('');
        $('#sealed_bidding_start_date').val('');
        $('#datetimepicker8').attr('data-value','');
        $('#virtual_sealed_bidding_end_date').val('');
        $('#sealed_bidding_end_date_local').val('');
        $('#sealed_bidding_end_date').val('');
        $('#english_auction_time').val('0');
        $('#english_auction_time_value').html('0 Min');
        $('#insider_bid_increment').val('');
        $('#datetimepicker9').attr('data-value','');
        $('#virtual_english_bidding_start_date').val('');
        $('#english_bidding_start_date_local').val('');
        $('#english_bidding_start_date').val('');
        $('#datetimepicker10').attr('data-value','');
        $('#virtual_english_bidding_end_date').val('');
        $('#english_bidding_end_date_local').val('');
        $('#english_bidding_end_date').val('');

        if(parseInt(auction_type) == 1){
            $('.best_offer_section').hide();
            $('.earnest_deposit_type').hide();
            $('.offer_unpriced_section').hide();
            $('label[for="virtual_bidding_start_date"]').html('Bidding Starting Time <span class="text-danger" style="">*</span>');
            $('label[for="virtual_bidding_end_date"]').html('Bidding Ending Time <span class="text-danger" style="">*</span>');
            $('label[for="virtual_bidding_start_date"] span').show();
            $('label[for="virtual_bidding_end_date"] span').show();
            $('.offer_amount').hide();
            $('.bidding_date').show();
            $('.bidding_time_zone').show();
            $('.bid_increment').show();
            $('.reserve_amount').show();
            $('#insider_auction_section').hide();
            $('.auction_location').hide();
            $('label[for="bidding_min_price"]').html('Bid Minimum Price <span class="text-danger">*</span>');
            $('#bidding_min_price').attr('placeholder','Enter Bid Minimum Price');
            $('label[for="bidding_min_price"] a').hide();
            $('#bid_minimum_price_section').show();
            $('.buyers_premium').show();
            $('.buyers_premium_percentage').show();
            $('.buyers_premium_min_amount').show();
            $(".is_deposit_required").show();
            $(".deposit_amount_section").show();
        }
        if(parseInt(auction_type) == 4){
            $('.best_offer_section').hide();
            $('.earnest_deposit_type').hide();
            $('.offer_unpriced_section').hide();
            $('label[for="virtual_bidding_start_date"] span').hide();
            $('label[for="virtual_bidding_end_date"] span').hide();
            $("#virtual_bidding_start_date").val('');
            $("#bidding_start_date").val('');
            $("#bidding_start_date_local").val('');
            $("#virtual_bidding_end_date").val('');
            $("#bidding_end_date").val('');
            $("#bidding_end_date_local").val('');
            $('.bidding_date').hide();
            $('.bidding_time_zone').hide();
            $('.bid_increment').hide();
            $('.reserve_amount').hide();
            $('.offer_amount').hide();
            $('#insider_auction_section').hide();
            $('.auction_location').hide();
            $('label[for="bidding_min_price"]').html('Asking Price <span class="text-danger">*</span>');
            $('#bidding_min_price').attr('placeholder','Enter Asking Price');
            $('#bid_minimum_price_section').show();
            //$('label[for="bidding_min_price"] a').hide();
            $('.buyers_premium_section').hide();
            $(".is_deposit_required_section").hide();
        }
        if(parseInt(auction_type) == 7){
            $('.best_offer_section').show();
            $('.earnest_deposit_type').show();
            $('.offer_unpriced_section').show();
            $('#offer_unpriced').prop('checked', false);
            $('input[name="highest_offer_format"]').prop('checked', false);
            $('label[for="virtual_bidding_start_date"]').html('Offer Starting Time <span class="text-danger" style="">*</span>');
            $('label[for="virtual_bidding_end_date"]').html('Offer Ending Time <span class="text-danger" style="">*</span>');
            $('label[for="virtual_bidding_start_date"] span').show();
            $('label[for="virtual_bidding_end_date"] span').show();
            $('.auction_location').hide();
            $('.offer_amount').hide();
            $('.bidding_date').show();
            $('.bidding_time_zone').show();
            $('.bid_increment').hide();
            $('.reserve_amount').hide();
            $('#insider_auction_section').hide();
            $('label[for="bidding_min_price"]').html('Asking Price <span class="text-danger">*</span>');
            $('#bidding_min_price').attr('placeholder','Enter Asking Price');
            $('#bid_minimum_price_section').show();
            $('.buyers_premium').show();
            $('.buyers_premium_percentage').show();
            $('.buyers_premium_min_amount').show();
            $(".is_deposit_required_section").hide();
        }
        if(parseInt(auction_type) == 6){
            $('.best_offer_section').hide();
            $('.offer_unpriced_section').hide();

            $('label[for="virtual_bidding_start_date"]').html('Bidding Starting Time <span class="text-danger" style="">*</span>');
            $('label[for="virtual_bidding_end_date"]').html('Bidding Ending Time <span class="text-danger" style="">*</span>');

            $('label[for="virtual_bidding_start_date"] span').show();
            $('label[for="virtual_bidding_end_date"] span').show();
            $('.bidding_date').show();
            $('.bidding_time_zone').show();
            $('.bid_increment').hide();
            $('.auction_location').show();
            $('.reserve_amount').show();
            $('#insider_auction_section').hide();
            $('label[for="bidding_min_price"]').html('Bid Minimum Price <span class="text-danger">*</span>');
            $('#bidding_min_price').attr('placeholder','Enter Bid Minimum Price');
            $('#bid_minimum_price_section').show();
            $('.buyers_premium_section').hide();
            $(".is_deposit_required_section").hide();
        }
        if(parseInt(auction_type) == 2){
            $('.best_offer_section').hide();
            $('.offer_unpriced_section').hide();
            $('.bidding_date').hide();
            $('.bidding_time_zone').show();
            $('.bid_increment').hide();
            $('.auction_location').hide();
            $('.reserve_amount').hide();
            $('#bid_minimum_price_section').hide();
            $('#insider_auction_section').show();
            $('.buyers_premium_section').hide();
            $(".is_deposit_required").show();
            $(".deposit_amount_section").show();
        }
        $.ajax({
            url: '/admin/get-auction-type-status/',
            type: 'post',
            dataType: 'json',
            cache: false,
            data: {'auction_type': auction_type},
            beforeSend: function(){
            },
            success: function(response){
                if(response.error == 0){
                    $('#property_info_frm #prop_listing_status').empty();
                    $('#property_info_frm #prop_listing_status').html('<option value="">Select</option>');
                    $.each(response.status_list, function(i, item) {
                        $('#property_info_frm #prop_listing_status').append('<option value="'+item.id+'">'+item.status_name+'</option>');
                    });
                    $('#property_info_frm  #prop_listing_status').trigger("chosen:updated");
                }
            }
        });
    });
    $(document).on('click', '#property_map_submit_exit_btn', function(){
        $('#next_url').val('/admin/listing/');
        if($('#property_map_view_frm').valid()){
            save_property('property_map_view_frm');
        }
    });
    $(document).on('click', '#property_image_submit_next_btn', function(){
        $('#next_url').val('/admin/property-document/');
        if($('#property_photo_video_frm').valid()){
            save_property('property_photo_video_frm');
        }
    });
    $(document).on('click', '#property_image_submit_exit_btn', function(){
        $('#next_url').val('/admin/listing/');
        if($('#property_photo_video_frm').valid()){
            save_property('property_photo_video_frm');
        }
    });
    $(document).on('click', '#submit_listing', function(){
        if($('#property_document_frm').valid()){
            save_property('property_document_frm');
        }
    });
    $(document).on('click', '#addVideoBtn', function(){
        var upload_id = '';
        var actual_id = '';
        var upload_name = '';
        var actual_name = '';
        var property_id = $('#property_id').val();
        var video_url = $('#property_video_url').val();
        if(video_url != ""){
            $.ajax({
                url: '/admin/save-property-video/',
                type: 'post',
                dataType: 'json',
                cache: false,
                data: {property_id: property_id, video_url: video_url},
                beforeSend: function(){
                    $('.overlay').show();
                },
                success: function(response){
                    $('.overlay').hide();
                    if(response.error == 0){
                        $.growl.notice({title: "Video ", message: "Video saved successfully.", size: 'large'});
                        //var video_url = $('#property_video_url').val();
                        var video_url = $('#property_video_url').val('');
                        var property_video_id = $('#property_video_id').val();
                        var property_video_name = $('#property_video_name').val();
                        if(response.data.upload_id){
                            upload_id = response.data.upload_id.toString();
                            $('#propertyVideoList').append('<li rel_id="'+upload_id+'"><a href="javascript:void(0)" data-article-id="'+property_id+'" data-image-id="'+upload_id+'" data-image-name="'+response.video_url+'" data-image-section="property_video" class="close-btn confirm_image_delete"><i class="fas fa-times"></i></a><iframe width="190" height="126" src="'+response.video_url+'" frameborder="0" allowfullscreen></iframe></iframe></li>');
                            upload_id = upload_id+','+property_video_id;
                            actual_id = upload_id.replace(/(^,)|(,$)/g, "");
                            upload_name = response.video_url+','+property_video_name;
                            actual_name = upload_name.replace(/(^,)|(,$)/g, "");
                            $('#property_video_id').val(actual_id);
                            $('#property_video_name').val(actual_name);
                            $('#propertyVideoList').show();
                            $('#PropertyVideoDiv').show();
                        }
                    }else{
                        window.setTimeout(function () {
                            $.growl.error({title: "Video ", message: response.msg, size: 'large'});
                        }, 2000);
                    }
                }
            });
        }
    });

      /* Add custom value to dropdown */
      $(document).on('change', '.new_feature_dropdown', function(){
        add_icon_dropdown_new_feature();
        $('p.error').hide();
        $('#addNewFeatureFrm #feature_type').val('');
        $('#addNewFeatureFrm #feature_name').val('');
        var element = $(this).attr('id');
        var selected = $('option:selected',this).val();
        if(selected != "" && selected == 0){
            if($('option:selected',this).val() == 0){
                selected_val = $(this).val();
                if (Array.isArray(selected_val)) {
                  var index = selected_val.indexOf("0");
                  selected_val.splice(index, 1);
                  $(this).val(selected_val);
                }else{
                    $(this).val('');
                }
                $(this).trigger("chosen:updated");
            }
            $('#addNewFeatureFrm #feature_type').val(element);
            $('#addNewFeatureModal').modal('show');
        }
      });
      $('#addNewFeatureFrm').validate({
        errorElement: 'p',
        rules:{
            feature_name:{
                required: true
            }
        },
        messages:{
            feature_name:{
                required: "Feature Name is required"
            }
        },
        submitHandler: function(){
            data = {
                'feature_name': $('#addNewFeatureFrm #feature_name').val(),
                'feature_type': $('#addNewFeatureFrm #feature_type').val(),
                'asset_id': $('input[name="asset_type"]:checked').val(),
            }
            $.ajax({
            url: '/admin/add-property-features/',
            type: 'post',
            dataType: 'json',
            cache: false,
            data: data,
            beforeSend: function(){
            },
            success: function(response){
                if(response.error == 0){
                    window.setTimeout(function () {
                        $.growl.notice({title: "Features ", message: "Feature added successfully", size: 'large'});
                    }, 2000);
                    $('#'+response.section).append('<option value="'+response.feature_id+'" selected>'+response.feature_name+'</option>');
                    selected_val = $('#'+response.section).val();
                    if (Array.isArray(selected_val)) {
                      selected_val.push(response.feature_id);
                      $('#'+response.section).val(selected_val);
                    }else{
                        $('#'+response.section).val(response.feature_id);
                    }
                    $('#'+response.section).trigger("chosen:updated");
                    $('#addNewFeatureFrm #feature_type').val('');
                    $('#addNewFeatureFrm #feature_name').val('');
                    $('#addNewFeatureModal').modal('hide');
                }else{
                    window.setTimeout(function () {
                        $.growl.error({title: "Features ", message: "Some error occurs, please try again", size: 'large'});
                    }, 2000);
                }
            }
        });
        }
      });
      //to remove add new feature option from dropdown selected values
      $(document).on('click','.selectallSection',function(){
        var element_id = $(this).closest('.chosen-container').siblings('select').attr('id');
        $('#'+element_id+' option[value="0"]').prop('selected', false);
        $('#'+element_id).trigger("chosen:updated");
      });

      $(document).on('keyup', '#property_zip_code', function(){
           zip_code = $(this).val();
           country_code = $("#prop_country").find(':selected').data('short-code');
           country_id = $("#prop_country").val();
           if(zip_code.length > 4 && country_id == 1){
                params = {
                    'zip_code': zip_code,
                    'call_function': set_property_address_by_zipcode,
                }
                get_address_by_zipcode(params);
           }
      });
      $(document).on('keyup', '#prop_search', function(e){
              var x = document.getElementById(this.id + "autocomplete-list");
              if (x) x = x.getElementsByTagName("div");
              if (e.keyCode == 40) {
                /*If the arrow DOWN key is pressed,
                increase the currentFocus variable:*/
                currentFocus++;
                /*and and make the current item more visible:*/
                addActive(x);
              } else if (e.keyCode == 38) { //up
                /*If the arrow UP key is pressed,
                decrease the currentFocus variable:*/
                currentFocus--;
                /*and and make the current item more visible:*/
                addActive(x);
              } else if (e.keyCode == 13) {
                /*If the ENTER key is pressed, prevent the form from being submitted,*/
                e.preventDefault();
                if (currentFocus > -1) {
                  /*and simulate a click on the "active" item:*/
                  if (x) x[currentFocus].click();
                }
              }else{
                var search = $(this).val();
                $.ajax({
                    url: '/admin/listing-search-suggestion/',
                    type: 'post',
                    dataType: 'json',
                    cache: false,
                    data: {'search': search},
                    beforeSend: function(){
                    },
                    success: function(response){
                        if(response.error == 0 && response.status == 200){
                            autocomplete("prop_search", response.suggestion_list);
                        }else{
                            closeAllSuggestions('autocomplete-items');
                        }
                    }
                });
              }
      });
      $(document).on('click', '#del_prop_false', function(){
        $('#del_prop_true').removeAttr('rel_id');
        $('#del_prop_false').removeAttr('rel_id');
        $('.personalModalwrap').modal('hide');
        return false;
    });
    $('#global_listing_setting_frm').validate({
        errorElement: 'p',
        rules:{
            auto_approval:{
                required: true
            },
            is_deposit_required:{
                required: true
            },
            reserve_not_met:{
                required: true
            },
            is_log_time_extension:{
                required: true
            },
            log_time_extension:{
                required: function () {
                    if (parseInt($('input[name="is_log_time_extension"]').val()) == 1) {
                        return true;
                    } else {
                        return false;
                    }
                },
                min:1
            },
            remain_time_to_add_extension:{
                required: true,
                min:1
            },
            timer_flash:{
                required: true,
                min:1
            },
            bid_limit:{
                required: function () {
                    if (parseInt($('input[name="auto_approval"]').val()) == 1) {
                        return true;
                    }else{
                        return false;
                    }
                },
                min:0
            },
            listing_deposit_amount:{
                required: function () {
                    if (parseInt($('input[name="is_deposit_required"]').val()) == 1) {
                        return true;
                    }else{
                        return false;
                    }
                },
                min:1
            }
        },
        messages:{
            auto_approval:{
                required: "Auto approval is required"
            },
            reserve_not_met:{
                required: "Reserve not met is required"
            },
            is_log_time_extension:{
                required: "Is log time extension is required"
            },
            log_time_extension:{
                required: "Log time extension is required",
                min: "Value must be greater than zero"
            },
            timer_flash:{
                required: "Timer flash is required",
                min: "Value must be greater than zero"
            },
            bid_limit:{
                required: "Bid Limit is required",
                min: "Value must be greater than zero"
            },
            remain_time_to_add_extension:{
                min: "Value must be greater than zero"
            }
        },
        errorPlacement: function(error, element) {
            if(element.hasClass('auto_approval')){
                error.insertAfter($('.auto_approval_label').closest('div'));
            }else if(element.hasClass('is_log_time_extension')){
                error.insertAfter($('.is_log_time_extension_label').closest('div'));
            }else if(element.hasClass('reserve_not_met')){
                error.insertAfter($('.reserve_not_met_label').closest('div'));
            }else{
                error.insertAfter(element);
            }
        },
        submitHandler:function(){
            save_listing_setting('global_listing_setting_frm');
        }
    });
    $('#listing_setting_frm').validate({
        errorElement: 'p',
        rules:{
            auto_approval:{
                required: true
            },
            is_deposit_required:{
                required: true
            },
            reserve_not_met:{
                required: true
            },
            is_log_time_extension:{
                required: true
            },
            log_time_extension:{
                required: function () {
                    if (parseInt($('input[name="is_log_time_extension"]').val()) == 1) {
                        return true;
                    } else {
                        return false;
                    }
                },
                min:1
            },
            timer_flash:{
                required: true,
                min:1
            },
            remain_time_to_add_extension:{
                required: true,
                min:1
            },
            bid_limit:{
                required: function () {
                    if (parseInt($('input[name="auto_approval"]').val()) == 1) {
                        return true;
                    }else{
                        return false;
                    }
                },
                min:0
            },
            deposit_amount:{
                required: function () {
                    if (parseInt($('input[name="is_deposit_required"]').val()) == 1) {
                        return true;
                    }else{
                        return false;
                    }
                },
                min:1
            }
        },
        messages:{
            auto_approval:{
                required: "Auto approval is required"
            },
            reserve_not_met:{
                required: "Reserve not met is required"
            },
            is_log_time_extension:{
                required: "Is log time extension is required"
            },
            log_time_extension:{
                required: "Log time extension is required",
                min: "Value must be greater than zero"
            },
            timer_flash:{
                required: "Timer flash is required",
                min: "Value must be greater than zero"
            },
            remain_time_to_add_extension:{
                required:"When to start adding is required",
                min: "Value must be greater than zero"
            },
            bid_limit: {
                required:"Bid Limit is required",
                min: "Value must be greater than zero"
            }
        },
        errorPlacement: function(error, element) {
            if(element.hasClass('auto_approval')){
                error.insertAfter($('.auto_approval_label').closest('div'));
            }else if(element.hasClass('is_log_time_extension')){
                error.insertAfter($('.is_log_time_extension_label').closest('div'));
            }else if(element.hasClass('reserve_not_met')){
                error.insertAfter($('.reserve_not_met_label').closest('div'));
            }else{
                error.insertAfter(element);
            }
        },
        submitHandler:function(){
            save_listing_setting('listing_setting_frm');
        }
    });
    /*$(document).on('click', '.del_bidder_btn', function(){
           var row_id = $(this).attr('rel_id');
           if($(this).attr('id') == 'del_bidder_true'){
                $.ajax({
                    url: '/admin/delete-bidder-reg/',
                    type: 'post',
                    dataType: 'json',
                    cache: false,
                    data: {'row_id': row_id},
                    beforeSend: function(){
                        $('#del_bidder_true').attr('disabled', 'disabled');
                        $.blockUI({
                            message: '<h4>Please wait!</h4>'
                        });
                        $('.overlay').show();
                    },
                    complete: function(){
                        $.unblockUI();
                        $('#del_bidder_true').removeAttr('disabled');
                        $('.overlay').hide();
                    },
                    success: function(response){
                        //$('.overlay').hide();
                        if(response.error == 0){
                            $('#confirmPropertyBidderDeleteModal').modal('hide');
                            try{
                               custom_response = {
                                'site_id': site_id,
                                'user_id': $('#confirmPropertyBidderDeleteModal #UserId').val(),
                                'property_id': $('#confirmPropertyBidderDeleteModal #propertyId').val(),
                                'auction_id': $('#confirmPropertyBidderDeleteModal #auctionId').val(),
                              };
                                customCallBackFunc(update_bidder_socket, [custom_response]);
                            }catch(ex){
                                //console.log(ex);
                            }
                            $('#confirmPropertyBidderDeleteModal #UserId').val('');
                            $('#confirmPropertyBidderDeleteModal #propertyId').val('');
                            $('#confirmPropertyBidderDeleteModal #auctionId').val('');
                            var property_id = $('#popup_property_id').val();
                            propertyBidderListingSearch(property_id, 1, '');
                            $.growl.notice({title: "Bidder Registration ", message: 'Deleted successfully', size: 'large'});
                        }else{
                           $.growl.error({title: "Bidder Registration ", message: 'some error occurs, please try again', size: 'large'});
                        }
                    }
                });
           }else{
                $('#confirmPropertyBidderDeleteModal #UserId').val('');
                $('#confirmPropertyBidderDeleteModal #propertyId').val('');
                $('#confirmPropertyBidderDeleteModal #auctionId').val('');
                $('#del_bidder_true').removeAttr('rel_id');
                $('#del_bidder_false').removeAttr('rel_id');
                $('#confirmPropertyBidderDeleteModal').modal('hide');
                return false;
           }
    });*/
    $(document).on('click', ".plus_date_div", function () {
            var new_div = $(".add_more_open_house_date:last").clone().insertAfter(".add_more_open_house_date:last");
            var count = parseInt($('#total_section').val());
            $(".plus_date_div").hide();
            $(".plus_date_div:first").show();
            $(".minus_date_div").show();
            $(".minus_date_div:first").hide();
            new_div.attr('id', 'add_more_open_house_date_' + count).attr('rel_position', count);
            new_div.find(".virtual_open_house_start_date").attr('id', 'virtual_open_house_start_date_' + count).attr('name','virtual_open_house_start_date_'+count).closest('.input-group').attr('id', 'datetimepicker5'+count).siblings('label').attr('for', 'virtual_open_house_start_date_' + count);
            $('#virtual_open_house_start_date_' + count).val('');
            new_div.find(".open_house_start_date_local").attr('id', 'open_house_start_date_local_' + count).attr('name','open_house_start_date_local_'+count);
            new_div.find(".open_house_end").attr('data-value', '');
            $('#open_house_start_date_local_' + count).val('');
            new_div.find(".open_house_start_date").attr('id', 'open_house_start_date_' + count).attr('name','open_house_start_date_'+count);
            $('#open_house_start_date_' + count).val('');
            new_div.find(".virtual_open_house_end_date").attr('id', 'virtual_open_house_end_date_' + count).attr('name','virtual_open_house_end_date_'+count).closest('.input-group').attr('id', 'datetimepicker6'+count).siblings('label').attr('for', 'virtual_open_house_end_date_' + count);
            $('#virtual_open_house_end_date_' + count).val('');
            new_div.find(".open_house_end_date_local").attr('id', 'open_house_end_date_local_' + count).attr('name','open_house_end_date_local_'+count);
            $('#open_house_end_date_local_' + count).val('');
            new_div.find(".open_house_end_date").attr('id', 'open_house_end_date_' + count).attr('name','open_house_end_date_'+count);
            $('#open_house_end_date_' + count).val('');
            init_open_house_start_date(count);
            init_open_house_end_date(count);
            new_div.find('.open_house_start').on('dp.change',function(e){
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
                    try{
                        var count_index = $(this).closest('.add_more_open_house_date').attr('rel_position');
                        count_index = count_index.toString();
                        $('#virtual_open_house_end_date_'+count_index).val('');
                        $('#open_house_end_date_local_'+count_index).val('');
                        $('#open_house_end_date_'+count_index).val('');
                        var new_date = actualStartDate.split(" ");

                        var newStartDate = new_date[0];

                        var new_min_date = new Date(actualStartDate);
                        var new_max_date = new Date(newStartDate+' 23:59:59');
                        min_max_date(new_min_date, new_max_date, count_index);
                        /*console.log('#datetimepicker6'+count_index);
                        console.log(new_min_date);
                        console.log(new_max_date);
                        $('#add_more_open_house_date_'+count_index).find('.open_house_end').datetimepicker('remove');
                        $('#add_more_open_house_date_'+count_index).find('.open_house_end').datetimepicker('destroy');

                        $('#add_more_open_house_date_'+count_index).find('.open_house_end').datetimepicker('update', '');


                        $('#add_more_open_house_date_'+count_index).find('.open_house_end').data("DateTimePicker").maxDate(new_max_date);
                        $('#add_more_open_house_date_'+count_index).find('.open_house_end').data("DateTimePicker").minDate(e.date);*/

                    }catch(ex){
                        //console.log(ex);
                    }

                  }
              });
            count = count+1;
            $('#total_section').val(count);
        });
        $(document).on('click', '.del_date_btn', function(){
            var row_id = $(this).attr('del_element_id');

            if($(this).attr('id') == 'del_date_true'){
                $('#'+row_id).remove();
                var total_section = parseInt($('div.add_more_open_house_date').length);
                $('#confirmDateDeleteModal').modal('hide');
                $(".add_more_open_house_date").each(function(index){
                  $(this).find('.virtual_open_house_start_date').attr('id','virtual_open_house_start_date_'+index).attr('name','virtual_open_house_start_date_'+index).closest('.input-group').attr('id', 'datetimepicker5'+index).siblings('label').attr('for','virtual_open_house_start_date_'+index);
                  $(this).find('.open_house_start_date_local').attr('id','open_house_start_date_local_'+index).attr('name','open_house_start_date_local_'+index);
                  $(this).find('.open_house_start_date').attr('id','open_house_start_date_'+index).attr('name','open_house_start_date_'+index);
                  $(this).find('.virtual_open_house_end_date').attr('id','virtual_open_house_end_date_'+index).attr('name','virtual_open_house_end_date_'+index).closest('.input-group').attr('id', 'datetimepicker6'+index).siblings('label').attr('for','virtual_open_house_end_date_'+index);
                  $(this).find('.open_house_end_date_local').attr('id','open_house_end_date_local_'+index).attr('name','open_house_end_date_local_'+index);
                  $(this).find('.open_house_end_date').attr('id','open_house_end_date_'+index).attr('name','open_house_end_date_'+index);
                  $(this).attr('id','add_more_open_house_date_'+index).attr('rel_position', index);
                  //init_open_house_start_date(index);
                  //init_open_house_end_date(index);
                });
                $('#total_section').val(total_section);
            }else{
                $(this).attr('del_element_id', '');
                $('#confirmDateDeleteModal').modal('hide');
            }
        });

        $(document).on('click', '#global_listing_setting_frm input[name="auto_approval"]', function(){
            var auto_approval = parseInt($(this).val());
            if(auto_approval == 1){
                $('#global_bid_limit_section').show();
            }else{
                $('#global_bid_limit_section').hide();
            }
        });
        $(document).on('click', '#listing_setting_frm input[name="auto_approval"]', function(){
            var auto_approval = parseInt($(this).val());
            if(auto_approval == 1){
                $('.bid_limit_section').show();
            }else{
                $('.bid_limit_section').hide();
            }
        });

        $(document).on('click', '#global_listing_setting_frm input[name="is_deposit_required"]', function(){
            var is_deposit_required = parseInt($(this).val());
            if(is_deposit_required == 1){
                $('#global_deposit_amount_section').show();
            }else{
                $('#global_deposit_amount_section').hide();
            }
        });

        $(document).on('click', '#listing_setting_frm input[name="is_deposit_required"]', function(){
            var is_deposit_required = parseInt($(this).val());
            if(is_deposit_required == 1){
                $('.deposit_amount_section').show();
            }else{
                $('.deposit_amount_section').hide();
            }
        });

        $(document).on('click', '#msg_true,#msg_close_true', function(){
            $('#viewMsgHistoryModal').modal('hide');
            //$('body').addClass('modal-open');
          });
        $(document).on('click', '#best_msg_true,#best_msg_close_true', function(){
            $('#viewBestMsgHistoryModal').modal('hide');
          });
        $(document).on('click', '#close_counter_popup_top,#close_counter_popup', function(){
            $('#counterOfferModal').modal('hide');
        });
        $(document).on('click', '#close_best_counter_popup_top,#close_best_counter_popup', function(){
            $('#newcounterOfferModal').modal('hide');
            //$('#best_counter_offer_comment').val('');
        });
        $(document).on('click', '#decline_close_best_counter_popup_top,#close_best_counter_popup', function(){
            $('#newconfirmRejectBestOfferModal').modal('hide');
        });
        $(document).on('hidden.bs.modal','#notAgentModal,#offerSubmitModal,#confirmOfferDocDeleteModal', function (e) {

          $('body').addClass('modal-open');
       });
       $(document).on('hidden.bs.modal','#bidderrecordModal', function (e) {
          $('#search_bid_history').val('');
       });
       $(document).on('hidden.bs.modal','#bidderlistModal', function (e) {
          $('#popup_bidder_popup_search').val('');
          $('#popup_filter_bidder_status').val('');
          $('#popup_filter_bidder_status').trigger("chosen:updated");
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
                    url: '/admin/counter-offer/',
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
                                $('#counterOfferModal').modal('hide');
                                if(response.offer){
                                    if(response.offer.offer_history_html){
                                        $("#view_offer_list").html(response.offer.offer_history_html);

                                    }
                                    if(response.offer.offer_history_html){
                                        $("#offer_details").html(response.offer.offer_details_html);
                                    }

                                    $("#view_offer_list").find('script').remove();
                                    $("#offer_details").find('script').remove();
                                    try{
                                        $('.offer_checbox').each(function(){
                                            $(this).removeProp('checked');
                                        });
                                        $('.block-item').each(function(){
                                            $(this).removeClass('current');
                                        });
                                        var check_ofer_id = response.negotiated_id.toString();
                                        $('#search_icon_'+check_ofer_id).prop('checked',true);
                                        $('#search_icon_'+check_ofer_id).closest('.block-item').addClass('current');
                                        $(window).scrollTop(0);
                                    }catch(ex){

                                    }
                                }
                            }, 2000);

                            //$('body').addClass('modal-open');
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
                    url: '/admin/counter-best-offer/',
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
                                if(response.offer){
                                    if(response.offer.offer_history_html){
                                        $("#view_best_offer_list").html(response.offer.offer_history_html);

                                    }
                                    if(response.offer.offer_history_html){
                                        $("#offer_details").html(response.offer.offer_details_html);
                                    }
                                    try{
                                        $('.offer_checbox').each(function(){
                                            $(this).removeProp('checked');
                                        });
                                        $('.block-item').each(function(){
                                            $(this).removeClass('current');
                                        });
                                        var check_ofer_id = response.negotiated_id.toString();
                                        $('#search_icon_'+check_ofer_id).prop('checked',true);
                                        $('#search_icon_'+check_ofer_id).closest('.block-item').addClass('current');
                                        $(window).scrollTop(0);
                                    }catch(ex){

                                    }
                                    $("#view_best_offer_list").find('script').remove();
                                    $("#offer_details").find('script').remove();
                                }
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
        $('#send_loi_frm').validate({
            ignore: [],
            errorElement: 'p',
            rules:{
                loi_email:{
                    required: true,
                    email: true,
                }
            },
            messages:{
                loi_email:{
                    required: "Email is required.",
                    email: "Please enter valid email",
                }
            },
            submitHandler: function(){
                $.ajax({
                    url: '/admin/send-loi/',
                    type: 'post',
                    dataType: 'json',
                    cache: false,
                    data: $('#send_loi_frm').serialize(),
                    beforeSend: function(){
                        $('.overlay').show();
                    },
                    success: function(response){
                        $('.overlay').hide();
                        if(response.error == 0){
                            $.growl.notice({title: "LOI ", message: response.msg, size: 'large'});
                            $('#sendLoiModal').modal('hide');
                            $('#send_loi_frm #loi_email').val('');
                            $('#send_loi_frm #loi_comment').val('');
                            //$('body').addClass('modal-open');
                        }else{
                            window.setTimeout(function () {
                                $.growl.error({title: "LOI ", message: response.msg, size: 'large'});
                            }, 2000);
                        }
                    }
                });
            }

        });

        $(document).on('click', '#reject_offer_false,#reject_offer_false_top', function(){
            $('#rej_property_id').val('');
            $('#rej_negotiated_id').val('');
            $('#confirmRejectOfferModal').modal('hide');
            //$('body').addClass('modal-open');
        });
        // Accept offer functionality
        $(document).on('click', '#accept_offer_false,#accept_offer_false_top', function(){
            $('#accept_property_id').val('');
            $('#accept_negotiated_id').val('');
            $('#confirmAcceptOfferModal').modal('hide');
            //$('body').addClass('modal-open');
        });
        $(document).on('click', '#approve_best_offer_false,#approve_best_offer_false_top', function(){
            $('#approve_property_id').val('');
            $('#approve_negotiated_id').val('');
            $('#confirmApproveBestOfferModal').modal('hide');
        });
        $(document).on('click', '#accept_best_offer_false,#accept_best_offer_false_top', function(){
            $('#accept_property_id').val('');
            $('#accept_negotiated_id').val('');
            $('#confirmAcceptBestOfferModal').modal('hide');
        });
        $(document).on('click', '#reject_best_offer_false,#reject_best_offer_false_top', function(){
            $('#rej_property_id').val('');
            $('#rej_negotiated_id').val('');
            $('#confirmRejectBestOfferModal').modal('hide');
        });
        $(document).on('click', '#close_send_loi_pop_top,#close_send_loi_pop', function(){
            $('p.error').hide();
            $('#loi_property_id').val('');
            $('#loi_negotiated_id').val('');
            $('#loi_user_id').val('');
            $('#loi_email').val('');
            $('#loi_comment').val('');
            $('#sendLoiModal').modal('hide');
        });
        $(document).on('click', '#delete_last_bid_false,#delete_last_bid_false_top', function(){
            $('#del_bid_property_id').val('');
            $('#delete_last_bid_true').removeAttr('onclick');
            $('#confirmDeleteLastBidModal').modal('hide');
            $('body').addClass('modal-open');
        });
        /*$(document).on('click', '#accept_offer_true', function(){
            var property_id = $('#accept_property_id').val();
            var negotiated_id = $('#accept_negotiated_id').val();
            accept_traditional_offer(property_id,negotiated_id);
            accept_traditional_offer($('#accept_property_id').val(),$('#accept_negotiated_id').val());
        });*/
        $(document).on('click', '#close_offer_doc_popup,#close_offer_doc_popup_top', function(){
            $('#viewOfferDocumentModal').modal('hide');
            //$('body').addClass('modal-open');
        });
        $('#offerChatFrm').validate({
            errorElement: 'p',
            rules:{
                user_message:{
                    required: true
                }
            },
            messages:{
                user_message:{
                    required: "Message is required"
                }
            },
            submitHandler: function(){

                $.ajax({
                    url: '/admin/chat-to-buyer/',
                    type: 'post',
                    dataType: 'json',
                    cache: false,
                    data: $('#offerChatFrm').serialize(),
                    beforeSend: function(){
                    },
                    success: function(response){
                        if(response.error == 0){

                            $.growl.notice({title: "Chat ", message: response.msg, size: 'large'});

                        }else{
                            $.growl.error({title: "Chat ", message: response.msg, size: 'large'});
                        }
                        $('#offerChatModal').modal('hide');
                    }
                });
            }
        });
        $(document).on('click', 'input[name="earnest_deposit_type"]', function(){
            $('#earnest_deposit').val('');
            $('#earnest_deposit-error').remove();
            if(parseInt($(this).val()) == 1){
                $('#earnest_deposit').removeAttr('min');
                $('#earnest_deposit').removeAttr('max');
                $('#earnest_deposit').attr('maxlength',  14);
            }else{
                $('#earnest_deposit').attr('maxlength',  6);
                $('#earnest_deposit').attr('min',  0);
                $('#earnest_deposit').attr('max',  100);
            }
        });

        /*$("#earnest_deposit").keypress(function(e){
            alert(e.keyCode);
          *//*if(){

          }*//*
        });*/
        try{
        $('#datetimepicker5').datetimepicker({
              format: 'MM-DD-YYYY hh:mm A',
        });
        $('#datetimepicker5').on('dp.change',function(e){
          var virtual_date_element = $(this).find('input:first').attr('id');
          var date_element = $(this).find('input:last').attr('id');
          var dates = $("#"+virtual_date_element).val();
           var auction_type = $('option:selected','#auction_type').val();
          if(dates != ""){
            var actualStartDate = dates.split(" ");
            //new lines
            var mdy_format = actualStartDate[0].split("-");

            mdy_date = mdy_format[2]+"-"+mdy_format[0]+"-"+mdy_format[1];

            actualStartDate = mdy_date+' '+convert_to_24h(actualStartDate[1]+' '+actualStartDate[2]);
            //actualStartDate = actualStartDate[0]+' '+convert_to_24h(actualStartDate[1]+' '+actualStartDate[2]);
            //var utc_date = convert_to_utc_datetime(actualStartDate);
            var utc_date = convert_to_utc_datetime(actualStartDate, 'datetime');
            $("#"+date_element+"_local").val(actualStartDate);
            $("#"+date_element).val(utc_date);
            var dutch_auction_time = $('#property_info_frm #dutch_auction_time').val();
            var dutch_pause_time = $('#property_info_frm #dutch_pause_time').val();
            var sealed_auction_time = $('#property_info_frm #sealed_auction_time').val();
            var sealed_pause_time = $('#property_info_frm #sealed_pause_time').val();
            var english_auction_time = $('#property_info_frm #english_auction_time').val();
            if(dutch_auction_time != "" && actualStartDate != ""){
                try{
                   custom_response = {
                    'add_min': dutch_auction_time,
                    'actualStartDate': actualStartDate,
                    'date_virtual_element_id': '#virtual_dutch_bidding_end_date',
                    'date_local_element_id': '#dutch_bidding_end_date_local',
                    'date_utc_element_id': '#dutch_bidding_end_date',
                  };
                  customCallBackFunc(calculate_insider_dates, [custom_response]);
                }catch(ex){
                    //console.log(ex);
                }
            }
            var dutch_end_date = $('#dutch_bidding_end_date_local').val();
            if(dutch_pause_time != "" && dutch_end_date != ""){
                try{
                   custom_response = {
                    'add_min': dutch_pause_time,
                    'actualStartDate': dutch_end_date,
                    'date_virtual_element_id': '#virtual_sealed_bidding_start_date',
                    'date_local_element_id': '#sealed_bidding_start_date_local',
                    'date_utc_element_id': '#sealed_bidding_start_date',
                  };
                  customCallBackFunc(calculate_insider_dates, [custom_response]);
                }catch(ex){
                    //console.log(ex);
                }
            }
            var sealed_start_date = $('#sealed_bidding_start_date_local').val();
            if(sealed_auction_time != "" && sealed_start_date != ""){
                try{
                   custom_response = {
                    'add_min': sealed_auction_time,
                    'actualStartDate': sealed_start_date,
                    'date_virtual_element_id': '#virtual_sealed_bidding_end_date',
                    'date_local_element_id': '#sealed_bidding_end_date_local',
                    'date_utc_element_id': '#sealed_bidding_end_date',
                  };
                  customCallBackFunc(calculate_insider_dates, [custom_response]);
                }catch(ex){
                    //console.log(ex);
                }
            }
            var sealed_end_date = $('#sealed_bidding_end_date_local').val();
            if(sealed_pause_time != "" && sealed_end_date != ""){
                try{
                   custom_response = {
                    'add_min': sealed_pause_time,
                    'actualStartDate': sealed_end_date,
                    'date_virtual_element_id': '#virtual_english_bidding_start_date',
                    'date_local_element_id': '#english_bidding_start_date_local',
                    'date_utc_element_id': '#english_bidding_start_date',
                  };
                  customCallBackFunc(calculate_insider_dates, [custom_response]);
                }catch(ex){
                    //console.log(ex);
                }
            }
            var english_start_date = $('#english_bidding_start_date_local').val();
            if(english_auction_time != "" && english_start_date != ""){
                try{
                   custom_response = {
                    'add_min': english_auction_time,
                    'actualStartDate': english_start_date,
                    'date_virtual_element_id': '#virtual_english_bidding_end_date',
                    'date_local_element_id': '#english_bidding_end_date_local',
                    'date_utc_element_id': '#english_bidding_end_date',
                  };
                  customCallBackFunc(calculate_insider_dates, [custom_response]);
                }catch(ex){
                    //console.log(ex);
                }
            }

          }
      });
    }catch(ex){
        console.log(ex);
    }
});
function save_property(element){
    for (instance in CKEDITOR.instances){
        CKEDITOR.instances[instance].updateElement();
    }
    //return false;
    $.ajax({
        url: '/admin/save-property/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: $('#'+element).serialize(),
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            if(response.error == 0){
                $.growl.notice({title: "Property ", message: response.msg, size: 'large'});
                try{
                    var property_id = response.data.data.property_id;
                    var auction_id = response.data.data.auction_id;
                }catch(ex){
                    var property_id = '';
                    var auction_id = '';
                }

                if(element == 'property_info_frm' && property_id != "" && auction_id != ""){
                    var auction_type = $('option:selected','#auction_type').val();
                    try{
                       custom_response = {
                        'site_id': site_id,
                        'user_id': '',
                        'property_id': property_id,
                        'auction_id': auction_id,
                        'auction_type': auction_type,
                      };
                        customCallBackFunc(update_bidder_socket, [custom_response]);
                    }catch(ex){
                        //console.log(ex);
                    }
                }

                window.setTimeout(function () {
                    if(response.next_url != '/admin/listing/' && response.next_url != ''){
                        window.location.href = response.next_url+'?property_id='+response.data.data.property_id;
                    }else{
                        window.location.href = '/admin/listing/';
                    }
                }, 2000);
            }else{
                if(typeof(response.data) != 'undefined' && typeof(response.data.msg) != 'undefined'){
                    var msg = response.data.msg;
                }else{
                    var msg = response.msg;
                }

                var custom_msg = '';
                if(typeof(msg) === 'object'){
                    $.each(msg, function (i) {
                        try{
                            custom_msg += '<span>'+msg[i]+'</span><br>';
                        }catch(ex){
                            custom_msg += '<span>'+msg+'</span><br>';
                        }

                    });
                }else if(Array.isArray(msg)){
                    $.each(msg, function(i) {
                        custom_msg += '<span>'+msg[i]+'</span><br>';
                    });
                }else{
                    custom_msg = msg;
                }
                window.setTimeout(function () {
                    $.growl.error({title: "Property ", message: custom_msg, size: 'large'});
                }, 2000);
            }
        }
    });
}
function set_property_image_details(response){
    var image_name = '';
    var upload_id = '';
    var actual_image = '';
    var actual_id = '';
    var property_image_id = $('#property_image_id').val();
    var property_image_name = $('#property_image_name').val();
    var property_id = $('#property_id').val();
    var count = parseInt($('#bannerImgList li').length);
    if(response.status == 200){
        $('#custom_property_image_error').hide();
        if(response.uploaded_file_list){
            var all_banner_images = '';
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
                    var img_src = aws_url+"property_image/"+item.file_name;
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
                $('#propertyImgList').append('<li rel_id="'+item.upload_id+'" rel_position="'+count+'"><a href="javascript:void(0)" data-article-id="'+property_id+'" data-image-id="'+item.upload_id+'" data-image-name="'+item.file_name+'" data-image-section="'+item.upload_to+'"  class="close-btn confirm_image_delete"><i class="fas fa-times"></i></a><img src="'+img_src+'" alt=""><figcaption><h6>'+item.file_name+'</h6><p>File Size: '+item.file_size+' <br>Uploaded: '+timeStp+'</p><div class="move"><i class="fas fa-expand-arrows-alt"></i> Move</div></figcaption></li>');
            });
            image_name = image_name+','+property_image_name;
            upload_id = upload_id+','+property_image_id;
            actual_image = image_name.replace(/(^,)|(,$)/g, "");
            actual_id = upload_id.replace(/(^,)|(,$)/g, "");
            $('#property_image_name').val(actual_image);
            $('#property_image_id').val(actual_id);
            $('#PropertyImgDiv').show();
            reindex_prop_img_list();
        }
    }
}
function set_property_doc_details(response){
    var image_name = '';
    var upload_id = '';
    var actual_image = '';
    var actual_id = '';
    var property_doc_id = $('#property_doc_id').val();
    var property_doc_name = $('#property_doc_name').val();
    var property_id = $('#property_id').val();
    if(response.status == 200){
        $('#custom_property_doc_error').hide();
        if(response.uploaded_file_list){
            var all_banner_images = '';
            var count = parseInt($('#bannerImgList li').length);
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
                    var img_src = aws_url+"property_document/"+item.file_name;
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
                $('#propertyDocList').append('<li rel_id="'+item.upload_id+'" rel_position="'+count+'"><figure><a href="javascript:void(0)" data-article-id="'+property_id+'" data-image-id="'+item.upload_id+'" data-image-name="'+item.file_name+'" data-image-section="'+item.upload_to+'"  class="close-btn confirm_image_delete"><i class="fas fa-times"></i></a><img src="/static/admin/images/pdf.png" alt=""></figure><figcaption><h6>'+item.file_name+'</h6><p>File Size: '+item.file_size+'<br>Uploaded: '+timeStp+'</p><div class="move"><i class="fas fa-expand-arrows-alt"></i> Move</div></figcaption></li>');
            });
            image_name = image_name+','+property_doc_name;
            upload_id = upload_id+','+property_doc_id;
            actual_image = image_name.replace(/(^,)|(,$)/g, "");
            actual_id = upload_id.replace(/(^,)|(,$)/g, "");
            $('#property_doc_name').val(actual_image);
            $('#property_doc_id').val(actual_id);
            $('#PropertyDocDiv').show();
            reindex_prop_doc_list();
        }
    }
}
function add_icon_dropdown_new_feature(){
    $('.new_feature_dropdown').each(function() {
        var el_id = '#'+$(this).attr('id');
        $(el_id).on('chosen:showing_dropdown', function(e){
            $(this).next().find('li.active-result:contains(Add New Feature)').html('<i class="fa fa-plus" aria-hidden="true"></i> Add New Feature');
            //$(this).next().find('li.active-result:contains(Add New Feature)').html('<a href="#" class="result-selected" style=""><i class="fa fa-plus" aria-hidden="true" style=""></i> Add New Feature</a>');
        });
    });
}
function set_property_address_by_zipcode(response){
    $('#property_city').val(response.city);
    try{
        var zip_state_iso_code = response.state.toLowerCase();
    }catch(ex){
        //console.log(ex);
        var zip_state_iso_code = '';
    }
    $("#property_state > option").each(function() {
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
    $('#property_state').trigger("chosen:updated");
}
function property_delete_confirmation(property_id){
  $('.personalModalwrap').modal('hide');
  $('#confirmPropertyDeleteModal').modal('show');
  $('.del_prop_btn').attr('rel_id', property_id);
}
function save_listing_setting(form){
    var is_global = 0;
    if(form == 'global_listing_setting_frm'){
        is_global = 1;
        data = {
        }
    }
    $.ajax({
        url: '/admin/save-listing-settings/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: $('#'+form).serialize(),
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            if(response.error == 0){
                $.growl.notice({title: "Property Settings ", message: response.msg, size: 'large'});
                if(form == 'listing_setting_frm'){
                    $('#EditLisingSettingModal').modal('hide');
                    try{
                        var property_id = response.data.property_id;
                        var auction_id = response.data.auction_id;
                        var auction_type = 1;
                        if(response.data.auction_type){
                            auction_type = response.data.auction_type;
                        }

                       custom_response = {
                        'site_id': site_id,
                        'user_id': '',
                        'property_id': property_id,
                        'auction_id': auction_id,
                        'auction_type': auction_type,
                      };
                        customCallBackFunc(update_bidder_socket, [custom_response]);
                    }catch(ex){
                        //console.log(ex);
                    }
                }else{
                    window.setTimeout(function () {
                        window.location.href = '/admin/listing/';
                    }, 2000);
                }
            }else{
                window.setTimeout(function () {
                    $.growl.error({title: "Property Settings", message: response.msg, size: 'large'});
                }, 2000);
            }
        },
        complete: function(){
            $('.overlay').hide();
        },
    });
}
function get_listing_setting_details(property_id){
    if(property_id){
    data = {'property_id': property_id}
        $.ajax({
            url: '/admin/get-listing-settings/',
            type: 'post',
            dataType: 'json',
            cache: false,
            data: data,
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
                $('.error:not("input.error")').hide();
                var property_id = response.property_id;
                $('#listing_setting_frm #property_id').val(property_id);

                var auto_approval = 0;
                var deposit_required = 0;
                var show_reverse_not_met = 0;
                var is_log_time_extension = 0;
                var time_flash = '';
                var bid_limit = '';
                var deposit_amount = '';
                var log_time_extension = '';
                var auction_id = '';
                var remain_time_to_add_extension = '';
                if(response.listing_setting.auto_approval == true){
                    auto_approval = 1;
                }
                if(response.listing_setting.is_deposit_required == true){
                    deposit_required = 1;
                }
                if(response.listing_setting.show_reverse_not_met == true){
                    show_reverse_not_met = 1;
                }
                if(response.listing_setting.is_log_time_extension == true){
                    is_log_time_extension = 1;
                }
                if(response.listing_setting.time_flash){
                    time_flash = response.listing_setting.time_flash;
                }
                if(response.listing_setting.log_time_extension){
                    log_time_extension = response.listing_setting.log_time_extension;
                }
                if(response.listing_setting.remain_time_to_add_extension){
                    remain_time_to_add_extension = response.listing_setting.remain_time_to_add_extension;
                }
                if(response.listing_setting.bid_limit){
                    bid_limit = response.listing_setting.bid_limit;
                }
                if(response.listing_setting.deposit_amount){
                    deposit_amount = response.listing_setting.deposit_amount;
                }
                if(response.listing_setting.auction_id){
                    auction_id = response.listing_setting.auction_id;
                }
                $('#listing_setting_frm #property_id').val(property_id);
                $('#listing_setting_frm #auction_id').val(auction_id);
                $('#listing_setting_frm input[name="auto_approval"][value="'+auto_approval+'"]').prop('checked', true);
                $('#listing_setting_frm input[name="is_deposit_required"][value="'+deposit_required+'"]').prop('checked', true);
                $('#listing_setting_frm input[name="reserve_not_met"][value="'+show_reverse_not_met+'"]').prop('checked', true);
                $('#listing_setting_frm input[name="is_log_time_extension"][value="'+is_log_time_extension+'"]').prop('checked', true);
                $('#listing_setting_frm #timer_flash').val(time_flash);
                $('#listing_setting_frm #log_time_extension').val(log_time_extension);
                $('#listing_setting_frm #remain_time_to_add_extension').val(remain_time_to_add_extension);

                if(auto_approval == 1){
                    $('#listing_setting_frm #bid_limit').val(bid_limit);
                    $('#listing_setting_frm .bid_limit_section').show();
                }else{
                    $('#listing_setting_frm #bid_limit').val('');
                    $('#listing_setting_frm .bid_limit_section').hide();
                }
                if(deposit_required == 1){
                    $('#listing_setting_frm #listing_deposit_amount').val(deposit_amount);
                    $('#listing_setting_frm .deposit_amount_section').show();
                }else{
                    $('#listing_setting_frm #listing_deposit_amount').val('');
                    $('#listing_setting_frm .deposit_amount_section').hide();
                }
                $('#EditLisingSettingModal').modal('show');
            }
        });
    }
}
function propertyBidderListingSearch(property_id, current_page, filter_listing){
    $('#popup_property_id').val(property_id);
    var search = $('#popup_bidder_popup_search').val();
    //var sort = $('#bidder_datesort').val();
    var currpage = current_page;
    /*var page_size = $('#bidder_num_record').val();
    var sort_column = 'publish_date_asc';
    if(typeof($('#blog_datesort').val()) != 'undefined' && $('#blog_datesort').val() != ""){
        sort_column = $('#blog_datesort').val();
    }*/
    /*if(filter_listing == ''){
        var filter = pre_bidder_listing;
    }else{
        var filter = filter_listing;
    }*/
    //var filter = filter_listing;
    var asset_type_filter = '';
    /*if(filter == 'residential-list'){
        asset_type_filter = 3;
    }else if(filter == 'commercial-list'){
        asset_type_filter = 2;
    }else if(filter == 'land-list'){
        asset_type_filter = 1;
    }*/
    var filter_bidder_status = $('#popup_filter_bidder_status').val();
    $.ajax({
        url: '/admin/property-bidder-registration/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {'search': search, 'page': currpage, 'page_size': recordPerpage, 'asset_type': asset_type_filter, 'filter_bidder_status': filter_bidder_status, 'property_id': property_id},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            $("#bid_popup_listing_pagination_list").empty();
            $("#popup_bidder_list").empty();
            $("#bidder_list_export_btn_section").empty();
            $("#popup_property_address").empty();
            $("#propertyLink").attr("href", '/asset-details/?property_id='+property_id);
            if(response.property_image != ""){
                $("#popup_property_image").attr('src', response.property_image);
            }else {
                $("#popup_property_image").attr('src', '/static/admin/images/property-default-img.png');
            }
            if(response.property_address != ""){
                $('#popup_property_address').html(response.property_address+' <span><i class="fas fa-map-marker-alt"></i> '+response.property_city+', '+response.property_state+' '+response.property_postal_code+'</span>');
            }

            if(response.error == 0){


                $("#popup_bidder_list").html(response.bidder_listing_html);
                $("#bid_popup_listing_pagination_list").html(response.pagination_html);
                $("#bidder_list_export_btn_section").html('<button type="button" class="btn btn-primary btn-sm pl20" onClick="exportBidderList(\''+response.property_id+'\',\''+response.page+'\')"><i class="fas fa-file-export"></i> Export</button>');
                //$("#blog_sidebar").html(response.blog_sidebar_html);
            }else{
                $('#blog_list').html('<li class="text-center text-danger" style="width:100%;"><img src="static/theme-1/images/property-not-avail.png" class=" center mb0" /></li>');
                $("#bidder_list_export_btn_section").html('<button type="button" class="btn btn-primary btn-sm pl20"><i class="fas fa-file-export"></i> Export</button>');
                $("#bid_listing_pagination_list").hide();
            }
            $('#bidderlistModal').modal('show');
        }
    });
}


function propertyBidHistorySearch(property_id, current_page){
    $('#bidHistoryPropertyId').val(property_id);
    var currpage = current_page;
    var search = $('#search_bid_history').val();
    $.ajax({
        url: '/admin/property-bid-history/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {'page': currpage, 'page_size': recordPerpage, 'property_id': property_id, 'search': search},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            $("#bidHistoryPaginationList").empty();
            $("#bidHistoryList").empty();
            $("#bidHistoryPropertyName").empty();
            // $("#bidHistoryPropertyLink").attr("href", '/asset-details/?property_id='+property_id);
            if(response.property_image != ""){
                $("#bidHistoryPropertyImage").attr('src', response.property_image);
            }else {
                $("#bidHistoryPropertyImage").attr('src', '/static/admin/images/property-default-img.png');
            }
            if(response.property_address != ""){
                $('#bidHistoryPropertyName').html('<a href="/asset-details/?property_id='+property_id+'" id="bidHistoryPropertyLink" target="_blank">'+response.property_address+'</a> <span><i class="fas fa-map-marker-alt"></i> '+response.property_city+', '+response.property_state+' '+response.property_postal_code+'</span>');
            }
            if(response.auction_type){
                $('#bidHistoryAuctiontype').html(response.auction_type)
            }
            if(response.bid_increment){
                $('#bidHistoryBidIncrement').html('$' + response.bid_increment)
            }
            if(response.property_type){
                $('#bidHistoryPropertyType').html(response.property_type)
            }
            if(response.error == 0){
                $("#bidHistoryList").html(response.bid_history_html);
                $("#bidHistoryPaginationList").html(response.pagination_html);
            }else{
                $('#bidHistoryList').html('<li class="text-center text-danger" style="width:100%;"><img src="static/theme-1/images/property-not-avail.png" class=" center mb0" /></li>');
                $("#bidHistoryPaginationList").hide();
            }
            var search_bid_history = $('#search_bid_history').val();
            if(typeof(response.total) != 'undefined' && response.total){
                //$('#bid_history_search_section').html('<div class="block right"><form action="" class="search-field"><div class="search-icon"><i class="fas fa-search"></i></div><input type="text" name="search_bid_history" id="search_bid_history" class="form-control" value="'+search_bid_history+'"><button type="button" id="bid_history_search_btn" class="btn btn-gray btn-sm pl20" onclick="propertyBidHistorySearch(\''+response.property_id+'\',1)">Search</button></form></div><div class="block last"><button type="button" class="btn btn-primary btn-sm pl20" onClick="exportBidHistory(\''+response.property_id+'\',\''+response.page+'\')"><i class="fas fa-file-export"></i> Export</button></div><div class="clearfix"></div><div class="block last highest_bid_btn"><button type="button" class="btn btn-primary btn-sm pl20" onClick="confirmDeleteLastBid(\''+response.property_id+'\')"> <i class="fas fa-trash-alt"></i> Highest Bid</button></div>');
                //$('#bid_history_search_section').html('<div class="block last"><button type="button" class="btn btn-primary btn-sm pl20" onClick="printPage()"><i class="fas fa-file-export"></i> Print</button></div><div class="clearfix"></div>   <div class="block last"><button type="button" class="btn btn-primary btn-sm pl20" onClick="exportBidHistory(\''+response.property_id+'\',\''+response.page+'\')"><i class="fas fa-file-export"></i> Export</button></div><div class="clearfix"></div> <div class="block last"><button type="button" class="btn btn-primary btn-sm pl20" onClick="emailPropertyTotalToAllBids(\''+response.property_id+'\')"><i class="fas fa-file-export"></i> Email All</button></div><div class="clearfix"></div><div class="block last highest_bid_btn"><button type="button" class="btn btn-primary btn-sm pl20" onClick="confirmDeleteLastBid(\''+response.property_id+'\')"> <i class="fas fa-trash-alt"></i> Highest Bid</button></div>');
                $('#bid_history_search_section').html('<div class="block last"><button type="button" class="btn btn-primary btn-sm pl20" onClick="printPage()"><i class="fas fa-file-export"></i> Print</button></div><div class="clearfix"></div>   <div class="block last"><button type="button" class="btn btn-primary btn-sm pl20" onClick="exportBidHistory(\''+response.property_id+'\',\''+response.page+'\')"><i class="fas fa-file-export"></i> Export</button></div><div class="clearfix"></div> <div class="block last"><button type="button" class="btn btn-primary btn-sm pl20" onClick="emailPropertyTotalToAllBids(\''+response.property_id+'\')"><i class="fas fa-file-export"></i> Email All</button></div><div class="clearfix"></div>');
            }else{
                //$('#bid_history_search_section').html('<div class="block right"><form action="" class="search-field"><div class="search-icon"><i class="fas fa-search"></i></div><input type="text" name="search_bid_history" id="search_bid_history" class="form-control" value="'+search_bid_history+'"><button type="button" id="bid_history_search_btn" class="btn btn-gray btn-sm pl20" onclick="propertyBidHistorySearch(\''+response.property_id+'\',1)">Search</button></form></div><div class="block last"><button type="button" class="btn btn-primary btn-sm pl20" onClick="exportBidHistory(\''+response.property_id+'\',\''+response.page+'\')"><i class="fas fa-file-export"></i> Export</button></div>');
                $('#bid_history_search_section').html('<div class="block last"><button type="button" class="btn btn-primary btn-sm pl20" onClick="printPage()"><i class="fas fa-file-export"></i> Print</button></div><div class="clearfix"></div> <div class="block last"><button type="button" class="btn btn-primary btn-sm pl20" onClick="exportBidHistory(\''+response.property_id+'\',\''+response.page+'\')"><i class="fas fa-file-export"></i> Export</button></div><div class="clearfix"></div> <div class="block last"><button type="button" class="btn btn-primary btn-sm pl20" onClick="emailPropertyTotalToAllBids(\''+response.property_id+'\')"><i class="fas fa-file-export"></i> Email All</button></div>');
            }

            $('#bidderrecordModal').modal('show');
        }
    });
}

//------------------Total Property View-----------
function totalPropertyViewSearch(property_id, current_page){
    $('#propertyTotalView').val(property_id);
    var currpage = current_page;
    var search = $('#search_property_total_view').val();
    $.ajax({
        url: '/admin/property-total-view/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {'page': currpage, 'page_size': recordPerpage, 'property_id': property_id, 'search': search},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            $("#propertyTotalViewPaginationList").empty();
            $("#propertyTotalViewPaginationListList").empty();
            $("#propertyTotalViewName").empty();
            // $("#bidHistoryPropertyLink").attr("href", '/asset-details/?property_id='+property_id);
            if(response.property_image != ""){
                $("#propertyTotalViewImage").attr('src', response.property_image);
            }else {
                $("#propertyTotalViewImage").attr('src', '/static/admin/images/property-default-img.png');
            }
            if(response.property_address != ""){
                $('#propertyTotalViewName').html('<a href="/asset-details/?property_id='+property_id+'" id="bidHistoryPropertyLink" target="_blank">'+response.property_address+'</a> <span><i class="fas fa-map-marker-alt"></i> '+response.property_city+', '+response.property_state+' '+response.property_postal_code+'</span>');
            }
            if(response.auction_type){
                $('#propertyTotalViewAuctiontype').html(response.auction_type)
            }
            if(response.bid_increment){
                $('#propertyTotalViewBidIncrement').html('$' + response.bid_increment)
            }
            if(response.error == 0){
                $("#propertyTotalViewPaginationListList").html(response.html);
                $("#propertyTotalViewPaginationList").html(response.pagination_html);
            }else{
                $('#propertyTotalViewPaginationListList').html('<li class="text-center text-danger" style="width:100%;"><img src="static/theme-1/images/property-not-avail.png" class=" center mb0" /></li>');
                $("#propertyTotalViewPaginationList").hide();
            }
            var search_property_total_view = $('#search_property_total_view').val();
            if(typeof(response.total) != 'undefined' && response.total){
                $('#property_total_view_search_section').html('<div class="block right"><form action="" class="search-field"><div class="search-icon"><i class="fas fa-search"></i></div><input type="text" name="search_property_total_view" id="search_property_total_view" class="form-control" value="'+search_property_total_view+'"><button type="button" id="property_total_view_search_btn" class="btn btn-gray btn-sm pl20" onclick="totalPropertyViewSearch(\''+response.property_id+'\',1)">Search</button></form></div><div class="block last"><button type="button" class="btn btn-primary btn-sm pl20" onClick="exportPropertyTotalView(\''+response.property_id+'\',\''+response.page+'\')"><i class="fas fa-file-export"></i> Export</button></div><div class="clearfix"></div> <div class="block last"><button type="button" class="btn btn-primary btn-sm pl20" onClick="emailPropertyTotalToAll(\''+response.property_id+'\')"><i class="fas fa-file-export"></i> Email All</button></div><div class="clearfix"></div>');
            }else{
                $('#property_total_view_search_section').html('<div class="block right"><form action="" class="search-field"><div class="search-icon"><i class="fas fa-search"></i></div><input type="text" name="search_property_total_view" id="search_property_total_view" class="form-control" value="'+search_property_total_view+'"><button type="button" id="property_total_view_search_btn" class="btn btn-gray btn-sm pl20" onclick="totalPropertyViewSearch(\''+response.property_id+'\',1)">Search</button></form></div><div class="block last"><button type="button" class="btn btn-primary btn-sm pl20" onClick="exportPropertyTotalView(\''+response.property_id+'\',\''+response.page+'\')"><i class="fas fa-file-export"></i> Export</button></div>');
            }

            $('#property_total_view_model').modal('show');
        }
    });
}

//------------------Total Property Watcher-----------
function totalPropertyWatcherSearch(property_id, current_page){
    //console.log(1111111111);
    $('#propertyTotalView').val(property_id);
    var currpage = current_page;
    var search = $('#search_property_total_watcher').val();
    $.ajax({
        url: '/admin/property-total-watcher/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {'page': currpage, 'page_size': recordPerpage, 'property_id': property_id, 'search': search},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            $("#propertyTotalWatcherPaginationList").empty();
            $("#propertyTotalWatcherPaginationListList").empty();
            $("#propertyTotalWatcherName").empty();
            // $("#bidHistoryPropertyLink").attr("href", '/asset-details/?property_id='+property_id);
            if(response.property_image != ""){
                $("#propertyTotalWatcherImage").attr('src', response.property_image);
            }else {
                $("#propertyTotalWatcherImage").attr('src', '/static/admin/images/property-default-img.png');
            }
            if(response.property_address != ""){
                $('#propertyTotalWatcherName').html('<a href="/asset-details/?property_id='+property_id+'" id="bidHistoryPropertyLink" target="_blank">'+response.property_address+'</a> <span><i class="fas fa-map-marker-alt"></i> '+response.property_city+', '+response.property_state+' '+response.property_postal_code+'</span>');
            }
            if(response.auction_type){
                $('#propertyTotalWatcherAuctiontype').html(response.auction_type)
            }
            if(response.bid_increment){
                $(".bid_increment_label").show();
                $('#propertyTotalWatcherBidIncrement').html('$' + response.bid_increment);
            }else{
                //$('#propertyTotalWatcherBidIncrement').html('-')
                $(".bid_increment_label").hide();
            }
            if(response.error == 0){
                $("#propertyTotalWatcherPaginationListList").html(response.html);
                $("#propertyTotalWatcherPaginationList").html(response.pagination_html);
            }else{
                $('#propertyTotalWatcherPaginationListList').html('<li class="text-center text-danger" style="width:100%;"><img src="static/theme-1/images/property-not-avail.png" class=" center mb0" /></li>');
                $("#propertyTotalWatcherPaginationList").hide();
            }
            var search_property_total_watcher = $('#search_property_total_watcher').val();
            if(typeof(response.total) != 'undefined' && response.total){
                $('#property_total_watcher_search_section').html('<div class="block right"><form action="" class="search-field"><div class="search-icon"><i class="fas fa-search"></i></div><input type="text" name="search_property_total_watcher" id="search_property_total_watcher" class="form-control" value="'+search_property_total_watcher+'"><button type="button" id="property_total_watcher_search_btn" class="btn btn-gray btn-sm pl20" onclick="totalPropertyWatcherSearch(\''+response.property_id+'\',1)">Search</button></form></div><div class="block last"><button type="button" class="btn btn-primary btn-sm pl20" onClick="exportPropertyTotalWatcher(\''+response.property_id+'\',\''+response.page+'\')"><i class="fas fa-file-export"></i> Export</button></div><div class="clearfix"></div> <div class="block last"><button type="button" class="btn btn-primary btn-sm pl20" onClick="emailPropertyTotalToAllWatcher(\''+response.property_id+'\')"><i class="fas fa-file-export"></i> Email All</button></div><div class="clearfix"></div>');
            }else{
                $('#property_total_watcher_search_section').html('<div class="block right"><form action="" class="search-field"><div class="search-icon"><i class="fas fa-search"></i></div><input type="text" name="search_property_total_watcher" id="search_property_total_watcher" class="form-control" value="'+search_property_total_watcher+'"><button type="button" id="property_total_watcher_search_btn" class="btn btn-gray btn-sm pl20" onclick="totalPropertyWatcherSearch(\''+response.property_id+'\',1)">Search</button></form></div><div class="block last"><button type="button" class="btn btn-primary btn-sm pl20" onClick="exportPropertyTotalWatcher(\''+response.property_id+'\',\''+response.page+'\')"><i class="fas fa-file-export"></i> Export</button></div>');
            }

            $('#property_total_watcher_model').modal('show');
        }
    });
}

//------------------Total Property Bid-----------
function totalPropertyBidSearch(bid_id, current_page){
    $('#propertyTotalView').val(property_id);
    var currpage = current_page;
    //var search = $('#search_property_total_watcher').val();
    $.ajax({
        url: '/admin/property-total-bid/',
        type: 'post',
        dataType: 'json',
        cache: false,
        //data: {'page': currpage, 'page_size': recordPerpage, 'property_id': property_id, 'search': search},
        data: {'page': currpage, 'page_size': recordPerpage, 'bid_id': bid_id},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            $("#propertyTotalBidPaginationList").empty();
            $("#propertyTotalBidPaginationListList").empty();
            $("#propertyTotalBidName").empty();
            // $("#bidHistoryPropertyLink").attr("href", '/asset-details/?property_id='+property_id);
            if(response.property_image != ""){
                $("#propertyTotalBidImage").attr('src', response.property_image);
            }else {
                $("#propertyTotalBidImage").attr('src', '/static/admin/images/property-default-img.png');
            }
            if(response.property_address != ""){
                $('#propertyTotalBidName').html('<a href="/asset-details/?property_id='+response.property_id+'" id="bidHistoryPropertyLink" target="_blank">'+response.property_address+'</a> <span><i class="fas fa-map-marker-alt"></i> '+response.property_city+', '+response.property_state+' '+response.property_postal_code+'</span>');
            }
            if(response.auction_type){
                $('#propertyTotalBidAuctiontype').html(response.auction_type)
            }
            if(response.bid_increment){
                $('#propertyTotalBidBidIncrement').html('$' + response.bid_increment)
            }
            if(response.property_type){
                $('#totalBidPropertyType').html(response.property_type)
            }
            if(response.error == 0){
                $("#propertyTotalBidPaginationListList").html(response.html);
                $("#propertyTotalBidPaginationList").html(response.pagination_html);
            }else{
                $('#propertyTotalBidPaginationListList').html('<li class="text-center text-danger" style="width:100%;"><img src="static/theme-1/images/property-not-avail.png" class=" center mb0" /></li>');
                $("#propertyTotalBidPaginationList").hide();
            }
//            var search_property_total_watcher = $('#search_property_total_watcher').val();
//            if(typeof(response.total) != 'undefined' && response.total){
//                $('#property_total_watcher_search_section').html('<div class="block right"><form action="" class="search-field"><div class="search-icon"><i class="fas fa-search"></i></div><input type="text" name="search_property_total_watcher" id="search_property_total_watcher" class="form-control" value="'+search_property_total_watcher+'"><button type="button" id="property_total_watcher_search_btn" class="btn btn-gray btn-sm pl20" onclick="totalPropertyWatcherSearch(\''+response.property_id+'\',1)">Search</button></form></div><div class="block last"><button type="button" class="btn btn-primary btn-sm pl20" onClick="exportPropertyTotalWatcher(\''+response.property_id+'\',\''+response.page+'\')"><i class="fas fa-file-export"></i> Export</button></div><div class="clearfix"></div> <div class="block last"><button type="button" class="btn btn-primary btn-sm pl20" onClick="emailPropertyTotalToAllWatcher(\''+response.property_id+'\')"><i class="fas fa-file-export"></i> Email All</button></div><div class="clearfix"></div>');
//            }else{
//                $('#property_total_watcher_search_section').html('<div class="block right"><form action="" class="search-field"><div class="search-icon"><i class="fas fa-search"></i></div><input type="text" name="search_property_total_watcher" id="search_property_total_watcher" class="form-control" value="'+search_property_total_watcher+'"><button type="button" id="property_total_watcher_search_btn" class="btn btn-gray btn-sm pl20" onclick="totalPropertyWatcherSearch(\''+response.property_id+'\',1)">Search</button></form></div><div class="block last"><button type="button" class="btn btn-primary btn-sm pl20" onClick="exportPropertyTotalWatcher(\''+response.property_id+'\',\''+response.page+'\')"><i class="fas fa-file-export"></i> Export</button></div>');
//            }

            $('#property_total_bid_model').modal('show');
        }
    });
}

//------------------Email Property Total to All-----------
function emailPropertyTotalToAll(property_id){
    $("#emailPropertyid").val(property_id);
    $("#emailRecordModalEmail").modal('show');
}
$(document).on("click", "#emailAllUsersForm #emailAllSubmit", function (e) {
    e.preventDefault();
    var property_id = $("#emailPropertyid").val();
    emailPropertyTotalView(property_id);
})
function emailPropertyTotalView(property_id){
    var listing_id = $('#emailPropertyid').val()
    var subject = $('#subject').val().trim()
    var message = $('#message').val().trim()
    var emailFor = $('#emailForObject').val()
    if(!subject || !message){
        return false;
    }
    $.ajax({
        url: '/admin/email-all-property-viewer/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: { 'property_id': property_id, 'subject': subject, 'message': message, 'email_for': emailFor },
        beforeSend: function(){
            $('.overlay').show();
            //$('#emailAllSubmit').prop('disabled', true).html('Please wait...')
        },
        complete: function(){
             $('.overlay').hide();
            //$('#emailAllSubmit').prop('disabled', false).html('Send')
        },
        success: function(response){
            //$('.overlay').hide();
            if (response.error == 0 || response.status == 200) {
                    $("#emailRecordModalEmail").modal("hide");
                    $('#subject, #message').val('');
                    $('#emailAllSubmit').attr('disabled', true);
                    window.setTimeout(function () {
                        $.growl.notice({title: "Email Users", message: "Email Sent Successfully", size: 'large'});
                    }, 0);
                } else {
                    $("#emailrecordModal").modal("show");
                    window.setTimeout(function () {
                        $.growl.error({title: "Email Users", message: response.msg, size: 'large'});
                    }, 0);
                }
        }
    });
}

function enable_disable_email_all_button(){
    var subject = $("#subject").val().trim();
    var message = $("#message").val().trim();
    if(subject && message){
        $('#emailAllSubmit').attr('disabled', false)
    } else {
        $('#emailAllSubmit').attr('disabled', true)
    }
}
//------------------END Email Property Total to All-----------

//------------------Email Property Total Watcher to All-----------
function emailPropertyTotalToAllWatcher(property_id){
    $("#emailPropertyidWatcher").val(property_id);
    $("#emailRecordModalEmailWatcher").modal('show');
}
$(document).on("click", "#emailAllUsersFormWatcher #emailAllSubmitWatcher", function (e) {
    e.preventDefault();
    var property_id = $("#emailPropertyidWatcher").val();
    //emailPropertyTotalWatcher(property_id);
})
function emailPropertyTotalWatcher(){
    var property_id = $("#emailPropertyidWatcher").val();
    var listing_id = $('#emailPropertyidWatcher').val()
    var subject = $('#subjectWatcher').val().trim()
    var message = $('#messageWatcher').val().trim()
    var emailFor = $('#emailForObjectWatcher').val()
    if(!subject || !message){
        return false;
    }
    $.ajax({
        url: '/admin/email-all-property-viewer/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: { 'property_id': property_id, 'subject': subject, 'message': message, 'email_for': emailFor },
        beforeSend: function(){
            $('.overlay').show();
            //$('#emailAllSubmit').prop('disabled', true).html('Please wait...')
        },
        complete: function(){
             $('.overlay').hide();
            //$('#emailAllSubmit').prop('disabled', false).html('Send')
        },
        success: function(response){
            //$('.overlay').hide();
            if (response.error == 0 || response.status == 200) {
                    $("#emailRecordModalEmailWatcher").modal("hide");
                    $('#subjectWatcher, #messageWatcher').val('');
                    $('#emailAllSubmitWatcher').attr('disabled', true);
                    window.setTimeout(function () {
                        $.growl.notice({title: "Email Users", message: "Email Sent Successfully", size: 'large'});
                    }, 0);
                } else {
                    $("#emailrecordModal").modal("show");
                    window.setTimeout(function () {
                        $.growl.error({title: "Email Users", message: response.msg, size: 'large'});
                    }, 0);
                }
        }
    });
}

function enable_disable_email_all_button_watcher(){
    var subject = $("#subjectWatcher").val().trim();
    var message = $("#messageWatcher").val().trim();
    if(subject && message){
        $('#emailAllSubmitWatcher').attr('disabled', false)
    } else {
        $('#emailAllSubmitWatcher').attr('disabled', true)
    }
}
//------------------END Email Property Total Watcher to All-----------

//------------------Email Bid to All-----------
function emailPropertyTotalToAllBids(property_id){
    $("#emailPropertyidBid").val(property_id);
    $("#emailRecordModalEmailBid").modal('show');
}
$(document).on("click", "#emailAllUsersFormBid #emailAllSubmitBid", function (e) {
    e.preventDefault();
    var property_id = $("#emailPropertyidBid").val();
    //emailPropertyTotalBid(property_id);
})
function emailPropertyTotalBid(){
    var property_id = $("#emailPropertyidBid").val();
    var listing_id = $('#emailPropertyidBid').val()
    var subject = $('#subjectBid').val().trim()
    var message = $('#messageBid').val().trim()
    var emailFor = $('#emailForObjectBid').val()
    if(!subject || !message){
        return false;
    }
    $.ajax({
        url: '/admin/email-all-property-viewer/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: { 'property_id': property_id, 'subject': subject, 'message': message, 'email_for': emailFor },
        beforeSend: function(){
            $('.overlay').show();
            //$('#emailAllSubmit').prop('disabled', true).html('Please wait...')
        },
        complete: function(){
             $('.overlay').hide();
            //$('#emailAllSubmit').prop('disabled', false).html('Send')
        },
        success: function(response){
            //$('.overlay').hide();
            if (response.error == 0 || response.status == 200) {
                    $("#emailRecordModalEmailBid").modal("hide");
                    $('#subjectBid, #messageBid').val('');
                    $('#emailAllSubmitBid').attr('disabled', true);
                    window.setTimeout(function () {
                        $.growl.notice({title: "Email Users", message: "Email Sent Successfully", size: 'large'});
                    }, 0);
                } else {
                    $("#emailrecordModal").modal("show");
                    window.setTimeout(function () {
                        $.growl.error({title: "Email Users", message: response.msg, size: 'large'});
                    }, 0);
                }
        }
    });
}

function enable_disable_email_all_button_bid(){
    var subject = $("#subjectBid").val().trim();
    var message = $("#messageBid").val().trim();
    if(subject && message){
        $('#emailAllSubmitBid').attr('disabled', false)
    } else {
        $('#emailAllSubmitBid').attr('disabled', true)
    }
}

function printPage(class_name){
    //window.print();
//    $("#bidderrecordModal").show();
//    window.print();
    var divToPrint = document.getElementById('bidderrecordModal');
    var htmlToPrint = '' +
        '<style type="text/css">' +
        'table th, table td {' +
        'border:1px solid #000;' +
        'padding;0.5em;' +
        '}' +
        '</style>';
    htmlToPrint += divToPrint.outerHTML;
    newWin = window.open("");
    newWin.document.write("<h3 align='center'>Print Page</h3>");
    newWin.document.write(htmlToPrint);
    newWin.print();
    newWin.close();
    return false;
}
//------------------END Email Bid to All-----------

function property_bidder_delete_confirmation(row_id, auction_id, property_id, user_id,bid_count){
   if(parseInt(bid_count) > 0){
        $.growl.error({title: "Bidder Registration ", message: 'Can\'t Delete because buyer placed a bid.', size: 'large'});
   }else{
        $('#confirmPropertyBidderDeleteModal #UserId').val(user_id);
          $('#confirmPropertyBidderDeleteModal #auctionId').val(auction_id);
          $('#confirmPropertyBidderDeleteModal #propertyId').val(property_id);

          $('#confirmPropertyBidderDeleteModal #deleteBidderBtnSection').html('<button type="button" class="btn btn-primary del_bidder_btn" id="del_bidder_true" onclick="delete_bidder_registration(\''+row_id+'\');">Yes</button><button type="button" class="btn btn-primary-bdr del_bidder_btn" id="del_bidder_false" onclick="close_delete_bidder(\''+row_id+'\');">No</button>');
          $('#confirmPropertyBidderDeleteModal').modal('show');
          $('.del_bidder_btn').attr('rel_id', row_id);
   }

}

function bidder_popup_search_suggesstion(element, e){
    var element_id = $(element).attr('id');
    var x = document.getElementById(element_id + "autocomplete-list");
              if (x) x = x.getElementsByTagName("div");
              if (e.keyCode == 40) {
                /*If the arrow DOWN key is pressed,
                increase the currentFocus variable:*/
                currentFocus++;
                /*and and make the current item more visible:*/
                addActive(x);
              } else if (e.keyCode == 38) { //up
                /*If the arrow UP key is pressed,
                decrease the currentFocus variable:*/
                currentFocus--;
                /*and and make the current item more visible:*/
                addActive(x);
              } else if (e.keyCode == 13) {
                /*If the ENTER key is pressed, prevent the form from being submitted,*/
                e.preventDefault();
                if (currentFocus > -1) {
                  /*and simulate a click on the "active" item:*/
                  if (x) x[currentFocus].click();
                }
              }else{
                var search = $(element).val();
                var property_id = $('#popup_property_id').val();
                $.ajax({
                    url: '/admin/popup-bidder-reg-search-suggestion/',
                    type: 'post',
                    dataType: 'json',
                    cache: false,
                    data: {'search': search, 'property_id': property_id},
                    beforeSend: function(){
                    },
                    success: function(response){
                        if(response.error == 0 && response.status == 200){
                            autocomplete("popup_bidder_popup_search", response.suggestion_list);
                        }else{
                            closeAllSuggestions('autocomplete-items');
                        }
                    }
                });
              }
}
function propertyListingSearch(current_page){
        var search = $('#prop_search').val();
        var currpage = current_page;
        if($('#prop_num_record').val() != ""){
            recordPerpage = $('option:selected','#prop_num_record').val();
        }
        var status = $('option:selected','#prop_filter_status').val();
        var asset_type = $('option:selected','#filter_asset_type').val();
        var auction_type = $('option:selected','#filter_auction_type').val();
        var property_type = $('option:selected','#filter_property_type').val();
        var agent = $('option:selected','#filter_agent').val();
        try{
            var uri = window.location.href.toString();
            if (uri.indexOf("?") > 0) {
                var clean_uri = uri.substring(0, uri.indexOf("?"));
                window.history.replaceState({}, document.title, clean_uri);
            }
        }catch(ex){
            //console.log(ex);
        }
//        if(parseInt(auction_type) == 1 || parseInt(auction_type) == 2){
//            $('#tbl_property_list').removeClass('traditonal live highest').addClass('classic');
//        }else if(parseInt(auction_type) == 4){
//            $('#tbl_property_list').removeClass('classic highest live').addClass('traditonal');
//        }else if(parseInt(auction_type) == 6){
//            $('#tbl_property_list').removeClass('traditonal classic highest').addClass('live');
//        }else if(parseInt(auction_type) == 7){
//            $('#tbl_property_list').removeClass('traditonal classic live').addClass('highest');
//        }

        $.ajax({
            url: '/admin/listing/',
            type: 'post',
            dataType: 'json',
            cache: false,
            data: {search: search, perpage: recordPerpage, status: status, asset_type: asset_type, auction_type: auction_type, page: currpage, property_type: property_type, agent:agent},
            beforeSend: function(){
                $('.overlay').show();
            },
            success: function(response){
                $('.overlay').hide();
                if(response.error == 0){
                    if($('#prop_num_record').val() != ""){
                        recordPerpage = $('#prop_num_record').val();
                    }
                    //var $perpageresult = getAllPageLinks('user_listing',currpage, recordPerpage, response.total_user, '', '', '');
                    $('#tbl_property_list').empty();
                    $('#tbl_property_list').html(response.property_listing_html);
                    $("#tbl_property_list").find('script').remove();
                    $("#prop_listing_pagination_list").html(response.pagination_html);
                    $("#counter_num").val(response.sno);
                    if(response.auction_id == 1 || response.auction_id == 2 || response.auction_id == ""){
                        $("#download_btn_section").html('<a href="javascript:void(0)" class="btn btn-primary btn-sm pl20" onclick="downloadListing(\''+response.page+'\');"><i class="fas fa-download"></i> Download</a> <a href="/admin/listing-settings/" class="btn btn-primary btn-sm pl20"><i class="fas fa-wrench"></i> Setting</a>');
                    }else{
                        $("#download_btn_section").html('<a href="javascript:void(0)" class="btn btn-primary btn-sm pl20" onclick="downloadListing(\''+response.page+'\');"><i class="fas fa-download"></i> Download</a>');
                    }



                }else{
                    $('#tbl_property_list').html('<div class="block-item"><div class="item fullwidth"><p class="custom_error center mb0">No Data Found!</p></div></div>');
                }
                $(window).scrollTop(0);
                $("#tbl_property_list").find('script').remove();
            }
        });
    }
    function delete_property(){
        var row_id = $('#del_prop_true').attr('rel_id');
        if(row_id != ""){
        $('#property_list #row_id_'+row_id).remove();
        var search = $('#prop_search').val();
        if($('#prop_num_record').val() != ""){
            recordPerpage = $('#prop_num_record').val();
        }
        var status = $('#prop_filter_status').val();
        var asset_type = $('#filter_asset_type').val();
        var auction_type = $('#filter_auction_type').val();
        var property_type = $('#filter_property_type').val();
            $.ajax({
            url: '/admin/delete-property/',
            type: 'post',
            dataType: 'json',
            cache: false,
            data: {property_id: row_id, search: search, perpage: recordPerpage, status: status, asset_type: asset_type, auction_type: auction_type, page: 1, property_type: property_type},
            beforeSend: function(){
                $('.overlay').show();
            },
            success: function(response){
                $('.overlay').hide();
                $('#del_prop_true').removeAttr('rel_id');
                $('#del_prop_false').removeAttr('rel_id');
                $('#confirmPropertyDeleteModal').modal('hide');
                var auction_type = $('option:selected','#filter_auction_type').val();
                var auction_type_text = '';
                if(response.error == 0){
                    $.growl.notice({title: "Property ", message: response.msg, size: 'large'});
                    if(parseInt(auction_type) == 4){
                        auction_type_text = 'traditional offer';
                    }else if(parseInt(auction_type) == 7){
                        auction_type_text = 'highest offer';
                    }else if(parseInt(auction_type) == 4){
                        auction_type_text = 'live offer';
                    }
                    if(auction_type_text != ""){
                        window.location.href = '/admin/listing/?auction_type='+auction_type_text;
                    }else{
                        window.location.href = '/admin/listing/';
                    }

                    /*$('#tbl_property_list').empty();
                    $('#tbl_property_list').html(response.property_listing_html);
                    $("#tbl_property_list").find('script').remove();
                    $("#prop_listing_pagination_list").html(response.pagination_html);*/

                }else{
                    //$('#agent_list').empty();
                    $('#del_prop_true').removeAttr('rel_id');
                    $('#del_prop_false').removeAttr('rel_id');
                    $('#confirmPropertyDeleteModal').modal('hide');
                    window.setTimeout(function () {
                        $.growl.error({title: "Property ", message: response.msg, size: 'large'});
                    }, 2000);
                }
                $(window).scrollTop(0);
            }
        });
        }
    }
    $(function(){
        try{

            $("#property_list").sortable({
          start: function (event, ui) {
              //console.log('start');
          },
          stop: function(event, ui) {
            var total_length = $('div.block-item').length;
            if(total_length && parseInt(total_length) > 3){
                var first_row = parseInt(total_length) -1;
                var second_row = parseInt(total_length);
            }else{
                var first_row = 0;
                var second_row = 0;
            }
             var arr = [];
             var property='';
             var index = '';
             var count = parseInt($("#counter_num").val());
             var new_counter = 1;
             $.map($(this).find('div.block-item'), function(el) {
                if(first_row > 0 && second_row > 0){
                    if(new_counter == first_row || new_counter == second_row){
                        $(el).addClass('last-row');
                        $(el).find('.action_dropdown').addClass('dropup');
                    }else{
                        $(el).removeClass('last-row');
                        $(el).find('.action_dropdown').removeClass('dropup');
                    }
                }
                //$(el).data('property') + ' = ' + $(el).index() + ' = ' + $(el).data('index');
                property = $(el).data('property');
                index = count;//$(el).index() + 1;
                var new_obj = {'property_id': property, 'reorder_id': index};
                arr.push(new_obj);
                $(".srNum:eq("+$(el).index()+")").text(count);
                count++;
                new_counter++;
            });
            var data = {"reorder": JSON.stringify(arr)}
            $.ajax({
              url: '/admin/property-listing-ordering/',
              type: 'post',
              dataType: 'json',
              data: data,
              beforeSend: function(){
                  //$('.overlay').show();
              },
              success: function(response){
                  if(response.error == 0){
                    //console.log(response.msg);
                  }else{
                    //console.log(response.msg);
                  }
              }
          });
          },
          change: function(event, ui) {
            //console.log('change');
            //console.log(ui);
          }
        });
        }catch(ex){
            //console.log(ex);
        }
      });
function confirm_delete_date(element){
    var del_element = $(element).closest('.add_more_open_house_date').attr('id');
    $('.del_date_btn').attr('del_element_id', del_element);
    $('#confirmDateDeleteModal').modal('show');
}
function min_max_date(min_date, max_date, index){
  //var new_min_date = new Date(min_date);
  //var new_max_date = new Date(max_date);
  var new_min_date = min_date;
  var new_max_date = max_date;


  $('#add_more_open_house_date_'+index).find('.open_house_end').datetimepicker('remove');
    $('#add_more_open_house_date_'+index).find('.open_house_end').datetimepicker('destroy');

    $('#add_more_open_house_date_'+index).find('.open_house_end').datetimepicker('update', '');

    try{
        $('#add_more_open_house_date_'+index).find('.open_house_end').data("DateTimePicker").maxDate(new_max_date);
        $('#add_more_open_house_date_'+index).find('.open_house_end').data("DateTimePicker").minDate(new_min_date);
    }catch(ex){
        $('#add_more_open_house_date_'+index).find('.open_house_end').data("DateTimePicker").minDate(new_min_date);
        $('#add_more_open_house_date_'+index).find('.open_house_end').data("DateTimePicker").maxDate(new_max_date);

    }



}

function init_open_house_end_date(index){
      var new_min_date = '';
      var new_max_date = '';
      var count_index = '';
      var virtual_dates = $("#datetimepicker6"+index).attr('data-value');


      if(virtual_dates){
        var new_virtual_date = getLocalDate(virtual_dates, 'mm-dd-yyyy','ampm');
        var actualStartDate = new_virtual_date.split(" ");
        //new lines
        var mdy_format = actualStartDate[0].split("-");

        new_min_date = mdy_format[2]+"-"+mdy_format[0]+"-"+mdy_format[1];
        new_max_date = new_min_date+' 23:59:59';
      }

      if(new_min_date != "" && new_max_date != ""){
        $("#datetimepicker6"+index).datetimepicker({
          format: 'MM-DD-YYYY hh:mm A',
          maxDate: new_max_date,
          minDate: new_min_date,
          }).on('dp.change',function(e){
              var virtual_date_element = $(this).find('input:first').attr('id');
              var date_element = $(this).find('input:last').attr('id');
              var dates = $("#"+virtual_date_element).val();
              if(dates != ""){
                var actualStartDate = dates.split(" ");
                //new lines
                var mdy_format = actualStartDate[0].split("-");
                mdy_date = mdy_format[2]+"-"+mdy_format[0]+"-"+mdy_format[1];

                var newactualStartDate = mdy_date+' '+convert_to_24h(actualStartDate[1]+' '+actualStartDate[2]);
                actualStartDate = actualStartDate[0]+' '+convert_to_24h(actualStartDate[1]+' '+actualStartDate[2]);

                var utc_date = convert_to_utc_date(actualStartDate, 'mm-dd-yyyy', 'datetime');
                $("#"+date_element+"_local").val(actualStartDate);
                $("#"+date_element).val(utc_date);
              }
          });
      }else{
        $('#add_more_open_house_date_'+index).find('.open_house_end').datetimepicker({
          format: 'MM-DD-YYYY hh:mm A',
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
                var newactualStartDate = mdy_date+' '+convert_to_24h(actualStartDate[1]+' '+actualStartDate[2]);
                actualStartDate = actualStartDate[0]+' '+convert_to_24h(actualStartDate[1]+' '+actualStartDate[2]);

                var utc_date = convert_to_utc_date(actualStartDate, 'mm-dd-yyyy', 'datetime');
                $("#"+date_element+"_local").val(actualStartDate);
                $("#"+date_element).val(utc_date);
              }
          });
      }


}
function init_open_house_start_date(count){
    $('#add_more_open_house_date_'+count).find('.open_house_start').datetimepicker({
          format: 'MM-DD-YYYY hh:mm A',
    });
}
function filter_property_asset_type(element, page){
        propertyListingSearch(page);
        $('#filter_property_type').empty();
        $('#filter_property_type').html('<option value="">Select Property Type</option>');
        $('#filter_property_type').trigger("chosen:updated");

        var asset_id = $(element).val();
        $.ajax({
            url: '/admin/get-property-types/',
            type: 'post',
            dataType: 'json',
            cache: false,
            data: {asset_id: asset_id},
            beforeSend: function(){
            },
            success: function(response){
                if(response.error == 0){
                    $('#filter_property_type').empty();
                    $('#filter_property_type').append('<option value="">Select Property Type</option>');
                    $.each(response.property_type_listing, function(i, item) {
                        $('#filter_property_type').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#filter_property_type').trigger("chosen:updated");
                }else{
                    $('#filter_property_type').empty();
                    $('#filter_property_type').trigger("chosen:updated");
                }
            }
        });
}
function update_bidder_socket(response){
    // const socket = io.connect(socket_domain, {
    //     transports: ["websocket", "xhr-polling", "htmlfile", "jsonp-polling"],
    //     rejectUnauthorized: false,
    //     requestCert: false,
    // });
    if(typeof(response.auction_type) != 'undefined' && parseInt(response.auction_type) == 2){
        socket.emit("checkInsiderBid", {"user_id": response.user_id, "property_id": response.property_id, "auction_id": response.auction_id, "domain_id": response.site_id});
    }else{
        socket.emit("checkBid", {"user_id": response.user_id, "property_id": response.property_id, "auction_id": response.auction_id, "domain_id": response.site_id});
    }

}
function close_listing_setting_popup(){
    $('#EditLisingSettingModal').modal('hide');
}

function reserve_amount_dependant() {
    var reserve_amount = $('#reserve_amount').val();
    reserve_amount = reserve_amount.toString().replace(/,/g, '');
    if(reserve_amount){
        return '#bidding_min_price';
    }else{
        return "";
    }

}
function isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 47 || charCode > 57)) {
        return false;
    }
    return true;
}
function propertyOfferListingSearch(property_id, offer_count){
    if(parseInt(offer_count) > 0){
        $.ajax({
            url: '/admin/property-offer-list/',
            type: 'post',
            dataType: 'json',
            cache: false,
            data: {'property_id': property_id},
            beforeSend: function(){
                $('.overlay').show();
            },
            success: function(response){
                $('.overlay').hide();
                $("#view_offer_list").empty();
                $("#offer_details").empty();

                /*if(response.property_image != ""){
                    $("#popup_property_image").attr('src', response.property_image);
                }else {
                    $("#popup_property_image").attr('src', '/static/admin/images/property-default-img.png');
                }*/
                if(response.error == 0){
                    $("#view_offer_list").html(response.offer_history_html);
                    $("#offer_details").html(response.offer_details_html);
                }else{
                    $('#view_offer_list').html('<tr><td colspan="4"><img src="static/theme-1/images/property-not-avail.png" class=" center mb0" /></td></tr>');

                }
                try{
                    $('.offer_checbox:first').prop('checked',true);
                }catch(ex){

                }
                $("#view_offer_list").find('script').remove();
                $("#offer_details").find('script').remove();

                $('#viewofferModal').modal('show');
            }
        });
    }
}


/*function propertyBidHistorySearch(property_id, current_page){
    $('#bidHistoryPropertyId').val(property_id);
    var currpage = current_page;
    $.ajax({
        url: '/admin/property-offer-list/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {'page': currpage, 'page_size': recordPerpage, 'property_id': property_id},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            $("#bidHistoryPaginationList").empty();
            $("#bidHistoryList").empty();
            $("#bidHistoryPropertyName").empty();
            // $("#bidHistoryPropertyLink").attr("href", '/asset-details/?property_id='+property_id);
            if(response.property_image != ""){
                $("#bidHistoryPropertyImage").attr('src', response.property_image);
            }else {
                $("#bidHistoryPropertyImage").attr('src', '/static/admin/images/property-default-img.png');
            }
            if(response.property_address != ""){
                $('#bidHistoryPropertyName').html('<a href="/asset-details/?property_id='+property_id+'" id="bidHistoryPropertyLink" target="_blank">'+response.property_address+'</a> <span><i class="fas fa-map-marker-alt"></i> '+response.property_city+', '+response.property_state+' '+response.property_postal_code+'</span>');
            }
            if(response.auction_type){
                $('#bidHistoryAuctiontype').html(response.auction_type)
            }
            if(response.bid_increment){
                $('#bidHistoryBidIncrement').html('$' + response.bid_increment)
            }
            if(response.error == 0){
                $("#bidHistoryList").html(response.bid_history_html);
                $("#bidHistoryPaginationList").html(response.pagination_html);
            }else{
                $('#bidHistoryList').html('<li class="text-center text-danger" style="width:100%;"><img src="static/theme-1/images/property-not-avail.png" class=" center mb0" /></li>');
                $("#bidHistoryPaginationList").hide();
            }
            $('#bidderrecordModal').modal('show');
        }
    });
}*/
function propertyOfferDetails(negotiated_id,el){

    $('.offer_checbox').each(function(){
        $(this).removeProp('checked');
    });
    $(el).prop('checked',true);
    $.ajax({
        url: '/admin/property-offer-details/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {'negotiated_id': negotiated_id},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            $("#offer_details").empty();
            $("#offer_details").html(response.offer_details_html);
            $("#offer_details").find('script').remove();
            /*$("#view_offer_list").empty();
            *//*if(response.property_image != ""){
                $("#popup_property_image").attr('src', response.property_image);
            }else {
                $("#popup_property_image").attr('src', '/static/admin/images/property-default-img.png');
            }*//*
            if(response.error == 0){
                $("#view_offer_list").html(response.offer_history_html);
            }else{
                $('#view_offer_list').html('<tr><td colspan="4"><img src="static/theme-1/images/property-not-avail.png" class=" center mb0" /></td></tr>');

            }
            $('#viewofferModal').modal('show');*/
        }
    });
}

function show_offer_message(msg){
    $('#viewMsgHistoryModal #user_msg').html(msg);
    $('#viewMsgHistoryModal').modal('show');
}
function show_best_offer_message(msg){
    $('#viewBestMsgHistoryModal #best_user_msg').html(msg);
    $('#viewBestMsgHistoryModal').modal('show');
}
function counter_offer(property_id,negotiated_id){
    $.ajax({
        url: '/admin/counter-offer-details/',
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
                $('#counter_offer_frm #negotiated_id').val(negotiated_id);
                $('#counter_offer_frm #counter_property_id').val(property_id);
                $('#counter_offer_frm #existing_offer_price').val('$'+offer_amount);
                //$('#counter_offer_frm #offer_price').val(offer_amount);
                $('#counter_offer_frm #offer_comment').val('');

            }else{
                $.growl.error({title: "Offer ", message: response.msg, size: 'large'});
            }
            $('#counterOfferModal').modal('show');
        }
    });

}
function counter_best_offer(property_id,negotiated_id){
    $.ajax({
        url: '/admin/counter-best-offer-details/',
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
            $('#newcounterOfferModal').modal('show');
        }
    });

}
function accept_traditional_offer(){
    var property_id = $('#accept_property_id').val();
    var negotiated_id = $('#accept_negotiated_id').val();

    $.ajax({
        url: '/admin/accept-offer/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {'property_id': property_id,'negotiated_id': negotiated_id},
        beforeSend: function(){
            $('.overlay').show();
            $('#accept_offer_true').prop('disabled', true);
        },
        success: function(response){
            $('.overlay').hide();
            $('#accept_offer_true').removeProp('disabled');
            if(response.error == 0){
                $.growl.notice({title: "Offer ", message: response.msg, size: 'large'});
                window.setTimeout(function () {
                    $('#confirmAcceptOfferModal').modal('hide');
                    //$('#viewofferModal').modal('hide');
                    window.location.reload();
                }, 2000);
            }else{
                $.growl.error({title: "Offer ", message: response.msg, size: 'large'});
            }
        }
    });
}
function approve_best_offer(){
    var property_id = $('#approve_property_id').val();
    var negotiated_id = $('#approve_negotiated_id').val();

    $.ajax({
        url: '/admin/approve-best-offer/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {'property_id': property_id,'negotiated_id': negotiated_id},
        beforeSend: function(){
            $('.overlay').show();
            $('#approve_offer_true').prop('disabled', true);
        },
        success: function(response){
            $('.overlay').hide();
            $('#approve_offer_true').removeProp('disabled');
            if(response.error == 0){
                $.growl.notice({title: "Offer ", message: response.msg, size: 'large'});
                if(typeof(response.offer_history_html) && response.offer_history_html != ""){
                    $("#view_best_offer_list").empty();
                    $("#view_best_offer_list").html(response.offer_history_html);
                    $("#view_best_offer_list").find('script').remove();
                }
                if(typeof(response.offer_details_html) && response.offer_details_html != ""){
                    $("#offer_details").empty();
                    $("#offer_details").html(response.offer_details_html);
                    $("#offer_details").find('script').remove();
                }
                try{
                    $('.offer_checbox').each(function(){
                        $(this).removeProp('checked');
                    });
                    $('.block-item').each(function(){
                        $(this).removeClass('current');
                    });
                    var check_ofer_id = response.negotiated_id.toString();
                    $('#search_icon_'+check_ofer_id).prop('checked',true);
                    $('#search_icon_'+check_ofer_id).closest('.block-item').addClass('current');
                    $(window).scrollTop(0);
                }catch(ex){

                }
                $("#view_best_offer_list").find('script').remove();
                $("#offer_details").find('script').remove();
                window.setTimeout(function () {
                    $('#confirmApproveBestOfferModal').modal('hide');
                    //$('#viewofferModal').modal('hide');
                    //window.location.reload();
                }, 2000);
            }else{
                $.growl.error({title: "Offer ", message: response.msg, size: 'large'});
            }
        }
    });
}
function accept_best_offer(){
    var property_id = $('#accept_property_id').val();
    var negotiated_id = $('#accept_negotiated_id').val();

    $.ajax({
        url: '/admin/accept-best-offer/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {'property_id': property_id,'negotiated_id': negotiated_id},
        beforeSend: function(){
            $('.overlay').show();
            $('#accept_offer_true').prop('disabled', true);
        },
        success: function(response){
            $('.overlay').hide();
            $('#accept_offer_true').removeProp('disabled');
            if(response.error == 0){
                $.growl.notice({title: "Offer ", message: response.msg, size: 'large'});
                if(typeof(response.offer_history_html) && response.offer_history_html != ""){
                    $("#view_best_offer_list").empty();
                    $("#view_best_offer_list").html(response.offer_history_html);
                    $("#view_best_offer_list").find('script').remove();
                }
                if(typeof(response.offer_details_html) && response.offer_details_html != ""){
                    $("#offer_details").empty();
                    $("#offer_details").html(response.offer_details_html);
                    $("#offer_details").find('script').remove();
                }
                try{
                    $('.offer_checbox').each(function(){
                        $(this).removeProp('checked');
                    });
                    $('.block-item').each(function(){
                        $(this).removeClass('current');
                    });
                    var check_ofer_id = response.negotiated_id.toString();
                    $('#search_icon_'+check_ofer_id).prop('checked',true);
                    $('#search_icon_'+check_ofer_id).closest('.block-item').addClass('current');
                    $(window).scrollTop(0);
                }catch(ex){

                }
                $("#view_best_offer_list").find('script').remove();
                $("#offer_details").find('script').remove();
                window.setTimeout(function () {
                    $('#confirmAcceptBestOfferModal').modal('hide');
                    //$('#viewofferModal').modal('hide');
                    //window.location.reload();
                }, 2000);
            }else{
                $.growl.error({title: "Offer ", message: response.msg, size: 'large'});
            }
        }
    });
}

function reject_traditional_offer(){
    var property_id = $('#rej_property_id').val();
    var negotiated_id = $('#rej_negotiated_id').val();

    $.ajax({
        url: '/admin/reject-offer/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {'property_id': property_id,'negotiated_id': negotiated_id},
        beforeSend: function(){
            $('.overlay').show();
            $('#reject_offer_true').prop('disabled', true);
        },
        success: function(response){
            $('.overlay').hide();
            $('#reject_offer_true').removeProp('disabled');
            if(response.error == 0){
                $.growl.notice({title: "Offer ", message: response.msg, size: 'large'});
                window.setTimeout(function () {
                    $('#viewofferModal').modal('hide');
                    $('#confirmRejectOfferModal').modal('hide');
                    window.location.reload();
                }, 2000);
            }else{
                $.growl.error({title: "Offer ", message: response.msg, size: 'large'});
            }
        }
    });
}
function reject_best_offer(){
    var property_id = $('#rej_property_id').val();
    var negotiated_id = $('#rej_negotiated_id').val();
    var reason = $('#best_reject_reason').val();

    $.ajax({
        url: '/admin/reject-best-offer/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {'property_id': property_id,'negotiated_id': negotiated_id, 'reason': reason},
        beforeSend: function(){
            $('.overlay').show();
            $('#reject_offer_true').prop('disabled', true);
        },
        success: function(response){
            $('.overlay').hide();
            $('#reject_offer_true').removeProp('disabled');
            if(response.error == 0){
                $.growl.notice({title: "Offer ", message: response.msg, size: 'large'});
                if(typeof(response.offer_history_html) && response.offer_history_html != ""){
                    $("#view_best_offer_list").empty();
                    $("#view_best_offer_list").html(response.offer_history_html);
                    $("#view_best_offer_list").find('script').remove();
                }
                if(typeof(response.offer_details_html) && response.offer_details_html != ""){
                    $("#offer_details").empty();
                    $("#offer_details").html(response.offer_details_html);
                    $("#offer_details").find('script').remove();
                }
                try{
                    $('.offer_checbox').each(function(){
                        $(this).removeProp('checked');
                    });
                    $('.block-item').each(function(){
                        $(this).removeClass('current');
                    });
                    var check_ofer_id = response.negotiated_id.toString();
                    $('#search_icon_'+check_ofer_id).prop('checked',true);
                    $('#search_icon_'+check_ofer_id).closest('.block-item').addClass('current');
                    $(window).scrollTop(0);
                }catch(ex){

                }
                $("#view_best_offer_list").find('script').remove();
                $("#offer_details").find('script').remove();
                window.setTimeout(function () {
                    //$('#confirmRejectBestOfferModal').modal('hide');
                    $('#newconfirmRejectBestOfferModal').modal('hide');
                    //window.location.reload();
                }, 2000);
            }else{
                $.growl.error({title: "Offer ", message: response.msg, size: 'large'});
            }
        }
    });
}
function confirm_seller_reject_offer(property_id,negotiated_id){
    $('#rej_property_id').val(property_id);
    $('#rej_negotiated_id').val(negotiated_id);
    $('#confirmRejectOfferModal').modal('show');
}
function confirm_seller_reject_best_offer(property_id,negotiated_id){
    $('#rej_property_id').val(property_id);
    $('#rej_negotiated_id').val(negotiated_id);
    $('#best_reject_reason').val('');
    // $('#confirmRejectBestOfferModal').modal('show');
    //--------------------------Changed By Gautam---------------------
    confirm_seller_reject_best_offer_detail(property_id,negotiated_id);
}
function confirm_seller_accept_offer(property_id,negotiated_id){
    $('#accept_property_id').val(property_id);
    $('#accept_negotiated_id').val(negotiated_id);
    $('#confirmAcceptOfferModal').modal('show');
}
function confirm_seller_approve_best_offer(property_id,negotiated_id){
    $('#approve_property_id').val(property_id);
    $('#approve_negotiated_id').val(negotiated_id);
    $('#confirmApproveBestOfferModal').modal('show');
}
function confirm_seller_accept_best_offer(property_id,negotiated_id){
    $('#accept_property_id').val(property_id);
    $('#accept_negotiated_id').val(negotiated_id);
    $('#confirmAcceptBestOfferModal').modal('show');
}

function live_min_max_date(min_date, max_date, index){
  //var new_min_date = new Date(min_date);
  //var new_max_date = new Date(max_date);
  var new_min_date = min_date;
  var new_max_date = max_date;

  $('#datetimepicker2').datetimepicker('remove');
    $('#datetimepicker2').datetimepicker('destroy');

    $('#datetimepicker2').datetimepicker('update', '');

    try{
        $('#datetimepicker2').data("DateTimePicker").maxDate(new_max_date);
        $('#datetimepicker2').data("DateTimePicker").minDate(new_min_date);
    }catch(ex){
        //console.log(ex);
        $('#datetimepicker2').data("DateTimePicker").minDate(new_min_date);
        $('#datetimepicker2').data("DateTimePicker").maxDate(new_max_date);

    }
}

function init_auction_start_date(){
    try{
        $('#datetimepicker1').datetimepicker({
              format: 'MM-DD-YYYY hh:mm A',
        });
    }catch(ex){

    }

}

function init_auction_end_date(){
      var new_min_date = '';
      var new_max_date = '';
      var count_index = '';
      var virtual_dates = $("#datetimepicker2").attr('data-value');
      var auction_type = $('option:selected','#auction_type').val();


      if(virtual_dates){
        var new_virtual_date = getLocalDate(virtual_dates, 'mm-dd-yyyy','ampm');
        var actualStartDate = new_virtual_date.split(" ");
        //new lines
        var mdy_format = actualStartDate[0].split("-");

        new_min_date = mdy_format[2]+"-"+mdy_format[0]+"-"+mdy_format[1];
        new_max_date = new_min_date+' 23:59:59';
      }

      if(new_min_date != "" && new_max_date != "" && auction_type != ""  && parseInt(auction_type) == 6){
        try{
            $("#datetimepicker2").datetimepicker({
              format: 'MM-DD-YYYY hh:mm A',
              maxDate: new_max_date,
              minDate: new_min_date,
              }).on('dp.change',function(e){
                  var virtual_date_element = $(this).find('input:first').attr('id');
                  var date_element = $(this).find('input:last').attr('id');
                  var dates = $("#"+virtual_date_element).val();
                  if(dates != ""){
                    var actualStartDate = dates.split(" ");
                    //new lines
                    var mdy_format = actualStartDate[0].split("-");
                    mdy_date = mdy_format[2]+"-"+mdy_format[0]+"-"+mdy_format[1];

                    var newactualStartDate = mdy_date+' '+convert_to_24h(actualStartDate[1]+' '+actualStartDate[2]);
                    actualStartDate = actualStartDate[0]+' '+convert_to_24h(actualStartDate[1]+' '+actualStartDate[2]);

                    var utc_date = convert_to_utc_date(actualStartDate, 'mm-dd-yyyy', 'datetime');
                    $("#"+date_element+"_local").val(actualStartDate);
                    $("#"+date_element).val(utc_date);
                  }
              });
        }catch(ex){

        }

      }else{
        try{
            $('#datetimepicker2').datetimepicker({
              format: 'MM-DD-YYYY hh:mm A',
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
                    var newactualStartDate = mdy_date+' '+convert_to_24h(actualStartDate[1]+' '+actualStartDate[2]);
                    actualStartDate = actualStartDate[0]+' '+convert_to_24h(actualStartDate[1]+' '+actualStartDate[2]);

                    var utc_date = convert_to_utc_date(actualStartDate, 'mm-dd-yyyy', 'datetime');
                    $("#"+date_element+"_local").val(actualStartDate);
                    $("#"+date_element).val(utc_date);
                  }
              });
        }catch(ex){

        }

      }


}
function get_offer_documents(property_id,negotiated_id){
    $.ajax({
        url: '/admin/get-offer-doc-details/',
        type: 'post',
        dataType: 'json',
        data: {'property_id': property_id,'negotiated_id': negotiated_id},
        cache: false,
        beforeSend: function(){
           $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
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
function show_offer_chat(property_id,user_id){
    $('#offerChatFrm #chat_property_id').val('');
    $('#offerChatFrm #chat_user_id').val('');
    $('#offerChatFrm #user_message').val('');
    $('#offerChatFrm #chat_property_id').val(property_id);
    $('#offerChatFrm #chat_user_id').val(user_id);
    $('p.error').hide();
    $('#offerChatModal').modal('show');
}
function downloadListing(current_page){
        var search = $('#prop_search').val();
        var currpage = current_page;
        if($('#prop_num_record').val() != ""){
            recordPerpage = $('#prop_num_record').val();
        }
        var status = $('#prop_filter_status').val();
        var asset_type = $('#filter_asset_type').val();
        var auction_type = $('#filter_auction_type').val();
        var property_type = '';
        var agent = $('#filter_agent').val();

        window.location.href = '/admin/download-listing/?page='+currpage+'&page_size='+recordPerpage+'&search='+search+'&status='+status+'&asset_type='+asset_type+'&auction_type='+auction_type+'&property_type='+property_type+'&agent='+agent;

    }
    function change_property_status(property_id,element){
        var status_id = $('option:selected',element).val();
           var status_name = $('option:selected',element).text();
           var property_id = property_id;
           data = {property_id: property_id, status_id : status_id, status_name: status_name};

           $.ajax({
            url: '/admin/change-property-status/',
            type: 'post',
            dataType: 'json',
            cache: false,
            data: data,
            beforeSend: function(){
                $('.overlay').show();
            },
            success: function(response){
                $('.overlay').hide();
                if(response.error == 0){
                    var property_id = response.property_id.toString();
                    var status_id = response.status_id;
                    var status_name = response.status_name;
                    var badge_class='badge-success';
                    if(status_id == 2 || status_id == 5){
                        badge_class = 'badge-danger';
                    }else if(status_id == 4 || status_id == 7){
                        badge_class = 'badge-warning';
                    }
                    $('#change_status_'+property_id).hide();
                    $('#display_status_'+property_id).html('<span class="badge '+badge_class+'" style="cursor:pointer;">'+status_name+'</span>').show();
                    window.setTimeout(function () {
                        $.growl.notice({title: "Listing ", message: response.msg, size: 'large'});
                    }, 2000);
                }else{
                    window.setTimeout(function () {
                        $.growl.error({title: "Listing ", message: response.msg, size: 'large'});
                    }, 2000);
                }
            }
        });
    }

    function change_apporval_status(property_id, element){
        var approval_id = $('option:selected',element).val();
           var approval_name = $('option:selected',element).text();
           var property_id = property_id;
           data = {property_id: property_id, approval_id : approval_id, approval_name: approval_name};
           $.ajax({
            url: '/admin/change-approval-status/',
            type: 'post',
            dataType: 'json',
            cache: false,
            data: data,
            beforeSend: function(){
                $('.overlay').show();
            },
            success: function(response){
                $('.overlay').hide();
                if(response.error == 0){
                    var property_id = response.property_id.toString();
                    var approval_id = response.approval_id;
                    var approval_name = response.approval_name;
                    var badge_class='badge-success';
                    if(approval_id != 1){
                        badge_class = 'badge-warning';
                    }
                    $('#change_approval_'+property_id).hide();
                    $('#approval_status_'+property_id).html('<span class="badge '+badge_class+'" style="cursor:pointer;">'+approval_name+'</span>').show();
                    window.setTimeout(function () {
                        $.growl.notice({title: "Listing ", message: response.msg, size: 'large'});
                    }, 2000);
                }else{
                    window.setTimeout(function () {
                        $.growl.error({title: "Listing ", message: response.msg, size: 'large'});
                    }, 2000);
                }
            }
        });
    }

function propertyBestOfferListingSearch(property_id, offer_count){
    //if(parseInt(offer_count) > 0){
        $.ajax({
            url: '/admin/property-best-offer-list/',
            type: 'post',
            dataType: 'json',
            cache: false,
            data: {'property_id': property_id},
            beforeSend: function(){
                $('.overlay').show();
            },
            success: function(response){
                $('.overlay').hide();
                $("#view_offer_list").empty();
                $("#offer_details").empty();

                /*if(response.property_image != ""){
                    $("#popup_property_image").attr('src', response.property_image);
                }else {
                    $("#popup_property_image").attr('src', '/static/admin/images/property-default-img.png');
                }*/
                if(response.error == 0){
                    $("#view_offer_list").html(response.offer_history_html);
                    $("#offer_details").html(response.offer_details_html);
                }else{
                    $('#view_offer_list').html('<tr><td colspan="4"><img src="static/theme-1/images/property-not-avail.png" class=" center mb0" /></td></tr>');

                }
                try{
                    $('.offer_checbox:first').prop('checked',true);
                }catch(ex){

                }
                $("#view_offer_list").find('script').remove();
                $("#offer_details").find('script').remove();

                $('#viewofferModal').modal('show');
            }
        });
    //}
}
function propertyBestOfferDetails(negotiated_id,el){

    $('.offer_checbox').each(function(){
        $(this).removeProp('checked');
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
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            $("#offer_details").empty();
            $("#offer_details").html(response.offer_details_html);
            $("#offer_details").find('script').remove();
            /*$("#view_offer_list").empty();
            *//*if(response.property_image != ""){
                $("#popup_property_image").attr('src', response.property_image);
            }else {
                $("#popup_property_image").attr('src', '/static/admin/images/property-default-img.png');
            }*//*
            if(response.error == 0){
                $("#view_offer_list").html(response.offer_history_html);
            }else{
                $('#view_offer_list').html('<tr><td colspan="4"><img src="static/theme-1/images/property-not-avail.png" class=" center mb0" /></td></tr>');

            }
            $('#viewofferModal').modal('show');*/
        }
    });
}
function exportBidHistory(property_id,current_page){
    var d = new Date();
    var timezone = d.getTimezoneOffset();
    var search = $('#search_bid_history').val();
    var currpage = current_page;
    var page_size = recordPerpage;

    window.location.href = '/admin/export-bid-history/?page='+currpage+'&page_size='+recordPerpage+'&search='+search+'&property='+property_id+'&timezone='+timezone;
}

//--------Export Property Total View
function exportPropertyTotalView(property_id,current_page){
    var d = new Date();
    var timezone = d.getTimezoneOffset();
    var search = $('#search_property_total_view').val();
    var currpage = current_page;
    var page_size = recordPerpage;

    window.location.href = '/admin/export-property-total-view/?page='+currpage+'&page_size='+recordPerpage+'&search='+search+'&property='+property_id+'&timezone='+timezone;
}

//--------Export Property Total View
function exportPropertyTotalWatcher(property_id,current_page){
    var d = new Date();
    var timezone = d.getTimezoneOffset();
    var search = $('#search_property_total_watcher').val();
    var currpage = current_page;
    var page_size = recordPerpage;

    window.location.href = '/admin/export-property-total-watcher/?page='+currpage+'&page_size='+recordPerpage+'&search='+search+'&property='+property_id+'&timezone='+timezone;
}

function exportInsiderBidHistory(property_id,current_page,step){
    var d = new Date();
    var timezone = d.getTimezoneOffset();
    var search = $('#insider_search_bid_history').val();
    var currpage = current_page;
    var page_size = recordPerpage;

    window.location.href = '/admin/export-insider-bid-history/?page='+currpage+'&page_size='+recordPerpage+'&search='+search+'&property='+property_id+'&timezone='+timezone+'&step='+step;
}
function delete_last_bid(property_id){
    $.ajax({
        url: '/admin/delete-current-bid/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {'property_id': property_id},
        beforeSend: function(){
            $('.overlay').show();
            $('#delete_last_bid_true').prop('disabled', true);
        },
        success: function(response){
            $('.overlay').hide();
            $('#delete_last_bid_true').removeProp('disabled');
            if(response.error == 0){
                $.growl.notice({title: "Bid ", message: response.msg, size: 'large'});
                window.setTimeout(function () {
                    $('#confirmDeleteLastBidModal').modal('hide');
                    $('#property_total_bid_model').modal('hide');
                    $('#bidderrecordModal').modal('hide');
                    //$('body').addClass('modal-open');
                }, 2000);
                try{
                   custom_response = {
                    'site_id': response.site_id,
                    'user_id': response.user_id,
                    'property_id': response.property_id,
                    'auction_id': response.auction_id,
                  };
                    customCallBackFunc(update_bidder_socket, [custom_response]);
                }catch(ex){
                    //console.log(ex);
                }
                var search = $('#prop_search').val();
                if($('#prop_num_record').val() != ""){
                    recordPerpage = $('#prop_num_record').val()
                }
                var status = $('#prop_filter_status').val().toString();
                var asset_type = $('#filter_asset_type').val();
                var auction_type = $('#filter_auction_type').val();
                var property_type = $('#filter_property_type').val();
                var auction_type_text = 'classic online auction';
                var agent = $('#filter_agent').val();

                if(parseInt(auction_type) == 4){
                    auction_type_text = 'traditional offer';
                }else if(parseInt(auction_type) == 7){
                    auction_type_text = 'highest offer';
                }else if(parseInt(auction_type) == 4){
                    auction_type_text = 'live offer';
                }else{
                    auction_type_text = '';
                }
                var asset_type_text = '';
                if(parseInt(asset_type) == 1){
                    asset_type_text = 'land';
                }else if(parseInt(auction_type) == 2){
                    asset_type_text = 'commercial';
                }else if(parseInt(auction_type) == 3){
                    asset_type_text = 'residential';
                }
                window.location.href = '/admin/listing/?auction_type='+auction_type_text+'&asset_type='+asset_type_text+'&search='+search+'&status='+status+'&page_size='+$('#prop_num_record').val()+'&agent='+agent;

            }else{
                $.growl.error({title: "Bid ", message: response.msg, size: 'large'});
                $('#confirmDeleteLastBidModal').modal('hide');
                $('body').addClass('modal-open');
            }
        }
    });
}
function confirmDeleteLastBid(property_id){

    $('#del_bid_property_id').val(property_id);
    $('#delete_bid_button_section').html('<button type="button" class="btn btn-primary delete_last_bid_btn" id="delete_last_bid_true" onclick="delete_last_bid(\''+property_id+'\')">Yes</button> <button type="button" class="btn btn-primary-bdr delete_last_bid_btn" id="delete_last_bid_false">No</button>');
    $('#confirmDeleteLastBidModal').modal('show');
}
function send_loi_popup(property_id, negotiated_id, user_id){
    $('#loi_property_id').val(property_id);
    $('#loi_negotiated_id').val(negotiated_id);
    $('#loi_user_id').val(user_id);
    $('#sendLoiModal').modal('show');

}

//--------------------------Changed By Gautam---------------------
function confirm_seller_reject_best_offer_detail(property_id,negotiated_id){
    $.ajax({
        url: '/admin/counter-best-offer-details/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {'property_id': property_id,'negotiated_id': negotiated_id},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            var buyer_name = '';
            var buyer_email = '';
            var buyer_phone = '';
            var buyer_address = '';
            var buyer_company = '';
            var agent_name = '';
            var agent_email = '';
            var agent_phone = '';
            var agent_address = '';
//            $('p.error').hide();
//            $("#counter_offer_price_text").html('NA');
//            $("#counter_earnest_deposit_text").html('NA');
//            $("#counter_down_payment_text").html('NA');
//            $("#counter_loan_type_text").html('NA');
//            $("#counter_inspection_contigency_text").html('NA');
//            $("#counter_financing_contigent_ext").html('NA');
//            $("#counter_appraisal_contigency_text").html('NA');
//            $("#counter_sale_contigency_text").html('NA');
//            $("#counter_closing_date_text").html('NA');
//            $("#counter_closing_cost_text").html('NA');
//            $('#counter_offer_price').val('$');
//            if(parseInt(response.data.earnest_deposit_type) == 1){
//                $('#counter_earnest_deposit').attr('maxlength',19);
//                $('#counter_earnest_deposit').val('$');
//            }else{
//                $('#counter_earnest_deposit').attr('maxlength',6).attr('max',100);
//                $('#counter_earnest_deposit').val('');
//            }
//            $('input[name="offer_contingent"]').prop('checked',false);
//            $('input[name="appraisal_contingent"]').prop('checked',false);
//            $('input[name="sale_contingency"]').prop('checked',false);
//            $('input[name="closing_cost"]').prop('checked',false);
//            $('#counter_down_payment').val('$');
//            $('#counter_closing_period').val('');
//            $('#counter_due_diligence').val('');
//            $('#counter_financing').val("");
//            $('#counter_offer_comment').val("");
//            $('#counter_financing').trigger("chosen:updated");
//            $('#counter_closing_period').trigger("chosen:updated");
//            $('#counter_due_diligence').trigger("chosen:updated");
//            var offer_price = '';
//            var due_diligence = '';
//            var earnest_money_deposit = '';
//            var earnest_money_deposit_percent = '';
//            var closing_date = '';
//            var loan_type = '';
//            var down_payment = '';
//            var offer_contingent = '';
//            var appraisal_contingent = '';
//            var closing_cost = '';
//            $("#counter_earnest_deposit_type").val(1);
            //buyer and agent info
            $("#decline_buyer_name").html('NA');
            $("#decline_buyer_email").html('NA');
            $("#decline_buyer_phone").html('NA');
            $("#decline_agent_name").html('NA')
            $("#decline_agent_email").html('NA')
            $("#decline_agent_phone").html('NA')
            $("#decline_agent_address").html('NA')
            if(response.data.behalf_of_buyer == true){
                $("#decline_buyer_company").html('NA').show();
                $("#decline_buyer_address").html('NA').hide();
                $("#decline_agent_info_section").html('NA').show();
            }else{
                $("#decline_buyer_company").html('NA').hide();
                $("#decline_buyer_address").html('NA').show();
                $("#decline_agent_info_section").html('NA').hide();
            }
            if(response.error == 0){
//                $("#counter_best_property_id").val(response.data.property_id);
//                $("#counter_best_negotiated_id").val(response.data.negotiated_id);
//                $("#counter_earnest_deposit_type").val(response.data.earnest_deposit_type);
                if(response.data.offer_price){
                    offer_price = response.data.offer_price;
                    offer_price = numberFormat(offer_price);
                    $("#decline_counter_offer_price_text").html('$'+offer_price);

                }
                if(response.data.earnest_money_deposit){
                    earnest_money_deposit = response.data.earnest_money_deposit;
                    earnest_money_deposit = numberFormat(earnest_money_deposit);
                    earnest_money_deposit_percent = response.data.earnest_money_deposit_percent;
                    $("#decline_counter_earnest_deposit_text").html('$'+earnest_money_deposit+' or '+earnest_money_deposit_percent+' %');
                }
                if(response.data.down_payment){
                    down_payment = response.data.down_payment;
                    down_payment = numberFormat(down_payment);
                    $("#decline_counter_down_payment_text").html('$'+down_payment);
                }
                if(response.data.loan_type){
                    loan_type = response.data.loan_type;
                    $("#decline_counter_loan_type_text").html(loan_type);
                }

                if(response.data.due_diligence){
                    due_diligence = response.data.due_diligence;
                    $("#decline_counter_inspection_contigency_text").html(due_diligence);
                }
                if(response.data.offer_contingent){
                    offer_contingent = response.data.offer_contingent;
                    $("#decline_counter_financing_contigent_ext").html(offer_contingent);
                }
                if(response.data.appraisal_contingent){
                    appraisal_contingent = response.data.appraisal_contingent;
                    $("#decline_counter_appraisal_contigency_text").html(appraisal_contingent);
                }
                if(response.data.sale_contingency){
                    sale_contingency = response.data.sale_contingency;
                    $("#decline_counter_sale_contigency_text").html(sale_contingency);
                }
                if(response.data.closing_cost){
                    closing_cost = response.data.closing_cost;
                    $("#decline_counter_closing_cost_text").html(closing_cost);
                }
                if(response.data.closing_date){
                    closing_date = response.data.closing_date;
                    $("#decline_counter_closing_date_text").html(closing_date);
                }

                if(response.data.behalf_of_buyer == true){
                    if(response.data.buyer_detail_info.first_name){
                        buyer_name = response.data.buyer_detail_info.first_name+' '+response.data.buyer_detail_info.last_name;
                        $('#decline_buyer_name').html(buyer_name);
                    }
                    if(response.data.buyer_detail_info.email){
                        buyer_email = response.data.buyer_detail_info.email;
                        $('#decline_buyer_email').html(buyer_email);
                    }
                    if(response.data.buyer_detail_info.phone_no){
                        buyer_phone = response.data.buyer_detail_info.phone_no;
                        buyer_phone = formatPhoneNumber(buyer_phone);
                        $('#decline_buyer_phone').html(buyer_phone);
                    }
                    $('#decline_buyer_company_section').show();
                    $('#decline_buyer_address_section').hide();
                    $('#decline_buyer_company').show();
                    $('#decline_buyer_address').hide();
                    if(response.data.buyer_detail_info.company){
                        buyer_company = response.data.buyer_detail_info.company;
                        $('#decline_buyer_company').html(buyer_company);
                    }
                    $('.decline_agent_info_section').show();
                    if(response.data.agent_detail_info.first_name){
                        agent_name = response.data.agent_detail_info.first_name+' '+response.data.agent_detail_info.last_name;
                        $('#decline_agent_name').html(agent_name);
                    }
                    if(response.data.agent_detail_info.email){
                        agent_email = response.data.agent_detail_info.email;
                        $('#decline_agent_email').html(agent_email);
                    }
                    if(response.data.agent_detail_info.phone_no){
                        agent_phone = response.data.agent_detail_info.phone_no;
                        agent_phone = formatPhoneNumber(agent_phone);
                        $('#decline_agent_phone').html(agent_phone);
                    }
                    if(response.data.agent_detail_info.address_first){
                        agent_address = response.data.agent_detail_info.address_first+', '+response.data.agent_detail_info.city+', '+response.data.agent_detail_info.state+', '+response.data.agent_detail_info.postal_code;
                        $('#decline_agent_address').html(agent_address);
                    }
                }else{
                    $('.decline_agent_info_section').hide();
                    $('#decline_buyer_company_section').hide();
                    $('#decline_buyer_address_section').show();
                    $('#decline_buyer_company').hide();
                    $('#decline_buyer_address').show();
                    if(response.data.buyer_detail_info.first_name){
                        buyer_name = response.data.buyer_detail_info.first_name+' '+response.data.buyer_detail_info.last_name;
                        $('#decline_buyer_name').html(buyer_name);
                    }
                    if(response.data.buyer_detail_info.email){
                        buyer_email = response.data.buyer_detail_info.email;
                        $('#decline_buyer_email').html(buyer_email);
                    }
                    if(response.data.buyer_detail_info.phone_no){
                        buyer_phone = response.data.buyer_detail_info.phone_no;
                        buyer_phone = formatPhoneNumber(buyer_phone);
                        $('#decline_buyer_phone').html(buyer_phone);
                    }
                    if(response.data.buyer_detail_info.address_first){
                        agent_address = response.data.buyer_detail_info.address_first+', '+response.data.buyer_detail_info.city+', '+response.data.buyer_detail_info.state+', '+response.data.buyer_detail_info.postal_code;
                        $('#decline_buyer_address').html(agent_address);
                    }
                    $('#decline_agent_name').html('NA');
                    $('#decline_agent_email').html('NA');
                    $('#decline_agent_phone').html('NA');
                    $('#decline_agent_address').html('NA');
                }
            }else{
                $.growl.error({title: "Offer ", message: response.msg, size: 'large'});
            }
            // $('#newcounterOfferModal').modal('show');
            $('#newconfirmRejectBestOfferModal').modal('show');
        }
    });
}
function get_declined_history_details(property_id,best_offers_id){
    $.ajax({
        url: '/admin/best-offer-history-details/',
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
        url: '/admin/best-offer-history-details/',
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
function exportBidderList(property_id,current_page){
    var d = new Date();
    var timezone = d.getTimezoneOffset();
    var search = '';
    var status = '';
    if(typeof($('#popup_bidder_popup_search').val()) != 'undefined'){
        search = $('#popup_bidder_popup_search').val();
    }
    if(typeof($('option:selected','#popup_filter_bidder_status').val()) != 'undefined'){
        status = $('option:selected','#popup_filter_bidder_status').val();
    }

    var currpage = current_page;
    var page_size = recordPerpage;

    window.location.href = '/admin/export-bidder-list/?page='+currpage+'&page_size='+recordPerpage+'&search='+search+'&property='+property_id+'&timezone='+timezone+'&status='+status;
}
function delete_bidder_registration(row_id){
    $.ajax({
        url: '/admin/delete-bidder-reg/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {'row_id': row_id},
        beforeSend: function(){
            $('#del_bidder_true').attr('disabled', 'disabled');
            $.blockUI({
                message: '<h4>Please wait!</h4>'
            });
            $('.overlay').show();
        },
        complete: function(){
            $.unblockUI();
            $('#del_bidder_true').removeAttr('disabled');
            $('.overlay').hide();
        },
        success: function(response){
            //$('.overlay').hide();
            if(response.error == 0){
                $('#confirmPropertyBidderDeleteModal').modal('hide');
                var auction_type = 1;
                if(response.data.data.auction_type){
                    auction_type = response.data.data.auction_type;
                }
                try{
                   custom_response = {
                    'site_id': site_id,
                    'user_id': $('#confirmPropertyBidderDeleteModal #UserId').val(),
                    'property_id': $('#confirmPropertyBidderDeleteModal #propertyId').val(),
                    'auction_id': $('#confirmPropertyBidderDeleteModal #auctionId').val(),
                    'auction_type': auction_type,
                  };
                    customCallBackFunc(update_bidder_socket, [custom_response]);
                }catch(ex){
                    //console.log(ex);
                }
                $('#confirmPropertyBidderDeleteModal #UserId').val('');
                $('#confirmPropertyBidderDeleteModal #propertyId').val('');
                $('#confirmPropertyBidderDeleteModal #auctionId').val('');
                var property_id = $('#popup_property_id').val();
                propertyBidderListingSearch(property_id, 1, '');
                $.growl.notice({title: "Bidder Registration ", message: 'Deleted successfully', size: 'large'});
            }else{
               $.growl.error({title: "Bidder Registration ", message: 'some error occurs, please try again', size: 'large'});
            }
        }
    });
}
function close_delete_bidder(){
    $('#confirmPropertyBidderDeleteModal #UserId').val('');
    $('#confirmPropertyBidderDeleteModal #propertyId').val('');
    $('#confirmPropertyBidderDeleteModal #auctionId').val('');
    $('#del_bidder_true').removeAttr('rel_id');
    $('#del_bidder_true').removeAttr('onclick');
    $('#del_bidder_false').removeAttr('rel_id');
    $('#del_bidder_false').removeAttr('onclick');
    $('#confirmPropertyBidderDeleteModal').modal('hide');
    return false;
}

function calculate_insider_dates(params){
    var actualStartDate = params.actualStartDate;
    var value = params.add_min;
    var virtual_element = params.date_virtual_element_id;
    var local_element = params.date_local_element_id;
    var utc_element = params.date_utc_element_id;
    var end_date = new Date(actualStartDate);
    var myTimeStamp = end_date.setTime(end_date.getTime() + (value * 60 * 1000));

    var dateX = new Date(myTimeStamp);
    var dateY = new Date();
    date = new Date(dateX.getTime());
    var fullyear = date.getFullYear();
    var mts = date.getMonth()+1;
    var month_num = (mts < 10)?'0'+mts:mts;
    var dt = (date.getDate() < 10)?'0'+date.getDate():date.getDate();
    var hr = (date.getHours() < 10)?'0'+date.getHours():date.getHours();
    var mins = (date.getMinutes() < 10)?'0'+date.getMinutes():date.getMinutes();

    var timeStp = month_num+'-'+dt+'-'+fullyear;
    var timeStp_new_format = fullyear+'-'+month_num+'-'+dt;
    var mer = (parseInt(hr) >= 12)?'PM':'AM';
        hrs = parseInt(hr) % 12;
        hrs = (hrs)?hrs:12;
    var virtual_endtimeStp = timeStp+' '+hrs+':'+mins+' '+mer;
    var endtimeStp = timeStp_new_format+' '+hrs+':'+mins+' '+mer;
    var endtimeStp_local = timeStp_new_format+' '+hr+':'+mins+':00';
    var utc_end_date = convert_to_utc_datetime(endtimeStp_local, 'datetime');
    $(virtual_element).val(virtual_endtimeStp);
    $(local_element).val(endtimeStp_local);
    $(utc_element).val(utc_end_date);
}

function convert_insider_auction_date(){
    try{
        if($('#virtual_dutch_bidding_start_date').val() == ""){
            try{
                var dutch_bidding_start_date = $('#dutch_bidding_start_date').val();
                var virtual_date = getLocalDate(dutch_bidding_start_date, 'mm-dd-yyyy','ampm');
                $('#virtual_dutch_bidding_start_date').val(virtual_date);
            }catch(ex){
                console.log(ex);
            }
        }
        var virtual_date_element = 'virtual_dutch_bidding_start_date';
          var date_element = 'dutch_bidding_start_date';
          var dates = $("#"+virtual_date_element).val();
           var auction_type = $('option:selected','#auction_type').val();
          if(dates != ""){
            var actualStartDate = dates.split(" ");
            //new lines
            var mdy_format = actualStartDate[0].split("-");

            mdy_date = mdy_format[2]+"-"+mdy_format[0]+"-"+mdy_format[1];

            actualStartDate = mdy_date+' '+convert_to_24h(actualStartDate[1]+' '+actualStartDate[2]);

            //actualStartDate = actualStartDate[0]+' '+convert_to_24h(actualStartDate[1]+' '+actualStartDate[2]);
            //var utc_date = convert_to_utc_datetime(actualStartDate);
            var utc_date = convert_to_utc_datetime(actualStartDate, 'datetime');

            $("#"+date_element+"_local").val(actualStartDate);
            $("#"+date_element).val(utc_date);

            var dutch_auction_time = $('#property_info_frm #dutch_auction_time').val();
            var dutch_pause_time = $('#property_info_frm #dutch_pause_time').val();
            var sealed_auction_time = $('#property_info_frm #sealed_auction_time').val();
            var sealed_pause_time = $('#property_info_frm #sealed_pause_time').val();
            var english_auction_time = $('#property_info_frm #english_auction_time').val();
            if(dutch_auction_time != "" && actualStartDate != ""){
                try{
                   custom_response = {
                    'add_min': dutch_auction_time,
                    'actualStartDate': actualStartDate,
                    'date_virtual_element_id': '#virtual_dutch_bidding_end_date',
                    'date_local_element_id': '#dutch_bidding_end_date_local',
                    'date_utc_element_id': '#dutch_bidding_end_date',
                  };
                  customCallBackFunc(calculate_insider_dates, [custom_response]);
                }catch(ex){
                    //console.log(ex);
                }
            }
            $("#dutch_bidding_start_date_local").val(actualStartDate);
            $("#dutch_bidding_start_date").val(utc_date);
            var dutch_end_date = $('#dutch_bidding_end_date_local').val();
            if(dutch_pause_time != "" && dutch_end_date != ""){
                try{
                   custom_response = {
                    'add_min': dutch_pause_time,
                    'actualStartDate': dutch_end_date,
                    'date_virtual_element_id': '#virtual_sealed_bidding_start_date',
                    'date_local_element_id': '#sealed_bidding_start_date_local',
                    'date_utc_element_id': '#sealed_bidding_start_date',
                  };
                  customCallBackFunc(calculate_insider_dates, [custom_response]);
                }catch(ex){
                    //console.log(ex);
                }
            }
            var sealed_start_date = $('#sealed_bidding_start_date_local').val();
            if(sealed_auction_time != "" && sealed_start_date != ""){
                try{
                   custom_response = {
                    'add_min': sealed_auction_time,
                    'actualStartDate': sealed_start_date,
                    'date_virtual_element_id': '#virtual_sealed_bidding_end_date',
                    'date_local_element_id': '#sealed_bidding_end_date_local',
                    'date_utc_element_id': '#sealed_bidding_end_date',
                  };
                  customCallBackFunc(calculate_insider_dates, [custom_response]);
                }catch(ex){
                    //console.log(ex);
                }
            }
            var sealed_end_date = $('#sealed_bidding_end_date_local').val();
            if(sealed_pause_time != "" && sealed_end_date != ""){
                try{
                   custom_response = {
                    'add_min': sealed_pause_time,
                    'actualStartDate': sealed_end_date,
                    'date_virtual_element_id': '#virtual_english_bidding_start_date',
                    'date_local_element_id': '#english_bidding_start_date_local',
                    'date_utc_element_id': '#english_bidding_start_date',
                  };
                  customCallBackFunc(calculate_insider_dates, [custom_response]);
                }catch(ex){
                    //console.log(ex);
                }
            }
            var english_start_date = $('#english_bidding_start_date_local').val();
            if(english_auction_time != "" && english_start_date != ""){
                try{
                   custom_response = {
                    'add_min': english_auction_time,
                    'actualStartDate': english_start_date,
                    'date_virtual_element_id': '#virtual_english_bidding_end_date',
                    'date_local_element_id': '#english_bidding_end_date_local',
                    'date_utc_element_id': '#english_bidding_end_date',
                  };
                  customCallBackFunc(calculate_insider_dates, [custom_response]);
                }catch(ex){
                    //console.log(ex);
                }
            }
            custom_param = {
                'date_element_local': "#"+date_element+"_local",
                'date_element': "#"+date_element,
                'element_local_val': actualStartDate,
                'element_utc_val': utc_date,
            };
            customCallBackFunc(set_insider_ductch_dates, [custom_param]);

          }
    }catch(ex){

    }

}

function set_insider_ductch_dates(params){
    var date_element_local = params.date_element_local;
    var date_element = params.date_element;
    var element_local_val = params.element_local_val;
    var element_utc_val = params.element_utc_val;
    $(date_element_local).val(element_local_val);
    $(date_element).val(element_utc_val);
}
function show_input_slider(x)
{
    $("#price_decrease_rate_value").html(x+' %');
}
function add_slider_value(el)
{
    var el_id = $(el).attr('data-id');
    var el_max = parseInt($(el).attr('data-max'));
    var el_val = 0;
    if($("#"+el_id).val() != ""){
        el_val = parseInt($("#"+el_id).val());
    }
    if(el_val < el_max){
        el_val = el_val + 1;
        $("#"+el_id).val(el_val);
        if(el_id == 'price_decrease_rate'){
            $("#"+el_id+"_value").html(el_val+' %');
            if($('#insider_start_price').val() != "" && $('#insider_start_price').val() != "$"){
                var start_price = parseFloat($('#insider_start_price').val().replace('$','').replace(/,/g, ''));
                var decrease_rate = parseFloat($('#price_decrease_rate').val());
                var decrease_value = (start_price - ((start_price*decrease_rate)/100));
                decrease_value = decrease_value.toFixed(2);
                if(decrease_value > parseInt(decrease_value)){
                    decrease_value = numberFormat(decrease_value);
                }else{
                    decrease_value = numberFormat(parseInt(decrease_value));
                }
                $('#price_decrease_value').html('$'+decrease_value);
            }
        }else{
            $("#"+el_id+"_value").html(el_val+' Min');
            if($('#virtual_dutch_bidding_start_date').val() != ""){
                convert_insider_auction_date();
            }
        }
    }
}
function subtract_slider_value(el)
{
    var el_id = $(el).attr('data-id');
    var el_val = 0;
    if($("#"+el_id).val() != ""){
        var el_val = parseInt($("#"+el_id).val());
    }
    if(el_val > 0){
        el_val = el_val - 1;
        $("#"+el_id).val(el_val);
        if(el_id == 'price_decrease_rate'){
            $("#"+el_id+"_value").html(el_val+' %');
            if($('#insider_start_price').val() != "" && $('#insider_start_price').val() != "$"){
                var start_price = parseFloat($('#insider_start_price').val().replace('$','').replace(/,/g, ''));
                var decrease_rate = parseFloat($('#price_decrease_rate').val());
                var decrease_value = (start_price - ((start_price*decrease_rate)/100));
                decrease_value = decrease_value.toFixed(2);
                if(decrease_value > parseInt(decrease_value)){
                    decrease_value = numberFormat(decrease_value);
                }else{
                    decrease_value = numberFormat(parseInt(decrease_value));
                }
                $('#price_decrease_value').html('$'+decrease_value);
            }
        }else{
            $("#"+el_id+"_value").html(el_val+' Min');
            if($('#virtual_dutch_bidding_start_date').val() != ""){
                convert_insider_auction_date();
            }

        }
    }
}
function add_auction_time_value(el)
{
    var el_id = $(el).attr('data-id');
    var el_max = parseInt($(el).attr('data-max'));
    var el_val = 10;
    if($("#"+el_id).val() != ""){
        el_val = parseInt($("#"+el_id).val());
    }
    if(el_val < el_max){
        el_val = el_val + 1;
        $("#"+el_id).val(el_val);
        $("#"+el_id+"_value").html(el_val+' Min');
        if($('#virtual_dutch_bidding_start_date').val() != ""){
            convert_insider_auction_date();
        }
    }
}
function subtract_auction_time_value(el)
{
    var el_id = $(el).attr('data-id');
    var el_val = 10;
    if($("#"+el_id).val() != ""){
        var el_val = parseInt($("#"+el_id).val());
    }
    if(el_val > 10){
        el_val = el_val - 1;
        $("#"+el_id).val(el_val);
    }
    $("#"+el_id+"_value").html(el_val+' Min');
    if($('#virtual_dutch_bidding_start_date').val() != ""){
        convert_insider_auction_date();
    }
}
function propertyInsiderBidHistorySearch(property_id, current_page, insider_step){
    $('#insiderBidHistoryPropertyId').val(property_id);
    var currpage = current_page;
    var search = $('#insider_search_bid_history').val();
    $.ajax({
        url: '/admin/insider-property-bid-history/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {'page': currpage, 'page_size': recordPerpage, 'property_id': property_id, 'search': search, 'step': insider_step},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            $("#insiderBidHistoryPaginationList").empty();
            $("#dutchBiddingList").empty();
            $("#sealedBiddingList").empty();
            $("#englishBiddingList").empty();
            $("#insiderBidHistoryPropertyName").empty();
            // $("#bidHistoryPropertyLink").attr("href", '/asset-details/?property_id='+property_id);
            if(response.property_image != ""){
                $("#insiderBidHistoryPropertyImage").attr('src', response.property_image);
            }else {
                $("#insiderBidHistoryPropertyImage").attr('src', '/static/admin/images/property-default-img.png');
            }
            if(response.property_address != ""){
                $('#insiderBidHistoryPropertyName').html('<a href="/asset-details/?property_id='+property_id+'" id="bidHistoryPropertyLink" target="_blank">'+response.property_address+'</a> <span><i class="fas fa-map-marker-alt"></i> '+response.property_city+', '+response.property_state+' '+response.property_postal_code+'</span>');
            }
            /*if(response.auction_type){
                $('#bidHistoryAuctiontype').html(response.auction_type)
            }
            if(response.bid_increment){
                $('#bidHistoryBidIncrement').html('$' + response.bid_increment)
            }*/
            $('#insider_tab_li_content').html('<li class="tab-link insider_tab_link" data-tab="round-1" id="insider_dutch_btn_li"><a href="javascript:void(0)" id="insider_dutch_btn" onclick="propertyInsiderBidHistorySearch(\''+response.property_id+'\',1,\'dutch\')">Round 1 : Dutch Auction</a></li><li class="tab-link insider_tab_link" data-tab="round-2" id="insider_sealed_btn_li"><a href="javascript:void(0)" id="insider_sealed_btn" onclick="propertyInsiderBidHistorySearch(\''+response.property_id+'\',1,\'sealed\')">Round 2 : Sealed Bid Amount</a></li><li class="tab-link insider_tab_link" data-tab="round-3" id="insider_english_btn_li"><a href="javascript:void(0)" id="insider_english_btn" onclick="propertyInsiderBidHistorySearch(\''+response.property_id+'\',1,\'english\')">Round 3 : English Auction</a></li>');
            if(response.error == 0){
                $('.insider_tab_link').removeClass('current');
                $('.insider_tab_content').removeClass('current');
                if(response.step == 'dutch'){
                    $("#insider_auction_name").html('Insider Dutch Auction');
                    $('#insider_dutch_btn_li').addClass('current');
                    $('#round-1').addClass('current');
                    $("#dutchBiddingList").html(response.bid_history_html);

                }else if(response.step == 'sealed'){
                    $("#insider_auction_name").html('Sealed Bid Auction');
                    $('#insider_sealed_btn_li').addClass('current');
                    $('#round-2').addClass('current');
                    $("#sealedBiddingList").html(response.bid_history_html);

                }else if(response.step == 'english'){
                    $("#insider_auction_name").html('English Auction');
                    $('#insider_english_btn_li').addClass('current');
                    $('#round-3').addClass('current');
                    $("#englishBiddingList").html(response.bid_history_html);

                }else{
                    $("#insider_auction_name").html('Insider Dutch Auction');
                    $('#insider_dutch_btn_li').addClass('current');
                    $('#round-1').addClass('current');
                    $("#dutchBiddingList").html(response.bid_history_html);

                }

                $("#insiderBidHistoryPaginationList").html(response.pagination_html);
            }else{
                $('.insider_tab_link').removeClass('current');
                $('.insider_tab_content').removeClass('current');
                if(response.step == 'dutch'){
                    $("#insider_auction_name").html('Insider Dutch Auction');
                    $('#insider_dutch_btn_li').addClass('current');
                    $('#round-1').addClass('current');
                    $('#dutchBiddingList').html('<div class="text-center text-danger" style="width:100%;"><img src="static/theme-1/images/property-not-avail.png" class=" center mb0" /></div>');
                }else if(response.step == 'sealed'){
                    $("#insider_auction_name").html('Sealed Bid Auction');
                    $('#insider_sealed_btn_li').addClass('current');
                    $('#round-2').addClass('current');
                    $('#sealedBiddingList').html('<div class="text-center text-danger" style="width:100%;"><img src="static/theme-1/images/property-not-avail.png" class=" center mb0" /></div>');
                }else if(response.step == 'english'){
                    $("#insider_auction_name").html('English Auction');
                    $('#insider_english_btn_li').addClass('current');
                    $('#round-3').addClass('current');
                    $('#englishBiddingList').html('<div class="text-center text-danger" style="width:100%;"><img src="static/theme-1/images/property-not-avail.png" class=" center mb0" /></div>');
                }else{
                    $("#insider_auction_name").html('Insider Dutch Auction');
                    $('#insider_dutch_btn_li').addClass('current');
                    $('#round-1').addClass('current');
                    $('#dutchBiddingList').html('<div class="text-center text-danger" style="width:100%;"><img src="static/theme-1/images/property-not-avail.png" class=" center mb0" /></div>');
                }

                $("#insiderBidHistoryPaginationList").hide();
            }
            var search_bid_history = $('#insider_search_bid_history').val();
            if(typeof(response.total) != 'undefined' && response.total){
                $('#insider_bid_history_search_section').html('<div class="block right"><form action="" class="search-field"><div class="search-icon"><i class="fas fa-search"></i></div><input type="text" name="insider_search_bid_history" id="insider_search_bid_history" class="form-control" value="'+search_bid_history+'"><button type="button" id="bid_history_search_btn" class="btn btn-gray btn-sm pl20" onclick="propertyInsiderBidHistorySearch(\''+response.property_id+'\',1,\''+response.step+'\')">Search</button></form></div><div class="block last"><button type="button" class="btn btn-primary btn-sm pl20" onClick="exportInsiderBidHistory(\''+response.property_id+'\',\''+response.page+'\',\''+response.step+'\')"><i class="fas fa-file-export"></i> Export</button></div><div class="clearfix"></div>');
            }else{
                $('#insider_bid_history_search_section').html('<div class="block right"><form action="" class="search-field"><div class="search-icon"><i class="fas fa-search"></i></div><input type="text" name="insider_search_bid_history" id="insider_search_bid_history" class="form-control" value="'+search_bid_history+'"><button type="button" id="bid_history_search_btn" class="btn btn-gray btn-sm pl20" onclick="propertyInsiderBidHistorySearch(\''+response.property_id+'\',1,\''+response.step+'\')">Search</button></form></div><div class="block last"><button type="button" class="btn btn-primary btn-sm pl20" onClick="exportInsiderBidHistory(\''+response.property_id+'\',\''+response.page+'\',\''+response.step+'\')"><i class="fas fa-file-export"></i> Export</button></div>');
            }
            $("#dutchBiddingList").find('script').remove();
            $("#sealedBiddingList").find('script').remove();
            $("#englishBiddingList").find('script').remove();
            $('#insiderbidderrecordModal').modal('show');
        }
    });
}

//$(document).on('click', '.show-detailed-info', function(e){
$(document).on('click', '.bid_total_data', function(e){
    e.preventDefault();
    e.stopPropagation();
//    listing_id = $(this).attr("data-id");
//    element = $("#bidding-record-data" + listing_id)
//    if (element.is(":visible")){
//        element.hide(1000);
//        $('#arrowPositionBidder' + listing_id).removeClass('fa-chevron-up').addClass('fa-chevron-down');
//    } else{
//        element.show(1000);
//        $('#arrowPositionBidder' + listing_id).removeClass('fa-chevron-down').addClass('fa-chevron-up');
//    }
})

function show_hide_data(listing_id){
    element = $("#bidding-record-data" + listing_id);
    if (element.is(":visible")){
        element.hide(1000);
        $('#arrowPositionBidder' + listing_id).removeClass('fa-chevron-up').addClass('fa-chevron-down');
    } else{
        element.show(1000);
        $('#arrowPositionBidder' + listing_id).removeClass('fa-chevron-down').addClass('fa-chevron-up');
    }
}

$(document).on('click', '.show-bidder-info', function(e){
    alert(2222);
    e.preventDefault();
    e.stopPropagation();
    user_id = $(this).attr("data-id");
    //element = $("#showBidderinfoBidder" + user_id)
    element = $("#bidding-record-data" + user_id)
    if (element.is(":visible")){
        element.hide(1000);
        $('#arrowPositionBidder' + user_id).removeClass('fa-chevron-up').addClass('fa-chevron-down');
    } else{
        element.show(1000);
        $('#arrowPositionBidder' + user_id).removeClass('fa-chevron-down').addClass('fa-chevron-up');
    }
})

function send_message_to_agent(){
    var user_message = $("#chat_message_input").val();
    var agent_id = $("#agent_id").val();
    $.ajax({
        url: '/admin/send-message-to-agent/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: { 'agent_id': agent_id, 'user_message': user_message},
        beforeSend: function(){
            $('.overlay').show();
        },
        complete: function(){
             $('.overlay').hide();
             $("#chat_message_input").val("");
             $("#send_msg_to_agent_validation").attr("disabled", "disabled");
        },
        success: function(response){
            //$('.overlay').hide();
            if (response.error == 0 || response.status == 200) {
                window.setTimeout(function () {
                    $.growl.notice({title: "Message To Agent", message: response.msg, size: 'large'});
                }, 0);
            } else {
                $("#emailrecordModal").modal("show");
                window.setTimeout(function () {
                    $.growl.error({title: "Message To Agent", message: response.msg, size: 'large'});
                }, 0);
            }
        }
    });
}

function send_msg_to_agent_validation(){
 msg = $("#chat_message_input").val();
 if (msg){
    $("#send_msg_to_agent_validation").removeAttr("disabled");
 }else{
    $("#send_msg_to_agent_validation").attr("disabled", "disabled");
 }
}

function agent_chat_detail(agent_id){
    $("#agent_id").val(agent_id);
}


function state_list_update(){
   country_id = $("#prop_country").val();
   csrf_token = $('input[name="csrfmiddlewaretoken"]').val();
   if (country_id){
        $.ajax({
            url: '/admin/state-list/',
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
                    $('#property_state').empty();
                    $('#property_state').append("<option value=''>Select</option>");
                    $.each( state_lists, function( key, value ) {
                        $('#property_state').append("<option value="+value.id+" data-short-code="+value.iso_name+">"+value.state_name+"</option>");
                    });
                    $('#property_state').trigger("chosen:updated");
                }

            }
        });
   }else{
        $('#property_state').empty().append("<option value=''>Select</option>");
        $('#property_state').trigger("chosen:updated");
   }

}

$("#prop_country").change(function(){
    $("#property_state").empty().append("<option value=''>Select</option>");
    $("#property_address_one").val("");
    $("#property_zip_code").val("");
    $("#property_city").val("");
    state_list_update();
});

//if (! $(".asset_type_radio").prop("checked")) {
//   setTimeout(function(){
//    $("#asset_type_3").click();
//   }, 1000);
//}


// ---------------Bulk Upload-------------

$("#bulk_upload").on('change', function(){
    if($(this).val() != "") {
        var fileExtension = ['csv'];
        if ($.inArray($(this).val().split('.').pop().toLowerCase(), fileExtension) == -1) {
            //alert("Only formats are allowed : "+fileExtension.join(', '));
            $.growl.error({title: "CSV", message: "Only formats are allowed : "+fileExtension.join(', '), size: 'large'});
            return false;
        }

        if (this.files[0].size < 21){
            //alert("File should be greater than 600 Byte.");
            $.growl.error({title: "CSV", message: "File should be greater than 600 Byte.", size: 'large'});
            return false;
        }

        fileUrl = $('#bulk_upload')[0].files[0].name
        console.log(fileUrl);
        var form_data = new FormData();
        form_data.append('bulk_upload', $('#bulk_upload')[0].files[0]);
        form_data.append("csrfmiddlewaretoken", $('input[name="csrfmiddlewaretoken"]').val());
        console.log(form_data);
        $.ajax({
            url: '/admin/upload-csv/',
            type: "POST",
            processData: false,
            contentType: false,
            cache: false,
            data: form_data,
            enctype: 'multipart/form-data',
            beforeSend: function(){
                $('.overlay').show();
            },
            success: function(msg){
                $('.overlay').hide();
                if(msg.status == 200){
                    $.growl.notice({title: "CSV ", message: "CSV Successfully Uploaded.", size: 'large'});
                    setTimeout(function(){
                        window.location.reload();
                    }, 2000);
                }else{
                    $.growl.error({title: "CSV", message: msg.msg, size: 'large'});
                }
            },
            error: function(){
                $('.overlay').hide();
            },
            complete:function(jqXhr){
                $('.overlay').hide();
            }
        });
    }
});