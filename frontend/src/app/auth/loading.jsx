import React from "react";
import { BounceLoader, FadeLoader } from "react-spinners";

const loading = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <BounceLoader color="#4A90E2" />
    </div>
  );
};

export default loading;
