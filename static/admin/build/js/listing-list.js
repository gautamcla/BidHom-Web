$(function() {
    // call listing list list once everything ready
    ajax_listing_list()

    $('select[multiple]').selectize(
        {
            plugins: ['remove_button'],
            delimiter: ',',
            persist: false,
            create: false,
        }
    );
    $('#prop_num_record').selectize({
        create: false,
        sortField: 'text'
    });

    $(document).on("click", ".page-link", function(e) {
        var page_number = $(this).attr('data');
        var page_type = $(this).attr('data-type');
        var page_sub_type = $(this).attr('data-sub-type');

        if (page_type == "listing") {
            if (page_sub_type == "listing_list") {
                $("#page-listing-list").val(page_number);
                ajax_listing_list();
            }
        }
    })
    // on enter input key
    .on("keyup", "#search", function(e) {
        e.preventDefault();
        if (e.which == 13) {
            $("#page-listing-list").val(1)
            ajax_listing_list();
        }
    })
    // on submit search query
    .on("click", ".searchBtn", function(e) {
        e.preventDefault();
        $("#page-listing-list").val(1)
            ajax_listing_list();
    })

    .on("change", "#auction_type, #prop_filter_status, #prop_num_record, #site, #asset_sub_type, #filter_agent", function(e) {
        e.preventDefault();
        $("#page-listing-list").val(1);
        // check if filter is domain then load agents
        if($(this).attr('id') == 'site'){
            filter_property_domain_agent()
        }
        ajax_listing_list();
    })

    .on("change", "#asset_type", function(e) {
        e.preventDefault();
        // prepare property sub type filter
        if (propertySubType.length > 0){
            var getPreSubTypeSelected = $('#asset_sub_type').val()
            // destroy selectize plugin
            $('#asset_sub_type')[0].selectize.destroy();
            // destroy all options except first default one
            $('#asset_sub_type').find('option').not(':first').remove();
            var assetValue = $(this).val()
            // append all options if no selection made
            if (assetValue == null){
                propertySubType.forEach(e => {
                    $('#asset_sub_type').append(new Option(e.name, e.id));
                });
            } else { // filter subtypes only related to property type selected
                assetValue.forEach(element => {
                    propertySubType.forEach(e => {
                        if(Number(e.asset_id) == Number(element)){
                            $('#asset_sub_type').append(new Option(e.name, e.id));
                        }
                    });
                });
                $('#asset_sub_type').val(getPreSubTypeSelected)
            }
            $('#asset_sub_type').selectize({
                plugins: ['remove_button'],
                delimiter: ',',
                persist: false,
                create: false,
            });

        }
        $("#page-listing-list").val(1);
        ajax_listing_list();
    })

    .on("click", ".searchBtnBidder", function(e) {
        e.preventDefault();
        $("#page-bidders-list").val(1);
        ajax_bidders_list($('#listingIdBidder').val());
    })

    .on("keyup", "#search-bidders", function(e) {
        e.preventDefault();
        if (e.which == 13) {
            $("#page-bidders-list").val(1);
            ajax_bidders_list($('#listingIdBidder').val());
        }
    })
    
    .on('click', '#close_offer_doc_popup,#close_offer_doc_popup_top', function(){
        $('#viewOfferDocumentModal').modal('hide');
        $('body').addClass('modal-open');
    })

    .on("click", ".searchBtnFavorite", function(e) {
        e.preventDefault();
        $("#page-favourites-list").val(1)
        ajax_favourite_list($('#listingIdFavorite').val());
    })

    .on("keyup", "#search-favourites", function(e) {
        e.preventDefault();
        if (e.which == 13) {
            $("#page-favourites-list").val(1)
            ajax_favourite_list($('#listingIdFavorite').val());
        }
    })


    .on("click", ".searchBtnBidHistory", function(e) {
        e.preventDefault();
        $("#page-bid-history").val(1)
        ajax_bid_history($('#listingIdBidHistory').val());
    })

    .on("keyup", "#search-bid-history", function(e) {
        e.preventDefault();
        if (e.which == 13) {
            $("#page-bid-history").val(1)
            ajax_bid_history($('#listingIdBidHistory').val());
        }
    })

    .on('click', '.delete-favourite', function(e){
        e.preventDefault()
        var favId = $(this).attr('data-id');
        $('#confirmDeleteFavourite #favourite_id').val(favId);
        $('#confirmDeleteFavourite').modal('show');
    })

    .on('click', '#del_fav_false', function(){
        $('#confirmDeleteFavourite #favourite_id').val('');
        $('#confirmDeleteFavourite').modal('hide');
    })

    .on('click', '#del_fav_true', function(){
        var fav_id= $('#confirmDeleteFavourite #favourite_id').val();
        delete_favurite(fav_id);
        $('#confirmDeleteFavourite').modal('hide');

    })


    .on("change", "#filter_data", function(e) {
        e.preventDefault();
        $("#page-bidders-list").val(1);
        ajax_bidders_list($('#listingIdBidder').val());
    })

    .on("click", ".page-link", function(e) {
        var page_number = $(this).attr('data');
        var page_type = $(this).attr('data-type');
        var page_sub_type = $(this).attr('data-sub-type');

        if (page_type == "bidders" && page_sub_type == "bidders_list") {
            $("#page-bidders-list").val(page_number);
            ajax_bidders_list($('#listingIdBidder').val());
        }
        if (page_type == "favourite" && page_sub_type == "favourite_list") {
            $("#page-favourites-list").val(page_number)
            ajax_favourite_list($('#listingIdFavorite').val());
        }
        if (page_type == "bid" && page_sub_type == "bid_history") {
            $("#page-bid-history").val(page_number);
            ajax_bid_history($('#listingIdBidHistory').val());
        }

        if (page_type == "insider_bid" && page_sub_type == "insider_bid_history") {
            $("#page-insider-bid").val(page_number);
            // identify step
            var step = 'dutch'
            if($('#round-2').hasClass( "current" )){
                step = 'sealed'
            }
            if($('#round-3').hasClass( "current" )){
                step = 'english'
            }
            propertyInsiderBidHistorySearch($('#insiderBidHistoryPropertyId').val(), page_number, step)

        }
    })

    .on('change','.listing_change_status', function(){
        var status_id = $('option:selected',this).val();
        var status_name = $('option:selected',this).text();
        var property_id = Number($(this).attr('data-property'));
        data = {property_id: property_id, status_id : status_id, status_name: status_name};
        $.ajax({
         url: '/admin/change-property-status/',
         type: 'post',
         dateType: 'json',
         cache: false,
         data: data,
         beforeSend: function(){
            $(".loaderDiv").show();
         },
         success: function(response){
            $(".loaderDiv").hide();
             if(response.error == 0){
                var property_id = response.property_id.toString();
                var status_id = response.status_id;
                var status_name = response.status_name;
                var btn_class='btn-warning';
                if(status_id == 5){
                     btn_class = 'btn-danger';
                }else if(status_id == 1){
                     btn_class = 'btn-success';
                }
                $('#change_status_'+property_id).hide();
                $('#statusText'+property_id).html('<i class="fa fa-edit"></i>' + status_name);
                $('#statusText'+property_id).removeClass('btn-success btn-success btn-warning').addClass(btn_class);
                $('#display_status_'+property_id).show();
                 showAlert(response.msg, 0)
             }else{
                showAlert(response.msg, 1)
             }
         }
     });
   })
   
   
   .on('change','.listing_change_approval', function(){
        var approval_id = $('option:selected',this).val();
        var approval_name = $('option:selected',this).text();
        var property_id = Number($(this).attr('data-property'));
        data = {property_id: property_id, approval_id : approval_id, approval_name: approval_name};
        $.ajax({
         url: '/admin/change-approval-status/',
         type: 'post',
         dateType: 'json',
         cache: false,
         data: data,
         beforeSend: function(){
            $(".loaderDiv").show();
         },
         success: function(response){
            $(".loaderDiv").hide();
             if(response.error == 0){
                var property_id = response.property_id.toString();
                var approval_id = response.approval_id;
                var approval_name = response.approval_name;
                var btn_class='btn-success';
                if(approval_id != 1){
                    btn_class = 'btn-warning';
                }
                $('#change_approval_'+property_id).hide();
                $('#approvalStatusText'+property_id).html('<i class="fa fa-edit"></i>' + approval_name);
                $('#approvalStatusText'+property_id).removeClass('btn-success btn-success btn-warning').addClass(btn_class);
                $('#approval_status_'+property_id).show();
                showAlert(response.msg, 0)
            }else{
                showAlert(response.msg, 1)
            }
         }
     });
   })

    .on('click', '.bidder-list', function(){
        listing_id = Number($(this).attr('data-id'))
       // identify offer/bids
        if(Number($(this).attr('data-sale-type')) == 4){
            propertyOfferListingSearch(listing_id)
        } else {
            // setup property image
            $('#bidderPropertyImage').attr('src', $('#propertyPic'+ listing_id + ' img' ).attr('src'))
            // setup listing name
            $('#bidderListingName').html($(this).attr('data-pname'))
            $('#bidderListingName').attr('href', $('#propertyLink' + listing_id).attr('href'));
            $('#bidderHistoryAuctiontype').html($(this).attr('data-auction-type'))
            $('#bidderHistoryBidIncrement').html($(this).attr('data-bid-increment'))
            $('#bidderListingAddress').html($(this).attr('data-location'))
            $("#page-bidders-list").val(1)
            $("#search-bidders").val('')
            $('#filter_data').val('')
            $('#listingIdBidder').val(listing_id)
            ajax_bidders_list(listing_id);
            $('.bidders-list-modal').modal('show')
        }
    })


   .on('click', '.favourite-list', function(){
    listing_id = Number($(this).attr('data-id'))
    // setup property image
    $('#favoritePropertyImage').attr('src', $('#propertyPic'+ listing_id + ' img' ).attr('src'))
    // setup listing name
    $('#favouriteListingName').html($(this).attr('data-pname'))
    $('#favouriteListingName').attr('href', $('#propertyLink' + listing_id).attr('href'));
    $('#favoriteHistoryAuctiontype').html($(this).attr('data-auction-type'))
    $('#favoriteHistoryBidIncrement').html($(this).attr('data-bid-increment'))
    $('#favouriteListingAddress').html($(this).attr('data-location'))
     $("#page-favourites-list").val(1)
     $("#search-favourites").val('')
     $('#listingIdFavorite').val(listing_id)
     ajax_favourite_list(listing_id);
     $('.favourite-list-modal').modal('show')
    })

    .on('click', '.bid-history', function(){
        listing_id = Number($(this).attr('data-id'))
        // setup property image
        $('#bidHistoryPropertyImage').attr('src', $('#propertyPic'+ listing_id + ' img' ).attr('src'))
        // setup listing name
        $('#bidHistoryListingName').html($(this).attr('data-pname'))
        $('#bidHistoryListingName').attr('href', $('#propertyLink' + listing_id).attr('href'));
        $('#bidHistoryAuctiontype').html($(this).attr('data-auction-type'))
        $('#bidHistoryBidIncrement').html($(this).attr('data-bid-increment'))
        $('#bidHistoryListingAddress').html($(this).attr('data-location'))
         $("#page-bid-history").val(1)
         $("#search-bid-history").val('')
         $('#listingIdBidHistory').val(listing_id)
         ajax_bid_history(listing_id);
         $('.bid-history-modal').modal('show')
    })

    .on('click', '.del_bidder_btn', function(){
        var row_id = $(this).attr('rel_id');
        if($(this).attr('id') == 'del_bidder_true'){
            $.ajax({
                url: '/admin/delete-bidder-reg/',
                type: 'post',
                dataType: 'json',
                cache: false,
                data: {'row_id': row_id},
                beforeSend: function(){
                    $(".loaderDiv").show();
                },
                success: function(response){
                    $(".loaderDiv").hide();
                    if(response.error == 0){
                        $('#confirmBidderDeleteModal').modal('hide');
                        try{
                            custom_response = {
                            'site_id': site_id,
                            'user_id': $('#confirmBidderDeleteModal #user_id').val(),
                            'property_id': $('#confirmBidderDeleteModal #property_id').val(),
                            'auction_id': $('#confirmBidderDeleteModal #auction_id').val(),
                        };
                            customCallBackFunc(update_bidder_socket, [custom_response]);
                        }catch(ex){
                            //console.log(ex);
                        }
                        showAlert('Deleted successfully', 0);
                        $("#page-bidders-list").val(1);
                        ajax_bidders_list($('#listingIdBidder').val());
                        // window.setTimeout(function () {
                        //     window.location.reload();
                        // }, 2000);
                    }else{
                        $('#confirmBidderDeleteModal').modal('hide');
                        showAlert("Bidder Registration", 1);
                    }
                }
            });
        }else{
            $('#confirmBidderDeleteModal #user_id').val('');
            $('#confirmBidderDeleteModal #auction_id').val('');
            $('#confirmBidderDeleteModal #property_id').val('');
            $('#del_bidder_true').removeAttr('rel_id');
            $('#del_bidder_false').removeAttr('rel_id');
            $('#confirmBidderDeleteModal').modal('hide');
            return false;
        }
    })

    .on('hidden.bs.modal',  '#viewMsgHistoryModal', function () { 
        $('body').addClass('modal-open') 
    })
});

