import React, { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";

const LIFETIME_DATE = "9999-12-31T23:59";

const AddCatalogueExpiryModal = ({ userId, catalogueId, requestId, onClose, onSuccess }) => {
  const [expiresAt, setExpiresAt] = useState(
    new Date().toISOString().slice(0, 16) // local datetime (no seconds)
  );

  const [isLifetime, setIsLifetime] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);

      const payload = {
        requestId: requestId,
        catalogue: catalogueId,
        // IMPORTANT FIX: DO NOT CONVERT TO UTC
        expiresAt: isLifetime
          ? LIFETIME_DATE + ":00"  // add seconds, keep local time
          : expiresAt + ":00",      // keep exact local datetime
      };

      await axios.put(
        `${import.meta.env.VITE_API_URL}/user/${userId}/request-catalogues`,
        payload
      );

      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error(err);
      alert("Failed to update user catalogue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="w-full max-w-md rounded-lg p-6 shadow-lg space-y-6 relative bg-white/20 backdrop-blur-xl">
        
        {/* CLOSE BUTTON */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
          onClick={onClose}
        >
          <X size={20} />
        </button>

        {/* TITLE */}
        <h2 className="text-xl font-semibold text-gray-900">
          Set Catalogue Access Expiry
        </h2>

        {/* Lifetime Toggle */}
        <label className="flex items-center gap-2 text-gray-700 font-medium">
          <input
            type="checkbox"
            checked={isLifetime}
            onChange={(e) => setIsLifetime(e.target.checked)}
          />
          Lifetime Access
        </label>

        {/* Date Picker */}
        {!isLifetime && (
          <div className="flex flex-col gap-1">
            <label className="text-gray-700 font-medium text-sm">
              Expiration Date
            </label>

            <input
              type="datetime-local"
              value={expiresAt}
              min={new Date().toISOString().slice(0, 16)} // protect past dates
              onChange={(e) => setExpiresAt(e.target.value)}
              className="border rounded px-3 py-2 text-sm"
            />
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-3">
          <button
            className="px-4 py-2 rounded bg-gray-300 text-gray-700 hover:bg-gray-400"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCatalogueExpiryModal;
