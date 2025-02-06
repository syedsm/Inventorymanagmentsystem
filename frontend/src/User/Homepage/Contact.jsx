import { useEffect } from "react";

function Contact() {
  useEffect(() => {
    // Initialize AOS when the component mounts
    window.AOS.init({
      duration: 1000, // Animation duration (in ms)
      easing: "ease-in-out", // Easing for the animations
      once: true, // Whether animation should happen only once
    });
  }, []);

  return (
    <>
      <div className="hero-section-contact position-relative">
        <div
          className="container-fluid hero-overlay-contact"
          style={{ paddingTop: "120px" }}
        >
          <h1
            className="display-3 text-white mb-5 text-center"
            data-aos="fade-up"
          >
            Contact Us
          </h1>
          <div className="row justify-content-center">
            <div
              className="col-12 col-md-4 mb-4 contact-office"
              data-aos="fade-right"
              data-aos-delay="200"
            >
              <h2>Our Office</h2>
              <p>123 Inventory St.</p>
              <p>Warehouse City, WH 45678</p>
              <p>Email: support@inventorysystem.com</p>
              <p>Phone: (123) 456-7890</p>
            </div>
            <div
              className="col-12 col-md-4 mb-4 contact-form"
              data-aos="fade-left"
              data-aos-delay="200"
            >
              <h2>Get in Touch</h2>
              <form>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="message" className="form-label">
                    Message
                  </label>
                  <textarea
                    className="form-control"
                    id="message"
                    name="message"
                    rows="5"
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Contact;
