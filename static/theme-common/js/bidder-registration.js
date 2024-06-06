var click_count = 1;
$(document).ready(function(){
    $("#phone").inputmask('(999) 999-9999');
    $("#agent_buyer_phone").inputmask('(999) 999-9999');
    $('.nav').nav();
    $('.select').chosen();
    /*$('.chosen-select').chosen({
       search_contains: true,
      placeholder_text_single: "Select",
      no_results_text: "Oops, nothing found!"
    });*/
    $('.bidding-tab li:first').addClass('active');
      $('.bidding-body > div').hide();
      $('.bidding-body > div:first').show();


        check_first_accordion_completed();
        check_second_accordion_completed();

      $('input').on('keyup',function(){
        check_first_accordion_completed();
        check_second_accordion_completed();
      });
      $('.select').on('change',function(){
        check_first_accordion_completed();
        check_second_accordion_completed();
      });
      /*$('.panel-title a').on('click',function(){
        if($(this).hasClass('collapsed') === true && $(this).attr('href') == '#collapseOne'){
            //$('.edit-link').hide();
        }else{
            //$('.edit-link').show();
        }
      });*/
      $('.bidding-tab a').click(function() {
      var current_element = $(this).attr('href');
        var reg_id = $('#bidderRegFrm #reg_id').val();
        var is_uploaded = $('#is_uploaded').val();
        if(current_element == '#proff-funds'){
            data = {
                first_name: 'first_name',
                last_name: 'last_name',
                email: 'email',
                phone: 'phone',
                address: 'address',
                bidder_zip_code: 'bidder_zip_code',
                city: 'city',
                state: 'state',
            }
            if($('#agent_buyer_info').is(':visible')){
                data.agent_buyer_first_name = 'agent_buyer_first_name';
                data.agent_buyer_last_name = 'agent_buyer_last_name';
                data.agent_buyer_email = 'agent_buyer_email';
                data.agent_buyer_phone = 'agent_buyer_phone';
                data.agent_buyer_address = 'agent_buyer_address';
                data.agent_buyer_city = 'agent_buyer_city';
                data.agent_buyer_zipcode = 'agent_buyer_zipcode';
                data.agent_buyer_state = 'agent_buyer_state';
                if($('#agent_buyer_company_section').is(':visible')){
                    data.agent_buyer_company_name = 'agent_buyer_company_name';
                }
            }
            data.correct_info = 'correct_info';
            validate_bidder_form(data);
        }
        if((current_element == '#get-started' && reg_id == "") && (is_uploaded == "" || parseInt(is_uploaded) == 0)){
          var activeTab = $(this).attr('href');
          $('.bidding-tab li').removeClass('active');
          $(this).parent().addClass('active');

          $('.bidding-body > div:visible').hide();

          $(activeTab).show();

          return false;
        }else if((current_element == '#proff-funds' && $('#bidderRegFrm').valid()) && (is_uploaded == "" || parseInt(is_uploaded) == 0)){

              if(reg_id != ''){
                //$('#submitBidderReg').html('Save And Exit');
                $('#bidderPreviousBtn').hide();
              }else{
                //$('#submitBidderReg').html('Submit');
                $('#bidderPreviousBtn').show();
              }
              var activeTab = $(this).attr('href');
              $('.bidding-tab li').removeClass('active');
              $(this).parent().addClass('active');
              if(click_count == 1){
                $('input[name="is_submit_proof_fund"][value="0"]').trigger("click");
                $('#doc_reason_section').show();
                click_count = 2;
              }

              $('.bidding-body > div:visible').hide();
              $(activeTab).show();
              set_bidder_info();
              return false;
        }

      });

      $(document).on('click', '#bidderPreviousBtn', function(){
          var reg_id = $('#bidderRegFrm #reg_id').val();
          var is_uploaded = $('#is_uploaded').val();

          if((reg_id == "") && (is_uploaded == "" || parseInt(is_uploaded) == 0)){
            $('.bidding-tab li').removeClass('active');
            $('.bidding-tab li:first').addClass('active');
              $('.bidding-body > div').hide();
              $('.bidding-body > div:first').show();
          }
            $(window).scrollTop(0);
      });
    
        $(document).on('click', '#bidderPaymentPreviousBtn', function(){
            // var reg_id = $('#bidderRegFrm #reg_id').val();
            // var is_uploaded = $('#is_uploaded').val();
            $('.bidding-tab li').removeClass('active');
            $('.bidding-tab li:first').addClass('active');
            $('.bidding-body > div').hide();
            $('.bidding-body > div:first').show();
            
            $(window).scrollTop(0);
        });

      $(document).on('click', '#backToProofFund', function(){
           var is_uploaded = $('#is_uploaded').val();

           if(is_uploaded == "" || parseInt(is_uploaded) == 0){
            $('.bidding-tab li').removeClass('active');
              $('#proff_funds').parent().addClass('active');
               //$('#submitBidderReg').html('Save And Exit');
               $('#bidderPreviousBtn').hide();
              $('.bidding-body > div:visible').hide();
              //$('input[name="is_submit_proof_fund"][value="0"]').trigger("click");
              $('#proff-funds').show();
              $(window).scrollTop(0);
              set_bidder_info();
           }

      });
      $(document).on('click', '#nextGetStarted', function(){
            data = {
                first_name: 'first_name',
                last_name: 'last_name',
                email: 'email',
                phone: 'phone',
                address: 'address',
                bidder_zip_code: 'bidder_zip_code',
                city: 'city',
                state: 'state',
            }
            if($('#agent_buyer_info').is(':visible')){
                data.agent_buyer_first_name = 'agent_buyer_first_name';
                data.agent_buyer_last_name = 'agent_buyer_last_name';
                data.agent_buyer_email = 'agent_buyer_email';
                data.agent_buyer_phone = 'agent_buyer_phone';
                data.agent_buyer_address = 'agent_buyer_address';
                data.agent_buyer_city = 'agent_buyer_city';
                data.agent_buyer_zipcode = 'agent_buyer_zipcode';
                data.agent_buyer_state = 'agent_buyer_state';
                data.agent_buyer_country = 'agent_buyer_country';
                if($('#agent_buyer_company_section').is(':visible')){
                    data.agent_buyer_company_name = 'agent_buyer_company_name';
                }
            }
            data.correct_info = 'correct_info';
            validate_bidder_form(data);

          if($('#bidderRegFrm').valid()){

            $('.bidding-tab li').removeClass('active');
              $('#proff_funds').parent().addClass('active');
              $('#get_started').parent().addClass('tab-activated');

              $('.bidding-body > div:visible').hide();
              if(click_count == 1){
                $('input[name="is_submit_proof_fund"][value="1"]').trigger("click");
                $('#doc_reason_section').hide();
                click_count = 2;
              }

              $('#proff-funds').show();
              set_bidder_info();
              $(window).scrollTop(0);
          }
      });


    bidder_doc_params = {
        url: '/save-bidder-document/',
        field_name: 'bidder_document',
        file_accepted: '.pdf, .doc, .docx',
        element: 'bidderDocFrm',
        upload_multiple: true,
        max_files: 10,
        call_function: set_bidder_document_details,
        default_message: '<i class="fa fa-upload" aria-hidden="true"></i> Upload Photos',
        set_max_limit: false,
    }

    try{
        initdrozone(bidder_doc_params);
    }catch(ex){
       // console.log(ex);
    }
    $(document).on('click', '.confirm_image_delete', function(){
        var data_count = '';
        var data_article_id = '';
        var agent_id = '';
        var user_id = '';
        var section = $(this).attr('data-image-section');
        var image_id = $(this).attr('data-image-id');
        var image_name = $(this).attr('data-image-name');
        $('#confirmBidderDocDeleteModal #popup_section').val(section);
        $('#confirmBidderDocDeleteModal #popup_image_id').val(image_id);
        $('#confirmBidderDocDeleteModal #popup_image_name').val(image_name);
        $('#confirmBidderDocDeleteModal').modal('show');
    });
    $(document).on('click', '#del_image_false', function(){
        $('#confirmBidderDocDeleteModal #popup_section').val('');
        $('#confirmBidderDocDeleteModal #popup_image_id').val('');
        $('#confirmBidderDocDeleteModal #popup_image_name').val('');
        $('#confirmBidderDocDeleteModal').modal('hide');
    });
    $(document).on('click', '#del_image_true', function(){

        var section= $('#confirmBidderDocDeleteModal #popup_section').val();
        var id = $('#confirmBidderDocDeleteModal #popup_image_id').val();
        var name = $('#confirmBidderDocDeleteModal #popup_image_name').val();
        del_params = {
            section: section,
            id: id,
            name: name,
        }
        delete_bidder_document(del_params);

        //need to comment this after getting delete api
           /*var image_id = '';
           var image_name = '';
           var new_ids = '';
           var new_names = '';


            image_id = $('#bidder_doc_id').val();
            image_name = $('#bidder_doc_name').val();
            new_ids = remove_string(image_id,id,',');
            new_names = remove_string(image_name,name,',');
            $('li[rel_id="'+id+'"]').remove();
            $('#bidder_doc_id').val(new_ids);
            $('#bidder_doc_name').val(new_names);
            if($('#bidder_doc_id').val() == ''){
                $('#bidderDocDiv').hide();
            }
            //$('#bidderDocFrm.dropzone').removeClass('');
             window.setTimeout(function () {
                 $.growl.notice({title: 'Document', message: 'Deleted successfully', size: 'large'});
            }, 2000);*/
        //end
        $('#confirmBidderDocDeleteModal').modal('hide');

    });
    $(document).on('keyup', '#bidderRegFrm #bidder_zip_code', function(){
       var zip_code = $(this).val();
       country_code = $("#buyer_country").find(':selected').data('short-code');
       country_id = $("#buyer_country").val();
       if(zip_code.length > 4 && country_id == 1){
        params = {
            'zip_code': zip_code,
            'call_function': set_bidder_address_by_zipcode,
        }
        get_address_by_zipcode(params);
       }
    });
    $(document).on('keyup', '#bidderRegFrm #agent_buyer_zipcode', function(){
       var zip_code = $(this).val();
       country_code = $("#agent_buyer_country").find(':selected').data('short-code');
       country_id = $("#agent_buyer_country").val();
       if(zip_code.length > 4 && country_id == 1){
        params = {
            'zip_code': zip_code,
            'call_function': set_agent_buyer_address_by_zipcode,
        }
        get_address_by_zipcode(params);
       }
    });
    $('#submitBidderReg').on('click', function(){
        var reg_id = $('#bidderRegFrm #reg_id').val();
        if(reg_id != ""){
            var url = '/upload-bidder-document/';
        }else{
            var url = '/bid-registration/';
        }
        if(parseInt($('input[name="is_submit_proof_fund"]:checked').val()) == 1){
            validation_data = {
                bidder_doc_id: 'bidder_doc_id',
                term_accepted: 'term_accepted',
                age_validate: 'age_validate',
            }

        }else{
            validation_data = {
                term_accepted: 'term_accepted',
                age_validate: 'age_validate',
            }
        }
        validate_bidder_form(validation_data);

        if($('#bidderRegFrm').valid()){
            $.ajax({
              url: url,
              type: 'post',
              dataType: 'json',
              cache: false,
              data: $('#bidderRegFrm').serialize(),
              beforeSend: function(){
                $('.overlay').show();
              },
              success: function(response){
                  $('.overlay').hide();
                  if(response.error == 0){
                    $('#proff_funds').parent().addClass('tab-activated');
                      try{
                        $('#bidderRegFrm #reg_id').val(response.reg_id);
                      }catch(ex){
                        //console.log(ex);
                        $('#bidderRegFrm #reg_id').val('');
                      }
                  try{
                    custom_response = {
                        'site_id': site_id,
                        'user_id': session_user_id,
                        'property_id': property_id,
                        'auction_id': auction_id,
                      };
                    customCallBackFunc(update_bidder_socket, [custom_response]);
                  }catch(ex){
                    //console.log(ex);
                  }


                      $.growl.notice({title: "Bidder Registration ", message: "Bidder Registration completed successfully", size: 'large'});
                       $('#success_paragraph').html(response.sucess_paragraph);
                       $(window).scrollTop(0);
                       if(response.doc_uploaded == 1){
                            $('#backToProofFund').remove();
                            $('#is_uploaded').val(1);
                          }else{
                            $('#backToProofFund').show();
                            $('#is_uploaded').val(0);
                          }
                          $('.bidding-tab li').removeClass('active');
                          $('#confirm_reg').parent().addClass('active');
                          $('.bidding-body > div:visible').hide();
                          $('#confirmation').show();

                       /*if(typeof(response.action) != 'undefined' && response.action == 'exit'){
                        window.setTimeout(function () {
                            var property_id = $('#property_id').val();
                            window.location.href = '/asset-details/?property_id='+property_id;
                        }, 2000);
                       }else{
                        $('#success_paragraph').html(response.sucess_paragraph);
                          if(response.doc_uploaded == 1){
                            $('#backToProofFund').remove();
                            $('#is_uploaded').val(1);
                          }else{
                            $('#backToProofFund').show();
                            $('#is_uploaded').val(0);
                          }
                          $('.bidding-tab li').removeClass('active');
                          $('#confirm_reg').parent().addClass('active');
                          $('.bidding-body > div:visible').hide();
                          $('#confirmation').show();
                       }*/

                  }else{
                       $.growl.error({title: "Bidder Registration ", message: response.msg, size: 'large'});
                       $('.bidding-tab li').removeClass('active');
                       $('#proff_funds').parent().addClass('active');
                       $('.bidding-body > div:visible').hide();
                       $('#proff-funds').show();
                  }
              }
          });
        }

    });

    $('#pay_now_old').on('click', function(){
        var reg_id = $('#bidderRegFrm #reg_id').val();
        if(reg_id != ""){
            var url = '/upload-bidder-document/';
        }else{
            var url = '/deposit-bid-registration/';
        }
        validation_data = {
            term_accepted: 'term_accepted',
            age_validate: 'age_validate',
        }
        validate_bidder_form(validation_data);

        if($('#bidderRegFrm').valid()){
            $.ajax({
                url: url,
                type: 'post',
                dataType: 'json',
                cache: false,
                data: $('#bidderRegFrm').serialize(),
                beforeSend: function(){
                    $('.overlay').show();
                },
                success: function(response){
                    $('.overlay').hide();
                    if(response.error == 0){
                        $('#proff_funds').parent().addClass('tab-activated');
                        try{
                            $('#bidderRegFrm #reg_id').val(response.reg_id);
                        }catch(ex){
                            //console.log(ex);
                            $('#bidderRegFrm #reg_id').val('');
                        }
                        try{
                            custom_response = {
                                'site_id': site_id,
                                'user_id': session_user_id,
                                'property_id': property_id,
                                'auction_id': auction_id,
                            };
                            customCallBackFunc(update_bidder_socket, [custom_response]);
                        }catch(ex){
                            //console.log(ex);
                        }

                        $.growl.notice({title: "Bidder Registration ", message: "Bidder Registration completed successfully", size: 'large'});
                        $('#success_paragraph').html(response.sucess_paragraph);
                        $(window).scrollTop(0);
                        if(response.doc_uploaded == 1){
                            $('#backToProofFund').remove();
                            $('#is_uploaded').val(1);
                        }else{
                            $('#backToProofFund').show();
                            $('#is_uploaded').val(0);
                        }
                        $('.bidding-tab li').removeClass('active');
                        $('#confirm_reg').parent().addClass('active');
                        $('.bidding-body > div:visible').hide();
                        $('#confirmation').show();

                    }else{
                       $.growl.error({title: "Bidder Registration ", message: response.msg, size: 'large'});
                       $('.bidding-tab li').removeClass('active');
                       $('#proff_funds').parent().addClass('active');
                       $('.bidding-body > div:visible').hide();
                       $('#proff-funds').show();
                    }
                }
            });
        }

    });

      $(document).on('click', 'input[name="working_with_agent"]', function(){
        var working_with_agent = parseInt($(this).val());
        var user_type_in = [1,2,3];
        var selected_user_type = parseInt($('input[name="user_type"]:checked').val());
        $('#buyer_rel_text').hide();
        if(parseInt(working_with_agent) == 1 && selected_user_type == 2){

            $('#bidder_heading').html('<i class="fas fa-check-circle"></i> Buyer Information');
            $('#agent_buyer_heading').html('<i class="fas fa-check-circle"></i> Agent Information <span class="icon"></span>');
            $('#agent_buyer_info').show();
            $('#bidder_company_section').hide();
            $('#agent_buyer_company_section').show();
        }else if(parseInt(working_with_agent) == 0 && selected_user_type == 4){
            /*$('#bidder_heading').html('<i class="fas fa-check-circle"></i> Agent Information <span class="icon"></span>');
            $('#agent_buyer_heading').html('<i class="fas fa-check-circle"></i> Buyer Information');
            $('#agent_buyer_info').show();*/

            $('#bidder_heading').html('<i class="fas fa-check-circle"></i> Buyer/Agent Information <span class="icon"></span>');
            $('#agent_buyer_heading').html('<i class="fas fa-check-circle"></i> Buyer Information');
            $('#agent_buyer_info').hide();
            $('#buyer_rel_text').show();
            $('#bidder_company_section').show();
            $('#agent_buyer_company_section').hide();
        }else if(parseInt(working_with_agent) == 1 && selected_user_type == 4){
            /*$('#bidder_heading').html('<i class="fas fa-check-circle"></i> Buyer/Agent Information <span class="icon"></span>');
            $('#agent_buyer_heading').html('<i class="fas fa-check-circle"></i> Buyer Information');
            $('#agent_buyer_info').hide();
            $('#buyer_rel_text').show();*/

            $('#bidder_heading').html('<i class="fas fa-check-circle"></i> Agent Information <span class="icon"></span>');
            $('#agent_buyer_heading').html('<i class="fas fa-check-circle"></i> Buyer Information');
            $('#agent_buyer_info').show();
            $('#bidder_company_section').show();
            $('#agent_buyer_company_section').hide();
        }else{
            $('#bidder_heading').html('<i class="fas fa-check-circle"></i> Buyer Information');
            $('#agent_buyer_heading').html('<i class="fas fa-check-circle"></i> Agent Information <span class="icon"></span>');
            $('#agent_buyer_info').hide();
            $('#buyer_rel_text').show();
            $('#bidder_company_section').hide();
            $('#agent_buyer_company_section').hide();
        }
      });
      $(document).on('click', 'input[name="user_type"]', function(){
        var user_type = $(this).val();
        //$('input[name="working_with_agent"]').removeProp('checked');
        var working_with_agent = parseInt($('input[name="working_with_agent"]:checked').val());
        $('#agent_buyer_info').hide();
            if(parseInt(user_type) == 4){

                $('#working_with_agent_section').show();
                //$('label[for="working_with_agent_yes"]:first').html('Are you buying this property for yourself?');
                $('label[for="working_with_agent_yes"]:first').html('Are you representing and bidding on behalf of a buyer/client of yours?');

                //$('input[name="working_with_agent"][value="0"]').trigger("click");
                if(working_with_agent == 0){
                    $('#bidder_heading').html('<i class="fas fa-check-circle"></i> Buyer/Agent Information <span class="icon"></span>');
                    $('#agent_buyer_heading').html('<i class="fas fa-check-circle"></i> Buyer Information');
                    $('#agent_buyer_info').hide();
                    $('#buyer_rel_text').show();
                    $('#bidder_company_section').show();
                    $('#agent_buyer_company_section').hide();
                }else{
                    $('#bidder_heading').html('<i class="fas fa-check-circle"></i> Agent Information <span class="icon"></span>');
                    $('#agent_buyer_heading').html('<i class="fas fa-check-circle"></i> Buyer Information');
                    $('#agent_buyer_info').show();
                    $('#bidder_company_section').show();
                    $('#agent_buyer_company_section').hide();
                }

            }else if(parseInt(user_type) == 2){

                $('label[for="working_with_agent_yes"]:first').html('Are you working with an agent?');
                $('#working_with_agent_section').show();
                //$('input[name="working_with_agent"][value="1"]').trigger("click");
                if(working_with_agent == 0){
                    $('#bidder_heading').html('<i class="fas fa-check-circle"></i> Buyer Information');
                    $('#agent_buyer_heading').html('<i class="fas fa-check-circle"></i> Agent Information <span class="icon"></span>');
                    $('#agent_buyer_info').hide();
                    $('#buyer_rel_text').show();
                    $('#bidder_company_section').hide();
                    $('#agent_buyer_company_section').hide();
                }else{
                    $('#bidder_heading').html('<i class="fas fa-check-circle"></i> Buyer Information');
                    $('#agent_buyer_heading').html('<i class="fas fa-check-circle"></i> Agent Information <span class="icon"></span>');
                    $('#agent_buyer_info').show();
                    $('#bidder_company_section').hide();
                    $('#agent_buyer_company_section').show();
                }
            }
            /*else{
                $('label[for="working_with_agent_yes"]:first').html('Are you working with an agent?');
                $('#working_with_agent_section').hide();
            }*/

      });
      $(document).on('click', 'input[name="is_submit_proof_fund"]', function(){
        var is_submit_proof_fund = parseInt($(this).val());
        if(is_submit_proof_fund == 1){
            $('input[name="doc_reason"]').prop('checked',false);
            $('#upload_document_section').show();
            $('#doc_reason_section').hide();
        }else{
            $('#upload_document_section').hide();
            $('input[name="doc_reason"][value="1"]').prop('checked',true);
            $('#doc_reason_section').show();
        }
      });
      $(document).on('click', 'input[name="doc_reason"]', function(){
        $('input[name="is_submit_proof_fund"][value="0"]').prop('checked',true);
        $('#upload_document_section').hide();
      });
      $(document).on('click', '#continueBuyerInfo', function(){
        //hide all expanded panel

        data = {
            user_type: 'user_type',
            working_with_agent: 'working_with_agent'
        }
        validate_bidder_form(data);
        if($('#bidderRegFrm').valid()){
            $('.panel_heading_link').addClass('collapsed');
            $('.panel-collapse').removeClass('in').addClass('collapse');
            $('#edit_bidder_info').show();

            $('#headingTwo .panel-title a').removeClass('collapsed');
            $('#collapseTwo').removeClass('collapse').addClass('in');
        }
        if($('#agent_buyer_info').is(':visible') === true){
            $('#continueBidderInfo').show();
            $('#continueBidderInfo').parent().show();
        }else{
            $('#continueBidderInfo').hide();
            $('#continueBidderInfo').parent().hide();
        }
        $('#edit_buyer_info').hide();

      });

      $(document).on('click', '#continueBidderInfo', function(){
        //hide all expanded panel
        data = {
            first_name: 'first_name',
            last_name: 'last_name',
            email: 'email',
            phone: 'phone',
            address: 'address',
            bidder_zip_code: 'bidder_zip_code',
            city: 'city',
            state: 'state',
            buyer_country: 'buyer_country'
        }
        if($('#bidder_company_section').is(':visible')){
            data.bidder_company_name = 'bidder_company_name';
        }
        validate_bidder_form(data);
        if($('#bidderRegFrm').valid()){
            if($('#agent_buyer_info').is(':visible') === true){
                $('.panel_heading_link').addClass('collapsed');
                $('.panel-collapse').removeClass('in').addClass('collapse');
                $('#edit_bidder_info').show();
                $('#edit_agent_buyer_info').hide();

                $('#headingThree .panel-title a').removeClass('collapsed');
                $('#collapseThree').removeClass('collapse').addClass('in');
            }else{
                $('.panel_heading_link').addClass('collapsed');
                $('.panel-collapse').removeClass('in').addClass('collapse');
                $('#edit_bidder_info').show();
            }
            $('#edit_buyer_info').show();
        }else{
            return false;
        }

      });

      $(document).on('click', '#edit_bidder_info', function(){
        //hide all expanded panel
        $('.panel_heading_link').addClass('collapsed');
        $('.panel-collapse').removeClass('in').addClass('collapse');
        $('.edit-link').show();
        $('#edit_bidder_info').hide();

        $('#headingOne .panel-title a:first').removeClass('collapsed');
        $('#collapseOne').removeClass('collapse').addClass('in');

      });
      $(document).on('click', '#edit_buyer_info', function(){
        //hide all expanded panel
        $('.panel_heading_link').addClass('collapsed');
        $('.panel-collapse').removeClass('in').addClass('collapse');
        $('.edit-link').show();
        $('#edit_buyer_info').hide();

        $('#headingTwo .panel-title a:first').removeClass('collapsed');
        $('#collapseTwo').removeClass('collapse').addClass('in');

      });
      $(document).on('click', '#edit_agent_buyer_info', function(){
        //hide all expanded panel
        $('.panel_heading_link').addClass('collapsed');
        $('.panel-collapse').removeClass('in').addClass('collapse');
        $('.edit-link').show();
        $('#edit_agent_buyer_info').hide();

        $('#headingThree .panel-title a:first').removeClass('collapsed');
        $('#collapseThree').removeClass('collapse').addClass('in');

      });
      $('#bidderRegFrm').validate({
          errorElement: 'p',
          ignore: [],
          errorPlacement: function(error, element) {
            if(element.hasClass('select')){
                error.insertAfter(element.next('.chosen-container'));
            }else if(element.attr('id') == 'term_accepted'){
                //error.insertAfter(element.next('label'));
            }else if(element.attr('id') == 'correct_info'){
                //error.insertAfter(element.next('label'));
            }else if(element.attr('id') == 'age_validate'){
                //error.insertAfter(element.next('label'));
            }else if(element.attr('id') == 'bidder_doc_id'){
                error.insertAfter(element.closest('.upload-fav'));
            }else if(element.attr('name') == 'working_with_agent'){
                error.insertAfter(element.closest('.lh45'));
            }else if(element.attr('name') == 'user_type'){
                error.insertAfter(element.closest('.lh45'));
            }else if(element.attr('name') == 'is_submit_proof_fund'){
                error.insertAfter(element.closest('.form-group').next('div'));
            }else{
                error.insertAfter(element);
            }
          },
          highlight: function(element, errorClass) {
            var $el = $(element);
            if ($el.is(':checkbox')) {
                $el.next().addClass('checkbox_error').addClass('error');
            } else {
                    /* add code for default*/
            }

         },
         unhighlight: function(element, errorClass) {
            var $el = $(element);
            if ($el.is(':checkbox')) {
                $el.next().removeClass('checkbox_error').removeClass('error');
            }

         },
         invalidHandler: function(e,validator) {

            /*$('.panel-default').find('.panel-title a').addClass('collapsed');
            $('.panel-collapse').addClass('collapse').removeClass('in');
            $(validator.errorList[0].element).closest('.panel-default').find('.panel-title a').removeClass('collapsed');

            $(validator.errorList[0].element).closest('.panel-collapse.collapse').collapse('show');*/

         }
      });
      $(document).on('change', '#bidderRegFrm #agent_buyer_state', function(){
        if($(this).val() != ""){
            $('#bidderRegFrm #agent_buyer_state-error').hide();
        }
      });
      $(document).on('change', '#bidderRegFrm #state', function(){
        if($(this).val() != ""){
            $('#bidderRegFrm #state-error').hide();
        }
      });
});

