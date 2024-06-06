$(document).ready(function () {

    $.validator.addMethod("greaterThan",
    function(value, element, params) {

        if (!/Invalid|NaN/.test(new Date(value))) {
            return new Date(value) > new Date($(params).val());
        }

        return isNaN(value) && isNaN($(params).val()) ||
            (Number(value) > Number($(params).val()));
    }, 'Must be greater than {0}.');


    ajax_auction_list()

    // $('#site, #filter_auction_type, #filter_asset_type, #filter_property_type, #prop_filter_status, #prop_num_record, #filter_agent').selectize({
    //     create: false,
    //     sortField: 'text',
    // });

    $('.numbersOnly').keyup(function () { 
        this.value = this.value.replace(/[^0-9]/g,'');
        if (this.value > 9){
            
        }
    });

    $(document)
    .on("click", ".property-bid-incremennt-edit", function (e) {
        e.preventDefault();
        e.stopPropagation();
        property_id = $(this).attr("data-id");
        // take updated value from visible text
        bidIncrementValue = $('#bidIncText' + property_id + ' span').html().replaceAll(',','').replaceAll('$','')
        $('#bidIncremementValue' + property_id).val(bidIncrementValue)
        if (Number($('#bidIncremementValue' +property_id ).val())){
            $('#bidIncrementUpdate' + property_id ).prop('disabled', false)
        } else {
            $('#bidIncrementUpdate' + property_id ).prop('disabled', true)
        }
        $("#propertyIncBid" + property_id).show();
        $("#bidIncText" + property_id).hide();
    })

    .on("click", ".go-to-listing", function(e){
        e.preventDefault();
        e.stopPropagation();
        window.open($(this).attr('href'), '_blank')
    })

    .on("click", ".property-reserve-price-edit", function (e) {
        e.preventDefault();
        e.stopPropagation();
        property_id = $(this).attr("data-id");
        bidIncrementValue = $('#reservePriceText' + property_id + ' span').html().replaceAll(',','').replaceAll('$','')
        $('#reservePriceValue' + property_id).val(bidIncrementValue)
        $("#propertyReservePrice" + property_id).show();
        $("#reservePriceText" + property_id).hide();
    })

    .on("click", ".show-bid-text", function (e) {
        e.preventDefault();
        e.stopPropagation();
        property_id = $(this).attr("data-id");
        $("#propertyIncBid" + property_id).hide();
        $("#bidIncText" + property_id).show();
    })

    .on("click", ".show-reserve-price-text", function (e) {
        e.preventDefault();
        e.stopPropagation();
        property_id = $(this).attr("data-id");
        $("#propertyReservePrice" + property_id).hide();
        $("#reservePriceText" + property_id).show();
    })

    .on("keyup", "#prop_search", function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.key === "Enter" || e.keyCode === 13) {
            auctionListingSearch(1);
        }
    })

    // .on("click", ".bidder-record-modal", function () {
    //     listing_id = $(this).attr("data-id");
    //     $("#bidderrecordModal").modal("show");
    // })

    // .on("click", ".bidder-list-modal", function () {
    //     listing_id = $(this).attr("data-id");
    //     $("#bidderlistModal").modal("show");
    // })

    // .on("click", ".property-atchers-modal", function () {
    //     listing_id = $(this).attr("data-id");
    //     $("#propertywatcherModal").modal("show");
    // })

    .on("click", ".edit-auction-details", function (e) {
        e.preventDefault();
        e.stopPropagation();
        listing_id = $(this).attr("data-id");
        $('#editBidListingId').val(listing_id)
        start_date = $(this).attr('data-start-date')
        end_date = $(this).attr('data-end-date')
        $('#bidding_start_date').val(start_date)
        $('#bidding_end_date').val(end_date)
        convert_bidding_date('bidding_start_date');
        convert_bidding_date('bidding_end_date');
        enable_disable_edit_auction_button();
        validatorAucrtion.resetForm();
        $("#editbiddingModal").modal("show");
    })

    .on("click", "#emailAllBidders, #emailAllWatchers", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var emailFor = $(this).attr("data-email-for");
        // get for which users
        if(emailFor == 'watching'){
            $('.object-name-string').html('Watchers')
            var listing_id =$('#bidWatcherPropertyId').val()
            var domain = $('#bidWatcherDomainId').val()
        } else {
            $('.object-name-string').html('Bidders')
            var listing_id =$('#bidHistoryPropertyId').val()
            var domain = $('#bidHistoryDomainId').val()
        }
        $('#emailForObject').val(emailFor)
        $('#emailPropertyid').val(listing_id)
        $('#domainEmail').val(domain)
        enable_disable_email_all_button();
        $("#emailrecordModal").modal("show");
    })

    .on('input keyup change', '#virtual_bidding_start_date, #virtual_bidding_end_date', function() {
        enable_disable_edit_auction_button()
    })

    .on('input keyup change', '#subject, #message', function() {
        enable_disable_email_all_button()
    })

    .on('input keyup change', '.bid-increment-input', function() {
        listing_id = $(this).attr("data-id");
        if (Number($(this).val())){
            $('#bidIncrementUpdate' + listing_id ).prop('disabled', false)
        } else {
            $('#bidIncrementUpdate' + listing_id ).prop('disabled', true)
        }
    })

    .on("click", ".stop-auction-details", function (e) {
        e.preventDefault();
        e.stopPropagation();
        var listing_id = $(this).attr("data-id");
        var modalText = $(this).attr("data-text");
        $('#stopBidListingId').val(listing_id)
        $('#startStopModalText').html(modalText)
        $("#stopbiddingModal").modal("show");
    })

    .on("click", '#stopAuctionForm #stopAuctionSubmit', function(e){
        e.preventDefault();
        e.stopPropagation();
        var listing_id = $('#stopBidListingId').val();
        var auction_id = $('#auctionListing' + listing_id).attr('data-auction')
        var domain = $('#auctionListing' + listing_id).attr('data-domain')
        $.ajax({
            url: "/admin/start-stop-bid-auction/",
            type: "post",
            dataType: "json",
            cache: false,
            data: { listing_id: listing_id },
            beforeSend: function () {
                // $(".overlay").show();
                $('#stopAuctionSubmit').prop('disabled', true).html('Please wait...')
            },
            complete: function(){
                // $(".overlay").hide();
                $('#stopAuctionSubmit').prop('disabled', false).html('Save')
            },
            success: function (response) {
                if (response.error == 0 || response.status == 200) {
                    socket.emit("checkBid", {"user_id":user_id, "property_id": listing_id, "auction_id": auction_id, "domain_id": domain});
                    $("#stopbiddingModal").modal("hide");
                    if ($('#startStopAuctionIcon' + listing_id).hasClass('fa-play')) {
                        $('#startStopAuctionIcon' + listing_id).removeClass('fa-play').addClass('fa-circle')
                        $('#startStopAuctionTooltip' + listing_id).html('Stop Auction')
                        $('#stopAuctionDetails' + listing_id).attr('data-text', 'Stop Auction?')
                    } else {
                        $('#startStopAuctionIcon' + listing_id).addClass('fa-play').removeClass('fa-circle')
                        $('#startStopAuctionTooltip' + listing_id).html('Start Auction')
                        $('#stopAuctionDetails' + listing_id).attr('data-text', 'Start Auction?')
                    }
                    showAlert('Auction Status Updated Successfully', 0)
                } else {
                    $("#stopbiddingModal").modal("show");
                    showAlert(response.msg, 1)
                }
            }
        });
    })

    .on("click", '#editAuctionForm #editAuctionSubmit', function(e){
        e.preventDefault();
        e.stopPropagation();
        var listing_id = $('#editBidListingId').val();
        var auction_id = $('#auctionListing' + listing_id).attr('data-auction')
        var domain = $('#auctionListing' + listing_id).attr('data-domain')
        //  start and end date conversion
        var start_dates = $("#virtual_bidding_start_date").val();
        var end_dates = $("#virtual_bidding_end_date").val();
        if(start_dates && end_dates){
            // start date
            var actualStartDate = start_dates.split(" ");
            actualStartDate = actualStartDate[0] + ' ' + convert_to_24h(actualStartDate[1] + ' ' + actualStartDate[2]);
            var actualStartDateUtc = convert_to_utc_datetime_internal(actualStartDate, 'datetime');
            $("#bidding_start_date").val(actualStartDateUtc);
            $("#bidding_start_date_local").val(actualStartDate);

            // end date
            var actualEndDate = end_dates.split(" ");
            actualEndDate = actualEndDate[0] + ' ' + convert_to_24h(actualEndDate[1] + ' ' + actualEndDate[2]);
            var actualEndDateUtc = convert_to_utc_datetime_internal(actualEndDate, 'datetime');
            $("#bidding_end_date").val(actualEndDateUtc);
            $("#bidding_end_date_local").val(actualEndDate);
        } else {
            $("#bidding_start_date").val('');
            $("#bidding_start_date_local").val('');
            $("#bidding_end_date").val('');
            $("#bidding_end_date_local").val('');

        }

        if($('#editAuctionForm').valid()){
                console.log($('#editAuctionForm').valid())
                editAuctionSave(listing_id, auction_id, domain,  actualStartDateUtc, actualEndDateUtc)
        } else {
            return false
        }
    })

    .on("click", '#emailAllUsersForm #emailAllSubmit', function(e){
        e.preventDefault();
        var listing_id = $('#emailPropertyid').val()
            subject = $('#subject').val().trim()
            message = $('#message').val().trim()
            emailFor = $('#emailForObject').val()
            domain = $('#domainEmail').val()

        if(!subject || !message || !domain){
            return false;
        }

        $.ajax({
            url: "/admin/email-all-users/",
            type: "post",
            dataType: "json",
            cache: false,
            data: { listing_id: listing_id, subject: subject, message: message, email_for: emailFor, domain_id:domain },
            beforeSend: function () {
                // $(".overlay").show();
                $('#emailAllSubmit').prop('disabled', true).html('Please wait...')
            },
            complete: function(){
                // $(".overlay").hide();
                $('#emailAllSubmit').prop('disabled', false).html('Send')
            },
            success: function (response) {
                if (response.error == 0 || response.status == 200) {
                    $("#emailrecordModal").modal("hide");
                    $('#subject, #message').val('')
                    showAlert('Email Sent Successfully', 0)
                } else {
                    $("#emailrecordModal").modal("show");
                    showAlert(response.msg, 1)
                }
            }
        });
    })

    .on("click", ".listing-broker-info", function (e) {
        e.preventDefault();
        e.stopPropagation();
        listing_id = $(this).attr("data-id");
        // get owner data
        $('#propAgentName').html($(this).attr("data-first-name") + ' ' + $(this).attr("data-last-name"))
        $('#propAgentCompany').html($(this).attr("data-company"))
        $('#propAgentPhone').html($(this).attr("data-phone"))
        $('#propAgentEmail').html($(this).attr("data-email"))
        $("#propertybrokerModal").modal("show");
    })

    // .on('keyup', '#prop_search', function(e){
    //     var x = document.getElementById(this.id + "autocomplete-list");
    //     if (x) x = x.getElementsByTagName("div");
    //     if (e.keyCode == 40) {
    //         /*If the arrow DOWN key is pressed,
    //         increase the currentFocus variable:*/
    //         currentFocus++;
    //         /*and and make the current item more visible:*/
    //         addActive(x);
    //     } else if (e.keyCode == 38) { //up
    //         /*If the arrow UP key is pressed,
    //         decrease the currentFocus variable:*/
    //         currentFocus--;
    //         /*and and make the current item more visible:*/
    //         addActive(x);
    //     } else if (e.keyCode == 13) {
    //         /*If the ENTER key is pressed, prevent the form from being submitted,*/
    //         e.preventDefault();
    //         if (currentFocus > -1) {
    //             /*and simulate a click on the "active" item:*/
    //             if (x) x[currentFocus].click();
    //         }
    //     }else{
    //         var search = $(this).val();
    //         $.ajax({
    //             url: '/admin/auction-search-suggestion/',
    //             type: 'post',
    //             dataType: 'json',
    //             cache: false,
    //             data: {'search': search},
    //             success: function(response){
    //                 if(response.error == 0 && response.status == 200){
    //                     autocomplete("prop_search", response.suggestion_list);
    //                 }else{
    //                     closeAllSuggestions('autocomplete-items');
    //                 }
    //             }
    //         });
    //     }
    // })

    .on('click', '#reservePriceForm .reservepriceupdate', function(e){
        e.preventDefault();
        e.stopPropagation();
        var listing_id = $(this).attr("data-id");
        var auction_id = $('#auctionListing' + listing_id).attr('data-auction')
        var domain = $('#auctionListing' + listing_id).attr('data-domain')
        var newReservePrice = $('#reservePriceValue' + listing_id).val().trim().replaceAll(',','').replace('$','')
        if(!newReservePrice){
            return false;
        }
        $.ajax({
            url: "/admin/update-reserve-price/",
            type: "post",
            dataType: "json",
            cache: false,
            data: { listing_id: listing_id, new_price:newReservePrice },
            beforeSend: function () {
                // $(".overlay").show();
                $('#reservePriceUpdate'+ listing_id).prop('disabled', true)
            },
            complete: function(){
                // $(".overlay").hide();
                $('#reservePriceUpdate'+ listing_id).prop('disabled', false)
            },
            success: function (response) {
                if (response.error == 0 || response.status == 200) {
                    socket.emit("checkBid", {"user_id":user_id, "property_id": listing_id, "auction_id": auction_id, "domain_id": domain});
                    // change reserve text
                    $('#reservePriceText' + listing_id + ' span').html(numberWithCommas('$'+newReservePrice))
                    // hide reserve form and show updated reserve text
                    $("#propertyReservePrice" + listing_id).hide();
                    $("#reservePriceText" + listing_id).show();
                    showAlert('Reserve price Updated Successfully', 0)
                    
                } else {
                    showAlert(response.msg, 1)
                }
            }
        });
    })

    .on('click', '#bidIncremementForm .bidincrementupdate', function(e){
        e.preventDefault();
        e.stopPropagation();
        var listing_id = $(this).attr("data-id");
        var auction_id = $('#auctionListing' + listing_id).attr('data-auction')
        var domain = $('#auctionListing' + listing_id).attr('data-domain')
        var newBidIncrement = $('#bidIncremementValue' + listing_id).val()
        if(!newBidIncrement){
            return false;
        }
        $.ajax({
            url: "/admin/update-bid-increment/",
            type: "post",
            dataType: "json",
            cache: false,
            data: { listing_id: listing_id, new_price:newBidIncrement },
            beforeSend: function () {
                // $(".overlay").show();
                $('#bidIncrementUpdate'+ listing_id).prop('disabled', true)
            },
            complete: function(){
                // $(".overlay").hide();
                $('#bidIncrementUpdate'+ listing_id).prop('disabled', false)
            },
            success: function (response) {
                if (response.error == 0 || response.status == 200) {
                    socket.emit("checkBid", {"user_id":user_id, "property_id": listing_id, "auction_id": auction_id, "domain_id": domain});
                    // change bid incr. text
                    $('#bidIncText' + listing_id + ' span').html(numberWithCommas('$'+newBidIncrement))
                    // hide reserve form and show updated reserve text
                    $("#propertyIncBid" + property_id).hide();
                    $("#bidIncText" + property_id).show();
                    showAlert('Bid Increment Updated Successfully', 0)
                } else {
                    showAlert(response.msg, 1)
                }
            }
        });
    })

    .on('click', '.show-detailed-info', function(e){
        e.preventDefault();
        e.stopPropagation();
        listing_id = $(this).attr("data-id");
        element = $("#showDetailedinfoBidder" + listing_id)
        if (element.is(":visible")){
            element.hide(1000);
            $('#arrowPositionHighBidder' + listing_id).removeClass('fa-chevron-up').addClass('fa-chevron-down');
        } else{ 
            element.show(1000);
            $('#arrowPositionHighBidder' + listing_id).removeClass('fa-chevron-down').addClass('fa-chevron-up');
        }
    })

    .on('click', '.show-bidder-info', function(e){
        e.preventDefault();
        e.stopPropagation();
        user_id = $(this).attr("data-id");
        element = $("#showBidderinfoBidder" + user_id)
        if (element.is(":visible")){
            element.hide(1000);
            $('#arrowPositionBidder' + user_id).removeClass('fa-chevron-up').addClass('fa-chevron-down');
        } else{ 
            element.show(1000);
            $('#arrowPositionBidder' + user_id).removeClass('fa-chevron-down').addClass('fa-chevron-up');
        }
    })

    // .on('click', '.block-item', function(e){
    //     e.preventDefault();
    //     //  get property id
    //     var propertyId = Number($(this).data("property"));
    //     // check if have property id and new bids available to make it 
    //     if(!propertyId || !$(this).hasClass("focused-bid-row")) return false
    //     $.ajax({
    //         url: '/admin/new-bid-checked/',
    //         type: 'post',
    //         dataType: 'json',
    //         cache: false,
    //         data: {'property_id': propertyId},
    //         success: function(response){
    //             if(response.error != 0){
    //                 window.setTimeout(function () {
    //                     $.growl.error({title: "New Bid Read", message: response.msg, size: 'large'});
    //                 }, 0);
    //                 $('#auctionList').find(`[data-property='${propertyId}']`).addClass('focused-bid-row')
    //             }
    //         }        
    //     });
    // })

    .on("click", ".page-link", function(e) {
        var page_number = $(this).attr('data');
        var page_type = $(this).attr('data-type');
        var page_sub_type = $(this).attr('data-sub-type');

        if (page_type == "auction" && page_sub_type == "auction_list") {
            $("#page-auction-list").val(page_number);
            ajax_auction_list();
        }
        if (page_type == "bidHistoryPagination" && page_sub_type == "bidHistoryPaginationList") {
            propertyBidHistorySearch(e, $('#bidHistoryPropertyId').val(), page_number);
        }
        if (page_type == "bidderHistoryPagination" && page_sub_type == "bidderHistoryPaginationList") {
            propertyBidderListingSearch(e, $('#bidderHistoryPropertyId').val(), page_number);
        }
        if (page_type == "watcherHistoryPagination" && page_sub_type == "watcherHistoryPaginationList") {
            propertyWatcherListingSearch(e, $('#bidderHistoryPropertyId').val(), page_number);
        }
    })

    .on("change", "#filter_asset_type", function(e) {
        e.preventDefault();
        // prepare property sub type filter
        if (propertySubType.length > 0){
            // var getPreSubTypeSelected = $('#filter_property_type').val()
            // destroy selectize plugin
            // $('#filter_property_type')[0].selectize.destroy();
            // destroy all options except first default one
            $('#filter_property_type').find('option').not(':first').remove();
            var assetValue = $(this).val()
            // append all options if no selection made
            if (!assetValue){
                propertySubType.forEach(e => {
                    $('#filter_property_type').append(new Option(e.name, e.id));
                });
            } else { // filter subtypes only related to property type selected
                    propertySubType.forEach(e => {
                        if(Number(e.asset_id) == Number(assetValue)){
                            $('#filter_property_type').append(new Option(e.name, e.id));
                        }
                    });
                $('#filter_property_type').val('')
            }
            // $('#filter_property_type').selectize({
            //     create: false,
            //     sortField: 'text'
            // });

        }
        $("#page-auction-list").val(1);
        ajax_auction_list();

    })

    // on enter input key
    .on("keyup", "#search", function(e) {
        e.preventDefault();
        if (e.which == 13) {
            $("#page-auction-list").val(1);
            ajax_auction_list();
        }
    })
    // on submit search query
    .on("click", ".searchBtn", function(e) {
        e.preventDefault();
        $("#page-auction-list").val(1);
            ajax_auction_list();
    })

});


