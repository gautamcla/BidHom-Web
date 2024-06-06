$(document).ready(function(){

var checkoutButton = document.getElementById('pay_now');
checkoutButton.addEventListener('click', function () {
        //var plan_id = document.getElementById('plan_id').value;
        var plan_price_id = document.getElementById('plan_price_id').value;
        var theme_id = document.getElementById('theme_id').value;
        if (plan_id.length == 0) {
            alert("Plan id missing.");
            return;
        }
        if (theme_id < 1) {
            alert("Theme id missing.");
            return;
        }
        $('.overlay').show();
        fetch("/admin/payment/create-checkout-session/"+plan_price_id+"/", {
            method: 'POST',
            contentType: "application/json",
            dataType: "json",
            body: JSON.stringify(
                {"theme_id": theme_id}
            )
        })
        .then(function (response) {
            console.log(response);
            return response.json();
        })
        .then(function (session) {
            if(session.error == 0){
                return stripe.redirectToCheckout({ sessionId: session.sessionId });
            }else{
                $('.overlay').hide();
                window.setTimeout(function () {
                    $.growl.error({title: "Error ", message: session.msg, size: 'large'});
                }, 2000);
            }
        })
        .then(function (result) {
            // If `redirectToCheckout` fails due to a browser or network
            // error, you should display the localized error message to your
            // customer using `error.message`.
            $('.overlay').hide();
            if (result.error) {
                alert(result.error.message);
            }
        })
        .catch(function (error) {
            $('.overlay').hide();
            console.error('Error:', error);
        });
    });
});