function get_offer_documents(property_id,negotiated_id){
    $.ajax({
        url: '/admin/get-offer-doc-details/',
        type: 'post',
        dataType: 'json',
        data: {'property_id': property_id,'negotiated_id': negotiated_id},
        cache: false,
        beforeSend: function(){
            $(".loaderDiv").show();
        },
        success: function(response){
            $(".loaderDiv").hide();
            if(response.error == 0){
                if(response.doc_listing_html){
                    $('#offer_doc_list').html(response.doc_listing_html);
                }else{
                    $('#offer_doc_list').html('<li class="notiMenu">No Data found!</li>');
                }
                $('#offer_doc_list').find('script').remove();

            }else{
                $('#offer_doc_list').html('<li class="notiMenu">No Data found!</li>');
            }
            $('#viewOfferDocumentModal').modal('show');
        }
    });
}


function filter_property_domain_agent() {
    // destroy selectize plugin
    // $('#filter_agent')[0].selectize.destroy();
    // clear options
    $('#filter_agent').find('option').not(':first').remove();
    $.ajax({
        url: '/admin/load-active-domain-agents/',
        type: "post",
        dataType: "json",
        cache: false,
        data: {'site_id': $('#site').val()},
        success: function (response) {
            if (response.error == 0) {
                $.each(response.data, function (i, item) {
                $("#filter_agent").append(
                    '<option value="' + item.id + '">' + item.name + "</option>"
                );
            });

            // $('#filter_agent').selectize({
            //     plugins: ['remove_button'],
            //     delimiter: ',',
            //     persist: false,
            //     create: false,
            // });
            }
        },
    });
}



