$(document).ready(function(){
    var tour = new Tour({
      steps: [
        {
          element: "#favourite_listing",
          title: "Favorite Listings",
          content: "Save properties you're interested in to easily access and track them from your dashboard.",
          placement: "top"
        },
        {
          element: ".logo",
          title: "Redirect",
          content: "Redirect",
          placement: "bottom",
          path: "/demo/chat/"
          //path: "/demo/edit-profile/"
        }
      ],
      onEnd: function(tour) {
        close_tour();
      },
      backdrop: true,
      storage: false
    });

//    tour.init();
//
//    $(".count").click(function() {
////      tour.restart();
//    });
//
//    if(is_first_login){
//        tour.restart();
//    }
if(parseInt(is_active_tour)){
    tour.restart();
}

});
