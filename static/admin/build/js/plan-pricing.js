$(function() {
    // handle edit pricing plan 
    $('.edit-plan-pricing').on('click', function(){
        dataId= $(this).data("id")
        dataPlan = $(this).data("plan")
        dataSubscription= $(this).data("subscription")
        dataCost = $(this).data("cost")
        if($(this).data("status") == 'True' || $(this).data("status") == 'true')
            dataStatus = 1;
        else
            dataStatus = 0;
        // set data sets
        $('#planPriceId').val(dataId)
        $('#planTypeId').val(dataPlan)
        $('#subscriptionId').val(dataSubscription)
        $('#cost').val(dataCost)
        $('#planIsActive').val(dataStatus)
        $('.edit-plan-pricing-modal').modal('show')
    });

});