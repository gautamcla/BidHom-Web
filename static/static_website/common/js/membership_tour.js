$(document).ready(function(){
    var tour = new Tour({
      steps: [
        {
          element: "#changePlanBtn",
          title: "1st Step",
          content: "Change plan from here.",
          placement: "bottom"
        },
        {
          element: ".btn-secondary",
          title: "2nd Step",
          content: "Change theme from here.",
          placement: "bottom"
        },
        {
          element: ".btn-primary",
          title: "3rd Step",
          content: "Cancel membership from here.",
          placement: "bottom"
        },
        {
          element: ".logo_icon",
          title: "4th Step",
          content: "Click <a href='/admin/website/'>here</a> for website page.",
          placement: "bottom"
        }
      ],
      backdrop: true,
      storage: false
    });

    tour.init();

if(parseInt(is_active_tour)){
    tour.restart();
}

});
