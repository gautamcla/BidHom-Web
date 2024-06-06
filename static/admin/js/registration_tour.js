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
//        {
//          element: "#filter_bidder_status_chosen",
//          title: "Review Status",
//          content: "You can filter registration by review status.",
//          placement: "bottom"
//        },
//        {
//          element: "#bidder_num_record_chosen",
//          title: "Record Per Page",
//          content: "Set record per page.",
//          placement: "bottom"
//        },
//        {
//          element: "#first_row_registration",
//          title: "Action",
//          content: "Hover on three dot for edit and delete.",
//          placement: "bottom"
//        },
        {
          element: ".logo_icon",
          title: "Redirect",
          content: "Redirect",
          placement: "bottom",
          path: "/admin/property-estimator-list/"
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
