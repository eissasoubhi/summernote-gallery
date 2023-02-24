import SummernotePlugin from './Module'
import extensions from './Extensions'

const summernotePlugin = new SummernotePlugin('summernoteGallery', extensions);

// add the plugin to summernote
$.extend(($ as any).summernote.plugins, summernotePlugin.getPlugin());