var currpage = 1;
var recordPerpage = 12;
function getresult(currpage, search, sort_key, sort_val){
    var search = $('#agent_search_text').val();
    if($('#pagi').val() != ""){
        recordPerpage = $('#pagi').val();
    }
    var sort_column = '';
    if(typeof($('#datesort').val()) != 'undefined' && $('#datesort').val() != ""){
        sort_column = $('#datesort').val();
    }

    $.ajax({
        url: '/our-agents/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {search: search, perpage: recordPerpage, page: currpage, sort_column: sort_column},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            if(response.error == 0){
                $('#agent_list').empty();
                $('#agent_list').html(response.listing_html);
                $('#total').html('');
                $('#total').html(response.total+' Search results');
                if($('#pagi').val() != ""){
                    recordPerpage = $('#pagi').val();
                }
                //var $perpageresult = getAllPageLinks(currpage, recordPerpage, response.total, '', '', '');
                //var $pre = '<li class="page-item">Result Per Page:</li><li class="page-item"><select name="" id="pagi"><option value="">10</option><option value="">20</option></select></li>';
                $("#agent_listing_pagination_list").html(response.pagination_html);
                $(window).scrollTop(100);
                //$('#pagi').chosen();
            }
        }
    });
    
}