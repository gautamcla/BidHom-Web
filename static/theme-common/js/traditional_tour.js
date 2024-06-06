$(document).ready(function(){
    var tour = new Tour({
      steps: [
        {
          element: "#offer_listing",
          title: "Traditional Sale",
          content: "Explore traditional sale options for a different buying experience.",
          placement: "top"
        },
        {
          element: ".logo",
          title: "Redirect",
          content: "Redirect",
          placement: "bottom",
          path: "/favourite-listings/"
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
