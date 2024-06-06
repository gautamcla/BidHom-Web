$(function () {
      $("#country").chosen();
      $('.alphaAccpt').on('keypress', function(event) {
        var key = event.keyCode;
        return ((key >= 65 && key <= 90) || (key == 8) || (key >= 97 && key <= 122));
      });

      $("#phone_no").inputmask('(999) 999-9999');
    
      $("#profile_pic").change(function(event){
          let allowedType = new Array('.jpg','jpeg','.png');
          let file_name = "";
          let extension = "";
          let file_size = 0;
          let files = $('#profile_pic')[0].files[0];
          file_name = files.name;
          file_size = files.size;
          extension = file_name.substr(-4);
          var myformData = new FormData();
          if(parseInt(file_size) > 2 *1024*1024){
              $.growl.error({title: "Profile Image", message: 'File size is more than 2MB.', size: 'large'});
              $("#profile_pic").val("");
              return false;
          }
          if(allowedType.indexOf(extension.toLowerCase()) == -1){
              $.growl.error({title: "Profile Image", message: 'Only jpg, jpeg gif and png files are allowed.', size: 'large'});
              $("#profile_pic").val("");
              return false;
          } else {
            var output = document.getElementById('user_profile');
            output.src = URL.createObjectURL(event.target.files[0]);
            output.onload = function() {
              URL.revokeObjectURL(output.src) // free memory
            }
          }
          myformData.append('profile_image', files);
          myformData.append('file_length', 1);
          myformData.append('file_size', file_size);
            $.ajax({
                type: "post",
                url: '/image-upload/',
                processData: false,
                contentType: false,
                cache: false,
                data: myformData,
                enctype: 'multipart/form-data',
                beforeSend: function(){
                    $('#btn_editProfile').prop('disabled',true);
                    $('.overlay').show();
                },
                success: function (response) {
                    $('.overlay').hide();
                    $('#btn_editProfile').prop('disabled',false);
                    if(response.error == 0 || response.status == 200){
                        let upload_id = response.uploaded_file_list['0'].upload_id;
                        let pic_name = response.uploaded_file_list['0'].file_name;
                        let upload_to = response.uploaded_file_list['0'].upload_to;
                        $("#profile_image").val(upload_id);
                        $("#pic_name").val(pic_name);
                    }else{
                        $("#profile_image").val('');
                        $("#pic_name").val('');
                    }
                }
                
            }); 
      });
    
    $('#editProfile').validate({
          errorElement: 'p',
          ignore: [],
          rules: {
              first_name:{
                  required: true,
                  acceptcharacters: true,
                  noSpace:true,
                  maxlength:40,
              },
              last_name:{
                  required: true,
                  acceptcharacters: true,
                  noSpace:true,
                  maxlength:40,
              },
              phone_no:{
                  required: true,
                  phoneminlength: 10,
                  phonemaxlength: 10,
              },
              email:{
                  required: true,
                  email: true
              },
              address_city:{
                  required: true
              },
              address_first:{
                  required: true
              },
              state:{
                  required: true
              },
              country:{
                  required: true
              },
              zip_code:{
                  required: true,
                  //minlength: 5,
                  maxlength: 10
              },
              brokerage_name:{
                required:function () {
                    if ($('#brokerage_name').is(':visible') === true) {
                        return true;
                    } else {
                        return false;
                    }
                }
              },
              licence_number:{
                required:function () {
                    if ($('#licence_number').is(':visible') === true) {
                        return true;
                    } else {
                        return false;
                    }
                },
              }
          },
          messages: {
              first_name:{
                  required: "First name is required.",
                  acceptcharacters: "Please enter valid First Name",
                  noSpace: "Please enter valid First Name",
                  maxlength:"Please enter at most 40 char"
              },
              last_name:{
                  required: "Last name is required.",
                  acceptcharacters: "Please enter valid Last Name",
                  noSpace:"Please enter valid Last Name",
                  maxlength:"Please enter at most 40 char"
              },
              phone_no:{
                  required: "Phone no is required.",
                  phoneminlength: "Please enter valid phone number.",
                  phonemaxlength: "Please enter valid phone number.",
              },
              email:{
                  required: "Email is required.",
                  email: "Please enter valid Email"
              },
              address_city:{
                  required: "City is required"
              },
              address_first:{
                  required: "Address is required"
              },
              state:{
                  required: "State is required"
              },
              country:{
                  required: "Country is required"
              },
              zip_code:{
                  required: "Zip Code is required",
                  //minlength: "Please enter at least 5 char",
                  maxlength: "Please enter at most 10 char"
              },
          },
          errorPlacement: function(error, element) {
            if(element.hasClass('select')){
                error.insertAfter(element.next('.chosen-container'));
            }else{
                error.insertAfter(element);
            }
         },
          submitHandler:function(){
              $.ajax({
                  url: '/profile-update/',
                  type: 'post',
                  dataType: 'json',
                  cache: false,
                  data: $('#editProfile').serialize(),
                  beforeSend: function(){
                    $('#btn_editProfile').prop('disabled',true);
                    $('.overlay').show();
                  },
                  success: function(response){
                      $('.overlay').hide();
                      if(response.error == 0 || response.status == 200){
                          $.growl.notice({title: "Profile Update", message: response.msg, size: 'large'});
                               window.setTimeout(function () {
                                   window.location.reload();
                               }, 2000);
                          $('#btn_editProfile').prop('disabled',false);
                      }else{
                          window.setTimeout(function () {
                              $.growl.error({title: "Profile Update", message: response.msg, size: 'large'});
                          }, 2000);
                          $('#btn_editProfile').prop('disabled',false);
                      }
                  }
              });
          }
      });

      /* password changed */
      $('#changePassword').validate({
        errorElement: 'p',
        rules: {
            password:{
                required: true,
                minlength: 6,
                maxlength: 12
            },
            new_password:{
                required: true,
                minlength: 6,
                maxlength: 12
            },
            confirm_password:{
                required: true,
                equalTo: "#new_password",
            }
        },
        messages: {
            password:{
                required: "Password is required.",
                maxlength: "Please enter not more than 12 characters."
            },
            new_password:{
                required: "New password is required.",
                maxlength: "Please enter not more than 12 characters."
            },
            confirm_password:{
                required: "Confirm password is required.",
                equalTo: "Confirm password should be same as new password."
            }
        },
        submitHandler:function(){
            var check = false;
            var upper_text = new RegExp('[A-Z]');
            var lower_text = new RegExp('[a-z]');
            var number_check = new RegExp('[0-9]');
            var pass = $("#new_password").val();
            $("#security-list").html('');
            if(!pass.match(upper_text)){
                $("#security-list").append("<li>Include at least 1 uppercase letter</li>");
                check = true;
            }
            if(!pass.match(lower_text)){
                $("#security-list").append("<li>Include at least 1 lower case letter</li>");
                check = true;
            }
            if(!pass.match(number_check)){
                $("#security-list").append("<li>Include at least 1 number</li>");
                check = true;
            }
            if(check == false){
                $.ajax({
                    url: '/edit-profile/',
                    type: 'post',
                    dataType: 'json',
                    cache: false,
                    data: $('#changePassword').serialize(),
                    beforeSend: function(){
                        $('#btn_pwd').prop('disabled',true);
                        $('.overlay').show();
                    },
                    success: function(response){
                        $('.overlay').hide();
                        if(response.error == 0 || response.status == 200){
                            $.growl.notice({title: "Change Password ", message: response.msg, size: 'large'});
                            window.setTimeout(function () {
                                $('#changePassword')[0].reset();
                            }, 2000);
                            $('#btn_pwd').prop('disabled',false);
                        }else{
                            $('#btn_pwd').prop('disabled',false);
                            window.setTimeout(function () {
                                $.growl.error({title: "Change Password ", message: response.msg, size: 'large'});
                            }, 2000);
                        }
                    }
                });
            } else {
                return false;
            }
            
        }
    });
    $(document).on('keyup', '#editProfile #zip_code', function(){
       var zip_code = $(this).val();
       country_code = $("#country").find(':selected').data('short-code');
       country_id = $("#country").val();
       if(zip_code.length > 4 && country_id == 1){
        params = {
            'zip_code': zip_code,
            'call_function': set_profile_address_by_zipcode,
        }
        get_address_by_zipcode(params);
       }
    })

    .on('click', '.close-welcome-modal', function(e){
        $('#welcomeModal').modal('hide');
    })

    .on('change', '#describedBy', function(){
        if($(this).val() == 3 || $(this).val() == '3'){
            $('.brokerage-name, .licence-number').show()
        } else {
            $('.brokerage-name, .licence-number').hide()
        }
    });
    $(document).on('click', '#del_profile_pic_true', function(){
        var section = $('#confirmProfileImageDeleteModal #popup_section').val();
        var image_id = $('#confirmProfileImageDeleteModal #popup_image_id').val();
        var image_name = $('#confirmProfileImageDeleteModal #popup_image_name').val();
        data = {
            section: section,
            image_id: image_id,
            image_name: image_name
        }
        $.ajax({
            url: '/delete-profile-image/',
            type: 'post',
            dateType: 'json',
            async: false,
            cache: false,
            data: data,
            beforeSend: function(){

            },
            success: function(response){
                var title = 'Delete Image';
                var msg = response.msg;
                var templete_dir = response.templete_dir;
                if(response.error == 0 || response.status == 200){
                    $('#confirmProfileImageDeleteModal #popup_section').val('');
                    $('#confirmProfileImageDeleteModal #popup_image_id').val('');
                    $('#confirmProfileImageDeleteModal #popup_image_name').val('');
                    $('#delete_profile_pic').hide();
                    $('#confirmProfileImageDeleteModal').modal('hide');
                    $("#profile_image").val('');
                    $("#pic_name").val('');
                    var profile_image = '/static/'+templete_dir+'/user-dashboard/images/user-pic.png';
                    $("#user_profile").attr('src', profile_image);
                    $("#user_dashboard_img").attr('src', profile_image);

                    $.growl.notice({title: title, message: msg, size: 'large'});

                }else{
                    window.setTimeout(function () {
                        $.growl.error({title: title, message: msg, size: 'large'});
                    }, 2000);
                }
            }
        });
    });
    $(document).on('click', '#del_profile_pic_false', function(){
        $('#confirmProfileImageDeleteModal #popup_section').val('');
        $('#confirmProfileImageDeleteModal #popup_image_id').val('');
        $('#confirmProfileImageDeleteModal #popup_image_name').val('');
        $('#confirmProfileImageDeleteModal').modal('hide');
    });

});

