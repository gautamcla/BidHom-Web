var currpage = 1;
var recordPerpage = 10;
try{
    Dropzone.autoDiscover = false;
}catch(ex){
    //console.log(ex);
}
$(document).ready(function(){


    $.validator.addMethod("uppercasepass",
        function(value, element, param) {
            if (!/[A-Z]/.test(value)) {
                return false;
            } 
            return true
    },"Include at least 1 uppercase letter.");

    $.validator.addMethod("numberpass",
        function(value, element, param) {
           if (!/[0-9]/.test(value)) {
                return false;
            }
            return true;
    },"Include at least 1 number.");


    $('.select').chosen();
    //getresult('user_listing', 1, '', '', '');
    $('#make_agent_frm #agent_state').chosen();
    $("#make_agent_frm #usr_phone_no").inputmask('(999) 999-9999');
    $('#update_user_frm #user_state').chosen();
    $("#update_user_frm #user_phone_no").inputmask('(999) 999-9999');
    user_image_params = {
        url: '/admin/save-images/',
        field_name: 'user_image',
        file_accepted: '.png, .jpg, .jpeg, .svg',
        element: 'editUserImgFrm',
        upload_multiple: false,
        max_files: 1,
        call_function: set_user_image_details,
        default_message: '<i class="fa fa-upload" aria-hidden="true"></i> Upload Favicon',
    }
    $('#updateEditUserModal').on('shown.bs.modal', function (e) {
        try{
            initdrozone(user_image_params);
        }catch(ex){
            //console.log(ex);
        }
    });
    $(document).on('keyup', '#make_agent_frm #zip_code', function(){
           zip_code = $(this).val();
           if(zip_code.length > 4){
            params = {
                'zip_code': zip_code,
                'call_function': set_make_agent_address_by_zipcode,
            }
            get_address_by_zipcode(params);
           }
      });
      $(document).on('keypress', '#user_search', function(e){
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
                    url: '/admin/user-search-suggestion/',
                    type: 'post',
                    dataType: 'json',
                    cache: false,
                    data: {'search': search},
                    beforeSend: function(){

                    },
                    success: function(response){
                        if(response.error == 0 && response.status == 200){
                            autocomplete("user_search", response.suggestion_list);
                        }else{
                            closeAllSuggestions('autocomplete-items');
                        }
                    }
                });
              }

      });
      $('#make_agent_frm').validate({
            errorElement: 'p',
            ignore: [],
            rules: {
                agent_first_name:{
                    required: true,
                    acceptcharacters: true,
                    noSpace:true,
                    maxlength:40,
                },
                agent_last_name:{
                    required: true,
                    acceptcharacters: true,
                    noSpace:true,
                    maxlength:40,
                },
                agent_company:{
                    required: true
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
                            },
                            user_id: function(){
                                return $('#make_agent_frm #agent_id').val();
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
                            },
                            user_id: function() {
                                return $('#make_agent_frm #agent_id').val();
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
                    },
                    phoneminlength: 10,
                    phonemaxlength: 10
                },
                agent_address:{
                    required: true
                },
                agent_state:{
                    required: true
                },
                zip_code:{
                    required: true,
                    minlength: 5,
                    maxlength: 10
                },
                agent_status:{
                    required: true
                }
            },
            messages: {
                agent_first_name:{
                    required: "First Name is required.",
                    acceptcharacters: "Please enter valid First Name",
                    noSpace: "Please enter valid First Name",
                    maxlength:"Please enter at most 40 char"
                },
                agent_last_name:{
                    required: "Last Name is required.",
                    acceptcharacters: "Please enter valid Last Name",
                    noSpace:"Please enter valid Last Name",
                    maxlength:"Please enter at most 40 char"
                },
                agent_company:{
                    required: "Company is required."
                },
                user_email:{
                    required: "Email is required.",
                    email: "Please Enter Valid Email Address.",
                    remote: "Email Address already in use."
                },
                usr_phone_no:{
                    required: "Phone no is required.",
                    remote: "Phone no already in use.",
                    phoneminlength: "Please enter valid Phone no.",
                    phonemaxlength: "Please enter valid Phone no."
                },
                agent_address:{
                    required: "Address is required"
                },
                agent_state:{
                    required: "State is required"
                },
                zip_code:{
                    required: "Zip Code is required",
                    minlength: "Please enter at least 5 char",
                    maxlength: "Please enter at most 10 char"
                },
                agent_status:{
                    required: "Status is required"
                }
            },
            errorPlacement: function(error, element) {
                if(element.hasClass('agent_state')){
                    error.insertAfter(element.next('.chosen-container'));
                }else{
                    error.insertAfter(element);
                }
            },
            submitHandler: function(form){
                var flag = true;
                /*var agent_image = $('#agent_img_name').val();
                if(agent_image == ""){
                    $('#agent_image_error').show();
                    flag = false;
                }else{
                    $('#agent_image_error').hide();
                }*/

                if(flag === true){
                    var formdata = $("#make_agent_frm").serializeArray();
                    var requestData = {};
                    $(formdata).each(function(index, obj) {
                        requestData[obj.name] = obj.value;
                    });
                    var status = $('option:selected','#user_filter_status').val();
                    var page_size = $('option:selected','#user_num_record').val();
                    var user_search = $('#user_search').val();
                    var usr_phone_no = $('#usr_phone_no').val();
                    usr_phone_no = usr_phone_no.replace(/[_\W]+/g, "");
                    if(usr_phone_no.length != 10){
                        return false;
                    }
                    requestData['user_search'] = user_search;
                    requestData['page_size'] = page_size;
                    requestData['status'] = status;
                    //requestData = JSON.stringify(requestData);
                    $.ajax({
                        url: '/admin/upgrade-user-to-agent/',
                        type: 'post',
                        dataType: 'json',
                        cache: false,
                        data: requestData,
                        beforeSend: function(){
                            $('.overlay').show();
                        },
                        success: function(response){
                            $('.overlay').hide();
                            console.log(response);
                            if(response.error == 0){
                                $.growl.notice({title: "Agent ", message: response.msg, size: 'large'});
                                // var row_id = $('#make_agent_frm #agent_id').val();
                                if(response.user_listing_html){
                                    $('#user_listing').html(response.user_listing_html);
                                    $('#user_listing_pagination_list').html(response.pagination_html);
                                }
                                $('#user_listing').find('script').remove();
                                $('#upgradeAgentModal').modal('hide');
                                //$('#user_row_'+row_id).remove();
                            }else{
                                window.setTimeout(function () {
                                    $.growl.error({title: "Agent ", message: response.msg, size: 'large'});
                                }, 2000);
                            }
                        },
                        complete: function(response){
                            $('.overlay').hide();
                        }
                    });
                }


            }
        });
        $(document).on('change', '#cancel_agent_popup', function(){
                $('#upgradeAgentModal').modal('hide');
          });
          $('#updateUserPasswordPopupFrm').validate({
            errorElement: 'p',
            rules: {
                user_current_password:{
                    required: true,
                    minlength:6,
                    maxlength:12,
                },
                user_new_password:{
                    required:true,
                    minlength:6,
                    maxlength:12,
                    uppercasepass:true,
                    numberpass:true
                },
                user_confirm_password:{
                    required:true,
                    minlength:6,
                    maxlength:12,
                    uppercasepass:true,
                    numberpass:true,
                    equalTo: "#user_new_password"
                }
            },
            messages: {
                user_current_password:{
                    required: "Current password is required."
                },
                user_new_password:{
                    required: "New password is required."
                },
                user_confirm_password:{
                    required: "Confirm password is required.",
                    equalTo: "Confirm password should be same as New password."
                }
            },
            submitHandler:function(){
                $.ajax({
                    url: '/admin/change-user-password/',
                    type: 'post',
                    dataType: 'json',
                    cache: false,
                    data: $('#updateUserPasswordPopupFrm').serialize(),
                    beforeSend: function(){
                        $('.overlay').show();
                    },
                    success: function(response){
                        if(response.error == 0 || response.status == 200 || response.status == 201){

                            $.growl.notice({title: "Change Password ", message: response.msg, size: 'large'});
                            window.setTimeout(function () {
                                $('#userChangePaaswordModal').modal('hide');
                            }, 2000);

                        }else{
                            window.setTimeout(function () {
                                $.growl.error({title: "Change Password ", message: response.msg, size: 'large'});
                            }, 2000);
                        }
                    },
                    complete: function(response){
                        $('.overlay').hide();
                    }
                });
            }
        });
        $('#userResetPasswordPopupFrm').validate({
            errorElement: 'p',
            rules: {
                user_pass:{
                    required: true,
                    minlength:6,
                    maxlength:12,
                    uppercasepass:true,
                    numberpass:true
                }
            },
            messages: {
                user_pass:{
                    required: "Password is required."
                }
            },
            submitHandler:function(){
                $.ajax({
                    url: '/admin/reset-user-password/',
                    type: 'post',
                    dataType: 'json',
                    cache: false,
                    data: $('#userResetPasswordPopupFrm').serialize(),
                    beforeSend: function(){
                        $('.overlay').show();
                    },
                    success: function(response){
                        if(response.error == 0 || response.status == 200 || response.status == 201){

                            $.growl.notice({title: "Reset Password ", message: response.msg, size: 'large'});
                            window.setTimeout(function () {
                                $('#userResetModal').modal('hide');
                            }, 2000);

                        }else{
                            window.setTimeout(function () {
                                $.growl.error({title: "Reset Password ", message: response.msg, size: 'large'});
                            }, 2000);
                        }
                    },
                    complete: function(response){
                        $('.overlay').hide();
                    }
                });
            }
        });
      $(document).on('click', '.check_permission', function(){
        check_permission();
      });
      $(document).on('click', '#check_all_permission', function(){
        if($(this).is(':checked') === true){
          $('.check_permission:not(".disabled_checkbox")').prop('checked', true);
          $('.check_permission').each(function(){
              if($(this).is(':checked') === true){
                $(this).closest('.block').find('.is_permission').val(1);
              }
          });
        }else{
          $('.check_permission:not(".disabled_checkbox")').prop('checked', false);
          $('.check_permission').each(function(){
              if($(this).is(':checked') === false){
                $(this).closest('.block').find('.is_permission').val(0);
              }
          });
        }

      });
      $('#update_user_frm').validate({
            errorElement: 'p',
            rules: {
                user_first_name:{
                    required: true,
                    acceptcharacters: true,
                    noSpace:true,
                    maxlength:40,
                },
                user_last_name:{
                    required: true,
                    acceptcharacters: true,
                    noSpace:true,
                    maxlength:40,
                },
                user_phone_no:{
                    required:true,
                    remote:{
                        type: 'post',
                        url: '/admin/check-user-exists/',
                        dataType: 'json',
                        async:false,
                        data: {
                            check_type: function() {
                                return "main";
                            },
                            user_id: function(){
                                return $('#update_user_frm #update_user_id').val();
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
                    },
                    phoneminlength: 10,
                    phonemaxlength: 10,
                },
                usr_email:{
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
                            },
                            user_id: function(){
                                return $('#update_user_frm #update_user_id').val();
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
                user_first_name:{
                    required: "First Name is required.",
                    acceptcharacters: "Please enter valid First Name",
                    noSpace: "Please enter valid First Name",
                    maxlength:"Please enter at most 40 char"
                },
                user_last_name:{
                    required: "Last Name is required.",
                    acceptcharacters: "Please enter valid Last Name",
                    noSpace:"Please enter valid Last Name",
                    maxlength:"Please enter at most 40 char"
                },
                user_phone_no:{
                    required: "Phone no is required.",
                    remote: "Phone no already in use.",
                    phoneminlength: "Please enter valid Phone no.",
                    phonemaxlength: "Please enter valid Phone no.",
                },
                usr_email:{
                    required: "Email is required.",
                    email: "Please Enter Valid Email Address.",
                    remote: "Email Address already in use."
                }
            },
            submitHandler:function(){
                var flag = true;

                if(flag == true && $('#update_user_frm').valid() === true){
                    $.ajax({
                        url: '/admin/save-user-details/',
                        type: 'post',
                        dataType: 'json',
                        cache: false,
                        data: $('#update_user_frm').serialize(),
                        beforeSend: function(){
                            $('.overlay').show();
                        },
                        success: function(response){
                            if(response.error == 0 || response.status == 200 || response.status == 201){

                                $.growl.notice({title: "Users ", message: response.msg, size: 'large'});
                                window.setTimeout(function () {
                                    $('#updateEditUserModal').modal('hide');
                                    window.location.reload();
                                }, 2000);

                            }else{
                                window.setTimeout(function () {
                                    $.growl.error({title: "Users ", message: response.msg, size: 'large'});
                                }, 2000);
                            }
                        },
                        complete: function(response){
                            $('.overlay').hide();
                        }
                    });
                }

            }
        });
        $(document).on('click', '.del_user_btn', function(){
               var row_id = $(this).attr('rel_id');

               if($(this).attr('id') == 'del_user_true'){
                var search = $('#user_search').val();
                if($('#user_num_record').val() != ""){
                    recordPerpage = $('#user_num_record').val();
                }
                var status = $('#user_filter_status').val();
                    $.ajax({
                        url: '/admin/delete-website-user/',
                        type: 'post',
                        dataType: 'json',
                        cache: false,
                        data: {'user_id': row_id,search: search, perpage: recordPerpage, status: status, page: 1},
                        beforeSend: function(){
                            $('.overlay').show();
                        },
                        success: function(response){
                            $('.overlay').hide();
                            if(response.data.error == 0){

                                $('#confirmDeleteModal').modal('hide');
                                $("#user_listing").empty();
                                $("#user_listing").html(response.user_listing_html);
                                $("#user_listing").find('script').remove();
                                $("#user_listing_pagination_list").html(response.pagination_html);

                                $.growl.notice({title: "Users ", message: response.data.msg, size: 'large'});


                            }else{
                                window.setTimeout(function () {
                                    $.growl.error({title: "Users ", message: response.msg, size: 'large'});
                                }, 2000);

                            }
                            $(window).scrollTop(0);
                        }
                    });
               }else{
                    $('#del_user_true').removeAttr('rel_id');
                    $('#del_user_false').removeAttr('rel_id');
//                    $('.personalModalwrap').modal('hide');
                    return false;
               }

        });

        $(document).on('click', 'div.user_details div.item', function (e){
        //$(document).on('click', '.user_details', function (e){
            var numClick = parseInt($(e.currentTarget).index() + 1);
            var link_href = $(this).closest('.user_details').data('href');
            if(numClick != 9){
                window.location.href = link_href;
            }else{
                //console.log('Action clicked');
            }
            /*$(".list_details").empty();
            $(".far").removeClass('fa-minus-square').addClass('fa-plus-square');
            $("#icon_"+user_id).removeClass('fa-plus-square').addClass('fa-minus-square');
            $.ajax({
                url: '/admin/user-bid-reg-list/',
                type: 'post',
                dataType: 'json',
                cache: false,
                data: {user_id: user_id},
                beforeSend: function(){
                    $('.overlay').show();
                    $('#user_details_'+user_id).empty();
                },
                success: function(response){
                    $('.overlay').hide();
                    if(response.error == 0){
                        $('#user_details_'+user_id).html(response.listing_html);
                    }else{
                        $('#user_details_'+user_id).empty();
                    }    
                }    
            });*/    
        });
});
function set_make_agent_address_by_zipcode(response){
    try{
        var zip_state_iso_code = response.state.toLowerCase();
    }catch(ex){
        //console.log(ex);
        var zip_state_iso_code = '';
    }

    $("#make_agent_frm #agent_state > option").each(function() {
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
    $('#make_agent_frm #agent_state').trigger("chosen:updated");
}
function set_user_image_details(response){

    var image_name = '';
    var actual_image = '';
    var upload_id = '';
    var actual_id = '';
    var upload_to = '';
    var user_image_name = $('#user_img_name').val();
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
            $('#user_img_name').val(actual_image);
            $('#user_img_id').val(upload_id);
            if(actual_image){
                var logo_img = aws_url+"profile_image/"+actual_image;
                $('#editUserImg').attr('src', logo_img);
                $('#editUserImg').show();
                $('#editUserImageDelBtn').show();
            }
            $('#editUserImgDiv .fav-icon a').attr({ 'data-image-id': $('#user_img_id').val(), 'data-image-name':$('#user_img_name').val(), 'data-image-section': upload_to, 'data-count': '' }).addClass('confirm_image_delete');
        }
    }
}
function user_delete_confirmation(row_id){
        $('.personalModalwrap').modal('hide');
        $('#confirmDeleteModal').modal('show');
        $('.del_user_btn').attr('rel_id', row_id);
    }
    function change_password_user(user_id){
        $('.personalModalwrap').modal('hide');
        $('#updateUserPasswordPopupFrm #change_pass_user_id').val('');
        $('#updateUserPasswordPopupFrm #user_current_password').val('');
        $('#updateUserPasswordPopupFrm #user_new_password').val('');
        $('#updateUserPasswordPopupFrm #user_confirm_password').val('');
        $('#updateUserPasswordPopupFrm #change_pass_user_id').val(user_id);
        $('#userChangePaaswordModal').modal('show');
    }
    function reset_password_user(user_id){
        $('.personalModalwrap').modal('hide');
        $('#userResetPasswordPopupFrm #reset_user_id').val('');
        $('#userResetPasswordPopupFrm #user_pass').val('');
        $('#reset_user_id').val(user_id);
        $('#userResetModal').modal('show');
    }
    function get_popup_user_details(user_id){
        if(user_id){
            data = {'user_id': user_id}
                $.ajax({
                    url: '/admin/edit-user-details/',
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
                        $('#update_user_frm #editUserImg').hide();
                        if(response.error == 0){
                            data = response.data;
                            var user_id = '';
                            var first_name = '';
                            var last_name = '';
                            var email = '';
                            var phone_no = '';
                            var upload_id = '';
                            var doc_file_name = '';
                            var bucket_name = '';
                            var img_src = '';
                            if(data.id){
                                user_id = data.id;
                            }
                            if(data.first_name){
                                first_name = data.first_name;
                            }
                            if(data.last_name){
                                last_name = data.last_name;
                            }

                            if(data.email){
                                email = data.email;
                            }
                            if(data.phone_no){
                                phone_no = data.phone_no;
                            }
                            if(data.profile_image.upload_id){
                                upload_id = data.profile_image.upload_id;
                            }
                            if(data.profile_image.doc_file_name){
                                doc_file_name = data.profile_image.doc_file_name;
                                img_src = aws_url+''+data.profile_image.bucket_name+'/'+doc_file_name;
                                $('#editUserImg').show();
                                $('#editUserImageDelBtn').show();
                                $('#editUserImg').attr('src', img_src);
                            }else{
                                $('#editUserImageDelBtn').hide();
                            }
                            if(data.profile_image.bucket_name){
                                bucket_name = data.profile_image.bucket_name;
                            }

                            $('#update_user_frm #update_user_id').val(user_id);
                            $('#update_user_frm #user_first_name').val(first_name);
                            $('#update_user_frm #user_last_name').val(last_name);
                            $('#update_user_frm #user_phone_no').val(phone_no);
                            $('#update_user_frm #usr_email').val(email);
                            $('#update_user_frm #user_img_id').val(upload_id);
                            $('#update_user_frm #user_img_name').val(doc_file_name);
                            $('#editUserImgDiv .fav-icon a').attr({ 'data-image-id': $('#user_img_id').val(), 'data-image-name':$('#user_img_name').val(), 'data-image-section': bucket_name, 'data-count': '' }).addClass('confirm_image_delete');

                        }else{
                            window.setTimeout(function () {
                                $.growl.error({title: "Users ", message: response.msg, size: 'large'});
                            }, 2000);

                        }
                        $('#updateEditUserModal').modal('show');
                    }
                });
        }
}

