import BrickTemplateRenderer from "../templates/brickTemplate";
import GalleryDataInterface from "../Interfaces/GalleryDataInterface";
import GalleryModalOptionsInterface from "../Interfaces/GalleryModalOptionsInterface";
import BrickCreatingModeAbstract from "snb-components/src/Module/ModalModes/BrickCreatingModeAbstract";
import GalleryModalModeInterface from "../Interfaces/GalleryModalModeInterface";

export default class GalleryCreatingMode extends BrickCreatingModeAbstract implements GalleryModalModeInterface{

    getModalLoadData(modalOptions: GalleryModalOptionsInterface): GalleryDataInterface {
        return {
            brickIdentifier: `brick_${Date.now()}`,
            selectedImages: []
        }
    }

    getBrickStyleTemplate(data: GalleryDataInterface): JSX.Element|void {
        // no style
    }

    getBrickTemplate(data: GalleryDataInterface): JSX.Element {
        return BrickTemplateRenderer(data)
    }
}