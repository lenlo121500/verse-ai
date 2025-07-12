import { Hash, Image, Sparkles } from "lucide-react";
import React, { useState } from "react";

const GenerateImages = () => {
  const imageStyle = [
    "Realistic",
    "Ghibli Style",
    "Animated Style",
    "Cartoon Style",
    "Fantasy Style",
    "3D Style",
    "Portrait Style",
  ];

  const [selectedStyle, setSelectedStyle] = useState("Realistic");
  const [input, setInput] = useState("");
  const [publish, setPublish] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
  };
  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* Left Column */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full md:w-[48%] max-w-lg p-4 bg-white rounded-lg border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#00ad25]" />
          <h1 className="text-xl font-semibold">AI Image Generator</h1>
        </div>
        <p className="mt-6 text-sm font-medium">Describe Your Image</p>
        <textarea
          onChange={(e) => setInput(e.target.value)}
          value={input}
          rows={4}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          placeholder="Enter description for your desired image..."
          required
        />
        <p className="mt-4 text-sm font-medium">Image Style</p>
        <div className="mt-3 flex gap-3 flex-wrap sm:max-w-9/11">
          {imageStyle.map((item) => (
            <span
              onClick={() => setSelectedStyle(item)}
              key={item}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${
                selectedStyle === item
                  ? "bg-green-50 text-green-700"
                  : "text-gray-500 border-gray-300"
              }`}
            >
              {item}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 my-6">
          <label className="relative cursor-pointer">
            <input
              type="checkbox"
              onChange={(e) => setPublish(e.target.checked)}
              checked={publish}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition" />

            <span className="absolute left-1 top-1 size-3 bg-white rounded-full transition peer-checked:translate-x-4" />
          </label>
          <p className="text-sm">Make this image public</p>
        </div>

        <button className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00ad25] to-[#04ff25] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer hover:-translate-y-1 active:scale-95 transition">
          <Image className="w-5" />
          Generate Image
        </button>
      </form>
      {/* Right Column */}
      <div className="w-full md:w-[48%] max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96">
        <div className="flex items-center gap-3">
          <Image className="size-5 text-[#00ad25]" />
          <h1 className="text-xl font-semibold">Generated Titles</h1>
        </div>

        <div className="flex-1 flex justify-center items-center">
          <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
            <Image className="size-9" />
            <p>Enter the image description and click "Generate Image"</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GenerateImages;
