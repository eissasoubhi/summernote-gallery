import DataInterface from "snb-components/src/Module/Interfaces/DataInterface";
import GalleryImageInterface from "./GalleryImageInterface";

export default interface GalleryDataInterface extends DataInterface{
    selectedImages: GalleryImageInterface[],
}