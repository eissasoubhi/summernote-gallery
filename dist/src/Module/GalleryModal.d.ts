/// <reference types="jquery" />
/// <reference types="summernote" />
export declare class GalleryModal {
    private $css;
    private readonly select_class;
    private event;
    private template;
    private readonly $modal;
    private options;
    constructor(options: any);
    setOptions(): void;
    addImages(data: any, page: any): void;
    createImages(data: any, page: any): JQuery<HTMLElement>[];
    showError(message_text: any, permanent?: any): void;
    showLoading(): void;
    hideLoading(): void;
    attachEvents(): void;
    open(): void;
    clearContent(): void;
    imagesContainerHasScroll(): boolean;
    getModalTemplate(): string;
    addStyleToDom(): void;
}
