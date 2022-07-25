/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/Module/DataManager.ts":
/*!***********************************!*\
  !*** ./src/Module/DataManager.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _EventManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EventManager */ "./src/Module/EventManager.ts");
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

var DataManager = /** @class */ (function () {
    function DataManager(options) {
        this.options = __assign({
            // full http url for fetching data
            url: null,
            // array of objects with 'src' and 'title' keys
            data: [],
            // the key name that holds the data array
            responseDataKey: 'data',
            // the key name that holds the next page link
            nextPageKey: 'links.next',
        }, options);
        this.init();
    }
    DataManager.prototype.init = function () {
        this.current_page = 0;
        this.is_fetching_locked = false;
        this.event = new _EventManager__WEBPACK_IMPORTED_MODULE_0__["default"]();
        this.fetch_url = this.options.url;
        this.fetch_type = this.options.data.length ? 'data' : (this.fetch_url ? 'url' : null);
    };
    // stop data fetching if neither next page link nor data were found
    DataManager.prototype.setNextFetch = function (response) {
        if (response.next_link && response.data.length) {
            this.fetch_url = response.next_link;
        }
        else {
            this.lockFetching();
        }
    };
    DataManager.prototype.lockFetching = function () {
        this.is_fetching_locked = true;
    };
    DataManager.prototype.unlockFetching = function () {
        this.is_fetching_locked = false;
    };
    // get a key from object with dot notation, example: data.key.subkey.
    DataManager.prototype.getObjectKeyByString = function (object, dotted_key, default_val) {
        var value = dotted_key.split('.').reduce(function (item, i) {
            return item ? item[i] : {};
        }, object);
        if (typeof default_val == 'undefined') {
            default_val = value;
        }
        return value && !$.isEmptyObject(value) ? value : default_val;
    };
    DataManager.prototype.parseResponse = function (response) {
        return {
            data: this.getObjectKeyByString(response, this.options.responseDataKey, []),
            next_link: this.getObjectKeyByString(response, this.options.nextPageKey, null)
        };
    };
    DataManager.prototype.fetchData = function () {
        var _this = this;
        if (this.fetch_type == 'data') {
            this.event.trigger('beforeFetch');
            this.event.trigger('fetch', [_this.options.data]);
            this.event.trigger('afterFetch');
        }
        else if (this.fetch_type == 'url') {
            // Prevent simultaneous requests.
            // Because we need to get the next page link from each request,
            // they must be synchronous.
            if (this.is_fetching_locked)
                return;
            var current_link_1 = _this.fetch_url;
            this.event.trigger('beforeFetch');
            this.lockFetching();
            $.ajax({
                url: current_link_1,
                beforeSend: function (xhr) {
                    // set the request link to get it afterwards in the response
                    xhr.request_link = current_link_1;
                },
            })
                .always(function () {
                // this is the first callback to be called when the request finises
                _this.unlockFetching();
            })
                .done(function (response, status_text, xhr) {
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
                .fail(function () {
                _this.event.trigger('error', ["problem loading from " + current_link_1]);
            })
                .always(function () {
                _this.event.trigger('afterFetch');
            });
        }
        else {
            _this.event.trigger('error', ["options 'data' or 'url' must be set"]);
        }
    };
    DataManager.prototype.fetchNext = function () {
        if (this.fetch_type == 'url') {
            this.fetchData();
        }
    };
    return DataManager;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DataManager);


/***/ }),

/***/ "./src/Module/EventManager.ts":
/*!************************************!*\
  !*** ./src/Module/EventManager.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var EventManager = /** @class */ (function () {
    function EventManager() {
        // events store
        this.events_queue = {};
    }
    // Register an event
    EventManager.prototype.on = function (event_name, closure) {
        // @ts-ignore
        if (!Array.isArray(this.events_queue[event_name])) {
            // @ts-ignore
            this.events_queue[event_name] = [];
        }
        // @ts-ignore
        this.events_queue[event_name].push(closure);
        return this;
    };
    // Fire an event
    EventManager.prototype.trigger = function (event_name, params) {
        if (params === void 0) { params = []; }
        // @ts-ignore
        var events = this.events_queue[event_name] || [];
        for (var i = 0; i < events.length; i++) {
            events[i].apply(this, params);
        }
        return this;
    };
    EventManager.prototype.clearAll = function () {
        this.events_queue = {};
        return this;
    };
    return EventManager;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (EventManager);


/***/ }),

/***/ "./src/Module/GalleryModal.ts":
/*!************************************!*\
  !*** ./src/Module/GalleryModal.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _EventManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./EventManager */ "./src/Module/EventManager.ts");

