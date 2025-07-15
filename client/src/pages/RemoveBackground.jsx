import { Eraser, Sparkles, Upload, Download } from "lucide-react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveBackground = () => {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  const { getToken } = useAuth();

  // Cleanup preview URL when component unmounts or when new file is selected
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) {
        toast.error("Authentication required. Please log in again.");
        return;
      }

      const formData = new FormData();
      formData.append("image", input);

      const { data } = await axios.post(
        "/api/ai/remove-image-background",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setContent(data.content);
        toast.success("Background removed successfully.");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error(error);
    }
    setLoading(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setInput(file);

    // Create preview URL
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl("");
    }
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

        {/* Image Preview */}
        {previewUrl && (
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">Preview:</p>
            <div className="w-full max-w-xs mx-auto">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full max-h-48 object-contain rounded-lg border border-gray-200"
              />
            </div>
          </div>
        )}

        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#f6ab41] to-[#ff4938] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer hover:-translate-y-1 active:scale-95 transition"
        >
          {loading ? (
            <span className="size-4 my-1 rounded-full border-2 border-t-transparent animate-spin" />
          ) : (
            <Eraser className="w-5" />
          )}
          Remove Background
        </button>
      </form>

      {/* Right Column */}
      <div className="w-full md:w-[48%] max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Eraser className="size-5 text-[#ff4938]" />
            <h1 className="text-xl font-semibold">Processed Image</h1>
          </div>
          {content && (
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 text-sm rounded-md transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          )}
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Eraser className="size-9" />
              <p>Upload your file and click "Remove Background"</p>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-full">
            <img
              src={content}
              alt="Processed Image"
              className="w-full h-full mt-3"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default RemoveBackground;
