$(document).ready(function(){
    var tour = new Tour({
      steps: [
        {
          element: "#bid_listing",
          title: "Insider Auction",
          content: "Access exclusive auction opportunities and keep track of bids on properties available to a select group of buyers.",
          placement: "top"
        },
        {
          element: ".logo",
          title: "Redirect",
          content: "Redirect",
          placement: "bottom",
          path: "/best-offers/"
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
