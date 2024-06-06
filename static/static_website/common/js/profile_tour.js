$(document).ready(function(){
    var tour = new Tour({
      steps: [
        {
          element: "#personal_info",
          title: "Personal Info",
          content: "Update your contact details and preferences to ensure a seamless experience on the platform.",
          placement: "top"
        },
        {
          element: "#change_password",
          title: "Change Password",
          content: "Enhance your account security by changing your password at regular intervals.",
          placement: "top"
        },
        {
          element: "#profile_pic",
          title: "Profile Picture",
          content: "Personalize your buyer account by uploading a profile picture.",
          placement: "bottom"
        },
        {
          element: ".logo",
          title: "Redirect",
          content: "Redirect",
          placement: "bottom",
//          path: "/my-bids/"
          path: "/demo/chat/"
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
//    $(".count").click(function() {
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
