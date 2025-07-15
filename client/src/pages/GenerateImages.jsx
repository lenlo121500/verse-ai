import { Download, Image, Sparkles } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

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

  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) {
        toast.error("Authentication required. Please log in again.");
        return;
      }
      const prompt = `Generate an image of ${input} in the style ${selectedStyle}.`;

      const { data } = await axios.post(
        "/api/ai/generate-image",
        {
          prompt,
          publish,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setContent(data.content);
        toast.success("Image generated successfully.");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.log(error);
    }
    setLoading(false);
  };
  const handleDownload = async () => {
    try {
      // Create a temporary anchor element
      const link = document.createElement("a");
      link.href = content;
      link.download = `background-removed-${Date.now()}.png`;

      // For cross-origin images, we need to fetch and create a blob
      const response = await fetch(content);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      link.href = url;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the blob URL
      window.URL.revokeObjectURL(url);

      toast.success("Image downloaded successfully!");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download image. Please try again.");
    }
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

        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00ad25] to-[#04ff25] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer hover:-translate-y-1 active:scale-95 transition"
        >
          {loading ? (
            <span className="size-4 my-1 rounded-full border-2 border-t-transparent animate-spin" />
          ) : (
            <Image className="w-5" />
          )}
          Generate Image
        </button>
      </form>
      {/* Right Column */}
      <div className="w-full md:w-[48%] max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image className="size-5 text-[#00ad25]" />
            <h1 className="text-xl font-semibold">Generated Image</h1>
          </div>
          {content && (
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 text-sm rounded-md transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          )}
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Image className="size-9" />
              <p>Upload your file and click "Generate Image"</p>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-full">
            <img
              src={content}
              alt="Generated Image"
              className="w-full h-full mt-3"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateImages;
