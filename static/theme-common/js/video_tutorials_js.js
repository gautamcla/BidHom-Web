var currpage = 1;
var recordPerpage = 12;

$(function(){
    $('#videoModal').on('hidden.bs.modal', function () {
        $("#video_url").attr('src', '');
    });
});
function getresult(currpage, search, sort_key, sort_val){
    var search = $('#video_search_text').val();
    if($('#pagi').val() != ""){
        recordPerpage = $('#pagi').val();
    }
    var sort_column = '';
    if(typeof($('#datesort').val()) != 'undefined' && $('#datesort').val() != ""){
        sort_column = $('#datesort').val();
    }

    $.ajax({
        url: '/video-tutorials/',
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
                $('#tutorial_list').empty();
                $('#tutorial_list').html(response.listing_html);
                //$('#total').html('');
                //$('#total').html(response.total+' Search results');
                if($('#pagi').val() != ""){
                    recordPerpage = $('#pagi').val();
                }
                var $perpageresult = getAllPageLinks(currpage, recordPerpage, response.total, '', '', '');
                var $pre = '<li class="page-item">Result Per Page:</li><li class="page-item"><select name="" id="pagi"><option value="">10</option><option value="">20</option></select></li>';
                $("#prop_listing_pagination_list").html($perpageresult);
                // $('#pagi').chosen();
            }
        }
    });
    
}

function videoPlay(url){
    var video_url = url.replace('watch?v=', 'embed/');
    $("#video_url").attr('src', video_url);
    $("#videoModal").modal('show');
}