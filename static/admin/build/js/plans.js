$(function() {
    // handle edit plan 
    $('.edit-plan').on('click', function(){
        dataId= $(this).data("id")
        dataName = $(this).data("name")
        dataDur = $(this).data("dur")
        dataBen = $(this).data("benefits")
        if($(this).data("status") == 'True' || $(this).data("status") == 'true')
            dataStatus = 1;
        else
            dataStatus = 0;
        // set data sets
        $('#type_id').val(dataId)
        $('#type_name').val(dataName)
        $('#duration_in_days').val(dataDur)
        $('#benifits').val(dataBen)
        $('#plan_is_active').val(dataStatus)
        $('.edit-plan-modal').modal('show')
    });

});