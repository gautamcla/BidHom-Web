$(document).ready(function(){

// const socket = io.connect(socket_domain, {
//     transports: ["websocket", "xhr-polling", "htmlfile", "jsonp-polling"],
//     rejectUnauthorized: false,
//     requestCert: false,
// });

setInterval(function()
{
  $('.block-item').each(function () {
      var auction_id = parseInt($(this).data("auction"));
      var property_id = parseInt($(this).data("property"));
      //checkPropertyData(domain_id, user_id, property_id, auction_id);
      socket.emit("insiderUserDashboard", {"user_id":user_id, "property_id": property_id, "auction_id": auction_id, "domain_id": domain_id});

  });
}, 3000);



//=======================================Receive checkMyBid Socket==========================================
socket.on('insiderUserDashboard',function(data) {
      if (data.error == 0){
        var all_data = data.data;
        /*if(all_data.property_id == 765){
            console.log(all_data);
        }*/
        var start_date = all_data.start_date;
        var dutch_end_time = all_data.dutch_end_time;
        var sealed_start_time = all_data.sealed_start_time;
        var sealed_end_time = all_data.sealed_end_time;
        var english_start_time = all_data.english_start_time;
        var end_date = all_data.end_date;
        var local_start_date = getLocalDate(start_date, 'm j, Y','');
        var local_dutch_end_date = getLocalDate(dutch_end_time, 'm j, Y','');
        var local_sealed_start_date = getLocalDate(sealed_start_time, 'm j, Y','');
        var local_sealed_end_date = getLocalDate(sealed_end_time, 'm j, Y','');
        var local_english_start_date = getLocalDate(english_start_time, 'm j, Y','');
        var local_end_date = getLocalDate(end_date, 'm j, Y','');
        var today = new Date().getTime();
        var count_down_start_date = new Date(local_start_date).getTime();
        var count_down_dutch_end_date = new Date(local_dutch_end_date).getTime();
        var count_down_sealed_start_date = new Date(local_sealed_start_date).getTime();
        var count_down_sealed_end_date = new Date(local_sealed_end_date).getTime();
        var count_down_english_start_date = new Date(local_english_start_date).getTime();
        var count_down_end_date = new Date(local_end_date).getTime();
        var row_id = "bid_row_"+all_data.property_id;
        var auction_id = $("#"+row_id).data("auction");
        var property_id = all_data.property_id;
        var round_one_winning_amount = all_data.round_one_winning_amount;
        var round_two_winning_amount = all_data.round_two_winning_amount;
        var round_three_winning_amount = all_data.round_three_winning_amount;
        var counter_dutch_end = 0;
        var counter_sealed_end = 0;

        //-----------Update Current Bid Amount-----------
        if(all_data.start_price == undefined){
          $("#"+row_id+" .current_bids").html("$0");
          $("#"+row_id).attr("data-minimum", "");
        }else{
          $("#"+row_id+" .current_bids").html("$"+ parseInt(all_data.start_price).toLocaleString());
          $("#"+row_id).attr("data-minimum", parseInt(all_data.start_price));
        }

        //-----------Update Bid Increment-----------
        if(all_data.bid_increments == undefined){
          $("#"+row_id+" .bid_increment").html("$0");
          $("#"+row_id).attr("data-increment", "");
        }else{
            if(parseInt(all_data.auction_status) == 1 && today > count_down_end_date && today < count_down_sealed_end_date){
                $("#"+row_id+" .bid_increment").html("$1");
                $("#"+row_id).attr("data-increment", 1);
            }else{
                $("#"+row_id+" .bid_increment").html("$"+ parseInt(all_data.bid_increments).toLocaleString());
                $("#"+row_id).attr("data-increment", parseInt(all_data.bid_increments));
            }

        }

        //-----------Update My Bid Amount-----------
        if(all_data.my_max_bid_val == undefined){
          $("#"+row_id+" .my_bid").html("$0");
        }else{
            if(today > count_down_end_date && today < count_down_sealed_end_date){
                if(all_data.user_sealed_bid_amount){
                    $("#"+row_id+" .my_bid").html("$"+ parseInt(all_data.user_sealed_bid_amount).toLocaleString());
                }else{
                    $("#"+row_id+" .my_bid").html("$"+ parseInt(all_data.round_one_winning_amount).toLocaleString());
                }

            }else{
                $("#"+row_id+" .my_bid").html("$"+ parseInt(all_data.my_max_bid_val).toLocaleString());
            }

        }

        //-----------Update Bid Count-----------
        if(all_data.bid_count == undefined){
          $("#"+row_id+" .bid_count .badge").html('0');
          $("#"+row_id+" .bid_count .badge").css('cursor','initial');
        }else{
          $("#"+row_id+" .bid_count .badge").html(parseInt(all_data.bid_count).toLocaleString());
          $("#"+row_id+" .bid_count .badge").css('cursor','pointer');
        }

        //----------------Bidding field---------------
        if(parseInt(all_data.auction_status) != 1){
          bid_html = 'Auction completed';
          $("#"+row_id+" .bid").html(bid_html);
        }else if(all_data.is_approved == 2 && all_data.is_reviewed){
          if(today > count_down_start_date && today < count_down_dutch_end_date){
            var bid_amount_class = "dutch_bid_amount_"+all_data.property_id;
            var bid_amount = parseInt(all_data.decreased_amount);
            var bid_html = '<form action="" class="make0ffer-form">';
            bid_html += '<span>$</span> <input type="text" class="form-control input-sm dutch_bid_amount '+bid_amount_class+'" name="dutch_bid_amount" value="'+bid_amount+'" maxlength="10" readonly>';
            bid_html += '<button type="button" class="btn btn-primary btn-sm dutch_bid_now">Place Bid</button>';
            bid_html += '</form>';
            if (!$("#"+row_id+" .dutch_bid_amount").is(":focus")) {
                $("#"+row_id+" .bid").html(bid_html);
            }

          }else if(today > count_down_dutch_end_date && today < count_down_sealed_start_date){
            if(round_one_winning_amount){
                if(parseInt(user_id) == parseInt(all_data.dutch_winning_user_id)){
                    $("#"+row_id+" .bid").html('You are Round One Winner: <span>$'+parseInt(round_one_winning_amount).toLocaleString()+'</span>');
                }else{
                    $("#"+row_id+" .bid").html('Round One Winner: <span>$'+parseInt(round_one_winning_amount).toLocaleString()+'</span>');
                }
            }


          }else if(today > count_down_sealed_start_date && today < count_down_sealed_end_date){
            if(all_data.dutch_winning_user_id && parseInt(user_id) != parseInt(all_data.dutch_winning_user_id)){
                var bid_amount_class = "sealed_bid_amount_"+all_data.property_id;
                if(all_data.user_sealed_bid_amount){
                    var bid_amount = parseInt(all_data.user_sealed_bid_amount) + 1;
                }else{
                    var bid_amount = parseInt(round_one_winning_amount) + 1;
                }

                var bid_html = '<form action="" class="make0ffer-form">';
                bid_html += '<span>$</span> <input type="text" class="form-control input-sm sealed_bid_amount '+bid_amount_class+'" name="sealed_bid_amount" value="'+bid_amount+'" maxlength="10">';
                bid_html += '<button type="button" class="btn btn-primary btn-sm sealed_bid_now">Bid Now</button>';
                bid_html += '</form>';
                if (!$("#"+row_id+" .sealed_bid_amount").is(":focus")) {
                    $("#"+row_id+" .bid").html(bid_html);
                }
            }else{
                $("#"+row_id+" .bid").html('You are Round One Winner: <span>$'+parseInt(round_one_winning_amount).toLocaleString()+'</span>');
            }

          }else if(today > count_down_sealed_end_date && today < count_down_english_start_date){
            if(round_two_winning_amount){
                if(parseInt(user_id) == parseInt(all_data.sealed_winning_user_id)){
                    $("#"+row_id+" .bid").html('You Are Round Two Winner: <span>$'+parseInt(round_two_winning_amount).toLocaleString() +'</span>');
                }else{
                    $("#"+row_id+" .bid").html('Round Two Winner: <span>$'+parseInt(round_two_winning_amount).toLocaleString()+'</span>');
                }
            }
          }else if(today > count_down_english_start_date && today < count_down_end_date){
            if(parseInt(user_id) == parseInt(all_data.dutch_winning_user_id) || parseInt(user_id) == parseInt(all_data.sealed_winning_user_id)){
                var bid_amount_class = "bid_amount_"+all_data.property_id;
                if(all_data.bid_count == undefined || all_data.bid_count == 0){
                  var bid_amount = parseInt(all_data.start_price);
                }else{
                  var bid_amount = parseInt(all_data.high_bid_amt) + parseInt(all_data.bid_increments);
                }
                var bid_html = '<form action="" class="make0ffer-form">';
                bid_html += '<span>$</span> <input type="text" class="form-control input-sm bid_amount '+bid_amount_class+'" name="bid_amount" value="'+bid_amount+'" maxlength="10">';
                bid_html += '<button type="button" class="btn btn-primary btn-sm bid_now">Bid Now</button>';
                bid_html += '</form>';
                if (!$("#"+row_id+" .bid_amount").is(":focus")) {
                    $("#"+row_id+" .bid").html(bid_html);
                }
            }else{
                $("#"+row_id+" .bid").html('Current Bid: <span>$'+parseInt(all_data.high_bid_amt).toLocaleString()+'</span>');
            }
          }else if(today > count_down_end_date){

            bid_html = 'Auction completed';
            $("#"+row_id+" .bid").html(bid_html);
            if(parseInt(all_data.winner_id) == parseInt(user_id)){
                $("#"+row_id+" .bidding_timer").html("You Won");
            }else{
                if(parseInt(all_data.closing_status) > 0){
                    $("#"+row_id+" .bidding_timer").html(all_data.closing_status_name);
                }else{
                    $("#"+row_id+" .bidding_timer").html(all_data.property_status_name);
                }
            }
            socket.emit("englishAuctionEnded", {"domain_id": site_id});
          }else if(all_data.start_time_left_hr > 0){
            var bid_html = 'Registration Approved But Auction Not Started Yet';
            $("#"+row_id+" .bid").html(bid_html);
          }else if(all_data.time_left_hr <= 0){
            bid_html = 'Auction completed';
            $("#"+row_id+" .bid").html(bid_html);
          }
        }else if(all_data.is_approved == 3 || all_data.is_approved == 4){
          var bid_html = 'Registration Declined';
          $("#"+row_id+" .bid").html(bid_html);
        }else if(all_data.is_approved != 2){
          var bid_html = 'Registration Pending Approval';
          $("#"+row_id+" .bid").html(bid_html);
        }

        //-----------Update Bid Amount-----------
        if(all_data.bid_count == undefined || all_data.bid_count == 0){
          if (!$("#"+row_id+" .bid_amount").is(":focus")) {
                $("#"+row_id+" .bid_amount").val(parseInt(all_data.start_price).toLocaleString());
          }
        }else{
           if (!$("#"+row_id+" .bid_amount").is(":focus")) {
               var next_bid_amount = parseInt(parseInt(all_data.high_bid_amt) + parseInt(all_data.bid_increments));
               $("#"+row_id+" .bid_amount").val(parseInt(parseInt(all_data.high_bid_amt) + parseInt(all_data.bid_increments)).toLocaleString());
          }
        }

        //-----------Update Status-----------
        if (all_data.is_approved == 2 && all_data.is_reviewed){
          var status_html = '<span class="badge badge-success">Approved</span>';
          $("#"+row_id+" .status").html(status_html);
        }else if (all_data.is_approved == 2 && ! all_data.is_reviewed){
          var status_html = '<span class="badge badge-info">Not Reviewed</span>';
          $("#"+row_id+" .status").html(status_html);
        }else if(all_data.is_approved == 1){
          var status_html = '<span class="badge badge-warning">Pending</span>';
          $("#"+row_id+" .status").html(status_html);
        }else if(all_data.is_approved == 3){
          var status_html = '<span class="badge badge-danger">Declined</span>';
          $("#"+row_id+" .status").html(status_html);
        }else if(all_data.is_approved == 4){
          var status_html = '<span class="badge badge-info">Not Interested</span>';
          $("#"+row_id+" .status").html(status_html);
        }
        if(today > count_down_start_date && today < count_down_end_date){
            if(today < count_down_dutch_end_date){
                check_price_decrease = setInterval(function(){
                    var new_today = new Date().getTime();
                    if(new_today > count_down_start_date  && new_today < count_down_dutch_end_date){
                        if(round_one_winning_amount){
                            clearInterval(check_price_decrease);
                        }else{
                            socket.emit("dutchAuctionRateDecrease", {"property_id": property_id, "domain_id": domain_id});
                            socket.on('dutchAuctionRateDecrease',function(data) {
                                if(data.amount && new_today > count_down_start_date  && new_today < count_down_dutch_end_date){
                                    var bid_amount_class = "dutch_bid_amount_"+property_id;
                                    var bid_amount = parseInt(data.amount);
                                    var bid_html = '<form action="" class="make0ffer-form">';
                                    bid_html += '<span>$</span> <input type="text" class="form-control input-sm dutch_bid_amount '+bid_amount_class+'" name="dutch_bid_amount" value="'+bid_amount+'" maxlength="10" readonly>';
                                    bid_html += '<button type="button" class="btn btn-primary btn-sm dutch_bid_now">Place Bid</button>';
                                    bid_html += '</form>';
                                    if (!$("#"+row_id+" .dutch_bid_amount").is(":focus")) {
                                        $("#"+row_id+" .bid").html(bid_html);
                                    }
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

        }
        if(today > count_down_dutch_end_date && today < count_down_sealed_start_date){
            socket.emit("dutchAuctionEnded", {"domain_id": site_id});
        }else if(today > count_down_sealed_end_date && today < count_down_english_start_date){
            socket.emit("sealedAuctionEnded", {"domain_id": site_id});

        }else{
            socket.emit("englishAuctionEnded", {"domain_id": site_id});
        }
        //bidding timer
        if(parseInt(all_data.property_status) == 1 & parseInt(all_data.auction_status) == 1){
          var start_date = all_data.start_date;
          var dutch_end_time = all_data.dutch_end_time;
          var sealed_start_time = all_data.sealed_start_time;
          var sealed_end_time = all_data.sealed_end_time;
          var english_start_time = all_data.english_start_time;
          var end_date = all_data.end_date;
          var local_start_date = getLocalDate(start_date, 'm j, Y','');
          var local_dutch_end_date = getLocalDate(dutch_end_time, 'm j, Y','');
          var local_sealed_start_date = getLocalDate(sealed_start_time, 'm j, Y','');
          var local_sealed_end_date = getLocalDate(sealed_end_time, 'm j, Y','');
          var local_english_start_date = getLocalDate(english_start_time, 'm j, Y','');
          var local_end_date = getLocalDate(end_date, 'm j, Y','');
          var count_down_start_date = new Date(local_start_date).getTime();
          var count_down_dutch_end_date = new Date(local_dutch_end_date).getTime();
          var count_down_sealed_start_date = new Date(local_sealed_start_date).getTime();
          var count_down_sealed_end_date = new Date(local_sealed_end_date).getTime();
          var count_down_english_start_date = new Date(local_english_start_date).getTime();
          var count_down_end_date = new Date(local_end_date).getTime();
          $("#"+row_id+" .bidding_timer").attr('data-start-date', start_date);
          $("#"+row_id+" .bidding_timer").attr('data-dutch-end-date', dutch_end_time);
          $("#"+row_id+" .bidding_timer").attr('data-sealed-start-date', sealed_start_time);
          $("#"+row_id+" .bidding_timer").attr('data-sealed-end-date', sealed_end_time);
          $("#"+row_id+" .bidding_timer").attr('data-english-start-date', english_start_time);
          $("#"+row_id+" .bidding_timer").attr('data-end-date', end_date);
        }else if(parseInt(all_data.property_status) == 1 & parseInt(all_data.auction_status) != 1){
          $("#"+row_id+" .bidding_timer").attr('data-start-date', "");
          $("#"+row_id+" .bidding_timer").attr('data-dutch-end-date', "");
          $("#"+row_id+" .bidding_timer").attr('data-sealed-start-date', "");
          $("#"+row_id+" .bidding_timer").attr('data-sealed-end-date', "");
          $("#"+row_id+" .bidding_timer").attr('data-english-start-date', "");
          $("#"+row_id+" .bidding_timer").attr('data-end-date', "");
        }else if(parseInt(all_data.sale_by_type_id) == 2){ // for classic online auction
            if(parseInt(all_data.property_status) == 9){
                if(parseInt(all_data.winner_id) == parseInt(user_id)){
                    $("#"+row_id+" .bidding_timer").html("You Won");
                }else{
                    if(parseInt(all_data.closing_status) > 0){
                        $("#"+row_id+" .bidding_timer").html(all_data.closing_status_name);
                    }else{
                        $("#"+row_id+" .bidding_timer").html(all_data.property_status_name);
                    }
                }
            }else{
                $("#"+row_id+" .bidding_timer").html(all_data.property_status_name);
            }
//          if(parseInt(all_data.property_status)== 10 & parseInt(all_data.winner_id) == parseInt(user_id)){
//            $("#"+row_id+" .bidding_timer").html("You Won");
//          }else if(parseInt(all_data.property_status)== 10 & parseInt(all_data.winner_id) != parseInt(user_id)){
//            $("#"+row_id+" .bidding_timer").html(all_data.property_status_name);
//          }else if(parseInt(all_data.property_status) != 10){
//            $("#"+row_id+" .bidding_timer").html(all_data.property_status_name);
//          }
        }
      }else{
        console.log(data.msg);
      }
  });

//=================================================================================

//---------------------Confirmation popup----------------------
    $(document).on("click", ".bid_now", function() {
      var property_detail = $(this).closest('.block-item')
      var property_id = property_detail.data("property");
      var bid_amount = $(".bid_amount_"+property_id).val();
      var bid_amount = numberFormat(parseInt(bid_amount.replace(/[ ,]+/g, "")));
      $('.new_bid_amt').val(bid_amount);
      $("#popup_bid_amt").html(bid_amount);
      var button_text = "Confirm Bid of $"+bid_amount;
      $("#confirm_bid_true").html(button_text);
      $(".popup_property_id").val(property_id);
      $(".biding_type").val('english');
      $('#confirmBidModal').modal('show');
    });
    $(document).on("click", ".dutch_bid_now", function() {
      var property_detail = $(this).closest('.block-item')
      var property_id = property_detail.data("property");
      var bid_amount = $(".dutch_bid_amount_"+property_id).val();
      var bid_amount = numberFormat(parseInt(bid_amount.replace(/[ ,]+/g, "")));
      $('.new_bid_amt').val(bid_amount);
      $("#popup_bid_amt").html(bid_amount);
      var button_text = "Confirm Bid of $"+bid_amount;
      $("#confirm_bid_true").html(button_text);
      $(".popup_property_id").val(property_id);
      $(".biding_type").val('dutch');
      $('#confirmBidModal').modal('show');
    });
    $(document).on("click", ".sealed_bid_now", function() {
      var property_detail = $(this).closest('.block-item')
      var property_id = property_detail.data("property");
      var bid_amount = $(".sealed_bid_amount_"+property_id).val();
      var bid_amount = numberFormat(parseInt(bid_amount.replace(/[ ,]+/g, "")));
      $('.new_bid_amt').val(bid_amount);
      $("#popup_bid_amt").html(bid_amount);
      var button_text = "Confirm Bid of $"+bid_amount;
      $("#confirm_bid_true").html(button_text);
      $(".popup_property_id").val(property_id);
      $(".biding_type").val('sealed');
      $('#confirmBidModal').modal('show');
    });

    $('#confirm_bid_false').click(function(){
        $('#confirmBidModal').modal('hide');
    });
    /*$('#confirm_dutch_bid_false').click(function(){
        $('#confirmDutchBidModal').modal('hide');
    });*/

    socket.emit("checkAuction", {"domain_id": site_id});

    $(document).on("click", "#confirm_bid_true", function() {
      var bidding_type = $('#confirmBidModal .biding_type').val();
      $('#confirmBidModal').modal('hide');
      var property_id = $(".popup_property_id").val();
      var block_name = "bid_row_"+property_id;
      var auction_id = $("#"+block_name).data("auction");
      var min_bid_amount = $("#"+block_name).data("minimum");
      var bid_increment = $("#"+block_name).data("increment");
      var bid_amount = $('.new_bid_amt').val();
      bid_amount = bid_amount.toString().replace(/,/g, '');
      if(bidding_type == 'dutch'){
        socket.emit("dutchAuction", {"property_id": property_id, "auction_id": auction_id, "domain_id": site_id, "bid_amount": bid_amount, "user_id": user_id, "ip_address": ip_address});
        socket.on('dutchAuction',function(data) {
            try{
                var formated_amount = numberFormat(data.bid_amount);
            }catch(ex){
                var amount = $('.new_bid_amt').val();
                var formated_amount = numberFormat(amount);
            }

            if(data.error == 0){
                $('#dutch_winning_amount').html('First Round Winning Bid Amount <strong>$'+formated_amount+'</strong>');
                $('#roundOneModal').modal('show');
                //$("#bidding_success_msg").html(data.msg);
                //$('#biddingSuccessBidModal').modal('show');
                $('#confirm_bid_true').removeProp('disabled');
                socket.emit("insiderUserDashboard", {"user_id":user_id, "property_id": property_id, "auction_id": auction_id, "domain_id": domain_id});
                socket.emit("checkInsiderBid", {"user_id":user_id, "property_id": property_id, "auction_id": auction_id, "domain_id": site_id});
            }else{
                $("#bidding_error_msg").html(data.msg);
                $('#biddingErrorBidModal').modal('show');
            }

        });
      }else if(bidding_type == 'sealed'){
        socket.emit("sealedAuction", {"property_id": property_id, "auction_id": auction_id, "domain_id": site_id, "bid_amount": bid_amount, "user_id": user_id,"ip_address": ip_address});
        socket.on('sealedAuction',function(data) {
            try{
                var formated_amount = numberFormat(data.bid_amount);
            }catch(ex){
                var amount = $('.new_bid_amt').val();
                var formated_amount = numberFormat(amount);
            }
            if(data.error == 0){
                $("#bidding_success_msg").html(data.msg);
                $('#biddingSuccessBidModal').modal('show');
                $('#confirm_bid_true').removeProp('disabled');
                socket.emit("insiderUserDashboard", {"user_id":user_id, "property_id": property_id, "auction_id": auction_id, "domain_id": domain_id});
                socket.emit("checkInsiderBid", {"user_id":user_id, "property_id": property_id, "auction_id": auction_id, "domain_id": site_id});
            }else{
                $('#confirm_bid_true').removeProp('disabled');
                $("#bidding_error_msg").html(data.msg);
                $('#biddingErrorBidModal').modal('show');
            }
        });
      }else{
      // Check bid amount at user end
      socket.emit("englishAuction", {"property_id": property_id, "auction_id": auction_id, "domain_id": site_id, "bid_amount": bid_amount, "user_id": user_id,"ip_address": ip_address});
      socket.on('englishAuction',function(data) {
          if(data.error == 0){
            //$.growl.notice({title: "Success ", message: data.msg, size: 'large'});
            $("#bidding_success_msg").html(data.msg);
            $('#biddingSuccessBidModal').modal('show');
            $('#confirm_bid_true').removeProp('disabled');
            //checkPropertyData(domain_id, user_id, property_id, auction_id);
            $('#confirm_bid_true').removeProp('disabled');
            socket.emit("insiderUserDashboard", {"user_id":user_id, "property_id": property_id, "auction_id": auction_id, "domain_id": domain_id});
            socket.emit("checkInsiderBid", {"user_id":user_id, "property_id": property_id, "auction_id": auction_id, "domain_id": site_id});
          }else{
            $('#confirm_bid_true').removeProp('disabled');
            //$.growl.error({title: "Error ", message: data.msg, size: 'large'});
            $("#bidding_error_msg").html(data.msg);
            $('#biddingErrorBidModal').modal('show');
          }
      });
      }



    });

});