var validatorAucrtion = $('#editAuctionForm').validate({
    ignore: [],
    errorElement: 'p',
    rules:{
        bidding_start_date:{
            required: true
        },
        bidding_end_date: {
            required: true,
            greaterThan: function(){
                if ($('#bidding_end_date').val() != "") {
                    return "#bidding_start_date";
                } else {
                    return false;
                }
            }
        }
    },
    messages:{
        bidding_start_date:{
            required: "Start Date is required"
        },
        bidding_end_date: {
            required: "End Date is required",
            greaterThan: "Must be greater than bidding start date"
        }
    },
    errorPlacement: function(error, element) {
        if(element.hasClass('asset_type_radio')){
            error.insertAfter($('.asset_type_label').closest('.listing-type'));
        }else if(element.hasClass('select')){
            error.insertAfter(element.next('.chosen-container'));
        }else if(element.parent().hasClass('date')){
            error.insertAfter(element.parent());
        }else if(element.parent().hasClass('open_house_start')){
            error.insertAfter(element.parent());
        }else if(element.parent().hasClass('open_house_end')){
            error.insertAfter(element.parent());
        }else{
            error.insertAfter(element);
        }
    }
});
$("#editAuctionForm").validate();


function editAuctionSave(listing_id, auction_id, domain, actualStartDateUtc, actualEndDateUtc){
    $.ajax({
        url: "/admin/edit-auction/",
        type: "post",
        dataType: "json",
        cache: false,
        data: { listing_id: listing_id, start_date: actualStartDateUtc, end_date: actualEndDateUtc },
        beforeSend: function () {
            // $(".overlay").show();
            $('#editAuctionSubmit').prop('disabled', true).html('Please wait...')
        },
        complete: function(){
            // $(".overlay").hide();
            $('#editAuctionSubmit').prop('disabled', false).html('Update')
        },
        success: function (response) {
            if (response.error == 0 || response.status == 200) {
                socket.emit("checkBid", {"user_id":user_id, "property_id": listing_id, "auction_id": auction_id, "domain_id": domain});
                element = $('#editAuctionDetails' + listing_id)
                $(element).attr('data-start-date', actualStartDateUtc)
                $(element).attr('data-end-date', actualEndDateUtc)
                
                $("#editbiddingModal").modal("hide");
                showAlert('Auction Updated Successfully', 0)
            } else {
                $("#editbiddingModal").modal("show");
                showAlert(response.msg, 1)
            }
        }
    });
}


