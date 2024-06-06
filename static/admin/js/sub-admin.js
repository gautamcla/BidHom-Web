var currentFocus = -1;
var currpage = 1;
var recordPerpage = 10;
try{
    Dropzone.autoDiscover = false;
}catch(ex){
    //console.log(ex);
}

$(document).ready(function(){

    /*user_image_params = {
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
            console.log(ex);
        }
    });*/



    agent_image_params = {
        url: '/admin/save-images/',
        field_name: 'agent_image',
        file_accepted: '.png, .jpg, .jpeg',
        element: 'uploadAgentImgFrm',
        upload_multiple: false,
        max_files: 1,
        call_function: set_agent_details
    }
    try{
        initdrozone(agent_image_params);
    }catch(ex){
        //console.log(ex);
    }
    agent_logo_image_params = {
        url: '/admin/save-images/',
        field_name: 'agent_logo_image',
        file_accepted: '.png, .jpg, .jpeg',
        element: 'uploadAgentLogoImgFrm',
        upload_multiple: false,
        max_files: 1,
        call_function: set_agent_logo_details
    }
    try{
        initdrozone(agent_logo_image_params);
    }catch(ex){
        //console.log(ex);
    }

    $('#add_agent_form').validate({
            errorElement: 'p',
            ignore: [],
            rules: {
                agent_first_name:{
                    required: true,
                    acceptcharacters: true,
                    noSpace:true,
                    maxlength:40
                },
                agent_last_name:{
                    required: true,
                    acceptcharacters: true,
                    noSpace:true,
                    maxlength:40
                },
                // agent_company:{
                //     required: true
                // },

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
                            user_id: function() {
                                return $('#add_agent_form #agent_id').val();
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
//                    remote:{
//                        type: 'post',
//                        url: '/admin/check-user-exists/',
//                        dataType: 'json',
//                        async:false,
//                        data: {
//                            check_type: function() {
//                                return "main";
//                            },
//                            user_id: function() {
//                                return $('#add_agent_form #agent_id').val();
//                            }
//                        },
//                        dataFilter: function(data) {
//                            var response = JSON.parse(data);
//                            if(response.error == 0 && typeof(response.data.exists) != 'undefined'&& response.data.exists === true){
//                                return false;
//                            }else{
//                                return true;
//                            }
//
//                        }
//                    },
                    phoneminlength: 10,
                    phonemaxlength: 10,
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
                    maxlength: 10,
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
                    noSpace: "Please enter valid Last Name",
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
                    phonemaxlength: "Please enter valid Phone no.",
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
                if(element.hasClass('agent_state') || element.hasClass('agent_status')){
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

                if(flag === true && $('#add_agent_form').valid() === true){
                    $.ajax({
                        url: '/admin/add-sub-admin/',
                        type: 'post',
                        dataType: 'json',
                        cache: false,
                        data: $('#add_agent_form').serialize(),
                        beforeSend: function(){
                            $('.overlay').show();
                        },
                        success: function(response){
                            $('.overlay').hide();
                            if(response.error == 0 || response.status == 200 || response.status == 201){

                                $.growl.notice({title: "Agent ", message: response.msg, size: 'large'});

                                window.setTimeout(function () {
                                    window.location.href = '/admin/sub-admin/';
                                }, 2000);
                            }else{
                                window.setTimeout(function () {
                                    $.growl.error({title: "Sub Admin ", message: response.msg, size: 'large'});
                                }, 2000);
                            }
                        }
                    });
                }


            }
        });


        $(document).on('click', '.del_agent_btn', function(){
               var row_id = $(this).attr('rel_id');
               var search = $('#agent_search').val();
               if($('#agent_num_record').val() != ""){
                var perpage = $('#agent_num_record').val();
               }else{
                var perpage = recordPerpage;
               }

                var status = $('#agent_filter_status').val();

               if($(this).attr('id') == 'del_agent_true'){

                    $('#agent_list #row_'+row_id).remove();
                    $.ajax({
                        url: '/admin/delete-agent/',
                        type: 'post',
                        dataType: 'json',
                        cache: false,
                        data: {'user_id': row_id, search: search, perpage: perpage, status: status, page: 1},
                        beforeSend: function(){
                            $('.overlay').show();
                        },
                        success: function(response){
                            $('.overlay').hide();


                            if(response.error == 0){
                                //$('#agent_list').empty();
                                $('#del_agent_true').removeAttr('rel_id');
                                $('#del_agent_false').removeAttr('rel_id');
                                $('#confirmAgentDeleteModal').modal('hide');
                                $("#agent_list").empty();
                                $("#agent_listing_pagination_list").empty();
                                $("#agent_list").html(response.agent_listing_html);

                                $("#agent_listing_pagination_list").html(response.pagination_html);
                                window.setTimeout(function () {
                                    $.growl.notice({title: "Agents ", message: response.msg, size: 'large'});

                                }, 2000);
                            }else{
                                //$('#agent_list').empty();
                                $('#del_agent_true').removeAttr('rel_id');
                                $('#del_agent_false').removeAttr('rel_id');
                                $('#confirmAgentDeleteModal').modal('hide');
                                window.setTimeout(function () {
                                    $.growl.error({title: "Agents ", message: response.msg, size: 'large'});
                                }, 2000);

                            }
                            $("#agent_list").find('script').remove();
                            $(window).scrollTop(0);

                        }
                    });
               }else{
                    $('#del_agent_true').removeAttr('rel_id');
                    $('#del_agent_false').removeAttr('rel_id');
                    $('.personalModalwrap').modal('hide');
                    return false;
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
                    }
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
                },
                user_last_name:{
                    required: "Last Name is required.",
                },
                user_phone_no:{
                    required: "Phone no is required.",
                    remote: "Phone no already in use."
                },
                usr_email:{
                    required: "Email is required.",
                    email: "Please Enter Valid Email Address.",
                    remote: "Email Address already in use."
                }
            },
            submitHandler:function(){
                var flag = true;

                if(flag == true){
                    $.ajax({
                        url: '/admin/save-user-details/',
                        type: 'post',
                        dataType: 'json',
                        cache: false,
                        data: $('#update_user_frm').serialize(),
                        beforeSend: function(){

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
                        }
                    });
                }

            }
        });
        $(document).on('keyup', '#agent_search', function(e){
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
                    url: '/admin/sub-admin-search-suggestion/',
                    type: 'post',
                    dataType: 'json',
                    cache: false,
                    data: {'search': search},
                    beforeSend: function(){

                    },
                    success: function(response){
                        if(response.error == 0 && response.status == 200){
                            autocomplete("agent_search", response.suggestion_list);
                        }else{
                            closeAllSuggestions('autocomplete-items');
                        }
                    }
                });
              }

      });
      $(document).on('keyup', '#add_agent_form #zip_code', function(){
           zip_code = $(this).val();
           if(zip_code.length > 4){
            params = {
                'zip_code': zip_code,
                'call_function': set_agent_address_by_zipcode,
            }
            get_address_by_zipcode(params);
           }
      });

});

