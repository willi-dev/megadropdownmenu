jQuery(document).ready(function() {
    var GreetingAll = jQuery("#GreetingAll").val();
    jQuery("#PleasePushMe").click(function(e){ 
        e.preventDefault();
   
        jQuery.ajax({
            type: 'POST',
            url: 'http://localhost/trialplugin/wp-admin/admin-ajax.php',
            data: {
                action: 'MyAjaxFunction',
                GreetingAll: GreetingAll
            },
            success: function(data, textStatus, XMLHttpRequest){
                jQuery("#test-div1").html('');
                jQuery("#test-div1").append(data);
            },
            error: function(MLHttpRequest, textStatus, errorThrown){
                alert(errorThrown);
            }
        })
        // jQuery.ajax({
        //     url: "http://localhost/trialplugin",
        //     success: function( data ) {
        //         alert( 'Your home page has ' + jQuery(data).find('div').length + ' div elements.');
        //     }
        // })
    });

    jQuery('#page').hide().fadeIn();

    /* ================================================================== */

    

});

/*
 *
 */

(function($){
    
})(jQuery);