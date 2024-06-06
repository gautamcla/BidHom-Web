ones = ["", "one ", "two ", "three ", "four ", "five ", "six ", "seven ", "eight ", "nine ", "ten ", "eleven ",
        "twelve ", "thirteen ", "fourteen ", "fifteen ", "sixteen ", "seventeen ", "eighteen ", "nineteen "];

twenties = ["", "", "twenty ", "thirty ", "forty ", "fifty ", "sixty ", "seventy ", "eighty ", "ninety "];

thousands = ["", "thousand ", "million ", "billion ", "trillion ", "quadrillion ", "quintillion ", "sextillion ",
             "septillion ", "octillion ", "nonillion ", "decillion ", "undecillion ", "duodecillion ", "tredecillion ",
             "quattuordecillion ", "quindecillion", "sexdecillion ", "septendecillion ", "octodecillion ",
             "novemdecillion ", "vigintillion "];
$(document).ready(function(){
    // get_chat_count();
    get_notification_count();
    $('.alphaAccpt').on('keypress', function(event) {
        var key = event.keyCode;
        return ((key >= 65 && key <= 90) || (key == 8) || (key >= 97 && key <= 122));
      });
    $('.covert_auction_date_range_all_listings').each(function(){
        try{
            response = date_conversation_start_end_date($(this).attr('data-start-date'), $(this).attr('data-end-date'))
            $(this).html(response);
        }catch(ex){
           // console.log(ex);
        }

    });
    $('.covert_bidding_date').each(function(){
        var new_date = '';
        var added_no =$(this).attr('data-value');
        if(added_no.trim() != "" && added_no.trim() != "None"){
            local_date = getLocalDate(added_no.trim(), 'j m, Y','ampm');
            var arr_local_date = local_date.split(' ');
            var date_y = arr_local_date[1].toString().replace(',','');
            local_time = arr_local_date[3]+' '+arr_local_date[4]
            local_year = arr_local_date[2];
            new_date = date_y+' '+arr_local_date[0]+', '+local_year+' '+local_time +' CT';
        }
        $(this).html(new_date);
    });

    $('.convert_to_local_date_message').each(function(){
        try{
            var added_on = $(this).attr('data-value');
            if(added_on.trim() != "" && added_on.trim() != "None"){
                var local_date = getLocalDateCustomized(added_on.trim());
                $(this).html(local_date);
            }else{
                $(this).html('');
            }
        }catch(ex){
            //console.log(ex);
        }
    });

    $('.convert_to_local_date_time').each(function(){
        try{
            var added_on = $(this).attr('data-value');
            if(added_on.trim() != "" && added_on.trim() != "None"){
                var local_date = getLocalDate(added_on.trim(), 'mm-dd-yyyy','ampm');
                $(this).html(local_date);
            }else{
                $(this).html('');
            }
        }catch(ex){
            //console.log(ex);
        }
    });

    $('.convert_to_local_time').each(function(){
        try{
            var added_on = $(this).attr('data-value');
            if(added_on.trim() != "" && added_on.trim() != "None"){
                var local_date = getLocalDate(added_on.trim(), 'mm-dd-yyyy','ampm');
                var actual_date = local_date.split(" ");
                $(this).html(actual_date[1]+' '+actual_date[2]);
            }else{
                $(this).html('');
            }
        }catch(ex){
            //console.log(ex);
        }
    });
    $('.convert_to_local_date').each(function(){
        try{
            var added_on = $(this).attr('data-value');
            if(added_on.trim() != "" && added_on.trim() != "None"){
                var local_date = getLocalDate(added_on.trim(), 'mm-dd-yyyy','ampm');
                var actual_date = local_date.split(" ");
                $(this).html(actual_date[0]);
            }else{
                $(this).html('');
            }
        }catch(ex){
            //console.log(ex);
        }
    });
    $('.phone-no').each(function(){
       try{
        var phone = $(this).html();
        var cleaned = ('' + phone).replace(/\D/g, '');
        var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
        if (match) {
          $(this).html('(' + match[1] + ') ' + match[2] + '-' + match[3]);
        }
       }catch(ex){
         //console.log(ex);
       }
    });

    $(document).on('keyup', '#favourite_search', function(e){
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
                url: '/favourite-search-suggestion/',
                type: 'post',
                dateType: 'json',
                cache: false,
                data: {'search': search},
                beforeSend: function(){

                },
                success: function(response){
                    if(response.error == 0 && response.status == 200){
                        autocomplete("favourite_search", response.suggestion_list);
                    }else{
                        closeAllSuggestions('autocomplete-items');
                    }
                }
            });
          }

  });
  $('.convert_input_to_local_date_time').each(function(){
        try{
            var added_on = $(this).attr('data-value');
            if(added_on.trim() != "" && added_on.trim() != "None"){
                var local_date = getLocalDate(added_on.trim(), 'mm-dd-yyyy','');
                $(this).val(local_date);
            }else{
                $(this).val('');
            }
        }catch(ex){
            //console.log(ex);
        }
    });
    $('.convert_notification_date_time').each(function(){
        try{
            var added_on = $(this).attr('data-value');
            if(added_on.trim() != "" && added_on.trim() != "None"){
                var local_date_time = getLocalDate(added_on.trim(), 'M j, Y','ampm');
                var local_date_arr = local_date_time.split(' ');
                var local_date = local_date_arr[0]+' '+local_date_arr[1]+' '+local_date_arr[2];
                $(this).html(local_date);
            }else{
                $(this).html('');
            }
        }catch(ex){
            //console.log(ex);
        }
    });
});
function getLocalDate(myTimeStamp, dateformat, timeformat){

    var dateX = new Date(myTimeStamp);
    var dateY = new Date();
    var date = '';
    if(myTimeStamp.includes('Z')){
        //if utc format
        date = new Date(dateX.getTime());
    }
    else{
        // for non utc format
        date = new Date(dateX.getTime() - dateY.getTimezoneOffset() * 60000);
    }
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
    var timeStp = '';
    if(dateformat == 'yyyy-mm-dd'){
        timeStp = fullyear+'-'+month_num+'-'+dt;
    }else if(dateformat == 'mm-dd-yyyy'){
        timeStp = month_num+'-'+dt+'-'+fullyear;
    }else if(dateformat == 'dd-mm-yyyy'){
        timeStp = dt+'-'+month_num+'-'+fullyear;
    }else if(dateformat == 'dd-mm-yy'){
        timeStp = dt+'-'+month_num+'-'+halfYear;
    }else if(dateformat == 'mm-dd-yy'){
        timeStp = month_num+'-'+dt+'-'+halfYear;
    }else if(dateformat == 'yy-mm-dd'){
        timeStp = halfYear+'-'+month_num+'-'+dt;
    }else if(dateformat == 'j m, Y'){
        timeStp = dt+' '+short_month_name+', '+fullyear;
    }else if(dateformat == 'm j, Y'){
        timeStp = short_month_name+', '+dt+' '+fullyear;
    }else if(dateformat == 'M j, Y'){
        timeStp = long_month_name+' '+dt+', '+fullyear;
    }else if(dateformat == 'j M, Y'){
        timeStp = dt+' '+long_month_name+', '+fullyear;
    }
    if(timeformat =='ampm'){
        var mer = (parseInt(hrs) >= 12)?'PM':'AM';
        hrs = parseInt(hrs) % 12;
        hrs = (hrs)?hrs:12;
        timeStpDate = timeStp+" "+hrs+":"+mins+" "+mer;
    }else{
        timeStpDate = timeStp+" "+hrs+":"+mins+":"+secs;
    }
    return timeStpDate;
}
function redirect_login(url){
  window.location.href=url;
}
function get_address_by_zipcode(params){
    var call_function;
    var zip_code = params.zip_code;
    if(params.call_function){
        call_function = params.call_function;
    }

    try{
        rel_position = params.rel_position;
    }catch(ex){
        //console.log(ex);
        rel_position = '';
    }
    $.ajax({
        url: '/zipcode-address-details/',
        type: 'post',
        dateType: 'json',
        cache: false,
        data: {zip_code: zip_code},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            if(response.error == 0){
                //$('#property_city').val(response.city);
                custom_response = {
                    status: response.status,
                    state: response.state,
                    city: response.city,
                    error: response.error,
                    rel_position: rel_position
                }
               customCallBackFunc(call_function, [custom_response]);
            }

        }
    });
}

