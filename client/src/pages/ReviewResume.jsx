import React, { useState } from "react";
import { FileText, Sparkles, Upload } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useAuth } from "@clerk/clerk-react";
import Markdown from "react-markdown";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ReviewResume = () => {
  const [input, setInput] = useState("");
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

      const formData = new FormData();
      formData.append("resume", input);

      const { data } = await axios.post("/api/ai/review-resume", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setContent(data.content);
        toast.success("Resume reviewed successfully.");
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
  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700">
      {/* Left Column */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full md:w-[48%] max-w-lg p-4 bg-white rounded-lg border-gray-200"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-[#00ad83]" />
          <h1 className="text-xl font-semibold">Resume Reviewer</h1>
        </div>
        <p className="mt-6 text-sm font-medium">Upload Resume</p>

        {/* Custom File Input */}
        <div className="relative mt-2">
          <input
            onChange={handleFileChange}
            type="file"
            accept="application/pdf"
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
          Only PDF files are allowed
        </p>

        <button
          disabled={loading}
          className="w-full flex justify-center items-center gap-2 bg-gradient-to-r from-[#00da83] to-[#009bb3] text-white px-4 py-2 mt-6 text-sm rounded-lg cursor-pointer hover:-translate-y-1 active:scale-95 transition"
        >
          {loading ? (
            <span className="size-4 my-1 rounded-full border-2 border-t-transparent animate-spin" />
          ) : (
            <FileText className="w-5" />
          )}
          Review Resume
        </button>
      </form>
      {/* Right Column */}
      <div className="w-full md:w-[48%] max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]">
        <div className="flex items-center gap-3">
          <FileText className="size-5 text-[#00da83]" />
          <h1 className="text-xl font-semibold">Analysis Result</h1>
        </div>

        {!content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <FileText className="size-9" />
              <p>Upload your file and click "Review Resume"</p>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-600">
            <div className="reset-tw">
              <Markdown>{content}</Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewResume;
