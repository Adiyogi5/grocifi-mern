import React from "react";

// Rating component
const Rating = ({ maxStars = 5, rating = 0 }) => {
  return (
    <div className="rating">
      {[...Array(maxStars)].map((_, index) => {
        const isFilled = index < rating;
        return (
          <span key={index} className="star">
            <i
              className={`fa${isFilled ? ' fa-star' : ' fa-star'}`}
              style={{ color: isFilled ? "#f39c12" : "#d3d3d3", fontSize: '20px' }}
            ></i>
          </span>
        );
      })}
    </div>
  );
};

export default Rating;