function set_bidder_document_details(response){
    var image_name = '';
    var upload_id = '';
    var actual_image = '';
    var actual_id = '';
    var property_doc_id = $('#bidder_doc_id').val();
    var property_doc_name = $('#bidder_doc_name').val();
    var property_id = $('#property_id').val();
    if(response.status == 200){
        $('#custom_doc_error').hide();
        $('#bidderRegFrm #bidder_doc_id-error').hide();
        if(response.uploaded_file_list){
            var all_banner_images = '';
            var count = parseInt($('#bidderDocList li').length);
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
                    var img_src = aws_url+"bidder_document/"+item.file_name;
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

                //$('#bidderDocList').append('<li rel_id="'+item.upload_id+'" rel_position="'+count+'"><figure><a href="javascript:void(0)" data-article-id="'+property_id+'" data-image-id="'+item.upload_id+'" data-image-name="'+item.file_name+'" data-image-section="'+item.upload_to+'"  class="close-btn confirm_image_delete"><i class="fas fa-times"></i></a><img src="/static/admin/images/pdf.png" alt=""></figure><figcaption><h6>'+item.file_name+'</h6><p>File Size: '+item.file_size+'<br>Uploaded: '+timeStp+'</p><div class="move"><i class="fas fa-expand-arrows-alt"></i> Move</div></figcaption></li>');
                ext = '';
                if(item.file_name.indexOf('.pdf') > 0){
                    //icon = '/static/admin/images/pdf.png';
                    icon = "<i class='fas fa-file-pdf'></i>";
                    ext = '.pdf';
                } else if(item.file_name.indexOf('.docx') > 0){
                    //icon = '/static/admin/images/docs.png';
                    icon = "<i class='far fa-file-alt'></i>";
                    ext = '.docx';
                } else {
                    icon = "<i class='fas fa-file-word'></i>";
                    ext = '.doc';    
                }
                if(item.file_name.length > 40){
                    item_filename = item.file_name.slice(0, 40) + (item.file_name.length > 40 ? ".._" : "") + ext;
                } else {
                    item_filename = item.file_name;
                }
                $('#bidderDocList').append('<li rel_id="'+item.upload_id+'" rel_position="'+count+'"><figure>'+icon+'</figure><figcaption><h6>'+item_filename+'</h6><p>File Size: '+item.file_size+'<br>Uploaded: '+timeStp+'</p><div class="actions-btn"><a href="javascript:void(0)" data-article-id="'+property_id+'" data-image-id="'+item.upload_id+'" data-image-name="'+item.file_name+'" data-image-section="'+item.upload_to+'"  class="close-btn confirm_image_delete"><i class="fas fa-times"></i></a></div></figcaption></li>');

            });
            image_name = image_name+','+property_doc_name;
            upload_id = upload_id+','+property_doc_id;
            actual_image = image_name.replace(/(^,)|(,$)/g, "");
            actual_id = upload_id.replace(/(^,)|(,$)/g, "");
            $('#bidder_doc_name').val(actual_image);
            $('#bidder_doc_id').val(actual_id);
            $('#bidderDocDiv').show();
            //reindex_prop_doc_list();
        }
    }
}

