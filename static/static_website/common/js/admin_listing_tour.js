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
//          element: ".property_setting",
//          title: "Property Setting",
//          content: "Configure settings related to property listings for accurate and effective display.",
//          placement: "bottom"
//        },
//        {
//          element: ".add_property",
//          title: "Add Property",
//          content: "Add new properties on the platform by providing property details and uploading engaging media.",
//          placement: "bottom"
//        },
        {
          element: ".logo_icon",
          title: "Redirect",
          content: "Redirect",
          placement: "bottom",
          path: "/demo/admin/listing-property-info/"
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
