$(document).ready(function(){
    var tour = new Tour({
      steps: [
        {
          element: "#registration_section",
          title: "Register to Bid",
          content: "Initiate your participation in the bidding process for the property, your registration is subject to approval by agents, and you will be notified once it's been approved.",
          placement: "bottom"
        },
        {
          element: ".logo",
          title: "Redirect",
          content: "Redirect",
          placement: "bottom",
          path: "/demo/my-bids/"
        }
      ],
      onEnd: function(tour) {
        close_tour();
      },
      backdrop: true,
      storage: false
    });

//    tour.init();


    if(parseInt(is_active_tour)){
        tour.restart();
    }

});
