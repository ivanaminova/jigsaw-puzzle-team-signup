function Slot({ time, onClick, selected, booked, setHoveredSlot }) {
  const unavailable = booked === 2;

  const handleMouseEnter = () => {
    setHoveredSlot({ time, booked });
  };

  const handleMouseLeave = () => {
    setHoveredSlot(null);
  };

  return (
    <div
      className={`flex border-2 border-[#20211E] rounded-xl text-xl justify-center p-2 px-6 transform duration-200 
        ${
          unavailable
            ? "bg-[#40404f4a] border-[#40404F] text-[#40404F] cursor-not-allowed"
            : selected
            ? "bg-white/30 border-white text-white shadow-white shadow-sm cursor-pointer"
            : "cursor-pointer hover:scale-102 hover:bg-white/10 hover:border-white/70 hover:text-white/70"
        }`}
      onClick={!unavailable ? onClick : undefined}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {time}
    </div>
  );
}

export default Slot;
