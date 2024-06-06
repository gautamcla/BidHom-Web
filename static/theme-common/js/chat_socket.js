
var first_msg_id = 0
    last_msg_id = 0
    lastMessageId=0
    firstMessageId=0
    leftMsgProcessing=false
    rightMessageProcessing=false
    leftMessageList=true
    userType='buyer';


$(".chat-sidebar").mCustomScrollbar({
	callbacks:{
		onScroll:function(){
			loadMoreChatRooms(this);
		}
	},
	axis:"y",
    autoHideScrollbar:true,
	theme:"dark-thin"
});

$(".chat-middle").mCustomScrollbar({
	callbacks: {
		onTotalScrollBack:function(){ loadMoreMessages(this) },
		onTotalScrollBackOffset:100,
		alwaysTriggerOffsets:false
	},
	setTop:"9999px",
    autoHideScrollbar:true,
	axis:"y",
	theme:"dark-thin"
});

$(document).ready(function () {


    $('#chat_msg_form').validate({
            errorElement: 'p',
            rules:{
                chat_message_input:{
                    required: function(element) {
                        if ($('#chat_doc_id').val() == '') {
                            return true;
                        } else {
                            return false;
                        }
                    }
                }
            },
            messages:{
                chat_message_input:{
                    required: "Please enter some text..."
                }
            },
            errorPlacement: function(error, element) {
                error.insertAfter(element.closest('ul'));
            }
    });



    $('.select').chosen();

    // initial call
    payload= {
        "user_id":parseInt(user_id),
        "domain_id": parseInt(site_id),
        "user_type": userType,
        "filter_data": $('#filter_chat').val(),
        "last_msg_id": parseInt(first_msg_id)
    }
    socket.emit("loadChatRooms", payload);

    // check for new chatroom every 5 seconds
    setInterval(function(){
    if(user_id && site_id && userType) {
        payload= {
            "user_id":parseInt(user_id),
            "domain_id": parseInt(site_id),
            "user_type": userType,
            "filter_data": $('#filter_chat').val(),
            "last_msg_id": parseInt(first_msg_id)
        }
        socket.emit("loadChatRooms", payload);
    }
    }, 1500);


    // check for new conversation every 5 seconds
    setInterval(function(){
        if(user_id && site_id && userType) {
            payload= {
                "user_id":parseInt(user_id),
                "domain_id": parseInt(site_id),
                "user_type": userType,
                "last_msg_id": lastMessageId,
                "master_id": $('#chat_master_id').val(),
            }
            socket.emit("loadChatRoomConversation", payload);
        }
        }, 1500);


    // on chatroom socket response
    socket.on('loadChatRooms',function(response) {
        try {
            // check if no error or no message found
            if(response.error == 0 && response.data.length){

                $('.chat-blank').hide()
                $('.chat-bottom').show()
                // check new message
                // $('.chat-sidebar').mCustomScrollbar("destroy");
                if(first_msg_id && response.msg_type != 'pre_msg'){
                    reversedArray = response.data.reverse()
                    reversedArray.forEach(element => {
                        // check if any chatroom is already active
                        currentActiveChat = $('#chat_listings li.active').attr('data-id')
                        // find and remove if already in chatroom listing
                        if($('#chat_listings li[data-id='+ element.id +']').length > 0){
                            $('#chat_listings li[data-id='+ element.id +']').remove()
                        }
                        // append with new message from top to bottom
                        $("#chat_listings").prepend(genrateChatRoomHtml(element));
                        if (currentActiveChat){
                            currActiveElement = $('#chat_listings li[data-id='+ currentActiveChat +']')
                            // temp_read_unread_msg(currActiveElement)
                            currActiveElement.addClass('active')
                            master_read_message(currentActiveChat)
                            // var objDivPosition = currActiveElement[0].offsetTop
                        }
                        $('.chat-sidebar').mCustomScrollbar("scrollTo","top",{scrollInertia:0});
                    });
                } else {  // load first data
                    response.data.forEach(element => {
                        $('#chat_listings').append(genrateChatRoomHtml(element))
                    });
                    leftMsgProcessing = false;
                    // trigger to laod first chatroom if no other is active
                    currentActiveChat = $('#chat_listings li.active').attr('data-id')
                    if(currentActiveChat == undefined){
                        try{
                            $('#chat_listings li:first').trigger('click');
                        }catch(ex){
                            console.log(ex);
                        }   
                    }

                }
                // set msg ids and master ids
                $('.chat-sidebar').bind('scroll', loadMoreChatRooms);
                $('#first_master_id').val($('#chat_listings li:first').attr('data-id'))
                first_msg_id = $('#chat_listings li:first').attr('data-last-chat-id')
                $('#last_master_id').val($('#chat_listings li:last').attr('data-id'))
                last_msg_id = $('#chat_listings li:last').attr('data-last-chat-id')
            } else {
                if(!first_msg_id || !last_msg_id){
                    $('.chat-blank').show()
                    $('.chat-bottom').hide()
                } else {
                    $('.chat-bottom').show()
                    $('.chat-blank').hide()
                }
            }
            $('.overlay').hide();
        } catch (error) {
            console.log(error)
        }
    })
    // on chatroom conversation response
    .on('loadChatRoomConversation', function(response){
        try {
            // check if no error or no message found
            if(response.error == 0 && response.data.length){

                if(firstMessageId && response.msg_type != 'pre_msg'){
                    reversedArray = response.data.reverse()
                    reversedArray = filterChatRoomConversationsForDocument(reversedArray)
                    reversedArray.forEach(element => {
                        // // find and remove if already in chatroom listing
                        if($('#chat_list li[data-id='+ element.id +']').length > 0){
                            $('#chat_list li[data-id='+ element.id +']').remove()
                        }
                        // append with new message from top to bottom
                        $("#chat_list").append(genrateConversationHtml(element));
                    });
                } else {  // load first data or load more
                    responseArray = filterChatRoomConversationsForDocument(response.data)
                    responseArray.forEach(element => {
                        $("#chat_list").prepend(genrateConversationHtml(element))
                    });
                }

                if(!firstMessageId && !lastMessageId || response.msg_type != 'pre_msg')
                    $('.chat-middle').mCustomScrollbar("scrollTo","bottom",{scrollInertia:0});

                if(!lastMessageId && response.data.length > 0 && !response.data[0].disable_chat){
                    var chat_msg_id = $('#chat_master_id').val();
                    master_read_message(chat_msg_id);
                }

                // setup first and last message id
                $(".chat-middle").bind('scroll', loadMoreMessages);
                $('#first_msg_id').val($('#chat_list > li:first').attr('data-id'))
                firstMessageId = $('#chat_list > li:first').attr('data-id')
                $('#last_msg_id').val($('#chat_list > li:last').attr('data-id'))
                lastMessageId = $('#chat_list > li:last').attr('data-id') 

                // handle temporary load more conversation
                rightMessageProcessing = false
            }
        } catch (error) {
            console.log(error)
        }
    })

    .on('sendMessageToUser', function(response){
        try {
            if(response.error == 0){
                $('#send_msg_btn').removeAttr('disabled').html('Send');
                $('#chat_message_input').val('');
                // clear docs
                $('#chat_doc_name').val('');
                $('#chat_doc_id').val('');
                $('.chat-preview').empty().hide();

                // $('.chat-middle').mCustomScrollbar("scrollTo","bottom",{scrollInertia:0});
            } else {
                $.growl.error({title: "Chat ", message: 'Something went wrong.', size: 'large'});
            }
        } catch (error) {
            console.log(error)
        }
    })

    $(document).on('keypress', '#chat_message_input', function(e){
        if(e.keyCode === 13){
            $('#send_msg_btn').trigger('click');
        }
    })


    .on('change', '#file', function(event){
        event.preventDefault();
        let allowedType = new Array('.jpg','jpeg','.png', '.pdf', 'docx', '.doc');
        let file_name = "";
        let extension = "";
        let file_size = 0;
        let files = $('#file')[0].files[0];
        file_name = files.name;
        file_size = files.size;
        extension = file_name.substr(-4);
        var myformData = new FormData();
        if(parseInt(file_size) > 2 *1024*1024){
            $.growl.error({title: "Chat Document", message: 'File size is more than 2MB.', size: 'large'});
            $("#file").val("");
            return false;
        }
        if(allowedType.indexOf(extension.toLowerCase()) == -1){
            $.growl.error({title: "Chat Document", message: 'Only pdf, docx, doc, jpg, jpeg and png files are allowed.', size: 'large'});
            $("#file").val("");
            return false;
        } 
        if($('.chat-preview li').length == 2){
            $.growl.error({title: "Chat Document", message: 'Max 2 files can be send at once', size: 'large'});
            $("#file").val("");
            return false;

        }
        myformData.append('chat_document', files);
        myformData.append('file_length', 1);
        myformData.append('file_size', file_size/1024);
        myformData.append('field_name', 'chat_document')
          $.ajax({
              type: "post",
              url: '/save-chat-docs/',
              processData: false,
              contentType: false,
              cache: false,
              data: myformData,
              enctype: 'multipart/form-data',
              beforeSend: function(){
                  $('#send_msg_btn').prop('disabled',true);
                  $('.overlay').show();
              },
              success: function (response) {
                  $('#send_msg_btn').prop('disabled',false);
                  if(response.error == 0 || response.status == 200){
                      set_chat_to_agent_details(response)
                  }else{
                    $.growl.error({title: "Error in Upload", message: 'Oops! Somwthing went wrong', size: 'large'});
                    $('.overlay').hide();
                  }
              },
              complete: function(){
                $("#file").val("");
              }
              
          }); 
    })
    
    .on('click', '.confirm_chat_document_delete', function(){
        var section = $(this).attr('data-image-section');
        var image_id = $(this).attr('data-image-id');
        var image_name = $(this).attr('data-image-name');
        $('#confirmChatDocDeleteModal #popup_section').val(section);
        $('#confirmChatDocDeleteModal #popup_image_id').val(image_id);
        $('#confirmChatDocDeleteModal #popup_image_name').val(image_name);
        $('#confirmChatDocDeleteModal').modal('show');
    })
    
    .on('click', '#del_offer_doc_false', function(){
        $('#confirmChatDocDeleteModal #popup_section').val('');
        $('#confirmChatDocDeleteModal #popup_image_id').val('');
        $('#confirmChatDocDeleteModal #popup_image_name').val('');
        $('#confirmChatDocDeleteModal').modal('hide');
        //$('body').addClass('modal-open');
    })
    
    .on('click', '#del_offer_doc_true', function(){
        var section= $('#confirmChatDocDeleteModal #popup_section').val();
        var id = $('#confirmChatDocDeleteModal #popup_image_id').val();
        var name = $('#confirmChatDocDeleteModal #popup_image_name').val();
        del_params = {
            section: section,
            id: id,
            name: name,
        }
        delete_chat_agent_document(del_params)
        $('#confirmChatDocDeleteModal').modal('hide');
        //$('body').addClass('modal-open');

    });

});