function set_bidder_address_by_zipcode(response){
    var city = '';
    try{
        var zip_state_iso_code = response.state.toLowerCase();
    }catch(ex){
        //console.log(ex);
        var zip_state_iso_code = '';
    }

    $('#bidderRegFrm #state > option').each(function() {
        try{
            var state_iso_code = $(this).attr('data-short-code').toLowerCase();
        }catch(ex){
            //console.log(ex);
            var state_iso_code = '';
        }
        if(state_iso_code == zip_state_iso_code){
           $(this).prop('selected',true);
        }
    });
    $('#bidderRegFrm #state').trigger("chosen:updated");
    if(response.city){
        city = response.city;
    }
    $('#bidderRegFrm #city').val(city);
    try{
        $('#bidderRegFrm #city-error').hide();
    }catch(ex){
        //console.log(ex);
    }
    try{
        $('#bidderRegFrm #state-error').hide();
    }catch(ex){
        //console.log(ex);
    }
}
function set_agent_buyer_address_by_zipcode(response){
    var city = '';
    try{
        var zip_state_iso_code = response.state.toLowerCase();
    }catch(ex){
        //console.log(ex);
        var zip_state_iso_code = '';
    }

    $('#bidderRegFrm #agent_buyer_state > option').each(function() {
        try{
            var state_iso_code = $(this).attr('data-short-code').toLowerCase();
        }catch(ex){
            //console.log(ex);
            var state_iso_code = '';
        }
        if(state_iso_code == zip_state_iso_code){
           $(this).prop('selected',true);
        }
    });
    $('#bidderRegFrm #agent_buyer_state').trigger("chosen:updated");
    if(response.city){
        city = response.city;
    }
    $('#bidderRegFrm #agent_buyer_city').val(city);
    try{
        $('#bidderRegFrm #agent_buyer_city-error').hide();
    }catch(ex){
        //console.log(ex);
    }
    try{
        $('#bidderRegFrm #agent_buyer_state-error').hide();
    }catch(ex){
        //console.log(ex);
    }
}

