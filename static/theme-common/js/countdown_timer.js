//$(document).ready(function(){
//$('.bidding_timer').each(function(){
//    var row_id = $(this).attr('rel_id');
//    var start_date = $(this).attr('data-start-date');
//    var end_date = $(this).attr('data-end-date');
//    var local_start_date = getLocalDate(start_date, 'm j, Y','');
//    var local_end_date = getLocalDate(end_date, 'm j, Y','');
//    var count_down_start_date = new Date(local_start_date).getTime();
//    var count_down_end_date = new Date(local_end_date).getTime();
//    var x = setInterval(function() {
//    // Get today's date and time
//      var now = new Date().getTime();
//
//      // Find the distance between now and the count down date
//
//      var distance = count_down_start_date - now;
//        $('#bidding_timer_'+row_id+' .countdown_text').html('Bidding Start In: ');
//      if(isNaN(distance) || distance < 0){
//        //alert("ok");
//        distance = count_down_end_date - now;
//        $('#bidding_timer_'+row_id+' .countdown_text').html('Bidding End In: ');
//      }
//      if(isNaN(distance) || distance < 0){
//        $('#bidding_timer_'+row_id+' .day_remaining').html('00');
//        $('#bidding_timer_'+row_id+' .hr_remaining').html('00');
//        $('#bidding_timer_'+row_id+' .min_remaining').html('00');
//        $('#bidding_timer_'+row_id+' .sec_remaining').html('00');
//
//      }else{
//
//        // Time calculations for days, hours, minutes and seconds
//      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
//      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
//      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
//      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
//      if(parseInt(days) < 10){
//        days = '0'+days.toString();
//      }
//      if(parseInt(hours) < 10){
//        hours = '0'+hours.toString();
//      }
//      if(parseInt(minutes) < 10){
//        minutes = '0'+minutes.toString();
//      }
//      if(parseInt(seconds) < 10){
//        seconds = '0'+seconds.toString();
//      }
//        $('#bidding_timer_'+row_id+' .day_remaining').html(days);
//        $('#bidding_timer_'+row_id+' .hr_remaining').html(hours);
//        $('#bidding_timer_'+row_id+' .min_remaining').html(minutes);
//        $('#bidding_timer_'+row_id+' .sec_remaining').html(seconds);
//      // If the count down is over, write some text
//      if (parseInt(distance) < 0) {
//        clearInterval(x);
//        //$('.time_remaining').hide();
//      }else{
//        //$('.time_remaining').show();
//      }
//      }
//},1000);
//});
//});

//=====================Timer for My Bid listing================
$(document).ready(function(){
setInterval(function(){
    //-------------------------
    $('.bidding_timer').each(function(){
        var row_id = $(this).attr('rel_id');
        var start_date = $(this).attr('data-start-date');
        var end_date = $(this).attr('data-end-date');
        var local_start_date = getLocalDate(start_date, 'm j, Y','');
        var local_end_date = getLocalDate(end_date, 'm j, Y','');
        var count_down_start_date = new Date(local_start_date).getTime();
        var count_down_end_date = new Date(local_end_date).getTime();
        var now = new Date().getTime();

        // Find the distance between now and the count down date

         var distance = count_down_start_date - now;
         $('#bidding_timer_'+row_id+' .countdown_text').html('Bidding Start In: ');
         if(isNaN(distance) || distance < 0){
            //alert("ok");
            distance = count_down_end_date - now;
            if (distance > 0){
                $('#bidding_timer_'+row_id+' .countdown_text').html('Bidding End In: ');
            }else{
                $('#bidding_timer_'+row_id+' .countdown_text').html('');
            }
         }
      if(isNaN(distance) || distance < 0){
        $('#bidding_timer_'+row_id+' .day_remaining').html('00');
        $('#bidding_timer_'+row_id+' .hr_remaining').html('00');
        $('#bidding_timer_'+row_id+' .min_remaining').html('00');
        $('#bidding_timer_'+row_id+' .sec_remaining').html('00');

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
        $('#bidding_timer_'+row_id+' .day_remaining').html(days);
        $('#bidding_timer_'+row_id+' .hr_remaining').html(hours);
        $('#bidding_timer_'+row_id+' .min_remaining').html(minutes);
        $('#bidding_timer_'+row_id+' .sec_remaining').html(seconds);
        // If the count down is over, write some text
        if (parseInt(distance) < 0) {
            clearInterval(x);
            //$('.time_remaining').hide();
        }else{
            //$('.time_remaining').show();
        }
      }
    });
    //-------------------------
    });
}, 1000);


function bidder_countdown_timer(){
    $('.bidding_timer').each(function(){
    try{
        clearInterval(x);
    }catch(ex){
        console.log(ex);
    }

    var row_id = $(this).attr('rel_id');
    var start_date = $(this).attr('data-start-date');
    var end_date = $(this).attr('data-end-date');
    var local_start_date = getLocalDate(start_date, 'm j, Y','');
    var local_end_date = getLocalDate(end_date, 'm j, Y','');
    var count_down_start_date = new Date(local_start_date).getTime();
    var count_down_end_date = new Date(local_end_date).getTime();
    var x = setInterval(function() {
    // Get today's date and time
      var now = new Date().getTime();

      // Find the distance between now and the count down date

      var distance = count_down_start_date - now;
        $('#bidding_timer_'+row_id+' .countdown_text').html('Bidding Start In: ');
      if(isNaN(distance) || distance < 0){
        //alert("ok");
        distance = count_down_end_date - now;
        $('#bidding_timer_'+row_id+' .countdown_text').html('Bidding End In: ');
      }
      if(isNaN(distance) || distance < 0){
        $('#bidding_timer_'+row_id+' .day_remaining').html('00');
        $('#bidding_timer_'+row_id+' .hr_remaining').html('00');
        $('#bidding_timer_'+row_id+' .min_remaining').html('00');
        $('#bidding_timer_'+row_id+' .sec_remaining').html('00');

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
        $('#bidding_timer_'+row_id+' .day_remaining').html(days);
        $('#bidding_timer_'+row_id+' .hr_remaining').html(hours);
        $('#bidding_timer_'+row_id+' .min_remaining').html(minutes);
        $('#bidding_timer_'+row_id+' .sec_remaining').html(seconds);
      // If the count down is over, write some text
      if (parseInt(distance) < 0) {
        clearInterval(x);
        //$('.time_remaining').hide();
      }else{
        //$('.time_remaining').show();
      }
      }
},1000);
});
}
