var currpage = 1;
var recordPerpage = 10;
$(document).ready(function(){

});
function noifcationListingSearch(current_page){
        //var search = $('#agent_search').val();
        var currpage = current_page;
        /*if($('#agent_num_record').val() != ""){
            recordPerpage = $('#agent_num_record').val();
        }
        var status = $('#agent_filter_status').val();*/
        $.ajax({
            url: '/notifications/',
            type: 'post',
            dataType: 'json',
            cache: false,
            data: {perpage: recordPerpage, page: currpage},
            beforeSend: function(){
                $('.overlay').show();
            },
            success: function(response){
                $('.overlay').hide();
                console.log(response);
                if(response.error == 0){
                    $('#notifi_list').empty();
                    $('#notification_listing_pagination_list').empty();
                    /*if($('#agent_num_record').val() != ""){
                        recordPerpage = $('#agent_num_record').val();
                    }*/
                    //var $perpageresult = getAllPageLinks('user_listing',currpage, recordPerpage, response.total_user, '', '', '');

                    $("#notifi_list").html(response.listing_html);
                    $("#notification_listing_pagination_list").html(response.pagination_html);


                }else{
                    $('#notifi_list').html('<li class="notiMenu"><img src="static/theme-1/images/no-data-image.png" class=" center mb0" /></li>');
                }
                $("#notifi_list").find('script').remove();
                $(window).scrollTop(0);
            }
        });
    }