import SummernoteGalleryV3 from './plugin';

export * from './gallery';
export * from './source';
export { SummernoteGalleryV3 };

const summernote = ($ as any).summernote;

if (!summernote || !summernote.plugins) {
    throw new Error('summernote-gallery v3 requires Summernote to be loaded first.');
}

summernote.plugins.summernoteGallery = SummernoteGalleryV3;
