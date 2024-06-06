
try{
    Dropzone.autoDiscover = false;
}catch(ex){
    //console.log(ex);
}
$(document).ready(function(){
    try{
        CKEDITOR.env.isCompatible = true;
    }catch(ex){
        console.log("cked: "+ex);
    }
    convert_bidding_date('publish_date');
    article_image_params = {
        url: '/admin/save-images/',
        field_name: 'testimonial_img',
        file_accepted: '.png, .jpg, .jpeg, .svg',
        element: 'articleImgFrm',
        upload_multiple: false,
        max_files: 1,
        call_function: set_article_image_details,
        default_message: '<i class="fa fa-upload" aria-hidden="true"></i> Upload Favicon',
    }
    author_image_params = {
        url: '/admin/save-images/',
        field_name: 'testimonial_author_img',
        file_accepted: '.png, .jpg, .jpeg, .svg',
        element: 'articleAuthorImgFrm',
        upload_multiple: false,
        max_files: 1,
        call_function: set_author_image_details,
        default_message: '<i class="fa fa-upload" aria-hidden="true"></i> Upload Favicon',
    }
    try{
        initdrozone(article_image_params);
    }catch(ex){
        //console.log(ex);
    }
    try{
        initdrozone(author_image_params);
    }catch(ex){
        //console.log(ex);
    }
    $.validator.addMethod("articleDesc", function (value, element) {
        if(CKEDITOR.instances['article_description'].getData() == "" ){
          return false;
        } else {
            return true;
        }
    }, "Description is required.");
    $.validator.setDefaults({ ignore: ":hidden:not(select)" })
    $('#article_frm').validate({
        ignore: [],
        errorElement: 'p',
        rules: {
            asset:{
                required: true
            },
            article_title:{
                required: true
            },
            author_name:{
                required: true,
                accept: true
            },
            article_description:{
                articleDesc: true
            },
            virtual_publish_date:{
                // required: function () {
                //     if (parseInt($('#article_status').val()) == 1) {
                //         return true;
                //     } else {
                //         return false;
                //     }
                // }
                required: true
            },
            article_status:{
                required:true
            }
        },
        messages: {
            asset:{
                required: "Category is required."
            },
            article_title:{
                required: "Title is required."
            },
            author_name:{
                required: "Author Name is required.",
                accept: "Invalid Author Name"
            },
            article_description:{
                required:"Description is required."
            },
            virtual_publish_date:{
                required: "Publish Date is required"
            },
            article_status:{
                required:"Status is required"
            }
        },
        errorPlacement: function(error, element) {
            if(element.parent().hasClass('date')){
                error.insertAfter(element.parent());
            }else if(element.is('.select')) {
                error.insertAfter(element.siblings('[class*="chosen-container"]:eq(0)'));
            }else if(element.is('.article_description')){
                error.insertAfter(element.siblings('[id*="cke_article_description"]:eq(0)'));
            }else{
                //console.log(element);
                error.insertAfter(element);
            }
        },
        submitHandler: function(){
            var flag = true;
            var article_image_name = $('#article_image_name').val();
            var article_author_image_name = $('#article_author_image_name').val();
            if(article_image_name == ""){
                $('#custom_article_img_error').show();
                flag = false;
            }else{
                $('#custom_article_img_error').hide();
            }
            if(article_author_image_name == ""){
                $('#custom_author_img_error').show();
                flag = false;
            }else{
                $('#custom_author_img_error').hide();
            }
            var crp_exp_dates = $("#virtual_publish_date").val();
            if(crp_exp_dates != ""){
                var actualCrpExpDate = crp_exp_dates.split(" ");
                var change_format = actualCrpExpDate[0].split("-");
                var new_format = change_format[2]+"-"+change_format[0]+"-"+change_format[1];
                actualCrpExpDate = new_format + ' ' + convert_to_24h(actualCrpExpDate[1] + ' ' + actualCrpExpDate[2]);
                var actualCrpExpDateUtc = convert_to_utc_datetime(actualCrpExpDate, 'datetime');
                //var actualEndDateUtc = convert_to_utc_date(actualEndDate, 'mm-dd-yyyy', 'datetime');
                $("#publish_date").val(actualCrpExpDateUtc);
                $("#publish_date_local").val(actualCrpExpDate);
            }else{
                $("#virtual_publish_date").val('');
                $("#publish_date").val('');
                $("#publish_date_local").val('');
            }
            if(flag === true && $('#article_frm').valid()){
                for (instance in CKEDITOR.instances){
                    CKEDITOR.instances[instance].updateElement();
                }
                $.ajax({
                    url: '/admin/add-blog/',
                    type: 'post',
                    dataType: 'json',
                    cache: false,
                    data: $('#article_frm').serialize(),
                    beforeSend: function(){
                        $('.overlay').show();
                    },
                    success: function(response){
                        $('.overlay').hide();
                        if(response.error == 0 || response.status == 200 || response.status == 201){

                            $.growl.notice({title: "Blogs ", message: response.msg, size: 'large'});

                            window.setTimeout(function () {
                                window.location.href = '/admin/blogs/';
                            }, 2000);
                        }else{
                            window.setTimeout(function () {
                                $.growl.error({title: "Blogs ", message: response.msg, size: 'large'});
                            }, 2000);
                        }
                    }
                });
            }
        }
    });
    // ---------------Add Testimonials---------------
    $('#testimonials_frm').validate({
        rules: {
            type:{
                required: true
            },
            author_name:{
                required: true,
                accept: true
            },
            testimonial_description:{
                articleDesc: true
            },
            testimonial_status:{
                required:true
            }
        },
        messages: {
            type:{
                required: "Testimonial type is required."
            },
            author_name:{
                required: "Author Name is required.",
                accept: "Invalid Author Name"
            },
            testimonial_description:{
                required:"Description is required."
            },
            testimonial_status:{
                required:"Status is required"
            }
        },
        errorPlacement: function(error, element) {
            if(element.parent().hasClass('date')){
                error.insertAfter(element.parent());
            }else if(element.is('.select')) {
                error.insertAfter(element.siblings('[class*="chosen-container"]:eq(0)'));
            }else if(element.is('.testimonial_description')){
                error.insertAfter(element.siblings('[id*="cke_testimonial_description"]:eq(0)'));
            }else{
                //console.log(element);
                error.insertAfter(element);
            }
        },
        submitHandler: function(){
            var flag = true;
            var article_author_image_name = $('#article_author_image_name').val();

            if(article_author_image_name == ""){
                $('#custom_author_img_error').show();
                flag = false;
            }else{
                $('#custom_author_img_error').hide();
            }

            if(flag === true && $('#testimonials_frm').valid()){
                for (instance in CKEDITOR.instances){
                    CKEDITOR.instances[instance].updateElement();
                }
                $.ajax({
                    url: '/admin/add-testimonial/',
                    type: 'post',
                    dataType: 'json',
                    cache: false,
                    data: $('#testimonials_frm').serialize(),
                    beforeSend: function(){
                        $('.overlay').show();
                    },
                    success: function(response){
                        $('.overlay').hide();
                        if(response.error == 0 || response.status == 200 || response.status == 201){

                            $.growl.notice({title: "Testimonial ", message: response.msg, size: 'large'});

                            window.setTimeout(function () {
                                window.location.href = '/admin/testimonials/';
                            }, 2000);
                        }else{
                            window.setTimeout(function () {
                                $.growl.error({title: "Testimonial ", message: response.msg, size: 'large'});
                            }, 2000);
                        }
                    }
                });
            }
        }
    });

    $(document).on('change', '#article_status', function(){
        $('label[for="virtual_publish_date"] span').hide();
        if($(this).val() == '1'){
            $('label[for="virtual_publish_date"] span').show();
        }
    });
    $(document).on('keyup', '#article_search', function(e){
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
                    url: '/admin/blog-search-suggestion/',
                    type: 'post',
                    dataType: 'json',
                    cache: false,
                    data: {'search': search},
                    beforeSend: function(){

                    },
                    success: function(response){
                        if(response.error == 0 && response.status == 200){
                            autocomplete("article_search", response.suggestion_list);
                        }else{
                            closeAllSuggestions('autocomplete-items');
                        }
                    }
                });
              }

      });
    /*$('#article_frm').on('submit', function(event) {
        var flag = true;
        var article_image_name = $('#article_image_name').val();
        var article_author_image_name = $('#article_author_image_name').val();
        if(article_image_name == ""){
            $('#custom_article_img_error').show();
            flag = false;
        }else{
            $('#custom_article_img_error').hide();
        }
        if(article_author_image_name == ""){
            $('#custom_author_img_error').show();
            flag = false;
        }else{
            $('#custom_author_img_error').hide();
        }
        if(flag === true && $('#article_frm').valid()){
            for (instance in CKEDITOR.instances){
                CKEDITOR.instances[instance].updateElement();
            }
            $.ajax({
                url: '/admin/add-blog/',
                type: 'post',
                dataType: 'json',
                cache: false,
                data: $('#article_frm').serialize(),
                beforeSend: function(){

                },
                success: function(response){
                    if(response.error == 0 || response.status == 200 || response.status == 201){

                        $.growl.notice({title: "Articles ", message: response.msg, size: 'large'});

                        window.setTimeout(function () {
                            window.location.href = '/admin/articles/';
                        }, 2000);
                    }else{
                        window.setTimeout(function () {
                            $.growl.error({title: "Articles ", message: response.msg, size: 'large'});
                        }, 2000);
                    }
                }
            });
        }
    });
    $("#article_frm").validate();*/
    $(document).on('change', '#article_filter_status', function(){
            filter_article_list(1);
      });
      $(document).on('change', '#article_num_record', function(){
            filter_article_list(1);
      });
      $(document).on('click', '#searchArticleBtn', function(){
            filter_article_list(1);
      });

      $(document).on('click', '.del_article_btn', function(){
               var row_id = $(this).attr('rel_id');
               var search = $('#article_search').val();
                var perpage = $('#article_num_record').val();
                var status = $('#article_filter_status').val();
               if($(this).attr('id') == 'del_agent_true'){
                    $('#article_list #article_'+row_id).remove();
                    $.ajax({
                        url: '/admin/delete-article/',
                        type: 'post',
                        dataType: 'json',
                        cache: false,
                        data: {'user_id': row_id, search: search, perpage: perpage, status: status},
                        beforeSend: function(){
                            $('.overlay').show();
                        },
                        success: function(response){
                            $('.overlay').hide();
                            $('#del_article_true').removeAttr('rel_id');
                            $('#del_article_false').removeAttr('rel_id');
                            if(response.data.error == 0){
                                if(response.article_list){
                                    $('#article_list').empty();
                                    var all_row = '';
                                    var count = 0;
                                    $.each(response.article_list, function(i, item) {
                                        var name = '';
                                        var description = '';
                                        var added_on = '';
                                        count = count+1;
                                        if(item.first_name){
                                          name = item.first_name+' '+item.last_name;
                                        }
                                        if(item.article_image.image_name){
                                            article_img_src = aws_url+''+item.article_image.bucket_name+'/'+item.article_image.image_name;
                                        }else{
                                            article_img_src = '/static/admin/images/agent-pics.png';
                                        }
                                        if(item.author_image.image_name){
                                            author_img_src = aws_url+''+item.author_image.bucket_name+'/'+item.author_image.image_name;
                                        }else{
                                            author_img_src = '/static/admin/images/agent-pics.png';
                                        }
                                        if(item.description){
                                               description = item.description.slice(0,100);
                                        }
                                        if(item.added_on){
                                            try{
                                                added_on = getLocalDate(item.added_on, 'mm-dd-yyyy','ampm');
                                            }catch(ex){
                                                //console.log(ex);
                                            }
                                        }
                                        var category_name = '';
                                        if(item.category_name){
                                            category_name = item.category_name;
                                        }

                                        //all_row += '<div class="block-item" id="article_'+item.id+'"><div class="item">'+count+'</div><div class="item"><div class="user-pics agent-pics"><span class="user-pic"><img src="'+article_img_src+'" alt=""></span><h6><span>'+item.title+'</span></h6></div></div><div class="item"><div class="user-pics agent-pics"><span class="user-pic"><img src="'+author_img_src+'" alt=""></span><h6><span>'+item.author_name+'</span></h6></div></div><div class="item"><span class="badge badge-success">'+item.status+'</span></div><div class="item"><a href="/admin/add-blog/?id='+item.id+'" class="badge badge-info"><i class="far fa-edit"></i></a> <a href="javascript:void(0)" onclick="agent_delete_confirmation(\'' + item.id + '\')" class="badge badge-danger ml5"><i class="fas fa-trash-alt"></i></a></div></div>';
                                        all_row += '<div class="block-item" id="article_'+item.id+'"><div class="item">'+count+'</div><div class="item"><div class="user-pics agent-pics"><h6><span>'+item.title+'</span></h6></div></div><div class="item">'+category_name+'</div><div class="item"><div class="user-pics agent-pics"><h6><span>'+description+'</span></h6></div></div><div class="item"><div class="user-pics agent-pics"><h6><span>'+item.author_name+'</span></h6></div></div><div class="item convert_to_local_time">'+added_on+'</div><div class="item"><span class="badge badge-success">'+item.status+'</span></div><div class="item"><a href="/admin/add-blog/?id='+item.id+'" class="badge badge-info"><i class="far fa-edit"></i></a></div></div>';

                                    });
                                    $('#article_list').html(all_row);
                                }else{
                                    $('#article_list').html('<div class="block-item"><img src="/static/admin/images/no-data-image.png" alt=""></div>');
                                }
                                $.growl.notice({title: "Blogs ", message: response.data.msg, size: 'large'});
                                window.setTimeout(function () {
                                    $('#confirmArticleDeleteModal').modal('hide');
                                }, 2000);


                            }else{
                                $('#del_article_true').removeAttr('rel_id');
                                $('#del_article_false').removeAttr('rel_id');
                                $('#confirmArticleDeleteModal').modal('hide');
                                window.setTimeout(function () {
                                    $.growl.error({title: "Blog ", message: response.msg, size: 'large'});
                                }, 2000);

                            }
                        }
                    });
               }else{
                    $('#del_article_true').removeAttr('rel_id');
                    $('#del_article_false').removeAttr('rel_id');
                    $('.personalModalwrap').modal('hide');
                    return false;
               }

        });
});

