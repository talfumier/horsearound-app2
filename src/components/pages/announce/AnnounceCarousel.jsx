import Carousel from "react-bootstrap/Carousel";

function AnnounceCarousel({images}) {
  return (
    <Carousel
      className="carousel-wrapper"
      interval={5000}
      nextLabel=""
      prevLabel=""
    >
      {images.map((image, index) => {
        return image !== {} ? (
          <Carousel.Item key={index} className="containerCarousel">
            <img
              src={image.data || image}
              alt=""
              style={{overflow: "hidden", width: "100%"}}
            />
          </Carousel.Item>
        ) : null;
      })}
    </Carousel>
  );
}

export default AnnounceCarousel;
