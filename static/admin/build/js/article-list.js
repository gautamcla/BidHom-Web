$(function() {
    // call article list once everything ready
    ajax_article_list()

    init_selectize();

    $(document).on("click", ".page-link", function(e) {
        var page_number = $(this).attr('data');
        var page_type = $(this).attr('data-type');
        var page_sub_type = $(this).attr('data-sub-type');

        if (page_type == "article") {
            if (page_sub_type == "article_list") {
                $("#page-article-list").val(page_number);
                ajax_article_list();
            }
        }
    })
    // on enter input key
    .on("keyup", "#search", function(e) {
        e.preventDefault();
        if (e.which == 13) {
            $("#page-article-list").val(1)
            ajax_article_list();
        }
    })
    // on submit search query
    .on("click", ".searchBtn", function(e) {
        e.preventDefault();
        $("#page-article-list").val(1)
        ajax_article_list();
    })

    .on("change", "#prop_filter_status, #site, #asset_type, #per_page_record", function(e) {
        e.preventDefault();
        $("#page-article-list").val(1);
        ajax_article_list();
    });

});

function ajax_article_list() {
    var page = $("#page-article-list").val();
    var search = $("#search").val();
    $(".loaderDiv").show();
    $.ajax({
        url: "/admin/ajax-blog-list/",
        type: "POST",
        data: { 
            'page': page,
            'search': search,
            'status': $('#prop_filter_status').val(), 
            'site_id': $('#site').val(),
            'asset_type': $('#asset_type').val(),
            'count': $('#per_page_record').val()    
        },
        cache: false,
        success: function(data) {
            $("#span-ajax-article-list").html(data)
        },
        complete: function(jqXhr) {
            $(".loaderDiv").hide();
            // redirectLogin(jqXhr)
        }
    });
}

const init_selectize = () => {
    $('select[multiple]').selectize(
        {
            plugins: ['remove_button'],
            delimiter: ',',
            persist: false,
        }
    );

    $('#per_page_record').selectize({
        create: false,
        sortField: 'text'
    });

    
}