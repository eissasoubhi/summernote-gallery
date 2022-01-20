import GalleryPlugin from './Module'

var gallery_plugin = new GalleryPlugin();

// add the plugin to summernote
$.extend($.summernote.plugins, gallery_plugin.getPlugin());