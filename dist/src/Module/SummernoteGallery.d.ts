export declare class SummernoteGallery {
    private options;
    private plugin_default_options;
    private editor;
    private editable;
    private context;
    private plugin_options;
    private modal;
    private data_manager;
    constructor(options: any);
    recoverEditorFocus(): void;
    saveLastFocusedElement(): void;
    attachEditorEvents(): void;
    initGallery(context: any): void;
    attachModalEvents(): void;
    createButton(): any;
    attachDataEvents(): void;
    openGallery(): void;
}
