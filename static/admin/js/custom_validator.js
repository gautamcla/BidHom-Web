$(document).ready(function(){
        $.validator.addMethod("accept", function (value, element)
        {
            return this.optional(element) || /^[a-zA-Z-,]+(\s{0,1}[a-zA-Z-,.!_@ ])*$/.test(value);
        }, "Letters and spaces only please");
        $.validator.addMethod("email", function (value, element)
        {
            return this.optional(element) || /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value);
        }, "Letters and spaces only please");

        $.validator.addMethod('ccexp', function(value, element, params) {
          var minMonth = new Date().getMonth() + 1;
          var minYear = new Date().getFullYear();
          var month = parseInt($(params.month).val(), 10);
          var year = parseInt($(params.year).val(), 10);
        //   try {
        //     $('#card_expiry_yr, #card_expiry_month').valid();   
        //   } catch (error) {
        //       console.log(error)
        //   }
          return (!month || !year || year > minYear || (year === minYear && month >= minMonth));
        }, 'Your Credit Card Expiration date is invalid.');
        $.validator.addMethod("greaterThan",
        function(value, element, params) {

            if (!/Invalid|NaN/.test(new Date(value))) {
                return new Date(value) > new Date($(params).val());
            }

            return isNaN(value) && isNaN($(params).val()) ||
                (Number(value) > Number($(params).val()));
        }, 'Must be greater than {0}.');
        $.validator.addMethod("greaterThanValue",
        function (value, element, param) {

              var $otherElement = $(param);
              if($otherElement.val()){
                var otherElement = $otherElement.val().replace('$','').replace(/,/g, '');
              }
              if(value){
                value = value.replace('$','').replace(/,/g, '');
              }

              if(typeof($otherElement.val()) !='undefined' && $otherElement != ""){
                return (parseFloat(value, 10) > parseFloat(otherElement, 10));
              }else{
                return true;
              }

        }, 'Must be greater than {0}.');

        $.validator.addMethod("yearcheck",
        function (value, element, param) {
            return  Number(value) >= new Date().getFullYear()
        }, 'Invalid Year.');
        $.validator.addMethod("thousandsepratornum", function (value, element)
        {
            if(value){
                value = value.replace('$','').replace(/,/g, '');
            }
            return this.optional(element) || /^[0-9]+(,[0-9]+)*$/.test(value) || /^(?!0|\.00)[0-9]+(,\d{3})*(.?[0-9]{1,2})$/.test(value);
        }, "Please enter valid amount");
        $.validator.addMethod("decimalvalidator", function (value, element)
        {
            return this.optional(element) || /^\d+(.?[0-9]{1,2})?$/.test(value);
        }, "Please enter valid number");
        $.validator.addMethod("edvalidator", function (value, element)
        {
            if(value){
                value = value.replace('$','').replace(/,/g, '');
            }
            if(parseInt($('input[name="earnest_deposit_type"]:checked').val()) == 1){
                return this.optional(element) || /^[0-9]+(,[0-9]+)*$/.test(value) || /^(?!0|\.00)[0-9]+(,\d{3})*(.?[0-9]{1,2})$/.test(value);
            }else{
                return this.optional(element) || /^\d+(.?[0-9]{1,2})?$/.test(value);
            }

        }, "Please enter valid number");
        $.validator.addMethod("lessThan",
        function (value, element, param) {
            if(value){
                value = value.replace('$','').replace(/,/g, '');
            }
              var $otherElement = $(param);

              if(typeof($otherElement.val()) !='undefined' && $otherElement != ""){
                return this.optional(element) || (parseFloat(value, 10) <= parseFloat($otherElement.val().replace('$','').replace(/,/g, ''), 10));
              }else{
                return true;
              }

        }, 'Must be greater than {0}.');
        $.validator.addMethod("minvalue", function (value, element, param)
        {

            if(value){
                value = value.replace('$','').replace(/,/g, '');
            }
            return this.optional(element) || (parseFloat(value, 10) >= parseFloat(param));
        }, "Must Be greater than or equal {0}");

        $.validator.addMethod("uppercasepass",
            function(value, element, param) {
                if (!/[A-Z]/.test(value)) {
                    return false;
                }
                return true
        },"Include at least 1 uppercase letter.");


        $.validator.addMethod("validate_email", function(value, element) {

            if (/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(value)) {
                return true;
            } else {
                return false;
            }
        }, "Please enter a valid Email.");

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
        $.validator.addMethod("phoneminlength", function(value, element, param) {
        custom_value = value.replace(/[^\d.-]/g, '');
        custom_value = custom_value.replace(/-/g, '');

         return this.optional(element) || custom_value.length == param;
        }, $.validator.format("Please enter exactly {0} characters."));
        $.validator.addMethod("phonemaxlength", function(value, element, param) {
        custom_value = value.replace(/[^\d.-]/g, '');
        custom_value = custom_value.replace(/-/g, '');

         return this.optional(element) || custom_value.length == param;
        }, $.validator.format("Please enter exactly {0} characters."));

});