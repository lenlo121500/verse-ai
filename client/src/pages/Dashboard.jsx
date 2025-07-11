import React, { useEffect, useState } from "react";
import { dummyCreationData } from "../assets/assets";
import { Protect } from "@clerk/clerk-react";
import { Gem, Sparkles, FileText } from "lucide-react";
import CreationItem from "../components/CreationItem";

const Dashboard = () => {
  const [creations, setCreations] = useState([]);

  const getDashboardData = async () => {
    // For testing fallback, comment out the line below
    setCreations(dummyCreationData);

    // To test fallback state, uncomment this line and comment out the line above
    // setCreations([]);
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  return (
    <div className="h-full overflow-y-scroll p-6">
      <div className="flex justify-start gap-4 flex-wrap">
        {/* Total Creations Card */}
        <div className="flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200">
          <div className="text-slate-600">
            <p className="text-sm">Total Creations</p>
            <h2 className="text-xl font-semibold">{creations.length}</h2>
          </div>
          <div className="size-10 rounded-lg bg-gradient-to-br from-[#3588F2] to-[#0BB0d7] text-white flex items-center justify-center">
            <Sparkles className="text-white w-5" />
          </div>
        </div>

        {/* Active Plan Card */}
        <div className="flex justify-between items-center w-72 p-4 px-6 bg-white rounded-xl border border-gray-200">
          <div className="text-slate-600">
            <p className="text-sm">Active Plan</p>
            <h2 className="text-xl font-semibold">
              <Protect plan="premium" fallback="Free">
                Premium
              </Protect>{" "}
              Plan
            </h2>
          </div>
          <div className="size-10 rounded-lg bg-gradient-to-br from-[#ff61c5] to-[#9e53ee] text-white flex items-center justify-center">
            <Gem className="text-white w-5" />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <p className="mt-6 mb-4">Recent Creations</p>

        {creations.length > 0 ? (
          // Show creations if they exist
          creations.map((item) => <CreationItem key={item.id} item={item} />)
        ) : (
          // Show fallback when no creations exist
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileText className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-gray-500 text-lg mb-4">
              You don't have creations yet
            </p>
            <button className="px-6 py-3 bg-gradient-to-br from-[#3588F2] to-[#0BB0d7] text-white rounded-xl font-medium hover:opacity-90 transition-opacity">
              Create now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
