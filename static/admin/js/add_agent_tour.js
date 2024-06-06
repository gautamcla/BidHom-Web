$(document).ready(function(){
    var tour = new Tour({
      steps: [
        {
          element: "#add_agent_form",
          title: "Add Agent",
          content: "View detailed information about specific agents, including their contact details and performance metrics.",
          placement: "top"
        },
        {
          element: ".logo_icon",
          title: "Go to other page.",
          content: "Redirect",
          placement: "bottom",
          path: "/admin/listing/"
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
