try{
    Dropzone.autoDiscover = false;
}catch(ex){
    console.log(ex);
}
$(document).ready(function(){
});
function initdrozone(params){
    Dropzone.autoDiscover = false;
    var upload_multiple = false;
    var url = '/admin/save-images/';
    var field_name = 'file';
    var file_accepted = '.png, .jpg, .jpeg, .svg';
    var element = '';
    var max_files = 1;
    var count = '';
    var call_function;
    if(params.element){
        element = '#'+params.element;
    }
    if(params.upload_multiple){
        upload_multiple = params.upload_multiple;
    }
    if(params.url){
        action_url = params.url;
    }
    if(params.field_name){
        field_name = params.field_name;
    }
    if(params.file_accepted){
        file_accepted = params.file_accepted;
    }
    if(params.call_function){
        call_function = params.call_function;
    }
    if(params.max_files){
        max_files = params.max_files;
    }
    default_message = '<i class="fa fa-upload" aria-hidden="true"></i> Upload File';
    if(params.default_message){
        default_message = params.default_message;
    }
    if(params.default_message){
        default_message = params.default_message;
    }
    if(params.count != "" && params.count != "undefined"){
        count = params.count;
    }
    if(upload_multiple === true){
        var init_drozone = new Dropzone(element, {
            uploadMultiple: upload_multiple,
            url: action_url,
            paramName: field_name,
            acceptedFiles: file_accepted,
            maxFiles: 100,
            //dictDefaultMessage: default_message,
            previewsContainer: element,
            parallelUploads: 4,
            init: function() {
                var drop = this; // Closure
                var file_count = 0;
                this.on("addedfiles", function (file) {
                    var total_uploaded = 0;
                    if(element == '#bidderDocFrm'){
                        if(drop.files.length > 10){
                            this.removeAllFiles();
                            $(element).removeClass('dz-started');
                            $(element).find('.dz-preview').remove();
                            var error_msg = 'You can not upload any more files.<br> Allowed file type: '+file_accepted+'. <br> Maximum '+10+' files can be uploaded at a time.';

                            window.setTimeout(function () {
                                $.growl.error({title: "Upload error ", message: error_msg, size: 'large'});
                            }, 1000);
                        }
                    }

                });
                this.on('error', function(file, errorMessage) {
                    var error_msg = errorMessage+'<br> Allowed file type: '+file_accepted+'. <br> Maximum '+max_files+' files can be uploaded.';
                    $.growl.error({title: "Upload error ", message: error_msg, size: 'large'});
                });
                this.on("sending", function(file, xhr, formData){
                     file_size = parseFloat((file.size / (1024*1024)).toFixed(2));
                     formData.append("file_length", drop.files.length);
                     formData.append("file_size", file_size);
                });
                this.on('successmultiple', function(file, response) {
                   count = parseInt(element.charAt(element.length-1));
                   if(count >= 0){
                    count = count;
                   }else{
                    count = '';
                   }
                   custom_response = {
                        status: response.status,
                        uploaded_file_list: response.uploaded_file_list,
                        count: count,
                   }
                   customCallBackFunc(call_function, [custom_response]);
                });
                this.on("complete", function (file) {
                  if (this.getUploadingFiles().length === 0 && this.getQueuedFiles().length === 0) {
                    this.removeAllFiles();
                  }
                });
            }
        });
    }else{
        var init_drozone = new Dropzone(element, {
            uploadMultiple: upload_multiple,
            autoProcessQueue: true,
            url: action_url,
            paramName: field_name,
            acceptedFiles: file_accepted,
            maxFiles: 1,
            previewsContainer: element,
            init: function() {
                var drop = this; // Closure
                this.on('error', function(file, errorMessage) {
                    var error_msg = errorMessage+'<br> Allowed file type: '+file_accepted+'. <br> Maximum '+max_files+' files can be uploaded.';
                    $.growl.error({title: "Upload error ", message: error_msg, size: 'large'});
                    $(element).removeClass('dz-started');
                    $(element).find('.dz-preview').remove();
                    $(element).find('.dz-image-preview').remove();
                    drop.removeFile(file);
                });
                this.on("sending", function(file, xhr, formData){
                     file_size = parseFloat((file.size / (1024*1024)).toFixed(2));
                     formData.append("file_length", drop.files.length);
                     formData.append("file_size", file_size);
                });
                this.on('success', function(file, response) {
                    count = parseInt(element.charAt(element.length-1));
                   if(count >= 0){
                    count = count;
                   }else{
                    count = '';
                   }
                   $(element).removeClass('dz-started');
                   $(element).find('.dz-preview').remove();
                   drop.removeFile(file);
                   custom_response = {
                        status: response.status,
                        uploaded_file_list: response.uploaded_file_list,
                        count: count,
                   }
                   customCallBackFunc(call_function, [custom_response]);
                });
                this.on("complete", function (file) {
                  if (this.getUploadingFiles().length === 0 && this.getQueuedFiles().length === 0) {
                    drop.removeAllFiles();
                  }
                });
            }
        });
    }
}