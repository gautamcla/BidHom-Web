var currentFocus = -1;
var currpage = 1;
var recordPerpage = 10;
try{
    Dropzone.autoDiscover = false;
}catch(ex){
    //console.log(ex);
}
$(document).ready(function(){

});
function portfolioListingSearch(current_page){
    var search = $('#portfolio_search').val();
    var currpage = current_page;
    if($('#portfolio_num_record').val() != ""){
        recordPerpage = $('#portfolio_num_record').val();
    }
    var status = '';
    $.ajax({
        url: '/admin/portfolio-list/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {search: search, perpage: recordPerpage, status: status, page: currpage},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            if(response.error == 0){
                $('#portfolio_list').empty();
                $('#portfolio_pagination_list').empty();
                if($('#portfolio_num_record').val() != ""){
                    recordPerpage = $('#portfolio_num_record').val();
                }
                //var $perpageresult = getAllPageLinks('user_listing',currpage, recordPerpage, response.total_user, '', '', '');

                $("#portfolio_list").html(response.portfolio_listing_html);
                $("#portfolio_pagination_list").html(response.pagination_html);


            }else{
                $('#portfolio_list').html('<div class="block-item"><div class="item fullwidth"><p class="custom_error center mb0">No Data Found!</p></div></div>');
            }
            $("#portfolio_list").find('script').remove();
            $(window).scrollTop(0);
        }
    });
}
function agent_delete_confirmation(row_id){
  $('.personalModalwrap').modal('hide');
  $('#confirmAgentDeleteModal').modal('show');
  $('.del_agent_btn').attr('rel_id', row_id);
}

function show_message(estimator_id, msg){
    $('#viewMsgHistoryModal #agent_comment_err').html('').hide();
    $('#viewMsgHistoryModal #agent_comment').val(msg);
    $('#viewMsgHistoryModal #estimator_id').val(estimator_id);
    /*if(msg){
        $('#viewMsgHistoryModal #send_msg').prop('disabled', true);
        $('#viewMsgHistoryModal #agent_comment').prop('disabled', true);
    }else{
        $('#viewMsgHistoryModal #send_msg').removeProp('disabled');
        $('#viewMsgHistoryModal #agent_comment').removeProp('disabled');
    }*/
    $('#viewMsgHistoryModal').modal('show');
}