// -------------------Contact Listing----------------------
function contactSearch(current_page=1){
        var search = $('#contact_search').val();
        var currpage = current_page;
        var page_size = $('#contact_us_num_record').val();
        var user_type = $('#contact_user_type').val();
        try{
            var uri = window.location.href.toString();
            if (uri.indexOf("?") > 0) {
                var clean_uri = uri.substring(0, uri.indexOf("?"));
                window.history.replaceState({}, document.title, clean_uri);
            }
        }catch(ex){
            //console.log(ex);
        }
        $.ajax({
            url: '/admin/contact-listing/',
            type: 'post',
            dataType: 'json',
            cache: false,
            data: {'search': search, 'page': currpage, 'page_size': page_size, 'user_type': user_type},
            beforeSend: function(){
                $('.overlay').show();
            },
            success: function(response){
                $('.overlay').hide();
                if(response.error == 0){
                    $('#contact_listing').empty();
                    $(".pagination").empty();
                    $("#contact_total").html(response.total);
                    $("#contact_listing").html(response.contact_listing_html);
                    $(".pagination").html(response.pagination_html);

                }else{
                    $('#contact_listing').html('<div class="block-item"><div class="item fullwidth"><p class="custom_error center mb0">No Data Found!</p></div></div>');
                }
                $(window).scrollTop(0);
            }
        });
    }


// -------------------Contact Detail----------------------
function contactDetail(contact_id){
        $("#message").text("")
        $.ajax({
            url: '/admin/contact-detail/',
            type: 'post',
            dataType: 'json',
            cache: false,
            data: {"contact_id": contact_id},
            beforeSend: function () {
                $.blockUI({
                    message: '<h4>Please wait!</h4>'
                });
            },
            complete: function () {
                $.unblockUI();
            },
            success: function(response){
                if(response.error == 0){
                    $("#message").text(response.message)
                    $('#contactDetailModal').modal('show');
                }else{
                    //console.log(response.msg);
                }
            }
        });
    }

//--------------------Pagination for contact us listing-----------------
$(document).on('click', '.page-item', function(){
            $(".page-item").removeClass("active");
            $(this).addClass("active");
});
$(document).on('keyup', '#contact_search', function(e){
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
                url: '/admin/contact-search-suggestion/',
                type: 'post',
                dataType: 'json',
                cache: false,
                data: {'search': search},
                beforeSend: function(){

                },
                success: function(response){
                    if(response.error == 0 && response.status == 200){
                        autocomplete("contact_search", response.suggestion_list);
                    }else{
                        closeAllSuggestions('autocomplete-items');
                    }
                }
            });
          }

  });

