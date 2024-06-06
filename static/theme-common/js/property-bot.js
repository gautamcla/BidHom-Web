let autocomplete;
let address1Field;
function initializeGMap(lat, lng) {
    try{
        myLatlng = new google.maps.LatLng(lat, lng);

    var myOptions = {
      zoom: 18,
      zoomControl: true,
      center: myLatlng,
      mapTypeId: 'satellite'
    };
    //$('#arielView').html('');
    map = new google.maps.Map(document.getElementById("arielView"), myOptions);

    myMarker = new google.maps.Marker({
      position: myLatlng,
      draggable: true,
    });
    myMarker.setMap(map);

    google.maps.event.addListener(myMarker, 'dragend', function() {
        geocodePosition(myMarker.getPosition());
      });
      /*google.maps.event.addListener(myMarker, 'click', function() {
        if (myMarker.formatted_address) {
          infowindow.setContent(myMarker.formatted_address + "<br>coordinates: " + myMarker.getPosition().toUrlValue(6));
        } else {
          infowindow.setContent(address + "<br>coordinates: " + myMarker.getPosition().toUrlValue(6));
        }
        infowindow.open(map, myMarker);
      });*/
        $("#arielView").css("width", "100%");
    }catch(ex){
        console.log(ex);
    }

  }
  function geocodePosition(pos) {
      var geocoder = new google.maps.Geocoder();
      geocoder.geocode({
        latLng: pos
      }, function(responses) {
        if (responses && responses.length > 0) {
          myMarker.formatted_address = responses[0].formatted_address;
          latitude = responses[0].geometry.location.lat();
            longitude = responses[0].geometry.location.lng();
            console.log(typeof(latitude));
            console.log(latitude);
            console.log(typeof(longitude));
            console.log(longitude);
          var new_address = responses[0].formatted_address;
            $('#mapAnswer').val(new_address);
            $('#latitude').val(latitude);
            $('#longitude').val(longitude);
        } else {
          myMarker.formatted_address = 'Cannot determine address at this location.';
        }
        //infowindow.setContent(myMarker.formatted_address + "<br>coordinates: " + myMarker.getPosition().toUrlValue(6));
        //infowindow.open(map, myMarker);
      });
    }
    function initAutocomplete() {
      address1Field = document.querySelector("#mapAnswer");
      // Create the autocomplete object, restricting the search predictions to
      // addresses in the US and Canada.
      try{
            autocomplete = new google.maps.places.Autocomplete(address1Field, {
            componentRestrictions: { country: ["us", "ca"] },
            fields: ["address_components", "geometry"],
            types: ["address"],
          });
          address1Field.focus();
          // When the user selects an address from the drop-down, populate the
          // address fields in the form.
          google.maps.event.addListener(autocomplete, "place_changed", fillInAddress);
      }catch(ex){
        console.log("exp init autocomplete: "+ex);
      }

    }
    function fillInAddress() {
        console.log("here");
        var address = $('#mapAnswer').val();
        if(address != ""){
            /*try {
              var geocoder = new google.maps.Geocoder();
              geocoder.geocode( { 'address': address}, function(results, status) {
                  if (status == google.maps.GeocoderStatus.OK) {
                    latitude = results[0].geometry.location.lat();
                    longitude = results[0].geometry.location.lng();
                    console.log(typeof(latitude));
                    console.log(latitude);
                    console.log(typeof(longitude));
                    console.log(longitude);
                  } else {
                    latitude = 33.1836304229855;
                    longitude = -117.32728034223504;
                  }
              });
            }
            catch(err) {
                console.log(err);
              latitude = 33.1836304229855;
              longitude = -117.32728034223504;
            }
            try{

                initializeGMap(latitude, longitude);
            }catch(ex){
                //initializeGMap(33.1836304229855, -117.32728034223504);
            }*/
            make_map(address);
            }

      /*// Get the place details from the autocomplete object.
      const place = autocomplete.getPlace();
      for (const component of place.address_components) {
        const componentType = component.types[0];
        switch (componentType) {
          case "street_number": {
            address1 = `${component.long_name} ${address1}`;
            break;
          }

          case "route": {
            address1 += component.short_name;
            break;
          }

          case "postal_code": {
            postcode = `${component.long_name}${postcode}`;
            break;
          }

          case "postal_code_suffix": {
            postcode = `${postcode}-${component.long_name}`;
            break;
          }
          case "locality":
            document.querySelector("#locality").value = component.long_name;
            break;
          case "administrative_area_level_1": {
            document.querySelector("#state").value = component.short_name;
            break;
          }
          case "country":
            document.querySelector("#country").value = component.long_name;
            break;
        }
      }
      address1Field.value = address1;
      //$('#mapAnswer').focus();
      address1Field.focus();*/
      //$('#mapAnswer').trigger('blur');
    }