function set_chat_to_agent_details(response){
    try {
        $('.overlay').show();
        var image_name = '';
        var upload_id = '';
        var actual_image = '';
        var actual_id = '';
        var property_doc_id = $('#chat_doc_id').val();
        var property_doc_name = $('#chat_doc_name').val();
        if(response.status == 200){
            if(response.uploaded_file_list){
                var count = parseInt($('.chat-preview li').length);
                if(count == 2){
                    $('.overlay').hide();
                    return false;
                }
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
                    if(item.upload_date){
                        try{
                            var upload_date = new Date(item.upload_date);
                            var month = upload_date.toLocaleString('default', { month: 'short' });
                            var year = upload_date.getFullYear();

                            var dt = (upload_date.getDate() < 10)?'0'+upload_date.getDate():upload_date.getDate();
                            var hrs = (upload_date.getHours() < 10)?'0'+upload_date.getHours():upload_date.getHours();
                            var mins = (upload_date.getMinutes() < 10)?'0'+upload_date.getMinutes():upload_date.getMinutes();
                            var secs = (upload_date.getSeconds() < 10)?'0'+upload_date.getSeconds():upload_date.getSeconds();
                            var timeStp = '';
                            var mer = (parseInt(hrs) >= 12)?'p.m':'a.m';
                            hrs = parseInt(hrs) % 12;
                            hrs = (hrs)?hrs:12;
                            timeStp = month +" "+dt+", "+year+" "+hrs+":"+mins+""+mer;

                        }catch(ex){
                            var timeStp = '';
                        }
                    }
                    ext = '';
                    if(item.file_name.indexOf('.pdf') > 0){
                        //icon = '/static/admin/images/pdf.png';
                        icon = "<i class='fas fa-file-pdf'></i>";
                        ext = '.pdf';
                    }else if(item.file_name.indexOf('.docx') > 0){
                        //icon = '/static/admin/images/docs.png';
                        icon = "<i class='far fa-file-alt'></i>";
                        ext = '.docx';
                    }else if(item.file_name.indexOf('.doc') > 0){
                        icon = "<i class='fas fa-file-word'></i>";
                        ext = '.doc';
                    }else{
                        icon = '<i class="fas fa-file-image"></i>';
                        ext = 'jpeg';
                    }
                    original_doc_name = getFileName(item.file_name);
                    $('.chat-preview').append('<li rel_id="'+item.upload_id+'" rel_position="'+count+'"><figure>'+icon+'</figure><figcaption><h6>'+original_doc_name+'</h6><div class="actions-btn"><div class="badge-success"><i class="fas fa-check-circle"></i></div><a href="javascript:void(0)" data-image-id="'+item.upload_id+'" data-image-name="'+item.file_name+'" data-image-section="'+item.upload_to+'"  class="close-btn confirm_chat_document_delete"><i class="fas fa-times"></i></a></div></figcaption></li>');
                    $('.chat-preview').show();
                });
                image_name = image_name+','+property_doc_name;
                upload_id = upload_id+','+property_doc_id;
                actual_image = image_name.replace(/(^,)|(,$)/g, "");
                actual_id = upload_id.replace(/(^,)|(,$)/g, "");
                $('#chat_doc_name').val(actual_image);
                $('#chat_doc_id').val(actual_id);
            }
        }
        $('.overlay').hide();
        
    } catch (error) {
        $('.overlay').hide();
        
    }
    
}

