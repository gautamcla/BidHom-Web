$(document).ready(function(){
    var tour = new Tour({
      steps: [
        {
          element: "#property_list",
          title: "Property Listing",
          content: "Access and manage a comprehensive list of all properties available on the platform.",
          placement: "top"
        },
//        {
//          element: "#filter_agent_chosen",
//          title: "Agent Filter",
//          content: "You can filter property by agent.",
//          placement: "bottom"
//        },
//        {
//          element: "#filter_auction_type_chosen",
//          title: "Auction Type",
//          content: "You can filter property by auction type.",
//          placement: "bottom"
//        },
//        {
//          element: "#filter_asset_type_chosen",
//          title: "Asset Type",
//          content: "You can filter property by asset type.",
//          placement: "bottom"
//        },
//        {
//          element: "#prop_filter_status_chosen",
//          title: "Property Status",
//          content: "You can filter property by status.",
//          placement: "bottom"
//        },
//        {
//          element: "#prop_num_record_chosen",
//          title: "Record Per Page",
//          content: "Set record per page.",
//          placement: "bottom"
//        },
        {
          element: ".property_setting",
          title: "Property Setting",
          content: "Configure settings related to property listings for accurate and effective display.",
          placement: "bottom"
        },
//        {
//          element: "#first_row_listing",
//          title: "Action",
//          content: "Hover here to show action.",
//          placement: "bottom"
//        },
        {
          element: ".add_property",
          title: "Add Property",
          content: "Add new properties on the platform by providing property details and uploading engaging media.",
          placement: "bottom"
        },
        {
          element: ".logo_icon",
          title: "Redirect",
          content: "Redirect",
          placement: "bottom",
          path: "/admin/listing-property-info/"
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
