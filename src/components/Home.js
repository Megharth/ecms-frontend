import { Add, Logout, Search, ShoppingCart } from "@mui/icons-material";
import Close from "@mui/icons-material/Close";
import {
  AppBar,
  Badge,
  IconButton,
  InputBase,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import ErrorSnackbar from "./ErrorSnackbar";

import "../css/Home.css";
import CreateProduct from "./CreateProduct";
import Orders from "./Cart";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [createProduct, setCreateProduct] = useState(false);
  const [orders, setOrders] = useState(new Set());
  const [openOrders, setOpenOrders] = useState(false);
  const [pastOrders, setPastOrders] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}product`).then((response) => {
      response.json().then((data) => {
        setProducts(data.products);
      });
    });
  }, []);

  useEffect(() => {
    fetch(
      `${process.env.REACT_APP_API_URL}user/${window.localStorage.getItem(
        "user"
      )}/orders`
    ).then((res) =>
      res.json().then((data) => {
        setPastOrders(data.orders);
      })
    );
  }, []);

  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const handleSearch = (e) => setSearch(e.target.value);

  const searchProducts = () => {
    if (search.length > 0) {
      setFilteredProducts(
        products.filter((product) => product.name.includes(search))
      );
    } else {
      setFilteredProducts(products);
    }
  };

  const logout = () => {
    window.localStorage.removeItem("user");
    window.localStorage.removeItem("userType");
    navigate("/");
  };

  const deleteProduct = async (id) => {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}product/${id}`,
      {
        method: "DELETE",
      }
    );

    const { success } = await response.json();

    if (success) {
      setProducts((oldProducts) => oldProducts.filter(({ _id }) => _id !== id));
    } else {
      setErrorMsg("Cannot delete product");
      setError(true);
    }
  };

  const updateProduct = (id, updatedProduct) => {
    const callback = (oldProducts) => {
      return oldProducts.map((product) => {
        if (product._id === id) return { ...product, ...updatedProduct };
        else return product;
      });
    };
    setProducts(callback);
  };

  const addNewProduct = (newProduct) => {
    setProducts((oldProducts) => {
      oldProducts.push(newProduct);
      return oldProducts;
    });
  };

  const addToCart = useCallback(
    (item) => {
      const updatedOrders = new Set(orders);
      updatedOrders.add(item);
      setOrders(updatedOrders);
    },
    [orders, setOrders]
  );

  const removeFromCart = useCallback(
    (item) => {
      const updatedOrders = new Set(orders);
      updatedOrders.delete(item);
      setOrders(updatedOrders);
    },
    [orders, setOrders]
  );

  const orderNow = async () => {
    let res = await fetch(`${process.env.REACT_APP_API_URL}order/bulk`, {
      method: "POST",
      body: JSON.stringify({
        products: Array.from(orders).map((order) => order._id),
        email: window.localStorage.getItem("user"),
        discount: 0,
      }),
      headers: {
        "Content-Type": "Application/json",
      },
    });
    let data = await res.json();

    res = await fetch(
      `${process.env.REACT_APP_API_URL}user/${window.localStorage.getItem(
        "user"
      )}/orders`
    );

    data = await res.json();

    setOrders(new Set());
    setPastOrders(data.orders);
  };

  const deleteOrder = async (orderId) => {
    await fetch(`${process.env.REACT_APP_API_URL}order/${orderId}`, {
      method: "DELETE",
    });

    const res = await fetch(
      `${process.env.REACT_APP_API_URL}user/${window.localStorage.getItem(
        "user"
      )}/orders`
    );

    const data = await res.json();
    setPastOrders(data.orders);
  };

  return (
    <div className="home">
      <AppBar>
        <Toolbar>
          <Typography variant="body1">E-Commerce website</Typography>
          <Paper className="search-bar">
            <InputBase
              sx={{ ml: 1, flex: 1, width: "500px" }}
              fullWidth
              placeholder="Search products"
              onChange={handleSearch}
              value={search}
              onKeyPress={(e) => {
                if (e.code === "Enter") searchProducts();
              }}
            />
            {search.length > 0 ? (
              <IconButton
                onClick={() => {
                  setSearch("");
                  setFilteredProducts(products);
                }}
              >
                <Close />
              </IconButton>
            ) : (
              <IconButton onClick={searchProducts}>
                <Search />
              </IconButton>
            )}
          </Paper>

          <div className="right-action-btns">
            <IconButton
              className="action-btn"
              onClick={() => setOpenOrders(true)}
            >
              <Badge badgeContent={orders.size} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>
            {window.localStorage.getItem("userType") === "admin" && (
              <IconButton
                className="action-btn"
                onClick={() => setCreateProduct(true)}
              >
                <Add />
              </IconButton>
            )}
            <IconButton className="action-btn" onClick={logout}>
              <Logout />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <div className="catalogue">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              deleteProduct={deleteProduct}
              updateProduct={updateProduct}
              addToCart={addToCart}
            />
          ))
        ) : (
          <div>Loading products</div>
        )}
      </div>
      <CreateProduct
        open={createProduct}
        handleClose={() => setCreateProduct(false)}
        allSellers={[].concat.apply(
          [],
          products.map((product) => product.sellers)
        )}
        addNewProduct={addNewProduct}
      />
      <Orders
        open={openOrders}
        orders={orders}
        handleClose={() => setOpenOrders(false)}
        removeFromCart={removeFromCart}
        pastOrders={pastOrders}
        orderNow={orderNow}
        deleteOrder={deleteOrder}
      />
      <ErrorSnackbar
        open={error}
        handleClose={() => {
          setError(false);
          setErrorMsg("");
        }}
        message={errorMsg}
      />
    </div>
  );
};

export default Home;