function filter_property_domain_agent(element, page) {
    $('#filter_agent').find('option').not(':first').remove();
    ajax_auction_list(page)
    var site = $(element).val();
    $.ajax({
        url: '/admin/load-active-domain-agents/',
        type: "post",
        dataType: "json",
        cache: false,
        data: {'site_id': site},
        success: function (response) {
            // destroy selectize plugin
            // $('#filter_agent')[0].selectize.destroy();
            $("#filter_agent").html(
                '<option value="">Select Agent</option>'
            );
            if (response.error == 0) {
                $.each(response.data, function (i, item) {
                    console.log(item)
                $("#filter_agent").append(
                    '<option value="' + item.id + '">' + item.name + "</option>"
                );
            });
            }
            // $('#filter_agent').selectize({
            //     create: false,
            //     sortField: 'text'
            // });
        },
    });
  }


function filter_property_asset_type(element, page) {
  auctionListingSearch(page);
  $("#filter_property_type").empty();
  $("#filter_property_type").html(
    '<option value="">Select Property Type</option>'
  );
  $("#filter_property_type").trigger("chosen:updated");
  var asset_id = $(element).val();
  $.ajax({
    url: "/admin/get-property-types/",
    type: "post",
    dataType: "json",
    cache: false,
    data: { asset_id: asset_id },
    beforeSend: function () {},
    success: function (response) {
      if (response.error == 0) {
        $("#filter_property_type").empty();
        $("#filter_property_type").append(
          '<option value="">Select Property Type</option>'
        );
        $.each(response.property_type_listing, function (i, item) {
          $("#filter_property_type").append(
            '<option value="' + item.id + '">' + item.name + "</option>"
          );
        });
        $("#filter_property_type").trigger("chosen:updated");
      } else {
        $("#filter_property_type").empty();
        $("#filter_property_type").trigger("chosen:updated");
      }
    },
  });
}


