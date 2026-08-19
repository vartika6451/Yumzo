import React from "react";
import Card from "../components/Card";
import {
  indianItems,
  japaneseItems,
  italianItems,
  chineseItems
} from "../data/menu";

function Section2({ selectedCuisine }) {

  const cuisineMap = {
    Indian: indianItems,
    Japanese: japaneseItems,
    Italian: italianItems,
    Chinese: chineseItems
  };

  const itemsToShow = cuisineMap[selectedCuisine] || [];

  return (
    <div className="grid grid-cols-4 gap-6 p-8">
      {itemsToShow.map((item) => (
        <Card key={item.id} item={item} />
      ))}
    </div>
  );
}

export default Section2;