function delete_chat_agent_document(params){

    try {
        $('#send_msg_btn').prop('disabled',true);
        $('.overlay').show();
        var image_id = '';
        var image_name = '';
        var new_ids = '';
        var new_names = '';
        var section = params.section;
        var id = params.id;
        var name = params.name;
        image_id = $('#chat_doc_id').val();
        image_name = $('#chat_doc_name').val();
        new_ids = remove_string(image_id,id,',');
        new_names = remove_string(image_name,name,',');
        $('li[rel_id="'+id+'"]').remove();
        $('#chat_doc_id').val(new_ids);
        $('#chat_doc_name').val(new_names);
        if($('#chat_doc_id').val() == ''){
            $('#bidderDocDiv').hide();
        }
        data = {'image_id': id, 'image_name': name, 'section': section, 'article_id': ''}
        if(name && section && id){
            $.ajax({
                url: '/delete-chat-docs/',
                type: 'post',
                dataType: 'json',
                async: false,
                cache: false,
                data: data,
                beforeSend: function(){
    
                },
                success: function(response){
                    if(response.error == 0){
                        $('#confirmChatDocDeleteModal #popup_section').val('');
                        $('#confirmChatDocDeleteModal #popup_image_id').val('');
                        $('#confirmChatDocDeleteModal #popup_image_name').val('');
                        $.growl.notice({title: 'Document', message: 'Deleted successfully', size: 'large'});
    
    
                    }else{
                        window.setTimeout(function () {
                            $.growl.error({title: 'Document', message: 'Some error occurs, please try again', size: 'large'});
                        }, 2000);
                    }
                    $('body').addClass('modal-open');
                }
            });
        }
        $('#send_msg_btn').prop('disabled',false);
        $('.overlay').show();
        
    } catch (error) {
        $('#send_msg_btn').prop('disabled',false);
        $('.overlay').hide();
        
    }

 }