function set_agent_details(response){

    if(response.status == 200){
        var image_name = '';
        var actual_image = '';
        var upload_id = '';
        var actual_id = '';
        var upload_to = '';
        $('#agent_image_error').hide();
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
            $('#agent_img_name').val(actual_image);
            $('#agent_img_id').val(actual_id);
            if(actual_image){
                var testi_img = aws_url+"profile_image/"+actual_image;
                $('#agentImageId').attr('src', testi_img);
                $('#agentImageDiv').show();
            }
            $('#agentImageDiv .agent-section a').attr({ 'data-image-id': $('#agent_img_id').val(), 'data-image-name':$('#agent_img_name').val(), 'data-image-section': upload_to, 'data-count': '' }).addClass('confirm_image_delete');
        }
    }
}
function set_agent_logo_details(response){

    if(response.status == 200){
        var image_name = '';
        var actual_image = '';
        var upload_id = '';
        var actual_id = '';
        var upload_to = '';
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
            $('#agent_logo_img_name').val(actual_image);
            $('#agent_logo_img_id').val(actual_id);
            if(actual_image){
                var testi_img = aws_url+"company_logo/"+actual_image;
                $('#agentLogoImageId').attr('src', testi_img);
                $('#agentLogoImageDiv').show();
            }
            $('#agentLogoImageDiv .agent-section a').attr({ 'data-image-id': $('#agent_logo_img_id').val(), 'data-image-name':$('#agent_logo_img_name').val(), 'data-image-section': upload_to, 'data-count': '' }).addClass('confirm_image_delete');
        }
    }
}
function filter_agent_list(){
    var search = $('#agent_search').val();
    var perpage = $('#agent_num_record').val();
    var status = $('#agent_filter_status').val();
    $.ajax({
        url: '/admin/agents/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {search: search, perpage: perpage, status: status},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            if(response.error == 0){

            if(response.agent_list.length > 0){
                $('#agent_list').empty();
                var all_row = '';
                var count = 0;
                $.each(response.agent_list, function(i, item) {
                    count = count+1;
                    var name = '';
                    var upgrade_img = '';
                    if(item.first_name){
                      name = item.first_name+' '+item.last_name;
                    }
                    if(item.profile_image.doc_file_name){
                        img_src = aws_url+''+item.profile_image.bucket_name+'/'+item.profile_image.doc_file_name;
                    }else{
                        img_src = 'static/admin/images/no-image.svg';
                    }
                    try{
                        var added_on = getLocalDate(item.added_on, 'mm-dd-yyyy','ampm');

                    }catch(ex){
                        //console.log(ex);
                        var added_on = '';
                    }
                    try{
                        var last_login = getLocalDate(item.last_login, 'mm-dd-yyyy','ampm');

                    }catch(ex){
                        //console.log(ex);
                        var last_login = '';
                    }
                    try{
                        var phone = formatPhoneNumber(item.phone_no);
                    }catch(ex){
                        var phone = '';
                        //console.log(ex);
                    }
                    try{
                        if(item.status.toLowerCase() == 'active'){
                            var badge_class = 'badge-success';
                        }else{
                            var badge_class = 'badge-danger';
                        }
                    }catch{
                        var badge_class = '';
                    }
                    if(item.is_upgrade){
                        upgrade_img = '<img src="/static/admin/images/up-arrow.svg" alt="">';
                    }
                    //all_row += '<div class="block-item" id="row_'+item.id+'"><div class="item">'+count+'</div><div class="item"><div class="user-pics agent-pics"><span class="user-pic"><img src="'+img_src+'" alt=""></span><h6><span>'+name+'</span></h6></div></div><div class="item">'+item.company_name+'</div><div class="item">'+item.licence_no+'</div><div class="item">'+item.email+'</div><div class="item">'+phone+'</div><div class="item">'+item.address_first+'</div><div class="item">'+item.state+'</div><div class="item">'+item.postal_code+'</div><div class="item">NA</div><div class="item">'+added_on+'</div><div class="item">'+last_login+'</div><div class="item"><span class="badge badge-success">'+item.status+'</span></div><div class="item"><a href="/admin/add-agent/?id='+item.id+'" class="badge badge-info"><i class="far fa-edit"></i></a> <a href="javascript:void(0)" onclick="agent_delete_confirmation(\'' + item.id + '\')" class="badge badge-danger ml5"><i class="fas fa-trash-alt"></i></a></div></div>';
                    all_row += '<div class="block-item" id="row_'+item.id+'"><div class="item">'+item.id+'</div><div class="item"><div class="user-pics agent-pics"><h6><span>'+name+''+upgrade_img+'</span></h6></div></div><div class="item">'+item.company_name+'</div><div class="item">'+item.licence_no+'</div><div class="item">'+item.email+'</div><div class="item">'+item.phone_no+'</div><div class="item">'+item.address_first+'</div><div class="item">'+item.state+'</div><div class="item">'+item.postal_code+'</div><div class="item">NA</div><div class="item convert_to_local_time">'+added_on+'</div><div class="item convert_to_local_time">'+last_login+'</div><div class="item"><span class="badge '+badge_class+'">'+item.status+'</span></div><div class="item center"><a href="#" data-toggle="dropdown" role="button" aria-expanded="false" class="nav-link dropdown-toggle"><i class="fas fa-ellipsis-v"></i></a><ul role="menu" class="dropdown-header-top author-log dropdown-menu right"><li><a href="/admin/add-agent/?id='+item.id+'"><i class="fas fa-edit"></i> Edit Agent</a></li><li><a href="javascript:void(0)" onclick="agent_delete_confirmation(\'' + item.id + '\')"><i class="fas fa-trash"></i> Delete Agent</a></li></ul></div></div>';
                });
                $('#agent_list').html(all_row);
                if($('#agent_num_record').val() != ""){
                    var recordPerpage = $('#agent_num_record').val();
                  }
                var $perpageresult = getAllPageLinks('agent_listing',currpage, recordPerpage, response.total_user, '', '', '');
                $("#agent_listing_pagination_list").html($perpageresult);
            }else{
                $('#agent_list').html('<div class="block-item">No Agent found</div>');
            }

            }else{
                $('#agent_list').html('<div class="block-item">No Agent found</div>');

            }
        }
    });
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

