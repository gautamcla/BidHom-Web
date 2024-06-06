$(document).ready(function(){
     $('.select').chosen();
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
    portfolio_image_params = {
        url: '/admin/save-images/',
        field_name: 'portfolio',
        file_accepted: '.png, .jpg, .jpeg',
        element: 'portfolioImageFrm',
        upload_multiple: true,
        call_function: set_portfolio_image_details,
        default_message: '<i class="fa fa-upload" aria-hidden="true"></i> Upload Photos',
    }
    try{
        initdrozone(portfolio_image_params);
    }catch(ex){
        //console.log(ex);
    }
    /*$.validator.addMethod("articleDesc", function (value, element) {
        if(CKEDITOR.instances['article_description'].getData() == "" ){
          return false;
        } else {
            return true;
        }
    }, "Description is required.");*/

    $('#add_portfolio_form').validate({
        ignore: [],
        errorElement: 'p',
        rules: {
            portfolio_name:{
                required: true
            },
//            portfolio_details:{
//                required: true
//            },
//            portfolio_terms:{
//                required: true
//            },
//            portfolio_contacts:{
//                required: true
//            },
            portfolio_status:{
                required:true
            }
        },
        messages: {
            portfolio_name:{
                required: "Portfolio Name is required."
            },
            portfolio_details:{
                required: "Details is required."
            },
            portfolio_terms:{
                required: "Terms is required."
            },
            portfolio_contacts:{
                required: "Contacts is required."
            },
            portfolio_status:{
                required:"Status is required"
            }
        },
        errorPlacement: function(error, element) {
            if(element.is('.select')) {
                error.insertAfter(element.siblings('[class*="chosen-container"]:eq(0)'));
            }else if(element.is('.portfolio_details')){
                error.insertAfter(element.siblings('[id*="cke_portfolio_details"]:eq(0)'));
            }else if(element.is('.portfolio_terms')){
                error.insertAfter(element.siblings('[id*="cke_portfolio_terms"]:eq(0)'));
            }else if(element.is('.portfolio_contacts')){
                error.insertAfter(element.siblings('[id*="cke_portfolio_contacts"]:eq(0)'));
            }else{
                //console.log(element);
                error.insertAfter(element);
            }
        },
        submitHandler: function(){
            for (instance in CKEDITOR.instances){
                CKEDITOR.instances[instance].updateElement();
            }
            $.ajax({
                url: '/admin/add-portfolio/',
                type: 'post',
                dataType: 'json',
                cache: false,
                data: $('#add_portfolio_form').serialize(),
                beforeSend: function(){
                    $('.overlay').show();
                },
                success: function(response){
                    $('.overlay').hide();
                    if(response.error == 0 || response.status == 200 || response.status == 201){

                        $.growl.notice({title: "Portfolio ", message: response.msg, size: 'large'});

                        window.setTimeout(function () {
                            window.location.href = '/admin/portfolio-list/';
                        }, 2000);
                    }else{
                        window.setTimeout(function () {
                            $.growl.error({title: "Portfolio ", message: response.msg, size: 'large'});
                        }, 2000);
                    }
                }
            });
        }
    });
});

function set_portfolio_image_details(response){
    var image_name = '';
    var upload_id = '';
    var actual_image = '';
    var actual_id = '';
    var portfolio_image_id = $('#portfolio_image_id').val();
    var portfolio_image_name = $('#portfolio_image_name').val();
    var property_id = $('#property_id').val();
    var count = parseInt($('#portfolioImgList li').length);
    if(response.status == 200){
        $('#custom_portfolio_image_error').hide();
        if(response.uploaded_file_list){
            var all_banner_images = '';
            $.each(response.uploaded_file_list, function(i, item) {
                count = count+1;
                if(i==0){
                    if(item.file_name != ""){
                        image_name = item.file_name;
                        upload_id = item.upload_id.toString();
                    }
                }else{
                    if(item.file_name != ""){
                        image_name = image_name+','+item.file_name;
                        upload_id = upload_id+','+item.upload_id;
                    }
                }
                if(item.file_name != ""){
                    var img_src = aws_url+"portfolio/"+item.file_name;
                }
                if(item.upload_date){
                    try{
                        var upload_date = new Date(item.upload_date);
                        var month = upload_date.toLocaleString('default', { month: 'short' });
                        var year = upload_date.getFullYear();
                        var date = upload_date.getDate();
                        var dt = (upload_date.getDate() < 10)?'0'+upload_date.getDate():upload_date.getDate();
                        var hrs = (upload_date.getHours() < 10)?'0'+upload_date.getHours():upload_date.getHours();
                        var mins = (upload_date.getMinutes() < 10)?'0'+upload_date.getMinutes():upload_date.getMinutes();
                        var secs = (upload_date.getSeconds() < 10)?'0'+upload_date.getSeconds():upload_date.getSeconds();
                        var timeStp = '';
                        var mer = (parseInt(hrs) >= 12)?'p.m':'a.m';
                        hrs = parseInt(hrs) % 12;
                        hrs = (hrs)?hrs:12;
                        //timeStp = month +"-"+dt+"-"+year+" at "+hrs+":"+mins+" "+mer;
                        timeStp = month +" "+dt+", "+year+" "+hrs+":"+mins+""+mer;
                    }catch(ex){
                        //console.log(ex);
                        var timeStp = '';
                    }
                }
                //$('#portfolioImgList').append('<li rel_id="'+item.upload_id+'" rel_position="'+count+'"><a href="javascript:void(0)" data-article-id="" data-image-id="'+item.upload_id+'" data-image-name="'+item.file_name+'" data-image-section="'+item.upload_to+'"  class="close-btn confirm_image_delete"><i class="fas fa-times"></i></a><img src="'+img_src+'" alt=""><figcaption><h6>'+item.file_name+'</h6><p>File Size: '+item.file_size+' <br>Uploaded: '+timeStp+'</p></figcaption></li>');
                $('#portfolioImgList').append('<li rel_id="'+item.upload_id+'" rel_position="'+count+'"><a href="javascript:void(0)" data-article-id="" data-image-id="'+item.upload_id+'" data-image-name="'+item.file_name+'" data-image-section="'+item.upload_to+'"  class="close-btn confirm_image_delete"><i class="fas fa-times"></i></a><img src="'+img_src+'" alt=""><figcaption><h6>'+item.file_name+'</h6></figcaption></li>');
            });
            image_name = image_name+','+portfolio_image_name;
            upload_id = upload_id+','+portfolio_image_id;
            actual_image = image_name.replace(/(^,)|(,$)/g, "");
            actual_id = upload_id.replace(/(^,)|(,$)/g, "");
            $('#portfolio_image_name').val(actual_image);
            $('#portfolio_image_id').val(actual_id);
            $('#portfolioImgDiv').show();
            //reindex_prop_img_list();
        }
    }
}