function customCallBackFunc(callback, args)
{
    //do stuff
    //...
    //execute callback when finished
    callback.apply(this, args);
}
// function get_chat_count(){
//     $.ajax({
//         url: '/get-chat-count/',
//         type: 'post',
//         dataType: 'json',
//         cache: false,
//         beforeSend: function(){
//            // $('.overlay').show();
//         },
//         success: function(response){
//             if(response.error == 0 && parseInt(response.chat_count) > 0){
//                 $('#userDashboardChatCount').html(response.chat_count);
//                 $('#userDashboardChatCount').show();
//             }else{
//                 $('#userDashboardChatCount').hide();
//             }
//         }
//     });
// }


function remove_string(list, value, separator) {
  separator = separator || ",";
  var values = list.split(separator);
  for(var i = 0 ; i < values.length ; i++) {
    if(values[i] == value) {
      values.splice(i, 1);
      return values.join(separator);
    }
  }
  return list;
}
function convert_to_utc_date(myTimeStamp, dateformat, timeformat){

    var dateX = new Date(myTimeStamp);
    var dateY = new Date();
    var date = new Date(dateX.getTime() + dateY.getTimezoneOffset() * 60000);

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

    var timeStp = '';
    if(dateformat == 'yyyy-mm-dd'){
        timeStp = fullyear+'-'+month_num+'-'+dt;
    }else if(dateformat == 'mm-dd-yyyy'){
        timeStp = month_num+'-'+dt+'-'+fullyear;
    }else if(dateformat == 'dd-mm-yyyy'){
        timeStp = dt+'-'+month_num+'-'+fullyear;
    }else if(dateformat == 'dd-mm-yy'){
        timeStp = dt+'-'+month_num+'-'+halfYear;
    }else if(dateformat == 'mm-dd-yy'){
        timeStp = month_num+'-'+dt+'-'+halfYear;
    }else if(dateformat == 'yy-mm-dd'){
        timeStp = halfYear+'-'+month_num+'-'+dt;
    }else if(dateformat == 'j m, Y'){
        timeStp = dt+' '+short_month_name+', '+fullyear;
    }else if(dateformat == 'm j, Y'){
        timeStp = short_month_name+' '+dt+', '+fullyear;
    }else if(dateformat == 'M j, Y'){
        timeStp = long_month_name+' '+dt+'th , '+fullyear;
    }else if(dateformat == 'j M, Y'){
        timeStp = dt+' '+long_month_name+', '+fullyear;
    }
    if(timeformat =='ampm'){
        var mer = (parseInt(hrs) >= 12)?'PM':'AM';
        hrs = parseInt(hrs) % 12;
        hrs = (hrs)?hrs:12;
        timeStp = timeStp+" "+hrs+":"+mins+" "+mer;
    }else{
        timeStp = timeStp+" "+hrs+":"+mins+":"+secs;
    }
    return timeStp;
}
function convert_to_utc_datetime(myTimeStamp,format){
    let dateX = new Date(myTimeStamp);
    let dateY = new Date();
    let date = new Date(dateX.getTime() + dateY.getTimezoneOffset() * 60000);

    let year = date.getFullYear();
    let mts = date.getMonth()+1;
    let month = (mts < 10)?'0'+mts:mts;
    let dt = (date.getDate() < 10)?'0'+date.getDate():date.getDate();
    let hrs = (date.getHours() < 10)?'0'+date.getHours():date.getHours();
    let mins = (date.getMinutes() < 10)?'0'+date.getMinutes():date.getMinutes();
    let secs = (date.getSeconds() < 10)?'0'+date.getSeconds():date.getSeconds();
    let timeStp = '';
    if(format =='ampm'){
        let mer = (hrs >= 12)?'PM':'AM';
        hrs = hrs % 12;
        hrs = (hrs)?hrs:12;
        //timeStp = month +"-"+dt+"-"+year+" at "+hrs+":"+mins+" "+mer;
        timeStp = year +"-"+month+"-"+dt+" "+hrs+":"+mins+" "+mer;
    }
    else{
        timeStp = year +"-"+month+"-"+dt+" "+hrs+":"+mins+":"+secs;
    }
    return timeStp;
}
function convert_to_24h(time_str) {
    try{
        var time =time_str;
        var hours = Number(time.match(/^(\d+)/)[1]);
        var minutes = Number(time.match(/:(\d+)/)[1]);
        var AMPM = time.match(/\s(.*)$/)[1];
        if(AMPM == "PM" && hours<12) hours = hours+12;
        if(AMPM == "AM" && hours==12) hours = hours-12;
        var sHours = hours.toString();
        var sMinutes = minutes.toString();
        if(hours<10) sHours = "0" + sHours;
        if(minutes<10) sMinutes = "0" + sMinutes;
        var actualTime = sHours + ":" + sMinutes + ":00";
        return actualTime;
    }catch(ex){
        //console.log(ex);
        return "";
    }

  }
  function numberFormat(x) {
     x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
}