function filter_article_list(page){
    var search = $('#article_search').val();
    var perpage = $('#article_num_record').val();
    var status = $('#article_filter_status').val();
    var page = page;
    if(perpage === '')
    {
        perpage =  10;
    }
    $.ajax({
        url: '/admin/blogs/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {search: search, perpage: perpage, status: status, page: page},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            if(response.error == 0){
                $("#article_listing_pagination_list").empty();    
                if(response.article_list.length > 0){
                    $('#article_list').empty();
                    var all_row = '';
                    var count = ((page) - 1) * perpage + 1;
                    $.each(response.article_list, function(i, item) {
                        var name = '';
                        var description = '';
                        //count = count+1;
                        try{
                            var added_on = getLocalDate(item.added_on, 'mm-dd-yyyy','ampm');
                        }catch(ex){
                            var added_on = '';
                        }
                        try{
                            var publish_date = getLocalDate(item.publish_date, 'mm-dd-yyyy','ampm');
                        }catch(ex){
                            var publish_date = '';
                        }
                        if(item.first_name){
                          name = item.first_name+' '+item.last_name;
                        }
                        if(item.article_image.image_name){
                            article_img_src = aws_url+''+item.article_image.bucket_name+'/'+item.article_image.image_name;
                        }else{
                            article_img_src = '/static/admin/images/agent-pics.png';
                        }
                        if(item.author_image.image_name){
                            author_img_src = aws_url+''+item.author_image.bucket_name+'/'+item.author_image.image_name;
                        }else{
                            author_img_src = '/static/admin/images/agent-pics.png';
                        }
                        if(item.description){
                               description = item.description.slice(0,100);
                        }
                        var category_name = '';
                        if(item.category_name){
                            category_name = item.category_name;
                        }
                        var status_class = 'badge badge-success';
                        if(item.status.toLowerCase() != 'active'){
                             status_class = 'badge badge-danger';
                        }

                        //all_row += '<div class="block-item" id="article_'+item.id+'"><div class="item">'+count+'</div><div class="item"><div class="user-pics agent-pics"><span class="user-pic"><img src="'+article_img_src+'" alt=""></span><h6><span>'+item.title+'</span></h6></div></div><div class="item"><div class="user-pics agent-pics"><span class="user-pic"><img src="'+author_img_src+'" alt=""></span><h6><span>'+item.author_name+'</span></h6></div></div><div class="item"><span class="badge badge-success">'+item.status+'</span></div><div class="item"><a href="/admin/add-blog/?id='+item.id+'" class="badge badge-info"><i class="far fa-edit"></i></a> <a href="javascript:void(0)" onclick="agent_delete_confirmation(\'' + item.id + '\')" class="badge badge-danger ml5"><i class="fas fa-trash-alt"></i></a></div></div>';
                        //all_row += '<div class="block-item" id="article_'+item.id+'"><div class="item">'+count+'</div><div class="item"><div class="user-pics agent-pics"><span class="user-pic"><img src="'+article_img_src+'" alt=""></span><h6><span>'+item.title+'</span></h6></div></div><div class="item"><div class="user-pics agent-pics"><span class="user-pic"><img src="'+author_img_src+'" alt=""></span><h6><span>'+item.author_name+'</span></h6></div></div><div class="item"><span class="badge badge-success">'+item.status+'</span></div><div class="item"><a href="/admin/add-blog/?id='+item.id+'" class="badge badge-info"><i class="far fa-edit"></i></a> </div></div>';
                        // all_row += '<div class="block-item" id="article_'+item.id+'"><div class="item">'+count+'</div><div class="item"><div class="user-pics agent-pics"><h6><span>'+item.title+'</span></h6></div></div><div class="item"><div class="user-pics agent-pics"><h6><span>'+description+'</span></h6></div></div><div class="item"><div class="user-pics agent-pics"><h6><span>'+item.author_name+'</span></h6></div></div><div class="item convert_to_local_time">'+added_on+'</div><div class="item"><span class="badge badge-success">'+item.status+'</span></div><div class="item"><a href="/admin/add-blog/?id='+item.id+'" class="badge badge-info"><i class="far fa-edit"></i></a></div></div>';
                        all_row += '<div class="block-item" id="article_'+item.id+'"><div class="item">'+count+'</div><div class="item"><div class="user-pics agent-pics"><h6><span>'+item.title+'</span></h6></div></div><div class="item">'+category_name+'</div><div class="item"><div class="user-pics agent-pics"><h6><span>'+item.author_name+'</span></h6></div></div><div class="item convert_to_local_time">'+publish_date+'</div><div class="item convert_to_local_time">'+added_on+'</div><div class="item"><span class="'+status_class+'">'+item.status+'</span></div><div class="item"><a href="/admin/add-blog/?id='+item.id+'" class="badge badge-info"><i class="far fa-edit"></i></a></div></div>';
                        count = count+1;
                    });
                    $('#article_list').html(all_row);
                    $("#article_listing_pagination_list").html(response.pagination_html);
                }else{
                    $('#article_list').html('<div class="block-item"><img src="/static/admin/images/no-data-image.png" alt=""></div>');
                    $("#article_listing_pagination_list").hide();
                }

            }else{
                $('#article_list').html('<div class="block-item"><img src="/static/admin/images/no-data-image.png" alt=""></div>');
                $("#article_listing_pagination_list").hide();
            }
            $(window).scrollTop(0);
        }
    });
}
// -------------------------Testimonials Listing-----------------------
$(document).on('change', '#testimonials_filter_status', function(){
    filter_testimonials_list(1);
});
$(document).on('change', '#testimonials_num_record', function(){
    filter_testimonials_list(1);
});
$(document).on('click', '#testimonialsSearchArticleBtn', function(){
    filter_testimonials_list(1);
});
function filter_testimonials_list(page){
    var search = $('#testimonials_article_search').val();
    var perpage = $('#testimonials_num_record').val();
    var status = $('#testimonials_filter_status').val();
    var page = page;
    if(perpage === '')
    {
        perpage =  10;
    }
    $.ajax({
        url: '/admin/testimonials/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {search: search, perpage: perpage, status: status, page: page},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            if(response.error == 0){
                $("#testimonials_listing_pagination_list").empty();
                if(response.article_list.length > 0){
                    $('#testimonials_list').empty();
                    var all_row = '';
                    var count = ((page) - 1) * perpage + 1;
                    $.each(response.article_list, function(i, item) {
                        var name = '';
                        var description = '';
                        //count = count+1;
                        try{
                            var added_on = getLocalDate(item.added_on, 'mm-dd-yyyy','ampm');
                        }catch(ex){
                            var added_on = '';
                        }

                        if(item.first_name){
                          name = item.first_name+' '+item.last_name;
                        }

                        if(item.author_image.image_name){
                            author_img_src = aws_url+''+item.author_image.bucket_name+'/'+item.author_image.image_name;
                        }else{
                            author_img_src = '/static/admin/images/agent-pics.png';
                        }
                        if(item.description){
                               description = item.description.slice(0,100);
                        }

                        var type = '';
                        if(item.type){
                            type = item.type;
                        }
                        var status_class = 'badge badge-success';
                        if(item.status.toLowerCase() != 'active'){
                             status_class = 'badge badge-danger';
                        }
                        //all_row += '<div class="block-item" id="article_'+item.id+'"><div class="item">'+count+'</div><div class="item"><div class="user-pics agent-pics"><h6><span>'+item.title+'</span></h6></div></div><div class="item">'+category_name+'</div><div class="item"><div class="user-pics agent-pics"><h6><span>'+item.author_name+'</span></h6></div></div><div class="item convert_to_local_time">'+publish_date+'</div><div class="item convert_to_local_time">'+added_on+'</div><div class="item"><span class="'+status_class+'">'+item.status+'</span></div><div class="item"><a href="/admin/add-blog/?id='+item.id+'" class="badge badge-info"><i class="far fa-edit"></i></a></div></div>';
                        all_row += '<div class="block-item" id="article_'+item.id+'"><div class="item">'+count+'</div><div class="item">'+type+'</div><div class="item"><div class="user-pics agent-pics"><h6><span>'+item.author_name+'</span></h6></div></div><div class="item convert_to_local_time">'+added_on+'</div><div class="item"><span class="'+status_class+'">'+item.status+'</span></div><div class="item"><a href="/admin/add-testimonial/?id='+item.id+'" class="badge badge-info"><i class="far fa-edit"></i></a></div></div>';
                        count = count+1;
                    });
                    $('#testimonials_list').html(all_row);
                    $("#testimonials_listing_pagination_list").html(response.pagination_html);
                }else{
                    $('#testimonials_list').html('<div class="block-item"><img src="/static/admin/images/no-data-image.png" alt=""></div>');
                    $("#article_listing_pagination_list").hide();
                }

            }else{
                $('#testimonials_list').html('<div class="block-item"><img src="/static/admin/images/no-data-image.png" alt=""></div>');
                $("#testimonials_listing_pagination_list").hide();
            }
            $(window).scrollTop(0);
        }
    });
}
function set_article_image_details(response){
    var image_name = '';
    var actual_image = '';
    var upload_id = '';
    var actual_id = '';
    var upload_to = '';
    var article_image_name = $('#article_image_name').val();
    if(response.status == 200){
        $('#custom_article_img_error').hide();
        if(response.uploaded_file_list){
            $.each(response.uploaded_file_list, function(i, item) {
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
                upload_to = item.upload_to;
            });

            actual_image = image_name.replace(/(^,)|(,$)/g, "");
            actual_id = upload_id.replace(/(^,)|(,$)/g, "");


            $('#article_image_name').val(actual_image);
            $('#article_image_id').val(upload_id);
            if(actual_image){
                var logo_img = aws_url+"testimonial_img/"+actual_image;
                $('#articleImg').attr('src', logo_img);
                $('#articleImg').show();
                $('#articleDelImgBtn').show();
            }
            $('#articleImgDiv .article-img a').attr({ 'data-image-id': $('#article_image_id').val(), 'data-image-name':$('#article_image_name').val(), 'data-image-section': upload_to, 'data-count': '' }).addClass('confirm_image_delete');
        }
    }
}
function set_author_image_details(response){

    var image_name = '';
    var actual_image = '';
    var upload_id = '';
    var actual_id = '';
    var upload_to = '';
    var article_author_image_name = $('#article_author_image_name').val();
    if(response.status == 200){
        $('#custom_author_img_error').hide();
        if(response.uploaded_file_list){
            $.each(response.uploaded_file_list, function(i, item) {
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
                upload_to = item.upload_to;
            });
            actual_image = image_name.replace(/(^,)|(,$)/g, "");
            actual_id = upload_id.replace(/(^,)|(,$)/g, "");
            $('#article_author_image_name').val(actual_image);
            $('#article_author_image_id').val(upload_id);
            if(actual_image){
                var logo_img = aws_url+"testimonial_author_img/"+actual_image;
                $('#articleAuthorImg').attr('src', logo_img);
                $('#articleAuthorImg').show();
                $('#articleAuthorDelImgBtn').show();
            }
            $('#articleAuthorImgDiv .article-img a').attr({ 'data-image-id': $('#article_author_image_id').val(), 'data-image-name':$('#article_author_image_name').val(), 'data-image-section': upload_to, 'data-count': '' }).addClass('confirm_image_delete');
        }
    }
}