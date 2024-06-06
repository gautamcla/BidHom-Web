$(document).ready(function(){
    try{
        $("#user_phone_no").inputmask('(999) 999-9999');
    }catch(ex){
        //console.log(ex);
    }

    $(document).on('keyup', '#blog_search', function(e){
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
                url: '/front-blog-search-suggestion/',
                type: 'post',
                dataType: 'json',
                data: {'search': search},
                beforeSend: function(){

                },
                success: function(response){
                    if(response.error == 0){
                        autocomplete("blog_search", response.suggestion_list);
                    }else{
                        closeAllSuggestions('autocomplete-items');
                    }
                }
            });
          }

  });

  $('#blogEnquiryFrm').validate({
        errorElement: 'p',
        rules: {
            user_first_name:{
                required: true,
                accept: true
            },
            user_phone_no:{
                required:true
            },
            usr_email:{
                required:true,
                email:true
            },
            user_message:{
                required: true
            }
        },
        messages: {
            user_first_name:{
                required: "First Name is required.",
                accept: "First Name is required."
            },
            user_phone_no:{
                required: "Phone no is required.",
                remote: "Phone no already in use."
            },
            usr_email:{
                required: "Email is required.",
                email: "Please Enter Valid Email Address."
            },
            user_message:{
                required: "Message is required."
            }
        },
        submitHandler:function(){
            var flag = true;

            if(flag == true){
                $.ajax({
                    url: '/save-enquiry/',
                    type: 'post',
                    dataType: 'json',
                    cache: false,
                    data: $('#blogEnquiryFrm').serialize(),
                    beforeSend: function(){
                        $('.overlay').show();
                    },
                    success: function(response){
                        $('.overlay').hide();
                        if(response.error == 0){
                            try{
                                $('#blogEnquiryFrm #user_first_name').val('');
                                $('#blogEnquiryFrm #usr_email').val('');
                                $('#blogEnquiryFrm #user_message').val('');
                                $('#blogEnquiryFrm #user_phone_no').val('');
                            }catch(ex){
                               // console.log(ex);
                            }

                            window.setTimeout(function () {
                                $.growl.notice({title: "Enquiry ", message: response.msg, size: 'large'});
                            }, 2000);

                        }else{
                            window.setTimeout(function () {
                                $.growl.error({title: "Enquiry ", message: response.msg, size: 'large'});
                            }, 2000);
                        }
                    }
                });
            }

        }
    });
});
function blogListingSearch(current_page,category_id){
    var search = $('#blog_search').val();
    var sort = $('#blog_datesort').val();
    var currpage = current_page;
    var page_size = $('#blog_num_record').val();
    var sort_column = 'publish_date_asc';
    if(typeof($('#blog_datesort').val()) != 'undefined' && $('#blog_datesort').val() != ""){
        sort_column = $('#blog_datesort').val();
    }
    var category = '';
    if(typeof(category_id) != 'undefined' && category_id != ""){
        category = category_id;
    }

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
        url: '/blogs/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {'search': search, 'page': currpage, 'page_size': page_size, 'sort_column': sort_column, 'category_id': category},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            $(window).scrollTop(0);
            if(response.error == 0){
                $(".ttl_blog").hide();
                $('#blog_list').empty();
                $("#blog_listing_pagination_list").empty();
                //$("#blog_sidebar").empty();
                if(response.total && parseInt(response.total) > 0){
                    var ttl = response.total.toString();
                    var blog_ttl_html = ttl+ ' Search results';

                    $(".ttl_blog").html(blog_ttl_html);
                    $(".ttl_blog").show();
                }

                $("#blog_list").html(response.blog_listing_html);
                $("#blog_listing_pagination_list").html(response.pagination_html);
                //$("#blog_sidebar").html(response.blog_sidebar_html);
            }else{
                $('#blog_list').html('<li class="text-center text-danger" style="width:100%;"><img src="static/theme-1/images/property-not-avail.png" class=" center mb0" /></li>');
                $("#blog_listing_pagination_list").hide();
            }
        }
    });
}