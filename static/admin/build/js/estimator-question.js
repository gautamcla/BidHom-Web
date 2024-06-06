$(function() {
    try{
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
    }catch(ex){

    }


    $(document).on("click", ".page-link", function(e) {
        var page_number = $(this).attr('data');
        var page_type = $(this).attr('data-type');
        var page_sub_type = $(this).attr('data-sub-type');

        if (page_type == "estimator_question") {
            if (page_sub_type == "estimator_question_list") {
                $("#page-question-list").val(page_number);
                ajax_estimate_question_list();
            }
        }
    });
    $(document).on("click", "#option_type", function(e) {
        var option_type = $('option:selected',this).val();
        if(parseInt(option_type) == 2 || parseInt(option_type) == 3){
            //$('.add_more_option_value').show();
            $('#option_value_section').empty();
            $('#option_value_section').html('<div class="add_more_option_value" id="add_more_option_value_0" rel_position="0"><input type="hidden" class="row_id" name="row_id_0" id="row_id_0" value=""/><div class="item form-group"><label class="col-md-3 col-sm-3 col-xs-12" for="option_value_0">Option Value <span class="required">*</span></label><div class="col-md-6 col-sm-6 col-xs-12"><input id="option_value_0" class="form-control col-md-7 col-xs-12 option_value" data-parsley-trigger="keyup" name="option_value_0" placeholder="Enter Option Value" required="required" type="text"></div><div class="plus_option_div multi-btn col-md-1 col-sm-1 col-xs-12" style=""><button type="button" class="btn btn-secondary add_more"><i class="fas fa-plus"></i></button></div><div class="minus_option_div multi-btn col-md-1 col-sm-1 col-xs-12" style="display:none;"><button type="button" class="btn btn-secondary remove" onclick="confirm_delete_option(this)"><i class="fas fa-times"></i></button></div></div></div>');
            //$('#option_value_section').html('<div class="add_more_option_value" id="add_more_option_value_0" rel_position="0"><input type="hidden" class="row_id" name="row_id_0" id="row_id_0" value=""/><div class="item form-group"><label class="col-md-3 col-sm-3 col-xs-12" for="option_value_0">Option Value <span class="required">*</span></label><div class="col-md-6 col-sm-6 col-xs-12"><input id="option_value_0" class="form-control col-md-7 col-xs-12 option_value" data-parsley-trigger="keyup" name="option_value_0" placeholder="Enter Option Value" required="required" type="text"></div><div class="plus_option_div multi-btn col-md-1 col-sm-1 col-xs-12" style=""><button type="button" class="btn btn-secondary add_more"><i class="fas fa-plus"></i></button></div><div class="minus_option_div multi-btn col-md-1 col-sm-1 col-xs-12" style="display:none;"><button type="button" class="btn btn-secondary remove" onclick="confirm_delete_option(this)"><i class="fas fa-times"></i></button></div></div></div>');
            $('#total_option').val(1);
        }else{
            //$('.add_more_option_value').hide();
            $('#option_value_section').empty();
        }
    });
    $('#addEstimatorQuestion').validate({
        ignore: [],
        errorElement: 'p',
        rules:{
            question_category: {
                required: true,
                maxlength: 40,
            },
        },
        messages: {
            question_category: {
                required: "Category Name is required",
                maxlength: "Please enter at most 40 char",
            },
        },
        errorPlacement: function(error, element) {
            error.insertAfter(element.next('.error'));
        },
        submitHandler:function(){
            $.ajax({
                url: '/admin/save-estimator-question/',
                type: 'post',
                dataType: 'json',
                cache: false,
                data: $('#addEstimatorQuestion').serialize(),
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
                         window.location.href = '/admin/estimator-question-list/';
                    }, 2000);


                }
            });

        }
      });
      $(document).on('click', ".plus_option_div", function () {
            var new_div = $(".add_more_option_value:last").clone().insertAfter(".add_more_option_value:last");
            var count = parseInt($('#total_option').val());
            $(".plus_option_div").hide();
            $(".plus_option_div:first").show();
            $(".minus_option_div").show();
            $(".minus_option_div:first").hide();
            new_div.attr('id', 'add_more_option_value_' + count).attr('rel_position', count);
            new_div.find(".row_id").attr('id', 'row_id_' + count).attr('name','row_id_'+count);
            new_div.find(".option_value").attr('id', 'option_value_' + count).attr('name','option_value_'+count).parent().siblings('label').attr('for', 'option_value_' + count);
            $('#option_value_' + count).val('');
            $('#row_id_' + count).val('');

            count = count+1;
            $('#total_option').val(count);
        });
        $(document).on('click', '.del_option_btn', function(){
            var row_id = $(this).attr('del_element_id');

            if($(this).attr('id') == 'del_option_true'){
                $('#'+row_id).remove();
                var total_section = parseInt($('div.add_more_option_value').length);
                $('#confirmDateDeleteModal').modal('hide');
                $(".add_more_option_value").each(function(index){
                  $(this).find('.option_value').attr('id','option_value_'+index).attr('name','option_value_'+index).parent().siblings('label').attr('for','option_value_'+index);
                  $(this).attr('id','add_more_option_value_'+index).attr('rel_position', index);

                });
                $('#total_option').val(total_section);
            }else{
                $(this).attr('del_element_id', '');
                $('#confirmDateDeleteModal').modal('hide');
            }
        });

});
function ajax_estimate_question_list(){
    var search = $("#question_search").val();;
    var status = $('option:selected','#question_status').val();
    var page = $("#page-question-list").val();
    $.ajax({
        url: '/admin/estimator-question-list/',
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
                $('#estimatorQuestionList').html(response.estimator_listing_html);
                $('#estimatorQuestionPagination').html(response.pagination_html);
            }else{
                $('#estimatorQuestionList').html('<tr><td class=" ">No Category available </td></tr>');
                $('#estimatorQuestionPagination').html('');
            }
            $("#estimatorQuestionList").find('script').remove();
        }
    });
}
function confirm_delete_option(element){
    var del_element = $(element).closest('.add_more_option_value').attr('id');
    $('.del_option_btn').attr('del_element_id', del_element);
    $('#confirmDateDeleteModal').modal('show');
}