function view_password(element){
    if($('#'+element).attr('type') == 'password'){
        $('#'+element).attr('type', 'text');
    }else{
        $('#'+element).attr('type', 'password');
    }
}

function remove_view_password(element){
    $('#'+element).attr('type', 'password');
}
function set_profile_address_by_zipcode(response){

    if(response.city){
        $('#address_city-error').hide();
        $('#address_city').closest('.form-group').addClass('focused');
        $('#state-error').hide();
        city = response.city;
    }
    try{
        var zip_state_iso_code = response.state.toLowerCase();
    }catch(ex){
        //console.log(ex);
        var zip_state_iso_code = '';
    }

    $('#editProfile #state > option').each(function() {
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
    $('#editProfile #state').trigger("chosen:updated");
    $('#editProfile #address_city').val(city);
}
function confirm_delete_profile_image(upload_id, bucket_name, image_name){
    var section = bucket_name;
    var image_id = upload_id;
    var image_name = image_name;
    if(section && image_id && image_name){
        $('#confirmProfileImageDeleteModal #popup_section').val(section);
        $('#confirmProfileImageDeleteModal #popup_image_id').val(image_id);
        $('#confirmProfileImageDeleteModal #popup_image_name').val(image_name);
        $('#confirmProfileImageDeleteModal').modal('show');
    }else{
        return false;
    }

}
function validateAlpha(event){
    var key = event.keyCode;
    return ((key >= 65 && key <= 90) || (key == 8) || (key >= 97 && key <= 122));
}

function state_list_update(country_id, state_id){
   country_id = $("#"+country_id).val();
   csrf_token = $('input[name="csrfmiddlewaretoken"]').val();
   if (country_id){
        $.ajax({
            url: '/state-list/',
            type: 'post',
            dateType: 'json',
            cache: false,
            data: {country_id: country_id, 'csrfmiddlewaretoken': csrf_token},
            beforeSend: function(){
                $('.overlay').show();
            },
            success: function(response){
                $('.overlay').hide();
                if(response.error == 0){
                    state_lists = response.state_lists;
                    var option_html = "";
                    $('#'+state_id).empty().append("<option value=''>Select</option>");
                    $.each( state_lists, function( key, value ) {
                        $('#'+state_id).append("<option value="+value.id+" data-short-code="+value.iso_name+">"+value.state_name+"</option>");
                    });
                    $('#'+state_id).trigger("chosen:updated");
                }

            }
        });
   }else{
        $('#'+state_id).empty().append("<option value=''>Select</option>");
        $('#'+state_id).trigger("chosen:updated");
   }

}


$("#country").change(function(){
    $("#state").empty().append("<option value=''>Select</option>");
    $("#address_first").val("");
    $("#zip_code").val("");
    $("#address_city").val("");
    state_list_update("country", "state");
});