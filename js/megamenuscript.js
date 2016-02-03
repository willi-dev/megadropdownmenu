jQuery(document).ready(function() {
    jQuery(".loading").hide();

    jQuery('#page').hide().fadeIn();

    var urlWP = ajax_script.ajaxurl;

    var tmpData = {};
    var tmpInnerData = {};
    var tmpOuterIndex;
    var tmpCurrentPage;
    var tmpCatId;
    var tmpNoItem;
    var curPage;

    nextMegaMenu(); // call nextMegaMenu()
    prevMegaMenu(); // call prevMegaMenu()

    /*
     * next content post
     */
    function nextMegaMenu(){
        jQuery('.next_megamenu').click(function(e){
            e.preventDefault();

            noItem = jQuery(this).data('item');  
            categoryId = jQuery(this).data('cat');
            totalPages = jQuery(".total_pages-"+categoryId+"-"+noItem).val();
            postsPerPage = jQuery(".posts_per_page-"+categoryId+"-"+noItem).val();
            currentPage = jQuery(".current_page-"+categoryId+"-"+noItem).val();

            nextIndex = parseInt(currentPage) + 1;
            outerIndex = "df-megamenu-"+categoryId+"-"+noItem;

            console.log("cat: "+categoryId+", no item: "+noItem);
            // console.log("total: " +totalPages);
            // console.log("postsPerPage: " +postsPerPage);

            if(typeof tmpData[outerIndex] === "undefined"){
                console.log("undefined");
                console.log(outerIndex);
                tmpInnerData = {};
                tmpData[outerIndex] = tmpInnerData;
            }else{
                console.log("defined");
                console.log(outerIndex);
            }

            if(typeof tmpOuterIndex === "undefined"){
                console.log("tmpOuterIndex undefined");
                tmpInnerData[currentPage] = jQuery(".block_megamenu-"+categoryId+"-"+noItem).html();
                console.log("next ["+outerIndex+"] fill tmpInnerData["+currentPage+"]");
            }else{
                console.log("tmpOuterIndex defined");
                console.log("tmpOuterIndex: " +tmpOuterIndex);  

                if(tmpOuterIndex == outerIndex){
                    console.log("tmpOuterIndex == outerIndex");
                    tmpData[tmpOuterIndex][tmpCurrentPage] = jQuery(".block_megamenu-"+categoryId+"-"+noItem).html();
                    // tmpInnerData[currentPage] = jQuery(".block_megamenu-"+categoryId+"-"+noItem).html();
                    console.log("next ["+outerIndex+"] fill tmpData["+tmpOuterIndex+"] tmpInnerData["+tmpCurrentPage+"]");
                }else{
                    console.log("tmpOuterIndex != outerIndex");
                    tmpData[tmpOuterIndex][tmpCurrentPage] = jQuery(".block_megamenu-"+tmpCatId+"-"+tmpNoItem).html();

                    tmpData[outerIndex][currentPage] = jQuery(".block_megamenu-"+categoryId+"-"+noItem).html();
                    // tmpInnerData[currentPage] = jQuery(".block_megamenu-"+categoryId+"-"+noItem).html();
                    console.log("next ["+outerIndex+"] fill tmpData["+tmpOuterIndex+"] tmpInnerData["+tmpCurrentPage+"]");
                }

            }

            objInside = tmpData[outerIndex];

            if(Object.keys(objInside).length != 0 ){

                check = objInside[nextIndex];
                if( check == null ){
                    // call ajax again
                    console.log("next ["+outerIndex+"] get from ajax [if null] ");
                    jQuery.ajax({
                        type: 'POST',
                        url: urlWP,
                        data: {
                            action: 'getNextPage', 
                            no_item: noItem,
                            category_id: categoryId,
                            total_pages: totalPages,
                            posts_per_page: postsPerPage,
                            current_page: currentPage,
                            type: 'next'
                        },
                        beforeSend: function(){
                            // tmpInnerData[currentPage] = jQuery(".block_megamenu-"+categoryId+"-"+noItem).html();
                            // console.log("next ["+outerIndex+"] fill tmpInnerData["+currentPage+"]");
                            jQuery(".block_inner_megamenu-"+categoryId+"-"+noItem).fadeOut().remove();
                            jQuery(".loading-"+categoryId+"-"+noItem).show();
                        },
                        success: function(data){
                            jQuery('.loading-'+categoryId+"-"+noItem).hide(function(){
                                // remove style in prev link
                                jQuery("#prev-"+categoryId+"-"+noItem).removeAttr( "style" );

                                // add next content to .block_megamenu-[cat id]-[no item]
                                jQuery(".block_megamenu-"+categoryId+"-"+noItem).prepend(data).fadeIn('slow', function(){
                                    cPage = jQuery(".current_page-"+categoryId+"-"+noItem).val();
                                    tPages = jQuery(".total_pages-"+categoryId+"-"+noItem).val();
                                    if(cPage == tPages){
                                        jQuery("#next-"+categoryId+"-"+noItem).css("pointer-events", 'none');
                                        jQuery("#next-"+categoryId+"-"+noItem).css("cursor", 'default');
                                        jQuery("#next-"+categoryId+"-"+noItem).css("color", '#ccc');
                                    }
                                });  
                                tmpInnerData[nextIndex] = jQuery(".block_megamenu-"+categoryId+"-"+noItem).html();
                                console.log("next ["+outerIndex+"] fill tmpInnerData["+nextIndex+"]");
                            });
                        }
                    });
                }else{
                    jQuery(".block_inner_megamenu-"+categoryId+"-"+noItem).fadeOut().remove();
                    jQuery('.loading-'+categoryId+"-"+noItem).hide().remove();
                    // remove style in prev link
                    jQuery("#prev-"+categoryId+"-"+noItem).removeAttr( "style" );

                    console.log("next ["+outerIndex+"] get from json ");
                    // add next content to .block_megamenu-[cat id]-[no item]
                    jQuery(".block_megamenu-"+categoryId+"-"+noItem).prepend(tmpData[outerIndex][nextIndex]).fadeIn('slow', function(){
                        cPage = jQuery(".current_page-"+categoryId+"-"+noItem).val();
                        tPages = jQuery(".total_pages-"+categoryId+"-"+noItem).val();
                        if(cPage == tPages){
                            jQuery("#next-"+categoryId+"-"+noItem).css("pointer-events", 'none');
                            jQuery("#next-"+categoryId+"-"+noItem).css("cursor", 'default');
                            jQuery("#next-"+categoryId+"-"+noItem).css("color", '#ccc');
                        }
                    });  
                }
            }else{
                console.log("next ["+outerIndex+"] get from ajax [first] ");
                jQuery.ajax({
                    type: 'POST',
                    url: urlWP,
                    data: {
                        action: 'getNextPage', 
                        no_item: noItem,
                        category_id: categoryId,
                        total_pages: totalPages,
                        posts_per_page: postsPerPage,
                        current_page: currentPage,
                        type: 'next'
                    },
                    beforeSend: function(){
                        // tmpInnerData[currentPage] = jQuery(".block_megamenu-"+categoryId+"-"+noItem).html();
                        // console.log("next ["+outerIndex+"] fill tmpInnerData["+currentPage+"]");
                        jQuery(".block_inner_megamenu-"+categoryId+"-"+noItem).fadeOut().remove();
                        jQuery(".loading-"+categoryId+"-"+noItem).show();
                    },
                    success: function(data){
                        jQuery('.loading-'+categoryId+"-"+noItem).hide(function(){
                            // remove style in prev link
                            jQuery("#prev-"+categoryId+"-"+noItem).removeAttr( "style" );
                            // add next content to .block_megamenu-[cat id]-[no item]
                            jQuery(".block_megamenu-"+categoryId+"-"+noItem).prepend(data).fadeIn('slow', function(){
                                cPage = jQuery(".current_page-"+categoryId+"-"+noItem).val();
                                tPages = jQuery(".total_pages-"+categoryId+"-"+noItem).val();
                                if(cPage == tPages){
                                    jQuery("#next-"+categoryId+"-"+noItem).css("pointer-events", 'none');
                                    jQuery("#next-"+categoryId+"-"+noItem).css("cursor", 'default');
                                    jQuery("#next-"+categoryId+"-"+noItem).css("color", '#ccc');
                                }
                                tmpInnerData[nextIndex] = jQuery(".block_megamenu-"+categoryId+"-"+noItem).html();
                                console.log("next ["+outerIndex+"] fill tmpInnerData["+nextIndex+"]");
                            });  
                            
                        });
                        
                        
                    }
                });
            }
            
            tmpOuterIndex = outerIndex;
            tmpCurrentPage = nextIndex;
            tmpCatId = categoryId;
            tmpNoItem = noItem;


            console.log("next ["+outerIndex+"] size tmpData: " + Object.keys(tmpData).length);
            console.log("next ["+outerIndex+"] content tmpData: ");
            console.log(tmpData);
            console.log("=======================================================================");
        })
    }
    

    /*
     * prev content post
     */
    function prevMegaMenu(){
        jQuery('.prev_megamenu').click(function(e){
            e.preventDefault();

            noItem = jQuery(this).data('item');  
            categoryId = jQuery(this).data('cat');
            totalPages = jQuery(".total_pages-"+categoryId+"-"+noItem).val();
            postsPerPage = jQuery(".posts_per_page-"+categoryId+"-"+noItem).val();
            currentPage = jQuery(".current_page-"+categoryId+"-"+noItem).val();
            // categoryId = jQuery(".category_id-" +noItem).val();

            prevIndex = parseInt(currentPage) - 1;
            outerIndex = "df-megamenu-"+categoryId+"-"+noItem;

            console.log("cat: "+categoryId+", no item: "+noItem);

            if(typeof tmpData[outerIndex] === "undefined"){
                console.log("undefined");
                console.log(outerIndex);
                tmpInnerData = {};
                tmpData[outerIndex] = tmpInnerData;
            }else{
                console.log("defined");
                console.log(outerIndex);
            }
            objInside = tmpData[outerIndex];
            
            if(typeof tmpOuterIndex === "undefined"){
                console.log("tmpOuterIndex undefined");
            }else{
                console.log("tmpOuterIndex defined");
                console.log("tmpOuterIndex: " +tmpOuterIndex);

                if(tmpOuterIndex == outerIndex){
                    console.log("tmpOuterIndex == outerIndex");
                    tmpData[tmpOuterIndex][tmpCurrentPage] = jQuery(".block_megamenu-"+categoryId+"-"+noItem).html();
                    // tmpInnerData[currentPage] = jQuery(".block_megamenu-"+categoryId+"-"+noItem).html();
                    console.log("prev ["+outerIndex+"] fill tmpData["+tmpOuterIndex+"] tmpInnerData["+tmpCurrentPage+"]");
                }else{
                    console.log("tmpOuterIndex != outerIndex");
                    tmpData[tmpOuterIndex][tmpCurrentPage] = jQuery(".block_megamenu-"+tmpCatId+"-"+tmpNoItem).html();
                    
                    tmpData[outerIndex][currentPage] = jQuery(".block_megamenu-"+categoryId+"-"+noItem).html();
                    // tmpInnerData[currentPage] = jQuery(".block_megamenu-"+categoryId+"-"+noItem).html();
                    console.log("prev ["+outerIndex+"] fill tmpData["+tmpOuterIndex+"] tmpInnerData["+tmpCurrentPage+"]");
                }

            }

            if(Object.keys(objInside).length != 0){

                check = objInside[prevIndex];
                if( check == null ){
                    // call ajax again
                    console.log("prev ["+outerIndex+"] get from ajax [if null] ");
                    jQuery.ajax({
                        type: 'POST',
                        url: urlWP,
                        data: {
                            action: 'getPrevPage', 
                            no_item: noItem,
                            category_id: categoryId,
                            total_pages: totalPages,
                            posts_per_page: postsPerPage,
                            current_page: currentPage,
                            type: 'prev'
                        },
                        beforeSend: function(){
                            // tmpInnerData[currentPage] = jQuery(".block_megamenu-"+categoryId+"-"+noItem).html();
                            // console.log("prev ["+outerIndex+"] fill tmpInnerData["+currentPage+"]");
                            jQuery(".block_inner_megamenu-"+categoryId+"-"+noItem).fadeOut().remove();
                            jQuery(".loading-"+categoryId+"-"+noItem).show();
                        },
                        success: function(data){
                            jQuery('.loading-'+categoryId+"-"+noItem).hide(function(){
                                jQuery(".block_megamenu-"+categoryId+"-"+noItem).prepend(data).fadeIn('slow', function(){
                                    cPage = jQuery(".current_page-"+categoryId+"-"+noItem).val();
                                    tPages = jQuery(".total_pages-"+categoryId+"-"+noItem).val();
                                    if(cPage == '1'){
                                        jQuery("#prev-"+categoryId+"-"+noItem).css("pointer-events", 'none');
                                        jQuery("#prev-"+categoryId+"-"+noItem).css("cursor", 'default');
                                        jQuery("#prev-"+categoryId+"-"+noItem).css("color", '#ccc');
                                        // remove style in prev link
                                        jQuery("#next-"+categoryId+"-"+noItem).removeAttr( "style" );
                                    }
                                });  
                            });
                        }
                    })
                }else{
                    // tmpInnerData[currentPage] = jQuery(".block_megamenu-"+categoryId+"-"+noItem).html();
                    // console.log("prev ["+outerIndex+"] fill tmpInnerData["+currentPage+"]");
                    jQuery(".block_inner_megamenu-"+categoryId+"-"+noItem).fadeOut().remove();
                    jQuery('.loading-'+categoryId+"-"+noItem).hide().remove();

                    console.log("prev ["+outerIndex+"] get from json ");

                    jQuery(".block_megamenu-"+categoryId+"-"+noItem).prepend(tmpData[outerIndex][prevIndex]).fadeIn('slow', function(){
                        cPage = jQuery(".current_page-"+categoryId+"-"+noItem).val();
                        tPages = jQuery(".total_pages-"+categoryId+"-"+noItem).val();
                        if(cPage == '1'){
                            jQuery("#prev-"+categoryId+"-"+noItem).css("pointer-events", 'none');
                            jQuery("#prev-"+categoryId+"-"+noItem).css("cursor", 'default');
                            jQuery("#prev-"+categoryId+"-"+noItem).css("color", '#ccc');
                            // remove style in prev link
                            jQuery("#next-"+categoryId+"-"+noItem).removeAttr( "style" );
                        }
                    });
                }
            }else{
                console.log("prev ["+outerIndex+"] get from ajax [first] ");
                jQuery.ajax({
                    type: 'POST',
                    url: urlWP,
                    data: {
                        action: 'getPrevPage', 
                        no_item: noItem,
                        category_id: categoryId,
                        total_pages: totalPages,
                        posts_per_page: postsPerPage,
                        current_page: currentPage,
                        type: 'prev'
                    },
                    beforeSend: function(){
                        // tmpInnerData[currentPage] = jQuery(".block_megamenu-"+categoryId+"-"+noItem).html();
                        // console.log("prev ["+outerIndex+"] fill tmpInnerData["+currentPage+"]");
                        jQuery(".block_inner_megamenu-"+categoryId+"-"+noItem).fadeOut().remove();
                        jQuery(".loading-"+categoryId+"-"+noItem).show();
                    },
                    success: function(data){
                        jQuery('.loading-'+categoryId+"-"+noItem).hide(function(){
                            jQuery(".block_megamenu-"+categoryId+"-"+noItem).prepend(data).fadeIn('slow', function(){
                                cPage = jQuery(".current_page-"+categoryId+"-"+noItem).val();
                                tPages = jQuery(".total_pages-"+categoryId+"-"+noItem).val();
                                if(cPage == '1'){
                                    jQuery("#prev-"+categoryId+"-"+noItem).css("pointer-events", 'none');
                                    jQuery("#prev-"+categoryId+"-"+noItem).css("cursor", 'default');
                                    jQuery("#prev-"+categoryId+"-"+noItem).css("color", '#ccc');
                                    // remove style in prev link
                                    jQuery("#next-"+categoryId+"-"+noItem).removeAttr( "style" );
                                }
                            });  
                        });
                    }
                })
            }

            tmpOuterIndex = outerIndex;
            tmpCurrentPage = prevIndex;
            tmpCatId = categoryId;
            tmpNoItem = noItem;

            console.log("prev ["+outerIndex+"] size tmpData: " + Object.keys(tmpData).length);
            console.log("prev ["+outerIndex+"] content tmpData: ");
            console.log(tmpData);
            console.log("=======================================================================");
        })
    }
});
