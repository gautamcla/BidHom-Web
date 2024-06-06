var y = null;
var z = null;
var check_date = null;
var today_date = new Date().getTime();
var socket_start_date = countDownDate;
var socket_end_date = countDownEndDate;
var socket_dutch_end_date = countDownDutchEndDate;
var socket_sealed_start_date = countDownSealedStartDate;
var socket_sealed_end_date = countDownSealedEndDate;
var socket_english_start_date = countDownEnglishStartDate;
var dutch_winning_amount_formatted = 0;

var decresed_amount = 0;
var flash_time_sec = 0;
var flash_time_milisec = 0;
var show_close_alert = true;
var check_flash_time = null;
var check_ending = null;
var check_dutch_start = null;
var check_dutch_end = null;
var check_sealed_start = null;
var check_sealed_end = null;
var check_english_start = null;
var check_price_decrease = null;
var counter_ending = 0;
var counter_end = 0;
var counter_dutch_start = 0;
var counter_dutch_end = 0;
var counter_sealed_start = 0;
var counter_sealed_end = 0;
var counter_english_start = 0;
var counter_starting = 0;
var counter_round_two_modal = 0;
var auction_status_id = auction_status_id;
var listing_status_id = listing_status_id;
var listing_status_name = '';
var closing_status_name = '';
const socket = io.connect(socket_domain, {
    transports: ["websocket", "xhr-polling", "htmlfile", "jsonp-polling"],
    rejectUnauthorized: false,
    requestCert: false,
});
// console.log("-----------");
// console.log(socket_domain);
// console.log(socket);
window.onbeforeunload = function(e){
    socket.emit("removePropertyWatcher", {"user_id":session_user_id, "property_id": property_id});
};
$(document).ready(function(){
// -------------------Socket call----------------
socket.emit("propertyWatcher", {"user_id":session_user_id, "property_id": property_id});
socket.on('propertyWatcher',function(data) {
    //console.log("===============");
    //console.log(data);
});
// Check bid amount at user end
if(parseInt(asset_sale_type) == 1){
    socket.emit("checkBid", {"user_id":session_user_id, "property_id": property_id, "auction_id": auction_id, "domain_id": site_id});
    //socket.emit("checkMyBid", {"user_id":session_user_id, "property_id": property_id, "auction_id": auction_id, "domain_id": site_id});
  socket.on('checkBid',function(data) {
    var res_user_id = '';
    var log_user_id = '';
    console.log(data);
    if(typeof(data.user_id) != "undefined" && data.user_id != ""){
        res_user_id = parseInt(data.user_id);
    }
    if(session_user_id != ""){
        log_user_id = parseInt(session_user_id);
    }
    if(typeof(data.data) != 'undefined' && data.data && (res_user_id == log_user_id || (res_user_id == '' && log_user_id == ''))){
        try{
           var start_bid = 0;
           var next_bid = 0;
           var start_bid_formated = 0;
           var next_bid_formated = 0;
           if(typeof(data.data.high_bid_amt) != "undefined" && data.data.high_bid_amt != null){
            start_bid = data.data.high_bid_amt;
            next_bid = parseInt(start_bid)+parseInt(data.data.bid_increments);
           }else{
            start_bid = data.data.start_price;
            next_bid = start_bid;
           }
           if(start_bid > parseInt(start_bid)){
            start_bid_formated = numberFormat(start_bid);
           }else{
            start_bid_formated = numberFormat(parseInt(start_bid));
           }
           if(next_bid > parseInt(next_bid)){
            next_bid_formated = numberFormat(next_bid);
           }else{
            next_bid_formated = numberFormat(parseInt(next_bid));
           }
           if(data.data.bid_increments > parseInt(data.data.bid_increments)){
            bid_increments = numberFormat(data.data.bid_increments);
           }else{
            bid_increments = numberFormat(parseInt(data.data.bid_increments));
           }
           if(typeof(data.data.listing_status_name) != 'undefined' && data.data.listing_status_name != null){
            listing_status_name = data.data.listing_status_name;
           }
           if(typeof(data.data.closing_statuss_name) != 'undefined' && data.data.closing_statuss_name != null){
            closing_status_name = data.data.closing_statuss_name;
           }
           var is_approved = 0;
           var is_reviewed = false;
           var is_registered = "False";
           var registration_approved = "False";
           auction_status_id = data.data.auction_status;
           listing_status_id = data.data.listing_status_id;
           if(typeof(data.data.is_approved) != 'undefined'){
               is_approved = data.data.is_approved;
           }
           if(typeof(data.data.is_reviewed) != 'undefined'){
               is_reviewed = data.data.is_reviewed;
           }
           $('#bidNowFrm').html('<a href="javascript:void(0)" class="symbol minus-icon" onclick="decrement_bid(\''+data.data.bid_increments+'\')"><i class="fas fa-minus"></i></a><input type="text" name="new_bid_amt" id="new_bid_amt"  placeholder="Enter your bid" class="form-control" value="$'+next_bid_formated+'" maxlength="12"><a href="javascript:void(0)" class="symbol plus-icon" onclick="increment_bid(\''+data.data.bid_increments+'\')"><i class="fas fa-plus"></i></a>');
           if(is_approved == 0){
            is_registered = "False"
            registration_approved = "False"
           }else if((is_approved == 2 && is_reviewed == true)){
            is_registered = "True"
            registration_approved = "True"
           }else{
            is_registered = "True"
            registration_approved = "False"
           }
           var today = new Date().getTime();
           var start_date_time = 0;
            var end_date_time = 0;
            socket_start_date = null;
            socket_end_date = null;
           if(typeof(data.data.start_date) != 'undefined'){
            var new_start_date = getLocalDate(data.data.start_date, 'm j, Y','');
            start_date_time = new Date(new_start_date).getTime();
            socket_start_date = start_date_time;
           }
           if(typeof(data.data.end_date) != 'undefined'){
            var new_end_date = getLocalDate(data.data.end_date, 'm j, Y','');
            end_date_time = new Date(new_end_date).getTime();
            socket_end_date = end_date_time;
           }
            $('#bidNowFormSection').hide();
            $('#preFinalBiddingSection').show();
            $('#preFinalBiddingSection_bid_count').show();
            $('#finalBiddingSection').hide();
            $('#finalBiddingSection_bid_count').hide();
            $('#finalBiddingLostSection').hide();
            $('#finalBiddingLostSection_bid_count').hide();
            //changing reserve met text on behalf of setting at different level
            if((typeof(data.data.show_reserve_not_met) != 'undefined' && (data.data.show_reserve_not_met == true || data.data.show_reserve_not_met == false))){
                //check setting at listing level
                var show_reserve_not_met = data.data.show_reserve_not_met;
            }else if((typeof(data.data.agent_reserve_not_met) != 'undefined' && (data.data.agent_reserve_not_met == true || data.data.agent_reserve_not_met == false))){
                //check setting at agent level
                var show_reserve_not_met = data.data.agent_reserve_not_met;
            }else if((typeof(data.data.global_reserve_not_met) != 'undefined' && (data.data.global_reserve_not_met == true || data.data.global_reserve_not_met == false))){
                //check setting at global level
                var show_reserve_not_met = data.data.global_reserve_not_met;
            }else{
                var show_reserve_not_met = false;
            }
            if(show_reserve_not_met){
                if(typeof(data.data.reserve_amount) != 'undefined' && (data.data.reserve_amount == '' || data.data.reserve_amount == null)){
                    $('#reserve_text_span').removeClass('badge-success').addClass('badge-danger').html('No Reserve');
                    //$('#reserve_text_block').html('1. At the conclusion of the auction the Highest Bid will be sent to the seller for approval. <br>2. Sells to the highest bidder. Not subject to seller approval.');
                    $('#reserve_text_block').html('At the conclusion of the auction the Highest Bid will be sent to the seller for approval.');
                    $('#reserve_text_span').parent().show();
                    $('#reserve_text').show();
                }else if(parseInt(data.data.high_bid_amt) >= parseInt(data.data.reserve_amount)){
                    $('#reserve_text_span').removeClass('badge-danger').addClass('badge-success').html('Reserve Met');
                    $('#reserve_text_block').html('Sells to the highest bidder. Not subject to seller approval.');
                    $('#reserve_text_span').parent().show();
                    $('#reserve_text').show();
                }else{
                    if(today >= start_date_time && is_registered == 'True'){
                        $('#reserve_text_span').removeClass('badge-success').addClass('badge-danger').html('Reserve Not Met');
                        $('#reserve_text_block').html('The reserve price is confidential and will not be shown. Once the reserve price is met it will be displayed. At the conclusion of the auction, the seller may negotiate with the bidders if the reserve price isn’t met.');
                        $('#reserve_text_span').parent().show();
                        $('#reserve_text').show();
                    }
                }
            }else{
                if(today >= start_date_time && today <= end_date_time  && is_approved == 2 && is_reviewed == true){
                    $('#reserve_text_span').removeClass('badge-success').addClass('badge-danger').html('No Reserve');

                    //$('#reserve_text_block').html('1. At the conclusion of the auction the Highest Bid will be sent to the seller for approval. <br>2. Sells to the highest bidder. Not subject to seller approval.');
                    $('#reserve_text_block').html('At the conclusion of the auction the Highest Bid will be sent to the seller for approval.');
                    $('#reserve_text_span').parent().show();
                    $('#reserve_text').show();
                }
            }
            //$('#registerBidBtn').addClass('btn-secondary').removeClass('btn-primary-bdr').removeClass('approval_pending');
           if(session_user_id){
             //when user logged in and asset type is not 4 and 7
            if(parseInt(asset_sale_type) != 4 && parseInt(asset_sale_type) != 7){
                if(typeof(data.data.listing_status_id) != 'undefined' && data.data.listing_status_id != null  && data.data.auction_status == 1 && data.data.listing_status_id == 1){
                    if((today >= start_date_time && today <= end_date_time && is_approved == 1 && (is_reviewed == false || is_reviewed == true)) || (today < start_date_time && is_approved == 1 && (is_reviewed == false || is_reviewed == true)) || (today < start_date_time && is_approved == 2 && is_reviewed == false) || (today >= start_date_time && today <= end_date_time && is_approved == 2 && is_reviewed == false)){
                        //when bidding started and registraton approval in pending state
                        $("#bidding_heading_text").html('Classic Online Auction <div class="tooltipPop"><i class="fas fa-info-circle"></i></div>');
                        response = asset_details_conversation_start_end_date(data_start_date, data_end_date);
                        $('#auction_start_end_date').html(response).show();
                        $('#registerBidBtn').html('You are registered to bid. <strong>Approval Pending</strong>').css('cursor','initial');
                        //$('#registerBidBtn').addClass('approval_pending').addClass('btn-primary-bdr').removeClass('btn-secondary');
                        $('#registerBidBtn').show();
                        $('#registerBidBtn').attr('href','javascript:void(0)');
                        $('#bidder_msg_section').hide();
                    }else if(is_approved == 3 || is_approved == 4){
                        //when registration declined
                        if(is_approved == 3){
                            $('#registerBidBtn').html('Registration Declined').css('cursor','initial');
                        }else{
                            $('#registerBidBtn').html('Not Interested').css('cursor','initial');
                        }
                        $('#registerBidBtn').show();
                        $('#registerBidBtn').attr('href','javascript:void(0)');
                        $('#bidder_msg_section').hide();
                    }else if(today >= start_date_time && today <= end_date_time  && is_approved == 2 && is_reviewed == true){
                        //when bidding started and registraton approved
                        $("#bidding_heading_text").html('Classic Online Auction <div class="tooltipPop"><i class="fas fa-info-circle"></i></div>');
                        response = asset_details_conversation_start_end_date(data_start_date, data_end_date);
                        $('#auction_start_end_date').html(response).show();
                        $('#bidNowFormSection').show();
                        $('#registerBidBtn').hide();
                        $('#registerBidBtn').attr('href','javascript:void(0)');
                        if(typeof(data.data.my_max_bid_val) != 'undefined' && data.data.my_max_bid_val){
                            $('#registerBidBtnNew').hide();
                            $(".login_with_not_start").hide();
                            $(".bidding_end_date .month_date_year").html(month_date_year(data.data.end_date));
                            $(".bidding_end_date").show();
                            if(data.data.my_max_bid_val){
                                $("#parentRegisterBidBtnNew").hide();
                            }
                            
                            if(parseInt(session_user_id) == parseInt(data.data.max_bidder_user_id)){
                                $('#bidder_msg').removeClass('badge-danger');
                                $('#bidder_msg').addClass('badge-success');
                                //$('#bidder_msg').html('<i class="fas fa-check-circle"></i> You Have The Highest Bid.');
                                //$('#bidder_msg_section').show();
                                $('#bidding_message_button').html('You Are The High Bidder!').show();

                            }else{
                                $('#bidder_msg').removeClass('badge-success');
                                $('#bidder_msg').addClass('badge-danger');
                                //$('#bidder_msg').html('<i class="fas fa-exclamation-triangle"></i> You Are Out Bidded.');
                                //$('#bidder_msg_section').show();
                                $('#bidding_message_button').html('<i class="fas fa-exclamation-triangle"></i> You Are Out Bidded.').show();

                            }
                            $('#bidder_msg_section').hide();
                        }else{
                            $('#bidder_msg').removeClass('badge-danger');
                            $('#bidder_msg').addClass('badge-success');
                            //$('#bidder_msg').html('<i class="fas fa-check-circle"></i> You are registered and approved to bid. Place your first bid now.');
                            $('#bidder_msg').html('You are registered and approved to bid. <strong>Place your first bid now.</strong>');
                            $('#bidder_msg_section').show();
                            $("#auction_detail_display").show();
                            $(".bidding-bottom").hide();
                            $(".bidding_end_date .month_date_year").html(month_date_year(data.data.end_date));
                            $(".bidding_end_date").show();
                            $("#registerBidBtnNew").hide();
                        }
                    }else if(today < start_date_time && is_approved == 2 && is_reviewed == true){
                        //when bidding not started and registration approved
                        //$('#registerBidBtn').html('You are registered and <strong>Approved To Bid</strong>').css('cursor','initial');
                        //$('#registerBidBtn').show();
                        $('#registerBidBtnNew').html('You are registered and <strong>Approved To Bid</strong>').css('cursor','initial');
                        $('#parentRegisterBidBtnNew, #registerBidBtnNew').show();
                        $('#registerBidBtn').attr('href','javascript:void(0)');
                        //$('#bidder_msg').removeClass('badge-danger').addClass('badge-success').html('<i class="fas fa-check-circle"></i> Registration Approved But Auction Not Started Yet.');
                        //$('#bidder_msg_section').show();
                        $("#auction_detail_display").hide();
                        $(".bidding_end_date").hide();
                        $("#reserve_text").hide();
                        $("#login_not_start_bidding_start .month_date_year").html(month_date_year(data.data.start_date));
                        $("#login_not_start_bidding_end .month_date_year").html(month_date_year(data.data.end_date));
                        $("#login_not_start_bidding_start").show();
                        $("#login_not_start_bidding_end").show();
                        $("#bidder_msg_section").hide();

                        $("#bidding_heading_text").html('AUCTION HAS NOT STARTED YET <div class="tooltipPop"><i class="fas fa-info-circle"></i></div>');
                        //response = asset_details_conversation_start_end_date(data_start_date, data_end_date);
                        $('#auction_start_end_date').hide();
                    }else if(today > end_date_time){
                        //when bidding end
                        $("#bidding_heading_text").html('Classic Online Auction <div class="tooltipPop"><i class="fas fa-info-circle"></i></div>');
                        response = asset_details_conversation_start_end_date(data_start_date, data_end_date);
                        $('#auction_start_end_date').html(response).show();
                        $('#preFinalBiddingSection').hide();
                        $('#preFinalBiddingSection_bid_count').hide();
                        $('#registerBidBtn').hide();
                        //new condition added for closing status
                        if(data.data.closing_statuss_name){
                            var closing_status = data.data.closing_statuss_name;
                        }else{
                            var closing_status = data.data.listing_status_name;
                        }
                        $('#listing_status').html(closing_status);
                        //new condition end
                        if(data.data.listing_status_id == 9 && parseInt(session_user_id) == parseInt(data.data.max_bidder_user_id)){
                            $('#finalBiddingLostSection').hide();
                            $('#finalBiddingLostSection_bid_count').hide();
                            $('#wonSectionBtn').html(closing_status);
                            $('#finalBiddingSection').show();
                            $('#finalBiddingSection_bid_count').show();
                        }else{
                            if(parseInt(session_user_id) == parseInt(data.data.max_bidder_user_id)){
                                $('#lostSectionSuccessMsg').html('<i class="fas fa-check-circle"></i> You Have Highest Bid.');
                            }else{
                                $('#lostSectionSuccessMsg').html('<i class="fas fa-exclamation-triangle"></i> Out Bid.');
                            }
                            $('#finalBiddingSection').hide();
                            $('#finalBiddingSection_bid_count').hide();
                            $('#lostSectionBtn').html(closing_status);
                            $('#finalBiddingLostSection').show();
                            $('#finalBiddingLostSection_bid_count').show();
                        }
                        $('#bidder_msg_section').hide();
                        clearInterval(x);
                    }else{
                        if(today > start_date_time || today > end_date_time){
                            $("#bidding_heading_text").html('Classic Online Auction <div class="tooltipPop"><i class="fas fa-info-circle"></i></div>');
                            response = asset_details_conversation_start_end_date(data_start_date, data_end_date);
                            $('#auction_start_end_date').html(response).show();
                        }else{
                            $("#bidding_heading_text").html('AUCTION HAS NOT STARTED YET <div class="tooltipPop"><i class="fas fa-info-circle"></i></div>');
                            //response = asset_details_conversation_start_end_date(data_start_date, data_end_date);
                            $('#auction_start_end_date').hide();
                        }
                        //default condition when no criteria matches
                        //$('#registerBidBtn').html('Register For Auction').css('cursor','pointer');
                        $('#registerBidBtn').html('Register to Bid').css('cursor','pointer');
                        $('#registerBidBtn').show();
                        var bidder_reg_url = '/bid-registration/?property='+property_id;
                        $('#registerBidBtn').attr('href',bidder_reg_url);
                        $('#bidder_msg_section').hide();
                        $("#login_not_start_bidding_start .month_date_year").html(month_date_year(data.data.start_date));
                        $("#login_not_start_bidding_end .month_date_year").html(month_date_year(data.data.end_date));
                        $("#login_not_start_bidding_start").show();
                        $("#login_not_start_bidding_end").show();
                        $(".login_with_start").hide();
                    }
                }else if(typeof(data.data.listing_status_id) != 'undefined' && data.data.listing_status_id != null  && data.data.listing_status_id == 9){
                    $('#preFinalBiddingSection').hide();
                    $('#preFinalBiddingSection_bid_count').hide();
                    $('#registerBidBtn').hide();
                    //new condition added for closing status
                    if(data.data.closing_statuss_name){
                        var closing_status = data.data.closing_statuss_name;
                    }else{
                        var closing_status = data.data.listing_status_name;
                    }
                    $('#listing_status').html(closing_status);
                    $("#bidding_heading_text").html('Classic Online Auction <div class="tooltipPop"><i class="fas fa-info-circle"></i></div>');
                    response = asset_details_conversation_start_end_date(data_start_date, data_end_date);
                    $('#auction_start_end_date').html(response);
                    //new condition end
                    if(typeof(data.data.my_max_bid_val) != 'undefined' && data.data.my_max_bid_val){
                        if(parseInt(session_user_id) == parseInt(data.data.max_bidder_user_id)){
                            $('#finalBiddingLostSection').hide();
                            $('#finalBiddingLostSection_bid_count').hide();
                            //$('#wonSectionBtn').html(data.data.listing_status_name);
                            $('#wonSectionBtn').html(closing_status);
                            $('#finalBiddingSection').show();
                            $('#finalBiddingSection_bid_count').show();
                        }else{
                            if(parseInt(session_user_id) == parseInt(data.data.max_bidder_user_id)){
                                $('#lostSectionSuccessMsg').html('<i class="fas fa-check-circle"></i> You Have Highest Bid.');
                            }else{
                                $('#lostSectionSuccessMsg').html('<i class="fas fa-exclamation-triangle"></i> Out Bid.');
                            }
                            $('#finalBiddingSection').hide();
                            $('#finalBiddingSection_bid_count').hide();
                            //$('#lostSectionBtn').html(data.data.listing_status_name);
                            $('#lostSectionBtn').html(closing_status);
                            $('#finalBiddingLostSection').show();
                            $('#finalBiddingLostSection_bid_count').show();
                        }
                    }else{
                        if(parseInt(session_user_id) == parseInt(data.data.max_bidder_user_id)){
                            $('#lostSectionSuccessMsg').html('<i class="fas fa-check-circle"></i> You Have Highest Bid.');
                        }else{
                            if(data.data.my_max_bid_val){
                                $('#lostSectionSuccessMsg').html('<i class="fas fa-exclamation-triangle"></i> Out Bid.');
                            }else{
                                $('.lost_sec_msg').hide();
                            }
                        }
                        $('#finalBiddingSection').hide();
                        $('#finalBiddingSection_bid_count').hide();
                        //$('#lostSectionBtn').html(data.data.listing_status_name);
                        $('#lostSectionBtn').html(closing_status);
                        $('#finalBiddingLostSection').show();
                        $('#finalBiddingLostSection_bid_count').show();
                    }
                    $('#bidder_msg_section').hide();
                }else{
                    $('.lost_sec_msg').hide();
                    if(data.data.listing_status_id == 2 || data.data.auction_status == 2 || data.data.listing_status_id == 8 || data.data.auction_status == 8 || data.data.auction_status != 1 || !data.data.my_max_bid_val || !data.data.high_bid_amt || (typeof(data.data.bid_count) == 'undefined' || (data.data.bid_count && parseInt(data.data.bid_count) <= 0))){
                        $('.lost_sec_msg').hide();
                    }else{
                        if(parseInt(session_user_id) == parseInt(data.data.max_bidder_user_id)){
                            $('#lostSectionSuccessMsg').html('<i class="fas fa-check-circle"></i> You Have Highest Bid.');
                        }else{
                            if(typeof(data.data.is_approved) != 'undefined'){
                                $('#lostSectionSuccessMsg').html('<i class="fas fa-exclamation-triangle"></i> Out Bid.');
                            }else{
                                $('#lostSectionSuccessMsg').hide();
                            }
                        }
                    }
                    $('#preFinalBiddingSection').hide();
                    $('#preFinalBiddingSection_bid_count').hide();
                    $('#listing_status').html(listing_status_name);
                    $('#registerBidBtn').hide();
                    $('#finalBiddingSection').hide();
                    $('#finalBiddingSection_bid_count').hide();
                    $('#lostSectionBtn').html(data.data.listing_status_name);
                    $('#finalBiddingLostSection').show();
                    $('#finalBiddingLostSection_bid_count').show();
                    $('#bidder_msg_section').hide();
                }
            }else{
               if((is_approved == 1 && (is_reviewed == false || is_reviewed == true)) || (is_approved == 2 && is_reviewed == false)){
                    //when bidding started and registraton approval in pending state
                    $('#registerBidBtn').html('Registration Pending Approval').css('cursor','initial');
                    //$('#registerBidBtn').addClass('approval_pending').addClass('btn-primary-bdr').removeClass('btn-secondary');
                    $('#registerBidBtn').show();
                    $('#registerBidBtn').attr('href','javascript:void(0)');
                    $('#bidder_msg_section').hide();
              }else if(is_approved == 2 && is_reviewed == true){
                    //when bidding started and registraton approved
                    $('#bidNowFormSection').show();
                    $('#registerBidBtn').hide();
                    $('#registerBidBtn').attr('href','javascript:void(0)');
                    if(typeof(data.data.my_max_bid_val) != 'undefined' && data.data.my_max_bid_val){
                        if(parseInt(session_user_id) == parseInt(data.data.max_bidder_user_id)){
                            $('#bidder_msg').removeClass('badge-danger');
                            $('#bidder_msg').addClass('badge-success');
                            //$('#bidder_msg').html('<i class="fas fa-check-circle"></i> You Have The Highest Bid.');
                            //$('#bidder_msg_section').show();
                            $('#bidding_message_button').html('You Are The High Bidder!').show();
                        }else{
                            $('#bidder_msg').removeClass('badge-success');
                            $('#bidder_msg').addClass('badge-danger');
                            $('#bidder_msg').html('<i class="fas fa-exclamation-triangle"></i> You Are Out Bidded.');
                            $('#bidder_msg_section').show();
                        }
                    }else{
                        $('#bidder_msg').removeClass('badge-danger');
                        $('#bidder_msg').addClass('badge-success');
                        $('#bidder_msg').html('<i class="fas fa-check-circle"></i> You are registered and approved to bid. Place your first bid now.');
                        $('#bidder_msg_section').show();
                    }
                    /*if(typeof(data.data.bid_count) != 'undefined' && data.data.bid_count){
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
                $('#bidder_msg_section').hide();
              }else{
                    //default condition when no criteria matches
                    $('#registerBidBtn').html('Register For Auction');
                    $('#registerBidBtn').show();
                    var bidder_reg_url = '/bid-registration/?property='+property_id;
                    $('#registerBidBtn').attr('href',bidder_reg_url);
              }
            }
           }else{
              //when user not logged in
              if(today < end_date_time && today > start_date_time && typeof(data.data.listing_status_id) != 'undefined' && data.data.listing_status_id != null  && data.data.listing_status_id == 1 && data.data.auction_status == 1){
                  $("#bidding_heading_text").html('Classic Online Auction <div class="tooltipPop"><i class="fas fa-info-circle"></i></div>');
                  response = asset_details_conversation_start_end_date(data_start_date, data_end_date);
                  $('#auction_start_end_date').html(response).show();
                  $(".not_login_start .month_date_year").html(month_date_year(data.data.start_date));
                  $(".not_login_end .month_date_year").html(month_date_year(data.data.end_date));
                  $(".not_login_start").show();
                  $(".not_login_end").show();

                  //$('#registerBidBtn').html('Register For Auction').css('cursor','pointer');
                  $('#registerBidBtn').html('Login/Register to Bid').css('cursor','pointer');

                  $('#registerBidBtn').show();
                  var bidder_reg_url = '/login/?next=/asset-details/?property_id='+property_id;
                  $('#registerBidBtn').attr('href',bidder_reg_url);
                  $('#bidder_msg_section').hide();
              }else if(today < start_date_time && typeof(data.data.listing_status_id) != 'undefined' && data.data.listing_status_id != null  && data.data.listing_status_id == 1 && data.data.auction_status == 1){
                  $("#bidding_heading_text").html('AUCTION HAS NOT STARTED YET <div class="tooltipPop"><i class="fas fa-info-circle"></i></div>');
                  //response = asset_details_conversation_start_end_date(data_start_date, data_end_date);
                  $('#auction_start_end_date').hide();
                  $(".not_login_start .month_date_year").html(month_date_year(data.data.start_date));
                  $(".not_login_end .month_date_year").html(month_date_year(data.data.end_date));
                  $(".not_login_start").show();
                  $(".not_login_end").show();

                  //$('#registerBidBtn').html('Register For Auction').css('cursor','pointer');
                  $('#registerBidBtn').html('Login/Register to Bid').css('cursor','pointer');

                  $('#registerBidBtn').show();
                  var bidder_reg_url = '/login/?next=/asset-details/?property_id='+property_id;
                  $('#registerBidBtn').attr('href',bidder_reg_url);
                  $('#bidder_msg_section').hide();
              }else{
                //$("#bidding_heading_text").html('Classic Online Auction <div class="tooltipPop"><i class="fas fa-info-circle"></i></div>');
                //response = asset_details_conversation_start_end_date(data_start_date, data_end_date);
                //$('#auction_start_end_date').html(response).show();
                //$(".not_login_start .month_date_year").html(month_date_year(data.data.start_date));
                //$(".not_login_end .month_date_year").html(month_date_year(data.data.end_date));
                //$(".not_login_start").show();
                //$(".not_login_end").show();

                $('#preFinalBiddingSection').hide();
                $('#preFinalBiddingSection_bid_count').hide();
                $('#registerBidBtn').hide();
                $('#listing_status').html(data.data.listing_status_name);
                $('#finalBiddingSection').hide();
                $('#finalBiddingSection_bid_count').hide();
                $('#lostSectionBtn').html(data.data.listing_status_name);
                $('#finalBiddingLostSection').show();
                $('#finalBiddingLostSection_bid_count').show();
                $('#bidder_msg_section').hide();
                $('.lost_sec_msg').hide();
              }
           }
           if(parseInt(asset_sale_type) == 1){
               //$('#starting_bid').show();
               //$('#next_bid').show();
               if(today >= start_date_time && today <= end_date_time){
                    $('#bid_increment').show();
                    //$('#bid_count').show();
                    $('#preFinalBiddingSection_bid_count').show();
                    $('#finalBiddingSection_bid_count').hide();
                    $('#finalBiddingLostSection_bid_count').hide();
               }else if(today < start_date_time){
                    $('#bid_increment').show();
                    $('#preFinalBiddingSection_bid_count').show();
                    $('#finalBiddingSection_bid_count').hide();
                    $('#finalBiddingLostSection_bid_count').hide();
               }else{
                    $('#bid_increment').hide();
                    $('#preFinalBiddingSection_bid_count').hide();
                    if($('#finalBiddingSection').is(':visible') == true){
                        $('#finalBiddingSection_bid_count').show();
                        $('#finalBiddingLostSection_bid_count').hide();
                    }else{
                        $('#finalBiddingSection_bid_count').hide();
                        $('#finalBiddingLostSection_bid_count').show();
                    }


               }
               //$('#bid_start_date').hide();
               //$('#bid_end_date').hide();
               if((typeof(data.data.bid_count) != 'undefined' && data.data.bid_count && ((today >= start_date_time && today <= end_date_time) || today > end_date_time)) || (today > end_date_time)){
                var bid_amt = '<span>Current Bid</span>'+'$'+start_bid_formated;
                var auction_bid_amt = '$'+start_bid_formated+'<span>Current Bid</span>';
               }else{
                var bid_amt = '<span>Starting Bid</span>'+'$'+start_bid_formated;
                var auction_bid_amt = '$'+start_bid_formated+'<span>Starting Bid</span>';
               }
               $('#header_bid_price').html(bid_amt);
               $('#auction_starting_bid').html(auction_bid_amt);
          }else if(parseInt(asset_sale_type) == 4){
               //$('#starting_bid').show();
               //$('#next_bid').show();
               $('#bid_increment').hide();
               $('#preFinalBiddingSection_bid_count').hide();
               $('#finalBiddingSection_bid_count').hide();
               $('#finalBiddingLostSection_bid_count').hide();
               //$('#bid_start_date').hide();
               //$('#bid_end_date').hide();
               var bid_amt = '<span>Asking Price</span>'+'$'+start_bid_formated;
               var auction_bid_amt = '$'+start_bid_formated+'<span>Asking Price</span>';
               $('#header_bid_price').html(bid_amt);
               $('#auction_starting_bid').html(auction_bid_amt);
          }else{
                //$('#starting_bid').show();
               //$('#next_bid').hide();
               $('#bid_increment').hide();
               $('#preFinalBiddingSection_bid_count').hide();
               $('#finalBiddingSection_bid_count').hide();
               $('#finalBiddingLostSection_bid_count').hide();
               //$('#bid_start_date').show();
               //$('#bid_end_date').show();
               if(typeof(data.data.bid_count) != 'undefined' && data.data.bid_count && today >= start_date_time){
                var bid_amt = '<span>Current Bid</span>'+'$'+start_bid_formated;
                var auction_bid_amt = '$'+start_bid_formated+'<span>Current Bid</span>';
               }else{
                var bid_amt = '<span>Starting Bid</span>'+'$'+start_bid_formated;
                var auction_bid_amt = '$'+start_bid_formated+'<span>Starting Bid</span>';
               }
               $('#header_bid_price').html(bid_amt);
               $('#auction_starting_bid').html(auction_bid_amt);
          }
          if(parseInt(asset_sale_type) == 1){
               //when bidding started or bidding end then change header bid price text accordingly
               if((data.data.bid_count && ((today >= start_date_time && today <= end_date_time) || today > end_date_time)) || (today > end_date_time)){
                $('#header_bid_price').html('<span>Current Bid</span>'+'$'+start_bid_formated);
               }else{
                $('#header_bid_price').html('<span>Starting Bid</span>'+'$'+start_bid_formated);
               }
          }else if(parseInt(asset_sale_type) == 4){
            $('#header_bid_price').html('<span>Listing Price</span>'+'$'+start_bid_formated);
          }else{
            $('#header_bid_price').html('<span>Asking Price</span>'+'$'+start_bid_formated);
          }
              /*$('#starting_bid').html('<h4><span>Starting Bid: <em>$'+start_bid_formated+'</em></span></h4>');
              if(typeof(data.data.bid_count) != 'undefined' && data.data.bid_count && today >= start_date_time){
                $('#starting_bid').html('<h4><span>Current Bid: <em>$'+start_bid_formated+'</em></span></h4>');
              }*/
              //$('#next_bid').html('<span>Next Bid: </span> $'+next_bid_formated);
              if(typeof(data.data.bid_count) != 'undefined' && data.data.bid_count){
                if(session_user_id != "" && session_user_id != 0){
                    if(parseInt(session_user_id) == parseInt(data.data.max_bidder_user_id) && today > end_date_time){
                        $('.bidcount').html('<h6><span>View Bids: <a class="blue-text" href="javascript:void(0)" onclick="view_property_bids(\''+property_id+'\')">'+data.data.bid_count+'</a></span></h6>');
                        $('.bidcount').show();
                    }else{
                        $('.bidcount').html('<h6><span>View Bids: <a class="blue-text" href="javascript:void(0)" onclick="view_property_bids(\''+property_id+'\')">'+data.data.bid_count+'</a></span></h6>');
                    }
                }else{
                    $('.bidcount').html('<h6><span>View Bids: <a class="blue-text" href="/login?next=/asset-details/?property_id='+property_id+'">'+data.data.bid_count+'</a></span></h6>');
                }

              }else{
                //$('#bidcount').html('<h6><span>View Bids: <a class="blue-text" href="javascript:void(0)" onclick="view_property_bids(\''+property_id+'\')">0</a></span></h6>');
              }
              /*if(typeof(data.data.bid_count) != 'undefined' && data.data.bid_count){
                $('#delete_bid_section').show();
              }else{
                   $('#delete_bid_section').hide();
              }*/
              var icon_img = "/static/"+templete_dir+"/images/info-red.png";
              //$('#bid_increment').html('<h6><span>Min Bid Increment: <em>$'+bid_increments+'</em> <div class="tooltipPop"><img src="'+icon_img+'" alt=""></div></span><div class="tooltipPopdesc"><div class="uparrow"></div><div class="popcontent">The lowest amount needed to become the next highest bid during the auction. We do not believe in the process of max bids or also known as automatic proxy bidding. <br>For example, if the current highest bid is $100,000 and the minimum bid increment is set to $1,000, the next acceptable highest bid would be $101,000 <b>Or</b> if the current highest bid is $100,000 and the minimum bid increment is set to $1,000, and you decide to go above the minimum bid increment and manually enter $125,000 then the next acceptable highest bid would be $126,000. </div> </div></h6>');
              $('#bid_increment').html('<h6><span>Min Bid Increment: <em>$'+bid_increments+'</em> <div class="tooltipPop"><i class="fas fa-info-circle"></i></div></span><div class="tooltipPopdesc"><div class="uparrow"></div><div class="popcontent">The lowest amount needed to become the next highest bid during the auction. We do not believe in the process of max bids or also known as automatic proxy bidding. <br>For example, if the current highest bid is $100,000 and the minimum bid increment is set to $1,000, the next acceptable highest bid would be $101,000 <b>Or</b> if the current highest bid is $100,000 and the minimum bid increment is set to $1,000, and you decide to go above the minimum bid increment and manually enter $125,000 then the next acceptable highest bid would be $126,000. </div> </div></h6>');
              if (!$("#new_bid_amt").is(":focus")) {
                $('#new_bid_amt').val('$'+next_bid_formated);
                $('#current_next_bid').html('$'+next_bid_formated);
                $('#current_bid_increment').html('$'+bid_increments);
              }
              //condition to show/hide reserve text
              if(typeof(data.data.start_date) != 'undefined' && typeof(data.data.end_date) != 'undefined'){
                var local_start_date = getLocalDate(data.data.start_date, 'm j, Y','');
                countDownDate = new Date(local_start_date).getTime();
                var local_date = getLocalDate(data.data.end_date, 'm j, Y','');
                countDownEndDate = new Date(local_date).getTime();
                try{
                    clearInterval(x);
                }catch(ex){
                    //console.log(ex);
                }
                if(today < start_date_time){
                    if(asset_sale_type && parseInt(asset_sale_type) == 7){
                        $('#countdown_text').html('Offer Starts In <div class="tooltipPop"><i class="fas fa-info-circle"></i></div>');
                    }else{
                        $('#countdown_text').html('Bidding Starts In <div class="tooltipPop"><i class="fas fa-info-circle"></i></div>');
                    }
                }else if(today >= start_date_time && today <= end_date_time){
                    if(asset_sale_type && parseInt(asset_sale_type) == 7){
                        $('#countdown_text').html('Offer Ends In <div class="tooltipPop"><i class="fas fa-info-circle"></i></div>');
                    }else{
                        $('#countdown_text').html('Bidding Ends In <div class="tooltipPop"><i class="fas fa-info-circle"></i></div>');
                    }
                }else{
                    $('#countdown_text').html('Auction Completed <div class="tooltipPop"><i class="fas fa-info-circle"></i></div>');
                    $('#countdown_text').show();
                }
                var remain_time_add_extension = null;
                var time_extension = null;
                if(data.data.is_log_time_extension != null && data.data.is_log_time_extension == true && typeof(data.data.remain_time_to_add_extension) != 'undefined' && data.data.remain_time_to_add_extension != null && typeof(data.data.log_time_extension) != 'undefined' && data.data.log_time_extension != null){
                    remain_time_add_extension = data.data.remain_time_to_add_extension;
                    time_extension = data.data.log_time_extension;
                }else if(data.data.is_log_time_extension == null && data.data.agent_is_log_time_extension != null && data.data.agent_is_log_time_extension == true && typeof(data.data.agent_remain_time_to_add_extension) != 'undefined' && data.data.agent_remain_time_to_add_extension != null && typeof(data.data.agent_log_time_extension) != 'undefined' && data.data.agent_log_time_extension != null){
                    remain_time_add_extension = data.data.agent_remain_time_to_add_extension;
                    time_extension = data.data.agent_log_time_extension;
                }else if(data.data.is_log_time_extension == null && data.data.agent_is_log_time_extension == null &&  data.data.global_is_log_time_extension != null && data.data.global_is_log_time_extension == true && typeof(data.data.global_remain_time_to_add_extension) != 'undefined' && data.data.global_remain_time_to_add_extension != null && typeof(data.data.global_log_time_extension) != 'undefined' && data.data.global_log_time_extension != null){
                    remain_time_add_extension = data.data.global_remain_time_to_add_extension;
                    time_extension = data.data.global_log_time_extension;
                }
                if(time_extension && remain_time_add_extension){
                    var countdown_tooltip_text = 'If any bids are placed within the last <b class="red-text">'+remain_time_add_extension+' minutes</b> of the auction, the clock will automatically be reset to <b class="red-text">'+time_extension+' minutes</b>. Once the final <b class="red-text">'+remain_time_add_extension+' minutes</b> passes with no new bids placed the auction will end.';
                    $('#countdown_tooltip .popcontent').html(countdown_tooltip_text);
                }else{
                    $('#countdown_tooltip .popcontent').html('');
                    $('#countdown_tooltip').css('visibility','hidden');
                }
                if(typeof(data.data.time_flash) != 'undefined' && data.data.time_flash != null){
                    flash_time_sec = data.data.time_flash*60;
                    flash_time_milisec = flash_time_sec*1000;
                }else if(typeof(data.data.agent_time_flash) != 'undefined' && data.data.agent_time_flash != null){
                    flash_time_sec = data.data.agent_time_flash*60;
                    flash_time_milisec = flash_time_sec*1000;
                }else if(typeof(data.data.global_time_flash) != 'undefined' && data.data.global_time_flash != null){
                    flash_time_sec = data.data.global_time_flash*60;
                    flash_time_milisec = flash_time_sec*1000;
                }
                //$('#countdown_tooltip').html('<div class="uparrow"></div><div class="popcontent">If any bids are placed within the last <b class="red-text">2</b> minutes of the auction, the clock will automatically be reset to <b class="red-text">5</b> minutes. Once the final <b class="red-text">2</b> minutes passes with no new bids placed the auction will end.</div>');
                    if(today < start_date_time){
                        check_starting = setInterval(function(){
                        var new_today = new Date().getTime();
                        if(new_today > socket_start_date){
                            counter_starting = counter_starting + 1;
                            if(counter_starting >= 2){
                                clearInterval(check_starting);
                            }else{
                                custom_response = {
                                    'socket_start_date': socket_start_date,
                                    'socket_end_date': socket_end_date,
                                };
                                customCallBackFunc(check_auction_dates, [custom_response]);
                            }
                        }else{
                            counter_starting = 0;
                        }
                    }, 3000);
                    }
                    if(today > start_date_time && today < end_date_time){
                        check_ending = setInterval(function(){
                            var new_today = new Date().getTime();
                            if(new_today > socket_end_date){
                                counter_ending = counter_ending + 1;
                                if(counter_ending >= 2){
                                    clearInterval(check_ending);
                                }else{
                                    custom_response = {
                                        'socket_start_date': socket_start_date,
                                        'socket_end_date': socket_end_date,
                                      };
                                    customCallBackFunc(check_auction_dates, [custom_response]);
                                }

                            }else{
                                counter_ending = 0;
                            }
                        }, 3000);
                        check_flash_time = setInterval(function(){
                            var new_today = new Date().getTime();
                            if(new_today > socket_end_date){
                                clearInterval(check_flash_time);
                                $('.timing').removeClass('blink');
                                $('.timing').stop(true, true).fadeIn();
                                $('.timing').finish().fadeIn();
                            }else{
                                var flashtime = socket_end_date - new_today;
                                if(new_today < socket_end_date && flashtime > 0 && flashtime <= flash_time_milisec){
                                    $('.timing').fadeOut(500);
                                    $('.timing').fadeIn(500);
                                }else if(new_today > socket_end_date){
                                    clearInterval(check_flash_time);
                                    $('.timing').removeClass('blink');
                                    $('.timing').stop(true, true).fadeIn();
                                    $('.timing').finish().fadeIn();
                                }else{
                                    $('.timing').removeClass('blink');
                                    $('.timing').stop(true, true).fadeIn();
                                    $('.timing').finish().fadeIn();
                                }
                            }
                        }, 1000);
                    }else{
                        check_flash_time = setInterval(function(){
                            var new_today = new Date().getTime();
                            if(new_today > socket_end_date){
                                clearInterval(check_flash_time);
                                $('.timing').removeClass('blink');
                                $('.timing').stop(true, true).fadeIn();
                                $('.timing').finish().fadeIn();
                            }
                        }, 1000);
                        check_ending = setInterval(function(){
                            var new_today = new Date().getTime();
                            if(new_today > socket_end_date){
                                clearInterval(check_ending);
                            }
                        }, 3000);
                    }
                    try{
                        var data_start_date = '';
                        var data_end_date = '';
                        if(typeof(data.data.start_date) != 'undefined' && data.data.start_date != null){
                            data_start_date = data.data.start_date;
                            $('#auction_start_end_date').attr('data-start-date',data_start_date);
                        }
                        if(typeof(data.data.end_date) != 'undefined' && data.data.end_date != null){
                            data_end_date = data.data.end_date;
                            $('#auction_start_end_date').attr('data-end-date',data_end_date);
                        }
                        response = asset_details_conversation_start_end_date(data_start_date, data_end_date);
                        $('#auction_start_end_date').html(response);
                    }catch(ex){
                        //console.log(ex);
                    }
                  // Get today's date and time
                  x = setInterval(function() {
                        //clearInterval(x);
                      // Get today's date and time
                      var now = new Date().getTime();
                      // Find the distance between now and the count down date
                      var diff_from = 'start_date';
                      var distance = countDownDate - now;
                      if(isNaN(distance) || distance < 0){
                        distance = countDownEndDate - now;
                        diff_from = 'end_date';
                        /*if(asset_sale_type && parseInt(asset_sale_type) == 7){
                            $('#countdown_text').html('Offer End In');
                        }else{
                            $('#countdown_text').html('Bidding End In');
                        }*/
                        //alert(distance);
                      }
                      if(isNaN(distance) || distance < 0){
                        $('.day_remaining').html('00');
                        $('.hr_remaining').html('00');
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
                        $('.min_remaining').html(minutes);
                        $('.sec_remaining').html(seconds);
                        /*if(diff_from == 'start_date'){
                            status = 'Coming Soon';
                            $('#listing_status').html(status);
                        }else if(diff_from == 'end_date'){
                            if(parseInt(days) == 0){
                                status = 'Closing Today';
                                $('#listing_status').html(status);
                            }else{
                                status = 'Now Bidding';
                                $('#listing_status').html(status);
                            }
                        }*/
                        if(typeof(listing_status_id) != 'undefined' && listing_status_id != null  && auction_status_id == 1 && listing_status_id == 1){

                            if(diff_from == 'start_date'){
                                status = 'Coming Soon';
                                $('#listing_status').html(status);
                            }else if(diff_from == 'end_date'){
                                if(parseInt(days) == 0){
                                    status = 'Closing Today';
                                    $('#listing_status').html(status);
                                }else{
                                    status = 'Now Bidding';
                                    $('#listing_status').html(status);
                                }
                            }
                        }else{
                            if(closing_status_name){
                                $('#listing_status').html(closing_status_name);
                            }else{
                                $('#listing_status').html(listing_status_name);
                            }
                        }
                      // If the count down is over, write some text
                      if(parseInt(distance) < 0 || (typeof(auction_status_id) != 'undefined' && auction_status_id != null && auction_status_id != 1)){
                        clearInterval(x);
                        $('.day_remaining').html('00');
                        $('.hr_remaining').html('00');
                        $('.min_remaining').html('00');
                        $('.sec_remaining').html('00');
                        $('.time_remaining').show();
                        $('#countdown_text').html('Auction Completed <div class="tooltipPop"><i class="fas fa-info-circle"></i></div>');
                      }else{
                        $('.time_remaining').show();
                      }
                      }
                    }, 1000);
              }
        }catch(ex){
          //console.log(ex);
        }
        $('#submitUserBid').removeProp('disabled');
        $('#confirm_bid_true').removeProp('disabled');
    }
  });
  $("#confirm_bid_true").on("click", function(){
    if($("#bidNowFrm").valid()){
        $('#submitUserBid').prop('disabled',true);
    $('#confirm_bid_true').prop('disabled',true);
      var bid_amt = $('#new_bid_amt').val();
      bid_amt = bid_amt.toString().replace(/,/g, '').replace('$', '');
      bid_increments = bid_increments.toString().replace(/,/g, '');
        $('#confirmBidModal').modal('hide');
         socket.emit("addNewBid", {"property_id": property_id, "auction_id": auction_id, "domain_id": site_id, "min_bid_amount": start_bid, "bid_amount": bid_amt, "bid_increment": bid_increments, "user_id": session_user_id,"ip_address": ip_address, "registration_id": registration_id});
         socket.on('addNewBid',function(data) {
          //if((data.status == 200 || data.status == 201) && data.error == 0){
            if(data.error == 0){
                 socket.emit("checkBid", {"user_id":session_user_id, "property_id": property_id, "auction_id": auction_id, "domain_id": site_id});
                $('#bidder_msg').removeClass('badge-danger').addClass('badge-success');
                //$('#bidder_msg').html('<i class="fas fa-check-circle"></i> '+data.msg);
                //$('#bidder_msg').parent().show();
                if(data.msg== "You Have The Highest Bid."){
                    $('#bidding_message_button').html("You Are The High Bidder!").show();
                }else{
                    $('#bidding_message_button').html(data.msg).show();
                }
            }else{
                $('#submitUserBid').removeProp('disabled');
                 $('#confirm_bid_true').removeProp('disabled');
                $('#bidding_error_msg').removeClass('badge-success').addClass('badge-danger');
                $('#bidding_error_msg').html('<i class="fas fa-exclamation-triangle"></i> '+data.msg);
                $('#biddingErrorBidModal').modal('show');
            }
      });
    }
  });
  socket.on('deleteCurrentBid',function(data) {
        $('#del_bid_true').removeProp('disabled');
        $('#confirmDeleteBidModal').modal('hide');
        if(data.error == 0){
            $.growl.notice({title: "Current Bid ", message: data.msg, size: 'large'});
            socket.emit("checkBid", {"user_id":session_user_id, "property_id": property_id, "auction_id": auction_id, "domain_id": site_id});
        }else{
            $.growl.error({title: "Current Bid ", message: data.msg, size: 'large'});
        }
    });
  socket.emit("checkAuction", {"domain_id": site_id});
    socket.on('checkAuction',function(data) {
        if(parseInt(asset_sale_type) == 2){
            socket.emit("checkInsiderBid", {"user_id":session_user_id, "property_id": property_id, "auction_id": auction_id, "domain_id": site_id});
        }else{
            socket.emit("checkBid", {"user_id":session_user_id, "property_id": property_id, "auction_id": auction_id, "domain_id": site_id});
        }
    });
if(today_date < socket_start_date){
    check_starting = setInterval(function(){
        var new_today = new Date().getTime();
        if(new_today > socket_start_date){
            counter_starting = counter_starting + 1;
            if(counter_starting >= 2){
                clearInterval(check_starting);
            }else{
                custom_response = {
                    'socket_start_date': socket_start_date,
                    'socket_end_date': socket_end_date,
                };
                customCallBackFunc(check_auction_dates, [custom_response]);
            }
        }else{
            counter_starting = 0;
        }
    }, 3000);
}
if(today_date > socket_start_date && today_date < socket_end_date){
    check_ending = setInterval(function(){
        var new_today = new Date().getTime();
        if(new_today > socket_end_date){
            counter_end = counter_end + 1;
            if(counter_end >= 2){
                clearInterval(check_ending);
            }else{
                custom_response = {
                    'socket_start_date': socket_start_date,
                    'socket_end_date': socket_end_date,
                };
                customCallBackFunc(check_auction_dates, [custom_response]);
            }
        }else{
            counter_end = 0;
        }
    }, 3000);
    check_flash_time = setInterval(function(){
        var new_today = new Date().getTime();
        if(new_today > socket_end_date){
            $('.timing').removeClass('blink');
            $('.timing').stop(true, true).fadeIn();
            $('.timing').finish().fadeIn();
            clearInterval(check_flash_time);
        }
    }, 1000);
}else{
    check_flash_time = setInterval(function(){
        var new_today = new Date().getTime();
        if(new_today > socket_end_date){
            clearInterval(check_flash_time);
            $('.timing').removeClass('blink');
            $('.timing').stop(true, true).fadeIn();
            $('.timing').finish().fadeIn();
        }
    }, 1000);
    check_ending = setInterval(function(){
        var new_today = new Date().getTime();
        if(new_today > socket_end_date){
            clearInterval(check_ending);
        }
    }, 3000);
}
}else if(parseInt(asset_sale_type) == 2){
    socket.emit("checkInsiderBid", {"user_id":session_user_id, "property_id": property_id, "auction_id": auction_id, "domain_id": site_id});
    //socket.emit("checkMyBid", {"user_id":session_user_id, "property_id": property_id, "auction_id": auction_id, "domain_id": site_id});
  socket.on('checkInsiderBid',function(data) {
        var res_user_id = '';
        var log_user_id = '';
        if(typeof(data.user_id) != "undefined" && data.user_id != ""){
            res_user_id = parseInt(data.user_id);
        }
        if(session_user_id != ""){
            log_user_id = parseInt(session_user_id);
        }
      if(typeof(data.data) != 'undefined' && data.data && (res_user_id == log_user_id || (res_user_id == '' && log_user_id == ''))){
                console.log("===============Inner Part=================");
                console.log(data);
                try{
                var start_bid = 0;
                var next_bid = 0;
                var start_bid_formated = 0;
                var next_bid_formated = 0;
                var sealed_amount = 0;
                var sealed_amount_formatted = 0;
                var highest_amount_formatted = 0;
                var insider_decreased_price_formatted = 0;
                var sealed_current_bid_formatted = 0;
                var sealed_next_bid_formatted = 0;
                var sealed_winning_amount_formatted = 0;
                var english_current_bid_formatted = 0;
                var english_next_bid_formatted = 0;

               if(typeof(data.data.high_bid_amt) != "undefined" && data.data.high_bid_amt != null){

                start_bid = data.data.high_bid_amt;
                next_bid = parseInt(start_bid)+parseInt(data.data.bid_increments);
               }else{
                start_bid = data.data.start_price;
                next_bid = start_bid;
               }
               if(data.data.insider_decreased_price){
                    if(data.data.insider_decreased_price > parseInt(data.data.insider_decreased_price)){
                        insider_decreased_price_formatted = numberFormat(data.data.insider_decreased_price);
                    }else{
                        insider_decreased_price_formatted = numberFormat(parseInt(data.data.insider_decreased_price));
                    }
               }
               if(data.data.dutch_winning_amount){
                    if(data.data.dutch_winning_amount > parseInt(data.data.dutch_winning_amount)){
                        dutch_winning_amount_formatted = numberFormat(data.data.dutch_winning_amount);
                    }else{
                        dutch_winning_amount_formatted = numberFormat(parseInt(data.data.dutch_winning_amount));
                    }

                    sealed_amount = parseFloat(data.data.high_bid_amt) + 1;
                    if(sealed_amount > parseInt(sealed_amount)){
                        sealed_amount_formatted = numberFormat(sealed_amount);
                    }else{
                        sealed_amount_formatted = numberFormat(parseInt(sealed_amount));
                    }

               }

               if(data.data.my_max_bid_val){
                    $('#sealed_highest_bid_amount').val(data.data.my_max_bid_val);
                    if(data.data.my_max_bid_val > parseInt(data.data.my_max_bid_val)){
                        sealed_current_bid_formatted = numberFormat(data.data.my_max_bid_val);
                        sealed_next_bid_formatted = parseFloat(data.data.my_max_bid_val) + 1;
                        sealed_next_bid_formatted = numberFormat(sealed_next_bid_formatted);
                    }else{
                        sealed_current_bid_formatted = numberFormat(parseInt(data.data.my_max_bid_val));
                        sealed_next_bid_formatted = parseInt(data.data.my_max_bid_val) + 1;
                        sealed_next_bid_formatted = numberFormat(parseInt(sealed_next_bid_formatted));
                    }
               }else{
                    $('#sealed_highest_bid_amount').val(data.data.dutch_winning_amount);
                    if(data.data.dutch_winning_amount > parseInt(data.data.dutch_winning_amount)){
                        sealed_current_bid_formatted = numberFormat(data.data.dutch_winning_amount);
                        sealed_next_bid_formatted = parseFloat(data.data.dutch_winning_amount) + 1;
                        sealed_next_bid_formatted = numberFormat(sealed_next_bid_formatted);
                    }else{
                        sealed_current_bid_formatted = numberFormat(parseInt(data.data.dutch_winning_amount));
                        sealed_next_bid_formatted = parseInt(data.data.dutch_winning_amount) + 1;
                        sealed_next_bid_formatted = numberFormat(parseInt(sealed_next_bid_formatted));
                    }
               }
               if(data.data.sealed_winning_amount){
                    if(data.data.sealed_winning_amount > parseInt(data.data.sealed_winning_amount)){
                        sealed_winning_amount_formatted = numberFormat(data.data.sealed_winning_amount);
                    }else{
                        sealed_winning_amount_formatted = numberFormat(parseInt(data.data.sealed_winning_amount));
                    }
               }
               if(data.data.sealed_winning_amount && data.data.high_bid_amt && data.data.dutch_winning_user_id &&  data.data.sealed_winning_user_id){
                    $('#sealed_highest_bid_amount').val(data.data.high_bid_amt);
                    $('#insider_increment_decrement_by').val();
                    if(data.data.high_bid_amt > parseInt(data.data.high_bid_amt)){
                        english_current_bid_formatted = numberFormat(data.data.high_bid_amt);
                        english_next_bid_formatted = parseFloat(data.data.high_bid_amt) + parseFloat(data.data.bid_increments);
                        english_next_bid_formatted = numberFormat(english_next_bid_formatted);
                    }else{
                        english_current_bid_formatted = numberFormat(parseInt(data.data.high_bid_amt));
                        english_next_bid_formatted = parseInt(data.data.high_bid_amt) + parseInt(data.data.bid_increments);
                        english_next_bid_formatted = numberFormat(parseInt(english_next_bid_formatted));
                    }
               }else{
                    $('#sealed_highest_bid_amount').val(data.data.sealed_winning_amount);
                    $('#insider_increment_decrement_by').val();
                    if(data.data.sealed_winning_amount > parseInt(data.data.sealed_winning_amount)){
                        english_current_bid_formatted = numberFormat(data.data.sealed_winning_amount);
                        english_next_bid_formatted = parseFloat(data.data.sealed_winning_amount) + parseFloat(data.data.bid_increments);
                        english_next_bid_formatted = numberFormat(english_next_bid_formatted);
                    }else{
                        english_current_bid_formatted = numberFormat(parseInt(data.data.sealed_winning_amount));
                        english_next_bid_formatted = parseInt(data.data.sealed_winning_amount) + parseInt(data.data.bid_increments);
                        english_next_bid_formatted = numberFormat(parseInt(english_next_bid_formatted));
                    }
               }

               if(data.data.high_bid_amt > parseInt(data.data.high_bid_amt)){
                    highest_amount_formatted = numberFormat(data.data.high_bid_amt);
               }else{
                    highest_amount_formatted = numberFormat(parseInt(data.data.high_bid_amt));
               }
               if(start_bid > parseInt(start_bid)){
                start_bid_formated = numberFormat(start_bid);
               }else{
                start_bid_formated = numberFormat(parseInt(start_bid));
               }
               if(next_bid > parseInt(next_bid)){
                next_bid_formated = numberFormat(next_bid);
               }else{
                next_bid_formated = numberFormat(parseInt(next_bid));
               }
               if(data.data.bid_increments > parseInt(data.data.bid_increments)){
                bid_increments = numberFormat(data.data.bid_increments);
               }else{
                bid_increments = numberFormat(parseInt(data.data.bid_increments));
               }
               if(typeof(data.data.listing_status_name) != 'undefined' && data.data.listing_status_name != null){
                listing_status_name = data.data.listing_status_name;
               }
               if(typeof(data.data.closing_statuss_name) != 'undefined' && data.data.closing_statuss_name != null){
                closing_status_name = data.data.closing_statuss_name;
               }
               var is_approved = 0;
               var is_reviewed = false;
               var is_registered = "False";
               var registration_approved = "False";
               if(typeof(data.data.is_approved) != 'undefined'){
                   is_approved = data.data.is_approved;
               }
               if(typeof(data.data.is_reviewed) != 'undefined'){
                   is_reviewed = data.data.is_reviewed;
               }
               if(is_approved == 0){
                is_registered = "False"
                registration_approved = "False"
               }else if((is_approved == 2 && is_reviewed == true)){
                is_registered = "True"
                registration_approved = "True"
               }else{
                is_registered = "True"
                registration_approved = "False"
               }
               var today = new Date().getTime();
               var start_date_time = 0;
               var dutch_end_date_time = 0;
               var sealed_start_date_time = 0;
               var sealed_end_date_time = 0;
               var english_start_date_time = 0;
                var end_date_time = 0;
                socket_start_date = null;
                socket_dutch_end_date = null;
                socket_sealed_start_date = null;
                socket_sealed_end_date = null;
                socket_english_start_date = null;
                socket_end_date = null;
                auction_status_id = data.data.auction_status;
                listing_status_id = data.data.listing_status_id;
               if(typeof(data.data.start_date) != 'undefined'){
                var new_start_date = getLocalDate(data.data.start_date, 'm j, Y','');
                start_date_time = new Date(new_start_date).getTime();
                socket_start_date = start_date_time;
               }
               if(typeof(data.data.dutch_end_time) != 'undefined'){
                var new_dutch_end_date = getLocalDate(data.data.dutch_end_time, 'm j, Y','');
                dutch_end_date_time = new Date(new_dutch_end_date).getTime();
                socket_dutch_end_date = dutch_end_date_time;
               }
               if(typeof(data.data.sealed_start_time) != 'undefined'){
                var new_sealed_start_date = getLocalDate(data.data.sealed_start_time, 'm j, Y','');
                sealed_start_date_time = new Date(new_sealed_start_date).getTime();
                socket_sealed_start_date = sealed_start_date_time;
               }
               if(typeof(data.data.sealed_end_time) != 'undefined'){
                var new_sealed_end_date = getLocalDate(data.data.sealed_end_time, 'm j, Y','');
                sealed_end_date_time = new Date(new_sealed_end_date).getTime();
                socket_sealed_end_date = sealed_end_date_time;
               }
               if(typeof(data.data.english_start_time) != 'undefined'){
                var new_english_start_date = getLocalDate(data.data.english_start_time, 'm j, Y','');
                english_start_date_time = new Date(new_english_start_date).getTime();
                socket_english_start_date = english_start_date_time;
               }
               if(typeof(data.data.end_date) != 'undefined'){
                var new_end_date = getLocalDate(data.data.end_date, 'm j, Y','');
                end_date_time = new Date(new_end_date).getTime();
                socket_end_date = end_date_time;
               }
               if(today > socket_sealed_end_date){
                    $('#current_auction').val('english_auction');
               }else{
                    $('#current_auction').val('sealed_auction');
               }
                $('#bidNowFormSection').hide();
                $('#preFinalBiddingSection').hide();
                $('#insiderAuctionSection').show();
                //$('#preFinalBiddingSection_bid_count').show();
                $('#finalBiddingSection').hide();
                $('#finalBiddingSection_bid_count').hide();
                $('#finalBiddingLostSection').hide();
                $('#finalBiddingLostSection_bid_count').hide();
                //changing reserve met text on behalf of setting at different level
                if((typeof(data.data.show_reserve_not_met) != 'undefined' && (data.data.show_reserve_not_met == true || data.data.show_reserve_not_met == false))){
                    //check setting at listing level
                    var show_reserve_not_met = data.data.show_reserve_not_met;
                }else if((typeof(data.data.agent_reserve_not_met) != 'undefined' && (data.data.agent_reserve_not_met == true || data.data.agent_reserve_not_met == false))){
                    //check setting at agent level
                    var show_reserve_not_met = data.data.agent_reserve_not_met;
                }else if((typeof(data.data.global_reserve_not_met) != 'undefined' && (data.data.global_reserve_not_met == true || data.data.global_reserve_not_met == false))){
                    //check setting at global level
                    var show_reserve_not_met = data.data.global_reserve_not_met;
                }else{
                    var show_reserve_not_met = false;
                }
                if(show_reserve_not_met){
                    if(typeof(data.data.reserve_amount) != 'undefined' && (data.data.reserve_amount == '' || data.data.reserve_amount == null)){
                        $('#reserve_text_span').removeClass('badge-success').addClass('badge-danger').html('No Reserve');
                        //$('#reserve_text_block').html('1. At the conclusion of the auction the Highest Bid will be sent to the seller for approval. <br>2. Sells to the highest bidder. Not subject to seller approval.');
                        $('#reserve_text_block').html('At the conclusion of the auction the Highest Bid will be sent to the seller for approval.');
                        $('#reserve_text_span').parent().show();
                    }else if(parseInt(data.data.high_bid_amt) >= parseInt(data.data.reserve_amount)){
                        $('#reserve_text_span').removeClass('badge-danger').addClass('badge-success').html('Reserve Met');
                        $('#reserve_text_block').html('Sells to the highest bidder. Not subject to seller approval.');
                        $('#reserve_text_span').parent().show();
                    }else{
                        $('#reserve_text_span').removeClass('badge-success').addClass('badge-danger').html('Reserve Not Met');
                        $('#reserve_text_block').html('The reserve price is confidential and will not be shown. Once the reserve price is met it will be displayed. At the conclusion of the auction, the seller may negotiate with the bidders if the reserve price isn’t met.');
                        $('#reserve_text_span').parent().show();
                    }
                }else{
                    $('#reserve_text_span').removeClass('badge-success').addClass('badge-danger').html('No Reserve');
                    //$('#reserve_text_block').html('1. At the conclusion of the auction the Highest Bid will be sent to the seller for approval. <br>2. Sells to the highest bidder. Not subject to seller approval.');
                    $('#reserve_text_block').html('At the conclusion of the auction the Highest Bid will be sent to the seller for approval.');
                    $('#reserve_text_span').parent().show();
                }
                if(typeof(data.data.bid_count) != 'undefined' && data.data.bid_count){
                    if(session_user_id != "" && session_user_id != 0){
                        if(parseInt(session_user_id) == parseInt(data.data.max_bidder_user_id) && today > end_date_time){
                            $('.bidcount').html('<h6><span>View Bids: <a class="blue-text" href="javascript:void(0)" onclick="view_property_bids(\''+property_id+'\')">'+data.data.bid_count+'</a></span></h6>');
                        }else{
                            $('.bidcount').html('<h6><span>View Bids: <a class="blue-text" href="javascript:void(0)" onclick="view_property_bids(\''+property_id+'\')">'+data.data.bid_count+'</a></span></h6>');
                        }
                    }else{
                        $('.bidcount').html('<h6><span>View Bids: <a class="blue-text" href="/login?next=/asset-details/?property_id='+property_id+'">'+data.data.bid_count+'</a></span></h6>');
                    }
                }
                var icon_img = "/static/"+templete_dir+"/images/info-red.png";
                $('#insider_bid_increment').html('<h6><span>Min Bid Increment: <em>$'+bid_increments+'</em> <div class="tooltipPop"><i class="fas fa-info-circle"></i></div></span><div class="tooltipPopdesc"><div class="uparrow"></div><div class="popcontent">The lowest amount needed to become the next highest bid during the auction. We do not believe in the process of max bids or also known as automatic proxy bidding. <br>For example, if the current highest bid is $100,000 and the minimum bid increment is set to $1,000, the next acceptable highest bid would be $101,000 <b>Or</b> if the current highest bid is $100,000 and the minimum bid increment is set to $1,000, and you decide to go above the minimum bid increment and manually enter $125,000 then the next acceptable highest bid would be $126,000. </div> </div></h6>');
                //$('#registerBidBtn').addClass('btn-secondary').removeClass('btn-primary-bdr').removeClass('approval_pending');
               if(session_user_id){
                    //when user logged in
                    if(typeof(data.data.listing_status_id) != 'undefined' && data.data.listing_status_id != null  && data.data.auction_status == 1 && data.data.listing_status_id == 1){
                    if((today >= start_date_time && today <= end_date_time && is_approved == 1 && (is_reviewed == false || is_reviewed == true)) || (today < start_date_time && is_approved == 1 && (is_reviewed == false || is_reviewed == true)) || (today < start_date_time && is_approved == 2 && is_reviewed == false) || (today >= start_date_time && today <= end_date_time && is_approved == 2 && is_reviewed == false)){
                        //when bidding started and registraton approval in pending state insiderRegisterBidBtn
                        $('#insiderRegisterBidBtn').html('Registration Pending Approval').css('cursor','initial');
                        $('#insiderRegisterBidBtn').show();
                        $('#insiderRegisterBidBtn').attr('href','javascript:void(0)');
                        $('#insiderDutchBidBtn').attr('href','javascript:void(0)');
                        $('#insiderDutchBidBtn').hide();

                        $('#bidder_msg_section').hide();
                        //$('#auction_starting_bid').html('$'+start_bid_formated+'<span>Starting Bid</span>');
                        $('#insiderbidNowFormSection').hide();
                        $('#insiderBiddingWonSection').hide();
                        $('#englishAuctionBidIncSection').hide();
                        $('#insiderLostSectionBtn').hide();
                        $('#insiderBiddingLostSectionBidCount').hide();
                        if(today > start_date_time && today < dutch_end_date_time){
                            // start_bid_formated
                            if(data.data.dutch_winning_amount){
                                //$('#round_name').html('Round Two: Sealed Bid Auction');
                                $('#auction_starting_bid').html('<span>Round One Winner </span> $'+dutch_winning_amount_formatted);

                            }else{
                                //$('#round_name').html('Round One: Dutch Auction');
                                if(insider_decreased_price_formatted){
                                    $('#auction_starting_bid').html('$'+insider_decreased_price_formatted+'<span><i class="fas fa-arrow-down"></i> Price decrease</span> <em>Decrease Current  Bid Price</em>');
                                }else{
                                    $('#auction_starting_bid').html('$'+start_bid_formated+'<span><i class="fas fa-arrow-down"></i> Price decrease</span> <em>Decrease Current  Bid Price</em>');
                                }
                            }
                        }else if(today > dutch_end_date_time && today < sealed_start_date_time){
                            //$('#round_name').html('Round Two: Sealed Bid Auction');
                            $('#auction_starting_bid').html('<span>Round One Winner </span> $'+dutch_winning_amount_formatted);
                            $('#header_bid_price').html('<span>Current Bid</span>$'+dutch_winning_amount_formatted);

                        }else if(today > sealed_start_date_time && today < sealed_end_date_time){
                            //$('#round_name').html('Round Two: Sealed Bid Auction');
                            $('#insider_new_bid_amt').val('$'+sealed_next_bid_formatted);

                            $('#auction_starting_bid').html('$'+sealed_current_bid_formatted+'<span>Current Bid</span>');
                            $('#header_bid_price').html('<span>Current Bid</span>$'+sealed_current_bid_formatted);


                        }else if(today > sealed_end_date_time && today < english_start_date_time){
                            $('#auction_starting_bid').html('<span>Round Two Winner</span> $'+highest_amount_formatted);
                            $('#header_bid_price').html('<span>Current Bid</span>$'+highest_amount_formatted);

                        }else if(today > english_start_date_time && today < end_date_time){
                            $('#auction_starting_bid').html('$'+highest_amount_formatted+'<span>Current Bid</span>');
                            $('#header_bid_price').html('<span>Current Bid</span>$'+highest_amount_formatted);

                        }else{
                            //$('#round_name').html('Round One:Dutch Auction');
                            $('#auction_starting_bid').html('$'+start_bid_formated+'<span>Starting Bid</span>');
                            $('#header_bid_price').html('<span>Start Bid</span>$'+start_bid_formated);
                        }
                  }else if(is_approved == 3 || is_approved == 4){
                    //when registration declined
                    if(is_approved == 3){
                        $('#insiderRegisterBidBtn').html('Registration Declined').css('cursor','initial');

                    }else{
                        $('#insiderRegisterBidBtn').html('Not Interested').css('cursor','initial');
                    }
                    $('#insiderRegisterBidBtn').show();
                    $('#insiderRegisterBidBtn').attr('href','javascript:void(0)');
                    $('#insiderDutchBidBtn').attr('href','javascript:void(0)');
                    $('#insiderDutchBidBtn').hide();
                    $('#insider_bidder_msg_section').hide();
                    //$('#auction_starting_bid').html(start_bid_formated+'<span>Starting Bid</span>');
                    $('#insiderbidNowFormSection').hide();
                    $('#insiderBiddingWonSection').hide();
                    $('#englishAuctionBidIncSection').hide();
                    $('#insiderLostSectionBtn').hide();
                    $('#insiderBiddingLostSectionBidCount').hide();
                    if(today > start_date_time && today < dutch_end_date_time){
                        // start_bid_formated
                        if(data.data.dutch_winning_amount){
                            //$('#round_name').html('Round Two: Sealed Bid Auction');
                            $('#auction_starting_bid').html('<span>Round One Winner </span> $'+dutch_winning_amount_formatted);

                        }else{
                            //$('#round_name').html('Round One: Dutch Auction');
                            if(insider_decreased_price_formatted){
                                $('#auction_starting_bid').html('$'+insider_decreased_price_formatted+'<span><i class="fas fa-arrow-down"></i> Price decrease</span> <em>Decrease Current  Bid Price</em>');
                            }else{
                                $('#auction_starting_bid').html('$'+start_bid_formated+'<span><i class="fas fa-arrow-down"></i> Price decrease</span> <em>Decrease Current  Bid Price</em>');
                            }
                        }
                    }else if(today > dutch_end_date_time && today < sealed_start_date_time){
                        //$('#round_name').html('Round Two: Sealed Bid Auction');
                        $('#auction_starting_bid').html('<span>Round One Winner </span> $'+dutch_winning_amount_formatted);
                        $('#header_bid_price').html('<span>Current Bid</span>$'+dutch_winning_amount_formatted);

                    }else if(today > sealed_start_date_time && today < sealed_end_date_time){
                        //$('#round_name').html('Round Two: Sealed Bid Auction');
                        $('#insider_new_bid_amt').val('$'+sealed_next_bid_formatted);

                        $('#auction_starting_bid').html('$'+sealed_current_bid_formatted+'<span>Current Bid</span>');
                        $('#header_bid_price').html('<span>Current Bid</span>$'+sealed_current_bid_formatted);


                    }else if(today > sealed_end_date_time && today < english_start_date_time){
                        $('#auction_starting_bid').html('<span>Round Two Winner</span> $'+highest_amount_formatted);
                        $('#header_bid_price').html('<span>Current Bid</span>$'+highest_amount_formatted);

                    }else if(today > english_start_date_time && today < end_date_time){
                        $('#auction_starting_bid').html('$'+highest_amount_formatted+'<span>Current Bid</span>');
                        $('#header_bid_price').html('<span>Current Bid</span>$'+highest_amount_formatted);

                    }else{
                        //$('#round_name').html('Round One:Dutch Auction');
                        $('#auction_starting_bid').html('$'+start_bid_formated+'<span>Starting Bid</span>');
                        $('#header_bid_price').html('<span>Start Bid</span>$'+start_bid_formated);
                    }
                  }else if(today >= start_date_time && today <= end_date_time  && is_approved == 2 && is_reviewed == true){
                        $('#insiderLostSectionBtn').hide();
                        $('#insiderBiddingLostSectionBidCount').hide();
                        console.log("english_start_date_time");
                        console.log(english_start_date_time);
                        //when bidding started and registraton approved
                        if(today > start_date_time && today < dutch_end_date_time){
                            $('#insider_bidder_msg_section').hide();
                            // start_bid_formated
                            if(data.data.dutch_winning_amount){
                                //$('#round_name').html('Round Two: Sealed Bid Auction');
                                $('#auction_starting_bid').html('<span>Round One Winner </span> $'+dutch_winning_amount_formatted);
                                $('#insiderDutchBidBtn').hide();

                            }else{

                                //$('#round_name').html('Round One: Dutch Auction');
                                if(insider_decreased_price_formatted){
                                    $('#auction_starting_bid').html('$'+insider_decreased_price_formatted+'<span><i class="fas fa-arrow-down"></i> Price decrease</span> <em>Decrease Current  Bid Price</em>');
                                }else{
                                    $('#auction_starting_bid').html('$'+start_bid_formated+'<span><i class="fas fa-arrow-down"></i> Price decrease</span> <em>Decrease Current  Bid Price</em>');
                                }
                                $('#insiderbidNowFormSection').hide();
                                $('#insiderDutchBidBtn').show();
                            }

                        }else if(today > dutch_end_date_time && today < sealed_start_date_time){
                            //$('#round_name').html('Round Two: Sealed Bid Auction');
                            $('#auction_starting_bid').html('<span>Round One Winner </span> $'+dutch_winning_amount_formatted);
                            $('#insiderDutchBidBtn').hide();
                            $('#header_bid_price').html('<span>Current Bid</span>$'+dutch_winning_amount_formatted);
                            if(parseInt(data.data.dutch_winning_user_id) == parseInt(session_user_id)){
                                $('#insider_bidder_msg').removeClass('badge-danger').addClass('badge-success').html('<i class="fas fa-check-circle"></i> You are the winner of Round One so you can\'t participate in Sealed Bid Auction.Please wait for English Auction.');
                                $('#insider_bidder_msg_section').show();
                            }else{
                                $('#insider_bidder_msg_section').hide();
                            }
                        }else if(today > sealed_start_date_time && today < sealed_end_date_time){
                            //$('#round_name').html('Round Two: Sealed Bid Auction');
                            $('#insider_new_bid_amt').val('$'+sealed_next_bid_formatted);
                            if(parseInt(data.data.dutch_winning_user_id) != parseInt(session_user_id) && data.data.sealed_user_bid_count && parseInt(data.data.sealed_user_bid_count) > 0){
                                $('#header_bid_price').html('<span>Current Bid</span>$'+sealed_current_bid_formatted);
                            }else{
                                $('#header_bid_price').html('<span>Starting Bid</span>$'+sealed_current_bid_formatted);
                            }


                            if(parseInt(data.data.dutch_winning_user_id) != parseInt(session_user_id) && data.data.sealed_user_bid_count && parseInt(data.data.sealed_user_bid_count) > 0){
                                $('#auction_starting_bid').html('$'+sealed_current_bid_formatted+'<span>Your Current Bid</span>');
                            }else{
                                if(parseInt(data.data.dutch_winning_user_id) == parseInt(session_user_id)){
                                    $('#auction_starting_bid').html('<span>Round One Winner </span> $'+dutch_winning_amount_formatted);
                                }else{
                                    $('#auction_starting_bid').html('$'+sealed_current_bid_formatted+'<span>Starting Bid</span>');
                                }

                            }

                            $('#insiderDutchBidBtn').hide();

                            if(parseInt(data.data.dutch_winning_user_id) == parseInt(session_user_id)){
                                $('#insiderbidNowFormSection').hide();
                                $('#insider_bidder_msg').removeClass('badge-danger').addClass('badge-success').html('<i class="fas fa-check-circle"></i> You are the winner of Round One so you can\'t participate in Sealed Bid Auction.Please wait for English Auction.');
                                $('#insider_bidder_msg_section').show();
                            }else{
                                $('#insiderbidNowFormSection').show();
                                //$('#insider_bidder_msg').removeClass('badge-danger').addClass('badge-success').html('<i class="fas fa-check-circle"></i> You are the winner of Round One so you can\'t participate in Sealed Bid Auction.');
                                $('#insider_bidder_msg_section').hide();
                            }

                        }else if(today > sealed_end_date_time && today < english_start_date_time){
                            counter_round_two_modal = 0;
                            $('#auction_starting_bid').html('<span>Round Two Winner</span> $'+sealed_winning_amount_formatted);
                            $('#header_bid_price').html('<span>Current Bid</span>$'+sealed_winning_amount_formatted);
                            $('#insiderbidNowFormSection').hide();
                            $('#insider_bidder_msg_section').hide();
                            if(parseInt(data.data.sealed_winning_user_id) == parseInt(session_user_id)){
                                $('#insider_bidder_msg').removeClass('badge-danger').addClass('badge-success').html('<i class="fas fa-check-circle"></i> You are the winner of Round Two.Please wait for English Auction.');
                                $('#insider_bidder_msg_section').show();
                            }
                            if(data.data.sealed_winning_user_id && parseInt(data.data.sealed_winning_user_id) == parseInt(session_user_id) && counter_round_two_modal == 0){
                                counter_round_two_modal = parseInt(counter_round_two_modal)+1;
                                $('#sealed_winning_amount').html('Second Round Winning Bid Amount <strong>$'+sealed_winning_amount_formatted+'</strong>');
                                $('#roundTwoModal').modal('show');
                            }else{
                                $('#roundTwoModal').modal('hide');
                            }
                        }else if(today > english_start_date_time && today < end_date_time){
                            $('#insider_new_bid_amt').val('$'+english_next_bid_formatted);
                            $('#insider_increment_decrement_by').val(data.data.bid_increments);
                            /*if(data.data.english_user_bid_count && parseInt(data.data.english_user_bid_count) > 0){
                                $('#auction_starting_bid').html('$'+english_current_bid_formatted+'<span>Current Bid</span>');
                                $('#header_bid_price').html('<span>Current Bid</span>$'+english_current_bid_formatted);
                            }else{
                                $('#auction_starting_bid').html('$'+english_current_bid_formatted+'<span>Starting Bid</span>');
                                $('#header_bid_price').html('<span>Starting Bid</span>$'+english_current_bid_formatted);
                            }*/
                            $('#auction_starting_bid').html('$'+english_current_bid_formatted+'<span>Current Bid</span>');
                            $('#header_bid_price').html('<span>Current Bid</span>$'+english_current_bid_formatted);
                            if(parseInt(session_user_id) == parseInt(data.data.dutch_winning_user_id) || parseInt(session_user_id) == parseInt(data.data.sealed_winning_user_id)){
                                $('#insiderbidNowFormSection').show();
                                $('#englishAuctionBidIncSection').show();
                            }else{
                                $('#insiderbidNowFormSection').hide();
                                $('#englishAuctionBidIncSection').hide();
                            }
                            if((data.data.dutch_winning_user_id && parseInt(data.data.dutch_winning_user_id) == parseInt(session_user_id)) || (data.data.sealed_winning_user_id && parseInt(data.data.sealed_winning_user_id) == parseInt(session_user_id))){
                                if(parseInt(session_user_id) == parseInt(data.data.max_bidder_user_id) && parseInt(data.data.bid_count) > parseInt(data.data.bid_count_sealed_step)){
                                    $('#insider_bidder_msg').addClass('badge-success').removeClass('badge-danger').html('<i class="fas fa-check-circle"></i> You Have Highest Bid.');
                                }else if(parseInt(session_user_id) == parseInt(data.data.sealed_winning_user_id) && parseInt(data.data.bid_count) == parseInt(data.data.bid_count_sealed_step)){
                                    $('#insider_bidder_msg').addClass('badge-success').removeClass('badge-danger').html('<i class="fas fa-check-circle"></i> You Have Highest Bid.');
                                }else{
                                    $('#insider_bidder_msg').removeClass('badge-success').addClass('badge-danger').html('<i class="fas fa-exclamation-triangle"></i> You Are Out Bidded.');
                                }
                                $('#insider_bidder_msg_section').show();
                            }else{
                                $('#insider_bidder_msg_section').hide();
                            }

                        }else{
                            //$('#round_name').html('Round One:Dutch Auction');
                            $('#auction_starting_bid').html('$'+start_bid_formated+'<span>Starting Bid</span>');
                            $('#header_bid_price').html('<span>Start Bid</span>$'+start_bid_formated);
                            $('#insiderDutchBidBtn').hide();
                            $('#insider_bidder_msg_section').hide();
                        }
                        $('#insiderRegisterBidBtn').hide();
                        $('#insiderRegisterBidBtn').attr('href','javascript:void(0)');

                  }else if(today < start_date_time && is_approved == 2 && is_reviewed == true){
                        //when bidding not started and registraton approved
                        $('#insiderRegisterBidBtn').html('Auction Has Not Started').css('cursor','initial');
                        $('#insiderRegisterBidBtn').show();
                        $('#insiderRegisterBidBtn').attr('href','javascript:void(0)');
                        $('#insider_bidder_msg').removeClass('badge-danger').addClass('badge-success').html('<i class="fas fa-check-circle"></i> Registration Approved But Auction Not Started Yet.');
                        $('#insider_bidder_msg_section').show();
                        $('#auction_starting_bid').html('$'+start_bid_formated+'<span>Starting Bid</span>');
                        $('#insiderDutchBidBtn').hide();
                        $('#insiderbidNowFormSection').hide();
                        $('#insiderBiddingWonSection').hide();
                        $('#englishAuctionBidIncSection').hide();
                        $('#insiderLostSectionBtn').hide();
                        $('#insiderBiddingLostSectionBidCount').hide();
                  }else if(today > end_date_time){
                        $('#insiderDutchBidBtn').hide();
                        $('#insiderbidNowFormSection').hide();
                        $('#englishAuctionBidIncSection').hide();
                        $('#finalBiddingSection').hide();
                        $('#finalBiddingSection_bid_count').hide();
                        $('#lostSectionBtn').html(closing_status).hide();
                        $('#finalBiddingLostSection').hide();
                        $('#finalBiddingLostSection_bid_count').hide();
                        $('#preFinalBiddingSection').hide();
                        $('#preFinalBiddingSection_bid_count').hide();
                        $('#registerBidBtn').hide();
                        $('#insiderRegisterBidBtn').hide();
                        $('#insiderDutchBidBtn').hide();
                        $('#insiderAuctionSection').show();
                        if(data.data.listing_status_id == 9 && parseInt(session_user_id) == parseInt(data.data.max_bidder_user_id)){
                            $('#finalBiddingLostSection').hide();
                            $('#finalBiddingLostSection_bid_count').hide();
                            $('#insiderWonSectionBtn').html(closing_status).show();
                            $('#insiderLostSectionBtn').hide();
                            $('#insiderBiddingWonSection').show();
                            $('#insider_bidder_msg_section').hide();
                            $('#insiderBiddingLostSectionBidCount').hide();
                        }else{
                            if(parseInt(session_user_id) == parseInt(data.data.max_bidder_user_id)){
                                $('#insider_bidder_msg').addClass('badge-success').removeClass('badge-danger').html('<i class="fas fa-check-circle"></i> You Have Highest Bid.');
                            }else{
                                $('#insider_bidder_msg').removeClass('badge-success').addClass('badge-danger').html('<i class="fas fa-exclamation-triangle"></i> Out Bid.');
                            }
                            $('#finalBiddingSection').hide();
                            $('#finalBiddingSection_bid_count').hide();
                            $('#insiderLostSectionBtn').html(closing_status).show();
                            $('#insiderBiddingLostSectionBidCount').show();
                            $('#insider_bidder_msg_section').hide();
                            $('#insiderBiddingWonSection').hide();
                            $('#finalBiddingLostSection').hide();
                            $('#finalBiddingLostSection_bid_count').hide();
                        }
                        //clearInterval(x);
                  }else{
                        //default condition when no criteria matches
                        //$('#insiderRegisterBidBtn').html('Register For Auction').css('cursor','pointer');
                        //Login/Register to Bid
                        $('#insiderRegisterBidBtn').html('Register to Bid').css('cursor','pointer');
                        $('#insiderRegisterBidBtn').show();
                        var bidder_reg_url = '/bid-registration/?property='+property_id;
                        $('#insiderRegisterBidBtn').attr('href',bidder_reg_url);
                        $('#insider_bidder_msg_section').hide();
                        $('#insiderDutchBidBtn').hide();
                        $('#insiderbidNowFormSection').hide();
                        $('#insiderBiddingWonSection').hide();
                        $('#englishAuctionBidIncSection').hide();
                        $('#insiderLostSectionBtn').hide();
                        $('#insiderBiddingLostSectionBidCount').hide();

                        if(today > start_date_time && today < dutch_end_date_time){
                            // start_bid_formated
                            if(data.data.dutch_winning_amount){
                                //$('#round_name').html('Round Two: Sealed Bid Auction');
                                $('#auction_starting_bid').html('<span>Round One Winner </span> $'+dutch_winning_amount_formatted);

                            }else{
                                //$('#round_name').html('Round One: Dutch Auction');
                                if(insider_decreased_price_formatted){
                                    $('#auction_starting_bid').html('$'+insider_decreased_price_formatted+'<span><i class="fas fa-arrow-down"></i> Price decrease</span> <em>Decrease Current  Bid Price</em>');
                                }else{
                                    $('#auction_starting_bid').html('$'+start_bid_formated+'<span><i class="fas fa-arrow-down"></i> Price decrease</span> <em>Decrease Current  Bid Price</em>');
                                }
                            }
                        }else if(today > dutch_end_date_time && today < sealed_start_date_time){
                            //$('#round_name').html('Round Two: Sealed Bid Auction');
                            $('#auction_starting_bid').html('<span>Round One Winner </span> $'+dutch_winning_amount_formatted);
                            $('#header_bid_price').html('<span>Current Bid</span>$'+dutch_winning_amount_formatted);

                        }else if(today > sealed_start_date_time && today < sealed_end_date_time){
                            //$('#round_name').html('Round Two: Sealed Bid Auction');
                            $('#insider_new_bid_amt').val('$'+sealed_next_bid_formatted);

                            $('#auction_starting_bid').html('$'+sealed_current_bid_formatted+'<span>Current Bid</span>');
                            $('#header_bid_price').html('<span>Current Bid</span>$'+sealed_current_bid_formatted);


                        }else if(today > sealed_end_date_time && today < english_start_date_time){
                            $('#auction_starting_bid').html('<span>Round Two Winner</span> $'+highest_amount_formatted);
                            $('#header_bid_price').html('<span>Current Bid</span>$'+highest_amount_formatted);

                        }else if(today > english_start_date_time && today < end_date_time){
                            $('#auction_starting_bid').html('$'+highest_amount_formatted+'<span>Current Bid</span>');
                            $('#header_bid_price').html('<span>Current Bid</span>$'+highest_amount_formatted);

                        }else{
                            //$('#round_name').html('Round One:Dutch Auction');
                            $('#auction_starting_bid').html('$'+start_bid_formated+'<span>Starting Bid</span>');
                            $('#header_bid_price').html('<span>Start Bid</span>$'+start_bid_formated);
                        }

                  }

                }else if(typeof(data.data.listing_status_id) != 'undefined' && data.data.listing_status_id != null  && data.data.listing_status_id == 9){
                    if(data.data.closing_statuss_name){
                        var closing_status = data.data.closing_statuss_name;
                    }else{
                        var closing_status = data.data.listing_status_name;
                    }
                    if(data.data.max_bidder_user_id){
                        $('#auction_starting_bid').html('$'+highest_amount_formatted+'<span>Current Bid</span>');
                    }else{
                         $('#auction_starting_bid').html('$'+start_bid_formated+'<span>Starting Bid</span>');
                    }
                    $('#listing_status').html(closing_status);
                    //new condition end
                    $('#insiderDutchBidBtn').hide();
                        $('#insiderbidNowFormSection').hide();
                        $('#englishAuctionBidIncSection').hide();
                        $('#finalBiddingSection').hide();
                        $('#finalBiddingSection_bid_count').hide();
                        $('#lostSectionBtn').html(closing_status).hide();
                        $('#finalBiddingLostSection').hide();
                        $('#finalBiddingLostSection_bid_count').hide();
                        $('#preFinalBiddingSection').hide();
                        $('#preFinalBiddingSection_bid_count').hide();
                        $('#registerBidBtn').hide();
                        $('#insiderRegisterBidBtn').hide();
                        $('#insiderDutchBidBtn').hide();
                        $('#insiderAuctionSection').show();
                        if(data.data.listing_status_id == 9 && parseInt(session_user_id) == parseInt(data.data.max_bidder_user_id)){
                            $('#finalBiddingLostSection').hide();
                            $('#finalBiddingLostSection_bid_count').hide();
                            $('#insiderWonSectionBtn').html(closing_status).show();
                            $('#insiderLostSectionBtn').hide();
                            $('#insiderBiddingWonSection').show();
                            $('#insider_bidder_msg_section').hide();
                            $('#insiderBiddingLostSectionBidCount').hide();
                        }else{
                            if(parseInt(session_user_id) == parseInt(data.data.max_bidder_user_id)){
                                $('#insider_bidder_msg').addClass('badge-success').removeClass('badge-danger').html('<i class="fas fa-check-circle"></i> You Have Highest Bid.');

                            }else{
                                $('#insider_bidder_msg').removeClass('badge-success').addClass('badge-danger').html('<i class="fas fa-exclamation-triangle"></i> Out Bid.');
                            }
                            $('#finalBiddingSection').hide();
                            $('#finalBiddingSection_bid_count').hide();
                            $('#insiderLostSectionBtn').html(closing_status).show();
                            $('#insiderBiddingLostSectionBidCount').show();
                            $('#insider_bidder_msg_section').hide();
                            $('#insiderBiddingWonSection').hide();
                            $('#finalBiddingLostSection').hide();
                            $('#finalBiddingLostSection_bid_count').hide();
                        }
                }else{
                    $('.lost_sec_msg').hide();
                    if(parseInt(session_user_id) == parseInt(data.data.max_bidder_user_id)){
                        $('#insider_bidder_msg').addClass('badge-success').removeClass('badge-danger').html('<i class="fas fa-check-circle"></i> You Have Highest Bid.');

                    }else{
                        $('#insider_bidder_msg').removeClass('badge-success').addClass('badge-danger').html('<i class="fas fa-exclamation-triangle"></i> Out Bid.');

                    }
                    if(data.data.max_bidder_user_id){
                        $('#auction_starting_bid').html('$'+highest_amount_formatted+'<span>Current Bid</span>');
                    }else{
                         $('#auction_starting_bid').html('$'+start_bid_formated+'<span>Starting Bid</span>');
                    }
                    $('#preFinalBiddingSection').hide();
                    $('#preFinalBiddingSection_bid_count').hide();
                    $('#listing_status').html(listing_status_name);
                    $('#registerBidBtn').hide();
                    $('#finalBiddingSection').hide();
                    $('#finalBiddingSection_bid_count').hide();
                    $('#lostSectionBtn').hide();
                    $('#insiderLostSectionBtn').html(data.data.listing_status_name);
                    $('#insiderLostSectionBtn').show();
                    $('#insiderBiddingLostSectionBidCount').show();
                    $('#insiderDutchBidBtn').hide();
                    $('#insiderRegisterBidBtn').hide();
                    $('#finalBiddingLostSection').hide();
                    $('#finalBiddingLostSection_bid_count').hide();
                    $('#bidder_msg_section').hide();
                    $('#insider_bidder_msg_section').hide();
                    $('#insiderAuctionSection').show();
                    $('#insiderbidNowFormSection').hide();
                    $('#insiderBiddingWonSection').hide();
                    $('#englishAuctionBidIncSection').hide();
                }

           }else{
            //when user not logged in
              if(today < end_date_time && typeof(data.data.listing_status_id) != 'undefined' && data.data.listing_status_id != null  && data.data.listing_status_id == 1 && data.data.auction_status == 1){
                    $('#registerBidBtn').html('Register For Auction').css('cursor','pointer');
                    $('#registerBidBtn').attr('href','javascript:void(0)');
                    $('#registerBidBtn').hide();

                    $('#insiderRegisterBidBtn').html('Register For Auction').css('cursor','pointer');
                    $('#insiderRegisterBidBtn').show();
                    var bidder_reg_url = '/login/?next=/asset-details/?property_id='+property_id;
                    $('#insiderRegisterBidBtn').attr('href',bidder_reg_url);
                    $('#bidder_msg_section').hide();
                    $('#insiderbidNowFormSection').hide();
                    $('#insider_bidder_msg_section').hide();
                    $('#insiderDutchBidBtn').hide();
                    $('#insiderBiddingWonSection').hide();
                    $('#englishAuctionBidIncSection').hide();
                    $('#insiderLostSectionBtn').hide();
                    $('#insiderBiddingLostSectionBidCount').hide();
                    if(today > start_date_time && today < dutch_end_date_time){
                        // start_bid_formated
                        if(data.data.dutch_winning_amount){
                            //$('#round_name').html('Round Two: Sealed Bid Auction');
                            $('#auction_starting_bid').html('<span>Round One Winner </span> $'+dutch_winning_amount_formatted);

                        }else{
                            //$('#round_name').html('Round One: Dutch Auction');
                            if(insider_decreased_price_formatted){
                                $('#auction_starting_bid').html('$'+insider_decreased_price_formatted+'<span><i class="fas fa-arrow-down"></i> Price decrease</span> <em>Decrease Current  Bid Price</em>');
                            }else{
                                $('#auction_starting_bid').html('$'+start_bid_formated+'<span><i class="fas fa-arrow-down"></i> Price decrease</span> <em>Decrease Current  Bid Price</em>');
                            }
                        }

                    }else if(today > dutch_end_date_time && today < sealed_start_date_time){
                        //$('#round_name').html('Round Two: Sealed Bid Auction');
                        $('#auction_starting_bid').html('<span>Round One Winner </span> $'+dutch_winning_amount_formatted);
                        $('#header_bid_price').html('<span>Current Bid</span>$'+dutch_winning_amount_formatted);

                    }else if(today > sealed_start_date_time && today < sealed_end_date_time){
                        //$('#round_name').html('Round Two: Sealed Bid Auction');
                        $('#insider_new_bid_amt').val('$'+sealed_next_bid_formatted);

                        $('#auction_starting_bid').html('$'+sealed_current_bid_formatted+'<span>Current Bid</span>');
                        $('#header_bid_price').html('<span>Current Bid</span>$'+sealed_current_bid_formatted);


                    }else if(today > sealed_end_date_time && today < english_start_date_time){
                        $('#auction_starting_bid').html('<span>Round Two Winner</span> $'+highest_amount_formatted);
                        $('#header_bid_price').html('<span>Current Bid</span>$'+highest_amount_formatted);

                    }else if(today > english_start_date_time && today < end_date_time){
                        $('#auction_starting_bid').html('$'+highest_amount_formatted+'<span>Current Bid</span>');
                        $('#header_bid_price').html('<span>Current Bid</span>$'+highest_amount_formatted);

                    }else{
                        //$('#round_name').html('Round One:Dutch Auction');
                        $('#auction_starting_bid').html('$'+start_bid_formated+'<span>Starting Bid</span>');
                        $('#header_bid_price').html('<span>Start Bid</span>$'+start_bid_formated);
                    }
              }else{
                $('#preFinalBiddingSection').hide();
                $('#preFinalBiddingSection_bid_count').hide();
                $('#registerBidBtn').hide();
                if(data.data.closing_statuss_name){
                    var closing_status = data.data.closing_statuss_name;
                }else{
                    var closing_status = data.data.listing_status_name;
                }
                if(data.data.max_bidder_user_id){
                    $('#auction_starting_bid').html('$'+highest_amount_formatted+'<span>Current Bid</span>');
                }else{
                     $('#auction_starting_bid').html('$'+start_bid_formated+'<span>Starting Bid</span>');
                }
                $('#listing_status').html(closing_status);
                $('#finalBiddingSection').hide();
                $('#finalBiddingSection_bid_count').hide();
                $('#lostSectionBtn').html(closing_status);
                $('#lostSectionBtn').hide();
                $('#insiderLostSectionBtn').html(closing_status);
                $('#insiderLostSectionBtn').show();
                $('#insiderBiddingLostSectionBidCount').show();
                $('#insiderDutchBidBtn').hide();
                $('#insiderRegisterBidBtn').hide();
                $('#finalBiddingLostSection').hide();
                $('#finalBiddingLostSection_bid_count').hide();
                $('#bidder_msg_section').hide();
                $('.lost_sec_msg').hide();
                $('#insiderbidNowFormSection').hide();
                $('#insiderBiddingWonSection').hide();
                $('#englishAuctionBidIncSection').hide();
                $('#insiderAuctionSection').show();
              }
           }
           if(((today < start_date_time) || (today > start_date_time && today < dutch_end_date_time))){
                $('#round_name').html('Round One: Dutch Auction');
           }else if(today > dutch_end_date_time && today < sealed_end_date_time){
                $('#round_name').html('Round Two: Sealed Bid Auction');
           }else{
                $('#round_name').html('Round Three: English Auction');
           }

              //condition to show/hide reserve text
              if(typeof(data.data.start_date) != 'undefined' && typeof(data.data.end_date) != 'undefined'){
                var local_start_date = getLocalDate(data.data.start_date, 'm j, Y','');
                countDownDate = new Date(local_start_date).getTime();
                var local_date = getLocalDate(data.data.end_date, 'm j, Y','');
                countDownEndDate = new Date(local_date).getTime();

                var local_dutch_end_date = getLocalDate(data.data.dutch_end_time, 'm j, Y','');
                countDownDutchEndDate = new Date(local_dutch_end_date).getTime();
                var local_sealed_start_date = getLocalDate(data.data.sealed_start_time, 'm j, Y','');
                countDownSealedStartDate = new Date(local_sealed_start_date).getTime();
                var local_sealed_end_date = getLocalDate(data.data.sealed_end_time, 'm j, Y','');
                countDownSealedEndDate = new Date(local_sealed_end_date).getTime();
                var local_english_start_date = getLocalDate(data.data.english_start_time, 'm j, Y','');
                countDownEnglishStartDate = new Date(local_english_start_date).getTime();

                try{
                    //clearInterval(x);
                }catch(ex){
                    //console.log(ex);
                }
                if(typeof(listing_status_id) != 'undefined' && listing_status_id != null  && auction_status_id == 1 && listing_status_id == 1){
                    if(today < start_date_time){
                        $('#countdown_text').html('Bidding Starts In <div class="tooltipPop"><i class="fas fa-info-circle"></i></div>');
                    }else if(today >= start_date_time && today <= dutch_end_date_time){
                        $('#countdown_text').html('Bidding Ends In <div class="tooltipPop"><i class="fas fa-info-circle"></i></div>');
                    }else if(today >= dutch_end_date_time && today <= sealed_start_date_time){
                        $('#countdown_text').html('Bidding Starts In <div class="tooltipPop"><i class="fas fa-info-circle"></i></div>');
                    }else if(today >= sealed_start_date_time && today <= sealed_end_date_time){
                        $('#countdown_text').html('Bidding Ends In <div class="tooltipPop"><i class="fas fa-info-circle"></i></div>');
                    }else if(today >= sealed_end_date_time && today <= english_start_date_time){
                        $('#countdown_text').html('Bidding Starts In <div class="tooltipPop"><i class="fas fa-info-circle"></i></div>');
                    }else if(today >= english_start_date_time && today <= end_date_time){
                        $('#countdown_text').html('Bidding Ends In <div class="tooltipPop"><i class="fas fa-info-circle"></i></div>');
                    }else{
                        $('#countdown_text').html('Auction Completed <div class="tooltipPop"><i class="fas fa-info-circle"></i></div>');
                        $('#countdown_text').show();
                    }
                }else{
                    $('#countdown_text').html('Auction Completed <div class="tooltipPop"><i class="fas fa-info-circle"></i></div>');
                    $('#countdown_text').show();
                }
                var remain_time_add_extension = null;
                var time_extension = null;
                if(data.data.is_log_time_extension != null && data.data.is_log_time_extension == true && typeof(data.data.remain_time_to_add_extension) != 'undefined' && data.data.remain_time_to_add_extension != null && typeof(data.data.log_time_extension) != 'undefined' && data.data.log_time_extension != null){
                    remain_time_add_extension = data.data.remain_time_to_add_extension;
                    time_extension = data.data.log_time_extension;
                }else if(data.data.is_log_time_extension == null && data.data.agent_is_log_time_extension != null && data.data.agent_is_log_time_extension == true && typeof(data.data.agent_remain_time_to_add_extension) != 'undefined' && data.data.agent_remain_time_to_add_extension != null && typeof(data.data.agent_log_time_extension) != 'undefined' && data.data.agent_log_time_extension != null){
                    remain_time_add_extension = data.data.agent_remain_time_to_add_extension;
                    time_extension = data.data.agent_log_time_extension;
                }else if(data.data.is_log_time_extension == null && data.data.agent_is_log_time_extension == null &&  data.data.global_is_log_time_extension != null && data.data.global_is_log_time_extension == true && typeof(data.data.global_remain_time_to_add_extension) != 'undefined' && data.data.global_remain_time_to_add_extension != null && typeof(data.data.global_log_time_extension) != 'undefined' && data.data.global_log_time_extension != null){
                    remain_time_add_extension = data.data.global_remain_time_to_add_extension;
                    time_extension = data.data.global_log_time_extension;
                }
                if(time_extension && remain_time_add_extension){
                    var countdown_tooltip_text = 'If any bids are placed within the last <b class="red-text">'+remain_time_add_extension+' minutes</b> of the auction, the clock will automatically be reset to <b class="red-text">'+time_extension+' minutes</b>. Once the final <b class="red-text">'+remain_time_add_extension+' minutes</b> passes with no new bids placed the auction will end.';
                    $('#countdown_tooltip .popcontent').html(countdown_tooltip_text);
                }else{
                    $('#countdown_tooltip .popcontent').html('');
                    $('#countdown_tooltip').css('visibility','hidden');
                }
                if(typeof(data.data.time_flash) != 'undefined' && data.data.time_flash != null){
                    flash_time_sec = data.data.time_flash*60;
                    flash_time_milisec = flash_time_sec*1000;
                }else if(typeof(data.data.agent_time_flash) != 'undefined' && data.data.agent_time_flash != null){
                    flash_time_sec = data.data.agent_time_flash*60;
                    flash_time_milisec = flash_time_sec*1000;
                }else if(typeof(data.data.global_time_flash) != 'undefined' && data.data.global_time_flash != null){
                    flash_time_sec = data.data.global_time_flash*60;
                    flash_time_milisec = flash_time_sec*1000;
                }
                //$('#countdown_tooltip').html('<div class="uparrow"></div><div class="popcontent">If any bids are placed within the last <b class="red-text">2</b> minutes of the auction, the clock will automatically be reset to <b class="red-text">5</b> minutes. Once the final <b class="red-text">2</b> minutes passes with no new bids placed the auction will end.</div>');

                    if((today < start_date_time || (today > start_date_time  && today < dutch_end_date_time))){


                        check_price_decrease = setInterval(function(){
                            var new_today = new Date().getTime();
                            if(new_today > start_date_time  && new_today < dutch_end_date_time){
                                if(dutch_winning_amount_formatted){
                                    clearInterval(check_price_decrease);
                                    //console.log("after clear");
                                    //$('#auction_starting_bid').html('<span>Round One Winner</span> $'+dutch_winning_amount_formatted);
                                    //socket.emit("checkInsiderBid", {"user_id":session_user_id, "property_id": property_id, "auction_id": auction_id, "domain_id": site_id});
                                }else{
                                    socket.emit("dutchAuctionRateDecrease", {"property_id": property_id, "domain_id": site_id});
                                    socket.on('dutchAuctionRateDecrease',function(data) {
                                        if(data.amount && new_today > start_date_time  && new_today < dutch_end_date_time){
                                            decresed_amount = numberFormat(data.amount);
                                            $('#decreased_price').val(data.amount);
                                            $('#auction_starting_bid').html('$'+decresed_amount+'<span><i class="fas fa-arrow-down"></i> Price decrease</span><em>Decrease Current  Bid Price</em>');
                                        }
                                    });
                                }
                            }else{
                                //console.log("dont do anything");
                            }
                        }, 3000);

                    }else{
                        check_price_decrease = setInterval(function(){
                            clearInterval(check_price_decrease);
                        }, 3000);
                    }
                    if(today < start_date_time){
                        check_starting = setInterval(function(){
                        var new_today = new Date().getTime();
                        if(new_today > socket_start_date){
                            counter_starting = counter_starting + 1;
                            if(counter_starting >= 2){
                                clearInterval(check_starting);
                            }else{
                                custom_response = {
                                    'socket_start_date': socket_start_date,
                                    'socket_end_date': socket_end_date,
                                };
                                customCallBackFunc(check_auction_dates, [custom_response]);
                            }
                        }/*else{
                            counter_starting = 0;
                        }*/
                    }, 2000);
                    }else{
                        check_starting = setInterval(function(){
                            var new_today = new Date().getTime();
                            if(new_today > start_date_time){
                                clearInterval(check_starting);
                            }
                        }, 2000);
                    }
                    if(today > start_date_time && today < end_date_time){
                        if(today < dutch_end_date_time){
                            check_dutch_end = setInterval(function(){
                                var new_today = new Date().getTime();
                                if(new_today > socket_dutch_end_date){
                                    counter_dutch_end = counter_dutch_end + 1;
                                    if(counter_dutch_end >= 2){
                                        clearInterval(check_dutch_end);
                                    }else{
                                        custom_response = {
                                            'socket_start_date': socket_start_date,
                                            'socket_end_date': socket_end_date,
                                          };
                                        customCallBackFunc(check_dutch_dates, [custom_response]);
                                    }

                                }/*else{
                                    counter_dutch_end = 0;
                                }*/
                            }, 2000);
                        }else{
                            check_dutch_end = setInterval(function(){
                                var new_today = new Date().getTime();
                                if(new_today > socket_dutch_end_date){
                                    clearInterval(check_dutch_end);
                                }
                            }, 2000);

                        }
                        if(today < sealed_start_date_time){
                            check_sealed_start = setInterval(function(){
                                var new_today = new Date().getTime();
                                if(new_today > sealed_start_date_time){
                                    counter_sealed_start = counter_sealed_start + 1;
                                    if(counter_sealed_start >= 2){
                                        clearInterval(check_sealed_start);
                                    }else{
                                        custom_response = {
                                            'socket_start_date': socket_start_date,
                                            'socket_end_date': socket_end_date,
                                          };
                                        customCallBackFunc(check_auction_dates, [custom_response]);
                                    }

                                }/*else{
                                    counter_sealed_start = 0;
                                }*/
                            }, 2000);
                        }else{
                            check_sealed_start = setInterval(function(){
                                var new_today = new Date().getTime();
                                if(new_today > sealed_start_date_time){
                                    clearInterval(check_sealed_start);
                                }
                            }, 2000);
                        }
                        if(today > sealed_start_date_time && today < sealed_end_date_time){
                            check_sealed_end = setInterval(function(){
                                var new_today = new Date().getTime();
                                if(new_today > sealed_end_date_time){
                                    counter_sealed_end = counter_sealed_end + 1;
                                    if(counter_sealed_end >= 2){
                                        clearInterval(check_sealed_end);
                                    }else{
                                        custom_response = {
                                            'socket_start_date': socket_start_date,
                                            'socket_end_date': socket_end_date,
                                          };
                                        customCallBackFunc(check_sealed_dates, [custom_response]);
                                    }

                                }/*else{
                                    counter_sealed_end = 0;
                                }*/
                            }, 2000);
                        }else{
                            check_sealed_end = setInterval(function(){
                                var new_today = new Date().getTime();
                                if(new_today > sealed_end_date_time){
                                    clearInterval(check_sealed_end);
                                }
                            }, 2000);

                        }
                        if(today < english_start_date_time){
                            check_english_start = setInterval(function(){
                                var new_today = new Date().getTime();
                                if(new_today > english_start_date_time){
                                    counter_english_start = counter_english_start + 1;
                                    if(counter_english_start >= 2){
                                        clearInterval(check_english_start);
                                    }else{
                                        custom_response = {
                                            'socket_start_date': socket_start_date,
                                            'socket_end_date': socket_end_date,
                                          };
                                        customCallBackFunc(check_auction_dates, [custom_response]);
                                    }

                                }/*else{
                                    counter_sealed_end = 0;
                                }*/
                            }, 2000);
                        }else{
                            check_english_start = setInterval(function(){
                                var new_today = new Date().getTime();
                                if(new_today > english_start_date_time){
                                    clearInterval(check_english_start);
                                }
                            }, 2000);
                        }
                        if(today > english_start_date_time && today < end_date_time){
                            check_ending = setInterval(function(){
                                var new_today = new Date().getTime();
                                if(new_today > end_date_time){
                                    counter_ending = counter_ending + 1;
                                    if(counter_ending >= 2){
                                        clearInterval(check_ending);
                                    }else{
                                        custom_response = {
                                            'socket_start_date': socket_start_date,
                                            'socket_end_date': socket_end_date,
                                          };
                                        customCallBackFunc(check_english_dates, [custom_response]);
                                    }

                                }/*else{
                                    counter_sealed_end = 0;
                                }*/
                            }, 2000);
                        }else{
                            check_ending = setInterval(function(){
                                var new_today = new Date().getTime();
                                if(new_today > end_date_time){
                                    clearInterval(check_ending);
                                }
                            }, 2000);
                        }

                    }else{
                        check_starting = setInterval(function(){
                            var new_today = new Date().getTime();
                            if(new_today > start_date_time){
                                clearInterval(check_starting);
                            }
                        }, 2000);
                        check_dutch_end = setInterval(function(){
                            var new_today = new Date().getTime();
                            if(new_today > socket_dutch_end_date){
                                clearInterval(check_dutch_end);
                            }
                        }, 2000);
                        check_sealed_start = setInterval(function(){
                            var new_today = new Date().getTime();
                            if(new_today > sealed_start_date_time){
                                clearInterval(check_sealed_start);
                            }
                        }, 2000);
                        check_sealed_end = setInterval(function(){
                            var new_today = new Date().getTime();
                            if(new_today > sealed_end_date_time){
                                clearInterval(check_sealed_end);
                            }
                        }, 2000);
                        check_english_start = setInterval(function(){
                            var new_today = new Date().getTime();
                            if(new_today > english_start_date_time){
                                clearInterval(check_english_start);
                            }
                        }, 2000);
                        check_ending = setInterval(function(){
                            var new_today = new Date().getTime();
                            if(new_today > end_date_time){
                                clearInterval(check_ending);
                            }
                        }, 3000);

                    }
                    try{
                        var data_start_date = '';
                        var data_end_date = '';
                        if(typeof(data.data.start_date) != 'undefined' && data.data.start_date != null){
                            data_start_date = data.data.start_date;
                            $('#auction_start_end_date').attr('data-start-date',data_start_date);
                        }
                        if(typeof(data.data.end_date) != 'undefined' && data.data.end_date != null){
                            data_end_date = data.data.end_date;
                            $('#auction_start_end_date').attr('data-end-date',data_end_date);
                        }
                        response = asset_details_conversation_start_end_date(data_start_date, data_end_date);
                        $('#auction_start_end_date').html(response);
                    }catch(ex){
                        //console.log(ex);
                    }
                  // Get today's date and time
                  x = setInterval(function() {
                        //clearInterval(x);
                      // Get today's date and time
                      var auction_start = 0;
                      var now = new Date().getTime();
                      // Find the distance between now and the count down date
                      var diff_from = 'start_date';
                      var distance = countDownDate - now;
                      if(((isNaN(distance) || distance < 0) && !dutch_winning_amount_formatted)){
                        distance = countDownDutchEndDate - now;
                        diff_from = 'end_date';
                        if((!isNaN(distance) || distance > 0)){
                            auction_start = 1;
                            $('#countdown_text').html('Bidding Ends In <div class="tooltipPop"><i class="fas fa-info-circle"></i></div>');
                        }
                      }
                      if(isNaN(distance) || distance < 0){
                        auction_start = 1;
                        distance = countDownSealedStartDate - now;
                        diff_from = 'end_date';
                        if((!isNaN(distance) || distance > 0)){
                            $('#countdown_text').html('Bidding Starts In <div class="tooltipPop"><i class="fas fa-info-circle"></i></div>');
                        }
                      }
                      if(isNaN(distance) || distance < 0){
                        auction_start = 1;
                        distance = countDownSealedEndDate - now;
                        diff_from = 'end_date';
                        if((!isNaN(distance) || distance > 0)){
                            $('#countdown_text').html('Bidding Ends In <div class="tooltipPop"><i class="fas fa-info-circle"></i></div>');
                        }
                      }
                      if(isNaN(distance) || distance < 0){
                        auction_start = 1;
                        distance = countDownEnglishStartDate - now;
                        diff_from = 'end_date';
                        if((!isNaN(distance) || distance > 0)){
                            $('#countdown_text').html('Bidding Starts In <div class="tooltipPop"><i class="fas fa-info-circle"></i></div>');
                        }
                      }

                      if(isNaN(distance) || distance < 0){
                        auction_start = 0;
                        distance = countDownEndDate - now;
                        diff_from = 'end_date';
                        if((!isNaN(distance) || distance > 0)){
                            $('#countdown_text').html('Bidding Ends In <div class="tooltipPop"><i class="fas fa-info-circle"></i></div>');
                        }
                        /*if(asset_sale_type && parseInt(asset_sale_type) == 7){
                            $('#countdown_text').html('Offer End In');
                        }else{
                            $('#countdown_text').html('Bidding End In');
                        }*/
                        //alert(distance);
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
                        if(auction_start == 1){
                            $('.day_remaining_li').hide();
                            $('.hr_remaining_li').hide();
                        }else{
                            $('.day_remaining_li').show();
                            $('.hr_remaining_li').show();
                        }
                        $('.min_remaining').html(minutes);
                        $('.sec_remaining').html(seconds);
                        if(typeof(listing_status_id) != 'undefined' && listing_status_id != null  && auction_status_id == 1 && listing_status_id == 1){

                            if(diff_from == 'start_date'){
                                status = 'Coming Soon';
                                $('#listing_status').html(status);
                            }else if(diff_from == 'end_date'){
                                if(parseInt(days) == 0){
                                    status = 'Closing Today';
                                    $('#listing_status').html(status);
                                }else{
                                    status = 'Now Bidding';
                                    $('#listing_status').html(status);
                                }
                            }
                        }else{
                            if(closing_status_name){
                                $('#listing_status').html(closing_status_name);
                            }else{
                                $('#listing_status').html(listing_status_name);
                            }
                        }
                      // If the count down is over, write some text

                      if(parseInt(distance) < 0 || (typeof(auction_status_id) != 'undefined' && auction_status_id != null && auction_status_id != 1)){

                        clearInterval(x);
                        $('.day_remaining').html('00');
                        $('.hr_remaining').html('00');
                        if(auction_start == 1){
                            $('.day_remaining_li').hide();
                            $('.hr_remaining_li').hide();
                        }else{
                            $('.day_remaining_li').show();
                            $('.hr_remaining_li').show();
                        }
                        $('.min_remaining').html('00');
                        $('.sec_remaining').html('00');
                        $('.time_remaining').show();
                        $('#countdown_text').html('Auction Completed <div class="tooltipPop"><i class="fas fa-info-circle"></i></div>');
                      }else{
                        $('.time_remaining').show();
                      }
                      }
                    }, 1000);
              }
            }catch(ex){
              //console.log(ex);
            }
            $('#submitInsiderUserBid').removeProp('disabled');
            $('#confirm_insider_bid_true').removeProp('disabled');
      }
  });

  $("#confirm_insider_bid_true").on("click", function(){
    if($("#insiderbidNowFrm").valid()){
        $('#submitInsiderUserBid').prop('disabled',true);
    $('#confirm_insider_bid_true').prop('disabled',true);
      var bid_amt = $('#insider_new_bid_amt').val();
      var current_auction = $('#current_auction').val();
      bid_amt = bid_amt.toString().replace(/,/g, '').replace('$', '');
      bid_increments = bid_increments.toString().replace(/,/g, '');
        $('#confirmInsiderBidModal').modal('hide');
         if(current_auction == 'sealed_auction'){
            socket.emit("sealedAuction", {"property_id": property_id, "auction_id": auction_id, "domain_id": site_id, "bid_amount": bid_amt, "user_id": session_user_id,"ip_address": ip_address});
         }else{
            socket.emit("englishAuction", {"property_id": property_id, "auction_id": auction_id, "domain_id": site_id, "bid_amount": bid_amt, "user_id": session_user_id,"ip_address": ip_address});
         }

         socket.on('sealedAuction',function(data) {
            if(data.error == 0){
                 socket.emit("checkInsiderBid", {"user_id":session_user_id, "property_id": property_id, "auction_id": auction_id, "domain_id": site_id});
                $('#insider_bidder_msg').removeClass('badge-danger').addClass('badge-success');
                $('#insider_bidder_msg').html('<i class="fas fa-check-circle"></i> '+data.msg);
                $('#insider_bidder_msg').parent().show();
            }else{
                $('#submitInsiderUserBid').removeProp('disabled');
                 $('#confirm_insider_bid_true').removeProp('disabled');
                $('#bidding_error_msg').removeClass('badge-success').addClass('badge-danger');
                $('#bidding_error_msg').html('<i class="fas fa-exclamation-triangle"></i> '+data.msg);
                $('#biddingErrorBidModal').modal('show');
            }
      });
      socket.on('englishAuction',function(data) {
            console.log("from englishAuction");
            console.log(data);
          //if((data.status == 200 || data.status == 201) && data.error == 0){
            if(data.error == 0){
                 socket.emit("checkInsiderBid", {"user_id":session_user_id, "property_id": property_id, "auction_id": auction_id, "domain_id": site_id});
                $('#insider_bidder_msg').addClass('badge-success').removeClass('badge-danger').html('<i class="fas fa-check-circle"></i> '+data.msg);

                $('#insider_bidder_msg').parent().show();
            }else{
                $('#submitInsiderUserBid').removeProp('disabled');
                 $('#confirm_insider_bid_true').removeProp('disabled');
                $('#bidding_error_msg').removeClass('badge-success').addClass('badge-danger');
                $('#bidding_error_msg').html('<i class="fas fa-exclamation-triangle"></i> '+data.msg);
                $('#biddingErrorBidModal').modal('show');
            }
      });
    }
  });
  $("#confirm_dutch_bid_true").on("click", function(){
    $('#insiderDutchBidBtn').prop('disabled',true);
    $('#confirm_dutch_bid_true').prop('disabled',true);
        var bid_amt = $('#decreased_price').val();
        bid_amt = bid_amt.toString().replace(/,/g, '').replace('$', '');
        $('#confirmDutchBidModal').modal('hide');
        socket.emit("dutchAuction", {"property_id": property_id, "auction_id": auction_id, "domain_id": site_id, "bid_amount": bid_amt, "user_id": session_user_id, "ip_address": ip_address});
        socket.on('dutchAuction',function(data) {
            try{
                var formated_amount = numberFormat(data.bid_amount);
            }catch(ex){
                var amount = $('#decreased_price').val();
                var formated_amount = numberFormat(amount);
            }

            $('#dutch_winning_amount').html('First Round Winning Bid Amount <strong>$'+formated_amount+'</strong>');
            $('#roundOneModal').modal('show');
            $('#insiderDutchBidBtn').removeProp('disabled');
            $('#confirm_dutch_bid_true').removeProp('disabled');
            window.setTimeout(function () {
                socket.emit("checkInsiderBid", {"user_id":session_user_id, "property_id": property_id, "auction_id": auction_id, "domain_id": site_id});
            }, 2000);

        });
  });
  /*$("#insiderDutchBidBtn").on("click", function(){
        var amount = $('#decreased_price').val();
        $('#insiderDutchBidBtn').prop('disabled',true);
        socket.emit("dutchAuction", {"property_id": property_id, "auction_id": auction_id, "domain_id": site_id, "bid_amount": amount, "user_id": session_user_id, "ip_address": ip_address});
        socket.on('dutchAuction',function(data) {
            console.log("data");
            console.log(data);
            try{
                var formated_amount = numberFormat(data.bid_amount);
            }catch(ex){
                var amount = $('#decreased_price').val();
                var formated_amount = numberFormat(amount);
            }

            $('#dutch_winning_amount').html('First Round Winning Bid Amount <strong>$'+formated_amount+'</strong>');
            $('#roundOneModal').modal('show');
            $('#insiderDutchBidBtn').removeProp('disabled');
            window.setTimeout(function () {
                socket.emit("checkInsiderBid", {"user_id":session_user_id, "property_id": property_id, "auction_id": auction_id, "domain_id": site_id});
            }, 2000);

        });
  });*/
    socket.emit("checkAuction", {"domain_id": site_id});
    socket.on('checkAuction',function(data) {
        if(parseInt(asset_sale_type) == 2){
            socket.emit("checkInsiderBid", {"user_id":session_user_id, "property_id": property_id, "auction_id": auction_id, "domain_id": site_id});
        }else{
            socket.emit("checkBid", {"user_id":session_user_id, "property_id": property_id, "auction_id": auction_id, "domain_id": site_id});
        }

    });
    socket.emit("dutchAuctionEnded", {"domain_id": site_id});
    socket.on('dutchAuctionEnded',function(data) {
        socket.emit("checkInsiderBid", {"user_id":session_user_id, "property_id": property_id, "auction_id": auction_id, "domain_id": site_id});

    });
    socket.emit("sealedAuctionEnded", {"domain_id": site_id});
    socket.on('sealedAuctionEnded',function(data) {
        socket.emit("checkInsiderBid", {"user_id":session_user_id, "property_id": property_id, "auction_id": auction_id, "domain_id": site_id});

    });
    // add inline hybrid english auction
    socket.emit("englishAuctionEnded", {"domain_id": site_id});
    socket.on('englishAuctionEnded',function(data) {
        console.log(data);
        socket.emit("checkInsiderBid", {"user_id":session_user_id, "property_id": property_id, "auction_id": auction_id, "domain_id": site_id});
    });
if(today_date < socket_start_date){
    check_starting = setInterval(function(){
        var new_today = new Date().getTime();
        if(new_today > socket_start_date){
            counter_starting = counter_starting + 1;
            if(counter_starting >= 2){
                clearInterval(check_starting);
            }else{
                custom_response = {
                    'socket_start_date': socket_start_date,
                    'socket_end_date': socket_end_date,
                };
                customCallBackFunc(check_auction_dates, [custom_response]);
            }
        }else{
            counter_starting = 0;
        }
    }, 3000);
}
if(today_date > socket_start_date && today_date < socket_end_date){
    check_ending = setInterval(function(){
        var new_today = new Date().getTime();
        if(new_today > socket_end_date){
            counter_end = counter_end + 1;
            if(counter_end >= 2){
                clearInterval(check_ending);
            }else{
                custom_response = {
                    'socket_start_date': socket_start_date,
                    'socket_end_date': socket_end_date,
                };
                customCallBackFunc(check_auction_dates, [custom_response]);
            }
        }else{
            counter_end = 0;
        }
    }, 3000);
    check_flash_time = setInterval(function(){
        var new_today = new Date().getTime();
        if(new_today > socket_end_date){
            $('.timing').removeClass('blink');
            $('.timing').stop(true, true).fadeIn();
            $('.timing').finish().fadeIn();
            clearInterval(check_flash_time);
        }else{
            var flashtime = socket_end_date - new_today;
            if(new_today < socket_end_date && flashtime > 0 && flashtime <= flash_time_milisec){
                $('.timing').fadeOut(500);
                $('.timing').fadeIn(500);
            }else if(new_today > socket_end_date){
                clearInterval(check_flash_time);
                $('.timing').removeClass('blink');
                $('.timing').stop(true, true).fadeIn();
                $('.timing').finish().fadeIn();
            }else{
                $('.timing').removeClass('blink');
                $('.timing').stop(true, true).fadeIn();
                $('.timing').finish().fadeIn();
            }
        }
    }, 1000);
}else{
    check_flash_time = setInterval(function(){
        var new_today = new Date().getTime();
        if(new_today > socket_end_date){
            clearInterval(check_flash_time);
            $('.timing').removeClass('blink');
            $('.timing').stop(true, true).fadeIn();
            $('.timing').finish().fadeIn();
        }else{
            var flashtime = socket_end_date - new_today;
            if(new_today < socket_end_date && flashtime > 0 && flashtime <= flash_time_milisec){
                $('.timing').fadeOut(500);
                $('.timing').fadeIn(500);
            }else if(new_today > socket_end_date){
                clearInterval(check_flash_time);
                $('.timing').removeClass('blink');
                $('.timing').stop(true, true).fadeIn();
                $('.timing').finish().fadeIn();
            }else{
                $('.timing').removeClass('blink');
                $('.timing').stop(true, true).fadeIn();
                $('.timing').finish().fadeIn();
            }
        }
    }, 1000);
    check_ending = setInterval(function(){
        var new_today = new Date().getTime();
        if(new_today > socket_end_date){
            clearInterval(check_ending);
        }
    }, 3000);
}
}
});
function check_auction_dates(start_date, end_date){
    socket.emit("checkAuction", {"domain_id": site_id});
}
function check_dutch_dates(params){
    socket.emit("dutchAuctionEnded", {"domain_id": site_id});
}
function check_sealed_dates(params){
    socket.emit("sealedAuctionEnded", {"domain_id": site_id});
}
function check_english_dates(params){
    socket.emit("englishAuctionEnded", {"domain_id": site_id});
}
function blink_timer() {
    $('.blink').fadeOut(500);
    $('.blink').fadeIn(500);
}
function delete_current_bid(){
    $('#del_bid_true').prop('disabled',true);
    socket.emit("deleteCurrentBid", {"property_id": property_id, "auction_id": auction_id, "domain_id": site_id, "user_id": session_user_id,"ip_address": ip_address});
}