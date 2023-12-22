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

const cartReset= () =>{
    setCart([]);
    setCartCount(0);
    setTotalAmount(0);
}

  return (
    <div>
      <nav className="navbar bg-dark navbar-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to={"/shop"}>
            Navbar
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
            <button className="btn btn-outline-success" type="submit">
              Search
            </button>
          </form>
          
        </div>
      </nav>

      <h2 className="my-4">Shop</h2>
      <div
            className="d-flex align-items-center ms-3"
            style={{ maxWidth: "25%" }}
          >
            <span className="me-2">Price Range:</span>
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={handleMinPriceChange}
              className="form-control me-2"
            />
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={handleMaxPriceChange}
              className="form-control"
            />
            <button
              type="reset"
              className="btn btn-outline-dark mx-4"
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
        <div className="row mx-5 my-5">
          <div className="col-md-9">
            <div className="row row-cols-1 row-cols-md-4 g-4">
              {filteredProducts.map((product) => (
                <div className="col" key={product.id}>
                  <div className="card h-100">
                    <img
                      src={product.thumbnail}
                      className="card-img-top p-3"
                      alt=""
                      style={{ minHeight: "34vh", maxHeight: "35vh" }}
                    />
                    <div className="card-body">
                      <h3 className="card-title">{product.title}</h3>
                      <p className="card-text">{product.description}</p>
                      <p className="card-text">{product.rating} Ratings </p>
                      <p className="card-text">
                        <strong>Price: ${product.price}</strong>
                      </p>
                      <button
                        className="btn btn-outline-dark"
                        onClick={() => handleAddToCart(product)}
                      >
                        {cart.find((item) => item.id === product.id)
                          ? `Added (${
                              cart.find((item) => item.id === product.id).count
                            })`
                          : cartCount >= 10
                          ? "Max Limit Reached"
                          : "Add to Cart"}
                      </button>
                      
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
              
            }}
          >
            <div
              className="card mt-4"
              style={{
                position: "sticky",
                top: "0",
               
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
