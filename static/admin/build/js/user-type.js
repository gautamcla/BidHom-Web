$(function() {
    // handle edit user type 
    $('.edit-usertype').on('click', function(){
        dataId= $(this).data("id")
        dataName = $(this).data("name")
        if($(this).data("status") == 'True' || $(this).data("status") == 'true')
            dataStatus = 1;
        else
            dataStatus = 0;
        // set data sets
        $('#user_type_id').val(dataId)
        $('#edit_name').val(dataName)
        $('#edit_is_active').val(dataStatus)
        $('.edit-user-type-modal').modal('show')
    });

});