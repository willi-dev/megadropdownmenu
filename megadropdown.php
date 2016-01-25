<?php 
/*
Plugin Name: Mega Dropdown Menu
Plugin URL: openintotaldarkness.wordpress.com/
Description: Mega Dropdown Menu for Wordpress, based on Sweet-Custom-Menu Plugin by Remi Corson (http://remicorson.com/sweet-custom-menu)
Version: 1.0
Author: Willi
Author URI: openintotaldarkness.wordpress.com
Contributors: - 
Text Domain: -
Domain Path: languages
*/

class megadropdown {
	var $is_mobile = true; // if mobile

	// constructor 
	function __construct() {

		// add filter for add custom field
		// add_filter('wp_setup_nav_menu_item', array($this, 'md_add_custom_category'));

		if(is_admin()) {

			// add action for save custom field
			add_action('wp_update_nav_menu_item', array($this, 'md_update_custom_category'), 10, 3);

			// add filter for edit menu walker (admin page)
			add_filter('wp_edit_nav_menu_walker', array($this, 'md_edit_nav_menu_walker'), 10, 2);
		}

		// add filter wp nav menu objects
		add_filter('wp_nav_menu_objects', array($this, 'md_nav_menu_object'), 10, 2);

	}
	// end of constructor 

	/*
	 * add custom field
	 * load category ? 
	 * to $item nav object
	 */
	function md_add_custom_category ( $menu_item ) {
		$menu_item->subtitle = get_post_meta($menu_item->ID, '_menu_item_subtitle', true);
		return $menu_item;
	}

	/*
	 * save custom field 
	 * md_update_custom_category
	 */
	function md_update_custom_category( $menu_id, $menu_item_db_id, $args ){
		// check if element is properly sent
		/*if( is_array( $_REQUEST['menu-item-subtitle'])) {
			$subtitle_value = $_REQUEST['menu-item-subtitle'][$menu_item_db_id];
			update_post_meta( $menu_item_db_id, '_menu_item_subtitle', $subtitle_value);
		}*/

		if(isset($_POST['megadropdown_menu_cat'][$menu_item_db_id])){
			update_post_meta($menu_item_db_id, 'megadropdown_menu_cat', $_POST['megadropdown_menu_cat'][$menu_item_db_id]);
		}
	}

	/*
	 * edit / custom field in admin
	 * md_edit_walker 
	 */
	function md_edit_nav_menu_walker( $walker, $menu_id ){
		// walker_nav_menu_edit_custom from edit_custom_walker.php
		// include_once('edit_custom_walker.php');
		return 'Walker_Nav_Menu_Edit_Custom'; 
	}

	/*
	 * add mega menu support
	 */
	function md_nav_menu_object($items, $args = '') {
		$items_buff = array();
		$category_key_post_meta = 'megadropdown_menu_cat';
		// print_r($items);
		foreach ($items as &$item) {
			// $item->is_mega_menu = false;
			$megadropdown_menu_cat = get_post_meta($item->ID, $category_key_post_meta, true);
			// print_r($megadropdown_menu_cat);
			if($megadropdown_menu_cat != ''){
				$item->classes[] = 'md_menuitem';
				$item->classes[] = '';
				$items_buff[] = $item;

				// generate wp post
				$new_item = $this->generate_post();

				$new_item->is_mega_menu = true;
				$new_item->menu_item_parent = $item->ID;
				$new_item->cat_id = $megadropdown_menu_cat; // category id
				$new_item->url = '';
				$new_item->title = '<div class="block_megamenu"><div class="block_megagrid">'; // open tag for mega menu
				
				$new_item->title .= ''; // render content of mega menu here
				$querypostbyCat = new WP_Query(
						array( 'cat' => $megadropdown_menu_cat)
						);
				$new_item->title .= $this->render_inner($querypostbyCat->posts);
				$new_item->title .= '</div></div>'; // close tag for mega menu
				$items_buff[] = $new_item;
			}
		}
		// print_r($items_buff);
		return $items_buff;
	}

	function generate_post() {
        $post = new stdClass;
        $post->ID = '0';
        $post->post_author = '';
        $post->post_date = '';
        $post->post_date_gmt = '';
        $post->post_password = '';
        $post->post_type = '';
        $post->post_status = 'publish';
        $post->to_ping = '';
        $post->pinged = '';
        $post->comment_status = '';
        $post->ping_status = '';
        $post->post_pingback = '';
        //$post->post_category = '';
        $post->page_template = 'default';
        $post->post_parent = 0;
        $post->menu_order = 0;
        return new WP_Post($post);
    }
     /**
      * render post
      */
    // function render_post($atts, $content = null){

    // }
    function render_inner($posts){
    	$buff = '';
    	if(!empty($posts)) {
    		$buff .= '<div class="megamenu-row">';
    		foreach ($posts as $post) {
    			$buff .= '<div class="megamenu-span">';
    			$buff .= '<a href="'. $this->get_href($post) .'">';
    			$buff .= $post->post_title;
    			$buff .= $this->image_post($post);
    			$buff .= '</a>';
    			$buff .= '</div>';
    		}
    		$buff .= '</div>';
    	}
    	return $buff;
    }

    function image_post($post){
    	$thumbs='';
    	if( has_post_thumbnail( $post->ID) ){

            $thumbs = get_the_post_thumbnail( $post->ID );
    	}else{
    		$thumbs = '';
    	}
    	return $thumbs;
    }

    function get_href($post){
    	$url='';
    	return $url=esc_url(get_permalink($post->ID));
    }
}

// instatiate plugin's class
new megadropdown();

// add custom field to admin menu panel
include_once('edit_custom_walker.php');

// front end menu generates here!
include_once('custom_walker.php');