function ucfirst(str,force){
    str=force ? str.toLowerCase() : str;
    return str.replace(/(\b)([a-zA-Z])/,
             function(firstLetter){
                return   firstLetter.toUpperCase();
             });
}


function date_conversation_start_end_date(start_date, end_date){
    try{
        var local_start_date = '',
            local_end_date = '',
            new_start_date = '',
            new_end_date = '',
            start_time = '',
            end_time = '',
            start_year = '',
            end_year = '',
            converted_date = '';
        // break start date
        if(start_date.trim() != "" && start_date.trim() != "None"){
            local_start_date = getLocalDate(start_date.trim(), 'j m, Y','ampm');
            var arr_local_start_date = local_start_date.split(' ');
            var date_x = arr_local_start_date[1].toString().replace(',','');
            start_time = arr_local_start_date[3]+' '+arr_local_start_date[4]
            start_year = arr_local_start_date[2]
            new_start_date = date_x+' '+arr_local_start_date[0];
        }
        // break end date
        if(end_date.trim() != "" && end_date.trim() != "None"){
            local_end_date = getLocalDate(end_date.trim(), 'j m, Y','ampm');
            var arr_local_end_date = local_end_date.split(' ');
            var date_y = arr_local_end_date[1].toString().replace(',','');
            end_time = arr_local_end_date[3]+' '+arr_local_end_date[4]
            end_year = arr_local_end_date[2]
            new_end_date = date_y+' '+arr_local_end_date[0];
        }
        // check if any of both is avaialble
        if ((new_start_date.trim() != "" && new_start_date.trim() != "None") || (new_end_date.trim() != "" && new_end_date.trim() != "None")) {
            
            // check if start date avilable and assign it to output var
            if(new_start_date.trim() != "" && new_start_date.trim() != "None"){
                converted_date = new_start_date;
            }
            if(converted_date.trim() != "" && new_end_date.trim() != "" && new_end_date.trim() != "None"){
                if(Number(start_year) != Number(end_year)){
                    converted_date = converted_date + ', ' + start_year + ' - ' + new_end_date + ', ' + end_year + ' ' + end_time + ' EST'
                } else {
                    // check if both date are equal
                    if(new_start_date == new_end_date)
                        converted_date = converted_date + ', ' +  start_year + ' ' + start_time + ' - ' + end_time + ' EST'
                    else
                        converted_date = converted_date + ' - ' + new_end_date + ', ' + end_year + ' ' + end_time + ' EST'
                }
            }else{
                converted_date = converted_date+' EST';
            }

            if(converted_date.trim() != ""){
                converted_date = 'Auction On ' + converted_date;
            }
        } else {
            converted_date = 'No Dates Available'
        }
        return converted_date
        // $(this).html(converted_date);
    }catch(ex){
        //console.log(ex);
        return false
    }
}
function asset_details_conversation_start_end_date(start_date, end_date){
    try{
        var local_start_date = '',
            local_end_date = '',
            new_start_date = '',
            new_end_date = '',
            start_time = '',
            end_time = '',
            start_year = '',
            end_year = '',
            converted_date = '';
        // break start date
        if(start_date.trim() != "" && start_date.trim() != "None"){
            local_start_date = getLocalDate(start_date.trim(), 'j m, Y','ampm');
            var arr_local_start_date = local_start_date.split(' ');
            var date_x = arr_local_start_date[1].toString().replace(',','');
            start_time = arr_local_start_date[3]+' '+arr_local_start_date[4]
            start_year = arr_local_start_date[2]
            new_start_date = date_x+' '+arr_local_start_date[0];
        }
        // break end date
        if(end_date.trim() != "" && end_date.trim() != "None"){
            local_end_date = getLocalDate(end_date.trim(), 'j m, Y','ampm');
            var arr_local_end_date = local_end_date.split(' ');
            var date_y = arr_local_end_date[1].toString().replace(',','');
            end_time = arr_local_end_date[3]+' '+arr_local_end_date[4]
            end_year = arr_local_end_date[2]
            new_end_date = date_y+' '+arr_local_end_date[0];
        }
        // check if any of both is avaialble
        if ((new_start_date.trim() != "" && new_start_date.trim() != "None") || (new_end_date.trim() != "" && new_end_date.trim() != "None")) {

            // check if start date avilable and assign it to output var
            if(new_start_date.trim() != "" && new_start_date.trim() != "None"){
                converted_date = new_start_date;
            }
            if(converted_date.trim() != "" && new_end_date.trim() != "" && new_end_date.trim() != "None"){
                if(Number(start_year) != Number(end_year)){
                    converted_date = converted_date + ', ' + start_year + ' - ' + new_end_date + ', ' + end_year + ' ' + end_time + ' EST'
                } else {
                    // check if both date are equal
                    if(new_start_date == new_end_date)
                        converted_date = converted_date + ', ' +  start_year + ' ' + start_time + ' - ' + end_time + ' EST'
                    else
                        converted_date = converted_date + ' - ' + new_end_date + ', ' + end_year + ' ' + end_time + ' EST'
                }
            }else{
                converted_date = converted_date+' EST';
            }

            if(converted_date.trim() != ""){
                converted_date = converted_date;
            }
        } else {
            converted_date = 'No Dates Available'
        }
        return converted_date
        // $(this).html(converted_date);
    }catch(ex){
        //console.log(ex);
        return false
    }
}

