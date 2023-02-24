import PageAbstract from "snb-components/src/PageAbstract";
import GalleryPluginOptionsInterface from "./Interfaces/GalleryPluginOptionsInterface";
import RenderModalStyleTemplate from './styles/modalStyle'
import Utils from "snb-components/src/Utils";

export default class Page extends PageAbstract {
    private options: GalleryPluginOptionsInterface;

    constructor(options: GalleryPluginOptionsInterface) {
        super();
        this.options = options
    }

    getStyles(): HTMLElement | HTMLElement[] {
        return [
            Utils.JSXElementToHTMLElement( RenderModalStyleTemplate(this.options.modal) )[0]
        ]
    }

    getScripts(): HTMLElement | HTMLElement[] {
        return [];
    }
}