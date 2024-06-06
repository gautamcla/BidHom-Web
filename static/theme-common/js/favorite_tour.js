$(document).ready(function(){
    var tour = new Tour({
      steps: [
        {
          element: "#favourite_listing",
          title: "Favorite Listings",
          content: "Save properties you're interested in to easily access and track them from your dashboard.",
          placement: "top"
        },
//        {
//          element: "#favourite_num_record_chosen",
//          title: "Pagination",
//          content: "Set Record Per Page.",
//          placement: "bottom"
//        },
        {
          element: ".logo",
          title: "Redirect",
          content: "Redirect",
          placement: "bottom",
          //path: "/chat/"
          path: "/edit-profile/"
        }
      ],
      onEnd: function(tour) {
        close_tour();
      },
      backdrop: true,
      storage: false
    });

    tour.init();

    $(".count").click(function() {
//      tour.restart();
    });

    if(is_first_login){
        tour.restart();
    }

});