function auctionListingSearch(current_page) {
    var search = $("#prop_search").val();
    var currpage = current_page;
    if ($("#prop_num_record").val() != "") {
        recordPerpage = $("#prop_num_record").val();
    }
    var status = $("#prop_filter_status").val();
    var asset_type = $("#filter_asset_type").val();
    var auction_type = $("#filter_auction_type").val();
    var property_type = $("#filter_property_type").val();
    var agent = $("#filter_agent").val();
    $.ajax({
        url: "/admin/auction-dashboard/",
        type: "post",
        dataType: "json",
        cache: false,
        data: {
            search: search,
            perpage: recordPerpage,
            status: status,
            asset_type: asset_type,
            auction_type: auction_type,
            page: currpage,
            property_type: property_type,
            agent: agent,
        },
        beforeSend: function () {
        $(".overlay").show();
        },
        success: function (response) {
        $(".overlay").hide();
        if (response.error == 0) {
            if ($("#prop_num_record").val() != "") {
            recordPerpage = $("#prop_num_record").val();
            }
            //var $perpageresult = getAllPageLinks('user_listing',currpage, recordPerpage, response.total_user, '', '', '');
            $("#auctionList").empty();
            $("#auctionList").html(response.property_auction_listings);
            $("#auctionList").find("script").remove();
            $("#prop_auction_pagination_list").html(response.pagination_html);
            $("#counter_num").val(response.sno);
        } else {
            $("#auctionList").html(
            '<div class="block-item"><div class="item fullwidth"><p class="custom_error center mb0">No Data Found!</p></div></div>'
            );
        }
        $(window).scrollTop(0);
        },
    });
}