function delete_bidder_document(params){
   var image_id = '';
   var image_name = '';
   var new_ids = '';
   var new_names = '';

   var section = params.section;
   var id = params.id;
   var name = params.name;


    image_id = $('#bidder_doc_id').val();
    image_name = $('#bidder_doc_name').val();
    new_ids = remove_string(image_id,id,',');
    new_names = remove_string(image_name,name,',');
    $('li[rel_id="'+id+'"]').remove();
    $('#bidder_doc_id').val(new_ids);
    $('#bidder_doc_name').val(new_names);
    if($('#bidder_doc_id').val() == ''){
        $('#bidderDocDiv').hide();
    }
    $('#bidderDocFrm.dropzone').removeClass('dz-max-files-reached');
    var reg_id = $('#reg_id').val();
   data = {'image_id': id, 'image_name': name, 'section': section, 'reg_id': reg_id}
    if(name && section && id){
        $.ajax({
            url: '/delete-bidder-document/',
            type: 'post',
            dataType: 'json',
            async: false,
            cache: false,
            data: data,
            beforeSend: function(){

            },
            success: function(response){
                if(response.error == 0){
                    $('#confirmImageDeleteModal #popup_section').val('');
                    $('#confirmImageDeleteModal #popup_image_id').val('');
                    $('#confirmImageDeleteModal #popup_image_name').val('');
                    $.growl.notice({title: 'Document', message: 'Deleted successfully', size: 'large'});


                }else{
                    window.setTimeout(function () {
                        $.growl.error({title: 'Document', message: 'Some error occurs, please try again', size: 'large'});
                    }, 2000);
                }
            }
        });
    }

}
function set_bidder_info(){
var first_name = $('#bidderRegFrm #first_name').val();
  var last_name = $('#bidderRegFrm #last_name').val();
  var email = $('#bidderRegFrm #email').val();
  var phone_no = formatPhoneNumber($('#bidderRegFrm #phone').val());
  var address = $('#bidderRegFrm #address').val();
  var state = $('#bidderRegFrm #state').find('option:selected').text();
  var zip_code = $('#bidderRegFrm #bidder_zip_code').val();
  var city = $('#bidderRegFrm #city').val();
  var name = first_name+' '+last_name;
  var full_address = address+', '+city+', '+state+', '+zip_code;
  $('#bidder_name').html('<span class="icon icon-user"></span>'+ name);
  $('#bidder_address').html('<span class="icon icon-address"></span>'+ full_address);
  $('#bidder_email').html('<span class="icon icon-mail"></span>'+ email);
  $('#bidder_phone').html('<span class="icon icon-phone"></span>'+ phone_no);
}
function formatPhoneNumber(phoneNumberString) {
  var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return null;
}

