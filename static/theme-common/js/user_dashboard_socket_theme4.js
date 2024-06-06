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
      socket.emit("checkMyBid", {"user_id":user_id, "property_id": property_id, "auction_id": auction_id, "domain_id": domain_id});

  });
}, 3000);


//=======================================Receive checkMyBid Socket==========================================
socket.on('checkMyBid',function(data) {
      //console.log(data)
      if (data.error == 0){
        var all_data = data.data
        var row_id = "bid_row_"+all_data.property_id

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
          $("#"+row_id+" .bid_increment").html("$"+ parseInt(all_data.bid_increments).toLocaleString());
          $("#"+row_id).attr("data-increment", parseInt(all_data.bid_increments));
        }

        //-----------Update My Bid Amount-----------
        if(all_data.my_max_bid_val == undefined){
          $("#"+row_id+" .my_bid").html("$0");
        }else{
          $("#"+row_id+" .my_bid").html("$"+ parseInt(all_data.my_max_bid_val).toLocaleString());
        }

        //-----------Update Bid Count-----------
        //        if(all_data.bid_count == undefined){
        //          $("#"+row_id+" .bid_count .badge").html('0');
        //          $("#"+row_id+" .bid_count .badge").css('cursor','initial');
        //        }else{
        //          $("#"+row_id+" .bid_count .badge").html(parseInt(all_data.bid_count).toLocaleString());
        //          $("#"+row_id+" .bid_count .badge").css('cursor','pointer');
        //        }

        if(all_data.bid_count == undefined){
          $("#"+row_id+" .bids-limit").html('0');
          $("#"+row_id+" .bids-limit").css('cursor','initial');
        }else{
          $("#"+row_id+" .bids-limit").html(parseInt(all_data.bid_count).toLocaleString());
          $("#"+row_id+" .bids-limit").css('cursor','pointer');
        }

        //----------------Bidding field---------------
        if(parseInt(all_data.auction_status) != 1){
          bid_html = 'Auction completed';
          $("#"+row_id+" .bid").html(bid_html);
        }else if(all_data.is_approved == 2 && all_data.is_reviewed){
          if(all_data.start_time_left_hr <= 0 && all_data.time_left_hr >= 0){
            var bid_amount_class = "bid_amount_"+all_data.property_id;
            if(all_data.bid_count == undefined || all_data.bid_count == 0){
              var bid_amount = parseInt(all_data.start_price);
            }else{
              var bid_amount = parseInt(all_data.high_bid_amt) + parseInt(all_data.bid_increments);
            }
            /*console.log(row_id);
            console.log(bid_amount);
            console.log(all_data.high_bid_amt);*/
            var bid_html = '<form action="" class="make0ffer-form">';
            bid_html += '<span class="dollar">$</span> <input type="text" class="form-control input-sm bid_amount '+bid_amount_class+'" name="bid_amount" value="'+bid_amount+'" maxlength="10" onkeypress="return ((event.charCode == 46) || (event.charCode == 44) || (event.charCode >= 48 && event.charCode <= 57))">';
            //bid_html += '<button type="button" class="btn btn-primary btn-sm bid_now">Place Bid</button>';
            bid_html += '<button type="button" class="btn btn-primary btn-sm bid_now bid_now">Place Bid</button>';
            bid_html += '</form>';
            if (!$("#"+row_id+" .bid_amount").is(":focus")) {
                $("#"+row_id+" .bid").html(bid_html);
            }
            //if(!$("#"+row_id+" .bid_form").length){
              //$("#"+row_id+" .bid").html(bid_html);
            //}
          }else if(all_data.start_time_left_hr > 0){
            var bid_html = 'You are registered and &nbsp;<strong>Approved To Bid</strong>';
            $("#"+row_id+" .bid").html(bid_html);
          }else if(all_data.time_left_hr <= 0){
            bid_html = 'Auction completed';
            $("#"+row_id+" .bid").html(bid_html);
          }
        }else if(all_data.is_approved == 3 || all_data.is_approved == 4){
          var bid_html = 'Registration Declined';
          $("#"+row_id+" .bid").html(bid_html);
        }else if(all_data.is_approved != 2){
          var bid_html = 'You are registered to bid. &nbsp;<strong>Approval Pending</strong>';
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
        //bidding timer
        if(parseInt(all_data.property_status) == 1 & parseInt(all_data.auction_status) == 1){
          var start_date = all_data.start_date;
          var end_date = all_data.end_date;
          var local_start_date = getLocalDate(start_date, 'm j, Y','');
          var local_end_date = getLocalDate(end_date, 'm j, Y','');
          var count_down_start_date = new Date(local_start_date).getTime();
          var count_down_end_date = new Date(local_end_date).getTime();
          $("#"+row_id+" .bidding_timer").attr('data-start-date', start_date);
          $("#"+row_id+" .bidding_timer").attr('data-end-date', end_date);
        }else if(parseInt(all_data.property_status) == 1 & parseInt(all_data.auction_status) != 1){
          $("#"+row_id+" .bidding_timer").attr('data-start-date', "");
          $("#"+row_id+" .bidding_timer").attr('data-end-date', "");
        }else if(parseInt(all_data.sale_by_type_id) == 1){ // for classic online auction
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
      $('#confirmBidModal').modal('show');
    });

    $('#confirm_bid_false').click(function(){
        $('#confirmBidModal').modal('hide');
    });

// ----------------Bidding---------
    <!--$(document).on("click", ".bid_now", function() {-->
    <!--  $(this).closest('.bid_amount').addClass("demo");-->
    <!--  var property_detail = $(this).closest('.block-item')-->
    <!--  var property_id = property_detail.data("property");-->
    <!--  var auction_id = property_detail.data("auction");-->
    <!--  var min_bid_amount = property_detail.data("minimum");-->
    <!--  var bid_increment = property_detail.data("increment");-->
    <!--  var bid_amount = $(".bid_amount_"+property_id).val();-->
    <!--  var bid_amount = parseInt(bid_amount.replace(/[ ,]+/g, ""));-->
    <!--  // Check bid amount at user end-->
    <!--  socket.emit("addNewBid", {"property_id": property_id, "auction_id": auction_id, "domain_id": domain_id, "min_bid_amount": min_bid_amount, "bid_amount": bid_amount, "bid_increment": bid_increment, "user_id": user_id, "ip_address": ip_address});-->

    <!--  socket.on('addNewBid',function(data) {-->
    <!--      if(data.error == 0){-->
    <!--        //$.growl.notice({title: "Success ", message: data.msg, size: 'large'});-->
    <!--        $("#bidding_success_msg").html(data.msg);-->
    <!--        $('#biddingSuccessBidModal').modal('show');-->
    <!--        //checkPropertyData(domain_id, user_id, property_id, auction_id);-->
    <!--        socket.emit("checkMyBid", {"user_id":user_id, "property_id": property_id, "auction_id": auction_id, "domain_id": domain_id});-->
    <!--        socket.emit("checkBid", {"user_id":user_id, "property_id": property_id, "auction_id": auction_id, "domain_id": domain_id});-->
    <!--      }else{-->
    <!--        //$.growl.error({title: "Error ", message: data.msg, size: 'large'});-->
    <!--        $("#bidding_error_msg").html(data.msg);-->
    <!--        $('#biddingErrorBidModal').modal('show');-->
    <!--      }-->
    <!--  });-->
    <!--});-->

    $(document).on("click", "#confirm_bid_true", function() {
      $('#confirmBidModal').modal('hide');
      var property_id = $(".popup_property_id").val();
      var block_name = "bid_row_"+property_id;
      var auction_id = $("#"+block_name).data("auction");
      var min_bid_amount = $("#"+block_name).data("minimum");
      var bid_increment = $("#"+block_name).data("increment");
      var bid_amount = $('.new_bid_amt').val();
      var registration_id = $("#"+block_name).data("registration");
      bid_amount = bid_amount.toString().replace(/,/g, '');
      // Check bid amount at user end
      socket.emit("addNewBid", {"property_id": property_id, "auction_id": auction_id, "domain_id": domain_id, "min_bid_amount": min_bid_amount, "bid_amount": bid_amount, "bid_increment": bid_increment, "user_id": user_id, "ip_address": ip_address, "registration_id": registration_id});

      socket.on('addNewBid',function(data) {
          if(data.error == 0){
            //$.growl.notice({title: "Success ", message: data.msg, size: 'large'});
            $("#bidding_success_msg").html(data.msg);
            $('#biddingSuccessBidModal').modal('show');
            //checkPropertyData(domain_id, user_id, property_id, auction_id);
            socket.emit("checkMyBid", {"user_id":user_id, "property_id": property_id, "auction_id": auction_id, "domain_id": domain_id});
            socket.emit("checkBid", {"user_id":user_id, "property_id": property_id, "auction_id": auction_id, "domain_id": domain_id});
          }else{
            //$.growl.error({title: "Error ", message: data.msg, size: 'large'});
            $("#bidding_error_msg").html(data.msg);
            $('#biddingErrorBidModal').modal('show');
          }
      });
    });

});
