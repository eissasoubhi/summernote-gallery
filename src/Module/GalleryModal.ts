import ModalAbstract from "snb-components/src/Module/ModalAbstract";
import RenderModalTemplate from './templates/modalTemplate'
import RenderModalImagesTemplate from './templates/modalImagesTemplate'
import ModalInterface from 'snb-components/src/Module/Interfaces/Modal/ModalInterface'
import EventsAwareInterface from 'snb-components/src/Module/Interfaces/EventsAwareInterface'
import GalleryDataInterface from "./Interfaces/GalleryDataInterface";
import GalleryModalOptionsInterface from './Interfaces/GalleryModalOptionsInterface'
import MessageFactoriesProvider from "snb-components/src/MessageFactoriesProvider";
import GalleryDataSourceInterface from './Interfaces/GalleryDataSourceInterface'
import Utils from "snb-components/src/Utils";
import GalleryModalModeInterface from "./Interfaces/GalleryModalModeInterface"
import ModalModeInterface from "snb-components/src/Module/Interfaces/Modal/ModalModeInterface";

export default class GalleryModal extends ModalAbstract implements ModalInterface, EventsAwareInterface{
    public options: GalleryModalOptionsInterface
    public mode: GalleryModalModeInterface

    constructor(mode: ModalModeInterface, messagesFactoriesProvider: MessageFactoriesProvider, options: GalleryModalOptionsInterface) {
        super(mode, messagesFactoriesProvider, options)
    }

    getSaveButton(): JQuery {
        return this.getBsModal().find("button#save")
    }

    getData(): GalleryDataInterface {
        return {
            brickIdentifier: `brick_${Date.now()}`,
            selectedImages: this.getBody().find('.img-item img.' + this.options.selectClassName).map((i, img) => {
                return {
                    id: $(img).data('id'),
                    title: $(img).attr('title'),
                    url: $(img).attr('src'),
                }
            }).toArray()
        }
    }

    getBody(): JQuery {
        return this.getBsModal().find('.modal-body')
    }

    getImagesList(): JQuery {
        return this.getBsModal().find('.images-list')
    }

    getMessagesContainer(): JQuery {
        return this.getBsModal().find(`.${this.options.messageContainerClass}`)
    }

    getTemplate(data: GalleryDataInterface, options: GalleryModalOptionsInterface): JSX.Element {
        return RenderModalTemplate(data, options)
    }

    showLoading () {
        this.getBsModal().find('.modal-footer .loading').show();
    }

    hideLoading () {
        this.getBsModal().find('.modal-footer .loading').hide();
    }

    // append images to the modal with data object
    addImages(data: GalleryDataSourceInterface) {
        const _this = this
        const imagesTpl = Utils.JSXElementToHTMLElement(
            RenderModalImagesTemplate(data, this.options, this.mode.getModalLoadData(this.options)
        ))

        imagesTpl.map(container => {
            const $img = $(container).find('img')

            $img.get(0).onload = function() {
                $(this).siblings('.loading').hide()
                $(this).on('click', function(event) {
                    $(this).toggleClass(_this.options.selectClassName);
                });
            }
        })

        this.getImagesList().append(imagesTpl);
    }

    // whether the images' container has enough content to show the vertical scroll
    imagesContainerHasScroll() {
        return Math.floor(this.getImagesList().height()) > Math.floor(this.getBody().height());
    }

    resetContent() {
        // Reset the initial html
        this.getImagesList().html('');
    }

    attachEvents() {
        super.attachEvents();
        const $modal = this.getBsModal()

        $modal.on('hidden.bs.modal', () => {
            this.resetContent();
            this.trigger('close')
            $modal.remove();
        })

        $modal.find("button#select-all").on('click', () => {
            $modal.find('img').addClass(this.options.selectClassName);
        });

        $modal.find("button#deselect-all").on('click',() => {
            this.getBsModal().find('img').removeClass(this.options.selectClassName);
        });

        this.getBody().on('scroll',() => {
            const isNearBottom = this.getBody().scrollTop() + this.getBody().height() >= this.getImagesList().height() - 100;

            if (isNearBottom) {
                this.trigger('scrollBottom', {galleryModal: this});
            }
        });
    }
}