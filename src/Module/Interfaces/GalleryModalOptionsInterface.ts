import ModalOptionsInterface from "snb-components/src/Module/Interfaces/Modal/ModalOptionsInterface";

export default interface GalleryModalOptionsInterface extends ModalOptionsInterface {
    // load more data on modal scroll
    loadOnScroll: boolean,

    // modal height
    height: number,

    // modal title
    title: string,

    // close button text
    closeText: string,

    // save button text
    saveText: string,

    // select all button text
    selectAllText: string,

    // deselect all button text
    deselectAllText: string,

    // the html element class containing the modal messages
    messageContainerClass: string,

    // the class added to the selected image on the modal
    selectClassName: string,

    // validation rules
    validations: {
        selectedImages: {
            required: {
                message: string
            }
        }
    }
}