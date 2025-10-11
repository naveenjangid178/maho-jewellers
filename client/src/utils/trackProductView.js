import { useEffect, useRef } from "react";

function useTrackProductView({ phone, catalogue }) {
  const viewStartRef = useRef(null);

  useEffect(() => {
    // Component mounted — record start time
    viewStartRef.current = new Date();

    return () => {
      // Component unmounted — record end time
      const viewEnd = new Date();
      const viewStart = viewStartRef.current;

      if (!viewStart) return;

      const timeSpent = Math.floor((viewEnd.getTime() - viewStart.getTime()) / 1000);

      // Only send if time spent >= 15 seconds
      if (timeSpent >= 15) {
        // Call API to create user product view
        fetch(`${import.meta.env.VITE_API_URL}/user/product-view`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            phone,
            catalogue,
            viewStart: viewStart.toISOString(),
            viewEnd: viewEnd.toISOString()
          })
        })
          .then(async (res) => {
            if (!res.ok) {
              const errorData = await res.json();
              console.error("Failed to save view:", errorData.message || res.statusText);
            } else {
              console.log("View saved successfully");
            }
          })
          .catch(err => {
            console.error("Error sending view data:", err);
          });
      } else {
        console.log("View time less than 15 seconds, not sending data.");
      }
    };
  }, [phone, catalogue]);
}

export default useTrackProductView;