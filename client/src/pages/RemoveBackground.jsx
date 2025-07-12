import { Eraser, Sparkles, Upload } from "lucide-react";
import React, { useState } from "react";

const RemoveBackground = () => {
  const [input, setInput] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setInput(file);
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* Left Column */}
      <form
        onSubmitHandler={onSubmitHandler}
        className="w-full md:w-[48%] max-w-lg p-4 bg-white rounded-lg border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#ff4938]" />
          <h1 className="text-xl font-semibold">Background Removal</h1>
        </div>
        <p className="mt-6 text-sm font-medium">Upload Image</p>

        {/* Custom File Input */}
        <div className="relative mt-2">
          <input
            onChange={handleFileChange}
            type="file"
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            required
          />
          <div className="w-full p-2 px-3 outline-none text-sm rounded-md border text-gray-600 border-gray-300 bg-white flex items-center justify-between cursor-pointer hover:border-gray-400 transition-colors">
            <span className={input ? "text-gray-700" : "text-gray-500"}>
              {input ? input.name : "Choose an image file"}
            </span>
            <Upload className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        <p className="text-sm text-gray-500 font-light mt-1">
          Supports PNG, JPEG, JPG, and other image formats
        </p>

        <button className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#f6ab41] to-[#ff4938] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer hover:-translate-y-1 active:scale-95 transition">
          <Eraser className="w-5" />
          Remove Background
        </button>
      </form>
      {/* Right Column */}
      <div className="w-full md:w-[48%] max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96">
        <div className="flex items-center gap-3">
          <Eraser className="size-5 text-[#ff4938]" />
          <h1 className="text-xl font-semibold">Processed Image</h1>
        </div>

        <div className="flex-1 flex justify-center items-center">
          <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
            <Eraser className="size-9" />
            <p>Upload your file and click "Remove Background"</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveBackground;