function save_chat_message(){
    var usr_msg = $('#chat_message_input').val();
    var master_id = $('#chat_master_id').val();
    var doc_ids = $('#chat_doc_id').val();
    if(doc_ids != ''){
        doc_ids = doc_ids.split(',')
    }
    remove_validation_text();

    if(!$('#chat_msg_form').valid()){
        return false;
    }else if(master_id == ""){
        $.growl.error({title: "Chat ", message: 'Please select some chat', size: 'large'});
        return false;
    }else{
        if(!$('#send_msg_btn').attr('disabled')){
            $('#send_msg_btn').attr('disabled', 'disabled').html('Sending...');
            payload= {
                "user_id":parseInt(user_id),
                "domain_id": parseInt(site_id),
                "message": usr_msg,
                "master_id": master_id,
                "chat_doc_ids":doc_ids
            }
            socket.emit("sendMessageToUser", payload);
        }

    }
}



 // load chatrooms handler
function loadMoreChatRooms(el) {
    if ( el.mcs.topPct > 80 ) {
        //load if custom scrollbar scrolled to the end
        $('.chat-sidebar').unbind(); 
        if(leftMsgProcessing)
            return false;

        leftMsgProcessing = true;
        payload= {
            "user_id":parseInt(user_id),
            "domain_id": parseInt(site_id),
            "user_type": userType,
            "filter_data": $('#filter_chat').val(),
            "last_msg_id": parseInt(last_msg_id), // give last msg id
            "msg_type": 'pre_msg'
        }
        socket.emit("loadChatRooms", payload);
    }
};


