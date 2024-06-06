$(document).ready(function(){
    var tour = new Tour({
      steps: [
        {
          element: "#best_offer_listing",
          title: "Highest And Best Offer",
          content: "Checkout your most competitive bid when a property is seeking the highest and best offer.",
          placement: "top"
        },
        {
          element: ".logo",
          title: "Redirect",
          content: "Redirect",
          placement: "bottom",
          path: "/my-offers/"
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

if(parseInt(is_active_tour)){
    tour.restart();
}

});
