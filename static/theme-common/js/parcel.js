function getresult(curr_page){
    search = $("#search").val();
    parcel_id = $("#parcel_id").val();
    perpage = $("#pagi").val();
    $.ajax({
        url: '/multiple-parcel/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {search: search, page: curr_page, "parcel_id": parcel_id, "perpage": perpage},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            if(response.error == 0){
                $('#property_list').empty();
                $('#prop_listing_pagination_list').empty();
                $('#property_list').html(response.listing_html);
                $("#prop_listing_pagination_list").html(response.pagination_html);
                $(window).scrollTop(0);
            }
        }
    });
}


