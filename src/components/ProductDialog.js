import React from "react";
import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";

import "../css/ProductDialog.css";
import SellerCard from "./SellerCard";
import ReviewCard from "./ReviewCard";

const ProductDialog = ({ open, handleClose, product }) => {
  const { name, category, price, description, quantity, sellers, reviews } =
    product;
  console.log(category);
  return (
    <Dialog open={open} onClose={handleClose} className="product-dialog">
      <DialogTitle>{name}</DialogTitle>
      <DialogContent>
        <img
          src="https://picsum.photos/550/280"
          alt={name}
          className="product-img"
        />
        <div className="section">
          <Typography variant="body1" color="text.primary">
            Product Info
          </Typography>
          <div className="product-desc">
            <Typography variant="body1" color="text.primary">
              Description: {description}
            </Typography>
            <div className="price-quantity-section">
              <Typography variant="caption">Price: ${price}</Typography>
              <Typography variant="caption">Quantity: {quantity} ct</Typography>
            </div>
            <Typography variant="caption" color="text.secondary">
              Category: {category}
            </Typography>
          </div>
        </div>
        <div className="section">
          <Typography variant="body1" color="text.primary">
            Sellers
          </Typography>
          <div className="sellers">
            {sellers.map((seller) => (
              <SellerCard seller={seller} />
            ))}
          </div>
        </div>
        <div className="section">
          <Typography variant="body1" color="text.primary">
            Reviews
          </Typography>
          <div className="reviews">
            {reviews.map((review) => (
              <ReviewCard review={review} />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
