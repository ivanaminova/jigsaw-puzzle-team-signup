import { useEffect, useState } from "react";
import Slot from "./Slot";
import apiService from "../utils/apiService";
import { BounceLoader } from "react-spinners";

function Grid({ selectedTime, setSelectedTime, slots, setSlots }) {
  const [hoveredSlot, setHoveredSlot] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSlots() {
      setLoading(true);
      try {
        const response = await apiService.getSlots();

        const sortedSlots = response.slots.sort((a, b) => a.id - b.id);
        setSlots(sortedSlots);
      } catch (error) {
        console.error("Error fetching slots:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSlots();
  }, []);

  return (
    <div className="flex flex-col justify-center gap-10">
      {loading ? (
        <div className="h-full w-full flex flex-row items-center mt-30">
          <BounceLoader color="#EABC25" size={80}/>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-3">
            {slots.map((slotData) => (
              <Slot
                key={slotData.id}
                time={slotData.slot}
                booked={slotData.booked}
                onClick={() => setSelectedTime(slotData.slot)}
                selected={selectedTime === slotData.slot}
                setHoveredSlot={setHoveredSlot}
              />
            ))}
          </div>

          {hoveredSlot && (
            <div className="text-white/70 text-center transition-opacity duration-300">
              {hoveredSlot.booked}/2 slots booked.
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Grid;
