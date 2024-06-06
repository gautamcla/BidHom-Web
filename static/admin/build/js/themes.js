$(function() {
    // handle edit theme 
    $('.edit-theme').on('click', function(){
        dataId= $(this).data("id")
        dataName = $(this).data("name")
        dataDir = $(this).data("dir")
        if($(this).data("status") == 'True' || $(this).data("status") == 'true')
            dataStatus = 1;
        else
            dataStatus = 0;
        // set data sets
        $('#theme_id').val(dataId)
        $('#edit_name').val(dataName)
        $('#edit_theme_dir').val(dataDir)
        $('#edit_theme_is_active').val(dataStatus)
        $('.edit-theme-modal').modal('show')
    });

});