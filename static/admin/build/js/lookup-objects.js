$(function() {
    // handle edit object 
    $('.edit-object').on('click', function(){
        dataId= $(this).data("id")
        dataName = $(this).data("name")
        if($(this).data("status") == 'True' || $(this).data("status") == 'true')
            dataStatus = 1;
        else
            dataStatus = 0;
        // set data sets
        $('#object_id').val(dataId)
        $('#edit_name').val(dataName)
        $('#edit_is_active').val(dataStatus)
        $('.edit-object-modal').modal('show')
    });

});