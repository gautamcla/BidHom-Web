$(document).ready(function(){
    var home_tour = new Tour({
      steps: [
        {
          element: "#our_listings",
          title: "Property Listing",
          content: "Browse through a variety of properties available for auction or sale. Filter and sort options are available to narrow down your search.",
          placement: "bottom"
        },
        {
          element: ".logo",
          title: "Redirect",
          content: "Redirect",
          placement: "bottom",
          path: "/demo/our-listing/"
        }
      ],
      onEnd: function(tour) {
        close_tour();
      },
      backdrop: true,
      storage: false
    });

    //home_tour.init();

//    if(is_first_login){
//        home_tour.restart();
//    }
    //home_tour.restart();


//    $('#tour_start_popup').modal('show');
    //$('#tour_start_popup').modal({backdrop: 'static', keyboard: false}, 'show');

  if(journey != 'front'){
      $('#tour_start_popup').modal({backdrop: 'static', keyboard: false}, 'show');
  }else{
      home_tour.restart();
  }

    $(document).on('click','#front_website',function(){
        $.ajax({
            url: '/demo/set-tour-session/',
            type: 'post',
            dataType: 'json',
            cache: false,
            beforeSend: function () {
                $('.overlay').show();
            },
            complete: function () {
            },
            success: function(response){
                $('.overlay').hide();
                if(response.error == 0){
                    $('#tour_start_popup').modal('hide');
                    home_tour.restart();
                }
             }
        });
    });

    $(document).on('click','#admin_section',function(){
        $.ajax({
            url: '/demo/set-tour-session/',
            type: 'post',
            dataType: 'json',
            cache: false,
            beforeSend: function () {
                $('.overlay').show();
            },
            complete: function () {
            },
            success: function(response){
                if(response.error == 0){
                    $('.overlay').hide();
                    window.location="/demo/admin/dashboard/"
                }
             }
        });
    });

});
