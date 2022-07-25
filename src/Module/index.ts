import SummernoteGallery from './SummernoteGallery'

export default class GalleryPlugin {
    protected summernote_gallery: any
    constructor(options: any) {
        this.summernote_gallery = new SummernoteGallery(options);
    }

    getPlugin() {
        let plugin = {};
        let _this = this;
        let options = this.summernote_gallery.options

        // @ts-ignore
        plugin[options.name] = function(context) {

            let sgOptions = context.options[options.name] || {}
            let buttonLabel = sgOptions.buttonLabel || _this.summernote_gallery.options.buttonLabel

            _this.summernote_gallery.options.buttonLabel = buttonLabel

            // add gallery button
            context.memo('button.' + options.name, _this.createButton());

            this.events = {
                'summernote.keyup': function(we: any, e: any)
                {
                    _this.summernote_gallery.saveLastFocusedElement();
                }
            };

            this.initialize = function() {
                _this.summernote_gallery.initGallery(context);
            };
        }

        return plugin;
    }

    createButton() {
        return this.summernote_gallery.createButton();
    }
}