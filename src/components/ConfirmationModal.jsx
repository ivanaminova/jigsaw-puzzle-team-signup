import { motion } from "framer-motion";
import { CheckCheck, X, Clock2 } from "lucide-react";

function ConfirmationModal({ teamName, members, onClose, onRegister, slot }) {
  return (
    <motion.div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="flex flex-col items-center bg-white/40 backdrop-blur-2xl border border-white/20 rounded-2xl p-6 px-10 gap-4 text-center"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
      >
        <h2 className="text-2xl font-semibold mb-4 border-b-1 p-2">
          Is this the team you would like to register?
        </h2>
        <div className="flex flex-row gap-2 text-lg">
          <Clock2/>
          <p>{slot}</p>
        </div>
        <p className="mb-2 text-[#EABC25] text-3xl font-bold">
          {teamName}
        </p>
        <p className="mb-4 w-100 text-lg">
          {members.join(", ")}
        </p>
        <div className="flex flex-row justify-around w-full mt-10">
          <button
            onClick={onClose}
            className="flex flex-row gap-2 items-center w-34 justify-center cursor-pointer px-4 py-2 bg-white/20 rounded-xl hover:bg-white/30 transition duration-200"
          >
            <X />
            Back
          </button>
          <button
            className="flex flex-row gap-2 items-center w-34 justify-center cursor-pointer px-4 py-2 bg-[#f6a43292] rounded-xl hover:bg-[#F6A332] transition duration-200"
            onClick={onRegister}
          >
            <CheckCheck />
            Register
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ConfirmationModal;
