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
    
    nextMegaMenu();
    prevMegaMenu();

    /*
     * next content post
     */
    function nextMegaMenu(){
        jQuery('.next_megamenu').click(function(e){
            e.preventDefault();
            var noItem = jQuery(this).data('item');  
            var totalPages = jQuery(".total_pages-" +noItem).val();
            var foundPosts = jQuery(".found_posts-" +noItem).val();
            var postsPerPage = jQuery(".posts_per_page-" +noItem).val();
            var currentPage = jQuery(".current_page-" +noItem).val();
            var categoryId = jQuery(".category_id-" +noItem).val();
            jQuery.ajax({
                type: 'POST',
                url: urlWP,
                data: {
                    action: 'getNextPage', 
                    no_item: noItem,
                    category_id: categoryId,
                    total_pages: totalPages,
                    found_posts: foundPosts,
                    posts_per_page: postsPerPage,
                    current_page: currentPage,
                    type: 'next'
                },
                success: function(data){
                    // alert(data);
                    jQuery(".block_inner_megamenu-"+categoryId+"-"+noItem).remove().fadeOut(function(){
                        // remove style in prev link
                        jQuery("#prev-"+categoryId+"-"+noItem).removeAttr( "style" );

                        // add next content to .block_megamenu-[cat id]-[no item]
                        jQuery(".block_megamenu-"+categoryId+"-"+noItem).prepend(data).fadeIn('slow', function(){
                            var cPage = jQuery(".current_page-"+noItem).val();
                            var tPages = jQuery(".total_pages-"+noItem).val();
                            if(cPage == tPages){
                                jQuery("#next-"+categoryId+"-"+noItem).css("pointer-events", 'none');
                                jQuery("#next-"+categoryId+"-"+noItem).css("cursor", 'default');
                                jQuery("#next-"+categoryId+"-"+noItem).css("color", '#ccc');
                            }
                        });  
                                           
                    });
                    

                }
            });
        })
    }
    

    /*
     * prev content post
     */
    function prevMegaMenu(){
        jQuery('.prev_megamenu').click(function(e){
            e.preventDefault();
            var noItem = jQuery(this).data('item');  
            var totalPages = jQuery(".total_pages-" +noItem).val();
            var foundPosts = jQuery(".found_posts-" +noItem).val();
            var postsPerPage = jQuery(".posts_per_page-" +noItem).val();
            var currentPage = jQuery(".current_page-" +noItem).val();
            var categoryId = jQuery(".category_id-" +noItem).val();
            jQuery.ajax({
                type: 'POST',
                url: urlWP,
                data: {
                    action: 'getPrevPage', 
                    no_item: noItem,
                    category_id: categoryId,
                    total_pages: totalPages,
                    found_posts: foundPosts,
                    posts_per_page: postsPerPage,
                    current_page: currentPage,
                    type: 'prev'
                },
                success: function(data){
                    jQuery(".block_inner_megamenu-"+categoryId+"-"+noItem).remove().fadeOut(function(){
                        jQuery(".block_megamenu-"+categoryId+"-"+noItem).prepend(data).fadeIn('slow', function(){
                            var cPage = jQuery(".current_page-"+noItem).val();
                            var tPages = jQuery(".total_pages-"+noItem).val();
                            if(cPage == '1'){
                                jQuery("#prev-"+categoryId+"-"+noItem).css("pointer-events", 'none');
                                jQuery("#prev-"+categoryId+"-"+noItem).css("cursor", 'default');
                                jQuery("#prev-"+categoryId+"-"+noItem).css("color", '#ccc');
                                // remove style in prev link
                                jQuery("#next-"+categoryId+"-"+noItem).removeAttr( "style" );
                            }
                        });  
                    });
                },
                error: function(){

                }
            })
        })
    }
    

});

/*
 *
 */

(function($){
    
})(jQuery);