function month_date_year(start_date){
    try{
        var local_start_date = '',
            local_end_date = '',
            new_start_date = '',
            new_end_date = '',
            start_time = '',
            end_time = '',
            start_year = '',
            end_year = '',
            converted_date = '';
        // break start date
        if(start_date.trim() != "" && start_date.trim() != "None"){
            local_start_date = getLocalDate(start_date.trim(), 'j m, Y','ampm');
            //console.log("=======Checking======");
            //console.log(local_start_date);
            var arr_local_start_date = local_start_date.split(' ');
            //console.log(arr_local_start_date);
            var date_x = arr_local_start_date[1].toString().replace(',','');
            start_time = arr_local_start_date[3]+' '+arr_local_start_date[4]
            start_year = arr_local_start_date[2]
            new_start_date = date_x+' '+arr_local_start_date[0]+ ', '+arr_local_start_date[2]+' '+arr_local_start_date[3]+' '+arr_local_start_date[4];
        }

        // check if any of both is avaialble
        if (new_start_date.trim() != "" && new_start_date.trim() != "None") {

            // check if start date avilable and assign it to output var
            if(new_start_date.trim() != "" && new_start_date.trim() != "None"){
                converted_date = new_start_date;
            }
        } else {
            converted_date = 'No Dates Available'
        }
        return converted_date
    }catch(ex){
        //console.log(ex);
        return false
    }
}

