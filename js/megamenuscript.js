jQuery(document).ready(function() {

    // var GreetingAll = jQuery("#GreetingAll").val();
    // jQuery("#PleasePushMe").click(function(e){ 
    //     e.preventDefault();
   
    //     jQuery.ajax({
    //         type: 'POST',
    //         url: 'http://localhost/trialplugin/wp-admin/admin-ajax.php',
    //         data: {
    //             action: 'MyAjaxFunction',
    //             GreetingAll: GreetingAll
    //         },
    //         success: function(data, textStatus, XMLHttpRequest){
    //             jQuery("#test-div1").html('');
    //             jQuery("#test-div1").append(data);
    //         },
    //         error: function(XMLHttpRequest, textStatus, errorThrown){
    //             alert(errorThrown);
    //         }
    //     })
    //     // jQuery.ajax({
    //     //     url: "http://localhost/trialplugin",
    //     //     success: function( data ) {
    //     //         alert( 'Your home page has ' + jQuery(data).find('div').length + ' div elements.');
    //     //     }
    //     // })
    // });

    jQuery('#page').hide().fadeIn();

    var urlWP = ajax_script.ajaxurl;
    // var currentPage;
    
    /*
     * next content post
     */
    jQuery('.next_megamenu').click(function(e){
        e.preventDefault();
        var categoryId = jQuery(this).data('cat');     
        var totalPages = jQuery(".total_pages-" +categoryId).val();
        var foundPosts = jQuery(".found_posts-" +categoryId).val();
        var postsPerPage = jQuery(".posts_per_page-" +categoryId).val();
        jQuery.ajax({
            type: 'POST',
            url: urlWP,
            data: {
                action: 'getNextPage', 
                total_pages: totalPages,
                found_posts: foundPosts,
                posts_per_page: postsPerPage
            },
            success: function(data){
                alert(data);

            }
        });
    })

    /*
     * prev content post
     */
    jQuery('.prev_megamenu').click(function(e){
        e.preventDefault();
        var categoryId = jQuery(this).data('cat');     
        var totalPages = jQuery(".total_pages-" +categoryId).val();
        var foundPosts = jQuery(".found_posts-" +categoryId).val();
        var postsPerPage = jQuery(".posts_per_page-" +categoryId).val();
        jQuery.ajax({
            type: 'POST',
            url: urlWP,
            data: {
                action: 'getPrevPage', 
                total_pages: totalPages,
                found_posts: foundPosts,
                posts_per_page: postsPerPage
            },
            success: function(data){
                // alert(data);
            },
            error: function(){

            }
        })
    })


});

/*
 *
 */

(function($){
    
})(jQuery);