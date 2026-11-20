// Intercepts /products/[slug]/photos/[n] when it's reached by tapping a photo on the product page,
// showing the viewer as a modal over that page. Back closes it and leaves the product page as it
// was (selected colour and size included). Opened directly, the full page in app/(viewer) renders.
import { photoMetadata, photoStaticParams, PhotoViewerRoute, type PhotoParams } from "@/components/product/photo-viewer-route";

export function generateStaticParams() {
  return photoStaticParams();
}

export function generateMetadata({ params }: { params: PhotoParams }) {
  return photoMetadata(params);
}

export default function PhotoModal({ params }: { params: PhotoParams }) {
  return <PhotoViewerRoute params={params} modal />;
}
