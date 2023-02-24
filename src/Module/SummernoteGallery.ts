import Editor from "snb-components/src/Editor"
import GalleryModal from './GalleryModal'
import EditableBrick from "snb-components/src/Module/EditableBrick"
import GalleryCreatingMode from "./ModalModes/GalleryCreatingMode"
import SummernoteBrickInterface from 'snb-components/src/Module/Interfaces//SummernoteBrickInterface'
import SummernotePluginInterface from 'snb-components/src/Module/Interfaces//Plugin/SummernotePluginInterface'
import GalleryPluginOptionsInterface from "./Interfaces/GalleryPluginOptionsInterface";
import GalleryEditingMode from "./ModalModes/GalleryEditingMode";
import ExtensionsManager from "snb-components/src/ExtensionsManager";
import ExtensibleBrickInterface from "snb-components/src/Module/Interfaces/ExtensibleBrickInterface";
import SnbExtensionInterface from "snb-components/src/Module/Interfaces/SnbExtensionInterface";
import GalleryMessageFactoriesProvider from "./Messages/GalleryMessageFactoriesProvider";
import LineBreakManager from "snb-components/src/LineBreak/LineBreakManager";
import DataManager from "snb-components/src/Module/DataManager";
import GalleryModalOptionsInterface from "./Interfaces/GalleryModalOptionsInterface";
import Page from "./Page";
import GalleryModalModeInterface from "./Interfaces/GalleryModalModeInterface";
import GalleryImageInterface from "./Interfaces/GalleryImageInterface";

export default class SummernoteGallery implements SummernoteBrickInterface, SummernotePluginInterface, ExtensibleBrickInterface {
    private pluginOptions: GalleryPluginOptionsInterface;
    private readonly pluginName: string;
    public editor: Editor;
    private extensionsManager: ExtensionsManager;
    private readonly extensions: SnbExtensionInterface[];
    private linebreakManager: LineBreakManager;
    private page: Page;

    constructor(pluginName: string, extensions: SnbExtensionInterface[]) {
        this.pluginName = pluginName

        this.extensions = extensions

        this.extensionsManager = new ExtensionsManager()
    }

    init(context: any): void {
        this.pluginOptions = $.extend(true, this.defaultOptions(), context.options[this.pluginName])
        this.editor = new Editor(context)
        this.linebreakManager = new LineBreakManager(this.editor)
        this.page = new Page(this.pluginOptions)
        this.page.init()

        this.attachEditorEvents();

        this.addOptionsExtensions()

        this.extensionsManager.triggerEvent('onInit', [this.editor])
    }

    attachEditorEvents() {
        this.editor.on('brick-editing', (brick: HTMLElement) => {
            this.openModal(new GalleryEditingMode(brick, this.editor) )
        })

        this.editor.on('brick-removed', (brick: HTMLElement) => {
            const editableBrick = new EditableBrick(brick, {
                editableBrickClass: this.editor.editableBrickClass,
            })

            const blankLineIdentifier = editableBrick.getBrickData().brickIdentifier

            this.linebreakManager.removeBlankLinebreak(blankLineIdentifier)
        })
    }

    attachModalEvents(modal: GalleryModal, dataManager: DataManager) {

        modal.on('beforeSave',  () => {
            this.editor.recoverEditorFocus();
        });

        modal.on('scrollBottom', () => {
            if (modal.options.loadOnScroll) {
                dataManager.fetchNext();
            }
        });

        modal.on('close', () => {
            dataManager.init();
        });
    }

    attachDataEvents(modal: GalleryModal, dataManager: DataManager) {
        dataManager.on('beforeFetch', () => {
            modal.showLoading();
        })
        .on('fetch', ({ data }: { data: GalleryImageInterface[] }) => {

            modal.addImages({
                images: data
            });

            setTimeout (() => {
                if (modal.options.loadOnScroll && !modal.imagesContainerHasScroll()) {
                    // The loadOnScroll won't work if the images' container doesn't have the scroll displayed,
                    // so we need to keep loading the images until the scroll shows.
                    dataManager.fetchNext();
                }
            }, 2000)
        })
        .on('afterFetch', () => {
            modal.hideLoading();
        })
        .on('error', ({ error }: { error: string }) => {
            modal.showErrors([error]);
        });
    }

    addOptionsExtensions(): void {
        const optionsExtensions: string[] = this.pluginOptions.extensions || [
            ''
        ]
        const indexedExtensions: { [key: string]: SnbExtensionInterface } = {}

        for (let i = 0; i < this.extensions.length; i++) {
            indexedExtensions[this.extensions[i].name] = this.extensions[i]
        }

        for (let i = 0; i < optionsExtensions.length; i++) {
            const optionsExtension = optionsExtensions[i]

            if (typeof indexedExtensions[optionsExtension] !== 'undefined') {
                this.use(indexedExtensions[optionsExtension])
            } else {
                console.error(`"${optionsExtension}" is an invalid extension name`)
            }
        }
    }

    openModal(mode: GalleryModalModeInterface) {
        let modal = new GalleryModal(mode, new GalleryMessageFactoriesProvider(), this.pluginOptions.modal)
        let dataManager = new DataManager(this.pluginOptions.source);
        this.attachModalEvents(modal, dataManager)
        this.attachDataEvents(modal, dataManager)

        dataManager.fetchData()
        modal.open()
    }

    createButton():JQueryStatic {
        let button = ($ as any).summernote.ui.button({
            className: 'w-100',
            contents: this.pluginOptions.buttonLabel,
            tooltip: this.pluginOptions.tooltip,
            click: () => {
                this.openModal(new GalleryCreatingMode(this.editor) )
            }
        });

        // create jQuery object from button instance.
        return button.render();
    }

    use(extension: SnbExtensionInterface): void {
        this.extensionsManager.add(extension)
    }

    defaultOptions(): GalleryPluginOptionsInterface {
        return {
            modal: this.getModalDefaultOptions(),

            source: null,

            buttonLabel: '<i class="fa fa-file-image-o"></i> SN Gallery',

            tooltip: 'Summernote Gallery',

            extensions: []
        }
    }

    getModalDefaultOptions(): GalleryModalOptionsInterface {
        return {

            // load more data on modal scroll
            loadOnScroll: false,

            // modal height
            height: 500,

            // modal title
            title: 'summernote image gallery',

            // close button text
            closeText: 'Close',

            // save button text
            saveText: 'Add',

            // select all button text
            selectAllText: 'Select all',

            // deselect all button text
            deselectAllText: 'Deselect all',

            // the html element class containing the modal messages
            messageContainerClass: 'snb-modal-message',

            // the class added to the selected image on the modal
            selectClassName: 'selected-img',

            // data validations
            validations: {
                selectedImages: {
                    required: {
                        message: 'At least one image must be selected!'
                    }
                }
            }
        }
    }
 }