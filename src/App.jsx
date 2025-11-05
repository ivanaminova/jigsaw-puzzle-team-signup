import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./App.css";
import CompletionForm from "./components/CompletionForm";
import Grid from "./components/Grid";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ConfirmationModal from "./components/ConfirmationModal";
import RegistrationSuccess from "./components/RegistrationSuccess";
import { BounceLoader } from "react-spinners";
import apiService from "./utils/apiService";

function App() {
  const [selectedTime, setSelectedTime] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [teamName, setTeamName] = useState("");
  const [members, setMembers] = useState([]);
  const [slots, setSlots] = useState([]);
  const [isRegistering, setIsRegistering] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);

  async function registerBooking() {
    setIsRegistering(true);
    setShowModal(false);

    try {
      const matchedSlot = slots.find((slot) => slot.slot === selectedTime);
      const slotId = matchedSlot ? matchedSlot.id : null;

      if (!slotId) {
        console.error("No matching slot found for selected time");
        setIsRegistering(false);
        return;
      }

      const bookingData = {
        team_name: teamName,
        participants: members,
        slot_id: slotId,
      };

      console.log(bookingData);

      const response = await apiService.createBooking(bookingData);
      console.log(response);

      if (response.success) {
        console.log(
          `✅ Booking successful! Message: ${response.message}, Team ID: ${response.team_id}`
        );
        setRegSuccess(true);
      } else {
        console.error("❌ Booking failed:", response.message);
        alert(response.message || "Booking failed. Please try again.");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      alert("An error occurred while creating your booking. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  }

  return (
    <div className="flex flex-col gap-10 m-2">
      <Header />

      {isRegistering ? (
        <div className="h-full w-full flex flex-row justify-center mt-30">
          <BounceLoader color="#EABC25" size={80} />
        </div>
      ) : regSuccess ? (
        <AnimatePresence mode="wait">
          {regSuccess && (
            <motion.div
              key="registrationSuccess"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <RegistrationSuccess />
            </motion.div>
          )}
        </AnimatePresence>
      ) : (
        <div className="flex justify-center items-start gap-10 overflow-hidden">
          <motion.div
            layout
            animate={{
              x: selectedTime ? 20 : 0,
            }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
          >
            <Grid
              selectedTime={selectedTime}
              setSelectedTime={setSelectedTime}
              slots={slots}
              setSlots={setSlots}
            />
          </motion.div>

          <AnimatePresence mode="wait">
            {selectedTime && (
              <motion.div
                key="completionForm"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <CompletionForm
                  setSelectedTime={setSelectedTime}
                  setTeamName={setTeamName}
                  setMembers={setMembers}
                  onSubmit={() => setShowModal(true)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      <Footer />

      <AnimatePresence>
        {showModal && (
          <ConfirmationModal
            teamName={teamName}
            members={members}
            slot={selectedTime}
            onClose={() => setShowModal(false)}
            onRegister={registerBooking}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
