$(document).ready(function(){
    var tour = new Tour({
      steps: [
        {
          element: "#headingTwo",
          title: "Create Property",
          content: "View and edit comprehensive information about specific properties.",
          placement: "top"
        },
        {
          element: ".logo_icon",
          title: "Go to other page.",
          content: "Redirect",
          placement: "bottom",
          path: "/admin/bidder-registration/"
        }
      ],
      onEnd: function(tour) {
        close_tour();
      },
      backdrop: true,
      storage: false
    });

    tour.init();

    $("#startTourBtn").click(function() {
//      tour.restart();
    });
    if(is_first_login){
        tour.restart();
    }


});