function get_make_agent_details(user_id){
    if(user_id){
    data = {'user_id': user_id}
        $.ajax({
            url: '/admin/get-make-agent-details/',
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
                if(response.error == 0){
                    data = response.data;
                    var agent_id = '';
                    var first_name = '';
                    var last_name = '';
                    var email = '';
                    var phone_no = '';
                    var state = '';
                    var zip_code = '';
                    var licence_no = '';
                    var company_name = '';
                    var address = '';
                    var total_permission = data.permission.length;
                    if(data.id){
                        agent_id = data.id;
                    }
                    if(data.first_name){
                        first_name = data.first_name;
                    }
                    if(data.last_name){
                        last_name = data.last_name;
                    }
                    if(data.company_name){
                        company_name = data.company_name;
                    }
                    if(data.licence_no){
                        licence_no = data.licence_no;
                    }
                    if(data.email){
                        email = data.email;
                    }
                    if(data.phone_no){
                        phone_no = data.phone_no;
                    }
                    try{
                        address = data.address[0].address_first;
                    }catch(ex){
                        //console.log(ex);
                    }
                    try{
                        state = data.address[0].state;
                    }catch(ex){
                        //console.log(ex);
                    }
                    try{
                        zip_code = data.address[0].postal_code;
                    }catch(ex){
                        //console.log(ex);
                    }

                    $('#make_agent_frm #agent_id').val(agent_id);
                    $('#make_agent_frm #agent_first_name').val(first_name);
                    $('#make_agent_frm #agent_last_name').val(last_name);
                    $('#make_agent_frm #usr_phone_no').val(phone_no);
                    $('#make_agent_frm #user_email').val(email);
                    $('#make_agent_frm #agent_company').val(company_name);
                    $('#make_agent_frm #agent_license_no').val(licence_no);
                    $('#make_agent_frm #agent_address').val(address);
                    $('#make_agent_frm #zip_code').val(zip_code);
                    $('#make_agent_frm #agent_state').val(state).trigger("chosen:updated");
                    $('#make_agent_perm_list').empty();
                    $('#total_permission').val(total_permission);

                    $.each(data.permission, function(i, item) {
                        var permission_id = '';
                        var permission_name = '';
                        var checked = '';
                        var disabled = '';
                        var switch_disable = '';
                        var disabled_checkbox = '';
                        var disable_checkbox = '';
                        var is_permission = 0;
                        if(item.id){
                          permission_id = item.id;
                        }
                        if(item.name){
                          permission_name = item.name;
                        }
                        if(item.is_permission == 1){
                          checked = 'checked';
                          is_permission = item.is_permission;
                        }
                        already_checked_in = [4,7,11,6];
                        if($.inArray(permission_id, already_checked_in) !== -1){
                            checked = 'checked';
                            disabled = 'disabled';
                            switch_disable = 'switch_disable';
                            disabled_checkbox = 'disabled_checkbox';
                            disable_checkbox = 'disable_checkbox';
                            is_permission = 1;
                        }

                        $('#make_agent_perm_list').append('<li><div class="block"><input type="hidden" name="permission_id_'+i+'" id="permission_id_'+i+'" value="'+permission_id+'"/><input type="hidden" name="permission_name_'+i+'" id="permission_name_'+i+'" value="'+permission_name+'"/><input type="hidden" class="is_permission" name="is_permission_'+i+'" id="is_permission_'+i+'" value="'+is_permission+'"/><label for="check_permission_'+i+'">'+permission_name+'</label><label class="switch small '+disable_checkbox+'"><input type="checkbox" class="check_permission '+disabled_checkbox+'" rel_permission="'+permission_id+'" id="check_permission_'+i+'" name="check_permission_'+i+'" value="1" '+checked+' '+disabled+' '+switch_disable+' /><span class="slide round"></span></label></div></li>');
                    });
                    check_permission();
                    /*var perm_flag = true;
                    $('.check_permission').each(function(index) {
                        if($('#check_permission_'+index).is(':checked') === false){
                            perm_flag = false;
                            $('#is_permission_'+index).val(0);
                        }else{
                            $('#is_permission_'+index).val(1);
                        }
                    });
                    $('#check_all_permission').prop('checked', perm_flag);*/


                }else{
                    window.setTimeout(function () {
                        $.growl.error({title: "Make Agent ", message: response.msg, size: 'large'});
                    }, 2000);

                }
                $('#upgradeAgentModal').modal('show');
            }
        });
    }
}
function check_permission(){
    var perm_flag = true;
    $('.check_permission:not(".disabled_checkbox")').each(function() {
        if($(this).is(':checked') === false){
            perm_flag = false;
            $(this).closest('.block').find('.is_permission').val(0);
        }else{
            $(this).closest('.block').find('.is_permission').val(1);
        }
    });
    $('#check_all_permission').prop('checked', perm_flag);
}

