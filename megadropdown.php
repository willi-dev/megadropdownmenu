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

	var $current_page = 1; // Default page number
	var $found_posts; // found_posts
	var $total_pages; // total_pages
	/**
	 * Constructor
	 */
	function __construct() {
		// add_action( 'init', array($this, 'register_menu'));

		if(is_admin()) {

			// add action for save custom field
			add_action('wp_update_nav_menu_item', array($this, 'md_update_custom_category'), 10, 3);

			// add filter for edit menu walker (admin page)
			add_filter('wp_edit_nav_menu_walker', array($this, 'md_edit_nav_menu_walker'), 10, 2);
		}

		// add filter wp nav menu objects
		add_filter('wp_nav_menu_objects', array($this, 'md_nav_menu_object'), 10, 2);

		// add action for stylesheet
		add_action('wp_enqueue_scripts', array( $this, 'load_style'));
		
		// add action for script js
		add_action('wp_enqueue_scripts', array( $this, 'load_script'));

		add_action( 'wp_ajax_nopriv_MyAjaxFunction', array($this, 'MyAjaxFunction') );
  		add_action( 'wp_ajax_MyAjaxFunction', array($this, 'MyAjaxFunction') );

   		add_action( 'wp_ajax_nopriv_getNextPage', array($this, 'getNextPage') );
   		add_action( 'wp_ajax_getNextPage', array($this, 'getNextPage') );

   		add_action( 'wp_ajax_nopriv_getPrevPage', array($this, 'getPrevPage') );
   		add_action( 'wp_ajax_getPrevPage', array($this, 'getPrevPage') );
	}
	// end of constructor 

	/**
	 * set_page
	 * function to set page number
	 * @param $pagenumber
	 * @return - 
	 */
	function set_current_page($pagenumber){
		$this->current_page = $pagenumber;
	}

	/**
	 * get_page
	 * function to get page number
	 * @param -
	 * @return $this->page
	 */
	function get_current_page(){
		return $this->current_page;
	}

	/**
	 * set_found_posts
	 * set found_posts 
	 * @param $found
	 * @return -
	 */
	function set_found_posts($found){
		$this->found_posts = $found;
	}

	/**
	 * get_found_posts
	 * get found_posts number
	 * @param - 
	 * @return $found_posts
	 */
	function get_found_posts(){
		return $this->found_posts;
	}

	/**
	 * set_total_pages
	 * set total page from [max_number_pages]
	 * @param $total
	 * @return -
	 */
	function set_total_pages($total){
		$this->total_pages = $total;
	}

	/**
	 * get_total_pages()
	 * get total pages value
	 * @param -
	 * @return $total_pages
	 */
	function get_total_pages(){
		return $this->total_pages;
	}

    /**
     * register nav menu
     *
     */
    function register_menu() {
    	register_nav_menus(
    		array(
    			'theme_location' 	=> 'primary', 
				'menu_id' 			=> 'primary-menu-megadropdown',
    			'menu' 			=> 'main',  // md_walker class for megamenu
				'walker' 		=> new md_walker, // md_walker for megamenu 
				'menu_class' 	=> 'nav navbar-nav megadropdown'
    			)
    	);
    }

	/**
	 * Load stylesheet for mega dropdown menu plugin
	 * @param -
	 */
	function load_style() {
		wp_register_style('megamenu-style', plugins_url('megadropdownmenu/css/megadropdown.css') );
		wp_enqueue_style('megamenu-style');
	}

	/**
	 * load script js / jquery for mega dropwon menu plugin
	 * @param -
	 */
	function load_script() {
		// wp_register_script('megamenu-js', plugins_url('megadropdownmenu/js/megamenuscript.js'));
		// wp_enqueue_script('megamenu-js');
		wp_enqueue_script('megamenu-js', plugins_url('megadropdownmenu/js/megamenuscript.js') , array('jquery'), '1.0', true );
		wp_localize_script( 'megamenu-js', 'ajax_script', array( 'ajaxurl' => admin_url( 'admin-ajax.php' ) ) );
	}

	/*
	 * save custom field 
	 * md_update_custom_category
	 * @param $menu_id
	 * @param $menu_item_db_id
	 * @param args
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
	 * md_edit_nav_menu_walker
	 * @param $walker
	 * @param $menu_id
	 */
	function md_edit_nav_menu_walker( $walker, $menu_id ){
		// walker_nav_menu_edit_custom from edit_custom_walker.php
		// include_once('edit_custom_walker.php');
		return 'Walker_Nav_Menu_Edit_Custom'; 
	}

	/*
	 * add mega menu support
	 * @param $items
	 * @param $args
	 * @return array
	 */
	function md_nav_menu_object($items, $args = '') {
		$items_buff = array();
		$category_key_post_meta = 'megadropdown_menu_cat';
		$posts_per_page = 4; // OR limit

		// $offset = ($this->get_page() - 1) * $posts_per_page; 
		// $offset = ($this->get_current_page() * $posts_per_page) - $posts_per_page;
		$offset = $this->get_offset($this->get_current_page(), $posts_per_page);

		// print_r($items);
		$no_item = 1;
		foreach ($items as &$item) {
			$item->is_mega_menu = false;

			$megadropdown_menu_cat = get_post_meta($item->ID, $category_key_post_meta, true);
			// echo $megadropdown_menu_cat."</br>";
			if($megadropdown_menu_cat != ''){
				$item->classes[] = 'md_menuitem';
				$item->classes[] = 'is_megamenu dropdown';

				$items_buff[] = $item;

				// generate wp post
				$new_item = $this->generate_post(); // generate menu item
				$new_item->is_mega_menu = true;
				$new_item->menu_item_parent = $item->ID;
				$new_item->cat_id = $megadropdown_menu_cat; // category id
				$new_item->no_item = $no_item;
				$new_item->url = '';

				$new_item->title = '<div class="block_megamenu block_megamenu-'.esc_attr( $megadropdown_menu_cat ).'-'.esc_attr( $no_item ).'">'; // open tag for megamenu
				$new_item->title .= '<div class="block_inner_megamenu block_inner_megamenu-'.esc_attr( $megadropdown_menu_cat ).'-'.esc_attr( $no_item ).'">'; // open tag for inner megamenu

				// query post by category
				$querypostbyCat = $this->get_posts_by_cat($megadropdown_menu_cat, $posts_per_page, $offset);

				// set found_posts
				$this->set_found_posts($querypostbyCat->found_posts);
				// set and passing found_posts to $new_item
				$new_item->found_posts = $this->get_found_posts();
				$this->set_total_pages($querypostbyCat->max_num_pages);

				$new_item->current_page = $this->get_current_page();
				$new_item->last_page = $this->get_total_pages();

				$new_item->offset = $offset;

				$new_item->title .= '<input type="hidden" name="category_id-'.esc_attr( $no_item ).'" value="'. esc_attr( $megadropdown_menu_cat ) .'" class="category_id-'.esc_attr( $no_item ).'">';
				$new_item->title .= '<input type="hidden" name="total_pages-'.esc_attr( $no_item ).'" value="'. esc_attr( $this->get_total_pages() ) .'" class="total_pages-'.esc_attr( $no_item ).'">';
				$new_item->title .= '<input type="hidden" name="found_posts-'.esc_attr( $no_item ).'" value="'. esc_attr( $this->get_found_posts() ) .'" class="found_posts-'.esc_attr( $no_item ).'">';
				$new_item->title .= '<input type="hidden" name="posts_per_page-'.esc_attr( $no_item ).'" value="'. esc_attr( $posts_per_page ) .'" class="posts_per_page-'.esc_attr( $no_item ).'">';
				$new_item->title .= '<input type="hidden" name="current_page-'.esc_attr( $no_item ).'" value="'. esc_attr( $this->get_current_page() ) .'" class="current_page-'.esc_attr( $no_item ).'">';
				// render result query
				$new_item->title .= $this->render_inner($querypostbyCat->posts, $megadropdown_menu_cat, $no_item /*$found_posts*/);

				$new_item->title .= '</div>'; // close tag for inner megamenu
				$new_item->title .= '</div>'; // close tag for megamenu
				
				$items_buff[] = $new_item;
				// print_r($querypostbyCat);
			}else{

				$item->classes[] = 'md_menuitem';
				$item->classes[] = 'dropdown is_not_megamenu';

				$items_buff[] = $item;
				// print_r($item);
			}
			$no_item++;
		}


		// print_r($items_buff);
		return $items_buff;
	}

	/**
	 * get_posts_by_cat
	 * @param $cat
	 * @param $posts_per_page
	 * @param $offset
	 * @return WP_Query Object
	 */
	function get_posts_by_cat($cat, $posts_per_page, $offset){
		$params = array(
				'cat' => $cat,
				'posts_per_page' => $posts_per_page,
				'offset' => $offset
			);
		return new WP_Query($params);
	}

	/**
	 * get_offset
	 * get offset for pagination
	 * @param $posts_per_page
	 * @param $found_posts
	 * ($this->get_current_page() * $posts_per_page) - $posts_per_page;
	 * @return
	 */
	function get_offset($current_page, $posts_per_page){
		return ($current_page * $posts_per_page) - $posts_per_page;
	}

	/**
	 * generate_post
	 * @param -
	 * @return WP_Post()
	 */
	function generate_post() {
        $post = new stdClass;
        $post->ID = '0';
        $post->post_author = '';
        $post->post_date = '';
        $post->post_date_gmt = '';
        $post->post_password = '';
        $post->post_type = 'nav_menu_item';
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
      * render inner post
      * @param $posts
      * @return div megamenu 
      */
    function render_inner($posts, $cat_id, $no_item /*$found_posts*/){
    	$buff = '';
    	if(!empty($posts)) {
    		$buff .= '<div class="row row-'.$cat_id.'-'.$no_item.'">';
    		// $buff .= '<div class="'. $found_post .'"><a href="#">Prev</a> | <a href="#">Next</a></div>';
    		// print_r($found_post);
    		foreach ($posts as $post) {
    			$buff .= '<div class="megamenu-span col-md-3">';
    			$buff .= '<a href="'. $this->get_href($post) .'" >';
    			$buff .= ''.$post->post_title.'';
    			$buff .= $this->image_post($post);
    			$buff .= '</a>';
    			$buff .= '</div>';
    		}
    		$buff .= '</div>';
    	}
    	return $buff;
    }

    /**
     * image_post
     * @param $post
     * @return featured image of post
     */
    function image_post($post){
    	$thumbs='';
    	if( has_post_thumbnail( $post->ID) ){
            $thumbs = get_the_post_thumbnail( $post->ID , $size='', array( 'class' => 'img-responsive center-block' ) );
    	}else{
    		$thumbs = '';
    	}
    	return $thumbs;
    }

    /**
     * get_href
     * @param $post
     * @return url / href / permalink of post
     */
    function get_href($post){
    	$url='';
    	return $url = esc_url(get_permalink($post->ID));
    }

    /**
     * generate_nextprev_posts
     * generate prev/next posts in megamenu
     * @param $args
     * @return $new_posts
     */
    function generate_nextprev_posts( $args = array() ){
    	$no_item = $args['no_item'];
    	$cat_id = $args['category_id'];
    	$total_pages = $args['total_pages'];
    	$found_posts = $args['found_posts'];
    	$posts_per_page = $args['posts_per_page'];
    	$before_page = $args['current_page'];
    	$type = $args['type'];
    	// $current_page = $args['current_page'];
    	if($type == 'next'){
    		if($before_page == '1' ){
	    		$current_page = $before_page + 1;
	    	}else{
	    		if($before_page <  $total_pages){
	    			$current_page = $before_page + 1;
	    		}else{
	    			$current_page = $total_pages;
	    		}
	    	}
    	}else{
    		// if($before_page == $total_pages){
    			$current_page = $before_page - 1;
    		// }else{
    			// if($before_page )
    		// }
    	}
    	
    	$offset = $this->get_offset($current_page, $posts_per_page);

    	$query = $this->get_posts_by_cat($cat_id, $posts_per_page, $offset);

    	if( $query->have_posts() ){
    		$new_posts = '<div class="block_inner_megamenu-'.esc_attr( $cat_id ).'-'.esc_attr( $no_item ).'">';
    		$new_posts .= '<input type="hidden" name="category_id-'.esc_attr( $no_item ).'" value="'. esc_attr( $cat_id ) .'" class="category_id-'.esc_attr( $no_item ).'">';
			$new_posts .= '<input type="hidden" name="total_pages-'.esc_attr( $no_item ).'" value="'. esc_attr( $total_pages ) .'" class="total_pages-'.esc_attr( $no_item ).'">';
			$new_posts .= '<input type="hidden" name="found_posts-'.esc_attr( $no_item ).'" value="'. esc_attr( $found_posts ) .'" class="found_posts-'.esc_attr( $no_item ).'">';
			$new_posts .= '<input type="hidden" name="posts_per_page-'.esc_attr( $no_item ).'" value="'. esc_attr( $posts_per_page ) .'" class="posts_per_page-'.esc_attr( $no_item ).'">';
			$new_posts .= '<input type="hidden" name="current_page-'.esc_attr( $no_item ).'" value="'. esc_attr( $current_page ) .'" class="current_page-'.esc_attr( $no_item ).'">';
    		
    		$new_posts .= $this->render_inner($query->posts, $cat_id, $no_item /*$found_posts*/);

    		$new_posts .= '</div>';
    	} else {
    		$new_posts = '<div class="block_inner_megamenu-'.esc_attr( $cat_id ).'-'.esc_attr( $no_item ).'">';
    		$new_posts .= 'category: '.$cat_id;
    		$new_posts .= 'posts_per_page: '. $posts_per_page;
    		$new_posts .= 'offset: '.$offset;
    		$new_posts .= 'current page: '.$current_page;
    		$new_posts .= json_encode($query->posts);
    		$new_posts .= '</div>';
    	}
    	return $new_posts;
    }

    /**
     * getNextPage
     * @param -
   	 * @return -
     */
	function getNextPage(){
		$no_item = $_POST['no_item'];
		$category_id = $_POST['category_id'];
		$total_pages = $_POST['total_pages'];
		$found_posts = $_POST['found_posts'];
		$posts_per_page = $_POST['posts_per_page'];
		$current_page = $_POST['current_page'];
		$type = $_POST['type'];

		$params = array(
			'no_item' => $no_item,
			'category_id' => $category_id,
			'total_pages' => $total_pages,
			'found_posts' => $found_posts,
			'posts_per_page' => $posts_per_page,
			'current_page' => $current_page,
			'type' => $type
			);

		$results = $this->generate_nextprev_posts( $params );

		// $results = "Next Click-> total_pages ".$total_pages.", found_posts ".$found_posts.", posts_per_page ".$posts_per_page;
		die($results);
	}

	/**
	 * getPrevPage
	 * @param - 
	 * @return -
	 */
	function getPrevPage(){
		$no_item = $_POST['no_item'];
		$category_id = $_POST['category_id'];
		$total_pages = $_POST['total_pages'];
		$found_posts = $_POST['found_posts'];
		$posts_per_page = $_POST['posts_per_page'];
		$current_page = $_POST['current_page'];
		$type = $_POST['type'];

		$params = array(
			'no_item' => $no_item,
			'category_id' => $category_id,
			'total_pages' => $total_pages,
			'found_posts' => $found_posts,
			'posts_per_page' => $posts_per_page,
			'current_page' => $current_page,
			'type' => $type
			);

		$results = $this->generate_nextprev_posts( $params );
		die($results);
	}

	function MyAjaxFunction(){
		//get the data from ajax() call
		$GreetingAll = $_POST['GreetingAll'];
		$results = "<h2>".$GreetingAll."</h2>";
		// Return the String
		die($results);
	}

}

// instatiate plugin's class
new megadropdown();

// front end menu generates here!
include_once('custom_walker.php');

// add custom field to admin menu panel
include_once('edit_custom_walker.php');