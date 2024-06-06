// -------------------Contact Listing----------------------
function scheduletourSearch(current_page=1){
    var search = $('#schedule_search').val();
    var currpage = current_page;
    var page_size = $('#schedule_num_record').val();
    $.ajax({
        url: '/admin/schedule-tour-list/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {'search': search, 'page': currpage, 'page_size': page_size},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            if(response.error == 0){
                $('#schedule_listing').empty();
                $(".pagination").empty();
                $("#schedule_listing").html(response.schedule_tour_listing_html);
                $(".pagination").html(response.pagination_html);
            }else{
                $('#schedule_listing').html('<div class="block-item"><div class="item fullwidth"><img src="/admin/images/no-data-image.png" class=" center mb0" /></div></div>');
            }
        }
    });
}


// -------------------Contact Detail----------------------
function msgDetail(msg){
    $("#message").text("");
    $("#message").text(msg)
    $('#scheduleToursModal').modal('show');
}

//--------------------Pagination for schedule tours listing-----------------
$(document).on('click', '.page-item', function(){
        $(".page-item").removeClass("active");
        $(this).addClass("active");
});


$(document).ready(function(){
    $(document).on('keypress', '#schedule_search', function(e){
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
          /*If the arrow DOWN key is pressed,
          increase the currentFocus variable:*/
          currentFocus++;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 38) { //up
          /*If the arrow UP key is pressed,
          decrease the currentFocus variable:*/
          currentFocus--;
          /*and and make the current item more visible:*/
          addActive(x);
        } else if (e.keyCode == 13) {
          /*If the ENTER key is pressed, prevent the form from being submitted,*/
          e.preventDefault();
          if (currentFocus > -1) {
            /*and simulate a click on the "active" item:*/
            if (x) x[currentFocus].click();
          }
        }else{
          var search = $(this).val();
          $.ajax({
              url: '/admin/schedule-search-suggestion/',
              type: 'post',
              dataType: 'json',
              cache: false,
              data: {'search': search},
              beforeSend: function(){

              },
              success: function(response){
                  if(response.error == 0 && response.status == 200){
                      autocomplete("schedule_search", response.suggestion_list);
                  }else{
                      closeAllSuggestions('autocomplete-items');
                  }
              }
          });
        }

    });
});
