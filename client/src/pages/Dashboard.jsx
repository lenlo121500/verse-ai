import React, { useEffect, useState } from "react";
import { Protect, useAuth } from "@clerk/clerk-react";
import { Gem, Sparkles, FileText } from "lucide-react";
import CreationItem from "../components/CreationItem";
import ConfirmationModal from "../components/ConfirmationModal";
import axios from "axios";
import toast from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Dashboard = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [creationToDelete, setCreationToDelete] = useState(null);
  const { getToken } = useAuth();

  const getDashboardData = async () => {
    try {
      const token = await getToken();
      if (!token) {
        toast.error("Authentication required. Please log in again.");
        return;
      }

      const { data } = await axios.get("/api/users/get-user-creations", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setCreations(data.creations);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.log(error);
    }
    setLoading(false);
  };

  const handleDelete = async (creationId) => {
    // Show the confirmation modal
    setCreationToDelete(creationId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!creationToDelete) return;

    setDeletingId(creationToDelete);

    try {
      const token = await getToken();
      if (!token) {
        toast.error("Authentication required. Please log in again.");
        return;
      }

      const { data } = await axios.delete(
        `/api/users/delete-creation/${creationToDelete}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (data.success) {
        // Remove the deleted creation from the state
        setCreations((prev) =>
          prev.filter((creation) => creation.id !== creationToDelete)
        );
        toast.success("Creation deleted successfully!");
      } else {
        toast.error(data.message || "Failed to delete creation");
      }
    } catch (error) {
      toast.error("Failed to delete creation. Please try again.");
      console.log(error);
    } finally {
      setDeletingId(null);
      setShowDeleteModal(false);
      setCreationToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setCreationToDelete(null);
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

      {loading ? (
        <div className="flex justify-center items-center h-3/4">
          <div className="animate-spin rounded-full size-11 border-3 border-purple-500 border-t-transparent"></div>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="mt-6 mb-4">Recent Creations</p>

          {creations.length > 0 ? (
            creations.map((item) => (
              <CreationItem
                key={item.id}
                item={item}
                onDelete={handleDelete}
                isDeleting={deletingId === item.id}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FileText className="w-16 h-16 text-gray-400 mb-4" />
              <p className="text-gray-500 text-lg mb-4">
                You don't have creations yet
              </p>
              <p className="text-gray-500 text-sm">
                Create your first creation to get started
              </p>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Creation"
        message="Are you sure you want to delete this creation? This action cannot be undone and all associated data will be permanently removed."
        confirmText="Delete"
        cancelText="Cancel"
        isLoading={deletingId !== null}
        type="danger"
      />
    </div>
  );
};

export default Dashboard;
