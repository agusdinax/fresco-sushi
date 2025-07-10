import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./GalleryCarousel.css";

interface ImageItem {
  src: string;
  alt: string;
}

interface GalleryCarouselProps {
  images: ImageItem[];
  title?: string;
}

export const GalleryCarousel = ({ images, title = "Galería de Imágenes" }: GalleryCarouselProps) => {
  const [startIndex, setStartIndex] = useState(0);

  const imagesPerSlide = window.innerWidth < 768 ? 1 : 3;

  const nextSlide = () => {
    const newIndex = startIndex + imagesPerSlide;
    setStartIndex(newIndex >= images.length ? 0 : newIndex);
  };

  const prevSlide = () => {
    const newIndex = startIndex - imagesPerSlide;
    setStartIndex(newIndex < 0 ? Math.max(images.length - imagesPerSlide, 0) : newIndex);
  };

  const currentImages = images.slice(startIndex, startIndex + imagesPerSlide);

  return (
    <section className="gallery-carousel" aria-label={title} id='galeria'>
      <h2 className="gallery-carousel-title">{title}</h2>

      <div className="carousel-wrapper">
        <button
          onClick={prevSlide}
          className="carousel-nav left"
          aria-label="Imágenes anteriores"
        >
          <ChevronLeft />
        </button>

        <div className="carousel-images">
          {currentImages.map((img, idx) => (
            <img
              key={idx}
              src={img.src}
              alt={img.alt}
              className="carousel-img"
              loading="lazy"
            />
          ))}
        </div>

        <button
          onClick={nextSlide}
          className="carousel-nav right"
          aria-label="Imágenes siguientes"
        >
          <ChevronRight />
        </button>
      </div>
    </section>
  );
};
