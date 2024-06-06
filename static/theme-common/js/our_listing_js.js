var currentFocus = -1;
var currpage = 1;
var recordPerpage = 9;
var pre_active_listing = '#all-listing';
var pre_map_active_listing = '#all-listing-map';
$(document).ready(function(){
    $('#propertyEnquiryFrm').validate({
        errorElement: 'p',
        rules: {
            user_message:{
                required: true
            }
        },
        messages: {
            user_message:{
                required: "Message is required."
            }
        },
        submitHandler:function(){
            var flag = true;

            if(flag == true){
                $.ajax({
                    url: '/send-enquiry-message/',
                    type: 'post',
                    dataType: 'json',
                    cache: false,
                    data: $('#propertyEnquiryFrm').serialize(),
                    beforeSend: function(){
                        $('.overlay').show();
                    },
                    success: function(response){
                        $('.overlay').hide();
                        if(response.error == 0){
                            try{
                                $('#propertyEnquiryFrm #user_message').val('');


                            }catch(ex){
                               // console.log(ex);
                            }
                            $.growl.notice({title: "Enquiry ", message: response.msg, size: 'large'});
                            /*window.setTimeout(function () {
                                jQuery.noConflict();
                            $('#chatagentModal').modal('toggle');
                            }, 2000);*/
                            // clear documents
                            $('#chat_doc_id, #chat_doc_name').val('')
                            $('#bidderDocList').empty();


                        }else{
                            window.setTimeout(function () {
                                $.growl.error({title: "Enquiry ", message: response.msg, size: 'large'});
                            }, 2000);
                        }
                        $('#chatagentModal').modal('hide');
                    }
                });
            }

        }
    });

});
/*function getLocalDate(myTimeStamp, dateformat, timeformat){
    var dateX = new Date(myTimeStamp);
    var dateY = new Date();
    var date = '';
    if(myTimeStamp.includes('Z')){
        //if utc format
        date = new Date(dateX.getTime());
    }
    else{
        // for non utc format
        date = new Date(dateX.getTime() - dateY.getTimezoneOffset() * 60000);
    }
    var fullyear = date.getFullYear();
    var halfYear = parseInt(date.getFullYear().toString().substr(2,2), 10);
    var mts = date.getMonth()+1;
    var short_month_name = date.toLocaleString('default', { month: 'short' })
    var long_month_name = date.toLocaleString('default', { month: 'long' })
    var month_num = (mts < 10)?'0'+mts:mts;
    var dt = (date.getDate() < 10)?'0'+date.getDate():date.getDate();
    var hrs = (date.getHours() < 10)?'0'+date.getHours():date.getHours();
    var mins = (date.getMinutes() < 10)?'0'+date.getMinutes():date.getMinutes();
    var secs = (date.getSeconds() < 10)?'0'+date.getSeconds():date.getSeconds();
    var timeStp = '';
    if(dateformat == 'yyyy-mm-dd'){
        timeStp = fullyear+'-'+month_num+'-'+dt;
    }else if(dateformat == 'mm-dd-yyyy'){
        timeStp = month_num+'-'+dt+'-'+fullyear;
    }else if(dateformat == 'dd-mm-yyyy'){
        timeStp = dt+'-'+month_num+'-'+fullyear;
    }else if(dateformat == 'dd-mm-yy'){
        timeStp = dt+'-'+month_num+'-'+halfYear;
    }else if(dateformat == 'mm-dd-yy'){
        timeStp = month_num+'-'+dt+'-'+halfYear;
    }else if(dateformat == 'yy-mm-dd'){
        timeStp = halfYear+'-'+month_num+'-'+dt;
    }else if(dateformat == 'j m, Y'){
        timeStp = dt+' '+short_month_name+', '+fullyear;
    }else if(dateformat == 'm j, Y'){
        timeStp = short_month_name+', '+dt+' '+fullyear;
    }else if(dateformat == 'M j, Y'){
        timeStp = long_month_name+' '+dt+', '+fullyear;
    }else if(dateformat == 'j M, Y'){
        timeStp = dt+' '+long_month_name+', '+fullyear;
    }
    if(timeformat =='ampm'){
        var mer = (parseInt(hrs) >= 12)?'PM':'AM';
        hrs = parseInt(hrs) % 12;
        hrs = (hrs)?hrs:12;
        timeStpDate = timeStp+" "+hrs+":"+mins+" "+mer;
    }else{
        timeStpDate = timeStp+" "+hrs+":"+mins+":"+secs;
    }
    return timeStpDate;
}*/

