import React, { useState } from "react";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { Slide } from "@mui/material";
import "../css/ProductCard.css";
import ProductDialog from "./ProductDialog";

const ProductCard = ({ product }) => {
  const { category, name, price } = product;
  const [openDialog, setOpenDialog] = useState(false);

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
    <div>
      <Card className="product-card" onClick={() => setOpenDialog(true)}>
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
      <ProductDialog
        open={openDialog}
        handleClose={() => {
          console.log("closing dialog");
          setOpenDialog(false);
        }}
        product={{ ...product, category: formatCategory(category) }}
      />
    </div>
  );
};

export default ProductCard;
