$(function() {
    // handle edit event type 
    $('.edit-etype').on('click', function(){
        dataId= $(this).data("id")
        dataName = $(this).data("name")
        dataSlug = $(this).data("slug")
        if($(this).data("status") == 'True' || $(this).data("status") == 'true')
            dataStatus = 1;
        else
            dataStatus = 0;
        // set data sets
        $('#event_type_id').val(dataId);
        $('#edit_name').val(dataName);
        $('#edit_event_slug').val(dataSlug);
        $('#edit_is_active').val(dataStatus);
        $('.edit-event-type-modal').modal('show');
    });

    $('#add_event_type_frm #name,#edit_event_type_frm #edit_name').on('input',function(e){
        if(this.value != ''){
            var getSlug = convertEventSlug(this.value);
            if($(this).attr('id') == 'name'){
                $('#add_event_type_frm #event_slug').val(getSlug);
            }else{
                $('#edit_event_type_frm #edit_event_slug').val(getSlug);
            }
        }
    });
    const convertEventSlug = (Text) => {
        try {
            return Text
            .toLowerCase()
            .replace(/\s+/g, " ")
            .replace(/ /g,'_')
            .replace(/[^\w-]+/g,'')
            ;
        } catch (error) {
            return ''
        }
    };

});
