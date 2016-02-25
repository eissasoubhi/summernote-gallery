<!-- resources/views/auth/register.blade.php -->

@extends('admin.layout')

@section('style')
<link href="{{ asset('assets/css/summernote-bs3.css') }}" rel="stylesheet">
@parent
<link href="{{ asset('assets/css/datepicker3.css') }}" rel="stylesheet">
<link href="{{ asset('assets/css/summernote.css') }}" rel="stylesheet">
<link href="{{ asset('assets/css/fileinput.min.css') }}" rel="stylesheet">
<style type="text/css">
    #map img, #mapCanvas img {
        max-width: none !important;
        box-shadow: none !important;
    }
</style>
@stop

@section('content')

<div class="row">
    <div class="col-md-12">

        <h3>{{ trans('backoffice.edit_content') }}</h3>

        <form id="formContent" method="POST" action="{{ url('/admin/contents') }}" enctype="mutipart/form-data">

            {!! csrf_field() !!}

            <!-- Set this param to resize images on server when uploading to prevent display unedited huge files -->
            <input type="hidden" name="image_max_width" value="1024" />

            <p class="text-success v-success"></p>

            <!-- Nav tabs -->
            <ul class="nav nav-tabs" role="tablist">
                <li role="presentation" class="active"><a href="#general" aria-controls="general" role="tab" data-toggle="tab">{{ trans('backoffice.general') }}</a></li>
                <li role="presentation"><a href="#seo" aria-controls="seo" role="tab" data-toggle="tab">{{ trans('backoffice.seo') }}</a></li>
                <li role="presentation"><a href="#gallery" aria-controls="gallery" role="tab" data-toggle="tab">{{ trans('backoffice.gallery') }}</a></li>
                <li role="presentation"><a href="#attachments" aria-controls="attachments" role="tab" data-toggle="tab">{{ trans('backoffice.attachments') }}</a></li>
                <li role="presentation"><a href="#event" aria-controls="event" role="tab" data-toggle="tab">{{ trans('backoffice.event') }}</a></li>
                <li role="presentation"><a href="#location" aria-controls="location" role="tab" data-toggle="tab">{{ trans('backoffice.location') }}</a></li>
                <li role="presentation"><a href="#permission" aria-controls="permission" role="tab" data-toggle="tab">{{ trans('backoffice.permission') }}</a></li>
            </ul>

            <!-- Tab panes -->
            <div class="tab-content">
                <div role="tabpanel" class="tab-pane fade in active" id="general">

                    <input type="hidden" name="id_cms_lang" value="{{ $content->id_cms_lang }}" />

                    <div class="row">
                        <div class="col-md-10">
                            <div class="form-group">
                                <label for="title">{{ trans('backoffice.title') }}</label>
                                <input class="form-control" type="text" name="title" id="title"
                                       value="{{ $content->title }}">
                                <span class="help-block alert-danger v-error-title"></span>
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="form-group">
                                <label for="title">{{ trans('backoffice.idiom') }}</label>
                                <select class="form-control" name="id_lang">
                                    @foreach($content->getAvailableLanguages() as $lang)
                                        @if($lang->id == $content->id_lang)
                                            <option selected value="{{ $lang->id }}">{{ $lang->locale }}</option>
                                        @else
                                            <option value="{{ $lang->id }}">{{ $lang->locale }}</option>
                                        @endif
                                    @endforeach
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="publish_start">{{ trans('backoffice.publish_start') }}</label>
                        <input class="form-control" type="text" name="publish_start" id="publish_start"
                               value="{{ $content->publish_start }}">
                        <span class="help-block alert-danger v-error-publish_start"></span>
                    </div>

                    <div class="form-group">
                        <label for="publish_end">{{ trans('backoffice.publish_end') }}</label>
                        <input class="form-control" type="text" name="publish_end" id="publish_end"
                               value="{{ $content->publish_end }}">
                        <span class="help-block alert-danger v-error-publish_end"></span>
                    </div>
                    <div class="form-group">
                        <label for="content">{{ trans('backoffice.content') }}</label>
                        <span class="help-block alert-danger v-error-content"></span>
                        <div id="summernote">{!! $content->content !!}</div>
                        <textarea style="display: none" name="content" id="content" rows="10">{!! $content->content !!}</textarea>
                    </div>
                </div>

                <div role="tabpanel" class="tab-pane fade" id="seo">

                    <div class="form-group">
                        <label for="seo_slug">{{ trans('backoffice.uri_slug') }}</label>
                        <input class="form-control" type="text" name="url" id="seo_slug"
                               value="{{ $content->url }}">
                        <span class="help-block alert-danger v-error-seo_slug"></span>
                    </div>

                    <div class="form-group">
                        <label for="seo_title">{{ trans('backoffice.meta_title') }}</label>
                        <input class="form-control" type="text" name="meta_title" id="seo_title"
                               value="{{ $content->meta_title }}">
                        <span class="help-block alert-danger v-error-seo_title"></span>
                    </div>

                    <div class="form-group">
                        <label for="seo_description">{{ trans('backoffice.description') }}</label>
                        <input class="form-control" type="text" name="meta_description" id="seo_description"
                               value="{{ $content->meta_description }}">
                        <span class="help-block alert-danger v-error-seo_description"></span>
                    </div>

                    <div class="form-group">
                        <label for="seo_author">{{ trans('backoffice.author') }}</label>
                        <input class="form-control" type="text" name="seo_author" id="seo_author"
                               value="{{ $content->seo_author }}">
                        <span class="help-block alert-danger v-error-seo_author"></span>
                    </div>

                    <div class="form-group">
                        <label for="seo_keywords">{{ trans('backoffice.keywords') }}</label>
                        <input class="form-control" type="text" name="meta_keywords" id="seo_keywords"
                               value="{{ $content->meta_keywords }}">
                        <span class="help-block alert-danger v-error-seo_keywords"></span>
                    </div>

                    <div class="form-group">
                        <label for="seo_image">{{ trans('backoffice.image') }}</label>
                        <input class="form-control" type="file" name="seo_image" id="seo_image" value="">
                        <span class="help-block alert-danger v-error-seo_image"></span>
                    </div>
                </div>

                <div role="tabpanel" class="tab-pane fade" id="gallery">

                    <h4>{{ trans('backoffice.current_images') }}</h4>
                    <div class="row">
                        @foreach($content->getGalleryImages() as $item)
                        <div class="col-md-2">
                            <img class="col-md-12 thumbnail" src="{{ $content->getGalleryImageUrl($item) }}" />
                            <a class="btn btn-danger delete-image" data-item="{{ $content->getGalleryImageUrl($item) }}"
                                title="Click to delete">
                                <i class="fa fa-trash"></i>
                            </a>
                        </div>
                        @endforeach
                    </div>

                    <div class="form-group">
                        <label for="image_uploader">{{ trans('backoffice.upload_images') }}</label>
                        <input class="form-control" type="file" name="image_uploader" id="image_uploader" value="">
                    </div>

                </div>

                <div role="tabpanel" class="tab-pane fade" id="attachments">

                    <h4>{{ trans('backoffice.current_attachments') }}</h4>
                    <ul class="list-group">
                        @foreach($content->getAttachments() as $item)
                        <li class="list-group-item">
                            <a class="btn btn-danger btn-xs delete-attachment" data-item="{{ $content->getAttachmentUrl($item) }}"
                                title="Click to delete">
                                <i class="fa fa-trash"></i>
                            </a>
                            <a href="{{ $content->getAttachmentUrl($item) }}" target="_blank">
                                {{ basename($item) }}
                            </a>
                        </li>
                        @endforeach
                    </ul>

                    <div class="form-group">
                        <label for="attachment_uploader">{{ trans('backoffice.upload_attachments') }}</label>
                        <input class="form-control" type="file" name="attachment_uploader" id="attachment_uploader" value="">
                    </div>

                </div>

                <div role="tabpanel" class="tab-pane fade" id="event">

                    <div class="form-group">
                        <label for="event_start">{{ trans('backoffice.event_start') }}</label>
                        <input class="form-control" type="text" name="event[start]" id="event_start"
                               value="{{ $content->event ? $content->event->start : '' }}">
                        <span class="help-block alert-danger v-error-event_start"></span>
                    </div>

                    <div class="form-group">
                        <label for="event_end">{{ trans('backoffice.event_end') }}</label>
                        <input class="form-control" type="text" name="event[end]" id="event_end"
                               value="{{ $content->event ? $content->event->end : '' }}">
                        <span class="help-block alert-danger v-error-event_end"></span>
                    </div>
                </div>



                <div role="tabpanel" class="tab-pane fade" id="location">

                    <input type="hidden" name="location[lat]"
                           value="{{ $content->location ? $content->location->lat : '' }}" />
                    <input type="hidden" name="location[lon]"
                           value="{{ $content->location ? $content->location->lon : '' }}" />
                    <input type="hidden" name="location[zoom]"
                           value="{{ $content->location ? $content->location->zoom : ''}}" />

                    <div class="row">
                        <div class="col-md-10">
                            <div class="form-group">
                                <label for="address">{{ trans('backoffice.search') }}</label>
                                <input class="form-control" type="text" placeholder="{{ trans('backoffice.address_placeholder') }}" name="location[address]"
                                       value="{{ $content->location? $content->location->address : '' }}">
                            </div>
                        </div>
                        <div class="col-md-2">
                            <div class="form-group">
                                <label for="reset">{{ trans('backoffice.remove') }}</label>
                                <div class="clearfix"></div>
                                <a class="btn btn-danger delete-location">{{ trans('backoffice.remove') }}</a>
                            </div>
                        </div>
                    </div>

                    <div id="map" style="width: 100%; height: 380px;"></div>

                </div>

                <div role="tabpanel" class="tab-pane fade" id="permission">
                    <label>{{ trans('backoffice.edit_permission') }}</label>
                    <div class="form-group">
                        <label class="radio-inline" title="Any user can edir this content">
                            <input required type="radio" name="role_permission" value="NONE"
                                @if($content->isRolePermission('NONE')) checked="checked" @endif> {{ trans('backoffice.permission_none') }}
                        </label>
                        <label class="radio-inline" title="Only users in the same roles of the owner can edit this content">
                            <input type="radio" name="role_permission" value="ROLE"
                                @if($content->isRolePermission('ROLE')) checked="checked" @endif> {{ trans('backoffice.permission_role') }}
                        </label>
                        <label class="radio-inline" title="Only the owner can edit this content">
                            <input type="radio" name="role_permission" value="USER"
                                @if($content->isRolePermission('USER')) checked="checked" @endif> {{ trans('backoffice.permission_user') }}
                        </label>
                    </div>
                </div>

            </div>

            <div class="form-group">
                <button class="btn btn-primary" type="submit">{{ trans('backoffice.save') }}</button>
                <a href="javascript: window.history.back()" class="btn btn-danger">{{ trans('backoffice.cancel') }}</a>
            </div>
        </form>

    </div>
