import * as React from "react"; // for JSX rendering
import GalleryDataSourceInterface from "../Interfaces/GalleryDataSourceInterface";
import GalleryModalOptionsInterface from "../Interfaces/GalleryModalOptionsInterface";
import GalleryDataInterface from "../Interfaces/GalleryDataInterface";
import GalleryImageInterface from "../Interfaces/GalleryImageInterface";

export default (dataSource: GalleryDataSourceInterface, options: GalleryModalOptionsInterface, brickData: GalleryDataInterface) => {

    const images = dataSource.images.map(({ id, url, title }: GalleryImageInterface) => {
        const isCurrentImageSelected = !!brickData.selectedImages.find(img => img.id == id)
        const selectedClassName = isCurrentImageSelected ? options.selectClassName : ''

        return (
            <div className="col-md-2 mb-4 img-item" key={`img_${Date.now()}`}>
                <img className={`img-thumbnail sng-image ${selectedClassName}`} src={url} title={title} alt={title} data-id={id} />
                <i className="fa fa-check"/>
                <span className="loading">
                    <i className="fa fa-spinner fa-pulse fa-3x fa-fw"/>
                </span>
            </div>
        )
    })

    return <React.Fragment>{ images }</React.Fragment>

}