function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}


function enable_disable_edit_auction_button(){
    var start_dates = $("#virtual_bidding_start_date").val();
    var end_dates = $("#virtual_bidding_end_date").val();
    if(start_dates && end_dates){
        $('#editAuctionSubmit').attr('disabled', false)
    } else {
        $('#editAuctionSubmit').attr('disabled', true)
    }
}

function enable_disable_email_all_button(){
    var subject = $("#subject").val().trim();
    var message = $("#message").val().trim();
    if(subject && message){
        $('#emailAllSubmit').attr('disabled', false)
    } else {
        $('#emailAllSubmit').attr('disabled', true)
    }
}


function convert_to_utc_datetime_internal(myTimeStamp,format){
    myTimeStamp = myTimeStamp.replaceAll('-','/')
    let dateX = new Date(myTimeStamp);
    let dateY = new Date();
    let date = new Date(dateX.getTime() + dateY.getTimezoneOffset() * 60000);

    let year = date.getFullYear();
    let mts = date.getMonth()+1;
    let month = (mts < 10)?'0'+mts:mts;
    let dt = (date.getDate() < 10)?'0'+date.getDate():date.getDate();
    let hrs = (date.getHours() < 10)?'0'+date.getHours():date.getHours();
    let mins = (date.getMinutes() < 10)?'0'+date.getMinutes():date.getMinutes();
    let secs = (date.getSeconds() < 10)?'0'+date.getSeconds():date.getSeconds();
    let timeStp = '';
    if(format =='ampm'){
        let mer = (hrs >= 12)?'PM':'AM';
        hrs = hrs % 12;
        hrs = (hrs)?hrs:12;
        //timeStp = month +"-"+dt+"-"+year+" at "+hrs+":"+mins+" "+mer;
        timeStp = year +"-"+month+"-"+dt+" "+hrs+":"+mins+" "+mer;
    }
    else{
        timeStp = year +"-"+month+"-"+dt+" "+hrs+":"+mins+":"+secs;
    }
    return timeStp;
}