</div>

@stop

@section('script')
<script src="{{ asset('assets/js/bootstrap-datepicker.js') }}" type="text/javascript"></script>
<script src="{{ asset('assets/js/summernote.min.js') }}" type="text/javascript"></script>
<script src="{{ asset('assets/js/summernote-gallery-extension.js') }}" type="text/javascript"></script>
<script src="{{ asset('assets/js/fileinput.min.js') }}" type="text/javascript"></script>
<script src="http://maps.googleapis.com/maps/api/js?sensor=false" type="text/javascript"></script>
<script type="text/javascript">
    var date_options = {
        format: 'yyyy-mm-dd',
        autoclose: true
    };
    $('[name="publish_start"]').datepicker(date_options);
    $('[name="publish_end"]').datepicker(date_options);
    $('[name="event[start]"]').datepicker(date_options);
    $('[name="event[end]"]').datepicker(date_options);

    $('#summernote').summernote({
        direction: 'ltr',
        height: 300,
        dialogsFade: true,
        toolbar: [
            // [groupName, [list of button]]
            ['insert', ['picture', 'link', 'video', 'table', 'hr', 'gallery']],
            ['font style', ['fontname', 'fontsize', 'color', 'bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
            ['paragraph style', ['style', 'ol', 'ul', 'paragraph', 'height']],
            ['misc', ['fullscreen', 'codeview', 'undo', 'redo', 'help']]

          ],
        callbacks :{
            onChange: function(contents) {
                // contents = strip_tags(contents, '<div><p><span><a><hr><br><img><ol><ul><li><br><table><thead><tbody><tr><th><td>');
                contents = contents.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
                $('#content').val(contents);
            },
             onInit: function() {
                $(this).data('image_dialog_images_url', "{{route('image_dialog_images_url', $content->id_cms_lang)}}");
                $(this).data('image_dialog_title', "La galerie d'images");
                $(this).data('image_dialog_close_btn_text', "Fermer");
                $(this).data('image_dialog_ok_btn_text', "Ajouter");
            }
        }
    });

    // console.log($.summernote);
    $("#seo_image").fileinput({
        @if ($content->hasPicture())
        initialPreview: [
            "<img src=\"{{ $content->getPictureUrl() }}\" class=\"file-preview-image\" alt=\"The Moon\" title=\"The Moon\">"
        ],
        @endif
        showCaption: false,
        overwriteInitial: true,
        showUpload: false,
        showRemove: false,
		maxFileCount: 1,
    });

    var gallery_uploader = $("#image_uploader").fileinput({
        language: "pt",
        uploadUrl: "{{ url('admin/contents/upload/'.$content->id_cms_lang) }}",
        allowedFileExtensions: ["jpg", "png", "gif"],
        minImageWidth: 50,
        minImageHeight: 50,
        maxFileSize: 2000,
        showCaption: false,
        overwriteInitial: true,
        showUpload: false,
        showRemove: false,
        uploadExtraData: function() {
            return {
                '_token': $('[name="_token"]').val(),
                'image_max_width': $('[name="image_max_width"]').val()
            };
        }
    });
    gallery_uploader.on('filebatchselected', function(event, files) {
        gallery_uploader.fileinput('upload');
    });

    $('#gallery .delete-image').on('click', function() {
        var me = $(this);
        var resp = confirm('Destroy image?');
        if (resp) {
            $.get("{{ url('admin/contents/'.$content->id_cms_lang.'/delete') }}/" + $(this).data('item').split(/[\\/]/).pop(), function (resp) {
                if (resp.success) {
                    me.parent().remove();
                } else {
                    alert('Could not destroy image!');
                }
            });
        }
    });

    var attachment_uploader = $("#attachment_uploader").fileinput({
        language: "pt",
        uploadUrl: "{{ url('admin/contents/attachment/'.$content->id_cms_lang) }}",
        allowedFileExtensions: ["doc", "docx", "xls", "xlsx", "ppt", "pptx", "pdf", "zip"],
        previewFileIcon: '<i class="fa fa-file"></i>',
        allowedPreviewTypes: null, // set to empty, null or false to disable preview for all types
        previewFileIconSettings: {
            'doc': '<i class="fa fa-file-word-o text-primary"></i>',
            'docx': '<i class="fa fa-file-word-o text-primary"></i>',
            'xls': '<i class="fa fa-file-excel-o text-success"></i>',
            'xlsx': '<i class="fa fa-file-excel-o text-success"></i>',
            'ppt': '<i class="fa fa-file-powerpoint-o text-danger"></i>',
            'pptx': '<i class="fa fa-file-powerpoint-o text-danger"></i>',
            'pdf': '<i class="fa fa-file-pdf-o text-danger"></i>',
            'zip': '<i class="fa fa-file-archive-o text-muted"></i>',
        },
        showCaption: false,
        overwriteInitial: true,
        showUpload: false,
        showRemove: false,
        uploadExtraData: function() {
            return {
                '_token': $('[name="_token"]').val()
            };
        }
    });
    attachment_uploader.on('filebatchselected', function(event, files) {
        attachment_uploader.fileinput('upload');
    });

    $('#attachments .delete-attachment').on('click', function() {
        var me = $(this);
        var resp = confirm('Destroy attachment?');
        if (resp) {
            $.get("{{ url('admin/contents/'.$content->id_cms_lang.'/attachment/delete') }}/" + $(this).data('item').split(/[\\/]/).pop(), function (resp) {
                if (resp.success) {
                    me.parent().remove();
                } else {
                    alert('Could not destroy attachment!');
                }
            });
        }
    });

    var map, mapMarker, geocoder;
    $('#location .delete-location').on('click', function() {
        var me = $(this);
        var resp = confirm('Remove location?');
        if (resp) {
            $('[name="location[zoom]"]').val('');
            $('[name="location[lat]"]').val('');
            $('[name="location[lon]"]').val('');
            $('[name="location[address]"]').val('');
            map.setCenter(new google.maps.LatLng(0, 0));
            map.setZoom(1);
            mapMarker.setMap(null);
        }
    });
    function initMap() {
        geocoder = new google.maps.Geocoder();
        mapMarker = new google.maps.Marker({
            @if($content->location && $content->location->lat)
                position: new google.maps.LatLng({{ $content->location->lat }}, {{ $content->location->lon }}),
            @else
                position: new google.maps.LatLng(0, 0),
            @endif
            title: "{{ $content->title }}",
            draggable: true
        });

        var mapOptions = {
            @if($content->location && $content->location->zoom)
                zoom: {{ $content->location->zoom }},
            @else
                zoom: 1,
            @endif
            center: mapMarker.position,
            mapTypeId: google.maps.MapTypeId.SATELLITE,
            style: google.maps.ZoomControlStyle.LARGE
        };
        map = new google.maps.Map(document.getElementById("map"), mapOptions);
        mapMarker.setMap(map);

        google.maps.event.addListener(map, 'zoom_changed', function() {
            $('[name="location[zoom]"]').val(this.getZoom());
        });

        google.maps.event.addListener(mapMarker, 'dragend', function(event) {
            $('[name="location[lat]"]').val(this.position.lat());
            $('[name="location[lon]"]').val(this.position.lng());
        });

        $('[name="location[address]"]').on('blur', function () {
            var me = $(this);
            geocoder.geocode( { 'address': me.val() }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    console.log(results[0]);
                    map.setCenter(results[0].geometry.location);
                    mapMarker.setPosition(results[0].geometry.location);
                    me.val(results[0].formatted_address);
                    $('[name="location[zoom]"]').val(map.getZoom());
                    $('[name="location[lat]"]').val(mapMarker.position.lat());
                    $('[name="location[lon]"]').val(mapMarker.position.lng());
                } else {
                    alert("Geocode was not successful for the following reason: " + status);
                }
            });
        });
    }

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        if ($(e.target).attr('href') === '#location' && typeof map === 'undefined') {
            initMap();
        }
    });

    var form = new Form($, '#formContent', {files: '#seo_image'});

</script>
@stop
