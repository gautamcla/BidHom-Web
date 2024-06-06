$(function() {
    // handle edit permission 
    $('.edit-permission').on('click', function(){
        dataId= $(this).data("id")
        dataName = $(this).data("name")
        dataType = $(this).data("type")
        if($(this).data("status") == 'True' || $(this).data("status") == 'true')
            dataStatus = 1;
        else
            dataStatus = 0;
        // set data sets
        $('#permission_id').val(dataId)
        $('#edit_name').val(dataName)
        $('#perm_type').val(dataType)
        $('#edit_is_active').val(dataStatus)
        $('.edit-permision-modal').modal('show')
    });

});