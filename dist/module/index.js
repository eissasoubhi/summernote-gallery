!function(t,e){"object"==typeof exports&&"object"==typeof module?module.exports=e():"function"==typeof define&&define.amd?define([],e):"object"==typeof exports?exports.module=e():t.module=e()}(self,(()=>(()=>{"use strict";var t={d:(e,o)=>{for(var n in o)t.o(o,n)&&!t.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:o[n]})},o:(t,e)=>Object.prototype.hasOwnProperty.call(t,e),r:t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})}},e={};t.r(e),t.d(e,{default:()=>l});const o=function(){function t(){this.eventsQueue={}}return t.prototype.on=function(t,e){return Array.isArray(this.eventsQueue[t])||(this.eventsQueue[t]=[]),this.eventsQueue[t].push(e),this},t.prototype.trigger=function(t,e){void 0===e&&(e={});for(var o=this.eventsQueue[t]||[],n=0;n<o.length;n++)o[n].apply(null,[e]);return this},t.prototype.clearAll=function(){return this.eventsQueue={},this},t}(),n=function(){function t(t){this.options=$.extend({loadOnScroll:!1,maxHeight:500,title:"summernote image gallery",close_text:"Close",ok_text:"Add",selectAll_text:"Select all",deselectAll_text:"Deselect all",noImageSelected_msg:"One image at least must be selected."},t),this.event=new o,this.template=this.getModalTemplate(),this.$modal=$(this.template).hide(),this.select_class="selected-img",this.addStyleToDom(),this.setOptions(),this.attachEvents()}return t.prototype.setOptions=function(){this.$modal.find(".modal-body").css("max-height",this.options.maxHeight),this.$modal.find(".modal-title").html(this.options.title),this.$modal.find("#close").html(this.options.close_text),this.$modal.find("#save").html(this.options.ok_text),this.$modal.find("#select-all").html(this.options.selectAll_text),this.$modal.find("#deselect-all").html(this.options.deselectAll_text)},t.prototype.addImages=function(t,e){var o=this.createImages(t,e);this.$modal.find(".images-list").find(".img-item").length?this.$modal.find(".images-list").append(o):this.$modal.find(".images-list").html(o)},t.prototype.createImages=function(t,e){for(var o=this,n=[],i=0;i<t.length;i++){var s=$('<img class="img-thumbnail sng-image" title="'+t[i].title+'" data-page="'+e+'"/>');s.get(0).onload=function(){$(this).siblings(".loading").hide(),$(this).click((function(t){$(this).toggleClass(o.select_class)}))},s.attr("src",t[i].src);var a=$('<div class="col-md-2 mb-4 img-item"><i class="fa fa-check"></i><span class="loading"><i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i></span></div>');a.prepend(s),n.push(a)}return n},t.prototype.showError=function(t,e){void 0===e&&(e=!1);var o=this.$modal.find(".message");o.html('<span class="alert alert-danger">'+t+"</span>"),e||setTimeout((function(){o.html("")}),5e3)},t.prototype.showLoading=function(){this.$modal.find(".modal-footer .loading").show()},t.prototype.hideLoading=function(){this.$modal.find(".modal-footer .loading").hide()},t.prototype.attachEvents=function(){var t=this,e=this.$modal,o=e.find(".modal-body");e.find("button#save").click((function(o){var n=e.find(".img-item img."+t.select_class);n.length?(e.modal("hide"),t.event.trigger("beforeSave",[t]),n.each((function(e,o){t.event.trigger("save",[t,$(this)]),$(this).removeClass(t.select_class)})),t.event.trigger("afterSave",[this])):t.showError(t.options.noImageSelected_msg)})),e.on("hidden.bs.modal",(function(){t.event.trigger("close")})),e.find("button#select-all").click((function(o){e.find("img").addClass(t.select_class)})),e.find("button#deselect-all").click((function(o){e.find("img").removeClass(t.select_class)})),o.scroll((function(){var n=e.find(".images-list");o.scrollTop()+o.height()>=n.height()-100&&t.event.trigger("scrollBottom",[t])}))},t.prototype.open=function(){this.$modal.modal()},t.prototype.clearContent=function(){this.$modal.find(".images-list").html("")},t.prototype.imagesContainerHasScroll=function(){var t=this.$modal.find(".modal-body"),e=t.find(".images-list");return parseInt(e.height())>parseInt(t.height())},t.prototype.getModalTemplate=function(){var t=['<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>','<h4 class="modal-title">[gallery title]</h4>'];return'<div class="modal summernote-gallery fade" tabindex="-1" role="dialog"><div class="modal-lg modal-dialog "><div class="modal-content"><div class="modal-header">'+(3==parseInt($.fn.modal.Constructor.VERSION)?t.join(""):t.reverse().join(""))+'</div><div class="modal-body"><div class="row images-list"></div></div><div class="modal-footer"><span style="display: none;position: absolute;left: 10px;bottom: 10px;" class="loading" ><i class="fa fa-spinner fa-pulse fa-3x fa-fw"></i></span ><span style="display: inline-block; margin-right: 50px;"><button type="button" id="deselect-all" class="btn btn-default">[Deselect-all]</button><button type="button" id="select-all" class="btn btn-default">[select-all]</button></span ><button type="button" id="close" class="btn btn-default" data-dismiss="modal">[Close]</button><button type="button" id="save" class="btn btn-primary">[Add]</button><span class="message" ></span ></div></div></div></div>'},t.prototype.addStyleToDom=function(){this.$css=$("<style>.img-item{position : relative;}.img-item .fa-check{position : absolute;top : -10px;right : 5px;font-size: 30px;color: #337AB7;}.img-item .sng-image{}.img-item .loading{position: absolute;margin: auto;top: -20px;bottom: 0;display: block;left: 0;right: 0;width: 60px;height: 42px;text-align: center;}.modal.summernote-gallery .message{display: block;padding: 30px 0 20px 0;}.modal.summernote-gallery .message:empty{display: block;padding: 0px!important;}.modal.summernote-gallery .modal-body{overflow: scroll;}.img-item .fa-check{display : none;}.img-item ."+this.select_class+" + .fa-check{display : block;}."+this.select_class+"{background-color: #5CB85C;}</style>"),this.$css.appendTo("body")},t}();var i=function(){return i=Object.assign||function(t){for(var e,o=1,n=arguments.length;o<n;o++)for(var i in e=arguments[o])Object.prototype.hasOwnProperty.call(e,i)&&(t[i]=e[i]);return t},i.apply(this,arguments)};const s=function(){function t(t){this.options=i({url:"",data:[],responseDataKey:"data",nextPageKey:"links.next"},t),this.init()}return t.prototype.init=function(){var t,e;this.current_page=0,this.is_fetching_locked=!1,this.event=new o,this.fetch_url=this.options.url,this.fetch_type=(null===(e=null===(t=this.options)||void 0===t?void 0:t.data)||void 0===e?void 0:e.length)?"data":this.fetch_url?"url":""},t.prototype.setNextFetch=function(t){t.next_link&&t.data.length?this.fetch_url=t.next_link:this.lockFetching()},t.prototype.lockFetching=function(){this.is_fetching_locked=!0},t.prototype.unlockFetching=function(){this.is_fetching_locked=!1},t.prototype.getObjectKeyByString=function(t,e,o){var n=e.split(".").reduce((function(t,e){return t?t[e]:{}}),t);return void 0===o&&(o=n),n&&!$.isEmptyObject(n)?n:o},t.prototype.parseResponse=function(t){return{data:this.getObjectKeyByString(t,this.options.responseDataKey,[]),next_link:this.getObjectKeyByString(t,this.options.nextPageKey,null)}},t.prototype.fetchData=function(){var t=this;if("data"==this.fetch_type)this.event.trigger("beforeFetch"),this.event.trigger("fetch",[t.options.data]),this.event.trigger("afterFetch");else if("url"==this.fetch_type){if(this.is_fetching_locked)return;var e=t.fetch_url;this.event.trigger("beforeFetch"),this.lockFetching(),$.ajax({url:e,beforeSend:function(t){t.request_link=e}}).always((function(){t.unlockFetching()})).done((function(e,o,n){var i=t.parseResponse(e);t.current_page++,t.setNextFetch(i),console.log("parsed_response",i),t.event.trigger("fetch",[i.data,t.current_page,n.request_link,i.next_link])})).fail((function(){t.event.trigger("error",["problem loading from "+e])})).always((function(){t.event.trigger("afterFetch")}))}else t.event.trigger("error",["options 'data' or 'url' must be set"])},t.prototype.fetchNext=function(){"url"==this.fetch_type&&this.fetchData()},t}(),a=function(){function t(t){this.options=$.extend({name:"summernoteGallery",buttonLabel:'<i class="fa fa-file-image-o"></i> SN Gallery',tooltip:"summernote gallery"},t),this.plugin_default_options={}}return t.prototype.recoverEditorFocus=function(){var t=$(this.editor).data("last_focused_element");if(void 0!==t){var e=this.editable,o=document.createRange(),n=window.getSelection(),i=t.length;o.setStart(t,i),o.collapse(!0),n.removeAllRanges(),n.addRange(o),e.focus()}},t.prototype.saveLastFocusedElement=function(){var t=window.getSelection().focusNode,e=$(this.editable).get(0);$.contains(e,t)&&$(this.editor).data("last_focused_element",t)},t.prototype.attachEditorEvents=function(){var t=this;$(this.editable).on("keypress, mousemove",(function(){t.saveLastFocusedElement()})),$(this.editable).on("click","summernote-gallery-brick .delete",(function(){})),$(this.editable).on("click","summernote-gallery-brick .edit",(function(){var e=$(this).parents("summernote-gallery-brick").data("brick");t.modal.open(e)}))},t.prototype.initGallery=function(t){this.context=t,this.editor=this.context.layoutInfo.note,this.editable=this.context.layoutInfo.editable,this.plugin_options=$.extend(this.plugin_default_options,this.context.options[this.options.name]||{}),this.modal=new n(this.plugin_options.modal),this.data_manager=new s(this.plugin_options.source),this.attachModalEvents(),this.attachEditorEvents()},t.prototype.attachModalEvents=function(){var t=this;this.modal.event.on("beforeSave",(function(e){t.recoverEditorFocus()})),this.modal.event.on("save",(function(e,o){t.context.invoke("editor.pasteHTML",'<img src="'+o.attr("src")+'" alt="'+(o.attr("alt")||"")+'" />')})),this.modal.event.on("scrollBottom",(function(e){t.modal.options.loadOnScroll&&t.data_manager.fetchNext()})),this.modal.event.on("close",(function(e){t.data_manager.init(),t.modal.clearContent()}))},t.prototype.createButton=function(){var t=this;return $.summernote.ui.button({className:"w-100",contents:this.options.buttonLabel,tooltip:this.options.tooltip,click:function(){t.openGallery()}}).render()},t.prototype.attachDataEvents=function(){var t=this;this.data_manager.event.on("beforeFetch",(function(){t.modal.showLoading()})).on("fetch",(function(e,o,n){console.log("data",e),t.modal.addImages(e,o),setTimeout((function(){t.modal.options.loadOnScroll&&!t.modal.imagesContainerHasScroll()&&t.data_manager.fetchNext()}),2e3)})).on("afterFetch",(function(){t.modal.hideLoading()})).on("error",(function(e){t.modal.showError(e,!0)}))},t.prototype.openGallery=function(){this.attachDataEvents(),this.data_manager.fetchData(),this.modal.open()},t}(),l=function(){function t(t){this.summernote_gallery=new a(t)}return t.prototype.getPlugin=function(){var t={},e=this,o=this.summernote_gallery.options;return t[o.name]=function(t){var n=(t.options[o.name]||{}).buttonLabel||e.summernote_gallery.options.buttonLabel;e.summernote_gallery.options.buttonLabel=n,t.memo("button."+o.name,e.createButton()),this.events={"summernote.keyup":function(t,o){e.summernote_gallery.saveLastFocusedElement()}},this.initialize=function(){e.summernote_gallery.initGallery(t)}},t},t.prototype.createButton=function(){return this.summernote_gallery.createButton()},t}();return e})()));
//# sourceMappingURL=index.js.map