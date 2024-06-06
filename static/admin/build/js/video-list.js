$(function() {

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
    });
    setTimeout(function(){ $('.add-video-form').parsley(); }, 2000);

    // call video list once everything ready
    ajax_video_list()

    init_selectize();

    $(document).on("click", ".page-link", function(e) {
        var page_number = $(this).attr('data');
        var page_type = $(this).attr('data-type');
        var page_sub_type = $(this).attr('data-sub-type');

        if (page_type == "video") {
            if (page_sub_type == "video_list") {
                $("#page-video-list").val(page_number);
                ajax_video_list();
            }
        }
    })
    // on enter input key
    .on("keyup", "#search", function(e) {
        e.preventDefault();
        if (e.which == 13) {
            $("#page-video-list").val(1)
            ajax_video_list();
        }
    })
    // on submit search query
    .on("click", ".searchBtn", function(e) {
        e.preventDefault();
        $("#page-video-list").val(1)
            ajax_video_list();
    })

    .on("change", "#prop_filter_status, #site, #per_page_record", function(e) {
        e.preventDefault();
        $("#page-video-list").val(1);
        ajax_video_list();
    })

    .on('submit', '.add-video-form, .edit-video-form', function(event){
        event.preventDefault();
        $(".loaderDiv").show();
        $.ajax({
            type: $(this).attr('method'),
            url: $(this).attr('action'),
            data: $(this).serialize(),
            success: function (data) {
                // change html buttons
                showAlert(data.msg, data.error)
                if(data.error == 0){
                    setTimeout(function(){ location.reload(); }, 2000);
                }
                $(".loaderDiv").hide();

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
                showAlert(msg, 1)
                $(".loaderDiv").hide();

            }
        });
        return false;

    })

    .on('click','.edit-video', function(){
        $(".loaderDiv").show();
        dataId= $(this).data("id")
        $.ajax({
            type: 'POST',
            url: '/admin/ajax-get-video-details/',
            dataType: 'json',
            async: false,
            data: {id : dataId},
            success: function (data) {
                console.log(data)
                if(data.error == 0){
                    data = data.data
                    $('#video_id').val(data.id)
                    $('#editSiteId').val(data.site_id)
                    $('#editTitle').val(data.title)
                    // $('#editDescription').val(data.description)
                    tinymce.get('editDescription').setContent(data.description);
                    tinyMCE.triggerSave();
                    $('#editVideoUrl').val(data.video_url)
                    $('#editStatus').val(data.status)
                    $('.edit-video-modal').modal('show')
                } else {
                    showAlert(data.msg, 1)
                }
                $(".loaderDiv").hide();
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
                showAlert(msg, 1)
                $(".loaderDiv").hide();

            }
        });
    });

});

function ajax_video_list() {
    var page = $("#page-video-list").val();
    var search = $("#search").val();
    $(".loaderDiv").show();
    $.ajax({
        url: "/admin/ajax-video-list/",
        type: "POST",
        data: { 
            'page': page,
            'search': search,
            'count': $('#per_page_record').val(),
            'status': $('#prop_filter_status').val(), 
            'site_id': $('#site').val()     
        },
        cache: false,
        success: function(data) {
            $("#span-ajax-video-list").html(data)
        },
        complete: function(jqXhr) {
            $(".loaderDiv").hide();
            // redirectLogin(jqXhr)
        }
    });
}

const init_selectize = () => {
    $('select[multiple]').selectize(
        {
            plugins: ['remove_button'],
            delimiter: ',',
            persist: false,
        }
    );

    $('#per_page_record').selectize({
        create: false,
        sortField: 'text'
    });
}