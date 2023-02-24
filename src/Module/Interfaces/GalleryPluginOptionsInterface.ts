import GalleryModalOptionsInterface from "./GalleryModalOptionsInterface";
import SummernotePluginOptionsInterface from "snb-components/src/Module/Interfaces/Plugin/SummernotePluginOptionsInterface";
import DataManagerOptionsInterface from "snb-components/types/Module/Interfaces/DataManagerOptionsInterface";

export default interface GalleryPluginOptionsInterface extends SummernotePluginOptionsInterface{
    modal?: GalleryModalOptionsInterface,
    source: DataManagerOptionsInterface
}