function propertyOfferListingSearch(property_id){
    $.ajax({
        url: '/admin/property-offer-list/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {'property_id': property_id},
        beforeSend: function(){
            $(".loaderDiv").show();
        },
        success: function(response){
            $(".loaderDiv").hide();
            $("#view_offer_list").empty();
            $("#offer_details").empty();
            if(response.error == 0){
                $("#view_offer_list").html(response.offer_history_html);
                $("#offer_details").html(response.offer_details_html);
            }else{
                $('#view_offer_list').html('<tr><td colspan="4"><img src="static/theme-1/images/property-not-avail.png" class=" center mb0" /></td></tr>');

            }
            try{
                $('.offer_checbox:first').prop('checked',true);
            }catch(ex){

            }

            $('#viewofferModal').modal('show');
        }
    });
}

function propertyOfferDetails(negotiated_id, el){

    $('.offer_checbox').prop('checked', false)
    $(el).prop('checked',true);
    $.ajax({
        url: '/admin/property-offer-details/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {'negotiated_id': negotiated_id},
        beforeSend: function(){
            $(".loaderDiv").show();
        },
        success: function(response){
            $(".loaderDiv").hide();
            $("#offer_details").empty();
            $("#offer_details").html(response.offer_details_html);
            $("#offer_details").find('script').remove();
        }
    });
}

