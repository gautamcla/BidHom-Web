var currpage = 1;
var recordPerpage = 10;
$(document).ready(function(){
    try{
        CKEDITOR.on( 'instanceReady', function(e) {
            $('iframe', e.editor.container.$).contents().on('click', function() {
                e.editor.focus();
            });
        });
    }catch(ex){
        console.log(ex);
    }
    $('#add_template_form').validate({
            ignore: [],
            errorElement: 'p',
            rules: {
                subject:{
                    required: true
                },
                event_name:{
                    required: true
                },
                /*notification_text:{
                    required:true
                },
                push_notification_text:{
                    required:true
                },*/
                email_content:{
                    required:true
                },
                template_status:{
                    required:true
                }
            },
            messages: {
                subject:{
                    required: "Subject is required."
                },
                event_name:{
                    required: "Event is required."
                },
                /*notification_text:{
                    required: "Notification Text is required."
                },
                push_notification_text:{
                    required: "Push Notification Text is required."
                },*/
                email_content:{
                    required: "Content is required"
                },
                template_status:{
                    required: "Status is required"
                }
            },
            errorPlacement: function(error, element) {
                if(element.hasClass('select')){
                    error.insertAfter(element.next('.chosen-container'));
                }else if(element.hasClass('ckeditor')){
                    error.insertAfter(element.next('.cke_1'));
                }else{
                    error.insertAfter(element);
                }
            },
            submitHandler:function(){
                for (instance in CKEDITOR.instances){
                    CKEDITOR.instances[instance].updateElement();
                }
                var flag = true;

                if(flag == true){
                    $.ajax({
                        url: '/admin/add-template/',
                        type: 'post',
                        dataType: 'json',
                        cache: false,
                        data: $('#add_template_form').serialize(),
                        beforeSend: function(){
                            $('.overlay').show();
                        },
                        success: function(response){
                            $('.overlay').hide();
                            if(response.error == 0 || response.status == 200 || response.status == 201){

                                $.growl.notice({title: "Email Template ", message: "Template saved successfully", size: 'large'});
                                window.setTimeout(function () {
                                    window.location.href = '/admin/email-template/';
                                }, 2000);

                            }else{
                                window.setTimeout(function () {
                                    $.growl.error({title: "Email Template ", message: response.msg, size: 'large'});
                                }, 2000);
                            }
                        }
                    });
                }

            }
        });

        $(document).on('keyup', '#template_search', function(e){
              var x = document.getElementById(this.id + "autocomplete-list");
              if (x) x = x.getElementsByTagName("div");
              if (e.keyCode == 40) {
                /*If the arrow DOWN key is pressed,
                increase the currentFocus variable:*/
                currentFocus++;
                /*and and make the current item more visible:*/
                addActive(x);
              } else if (e.keyCode == 38) { //up
                /*If the arrow UP key is pressed,
                decrease the currentFocus variable:*/
                currentFocus--;
                /*and and make the current item more visible:*/
                addActive(x);
              } else if (e.keyCode == 13) {
                /*If the ENTER key is pressed, prevent the form from being submitted,*/
                e.preventDefault();
                if (currentFocus > -1) {
                  /*and simulate a click on the "active" item:*/
                  if (x) x[currentFocus].click();
                }
              }else{
                var search = $(this).val();
                $.ajax({
                    url: '/admin/template-search-suggestion/',
                    type: 'post',
                    dataType: 'json',
                    cache: false,
                    data: {'search': search},
                    beforeSend: function(){

                    },
                    success: function(response){
                        if(response.error == 0 && response.status == 200){
                            autocomplete("template_search", response.suggestion_list);
                        }else{
                            closeAllSuggestions('autocomplete-items');
                        }
                    }
                });
              }

      });
});
function templateListingSearch(current_page){
        var search = $('#template_search').val();
        var currpage = current_page;
        if($('#template_num_record').val() != ""){
            recordPerpage = $('#template_num_record').val();
        }
        var status = $('#template_filter_status').val();
        $.ajax({
            url: '/admin/email-template/',
            type: 'post',
            dataType: 'json',
            cache: false,
            data: {search: search, perpage: recordPerpage, status: status, page: currpage},
            beforeSend: function(){
                $('.overlay').show();
            },
            success: function(response){
                $('.overlay').hide();
                console.log(response);
                if(response.error == 0){
                    $('#template_list').empty();
                    $('#template_pagination_list').empty();
                    if($('#template_num_record').val() != ""){
                        recordPerpage = $('#template_num_record').val();
                    }
                    $("#template_list").html(response.template_listing_html);
                    $("#template_pagination_list").html(response.pagination_html);


                }else{
                    $('#template_list').html('<div class="block-item"><div class="item fullwidth"><img src="/static/admin/images/no-data-image.png" class=" center mb0" /></div></div>');
                }
                $("#template_list").find('script').remove();
                $(window).scrollTop(0);
            }
        });
    }