import * as React from "react"; // for JSX rendering
import GalleryDataInterface from "../Interfaces/GalleryDataInterface";
import GalleryModalOptionsInterface from '../Interfaces/GalleryModalOptionsInterface'

export default (data: GalleryDataInterface, options: GalleryModalOptionsInterface) => {

    const bootstrapVersion = parseInt(($.fn as any).modal.Constructor.VERSION);
    const closeButton = <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
    const modalTitle = <h4 className="modal-title">{options.title}</h4>

    return (
        <div className="modal summernote-gallery fade" tabIndex={-1} role="dialog">
            <div className="modal-lg modal-dialog ">
                <div className="modal-content">
                    <div className="modal-header">
                        { bootstrapVersion == 3 ? closeButton : modalTitle}
                        { bootstrapVersion == 3 ? modalTitle : closeButton}
                    </div>
                    <div className="modal-body" style={{height: options.height}}>
                        <div className="row images-list">
                        {/*  images will be added here  */}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <span style={{display: 'none',position: 'absolute',left: '10px',bottom: '10px'}} className="loading" >
                            <i className="fa fa-spinner fa-pulse fa-3x fa-fw"/>
                        </span >
                        <span style={{display: 'inline-block', marginRight: '50px'}}>
                            <button type="button" id="select-all" className="btn btn-default">{options.selectAllText}</button>
                            <button type="button" id="deselect-all" className="btn btn-default">{options.deselectAllText}</button>
                        </span >
                        <button type="button" id="close" className="btn btn-default" data-dismiss="modal">{options.closeText}</button>
                        <button type="button" id="save" className="btn btn-primary">{options.saveText}</button>
                    </div>
                    <div className={options.messageContainerClass}>
                        {/*  messages will be added here  */}
                    </div>
                </div>
            </div>
        </div>
    )
}

