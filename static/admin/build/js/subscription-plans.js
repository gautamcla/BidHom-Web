$(function() {

    $.extend(Parsley.options, {
        errorClass: 'has-error',
        classHandler: function(el) {
            return el.$element.closest(".form-group");
        },
        errorsWrapper: '<span class="help-block">',
        errorTemplate: '<div></div>'
    });


    // init tinymce to  description
    tinymce.init({
        selector: '.description',
        height: 350,
        menubar: 'file edit view insert format tools table help',
        plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount'
        ],
        toolbar: 'undo redo | formatselect | ' +
            'bold italic backcolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        setup: function(ed) {
            ed.on('keyup', function(e) {
                tinyMCE.triggerSave();

            });
        }
    })

    // handle edit plan 
    $('.edit-subscription').on('click', function() {
        dataId = $(this).data("id")
        dataName = $(this).data("name")
        dataDesc = $(this).data("desc")
        // dataCost = $(this).data("cost")
        if ($(this).data("status") == 'True' || $(this).data("status") == 'true')
            dataStatus = 1;
        else
            dataStatus = 0;
        // set data sets
        $('#subscription_id').val(dataId)
        $('#plan_name').val(dataName)
        // $('#cost').val(dataCost)
            // $('#plan_desc').val(dataDesc)
        tinymce.get('plan_desc').setContent(dataDesc);
        tinyMCE.triggerSave();
        $('#plan_is_active').val(dataStatus)
        $('.edit-plan-modal').modal('show')
    });

    $("form").parsley();

});