import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import '../styles/carousel.css'

/**
 * ValuePropsCarousel Component
 * 
 * A carousel component that displays the three value propositions with lesson images.
 * Uses react-slick for carousel functionality with responsive settings.
 */
const ValuePropsCarousel = () => {

  // Value props data with lesson images
  const valueProps = [
    {
      id: 'value-prop-1',
      title: 'Patient, professional instruction',
      description: 'Learn at your own pace with personalized guidance tailored to your musical goals.',
      image: '/guitar-lesson-teaching.jpg',
      imageAlt: 'Guitar lesson instruction with teacher and student'
    },
    {
      id: 'value-prop-2', 
      title: 'Flexible scheduling',
      description: 'Convenient lesson times that work with your family\'s busy schedule.',
      image: '/piano-teacher-student.jpg',
      imageAlt: 'Piano teacher working with student'
    },
    {
      id: 'value-prop-3',
      title: 'Beginner-friendly studio',
      description: 'Welcoming environment perfect for students just starting their musical journey.',
      image: '/bass-lesson-instruction.jpg',
      imageAlt: 'Bass lesson instruction'
    }
  ]

  // Carousel settings
  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          dots: false
        }
      }
    ]
  }

  return (
    <div className="value-props-carousel" data-wireframe-section="value-props-carousel">
      <Slider {...settings}>
        {valueProps.map((prop) => (
          <div key={prop.id} className="carousel-slide">
            <div className="slide-content">
              {/* Image Container with Text Overlay */}
              <div className="slide-image-container" data-asset-container={`${prop.id}-image`}>
                <img
                  src={prop.image}
                  alt={prop.imageAlt}
                  className="slide-image"
                  loading="lazy"
                />
                
                {/* Text Overlay */}
                <div className="slide-text-overlay">
                  <h3 className="card-title" data-typography-container="value-prop-title">
                    {prop.title}
                  </h3>
                  <p className="card-description" data-typography-container="value-prop-description">
                    {prop.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  )
}

export default ValuePropsCarousel