function check_first_accordion_completed(){
    var first_name = $('#first_name').val();
    var last_name = $('#last_name').val();
    var email = $('#email').val();
    var phone = $('#phone').val();
    var custom_value = phone.replace(/[^\d.-]/g, '');
    custom_value = custom_value.replace(/-/g, '');
    var address = $('#address').val();
    var state = $('#state').val();
    var bidder_zip_code = $('#bidder_zip_code').val();
    if(first_name && last_name && email && address && state && bidder_zip_code && custom_value.length == 10){
        $('#first_name').closest('.panel-default').addClass('completed');
    }else{
        $('#first_name').closest('.panel-default').removeClass('completed');
    }
}
function check_second_accordion_completed(){
    var first_name = $('#agent_buyer_first_name').val();
    var last_name = $('#agent_buyer_last_name').val();
    var email = $('#agent_buyer_email').val();
    var phone = $('#agent_buyer_phone').val();
    var custom_value = phone.replace(/[^\d.-]/g, '');
    custom_value = custom_value.replace(/-/g, '');
    var address = $('#agent_buyer_address').val();
    var state = $('#agent_buyer_state').val();
    var bidder_zip_code = $('#agent_buyer_zipcode').val();
    if(first_name && last_name && email && address && state && bidder_zip_code && custom_value.length == 10){
        $('#agent_buyer_first_name').closest('.panel-default').addClass('completed');
    }else{
        $('#agent_buyer_first_name').closest('.panel-default').removeClass('completed');
    }
}
function update_bidder_socket(response){
    const socket = io.connect(socket_domain, {
        transports: ["websocket", "xhr-polling", "htmlfile", "jsonp-polling"],
        rejectUnauthorized: false,
        requestCert: false,
    });
    socket.emit("checkBid", {"user_id": response.user_id, "property_id": response.property_id, "auction_id": response.auction_id, "domain_id": response.site_id});
}

