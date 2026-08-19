import { useState } from "react";
import Section1 from "./Section1";
import Section2 from "./Section2";

const Home = () => {

  const [selectedCuisine, setSelectedCuisine] = useState("Indian");

  const cuisineThemes = {
    Indian: "bg-gradient-to-b from-orange-100 to-white",
    Chinese: "bg-gradient-to-r from-red-100 to-white",
    Japanese: "bg-gradient-to-r from-gray-100 to-white",
    Italian: "bg-gradient-to-r from-green-100 to-white"
  };

  return (
  <div className={`${cuisineThemes[selectedCuisine]} transition-all duration-500`}>
    <Section1 
  selectedCuisine={selectedCuisine}
  setSelectedCuisine={setSelectedCuisine}
/>
<Section2 selectedCuisine={selectedCuisine} />

  </div>
);
};

export default Home;
