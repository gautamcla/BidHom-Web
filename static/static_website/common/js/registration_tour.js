$(document).ready(function(){
    var tour = new Tour({
      steps: [
        {
          element: "#all-list",
          title: "Property Registration",
          content: "Manage the registration process for bidders interested in property auctions.",
          placement: "top"
        },
        {
          element: ".property_type_filter",
          title: "Property Type",
          content: "Configure and manage property types for accurate categorization and filtering.",
          placement: "bottom"
        },
        {
          element: ".logo_icon",
          title: "Redirect",
          content: "Redirect",
          placement: "bottom",
          path: "/demo/admin/property-estimator-list/"
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
//    }
if(parseInt(is_active_tour)){
    tour.restart();
}


});