function set_agent_address_by_zipcode(response){
    try{
        var zip_state_iso_code = response.state.toLowerCase();
    }catch(ex){
        //console.log(ex);
        var zip_state_iso_code = '';
    }

    $("#add_agent_form #agent_state > option").each(function() {
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
    $('#add_agent_form #agent_state').trigger("chosen:updated");
}

function agentListingSearch(current_page){
        var search = $('#agent_search').val();
        var currpage = current_page;
        if($('#agent_num_record').val() != ""){
            recordPerpage = $('#agent_num_record').val();
        }
        var status = $('#agent_filter_status').val();
        $.ajax({
            url: '/admin/sub-admin/',
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
                    $('#agent_listing_pagination_list').empty();
                    if($('#agent_num_record').val() != ""){
                        recordPerpage = $('#agent_num_record').val();
                    }
                    //var $perpageresult = getAllPageLinks('user_listing',currpage, recordPerpage, response.total_user, '', '', '');

                    $("#agent_list").html(response.agent_listing_html);
                    $("#agent_listing_pagination_list").html(response.pagination_html);


                }else{
                    $('#agent_list').html('<div class="block-item"><div class="item fullwidth"><p class="custom_error center mb0">No Data Found!</p></div></div>');
                }
                $("#agent_list").find('script').remove();
                $(window).scrollTop(0);
            }
        });
    }
    function agent_delete_confirmation(row_id){
          $('.personalModalwrap').modal('hide');
          $('#confirmAgentDeleteModal').modal('show');
          $('.del_agent_btn').attr('rel_id', row_id);
      }