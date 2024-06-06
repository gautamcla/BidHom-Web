$(function() {

    $.validator.addMethod("acceptcharacters", function (value, element)
    {
        return this.optional(element) || /^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-,.!_@ ])*$/.test(value);
    }, "Letters and spaces only please");


    $.validator.addMethod("numberpass",
        function(value, element, param) {
           if (!/[0-9]/.test(value)) {
                return false;
            }
            return true;
    },"Include at least 1 number.");

    $.validator.addMethod("noSpace", function(value, element) {
        return value.indexOf(" ") < 0 && value != "";
    }, "No space please");
    // handle edit category type
    $('.edit-category').on('click', function(){
        dataId= $(this).data("id");
        $('#add_estimator_category_frm #estimator_category_id').val(dataId);
        $.ajax({
            url: '/admin/get-estimator-category-details/',
            type: 'post',
            dataType: 'json',
            data:{category_id: dataId},
            cache: false,
            beforeSend: function(){
               $(".loaderDiv").show();
            },
            success: function(response){
                $(".loaderDiv").hide();
                if(response.error == 0){
                    // set data sets
                    var category_name = '';
                    var status = '';
                    if(response.category_details[0].name){
                        category_name = response.category_details[0].name;
                    }
                    if(response.category_details[0].status){
                        status = response.category_details[0].status;
                    }
                    $('#add_estimator_category_frm #estimator_category_id').val(dataId);
                    $('#add_estimator_category_frm #category_name').val(category_name);
                    $('#add_estimator_category_frm #is_active').val(status);
                }else{
                    $('#add_estimator_category_frm #category_name').val('');
                }
                $('#estimatorCategoryModal .modal-title').html('Edit Estimator Category');
                $('#estimatorCategoryModal #submitCategory').html('Save Changes');
                $('#estimatorCategoryModal').modal('show');
            }
        });
    });
    $(document).on('click', '#addEstimatorCategory', function(){
        $('#add_estimator_category_frm #estimator_category_id').val('');
        $('#add_estimator_category_frm #category_name').val('');
        $('#estimatorCategoryModal .modal-title').html('Add Estimator Category');
        $('#estimatorCategoryModal #submitCategory').html('<i class="fa fa-plus"></i> Add');
        $('#estimatorCategoryModal').modal('show');
    });
    $(document).on("click", ".page-link", function(e) {
        var page_number = $(this).attr('data');
        var page_type = $(this).attr('data-type');
        var page_sub_type = $(this).attr('data-sub-type');

        if (page_type == "estimator_category") {
            if (page_sub_type == "estimator_category_list") {
                $("#page-category-list").val(page_number);
                ajax_estimate_category_list();
            }
        }
    });
    $('#add_estimator_category_frm').validate({
        ignore: [],
        errorElement: 'p',
        rules:{
            category_name: {
                required: true,
                maxlength:40,
            },
        },
        messages: {
            category_name: {
                required: "Category Name is required",
                maxlength: "Please enter at most 40 char",
            },
        },
        errorPlacement: function(error, element) {
            error.insertAfter(element.next('.error'));
        },
        submitHandler:function(){
            $.ajax({
                url: '/admin/save-estimator-category/',
                type: 'post',
                dataType: 'json',
                cache: false,
                data: $('#add_estimator_category_frm').serialize(),
                beforeSend: function () {
                    $(':submit').attr('disabled', 'disabled');
                    $('.loaderDiv').show();
                },
                complete: function () {
                    //$.unblockUI();
                    $(':submit').removeAttr('disabled');

                },
                success: function(response){
                    $('.loaderDiv').hide();
                    if(response.error == 0){
                        $('.message_box').html('<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>'+response.msg);
                        $('.message_box').addClass('alert-success').removeClass('alert-danger').show();

                    }else{
                        $('.message_box').html('<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button>'+response.msg);
                        $('.message_box').removeClass('alert-success').addClass('alert-danger').show();

                    }
                    window.setTimeout(function () {
                         $('.message_box').hide();
                         $('#estimatorCategoryModal').modal('hide');
                         window.location.reload();
                    }, 2000);


                }
            });

        }
      });

});
function ajax_estimate_category_list(){
    var search = $("#category_search").val();;
    var status = $('option:selected','#category_status').val();
    var page = $("#page-category-list").val();
    $.ajax({
        url: '/admin/estimator-category-list/',
        type: 'post',
        dataType: 'json',
        data:{search: search, page: page, page_size: 20,status: status},
        cache: false,
        beforeSend: function(){
           $(".loaderDiv").show();
        },
        success: function(response){
            $(".loaderDiv").hide();
            if(response.error == 0){
                // set data sets
                $('#estimatorCategoryList').html(response.estimator_listing_html);
                $('#estimatorCategoryPagination').html(response.pagination_html);
            }else{
                $('#estimatorCategoryList').html('<tr><td class=" ">No Category available </td></tr>');
                $('#estimatorCategoryPagination').html('');
            }
            $("#estimatorCategoryList").find('script').remove();
        }
    });
}
