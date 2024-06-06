$(document).ready(function(){
    var tour = new Tour({
      steps: [
        {
          element: "#agent_list",
          title: "Agent Listing",
          content: " Access and manage the list of registered agents, monitoring their activities on the platform.",
          placement: "top"
        },

//        {
//          element: "#add_broker_agent",
//          title: "Add Agent",
//          content: "Add new agents on the platform by providing their details and granting them access.",
//          placement: "bottom",
//
//        },
        {
          element: ".logo_icon",
          title: "Go to other page.",
          content: "Redirect",
          placement: "bottom",
          path: "/demo/admin/add-agent/"
        }
      ],
      onEnd: function(tour) {
        close_tour();
      },
      backdrop: true,
      storage: false
    });

//    tour.init();
//
//    $("#startTourBtn").click(function() {
////      tour.restart();
//    });
//    if(is_first_login){
//        tour.restart();
//    }
if(parseInt(is_active_tour)){
    tour.restart();
}
//tour.restart();


});