window.initAutocomplete = initAutocomplete;
$(document).ready(function(){
    var map = null;
      var myMarker;
      var myLatlng;

        hide_bot_loader();
        //initAutocomplete();
      // Re-init map before show modal
      /*$('#BotMapModal').on('show.bs.modal', function(event) {
        var button = $(event.relatedTarget);
        var address = $('#mapAnswer').val();
        if(address){
            make_map(address);
            $("#arielView").css("width", "100%");
        }
        *//*initializeGMap($('.location_map').data('lat'), $('.location_map').data('lng'));
        $("#arielView").css("width", "100%");*//*
      });*/

      /*$(document).on('blur', '#mapAnswer', function(){
        console.log("blur called");
        var address = $(this).val();
        if(address != ""){
            *//*try {
              var geocoder = new google.maps.Geocoder();
              geocoder.geocode( { 'address': address}, function(results, status) {
                  if (status == google.maps.GeocoderStatus.OK) {
                    latitude = results[0].geometry.location.lat();
                    longitude = results[0].geometry.location.lng();
                    console.log(typeof(latitude));
                    console.log(latitude);
                    console.log(typeof(longitude));
                    console.log(longitude);
                  } else {
                    console.log("else");
                    latitude = 33.1836304229855;
                    longitude = -117.32728034223504;
                  }
              });
            }
            catch(err) {
                console.log("lat long: "+err);
              latitude = 33.1836304229855;
              longitude = -117.32728034223504;
            }
            try{
                initializeGMap(latitude, longitude);
            }catch(ex){
                console.log("exception in map: "+ex);
            }*//*
            make_map(address);
        }
      });*/

      // Trigger map resize event after modal shown
      $('#BotMapModal').on('shown.bs.modal', function() {

        try{
            google.maps.event.trigger(map, "resize");
            map.setCenter(myLatlng);
        }catch(ex){
            console.log("exception in center: "+ex);
        }

      });

    $('#mapAnswer').on('input',function(e){
        $(this).val(function (index, value) {
            initAutocomplete();
            return value;
        });

    });

    $(document).on('click', '.valid_nav_link', function(){
        var section_name = $(this).data('name');
        var section_id = $(this).data('id');
        if(parseInt(section_id) == 1 && section_name == 'property_address'){
            $('#property_address_section').show();
            /*$('#cat_nav_a_1').html('<span class="number"><i class="fa fa-check"></i></span>');
            $('#cat_nav_a_2').html('<span class="number">2</span>');
            $('#cat_nav_a_3').html('<span class="number">3</span>');
            $('#cat_nav_a_4').html('<span class="number">4</span>');
            $('#cat_nav_a_5').html('<span class="number">5</span>');*/
            $('#property_detail_section').hide();
            $('#photo_document_section').hide();
            $('#additional_section').hide();
            $('#complete_section').hide();
        }else if(parseInt(section_id) == 2 && section_name == 'property_details'){
            $('#property_detail_section').show();
            /*$('#cat_nav_a_1').html('<span class="number">1</span>');
            $('#cat_nav_a_2').html('<span class="number"><i class="fa fa-check"></i></span>');
            $('#cat_nav_a_3').html('<span class="number">3</span>');
            $('#cat_nav_a_4').html('<span class="number">4</span>');
            $('#cat_nav_a_5').html('<span class="number">5</span>');*/
            $('#property_address_section').hide();
            $('#photo_document_section').hide();
            $('#additional_section').hide();
            $('#complete_section').hide();
        }else if(parseInt(section_id) == 3 && section_name == 'photos_document'){
            $('#photo_document_section').show();
            /*$('#cat_nav_a_1').html('<span class="number">1</span>');
            $('#cat_nav_a_2').html('<span class="number">2</span>');
            $('#cat_nav_a_3').html('<span class="number"><i class="fa fa-check"></i></span>');
            $('#cat_nav_a_4').html('<span class="number">4</span>');
            $('#cat_nav_a_5').html('<span class="number">5</span>');*/
            $('#property_detail_section').hide();
            $('#property_address_section').hide();
            $('#additional_section').hide();
            $('#complete_section').hide();
        }else if(parseInt(section_id) == 4 && section_name == 'additional_questions'){
            $('#additional_section').show();
            /*$('#cat_nav_a_1').html('<span class="number">1</span>');
            $('#cat_nav_a_2').html('<span class="number">2</span>');
            $('#cat_nav_a_3').html('<span class="number">3</span>');
            $('#cat_nav_a_4').html('<span class="number"><i class="fa fa-check"></i></span>');
            $('#cat_nav_a_5').html('<span class="number">5</span>');*/
            $('#property_detail_section').hide();
            $('#photo_document_section').hide();
            $('#property_address_section').hide();
            $('#complete_section').hide();
        }else if(parseInt(section_id) == 5 && section_name == 'completed'){
            $('#complete_section').show();
            $('#cat_nav_a_1').html('<span class="number">1</span>');
            $('#cat_nav_a_2').html('<span class="number">2</span>');
            $('#cat_nav_a_3').html('<span class="number">3</span>');
            $('#cat_nav_a_4').html('<span class="number">4</span>');
            $('#cat_nav_a_5').html('<span class="number"><i class="fa fa-check"></i></span>');
            $('#property_address_section').hide();
            $('#property_detail_section').hide();
            $('#photo_document_section').hide();
            $('#additional_section').hide();

        }
    });
    /*$(document).on('click', '.rating_li', function(){

    });*/
    $(document).on('mouseover', '.rating_li', function(){
        //console.log($(this).hasClass('no_hover'));
        if(!$(this).hasClass('no_hover')){
            var i;
            $('.rating_li').removeClass('active');
            var answer_value = $(this).data('value');
            for(i=1;i<=answer_value;i++){
                $('.rating li:nth-child('+i+')').addClass('active');
            }
        }
    });
    $(document).on('click', '#del_upload_doc_false', function(){
        $('#popup_section').val('');
        $('#popup_image_id').val('');
        $('#popup_image_bot_id').val('');
        $('#popup_image_name').val('');
        $('#conter').val('');
        $('#counter_id').val('');
        $('#question_id').val('');
        $('#img_cnt').val('');
        $('#confirmOfferDocDeleteModal').modal('hide');
    });
    /*$(".user_file").change(function(event){
          var cnt;
          var img_cnt = 1;
          var question_id = $(this).data('question');
          var answer = '';
          var section_id = $(this).closest('.bot-chat').attr('id');
          var counter_id = $(this).attr('id');
          var counter_arr = counter_id.split("_");
          var counter = counter_arr[1];
          let allowedType = new Array('.jpg','.jpeg','.png');
          var myformData = new FormData();
          //let files = $('#'+section_id+' #userFile_'+counter)[0].files[0];
          let files = $('#'+section_id+' #userFile_'+counter)[0].files;
          for(cnt=0;cnt < files.length;cnt++){
                let files_el = $('#'+section_id+' #userFile_'+counter)[0].files[cnt];
                let file_name = "";
                  let extension = "";
                  let file_size = 0;

                  file_name = files_el.name;
                  file_size = files_el.size;
                  extension = file_name.substr(-4);

                  if(parseInt(file_size) > 5 *1024*1024){
                      $.growl.error({title: "Photos & Documents", message: 'File size is more than 5MB.', size: 'large'});
                      $('#'+section_id+' #userFile_'+counter).val("");
                      return false;
                  }
                  if(allowedType.indexOf(extension.toLowerCase()) == -1){
                      $.growl.error({title: "Photos & Documents", message: 'Only jpg, jpeg gif and png files are allowed.', size: 'large'});
                      $('#'+section_id+' #userFile_'+counter).val("");
                      return false;
                  } else {
                    var output = document.getElementById('userProfile_'+img_cnt);
                    output.src = URL.createObjectURL(event.target.files[cnt]);
                    output.onload = function() {
                      URL.revokeObjectURL(output.src) // free memory
                    }
                  }
                  var upload_key = 'profile_image['+cnt+']';
                  var upload_size = 'file_size['+cnt+']';
                  myformData.append(upload_key, files_el);
                  file_size = parseFloat((file_size / (1024*1024)).toFixed(2));
                  myformData.append(upload_size, file_size);
                  img_cnt++;
          }
          myformData.append('file_length', files.length);
          myformData.append('question_id', question_id);
          myformData.append('answer', answer);
          myformData.append('counter_id', counter_id);
          myformData.append('counter', counter);
          console.log(myformData);
            $.ajax({
                type: "post",
                url: '/estimator-file-upload/',
                processData: false,
                contentType: false,
                cache: false,
                data: myformData,
                enctype: 'multipart/form-data',
                beforeSend: function () {
                    *//*$.blockUI({
                        message: '<h4>...</h4>'
                    });*//*
                    $('.bot_loading').show();
                },
                complete: function () {
                    //$.unblockUI();
                    $('.bot_loading').hide();

                },
                success: function (response) {
                    $('.bot_loading').hide();
                    let upload_id = response.data.uploaded_file_list['0'].upload_id;
                    let pic_name = response.data.uploaded_file_list['0'].file_name;
                    let upload_to = response.data.uploaded_file_list['0'].upload_to;
                    var img_src = aws_url+upload_to+"/"+pic_name;
                    if(response.data.estimator_details_html){
                        $('#estimatorContent').html(response.data.estimator_details_html);
                        $("#estimatorContent").find('script').remove();
                    }
                }

            });
      });*/

       /*$(document).on('show.bs.modal','#BotMapModal', function (e) {
        //alert("hello");
        //initmap();
            var latitude = $('#latitude').val();
            var longitude = $('#longitude').val();
            initmap();
       });*/
      /*$(document).on('click', '.location_map', function(){
            $('#BotMapModal').show();
      });*/

});
function hide_bot_loader(){

    var toal_ans = $('#toalAddressAnswer').val();
    if(parseInt(toal_ans) <= 0){
        window.setTimeout(function () {
            $('.bot_loading').hide();
            $('#property_address_section li').eq(0).show();
        }, 1000);
        window.setTimeout(function () {
            $('.bot_loading').show();
        }, 1000);
        window.setTimeout(function () {
            bot_loader();
        }, 1000);
    }
}
function bot_loader(){
    window.setTimeout(function () {
        $('.bot_loading').hide();
        $('#property_address_section li').eq(1).show();
    }, 1000);
}
function submit_answer(element, skip_ans){
    var question_id = $(element).data('question');
    if(skip_ans){
        var answer = '';
    }else{
        var answer = $(element).closest('li.answer_section').find('.user_answer').val();
    }
    var section_id = $(element).closest('ul.bot-chat').attr('id');
    var total_remains = $(element).closest('ul.bot-chat').data('total-unanswered');
    var counter_id = $(element).attr('id');
    var counter_arr = counter_id.split("_");
    var counter = counter_arr[1];
    /*console.log(question_id);
    console.log(answer);
    console.log(counter_id);
    console.log(counter);
    console.log(skip_ans);
    return false;*/
    if((question_id !="" && answer != "") || (question_id !="" && parseInt(skip_ans) == 1)){
        $.ajax({
            url: '/save-estimator-answer/',
            type: 'post',
            dataType: 'json',
            cache: false,
            data: {question_id: question_id, answer: answer, counter_id: counter_id, counter: counter, section_id: section_id, total_remains: total_remains},
            beforeSend: function () {
                /*$.blockUI({
                    message: '<h4>...</h4>'
                });*/
                $('.bot_loading').show();
            },
            complete: function () {
                //$.unblockUI();
                $('.bot_loading').hide();

            },
            success: function(response){
                //$('.overlay').hide();
                //$.unblockUI();
                $('.bot_loading').hide();
                if(response.error == 0){
                    if(response.data.estimator_details_html){
                        $('#estimatorContent').html(response.data.estimator_details_html);
                        $("#estimatorContent").find('script').remove();
                    }
                    if(response.data.scroll_top){
                        $(window).scrollTop(100);
                    }

                    //$.growl.notice({title: "Property Bot ", message: response.msg, size: 'large'});
                }else{
                    /*window.setTimeout(function () {
                        $.growl.error({title: "Property Bot ", message: response.msg, size: 'large'});
                    }, 2000);*/
                    console.log("on submit"+response.msg);
                }
            }
        });
    }
}
function submit_rating_answer(el){
    var i;
        $('.rating_li').removeClass('active');
        var answer_value = $(el).data('value');
        for(i=1;i<=answer_value;i++){
            $('.rating li:nth-child('+i+')').addClass('active');
        }
        var question_id = $(el).closest('li.answer_section').data('question');
        var answer = answer_value;
        var counter_id = $(el).closest('li.answer_section').attr('id');
        var section_id = $(el).closest('ul.bot-chat').attr('id');
        var total_remains = $(el).closest('ul.bot-chat').data('total-unanswered');
        var counter_arr = counter_id.split("_");
        var counter = counter_arr[1];
        if(question_id !="" && answer != ""){
            //if(confirm("Do You want to submit this?")){
            $.ajax({
                url: '/save-estimator-answer/',
                type: 'post',
                dataType: 'json',
                cache: false,
                data: {question_id: question_id, answer: answer, counter_id: counter_id, counter: counter, section_id: section_id, total_remains: total_remains},
                beforeSend: function () {
                    /*$.blockUI({
                        message: '<h4>...</h4>'
                    });*/
                    $('.bot_loading').show();
                },
                complete: function () {
                    //$.unblockUI();
                    $('.bot_loading').hide();

                },
                success: function(response){
                    //$('.overlay').hide();
                    $('.bot_loading').hide();
                    if(response.error == 0){
                        if(response.data.estimator_details_html){
                            $('#estimatorContent').html(response.data.estimator_details_html);
                            $("#estimatorContent").find('script').remove();
                        }
                        if(response.data.scroll_top){
                            $(window).scrollTop(100);
                        }

                        //$.growl.notice({title: "Property Bot ", message: response.msg, size: 'large'});
                    }else{
                        /*window.setTimeout(function () {
                            $.growl.error({title: "Property Bot ", message: response.msg, size: 'large'});
                        }, 2000);*/
                        console.log("on submit rating"+response.msg);
                    }
                }
            });
            //}
        }
}
function submit_user_file(el){
          var cnt;
          var img_cnt = $(el).data('counter');
          var question_id = $(el).data('question');
          var answer = '';
          var section_id = $(el).closest('.bot-chat').attr('id');
          var counter_id = $(el).attr('id');
          var counter_arr = counter_id.split("_");
          var counter = counter_arr[1];

          let allowedType = new Array('.jpg','.jpeg','.png','jpg','jpeg','png');
          var myformData = new FormData();
          let files = $('#'+section_id+' #userFile_'+counter)[0].files[0];
          let file_name = "";
          let extension = "";
          let file_size = 0;

          file_name = files.name;
          file_size = files.size;
          extension = file_name.substr(-4);

          if(parseInt(file_size) > 5 *1024*1024){
              $.growl.error({title: "Photos & Documents", message: 'File size is more than 5MB.', size: 'large'});
              $('#'+section_id+' #userFile_'+counter).val("");
              return false;
          }
          if(allowedType.indexOf(extension.toLowerCase()) == -1){
              $.growl.error({title: "Photos & Documents", message: 'Only jpg, jpeg gif and png files are allowed.', size: 'large'});
              $('#'+section_id+' #userFile_'+counter).val("");
              return false;
          } else {
            var output = document.getElementById('userProfile_'+img_cnt);
            output.src = URL.createObjectURL(event.target.files[0]);
            output.onload = function() {
              URL.revokeObjectURL(output.src) // free memory
            }
          }
          file_size = parseFloat((file_size / (1024*1024)).toFixed(2));
          myformData.append('profile_image', files);
          myformData.append('file_size', file_size);
          myformData.append('file_length', 1);
          myformData.append('question_id', question_id);
          myformData.append('answer', answer);
          myformData.append('counter_id', counter_id);
          myformData.append('counter', counter);
          myformData.append('img_cnt', img_cnt);
          myformData.append('section_id', section_id);
          /*console.log(question_id);
          console.log(section_id);
          console.log(counter_id);
          console.log(counter);
          console.log(myformData);
          return false;*/
            $.ajax({
                type: "post",
                url: '/estimator-file-upload/',
                processData: false,
                contentType: false,
                cache: false,
                data: myformData,
                enctype: 'multipart/form-data',
                beforeSend: function () {
                    /*$.blockUI({
                        message: '<h4>...</h4>'
                    });*/
                    //$('.bot_loading').show();
                    $('label[for="userFile_'+counter+'"]').html('<i class="fa fa-spinner" aria-hidden="true"></i>');
                    $('#submitAns_'+question_id).prop('disabled', true);
                },
                complete: function () {
                    //$.unblockUI();
                    //$('.bot_loading').hide();
                    $('label[for="userFile_'+counter+'"]').html('<i class="fa fa-camera" aria-hidden="true"></i>');
                    $('#submitAns_'+question_id).removeProp('disabled');

                },
                success: function (response) {
                    $('label[for="userFile_'+counter+'"]').html('<i class="fa fa-camera" aria-hidden="true"></i>');
                    $('#submitAns_'+question_id).removeProp('disabled');
                   // $('.bot_loading').hide();
                    console.log(response);
                    let data_error = response.data.uploaded_file_list['0'].error;
                    if(data_error == 0){

                        let upload_id = response.data.uploaded_file_list['0'].upload_id;
                        let pic_name = response.data.uploaded_file_list['0'].file_name;
                        let upload_to = response.data.uploaded_file_list['0'].upload_to;

                        let aws_url = response.data.aws_url;
                        let section_id = response.data.section_id;
                        let question_id = response.data.question_id;
                        let img_cnt = response.data.img_cnt;
                        let counter = response.data.counter;
                        let counter_id = response.data.counter_id;
                        let prop_bot_id = upload_id;
                        var img_src = aws_url+upload_to+"/"+pic_name;
                        var bot_img_id = $('#userImgId_'+question_id).val();
                        if(bot_img_id){
                            bot_img_id = bot_img_id+','+upload_id;
                        }else{
                            bot_img_id = upload_id;
                        }

                        $('#userImgId_'+question_id).val(bot_img_id);
                        $('#userImgId_'+counter).val(upload_id);
                        $('#'+section_id+' #deleteImgSection_'+counter).html('<a href="javascript:void(0)" id="deleteImg_'+counter+'" data-question="'+question_id+'" onClick="confirm_delete_bot_image(this,\''+question_id+'\',\''+upload_id+'\',\''+prop_bot_id+'\',\''+section_id+'\',\''+img_cnt+'\',\''+pic_name+'\',\''+counter+'\',\''+counter_id+'\')">×</a>').show();
                        $('#'+section_id+' #userProfile_'+img_cnt).attr('src',img_src);
                        $('#'+section_id+' #imageUpload_'+counter).html('<figure><a href="javascript:void(0)" class="thumbnail" onClick="show_thumb_image(\''+img_src+'\',this)"><img id="userProfile_'+img_cnt+'" src="'+img_src+'" alt=""></a><div class="close-pic delete_img_section" id="deleteImgSection_'+counter+'" style="display:block;" onClick="confirm_delete_bot_image(this,\''+question_id+'\',\''+upload_id+'\',\''+prop_bot_id+'\',\''+section_id+'\',\''+img_cnt+'\',\''+pic_name+'\',\''+counter+'\',\''+counter_id+'\')"><a href="javascript:void(0)" id="deleteImg_'+counter+'" data-question="'+question_id+'" >×</a></div></figure>');

                    }

                    /*if(response.data.estimator_details_html){
                        $('#estimatorContent').html(response.data.estimator_details_html);
                        $("#estimatorContent").find('script').remove();
                    }*/
                }

            });
}
function skip_map_answer(el){
    var question_id = $('#mapQuestion').val();
        var answer = '';
        var counter_id = $('#counterId').val();
        var counter = $('#counter').val();
        var section_id = $('#section').val();
        if(question_id !=""){
            $('#BotMapModal').modal('hide');
            $.ajax({
                url: '/save-estimator-answer/',
                type: 'post',
                dataType: 'json',
                cache: false,
                data: {question_id: question_id, answer: answer, counter_id: counter_id, counter: counter, section_id: section_id},
                beforeSend: function () {
                    /*$.blockUI({
                        message: '<h4>...</h4>'
                    });*/
                    $('.bot_loading').show();
                },
                complete: function () {
                    //$.unblockUI();
                    $('.bot_loading').hide();

                },
                success: function(response){
                    //$('.overlay').hide();
                    $('.bot_loading').hide();
                    if(response.error == 0){
                        if(response.data.estimator_details_html){
                            $('#estimatorContent').html(response.data.estimator_details_html);
                            $("#estimatorContent").find('script').remove();
                        }
                        if(response.data.scroll_top){
                            $(window).scrollTop(100);
                        }

                        //$.growl.notice({title: "Property Bot ", message: response.msg, size: 'large'});
                    }else{
                        /*window.setTimeout(function () {
                            $.growl.error({title: "Property Bot ", message: response.msg, size: 'large'});
                        }, 2000);*/
                        console.log("on submit"+response.msg);
                    }
                }
            });
        }
}
function show_location_map(el){
    var question_id = $(el).data('question');
        var answer = $(el).data('answer');
        var counter = $(el).data('counter');
        var counter_id = $(el).attr('id');
        var section = $(el).closest('.bot-chat').attr('id');
        var latitude = $('#latitude').val();
        var longitude = $('#longitude').val();
        $('#mapQuestion').val(question_id);
        $('#counterId').val(counter_id);
        $('#counter').val(counter);
        $('#section').val(section);
        $('#mapAnswer').val(answer);
        var address = $('#mapAnswer').val();
        make_map(address);
        /*var latitude = '';
        var longitude = '';
        try {
          var geocoder = new google.maps.Geocoder();
          geocoder.geocode( { 'address': $('#mapAnswer').val()}, function(results, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                latitude = results[0].geometry.location.lat();
                longitude = results[0].geometry.location.lng();
                console.log(typeof(latitude));
                console.log(latitude);
                console.log(typeof(longitude));
                console.log(longitude);
              } else {
                latitude = 33.1836304229855;
                longitude = -117.32728034223504;
              }
          });
        }
        catch(err) {
            console.log(err);
          latitude = 33.1836304229855;
          longitude = -117.32728034223504;
        }

        $('#latitude').val(latitude);
        $('#longitude').val(longitude);
        if($('#mapAnswer').val()){
            $('#mapAnswer').prop('disabled', true);
            $('#submitMapBtnSection').hide();
            $('#skipMapBtnSection').hide();
        }else{
            $('#submitMapBtnSection').show();
            $('#skipMapBtnSection').show();
        }*/
        $('#BotMapModal').modal('show');
        //initAutocomplete();
}
function submit_map_answer(el){
    var question_id = $('#mapQuestion').val();
        var answer = $('#mapAnswer').val();
        var counter_id = $('#counterId').val();
        var counter = $('#counter').val();
        var section_id = $('#section').val();
        if(question_id !="" && answer != ""){
            $('#BotMapModal').modal('hide');
            $.ajax({
                url: '/save-estimator-answer/',
                type: 'post',
                dataType: 'json',
                cache: false,
                data: {question_id: question_id, answer: answer, counter_id: counter_id, counter: counter, section_id: section_id},
                beforeSend: function () {
                    /*$.blockUI({
                        message: '<h4>...</h4>'
                    });*/
                    $('.bot_loading').show();
                },
                complete: function () {
                    //$.unblockUI();
                    $('.bot_loading').hide();

                },
                success: function(response){
                    //$('.overlay').hide();
                    //$.unblockUI();
                    $('.bot_loading').hide();
                    if(response.error == 0){
                        if(response.data.estimator_details_html){
                            $('#estimatorContent').html(response.data.estimator_details_html);
                            $("#estimatorContent").find('script').remove();
                        }
                        if(response.data.scroll_top){
                            $(window).scrollTop(100);
                        }

                        //$.growl.notice({title: "Property Bot ", message: response.msg, size: 'large'});
                    }else{
                        /*window.setTimeout(function () {
                            $.growl.error({title: "Property Bot ", message: response.msg, size: 'large'});
                        }, 2000);*/
                        console.log("on submit"+response.msg);
                    }
                }
            });
        }
}
function confirm_delete_bot_image(el,question_id,upload_id,prop_bot_id,section_id,img_cnt,img_name,counter,counter_id){
    $('#popup_section').val(section_id);
    $('#popup_image_id').val(upload_id);
    $('#popup_image_bot_id').val(prop_bot_id);
    $('#popup_image_name').val(img_name);
    $('#conter').val(counter);
    $('#counter_id').val(counter_id);
    $('#question_id').val(question_id);
    $('#img_cnt').val(img_cnt);
    $('#confirmOfferDocDeleteModal').modal('show');
}

