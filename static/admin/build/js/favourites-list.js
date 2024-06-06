$(function() {
    // call listing list list once everything ready
    ajax_favourites_list()

    $('select[multiple]').selectize(
        {
            plugins: ['remove_button'],
            delimiter: ',',
            persist: false,
            create: false,
        }
    );
    $('#prop_num_record, #filter_data').selectize({
        create: false,
        sortField: 'text'
    });

    $(document).on("click", ".page-link", function(e) {
        var page_number = $(this).attr('data');
        var page_type = $(this).attr('data-type');
        var page_sub_type = $(this).attr('data-sub-type');

        if (page_type == "favourite") {
            if (page_sub_type == "favourite_list") {
                $("#page-favourite-list").val(page_number);
                ajax_favourites_list();
            }
        }
    })
    // on enter input key
    .on("keyup", "#search", function(e) {
        e.preventDefault();
        if (e.which == 13) {
            $("#page-favourite-list").val(1)
            ajax_favourites_list();
        }
    })
    // on submit search query
    .on("click", ".searchBtn", function(e) {
        e.preventDefault();
        $("#page-favourite-list").val(1)
            ajax_favourites_list();
    })

    .on("change", "#asset_type, #prop_num_record, #site, #auction_type", function(e) {
        e.preventDefault();
        $("#page-favourite-list").val(1);
        ajax_favourites_list();
    })


    .on('click', '.delete-favourite', function(e){
        e.preventDefault()
        var favId = $(this).attr('data-id');
        $('#confirmDeleteFavourite #favourite_id').val(favId);
        $('#confirmDeleteFavourite').modal('show');
    })

    .on('click', '#del_fav_false', function(){
        $('#confirmDeleteFavourite #favourite_id').val('');
        $('#confirmDeleteFavourite').modal('hide');
    })

    .on('click', '#del_fav_true', function(){
        var fav_id= $('#confirmDeleteFavourite #favourite_id').val();
        delete_favurite(fav_id);
        $('#confirmDeleteFavourite').modal('hide');

    });

});

function ajax_favourites_list(listing_id='') {
    var page = $("#page-favourite-list").val();
    var search = $("#search").val();
    $(".loaderDiv").show();
    $.ajax({
        url: "/admin/ajax-favourite-list/",
        type: "POST",
        data: { 
            'page': page,
            'search': search,
            'asset_id': $('#asset_type').val(), 
            'property_count': $('#prop_num_record').val(),
            'site_id': $('#site').val(),
            'listing_id': listing_id,
            "auction_type": $('#auction_type').val()
        },
        cache: false,
        success: function(data) {
            $("#span-ajax-favourite-list").html(data)
        },
        complete: function(jqXhr) {
            $(".loaderDiv").hide();
            // redirectLogin(jqXhr)
        }
    });
}


function delete_favurite(id){
    $(".loaderDiv").show();
    $.ajax({
        url: "/admin/ajax-favourite-delete/",
        type: "POST",
        data: { "id": id},
        cache: false,
        success: function(data) {
            if(data.staus == 200 || data.error == 0){
                showAlert(data.msg, 0)
                window.setTimeout(function () {
                    window.location.reload();
                }, 2000);
            } else {
                showAlert(data.msg, 1)
            }
        },
        complete: function(jqXhr) {
            $(".loaderDiv").hide();
        }
    });
}