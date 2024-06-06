$(document).ready(function(){
    var tour = new Tour({
      steps: [
        {
          element: "#business_first_name",
          title: "1st Step",
          content: "Enter first name.",
          placement: "bottom"
        },
        {
          element: "#business_last_name",
          title: "2nd Step",
          content: "Enter last name here.",
          placement: "bottom"
        },
        {
          element: "#business_mobile",
          title: "3rd Step",
          content: "Enter mobile number here.",
          placement: "bottom"
        },
        {
          element: "#business_email",
          title: "4th Step",
          content: "Enter email here.",
          placement: "bottom"
        },
        {
          element: "#uploadBusinessLogoImgFrm",
          title: "5th Step",
          content: "Upload Company logo here.",
          placement: "bottom"
        },
        {
          element: "#office_address_0",
          title: "6th Step",
          content: "Enter address here.",
          placement: "bottom"
        }
      ],
      backdrop: true,
      storage: false
    });

    tour.init();

    $("#startTourBtn").click(function() {
      tour.restart();
    });



});
