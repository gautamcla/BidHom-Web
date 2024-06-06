$(document).ready(function(){
    var tour = new Tour({
      steps: [
        {
          element: "#estimator_list",
          title: "Property Estimator",
          content: "Use the Property Estimator tool to assist in estimating property values based on various factors.",
          placement: "top"
        },
//        {
//          element: "#filter_type_chosen",
//          title: "Property Filter",
//          content: "Choose dropdown for filter.",
//          placement: "bottom"
//        },
//        {
//          element: "#estimator_num_record_chosen",
//          title: "Record Per Page",
//          content: "Set record per page.",
//          placement: "bottom"
//        },
        {
          element: ".logo_icon",
          title: "Redirect",
          content: "Redirect",
          placement: "bottom",
          path: "/admin/chat/"
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
    };


});
