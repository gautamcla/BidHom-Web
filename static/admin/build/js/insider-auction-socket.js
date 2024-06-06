const colorStatusArray = { 1 : "text-success", 17: 'text-warning', 10: "text-success", 9: "text-success", 16 : "text-warning", 8: "red-text"}
$(document).ready(function (key, value) {
    setInterval(function(){
    $('.block-item').each(function () {
        if($(this).data("property") && $(this).data("auction")) {
            payload= {
                "user_id":parseInt(user_id),
                "property_id": parseInt($(this).data("property")),
                "auction_id": parseInt($(this).data("auction")),
                "domain_id": parseInt($(this).data('domain'))
            }
            socket.emit("checkInsiderAuctionDashboard", payload);
        }
    });
    }, 5000);

    socket.on('checkInsiderAuctionDashboard',function(response) {
        try {
            if (response.error == 0){
                var all_data = response.data
                var propertyId = all_data.property_id
                //bidding timer
                if(parseInt(all_data.auction_status) != 1){
                    $("#timerProperty" + propertyId).attr('data-start-date', "");
                    $("#timerProperty" + propertyId).attr('data-dutch-end-time', "");
                    $("#timerProperty" + propertyId).attr('data-sealed-start-time', "");
                    $("#timerProperty" + propertyId).attr('data-sealed-end-time', "");
                    $("#timerProperty" + propertyId).attr('data-english-start-time', "");
                    $("#timerProperty" + propertyId).attr('data-end-date', "");
                }else{
                    var start_date = all_data.start_date;
                    var end_date = all_data.end_date;
                    if(start_date){
                        // update timer attribute
                        $("#timerProperty" + propertyId).attr('data-start-date', start_date);
                    }
                    if(end_date) {
                        // update timer attribute
                        $("#timerProperty" + propertyId).attr('data-end-date', end_date);
                        // update edit time attribute
                        $('#editAuctionDetails' + propertyId).attr('data-end-date', end_date);
                    }
                    if(all_data.dutch_end_time)
                        $("#timerProperty" + propertyId).attr('data-dutch-end-time', all_data.dutch_end_time);
                    if(all_data.sealed_start_time)
                        $("#timerProperty" + propertyId).attr('data-sealed-start-time', all_data.sealed_start_time);
                    if(all_data.sealed_end_time)
                        $("#timerProperty" + propertyId).attr('data-sealed-end-time', all_data.sealed_end_time);
                    if(all_data.english_start_time)
                        $("#timerProperty" + propertyId).attr('data-english-start-time', all_data.english_start_time);
                }
                // status attr name
                $("#timerProperty" + propertyId).attr('data-status', all_data.status_name);
                $("#timerProperty" + propertyId).attr('data-status-id', all_data.listing_status);

                // status name column update
                if(all_data.status_name){
                    var auctionStatusEle = $('#auctionStatus' +  propertyId)
                    if(all_data.listing_status == 1 && isFutureDate(all_data.start_date)){
                        auctionStatusEle.html('<strong>Coming Soon</strong>').addClass('text-warning')
                    } else {
                        auctionStatusEle.html('<strong>'+ all_data.status_name +'</strong>')
                        try {
                            auctionStatusEle.addClass(colorStatusArray[all_data.listing_status])
                        } catch (error) {
                            console.log(error)
                        }
                    }
                }
                // start/stop auction
                if(parseInt(all_data.auction_status) == 1){
                    element = $('#stopAuctionDetails' + propertyId)
                    // update start/stop auction
                    $('#startStopAuctionIcon' + propertyId).removeClass('fa-play').addClass('fa-circle')
                    $('#startStopAuctionTooltip' + propertyId).html('Stop Auction')
                    element.attr('data-text', 'Stop Auction?')
                    element.show()
                } else {
                    element = $('#stopAuctionDetails' + propertyId)
                    // update start/stop auction
                    $('#startStopAuctionIcon' + propertyId).addClass('fa-play').removeClass('fa-circle')
                    $('#startStopAuctionTooltip' + propertyId).html('Start Auction')
                    element.attr('data-text', 'Start Auction?')
                    if(parseInt(all_data.auction_status) == 2){
                        element.show()
                    } else {
                        element.hide()
                    }
                }
                // change start date
                if(all_data.start_date){
                    // update edit time attribute
                    $('#editAuctionDetails' + propertyId).attr('data-start-date', all_data.start_date);
                }
                // change end date
                if(all_data.end_date){
                    // update edit time attribute
                    $('#editAuctionDetails' + propertyId).attr('data-end-date', all_data.end_date);
                }
                //-----------Update High Bid Amount-----------
                if(all_data.high_bid && Number(all_data.high_bid) > 0 ){
                    // check curretn hig bidder id
                    isSameUser = $('#highBidderParent' + propertyId).attr('data-id')
                    // update high bidder data attr and high bid amount
                    $('#highBidderParent'  + propertyId).attr('data-id', all_data.high_bidder_user_id)
                    // append if high bidder info is available and different user
                    if($('#highBid'+ propertyId).length > 0){
                        $('#highBid'+ propertyId).html('$'+ numberWithCommas(Number(all_data.high_bid)))
                    } else {
                        $("#highBidderParent" + propertyId).html('<span id="highBid'+ propertyId +'" >$'+ numberWithCommas(Number(all_data.high_bid)) + '</span><br />'); 
                    }
                    // check high bidder info and append if different user than previous 
                    highBidder = response.high_bidder_data
                    if(!$.isEmptyObject(highBidder) && parseInt(isSameUser) != all_data.high_bidder_user_id){
                        address = (!highBidder.address_first) ? '': '<span class="blue-text">' + highBidder.address_first + ',</span><br>'
                        city = (!highBidder.city)? '': highBidder.city + ', '
                        state = (!highBidder.state_name)? '': highBidder.state_name + ', '
                        postal_code = (!highBidder.postal_code)? '': highBidder.postal_code + ', '
                        highBidDivContent = '<span id="highBid'+ propertyId +'" >$'+ numberWithCommas(Number(all_data.high_bid)) + '</span><br />' +
                            '<a href="javascript:void(0);" data-id="'+ propertyId +'" class="blue-text show-detailed-info"><strong>'+ highBidder.first_name + ' ' + highBidder.last_name  + ' <i class="fas fa-chevron-down" id="arrowPositionHighBidder'+ propertyId +'"></i></strong></a><br>' +
                            '<p id="showDetailedinfoBidder'+ propertyId +'" style="display:none">' +
                            address +
                            '<span class="blue-text">' +
                            city + state + postal_code +
                            '</span><br>' +
                            '<span class="blue-text">'+ formatPhoneNumber(highBidder.phone_no) +'</span><br>' +
                            '<span class="blue-text">'+ highBidder.email +'</span><br>' +
                            highBidder.ip_address +
                        '</p>';
                        $("#highBidderParent" + propertyId).html(highBidDivContent);
                    }
                }else{
                    $('#highBidderParent' + propertyId).html('NA')
                }

                // total bid counter
                if(all_data.bid_count && parseInt(all_data.bid_count) > 0){
                    $('#totalBidCount' + propertyId).val(parseInt(all_data.bid_count)).html(parseInt(all_data.bid_count))
                } else {
                    $('#totalBidCount' + propertyId).val(0).html(0)
                }

                // total bidder counter
                if(all_data.bidders && parseInt(all_data.bidders) > 0){
                    $('#totalBidderCount' + propertyId).val(parseInt(all_data.bidders)).html(parseInt(all_data.bidders))
                } else {
                    $('#totalBidderCount' + propertyId).val(0).html(0)
                }

                // total watcher counter
                if(all_data.watchers && parseInt(all_data.watchers) > 0){
                    $('#totalWatcherCount' + propertyId).val(parseInt(all_data.watchers)).html(parseInt(all_data.watchers))
                } else {
                    $('#totalWatcherCount' + propertyId).val(0).html(0)
                }

                // bid increment 
                if(all_data.bid_increments){
                    // $('#bidIncremementValue' + propertyId).val(all_data.bid_increments);
                    $('#bidIncText' + propertyId + ' span').html('$'+ numberWithCommas(Number(all_data.bid_increments)));
                }

                // reserve increment and no reserve amount
                if(all_data.reserve_amount){
                    // $('#reservePriceValue' + propertyId).val(all_data.reserve_amount);
                    $('#reservePriceText' + propertyId + ' span').html('$'+ numberWithCommas(Number(all_data.reserve_amount)));
                    $('#noReserveAuction' + propertyId).html('<span class="badge badge-success"> Yes</span>')
                } else {
                    $('#reservePriceText' + propertyId + ' span').html('$0');
                    $('#noReserveAuction' + propertyId).html('<span class="badge badge-danger"> No</span>')
                }

                //next bid
                var nextBid = 0
                if(all_data.high_bid && all_data.bid_count && parseInt(all_data.bid_count) > 0){
                    nextBid = numberWithCommas(Number(all_data.high_bid) + Number(all_data.bid_increments))
                } else {
                    nextBid = numberWithCommas(Number(all_data.start_price))
                }
                $('#nextBid' + propertyId).val('$' + nextBid)

                // reserve met text
                if(all_data.high_bid && all_data.reserve_amount && all_data.high_bid >= all_data.reserve_amount ){
                    $('#reserveMet' + propertyId).html('<span class="badge badge-success"> Yes</span>')
                } else {
                    $('#reserveMet' + propertyId).html('<span class="badge badge-danger"> No</span>')
                }

                /* highlight row on new big added
                new_bid_added = true when no new bid added
                new_bid_added = false when new bid added
                */
                // if(all_data.new_bid_added){
                //     $('#auctionList').find(`[data-property='${propertyId}']`).removeClass('focused-bid-row')
                // } else {
                //     $('#auctionList').find(`[data-property='${propertyId}']`).addClass('focused-bid-row')
                // }

            }   
        } catch (error) {
            console.log(error)
        }
    });
});


function isFutureDate(date)
{
    var dateC=new Date();
    var dateS = new Date(date);
    if(dateC.getTime()<dateS.getTime()){
        return true
    }
    return false
}