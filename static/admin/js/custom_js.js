var currentFocus = -1;
var currpage = 1;
var recordPerpage = 10;
try{
    Dropzone.autoDiscover = false;
}catch(ex){
    //console.log(ex);
}
$(document).ready(function(){
    // get_chat_count();
    $('.alphaAccpt').on('keypress', function(event) {
        var key = event.keyCode;
        return ((key >= 65 && key <= 90) || (key == 8) || (key >= 97 && key <= 122));
      });
    $('.convert_to_local_date_time').each(function(){
        try{
            var added_on = $(this).attr('data-value');
            if(added_on.trim() != "" && added_on.trim() != "None"){
                var local_date = getLocalDate(added_on.trim(), 'mm-dd-yyyy','ampm');
                actual_date = local_date.split(" ");
                actual_date = actual_date[0]+' <span>'+actual_date[1]+' '+actual_date[2]+'</span>';
                $(this).html(actual_date);
            }else{
                $(this).html('-');
            }
        }catch(ex){
            //console.log(ex);
        }
    });

    $('.convert_to_local_date_time_single_line').each(function(){
        try{
            var added_on = $(this).attr('data-value');
            if(added_on.trim() != "" && added_on.trim() != "None"){
                var local_date = getLocalDate(added_on.trim(), 'mm-dd-yyyy','ampm');
                actual_date = local_date.split(" ");
                actual_date = actual_date[0]+' '+actual_date[1]+' '+actual_date[2] ;
                $(this).html(actual_date);
            }else{
                $(this).html('-');
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
                //actual_date = actual_date[0]+' '+actual_date[1]+' '+actual_date[2];
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
            //console.log(ex);
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
            //console.log(ex);
        }
    });

    logged_user_image_params = {
        url: '/admin/save-images/',
        field_name: 'loggedin_usr_image',
        file_accepted: '.png, .jpg, .jpeg, .svg',
        element: 'loggedInUserImgFrm',
        upload_multiple: false,
        max_files: 1,
        call_function: set_loggedin_user_image_details,
        default_message: '<i class="fa fa-upload" aria-hidden="true"></i> Upload Favicon',
    }
    $('#personalModal').on('shown.bs.modal', function (e) {
        try{
            initdrozone(logged_user_image_params);
        }catch(ex){
            //console.log(ex);
        }
    });


    $('.size_date_sec').each(function(){
        var added_on = $(this).attr('data-added-date');
        var file_size = $(this).attr('data-file-size');
        var local_date = '';
        try{
            if(added_on != ""){
                local_date = getLocalDate(added_on, 'm j, Y','ampm');
            }

        }catch(ex){
            //console.log(ex);
            var local_date = '';
        }

        $(this).html("File Size: "+local_date+" <br> Uploaded: "+file_size+"");
    });
    $('.form-input').focus(function(){
      $(this).parents('.form-group').addClass('focused');
    });
    $('.form-input').blur(function(){
      var inputValue = $(this).val();
      if ( inputValue == "" ) {
        $(this).removeClass('filled');
        $(this).parents('.form-group').removeClass('focused');
      } else {
        $(this).addClass('filled');
      }
    }) ;


        $('#updatePersonInfoPopupFrm').validate({
            errorElement: 'p',
            rules: {
                first_name:{
                    required: true,
                    accept: true
                },
                last_name:{
                    required: true,
                    accept: true
                },
                usr_phone_no:{
                    required:true,
                    remote:{
                        type: 'post',
                        url: '/admin/check-user-exists/',
                        dataType: 'json',
                        async:false,
                        data: {
                            check_type: function() {
                                return "main";
                            }
                        },
                        dataFilter: function(data) {
                            var response = JSON.parse(data);
                            if(response.error == 0 && typeof(response.data.exists) != 'undefined'&& response.data.exists === true){
                                return false;
                            }else{
                                return true;
                            }

                        }
                    }
                },
                user_email:{
                    required:true,
                    email:true,
                    remote:{
                        type: 'post',
                        url: '/admin/check-user-exists/',
                        dataType: 'json',
                        async:false,
                        data: {
                            check_type: function() {
                                return "main";
                            }
                        },
                        dataFilter: function(data) {
                            var response = JSON.parse(data);
                            if(response.error == 0 && typeof(response.data.exists) != 'undefined'&& response.data.exists === true){
                                return false;
                            }else{
                                return true;
                            }

                        }
                    }
                }
            },
            messages: {
                first_name:{
                    required: "First Name is required.",
                    accept: "Please Enter Valid First Name."
                },
                last_name:{
                    required: "Last Name is required.",
                    accept: "Please Enter Valid Last Name."
                },
                usr_phone_no:{
                    required: "Phone no is required.",
                    remote: "Phone no already in use."
                },
                user_email:{
                    required: "Email is required.",
                    email: "Please Enter Valid Email Address.",
                    remote: "Email Address already in use."
                }
            },
            submitHandler:function(){
                $.ajax({
                    url: '/admin/save-personal-info/',
                    type: 'post',
                    dataType: 'json',
                    cache: false,
                    data: $('#updatePersonInfoPopupFrm').serialize(),
                    beforeSend: function(){

                    },
                    success: function(response){
                        if(response.error == 0 || response.status == 200 || response.status == 201){

                            $.growl.notice({title: "Personal Info ", message: response.msg, size: 'large'});
                            window.setTimeout(function () {
                                $('#personalModal').modal('hide');
                            }, 2000);


                        }else{
                            window.setTimeout(function () {
                                $.growl.error({title: "Personal Info ", message: response.msg, size: 'large'});
                            }, 2000);
                        }
                    }
                });
            }
        });
        $('#updatePasswordPopupFrm').validate({
            errorElement: 'p',
            rules: {
                current_password:{
                    required: true,
                    minlength: 8,
                    maxlength: 12,
                },
                new_password:{
                    required: true,
                    minlength: 8,
                    maxlength: 12
                },
                confirm_password:{
                    required: true,
                    equalTo: "#new_password"
                }
            },
            messages: {
                current_password:{
                    required: "Current password is required.",
                    maxlength: "Please enter not more than 12 characters."
                },
                new_password:{
                    required: "New password is required.",
                    maxlength: "Please enter not more than 12 characters."
                },
                confirm_password:{
                    required: "Confirm password is required.",
                    equalTo: "Confirm password should be same as New password."
                }
            },
            submitHandler:function(){
                $.ajax({
                    url: '/admin/change-admin-password/',
                    type: 'post',
                    dataType: 'json',
                    cache: false,
                    data: $('#updatePasswordPopupFrm').serialize(),
                    beforeSend: function(){

                    },
                    success: function(response){
                        if(response.error == 0 || response.status == 200 || response.status == 201){

                            $.growl.notice({title: "Change Password ", message: response.msg, size: 'large'});
                            window.setTimeout(function () {
                                $('#securityModal').modal('hide');
                            }, 2000);

                        }else{
                            window.setTimeout(function () {
                                $.growl.error({title: "Change Password ", message: response.msg, size: 'large'});
                            }, 2000);
                        }
                    }
                });
            }
        });
        $(document).on('click', '.confirm_image_delete', function(){
            var data_count = '';
            var data_article_id = '';
            var agent_id = '';
            var user_id = '';
            var section = $(this).attr('data-image-section');
            var image_id = $(this).attr('data-image-id');
            var image_name = $(this).attr('data-image-name');
            var delete_for = $(this).attr('data-delete-for');
            if($(this).attr('data-count')){
                data_count = $(this).attr('data-count');
            }
            if($(this).attr('data-article-id')){
                data_article_id = $(this).attr('data-article-id');
            }
            var agent_id = $('#add_agent_form #agent_id').val();
            var user_id = $('#update_user_frm #update_user_id').val();
            var loggedin_user_id = $('#updatePersonInfoPopupFrm #loggedin_user_id').val();
            $('#confirmImageDeleteModal #popup_article_id').val(data_article_id);
            $('#confirmImageDeleteModal #popup_section').val(section);
            $('#confirmImageDeleteModal #popup_image_id').val(image_id);
            $('#confirmImageDeleteModal #popup_image_name').val(image_name);
            $('#confirmImageDeleteModal #popup_count').val(data_count);
            $('#confirmImageDeleteModal #popup_agent_id').val(agent_id);
            $('#confirmImageDeleteModal #popup_user_id').val(user_id);
            $('#confirmImageDeleteModal #loggedin_user_id').val(loggedin_user_id);
            $('#confirmImageDeleteModal #delete_for').val(delete_for);
            if($('#personalModal').hasClass('in') === true){
                $('#confirmImageDeleteModal #request_from').val('personalModal');
            }else if(window.location.href.indexOf('business-info') >= 0){
                $('#confirmImageDeleteModal #request_from').val('business_info');
            }else{
                $('#confirmImageDeleteModal #request_from').val('');
            }

            $('#confirmImageDeleteModal').modal('show');
        });
        $(document).on('click', '#del_image_false', function(){
            $('#confirmImageDeleteModal #popup_article_id').val('');
            $('#confirmImageDeleteModal #popup_section').val('');
            $('#confirmImageDeleteModal #popup_image_id').val('');
            $('#confirmImageDeleteModal #popup_image_name').val('');
            $('#confirmImageDeleteModal #popup_count').val('');
            $('#confirmImageDeleteModal #popup_agent_id').val('');
            $('#confirmImageDeleteModal #popup_user_id').val('');
            $('#confirmImageDeleteModal #loggedin_user_id').val('');
            $('#confirmImageDeleteModal #request_from').val('');
            $('#confirmImageDeleteModal').modal('hide');
        });
        $(document).on('click', '#del_image_true', function(){
            var article_id = $('#confirmImageDeleteModal #popup_article_id').val();
            var section= $('#confirmImageDeleteModal #popup_section').val();
            var id = $('#confirmImageDeleteModal #popup_image_id').val();
            var name = $('#confirmImageDeleteModal #popup_image_name').val();
            var count = $('#confirmImageDeleteModal #popup_count').val();
            var agent_id = $('#confirmImageDeleteModal #popup_agent_id').val();
            var popup_user_id = $('#confirmImageDeleteModal #popup_user_id').val();
            var loggedin_user_id = $('#confirmImageDeleteModal #loggedin_user_id').val();
            var delete_for = $('#confirmImageDeleteModal #delete_for').val();
            var request_from = $('#confirmImageDeleteModal #request_from').val();
            del_params = {
                article_id: article_id,
                section: section,
                id: id,
                name: name,
                count: count,
                agent_id: agent_id,
                popup_user_id: popup_user_id,
                loggedin_user_id: loggedin_user_id,
                request_from: request_from,
                delete_for: delete_for
            }
            delete_image(del_params);
            $('#confirmImageDeleteModal').modal('hide');
            if(popup_user_id != ""){
                //get_popup_user_details(popup_user_id);
                $('#updateEditUserModal').modal('show');
            }
            if(request_from != "" && loggedin_user_id != ""){
                //get_popup_user_details(popup_user_id);
                $('#personalModal').modal('show');
            }
        });

});
/*
name: leading_zero
param: element id(which need conversion)
prepand 0 to any single digit number
*/
function leading_zero(element){
    var value = $('#'+element).val();

    if (parseInt(value) >= 1 && parseInt(value) <= 9 && value.length <= 1){
        var value = "0" + value;
    }
    $('#'+element).val(value);
}
//end leading_zero
function config_ckeditor(element){

    CKEDITOR.replace(element, {
      // Define the toolbar groups as it is a more accessible solution.
      toolbarGroups: [{
          "name": "basicstyles",
          "groups": ["basicstyles"]
        },
        {
          "name": "clipboard",
          "groups": ["cut", "copy", "paste"]
        },
        {
          "name": "links",
          "groups": ["links"]
        },
        {
          "name": "paragraph",
          "groups": ["list", "blocks"]
        },
        {
          "name": "document",
          "groups": ["mode"]
        },
        {
          "name": "insert",
          "groups": ["insert"]
        },
        {
          "name": "styles",
          "groups": ["styles"]
        },
        {
          "name": "about",
          "groups": ["about"]
        }
      ],
      // Remove the redundant buttons from toolbar groups defined above.
      removeButtons: 'Underline,Strike,Subscript,Superscript,Anchor,Styles,Specialchar'
    });

}
function identify_card(number){
    var re = {
        electron: /^(4026|417500|4405|4508|4844|4913|4917)\d+$/,
        maestro: /^(5[06789]|6)[0-9]{0,}$/,
        dankort: /^(5019)\d+$/,
        interpayment: /^(636)\d+$/,
        unionpay: /^(62|88)\d+$/,
        visa: /^4[0-9]{0,}$/,
        mastercard: /^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)[0-9]{0,}$/,
        amex: /^3[47][0-9]{0,}$/,
        diners: /^3(?:0[0-59]{1}|[689])[0-9]{0,}$/,
        discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
        jcb: /^(?:2131|1800|35)[0-9]{0,}$/
    }


    for(var key in re) {
        if(re[key].test(number)) {
            return key
        }
    }
}


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
        timeStp = short_month_name+' '+dt+', '+fullyear;
    }else if(dateformat == 'M j, Y'){
        timeStp = long_month_name+' '+dt+'th, '+fullyear;
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

function customCallBackFunc(callback, args)
{
    //do stuff
    //...
    //execute callback when finished
    callback.apply(this, args);
}
function formatPhoneNumber(phoneNumberString) {
  var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return null;
}

/*function filter_user_list(){
    var search = $('#user_search').val();
    var perpage = $('#user_num_record').val();
    var status = $('#user_filter_status').val();
    $.ajax({
        url: '/admin/users/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {search: search, perpage: perpage, status: status},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            console.log(response);
            if(response.user_list){
                $('#user_listing').empty();
                var all_row = '';
                $.each(response.user_list, function(i, item) {
                    var screen_name = '';
                    var user_email = '';
                    var user_name = '';
                    var user_bid = '';
                    var user_phone = '';
                    var user_id = '';
                    var img_src = '/static/admin/images/no-image.jpg';
                    try {
                        if (item.first_name) {
                            user_name = item.first_name+' '+item.last_name;
                        }
                    } catch (ex) {
                        user_name = '';
                        console.log(ex);
                    }
                    try {
                        if (item.screen_name) {
                            screen_name = item.screen_name;
                        }
                    } catch (ex) {
                        screen_name = '';
                        console.log(ex);
                    }
                    try {
                        if (item.email) {
                            user_email = item.email;
                        }
                    } catch (ex) {
                        user_email = '';
                        console.log(ex);
                    }
                    try {
                        if (item.bid) {
                            user_bid = item.bid;
                        }
                    } catch (ex) {
                        user_bid = '';
                        console.log(ex);
                    }
                    try {
                        if (item.phone_no) {
                            user_phone = formatPhoneNumber(item.phone_no);
                        }
                    } catch (ex) {
                        user_phone = '';
                        console.log(ex);
                    }
                    try {
                        if (item.id) {
                            user_id = item.id;
                        }
                    } catch (ex) {
                        user_id = '';
                        console.log(ex);
                    }
                    try {
                        if (item.profile_image.doc_file_name) {
                            img_src = aws_url+''+item.profile_image.bucket_name+'/'+item.profile_image.doc_file_name;
                        }
                    } catch (ex) {
                        console.log(ex);
                    }
                    try{
                        if(item.status_name.toLowerCase() == 'active'){
                            var badge_class = 'badge-success';
                        }else{
                            var badge_class = 'badge-danger';
                        }
                    }catch{
                        var badge_class = '';
                    }
                    try{
                        var added_on = getLocalDate(item.added_on, 'mm-dd-yyyy','ampm');

                    }catch(ex){
                        console.log(ex);
                        var added_on = '';
                    }
                    try{
                        var last_login = getLocalDate(item.last_login, 'mm-dd-yyyy','ampm');

                    }catch(ex){
                        console.log(ex);
                        var last_login = '';
                    }
                    all_row += '<tr id="user_row_'+user_id+'"><td><span class="user-pic"><img src="'+img_src+'" alt=""></span> '+user_name+'</td><td>'+user_email+'</td><td>'+user_phone+'</td><td>2</td><td><span class="badge '+badge_class+'">'+item.status_name+'</span></td><td>'+added_on+'</td><td>'+last_login+'</td><td class="action center"><a href="#" data-toggle="dropdown" role="button" aria-expanded="false" class="nav-link dropdown-toggle"><i class="fas fa-ellipsis-v"></i></a><ul role="menu" class="dropdown-header-top author-log dropdown-menu right"><li><a href="javascript:void(0)" onclick="get_popup_user_details(\'' + user_id + '\')"><i class="fas fa-edit"></i> Edit</a></li><li><a href="javascript:void(0)" onclick="user_delete_confirmation(\'' + user_id + '\')"><i class="fas fa-trash"></i> Delete</a></li><li><a href="javascript:void(0)" onclick="get_make_agent_details(\'' + user_id + '\')"><i class="fas fa-long-arrow-alt-up"></i> Upgrade to agent</a></li><li><a href="javascript:void(0)" onclick="change_password_user(\'' + user_id + '\')"><i class="fas fa-lock"></i> Change Password</a><li><a href="javascript:void(0)" onclick="reset_password_user(\'' + user_id + '\')"><i class="fas fa-share"></i> Reset Password</a></ul></td></tr>';

                });
                var $perpageresult = getAllPageLinks('user_listing',currpage, recordPerpage, response.total_user, '', '', '');
                $("#user_listing_pagination_list").html($perpageresult);
                if(all_row != ""){
                    $('#user_listing').html(all_row);
                }else{
                    $('#user_listing').html('<tr><td colspan="6"><p class="custom_error center">No User Found!</p></td></tr>');
                }

            }else{
                $('#user_listing').html('<tr><td colspan="6"><p class="custom_error center">No User Found!</p></td></tr>');
            }
        }
    });
}*/

function getresult(listing_type, currpage, search, sort_key, sort_val){
        if(listing_type == 'user_listing'){
            var search = $('#user_search').val();
            if($('#user_num_record').val() != ""){
                recordPerpage = $('#user_num_record').val();
            }
            var status = $('#user_filter_status').val();
            $.ajax({
                url: '/admin/users/',
                type: 'post',
                dataType: 'json',
                cache: false,
                data: {search: search, perpage: recordPerpage, status: status, page: currpage},
                beforeSend: function(){
                    $('.overlay').show();
                },
                success: function(response){
                    $('.overlay').hide();
                    if(response.error == 0){
                        $('#user_listing').empty();
                        if($('#user_num_record').val() != ""){
                            recordPerpage = $('#user_num_record').val();
                        }
                        var $perpageresult = getAllPageLinks('user_listing',currpage, recordPerpage, response.total_user, '', '', '');
                        $("#user_listing_pagination_list").html($perpageresult);
                        $("#user_listing").html(response.user_listing_html);


                    }else{
                        $('#user_listing').html('<div class="block-item"><div class="item fullwidth"><p class="custom_error center mb0">No Data Found!</p></div></div>');
                    }
                    $(window).scrollTop(0);
                }
            });
        }
        if(listing_type == 'agent_listing'){
            var search = $('#agent_search').val();
            if($('#agent_num_record').val() != ""){
                recordPerpage = $('#agent_num_record').val();
            }
            var status = $('#agent_filter_status').val();
            $.ajax({
                url: '/admin/agents/',
                type: 'post',
                dataType: 'json',
                cache: false,
                data: {search: search, perpage: recordPerpage, status: status, page: currpage},
                beforeSend: function(){
                    $('.overlay').show();
                },
                success: function(response){
                    $('.overlay').hide();
                    if(response.error == 0){
                        $('#agent_list').empty();

                        $('#agent_list').html(response.agent_listing_html);
                        if($('#agent_num_record').val() != ""){
                            recordPerpage = $('#agent_num_record').val();
                        }
                        var $perpageresult = getAllPageLinks('agent_listing',currpage, recordPerpage, response.total_user, '', '', '');
                        $("#agent_listing_pagination_list").html($perpageresult);

                    }else{
                        $('#agent_list').html('<div class="block-item">No Agent found</div>');

                    }
                    $(window).scrollTop(0);
                }
            });
        }
        if(listing_type == 'prop_listing'){
            var search = $('#prop_search').val();
            if($('#prop_num_record').val() != ""){
                recordPerpage = $('#prop_num_record').val();
            }
            var status = $('#prop_filter_status').val();
            var asset_type = $('#filter_asset_type').val();
            var auction_type = $('#filter_auction_type').val();
            var property_type = $('#filter_property_type').val();
            $.ajax({
                url: '/admin/listing/',
                type: 'post',
                dataType: 'json',
                cache: false,
                data: {search: search, perpage: recordPerpage, status: status, asset_type: asset_type, auction_type: auction_type, page: currpage, property_type: property_type},
                beforeSend: function(){
                    $('.overlay').show();
                },
                success: function(response){
                    $('.overlay').hide();
                    if(response.error == 0){
                        $('#property_list').empty();

                        $('#property_list').html(response.property_listing_html);
                        if($('#prop_num_record').val() != ""){
                            recordPerpage = $('#prop_num_record').val();
                        }
                        var $perpageresult = getAllPageLinks('prop_listing',currpage, recordPerpage, response.total, '', '', '');
                        $("#prop_listing_pagination_list").html($perpageresult);

                    }else{
                        $('#property_list').html('<div class="block-item">No Agent found</div>');

                    }
                }
            });
        }
    }
    /*
      name: show_hide_popup
      desc: show/hide personal info and security popup
      param: element id(which need to show)
      prepand 0 to any single digit number
      */
  function show_hide_popup(element){
      if($('#'+element).is(':visible') === true){
      }else{
        $('.personalModalwrap').modal('hide');
        $('#'+element).modal('show');
      }
      if(element == 'personalModal'){
           $.ajax({
                url: '/admin/user-personal-info/',
                type: 'post',
                dataType: 'json',
                cache: false,
                data: {},
                beforeSend: function(){
                    $('.overlay').show();
                },
                success: function(response){
                    $('.overlay').hide();
                    if(response.error == 0){
                        $('#updatePersonInfoPopupFrm #first_name').val('');
                        $('#updatePersonInfoPopupFrm #last_name').val('');
                        $('#updatePersonInfoPopupFrm #usr_phone_no').val('');
                        $('#updatePersonInfoPopupFrm #user_email').val('');
                        $('#updatePersonInfoPopupFrm #loggedin_user_id').val('');
                        var user_id = '';
                        if(response.user_personal_info.id){
                            user_id = response.user_personal_info.id;
                        }
                        var first_name = '';
                        if(response.user_personal_info.first_name){
                            first_name = response.user_personal_info.first_name;
                        }
                        var last_name = '';
                        if(response.user_personal_info.last_name){
                            last_name = response.user_personal_info.last_name;
                        }
                        var email = '';
                        if(response.user_personal_info.email){
                            email = response.user_personal_info.email;
                        }
                        var phone = '';
                        if(response.user_personal_info.phone_no){
                            phone = response.user_personal_info.phone_no;
                        }
                        var upload_id = '';
                        var doc_file_name = '';
                        var bucket_name = '';
                        var img_src = '';
                        if(response.user_personal_info.profile_image.doc_file_name){
                            doc_file_name = response.user_personal_info.profile_image.doc_file_name;
                            bucket_name = response.user_personal_info.profile_image.bucket_name;
                            upload_id = response.user_personal_info.profile_image.upload_id;
                            img_src = aws_url+''+bucket_name+'/'+doc_file_name;
                            $('#loggedInUserImg').show();
                            $('#loggedInUserImageDelBtn').show();
                            $('#loggedInUserImg').attr('src', img_src);
                        }
                        $('#updatePersonInfoPopupFrm #first_name').val(first_name);
                        $('#updatePersonInfoPopupFrm #last_name').val(last_name);
                        $('#updatePersonInfoPopupFrm #usr_phone_no').val(phone);
                        $('#updatePersonInfoPopupFrm #user_email').val(email);
                        $('#updatePersonInfoPopupFrm #loggedin_user_id').val(user_id);
                        $('#updatePersonInfoPopupFrm #loggedin_user_img_id').val(upload_id);
                        $('#updatePersonInfoPopupFrm #loggedin_user_img_name').val(doc_file_name);
                        $('#loggedInUserImgDiv .fav-icon a').attr({ 'data-image-id': $('#loggedin_user_img_id').val(), 'data-image-name':$('#loggedin_user_img_name').val(), 'data-image-section': bucket_name, 'data-count': '' }).addClass('confirm_image_delete');
                    }else{

                    }
                }
            });
      }
  }
function set_loggedin_user_image_details(response){

    var image_name = '';
    var actual_image = '';
    var upload_id = '';
    var actual_id = '';
    var upload_to = '';
    var loggedin_user_img_name = $('#loggedin_user_img_name').val();
    if(response.status == 200){
        $('#edit_user_image_error').hide();
        if(response.uploaded_file_list){
            $.each(response.uploaded_file_list, function(i, item) {
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
                upload_to = item.upload_to;
            });
            actual_image = image_name.replace(/(^,)|(,$)/g, "");
            actual_id = upload_id.replace(/(^,)|(,$)/g, "");
            $('#loggedin_user_img_name').val(actual_image);
            $('#loggedin_user_img_id').val(upload_id);
            if(actual_image){
                var logo_img = aws_url+"profile_image/"+actual_image;
                $('#loggedInUserImg').attr('src', logo_img);
                $('#loggedInUserImg').show();
                $('#loggedInUserImageDelBtn').show();
            }
            $('#loggedInUserImgDiv .fav-icon a').attr({ 'data-image-id': $('#loggedin_user_img_id').val(), 'data-image-name':$('#loggedin_user_img_name').val(), 'data-image-section': upload_to, 'data-count': '' }).addClass('confirm_image_delete');
        }
    }
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
        url: '/admin/zipcode-address-details/',
        type: 'post',
        dataType: 'json',
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

function convert_bidding_date(element){
    try{
        value = $('#'+element).val();
        if(value != ""){
            //var virtual_date = getLocalDate(value, 'yyyy-mm-dd','ampm');
            var virtual_date = getLocalDate(value, 'mm-dd-yyyy','ampm');
             //var actual_date = getLocalDate(value, 'yyyy-mm-dd', 'datetime');
             var actual_date = getLocalDate(value, 'mm-dd-yyyy', 'datetime');
             //var utc_date = convert_to_utc_datetime(value, 'datetime');
             var utc_date = convert_to_utc_date(value, 'mm-dd-yyyy', 'datetime');
            $('#virtual_'+element).val(virtual_date);
        }else{

            $('#virtual_'+element).val('');
        }
        $('#'+element).val('');
        $('#'+element+'_local').val('');

    }catch(ex){
        //console.log(ex);
    }

}

function numberFormat(x) {
     x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
}
function download_invoice_pdf(subs_id){
    var d = new Date();
    var timezone = d.getTimezoneOffset();
    if(subs_id){
        window.location.href = '/admin/download-invoice/?id='+subs_id+'&timezone='+timezone;
    }
}

function callback_convert_to_utc_datetime(params){
    var myTimeStamp = params.myTimeStamp;
    var format = params.format;
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
function callback_convert_to_24h(params) {
    var time_str = params.time_str;
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