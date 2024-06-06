var pre_bidder_listing = 'all-list';
var currpage = 1;
var recordPerpage = 10;
$(document).ready(function(){
    $('.select').chosen();
    bidder_doc_params = {
        url: '/admin/save-bidder-document/',
        field_name: 'bidder_document',
        file_accepted: '.pdf, .doc, .docx',
        element: 'bidderDocFrm',
        upload_multiple: true,
        max_files: 4,
        call_function: set_bidder_document_details,
        default_message: '<i class="fa fa-upload" aria-hidden="true"></i> Upload Photos',
    }

    try{
        initdrozone(bidder_doc_params);
    }catch(ex){
        //console.log(ex);
    }
    $(document).on('click', '.confirm_bidder_doc_delete', function(){
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
    $(document).on('click', '#del_bidder_doc_false', function(){
        $('#confirmBidderDocDeleteModal #popup_section').val('');
        $('#confirmBidderDocDeleteModal #popup_image_id').val('');
        $('#confirmBidderDocDeleteModal #popup_image_name').val('');
        $('#confirmBidderDocDeleteModal').modal('hide');
    });
    $(document).on('click', '#del_bidder_doc_true', function(){

        var section= $('#confirmBidderDocDeleteModal #popup_section').val();
        var id = $('#confirmBidderDocDeleteModal #popup_image_id').val();
        var name = $('#confirmBidderDocDeleteModal #popup_image_name').val();
        del_params = {
            section: section,
            id: id,
            name: name,
        }
        delete_bidder_document(del_params);

        $('#confirmBidderDocDeleteModal').modal('hide');

    });

    $('#bidderUpdateFrm #approval_limit').on('input',function(e){
        $(this).val(function (index, value) {
            if(value == "$" || value == ""){
                return "";
            }else{
                //return '$' + value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                return value.replace(/(?!\.)\D/g, "").replace(/(?<=\..*)\./g, "").replace(/(?<=\.\d\d).*/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
        });

    });
    $('#bidderUpdateFrm').validate({
          errorElement: 'p',
          ignore: [],
          rules: {
              review_status:{
                  required: true
              },
              apprvoal_status:{
                  required: true
              },
              approval_limit:{
                  required: true,
                  thousandsepratornum: true,
                  minvalue: 1,
              },
              bidder_doc_id:{
                required: function(){
                    if($('#proff-funds').is(':visible') === true){
                        return true;
                    }else{
                        return false;
                    }
                }
              }
          },
          messages: {
              review_status:{
                  required: "Review Status is required."
              },
              apprvoal_status:{
                  required: "Approval Status is required."
              },
              approval_limit:{
                  required: "Approval Limit is required.",
                  thousandsepratornum: "Please enter valid Approval Limit.",
              },
              bidder_doc_id:{
                required: "Document is required"
              }
          },
          errorPlacement: function(error, element) {
            if(element.hasClass('select')){
                error.insertAfter(element.next('.chosen-container'));
            }else if(element.attr('id') == 'bidder_doc_id'){
                error.insertAfter(element.closest('.upload-fav'));
            }else{
                error.insertAfter(element);
            }
         },
         invalidHandler: function(e,validator) {
            // loop through the errors:
            for (var i=0;i<validator.errorList.length;i++){
                // "uncollapse" section containing invalid input/s:
                $(validator.errorList[i].element).closest('.panel-collapse.collapse').collapse('show');
            }
        }
      });
      $('#submitBidderExit').on('click', function(){
        if($('#bidderUpdateFrm').valid()){
            update_bidder_details('exit');
        }

        });
        $('#submitBidder').on('click', function(){
        if($('#bidderUpdateFrm').valid()){
            update_bidder_details('');
        }

        });
        $(document).on('click', '.del_bidder_btn', function(){
           var row_id = $(this).attr('rel_id');

           if($(this).attr('id') == 'del_bidder_true'){
                /*$('#all_bidder_list #row_'+row_id).remove();
                $('#res_bidder_list #row_'+row_id).remove();
                $('#comm_bidder_list #row_'+row_id).remove();
                $('#land_bidder_list #row_'+row_id).remove();*/
                $.ajax({
                    url: '/admin/delete-bidder-reg/',
                    type: 'post',
                    dataType: 'json',
                    cache: false,
                    data: {'row_id': row_id},
                    beforeSend: function(){
                        $('.overlay').show();
                    },
                    success: function(response){
                        $('.overlay').hide();
                        if(response.error == 0){
                            $('#confirmBidderDeleteModal').modal('hide');
                            var auction_type = 1;
                            if(response.data.data.auction_type){
                                auction_type = response.data.data.auction_type;
                            }
                            try{
                               custom_response = {
                                'site_id': site_id,
                                'user_id': $('#confirmBidderDeleteModal #user_id').val(),
                                'property_id': $('#confirmBidderDeleteModal #property_id').val(),
                                'auction_id': $('#confirmBidderDeleteModal #auction_id').val(),
                                'auction_type': auction_type,
                              };
                                customCallBackFunc(update_bidder_socket, [custom_response]);
                            }catch(ex){
                                //console.log(ex);
                            }

                            $.growl.notice({title: "Bidder Registration ", message: 'Deleted successfully', size: 'large'});
                            window.setTimeout(function () {

                                window.location.reload();
                            }, 2000);
                        }else{
                            $('#confirmBidderDeleteModal').modal('hide');
                           $.growl.error({title: "Bidder Registration ", message: response.msg, size: 'large'});

                        }
                    }
                });
           }else{
                $('#confirmBidderDeleteModal #user_id').val('');
                $('#confirmBidderDeleteModal #auction_id').val('');
                $('#confirmBidderDeleteModal #property_id').val('');
                $('#del_bidder_true').removeAttr('rel_id');
                $('#del_bidder_false').removeAttr('rel_id');
                $('#confirmBidderDeleteModal').modal('hide');
                return false;
           }

    });
    $(document).on('keyup', '#bidder_search', function(e){
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
                    url: '/admin/bidder-reg-search-suggestion/',
                    type: 'post',
                    dataType: 'json',
                    cache: false,
                    data: {'search': search},
                    beforeSend: function(){

                    },
                    success: function(response){
                        if(response.error == 0 && response.status == 200){
                            autocomplete("bidder_search", response.suggestion_list);
                        }else{
                            closeAllSuggestions('autocomplete-items');
                        }
                    }
                });
              }

      });

});
function filter_bidder_listing(element){
    var element_href = $(element).attr('data-tab');
    if($(element).attr('data-tab') != pre_bidder_listing){
        bidderListingSearch(1, element_href);
    }else{
        return false;
    }
}
function bidderListingSearch(current_page, filter_listing){
    var search = $('#bidder_search').val();
    //var sort = $('#bidder_datesort').val();
    var currpage = current_page;
    if($('#bidder_num_record').val() != ""){
        recordPerpage = $('#bidder_num_record').val();
    }
    /*var sort_column = 'publish_date_asc';
    if(typeof($('#blog_datesort').val()) != 'undefined' && $('#blog_datesort').val() != ""){
        sort_column = $('#blog_datesort').val();
    }*/
    if(filter_listing == ''){
        var filter = pre_bidder_listing;
    }else{
        var filter = filter_listing;
    }
    //var filter = filter_listing;
    var asset_type_filter = '';
    if(filter == 'residential-list'){
        asset_type_filter = 3;
    }else if(filter == 'commercial-list'){
        asset_type_filter = 2;
    }else if(filter == 'land-list'){
        asset_type_filter = 1;
    }
    var filter_bidder_status = $('#filter_bidder_status').val();
    $.ajax({
        url: '/admin/bidder-registration/',
        type: 'post',
        dataType: 'json',
        cache: false,
        data: {'search': search, 'page': currpage, 'page_size': recordPerpage, 'asset_type': asset_type_filter, 'filter_bidder_status': filter_bidder_status},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            if(response.error == 0){
                $("#bid_listing_pagination_list").empty();
                /*if(response.total && parseInt(response.total) > 0){
                    var ttl = response.total.toString();
                    var blog_ttl_html = ttl+ ' Search results';

                    $(".ttl_blog").html(blog_ttl_html);
                    $(".ttl_blog").show();
                }*/
                if(response.asset_type == 1){
                    $("#land_bidder_list").empty();
                    pre_bidder_listing = 'land-list';
                    $("#land_bidder_list").html(response.bidder_listing_html);

                    var tab_id = $('#land_list').attr('data-tab');
                    $('ul.tabs li').removeClass('current');
                    $('.tab-content').removeClass('current');

                    $('#land_list').addClass('current');
                    $("#"+tab_id).addClass('current');

                }else if(response.asset_type == 2){
                    $("#comm_bidder_list").empty();
                    pre_bidder_listing = 'commercial-list';
                    $("#comm_bidder_list").html(response.bidder_listing_html);

                    var tab_id = $('#commercial_list').attr('data-tab');
                    $('ul.tabs li').removeClass('current');
                    $('.tab-content').removeClass('current');

                    $('#commercial_list').addClass('current');
                    $("#"+tab_id).addClass('current');
                }else if(response.asset_type == 3){
                    $("#res_bidder_list").empty();
                    pre_bidder_listing = 'residential-list';
                    $("#res_bidder_list").html(response.bidder_listing_html);

                    var tab_id = $('#residential_list').attr('data-tab');
                    $('ul.tabs li').removeClass('current');
                    $('.tab-content').removeClass('current');

                    $('#residential_list').addClass('current');
                    $("#"+tab_id).addClass('current');
                }else{
                    pre_bidder_listing = 'all-list';
                    $("#all_bidder_list").empty();
                    $("#all_bidder_list").html(response.bidder_listing_html);

                    var tab_id = $('#all_list').attr('data-tab');
                    $('ul.tabs li').removeClass('current');
                    $('.tab-content').removeClass('current');

                    $('#all_list').addClass('current');
                    $("#"+tab_id).addClass('current');
                }

                $("#bid_listing_pagination_list").html(response.pagination_html);

                //$("#blog_sidebar").html(response.blog_sidebar_html);
            }else{
                $('#blog_list').html('<li class="text-center text-danger" style="width:100%;"><img src="static/theme-1/images/property-not-avail.png" class=" center mb0" /></li>');
                $("#bid_listing_pagination_list").hide();
            }
            $(window).scrollTop(0);
        }
    });
}

