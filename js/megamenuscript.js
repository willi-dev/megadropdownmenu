jQuery(document).ready(function() {
    jQuery(".loading").hide();

    jQuery('#page').hide().fadeIn();

    var urlWP = ajax_script.ajaxurl;
    var tmpData = {};
    var size;

    nextMegaMenu(); // call nextMegaMenu()
    prevMegaMenu(); // call prevMegaMenu()

    /*
     * next content post
     */
    function nextMegaMenu(){
        jQuery('.next_megamenu').click(function(e){
            e.preventDefault();
            var noItem = jQuery(this).data('item');  
            var totalPages = jQuery(".total_pages-" +noItem).val();
            // var foundPosts = jQuery(".found_posts-" +noItem).val();
            var postsPerPage = jQuery(".posts_per_page-" +noItem).val();
            var currentPage = jQuery(".current_page-" +noItem).val();
            var categoryId = jQuery(".category_id-" +noItem).val();

            console.log("[next click] size: " + Object.keys(tmpData).length);

            // if(Object.keys(tmpData).length != 0){
                
            // }else{
                jQuery.ajax({
                    type: 'POST',
                    url: urlWP,
                    data: {
                        action: 'getNextPage', 
                        no_item: noItem,
                        category_id: categoryId,
                        total_pages: totalPages,
                        // found_posts: foundPosts,
                        posts_per_page: postsPerPage,
                        current_page: currentPage,
                        type: 'next'
                    },
                    beforeSend: function(){
                        tmpData[currentPage] = jQuery(".block_megamenu-"+categoryId+"-"+noItem).html();
                        console.log(tmpData);
                        jQuery(".block_inner_megamenu-"+categoryId+"-"+noItem).fadeOut().remove();
                        jQuery(".loading-"+categoryId+"-"+noItem).show();
                    },
                    success: function(data){
                        jQuery('.loading-'+categoryId+"-"+noItem).hide(function(){
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
            // }

            console.log("[next click][after] size: " + Object.keys(tmpData).length);
           
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

            console.log("[prev click] size: " + Object.keys(tmpData).length);
            
            // if(Object.keys(tmpData).length != 0){

            // }else{
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
                    beforeSend: function(){
                        tmpData[currentPage] = jQuery(".block_megamenu-"+categoryId+"-"+noItem).html();
                        console.log(tmpData);
                        jQuery(".block_inner_megamenu-"+categoryId+"-"+noItem).fadeOut().remove();
                        jQuery(".loading-"+categoryId+"-"+noItem).show();
                    },
                    success: function(data){
                        jQuery('.loading-'+categoryId+"-"+noItem).hide(function(){
                            
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
            // }
            
            console.log("[prev click][after] size: " + Object.keys(tmpData).length);

        })
    }
});
