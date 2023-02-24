import BrickTemplateRenderer from "../templates/brickTemplate";
import GalleryDataInterface from "../Interfaces/GalleryDataInterface";
import BrickEditingModeAbstract from "snb-components/src/Module/ModalModes/BrickEditingModeAbstract";
import GalleryModalOptionsInterface from "../Interfaces/GalleryModalOptionsInterface";

export default class GalleryEditingMode extends BrickEditingModeAbstract {

    getBrickTemplate(data: GalleryDataInterface): JSX.Element {
        return BrickTemplateRenderer(data);
    }

    getModalLoadData(modalOptions: GalleryModalOptionsInterface): GalleryDataInterface {
        return super.getModalLoadData(modalOptions) as GalleryDataInterface
    }
}