$(function() {
    // handle edit address type 
    $('.edit-atype').on('click', function(){
        dataId= $(this).data("id")
        dataName = $(this).data("name")
        if($(this).data("status") == 'True' || $(this).data("status") == 'true')
            dataStatus = 1;
        else
            dataStatus = 0;
        // set data sets
        $('#address_type_id').val(dataId)
        $('#edit_name').val(dataName)
        $('#edit_is_active').val(dataStatus)
        $('.edit-address-type-modal').modal('show')
    });

});