function formatPhoneNumber(phoneNumberString) {
    var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/);
    if (match) {
        var intlCode = (match[1] ? '+1 ' : '');
        return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
    }
    return null;
}


function propertyBidHistorySearch(e, property_id, current_page){
    e.preventDefault();
    e.stopPropagation();
    // check if bids available
    var bidCount = parseInt($('#totalBidCount' + property_id).html())
    if(!bidCount > 0 && current_page == 1){
        return false
    }
    $('#bidHistoryPropertyId').val(property_id);
    $('#bidHistoryDomainId').val($('#auctionListing' +  property_id).attr('data-domain'))
    var currpage = current_page;
    $.ajax({
        url: '/admin/fetch-auction-bids/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {'page': currpage, 'property_id': property_id},
        beforeSend: function(){
            $(".loaderDiv").show();
        },
        success: function(response){
            $("#bidHistoryPaginationList").empty();
            $("#bidHistoryList").empty();
            $("#bidHistoryPropertyName").empty();
            $("#auction_bid_btn_section").empty();
            // $("#bidHistoryPropertyLink").attr("href", '/asset-details/?property_id='+property_id);
            if(response.property_image != ""){
                $("#bidHistoryPropertyImage").attr('src', response.property_image);
            }else {
                $("#bidHistoryPropertyImage").attr('src', '/static/admin/images/property-default-img.png');
            }
            if(response.property_address != ""){
                $('#bidHistoryPropertyName').html('<a href="/asset-details/?property_id='+property_id+'" id="bidHistoryPropertyLink" target="_blank">'+response.property_address+'</a> <span><i class="fas fa-map-marker-alt"></i> '+response.property_city+', '+response.property_state+' '+response.property_postal_code+'</span>');
            }
            if(response.error == 0){
                $("#bidHistoryList").html(response.bid_history_html);
                $("#bidHistoryPaginationList").html(response.pagination_html);
                $("#auction_bid_btn_section").html('<button type="button" class="btn btn-primary" onClick="exportAuctionBids(\''+response.property_id+'\',\''+response.page+'\')"><i class="fas fa-file-export"></i>&nbsp; Export</button> <button type="button" class="btn btn-primary" id="emailAllBidders" data-email-for="total_bids" ><i class="fas fa-envelope"></i>&nbsp; Email All</button>');

            }else{
                $('#bidHistoryList').html('<li class="text-center text-danger" style="width:100%;"><img src="static/admin/images/no-data-image.png" class=" center mb0" /></li>');
                $("#auction_bid_btn_section").html('<button type="button" class="btn btn-primary"><i class="fas fa-file-export"></i>&nbsp; Export</button> <button type="button" class="btn btn-primary" id="emailAllBidders" data-email-for="total_bids" ><i class="fas fa-envelope"></i>&nbsp; Email All</button>');

                $("#bidHistoryPaginationList").hide();
            }
            $('#bidderrecordModal').modal('show');
        },
        complete: function(){
            $(".loaderDiv").hide();
        },
    });
}


