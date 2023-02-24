// for JSX rendering
import * as React from "react";
import GalleryModalOptionsInterface from "../Interfaces/GalleryModalOptionsInterface";

export default (options: GalleryModalOptionsInterface) => {

    return (
        <style>
            {`
                .img-item{
                    position : relative;
                }
                .img-item .fa-check{
                    position : absolute;
                    top : -10px;
                    right : 5px;
                    font-size: 30px;
                    color: #337AB7;
                }
                .img-item .loading{
                    position: absolute;
                    margin: auto;
                    top: -20px;
                    bottom: 0;
                    display: block;
                    left: 0;
                    right: 0;
                    width: 60px;
                    height: 42px;
                    text-align: center;
                }
                .modal.summernote-gallery .message{
                    display: block;
                    padding: 30px 0 20px 0;
                }
                .modal.summernote-gallery .message:empty{
                    display: block;
                    padding: 0px!important;
                }
                .modal.summernote-gallery .modal-body{
                    overflow: scroll;
                }
                .img-item .fa-check{
                    display : none;
                }
                .img-item .${options.selectClassName} + .fa-check{
                    display : block;
                }
                .${options.selectClassName} {
                    background-color: #5CB85C;
                }
            `}
        </style>
    )
}