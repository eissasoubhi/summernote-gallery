# summernote-gallery
summernote-gallery extension for [summernote](https://github.com/summernote/summernote/) wysiwyg, provides a bootstrap modal image gallery to select images already existe on server and add them to summernote editor with real path to server instead of using base64 encode.
# Installing
1. include extension file after summernote.min.js file

```html
<script src="/js/summernote.min.js" type="text/javascript"></script>
<script src="/js/summernote-gallery-extension.js" type="text/javascript"></script>
```
2. add the gallery to summernote editor toolbar

```javascript
$('#summernote').summernote({
        toolbar: [
            // ['insert', ['picture', 'link', 'video', 'table', 'hr', 'gallery']],
            // ['font style', ['fontname', 'fontsize', 'color', 'bold', 'italic', 
            //'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
            // ['paragraph style', ['style', 'ol', 'ul', 'paragraph', 'height']],
            // ['misc', ['fullscreen', 'codeview', 'undo', 'redo', 'help']]
            ['extensions', ['gallery']],
          ],
        callbacks :{
             onInit: function() {
                // $(this).data('image_dialog_images_html', '<div class="row"..');
                $(this).data('image_dialog_images_url', "mysite.com/url/to/html/gallery.php");
                $(this).data('image_dialog_title', "La galerie d'images");
                $(this).data('image_dialog_close_btn_text', "Fermer");
                $(this).data('image_dialog_ok_btn_text', "Ajouter");
            }
        }
    });
```
# Options
to add options use onInit callback in that way :
```javascript 
$(this).data('option', 'value'); 
```
## avaialable options
### 1. image_dialog_images_url : 
url to html template containing images to add to the moadal body 

Default : none (required if image_dialog_images_html is not set)

### 2. image_dialog_images_html : 
html template containing images to add to the moadal body

Default : none (required if image_dialog_images_url is not set)

### 3. image_dialog_title : 
modal title

Default : "Image gallery"

### 4. image_dialog_close_btn_text : 
modal close button

Default : "Close"

### 5. image_dialog_ok_btn_text : 
modal button to add selected images to summernote editor 

Default : "Add"
# HTML template
to have the best result make sure your html template shows images in following form:

```html
<div class="row">
        <!-- ... -->
        <div class="col-md-2 img-item">
            <img class="col-md-12 thumbnail" src="website.com/url/to/image.jpg" alt="a galerie test" />
            <i class="fa fa-check"></i>
        </div>
        <!-- ... -->
</div>
```
### example template
```html

<div class="row">
            <div class="col-md-2 img-item">
                <img class="col-md-12 thumbnail" src="http://localhost:3030/storage/content/365/gallery/865b7acdbfc7a08a6c2d97350917da11.jpg" alt="a galerie test" />
                <i class="fa fa-check"></i>
            </div>
            <div class="col-md-2 img-item">
                <img class="col-md-12 thumbnail" src="http://localhost:3030/storage/content/365/gallery/9b952bb0c0d2771fcab06207e3a7e512.jpg" alt="a galerie test" />
                <i class="fa fa-check"></i>
            </div>
            <div class="col-md-2 img-item">
                <img class="col-md-12 thumbnail" src="http://localhost:3030/storage/content/365/gallery/bed271fd23cd9d4e49532fdef7ef05f6.jpg" alt="a galerie test" />
                <i class="fa fa-check"></i>
            </div>
            <div class="col-md-2 img-item">
                <img class="col-md-12 thumbnail" src="http://localhost:3030/storage/content/365/gallery/ec271099b2d93d8cadc671ed4ebc8ed3.jpg" alt="a galerie test" />
                <i class="fa fa-check"></i>
            </div>
    </div>
```

Feel free to modify to suit your needs.

take a look on the summernote extension basic sample [hello](https://github.com/summernote/summernote/blob/v0.7.0/examples/plugin-hello.html).

#License

The contents of this repository is licensed under [The MIT License.](https://opensource.org/licenses/MIT)