function propertyWatcherListingSearch(e, property_id, current_page){
    e.preventDefault();
    e.stopPropagation();
    // check if watchers available
    var watcherCount = parseInt($('#totalWatcherCount' + property_id).html())
    if(!watcherCount > 0 && current_page == 1){
        return false
    }
    $('#bidWatcherPropertyId').val(property_id);
    $('#bidWatcherDomainId').val($('#auctionListing' +  property_id).attr('data-domain'))
    var currpage = current_page;
    $.ajax({
        url: '/admin/fetch-auction-watchers/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {'page': currpage, 'property_id': property_id},
        beforeSend: function(){
            $(".loaderDiv").show();
        },
        success: function(response){
            $("#bidWatcherPaginationList").empty();
            $("#bidWatcherList").empty();
            $("#bidWatcherPropertyName").empty();
            $("#watcherBtnSection").empty();
            // $("#bidHistoryPropertyLink").attr("href", '/asset-details/?property_id='+property_id);
            if(response.property_image != ""){
                $("#bidWatcherPropertyImage").attr('src', response.property_image);
            }else {
                $("#bidWatcherPropertyImage").attr('src', '/static/admin/images/property-default-img.png');
            }
            if(response.property_address != ""){
                $('#bidWatcherPropertyName').html('<a href="/asset-details/?property_id='+property_id+'" id="bidWatcherPropertyLink" target="_blank">'+response.property_address+'</a> <span><i class="fas fa-map-marker-alt"></i> '+response.property_city+', '+response.property_state+' '+response.property_postal_code+'</span>');
            }
            $('#emailAllWatchers').hide()
            if(response.error == 0){
                $('#totalWatchersCount').html(response.total_watcher)
                $('#totalWatchersCountAnonm').html(response.no_anonymous_watcher)
                $("#bidWatcherList").html(response.watcher_history_html);
                $("#watcherBtnSection").html('<button type="button" class="btn btn-primary" onClick="exportWatcherList(\''+response.property_id+'\',\''+response.page+'\')"><i class="fas fa-file-export"></i>&nbsp; Export</button> <button type="button" class="btn btn-primary" id="emailAllWatchers" data-email-for="watching"><i class="fas fa-envelope"></i>&nbsp; Email All</button>');
                // hide send email button if no user found 
                if(response.total_watcher && response.total_watcher != response.no_anonymous_watcher ){
                    $('#emailAllWatchers').show()
                    $("#bidWatcherPaginationList").html(response.pagination_html);
                } 
            }else{
                $('#bidWatcherList').html('<li class="text-center text-danger" style="width:100%;"><img src="static/admin/images/no-data-image.png" class=" center mb0" /></li>');
                $("#watcherBtnSection").html('<button type="button" class="btn btn-primary"><i class="fas fa-file-export"></i>&nbsp; Export</button> <button type="button" class="btn btn-primary" id="emailAllWatchers" data-email-for="watching"><i class="fas fa-envelope"></i>&nbsp; Email All</button>');
                $("#bidWatcherPaginationList").hide();
            }
            $('#propertywatcherModal').modal('show');
        },
        complete: function(){
            $(".loaderDiv").hide();
        },
    });
}


