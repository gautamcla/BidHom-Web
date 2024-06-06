(function ( $ ) {
    $.fn.blink = function(options) {
    	//configurations
    	var defaults = {
            color: "", //use element's color
            effect: "", //use element's color
            times: 0, //infinitive
            duration: 500, //milliseconds
        };
    	var settings = $.extend({}, defaults, options );


        return this.each(function(){
    		var element = $(this);

    		//blink color
    		var originalColor = $(this).css('color');
    		var blinkColor = settings.color != '' ? settings.color : 'rgb(0, 0, 0, 0.1)';
    		var effect = settings.effect != '' ? settings.effect : 'fade';
    		//times
    		var count = 0;
    		//loop
    		var doBlink = function(){
    		    if(settings.effect && settings.times > 0){
    		        element.delay(settings.duration)
                    .queue(function (next) {
                        $(this).css( 'color', blinkColor );
                        $(this).effect(effect);
                        next();
                    })
                    .delay(settings.duration)
                    .queue(function (next) {
                        count++;
                        next();
                        if(count < settings.times){
                            doBlink();
                        }

                    });
    		    }else{
                    element.delay(settings.duration)
                    .queue(function (next) {
                        $(this).css( 'color', originalColor );
                        $(this).effect('fade');
                        next();
                    })
                    .delay(0)
                    .queue(function (next) {
                        count++;
                        next();
                        /*if(count < settings.times || settings.times == 0){
                            doBlink();
                        }*/
                        if(count < settings.times){
                            doBlink();
                        }

                    });
    		    }



			}
			doBlink();

    	});
    };

}( jQuery ));