function show_offer_message(msg){
    $('#viewMsgHistoryModal #user_msg').html(msg);
    $('#viewMsgHistoryModal').modal('show');
}

function ajax_listing_list() {
    var page = $("#page-listing-list").val();
    var search = $("#search").val();
    $(".loaderDiv").show();
    $.ajax({
        url: "/admin/ajax-listing-list/",
        type: "POST",
        data: { 
            'page': page,
            'search': search,
            'auction_id': $('#auction_type').val(), 
            'agent': $('#filter_agent').val(),
            'asset_id': $('#asset_type').val(), 
            'status': $('#prop_filter_status').val(), 
            'property_count': $('#prop_num_record').val(),
            'site_id': $('#site').val(),
            'asset_sub_type': $('#asset_sub_type').val()
        },
        cache: false,
        success: function(data) {
            $("#span-ajax-listing-list").html(data)
        },
        complete: function(jqXhr) {
            $(".loaderDiv").hide();
            // redirectLogin(jqXhr)
        }
    });
}

function ajax_bidders_list(listing_id='') {
    var page = $("#page-bidders-list").val();
    var search = $("#search-bidders").val();
    $(".loaderDiv").show();
    $.ajax({
        url: "/admin/ajax-bidders-list/",
        type: "POST",
        data: { 
            'page': page,
            'search': search,
            'status': $('#filter_data').val(), 
            'listing_id': listing_id
        },
        cache: false,
        success: function(data) {
            $("#bidder_list_export_btn_section").html('<button type="button" class="btn btn-primary" onClick="exportBidderList(\''+listing_id+'\',\''+page+'\')"><i class="fas fa-file-export"></i> Export</button>');
            $("#span-ajax-bidders-list").html(data)
            $('.bidders-list-modal').animate({ scrollTop: 0 }, 'slow');
        },
        complete: function(jqXhr) {
            $(".loaderDiv").hide();
            // redirectLogin(jqXhr)
        }
    });
}