function get_notification_count(){
    $.ajax({
        url: '/get-notification-count/',
        type: 'post',
        dataType: 'json',
        cache: false,
        beforeSend: function(){
           // $('.overlay').show();
        },
        success: function(response){
            if(response.error == 0 && parseInt(response.notification_count) > 0){
                $('#notification_count').html(response.notification_count);
                $('#notification_count').show();
                $('.user-notification').show();
            }else{
                $('#notification_count').hide();
                $('#notification_count').html('');

            }
        }
    });
}
function get_notification_details(){
    $.ajax({
        url: '/get-notification-details/',
        type: 'post',
        dataType: 'json',
        cache: false,
        beforeSend: function(){
           // $('.overlay').show();
        },
        success: function(response){
            if(response.error == 0){
                if(response.noti_listing_html){
                    $('#notification_list').html(response.noti_listing_html);
                }else{
                    $('#notification_list').html('<li class="notiMenu">No notification found!</li>');
                }

                $('#notification_count').hide();
                $('#notification_list').find('script').remove();
            }else{
                $('#notification_list').html('<li class="notiMenu">No notification found!</li>');
            }
        }
    });
}
/*function num999(n){
    c = n % 10;
    c = parseInt(c);
    b = ((n % 100) - c) / 10;
    b = parseInt(b);
    a = ((n % 1000) - (b * 10) - c) / 100
    a = parseInt(a);
    t = "";
    h = "";
    if(a != 0 && b == 0 && c == 0){
        t = ones[a] + "hundred ";
    }else if(a != 0){
        t = ones[a] + "hundred and ";
    }
    if(b <= 1){
        h = ones[n%100];
    }else if(b > 1){
        h = twenties[b] + ones[c];
    }
    st = t + h;
    return st;
}
function convert_number_to_words(number) {
    num = parseInt(number);
    try{
        if(num == 0){
            return 'zero';
        }
        i = 3;
        n = num.toString();
        word = "";
        k = 0;
        while(i == 3){
            nw = n[-i:];
            n = n[:-i];
            if (int(nw) == 0){
                word = num999(int(nw)) + thousands[int(nw)] + word;
            }else{
                word = num999(int(nw)) + thousands[k] + word;
            }
            if(n == ''){
                i = i + 1;
            }
            k += 1;
        }
        return word[:-1].toUpperCase();
    }catch(ex){
        console.log(ex);
        return "";
    }

}*/
function convert_number_to_words(number) {
    var digit = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    var elevenSeries = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    var countingByTens = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    var shortScale = ['', 'thousand', 'million', 'billion', 'trillion'];

    number = number.toString();
    number = number.replace(/[\, ]/g, '');
    if (number != parseFloat(number)) return 'not a number'; var x = number.indexOf('.'); if (x == -1) x = number.length; if (x > 15) return 'too big'; var n = number.split(''); var str = ''; var sk = 0; for (var i = 0; i < x; i++) { if ((x - i) % 3 == 2) { if (n[i] == '1') { str += elevenSeries[Number(n[i + 1])] + ' '; i++; sk = 1; } else if (n[i] != 0) { str += countingByTens[n[i] - 2] + ' '; sk = 1; } } else if (n[i] != 0) { str += digit[n[i]] + ' '; if ((x - i) % 3 == 0) str += 'hundred '; sk = 1; } if ((x - i) % 3 == 1) { if (sk) str += shortScale[(x - i - 1) / 3] + ' '; sk = 0; } } if (x != number.length) { var y = number.length; str += 'point '; for (var i = x + 1; i < y; i++) str += digit[n[i]] + ' '; } str = str.replace(/\number+/g, ' ');
    return str.trim();

}


