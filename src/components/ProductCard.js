import React from "react";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";

import "../css/ProductCard.css";

const ProductCard = ({ product }) => {
  const { category, name, price } = product;
  const categoryMap = {};
  const formatCategory = (category) => {
    if (category) {
      if (!categoryMap[category]) {
        const words = category.split("_").join(" ");
        let formattedCategory =
          words.slice(0, 1).toUpperCase() + words.slice(1).toLowerCase();
        categoryMap[category] = formattedCategory;
      }

      return categoryMap[category];
    }
  };
  return (
    <Card className="product-card">
      <CardMedia
        component="img"
        height="180"
        image="https://picsum.photos/380/180"
        alt={name}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {formatCategory(category)}
        </Typography>
        <Typography variant="body2" color="text.subtitle">
          ${price}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
