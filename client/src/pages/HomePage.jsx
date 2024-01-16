import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [isError, setIsError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [category, setCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getProducts = async (page = 1) => {
    try {
      setIsError(false);
      setIsLoading(true);
      const results = await axios.get(
        `http://localhost:4001/products?keywords=${searchText}&category=${category}&page=${page}&limit=5`
      );
      console.log("Total items from API response:", results.data.total);
      setProducts(results.data.data);
      setTotalPages(Math.ceil(results.data.total / 5));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setIsError(true);
    }
  };

  const deleteProduct = async (productId) => {
    await axios.delete(`http://localhost:4001/products/${productId}`);
    // const newProducts = products.filter((product) => product.id !== productId);
    // setProducts(newProducts);
    getProducts();
  };

  const handleSearchText = (event) => {
    event.preventDefault();
    setSearchText(event.target.value);
  };

  const handleCategory = (event) => {
    setCategory(event.target.value);
    setCurrentPage(1);
  };

  // Pagination
  const handlePaginationClick = (newPage) => {
    setCurrentPage(newPage);
    getProducts(newPage);
  };

  useEffect(() => {
    getProducts(currentPage);
  }, [searchText, category, currentPage]);

  return (
    <div>
      <div className="app-wrapper">
        <h1 className="app-title">Products</h1>
        <button
          onClick={() => {
            navigate("/product/create");
          }}
        >
          Create Product
        </button>
      </div>
      <div className="search-box-container">
        <div className="search-box">
          <label>
            Search product
            <input type="text" placeholder="Search by name" onChange={handleSearchText} />
          </label>
        </div>
        <div className="category-filter">
          <label>
            View Category
            <select id="category" name="category" value={category} onChange={handleCategory}>
              <option disabled value="">
                -- Select a category --
              </option>
              <option value="IT">IT</option>
              <option value="Fashion">Fashion</option>
              <option value="Food">Food</option>
            </select>
          </label>
        </div>
      </div>
      <div className="product-list">
        {!products.length && !isError && (
          <div className="no-blog-posts-container">
            <h1>No Products</h1>
          </div>
        )}
        {products.map((product) => {
          return (
            <div className="product" key={product._id}>
              <div className="product-preview">
                <img src={product.image} alt="some product" width="250" height="250" />
              </div>
              <div className="product-detail">
                <h1>Product name: {product.name} </h1>
                <h2>Product price: {product.price}</h2>
                <h3>Category: {product.category}</h3>
                <h3>Created Time: 1 Jan 2011, 00:00:00</h3>
                <p>Product description: {product.description} </p>
                <div className="product-actions">
                  <button
                    className="view-button"
                    onClick={() => {
                      navigate(`/product/view/${product._id}`);
                    }}
                  >
                    View
                  </button>
                  <button
                    className="edit-button"
                    onClick={() => {
                      navigate(`/product/edit/${product._id}`);
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>

              <button
                className="delete-button"
                onClick={() => {
                  deleteProduct(product._id);
                }}
              >
                x
              </button>
            </div>
          );
        })}
        {isError ? <h1>Request failed</h1> : null}
        {isLoading ? <h1>Loading ....</h1> : null}
      </div>

      <div className="pagination">
        <button
          className="previous-button"
          onClick={() => handlePaginationClick(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          className="next-button"
          onClick={() => handlePaginationClick(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
      <div className="pages">{`${currentPage}/${totalPages} pages`}</div>
    </div>
  );
}

export default HomePage;
