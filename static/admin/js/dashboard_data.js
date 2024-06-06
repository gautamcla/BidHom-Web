$(function () {
  var line_chart = "";
  var bar_chart = "";

// ------------Date Picker----------
  var dateFormat = "yy-mm-dd";
  from = $( "#datetimepicker_1" )
    .datepicker({
      dateFormat: "yy-mm-dd",
      defaultDate: "+1w",
      changeMonth: true,
      numberOfMonths: 1
    })
    .on( "change", function() {
      to.datepicker( "option", "minDate", getDate( this ) );
    }),
  to = $( "#datetimepicker_2" ).datepicker({
    dateFormat: "yy-mm-dd",
    defaultDate: "+1w",
    changeMonth: true,
    numberOfMonths: 1
  })
  .on( "change", function() {
    from.datepicker( "option", "maxDate", getDate( this ) );
  });

    function getDate( element ) {
      var date;
      try {
        date = $.datepicker.parseDate(dateFormat, element.value );
      } catch( error ) {
        date = null;
      }

      return date;
    }

//----------------------Date Change Event---------------------
  $(document).on('change', '#datetimepicker_1, #datetimepicker_2', function() {
    var datetimepicker_1 = $("#datetimepicker_1").val();
    var datetimepicker_2 = $("#datetimepicker_2").val();
    if(datetimepicker_1 && datetimepicker_2){
        set_data();
    }
  });

  function update_dashboard(data){
    $("#total_offer_received").html(data.total_offer_received);
    $("#total_register_user").html(data.total_register_user);
    $("#total_customer").html(data.total_customer);
    $("#total_agent").html(data.total_agent);
    $("#total_property").html(data.total_property);
    $("#total_sold_property").html(data.total_sold_property);
    $("#total_boat_request").html(data.total_boat_request);
    $("#total_enquiry").html(data.total_enquiry);
  }

  function signup_view_graph(dataset, label=""){
      var signup_data_display = dataset.signup_data_display;
      var page_view = dataset.page_view;
      if (label == ""){
        var labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
      }else{
        var labels = label;
      }

      var data = {
        labels: labels,
        datasets: [
          {
            label: "Signup Customer",
            backgroundColor: "red",
            borderColor: "red",
            data: signup_data_display
            //data: [3, 5, 6, 7, 3, 5, 6, 7, 9, 10, 11, 18]
          },
          {
            label: "Detail Page View",
            backgroundColor: "blue",
            borderColor: "blue",
            data: page_view
            //data: [4, 6, 7, 8, 4, 6, 7, 8, 10, 11, 12, 19]
          }
        ]
      };

      var chartOptions = {
        responsive: true,
        legend: {
          position: "top"
        },
        title: {
          // display: true,
          // text: "Chart.js Bar Chart"
        },
        scales: {
//          yAxes: [{
//            ticks: {
//              beginAtZero: true,
////              reverse: false,
//              stepSize: 1
//            }
//          }]
            y: {
//                title: {
//                  display: true,
//                  text: 'Value'
//                },
                min: 0,
                //max: 100,
                ticks: {
                  // forces step size to be 50 units
                  stepSize: 1
                }
            }
        }
      }
      if (line_chart){
        line_chart.destroy();
      }
      var ctx_1 = document.getElementById("line_chart").getContext('2d');
      line_chart = new Chart(ctx_1, {
          type: 'line',
          data: data,
          options: chartOptions,
      });
  }

  function property_registration_graph(dataset, label=""){
      var property_data_display = dataset.property_data_display;
      var registration_data_display = dataset.registration_data_display;
      if (label == ""){
        var labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
      }else{
        var labels = label;
      }

      var data = {
        labels: labels,
        datasets: [
        {
          label: "Property",
          backgroundColor: "green",
          //borderColor: "green",
          //borderWidth: 1,
          //data: [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0]
          data: property_data_display
        },
        {
          label: "Registered User",
          backgroundColor: "blue",
          //borderColor: "blue",
          //borderWidth: 1,
          //data: [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0]
          data: registration_data_display
        }
      ]
      };
      var chartOptions = {
        responsive: true,
        legend: {
          position: "top"
        },
        title: {
          // display: true,
          // text: "Chart.js Bar Chart"
        },
        scales: {
//          yAxes: [{
//            ticks: {
//              beginAtZero: true,
////              reverse: false,
////              stepSize: 3
////                min: 0,
////                callback: function(value, index, values) {
////                    if (Math.floor(value) === value) {
////                        return value;
////                    }
////                }
//            }
//          }]
            y: {
//                title: {
//                  display: true,
//                  text: 'Value'
//                },
                min: 0,
                //max: 100,
                ticks: {
                  // forces step size to be 50 units
                  stepSize: 1
                }
            }
        }
      }
      if(bar_chart){
        bar_chart.destroy();
      }
      var ctx_2 = document.getElementById("bar_chart").getContext('2d');
      bar_chart = new Chart(ctx_2, {
          type: 'bar',
          data: data,
          options: chartOptions,
      });
  }

  // -------------------------Google Map--------------------------
  let map;
  async function initMap(data) {
    const position = { lat: 37.090240, lng: -95.712891 };
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    map = new Map(document.getElementById("map"), {
      zoom: 4,
      center: position,
      mapId: "DEMO_MAP_ID",
    });
    var image="/static/theme-1/images/home_icon.png";
    $.each(data, function( index, value ) {
      if(value.location != ""){
          marker_position = { lat: parseFloat(value.location.lat), lng: parseFloat(value.location.lon) };
          marker = new google.maps.Marker({
              position: marker_position,
              map: map,
               icon: {
                 url: image,
                 scaledSize: new google.maps.Size(30, 45), // scaled size
                 origin: new google.maps.Point(0,0), // origin
                 anchor: new google.maps.Point(0, 0) // anchor
               },
              title: value.name,
          });
      }
    });
  }

  // ----------------------Refresh Signup Page Graph--------------------
  $(document).on('click', '#refresh_signup_view_graph', function() {
    var csrf_token = $('input[name="csrfmiddlewaretoken"]').val();
    var datetimepicker_1 = $("#datetimepicker_1").val();
    var datetimepicker_2 = $("#datetimepicker_2").val();
    $.ajax({
        url: '/admin/update-signup-view-graph/',
        type: 'post',
        dateType: 'json',
        cache: false,
        data: {"start_date": datetimepicker_1, "end_date": datetimepicker_2, "csrfmiddlewaretoken": csrf_token},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            if(response.error == 0){
                var signup_view = response.signup_view;
                var label = response.label;
                signup_view_graph(signup_view, label);
            }

        }
    });
  });

  // ----------------------Refresh Property Registration Graph--------------------
  $(document).on('click', '#refresh_property_registration_graph', function() {
    var csrf_token = $('input[name="csrfmiddlewaretoken"]').val();
    var datetimepicker_1 = $("#datetimepicker_1").val();
    var datetimepicker_2 = $("#datetimepicker_2").val();
    $.ajax({
        url: '/admin/update-property-registration-graph/',
        type: 'post',
        dateType: 'json',
        cache: false,
        data: {"start_date": datetimepicker_1, "end_date": datetimepicker_2, "csrfmiddlewaretoken": csrf_token},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            if(response.error == 0){
                var property_registration = response.property_registration;
                var label = response.label;
                property_registration_graph(property_registration, label);
//                setTimeout(function(){
//                    property_registration_graph(property_registration, label);
//                }, 3000);

            }

        }
    });
  });

  // ----------------------Refresh Map--------------------
  $(document).on('click', '#refresh_map', function() {
    var csrf_token = $('input[name="csrfmiddlewaretoken"]').val();
    var datetimepicker_1 = $("#datetimepicker_1").val();
    var datetimepicker_2 = $("#datetimepicker_2").val();
    $.ajax({
        url: '/admin/update-dashboard-map/',
        type: 'post',
        dateType: 'json',
        cache: false,
        data: {"start_date": datetimepicker_1, "end_date": datetimepicker_2, "csrfmiddlewaretoken": csrf_token},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            if(response.error == 0){
                  initMap(response.data);
            }

        }
    });
  });

  function set_data(){
    var datetimepicker_1 = $("#datetimepicker_1").val();
    var datetimepicker_2 = $("#datetimepicker_2").val();
    var csrf_token = $('input[name="csrfmiddlewaretoken"]').val();
    $.ajax({
        url: '/admin/update-dashboard/',
        type: 'post',
        dateType: 'json',
        cache: false,
        data: {"start_date": datetimepicker_1, "end_date": datetimepicker_2, "csrfmiddlewaretoken": csrf_token},
        beforeSend: function(){
            $('.overlay').show();
        },
        success: function(response){
            $('.overlay').hide();
            if(response.error == 0){
                update_dashboard(response.dashboard_data);
                signup_view_graph(response.signup_view, response.label);
                property_registration_graph(response.property_registration, response.label);
                initMap(response.dashboard_map);
            }

        }
    });
  }
  set_data();

});