function validate_bidder_form(data){
    if(data.first_name){
        $('#first_name').rules("add",
        {
            required: true,
            acceptcharacters: true,
            noSpace:true,
            maxlength:40,
            messages: {
                required: "First name is required.",

            }
        });
    }else{
        $('#first_name').rules("add",
        {
            required: false,
            acceptcharacters: false,
            noSpace: false,
        });
    }
    if(data.last_name){
        $('#last_name').rules("add",
        {
            required: true,
            acceptcharacters: true,
            noSpace:true,
            maxlength:40,
            messages: {
                required: "Last name is required.",

            }
        });
    }else{
        $('#last_name').rules("add",
        {
            required: false,
            acceptcharacters: false,
            noSpace: false,
        });
    }
    if(data.phone){
        $('#phone').rules("add",
        {
            required: true,
            phoneminlength: 10,
            phonemaxlength: 10,
            messages: {
                required: "Phone no is required.",
                phoneminlength: "Please enter valid phone no",
                phonemaxlength: "Please enter valid phone no"
            }
        });
    }else{
        $('#phone').rules("add",
        {
            required: false
        });
    }
    if(data.email){
        $('#email').rules("add",
        {
            required: true,
            email: true,
            messages: {
                required: "Email is required.",
                email: "Please enter valid email"
            }
        });
    }else{
        $('#email').rules("add",
        {
            required: false
        });
    }
    if(data.address){
        $('#address').rules("add",
        {
            required: true,
            messages: {
                required: "Address is required"
            }
        });
    }else{
        $('#address').rules("add",
        {
            required: false
        });
    }

    if(data.city){
        $('#city').rules("add",
        {
            required: true,
            messages: {
                required: "City is required"
            }
        });
    }else{
        $('#city').rules("add",
        {
            required: false
        });
    }
    if(data.state){
        $('#state').rules("add",
        {
            required: true,
            messages: {
                required: "State is required"
            }
        });
    }else{
        $('#state').rules("add",
        {
            required: false
        });
    }
    if(data.buyer_country){
        $('#buyer_country').rules("add",
        {
            required: true,
            messages: {
                required: "Country is required"
            }
        });
    }else{
        $('#buyer_country').rules("add",
        {
            required: false
        });
    }
    if(data.bidder_zip_code){
        $('#bidder_zip_code').rules("add",
        {
            required: true,
            //minlength: 5,
            maxlength: 6,
            messages: {
                required: "Zip Code is required",
                //minlength: "Please enter at least 5 char",
                maxlength: "Please enter at most 6 char"
            }
        });
    }else{
        $('#bidder_zip_code').rules("add",
        {
            required: false
        });
    }
    if(data.agent_buyer_first_name){
        $('#agent_buyer_first_name').rules("add",
        {
            required: true,
            acceptcharacters: true,
            noSpace:true,
            maxlength:40,
            messages: {
                required: "First name is required.",
            }
        });
    }else{
        $('#agent_buyer_first_name').rules("add",
        {
            required: false,
            acceptcharacters: false,
            noSpace: false,
        });
    }
    if(data.agent_buyer_last_name){
        $('#agent_buyer_last_name').rules("add",
        {
            required: true,
            acceptcharacters: true,
            noSpace:true,
            maxlength:40,
            messages: {
                required: "Last name is required.",
            }
        });
    }else{
        $('#agent_buyer_last_name').rules("add",
        {
            required: false,
            acceptcharacters: false,
            noSpace: false,
        });
    }
    if(data.agent_buyer_phone){
        $('#agent_buyer_phone').rules("add",
        {
            required: true,
            phoneminlength: 10,
            phonemaxlength: 10,
            messages: {
                required: "Phone no is required.",
                phoneminlength: "Please enter valid phone no",
                phonemaxlength: "Please enter valid phone no"
            }
        });
    }else{
        $('#agent_buyer_phone').rules("add",
        {
            required: false
        });
    }
    if(data.agent_buyer_email){
        $('#agent_buyer_email').rules("add",
        {
            required: true,
            email: true,
            messages: {
                required: "Email is required.",
                email: "Please enter valid email"
            }
        });
    }else{
        $('#agent_buyer_email').rules("add",
        {
            required: false
        });
    }
    if(data.agent_buyer_address){
        $('#agent_buyer_address').rules("add",
        {
            required: true,
            messages: {
                required: "Address is required"
            }
        });
    }else{
        $('#agent_buyer_address').rules("add",
        {
            required: false
        });
    }
    if(data.agent_buyer_city){
        $('#agent_buyer_city').rules("add",
        {
            required: true,
            messages: {
                required: "City is required"
            }
        });
    }else{
        $('#agent_buyer_city').rules("add",
        {
            required: false
        });
    }
    if(data.agent_buyer_state){
        $('#agent_buyer_state').rules("add",
        {
            required: true,
            messages: {
                required: "State is required"
            }
        });
    }else{
        $('#agent_buyer_state').rules("add",
        {
            required: false
        });
    }
    if(data.agent_buyer_country){
        $('#agent_buyer_country').rules("add",
        {
            required: true,
            messages: {
                required: "Country is required"
            }
        });
    }else{
        $('#agent_buyer_country').rules("add",
        {
            required: false
        });
    }
    if(data.agent_buyer_zipcode){
        $('#agent_buyer_zipcode').rules("add",
        {
            required: true,
            //minlength: 5,
            maxlength: 6,
            messages: {
                required: "Zip Code is required",
                //minlength: "Please enter at least 5 char",
                maxlength: "Please enter at most 6 char"
            }
        });
    }else{
        $('#agent_buyer_zipcode').rules("add",
        {
            required: false
        });
    }
    if(data.term_accepted){
        $('#term_accepted').rules("add",
        {
            required: true,
            messages: {
                required: "This field is required"
            }
        });
    }else{
        $('#term_accepted').rules("add",
        {
            required: false
        });
    }
    if(data.age_validate){
        $('#age_validate').rules("add",
        {
            required: true,
            messages: {
                required: "This field is required"
            }
        });
    }else{
        $('#age_validate').rules("add",
        {
            required: false
        });
    }
    if(data.bidder_doc_id){
        $('#bidder_doc_id').rules("add",
        {
            required: true,
            messages: {
                required: "Document is required"
            }
        });
    }else{
        $('#bidder_doc_id').rules("add",
        {
            required: false
        });
    }
    if(data.user_type){
        $('input[name="user_type"]').rules("add",
        {
            required: true,
            messages: {
                required: "This field is required",
            }
        });
    }else{
        $('input[name="user_type"]').rules("add",
        {
            required: false
        });
    }
    if(data.working_with_agent){
        $('input[name="working_with_agent"]').rules("add",
        {
            required: true,
            messages: {
                required: "This field is required",
            }
        });
    }else{
        $('input[name="working_with_agent"]').rules("add",
        {
            required: false
        });
    }
    if(data.is_submit_proof_fund){
        $('input[name="is_submit_proof_fund"]').rules("add",
        {
            required: true,
            messages: {
                required: "This field is required",
            }
        });
    }else{
        $('#is_submit_proof_fund').rules("add",
        {
            required: false
        });
    }
    /*if(data.correct_info){
        $('#correct_info').rules("add",
        {
            required: true,
            messages: {
                required: "This field is required",
            }
        });
    }else{
        $('#correct_info').rules("add",
        {
            required: false
        });
    }*/
    if(data.bidder_company_name){
        $('#bidder_company_name').rules("add",
        {
            required: true,
            messages: {
                required: "Company Name is required",
            }
        });
    }else{
        $('#bidder_company_name').rules("add",
        {
            required: false
        });
    }
    if(data.agent_buyer_company_name){
        $('#agent_buyer_company_name').rules("add",
        {
            required: true,
            messages: {
                required: "Company Name is required",
            }
        });
    }else{
        $('#agent_buyer_company_name').rules("add",
        {
            required: false
        });
    }


}


