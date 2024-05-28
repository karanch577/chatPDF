
import React from "react";

const Spinner = ({ border = "border-black", className = "" }) => {
  return (
    <div className="flex">
        <div className="relative">
            {/* <!-- Outer Ring--> */}
            <div className="w-8 h-8 rounded-full absolute
        border-4 border-solid border-gray-200"></div>

            {/* <!-- Inner Ring --> */}
            <div className={`w-8 h-8 rounded-full animate-spin absolute
        border-4 border-solid ${border} border-t-transparent`}></div>
        </div>
    </div>
  );
};

export default Spinner;