//load more conversation handler
var loadMoreMessages = function(el) {
    //load if custom scrollbar scrolled to the end
    $(".chat-middle").unbind(); 
    if(rightMessageProcessing)
        return false;       
    
    rightMessageProcessing = true
    payload= {
        "user_id":parseInt(user_id),
        "domain_id": parseInt(site_id),
        "user_type": userType,
        "last_msg_id": firstMessageId,
        "master_id": $('#chat_master_id').val(),
        "msg_type": 'pre_msg'
    }
    socket.emit("loadChatRoomConversation", payload);
};

// on chatroom filter
filterChatListing =  () => {
    try{
        var filter_chat = $('#filter_chat').val();
    }catch(ex){
        console.log(ex);
        var filter_chat = '';
    }
    $('.overlay').show();
    last_msg_id = 0
    first_msg_id = 0
    $("#chat_list").empty();
    $(".chat-top-active").css('display', 'none');
    $(".chat-bottom-fixed").css('display', 'none');
    $("#chat_listings").empty();

    payload= {
        "user_id":parseInt(user_id),
        "domain_id": parseInt(site_id),
        "user_type": userType,
        "filter_data": filter_chat,
        "last_msg_id": 0, // give last msg id
    }
    socket.emit("loadChatRooms", payload);
}

// on conversation load 
active_chatroom =  (element) => {
    // reset msg id flag
    lastMessageId=0
    firstMessageId=0
    // clear old conversations
    $("#chat_list").empty();
    // remove all active chatrooms
    $('.chat_rooms').removeClass('active');
    $(element).addClass('active')
    // temp_read_unread_msg(element, true)
    // // add temporary class for unread class/ read only message indicator
    // if($(element).hasClass('unread')){
    //     $(element).addClass('tempunread').removeClass('unread')
    // }
    // // active current chatroom selected
    // $(element).addClass('active')

    // // add unread class to element to show unread indicator except current selected once
    // $('.tempunread').not(element).addClass('unread').removeClass('tempunread')

    var roomName = $(element).attr('data-id');
    var masterChatName = $(element).attr('data-name');
    var masterChatImg = $(element).find('img').attr('src');
    var activeChatEmail = '<i class="fas fa-envelope"></i> '+$(element).attr('data-email');
    var activeChatPhone = '<i class="fas fa-phone-alt"></i> '+formatPhoneNumber($(element).attr('data-phone'));

    var masterChatPropId = $(element).attr('data-property');
    var masterChatPropName = $(element).attr('data-property-name');
    if(masterChatPropId){
        var chat_name = masterChatName+'<br><span><a href="/asset-details/?property_id='+masterChatPropId+'" target="_blank">'+masterChatPropName+'</a><span>';
        $('.chat_name').html(chat_name);
    }else{
        $('.chat_name').html(masterChatName);
    }

    $('#chat_master_id').val(roomName);
    $('#active_chat_img').attr('src',masterChatImg);
    $('#active_chat_email').html(activeChatEmail);
    $('#active_chat_phone').html(activeChatPhone);
    remove_validation_text();
    $(".chat-top-active").css('display', 'flex');
    if($(element).hasClass('enable_chat')){
        $('#chat_fixed_bottom').html('<li><textarea name="chat_message_input" id="chat_message_input" placeholder="Type a message"></textarea><ol class="chat-preview" style="display:none;"></ol></li><li><a href="#"><span class="smile-icon"></span></a></li><li><div class="upload-pic"><input type="file" id="file" name="file" /><label for="file"><span class="attach-icon"></span></label></div></li><li><a href="javascript:void(0)" id="send_msg_btn" class="send-btn" onclick="save_chat_message()">Send <span class="send-icon"></span></a></li>');
    }else{
        $('#chat_fixed_bottom').html("<li><span class='no-msg'><i class='fas fa-exclamation-circle'></i> You can't send message because it's one to one conversation.</span></li>");
    }

    $(".chat-bottom-fixed").show();
    loadConversation(roomName);
}

