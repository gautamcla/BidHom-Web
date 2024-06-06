$(document).ready(function(){
    var tour = new Tour({
      steps: [
        {
          element: "#headingOne",
          title: "Homepage",
          content: "Manage the content and appearance of the main landing page to create an engaging user experience.",
          placement: "bottom"
        },
        {
          element: "#headingTwo",
          title: "Home About us",
          content: "Share “about information” to give users insights into your purpose and values.",
          placement: "bottom"
        },
        {
          element: "#headingThree",
          title: "Property Bot Setting",
          content: "Customize the behavior and responses of the Property Bot to enhance user assistance.",
          placement: "bottom"
        },
        {
          element: ".logo_icon",
          title: "Go to other page.",
          content: "Redirect",
          placement: "bottom",
          path: "/admin/users/"
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
