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
$(function() {
    try{
        $.validator.addMethod("acceptcharacters", function (value, element)
        {
            return this.optional(element) || /^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-,.!_@ ])*$/.test(value);
        }, "Letters and spaces only please");


        $.validator.addMethod("numberpass",
            function(value, element, param) {
               if (!/[0-9]/.test(value)) {
                    return false;
                }
                return true;
        },"Include at least 1 number.");

        $.validator.addMethod("noSpace", function(value, element) {
            return value.indexOf(" ") < 0 && value != "";
        }, "No space please");
    }catch(ex){

    }
    var map = null;
      var myMarker;
      var myLatlng;
    // Trigger map resize event after modal shown
      $('#BotMapModal').on('shown.bs.modal', function() {
        google.maps.event.trigger(map, "resize");
        map.setCenter(myLatlng);
      });
    $(document).on("click", ".page-link", function(e) {
        var page_number = $(this).attr('data');
        var page_type = $(this).attr('data-type');
        var page_sub_type = $(this).attr('data-sub-type');

        if (page_type == "property_estimator") {
            if (page_sub_type == "property_estimator_list") {
                $("#page-estimator-list").val(page_number);
                ajax_estimate_list(page_number);
            }
        }
    });
    $(document).on('click', '#msg_true,#close_msg_pop', function(){
    $('#viewMsgHistoryModal #usr_msg').html('');
    $('#viewMsgHistoryModal').modal('hide');
    //$('body').addClass('modal-open');
  });

});
function ajax_estimate_list(page){
    var search = $("#estimator_search").val();;
    var domain_id = $('#domain_id').val();
    //var page = $("#page-estimator-list").val();
    $.ajax({
        url: '/admin/property-estimator-list/',
        type: 'post',
        dataType: 'json',
        data:{search: search, page: page, page_size: 20,domain_id: domain_id},
        cache: false,
        beforeSend: function(){
           $(".loaderDiv").show();
        },
        success: function(response){
            $(".loaderDiv").hide();
            if(response.error == 0){
                // set data sets
                $('#propertyEstimatorList').html(response.estimator_listing_html);
                $('#propertyEstimatorPagination').html(response.pagination_html);
            }else{
                $('#propertyEstimatorList').html('<tr><td class=" ">No Category available </td></tr>');
                $('#propertyEstimatorPagination').html('');
            }
            $("#propertyEstimatorList").find('script').remove();
        }
    });

}
function show_message(msg){
    var usr_msg = 'NA';
    if(msg){
        usr_msg = msg;
    }
    $('#viewMsgHistoryModal #usr_msg').html(usr_msg);
    $('#viewMsgHistoryModal').modal('show');
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
function show_thumb_image(img_src,el){
    var src = $(el).find('img').attr('src');
    $('#popupThumbImg').attr('src', src);
    $('#lightbox').modal('show');
}
function make_map(address){
    $.ajax({
        url: '/admin/get-latitude-longitude/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {address: address},
        beforeSend: function () {
        },
        complete: function () {
        },
        success: function(response){
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
        $('#BotMapModal').modal('show');
}
