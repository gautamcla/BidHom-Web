$(document).ready(function(){
    $('.convert_to_local_date_time').each(function(){
        try{
            var added_on = $(this).attr('data-value');
            if(added_on.trim() != "" && added_on.trim() != "None"){
                var local_date = getLocalDate(added_on.trim(), 'mm/dd/yyyy','ampm');
                actual_date = local_date.split(" ");
                actual_date = actual_date[0]+' <span>'+actual_date[1]+' '+actual_date[2]+'</span>';
                $(this).html(actual_date);
            }else{
                $(this).html('');
            }
        }catch(ex){
            console.log(ex);
        }
    });
    $('.convert_to_local_time').each(function(){
        try{
            var added_on = $(this).attr('data-value');
            if(added_on.trim() != "" && added_on.trim() != "None"){
                var local_date = getLocalDate(added_on.trim(), 'mm/dd/yyyy','ampm');
                //console.log(local_date);
                var actual_date = local_date.split(" ");
                //actual_date = actual_date[0]+' '+actual_date[1]+' '+actual_date[2];
                $(this).html(actual_date[1]+' '+actual_date[2]);
            }else{
                $(this).html('');
            }
        }catch(ex){
            console.log(ex);
        }
    });
    $('.convert_to_local_date').each(function(){
        try{

            var added_on = $(this).attr('data-value');
            if(added_on.trim() != "" && added_on.trim() != "None"){
                var local_date = getLocalDate(added_on.trim(), 'mm/dd/yyyy','ampm');
                //console.log(local_date);
                var actual_date = local_date.split(" ");
                //actual_date = actual_date[0]+' '+actual_date[1]+' '+actual_date[2];
                $(this).html(actual_date[0]);
            }else{
                $(this).html('');
            }
        }catch(ex){
            console.log(ex);
        }
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
            console.log(ex);
        }
    });


    $('.convert_to_local_date_format').each(function(){
        try{
            /*try{
                var added_on = $(this).attr('data-value');
            }catch(ex){
                var added_on = $(this).html();
            }*/
            var added_on = $(this).attr('data-value');
            if(added_on.trim() != "" && added_on.trim() != "None"){
                var local_date = getLocalDate(added_on.trim(), 'M j, Y','ampm');
                var actual_date = local_date.split(" ");
                actual_date = actual_date[0]+' '+actual_date[1]+' '+actual_date[2];
                $(this).html(actual_date);
            }else{
                $(this).html('');
            }
        }catch(ex){
            console.log(ex);
        }
    });

});


const remove_string = (list, value, separator) => {
    separator = separator || ",";
    var values = list.split(separator);
    for (var i = 0; i < values.length; i++) {
        if (values[i] == value) {
            values.splice(i, 1);
            return values.join(separator);
        }
    }
    return list;
}

//  show alert AFTER ajax call
const showAlert = (msg, error) => {
    new PNotify({
        title: (error == 1 )?'Error':'Success',
        text: msg,
        type: (error == 1)? 'error':'success',
        styling: 'bootstrap3'
    });
}


const convert_to_24h = (time_str) =>  {
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
};


const convert_to_utc_datetime = (myTimeStamp,format) => {
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

const getLocalDate = (myTimeStamp, dateformat, timeformat) => {
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
    if(dateformat == 'yyyy/mm/dd'){
        timeStp = fullyear+'/'+month_num+'/'+dt;
    }else if(dateformat == 'mm/dd/yyyy'){
        timeStp = month_num+'/'+dt+'/'+fullyear;
    }else if(dateformat == 'dd/mm/yyyy'){
        timeStp = dt+'/'+month_num+'/'+fullyear;
    }else if(dateformat == 'dd/mm/yy'){
        timeStp = dt+'/'+month_num+'/'+halfYear;
    }else if(dateformat == 'mm/dd/yy'){
        timeStp = month_num+'/'+dt+'/'+halfYear;
    }else if(dateformat == 'yy/mm/dd'){
        timeStp = halfYear+'/'+month_num+'/'+dt;
    }else if(dateformat == 'j m, Y'){
        timeStp = dt+' '+short_month_name+', '+fullyear;
    }else if(dateformat == 'm j, Y'){
        timeStp = short_month_name+' '+dt+', '+fullyear;
    }else if(dateformat == 'M j, Y'){
        timeStp = long_month_name+' '+dt+', '+fullyear;
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


const convert_to_utc_date = (myTimeStamp, dateformat, timeformat) => {

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
    if(dateformat == 'yyyy/mm/dd'){
        timeStp = fullyear+'/'+month_num+'/'+dt;
    }else if(dateformat == 'mm/dd/yyyy'){
        timeStp = month_num+'/'+dt+'/'+fullyear;
    }else if(dateformat == 'dd/mm/yyyy'){
        timeStp = dt+'/'+month_num+'/'+fullyear;
    }else if(dateformat == 'dd/mm/yy'){
        timeStp = dt+'/'+month_num+'/'+halfYear;
    }else if(dateformat == 'mm/dd/yy'){
        timeStp = month_num+'/'+dt+'/'+halfYear;
    }else if(dateformat == 'yy/mm/dd'){
        timeStp = halfYear+'/'+month_num+'/'+dt;
    }else if(dateformat == 'j m, Y'){
        timeStp = dt+' '+short_month_name+', '+fullyear;
    }else if(dateformat == 'm j, Y'){
        timeStp = short_month_name+' '+dt+', '+fullyear;
    }else if(dateformat == 'M j, Y'){
        timeStp = long_month_name+' '+dt+', '+fullyear;
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

const getUrlParameter = (sParam) => {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return typeof sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
};


const getQueryVariable = (variable) => {
    var query = window.location.search.substring(1);
    query = query.replace(/%26/g, '&')
    query = query.replace('&amp;', '&')
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return false
}

const convertToSlug = (Text) => {
    try {
        return Text
        .toLowerCase()
        .replace(/\s+/g, " ")
        .replace(/ /g,'-')
        .replace(/[^\w-]+/g,'')
        ;
    } catch (error) {
        return ''
    }
};


const get_address_by_zipcode = (params) => {
    var call_function;
    var zip_code = params.zip_code;
    if(params.call_function){
        call_function = params.call_function;
    }

    try{
        rel_position = params.rel_position;
    }catch(ex){
        console.log(ex);
        rel_position = '';
    }
    $.ajax({
        url: '/zipcode-address-details/',
        type: 'post',
        dateType: 'json',
        cache: false,
        data: {zip_code: zip_code},
        success: function(response){
            console.log(response);
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



function set_property_address_by_zipcode(response){
    $('#property_city').val(response.city);
    try{
        var zip_state_iso_code = response.state.toLowerCase();
    }catch(ex){
        var zip_state_iso_code = '';
    }
    $("#property_state > option").each(function() {
        try{
            var state_iso_code = $(this).attr('data-short-code').toLowerCase();
        }catch(ex){
            var state_iso_code = '';
        }
        if(state_iso_code == zip_state_iso_code){
           $(this).prop('selected',true);
        }
    });
}