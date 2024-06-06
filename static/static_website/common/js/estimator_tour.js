$(document).ready(function(){
    var tour = new Tour({
      steps: [
        {
          element: "#estimator_list",
          title: "Property Estimator",
          content: "Use the Property Estimator tool to assist in estimating property values based on various factors.",
          placement: "top"
        },
        {
          element: ".logo_icon",
          title: "Redirect",
          content: "Redirect",
          placement: "bottom",
          path: "/demo/admin/chat/"
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
//
//    if(is_first_login){
//        tour.restart();
//    };
if(parseInt(is_active_tour)){
    tour.restart();
}


});