function ajax_favourite_list(listing_id='') {
    var page = $("#page-favourite-list").val();
    var search = $("#search-favourites").val();
    $(".loaderDiv").show();
    $.ajax({
        url: "/admin/ajax-favourite-list/",
        type: "POST",
        data: { 
            'page': page,
            'search': search,
            'listing_id': listing_id,
        },
        cache: false,
        success: function(data) {
            $("#favorite_list_export_btn_section").html('<button type="button" class="btn btn-primary" onClick="exportFavoriteList(\''+listing_id+'\',\''+page+'\')"><i class="fas fa-file-export"></i> Export</button>');
            $("#span-ajax-favourite-list").html(data)
            $('.favourite-list-modal').animate({ scrollTop: 0 }, 'slow');
        },
        complete: function(jqXhr) {
            $(".loaderDiv").hide();
            // redirectLogin(jqXhr)
        }
    });
}


function ajax_bid_history(listing_id='') {
    var page = $("#page-bid-history").val();
    var search = $("#search-bid-history").val();
    $(".loaderDiv").show();
    $.ajax({
        url: "/admin/ajax-bid-history/",
        type: "POST",
        data: { 
            'page': page,
            'search': search,
            'listing_id': listing_id,
        },
        cache: false,
        success: function(data) {
            $("#bid_list_export_btn_section").html('<button type="button" class="btn btn-primary" onClick="exportBidList(\''+listing_id+'\',\''+page+'\')"><i class="fas fa-file-export"></i> Export</button>');
            $("#span-ajax-bid-history").html(data)
            $('.bid-history-modal').animate({ scrollTop: 0 }, 'slow');
        },
        complete: function(jqXhr) {
            $(".loaderDiv").hide();
        }
    });
}

