import React from "react";
import { FiArrowRight } from "react-icons/fi";

/**
 * Was three cards with invented star ratings floating in white space. Now a
 * real index of the counter, mirroring what the menu actually serves, so it
 * answers "what's here, what will it cost" before anyone logs in.
 */
const CATEGORIES = [
  { name: "Dosa", count: 5, from: 49 },
  { name: "Tea", count: 4, from: 9 },
  { name: "Pizza", count: 4, from: 59 },
  { name: "Noodles", count: 6, from: 39 },
  { name: "Pasta", count: 3, from: 69 },
  { name: "Shakes", count: 4, from: 69 },
  { name: "Curries", count: 3, from: 109 },
  { name: "Salad", count: 1, from: 39 },
];

const Category = () => {
  return (
    <div className="category-section-wrapper" id="Category">
      <div className="category-section-top">
        <p className="primary-subheading">The counter</p>
        <h2>What&#39;s on the menu</h2>
        <p className="primary-text">
          Eight sections, cooked to order &mdash; from a nine-rupee chai to a
          slow-simmered butter paneer masala.
        </p>
      </div>
      <div className="category-section-bottom">
        {CATEGORIES.map((cat) => (
          <a href="#Login" className="category-tile" key={cat.name}>
            <span className="category-tile-abbr">{cat.name.slice(0, 3)}</span>
            <span className="category-tile-name">{cat.name}</span>
            <span className="category-tile-meta">
              {cat.count} items &middot; from &#8377;{cat.from}
            </span>
            <FiArrowRight className="category-tile-arrow" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default Category;
