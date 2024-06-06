$(document).ready(function(){
    var tour = new Tour({
      steps: [
        {
          element: "#configuration_website",
          title: "Configure Website",
          content: "Customize the layout, theme, and settings of your admin dashboard to suit your preferences.",
          placement: "bottom"
        },
        {
          element: ".logo_icon",
          title: "Redirect",
          content: "Redirect",
          placement: "bottom",
          path: "/demo/admin/"
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
