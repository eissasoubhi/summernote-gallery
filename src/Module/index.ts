import SummernoteGallery from './SummernoteGallery'
import SnbExtensionInterface from "snb-components/src/Module/Interfaces/SnbExtensionInterface";

export default class SummernotePlugin {
    private summernoteGallery: SummernoteGallery;
    private readonly name: string;
    
    constructor(name: string, extensions: SnbExtensionInterface[] = []) {
        this.name = name
        this.summernoteGallery = new SummernoteGallery(this.name, extensions);
    }

    getPlugin(): object {
        let plugin: any = {};
        let _this = this;

        plugin[this.name] = function(context: any) {

            _this.summernoteGallery.init(context);

            context.memo('button.' + _this.name, _this.createButton());

            this.events = {
                'summernote.keyup': function(we: any, e: any)
                {
                    _this.summernoteGallery.editor.saveLastFocusedElement();
                }
            };

            this.initialize = function() {

            };
        }

        return plugin;
    }

    createButton(): JQueryStatic {
        return this.summernoteGallery.createButton();
    }
}