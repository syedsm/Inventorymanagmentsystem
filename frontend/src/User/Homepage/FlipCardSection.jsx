const FlipCardSection = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        {/* Electronics Card */}
        <div className="col-12 col-sm-6 col-md-3 mb-4">
          <div className="card position-relative card-animate">
            <img src="/electronics.png" className="card-img-top h-100" alt="Electronics" />
            <div className="position-absolute top-0 start-0 text-white p-3">
              <h5 className="card-title">Electronics</h5>
              <p className="card-text">
                Discover the latest in electronic & smart appliance technology with our wide range of products.
              </p>
            </div>
          </div>
        </div>

        {/* Grocery Card */}
        <div className="col-12 col-sm-6 col-md-3 mb-4">
          <div className="card position-relative card-animate">
            <img src="/Grocery.jpg" className="card-img-top h-100" alt="Grocery" />
            <div className="position-absolute top-0 start-0 text-white p-3">
              <h5 className="card-title">Grocery</h5>
              <p className="card-text">
                Stock up on fresh groceries and everyday essentials with our convenient grocery delivery service.
              </p>
            </div>
          </div>
        </div>

        {/* Furniture Card */}
        <div className="col-12 col-sm-6 col-md-3 mb-4">
          <div className="card position-relative card-animate">
            <img src="/furniture.jpg" className="card-img-top h-100" alt="Furniture" />
            <div className="position-absolute top-0 start-0 text-white p-3">
              <h5 className="card-title">Furniture</h5>
              <p className="card-text">
                Transform your home with our stylish and comfortable furniture collections for every room.
              </p>
            </div>
          </div>
        </div>

        {/* Clothing Card */}
        <div className="col-12 col-sm-6 col-md-3 mb-4">
          <div className="card position-relative card-animate">
            <img src="/clothing.jpeg" className="card-img-top h-100" alt="Clothing" />
            <div className="position-absolute top-0 start-0 text-white p-3">
              <h5 className="card-title">Clothing</h5>
              <p className="card-text">
                Explore our latest fashion trends and find the perfect outfit for any occasion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipCardSection;