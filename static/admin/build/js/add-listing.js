$(function() {

    // $('#property_info_frm, #property_map_view_frm, #property_photo_video_frm, #property_document_frm ').parsley({excluded: "input[type=button], :hidden"});
    // If this code is commented, there will be two validation messages (one for each field).
    Parsley.on('field:validated', function(fieldInstance){
        if (fieldInstance.$element.is(":hidden")) {
            // hide the message wrapper
            fieldInstance._ui.$errorsWrapper.css('display', 'none');
            // set validation result to true
            fieldInstance.validationResult = true;
            return true;
        }
    });

    var btnFinish = $('<button></button>').text('Save and Exit')
                                           .addClass('btn btn-info')
                                           .on('click', function(){ save_property(true) });
    
    var btnNext = $('<button></button>').text('Save')
                                            .addClass('btn btn-secondary')
                                            .attr('id', 'next-btn');
    
    var btnPrev = $('<button></button>').text('Go Previous')
                                        .addClass('btn btn-secondary')
                                        .attr('id', 'prev-btn')
                                        .attr('style',  'display:none');
    
    
    $('#wizardListing').smartWizard({
        selected: 0,
        autoAdjustHeight:false, 
        theme: 'dots', 
        enableURLhash: false,
        toolbarSettings: {
            toolbarPosition: 'bottom', // none, top, bottom, both
            toolbarButtonPosition: 'right', // left, right, center
            showNextButton: false, // show/hide a Next button
            showPreviousButton: false, // show/hide a Previous button
            toolbarExtraButtons: [btnFinish, btnNext, btnPrev]
        },
        anchorSettings: {
            anchorClickable: ($('.property_id').val() == '') ?  false : true, // Enable/Disable anchor navigation
            enableAllAnchors: ($('.property_id').val() == '') ?  false : true, // Activates all anchors clickable all times
        },
    });

    // Step show event
    $("#wizardListing").on("showStep", function(e, anchorObject, stepNumber, stepDirection, stepPosition) {
        $("#prev-btn").show();
        $("#next-btn").show();
        if(stepPosition === 'first') {
            $("#prev-btn").hide();
        } else if(stepPosition === 'last') {
            $("#next-btn").hide();
        } else {
            $("#prev-btn").show();
            $("#next-btn").show();
        }
    });

    $("#prev-btn").on("click", function() {
        // Navigate previous
        $('#wizardListing').smartWizard("prev");
        return true;
    });

    $("#next-btn").on("click", function(e) {
        save_property();
    });

    // init tinymce to  email_content
    tinymce.init({
        selector: 'textarea',
        height: 350,
        menubar: 'file edit view insert format tools table help',
        plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount'
        ],
        toolbar: 'undo redo | formatselect | ' +
        'bold italic backcolor | alignleft aligncenter ' +
        'alignright alignjustify | bullist numlist outdent indent | ' +
        'removeformat | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
        setup: function(ed) {
            ed.on('keyup', function(e) {
                tinyMCE.triggerSave();
            });
        },
    });

    // trigger agent selection for edit property
    // $('#site_id').change();
    init_selectize();
    $('#property_info_frm').parsley().destroy();
    $('#property_info_frm').parsley({excluded: "input[type=button], :hidden"});

    // setup date 
    convert_bidding_date('bidding_start_date');
    convert_bidding_date('bidding_end_date');
    convert_bidding_date('lease_exp_date');
    convert_bidding_date('crp_exp_date');
    convert_bidding_date('dutch_bidding_start_date');
    convert_bidding_date('dutch_bidding_end_date');
    convert_bidding_date('sealed_bidding_start_date');
    convert_bidding_date('sealed_bidding_end_date');
    convert_bidding_date('english_bidding_start_date');
    convert_bidding_date('english_bidding_end_date');
    $('.open_house_start_date').each(function(){
        var element_id = $(this).attr('id');
        convert_bidding_date(element_id);
    });
    $('.open_house_end_date').each(function(){
        var element_id = $(this).attr('id');
        convert_bidding_date(element_id);
    });

    init_datepicker()

    /* tooltip image enbale */
    $('.customToolTip').tooltip({
        animated: 'fade',
        placement: 'right',
        html: true,
        track: true
    })

    // initialize dropzone elements
    initdrozone({
        url: '/admin/save-images/',
        field_name: 'property_image',
        file_accepted: '.png, .jpg, .jpeg, .svg',
        element: 'PropertyImgFrm',
        upload_multiple: false,
        dictDefaultMessage : 'Drop files here to upload <br> Preferred size 1920 X 1080px',
        max_files: 28,
        call_function: set_property_image_details
    });

    initdrozone({
        url: '/admin/save-images/',
        field_name: 'property_document',
        file_accepted: '.pdf',
        element: 'PropertyDocFrm',
        upload_multiple: true,
        dictDefaultMessage : 'Drop files here to upload <br> Allowed format is PDF',
        max_files: 28,
        call_function: set_property_doc_details
    });

    $(document).on('ifChecked', 'input[name="asset_type"]', function(){
        var asset_id = parseInt($(this).val());
        $(this).parsley().reset();
        // show/hide inputs based on asset type
        $('.residential').hide();
        $('.commercial').hide();
        $('.land').hide();
        $('.res_comm_land').hide();
        $('.res_comm').hide();
        $('.res_land').hide();
        $('.comm_land').hide();
        if(parseInt(asset_id) == 1){
            $('.residential').hide();
            $('.commercial').hide();
            $('.land').show();
            $('.res_comm_land').show();
            $('.res_comm').hide();
            $('.res_land').show();
            $('.comm_land').show();
            $('.property_exterior').html('Property Details');
            $('label[for="total_land_acres"]').html('Total Acres <span class="text-danger">*</span>');
            $('#total_land_acres').attr('data-parsley-required', 'true');
        }else if(parseInt(asset_id) == 2){
            $('.residential').hide();
            $('.commercial').show();
            $('.land').hide();
            $('.res_comm_land').show();
            $('.res_comm').show();
            $('.res_land').hide();
            $('.comm_land').show();
            $('.property_exterior').html('Property Exterior');
            $('label[for="total_land_acres"]').html('Total Acres');
            $('#total_land_acres').attr('data-parsley-required', 'false');

        }else if(parseInt(asset_id) == 3){
            $('.residential').show();
            $('.commercial').hide();
            $('.land').hide();
            $('.res_comm_land').show();
            $('.res_comm').show();
            $('.res_land').show();
            $('.comm_land').hide();
            $('.property_exterior').html('Property Exterior');
            $('label[for="total_land_acres"]').html('Total Acres');
            $('#total_land_acres').attr('data-parsley-required', 'false');
        }
        $.ajax({
            url: '/admin/get-property-info-data/',
            type: 'post',
            dateType: 'json',
            cache: false,
            data: {asset_id: asset_id},
            beforeSend: function(){
                $(".loaderDiv").show();
            },
            success: function(response){
                $(".loaderDiv").hide();
                if(response.error == 0){
                    // clear all selectize fields
                    $('select[multiple]').selectize().each(function(index, element) { element.selectize.destroy() })

                    $('#property_type').empty();
                    $('#property_type').append('<option value="">Select</option>');
                    $.each(response.property_type_listing, function(i, item) {
                        $('#property_type').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#property_sub_type').empty();
                    //$('#property_sub_type').append('<option value="">Select</option>');
                    $.each(response.property_sub_type_listing, function(i, item) {
                        $('#property_sub_type').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#lot_size_unit').empty();
                    //$('#lot_size_unit').append('<option value="">Select</option>');
                    $.each(response.lot_size_units, function(i, item) {
                        $('#lot_size_unit').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#term_accepted').empty();
                    //$('#term_accepted').append('<option value="">Select</option>');
                    $.each(response.term_accepted, function(i, item) {
                        $('#term_accepted').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#occupied_by').empty();
                    //$('#occupied_by').append('<option value="">Select</option>');
                    $.each(response.occupied_by, function(i, item) {
                        $('#occupied_by').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#ownership').empty();
                    //$('#ownership').append('<option value="">Select</option>');
                    $.each(response.ownership, function(i, item) {
                        $('#ownership').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#possession').empty();
                    //$('#possession').append('<option value="">Select</option>');
                    $.each(response.possession, function(i, item) {
                        $('#possession').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#property_style').empty();
                    //$('#property_style').append('<option value="">Select</option>');
                    $.each(response.property_styles, function(i, item) {
                        $('#property_style').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#property_stories').empty();
                    //$('#property_stories').append('<option value="">Select</option>');
                    $.each(response.property_stories, function(i, item) {
                        $('#property_stories').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#recent_update').empty();
                    //$('#recent_update').append('<option value="">Select</option>');
                    $.each(response.recent_updates, function(i, item) {
                        $('#recent_update').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#security_feature').empty();
                    //$('#security_feature').append('<option value="">Select</option>');
                    $.each(response.security_features, function(i, item) {
                        $('#security_feature').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#property_cooling').empty();
                    //$('#property_cooling').append('<option value="">Select</option>');
                    $.each(response.property_cooling, function(i, item) {
                        $('#property_cooling').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#property_heating').empty();
                    //$('#property_heating').append('<option value="">Select</option>');
                    $.each(response.property_heating, function(i, item) {
                        $('#property_heating').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#property_electric').empty();
                    //$('#property_electric').append('<option value="">Select</option>');
                    $.each(response.property_electric, function(i, item) {
                        $('#property_electric').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#property_gas').empty();
                    //$('#property_gas').append('<option value="">Select</option>');
                    $.each(response.property_gas, function(i, item) {
                        $('#property_gas').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#property_water').empty();
                    //$('#property_water').append('<option value="">Select</option>');
                    $.each(response.property_water, function(i, item) {
                        $('#property_water').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#property_sewer').empty();
                    //$('#property_sewer').append('<option value="">Select</option>');
                    $.each(response.property_sewer, function(i, item) {
                        $('#property_sewer').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#property_zoning').empty();
                    //$('#property_zoning').append('<option value="">Select</option>');
                    $.each(response.property_zoning, function(i, item) {
                        $('#property_zoning').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#tax_exemption').empty();
                    //$('#tax_exemption').append('<option value="">Select</option>');
                    $.each(response.tax_exemptions, function(i, item) {
                        $('#tax_exemption').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#hoa_amenties').empty();
                    //$('#hoa_amenties').append('<option value="">Select</option>');
                    $.each(response.hoa_amenties, function(i, item) {
                        $('#hoa_amenties').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#kitchen_features').empty();
                    //$('#kitchen_features').append('<option value="">Select</option>');
                    $.each(response.kitchen_features, function(i, item) {
                        $('#kitchen_features').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#appliances').empty();
                    //$('#appliances').append('<option value="">Select</option>');
                    $.each(response.appliances, function(i, item) {
                        $('#appliances').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#property_flooring').empty();
                    //$('#property_flooring').append('<option value="">Select</option>');
                    $.each(response.property_flooring, function(i, item) {
                        $('#property_flooring').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#property_windows').empty();
                    //$('#property_windows').append('<option value="">Select</option>');
                    $.each(response.property_windows, function(i, item) {
                        $('#property_windows').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#bedroom_features').empty();
                    //$('#bedroom_features').append('<option value="">Select</option>');
                    $.each(response.bedroom_features, function(i, item) {
                        $('#bedroom_features').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#bathroom_features').empty();
                    //$('#bathroom_features').append('<option value="">Select</option>');
                    $.each(response.bathroom_features, function(i, item) {
                        $('#bathroom_features').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#master_bedroom_features').empty();
                    //$('#master_bedroom_features').append('<option value="">Select</option>');
                    $.each(response.master_bedroom_features, function(i, item) {
                        $('#master_bedroom_features').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#basement_features').empty();
                    //$('#basement_features').append('<option value="">Select</option>');
                    $.each(response.basement_features, function(i, item) {
                        $('#basement_features').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#other_rooms').empty();
                    //$('#other_rooms').append('<option value="">Select</option>');
                    $.each(response.other_rooms, function(i, item) {
                        $('#other_rooms').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#other_features').empty();
                    //$('#other_features').append('<option value="">Select</option>');
                    $.each(response.other_features, function(i, item) {
                        $('#other_features').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#other_features_land').empty();
                    //$('#other_features_land').append('<option value="">Select</option>');
                    $.each(response.other_features, function(i, item) {
                        $('#other_features_land').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#fire_place_unit').empty();
                    //$('#fire_place_unit').append('<option value="">Select</option>');
                    $.each(response.fire_place_units, function(i, item) {
                        $('#fire_place_unit').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#handicap_amenities').empty();
                    //$('#handicap_amenities').append('<option value="">Select</option>');
                    $.each(response.handicap_amenities, function(i, item) {
                        $('#handicap_amenities').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#property_construction').empty();
                    //$('#property_construction').append('<option value="">Select</option>');
                    $.each(response.property_construction, function(i, item) {
                        $('#property_construction').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#exterior_features').empty();
                    //$('#exterior_features').append('<option value="">Select</option>');
                    $.each(response.exterior_features, function(i, item) {
                        $('#exterior_features').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#roofs').empty();
                    //$('#roofs').append('<option value="">Select</option>');
                    $.each(response.roofs, function(i, item) {
                        $('#roofs').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#foundations').empty();
                    //$('#foundations').append('<option value="">Select</option>');
                    $.each(response.foundations, function(i, item) {
                        $('#foundations').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#fence').empty();
                    //$('#fence').append('<option value="">Select</option>');
                    $.each(response.fence_list, function(i, item) {
                        $('#fence').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#pools').empty();
                    //$('#pools').append('<option value="">Select</option>');
                    $.each(response.pools, function(i, item) {
                        $('#pools').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#garage_parking').empty();
                    //$('#garage_parking').append('<option value="">Select</option>');
                    $.each(response.garage_parkings, function(i, item) {
                        $('#garage_parking').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#garage_features').empty();
                    //$('#garage_features').append('<option value="">Select</option>');
                    $.each(response.garage_features, function(i, item) {
                        $('#garage_features').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#out_buildings').empty();
                    //$('#out_buildings').append('<option value="">Select</option>');
                    $.each(response.out_buildings, function(i, item) {
                        $('#out_buildings').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#location_features').empty();
                    //$('#location_features').append('<option value="">Select</option>');
                    $.each(response.location_features, function(i, item) {
                        $('#location_features').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#road_frontages').empty();
                    //$('#road_frontages').append('<option value="">Select</option>');
                    $.each(response.road_frontages, function(i, item) {
                        $('#road_frontages').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#property_faces').empty();
                    //$('#property_faces').append('<option value="">Select</option>');
                    $.each(response.property_faces, function(i, item) {
                        $('#property_faces').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#lease_type').empty();
                    //$('#lease_type').append('<option value="">Select</option>');
                    $.each(response.lease_types, function(i, item) {
                        $('#lease_type').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#tenant_pays').empty();
                    //$('#tenant_pays').append('<option value="">Select</option>');
                    $.each(response.tenant_pays, function(i, item) {
                        $('#tenant_pays').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#inclusions').empty();
                    //$('#inclusions').append('<option value="">Select</option>');
                    $.each(response.inclusions, function(i, item) {
                        $('#inclusions').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#building_class').empty();
                    //$('#building_class').append('<option value="">Select</option>');
                    $.each(response.building_classes, function(i, item) {
                        $('#building_class').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#interior_features').empty();
                    //$('#interior_features').append('<option value="">Select</option>');
                    $.each(response.interior_features, function(i, item) {
                        $('#interior_features').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#mineral_rights').empty();
                    //$('#mineral_rights').append('<option value="">Select</option>');
                    $.each(response.mineral_rights, function(i, item) {
                        $('#mineral_rights').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#easements').empty();
                    //$('#easements').append('<option value="">Select</option>');
                    $.each(response.easements, function(i, item) {
                        $('#easements').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#survey').empty();
                    //$('#survey').append('<option value="">Select</option>');
                    $.each(response.survey, function(i, item) {
                        $('#survey').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#utilities').empty();
                    //$('#utilities').append('<option value="">Select</option>');
                    $.each(response.utilities, function(i, item) {
                        $('#utilities').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#improvements').empty();
                    //$('#improvements').append('<option value="">Select</option>');
                    $.each(response.improvements, function(i, item) {
                        $('#improvements').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#irrigation_system').empty();
                    //$('#irrigation_system').append('<option value="">Select</option>');
                    $.each(response.irrigation_system, function(i, item) {
                        $('#irrigation_system').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#topography').empty();
                    //$('#topography').append('<option value="">Select</option>');
                    $.each(response.topography, function(i, item) {
                        $('#topography').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#wildlife').empty();
                    //$('#wildlife').append('<option value="">Select</option>');
                    $.each(response.wildlife, function(i, item) {
                        $('#wildlife').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#fish').empty();
                    //$('#fish').append('<option value="">Select</option>');
                    $.each(response.fish, function(i, item) {
                        $('#fish').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#recreation').empty();
                    //$('#recreation').append('<option value="">Select</option>');
                    $.each(response.recreation, function(i, item) {
                        $('#recreation').append('<option value="'+item.id+'">'+item.name+'</option>');
                    });
                    $('#property_type').trigger("chosen:updated");
                    $('#property_sub_type').trigger("chosen:updated");
                    $('#lot_size_unit').trigger("chosen:updated");
                    $('#term_accepted').trigger("chosen:updated");
                    $('#occupied_by').trigger("chosen:updated");
                    $('#ownership').trigger("chosen:updated");
                    $('#possession').trigger("chosen:updated");
                    $('#property_style').trigger("chosen:updated");
                    $('#property_stories').trigger("chosen:updated");
                    $('#recent_update').trigger("chosen:updated");
                    $('#security_feature').trigger("chosen:updated");
                    $('#property_cooling').trigger("chosen:updated");
                    $('#property_heating').trigger("chosen:updated");
                    $('#property_electric').trigger("chosen:updated");
                    $('#property_gas').trigger("chosen:updated");
                    $('#property_water').trigger("chosen:updated");
                    $('#property_sewer').trigger("chosen:updated");
                    $('#property_zoning').trigger("chosen:updated");
                    $('#tax_exemption').trigger("chosen:updated");
                    $('#hoa_amenties').trigger("chosen:updated");
                    $('#kitchen_features').trigger("chosen:updated");
                    $('#appliances').trigger("chosen:updated");
                    $('#property_flooring').trigger("chosen:updated");
                    $('#property_windows').trigger("chosen:updated");
                    $('#bedroom_features').trigger("chosen:updated");
                    $('#bathroom_features').trigger("chosen:updated");
                    $('#master_bedroom_features').trigger("chosen:updated");
                    $('#basement_features').trigger("chosen:updated");
                    $('#other_rooms').trigger("chosen:updated");
                    $('#other_features').trigger("chosen:updated");
                    $('#other_features_land').trigger("chosen:updated");
                    $('#fire_place_unit').trigger("chosen:updated");
                    $('#handicap_amenities').trigger("chosen:updated");
                    $('#property_construction').trigger("chosen:updated");
                    $('#exterior_features').trigger("chosen:updated");
                    $('#roofs').trigger("chosen:updated");
                    $('#foundations').trigger("chosen:updated");
                    $('#fence').trigger("chosen:updated");
                    $('#pools').trigger("chosen:updated");
                    $('#garage_parking').trigger("chosen:updated");
                    $('#garage_features').trigger("chosen:updated");
                    $('#out_buildings').trigger("chosen:updated");
                    $('#location_features').trigger("chosen:updated");
                    $('#road_frontages').trigger("chosen:updated");
                    $('#property_faces').trigger("chosen:updated");
                    $('#lease_type').trigger("chosen:updated");
                    $('#tenant_pays').trigger("chosen:updated");
                    $('#inclusions').trigger("chosen:updated");
                    $('#building_class').trigger("chosen:updated");
                    $('#interior_features').trigger("chosen:updated");
                    $('#mineral_rights').trigger("chosen:updated");
                    $('#easements').trigger("chosen:updated");
                    $('#survey').trigger("chosen:updated");
                    $('#utilities').trigger("chosen:updated");
                    $('#improvements').trigger("chosen:updated");
                    $('#irrigation_system').trigger("chosen:updated");
                    $('#topography').trigger("chosen:updated");
                    $('#fish').trigger("chosen:updated");
                    $('#recreation').trigger("chosen:updated");
                    $('#wildlife').trigger("chosen:updated");
                    // reinitialize multi select
                    init_selectize();
                    // reinit parsley
                    $('#property_info_frm').parsley().destroy();
                    $('#property_info_frm').parsley({excluded: "input[type=button], :hidden"});
                }else{
                }
            }
        });
    })

    .on("change, input", '#site_id' , function(e) {
        if(this.value == ''){
            return false
        }
        $.ajax({
            url: '/admin/load-active-domain-agents/',
            type: 'post',
            dateType: 'json',
            cache: false,
            data: {'site_id': this.value},
            beforeSend: function(){
                $(".loaderDiv").show();
            },
            success: function(response){
                $(".loaderDiv").hide();
                console.log(response)
                $('#user_id').find('option').not(':first').remove();
                if(response.error == 0 || response.status == 200 || response.status == 201){
                    response.data.forEach(element => {
                        $('#user_id').append($('<option>', {
                            value: element.id,
                            text: element.name
                        }));
                        // auto select based on selected value
                        // $('#user_id').val($('#user_id').attr('data-selected'))
                    });

                } else {
                    showAlert(response.msg, 1)
                }
            }
        });
    })

    .on('click', '#addVideoBtn', function(e){
        e.preventDefault();
        var upload_id = '';
        var actual_id = '';
        var upload_name = '';
        var actual_name = '';
        var property_id = $('.property_id').val();
        var video_url = $('#property_video_url').val();
        if(video_url != ""){
            $.ajax({
                url: '/admin/save-property-video/',
                type: 'post',
                dateType: 'json',
                cache: false,
                data: {property_id: property_id, video_url: video_url, site_id: $('#site_id').val()},
                beforeSend: function(){
                    $(".loaderDiv").show();
                },
                success: function(response){
                    $(".loaderDiv").hide();
                    console.log(response);
                    if(response.error == 0){
                        showAlert(response.msg, 0)
                        // var video_url = $('#property_video_url').val();
                        var property_video_id = $('#property_video_id').val();
                        var property_video_name = $('#property_video_name').val();
                        if(response.data.upload_id){
                            upload_id = response.data.upload_id.toString();
                            video_url = response.data.video_url
                            $('#PropertyVideoDiv').append(
                                '<div class="col-md-55" rel_id="'+upload_id+'" rel_position="" >' +
                                '<div class="thumbnail">' +
                                   '<div class="image view view-first">'+
                                      '<iframe width="100%" height="100%" src="'+video_url+'" frameborder="0" allowfullscreen></iframe></iframe>'+
                                   '</div>'+
                                   '<div class="caption">'+
                                      '<div class="move">'+
                                         '<!-- <i class="fa fa-arrows-alt"></i> Move -->'+
                                         '<a href="javascript:void(0)" data-article-id="'+property_id+'" data-image-id="' + upload_id + '" data-image-name="' + video_url + '" data-image-section="property_video"  class="close-btn confirm_image_delete" style="float:right;"><i class="fa fa-remove"></i> Remove</a>'+
                                      '</div>'+
                                   '</div>'+
                                '</div>' +
                             '</div>'
                            );
                            upload_id = upload_id+','+property_video_id;
                            actual_id = upload_id.replace(/(^,)|(,$)/g, "");
                            upload_name = video_url+','+property_video_name;
                            actual_name = upload_name.replace(/(^,)|(,$)/g, "");
                            $('#property_video_id').val(actual_id);
                            $('#property_video_name').val(actual_name);
                            $('#PropertyVideoDiv').show();
                        }

                    }else{
                        showAlert(response.msg, 1)
                    }
                }
            });
        }
    })


    .on('click', '.confirm_image_delete', function(){
        var data_count = '';
        var data_article_id = '';
        var agent_id = '';
        var user_id = '';
        var section = $(this).attr('data-image-section');
        var image_id = $(this).attr('data-image-id');
        var image_name = $(this).attr('data-image-name');
        if($(this).attr('data-count')){
            data_count = $(this).attr('data-count');
        }
        if($(this).attr('data-article-id')){
            data_article_id = $(this).attr('data-article-id');
        }
        var agent_id = $('#add_agent_form #agent_id').val();
        var user_id = $('#update_user_frm #update_user_id').val();
        $('#confirmImageDeleteModal #popup_article_id').val(data_article_id);
        $('#confirmImageDeleteModal #popup_section').val(section);
        $('#confirmImageDeleteModal #popup_image_id').val(image_id);
        $('#confirmImageDeleteModal #popup_image_name').val(image_name);
        $('#confirmImageDeleteModal #popup_count').val(data_count);
        $('#confirmImageDeleteModal #popup_agent_id').val(agent_id);
        $('#confirmImageDeleteModal #popup_user_id').val(user_id);

        $('#confirmImageDeleteModal').modal('show');
    })


    .on('click', '#del_image_false', function(){
        $('#confirmImageDeleteModal #popup_article_id').val('');
        $('#confirmImageDeleteModal #popup_section').val('');
        $('#confirmImageDeleteModal #popup_image_id').val('');
        $('#confirmImageDeleteModal #popup_image_name').val('');
        $('#confirmImageDeleteModal #popup_count').val('');
        $('#confirmImageDeleteModal #popup_agent_id').val('');
        $('#confirmImageDeleteModal').modal('hide');
    })


    .on('click', '#del_image_true', function(e){
        e.preventDefault();
        var article_id = $('#confirmImageDeleteModal #popup_article_id').val();
        var section= $('#confirmImageDeleteModal #popup_section').val();
        var id = $('#confirmImageDeleteModal #popup_image_id').val();
        var name = $('#confirmImageDeleteModal #popup_image_name').val();
        var count = $('#confirmImageDeleteModal #popup_count').val();
        var agent_id = $('#confirmImageDeleteModal #popup_agent_id').val();
        var popup_user_id = $('#confirmImageDeleteModal #popup_user_id').val();
        del_params = {
            article_id: article_id,
            section: section,
            id: id,
            name: name,
            count: count,
            agent_id: agent_id,
            popup_user_id: popup_user_id,
        }
        delete_image(del_params);
        $('#confirmImageDeleteModal').modal('hide');
        if(popup_user_id != ""){
            //get_popup_user_details(popup_user_id);
            $('#updateEditUserModal').modal('show');
        }
    })

    .on('change', '#auction_type', function(){

        var auction_type = $(this).val();
        init_auction_start_date();
        init_auction_end_date();
        $('#datetimepicker2').attr('data-value','');
        $('#virtual_bidding_start_date').val('');
        $('#bidding_start_date_local').val('');
        $('#bidding_start_date').val('');
        $('#virtual_bidding_end_date').val('');
        $('#bidding_end_date_local').val('');
        $('#bidding_end_date').val('');
        //reset hybrid insider fields
        $('#insider_start_price').val('');
        $('#price_decrease_rate').val('1');
        $('#price_decrease_rate_value').html('1 %');
        $('#dutch_auction_time').val('10');
        $('#dutch_auction_time_value').html('10 Min');
        $('#dutch_pause_time').val('1');
        $('#dutch_pause_time_value').html('1 Min');
        $('#datetimepicker5').attr('data-value','');
        $('#virtual_dutch_bidding_start_date').val('');
        $('#dutch_bidding_start_date_local').val('');
        $('#dutch_bidding_start_date').val('');
        $('#datetimepicker6').attr('data-value','');
        $('#virtual_dutch_bidding_end_date').val('');
        $('#dutch_bidding_end_date_local').val('');
        $('#dutch_bidding_end_date').val('');
        $('#sealed_auction_time').val('1');
        $('#sealed_auction_time_value').html('1 Min');
        $('#sealed_pause_time').val('1');
        $('#sealed_pause_time_value').html('1 Min');
        $('#datetimepicker7').attr('data-value','');
        $('#virtual_sealed_bidding_start_date').val('');
        $('#sealed_bidding_start_date_local').val('');
        $('#sealed_bidding_start_date').val('');
        $('#datetimepicker8').attr('data-value','');
        $('#virtual_sealed_bidding_end_date').val('');
        $('#sealed_bidding_end_date_local').val('');
        $('#sealed_bidding_end_date').val('');
        $('#english_auction_time').val('1');
        $('#english_auction_time_value').html('1 Min');
        $('#insider_bid_increment').val('');
        $('#datetimepicker9').attr('data-value','');
        $('#virtual_english_bidding_start_date').val('');
        $('#english_bidding_start_date_local').val('');
        $('#english_bidding_start_date').val('');
        $('#datetimepicker10').attr('data-value','');
        $('#virtual_english_bidding_end_date').val('');
        $('#english_bidding_end_date_local').val('');
        $('#english_bidding_end_date').val('');
        if(parseInt(auction_type) == 1){
            $('label[for="virtual_bidding_start_date"]').html('Bidding Starting Time <span class="text-danger" style="">*</span>');
            $('label[for="virtual_bidding_end_date"]').html('Bidding Ending Time <span class="text-danger" style="">*</span>');
            $('#startTimeDivSection, #endTimeDivSection').show()
            $('.best_offer_section').hide();
            $('.offer_amount').hide();
            $('.bidding_time_zone').show();
            $('.bid_increment').show();
            $('.reserve_amount').show();
            $('.auction_location').hide();
            $('label[for="bidding_min_price"]').html('Bid Minimum Price <span class="text-danger">*</span>');
            $('#bidding_min_price').attr('placeholder','Enter Bid Minimum Price');
            $('.offer_unpriced_section').hide();
            $('#insider_auction_section').hide();
            $('#bid_minimum_price_section').show();
        }
        if(parseInt(auction_type) == 4){
            $('.best_offer_section').hide();
            $('#startTimeDivSection, #endTimeDivSection').hide()
            $('.bidding_time_zone').hide();
            $('.bid_increment').hide();
            $('.reserve_amount').hide();
            $('.offer_amount').hide();
            $('.auction_location').hide();
            $('label[for="bidding_min_price"]').html('Asking Price <span class="text-danger">*</span>');
            $('#bidding_min_price').attr('placeholder','Enter Asking Price');
            $('.offer_unpriced_section').hide();
            $('#insider_auction_section').hide();
            $('#bid_minimum_price_section').show();
        }
        if(parseInt(auction_type) == 7){
            $('.best_offer_section').show();
            $('label[for="virtual_bidding_start_date"]').html('Offer Starting Time <span class="text-danger" style="">*</span>');
            $('label[for="virtual_bidding_end_date"]').html('Offer Ending Time <span class="text-danger" style="">*</span>');
            $('#startTimeDivSection, #endTimeDivSection').show()
            $('.auction_location').hide();
            $('.offer_amount').hide();
            $('.bidding_time_zone').show();
            $('.bid_increment').hide();
            $('.reserve_amount').hide();
            $('label[for="bidding_min_price"]').html('Asking Price <span class="text-danger">*</span>');
            $('#bidding_min_price').attr('placeholder','Enter Asking Price');
            $('.offer_unpriced_section').show();
            $('#insider_auction_section').hide();
            $('#bid_minimum_price_section').show();
        }
        if(parseInt(auction_type) == 6){
            $('.best_offer_section').hide();
            $('label[for="virtual_bidding_start_date"]').html('Bidding Starting Time <span class="text-danger" style="">*</span>');
            $('label[for="virtual_bidding_end_date"]').html('Bidding Ending Time <span class="text-danger" style="">*</span>');
            $('#startTimeDivSection, #endTimeDivSection').show()
            $('.bidding_time_zone').show();
            $('.bid_increment').hide();
            $('.auction_location').show();
            $('.reserve_amount').show();
            $('.offer_amount').hide();
            $('label[for="bidding_min_price"]').html('Bid Minimum Price <span class="text-danger">*</span>');
            $('#bidding_min_price').attr('placeholder','Enter Bid Minimum Price');
            $('.offer_unpriced_section').hide();
            $('#insider_auction_section').hide();
            $('#bid_minimum_price_section').show();
        }
        if(parseInt(auction_type) == 2){
            $('.best_offer_section').hide();
            $('.offer_unpriced_section').hide();
            $('.bidding_date').hide();
            $('#startTimeDivSection, #endTimeDivSection').hide();
            $('.bidding_time_zone').show();
            $('.bid_increment').hide();
            $('.auction_location').hide();
            $('.reserve_amount').hide();
            $('#bid_minimum_price_section').hide();
            $('#insider_auction_section').show();
        }

        // reinit parsley
        $('#property_info_frm').parsley().destroy();
        $('#property_info_frm').parsley({excluded: "input[type=button], :hidden"});

        $.ajax({
            url: '/admin/get-auction-type-status/',
            type: 'post',
            dataType: 'json',
            cache: false,
            data: {'auction_type': auction_type},
            beforeSend: function(){
            },
            success: function(response){
                console.log(response)
                if(response.error == 0){
                    $('#property_info_frm #prop_listing_status').empty();
                    $('#property_info_frm #prop_listing_status').html('<option value="">Select</option>');
                    $.each(response.status_list, function(i, item) {
                        $('#property_info_frm #prop_listing_status').append('<option value="'+item.id+'">'+item.status_name+'</option>');
                    });
                }
            }
        });
    })


    .on('click', ".plus_date_div", function () {
        var new_div = $(".add_more_open_house_date:last").clone().insertAfter(".add_more_open_house_date:last");
        var count = parseInt($('#total_section').val());
        $(".plus_date_div").hide();
        $(".plus_date_div:first").show();
        $(".minus_date_div").show();
        $(".minus_date_div:first").hide();
        // parsley remove errors if any
        // parsleyStartId = new_div.find(".virtual_open_house_start_date").attr('data-parsley-id')
        // parsleyEndId = new_div.find(".virtual_open_house_end_date").attr('data-parsley-id')
        new_div.find(".virtual_open_house_start_date").removeClass('parsley-error')
        new_div.find(".virtual_open_house_end_date").removeClass('parsley-error')
        new_div.find('.parsley-errors-list').empty();
        // end parslet stuff
        new_div.attr('id', 'add_more_open_house_date_' + count).attr('rel_position', count);
        new_div.find(".virtual_open_house_start_date").attr('id', 'virtual_open_house_start_date_' + count).attr('name','virtual_open_house_start_date_'+count).closest('.input-group').siblings('label').attr('for', 'virtual_open_house_start_date_' + count);
        $('#virtual_open_house_start_date_' + count).val('');
        new_div.find(".open_house_start_date_local").attr('id', 'open_house_start_date_local_' + count).attr('name','open_house_start_date_local_'+count);
        $('#open_house_start_date_local_' + count).val('');
        new_div.find(".open_house_start_date").attr('id', 'open_house_start_date_' + count).attr('name','open_house_start_date_'+count);
        $('#open_house_start_date_' + count).val('');

        new_div.find(".virtual_open_house_end_date").attr('id', 'virtual_open_house_end_date_' + count).attr('name','virtual_open_house_end_date_'+count).closest('.input-group').siblings('label').attr('for', 'virtual_open_house_end_date_' + count);
        $('#virtual_open_house_end_date_' + count).val('');
        new_div.find(".open_house_end_date_local").attr('id', 'open_house_end_date_local_' + count).attr('name','open_house_end_date_local_'+count);
        $('#open_house_end_date_local_' + count).val('');
        new_div.find(".open_house_end_date").attr('id', 'open_house_end_date_' + count).attr('name','open_house_end_date_'+count);
        new_div.find('.minus_date_div').attr('data-id', count)
        new_div.find('.virtual_open_house_start_date').attr('data-parsley-open-house-end-date', count)
        $('#open_house_end_date_' + count).val('');

        count = count+1;
        $('#total_section').val(count);
        init_datepicker();
        $('#property_info_frm').parsley().destroy();
        $('#property_info_frm').parsley({excluded: "input[type=button], :hidden"});
    })

    .on('click', '.minus_date_div', function(){
        var elementToBeDeleted  = $(this).attr('data-id')
        var r = confirm("Are you sure, you want to remove this?");
        if (r == true) {
            $('#add_more_open_house_date_'+elementToBeDeleted).remove();
            var total_section = parseInt($('div.add_more_open_house_date').length);
            $(".add_more_open_house_date").each(function(index){
              $(this).find('.virtual_open_house_start_date').attr('id','virtual_open_house_start_date_'+index).attr('name','virtual_open_house_start_date_'+index).closest('.input-group').siblings('label').attr('for','virtual_open_house_start_date_'+index);
              $(this).find('.open_house_start_date_local').attr('id','open_house_start_date_local_'+index).attr('name','open_house_start_date_local_'+index);
              $(this).find('.open_house_start_date').attr('id','open_house_start_date_'+index).attr('name','open_house_start_date_'+index);

              $(this).find('.virtual_open_house_end_date').attr('id','virtual_open_house_end_date_'+index).attr('name','virtual_open_house_end_date_'+index).closest('.input-group').siblings('label').attr('for','virtual_open_house_end_date_'+index);
              $(this).find('.open_house_end_date_local').attr('id','open_house_end_date_local_'+index).attr('name','open_house_end_date_local_'+index);
              $(this).find('.open_house_end_date').attr('id','open_house_end_date_'+index).attr('name','open_house_end_date_'+index);

              $(this).attr('id','add_more_open_house_date_'+index).attr('rel_position', index);
              $(this).find('.minus_date_div').attr('data-id', index)
              $(this).find('.virtual_open_house_start_date').attr('data-parsley-open-house-end-date', index)

            });
            $('#total_section').val(total_section);
        }

    })

    .on('keyup', '#property_zip_code', function(){
        console.log('hi zip code')
        zip_code = $(this).val();
        if(zip_code.length > 4){
            params = {
            'zip_code': zip_code,
            'call_function': set_property_address_by_zipcode,
            }
            get_address_by_zipcode(params);
        }
   })

   .on('change', '#prop_listing_status', function(){
        var auction_type = $('option:selected','#auction_type').val();
        var current_listing_status = $('#current_listing_status').val();
        $('#property_info_frm  #closing_status').val("");
        if(parseInt(auction_type) == 4 && parseInt(current_listing_status) == 9 && parseInt($(this).val()) == 1){
            $('.closing_asterisk').hide();
            $('#confirmChangeStatusModal').modal('show');
            return false;
        }else if(parseInt($(this).val()) == 9){
            $('.closing_asterisk').show();

        }else{
            $('#is_reset_offer').val(0);
            $('.closing_asterisk').hide();
        }

    })

    .on('click', '#change_status_true', function(){
        $('#is_reset_offer').val(1);
        $('#confirmChangeStatusModal').modal('hide');
        return true;

    })

    .on('click', '#change_status_false,#change_status_false_top', function(){
        $('#prop_listing_status').val(9);
        $('#is_reset_offer').val(0);
        $('#confirmChangeStatusModal').modal('hide');

    })

    .on('click', '.glyphicon-calendar', function(event){
        event.preventDefault();
        $(this).parent().parent().children('.date-picker-listing').focus()
    })

    .on('ifChecked', '#earnest_deposit_type_1, #earnest_deposit_type_2',function(e){
        $('#earnest_deposit').val('');
    })

    .on('blur change', '#cap_rate',function(e) {
        this.value = this.value.replace(/^0+(?=\d)/,'');
    })

    .on('input', '#property_info_frm #insider_start_price',function(e){
        $(this).val(function (index, value) {
            if(value == "$" || value == ""){
                $('#price_decrease_value').html('$0');
                return "";

            }else{
                //return '$' + value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                var input_value =  value.replace(/(?!\.)\D/g, "").replace(/(?<=\..*)\./g, "").replace(/(?<=\.\d\d).*/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                try{
                    if($('#price_decrease_rate').val() != "" && parseInt($('#price_decrease_rate').val()) != 0){
                        var start_price = parseFloat(input_value.replace('$','').replace(/,/g, ''));
                        var decrease_rate = parseFloat($('#price_decrease_rate').val());
                        var decrease_value = (start_price - ((start_price*decrease_rate)/100));
                        if(decrease_value > parseInt(decrease_value)){
                            decrease_value = numberFormat(decrease_value);
                        }else{
                            decrease_value = numberFormat(parseInt(decrease_value));
                        }
                        $('#price_decrease_value').html('$'+decrease_value);
                    }else{
                        $('#price_decrease_value').html('$'+input_value);
                    }
                }catch(ex){

                }
                return value;
            }
        });

    })

    .on('input', '#property_info_frm #price_decrease_rate', function(e){
        $(this).val(function (index, value) {
            var input_value =  $('#insider_start_price').val();
            if(input_value != "" && (value == "" || value == 0)){
                $('#price_decrease_value').html(input_value);
            }else{
                try{
                    if(value != "" && parseInt(value) != 0){
                        var start_price = parseFloat(input_value.replace('$','').replace(/,/g, ''));
                        var decrease_rate = parseFloat(value);
                        var decrease_value = (start_price - ((start_price*decrease_rate)/100));
                        if(decrease_value > parseInt(decrease_value)){
                            decrease_value = numberFormat(decrease_value);
                        }else{
                            decrease_value = numberFormat(parseInt(decrease_value));
                        }
                        $('#price_decrease_value').html('$'+decrease_value);
                    }else{
                        $('#price_decrease_value').html(input_value);
                    }
                }catch(ex){

                }
            }
            return value;

        });

    });

    $('#offer_unpriced').change(function() {
        if(this.checked) {
            $('#bidding_min_price').attr('data-parsley-required', 'false');
        } else {
            $('#bidding_min_price').attr('data-parsley-required', 'true');
        }
        $('#property_info_frm').parsley();    
    });

    $('#property_info_frm #dutch_auction_time').on('input',function(e){

        $(this).val(function (index, value) {
            if(value != ""){
                $('#dutch_auction_time_value').html(value+' Min');
            }else{
                $('#dutch_auction_time_value').html('10 Min');
            }

            var dates = $('#virtual_dutch_bidding_start_date').val();
            if(value != "" && dates != ""){
                var actualStartDate = dates.split(" ");
                // var mdy_format = actualStartDate[0].split("-");
                // mdy_date = mdy_format[2]+"-"+mdy_format[0]+"-"+mdy_format[1];
                actualStartDate = actualStartDate[0]+' '+convert_to_24h(actualStartDate[1]+' '+actualStartDate[2]);
                var utc_date = convert_to_utc_datetime(actualStartDate, 'datetime');
                $("#dutch_bidding_start_date_local").val(actualStartDate);
                $("#dutch_bidding_start_date").val(utc_date);
                try{
                   custom_response = {
                    'add_min': value,
                    'actualStartDate': actualStartDate,
                    'date_virtual_element_id': '#virtual_dutch_bidding_end_date',
                    'date_local_element_id': '#dutch_bidding_end_date_local',
                    'date_utc_element_id': '#dutch_bidding_end_date',
                  };
                  customCallBackFunc(calculate_insider_dates, [custom_response]);
                }catch(ex){
                    //console.log(ex);
                }
                var dutch_pause_time =  $('#property_info_frm #dutch_pause_time').val();
                var dutch_end_date = $('#dutch_bidding_end_date_local').val();
                if(dutch_pause_time != "" && dutch_end_date != ""){
                    try{
                       custom_response = {
                        'add_min': dutch_pause_time,
                        'actualStartDate': dutch_end_date,
                        'date_virtual_element_id': '#virtual_sealed_bidding_start_date',
                        'date_local_element_id': '#sealed_bidding_start_date_local',
                        'date_utc_element_id': '#sealed_bidding_start_date',
                      };
                      customCallBackFunc(calculate_insider_dates, [custom_response]);
                    }catch(ex){
                        //console.log(ex);
                    }
                }
                var sealed_auction_time = $('#property_info_frm #sealed_auction_time').val();
                var sealed_start_date = $('#sealed_bidding_start_date_local').val();
                if(sealed_auction_time != "" && sealed_start_date != ""){
                    try{
                       custom_response = {
                        'add_min': sealed_auction_time,
                        'actualStartDate': sealed_start_date,
                        'date_virtual_element_id': '#virtual_sealed_bidding_end_date',
                        'date_local_element_id': '#sealed_bidding_end_date_local',
                        'date_utc_element_id': '#sealed_bidding_end_date',
                      };
                      customCallBackFunc(calculate_insider_dates, [custom_response]);
                    }catch(ex){
                        //console.log(ex);
                    }
                }
                var sealed_pause_time = $('#property_info_frm #sealed_pause_time').val();
                var sealed_end_date = $('#sealed_bidding_end_date_local').val();
                if(sealed_pause_time != "" && sealed_end_date != ""){
                    try{
                       custom_response = {
                        'add_min': sealed_pause_time,
                        'actualStartDate': sealed_end_date,
                        'date_virtual_element_id': '#virtual_english_bidding_start_date',
                        'date_local_element_id': '#english_bidding_start_date_local',
                        'date_utc_element_id': '#english_bidding_start_date',
                      };
                      customCallBackFunc(calculate_insider_dates, [custom_response]);
                    }catch(ex){
                        //console.log(ex);
                    }
                }
                var english_auction_time = $('#property_info_frm #english_auction_time').val();
                var english_start_date = $('#english_bidding_start_date_local').val();
                if(english_auction_time != "" && english_start_date != ""){
                    try{
                       custom_response = {
                        'add_min': english_auction_time,
                        'actualStartDate': english_start_date,
                        'date_virtual_element_id': '#virtual_english_bidding_end_date',
                        'date_local_element_id': '#english_bidding_end_date_local',
                        'date_utc_element_id': '#english_bidding_end_date',
                      };
                      customCallBackFunc(calculate_insider_dates, [custom_response]);
                    }catch(ex){
                        //console.log(ex);
                    }
                }
            }

            return value;
        });

    });
    $('#property_info_frm #dutch_pause_time').on('input',function(e){
        $(this).val(function (index, value) {
            if(value != ""){
                $('#dutch_pause_time_value').html(value+' Min');
            }else{
                $('#dutch_pause_time_value').html('1 Min');
            }
            var dates = $('#virtual_dutch_bidding_end_date').val();
            if(value != "" && dates != ""){
                var actualStartDate = dates.split(" ");
                // var mdy_format = actualStartDate[0].split("-");
                // mdy_date = mdy_format[2]+"-"+mdy_format[0]+"-"+mdy_format[1];
                actualStartDate = actualStartDate[0]+' '+convert_to_24h(actualStartDate[1]+' '+actualStartDate[2]);
                var utc_date = convert_to_utc_datetime(actualStartDate, 'datetime');
                $("#dutch_bidding_end_date_local").val(actualStartDate);
                $("#dutch_bidding_end_date").val(utc_date);
                try{
                   custom_response = {
                    'add_min': value,
                    'actualStartDate': actualStartDate,
                    'date_virtual_element_id': '#virtual_sealed_bidding_start_date',
                    'date_local_element_id': '#sealed_bidding_start_date_local',
                    'date_utc_element_id': '#sealed_bidding_start_date',
                  };
                  customCallBackFunc(calculate_insider_dates, [custom_response]);
                }catch(ex){
                    //console.log(ex);
                }

                var sealed_auction_time = $('#property_info_frm #sealed_auction_time').val();
                var sealed_start_date = $('#sealed_bidding_start_date_local').val();
                if(sealed_auction_time != "" && sealed_start_date != ""){
                    try{
                       custom_response = {
                        'add_min': sealed_auction_time,
                        'actualStartDate': sealed_start_date,
                        'date_virtual_element_id': '#virtual_sealed_bidding_end_date',
                        'date_local_element_id': '#sealed_bidding_end_date_local',
                        'date_utc_element_id': '#sealed_bidding_end_date',
                      };
                      customCallBackFunc(calculate_insider_dates, [custom_response]);
                    }catch(ex){
                        //console.log(ex);
                    }
                }
                var sealed_pause_time = $('#property_info_frm #sealed_pause_time').val();
                var sealed_end_date = $('#sealed_bidding_end_date_local').val();
                if(sealed_pause_time != "" && sealed_end_date != ""){
                    try{
                       custom_response = {
                        'add_min': sealed_pause_time,
                        'actualStartDate': sealed_end_date,
                        'date_virtual_element_id': '#virtual_english_bidding_start_date',
                        'date_local_element_id': '#english_bidding_start_date_local',
                        'date_utc_element_id': '#english_bidding_start_date',
                      };
                      customCallBackFunc(calculate_insider_dates, [custom_response]);
                    }catch(ex){
                        //console.log(ex);
                    }
                }
                var english_auction_time = $('#property_info_frm #english_auction_time').val();
                var english_start_date = $('#english_bidding_start_date_local').val();
                if(english_auction_time != "" && english_start_date != ""){
                    try{
                       custom_response = {
                        'add_min': english_auction_time,
                        'actualStartDate': english_start_date,
                        'date_virtual_element_id': '#virtual_english_bidding_end_date',
                        'date_local_element_id': '#english_bidding_end_date_local',
                        'date_utc_element_id': '#english_bidding_end_date',
                      };
                      customCallBackFunc(calculate_insider_dates, [custom_response]);
                    }catch(ex){
                        //console.log(ex);
                    }
                }
            }
            return value;
        });

    });
    $('#property_info_frm #sealed_auction_time').on('input',function(e){
        $(this).val(function (index, value) {
            if(value != ""){
                $('#sealed_auction_time_value').html(value+' Min');
            }else{
                $('#sealed_auction_time_value').html('1 Min');
            }
            var dates = $('#virtual_sealed_bidding_start_date').val();
            if(value != "" && dates != ""){
                var actualStartDate = dates.split(" ");
                // var mdy_format = actualStartDate[0].split("-");
                // mdy_date = mdy_format[2]+"-"+mdy_format[0]+"-"+mdy_format[1];
                actualStartDate = actualStartDate[0]+' '+convert_to_24h(actualStartDate[1]+' '+actualStartDate[2]);
                var utc_date = convert_to_utc_datetime(actualStartDate, 'datetime');
                $("#sealed_bidding_start_date_local").val(actualStartDate);
                $("#sealed_bidding_start_date").val(utc_date);
                try{
                   custom_response = {
                    'add_min': value,
                    'actualStartDate': actualStartDate,
                    'date_virtual_element_id': '#virtual_sealed_bidding_end_date',
                    'date_local_element_id': '#sealed_bidding_end_date_local',
                    'date_utc_element_id': '#sealed_bidding_end_date',
                  };
                  customCallBackFunc(calculate_insider_dates, [custom_response]);
                }catch(ex){
                    //console.log(ex);
                }

                var sealed_pause_time = $('#property_info_frm #sealed_pause_time').val();
                var sealed_end_date = $('#sealed_bidding_end_date_local').val();
                if(sealed_pause_time != "" && sealed_end_date != ""){
                    try{
                       custom_response = {
                        'add_min': sealed_pause_time,
                        'actualStartDate': sealed_end_date,
                        'date_virtual_element_id': '#virtual_english_bidding_start_date',
                        'date_local_element_id': '#english_bidding_start_date_local',
                        'date_utc_element_id': '#english_bidding_start_date',
                      };
                      customCallBackFunc(calculate_insider_dates, [custom_response]);
                    }catch(ex){
                        //console.log(ex);
                    }
                }
                var english_auction_time = $('#property_info_frm #english_auction_time').val();
                var english_start_date = $('#english_bidding_start_date_local').val();
                if(english_auction_time != "" && english_start_date != ""){
                    try{
                       custom_response = {
                        'add_min': english_auction_time,
                        'actualStartDate': english_start_date,
                        'date_virtual_element_id': '#virtual_english_bidding_end_date',
                        'date_local_element_id': '#english_bidding_end_date_local',
                        'date_utc_element_id': '#english_bidding_end_date',
                      };
                      customCallBackFunc(calculate_insider_dates, [custom_response]);
                    }catch(ex){
                        //console.log(ex);
                    }
                }
            }
            return value;
        });

    });
    $('#property_info_frm #sealed_pause_time').on('input',function(e){
        $(this).val(function (index, value) {
            if(value != ""){
                $('#sealed_pause_time_value').html(value+' Min');
            }else{
                $('#sealed_pause_time_value').html('1 Min');
            }
            var dates = $('#virtual_sealed_bidding_end_date').val();
            if(value != "" && dates != ""){
                var actualStartDate = dates.split(" ");
                // var mdy_format = actualStartDate[0].split("-");
                // mdy_date = mdy_format[2]+"-"+mdy_format[0]+"-"+mdy_format[1];
                actualStartDate = actualStartDate[0]+' '+convert_to_24h(actualStartDate[1]+' '+actualStartDate[2]);
                var utc_date = convert_to_utc_datetime(actualStartDate, 'datetime');
                $("#sealed_bidding_end_date_local").val(actualStartDate);
                $("#sealed_bidding_end_date").val(utc_date);
                try{
                   custom_response = {
                    'add_min': value,
                    'actualStartDate': actualStartDate,
                    'date_virtual_element_id': '#virtual_english_bidding_start_date',
                    'date_local_element_id': '#english_bidding_start_date_local',
                    'date_utc_element_id': '#english_bidding_start_date',
                  };
                  customCallBackFunc(calculate_insider_dates, [custom_response]);
                }catch(ex){
                    //console.log(ex);
                }

                var english_auction_time = $('#property_info_frm #english_auction_time').val();
                var english_start_date = $('#english_bidding_start_date_local').val();
                if(english_auction_time != "" && english_start_date != ""){
                    try{
                       custom_response = {
                        'add_min': english_auction_time,
                        'actualStartDate': english_start_date,
                        'date_virtual_element_id': '#virtual_english_bidding_end_date',
                        'date_local_element_id': '#english_bidding_end_date_local',
                        'date_utc_element_id': '#english_bidding_end_date',
                      };
                      customCallBackFunc(calculate_insider_dates, [custom_response]);
                    }catch(ex){
                        //console.log(ex);
                    }
                }
            }
            return value;
        });

    });
    $('#property_info_frm #english_auction_time').on('input',function(e){
        $(this).val(function (index, value) {
            if(value != ""){
                $('#english_auction_time_value').html(value+' Min');
            }else{
                $('#english_auction_time_value').html('1 Min');
            }
            var dates = $('#virtual_english_bidding_start_date').val();
            if(value != "" && dates != ""){
                var actualStartDate = dates.split(" ");
                // var mdy_format = actualStartDate[0].split("-");
                // mdy_date = mdy_format[2]+"-"+mdy_format[0]+"-"+mdy_format[1];
                actualStartDate = actualStartDate[0]+' '+convert_to_24h(actualStartDate[1]+' '+actualStartDate[2]);
                var utc_date = convert_to_utc_datetime(actualStartDate, 'datetime');
                $("#english_bidding_start_date_local").val(actualStartDate);
                $("#english_bidding_start_date").val(utc_date);
                try{
                   custom_response = {
                    'add_min': value,
                    'actualStartDate': actualStartDate,
                    'date_virtual_element_id': '#virtual_english_bidding_end_date',
                    'date_local_element_id': '#english_bidding_end_date_local',
                    'date_utc_element_id': '#english_bidding_end_date',
                  };
                  customCallBackFunc(calculate_insider_dates, [custom_response]);
                }catch(ex){
                    //console.log(ex);
                }
            }
            return value;
        });

    });


    try{
        $('.date-picker-listing-custom').daterangepicker({
            timePicker: true,
            timePickerIncrement: 1,
            singleDatePicker: true,
            showDropdowns: true,
            autoUpdateInput: false,
            locale: {
                format: 'MM/DD/YYYY h:mm A'
            }
        }).on('apply.daterangepicker',function(e, picker){
            var virtual_date_element = $(this).parent().find('input:first').attr('id');
            $(this).val(picker.startDate.format('MM/DD/YYYY h:mm A'));
            var date_element = $(this).parent().find('input:last').attr('id');
            var dates = $("#"+virtual_date_element).val();
            var auction_type = $('option:selected','#auction_type').val();
            if(dates != ""){
                var actualStartDate = dates.split(" ");
                //new lines
                // var mdy_format = actualStartDate[0].split("-");

                // mdy_date = mdy_format[2]+"-"+mdy_format[0]+"-"+mdy_format[1];

                actualStartDate = actualStartDate[0]+' '+convert_to_24h(actualStartDate[1]+' '+actualStartDate[2]);
                //actualStartDate = actualStartDate[0]+' '+convert_to_24h(actualStartDate[1]+' '+actualStartDate[2]);
                //var utc_date = convert_to_utc_datetime(actualStartDate);
                var utc_date = convert_to_utc_datetime(actualStartDate, 'datetime');
                $("#"+date_element+"_local").val(actualStartDate);
                $("#"+date_element).val(utc_date);
                var dutch_auction_time = $('#property_info_frm #dutch_auction_time').val();
                var dutch_pause_time = $('#property_info_frm #dutch_pause_time').val();
                var sealed_auction_time = $('#property_info_frm #sealed_auction_time').val();
                var sealed_pause_time = $('#property_info_frm #sealed_pause_time').val();
                var english_auction_time = $('#property_info_frm #english_auction_time').val();
                if(dutch_auction_time != "" && actualStartDate != ""){
                    try{
                    custom_response = {
                        'add_min': dutch_auction_time,
                        'actualStartDate': actualStartDate,
                        'date_virtual_element_id': '#virtual_dutch_bidding_end_date',
                        'date_local_element_id': '#dutch_bidding_end_date_local',
                        'date_utc_element_id': '#dutch_bidding_end_date',
                    };
                    customCallBackFunc(calculate_insider_dates, [custom_response]);
                    }catch(ex){
                        //console.log(ex);
                    }
                }
                var dutch_end_date = $('#dutch_bidding_end_date_local').val();
                if(dutch_pause_time != "" && dutch_end_date != ""){
                    try{
                    custom_response = {
                        'add_min': dutch_pause_time,
                        'actualStartDate': dutch_end_date,
                        'date_virtual_element_id': '#virtual_sealed_bidding_start_date',
                        'date_local_element_id': '#sealed_bidding_start_date_local',
                        'date_utc_element_id': '#sealed_bidding_start_date',
                    };
                    customCallBackFunc(calculate_insider_dates, [custom_response]);
                    }catch(ex){
                        //console.log(ex);
                    }
                }
                var sealed_start_date = $('#sealed_bidding_start_date_local').val();
                if(sealed_auction_time != "" && sealed_start_date != ""){
                    try{
                    custom_response = {
                        'add_min': sealed_auction_time,
                        'actualStartDate': sealed_start_date,
                        'date_virtual_element_id': '#virtual_sealed_bidding_end_date',
                        'date_local_element_id': '#sealed_bidding_end_date_local',
                        'date_utc_element_id': '#sealed_bidding_end_date',
                    };
                    customCallBackFunc(calculate_insider_dates, [custom_response]);
                    }catch(ex){
                        //console.log(ex);
                    }
                }
                var sealed_end_date = $('#sealed_bidding_end_date_local').val();
                if(sealed_pause_time != "" && sealed_end_date != ""){
                    try{
                    custom_response = {
                        'add_min': sealed_pause_time,
                        'actualStartDate': sealed_end_date,
                        'date_virtual_element_id': '#virtual_english_bidding_start_date',
                        'date_local_element_id': '#english_bidding_start_date_local',
                        'date_utc_element_id': '#english_bidding_start_date',
                    };
                    customCallBackFunc(calculate_insider_dates, [custom_response]);
                    }catch(ex){
                        //console.log(ex);
                    }
                }
                var english_start_date = $('#english_bidding_start_date_local').val();
                if(english_auction_time != "" && english_start_date != ""){
                    try{
                    custom_response = {
                        'add_min': english_auction_time,
                        'actualStartDate': english_start_date,
                        'date_virtual_element_id': '#virtual_english_bidding_end_date',
                        'date_local_element_id': '#english_bidding_end_date_local',
                        'date_utc_element_id': '#english_bidding_end_date',
                    };
                    customCallBackFunc(calculate_insider_dates, [custom_response]);
                    }catch(ex){
                        //console.log(ex);
                    }
                }

            }
    });
    }catch(ex){
        console.log(ex);
    }
});



const initdrozone = (params) => {
    Dropzone.autoDiscover = false;
    var upload_multiple = false;
    var url = '/admin/save-images/';
    var field_name = 'file';
    var file_accepted = '.png, .jpg, .jpeg, .svg';
    var element = '';
    var max_files = 1;
    var call_function;
    var count = '';
    var dictDefaultMessage;

    if (params.dictDefaultMessage){
        dictDefaultMessage = params.dictDefaultMessage
    }
    if (params.element) {
        element = '#' + params.element;
    }
    if (params.upload_multiple) {
        upload_multiple = params.upload_multiple;
    }
    if (params.url) {
        action_url = params.url;
    }
    if (params.field_name) {
        field_name = params.field_name;
    }
    if (params.file_accepted) {
        file_accepted = params.file_accepted;
    }
    if (params.call_function) {
        call_function = params.call_function;
    }
    if (params.max_files) {
        max_files = params.max_files;
    }
    if(params.count != "" && params.count != "undefined"){
        count = params.count;
    }

    var init_drozone = new Dropzone(element, {
        uploadMultiple: upload_multiple,
        url: action_url,
        paramName: field_name,
        // addRemoveLinks: true, 
        acceptedFiles: file_accepted,
        dictDefaultMessage: (dictDefaultMessage)?dictDefaultMessage:'Drop files here to upload',
        maxFiles: max_files,
        init: function() {
            var drop = this; // Closure

            /*this.on('error', function(file, errorMessage) {

                drop.removeFile(file);
            });*/

            this.on("sending", function(file, xhr, formData) {
                file_size = parseFloat((file.size / (1024 * 1024)).toFixed(2));
                formData.append("file_length", drop.files.length);
                formData.append("file_size", file_size);
                if ($('#site_id').val()){
                    formData.append("site_id", $('#site_id').val());
                }
            });
            if (upload_multiple === false) {
                this.on('success', function(file, response) {
                    count = parseInt(element.charAt(element.length-1));
                    if(count >= 0){
                        count = count;
                    }else{
                        count = '';
                    }
                    drop.removeFile(file);
                    custom_response = {
                        status: response.status,
                        uploaded_file_list: response.uploaded_file_list,
                        count: count,
                    }
                    customCallBackFunc(call_function, [custom_response]);

                });
            }
            if (upload_multiple) {
                this.on('successmultiple', function(file, response) {
                    count = parseInt(element.charAt(element.length-1));
                    if(count >= 0){
                        count = count;
                    }else{
                        count = '';
                    }
                    drop.removeFile(file);
                    custom_response = {
                        status: response.status,
                        uploaded_file_list: response.uploaded_file_list,
                        count: count,

                    }
                    customCallBackFunc(call_function, [custom_response]);
                });
            }

        }

    });
        $('#website_setting_form').parsley();
}


const delete_image = (params) => {
    var image_id = '';
    var image_name = '';
    var new_ids = '';
    var new_names = '';
    try {
        var article_id = params.article_id;
    } catch (ex) {
        var article_id = '';
    }
    try {
        var agent_id = params.agent_id;
    } catch (ex) {
        var agent_id = '';
    }
    try{
        var popup_user_id = params.popup_user_id;
    }catch(ex){
        var popup_user_id = '';
    }
    var section = params.section;
    var id = params.id;
    var name = params.name;
    var count = params.count;


    if(section == 'property_image'){
        image_id = $('#property_image_id').val();
        image_name = $('#property_image_name').val();
        new_ids = remove_string(image_id,id,',');
        new_names = remove_string(image_name,name,',');
        $('div[rel_id="'+id+'"]').remove();
        $('#property_image_id').val(new_ids);
        $('#property_image_name').val(new_names);
        if($('#property_image_id').val() == ''){
            $('#PropertyImgDiv').hide();
        }
   }else if(section == 'property_document'){
        image_id = $('#property_doc_id').val();
        image_name = $('#property_doc_name').val();
        new_ids = remove_string(image_id,id,',');
        new_names = remove_string(image_name,name,',');
        $('div[rel_id="'+id+'"]').remove();
        $('#property_doc_id').val(new_ids);
        $('#property_doc_name').val(new_names);
        if($('#property_doc_id').val() == ''){
            $('#PropertyDocDiv').hide();
        }
   }else if(section == 'property_video'){
        image_id = $('#property_video_id').val();
        image_name = $('#property_video_name').val();
        new_ids = remove_string(image_id,id,',');
        new_names = remove_string(image_name,name,',');
        $('div[rel_id="'+id+'"]').remove();
        $('#property_video_id').val(new_ids);
        $('#property_video_name').val(new_names);
        if($('#property_video_id').val() == ''){
            $('#PropertyVideoDiv').hide();
        }
   }
    data = { 'article_id': article_id, 'image_id': id, 'image_name': name, 'section': section, 'agent_id': agent_id, 'site_id': params.site_id, 'user_id': popup_user_id }
    console.log(data)
    $.ajax({
        url: '/admin/delete-images/',
        type: 'post',
        dateType: 'json',
        async: false,
        cache: false,
        data: data,
        beforeSend: function() {

        },
        success: function(response) {
            console.log(response);
            if (response.error == 0 || response.status == 200 || response.status == 201) {
                $('#confirmImageDeleteModal #popup_article_id').val('');
                $('#confirmImageDeleteModal #popup_section').val('');
                $('#confirmImageDeleteModal #popup_image_id').val('');
                $('#confirmImageDeleteModal #popup_image_name').val('');
                $('#confirmImageDeleteModal #popup_count').val('');
                $('#confirmImageDeleteModal #popup_agent_id').val('');
                showAlert(response.msg, 0);

            } else {
                showAlert(response.msg, 1);
            }
        },
        error: function(jqXHR, exception) {
            var msg = '';
            if (jqXHR.status === 0) {
                msg = 'Not connect.\n Verify Network.';
            } else if (jqXHR.status == 404) {
                msg = 'Requested page not found. [404]';
            } else if (jqXHR.status == 500) {
                msg = 'Internal Server Error [500].';
            } else if (exception === 'parsererror') {
                msg = 'Requested JSON parse failed.';
            } else if (exception === 'timeout') {
                msg = 'Time out error.';
            } else if (exception === 'abort') {
                msg = 'Ajax request aborted.';
            } else {
                msg = 'Uncaught Error.\n' + jqXHR.responseText;
            }
            $(".loaderDiv").hide();
            showAlert(msg, 1)
        }
    });
}

jQuery('.numbersOnly').keyup(function () { 
    this.value = this.value.replace(/[^0-9\.]/g,'');
});


const customCallBackFunc = (callback, args) => {
    //do stuff
    //...
    //execute callback when finished
    callback.apply(this, args);
}


// const remove_string = (list, value, separator) => {
//     separator = separator || ",";
//     var values = list.split(separator);
//     for (var i = 0; i < values.length; i++) {
//         if (values[i] == value) {
//             values.splice(i, 1);
//             return values.join(separator);
//         }
//     }
//     return list;
// }


const save_property = (go_to_list=false) => {

    // get element based on step
    var stepIndex = $('#wizardListing').smartWizard("getStepIndex");
    if (parseInt(stepIndex) == 3){
        go_to_list = true
    }
    switch (parseInt(stepIndex)) {
        case 0:
            element = 'property_info_frm'
            try{
                var start_dates = $("#virtual_bidding_start_date").val();
                var end_dates = $("#virtual_bidding_end_date").val();
                var open_house_start_date = $("#virtual_open_house_start_date").val();
                var open_house_end_date = $("#virtual_open_house_end_date").val();
                var asset_id = $('input[name="asset_type"]:checked').val();
                if (start_dates != "") {
                    var actualStartDate = start_dates.split(" ");
                    actualStartDate = actualStartDate[0] + ' ' + convert_to_24h(actualStartDate[1] + ' ' + actualStartDate[2]);
                    var actualStartDateUtc = convert_to_utc_datetime(actualStartDate, 'datetime');
                    //var actualStartDateUtc = convert_to_utc_date(actualStartDate, 'mm-dd-yyyy', 'datetime');
                    $("#bidding_start_date").val(actualStartDateUtc);
                    $("#bidding_start_date_local").val(actualStartDate);
                } else{
                    $("#virtual_bidding_start_date").val('');
                    $("#bidding_start_date").val('');
                    $("#bidding_start_date_local").val('');
                }
                if (end_dates != "") {
                    var actualEndDate = end_dates.split(" ");
                    actualEndDate = actualEndDate[0] + ' ' + convert_to_24h(actualEndDate[1] + ' ' + actualEndDate[2]);
                    var actualEndDateUtc = convert_to_utc_datetime(actualEndDate, 'datetime');
                    //var actualEndDateUtc = convert_to_utc_date(actualEndDate, 'mm-dd-yyyy', 'datetime');
                    $("#bidding_end_date").val(actualEndDateUtc);
                    $("#bidding_end_date_local").val(actualEndDate);
                }else{
                    $("#virtual_bidding_end_date").val();
                    $("#bidding_end_date").val('');
                    $("#bidding_end_date_local").val('');
                }

                // if (open_house_start_date != "") {
                //     var actualOpenHouseStartDate = open_house_start_date.split(" ");
                //     actualOpenHouseStartDate = actualOpenHouseStartDate[0] + ' ' + convert_to_24h(actualOpenHouseStartDate[1] + ' ' + actualOpenHouseStartDate[2]);
                //     var actualOpenHouseStartDateUtc = convert_to_utc_datetime(actualOpenHouseStartDate, 'datetime');
                //     $("#open_house_start_date").val(actualOpenHouseStartDateUtc);
                //     $("#open_house_start_date_local").val(actualOpenHouseStartDate);
                // } else{
                //     $("#virtual_open_house_start_date").val('');
                //     $("#open_house_start_date").val('');
                //     $("#open_house_start_date_local").val('');
                // }

                // if (open_house_end_date != "") {
                //     var actualOpenHouseEndDate = open_house_end_date.split(" ");
                //     actualOpenHouseEndDate = actualOpenHouseEndDate[0] + ' ' + convert_to_24h(actualOpenHouseEndDate[1] + ' ' + actualOpenHouseEndDate[2]);
                //     var actualOpenHouseEndDateUtc = convert_to_utc_datetime(actualOpenHouseEndDate, 'datetime');
                //     $("#open_house_end_date").val(actualOpenHouseEndDateUtc);
                //     $("#open_house_end_date_local").val(actualOpenHouseEndDate);
                // } else{
                //     $("#virtual_open_house_end_date").val('');
                //     $("#open_house_end_date").val('');
                //     $("#open_house_end_date_local").val('');
                // }

                $('.open_house_start').each(function(index){
                    var open_house_start_dates = $("#virtual_open_house_start_date_"+index).val();
                    if (open_house_start_dates != "") {
                        var actualOpenHouseStartDate = open_house_start_dates.split(" ");
                        actualOpenHouseStartDate = actualOpenHouseStartDate[0] + ' ' + convert_to_24h(actualOpenHouseStartDate[1] + ' ' + actualOpenHouseStartDate[2]);
                        var actualOpenHouseStartDateUtc = convert_to_utc_datetime(actualOpenHouseStartDate, 'datetime');
                        //var actualStartDateUtc = convert_to_utc_date(actualStartDate, 'mm-dd-yyyy', 'datetime');
                        $("#open_house_start_date_"+index).val(actualOpenHouseStartDateUtc);
                        $("#open_house_start_date_local_"+index).val(actualOpenHouseStartDate);
                    }else{
                        $("#virtual_open_house_start_date_"+index).val('');
                        $("#open_house_start_date_"+index).val('');
                        $("#open_house_start_date_local_"+index).val('');
                        // data-parsley-open-house-end-date
                    }
                });
                $('.open_house_start').each(function(i){
                    var open_house_end_dates = $("#virtual_open_house_end_date_"+i).val();
                    if (open_house_end_dates != "") {
                        var actualOpenHouseEndDate = open_house_end_dates.split(" ");
                        actualOpenHouseEndDate = actualOpenHouseEndDate[0] + ' ' + convert_to_24h(actualOpenHouseEndDate[1] + ' ' + actualOpenHouseEndDate[2]);
                        var actualOpenHouseEndDateUtc = convert_to_utc_datetime(actualOpenHouseEndDate, 'datetime');
                        //var actualEndDateUtc = convert_to_utc_date(actualEndDate, 'mm-dd-yyyy', 'datetime');
                        $("#open_house_end_date_"+i).val(actualOpenHouseEndDateUtc);
                        $("#open_house_end_date_local_"+i).val(actualOpenHouseEndDate);
                    }else{
                        $("#virtual_open_house_end_date_"+i).val();
                        $("#open_house_end_date_"+i).val('');
                        $("#open_house_end_date_local_"+i).val('');
                    }
                });
    
                
                if(parseInt(asset_id) == 1 || parseInt(asset_id) == 2){

                    var lease_exp_dates = $("#virtual_lease_exp_date").val();
                    if(lease_exp_dates != ""){
                        var actualExpDate = lease_exp_dates.split(" ");
                        actualExpDate = actualExpDate[0] + ' ' + convert_to_24h(actualExpDate[1] + ' ' + actualExpDate[2]);
                        var actualExpDateUtc = convert_to_utc_datetime(actualExpDate, 'datetime');
                        //var actualEndDateUtc = convert_to_utc_date(actualEndDate, 'mm-dd-yyyy', 'datetime');
                        $("#lease_exp_date").val(actualExpDateUtc);
                        $("#lease_exp_date_local").val(actualExpDate);
                    }
                }else{
                    $("#lease_exp_date").val('');
                    $("#lease_exp_date_local").val('');
                    $("#virtual_lease_exp_date").val('');
                }
                if(parseInt(asset_id) == 1){
                    var crp_exp_dates = $("#virtual_crp_exp_date").val();
                    if(crp_exp_dates != ""){
                        var actualCrpExpDate = crp_exp_dates.split(" ");
                        actualCrpExpDate = actualCrpExpDate[0] + ' ' + convert_to_24h(actualCrpExpDate[1] + ' ' + actualCrpExpDate[2]);
                        var actualCrpExpDateUtc = convert_to_utc_datetime(actualCrpExpDate, 'datetime');
                        //var actualEndDateUtc = convert_to_utc_date(actualEndDate, 'mm-dd-yyyy', 'datetime');
                        $("#crp_exp_date").val(actualCrpExpDateUtc);
                        $("#crp_exp_date_local").val(actualCrpExpDate);
                    }
                }else{
                    $("#virtual_crp_exp_date").val('');
                    $("#crp_exp_date").val('');
                    $("#crp_exp_date_local").val('');
                }

                //functionality for insider auction
                if($('option:selected','#auction_type').val() == 2){
                    var dutch_start_date = $("#virtual_dutch_bidding_start_date").val();
                    if(dutch_start_date != ""){
                        var actualStartDate = dutch_start_date.split(" ");
                        // var change_format = actualStartDate[0].split("-");
                        // var new_format = change_format[2]+"-"+change_format[0]+"-"+change_format[1];
                        actualStartDate = actualStartDate[0] + ' ' + convert_to_24h(actualStartDate[1] + ' ' + actualStartDate[2]);
                        var actualStartDateUtc = convert_to_utc_datetime(actualStartDate, 'datetime');
                        //var actualEndDateUtc = convert_to_utc_date(actualEndDate, 'mm-dd-yyyy', 'datetime');
                        $("#dutch_bidding_start_date").val(actualStartDateUtc);
                        $("#dutch_bidding_start_date_local").val(actualStartDate);
                        //var dutch_bidding_start_date
                    }else{
                        $("#virtual_dutch_bidding_start_date").val('');
                        $("#dutch_bidding_start_date_local").val('');
                        $("#dutch_bidding_start_date").val('');
                    }
                    var dutch_end_date = $('#virtual_dutch_bidding_end_date').val();
                    if(dutch_end_date != ""){
                        var actualStartDate = dutch_end_date.split(" ");
                        // var change_format = actualStartDate[0].split("-");
                        // var new_format = change_format[2]+"-"+change_format[0]+"-"+change_format[1];
                        actualStartDate = actualStartDate[0] + ' ' + convert_to_24h(actualStartDate[1] + ' ' + actualStartDate[2]);
                        var actualStartDateUtc = convert_to_utc_datetime(actualStartDate, 'datetime');
                        //var actualEndDateUtc = convert_to_utc_date(actualEndDate, 'mm-dd-yyyy', 'datetime');
                        $("#dutch_bidding_end_date").val(actualStartDateUtc);
                        $("#dutch_bidding_end_date_local").val(actualStartDate);
                        //var dutch_bidding_start_date
                    }else{
                        $("#virtual_dutch_bidding_end_date").val('');
                        $("#dutch_bidding_end_date_local").val('');
                        $("#dutch_bidding_end_date").val('');
                    }
                    var sealed_start_date = $('#virtual_sealed_bidding_start_date').val();
                    if(sealed_start_date != ""){
                        var actualStartDate = sealed_start_date.split(" ");
                        // var change_format = actualStartDate[0].split("-");
                        // var new_format = change_format[2]+"-"+change_format[0]+"-"+change_format[1];
                        actualStartDate = actualStartDate[0] + ' ' + convert_to_24h(actualStartDate[1] + ' ' + actualStartDate[2]);
                        var actualStartDateUtc = convert_to_utc_datetime(actualStartDate, 'datetime');
                        //var actualEndDateUtc = convert_to_utc_date(actualEndDate, 'mm-dd-yyyy', 'datetime');
                        $("#sealed_bidding_start_date").val(actualStartDateUtc);
                        $("#sealed_bidding_start_date_local").val(actualStartDate);
                        //var dutch_bidding_start_date
                    }else{
                        $("#virtual_sealed_bidding_start_date").val('');
                        $("#sealed_bidding_start_date_local").val('');
                        $("#sealed_bidding_start_date").val('');
                    }
                    var sealed_end_date = $('#virtual_sealed_bidding_end_date').val();
                    if(sealed_end_date != ""){
                        var actualStartDate = sealed_end_date.split(" ");
                        // var change_format = actualStartDate[0].split("-");
                        // var new_format = change_format[2]+"-"+change_format[0]+"-"+change_format[1];
                        actualStartDate = actualStartDate[0] + ' ' + convert_to_24h(actualStartDate[1] + ' ' + actualStartDate[2]);
                        var actualStartDateUtc = convert_to_utc_datetime(actualStartDate, 'datetime');
                        //var actualEndDateUtc = convert_to_utc_date(actualEndDate, 'mm-dd-yyyy', 'datetime');
                        $("#sealed_bidding_end_date").val(actualStartDateUtc);
                        $("#sealed_bidding_end_date_local").val(actualStartDate);
                        //var dutch_bidding_start_date
                    }else{
                        $("#virtual_sealed_bidding_end_date").val('');
                        $("#sealed_bidding_end_date_local").val('');
                        $("#sealed_bidding_end_date").val('');
                    }
                    var english_start_date = $('#virtual_english_bidding_start_date').val();
                    if(english_start_date != ""){
                        var actualStartDate = english_start_date.split(" ");
                        // var change_format = actualStartDate[0].split("-");
                        // var new_format = change_format[2]+"-"+change_format[0]+"-"+change_format[1];
                        actualStartDate = actualStartDate[0] + ' ' + convert_to_24h(actualStartDate[1] + ' ' + actualStartDate[2]);
                        var actualStartDateUtc = convert_to_utc_datetime(actualStartDate, 'datetime');
                        //var actualEndDateUtc = convert_to_utc_date(actualEndDate, 'mm-dd-yyyy', 'datetime');
                        $("#english_bidding_start_date").val(actualStartDateUtc);
                        $("#english_bidding_start_date_local").val(actualStartDate);
                        //var dutch_bidding_start_date
                    }else{
                        $("#virtual_english_bidding_start_date").val('');
                        $("#english_bidding_start_date_local").val('');
                        $("#english_bidding_start_date").val('');
                    }
                    var english_end_date = $('#virtual_english_bidding_end_date').val();
                    if(english_end_date != ""){
                        var actualStartDate = english_end_date.split(" ");
                        // var change_format = actualStartDate[0].split("-");
                        // var new_format = change_format[2]+"-"+change_format[0]+"-"+change_format[1];
                        actualStartDate = actualStartDate[0] + ' ' + convert_to_24h(actualStartDate[1] + ' ' + actualStartDate[2]);
                        var actualStartDateUtc = convert_to_utc_datetime(actualStartDate, 'datetime');
                        //var actualEndDateUtc = convert_to_utc_date(actualEndDate, 'mm-dd-yyyy', 'datetime');
                        $("#english_bidding_end_date").val(actualStartDateUtc);
                        $("#english_bidding_end_date_local").val(actualStartDate);
                        //var dutch_bidding_start_date
                    }else{
                        $("#virtual_english_bidding_end_date").val('');
                        $("#english_bidding_end_date_local").val('');
                        $("#english_bidding_end_date").val('');
                    }

                    /*var dutch_auction_time = $('#property_info_frm #dutch_auction_time').val();
                    var dutch_pause_time = $('#property_info_frm #dutch_pause_time').val();
                    var sealed_auction_time = $('#property_info_frm #sealed_auction_time').val();
                    var sealed_pause_time = $('#property_info_frm #sealed_pause_time').val();
                    var english_auction_time = $('#property_info_frm #english_auction_time').val();
                    var dutch_start_date = $('#dutch_bidding_start_date_local').val();
                    if(dutch_auction_time != "" && dutch_start_date != ""){
                        try{
                        custom_response = {
                            'add_min': dutch_auction_time,
                            'actualStartDate': dutch_start_date,
                            'date_virtual_element_id': '#virtual_dutch_bidding_end_date',
                            'date_local_element_id': '#dutch_bidding_end_date_local',
                            'date_utc_element_id': '#dutch_bidding_end_date',
                        };
                        customCallBackFunc(calculate_insider_dates, [custom_response]);
                        }catch(ex){
                            //console.log(ex);
                        }
                    }

                    var dutch_end_date = $('#dutch_bidding_end_date_local').val();
                    if(dutch_pause_time != "" && dutch_end_date != ""){
                        try{
                        custom_response = {
                            'add_min': dutch_pause_time,
                            'actualStartDate': dutch_end_date,
                            'date_virtual_element_id': '#virtual_sealed_bidding_start_date',
                            'date_local_element_id': '#sealed_bidding_start_date_local',
                            'date_utc_element_id': '#sealed_bidding_start_date',
                        };
                        customCallBackFunc(calculate_insider_dates, [custom_response]);
                        }catch(ex){
                            //console.log(ex);
                        }
                    }
                    var sealed_start_date = $('#sealed_bidding_start_date_local').val();
                    if(sealed_auction_time != "" && sealed_start_date != ""){
                        try{
                        custom_response = {
                            'add_min': sealed_auction_time,
                            'actualStartDate': sealed_start_date,
                            'date_virtual_element_id': '#virtual_sealed_bidding_end_date',
                            'date_local_element_id': '#sealed_bidding_end_date_local',
                            'date_utc_element_id': '#sealed_bidding_end_date',
                        };
                        customCallBackFunc(calculate_insider_dates, [custom_response]);
                        }catch(ex){
                            //console.log(ex);
                        }
                    }
                    var sealed_end_date = $('#sealed_bidding_end_date_local').val();
                    if(sealed_pause_time != "" && sealed_end_date != ""){
                        try{
                        custom_response = {
                            'add_min': sealed_pause_time,
                            'actualStartDate': sealed_end_date,
                            'date_virtual_element_id': '#virtual_english_bidding_start_date',
                            'date_local_element_id': '#english_bidding_start_date_local',
                            'date_utc_element_id': '#english_bidding_start_date',
                        };
                        customCallBackFunc(calculate_insider_dates, [custom_response]);
                        }catch(ex){
                            //console.log(ex);
                        }
                    }
                    var english_start_date = $('#english_bidding_start_date_local').val();
                    if(english_auction_time != "" && english_start_date != ""){
                        try{
                        custom_response = {
                            'add_min': english_auction_time,
                            'actualStartDate': english_start_date,
                            'date_virtual_element_id': '#virtual_english_bidding_end_date',
                            'date_local_element_id': '#english_bidding_end_date_local',
                            'date_utc_element_id': '#english_bidding_end_date',
                        };
                        customCallBackFunc(calculate_insider_dates, [custom_response]);
                        }catch(ex){
                            //console.log(ex);
                        }
                    }*/


                }else{
                    $("#virtual_dutch_bidding_start_date").val('');
                    $("#dutch_bidding_start_date_local").val('');
                    $("#dutch_bidding_start_date").val('');
                    $("#virtual_dutch_bidding_end_date").val('');
                    $("#dutch_bidding_end_date_local").val('');
                    $("#dutch_bidding_end_date").val('');
                    $("#virtual_sealed_bidding_start_date").val('');
                    $("#sealed_bidding_start_date_local").val('');
                    $("#sealed_bidding_start_date").val('');
                    $("#virtual_sealed_bidding_end_date").val('');
                    $("#sealed_bidding_end_date_local").val('');
                    $("#sealed_bidding_end_date").val('');
                    $("#virtual_english_bidding_start_date").val('');
                    $("#english_bidding_start_date_local").val('');
                    $("#english_bidding_start_date").val('');
                    $("#virtual_english_bidding_end_date").val('');
                    $("#english_bidding_end_date_local").val('');
                    $("#english_bidding_end_date").val('');
                }
            }catch(ex){
    
            }
            break;
        case 1:
            element = 'property_map_view_frm'
            break;
        case 2:
            element = 'property_photo_video_frm'
            break;
        case 3:
            element = 'property_document_frm'
            break;
        default:
            element = ''
            break;
    }

    $('#' + element).parsley().validate();
    if ($('#' + element).parsley().isValid()) {
        // Return a promise object
        return new Promise((resolve, reject) => {

            // Ajax call to save your content
            $.ajax({
            url: '/admin/save-property/',
            type: 'post',
            dateType: 'json',
            cache: false,
            data: $('#'+element).serialize(),
            beforeSend: function(){
                $(".loaderDiv").show();
            },
            success: function(response){
                $(".loaderDiv").hide();
                if(response.error == 0){
                    showAlert(response.msg, 0);
                    $('.property_id').val(response.data.data.property_id)
                    if(go_to_list){
                        window.setTimeout(function () {
                            window.location.href = '/admin/listing-list/';
                        }, 2000 );
                    } else {
                        // init address
                        var get_adresss_text = $('#property_address_one').val() +  ', ' + $('#property_city').val() + ', ' + $('#property_state option:selected').text() + ', ' + $('#property_zip_code').val()
                        $('#property_map_address').val(get_adresss_text)
                        $('#wizardListing').smartWizard("next");
                        // reinit google maps
                        window.setTimeout(function () {
                            initmap();
                        }, 2000 );
                        
                    }
                    // setup demo address on map step

                }else{
                    showAlert(response.msg, 1);
                }
            }
        }).done(function( res ) {
                // Hide the loader
                $(".loaderDiv").hide();
            }).fail(function(err) {

            // Reject the Promise with error message to show as tab content
            reject( "An error loading the resource" );
            showAlert('An error loading the resource', 1);
            // Hide the loader
            $(".loaderDiv").hide();
            });

        });
    } else {
        $(".loaderDiv").hide();
        return false;
    }
}


const set_property_image_details = (response) => {
    var image_name = '';
    var upload_id = '';
    var actual_image = '';
    var actual_id = '';
    var property_image_id = $('#property_image_id').val();
    var property_image_name = $('#property_image_name').val();
    var property_id = $('.property_id').val();
    if(response.status == 200){
        $('#custom_property_image_error').hide();
        if(response.uploaded_file_list){
            var all_banner_images = '';
            $.each(response.uploaded_file_list, function(i, item) {
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
                    var img_src = aws_url+"property_image/"+item.file_name;
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
                        console.log(ex);
                        var timeStp = '';
                    }
                }

                $('#PropertyImgDiv').append(
                    '<div class="col-md-3" rel_id="'+item.upload_id+'" rel_position="" >' +
                    '<div class="thumbnail">' +
                       '<div class="image view view-first">'+
                          '<img src="' + img_src + '" alt="" style=" margin: auto; min-height:inherit">'+
                       '</div>'+
                       '<div class="caption">'+
                          '<p>' + item.file_name + '</p>'+
                          '<p>'+
                             'File Size: ' + item.file_size + ' <br>'+
                             'Uploaded: ' + timeStp +
                          '</p>'+
                          '<div class="move">'+
                             '<i class="fa fa-arrows-alt"></i> Move'+
                             '<a href="javascript:void(0)" data-article-id="'+property_id+'" data-image-id="' + item.upload_id + '" data-image-name="' + item.file_name + '" data-image-section="' + item.upload_to + '"  class="close-btn confirm_image_delete" style="float:right;"><i class="fa fa-remove"></i> Remove</a>'+
                          '</div>'+
                       '</div>'+
                    '</div>' +
                 '</div>'
                );
            
            
            });
            image_name = image_name+','+property_image_name;
            upload_id = upload_id+','+property_image_id;
            actual_image = image_name.replace(/(^,)|(,$)/g, "");
            actual_id = upload_id.replace(/(^,)|(,$)/g, "");
            $('#property_image_name').val(actual_image);
            $('#property_image_id').val(actual_id);
            $('#PropertyImgDiv').show();

        }
    }
}


const set_property_doc_details = (response) => {
    var image_name = '';
    var upload_id = '';
    var actual_image = '';
    var actual_id = '';
    var property_doc_id = $('#property_doc_id').val();
    var property_doc_name = $('#property_doc_name').val();
    var property_id = $('.property_id').val();
    if(response.status == 200){
        $('#custom_property_doc_error').hide();
        if(response.uploaded_file_list){
            var all_banner_images = '';
            $.each(response.uploaded_file_list, function(i, item) {
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
                if(item.file_name != "" && item.file_name.split(".")[(item.file_name.split(".").length) - 1].toLowerCase() != 'pdf'){
                    var img_src = aws_url+"property_document/"+item.file_name;
                }else if(item.file_name != "" && item.file_name.split(".")[(item.file_name.split(".").length) - 1].toLowerCase() == 'pdf'){
                    var img_src = default_image_url+"/static/admin/images/pdf.png"
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
                        console.log(ex);
                        var timeStp = '';
                    }
                }
                $('#PropertyDocDiv').append(
                    '<div class="col-md-3" rel_id="'+item.upload_id+'" rel_position="" >' +
                    '<div class="thumbnail pdf-list">' +
                       '<div class="image view view-first">'+
                          '<img src="' + img_src + '" alt="" style="margin: auto; min-height:inherit">'+
                       '</div>'+
                       '<div class="caption">'+
                          '<p>' + item.file_name + '</p>'+
                          '<p>'+
                             'File Size: ' + item.file_size + ' <br>'+
                             'Uploaded: ' + timeStp +
                          '</p>'+
                          '<div class="move">'+
                             '<i class="fa fa-arrows-alt"></i> Move'+
                             '<a href="javascript:void(0)" data-article-id="'+property_id+'" data-image-id="' + item.upload_id + '" data-image-name="' + item.file_name + '" data-image-section="' + item.upload_to + '"  class="close-btn confirm_image_delete" style="float:right;"><i class="fa fa-remove"></i> Remove</a>'+
                          '</div>'+
                       '</div>'+
                    '</div>' +
                 '</div>'
                );
            
            });
            image_name = image_name+','+property_doc_name;
            upload_id = upload_id+','+property_doc_id;
            actual_image = image_name.replace(/(^,)|(,$)/g, "");
            actual_id = upload_id.replace(/(^,)|(,$)/g, "");
            $('#property_doc_name').val(actual_image);
            $('#property_doc_id').val(actual_id);
            $('#PropertyDocDiv').show();

        }
    }
}


const convert_bidding_date = (element) => {
    try{
        value = $('#'+element).val();
        if(value != "" && value != "None"){
            console.log('in for ' + element)
            //var virtual_date = getLocalDate(value, 'yyyy-mm-dd','ampm');
            var virtual_date = getLocalDate(value, 'mm/dd/yyyy','ampm');
             //var actual_date = getLocalDate(value, 'yyyy-mm-dd', 'datetime');
             var actual_date = getLocalDate(value, 'mm/dd/yyyy', 'datetime');
             //var utc_date = convert_to_utc_datetime(value, 'datetime');
             var utc_date = convert_to_utc_date(value, 'mm/dd/yyyy', 'datetime');
             /*$('#'+element).val(utc_date);
            $('#'+element+'_local').val(actual_date);*/
            $('#virtual_'+element).val(virtual_date);
        }else{

            $('#virtual_'+element).val('');
        }
        $('#'+element).val('');
        $('#'+element+'_local').val('');

    }catch(ex){
        console.log(ex);
    }

}

//  show alert AFTER ajax call
// const showAlert = (msg, error) => {
//     new PNotify({
//         title: (error == 1 )?'Error':'Success',
//         text: msg,
//         type: (error == 1)? 'error':'success',
//         styling: 'bootstrap3'
//     });
// }


const reindex_prop_img_list = () => {
    var img_id_list = [];
    var img_name_list = [];
    var str_img_id = '';
    var str_img_name = '';
    $('#propertyImgList .col-md-55').each(function(index){
      var rel_id = $(this).find('a').attr('data-image-id');
      var rel_name = $(this).find('a').attr('data-image-name');
      img_id_list.push(rel_id);
      img_name_list.push(rel_name);
    });
    str_img_id = img_id_list.toString();
    str_img_name = img_name_list.toString();
    $('#property_image_id').val(str_img_id);
    $('#property_image_name').val(str_img_name);
}

const reindex_prop_doc_list =() => {
    var img_id_list = [];
    var img_name_list = [];
    var str_img_id = '';
    var str_img_name = '';
    $('#propertyDocList .col-md-55').each(function(index){
      var rel_id = $(this).find('a').attr('data-image-id');
      var rel_name = $(this).find('a').attr('data-image-name');
      img_id_list.push(rel_id);
      img_name_list.push(rel_name);
    });
    str_img_id = img_id_list.toString();
    str_img_name = img_name_list.toString();
    $('#property_doc_id').val(str_img_id);
    $('#property_doc_name').val(str_img_name);
}

const init_selectize = () => {
    $('select[multiple]').selectize(
        {
            plugins: ['remove_button'],
            delimiter: ',',
            persist: false,
            // showAddOptionOnCreate: true,
            create: function(input, callback) {
                var selectize = $(this)[0].$input["0"].selectize;
                data = {
                    'feature_name': input,
                    'feature_type': $(this)[0].$input["0"].id,
                    'asset_id': $('input[name="asset_type"]:checked').val(),
                }
                $.ajax({
                    url: '/admin/add-property-features/',
                    type: 'post',
                    dateType: 'json',
                    cache: false,
                    data: data,
                    beforeSend: function(){
        
                    },
                    success: function(response){
                        if(response.error == 0){
                            showAlert(response.msg, 0)
                            selectize.addOption({value: response.feature_id, text: response.feature_name});
                            selectize.refreshOptions()

                            callback({ value: response.feature_id, text: response.feature_name });

                        }else{
                            showAlert(response.msg, 1)
                        }
                    }
                });

            }
        }
    );
}


function init_datepicker(){
    $('.date-picker-listing').daterangepicker({
        timePicker: true,
        timePickerIncrement: 1,
        singleDatePicker: true,
        showDropdowns: true,
        autoUpdateInput: false,
        locale: {
            format: 'MM/DD/YYYY h:mm A'
        }
    }).on('apply.daterangepicker', function(ev, picker) {
        var date_element = $(this).parent().find('input:last').attr('id');
        $(this).val(picker.startDate.format('MM/DD/YYYY h:mm A'));
        var dates = $(this).val()
        if(dates != ""){
          var actualStartDate = dates.split(" ");
          //new lines
        //   var mdy_format = actualStartDate[0].split("-");
        //   mdy_date = mdy_format[2]+"-"+mdy_format[0]+"-"+mdy_format[1];

          //actualStartDate = mdy_date+' '+convert_to_24h(actualStartDate[1]+' '+actualStartDate[2]);
          actualStartDate = actualStartDate[0]+' '+convert_to_24h(actualStartDate[1]+' '+actualStartDate[2]);


          //var utc_date = convert_to_utc_datetime(actualStartDate);
          var utc_date = convert_to_utc_date(actualStartDate, 'mm/dd/yyyy', 'datetime');
          $("#"+date_element+"_local").val(actualStartDate);
          $("#"+date_element).val(utc_date);

        //   try{
        //         var count_index = $(this).closest('.virtual_open_house_end_date');
        //         if(count_index.length == 0){
        //             var count_index = $(this).closest('.add_more_open_house_date').attr('rel_position');
        //             count_index = count_index.toString();
        //             $('#virtual_open_house_end_date_'+count_index).val('');
        //             $('#open_house_end_date_local_'+count_index).val('');
        //             $('#open_house_end_date_'+count_index).val('');
        //             var new_date = actualStartDate.split(" ");
        //             var newStartDate = new_date[0];
        //             var new_min_date = new Date(actualStartDate);
        //             var new_max_date = new Date(newStartDate+' 23:59:59');
        //             min_max_date(new_min_date, new_max_date, count_index);
        //             console.log(new_min_date);
        //             console.log(new_max_date);
        //         }
        //     }catch(ex){
        //         console.log(ex);
        //     }
        }
    });
}


function init_auction_start_date(){
    try{
        $('#datetimepicker1').datetimepicker({
              format: 'MM-DD-YYYY hh:mm A',
        });
    }catch(ex){

    }

}

function init_auction_end_date(){
      var new_min_date = '';
      var new_max_date = '';
      var virtual_dates = $("#datetimepicker2").attr('data-value');
      var auction_type = $('option:selected','#auction_type').val();


      if(virtual_dates){
        var new_virtual_date = getLocalDate(virtual_dates, 'mm-dd-yyyy','ampm');
        var actualStartDate = new_virtual_date.split(" ");
        //new lines
        var mdy_format = actualStartDate[0].split("-");

        new_min_date = mdy_format[2]+"-"+mdy_format[0]+"-"+mdy_format[1];
        new_max_date = new_min_date+' 23:59:59';
      }

      if(new_min_date != "" && new_max_date != "" && auction_type != ""  && parseInt(auction_type) == 6){
        try{
            $("#datetimepicker2").datetimepicker({
              format: 'MM-DD-YYYY hh:mm A',
              maxDate: new_max_date,
              minDate: new_min_date,
              }).on('dp.change',function(e){
                  var virtual_date_element = $(this).find('input:first').attr('id');
                  var date_element = $(this).find('input:last').attr('id');
                  var dates = $("#"+virtual_date_element).val();
                  if(dates != ""){
                    var actualStartDate = dates.split(" ");
                    //new lines
                    // var mdy_format = actualStartDate[0].split("-");
                    // mdy_date = mdy_format[2]+"-"+mdy_format[0]+"-"+mdy_format[1];

                    var newactualStartDate = actualStartDate[0]+' '+convert_to_24h(actualStartDate[1]+' '+actualStartDate[2]);
                    actualStartDate = actualStartDate[0]+' '+convert_to_24h(actualStartDate[1]+' '+actualStartDate[2]);

                    var utc_date = convert_to_utc_date(actualStartDate, 'mm-dd-yyyy', 'datetime');
                    $("#"+date_element+"_local").val(actualStartDate);
                    $("#"+date_element).val(utc_date);
                  }
              });
        }catch(ex){

        }

      }else{
        try{
            $('#datetimepicker2').datetimepicker({
              format: 'MM-DD-YYYY hh:mm A',
              }).on('dp.change',function(e){
                  var virtual_date_element = $(this).find('input:first').attr('id');
                  var date_element = $(this).find('input:last').attr('id');
                  var dates = $("#"+virtual_date_element).val();
                  if(dates != ""){
                    var actualStartDate = dates.split(" ");
                    //new lines
                    // var mdy_format = actualStartDate[0].split("-");
                    // mdy_date = mdy_format[2]+"-"+mdy_format[0]+"-"+mdy_format[1];
                    //actualStartDate = mdy_date+' '+convert_to_24h(actualStartDate[1]+' '+actualStartDate[2]);
                    var newactualStartDate = mdy_date+' '+convert_to_24h(actualStartDate[1]+' '+actualStartDate[2]);
                    actualStartDate = actualStartDate[0]+' '+convert_to_24h(actualStartDate[1]+' '+actualStartDate[2]);

                    var utc_date = convert_to_utc_date(actualStartDate, 'mm-dd-yyyy', 'datetime');
                    $("#"+date_element+"_local").val(actualStartDate);
                    $("#"+date_element).val(utc_date);
                  }
              });
        }catch(ex){

        }

      }


}

function calculate_insider_dates(params){
    var actualStartDate = params.actualStartDate;
    var value = params.add_min;
    var virtual_element = params.date_virtual_element_id;
    var local_element = params.date_local_element_id;
    var utc_element = params.date_utc_element_id;
    var end_date = new Date(actualStartDate);
    var myTimeStamp = end_date.setTime(end_date.getTime() + (value * 60 * 1000));

    var dateX = new Date(myTimeStamp);
    var dateY = new Date();
    date = new Date(dateX.getTime());
    var fullyear = date.getFullYear();
    var mts = date.getMonth()+1;
    var month_num = (mts < 10)?'0'+mts:mts;
    var dt = (date.getDate() < 10)?'0'+date.getDate():date.getDate();
    var hr = (date.getHours() < 10)?'0'+date.getHours():date.getHours();
    var mins = (date.getMinutes() < 10)?'0'+date.getMinutes():date.getMinutes();

    var timeStp = month_num+'/'+dt+'/'+fullyear;
    var timeStp_new_format = fullyear+'-'+month_num+'-'+dt;
    var mer = (parseInt(hr) >= 12)?'PM':'AM';
        hrs = parseInt(hr) % 12;
        hrs = (hrs)?hrs:12;
    var virtual_endtimeStp = timeStp+' '+hrs+':'+mins+' '+mer;
    var endtimeStp = timeStp_new_format+' '+hrs+':'+mins+' '+mer;
    var endtimeStp_local = timeStp_new_format+' '+hr+':'+mins+':00';
    var utc_end_date = convert_to_utc_datetime(endtimeStp_local, 'datetime');
    $(virtual_element).val(virtual_endtimeStp);
    $(local_element).val(endtimeStp_local);
    $(utc_element).val(utc_end_date);
}

function convert_insider_auction_date(){
    try{
        if($('#virtual_dutch_bidding_start_date').val() == ""){
            try{
                var dutch_bidding_start_date = $('#dutch_bidding_start_date').val();
                var virtual_date = getLocalDate(dutch_bidding_start_date, 'mm/dd/yyyy','ampm');
                $('#virtual_dutch_bidding_start_date').val(virtual_date);
            }catch(ex){
                console.log(ex);
            }
        }
        var virtual_date_element = 'virtual_dutch_bidding_start_date';
        var date_element = 'dutch_bidding_start_date';
        var dates = $("#"+virtual_date_element).val();
        if(dates != ""){
            var actualStartDate = dates.split(" ");
            //new lines
            // var mdy_format = actualStartDate[0].split("/");

            // mdy_date = mdy_format[2]+"/"+mdy_format[0]+"/"+mdy_format[1];

            actualStartDate = actualStartDate[0]+' '+convert_to_24h(actualStartDate[1]+' '+actualStartDate[2]);

            //actualStartDate = actualStartDate[0]+' '+convert_to_24h(actualStartDate[1]+' '+actualStartDate[2]);
            //var utc_date = convert_to_utc_datetime(actualStartDate);
            var utc_date = convert_to_utc_datetime(actualStartDate, 'datetime');

            $("#"+date_element+"_local").val(actualStartDate);
            $("#"+date_element).val(utc_date);

            var dutch_auction_time = $('#property_info_frm #dutch_auction_time').val();
            var dutch_pause_time = $('#property_info_frm #dutch_pause_time').val();
            var sealed_auction_time = $('#property_info_frm #sealed_auction_time').val();
            var sealed_pause_time = $('#property_info_frm #sealed_pause_time').val();
            var english_auction_time = $('#property_info_frm #english_auction_time').val();
            if(dutch_auction_time != "" && actualStartDate != ""){
                try{
                    custom_response = {
                    'add_min': dutch_auction_time,
                    'actualStartDate': actualStartDate,
                    'date_virtual_element_id': '#virtual_dutch_bidding_end_date',
                    'date_local_element_id': '#dutch_bidding_end_date_local',
                    'date_utc_element_id': '#dutch_bidding_end_date',
                    };
                    customCallBackFunc(calculate_insider_dates, [custom_response]);
                }catch(ex){
                    //console.log(ex);
                }
            }
            $("#dutch_bidding_start_date_local").val(actualStartDate);
            $("#dutch_bidding_start_date").val(utc_date);
            var dutch_end_date = $('#dutch_bidding_end_date_local').val();
            if(dutch_pause_time != "" && dutch_end_date != ""){
                try{
                    custom_response = {
                    'add_min': dutch_pause_time,
                    'actualStartDate': dutch_end_date,
                    'date_virtual_element_id': '#virtual_sealed_bidding_start_date',
                    'date_local_element_id': '#sealed_bidding_start_date_local',
                    'date_utc_element_id': '#sealed_bidding_start_date',
                    };
                    customCallBackFunc(calculate_insider_dates, [custom_response]);
                }catch(ex){
                    //console.log(ex);
                }
            }
            var sealed_start_date = $('#sealed_bidding_start_date_local').val();
            if(sealed_auction_time != "" && sealed_start_date != ""){
                try{
                    custom_response = {
                    'add_min': sealed_auction_time,
                    'actualStartDate': sealed_start_date,
                    'date_virtual_element_id': '#virtual_sealed_bidding_end_date',
                    'date_local_element_id': '#sealed_bidding_end_date_local',
                    'date_utc_element_id': '#sealed_bidding_end_date',
                    };
                    customCallBackFunc(calculate_insider_dates, [custom_response]);
                }catch(ex){
                    //console.log(ex);
                }
            }
            var sealed_end_date = $('#sealed_bidding_end_date_local').val();
            if(sealed_pause_time != "" && sealed_end_date != ""){
                try{
                    custom_response = {
                    'add_min': sealed_pause_time,
                    'actualStartDate': sealed_end_date,
                    'date_virtual_element_id': '#virtual_english_bidding_start_date',
                    'date_local_element_id': '#english_bidding_start_date_local',
                    'date_utc_element_id': '#english_bidding_start_date',
                    };
                    customCallBackFunc(calculate_insider_dates, [custom_response]);
                }catch(ex){
                    //console.log(ex);
                }
            }
            var english_start_date = $('#english_bidding_start_date_local').val();
            if(english_auction_time != "" && english_start_date != ""){
                try{
                    custom_response = {
                    'add_min': english_auction_time,
                    'actualStartDate': english_start_date,
                    'date_virtual_element_id': '#virtual_english_bidding_end_date',
                    'date_local_element_id': '#english_bidding_end_date_local',
                    'date_utc_element_id': '#english_bidding_end_date',
                    };
                    customCallBackFunc(calculate_insider_dates, [custom_response]);
                }catch(ex){
                    //console.log(ex);
                }
            }
            custom_param = {
                'date_element_local': "#"+date_element+"_local",
                'date_element': "#"+date_element,
                'element_local_val': actualStartDate,
                'element_utc_val': utc_date,
            };
            customCallBackFunc(set_insider_ductch_dates, [custom_param]);

        }
    }catch(ex){

    }

}

function set_insider_ductch_dates(params){
    var date_element_local = params.date_element_local;
    var date_element = params.date_element;
    var element_local_val = params.element_local_val;
    var element_utc_val = params.element_utc_val;
    $(date_element_local).val(element_local_val);
    $(date_element).val(element_utc_val);
}
function show_input_slider(x)
{
    $("#price_decrease_rate_value").html(x+' %');
}
function add_slider_value(el)
{
    var el_id = $(el).attr('data-id');
    var el_max = parseInt($(el).attr('data-max'));
    var el_val = 0;
    if($("#"+el_id).val() != ""){
        el_val = parseInt($("#"+el_id).val());
    }
    if(el_val < el_max){
        el_val = el_val + 1;
        $("#"+el_id).val(el_val);
        if(el_id == 'price_decrease_rate'){
            $("#"+el_id+"_value").html(el_val+' %');
            if($('#insider_start_price').val() != "" && $('#insider_start_price').val() != "$"){
                var start_price = parseFloat($('#insider_start_price').val().replace('$','').replace(/,/g, ''));
                var decrease_rate = parseFloat($('#price_decrease_rate').val());
                var decrease_value = (start_price - ((start_price*decrease_rate)/100));
                if(decrease_value > parseInt(decrease_value)){
                    decrease_value = numberFormat(decrease_value);
                }else{
                    decrease_value = numberFormat(parseInt(decrease_value));
                }
                $('#price_decrease_value').html('$'+decrease_value);
            }
        }else{
            $("#"+el_id+"_value").html(el_val+' Min');
            if($('#virtual_dutch_bidding_start_date').val() != ""){
                convert_insider_auction_date();
            }
        }
    }
}
function subtract_slider_value(el)
{
    var el_id = $(el).attr('data-id');
    var el_val = 0;
    if($("#"+el_id).val() != ""){
        var el_val = parseInt($("#"+el_id).val());
    }
    if(el_val > 1){
        el_val = el_val - 1;
        $("#"+el_id).val(el_val);
        if(el_id == 'price_decrease_rate'){
            $("#"+el_id+"_value").html(el_val+' %');
            if($('#insider_start_price').val() != "" && $('#insider_start_price').val() != "$"){
                var start_price = parseFloat($('#insider_start_price').val().replace('$','').replace(/,/g, ''));
                var decrease_rate = parseFloat($('#price_decrease_rate').val());
                var decrease_value = (start_price - ((start_price*decrease_rate)/100));
                if(decrease_value > parseInt(decrease_value)){
                    decrease_value = numberFormat(decrease_value);
                }else{
                    decrease_value = numberFormat(parseInt(decrease_value));
                }
                $('#price_decrease_value').html('$'+decrease_value);
            }
        }else{
            $("#"+el_id+"_value").html(el_val+' Min');
            if($('#virtual_dutch_bidding_start_date').val() != ""){
                convert_insider_auction_date();
            }

        }
    }
}
function add_auction_time_value(el)
{
    var el_id = $(el).attr('data-id');
    var el_max = parseInt($(el).attr('data-max'));
    var el_val = 10;
    if($("#"+el_id).val() != ""){
        el_val = parseInt($("#"+el_id).val());
    }
    if(el_val < el_max){
        el_val = el_val + 1;
        $("#"+el_id).val(el_val);
        $("#"+el_id+"_value").html(el_val+' Min');
        if($('#virtual_dutch_bidding_start_date').val() != ""){
            convert_insider_auction_date();
        }
    }
}
function subtract_auction_time_value(el)
{
    var el_id = $(el).attr('data-id');
    var el_val = 10;
    if($("#"+el_id).val() != ""){
        var el_val = parseInt($("#"+el_id).val());
    }
    if(el_val > 10){
        el_val = el_val - 1;
        $("#"+el_id).val(el_val);
    }
    $("#"+el_id+"_value").html(el_val+' Min');
    if($('#virtual_dutch_bidding_start_date').val() != ""){
        convert_insider_auction_date();
    }
}

function numberFormat(x) {
    if(typeof x === 'number'){
        if(x % 1 !== 0){
            x = getFlooredFixed(x, 2)
        }
    } 
    x = x.toString();
    var pattern = /(-?\d+)(\d{3})/;
    while (pattern.test(x))
        x = x.replace(pattern, "$1,$2");
    return x;
}

function getFlooredFixed(v, d) {
    return (Math.floor(v * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d);
}


// function min_max_date(min_date, max_date, index){
//     console.log('in min max')
//     var new_min_date = new Date(min_date);
//     var new_max_date = new Date(max_date);
  
//     $('#add_more_open_house_date_'+index).find('.date-picker-listing').data('daterangepicker').remove();
//     $('#add_more_open_house_date_'+index).find('.date-picker-listing').daterangepicker({ 
//         timePicker: true,
//         timePickerIncrement: 1,
//         singleDatePicker: true,
//         showDropdowns: true,
//         autoUpdateInput: false,
//         locale: {
//             format: 'MM/DD/YYYY h:mm A'
//         },
//         startDate: new_min_date,
//         endDate: new_max_date,
//         minDate: new_min_date,
//         maxDate: new_max_date 
//     });
//     $('#add_more_open_house_date_'+index).find('.date-picker-listing').data('daterangepicker').setStartDate(new_min_date);
// }


// const getLocalDate = (myTimeStamp, dateformat, timeformat) => {
//     // console.log(myTimeStamp)
//     var dateX = new Date(myTimeStamp);
//     var dateY = new Date();
//     var date = '';
//     if(myTimeStamp.includes('Z')){
//         //if utc format
//         date = new Date(dateX.getTime());
//     }
//     else{
//         // for non utc format
//         date = new Date(dateX.getTime() - dateY.getTimezoneOffset() * 60000);
//     }
//     var fullyear = date.getFullYear();
//     var halfYear = parseInt(date.getFullYear().toString().substr(2,2), 10);
//     var mts = date.getMonth()+1;
//     var short_month_name = date.toLocaleString('default', { month: 'short' })
//     var long_month_name = date.toLocaleString('default', { month: 'long' })
//     var month_num = (mts < 10)?'0'+mts:mts;
//     var dt = (date.getDate() < 10)?'0'+date.getDate():date.getDate();
//     var hrs = (date.getHours() < 10)?'0'+date.getHours():date.getHours();
//     var mins = (date.getMinutes() < 10)?'0'+date.getMinutes():date.getMinutes();
//     var secs = (date.getSeconds() < 10)?'0'+date.getSeconds():date.getSeconds();

//     var timeStp = '';
//     if(dateformat == 'yyyy/mm/dd'){
//         timeStp = fullyear+'/'+month_num+'/'+dt;
//     }else if(dateformat == 'mm/dd/yyyy'){
//         timeStp = month_num+'/'+dt+'/'+fullyear;
//     }else if(dateformat == 'dd/mm/yyyy'){
//         timeStp = dt+'/'+month_num+'/'+fullyear;
//     }else if(dateformat == 'dd/mm/yy'){
//         timeStp = dt+'/'+month_num+'/'+halfYear;
//     }else if(dateformat == 'mm/dd/yy'){
//         timeStp = month_num+'/'+dt+'/'+halfYear;
//     }else if(dateformat == 'yy/mm/dd'){
//         timeStp = halfYear+'/'+month_num+'/'+dt;
//     }else if(dateformat == 'j m, Y'){
//         timeStp = dt+' '+short_month_name+', '+fullyear;
//     }else if(dateformat == 'm j, Y'){
//         timeStp = short_month_name+' '+dt+', '+fullyear;
//     }else if(dateformat == 'M j, Y'){
//         timeStp = long_month_name+' '+dt+', '+fullyear;
//     }else if(dateformat == 'j M, Y'){
//         timeStp = dt+' '+long_month_name+', '+fullyear;
//     }
//     if(timeformat =='ampm'){
//         var mer = (parseInt(hrs) >= 12)?'PM':'AM';
//         hrs = parseInt(hrs) % 12;
//         hrs = (hrs)?hrs:12;
//         timeStp = timeStp+" "+hrs+":"+mins+" "+mer;
//     }else{
//         timeStp = timeStp+" "+hrs+":"+mins+":"+secs;
//     }
//     return timeStp;
// }


// const convert_to_utc_date = (myTimeStamp, dateformat, timeformat) => {

//     var dateX = new Date(myTimeStamp);
//     var dateY = new Date();
//     var date = new Date(dateX.getTime() + dateY.getTimezoneOffset() * 60000);

//     var fullyear = date.getFullYear();
//     var halfYear = parseInt(date.getFullYear().toString().substr(2,2), 10);
//     var mts = date.getMonth()+1;
//     var short_month_name = date.toLocaleString('default', { month: 'short' })
//     var long_month_name = date.toLocaleString('default', { month: 'long' })
//     var month_num = (mts < 10)?'0'+mts:mts;
//     var dt = (date.getDate() < 10)?'0'+date.getDate():date.getDate();
//     var hrs = (date.getHours() < 10)?'0'+date.getHours():date.getHours();
//     var mins = (date.getMinutes() < 10)?'0'+date.getMinutes():date.getMinutes();
//     var secs = (date.getSeconds() < 10)?'0'+date.getSeconds():date.getSeconds();

//     var timeStp = '';
//     if(dateformat == 'yyyy/mm/dd'){
//         timeStp = fullyear+'/'+month_num+'/'+dt;
//     }else if(dateformat == 'mm/dd/yyyy'){
//         timeStp = month_num+'/'+dt+'/'+fullyear;
//     }else if(dateformat == 'dd/mm/yyyy'){
//         timeStp = dt+'/'+month_num+'/'+fullyear;
//     }else if(dateformat == 'dd/mm/yy'){
//         timeStp = dt+'/'+month_num+'/'+halfYear;
//     }else if(dateformat == 'mm/dd/yy'){
//         timeStp = month_num+'/'+dt+'/'+halfYear;
//     }else if(dateformat == 'yy/mm/dd'){
//         timeStp = halfYear+'/'+month_num+'/'+dt;
//     }else if(dateformat == 'j m, Y'){
//         timeStp = dt+' '+short_month_name+', '+fullyear;
//     }else if(dateformat == 'm j, Y'){
//         timeStp = short_month_name+' '+dt+', '+fullyear;
//     }else if(dateformat == 'M j, Y'){
//         timeStp = long_month_name+' '+dt+', '+fullyear;
//     }else if(dateformat == 'j M, Y'){
//         timeStp = dt+' '+long_month_name+', '+fullyear;
//     }
//     if(timeformat =='ampm'){
//         var mer = (parseInt(hrs) >= 12)?'PM':'AM';
//         hrs = parseInt(hrs) % 12;
//         hrs = (hrs)?hrs:12;
//         timeStp = timeStp+" "+hrs+":"+mins+" "+mer;
//     }else{
//         timeStp = timeStp+" "+hrs+":"+mins+":"+secs;
//     }
//     return timeStp;
// }


// const convert_to_utc_datetime = (myTimeStamp,format) => {
//     let dateX = new Date(myTimeStamp);
//     let dateY = new Date();
//     let date = new Date(dateX.getTime() + dateY.getTimezoneOffset() * 60000);

//     let year = date.getFullYear();
//     let mts = date.getMonth()+1;
//     let month = (mts < 10)?'0'+mts:mts;
//     let dt = (date.getDate() < 10)?'0'+date.getDate():date.getDate();
//     let hrs = (date.getHours() < 10)?'0'+date.getHours():date.getHours();
//     let mins = (date.getMinutes() < 10)?'0'+date.getMinutes():date.getMinutes();
//     let secs = (date.getSeconds() < 10)?'0'+date.getSeconds():date.getSeconds();
//     let timeStp = '';
//     if(format =='ampm'){
//         let mer = (hrs >= 12)?'PM':'AM';
//         hrs = hrs % 12;
//         hrs = (hrs)?hrs:12;
//         //timeStp = month +"-"+dt+"-"+year+" at "+hrs+":"+mins+" "+mer;
//         timeStp = year +"-"+month+"-"+dt+" "+hrs+":"+mins+" "+mer;
//     }
//     else{
//         timeStp = year +"-"+month+"-"+dt+" "+hrs+":"+mins+":"+secs;
//     }
//     return timeStp;
// }


// const convert_to_24h = (time_str) =>  {
//     console.log(time_str);
//     var time =time_str;
//     var hours = Number(time.match(/^(\d+)/)[1]);
//     var minutes = Number(time.match(/:(\d+)/)[1]);
//     var AMPM = time.match(/\s(.*)$/)[1];
//     if(AMPM == "PM" && hours<12) hours = hours+12;
//     if(AMPM == "AM" && hours==12) hours = hours-12;
//     var sHours = hours.toString();
//     var sMinutes = minutes.toString();
//     if(hours<10) sHours = "0" + sHours;
//     if(minutes<10) sMinutes = "0" + sMinutes;
//     var actualTime = sHours + ":" + sMinutes + ":00";
//     return actualTime;
//   };


$(document).on('click', 'input[name="required_all"]', function(){
        if($(this).is(':checked') == false){
            if($('input[name="offer_unpriced"]').is(':checked') == true){
                $('label[for="bidding_min_price"] span').hide();
                $('#bidding_min_price-error').remove();
            }else{
                $('label[for="bidding_min_price"] span').show();
            }
            $('#due_diligence_period').removeAttr("data-parsley-required");
            $('#escrow_period').removeAttr("data-parsley-required");
            $('#earnest_deposit').removeAttr("data-parsley-required");
            $('label[for="due_diligence_period"] span').hide();
            $('#due_diligence_period-error').remove();
            $('label[for="escrow_period"] span').hide();
            $('#escrow_period-error').remove();
            $('label[for="earnest_deposit"] span').hide();
            $('#earnest_deposit-error').remove();
        }else{
            if($('input[name="offer_unpriced"]').is(':checked') == true){
                $('label[for="bidding_min_price"] span').hide();
                $('#bidding_min_price-error').remove();
            }else{
                $('label[for="bidding_min_price"] span').show();
            }
            $('#due_diligence_period').attr("data-parsley-required", true);
            $('#escrow_period').attr("data-parsley-required", true);
            $('#earnest_deposit').attr("data-parsley-required", true);
            $('label[for="due_diligence_period"] span').show();
            $('label[for="escrow_period"] span').show();
            $('label[for="earnest_deposit"] span').show();
        }
});

$("#offer_unpriced").change(function() {
    if(this.checked) {
        $('label[for="bidding_min_price"] span').hide();
        $('#bidding_min_price').removeAttr("data-parsley-required");
//        $("#bidding_min_price").removeClass("parsley-error");
//        $("#bidding_min_price").removeAttr("data-parsley-id")
//        $("#bidding_min_price").parent().find(".parsley-errors-list").remove();
    }else
    {
        $('#bidding_min_price').attr("data-parsley-required", true);
        $('label[for="bidding_min_price"] span').show();

    }
});

