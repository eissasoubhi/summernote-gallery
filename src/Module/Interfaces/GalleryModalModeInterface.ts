import GalleryDataInterface from "./GalleryDataInterface";
import GalleryModalOptionsInterface from "./GalleryModalOptionsInterface";

export default interface GalleryModalModeInterface {

    save(data: GalleryDataInterface): void

    getModalLoadData(modalOptions: GalleryModalOptionsInterface): GalleryDataInterface
}