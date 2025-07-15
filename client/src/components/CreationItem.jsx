import React, { useState } from "react";
import Markdown from "react-markdown";
import { Trash2, Loader2 } from "lucide-react";

const CreationItem = ({ item, onDelete, isDeleting }) => {
  const [expanded, setExpanded] = useState(false);

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(item.id);
  };

  const handleItemClick = () => {
    if (!isDeleting) {
      setExpanded(!expanded);
    }
  };

  return (
    <div
      onClick={handleItemClick}
      className={`p-4 max-w-5xl text-sm bg-white border border-gray-200 rounded-lg cursor-pointer group hover:shadow-md transition-shadow duration-200 ${
        isDeleting ? "opacity-50 cursor-not-allowed" : ""
      }`}
    >
      <div className="flex justify-between items-center gap-4">
        <div className="flex-1">
          <h2 className="font-medium text-gray-900">{item.prompt}</h2>
          <p className="text-gray-500">
            {item.type} - {new Date(item.created_at).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            className="bg-[#eff6ff] border border-[#bfdbfe] text-[#1e40af] px-4 py-1 rounded-full"
            onClick={(e) => e.stopPropagation()}
          >
            {item.type}
          </button>

          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed opacity-0 group-hover:opacity-100"
            title="Delete creation"
          >
            {isDeleting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-4">
          {item.type === "image" ? (
            <div>
              <img
                src={item.content}
                alt="image"
                className="mt-3 w-full max-w-md rounded-lg"
              />
            </div>
          ) : (
            <div className="mt-3 h-full overflow-y-scroll text-sm text-slate-700">
              <div className="reset-tw">
                <Markdown>{item.content}</Markdown>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreationItem;
