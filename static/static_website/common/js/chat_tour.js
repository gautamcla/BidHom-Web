$(document).ready(function(){
    var tour = new Tour({
      steps: [
        {
          element: ".chat-top",
          title: "Chat Module",
          content: "Checkout your Communication with sellers, agents, and fellow buyers through the chat feature.",
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