// load more conversation on scroll
loadConversation = (messageId, mag_id='') => {
    payload= {
        "user_id":parseInt(user_id),
        "domain_id": parseInt(site_id),
        "user_type": userType,
        "last_msg_id": mag_id,
        "master_id": messageId
    }
    socket.emit("loadChatRoomConversation", payload);
}


genrateChatRoomHtml = (data) => {
    var unreadCounter = (data.unread_msg_cnt > 0)? 'unread':''
        isChatEnabled = 'enable_chat'; //(data.seller_id == user_id)? 'enable_chat': ''
        userImage = (data.doc_file_name) ? aws_url + data.bucket_name + '/' + data.doc_file_name : '/static/theme-1/user-dashboard/images/no-image.jpg';
        userTypeText = (data.seller_site_id && data.seller_site_id == site_id)? 'Broker': 'Agent'
        unReadChatCounter = (data.unread_msg_cnt > 0) ? 'display:block':'display:none'
        actual_date = ''
        try{
            if(data.child_added_on.trim() != "" && data.child_added_on.trim() != "None"){
                actual_date = getLocalDateCustomized(data.child_added_on.trim(), 'mm/dd/yyyy','ampm');
            }
        }catch(ex){
            console.log(ex);
        }

        // check if message or document
        if(data.message && data.message != ""){
            message = data.message
        } else {
            message = "[!Click to view document!]"
        }

    return  '<li class="chat_rooms ' + unreadCounter + ' '+ isChatEnabled + ' " onclick="active_chatroom(this)" data-last-chat-id="'+ data.child_id +'" data-id="'+ data.id +'" data-name="'+ data.name +'" data-msg="' + data.message + '" data-email="' + data.email + '" data-phone="' + data.phone_no + '" data-property="'+ data.property_id +'" data-property-name="' + data.property_name + '">' +
            '<figure>' +
            '<img src="' + userImage + '" alt="">' +
            '</figure>' +
            '<figcaption>' +
                '<h6>' +
                data.name + ' <span class="user-type">(' + userTypeText +')</span>' +
                '</h6>' +
                '<p>' +
                trimString(message, 30) +
                '</p>' +
                '<div class="timer convert_to_local_date_message" data-value="'+ data.child_added_on +'">' +
                actual_date +
                '</div>' +
                '<div class="circle" style="' + unReadChatCounter + '">'+ data.unread_msg_cnt +'</div>' +
            '</figcaption>' +
            '</li>'
}

genrateConversationHtml = (data) => {

    var userImage = (data.image_name) ? aws_url + data.bucket_name + '/' + data.image_name : '/static/theme-1/user-dashboard/images/no-image.jpg';
        userTypeText = ( (data.seller_id != data.sender_id) ? 'Buyer' : (data.seller_site_id && data.seller_site_id == data.master_site_id)? 'Broker': 'Agent')
        // identify chat position
        chatPosition = (data.seller_id == user_id) ? ((data.buyer_id == data.sender_id)? 'left': 'right'): ((data.seller_id == data.sender_id)? 'left':'right')
        openPosition = (chatPosition == 'left')? 'right':'left'
        actual_date = ''
        try{
        if(data.added_on.trim() != "" && data.added_on.trim() != "None"){
            var local_date = getLocalDate(data.added_on.trim(), 'mm-dd-yyyy','ampm');
                actual_date = local_date.split(" ");
                actual_date = actual_date[0]+' <span>'+actual_date[1]+' '+actual_date[2]+'</span>';
        }
    }catch(ex){
        console.log(ex);
    }

    if(data.documents.length > 0){
        classFullCss = (data.documents.length == 1)? 'full':''
        docHtml = "<ol class='chat-dcoument'>"
        data.documents.forEach(element => {
            if(element.chat_document_file_name.indexOf('.pdf') > 0){
                icon = "<i class='fas fa-file-pdf'></i>";
            }else if(element.chat_document_file_name.indexOf('.docx') > 0){
                icon = "<i class='far fa-file-alt'></i>";
            }else if(element.chat_document_file_name.indexOf('.doc') > 0){
                icon = "<i class='fas fa-file-word'></i>";
            }else{
                icon = '<i class="fas fa-file-image"></i>';
            }
            docHtml +=  '<li class='+ classFullCss +'><a href="' + aws_url + element.chat_document_bucket_name + '/' +  element.chat_document_file_name +'"><figure>'+icon+'</figure><figcaption><h6>'+getFileName(element.chat_document_file_name)+'</h6><div class="actions-btn"><i class="fas fa-download"></i></div></figcaption></a></li>';
        });
        docHtml += "</ol>"
 
        messageHtml = '<figcaption>'+
        '<div class="chat-time convert_to_local_date_time" data-value="'+  data.added_on +'">'+
        actual_date +
        '</div>'+
        '<p>'+
        data.message + docHtml +
        '</p>'+
        '</figcaption>'

    } else {
        messageHtml = '<figcaption>'+
        '<div class="chat-time convert_to_local_date_time" data-value="'+  data.added_on +'">'+
        actual_date +
        '</div>'+
        '<p>'+
        data.message +
        '</p>'+
        '</figcaption>'
    }
    
    userInfoHtml = '<figure>'+
        '<div class="chat-tooltipp">'+
        '<img src="' + userImage + '" alt="">' +
        '<span class="tooltipp__content ' + openPosition + '">'+
            '<ul>'+
                '<li>'+
                'Name - ' + data.name +
                '</li>'+
                '<li>'+
                'Profile Type - ' + userTypeText +
                '</li>'+
                '<li>'+
                'Phone No - ' + formatPhoneNumber(data.phone_no) +
                '</li>'+
                '<li>'+
                'Email -' + data.email + 
                '</li>'+
            '</ul>'+
            '</span>'+
        '</div>'+
        '</figure>';
    
    if (chatPosition == 'left')
        return "<li data-id="+ data.id +"><div class='chat-align lft-chat'>"  + userInfoHtml + messageHtml +"</div></li>";
    else
        return "<li data-id="+ data.id +"><div class='chat-align rgt-chat'>" + messageHtml + userInfoHtml +"</div></li>";

    
}