var GalleryModal = /** @class */ (function () {
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
        this.event = new _EventManager__WEBPACK_IMPORTED_MODULE_0__["default"]();
        this.template = this.getModalTemplate();
        this.$modal = $(this.template).hide();
        // class to add to image when selected
        this.select_class = "selected-img";
        this.addStyleToDom();
        this.setOptions();
        this.attachEvents();
    }
    GalleryModal.prototype.setOptions = function () {
        this.$modal.find('.modal-body').css('max-height', this.options.maxHeight);
        this.$modal.find('.modal-title').html(this.options.title);
        this.$modal.find('#close').html(this.options.close_text);
        this.$modal.find('#save').html(this.options.ok_text);
        this.$modal.find('#select-all').html(this.options.selectAll_text);
        this.$modal.find('#deselect-all').html(this.options.deselectAll_text);
    };
    // append images to the modal with data object
    GalleryModal.prototype.addImages = function (data, page) {
        var $page_images = this.createImages(data, page);
        var $images_list = this.$modal.find('.images-list');
        if ($images_list.find('.img-item').length) {
            this.$modal.find('.images-list').append($page_images);
        }
        else {
            this.$modal.find('.images-list').html($page_images);
        }
    };
    // generate image elements from data object
    GalleryModal.prototype.createImages = function (data, page) {
        var _this = this;
        var content = [];
        for (var i = 0; i < data.length; i++) {
            var $image = $('<img class="img-thumbnail sng-image" title="' + data[i].title + '" data-page="' + page + '"/>');
            $image.get(0).onload = function () {
                $(this).siblings('.loading').hide();
                $(this).click(function (event) {
                    $(this).toggleClass(_this.select_class);
                });
            };
            $image.attr('src', data[i].src);
            var $item = $('<div class="col-md-2 mb-4 img-item">'
                + '<i class="fa fa-check"></i>'
                + '<span class="loading">'
                + '<i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i>'
                + '</span>'
                + '</div>');
            $item.prepend($image);
            content.push($item);
        }
        return content;
    };
    GalleryModal.prototype.showError = function (message_text, permanent) {
        if (permanent === void 0) { permanent = false; }
        var $message = this.$modal.find('.message');
        $message.html('<span class="alert alert-danger">' + message_text + '</span>');
        if (!permanent) {
            setTimeout(function () {
                $message.html('');
            }, 5000);
        }
    };
    GalleryModal.prototype.showLoading = function () {
        this.$modal.find('.modal-footer .loading').show();
    };
    GalleryModal.prototype.hideLoading = function () {
        this.$modal.find('.modal-footer .loading').hide();
    };
    GalleryModal.prototype.attachEvents = function () {
        var _this = this;
        var $modal = this.$modal;
        var $modal_body = $modal.find('.modal-body');
        $modal.find("button#save").click(function (event) {
            var $selected_img = $modal.find('.img-item img.' + _this.select_class);
            if (!$selected_img.length) {
                _this.showError(_this.options.noImageSelected_msg);
                return;
            }
            $modal.modal('hide');
            _this.event.trigger('beforeSave', [_this]);
            $selected_img.each(function (index, el) {
                _this.event.trigger('save', [_this, $(this)]);
                $(this).removeClass(_this.select_class);
            });
            _this.event.trigger('afterSave', [this]);
        });
        $modal.on('hidden.bs.modal', function () {
            _this.event.trigger('close');
        });
        $modal.find("button#select-all").click(function (event) {
            $modal.find('img').addClass(_this.select_class);
        });
        $modal.find("button#deselect-all").click(function (event) {
            $modal.find('img').removeClass(_this.select_class);
        });
        $modal_body.scroll(function () {
            var $images_list = $modal.find('.images-list');
            var is_near_bottom = $modal_body.scrollTop() + $modal_body.height() >= $images_list.height() - 100;
            if (is_near_bottom) {
                _this.event.trigger('scrollBottom', [_this]);
            }
        });
    };
    GalleryModal.prototype.open = function () {
        this.$modal.modal();
    };
    GalleryModal.prototype.clearContent = function () {
        // Reset the initial html
        this.$modal.find('.images-list').html('');
    };
    // whether the images' container has enough content to show the vertical scroll
    GalleryModal.prototype.imagesContainerHasScroll = function () {
        var $images_container = this.$modal.find('.modal-body');
        var $images_list = $images_container.find('.images-list');
        return parseInt($images_list.height()) > parseInt($images_container.height());
    };
    GalleryModal.prototype.getModalTemplate = function () {
        var bootsrap_version = parseInt($.fn.modal.Constructor.VERSION);
        var header_content = [
            '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>',
            '<h4 class="modal-title">[gallery title]</h4>'
        ];
        var modal_html = '' +
            '<div class="modal summernote-gallery fade" tabindex="-1" role="dialog">'
            + '<div class="modal-lg modal-dialog ">'
            + '<div class="modal-content">'
            + '<div class="modal-header">'
            + (bootsrap_version == 3 ? header_content.join('') : header_content.reverse().join(''))
            + '</div>'
            + '<div class="modal-body">'
            + '<div class="row images-list">'
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
    };
    GalleryModal.prototype.addStyleToDom = function () {
        this.$css = $('<style>'
            + '.img-item{'
            + 'position : relative;'
            + '}'
            + '.img-item .fa-check{'
            + 'position : absolute;'
            + 'top : -10px;'
            + 'right : 5px;'
            + 'font-size: 30px;'
            + 'color: #337AB7;'
            + '}'
            + '.img-item .sng-image{'
            /*+'min-height : 119.66px;'*/
            + '}'
            + '.img-item .loading{'
            + 'position: absolute;'
            + 'margin: auto;'
            + 'top: -20px;'
            + 'bottom: 0;'
            + 'display: block;'
            + 'left: 0;'
            + 'right: 0;'
            + 'width: 60px;'
            + 'height: 42px;'
            + 'text-align: center;'
            + '}'
            + '.modal.summernote-gallery .message{'
            + 'display: block;'
            + 'padding: 30px 0 20px 0;'
            + '}'
            + '.modal.summernote-gallery .message:empty{'
            + 'display: block;'
            + 'padding: 0px!important;'
            + '}'
            + '.modal.summernote-gallery .modal-body{'
            + 'overflow: scroll;'
            + '}'
            + '.img-item .fa-check{'
            + 'display : none;'
            + '}'
            + '.img-item .' + this.select_class + ' + .fa-check{'
            + 'display : block;'
            + '}'
            + '.' + this.select_class + '{'
            + 'background-color: #5CB85C;'
            + '}'
            + '</style>');
        this.$css.appendTo('body');
    };
    return GalleryModal;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GalleryModal);


