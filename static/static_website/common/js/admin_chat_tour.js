$(document).ready(function(){
    var tour = new Tour({
      steps: [
        {
          element: ".chat-top",
          title: "Chat Module",
          content: "Access and manage ongoing chats between users, agents, and other parties on the platform.",
          placement: "bottom"
        },
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
//    if(is_first_login){
//        tour.restart();
//    }
if(parseInt(is_active_tour)){
    tour.restart();
}


});
