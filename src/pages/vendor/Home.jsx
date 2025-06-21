import React from "react";
import Barcode from "react-barcode";

const Home = () => {
  return (
    <div>
      <h1>Vendor Home</h1>
      <h1>This is an example barcode for product</h1>
      <Barcode className="h-16 w-fit" value="19e9c5df-2a22-4254-945a-26da2d273a03" />
    </div>
  );
};

export default Home;
