$(document).ready(function(){
    var tour = new Tour({
      steps: [
        {
          element: "#our_listings",
          title: "Property Listing",
          content: "Browse through a variety of properties available for auction or sale. Filter and sort options are available to narrow down your search.",
//          content: "You need to configure website.",
          placement: "bottom"
        },
        {
          element: ".logo",
          title: "Redirect",
          content: "Redirect",
          placement: "bottom",
          path: "/our-listing/"
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
