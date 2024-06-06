$(function() {
    // handle edit blog category 
    $('.edit-ctype').on('click', function(){
        dataId= $(this).data("id")
        dataName = $(this).data("name")
        dataStatus = $(this).data('status')
        // set data sets
        $('#category_id').val(dataId)
        $('#edit_name').val(dataName)
        $('#edit_status').val(dataStatus)
        $('.edit-blog-category-modal').modal('show')
    });

});