function set_bidder_document_details(response){
    var image_name = '';
    var upload_id = '';
    var actual_image = '';
    var actual_id = '';
    var property_doc_id = $('#bidder_doc_id').val();
    var property_doc_name = $('#bidder_doc_name').val();
    if(response.status == 200){
        $('#custom_doc_error').hide();
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
                var extension = '';
                if(item.file_name != ""){
                    var img_src = aws_url+"bidder_document/"+item.file_name;
                    try{
                        ext = item.file_name.split('.');
                        extension = ext[ext.length-1];
                        extension = extension.toLowerCase();
                    }catch(ex){
                        //console.log(ex);
                        extension = '';
                    }
                }
                var extension_icon = '';
                if(extension == 'pdf'){
                    extension_icon = '<i class="fas fa-file-pdf"></i>';
                }else if(extension == 'docx'){
                    extension_icon = '<i class="far fa-file-alt"></i>';
                }else if(extension == 'doc'){
                    extension_icon = '<i class="fas fa-file-word"></i>';
                }else{
                    extension_icon = '';
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
                $('#bidderDocList').append('<li rel_id="'+item.upload_id+'" rel_position="'+count+'"><span class="pdf-icon">'+extension_icon+'</span><a href="'+img_src+'">'+item.file_name+'</a><a href="javascript:void(0)" data-image-id="'+item.upload_id+'" data-image-name="'+item.file_name+'" data-image-section="'+item.upload_to+'" class="pdf-delete confirm_bidder_doc_delete"><i class="far fa-trash-alt"></i></a></li>');

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
    var reg_id = $('#reg_id').val();
   data = {'image_id': id, 'image_name': name, 'section': section, 'reg_id': reg_id}
    if(name && section && id){
        $.ajax({
            url: '/admin/delete-bidder-document/',
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
                        $.growl.error({title: title, message: 'Some error occurs, please try again', size: 'large'});
                    }, 2000);
                }
            }
        });
    }

}
function update_bidder_details(reqest_frm){
    $.ajax({
          url: '/admin/bidder-registration-details/',
          type: 'post',
          dataType: 'json',
          cache: false,
          data: $('#bidderUpdateFrm').serialize(),
          beforeSend: function(){
            $('.overlay').show();
          },
          success: function(response){
              $('.overlay').hide();
              if(response.error == 0){
                  $.growl.notice({title: "Bidder ", message: response.msg, size: 'large'});
                  var auction_type = 1;
                  if(response.data.data.auction_type){
                    auction_type = response.data.data.auction_type;
                  }
                  custom_response = {
                    'site_id': site_id,
                    'user_id': $('#user_id').val(),
                    'property_id': $('#property_id').val(),
                    'auction_id': $('#auction_id').val(),
                    'auction_type': auction_type,
                  };
                  customCallBackFunc(update_bidder_socket, [custom_response]);
                  window.setTimeout(function () {
                      if(reqest_frm == 'exit'){
                        window.location.href='/admin/bidder-registration/';
                      }else{
                        window.location.reload();
                      }
                  }, 2000);

              }else{
                   $.growl.error({title: "Bidder ", message: response.msg, size: 'large'});

              }
          }
      });
}
function bidder_delete_confirmation(row_id, auction_id, property_id, user_id,bid_count){
  if(parseInt(bid_count) > 0){
    $.growl.error({title: "Bidder Registration ", message: 'Can\'t Delete because buyer placed a bid.', size: 'large'});
  }else{
      $('.personalModalwrap').modal('hide');
      $('#confirmBidderDeleteModal #user_id').val(user_id);
      $('#confirmBidderDeleteModal #auction_id').val(auction_id);
      $('#confirmBidderDeleteModal #property_id').val(property_id);
      $('#confirmBidderDeleteModal').modal('show');
      $('.del_bidder_btn').attr('rel_id', row_id);
  }

}

function update_bidder_socket(response){
    // const socket = io.connect(socket_domain, {
    //     transports: ["websocket", "xhr-polling", "htmlfile", "jsonp-polling"],
    //     rejectUnauthorized: false,
    //     requestCert: false,
    // });
    if(typeof(response.auction_type) != 'undefined' && parseInt(response.auction_type) == 2){
        socket.emit("checkInsiderBid", {"user_id": response.user_id, "property_id": response.property_id, "auction_id": response.auction_id, "domain_id": response.site_id});
    }else{
        socket.emit("checkBid", {"user_id": response.user_id, "property_id": response.property_id, "auction_id": response.auction_id, "domain_id": response.site_id});
    }
}