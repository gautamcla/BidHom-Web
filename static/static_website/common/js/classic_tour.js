$(document).ready(function(){
    var tour = new Tour({
      steps: [
        {
          element: "#bid_listing",
          title: "Bid Listings",
          content: "Keep track of the properties you're bidding on. Place new bids and manage your bidding activities from this section.",
          placement: "top"
        },
        {
          element: ".logo",
          title: "Redirect",
          content: "Redirect",
          placement: "bottom",
//          path: "/demo/insider-bids/"
          path: "/demo/my-offers/"
        }
      ],
      onEnd: function(tour) {
        close_tour();
      },
      backdrop: true,
      storage: false
    });

//    tour.init();

//    $(".count").click(function() {
////      tour.restart();
//    });

//    if(is_first_login){
//        tour.restart();
//    }
if(parseInt(is_active_tour)){
    tour.restart();
}

});
