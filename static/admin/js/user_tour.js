$(document).ready(function(){
    var tour = new Tour({
      steps: [
        {
          element: "#user_listing",
          title: "User Listing",
          content: " Access and manage a list of registered users on the platform, overseeing their accounts and activities.",
          placement: "top"
        },
//        {
//          element: "#user_filter_status_chosen",
//          title: "Status Filter",
//          content: "Set status filter here.",
//          placement: "bottom"
//        },
//        {
//          element: "#user_num_record_chosen",
//          title: "Set Page Size",
//          content: "Set page size here..",
//          placement: "bottom"
//        },
        {
          element: ".logo_icon",
          title: "Redirect.",
          content: "Redirect.",
          placement: "bottom",
          path: "/admin/agents/"
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