function userListingSearch(current_page){
        var search = $('#user_search').val();
        var currpage = current_page;
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
                    //var $perpageresult = getAllPageLinks('user_listing',currpage, recordPerpage, response.total_user, '', '', '');

                    $("#user_listing").html(response.user_listing_html);
                    $("#user_listing").find('script').remove();
                    $("#user_listing_pagination_list").html(response.pagination_html);


                }else{
                    $('#user_listing').html('<div class="block-item"><div class="item fullwidth"><p class="custom_error center mb0">No Data Found!</p></div></div>');
                }
                $(window).scrollTop(0);
            }
        });
    }


//-----------Subdomain send user password link--------

function send_reset_password_link(user_id){
    $.ajax({
        url: '/admin/send-reset-password-link/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {'reset_user_id': user_id},
        // data: $('#userResetPasswordPopupFrm').serialize(),
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            if(response.error == 0 || response.status == 200 || response.status == 201){

                $.growl.notice({title: "Reset Password ", message: response.msg, size: 'large'});
                window.setTimeout(function () {
                    $('#userResetModal').modal('hide');
                }, 2000);

            }else{
                window.setTimeout(function () {
                    $.growl.error({title: "Reset Password ", message: response.msg, size: 'large'});
                }, 2000);
            }
        },
        complete: function(response){
            $('.overlay').hide();
        }
    });
}