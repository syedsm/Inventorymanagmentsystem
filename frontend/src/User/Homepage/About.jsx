import { useEffect } from "react";

function About() {
  useEffect(() => {
    // Initialize AOS when the component mounts
    window.AOS.init({
      duration: 1000, // Animation duration (in ms)
      easing: "ease-in-out", // Easing for the animations
      once: true, // Whether animation should happen only once
    });
  }, []);

  return (
    // <>
    //   {/* Hero Section */}
    //   <div className="hero-section position-relative">
    //     <div className="hero-overlay">
    //       <h1
    //         className="display-3 fw-bold text-white"
    //         data-aos="fade-up"
    //       >
    //         About Us
    //       </h1>
    //       <p className="lead mt-3" data-aos="fade-up" data-aos-delay="200">
    //         Welcome to Inventory System! We are dedicated to providing top-notch
    //         solutions to manage your inventory efficiently and effectively.
    //       </p>
    //       <p data-aos="fade-up" data-aos-delay="400">
    //         Our mission is to empower businesses with the tools they need to
    //         streamline operations, reduce waste, and maximize productivity. With a
    //         focus on innovation and customer satisfaction, we strive to be your
    //         trusted partner in inventory management.
    //       </p>
    //     </div>
    //   </div>
    // </>
    <>
  {/* Hero Section */}
  <div className="hero-section position-relative">
    <img
      src="https://www.extensiv.com/hubfs/Skubana/Blog%20Pages/Imported_Blog_Media/Image%201-Oct-12-2022-05-34-21-24-PM.jpeg"
      alt="Hero"
      className="hero-image"
    />
    <div className="hero-overlay">
      <h1 className="display-3 fw-bold text-white" data-aos="fade-up">
        About Us
      </h1>
      <p className="lead mt-3" data-aos="fade-up" data-aos-delay="200">
        Welcome to Inventory System! We are dedicated to providing top-notch
        solutions to manage your inventory efficiently and effectively.
      </p>
      <p data-aos="fade-up" data-aos-delay="400">
        Our mission is to empower businesses with the tools they need to
        streamline operations, reduce waste, and maximize productivity. With a
        focus on innovation and customer satisfaction, we strive to be your
        trusted partner in inventory management.
      </p>
    </div>
  </div>
</>
  );
}

export default About;
