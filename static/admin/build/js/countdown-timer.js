// Timer for My Bid listing================
$(document).ready(function(){
    setInterval(function(){
        //-------------------------
        $('.bidding_timer').each(function(){
            var propertyId = $(this).attr('data-property');
            var start_date = $(this).attr('data-start-date');
            var end_date = $(this).attr('data-end-date');
            var local_start_date = getLocalDate(start_date, 'm j, Y','');
            var local_end_date = getLocalDate(end_date, 'm j, Y','');
            var count_down_start_date = new Date(local_start_date).getTime();
            var count_down_end_date = new Date(local_end_date).getTime();
            var now = new Date().getTime();
    
            // Find the distance between now and the count down date
    
            var distance = count_down_start_date - now;
            var showTimer = true
            timerElement = $('#timerProperty'+propertyId+' .countdown_text')
            // removed un-necessory classes
            timerElement = timerElement.removeClass('text-success red-text text-warning')
            // default text
            timerElement.html('Auction Starts');
            if(isNaN(distance) || distance < 0){
            distance = count_down_end_date - now;
            if (distance > 0){
                timerElement.html('Auction Ends');
            }else{
                // predict what status should be expired or sold
                // var reservePrice = ($('#reservePriceText' + propertyId + ' span').length > 0) ?Number($('#reservePriceText' + propertyId + ' span').html().replaceAll(',','').replaceAll('$','')):''
                // var currentBid = ($('#highBid' + propertyId).length > 0)?Number($('#highBid' + propertyId).html().replaceAll(',','').replaceAll('$','')):''
                // if (!currentBid){ // no bids available
                //     timerElement.html('<strong>End Without Sold</strong>').addClass('red-text');
                //     showTimer = false
                // } else if (reservePrice && currentBid && reservePrice <= currentBid){ // if reserve set and bids over reserve
                //     timerElement.html('<strong>Auction Ended</strong>').addClass('text-success');
                //     showTimer = false
                // } else if( reservePrice == 0 || reservePrice == '' && currentBid) { // if reserve not set but bids available
                //     timerElement.html('<strong>Auction Ended</strong>').addClass('text-success');
                //     showTimer = false
                // } else if (reservePrice && currentBid && reservePrice > currentBid){ 
                //     timerElement.html('<strong>Pending Review</strong>').addClass('text-warning');
                //     showTimer = false
                // } else {
                    // statusText = ($('#timerProperty'+propertyId).attr('data-status')) ? $('#timerProperty'+propertyId).attr('data-status') : 'Loading...'
                    // timerElement.html('<strong>'+ statusText +'</strong>');
                    // // setup text color
                    // try {
                    //     var statusId = $('#timerProperty'+propertyId).attr('data-status-id')
                    //     if(statusId){
                    //         timerElement.addClass(colorStatusArray[statusId])
                    //     }
                    // } catch (error) {
                        
                    // }
                    showTimer = false
                // }
                timerElement.html('<strong>Auction Completed</strong>').addClass('text-success')
            }
            }
        if(isNaN(distance) || distance < 0){
        $('#timerCounter' + propertyId).hide();
        $('#timerProperty'+propertyId+' .day_remaining').html('00');
        $('#timerProperty'+propertyId+' .hr_remaining').html('00');
        $('#timerProperty'+propertyId+' .min_remaining').html('00');
        $('#timerProperty'+propertyId+' .sec_remaining').html('00');

        }else{
            $('#timerCounter' + propertyId).show();
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
            $('#timerProperty'+propertyId+' .day_remaining').html(days);
            $('#timerProperty'+propertyId+' .hr_remaining').html(hours);
            $('#timerProperty'+propertyId+' .min_remaining').html(minutes);
            $('#timerProperty'+propertyId+' .sec_remaining').html(seconds);
            // If the count down is over, write some text
            if (parseInt(distance) < 0) {
                clearInterval(x);
            }else{
            }
        }
        });
    });
}, 1000);
