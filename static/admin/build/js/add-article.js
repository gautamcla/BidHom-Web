
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

    setTimeout(function(){ $('#addArticle').parsley(); }, 1000);
    

    $('.date-picker-listing').daterangepicker({
        timePicker: true,
        singleDatePicker: true,
        timePickerIncrement: 30,
        showDropdowns: true,
        autoUpdateInput: false,
        locale: {
            format: 'MM/DD/YYYY h:mm A'
        }
    }).on('apply.daterangepicker', function(ev, picker) {
        var date_element = $(this).parent().find('input:last').attr('id');
        $(this).val(picker.startDate.format('MM/DD/YYYY h:mm A'));
        var dates = $(this).val()
        if(dates != ""){
          var actualStartDate = dates.split(" ");
          //new lines
          var mdy_format = actualStartDate[0].split("-");
          mdy_date = mdy_format[2]+"-"+mdy_format[0]+"-"+mdy_format[1];

          //actualStartDate = mdy_date+' '+convert_to_24h(actualStartDate[1]+' '+actualStartDate[2]);
          actualStartDate = actualStartDate[0]+' '+convert_to_24h(actualStartDate[1]+' '+actualStartDate[2]);


          //var utc_date = convert_to_utc_datetime(actualStartDate);
          var utc_date = convert_to_utc_date(actualStartDate, 'mm/dd/yyyy', 'datetime');
          $("#"+date_element+"_local").val(actualStartDate);
          $("#"+date_element).val(utc_date);
        }
    });

    $('.glyphicon-calendar').click(function(event){
        event.preventDefault();
        $(this).parent().parent().children('.date-picker-listing').focus()
    });

    // setup date 
    convert_bidding_date('publish_date');
    

     //active inactive 
     $(document).on('submit', '#addArticle', function(event){
        event.preventDefault();
        $(".loaderDiv").show();
        var publish_date = $("#virtual_publish_date").val();
        if (publish_date != "") {
            var actualStartDate = publish_date.split(" ");
            actualStartDate = actualStartDate[0] + ' ' + convert_to_24h(actualStartDate[1] + ' ' + actualStartDate[2]);
            var actualStartDateUtc = convert_to_utc_datetime(actualStartDate, 'datetime');
            //var actualStartDateUtc = convert_to_utc_date(actualStartDate, 'mm-dd-yyyy', 'datetime');
            $("#publish_date").val(actualStartDateUtc);
            $("#publish_date_local").val(actualStartDate);
        } else{
            $("#virtual_publish_date").val('');
            $("#publish_date").val('');
            $("#publish_date_local").val('');
        }
        $.ajax({
            type: $(this).attr('method'),
            url: $(this).attr('action'),
            data: $(this).serialize(),
            success: function (data) {
                // change html buttons
                showAlert(data.msg, data.error)
                if(data.error == 0){
                    setTimeout(function(){ window.location.href = "/admin/blog-list" }, 2000);
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

    .on('click', '.confirm_image_delete', function(e) {
        e.preventDefault();
        var data_count = '';
        var data_article_id = '';
        var agent_id = '';
        var section = $(this).attr('data-image-section');
        var image_id = $(this).attr('data-image-id');
        var image_name = $(this).attr('data-image-name');
        if ($(this).attr('data-count')) {
            data_count = $(this).attr('data-count');
        }
        if ($(this).attr('data-article-id')) {
            data_article_id = $(this).attr('data-article-id');
        }
        var agent_id = $('#add_agent_form #agent_id').val();
        $('#confirmImageDeleteModal #popup_article_id').val(data_article_id);
        $('#confirmImageDeleteModal #popup_section').val(section);
        $('#confirmImageDeleteModal #popup_image_id').val(image_id);
        $('#confirmImageDeleteModal #popup_image_name').val(image_name);
        $('#confirmImageDeleteModal #popup_count').val(data_count);
        $('#confirmImageDeleteModal #popup_agent_id').val(agent_id);
        $('#confirmImageDeleteModal').modal('show');
    })

    .on('click', '#del_image_false', function(e) {
        e.preventDefault();
        $('#confirmImageDeleteModal #popup_article_id').val('');
        $('#confirmImageDeleteModal #popup_section').val('');
        $('#confirmImageDeleteModal #popup_image_id').val('');
        $('#confirmImageDeleteModal #popup_image_name').val('');
        $('#confirmImageDeleteModal #popup_count').val('');
        $('#confirmImageDeleteModal #popup_agent_id').val('');
        $('#confirmImageDeleteModal').modal('hide');
    })

    .on('click', '#del_image_true', function(e) {
        e.preventDefault();

        var article_id = $('#confirmImageDeleteModal #popup_article_id').val();
        var section = $('#confirmImageDeleteModal #popup_section').val();
        var id = $('#confirmImageDeleteModal #popup_image_id').val();
        var name = $('#confirmImageDeleteModal #popup_image_name').val();
        var count = $('#confirmImageDeleteModal #popup_count').val();
        var agent_id = $('#confirmImageDeleteModal #popup_agent_id').val();
        delete_image({
            article_id: article_id,
            section: section,
            id: id,
            name: name,
            count: count,
            agent_id: agent_id,
            // site_id: $('#site_id').val()
        });
        $('#confirmImageDeleteModal').modal('hide');
    })


    initdrozone({
        uploadMultiple: false,
        url: "/admin/save-images/",
        field_name: 'testimonial_img',
        file_accepted: '.png, .jpg, .jpeg, .svg',
        element: "testimonialImgFrm",
        max_files: 1,
        call_function: set_article_image,
        dictDefaultMessage : 'Drop files here to upload <br> Preferred size 400 X 500  px',
    });


    initdrozone({
        uploadMultiple: false,
        url: "/admin/save-images/",
        field_name: 'testimonial_author_img',
        file_accepted: '.png, .jpg, .jpeg, .svg',
        element: "testimonialAuthorImgFrm",
        max_files: 1,
        call_function: set_author_image,
        dictDefaultMessage : 'Drop files here to upload <br> Preferred size 400 X 500  px',
    });

});

const set_article_image = (response) => {
    var image_name = '';
    var upload_id = '';
    var actual_image = '';
    var actual_id = '';
    var upload_to = '';
    if (response.status == 200) {
        if (response.uploaded_file_list) {
            $.each(response.uploaded_file_list, function(i, item) {
                if (i == 0) {
                    if (item.file_name != "") {
                        image_name = item.file_name;
                        upload_id = item.upload_id.toString();
                    }
                } else {
                    if (item.file_name != "") {
                        image_name = image_name + ',' + item.file_name;
                        upload_id = upload_id + ',' + item.upload_id;
                    }
                }
                upload_to = item.upload_to;

            });
            actual_image = image_name.replace(/(^,)|(,$)/g, "");
            actual_id = upload_id.replace(/(^,)|(,$)/g, "");
            $('#upload_name').val(actual_image);
            $('#upload').val(actual_id);
            if (actual_image) {
                var testi_img = aws_url + "testimonial_img/" + actual_image;
                $('#testimonialImg').attr('src', testi_img);
                $('#testimonialImgDiv').show();
            }
            $('#testimonialImgDiv .fav-icon a').attr({ 'data-image-id': actual_id, 'data-image-name': actual_image, 'data-image-section': upload_to, }).addClass('confirm_image_delete');
        }
    }

}

const set_author_image = (response) => {
    var image_name = '';
    var upload_id = '';
    var actual_image = '';
    var actual_id = '';
    if (response.status == 200) {
        if (response.uploaded_file_list) {
            $.each(response.uploaded_file_list, function(i, item) {
                if (i == 0) {
                    if (item.file_name != "") {
                        image_name = item.file_name;
                        upload_id = item.upload_id.toString();
                    }
                } else {
                    if (item.file_name != "") {
                        image_name = image_name + ',' + item.file_name;
                        upload_id = upload_id + ',' + item.upload_id;
                    }
                }
                upload_to = item.upload_to;

            });
            actual_image = image_name.replace(/(^,)|(,$)/g, "");
            actual_id = upload_id.replace(/(^,)|(,$)/g, "");
            $('#author_image_name').val(actual_image);
            $('#author_image').val(actual_id);
            if (actual_image) {
                var author_img = aws_url + "testimonial_author_img/" + actual_image;
                $('#testimonialAuthorImg').attr('src', author_img);
                $('#testimonialAuthorImgDiv').show();
            }
            $('#testimonialAuthorImgDiv .fav-icon a').attr({ 'data-image-id': actual_id, 'data-image-name': actual_image, 'data-image-section': upload_to }).addClass('confirm_image_delete');

        }
    }
}

const initdrozone = (params) => {
    Dropzone.autoDiscover = false;
    var upload_multiple = false;
    var url = '/admin/save-images/';
    var field_name = 'file';
    var file_accepted = '.png, .jpg, .jpeg, .svg';
    var element = '';
    var max_files = 1;
    var call_function;
    var count = '';
    var dictDefaultMessage;

    if (params.dictDefaultMessage){
        dictDefaultMessage = params.dictDefaultMessage
    }
    if (params.element) {
        element = '#' + params.element;
    }
    if (params.upload_multiple) {
        upload_multiple = params.upload_multiple;
    }
    if (params.url) {
        action_url = params.url;
    }
    if (params.field_name) {
        field_name = params.field_name;
    }
    if (params.file_accepted) {
        file_accepted = params.file_accepted;
    }
    if (params.call_function) {
        call_function = params.call_function;
    }
    if (params.max_files) {
        max_files = params.max_files;
    }
    if(params.count != "" && params.count != "undefined"){
        count = params.count;
    }

    var init_drozone = new Dropzone(element, {
        uploadMultiple: upload_multiple,
        url: action_url,
        paramName: field_name,
        acceptedFiles: file_accepted,
        dictDefaultMessage: (dictDefaultMessage)?dictDefaultMessage:'Drop files here to upload',
        maxFiles: max_files,
        init: function() {
            var drop = this; // Closure

            /*this.on('error', function(file, errorMessage) {

                drop.removeFile(file);
            });*/

            this.on("sending", function(file, xhr, formData) {
                file_size = parseFloat((file.size / (1024 * 1024)).toFixed(2));
                formData.append("file_length", drop.files.length);
                formData.append("file_size", file_size);
                // formData.append("site_id", $('#site_id').val());
            });
            if (upload_multiple === false) {
                this.on('success', function(file, response) {
                    count = parseInt(element.charAt(element.length-1));
                    if(count >= 0){
                        count = count;
                    }else{
                        count = '';
                    }
                    drop.removeFile(file);
                    custom_response = {
                        status: response.status,
                        uploaded_file_list: response.uploaded_file_list,
                        count: count,
                    }
                    customCallBackFunc(call_function, [custom_response]);

                });
            }
            if (upload_multiple) {
                this.on('successmultiple', function(file, response) {
                    count = parseInt(element.charAt(element.length-1));
                    if(count >= 0){
                        count = count;
                    }else{
                        count = '';
                    }
                    drop.removeFile(file);
                    custom_response = {
                        status: response.status,
                        uploaded_file_list: response.uploaded_file_list,
                        count: count,

                    }
                    customCallBackFunc(call_function, [custom_response]);
                });
            }

        }

    });
        $('#addArticle').parsley();
}


const delete_image = (params) => {
    var image_id = '';
    var image_name = '';
    var new_ids = '';
    var new_names = '';
    try {
        var article_id = params.article_id;
    } catch (ex) {
        var article_id = '';
    }
    try {
        var agent_id = params.agent_id;
    } catch (ex) {
        var agent_id = '';
    }
    var section = params.section;
    var id = params.id;
    var name = params.name;
    var count = params.count;

   if (section == 'testimonial_img') {
        image_id = $('#upload').val();
        image_name = $('#upload_name').val();
        new_ids = remove_string(image_id, id, ',');
        new_names = remove_string(image_name, name, ',');
        $('#upload').val(new_ids);
        $('#upload_name').val(new_names);
        if ($('#upload').val() == '') {
            $('#testimonialImgDiv').hide();
        }
    } else if (section == 'testimonial_author_img') {
        image_id = $('#author_image').val();
        image_name = $('#author_image_name').val();
        new_ids = remove_string(image_id, id, ',');
        new_names = remove_string(image_name, name, ',');
        $('#author_image').val(new_ids);
        $('#author_image_name').val(new_names);
        if ($('#author_image').val() == '') {
            $('#testimonialAuthorImgDiv').hide();
        }
    } 
    data = { 'article_id': article_id, 'image_id': id, 'image_name': name, 'section': section, 'agent_id': agent_id }
    console.log(data)
    $.ajax({
        url: '/admin/delete-images/',
        type: 'post',
        dateType: 'json',
        async: false,
        cache: false,
        data: data,
        beforeSend: function() {

        },
        success: function(response) {
            console.log(response);
            if (response.error == 0 || response.status == 200 || response.status == 201) {
                $('#confirmImageDeleteModal #popup_article_id').val('');
                $('#confirmImageDeleteModal #popup_section').val('');
                $('#confirmImageDeleteModal #popup_image_id').val('');
                $('#confirmImageDeleteModal #popup_image_name').val('');
                $('#confirmImageDeleteModal #popup_count').val('');
                $('#confirmImageDeleteModal #popup_agent_id').val('');
                showAlert(response.msg, 0);

            } else {
                showAlert(response.msg, 1);
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
            $(".loaderDiv").hide();
            showAlert(msg, 1)
        }
    });
}


const customCallBackFunc = (callback, args) => {
    //do stuff
    //...
    //execute callback when finished
    callback.apply(this, args);
}

const convert_bidding_date = (element) => {
    try{
        value = $('#'+element).val();
        if(value != "" && value != "None"){
            console.log('in for ' + element)
            //var virtual_date = getLocalDate(value, 'yyyy-mm-dd','ampm');
            var virtual_date = getLocalDate(value, 'mm/dd/yyyy','ampm');
             //var actual_date = getLocalDate(value, 'yyyy-mm-dd', 'datetime');
             var actual_date = getLocalDate(value, 'mm/dd/yyyy', 'datetime');
             //var utc_date = convert_to_utc_datetime(value, 'datetime');
             var utc_date = convert_to_utc_date(value, 'mm/dd/yyyy', 'datetime');
             /*$('#'+element).val(utc_date);
            $('#'+element+'_local').val(actual_date);*/
            $('#virtual_'+element).val(virtual_date);
        }else{

            $('#virtual_'+element).val('');
        }
        $('#'+element).val('');
        $('#'+element+'_local').val('');

    }catch(ex){
        console.log(ex);
    }

}


// const remove_string = (list, value, separator) => {
//     separator = separator || ",";
//     var values = list.split(separator);
//     for (var i = 0; i < values.length; i++) {
//         if (values[i] == value) {
//             values.splice(i, 1);
//             return values.join(separator);
//         }
//     }
//     return list;
// }

//  show alert AFTER ajax call
// const showAlert = (msg, error) => {
//     new PNotify({
//         title: (error == 1 )?'Error':'Success',
//         text: msg,
//         type: (error == 1)? 'error':'success',
//         styling: 'bootstrap3'
//     });
// }