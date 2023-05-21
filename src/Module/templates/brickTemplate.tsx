import * as React from "react"; // for JSX rendering
import GalleryDataInterface from "../Interfaces/GalleryDataInterface";

export default (data: GalleryDataInterface) => {
   const images = data.selectedImages.map(({ url, title }: {url: string, title: string}) => {
       return <img src={url} title={title} alt={title} key={`img_${Date.now()}`} />
    })

    return <div data-brickdata={JSON.stringify(data)} id={data.brickIdentifier}>{ images }</div>
}