function getLocalDateCustomized(myTimeStamp){
    var dateX = new Date(myTimeStamp);
    var dateY = new Date();
    var date = '';
    if(myTimeStamp.includes('Z')){
        //if utc format
        date = new Date(dateX.getTime());
    }
    else{
        // for non utc format
        date = new Date(dateX.getTime() - dateY.getTimezoneOffset() * 60000);
    }
    var fullyear = date.getFullYear();
    var mts = date.getMonth()+1;
    var month_num = (mts < 10)?'0'+mts:mts;
    var dt = (date.getDate() < 10)?'0'+date.getDate():date.getDate();
    var hrs = (date.getHours() < 10)?'0'+date.getHours():date.getHours();
    var mins = (date.getMinutes() < 10)?'0'+date.getMinutes():date.getMinutes();

    var timeStp = month_num+'/'+dt+'/'+fullyear;
    var mer = (parseInt(hrs) >= 12)?'PM':'AM';
        hrs = parseInt(hrs) % 12;
        hrs = (hrs)?hrs:12;
    
    // if today
    if(date.getDate() == dateY.getDate() && date.getMonth() == dateY.getMonth() && date.getFullYear() == dateY.getFullYear()){
        return hrs+":"+mins+" "+mer
    } else if((date.getDate() + 1) == dateY.getDate() && date.getMonth() == dateY.getMonth() && date.getFullYear() == dateY.getFullYear()){
        return 'Yesterday'
    } else {
        return timeStp
    }
}
function formatPhoneNumber(phoneNumberString) {
  var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return null;
}
function dashboard_favourite_listing(property, element){

        $.ajax({
            url: '/make-favourite-listing/',
            type: 'post',
            dataType: 'json',
            cache: false,
            data: {'property': property},
            beforeSend: function(){

            },
            success: function(response){
                if(response.error == 0){
                    if($(element).hasClass('active') == true){
                        $(element).removeClass('active');
                        property_id = property.toString();
                        /*try{
                            $('#listing_map_inner_'+property_id+' .like_post').removeClass('active');
                        }catch(ex){
                            //console.log(ex);
                        }
                        try{
                            $('#listing_map_'+property_id+' .like_post').removeClass('active');
                        }catch(ex){
                            //console.log(ex);
                        }*/
                        $.growl.notice({title: "Listing ", message: "Removed from favorite listing", size: 'large'});
                    }else{
                        $(element).addClass('active');
                        property_id = property.toString();
                        /*try{
                            $('#listing_map_'+property_id+' .like_post').addClass('active');
                        }catch(ex){
                            //console.log(ex);
                        }
                        try{
                           $('#listing_map_inner_'+property_id+' .like_post').addClass('active');
                        }catch(ex){
                            //console.log(ex);
                        }*/

                        $.growl.notice({title: "Listing ", message: response.msg, size: 'large'});
                    }

                }else{
                    $.growl.error({title: "Listing ", message: response.msg, size: 'large'});
                }
            }
        });
    }


function close_tour(){
        $.ajax({
            url: "/close-tour/",
            type: "post",
            dataType: "json",
            cache: false,
            data: {},
            beforeSend: function () {
                $('.overlay').show();
            },
            complete: function(){
            },
            success: function (response) {
                $('.overlay').hide();
                if (response.status == 200){
                    setTimeout(function(){
//                        if (response.show_active_plan){
//                            window.open(response.data.stripe_active_payment_link+"?prefilled_email="+response.email, '_blank');
//                        }else{
//                            window.open(response.data.stripe_payment_link+"?prefilled_email="+response.email, '_blank');
//                        }
                          if(response.pay_redirect){
                            if (response.show_active_plan){
                                window.open(response.data.stripe_active_payment_link+"?prefilled_email="+response.email, '_blank');
                            }else{
                                window.open(response.data.stripe_payment_link+"?prefilled_email="+response.email, '_blank');
                            }
                          }
                    }, 1000);
                }
            }
        });
}