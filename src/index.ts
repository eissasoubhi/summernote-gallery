import GalleryPlugin from './Module'

var gallery_plugin = new GalleryPlugin({});

// add the plugin to summernote
$.extend(($ as any).summernote.plugins, gallery_plugin.getPlugin());