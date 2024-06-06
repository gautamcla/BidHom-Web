$(document).ready(function(){
    var tour = new Tour({
      steps: [
        {
          element: ".listing-map-area",
          title: "Map View",
          content: "Visualize property locations on a map. Understand the spatial distribution of properties and their proximity to amenities.",
          placement: "top"
        },
        {
          element: ".logo",
          title: "Redirect",
          content: "Redirect",
          placement: "bottom",
//          path: "/demo/my-bids/"
          path: "/demo/asset-details/?asset_type=classic"
        }
      ],
      onEnd: function(tour) {
        close_tour();
      },
      backdrop: true,
      storage: false
    });

//    tour.init();

//    if(is_first_login){
//        tour.restart();
//    }
if(parseInt(is_active_tour)){
    tour.restart();
}

});
