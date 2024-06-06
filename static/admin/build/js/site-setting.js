$(function() {
    // handle edit site setting
    $('.edit-setting').on('click', function(){
        dataId= $(this).data("id")
        dataName = $(this).data("name")
        dataValue = $(this).data("value")
        if($(this).data("status") == 'True' || $(this).data("status") == 'true')
            dataStatus = 1;
        else
            dataStatus = 0;
        // set data sets
        $('#setting_id').val(dataId)
        $('#edit_value').val(dataValue)
        $('#edit_name').val(dataName)
        $('#edit_is_active').val(dataStatus)
        $('.edit-site-setting-modal').modal('show')
    });

});