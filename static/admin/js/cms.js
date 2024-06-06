$(document).ready(function(){
    try{
        CKEDITOR.env.isCompatible = true;
    }catch(ex){
        console.log("cked: "+ex);
    }
    try{
        CKEDITOR.on( 'instanceReady', function(e) {
            $('iframe', e.editor.container.$).contents().on('click', function() {
                e.editor.focus();
            });
        });
    }catch(ex){
        //console.log(ex);
    }
    $.validator.addMethod("pageDesc", function (value, element) {
        if(CKEDITOR.instances['page_content'].getData() == "" ){
          return false;
        } else {
            return true;
        }
    }, "Description is required.");
    $('#cms_frm').validate({
        ignore: [],
        errorElement: 'p',
        rules:{
            cms_status:{
                required: true
            },
            meta_keywords:{
                required: true
            },
            meta_title:{
                required: true
            },
            meta_desc:{
                required: true
            },
            page_title:{
                required: true
            },
            slug:{
                required: true
            },
            page_content:{
                pageDesc: true
            }
        },
        messages:{
            cms_status:{
                required: "Status is required"
            },
            meta_keywords:{
                required: "Meta keyword is required"
            },
            meta_title:{
                required: "Meta title is required"
            },
            meta_desc:{
                required: "Meta description is required"
            },
            page_title:{
                required: "Page title is required"
            },
            slug:{
                required: "Slug is required"
            },
            page_content:{
                pageDesc: "Page Content is required"
            }
        },
        errorPlacement: function(error, element) {
            if(element.hasClass('select')){
                error.insertAfter(element.next('.chosen-container'));
            }else if(element.is('#page_content')){
                error.insertAfter(element.siblings('[id*="cke_page_content"]:eq(0)'));
            }else{
                error.insertAfter(element);
            }
        },
        submitHandler: function(){
            for (instance in CKEDITOR.instances){
                CKEDITOR.instances[instance].updateElement();
            }
            $.ajax({
                url: '/admin/save-cms/',
                type: 'post',
                dataType: 'json',
                cache: false,
                data: $('#cms_frm').serialize(),
                beforeSend: function(){
                    $('.overlay').show();
                },
                success: function(response){
                    $('.overlay').hide();
                    if(response.error == 0 || response.status == 200 || response.status == 201){

                        window.setTimeout(function () {
                            $.growl.notice({title: "Cms page ", message: response.msg, size: 'large'});
                            window.location.reload();
                        }, 2000);
                    }else{
                        window.setTimeout(function () {
                            $.growl.error({title: "Cms page ", message: response.msg, size: 'large'});
                        }, 2000);
                    }
                }
            });


        }
    });
});