function getresult(listing_type, currpage, search, sort_key, sort_val, filter_listing){
        if(listing_type == 'our_listing'){
            if(filter_listing == ''){
                filter_listing = $('#listing-tab').find('li.active').find('a').attr('href');
            }

            var search = $('#property_search_text').val();
            var agent_id = $('#agent_id').val();
            if($('#pagi').val() != ""){
                recordPerpage = $('#pagi').val();
            }
            //var filter = $('.listing_tab.active').find('a').attr('href');
            var filter = filter_listing;
            var listing_filter = '';
            if(filter == '#auctions-listing'){
                listing_filter = 'auctions_listing';
            }else if(filter == '#newlistings-listing'){
                listing_filter = 'new_listing';
            }else if(filter == '#traditional-listing'){
                listing_filter = 'traditional_listing';
            }else if(filter == '#recently-listing'){
                listing_filter = 'recent_sold_listing';
            }else if(filter == '#featured'){
                listing_filter = 'featured';
            }

            var filter_asset_type = $("#filter_asset_type").val();
            var filter_auction_type = $("#filter_auction_type").val();

            var sort_column = 'auction_start_date_asc';
            if(typeof($('#datesort').val()) != 'undefined' && $('#datesort').val() != ""){
                sort_column = $('#datesort').val();
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
                url: '/our-listing/',
                type: 'post',
                dataType: 'json',
                cache: false,
                data: {search: search, perpage: recordPerpage, page: currpage, listing_filter: listing_filter, sort_column: sort_column, agent_id: agent_id, filter_asset_type: filter_asset_type, filter_auction_type: filter_auction_type},
                beforeSend: function(){
                    $('.overlay').show();
                },
                success: function(response){
                    $('.overlay').hide();
                    if(response.error == 0){
                        $('#property_list').empty();
                        $('#prop_listing_pagination_list').empty();
                        $('#property_list').html(response.listing_html);
                        $('#property_list').find('script').remove();
                        /*if($('#prop_num_record').val() != ""){
                            recordPerpage = $('#prop_num_record').val();
                        }*/
                        if($('#pagi').val() != ""){
                            recordPerpage = $('#pagi').val();
                        }
                        $("#prop_listing_pagination_list").html(response.pagination_html);
                        /*if(response.listing_filter == '#auctions-listing'){
                            listing_filter = 'auctions_listing';
                        }else if(filter == '#newlistings-listing'){
                            listing_filter = 'new_listing';
                        }else if(filter == '#traditional-listing'){
                            listing_filter = 'traditional_listing';
                        }else if(filter == '#recently-listing'){
                            listing_filter = 'recent_sold_listing';
                        }*/

                        if(response.listing_filter == 'auctions_listing'){
                            pre_active_listing = '#auctions-listing';
                        }else if(response.listing_filter == 'new_listing'){
                            pre_active_listing = '#newlistings-listing';
                        }else if(response.listing_filter == 'traditional_listing'){
                            pre_active_listing = '#traditional-listing';
                        }else if(response.listing_filter == 'recent_sold_listing'){
                            pre_active_listing = '#recently-listing';
                        }else if(response.listing_filter == 'featured'){
                            pre_active_listing = '#featured';
                        }

                        // $('#pagi').chosen();
                        // $("#datesort").chosen();
                        $(window).scrollTop(0);
                        /*if(response.total > 0){
                            var show_page_txt = 'Showing page '+response.page+' of '+response.total;
                            $('#show_page_record').html(show_page_txt);
                        }*/

                    }
                }
            });
        }
    }

    function getresultfilter(listing_type, currpage, search, sort_key, sort_val, filter_listing){

        if(listing_type == 'our_listing'){
            if(filter_listing == ''){
                filter_listing = $('#listing-tab').find('li.active').find('a').attr('href');
            }

            var search = $('#property_search_text').val();
            var agent_id = $('#agent_id').val();
            if($('#pagi').val() != ""){
                recordPerpage = $('#pagi').val();
            }
            //var filter = $('.listing_tab.active').find('a').attr('href');
            var filter = filter_listing;
            var listing_filter = '';
            if(filter == '#auctions-listing'){
                listing_filter = 'auctions_listing';
            }else if(filter == '#newlistings-listing'){
                listing_filter = 'new_listing';
            }else if(filter == '#traditional-listing'){
                listing_filter = 'traditional_listing';
            }else if(filter == '#recently-listing'){
                listing_filter = 'recent_sold_listing';
            }else if(filter == '#featured'){
                listing_filter = 'featured';
            }

            var filter_asset_type = $("#filter_asset_type").val();
            var filter_property_type = $("#filter_property_type").val();
            var filter_auction_type = $("#filter_auction_type").val();
            var filter_beds = $("#filter_beds").val();
            var filter_baths = $("#filter_baths").val();
            var filter_mls_property = $("#filter_mls_property").val();
            var filter_min_price = $("#filter_min_price").val();
            var filter_max_price = $("#filter_max_price").val();
            if(filter_min_price && filter_max_price){
                if(parseInt(filter_min_price) >= parseInt(filter_max_price)){
                    alert("Max Value should br greater than min value.");
                    return false;
                }
            }

            var sort_column = 'auction_start_date_asc';
            if(typeof($('#datesort').val()) != 'undefined' && $('#datesort').val() != ""){
                sort_column = $('#datesort').val();
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
                url: '/our-listing/',
                type: 'post',
                dataType: 'json',
                cache: false,
                data: {search: search, perpage: recordPerpage, page: currpage, listing_filter: listing_filter, sort_column: sort_column, agent_id: agent_id, filter_asset_type: filter_asset_type, filter_property_type: filter_property_type, filter_auction_type: filter_auction_type, filter_beds: filter_beds, filter_baths: filter_baths, filter_mls_property: filter_mls_property, filter_min_price: filter_min_price, filter_max_price: filter_max_price},
                beforeSend: function(){
                    $('.overlay').show();
                },
                success: function(response){
                    $('.overlay').hide();
                    if(response.error == 0){
                        $('#property_list').empty();
                        $('#prop_listing_pagination_list').empty();
                        $('#property_list').html(response.listing_html);
                        $('#property_list').find('script').remove();
                        /*if($('#prop_num_record').val() != ""){
                            recordPerpage = $('#prop_num_record').val();
                        }*/
                        if($('#pagi').val() != ""){
                            recordPerpage = $('#pagi').val();
                        }
                        $("#prop_listing_pagination_list").html(response.pagination_html);
                        /*if(response.listing_filter == '#auctions-listing'){
                            listing_filter = 'auctions_listing';
                        }else if(filter == '#newlistings-listing'){
                            listing_filter = 'new_listing';
                        }else if(filter == '#traditional-listing'){
                            listing_filter = 'traditional_listing';
                        }else if(filter == '#recently-listing'){
                            listing_filter = 'recent_sold_listing';
                        }*/

                        if(response.listing_filter == 'auctions_listing'){
                            pre_active_listing = '#auctions-listing';
                        }else if(response.listing_filter == 'new_listing'){
                            pre_active_listing = '#newlistings-listing';
                        }else if(response.listing_filter == 'traditional_listing'){
                            pre_active_listing = '#traditional-listing';
                        }else if(response.listing_filter == 'recent_sold_listing'){
                            pre_active_listing = '#recently-listing';
                        }else if(response.listing_filter == 'featured'){
                            pre_active_listing = '#featured';
                        }

                        // $('#pagi').chosen();
                        // $("#datesort").chosen();
                        $(window).scrollTop(0);
                        /*if(response.total > 0){
                            var show_page_txt = 'Showing page '+response.page+' of '+response.total;
                            $('#show_page_record').html(show_page_txt);
                        }*/

                    }
                }
            });
        }
    }


    function getresultmap(listing_type, currpage, search, sort_key, sort_val, filter_listing){
        if(listing_type == 'our_listing'){
            if(filter_listing == ''){
                filter_listing = $('#listing-tab').find('li.active').find('a').attr('href');
            }
            var search = $('#property_map_search_text').val();

            if($('#map_pagi').val() != ""){
                recordPerpage = $('#map_pagi').val();
            }
            //var filter = $('.listing_map_tab.active').find('a').attr('href');
            var filter = filter_listing;
            var listing_filter = '';
            if(filter == '#auctions-listing-map'){
                listing_filter = 'auctions_listing';
            }else if(filter == '#newlistings-listing-map'){
                listing_filter = 'new_listing';
            }else if(filter == '#traditional-listing-map'){
                listing_filter = 'traditional_listing';
            }else if(filter == '#recently-listing-map'){
                listing_filter = 'recent_sold_listing';
            }else if(filter == '#featured-map'){
                listing_filter = 'featured';
            }

            var sort_column = 'auction_start_date_asc';
            if(typeof($('#map_datesort').val()) != 'undefined' && $('#map_datesort').val() != ""){
                sort_column = $('#map_datesort').val();
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
                url: '/our-listing-map/',
                type: 'post',
                dataType: 'json',
                cache: false,
                data: {search: search, perpage: recordPerpage, page: currpage, listing_filter: listing_filter, sort_column: sort_column},
                beforeSend: function(){
                    $('.overlay').show();
                },
                success: function(response){
                    $('.overlay').hide();
                    if(response.error == 0){
                        $('#property_map_list').empty();
                        $('#map_prop_listing_pagination_list').empty();
                        $('#property_map_list').html(response.listing_html);
                        $('#property_map_list').find('script').remove();
                        $('#property_map_list').find('script').remove();
                        /*if($('#prop_num_record').val() != ""){
                            recordPerpage = $('#prop_num_record').val();
                        }*/
                        $("#map_prop_listing_pagination_list").html(response.pagination_html);
                        if($('#map_pagi').val() != ""){
                            recordPerpage = $('#map_pagi').val();
                        }

                        if(response.listing_filter == 'auctions_listing'){
                            pre_map_active_listing = '#auctions-listing-map';
                        }else if(response.listing_filter == 'new_listing'){
                            pre_map_active_listing = '#newlistings-listing-map';
                        }else if(response.listing_filter == 'traditional_listing'){
                            pre_map_active_listing = '#traditional-listing-map';
                        }else if(response.listing_filter == 'recent_sold_listing'){
                            pre_map_active_listing = '#recently-listing-map';
                        }
                        else if(response.listing_filter == 'featured'){
                            pre_map_active_listing = '#featured-map';
                        }
                        // $('#map_pagi').chosen();
                        $(window).scrollTop(0);
                    }
                }
            });
        }
    }

    function getresultmapfilter(listing_type, currpage, search, sort_key, sort_val, filter_listing){
        if(listing_type == 'our_listing'){
            if(filter_listing == ''){
                filter_listing = $('#listing-tab').find('li.active').find('a').attr('href');
            }
            var search = $('#property_map_search_text').val();

            if($('#map_pagi').val() != ""){
                recordPerpage = $('#map_pagi').val();
            }
            //var filter = $('.listing_map_tab.active').find('a').attr('href');
            var filter = filter_listing;
            var listing_filter = '';
            if(filter == '#auctions-listing-map'){
                listing_filter = 'auctions_listing';
            }else if(filter == '#newlistings-listing-map'){
                listing_filter = 'new_listing';
            }else if(filter == '#traditional-listing-map'){
                listing_filter = 'traditional_listing';
            }else if(filter == '#recently-listing-map'){
                listing_filter = 'recent_sold_listing';
            }else if(filter == '#featured-map'){
                listing_filter = 'featured';
            }

            var filter_asset_type = $("#filter_asset_type").val();
            var filter_auction_type = $("#filter_auction_type").val();
            var filter_beds = $("#filter_beds").val();
            var filter_baths = $("#filter_baths").val();
            var filter_mls_property = $("#filter_mls_property").val();
            var filter_min_price = $("#filter_min_price").val();
            var filter_max_price = $("#filter_max_price").val();
            if(filter_min_price && filter_max_price){
                if(parseInt(filter_min_price) >= parseInt(filter_max_price)){
                    alert("Max Value should br greater than min value.");
                    return false;
                }
            }

            var sort_column = 'auction_start_date_asc';
            if(typeof($('#map_datesort').val()) != 'undefined' && $('#map_datesort').val() != ""){
                sort_column = $('#map_datesort').val();
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
                url: '/our-listing-map/',
                type: 'post',
                dataType: 'json',
                cache: false,
                data: {search: search, perpage: recordPerpage, page: currpage, listing_filter: listing_filter, sort_column: sort_column, filter_asset_type: filter_asset_type, filter_auction_type: filter_auction_type, filter_beds: filter_beds, filter_baths: filter_baths, filter_mls_property: filter_mls_property, filter_min_price: filter_min_price, filter_max_price: filter_max_price},
                beforeSend: function(){
                    $('.overlay').show();
                },
                success: function(response){
                    $('.overlay').hide();
                    if(response.error == 0){
                        $('#property_map_list').empty();
                        $('#map_prop_listing_pagination_list').empty();
                        $('#property_map_list').html(response.listing_html);
                        $('#property_map_list').find('script').remove();
                        $('#property_map_list').find('script').remove();
                        /*if($('#prop_num_record').val() != ""){
                            recordPerpage = $('#prop_num_record').val();
                        }*/
                        $("#map_prop_listing_pagination_list").html(response.pagination_html);
                        if($('#map_pagi').val() != ""){
                            recordPerpage = $('#map_pagi').val();
                        }

                        if(response.listing_filter == 'auctions_listing'){
                            pre_map_active_listing = '#auctions-listing-map';
                        }else if(response.listing_filter == 'new_listing'){
                            pre_map_active_listing = '#newlistings-listing-map';
                        }else if(response.listing_filter == 'traditional_listing'){
                            pre_map_active_listing = '#traditional-listing-map';
                        }else if(response.listing_filter == 'recent_sold_listing'){
                            pre_map_active_listing = '#recently-listing-map';
                        }
                        else if(response.listing_filter == 'featured'){
                            pre_map_active_listing = '#featured-map';
                        }
                        // $('#map_pagi').chosen();
                        $(window).scrollTop(0);
                    }
                }
            });
        }
    }

    function filter_listing_map(element){
        var element_href = $(element).find('a').attr('href');
        getresultmap('our_listing', 1, '', '', '', element_href);
        /*if($(element).find('a').attr('href') != pre_map_active_listing){
            getresultmap('our_listing', 1, '', '', '', element_href);
        }else{
            return false;
        }*/
    }
    function filter_listing(element){
        var element_href = $(element).find('a').attr('href');
        getresult('our_listing', 1, '', '', '', element_href);
        /*if($(element).find('a').attr('href') != pre_active_listing){
            getresult('our_listing', 1, '', '', '', element_href);
        }else{
            return false;
        }*/
    }$()
    function make_favourite_listing(property, element){

        $.ajax({
            url: '/make-favourite-listing/',
            type: 'post',
            dataType: 'json',
            cache: false,
            data: {'property': property},
            beforeSend: function(){

            },
            success: function(response){
                if(response.error == 0 && response.status == 200){
                    if($(element).hasClass('active') == true){
                        $(element).removeClass('active');
                        property_id = property.toString();
                        try{
                            $('#listing_map_inner_'+property_id+' .like_post').removeClass('active');
                        }catch(ex){
                            //console.log(ex);
                        }
                        try{
                            $('#listing_map_'+property_id+' .like_post').removeClass('active');
                        }catch(ex){
                            //console.log(ex);
                        }


                        $.growl.notice({title: "Listing ", message: "Removed from favorite listing", size: 'large'});
                    }else{
                        $(element).addClass('active');
                        property_id = property.toString();
                        try{
                            $('#listing_map_'+property_id+' .like_post').addClass('active');
                        }catch(ex){
                            //console.log(ex);
                        }
                        try{
                           $('#listing_map_inner_'+property_id+' .like_post').addClass('active');
                        }catch(ex){
                            //console.log(ex);
                        }

                        $.growl.notice({title: "Listing ", message: response.msg, size: 'large'});
                    }

                }else{
                    $.growl.error({title: "Listing ", message: response.msg, size: 'large'});
                }
            }
        });
    }

    $.urlParam = function(name, url) {
        if (!url) {
         url = window.location.href;
        }
        var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(url);
        if (!results) { 
            return undefined;
        }
        return results[1] || undefined;
    }


$('#filter_min_price').keyup(function () {
   this.value = this.value.replace(/[^0-9\.]/g,'');
});

function getPropertyType(){
    var asset_id = $("#filter_asset_type").val();
    var csrf_token = $('input[name="csrfmiddlewaretoken"]').val();
    $.ajax({
        url: '/get-property-type/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {'asset_id': asset_id, 'csrfmiddlewaretoken': csrf_token},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            var data = response.data
            if(response.error == 0){
                $('#filter_property_type').empty();
                var option = "<option value=''>All</option>";
                data.forEach(function(item) {
                    option += "<option value='"+item.id+"'>"+item.property_type+"</option>";
                });
                $('#filter_property_type').append(option);
                // $('#filter_property_type').trigger("chosen:updated");
            }
            $('.overlay').hide();
        }
    });
}