(function(factory)
{
    /* global define */
    if (typeof define === 'function' && define.amd)
    {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    }
    else if (typeof module === 'object' && module.exports)
    {
        // Node/CommonJS
        module.exports = factory(require('jquery'));
    }
    else
    {
        // Browser globals
        factory(window.jQuery);
    }
}(function($)
{
    var EventManager = CreateEventManagerClass();
    var GalleryModal = CreateGalleryModalClass();
    var SummernoteGallery = CreateSummernoteGalleryClass();
    var GalleryDataManager = CreateGalleryDataManagerClass();

    var summernote_gallery = new SummernoteGallery({
        name: 'gallery',
        tooltip: 'Gallery',
    });

    // add the plugin to summernote
    $.extend($.summernote.plugins, summernote_gallery.getPlugin());

/************************************** EventManager ***************************************/
function CreateEventManagerClass() {
    function EventManager() {
        // events store
        this.events_queue = {};

        // Register an event
        EventManager.prototype.on = function (event_name, closure) {
            if (! Array.isArray(this.events_queue[event_name]) ) {
                this.events_queue[event_name] = [];
            }

            this.events_queue[event_name].push(closure);

            return this;
        }

        // Fire an event
        EventManager.prototype.trigger = function (event_name, params) {
            var events = this.events_queue[event_name] || [];

            for (var i = 0; i < events.length; i++) {
                events[i].apply(this, params);
            }

            return this;
        }

        EventManager.prototype.clearAll = function () {
            this.events_queue = {};

            return this;
        }
    }

    return EventManager;
}

/************************************** GalleryDataManager ***************************************/
function CreateGalleryDataManagerClass() {
    function GalleryDataManager(options) {
        this.options = $.extend({
            // full http url for fetching data
            url: null,

            // array of objects with 'src' and 'title' keys
            data: [],

            // the key name that holds the data array
            responseDataKey: 'data',

            // the key name that holds the next page link
            nextPageKey: 'links.next',
        }, options);

        this.current_page = 0;
        this.is_fetching_locked = false;
        this.event = new EventManager();
        this.fetch_url = this.options.url;
        this.fetch_type = this.options.data.length ? 'data' : (this.fetch_url ? 'url' : null);
    }

    // stop data fetching if neither next page link nor data were found
    GalleryDataManager.prototype.setNextFetch = function (response) {
        if (response.next_link && response.data.length) {
            this.fetch_url = response.next_link;
        } else {
            this.lockFetching();
        }
    }

    GalleryDataManager.prototype.lockFetching = function () {
        this.is_fetching_locked = true;
    }

    GalleryDataManager.prototype.unlockFetching = function () {
        this.is_fetching_locked = false;
    }

    // get a key from object with dot notation, example: data.key.subkey.
    GalleryDataManager.prototype.getObjectKeyByString = function (object, dotted_key, default_val) {
        value = dotted_key.split('.').reduce(function (item, i) {
            return item ? item[i] : {};
        }, object);

        if (typeof default_val == 'undefined') {
            default_val = value;
        }

        return value && !$.isEmptyObject(value) ? value : default_val;
    }

    GalleryDataManager.prototype.parseResponse = function (response) {

        return {
            data: this.getObjectKeyByString(response, this.options.responseDataKey, []),
            next_link: this.getObjectKeyByString(response, this.options.nextPageKey, null)
        };
    }

    GalleryDataManager.prototype.fetchData = function () {
        var _this = this;

        if (this.fetch_type == 'data') {

            this.event.trigger('beforeFetch');
            this.event.trigger('fetch', [_this.options.data]);
            this.event.trigger('afterFetch');

        } else if (this.fetch_type == 'url') {

            // Prevent simultaneous requests.
            // Because we need to get the next page link from each request,
            // they must be synchronous.
            if (this.is_fetching_locked) return;

            var current_link = _this.fetch_url;

            this.event.trigger('beforeFetch');

            this.lockFetching();

            $.ajax({
                url: current_link,
                beforeSend:function(xhr){
                    // set the request link to get it afterwards in the response
                    xhr.request_link = current_link;
                },
            })
            .always(function () {
                // this is the first callback to be called when the request finishs
                _this.unlockFetching();
            })
            .done(function(response, status_text, xhr){
                var parsed_response = _this.parseResponse(response);
                _this.current_page++;

                //
                _this.setNextFetch(parsed_response);

                _this.event.trigger('fetch', [
                    parsed_response.data,
                    _this.current_page,
                    xhr.request_link,
                    parsed_response.next_link
                ]);
            })
            .fail(function() {
                _this.event.trigger('error', ["problem loading from " + url]);
            })
            .always(function () {
                _this.event.trigger('afterFetch');
            });

        } else {
            _this.event.trigger('error', ["options 'data' or 'url' must be set"]);
        }
    }

    GalleryDataManager.prototype.fetchNext = function () {
        if (this.fetch_type == 'url') {
            this.fetchData();
        }
    }

    return GalleryDataManager;
}

/************************************** GalleryModal ***************************************/
function CreateGalleryModalClass() {
    function GalleryModal(options) {
        this.options = $.extend({
            // load more data on modal scroll
            loadOnScroll: false,

            // modal max height
            maxHeight: 500,

            // modal title
            title: 'summernote image gallery',

            // close button text
            close_text: 'Close',

            // save button text
            ok_text: 'Add',

            // select all button text
            selectAll_text: 'Select all',

            // deselect all button text
            deselectAll_text: 'Deselect all',

            // message error to display when no image is selected
            noImageSelected_msg: 'One image at least must be selected.'
        }, options);

        this.event = new EventManager();

        this.template = this.getModalTemplate();
        this.$modal = $(this.template).hide();

        // class to add to image when selected
        this.select_class = "selected-img";

        this.addStyleToDom();
        this.setOptions();

        this.attachEvents();
    }

    GalleryModal.prototype.setOptions = function() {
        this.$modal.find('.modal-body').css('max-height', this.options.maxHeight);
        this.$modal.find('.modal-title').html(this.options.title);
        this.$modal.find('#close').html(this.options.close_text);
        this.$modal.find('#save').html(this.options.ok_text);
        this.$modal.find('#select-all').html(this.options.selectAll_text);
        this.$modal.find('#deselect-all').html(this.options.deselectAll_text);
    }

    // append images to the modal with data object
    GalleryModal.prototype.addImages = function(data, page) {

        var page_images = this.createImages(data, page);
        var $images_list = this.$modal.find('.images-list');

        if ($images_list.find('.img-item').length) {
            this.$modal.find('.images-list').append(page_images);
        } else {
            this.$modal.find('.images-list').html(page_images);
        }
    }

    // generate image elements from data object
    GalleryModal.prototype.createImages = function(data, page) {
        var attributes = page ? 'class="page-content" data-page"' + page + '"' : '';
        var $content = $('<div ' + attributes + '></div>');
        var _this = this;

        for (var i = 0; i < data.length; i++) {

            $image = $('<img class="col-md-12 thumbnail" title="'+ data[i].title +'"/>');

            $image.get(0).onload = function(){
                $(this).click(function(event) {
                    $(this).toggleClass(_this.select_class);
                });
            }

            $image.attr('src', data[i].src);

            var $item = $('<div class="col-md-2 img-item">'
                            +'<i class="fa fa-check"></i>'
                        +'</div>');

            $item.prepend($image);
            $content.append($item)
        }

        return $content;
    }

    GalleryModal.prototype.showError = function (message_text, permanent) {
        var $message = this.$modal.find('.message');

        $message.html('<span class="alert alert-danger">' + message_text + '</span>');

        if (!permanent) {
            setTimeout(function () {
                $message.html('');
            }, 5000);
        }
    }

    GalleryModal.prototype.showLoading = function () {
        this.$modal.find('.modal-footer .loading').show();
    }

    GalleryModal.prototype.hideLoading = function () {
        this.$modal.find('.modal-footer .loading').hide();
    }

    GalleryModal.prototype.attachEvents = function() {
        var _this = this;
        var $modal = this.$modal;
        var $modal_body = $modal.find('.modal-body');

        $modal.find("button#save").click(function(event) {
            var $selected_img = $modal.find('.img-item img.' + _this.select_class);

            if (! $selected_img.length) {
                _this.showError(_this.options.noImageSelected_msg);
                return;
            }

            $modal.modal('hide')

            _this.event.trigger('beforeSave', [_this]);

            $selected_img.each(function(index, el) {
                _this.event.trigger('save', [_this, $(this)]);

                $(this).removeClass(_this.select_class);
            });

            _this.event.trigger('afterSave', [this]);
        });

        $modal.on('hidden.bs.modal', function () {
            _this.event.trigger('close')
        })

        $modal.find("button#select-all").click(function(event) {
            $modal.find('img').addClass(_this.select_class);
        });

        $modal.find("button#deselect-all").click(function(event) {
            $modal.find('img').removeClass(_this.select_class);
        });

        $modal_body.scroll(function() {
            var $images_list = $modal.find('.images-list');
            var is_near_bottom = $modal_body.scrollTop() + $modal_body.height() >= $images_list.height() - 100;

            if (is_near_bottom) {
                _this.event.trigger('scrollBottom', [_this]);
            }
        });
    }

    GalleryModal.prototype.open = function() {
        this.$modal.modal();
    }

    GalleryModal.prototype.clearContent = function() {
        // Reset the initial html
        this.$modal.find('.images-list').html('<p class="col-md-12 text-muted" >Loading...</p>');
    }

    // whether the images container has enough content to show the vertical scroll
    GalleryModal.prototype.imagesContainerHasScroll = function() {
        var $images_container = this.$modal.find('.modal-body');
        var $images_list = $images_container.find('.images-list');

        return $images_container.height() != $images_list.height();
    }

    GalleryModal.prototype.getModalTemplate = function() {

        var bootsrap_version = parseInt($.fn.modal.Constructor.VERSION);
        var header_content = [
            '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>',
            '<h4 class="modal-title">[gallery title]</h4>'
        ];

        var modal_html = ''+
            '<div class="modal summernote-gallery fade" tabindex="-1" role="dialog">'
                + '<div class="modal-lg modal-dialog ">'
                    + '<div class="modal-content">'
                        + '<div class="modal-header">'
                            + (bootsrap_version == 3 ? header_content.join('') : header_content.reverse().join(''))
                        + '</div>'
                        + '<div class="modal-body">'
                            + '<div class="row images-list">'
                                + '<p class="col-md-12 text-muted" >Loading...</p>'
                            + '</div>'
                        + '</div>'
                        + '<div class="modal-footer">'
                            + '<span style="display: none;position: absolute;left: 10px;bottom: 10px;" class="loading" >'
                                + '<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>'
                            + '</span >'
                            + '<span style="display: inline-block; margin-right: 50px;">'
                                + '<button type="button" id="deselect-all" class="btn btn-default">[Deselect-all]</button>'
                                + '<button type="button" id="select-all" class="btn btn-default">[select-all]</button>'
                            + '</span >'
                            + '<button type="button" id="close" class="btn btn-default" data-dismiss="modal">[Close]</button>'
                            + '<button type="button" id="save" class="btn btn-primary">[Add]</button>'
                            + '<span class="message" ></span >'
                        + '</div>'
                    + '</div>'
                + '</div>'
            + '</div>';

        return modal_html;
    }

    GalleryModal.prototype.addStyleToDom = function() {
        this.$css = $('<style>'
                        +'.img-item{'
                            +'position : relative;'
                        +'}'
                        +'.img-item .fa-check{'
                            +'position : absolute;'
                            +'top : -10px;'
                            +'right : 5px;'
                            +'font-size: 30px;'
                            +'color: #337AB7;'
                        +'}'
                        +'.modal.summernote-gallery .message{'
                            +'display: block;'
                            +'padding: 30px 0 20px 0;'
                        +'}'
                        +'.modal.summernote-gallery .message:empty{'
                            +'display: block;'
                            +'padding: 0px!important;'
                        +'}'
                        +'.modal.summernote-gallery .modal-body{'
                            +'overflow: scroll;'
                        +'}'
                        +'.img-item .fa-check{'
                            +'display : none;'
                        +'}'
                        +'.img-item .'+ this.select_class +' + .fa-check{'
                            +'display : block;'
                        +'}'
                        +'.'+ this.select_class +'{'
                            +'background-color: #5CB85C;'
                        +'}'
                    +'</style>');
        this.$css.appendTo('body');
    }

    return GalleryModal;
}

/************************************** SummernoteGallery ***************************************/
function CreateSummernoteGalleryClass () {
    function SummernoteGallery(options) {
        this.options = $.extend({
            name: 'summernote-gallery',
            button_label: '<i class="fa fa-file-image-o"></i>',
            tooltip: 'summernote gallery'
        }, options);

        this.event = new EventManager();

        this.plugin_default_options = {}
    }

    SummernoteGallery.prototype.getPlugin = function () {
        var _this = this;
        var plugin = {};

        plugin[this.options.name] = function(context) {

            // add gallery button
            context.memo('button.' + _this.options.name, _this.createButton());

            this.events = {
                'summernote.keyup': function(we, e)
                {
                    _this.saveLastFocusedElement();
                }
            };

            this.initialize = function() {
                _this.initGallery(context);
            };
        }

        return plugin;
    }

    // set the focus to the last focused element in the editor
    SummernoteGallery.prototype.recoverEditorFocus = function () {
        var last_focused_el = $(this.editor).data('last_focused_element');
        if(typeof last_focused_el !== "undefined")
        {
            var editor = this.editable;
            var range = document.createRange();
            var sel = window.getSelection();
            var cursor_position =  last_focused_el.length;

            range.setStart(last_focused_el, cursor_position);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
            editor.focus();
        }
    }

    SummernoteGallery.prototype.saveLastFocusedElement = function() {
        var focused_element = window.getSelection().focusNode;
        var parent = $(this.editable).get(0);
        if ($.contains(parent, focused_element))
        {
            $(this.editor).data('last_focused_element', focused_element)
        };
    }

    SummernoteGallery.prototype.attachEditorEvents = function () {
        var _this = this;

        $(this.editable).on('keypress, mousemove', function() {
            _this.saveLastFocusedElement();
        })
    }

    SummernoteGallery.prototype.initGallery = function (context) {
        this.context = context;
        this.editor = this.context.layoutInfo.note;
        this.editable = this.context.layoutInfo.editable;
        this.plugin_options = $.extend(
            this.plugin_default_options,
            this.context.options[this.options.name] || {}
        );

        this.modal = new GalleryModal(this.plugin_options.modal);
        this.data_manager = new GalleryDataManager(this.plugin_options.source);

        this.attachModalEvents();
        this.attachDataEvents();
        this.attachEditorEvents();
    }

    SummernoteGallery.prototype.attachModalEvents = function() {
        var _this = this;

        this.modal.event.on('beforeSave', function (gallery_modal) {
            _this.recoverEditorFocus();
        });

        this.modal.event.on('save', function (gallery_modal, $image) {
            // add selected images to summernote editor
            _this.context.invoke(
                'editor.pasteHTML',
                '<img src="' + $image.attr('src') + '" alt="' + ($image.attr('alt') || "") + '" />'
            );
        });

        this.modal.event.on('scrollBottom', function (gallery_modal) {
            if (_this.modal.options.loadOnScroll) {
                _this.data_manager.fetchNext();
            }
        });

        this.modal.event.on('close', function (gallery_modal) {
            _this.data_manager.event.clearAll();
            _this.modal.clearContent();
        });
    }

    SummernoteGallery.prototype.createButton = function() {
        var _this = this;

        var button = $.summernote.ui.button({
            contents: this.options.button_label,
            tooltip: this.options.tooltip,
            click: function() {
                _this.openGallery();
            }
        });

        // create jQuery object from button instance.
        $gallery = button.render();
        return $gallery;
    }

    SummernoteGallery.prototype.attachDataEvents = function () {
        var _this = this;

        this.data_manager.event
        .on('beforeFetch', function () {
            _this.modal.showLoading();
        })
        .on('fetch', function (data, page, link) {
            _this.modal.addImages(data, page);

            setTimeout(function () {
                if (_this.modal.options.loadOnScroll && !_this.modal.imagesContainerHasScroll()) {
                    // The loadOnScroll wont work if the images container doesn't have the scroll displayed,
                    // so we need to keep loading the images until the scroll shows.
                    _this.data_manager.fetchNext();
                }
            }, 2000)
        })
        .on('afterFetch', function () {
            _this.modal.hideLoading();
        })
        .on('error', function (error) {
            _this.modal.showError(error, true);
        });
    }

    SummernoteGallery.prototype.openGallery = function () {
        this.data_manager.fetchData();
        this.modal.open();
    }

    return SummernoteGallery;
}
}));
