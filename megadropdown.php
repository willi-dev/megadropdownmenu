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

		// add filter wp nav menu object
		// add_filter('wp_nav_menu_object', array(), 10, 2);

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

		$megadropdown_menu_cat = get_post_meta($item->ID, $category_key_post_meta, true);

		foreach ($items as &$item) {
			// $item->is_mega_menu = false;

			if($megadropdown_menu_cat != ''){
				$item->classes[] = '';
				$item->classes[] = '';
				$items_buff[] = $item;

				// generate wp post
				$new_item = $this->generate_post();


			}
		}
	}

	function generate_post() {
        $post = new stdClass;
        $post->ID = 0;
        $post->post_author = '';
        $post->post_date = '';
        $post->post_date_gmt = '';
        $post->post_password = '';
        $post->post_type = 'menu_tds';
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

}

// instatiate plugin's class
new megadropdown();

// add custom field to admin menu panel
include_once('edit_custom_walker.php');

// front end menu generates here!
include_once('custom_walker.php');

