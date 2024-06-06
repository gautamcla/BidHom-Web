function userBidSearch(current_page){
    var currpage = current_page;
    var recordPerpage = 10;
    if($('#user_id').val() != ""){
        user_id = $('#user_id').val();
    }
    $.ajax({
        url: '/admin/user-details/?user_id='+user_id,
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {perpage: recordPerpage, page: currpage, user_id: user_id},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            if(response.error == 0){
                $('#bid_listing').empty();
                $("#bid_listing").html(response.user_details_bid_html);
                $("#user_bid_listing_pagination_list").html(response.pagination_html);


            }else{
                $('#bid_listing').html('<div class="block-item"><div class="item fullwidth"><p class="custom_error center mb0">No Data Found!</p></div></div>');
            }
        }
    });
}


function propertyBidHistorySearch(property_id, current_page){
    $('#bidHistoryPropertyId').val(property_id);
    var currpage = current_page;
    $.ajax({
        url: '/admin/user-property-bid-history/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {'page': currpage, 'page_size': recordPerpage, 'property_id': property_id, 'register_user': $('#user_id').val()},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            $("#bidHistoryPaginationList").empty();
            $("#bidHistoryList").empty();
            $("#bidHistoryPropertyName").empty();
            $("#bidderHistoryBtnSection").empty();
            // $("#bidHistoryPropertyLink").attr("href", '/asset-details/?property_id='+property_id);
            if(response.property_image != ""){
                $("#bidHistoryPropertyImage").attr('src', response.property_image);
            }else {
                $("#bidHistoryPropertyImage").attr('src', '/static/admin/images/property-default-img.png');
            }
            if(response.property_address != ""){
                $('#bidHistoryPropertyName').html('<a href="/asset-details/?property_id='+property_id+'" id="bidHistoryPropertyLink" target="_blank">'+response.property_address+'</a> <span><i class="fas fa-map-marker-alt"></i> '+response.property_city+', '+response.property_state+' '+response.property_postal_code+'</span>');
            }
            if(response.auction_type){
                $('#bidHistoryAuctiontype').html(response.auction_type)
            }
            if(response.bid_increment){
                $('#bidHistoryBidIncrement').html('$' + response.bid_increment)
            }
            if(response.error == 0){
                $("#bidHistoryList").html(response.bid_history_html);
                $("#bidderHistoryBtnSection").html('<button type="button" class="btn btn-primary btn-sm pl20" onClick="exportBidHistory(\''+response.property_id+'\',\''+response.page+'\')"><i class="fas fa-file-export"></i> Export</button>');
                $("#bidHistoryPaginationList").html(response.pagination_html);
            }else{
                $('#bidHistoryList').html('<li class="text-center text-danger" style="width:100%;"><img src="static/theme-1/images/property-not-avail.png" class=" center mb0" /></li>');
                $("#bidderHistoryBtnSection").html('<button type="button" class="btn btn-primary btn-sm pl20"><i class="fas fa-file-export"></i> Export</button>');
                $("#bidHistoryPaginationList").hide();
            }
            $('#bidderrecordModal').modal('show');
        }
    });
}
function exportBidHistory(property_id,current_page){
    var d = new Date();
    var timezone = d.getTimezoneOffset();
    var url_string = window.location.href; //window.location.href
    var url = new URL(url_string);
    var register_user = url.searchParams.get("user_id");
    console.log(register_user);
    var currpage = current_page;
    var page_size = recordPerpage;

    window.location.href = '/admin/export-bid-history/?page='+currpage+'&page_size='+recordPerpage+'&property='+property_id+'&timezone='+timezone+'&register_user='+register_user;
}