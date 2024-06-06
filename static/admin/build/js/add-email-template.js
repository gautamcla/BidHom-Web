
$(function() {

    // init tinymce to  email_content
    tinymce.init({
        selector: '.email_content',
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
    });

    $('#addTemplate').parsley();


     //active inactive 
    $(document).on('submit', '#addTemplate', function(event){
        // event.preventDefault();
        // $(".loaderDiv").show();
        $('.overlay').show();
        $.ajax({
            type: $(this).attr('method'),
            url: $(this).attr('action'),
            data: $(this).serialize(),
            success: function (data) {
                $('.overlay').hide();
                $.growl.notice({title: "Email Template ", message: data.msg, size: 'large'});
                if(data.error == 0){
                    setTimeout(function(){
                        window.location.href = "/admin/email-template-list/";        
                    }, 2000);
                }

            },
            error: function(jqXHR, exception) {
                var msg = '';
                if (jqXHR.status === 0) {
                    msg = 'Not connect.\n Verify Network.';
                } else if (jqXHR.status == 404) {
                    msg = 'Requested page not found. [404]';
                } else if (jqXHR.status == 500) {
                    msg = 'Internal Server Error [500].';
                } else if (exception === 'parsererror') {
                    msg = 'Requested JSON parse failed.';
                } else if (exception === 'timeout') {
                    msg = 'Time out error.';
                } else if (exception === 'abort') {
                    msg = 'Ajax request aborted.';
                } else {
                    msg = 'Uncaught Error.\n' + jqXHR.responseText;
                }
                // showAlert(msg, 1)
                $('.overlay').hide();
                $.growl.error({title: "Email Template ", message: msg, size: 'large'});

            }
        });
        return false;

    });
});


//  show alert AFTER ajax call
// const showAlert = (msg, error) => {
//     new PNotify({
//         title: (error == 1 )?'Error':'Success',
//         text: msg,
//         type: (error == 1)? 'error':'success',
//         styling: 'bootstrap3'
//     });
// }