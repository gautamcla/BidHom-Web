$(function() {
    // call user seller list once everything ready
    ajax_seller_buyer_list()

    $('select[multiple]').selectize(
        {
            plugins: ['remove_button'],
            delimiter: ',',
            persist: false,
        }
    );
    $('#prop_num_record').selectize({
        create: false,
        sortField: 'text'
    });

    $(document).on("click", ".page-link", function(e) {
        var page_number = $(this).attr('data');
        var page_type = $(this).attr('data-type');
        var page_sub_type = $(this).attr('data-sub-type');

        if (page_type == "users") {
            if (page_sub_type == "users_list") {
                $("#page-buyer-seller-list").val(page_number);
                ajax_seller_buyer_list();
            }
        }
    })
    // on enter input key
    .on("keyup", "#search", function(e) {
        e.preventDefault();
        if (e.which == 13) {
            $("#page-buyer-seller-list").val(1)
            ajax_seller_buyer_list();
        }
    })
    // on submit search query
    .on("click", ".searchBtn", function(e) {
        e.preventDefault();
        $("#page-buyer-seller-list").val(1)
            ajax_seller_buyer_list();
    })
    
    // on status filter
    .on("change", "#status, #prop_num_record", function(e){
        e.preventDefault();
        $("#page-buyer-seller-list").val(1)
        ajax_seller_buyer_list();
    });


    $(document).on("click", ".user-network", function() {
        $(".loaderDiv").show();
        var user_id = $(this).attr("data-user");
        $.ajax({
            url: "/admin/ajax-users-register-for/",
            type: "POST",
            data: {
                'user_id': user_id,
            },
            cache: false,
            success: function(data) {
                if(data.status == 200){
                    all_data = data.data
                    var innerHtml = ""
                    for (let i = 0; i < all_data.length; i++) {
                      innerHtml += '<li><a href="'+all_data[i].domain__domain_url+'" target="_blank">'+all_data[i].domain__domain_name+'</a></li>'
                    }

                    $(".user_register_domain").html(innerHtml);
                    $('.user-network-modal').modal('show');
                }
            },
            complete: function(jqXhr) {
                $(".loaderDiv").hide();
            }
        });

    });

});

//$('.user-network').on('click', function(){
//    $('.user-network-modal').modal('show');
//});

function ajax_seller_buyer_list() {
    var page = $("#page-buyer-seller-list").val();
    var search = $("#search").val();
    $(".loaderDiv").show();
    $.ajax({
        url: "/admin/ajax-users-list/",
        type: "POST",
        data: { 
            'page': page,
            'search': search,
            'status': $('#status').val(),
            'count': $('#prop_num_record').val(),
        },
        cache: false,
        success: function(data) {
            $("#span-ajax-buyer-seller-list").html(data)
        },
        complete: function(jqXhr) {
            $(".loaderDiv").hide();
            // redirectLogin(jqXhr)
        }
    });
}