function delete_bot_image(){
    var section_id = $('#popup_section').val();
    var upload_id = $('#popup_image_id').val();
    var bot_doc_id = $('#popup_image_bot_id').val();
    var img_name = $('#popup_image_name').val();
    var counter = $('#conter').val();
    var counter_id = $('#counter_id').val();
    var question_id = $('#question_id').val();
    var img_cnt = $('#img_cnt').val();
    $('#confirmOfferDocDeleteModal').modal('hide');
    image_id = $('#userImgId_'+question_id).val();
    new_ids = remove_string(image_id,upload_id,',');
    $('#userImgId_'+question_id).val(new_ids);
    $('#userImgId_'+counter).val('');
    /*return false;*/
    $.ajax({
        url: '/delete-bot-document/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {question_id: question_id, counter_id: counter_id, counter: counter, upload_id: upload_id, bot_doc_id: bot_doc_id, img_name: img_name, img_cnt: img_cnt, section_id: section_id},
        beforeSend: function () {
            /*$.blockUI({
                message: '<h4>...</h4>'
            });*/
            //$('.bot_loading').show();
        },
        complete: function () {
            //$.unblockUI();
            //$('.bot_loading').hide();

        },
        success: function(response){
            //$('.overlay').hide();
            //$.unblockUI();
            //$('.bot_loading').hide();
            if(response.error == 0){
                var question_id = response.data.question_id;
                var counter_id = response.data.counter_id;
                var counter = response.data.counter;
                var upload_id = response.data.upload_id;
                var bot_doc_id = response.data.bot_doc_id;
                var img_name = response.data.img_name;
                var img_cnt = response.data.img_cnt;
                var section_id = response.data.section_id;

                image_id = $('#'+section_id+' #userImgId_'+question_id).val();
                new_ids = remove_string(image_id,upload_id,',');
                $('#'+section_id+' #userImgId_'+question_id).val(new_ids);
                $('#'+section_id+' #userImgId_'+counter).val('');
                $('#'+section_id+' #deleteImg_'+counter).removeAttr('onClick');
                $('#'+section_id+' #deleteImgSection_'+counter).hide();
                $('#'+section_id+' #userProfile_'+img_cnt).attr('src', '/static/admin/images/property-default-img.png');
                $('#'+section_id+' #imageUpload_'+counter).html('<figure><img id="userProfile_'+img_cnt+'" src="/static/admin/images/property-default-img.png" data-counter="'+img_cnt+'" alt=""><div class="upload-pic"><input class="user_image_id" type="hidden" id="userImgId_'+counter+'" data-question="'+question_id+'" value=""/><input class="user_file" type="file" id="userFile_'+counter+'" data-question="'+question_id+'" data-counter="'+img_cnt+'" onchange="submit_user_file(this)"/><label for="userFile_'+counter+'"><i class="fa fa-camera"></i></label></div><div class="close-pic delete_img_section" id="deleteImgSection_'+counter+'" style="display:none;"><a href="javascript:void(0)" id="deleteImg_'+counter+'" data-question="'+counter+'" >×</a></div></figure>');

                /*$('#userImgId_'+question_id).val(bot_img_id);
                $('#userImgId_'+counter).val(upload_id);*/
            }else{
                console.log("on submit"+response.msg);
            }
        }
    });

}
function submit_upload_answer(element){
    var question_id = $(element).data('question');
    var answer = $('#userImgId_'+question_id).val();
    var counter_id = $(element).attr('id');
    var counter_arr = counter_id.split("_");
    var counter = counter_arr[1];
    var section_id = $(element).closest('ul.bot-chat').attr('id');
    var total_remains = $(element).closest('ul.bot-chat').data('total-unanswered');
    /*console.log(question_id);
    console.log(answer);
    console.log(counter_id);
    console.log(counter);
    return false;*/
    if(question_id !="" && answer != ""){
        $.ajax({
            url: '/save-upload-answer/',
            type: 'post',
            dataType: 'json',
            cache: false,
            data: {question_id: question_id, answer: answer, counter_id: counter_id, counter: counter, section_id: section_id, total_remains: total_remains},
            beforeSend: function () {
                /*$.blockUI({
                    message: '<h4>...</h4>'
                });*/
                $('.bot_loading').show();
            },
            complete: function () {
                //$.unblockUI();
                $('.bot_loading').hide();

            },
            success: function(response){
                //$('.overlay').hide();
                //$.unblockUI();
                $('.bot_loading').hide();
                if(response.error == 0){
                    if(response.data.estimator_details_html){
                        $('#estimatorContent').html(response.data.estimator_details_html);
                        $("#estimatorContent").find('script').remove();
                    }

                    //$.growl.notice({title: "Property Bot ", message: response.msg, size: 'large'});
                }else{
                    /*window.setTimeout(function () {
                        $.growl.error({title: "Property Bot ", message: response.msg, size: 'large'});
                    }, 2000);*/
                    console.log("on submit"+response.msg);
                }
            }
        });
    }
}
function show_thumb_image(img_src,el){
    var src = $(el).find('img').attr('src');
    $('#popupThumbImg').attr('src', src);
    $('#lightbox').modal('show');
}
function make_map(address){
    $.ajax({
        url: '/get-latitude-longitude/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {address: address},
        beforeSend: function () {
        },
        complete: function () {
        },
        success: function(response){
            /*console.log("ajax call");
            console.log(response.latitude);
            console.log(response.longitude);*/
            initializeGMap(response.latitude,response.longitude);
        }
    });
}
function map_address_blur(el){

    console.log("blur called");
        var address = $(el).val();
        if(address != ""){
            make_map(address);
        }
}
function submit_radio_answer(el,ans){
    console.log(ans);
    var question_id = $(el).data('question');
        /*var answer = '';
        $('input[name=user_radio_answer]').each(function () {
            if($(this).is(':checked') === true){
                answer = $(this).data('option-id');
                console.log(answer);
            }
        });*/
        var answer = ans;

        var counter_id = $(el).closest('li').attr('id');
        var section_id = $(el).closest('ul.bot-chat').attr('id');
        var total_remains = $(el).closest('ul.bot-chat').data('total-unanswered');

        var counter_arr = counter_id.split("_");
        var counter = counter_arr[1];
        if(question_id !="" && answer != ""){
                $.ajax({
                    url: '/save-estimator-answer/',
                    type: 'post',
                    dataType: 'json',
                    cache: false,
                    data: {question_id: question_id, answer: answer, counter_id: counter_id, counter: counter, section_id: section_id, total_remains: total_remains},
                    beforeSend: function () {
                        /*$.blockUI({
                            message: '<h4>...</h4>'
                        });*/
                        $('.bot_loading').show();
                    },
                    complete: function () {
                        //$.unblockUI();
                        $('.bot_loading').hide();

                    },
                    success: function(response){
                        //$('.overlay').hide();
                        $('.bot_loading').hide();
                        if(response.error == 0){
                            if(response.data.estimator_details_html){
                                $('#estimatorContent').html(response.data.estimator_details_html);
                                $("#estimatorContent").find('script').remove();
                            }
                            if(response.data.scroll_top){
                                $(window).scrollTop(100);
                            }

                            //$.growl.notice({title: "Property Bot ", message: response.msg, size: 'large'});
                        }else{
                            console.log("from radio"+response.msg);
                        }
                    }
                });
            //}
        }

}