function delete_favurite(id){
    $(".loaderDiv").show();
    $.ajax({
        url: "/admin/ajax-favourite-delete/",
        type: "POST",
        data: { "id": id},
        cache: false,
        success: function(data) {
            if(data.staus == 200 || data.error == 0){
                showAlert(data.msg, 0)
                // reload with ajax
                listing_id = $('#listingIdFavorite').val()
                ajax_favourite_list(listing_id);
                // totalCount = parseInt($('.favourite-list[data-id="'+ listing_id +'"]').attr('data-fcount'))
                // if (totalCount > 0){
                //     $('.favourite-list[data-id="'+ listing_id +'"]').html('<i class="fa fa-star"></i>' + totalCount - 1).attr('data-fcount', totalCount -1)
                // }
            } else {
                showAlert(data.msg, 1)
            }
        },
        complete: function(jqXhr) {
            $(".loaderDiv").hide();
        }
    });
}

function exportBidderList(property_id,current_page){
    var d = new Date();
    var timezone = d.getTimezoneOffset();
    var search = '';
    var status = '';
    if(typeof($('#search-bidders').val()) != 'undefined'){
        search = $('#search-bidders').val();
    }
    if(typeof($('option:selected','#filter_data').val()) != 'undefined'){
        status = $('option:selected','#filter_data').val();
    }

    var currpage = current_page;

    window.location.href = '/admin/export-bidder-list/?page='+currpage+'&search='+search+'&property='+property_id+'&timezone='+timezone+'&status='+status;
}

function exportBidList(property_id,current_page){
    var d = new Date();
    var timezone = d.getTimezoneOffset();
    var search = '';
    if(typeof($('#search-bid-history').val()) != 'undefined'){
        search = $('#search-bid-history').val();
    }
    window.location.href = '/admin/export-bid-list/?page='+current_page+'&search='+search+'&property='+property_id+'&timezone='+timezone;
}

function exportFavoriteList(property_id,current_page){
    var d = new Date();
    var timezone = d.getTimezoneOffset();
    var search = '';
    if(typeof($('#search-favourites').val()) != 'undefined'){
        search = $('#search-favourites').val();
    }
    window.location.href = '/admin/export-favorite-list/?page='+current_page+'&search='+search+'&property='+property_id+'&timezone='+timezone;
}

function exportInsiderBidHistory(property_id,current_page,step){
    var d = new Date();
    var timezone = d.getTimezoneOffset();
    var search = $('#insider_search_bid_history').val();
    var currpage = current_page;

    window.location.href = '/admin/export-insider-bid-history/?page='+currpage+'&search='+search+'&property='+property_id+'&timezone='+timezone+'&step='+step;
}


function bidder_delete_confirmation(row_id, auction_id='', property_id='', user_id,bid_count){
    if(parseInt(bid_count) > 0){
        showAlert("Can\'t Delete because buyer placed a bid", 1);
    }else{
        // $('.personalModalwrap').modal('hide');
        $('#confirmBidderDeleteModal #user_id').val(user_id);
        $('#confirmBidderDeleteModal #auction_id').val(auction_id);
        $('#confirmBidderDeleteModal #property_id').val(property_id);
        $('#confirmBidderDeleteModal').modal('show');
        $('.del_bidder_btn').attr('rel_id', row_id);
    }
}

