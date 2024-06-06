$(function() {
    // call user broker list once everything ready
    ajax_agent_broker_list()

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

        if (page_type == "brokers") {
            if (page_sub_type == "brokers_list") {
                $("#page-agent-broker-list").val(page_number);
                ajax_agent_broker_list();
            }
        }
    })
    // on enter input key
    .on("keyup", "#search", function(e) {
        e.preventDefault();
        $("#page-agent-broker-list").val(1)
        if (e.which == 13) {
            ajax_agent_broker_list();
        }
    })
    // on submit search query
    .on("click", ".searchBtn", function(e) {
        e.preventDefault();
        $("#page-agent-broker-list").val(1)
        ajax_agent_broker_list();
    })
    
    .on("change", "#site, #agent_type, #status, #plan_type, #prop_num_record, #subscription", function(e){
        e.preventDefault();
        $("#page-agent-broker-list").val(1)
        ajax_agent_broker_list();
    });

});

function ajax_agent_broker_list() {
    var page = $("#page-agent-broker-list").val();
    var search = $("#search").val();
    $(".loaderDiv").show();
    $.ajax({
        url: "/admin/ajax-brokers-list/",
        type: "POST",
        data: { 
            'page': page,
            'search': search,
            'status': $('#status').val(),
            'site': $('#site').val(),
            'agent_type': $('#agent_type').val(),
            'plan_type': $('#plan_type').val(),
            'subscription': $('#subscription').val(),
            'count': $('#prop_num_record').val(),
        },
        cache: false,
        success: function(data) {
            $("#span-ajax-agent-broker-list").html(data)
        },
        complete: function(jqXhr) {
            $(".loaderDiv").hide();
            // redirectLogin(jqXhr)
        }
    });
}

function send_activation_email(user_id) {
    $(".loaderDiv").show();
    $.ajax({
        url: "/admin/send-activation-email/",
        type: "POST",
        data: {
            'user_id': user_id,
            'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val()
        },
        cache: false,
        success: function(data) {
            showAlert(data.data, title="Alert", icon="info");
        },
        complete: function(jqXhr) {
            $(".loaderDiv").hide();
            // redirectLogin(jqXhr)
        }
    });
}

function send_email_verification_link(user_id) {
    $(".loaderDiv").show();
    $.ajax({
        url: "/admin/send-email-verification-link/",
        type: "POST",
        data: {
            'user_id': user_id,
            'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val()
        },
        cache: false,
        success: function(data) {
            showAlert(data.data, title="Alert", icon="info");
        },
        complete: function(jqXhr) {
            $(".loaderDiv").hide();
            // redirectLogin(jqXhr)
        }
    });
}