/***/ }),

/***/ "./src/Module/SummernoteGallery.ts":
/*!*****************************************!*\
  !*** ./src/Module/SummernoteGallery.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _GalleryModal__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GalleryModal */ "./src/Module/GalleryModal.ts");
/* harmony import */ var _DataManager__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./DataManager */ "./src/Module/DataManager.ts");


var SummernoteGallery = /** @class */ (function () {
    function SummernoteGallery(options) {
        this.options = $.extend({
            name: 'summernoteGallery',
            buttonLabel: '<i class="fa fa-file-image-o"></i> SN Gallery',
            tooltip: 'summernote gallery'
        }, options);
        this.plugin_default_options = {};
    }
    // set the focus to the last focused element in the editor
    SummernoteGallery.prototype.recoverEditorFocus = function () {
        var last_focused_el = $(this.editor).data('last_focused_element');
        if (typeof last_focused_el !== "undefined") {
            var editor = this.editable;
            var range = document.createRange();
            var sel = window.getSelection();
            var cursor_position = last_focused_el.length;
            range.setStart(last_focused_el, cursor_position);
            range.collapse(true);
            sel.removeAllRanges();
            sel.addRange(range);
            editor.focus();
        }
    };
    SummernoteGallery.prototype.saveLastFocusedElement = function () {
        var focused_element = window.getSelection().focusNode;
        var parent = $(this.editable).get(0);
        if ($.contains(parent, focused_element)) {
            $(this.editor).data('last_focused_element', focused_element);
        }
    };
    SummernoteGallery.prototype.attachEditorEvents = function () {
        var _this = this;
        $(this.editable).on('keypress, mousemove', function () {
            _this.saveLastFocusedElement();
        });
        $(this.editable).on('click', 'summernote-gallery-brick .delete', function () {
            // delete brick
        });
        $(this.editable).on('click', 'summernote-gallery-brick .edit', function () {
            var $brick = $(this).parents('summernote-gallery-brick');
            var data = $brick.data('brick'); // json
            _this.modal.open(data);
        });
    };
    SummernoteGallery.prototype.initGallery = function (context) {
        this.context = context;
        this.editor = this.context.layoutInfo.note;
        this.editable = this.context.layoutInfo.editable;
        this.plugin_options = $.extend(this.plugin_default_options, this.context.options[this.options.name] || {});
        this.modal = new _GalleryModal__WEBPACK_IMPORTED_MODULE_0__["default"](this.plugin_options.modal);
        this.data_manager = new _DataManager__WEBPACK_IMPORTED_MODULE_1__["default"](this.plugin_options.source);
        this.attachModalEvents();
        this.attachEditorEvents();
    };
    SummernoteGallery.prototype.attachModalEvents = function () {
        var _this = this;
        this.modal.event.on('beforeSave', function (gallery_modal) {
            _this.recoverEditorFocus();
        });
        this.modal.event.on('save', function (gallery_modal, $image) {
            // add selected images to summernote editor
            _this.context.invoke('editor.pasteHTML', '<img src="' + $image.attr('src') + '" alt="' + ($image.attr('alt') || "") + '" />');
        });
        this.modal.event.on('scrollBottom', function (gallery_modal) {
            if (_this.modal.options.loadOnScroll) {
                _this.data_manager.fetchNext();
            }
        });
        this.modal.event.on('close', function (gallery_modal) {
            _this.data_manager.init();
            _this.modal.clearContent();
        });
    };
    SummernoteGallery.prototype.createButton = function () {
        var _this = this;
        var button = $.summernote.ui.button({
            className: 'w-100',
            contents: this.options.buttonLabel,
            tooltip: this.options.tooltip,
            click: function () {
                _this.openGallery();
            }
        });
        // create jQuery object from button instance.
        return button.render();
    };
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
                    // The loadOnScroll won't work if the images' container doesn't have the scroll displayed,
                    // so we need to keep loading the images until the scroll shows.
                    _this.data_manager.fetchNext();
                }
            }, 2000);
        })
            .on('afterFetch', function () {
            _this.modal.hideLoading();
        })
            .on('error', function (error) {
            _this.modal.showError(error, true);
        });
    };
    SummernoteGallery.prototype.openGallery = function () {
        this.attachDataEvents();
        this.data_manager.fetchData();
        this.modal.open();
    };
    return SummernoteGallery;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (SummernoteGallery);


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*****************************!*\
  !*** ./src/Module/index.ts ***!
  \*****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _SummernoteGallery__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SummernoteGallery */ "./src/Module/SummernoteGallery.ts");

var GalleryPlugin = /** @class */ (function () {
    function GalleryPlugin(options) {
        this.summernote_gallery = new _SummernoteGallery__WEBPACK_IMPORTED_MODULE_0__["default"](options);
    }
    GalleryPlugin.prototype.getPlugin = function () {
        var plugin = {};
        var _this = this;
        var options = this.summernote_gallery.options;
        // @ts-ignore
        plugin[options.name] = function (context) {
            var sgOptions = context.options[options.name] || {};
            var buttonLabel = sgOptions.buttonLabel || _this.summernote_gallery.options.buttonLabel;
            _this.summernote_gallery.options.buttonLabel = buttonLabel;
            // add gallery button
            context.memo('button.' + options.name, _this.createButton());
            this.events = {
                'summernote.keyup': function (we, e) {
                    _this.summernote_gallery.saveLastFocusedElement();
                }
            };
            this.initialize = function () {
                _this.summernote_gallery.initGallery(context);
            };
        };
        return plugin;
    };
    GalleryPlugin.prototype.createButton = function () {
        return this.summernote_gallery.createButton();
    };
    return GalleryPlugin;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (GalleryPlugin);

})();

/******/ })()
;
//# sourceMappingURL=index.js.map