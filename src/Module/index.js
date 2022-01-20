import SummernoteGallery from './SummernoteGallery'

export default class GalleryPlugin {
    constructor(options) {
        this.summernote_gallery = new SummernoteGallery(options);
    }

    getPlugin() {
        let plugin = {};
        let _this = this;
        let options = this.summernote_gallery.options

        plugin[options.name] = function(context) {

            let buttonLabel = context.options[options.name]?.buttonLabel || _this.summernote_gallery.options.buttonLabel

            _this.summernote_gallery.options.buttonLabel = buttonLabel

            // add gallery button
            context.memo('button.' + options.name, _this.createButton());

            this.events = {
                'summernote.keyup': function(we, e)
                {
                    _this.summernote_gallery.saveLastFocusedElement();
                }
            };

            this.initialize = function() {
                console.log('initialize')
                _this.summernote_gallery.initGallery(context);
            };
        }

        return plugin;
    }

    createButton() {
        return this.summernote_gallery.createButton();
    }
}