function propertyBidderListingSearch(e, property_id, current_page){
    e.preventDefault();
    e.stopPropagation();
    // check if bidders available
    var bidderCount = parseInt($('#totalBidderCount' + property_id).html())
    if(!bidderCount > 0 && current_page == 1 ){
        return false
    }
    $('#bidderHistoryPropertyId').val(property_id);
    var currpage = current_page;
    $.ajax({
        url: '/admin/fetch-auction-bidders/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {'page': currpage, 'property_id': property_id},
        beforeSend: function(){
            $(".loaderDiv").show();
        },
        complete: function(){
            $(".loaderDiv").hide();
        },
        success: function(response){
            $("#bidderHistoryPaginationList").empty();
            $("#bidderHistoryList").empty();
            $("#bidderHistoryPropertyName").empty();
            $("#bidder_list_export_btn_section").empty();
            if(response.property_image != ""){
                $("#bidderHistoryPropertyImage").attr('src', response.property_image);
            }else {
                $("#bidderHistoryPropertyImage").attr('src', '/static/admin/images/property-default-img.png');
            }
            if(response.property_address != ""){
                $('#bidderHistoryPropertyName').html('<a href="/asset-details/?property_id='+property_id+'" id="bidderHistoryPropertyLink" target="_blank">'+response.property_address+'</a> <span><i class="fas fa-map-marker-alt"></i> '+response.property_city+', '+response.property_state+' '+response.property_postal_code+'</span>');
            }
            if(response.error == 0){
                $("#bidderHistoryList").html(response.bidder_history_html);
                $("#bidderHistoryPaginationList").html(response.pagination_html);
                $("#bidder_list_export_btn_section").html('<button type="button" class="btn btn-primary btn-sm pl20" onClick="exportBidderList(\''+response.property_id+'\',\''+response.page+'\')"><i class="fas fa-file-export"></i> Export</button>');

            }else{
                $('#bidderHistoryList').html('<li class="text-center text-danger" style="width:100%;"><img src="static/admin/images/no-data-image.png" class=" center mb0" /></li>');
                $("#bidder_list_export_btn_section").html('<button type="button" class="btn btn-primary btn-sm pl20"><i class="fas fa-file-export"></i> Export</button>');
                $("#bidderHistoryPaginationList").hide();
            }
            $('#bidderlistModal').modal('show');
        }
    });
}

function ajax_auction_list(page='') {
    if(!page){
        var page = $("#page-auction-list").val();
    }
    $.ajax({
        url: "/admin/ajax-auction-dashboard/",
        type: "POST",
        data: { 
            'page': page,
            'perpage': $('#prop_num_record').val(),
            'search': $("#search").val(),
            'domain_id': $('#site').val(),
            'auction_type': $('#filter_auction_type').val(), 
            'asset_type': $('#filter_asset_type').val(), 
            'property_type': $('#filter_property_type').val(),
            'status': $('#prop_filter_status').val(), 
            'agent': $('#filter_agent').val(), 
        },
        cache: false,
        beforeSend: function(){
            $(".loaderDiv").show();
        },
        success: function(data) {
            $("#span-ajax-auction-dashboard").html(data)
        },
        complete: function(jqXhr) {
            $(".loaderDiv").hide();
        }
    });
}


const convert_bidding_date = (element) => {
    try{
        value = $('#'+element).val();
        if(value != "" && value != "None"){
            console.log('in for ' + element)
            //var virtual_date = getLocalDate(value, 'yyyy-mm-dd','ampm');
            var virtual_date = getLocalDate(value, 'mm/dd/yyyy','ampm');
             //var actual_date = getLocalDate(value, 'yyyy-mm-dd', 'datetime');
             var actual_date = getLocalDate(value, 'mm/dd/yyyy', 'datetime');
             //var utc_date = convert_to_utc_datetime(value, 'datetime');
             var utc_date = convert_to_utc_date(value, 'mm/dd/yyyy', 'datetime');
             /*$('#'+element).val(utc_date);
            $('#'+element+'_local').val(actual_date);*/
            $('#virtual_'+element).val(virtual_date);
        }else{

            $('#virtual_'+element).val('');
        }
        $('#'+element).val('');
        $('#'+element+'_local').val('');

    }catch(ex){
        console.log(ex);
    }

}

function exportBidderList(property_id,current_page){
    var d = new Date();
    var timezone = d.getTimezoneOffset();
    var search = '';
    var status = '';
    if(typeof($('#popup_bidder_popup_search').val()) != 'undefined'){
        search = $('#popup_bidder_popup_search').val();
    }
    if(typeof($('option:selected','#popup_filter_bidder_status').val()) != 'undefined'){
        status = $('option:selected','#popup_filter_bidder_status').val();
    }
    var currpage = current_page;

    window.location.href = '/admin/export-auction-bidders/?page='+currpage+'&search='+search+'&property='+property_id+'&timezone='+timezone;
}
function exportAuctionBids(property_id,current_page){
    var d = new Date();
    var timezone = d.getTimezoneOffset();
    var currpage = current_page;

    window.location.href = '/admin/export-auction-bids/?page='+currpage+'&property='+property_id+'&timezone='+timezone;
}
function exportWatcherList(property_id,current_page){
    var d = new Date();
    var timezone = d.getTimezoneOffset();
    var currpage = current_page;

    window.location.href = '/admin/export-watchers/?page='+currpage+'&property='+property_id+'&timezone='+timezone;
}