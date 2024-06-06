$(document).ready(function(){
    var tour = new Tour({
      steps: [
        {
          element: ".chat-top",
          title: "Chat Module",
          content: "Access and manage ongoing chats between users, agents, and other parties on the platform.",
          placement: "bottom"
        },
//        {
//          element: ".chat-rightbar",
//          title: "Chat",
//          content: "Individual chat.",
//          placement: "top"
//        },
//        {
//          element: "#filter_chat_chosen",
//          title: "Filter Dropdown",
//          content: "Choose dropdown for filter.",
//          placement: "bottom"
//        },
//        {
//          element: ".logo_icon",
//          title: "Redirect",
//          content: "Redirect",
//          placement: "bottom",
//          path: "/admin/chat/"
//        }
      ],
//      template: "<div class='popover tour'>"+
//        "<div class='arrow'></div>"+
//        "<h3 class='popover-title'></h3>"+
//        "<div class='popover-content'></div>"+
//        "<div class='popover-navigation'>"+
//            "<button class='btn' data-role='prev'>« Prev</button>"+
//            "<span data-role='separator'>|</span>"+
//            "<button class='btn' data-role='next'>Next »</button>"+
//            "<button class='btn' data-role='end'>End tour</button>"+
//        "</div>"+
//    "</div>",
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