function state_list_update(country_id, state_id){
   country_id = $("#"+country_id).val();
   csrf_token = $('input[name="csrfmiddlewaretoken"]').val();
   if (country_id){
        $.ajax({
            url: '/state-list/',
            type: 'post',
            dateType: 'json',
            cache: false,
            data: {country_id: country_id, 'csrfmiddlewaretoken': csrf_token},
            beforeSend: function(){
                $('.overlay').show();
            },
            success: function(response){
                $('.overlay').hide();
                if(response.error == 0){
                    state_lists = response.state_lists;
                    var option_html = "";
                    $('#'+state_id).empty().append("<option value=''>Select</option>");
                    $.each( state_lists, function( key, value ) {
                        $('#'+state_id).append("<option value="+value.id+" data-short-code="+value.iso_name+">"+value.state_name+"</option>");
                    });
                    $('#'+state_id).trigger("chosen:updated");
                }

            }
        });
   }else{
        $('#'+state_id).empty().append("<option value=''>Select</option>");
        $('#'+state_id).trigger("chosen:updated");
   }

}

$("#buyer_country").change(function(){
    $("#state").empty().append("<option value=''>Select</option>");
    $("#address").val("");
    $("#bidder_zip_code").val("");
    $("#city").val("");
    state_list_update("buyer_country", "state");
});

$("#agent_buyer_country").change(function(){
    $("#agent_buyer_state").empty().append("<option value=''>Select</option>");
    $("#agent_buyer_address").val("");
    $("#agent_buyer_zipcode").val("");
    $("#agent_buyer_city").val("");
    state_list_update("agent_buyer_country", "agent_buyer_state");
});