import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  TextField,
  Button,
} from "@mui/material";

import "../css/ProductDialog.css";
import SellerCard from "./SellerCard";
import ReviewCard from "./ReviewCard";

const ProductDialog = ({ open, handleClose, product }) => {
  const {
    _id,
    name,
    category,
    price,
    description,
    quantity,
    sellers,
    reviews,
  } = product;

  const [offlineReviews, setOfflineReviews] = useState([]);
  const [review, setReview] = useState("");

  const handleAddReview = (e) => setReview(e.target.value);

  const submitReview = async () => {
    if (review.length > 0) {
      const reviewObj = {
        content: review,
        created: new Date(),
        updated: new Date(),
      };
      setOfflineReviews((oldOfflineReviews) => {
        oldOfflineReviews.push(reviewObj);
        return oldOfflineReviews;
      });
      setReview("");
      await fetch(`${process.env.REACT_APP_API_URL}product/${_id}/add-review`, {
        method: "POST",
        body: JSON.stringify({ review: reviewObj }),
        headers: {
          "Content-Type": "Application/json",
        },
      });
    }
  };
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
              <SellerCard key={seller._id} seller={seller} />
            ))}
          </div>
        </div>
        <div className="section">
          <Typography variant="body1" color="text.primary">
            Reviews
          </Typography>
          <div className="reviews">
            {[...reviews, ...offlineReviews].map((review) => (
              <ReviewCard
                key={review ? review._id : new Date()}
                review={review}
              />
            ))}
          </div>
          <div className="new-review">
            <TextField
              label="Review"
              multiline
              maxRows={4}
              placeholder="Add a review"
              type="textarea"
              onChange={handleAddReview}
              value={review}
            />
            <Button variant="contained" onClick={submitReview}>
              Submit
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDialog;
