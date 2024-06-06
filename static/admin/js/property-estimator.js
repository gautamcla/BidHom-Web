var currentFocus = -1;
var currpage = 1;
var recordPerpage = 10;
try{
    Dropzone.autoDiscover = false;
}catch(ex){
    //console.log(ex);
}
function initializeGMap(lat, lng) {

    myLatlng = new google.maps.LatLng(lat, lng);

    var myOptions = {
      zoom: 18,
      zoomControl: true,
      center: myLatlng,
      mapTypeId: 'satellite'
    };
    $('#arielView').html('');
    map = new google.maps.Map(document.getElementById("arielView"), myOptions);

    myMarker = new google.maps.Marker({
      position: myLatlng,
      draggable: true,
    });
    myMarker.setMap(map);

    google.maps.event.addListener(myMarker, 'dragend', function() {
        geocodePosition(myMarker.getPosition());
      });
      google.maps.event.addListener(myMarker, 'click', function() {
        if (myMarker.formatted_address) {
          infowindow.setContent(myMarker.formatted_address + "<br>coordinates: " + myMarker.getPosition().toUrlValue(6));
        } else {
          infowindow.setContent(address + "<br>coordinates: " + myMarker.getPosition().toUrlValue(6));
        }
        infowindow.open(map, myMarker);
      });
        $("#arielView").css("width", "100%");
  }
  function geocodePosition(pos) {
        var geocoder = new google.maps.Geocoder();
      geocoder.geocode({
        latLng: pos
      }, function(responses) {
        if (responses && responses.length > 0) {
          myMarker.formatted_address = responses[0].formatted_address;
          var latitude = responses[0].geometry.location.lat();
          var longitude = responses[0].geometry.location.lng();
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
    $(document).ready(function(){
    var map = null;
      var myMarker;
      var myLatlng;
        $(document).on('click', '.display_agent', function(){
            $(this).next().show();
            $(this).hide();
        });
        $(document).on('click', '.display_status', function(){
            $(this).next().show();
            $(this).hide();
        });
        /*$('#BotMapModal').on('show.bs.modal', function(event) {
        var button = $(event.relatedTarget);
        initializeGMap($('.location_map').data('lat'), $('.location_map').data('lng'));
        $("#arielView").css("width", "100%");
      });*/
      $(document).on('click', '#msg_true,#close_msg_pop', function(){
        $('#viewMsgHistoryModal #agent_comment').val('');
        $('#viewMsgHistoryModal #estimator_id').val('');
        $('#viewMsgHistoryModal').modal('hide');
        //$('body').addClass('modal-open');
      });
      $(document).on('blur', '#mapAnswer', function(){
        var address = $(this).val();
        if(address != ""){
            try {
              var geocoder = new google.maps.Geocoder();
              geocoder.geocode( { 'address': address}, function(results, status) {
                  if (status == google.maps.GeocoderStatus.OK) {
                    console.log(results[0]);
                    latitude = parseFloat(results[0].geometry.location.lat());
                    longitude = parseFloat(results[0].geometry.location.lng());
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
            initializeGMap(latitude.toFixed(13), longitude.toFixed(14));
            //initializeGMap(38.5623025229855, -121.36173534223504);
            /*myLatlng = new google.maps.LatLng(latitude, longitude);

            var myOptions = {
              zoom: 12,
              zoomControl: true,
              center: myLatlng,
              mapTypeId: 'satellite'
            };

            map = new google.maps.Map(document.getElementById("arielView"), myOptions);

            myMarker = new google.maps.Marker({
              position: myLatlng
            });
            myMarker.setMap(map);
            $("#arielView").css("width", "100%");*/
        }
      });

      // Trigger map resize event after modal shown
      $('#BotMapModal').on('shown.bs.modal', function() {
        google.maps.event.trigger(map, "resize");
        map.setCenter(myLatlng);
      });

      /*$(document).on('click', '.location_map', function(){
        var question_id = $(this).data('question');
        var answer = $(this).data('answer');
        var counter = $(this).data('counter');
        var counter_id = $(this).attr('id');
        var section = $(this).closest('.bot-chat').attr('id');
        var latitude = $('#latitude').val();
        var longitude = $('#longitude').val();
        $('#mapQuestion').val(question_id);
        $('#counterId').val(counter_id);
        $('#counter').val(counter);
        $('#section').val(section);
        $('#mapAnswer').val(answer);
        var address = $('#mapAnswer').val();
        var latitude = '';
        var longitude = '';
        try {
          var geocoder = new google.maps.Geocoder();
          geocoder.geocode( { 'address': $('#mapAnswer').val()}, function(results, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                latitude = results[0].geometry.location.lat();
                longitude = results[0].geometry.location.lng();
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
        }
        $('#BotMapModal').modal('show');
      });*/
    });
    function estimatorListingSearch(current_page){
        var search = $('#estimator_search').val();
        var currpage = current_page;
        if($('#estimator_num_record').val() != ""){
            recordPerpage = $('#estimator_num_record').val();
        }
        var status = '';
        $.ajax({
            url: '/admin/property-estimator-list/',
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
                    $('#estimator_list').empty();
                    $('#estimator_listing_pagination_list').empty();
                    if($('#estimator_num_record').val() != ""){
                        recordPerpage = $('#estimator_num_record').val();
                    }
                    //var $perpageresult = getAllPageLinks('user_listing',currpage, recordPerpage, response.total_user, '', '', '');

                    $("#estimator_list").html(response.estimator_listing_html);
                    $("#estimator_listing_pagination_list").html(response.pagination_html);


                }else{
                    $('#estimator_list').html('<div class="block-item"><div class="item fullwidth"><p class="custom_error center mb0">No Data Found!</p></div></div>');
                }
                $("#estimator_list").find('script').remove();
                $(window).scrollTop(0);
            }
        });
    }
    function agent_delete_confirmation(row_id){
      $('.personalModalwrap').modal('hide');
      $('#confirmAgentDeleteModal').modal('show');
      $('.del_agent_btn').attr('rel_id', row_id);
    }
    function change_estimator_agent(row_id,element){
        var assign_to_id = $('option:selected',element).val();
           var assign_to_name = $('option:selected',element).text();
           var estimator_id = row_id;
           data = {estimator_id: estimator_id, assign_to_id : assign_to_id, assign_to_name: assign_to_name};

           $.ajax({
            url: '/admin/estimator-assign-agent/',
            type: 'post',
            dataType: 'json',
            cache: false,
            data: data,
            beforeSend: function(){
                $('.overlay').show();
            },
            success: function(response){
                $('.overlay').hide();
                if(response.error == 0){
                    var estimator_id = response.estimator_id.toString();
                    var assign_to_id = response.assign_to_id;
                    var assign_to_name = response.assign_to_name;
                    /*var badge_class='badge-success';
                    if(status_id == 2 || status_id == 5){
                        badge_class = 'badge-danger';
                    }else if(status_id == 4 || status_id == 7){
                        badge_class = 'badge-warning';
                    }*/
                    $('#change_agent_'+estimator_id).hide();
                    $('#display_agent_'+estimator_id).html(''+assign_to_name+'').show();
                    window.setTimeout(function () {
                        $.growl.notice({title: "Property Estimator ", message: response.msg, size: 'large'});
                    }, 2000);
                }else{
                    window.setTimeout(function () {
                        $.growl.error({title: "Property Estimator ", message: response.msg, size: 'large'});
                    }, 2000);
                }
            }
        });
    }
   function filter_estimator_question_listing(element){
        var tab_id = $(element).attr('data-tab');
        $('ul.tabs li').removeClass('current');
        $('.tab-content').removeClass('current');
        if($(element).attr('data-tab') == 'property-detail-question-list'){
            $('#property_details').addClass('current');
            $("#"+tab_id).addClass('current');
        }else if($(element).attr('data-tab') == 'photo-document-question-list'){
            $('#photo_videos').addClass('current');
            $("#"+tab_id).addClass('current');
        }else if($(element).attr('data-tab') == 'additional-question-list'){
            $('#additional_detail').addClass('current');
            $("#"+tab_id).addClass('current');
        }else{
            $('#property_address').addClass('current');
            $("#"+tab_id).addClass('current');
        }
   }
   function change_estimator_status(row_id,element){
        var status_id = $('option:selected',element).val();
           var status_name = $('option:selected',element).text();
           var estimator_id = row_id;
           data = {estimator_id: estimator_id, status_id : status_id, status_name: status_name};

           $.ajax({
            url: '/admin/estimator-change-status/',
            type: 'post',
            dataType: 'json',
            cache: false,
            data: data,
            beforeSend: function(){
                $('.overlay').show();
            },
            success: function(response){
                $('.overlay').hide();
                if(response.error == 0){
                    var estimator_id = response.estimator_id.toString();
                    var status_id = response.status_id;
                    var status_name = response.status_name;
                    var badge_class='badge-success';
                    if(status_id == 2 || status_id == 5){
                        badge_class = 'badge-danger';
                    }else if(status_id == 4 || status_id == 7){
                        badge_class = 'badge-warning';
                    }
                    $('#change_status_'+estimator_id).hide();
                    $('#display_status_'+estimator_id).html('<span class="badge '+badge_class+'" style="cursor:pointer;">'+status_name+'</span>').show();
                    window.setTimeout(function () {
                        $.growl.notice({title: "Property Estimator ", message: response.msg, size: 'large'});
                    }, 2000);
                }else{
                    window.setTimeout(function () {
                        $.growl.error({title: "Property Estimator ", message: response.msg, size: 'large'});
                    }, 2000);
                }
            }
        });
    }
    function send_review_msg(){
           var message = $('#viewMsgHistoryModal #agent_comment').val();
           var valid_message = message.replace(/\s+/g, '');
           var estimator_id = $('#viewMsgHistoryModal #estimator_id').val();
           if(valid_message && estimator_id){
                $('#viewMsgHistoryModal #agent_comment_err').html('').hide();
                data = {estimator_id: estimator_id, message : message};
                   $.ajax({
                    url: '/admin/estimator-send-message/',
                    type: 'post',
                    dataType: 'json',
                    cache: false,
                    data: data,
                    beforeSend: function(){
                        $('.overlay').show();
                    },
                    success: function(response){
                        $('.overlay').hide();
                        $('#viewMsgHistoryModal').modal('hide');
                        if(response.error == 0){

                            window.setTimeout(function () {
                                $.growl.notice({title: "Property Estimator ", message: response.msg, size: 'large'});
                                window.location.reload();
                            }, 2000);
                        }else{
                            window.setTimeout(function () {
                                $.growl.error({title: "Property Estimator ", message: response.msg, size: 'large'});
                            }, 2000);
                        }
                    }
                });
           }else{
                $('#viewMsgHistoryModal #agent_comment_err').html('Message is required').show();
           }

    }
    function show_message(estimator_id, msg){
        $('#viewMsgHistoryModal #agent_comment_err').html('').hide();
        $('#viewMsgHistoryModal #agent_comment').val(msg);
        $('#viewMsgHistoryModal #estimator_id').val(estimator_id);
        /*if(msg){
            $('#viewMsgHistoryModal #send_msg').prop('disabled', true);
            $('#viewMsgHistoryModal #agent_comment').prop('disabled', true);
        }else{
            $('#viewMsgHistoryModal #send_msg').removeProp('disabled');
            $('#viewMsgHistoryModal #agent_comment').removeProp('disabled');
        }*/
        $('#viewMsgHistoryModal').modal('show');
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