function update_bidder_socket(response){
    socket.emit("checkBid", {"user_id": response.user_id, "property_id": response.property_id, "auction_id": response.auction_id, "domain_id": response.site_id});
}

function propertyInsiderBidHistorySearch(property_id, current_page, insider_step){
    $('#insiderBidHistoryPropertyId').val(property_id);
    var currpage = current_page;
    var search = $('#insider_search_bid_history').val();
    $.ajax({
        url: '/admin/insider-property-bid-history/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {'page': currpage, 'property_id': property_id, 'search': search, 'step': insider_step},
        beforeSend: function(){
            $(".loaderDiv").show();
        },
        success: function(response){
            $(".loaderDiv").hide();
            $("#insiderBidHistoryPaginationList").empty();
            $("#dutchBiddingList").empty();
            $("#sealedBiddingList").empty();
            $("#englishBiddingList").empty();
            $("#insiderBidHistoryPropertyName").empty();
            // $("#bidHistoryPropertyLink").attr("href", '/asset-details/?property_id='+property_id);
            if(response.property_image != ""){
                $("#insiderBidHistoryPropertyImage").attr('src', response.property_image);
            }else {
                $("#insiderBidHistoryPropertyImage").attr('src', '/static/admin/images/property-default-img.png');
            }
            if(response.property_address != ""){
                $('#insiderBidHistoryPropertyName').html('<a href="/asset-details/?property_id='+property_id+'" id="bidHistoryPropertyLink" target="_blank">'+response.property_address+'</a> <span><i class="fas fa-map-marker-alt"></i> '+response.property_city+', '+response.property_state+' '+response.property_postal_code+'</span>');
            }
            /*if(response.auction_type){
                $('#bidHistoryAuctiontype').html(response.auction_type)
            }
            if(response.bid_increment){
                $('#bidHistoryBidIncrement').html('$' + response.bid_increment)
            }*/
            $('#insider_tab_li_content').html('<li class="tab-link insider_tab_link" data-tab="round-1" id="insider_dutch_btn_li"><a href="javascript:void(0)" id="insider_dutch_btn" onclick="propertyInsiderBidHistorySearch(\''+response.property_id+'\',1,\'dutch\')">Round 1 : Dutch Auction</a></li><li class="tab-link insider_tab_link" data-tab="round-2" id="insider_sealed_btn_li"><a href="javascript:void(0)" id="insider_sealed_btn" onclick="propertyInsiderBidHistorySearch(\''+response.property_id+'\',1,\'sealed\')">Round 2 : Sealed Bid Amount</a></li><li class="tab-link insider_tab_link" data-tab="round-3" id="insider_english_btn_li"><a href="javascript:void(0)" id="insider_english_btn" onclick="propertyInsiderBidHistorySearch(\''+response.property_id+'\',1,\'english\')">Round 3 : English Auction</a></li>');
            if(response.error == 0){
                $('.insider_tab_link').removeClass('current');
                $('.insider_tab_content').removeClass('current');
                if(response.step == 'dutch'){
                    $("#insider_auction_name").html('Insider Dutch Auction');
                    $('#insider_dutch_btn_li').addClass('current');
                    $('#round-1').addClass('current');
                    $("#dutchBiddingList").html(response.bid_history_html);

                }else if(response.step == 'sealed'){
                    $("#insider_auction_name").html('Sealed Bid Auction');
                    $('#insider_sealed_btn_li').addClass('current');
                    $('#round-2').addClass('current');
                    $("#sealedBiddingList").html(response.bid_history_html);

                }else if(response.step == 'english'){
                    $("#insider_auction_name").html('English Auction');
                    $('#insider_english_btn_li').addClass('current');
                    $('#round-3').addClass('current');
                    $("#englishBiddingList").html(response.bid_history_html);

                }else{
                    $("#insider_auction_name").html('Insider Dutch Auction');
                    $('#insider_dutch_btn_li').addClass('current');
                    $('#round-1').addClass('current');
                    $("#dutchBiddingList").html(response.bid_history_html);

                }

                $("#insiderBidHistoryPaginationList").html(response.pagination_html);
            }else{
                $('.insider_tab_link').removeClass('current');
                $('.insider_tab_content').removeClass('current');
                if(response.step == 'dutch'){
                    $("#insider_auction_name").html('Insider Dutch Auction');
                    $('#insider_dutch_btn_li').addClass('current');
                    $('#round-1').addClass('current');
                    $('#dutchBiddingList').html('<div class="text-center text-danger" style="width:100%;"><img src="static/theme-1/images/property-not-avail.png" class=" center mb0" /></div>');
                }else if(response.step == 'sealed'){
                    $("#insider_auction_name").html('Sealed Bid Auction');
                    $('#insider_sealed_btn_li').addClass('current');
                    $('#round-2').addClass('current');
                    $('#sealedBiddingList').html('<div class="text-center text-danger" style="width:100%;"><img src="static/theme-1/images/property-not-avail.png" class=" center mb0" /></div>');
                }else if(response.step == 'english'){
                    $("#insider_auction_name").html('English Auction');
                    $('#insider_english_btn_li').addClass('current');
                    $('#round-3').addClass('current');
                    $('#englishBiddingList').html('<div class="text-center text-danger" style="width:100%;"><img src="static/theme-1/images/property-not-avail.png" class=" center mb0" /></div>');
                }else{
                    $("#insider_auction_name").html('Insider Dutch Auction');
                    $('#insider_dutch_btn_li').addClass('current');
                    $('#round-1').addClass('current');
                    $('#dutchBiddingList').html('<div class="text-center text-danger" style="width:100%;"><img src="static/theme-1/images/property-not-avail.png" class=" center mb0" /></div>');
                }

                $("#insiderBidHistoryPaginationList").hide();
            }
            var search_bid_history = $('#insider_search_bid_history').val();
            if(typeof(response.total) != 'undefined' && response.total){
                $('#insider_bid_history_search_section').html('<div class="block right"><form action="" class="search-field"><div class="search-icon"><i class="fas fa-search"></i></div><input type="text" name="insider_search_bid_history" id="insider_search_bid_history" class="form-control" value="'+search_bid_history+'"><button type="button" id="bid_history_search_btn" class="btn btn-gray btn-sm pl20" onclick="propertyInsiderBidHistorySearch(\''+response.property_id+'\',1,\''+response.step+'\')">Search</button></form></div><div class="block last"><button type="button" class="btn btn-primary btn-sm pl20" onClick="exportInsiderBidHistory(\''+response.property_id+'\',\''+response.page+'\',\''+response.step+'\')"><i class="fas fa-file-export"></i> Export</button></div><div class="clearfix"></div>');
            }else{
                $('#insider_bid_history_search_section').html('<div class="block right"><form action="" class="search-field"><div class="search-icon"><i class="fas fa-search"></i></div><input type="text" name="insider_search_bid_history" id="insider_search_bid_history" class="form-control" value="'+search_bid_history+'"><button type="button" id="bid_history_search_btn" class="btn btn-gray btn-sm pl20" onclick="propertyInsiderBidHistorySearch(\''+response.property_id+'\',1,\''+response.step+'\')">Search</button></form></div><div class="block last"><button type="button" class="btn btn-primary btn-sm pl20" onClick="exportInsiderBidHistory(\''+response.property_id+'\',\''+response.page+'\',\''+response.step+'\')"><i class="fas fa-file-export"></i> Export</button></div>');
            }
            $("#dutchBiddingList").find('script').remove();
            $("#sealedBiddingList").find('script').remove();
            $("#englishBiddingList").find('script').remove();
            $('#insiderbidderrecordModal').modal('show');
        }
    });
}