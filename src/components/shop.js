import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "./card.css";
import { Link } from "react-router-dom";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [cart, setCart] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    let auth = localStorage.getItem("authToken");
    console.log(auth);
    if (auth === null || auth === undefined) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch products from the API
        const response = await fetch("https://dummyjson.com/products");
        const data = await response.json();

        // Update the state with the fetched products
        setProducts(data.products);
        setFilteredProducts(data.products); // Initially set filtered products to all products
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    // Call the fetchProducts function
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterProducts(query, minPrice, maxPrice);
  };

  const handleMinPriceChange = (e) => {
    setMinPrice(e.target.value);
    filterProducts(searchQuery, e.target.value, maxPrice);
  };

  const handleMaxPriceChange = (e) => {
    setMaxPrice(e.target.value);
    filterProducts(searchQuery, minPrice, e.target.value);
  };

  const filterProducts = (query, min, max) => {
    // Filter products based on the search query and price range
    const filtered = products.filter(
      (product) =>
        product.title.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
    );

    const filteredByPrice = filtered.filter(
      (product) =>
        (!min || product.price >= min) && (!max || product.price <= max)
    );

    setFilteredProducts(filteredByPrice);
  };

  const handleReset = () => {
    setMinPrice("");
    setMaxPrice("");
    filterProducts(searchQuery, "", "");

    // Reset cart, cart count, and total amount
    cartReset();
  };

  const handleAddToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);

    if (!existingItem || existingItem.count < 10) {
      const updatedCart = existingItem
        ? cart.map((item) =>
            item.id === product.id ? { ...item, count: item.count + 1 } : item
          )
        : [...cart, { ...product, count: 1 }];

      setCart(updatedCart);

      // Calculate cart count and total amount
      const newCartCount = updatedCart.reduce(
        (sum, item) => sum + item.count,
        0
      );
      setCartCount(newCartCount);

      const newTotalAmount = updatedCart.reduce(
        (sum, item) => sum + item.price * item.count,
        0
      );
      setTotalAmount(newTotalAmount);
    }
  };

  const handleRemoveFromCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      const updatedCart = cart
        .map((item) =>
          item.id === product.id ? { ...item, count: item.count - 1 } : item
        )
        .filter((item) => item.count > 0);

      setCart(updatedCart);

      // Calculate cart count and total amount
      const newCartCount = updatedCart.reduce(
        (sum, item) => sum + item.count,
        0
      );
      setCartCount(newCartCount);

      const newTotalAmount = updatedCart.reduce(
        (sum, item) => sum + item.price * item.count,
        0
      );
      setTotalAmount(newTotalAmount);
    }
  };

  const cartReset = () => {
    setCart([]);
    setCartCount(0);
    setTotalAmount(0);
  };

  return (
    <div>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <nav className="navbar bg-light navbar-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to={"/shop"}>
            <img src={process.env.PUBLIC_URL + "/logo.png"} alt="" style={{ maxHeight: '7vh', margin: '0' }} />
          </Link>
          <form className="d-flex" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={searchQuery}
              onChange={handleSearch}
            />
            
          </form>
        </div>
      </nav>

      <h2 className="my-4">Shop</h2>
      <div
        className="d-flex align-items-center ms-3"
        style={{ maxWidth: "90%" }}
      >
        <span className="me-2 fs-5" >Price Range:</span>
        <input
          type="number"
          placeholder="Min"
          value={minPrice}
          onChange={handleMinPriceChange}
          className="form-control"
          style={{maxWidth: 'fit-content'}}
        />
        <input
          type="number"
          placeholder="Max"
          value={maxPrice}
          onChange={handleMaxPriceChange}
          className="form-control mx-1"
          style={{maxWidth: 'fit-content'}}
        />
        <button
          type="reset"
          className="btn btn-outline-dark mx-2"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
      <div
        className={`container ${
          filteredProducts.length === 0 ? "d-block " : "d-none"
        }`}
      >
        <div className="card">
          <div className="card-header">No Such Products Available</div>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="row mx-3 my-3">
          <div className="col-md-9">
            <div className="row row-cols-1 row-cols-md-3 g-3">
              {filteredProducts.map((product) => (
                <div className="col" key={product.id}>
                  <div className="card h-100">
                    <img
                      src={product.thumbnail}
                      className="card-img-top p-3"
                      alt=""
                      style={{ minHeight: "30vh", maxHeight: "35vh" }}
                    />
                    <div className="card-body">
                      <h3 className="card-title">{product.title}</h3>
                      <p className="card-text">{product.description}</p>
                      <p className="card-text">{product.rating} Ratings </p>
                      <p className="card-text">
                        <strong>Price: ${product.price}</strong>
                      </p>
                      {cart.find((item) => item.id === product.id) ? (
                        <div className="d-flex align-items-center justify-content-center"  >
                          <button
                            className="btn btn-outline-dark me-2"
                            onClick={() => handleRemoveFromCart(product)}
                          >
                            -
                          </button>
                          <span>{cart.find((item) => item.id === product.id).count}</span>
                          <button
                            className="btn btn-outline-dark ms-2"
                            onClick={() => handleAddToCart(product)}
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          className="btn btn-outline-dark"
                          onClick={() => handleAddToCart(product)}
                        >
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div
            className="col-md-3"
            style={{
              position: "sticky",
              top: "0",
              maxWidth: "100%",
            }}
          >
            <div
              className="card mt-4"
              style={{
                position: "sticky",
                top: "0",
                maxWidth: "100%",
              }}
            >
              <div className="card-body">
                <h2>Cart</h2>
                <h4>Items: {cartCount}</h4>
                <h4>Total Amount: ${totalAmount}</h4>
                <button
                  type="reset"
                  className="btn btn-outline-dark mx-4"
                  onClick={cartReset}
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
