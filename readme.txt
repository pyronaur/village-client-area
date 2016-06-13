=== Plugin Name ===
Contributors: justnorris
Tags: client-area, photography, customer-area,
Requires at least: 4.0
Tested up to: 4.3.1
Stable tag: 1.1.5
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

A client area plugin for Photographers


== Description ==
Village Client Area allows you to easily create password protected galleries where you can upload images form your photoshoots in a gallery and share the link with your client.
You can also password protect your client galleries to make sure only they see their images.

*At the moment, for full functionality, Village Client Area relies on ( but does not require ): Advanced Custom Fields Pro and Redux Framework.*

**Quick feature list:**

* Password Protection
* Public Client gallery list with quick search (optional)
* Image Proofing
* Gallery discussions ( commenting on galleries )
* "Themeable" Plugin API



**A plugin designed for the working photographer:**

This plugin comes with an intuitive image proofing that lets your client mark the images that he/she really likes and a comment area where you and your client can discuss the images.
Village Client Area uses a custom post type that allows you to easily create and manage your client galleries.
There is also a Quick Search option if you decide to create a public page where you display all of your client area galleries (only the featured images and titles are visible, the images themselves can be password protected).


== Installation ==

This section describes how to install the plugin and get it working.

1. Upload `village-client-area` to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress



== Changelog ==
= 1.1.5 =
* Added option to display file names or image titles for all images

= 1.1.4 =
* Fully functional translatable "village-ca" text-domain. ( Last time I'm changing text-domain related code, promise )

= 1.1.3 =
* Load 'village-area' textdomain


= 1.1.2 =
* Change text-domain from 'village' to 'village-area'
* Improve i18n functions
* Add WordPress Filters:
	* 'village_client_area/acf_settings'
	* 'village_client_area/acf_settings_featured'
	* 'village_client_area/post_type'


= 1.1.1 =
* Fix: Selecting/Deselecting AJAX Loaded entries


= 1.1.0 =
* Fix: add Wordpress 4.4 compitability


= 1.0.8 =
* Added WP Filter: 'client.previewPosition'


= 1.0.5 =
* Added WP Hooks: 'client.filters/init' and 'client.filters/destroy'


= 1.0.3 =
* Mintor improvements
* Updated changelog, readme


= 1.0 =
* Initial Release
