$(document).ready(function(){
    var tour = new Tour({
      steps: [
        {
          element: ".chat-top",
          title: "Chat Module",
          content: "Checkout your Communication with sellers, agents, and fellow buyers through the chat feature.",
          placement: "bottom"
        },
//        {
//          element: ".chat-rightbar",
//          title: "Chat Detail",
//          content: "Individual chat detail.",
//          placement: "top"
//        },
//        {
//          element: "#filter_chat_chosen",
//          title: "Filter",
//          content: "Chat filter.",
//          placement: "bottom"
//        },
      ],
      onEnd: function(tour) {
        close_tour();
      },
      backdrop: true,
      storage: false
    });

    tour.init();

    $(".count").click(function() {
//      tour.restart();
    });

    if(is_first_login){
        tour.restart();
    }

});