trimString = (string, trimtoCharCount) => {
    return (string.length > trimtoCharCount) 
        ? $.trim(string).substring(0, trimtoCharCount).split(" ").slice(0, -1).join(" ") + "..."
        : string;
};

master_read_message = (messageId) => {
    $('.chat_rooms').each(function() {
        if(parseInt($(this).attr('data-id')) == parseInt(messageId)){
            $(this).removeClass('unread tempunread');
            $(this).find('.circle').hide();
        }
    });
}

remove_validation_text = () => {
    try{
        $('#chat_message_input-error').remove();
    }catch(ex){
        console.log(ex);
    }

}


function temp_read_unread_msg(element, makeActive=false){
    // add temporary class for unread class/ read only message indicator
    if($(element).hasClass('unread')){
        $(element).addClass('tempunread').removeClass('unread')
    }
    // active current chatroom selected
    // $(element).addClass('active')

    // add unread class to element to show unread indicator except current selected once
    $('.tempunread').not(element).addClass('unread').removeClass('tempunread')
    if (makeActive){
        $(element).addClass('active')
    }
}


function formatPhoneNumber(phoneNumberString) {
  var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return null;
}


function filterChatRoomConversationsForDocument(data){
    // remove duplicate message from objects
    var uniqueArray = Array.from(new Set(data.map(a => a.id)))
        .map(id => {
            return data.find(a => a.id === id)
        })

    // get documents under chat id
    var documetnsArray = []
    data.forEach(element => {
        if(element.chat_document_id){
            let index = documetnsArray.findIndex(item => item.id == element.id)
            if (index != -1) {
                documetnsArray[index]['documents'].push({
                    "chat_document_id": element.chat_document_id,
                    "chat_document_file_name": element.chat_document_file_name,
                    "chat_document_bucket_name": element.chat_document_bucket_name
                })
                
            }else {
                documetnsArray.push({
                    "id": element.id,
                    "documents": [{
                        "chat_document_id": element.chat_document_id,
                        "chat_document_file_name": element.chat_document_file_name,
                        "chat_document_bucket_name": element.chat_document_bucket_name
                    }]
                })
            }
        } else {
            documetnsArray.push({
                "id": element.id,
                "documents": []
            })
        }
    });

    return uniqueArray.map(t1 => ({...t1, ...documetnsArray.find(t2 => t2.id === t1.id)}))

}


function getFileName (str) {
    try {
        if (str.length > 22) {
            return str.substr(0, 9) + '...' + str.substr(-9)
        }
        
        return str   
    } catch (error) {
        return str
    }
  }



