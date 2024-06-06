var recordPerpage = 9;
$(document).ready(function(){
    $(document).on('click', '.del_prop_btn', function(){
           var row_id = $(this).attr('rel_id');
           if($(this).attr('id') == 'del_prop_true'){
                $('#favourite_listing #favourite_row_'+row_id).remove();
                $.ajax({
                    url: '/delete-favourite-listing/',
                    type: 'post',
                    dateType: 'json',
                    cache: false,
                    data: {'property': row_id},
                    beforeSend: function(){
                        $('.overlay').show();
                    },
                    success: function(response){
                        $('#del_prop_true').removeAttr('rel_id');
                        $('#del_prop_false').removeAttr('rel_id');
                        $('#confirmPropertyDeleteModal').modal('hide');
                        $('.id_column').each(function(index){
                            var i = index+1;
                            $(this).html(i);
                        });
                        if(response.error == 0){
                            //$('#agent_list').empty();
                            window.setTimeout(function () {
                                $.growl.notice({title: "Favorite Listings ", message: response.msg, size: 'large'});

                            }, 4000);
                            // reload list with start page
                            favouriteListingSearch(1)
                        }else{
                            $('.overlay').hide();
                            //$('#agent_list').empty();
                            $('#del_prop_true').removeAttr('rel_id');
                            $('#del_prop_false').removeAttr('rel_id');
                            $('#confirmPropertyDeleteModal').modal('hide');
                            window.setTimeout(function () {
                                $.growl.error({title: "Favorite Listings ", message: response.msg, size: 'large'});
                            }, 2000);

                        }
                    }
                });
           }else{
                $('#del_prop_true').removeAttr('rel_id');
                $('#del_prop_false').removeAttr('rel_id');
                $('.personalModalwrap').modal('hide');
                return false;
           }

    });
    $(document).on('click', '.page-item', function(){
        $(".page-item").removeClass("active");
        $(this).addClass("active");
    });
});
function fav_property_delete_confirmation(property_id){
  $('.personalModalwrap').modal('hide');
  $('#confirmPropertyDeleteModal').modal('show');
  $('.del_prop_btn').attr('rel_id', property_id);
}
function clear_favourite_search(){
    $('#favourite_search').val('');
    $('#favourite_num_record').val(10);
    $('#favourite_num_record').trigger("chosen:updated");
    favouriteListingSearch(1);
}
function favouriteListingSearch(current_page){
    var search = $('#favourite_search').val();
    var currpage = current_page;
    var page_size = $('#favourite_num_record').val();

    $.ajax({
        url: '/favourite-listings/',
        type: 'post',
        dateType: 'json',
        cache: false,
        data: {'search': search, 'page': currpage, 'page_size': page_size},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            if(response.error == 0){
                $('#favourite_listing').empty();
                $(".pagination").empty();
                $("#favourite_listing").html(response.favorite_listing_html);
                $("#fav_pagination_block").html(response.pagination_html);
            }else{
                $('#favourite_listing').html('<div class="block-item"><div class="item fullwidth"><p class="custom_error center mb0">No Data Found!</p></div></div>');
            }
        }
    });
}

function myBidListingSearch(current_page){
    //var search = $('#bid_search').val();
    var currpage = current_page;
    //var page_size = $('#bid_num_record').val();
    var page_size = 10;
//    var search = '';
    var currpage = current_page;
    $.ajax({
        url: '/my-bids/',
        type: 'post',
        dateType: 'json',
        cache: false,
        data: {'search': '', 'page': currpage, 'page_size': page_size},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            if(response.error == 0){
                $('#bid_listing').empty();
                $("#bid_pagination_block").empty();
                $("#bid_listing").html(response.bid_listing_html);
                $("#bid_pagination_block").html(response.pagination_html);
            }else{
                $('#bid_listing').html('<div class="block-item"><div class="item fullwidth"><p class="custom_error center mb0">No Data Found!</p></div></div>');
            }
            $('#bid_listing').find('script').remove();
            $(window).scrollTop(0);
        }
    });
}

function myInsiderBidListingSearch(current_page){
    //var search = $('#bid_search').val();
    var currpage = current_page;
    //var page_size = $('#bid_num_record').val();
    var page_size = 10;
//    var search = '';
    var currpage = current_page;
    $.ajax({
        url: '/insider-bids/',
        type: 'post',
        dateType: 'json',
        cache: false,
        data: {'search': '', 'page': currpage, 'page_size': page_size},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            if(response.error == 0){
                $('#bid_listing').empty();
                $("#bid_pagination_block").empty();
                $("#bid_listing").html(response.bid_listing_html);
                $("#bid_pagination_block").html(response.pagination_html);
            }else{
                $('#bid_listing').html('<div class="block-item"><div class="item fullwidth"><p class="custom_error center mb0">No Data Found!</p></div></div>');
            }
            $('#bid_listing').find('script').remove();
            $(window).scrollTop(0);
        }
    });
}



function propertyBidHistorySearch(property_id, current_page){
    $('#bidHistoryPropertyId').val(property_id);
    var currpage = current_page;
    $.ajax({
        url: '/buyer-bid-history/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {'page': currpage, 'page_size': recordPerpage, 'property_id': property_id},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            $("#bidHistoryPaginationList").empty();
            $("#bidHistoryList").empty();
            $("#bidHistoryPropertyName").empty();
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
            var property_id = $('#bidHistoryPropertyId').val();
            if(response.page && response.page_size){
                $('#export_bid_history').html('<div class="block"><button type="button" class="btn btn-primary btn-sm pl20" onclick="exportBidHistory(\''+property_id+'\',\''+response.page+'\',\''+response.page_size+'\')"><i class="fas fa-file-export"></i> Export</button></div>');
            }else{
                $('#export_bid_history').html('<div class="block"><button type="button" class="btn btn-primary btn-sm pl20" onclick="exportBidHistory(\''+property_id+'\',1,10)"><i class="fas fa-file-export"></i> Export</button></div>');
            }
            if(response.error == 0){
                $("#bidHistoryList").html(response.bid_history_html);
                $("#bidHistoryPaginationList").html(response.pagination_html);
            }else{
                $('#bidHistoryList').html('<li class="text-center text-danger" style="width:100%;"><img src="static/theme-1/images/property-not-avail.png" class=" center mb0" /></li>');
                $("#bidHistoryPaginationList").hide();
            }


            $('#bidderrecordModal').modal('show');
        },
        complete: function(){
            $('.overlay').hide();
        },
    });
}
function offerListingSearch(current_page){
    var search = '';
    var currpage = current_page;
    var page_size = 10;

    $.ajax({
        url: '/my-offers/',
        type: 'post',
        dateType: 'json',
        cache: false,
        data: {'search': search, 'page': currpage, 'page_size': page_size},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            if(response.error == 0){
                $('#offer_listing').empty();
                $(".pagination").empty();
                $("#offer_listing").html(response.offer_listing_html);
                $("#offer_pagination_block").html(response.pagination_html);
            }else{
                $('#offer_listing').html('<div class="block-item"><div class="item fullwidth"><p class="custom_error center mb0">No Data Found!</p></div></div>');
            }
            $('#offer_listing').find('script').remove();
        }
    });
}
function exportBidHistory(property_id,current_page,page_size){
    var d = new Date();
    var timezone = d.getTimezoneOffset();
    var search = $('#search_bid_history').val();

    window.location.href = '/export-bid-history/?page='+current_page+'&page_size='+page_size+'&search='+search+'&property='+property_id+'&timezone='+timezone;
}