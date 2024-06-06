 //active inactive 
 $(document).on('submit', '.ActiveInactive', function(event){
    event.preventDefault();
    var that = this;
    $(".loaderDiv").show();
    $.ajax({
        type: $(this).attr('method'),
        url: $(this).attr('action'),
        data: $(this).serialize(),
        success: function (data) {
            // change html buttons
            if(data.error == 0){
                // status id changed
                cur_status_value = $(that).find('.status-change').val();
                $(that).find('.status-change').val((cur_status_value == '2')?'1':'2');
                // acticate/deactivate button and text change
                if(cur_status_value == '2'){
                    $(that).find(':submit').removeClass('btn-warning').addClass('btn-success').html('<i class="fa fa-check"></i> Activate')
                    $('#statusText' + $(that).attr('data-id')).addClass('btn-warning').removeClass('btn-success').html('Inactive')
                    $(that).prev('button').data('status', 'False')

                } else {
                    $(that).find(':submit').addClass('btn-warning').removeClass('btn-success').html('<i class="fa fa-remove"></i> Deactivate')
                    $('#statusText' + $(that).attr('data-id')).removeClass('btn-warning').addClass('btn-success').html('Active')
                    $(that).prev('button').data('status', 'True')
                }
            }
            $(".loaderDiv").hide();
            showAlert(data.msg, data.error)
        },
        error: function(jqXHR, exception) {
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            $(".loaderDiv").hide();
            showAlert(msg, 1)
        }
    });
    return false;
});


//  show alert AFTER ajax call
// const showAlert = (msg, error) => {
//     new PNotify({
//         title: (error == 1 )?'Error':'Success',
//         text: msg,
//         type: (error == 1)? 'error':'success',
//         styling: 'bootstrap3'
//     });
// }