import React from 'react'
import Card from '../components/Card'
const foodItems = [
  { id: 1, name: "Dal Makhani", rating: 4, price: "750", time: "12M" },
  { id: 2, name: "Chole Bhature", rating: 4.5, price: "900", time: "20M" },
  { id: 3, name: "Jeera Rice", rating: 3.7, price: "850", time: "13M" },
  { id: 4, name: "Samosa", rating: 4.1, price: "900", time: "15M" },
  { id: 5, name: "Masala Dosa", rating: 4.3, price: "900", time: "24M" },
  { id: 6, name: "Idli Sambar", rating: 3.7, price: "900", time: "33M" },
  { id: 7, name: "Mango Lassi", rating: 4.3, price: "900", time: "30M" },
  { id: 8, name: "Aloo Tikki", rating: 4.9, price: "900", time: "40M" }

];

function Section2() {
  return (
    <div className="grid grid-cols-4 flex-1 justify-between gap-5">
      {foodItems.map((item) => (
        <Card key={item.id} item={item} />
      ))}
      
    </div>
  );
}

export default Section2;