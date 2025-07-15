import { Download, Scissors, Sparkles, Upload } from "lucide-react";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveObject = () => {
  const [input, setInput] = useState("");
  const [object, setObject] = useState("");
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
      if (object.split(" ").length > 1) {
        return toast.error("Please enter a valid object name.");
      }

      const formData = new FormData();
      formData.append("image", input);
      formData.append("object", object);

      const { data } = await axios.post(
        "/api/ai/remove-image-object",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        setContent(data.content);
        toast.success("Object removed successfully.");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.log(error);
    }
    setLoading(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setInput(file);
  };

  const handleDownload = async () => {
    try {
      // Create a temporary anchor element
      const link = document.createElement("a");
      link.href = content;
      link.download = `object-removed-${Date.now()}.png`;

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
          <Sparkles className="w-6 text-[#4a7aff]" />
          <h1 className="text-xl font-semibold">Object Removal</h1>
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

        <p className="mt-6 text-sm font-medium">
          Describe the object to remove
        </p>
        <textarea
          onChange={(e) => setObject(e.target.value)}
          value={object}
          rows={4}
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300"
          placeholder="e.g., watch or phone, single object name only"
          required
        />

        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#417df6] to-[#8e37eb] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer hover:-translate-y-1 active:scale-95 transition"
        >
          {loading ? (
            <span className="size-4 my-1 rounded-full border-2 border-t-transparent animate-spin" />
          ) : (
            <Scissors className="w-5" />
          )}
          Remove Object
        </button>
      </form>
      {/* Right Column */}
      <div className="w-full md:w-[48%] max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Scissors className="size-5 text-[#4a7aff]" />
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
              <Scissors className="size-9" />
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

export default RemoveObject;
