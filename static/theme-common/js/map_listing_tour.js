$(document).ready(function(){
    var tour = new Tour({
      steps: [
//        {
//          element: ".all_listing_map",
//          title: "All Listings",
//          content: "View all properties in one place. Use filters to refine search and find the properties that match your criteria.",
//          placement: "bottom"
//        },
//        {
//          element: ".auctions_listing_map",
//          title: "Auction Listings",
//          content: "Discover properties available for auction. Buyers can bid on desired properties and monitor the bidding process.",
//          placement: "bottom"
//        },
//        {
//          element: ".traditional_listing_map",
//          title: "Traditional Listings",
//          content: "Explore properties that can be purchased directly without going through an auction. Buyers can contact listing agents or owners for details.",
//          placement: "bottom"
//        },
//        {
//          element: ".new_listing_map",
//          title: "Newest Listings",
//          content: "View the latest properties added to the platform. Stay updated on new opportunities as they are listed.",
//          placement: "bottom"
//        },
//        {
//          element: ".recent_sold_listing_map",
//          title: "Recent Sold Listings",
//          content: "Review properties that have recently been sold or successfully auctioned. Gain insights into recent transactions.",
//          placement: "bottom"
//        },
        {
          element: ".listing-map-area",
          title: "Map View",
          content: "Visualize property locations on a map. Understand the spatial distribution of properties and their proximity to amenities.",
          placement: "top"
        },
        {
          element: ".logo",
          title: "Redirect",
          content: "Redirect",
          placement: "bottom",
          path: "/my-bids/"
        }
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
