import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import apiService from "../utils/apiService";
import { ClipLoader } from "react-spinners";

function CompletionForm({
  setSelectedTime,
  setTeamName,
  setMembers,
  onSubmit,
}) {
  const [teamName, setTeamNameField] = useState("");
  const [membersInput, setMembersInput] = useState("");
  const [members, localSetMembers] = useState([]);
  const [focusedField, setFocusedField] = useState("");
  const [error, setError] = useState("");
  const [teamCheckLoading, setTeamCheckLoading] = useState(false);
  const [teamAvailable, setTeamAvailable] = useState("NA");
  const [memberCheckLoading, setMemberCheckLoading] = useState(false);
  const [memberAvailable, setMemberAvailable] = useState("NA");

  async function checkIfTeamExists() {
    try {
      const nameRequest = { team_name: teamName };
      const response = await apiService.checkTeam(nameRequest);

      if (response.exists === 1) {
        setError("This team name already exists.");
        setTeamAvailable("no");
      } else {
        setError("");
        setTeamAvailable("yes");
      }
    } catch (error) {
      setError("Error checking team name. Please try again.");
    } finally {
      setTeamCheckLoading(false);
    }
  }

  async function checkIfMemberExists(member) {
    setMemberCheckLoading(true);
    try {
      const memberRequest = { email: member };
      const response = await apiService.checkParticipant(memberRequest);

      console.log(response);
      if (response.exists === 1) {
        setError(
          "A member of the team has already been added to a different team."
        );
        setMemberAvailable("no");
        return true;
      } else {
        setError("");
        setMemberAvailable("yes");
        return false;
      }
    } catch (error) {
      setError("Error checking member. Please try again.");
    } finally {
      setMemberCheckLoading(false);
    }
  }

  const handleTeamNameChange = (value) => {
    setTeamNameField(value);
    setTeamAvailable("NA");
  };

  const handleTeamBlur = async () => {
    if (!teamName.trim()) return;
    setTeamCheckLoading(true);

    checkIfTeamExists(teamName);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email) && email.toLowerCase().endsWith("@hpe.com");
  };

  const addMember = (value) => {
    const newMember = value.trim();
    if (!newMember) return;

    if (members.includes(newMember)) {
      setError("This member is already added.");
      return;
    }

    if (!validateEmail(newMember)) {
      setError("Please enter a valid HPE email address.");
      return;
    }

    if (members.length >= 4) {
      setError("The maximum number of members is 4.");
      return;
    }

    localSetMembers([...members, newMember]);
    setMembersInput("");
    setError("");
  };

  const handleMembersChange = (e) => {
    setMemberAvailable("NA")
    setMembersInput(e.target.value);
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const email = membersInput.trim();

      if (!email) return;

      if (!validateEmail(email)) {
        setError("Please enter a valid HPE email address.");
        setMemberAvailable("no");
        return;
      }

      if (members.includes(email)) {
        setError(`${email} is already added to this team.`);
        setMemberAvailable("no");
        return;
      }

      if (members.length > 4) {
        setError("A team can have a maximum of 4 members.");
        return;
      }

      const exists = await checkIfMemberExists(email);

      if (exists) {
        setError(`${email} is already part of another team.`);
        setMemberAvailable("no");
        return;
      }

      addMember(email);
      setMemberAvailable("yes");
    } else if (
      e.key === "Backspace" &&
      membersInput === "" &&
      members.length > 0
    ) {
      e.preventDefault();
      localSetMembers(members.slice(0, -1));
      setError("");
    }
  };

  const removeMember = (index) => {
    localSetMembers(members.filter((_, i) => i !== index));
    setError("");
  };

  const handleSubmit = () => {
    if (!teamName.trim()) {
      setError("Please enter a team name.");
      return;
    }

    if (members.length < 2) {
      setError("A team must have at least 2 members.");
      return;
    }

    if (members.length > 4) {
      setError("A team can have a maximum of 4 members.");
      return;
    }

    setTeamName(teamName);
    setMembers(members);
    setError("");
    onSubmit();
  };

  return (
    <div className="border-l-1 pl-10 w-100">
      <form className="flex flex-col gap-2">
        <div className="flex flex-col relative">
          <label
            className={`text-md transition-all duration-400 transform ${
              focusedField === "team" || teamName
                ? "translate-y-0 opacity-100"
                : "translate-y-2 opacity-0"
            }`}
          >
            Team Name
          </label>
          <div className="flex flex-row items-center gap-2">
            <input
              className="border-2 rounded-lg text-lg p-2 focus:outline-none focus:ring-0 bg-black/10 w-full"
              value={teamName}
              onChange={(e) => handleTeamNameChange(e.target.value)}
              onFocus={() => setFocusedField("team")}
              onBlur={() => {
                setFocusedField("");
                handleTeamBlur();
              }}
              placeholder={
                focusedField === "team" || teamName ? "" : "Team Name"
              }
            />
            {teamCheckLoading ? (
              <ClipLoader color="#EABC25" size={30} />
            ) : teamAvailable === "NA" ? (
              <div style={{ width: 30, height: 30 }} />
            ) : teamAvailable === "yes" ? (
              <Check size={30} className="text-lime-300" />
            ) : (
              <X size={30} className="text-red-200" />
            )}
          </div>
        </div>

        <div className="flex flex-col relative">
          <label
            className={`text-md transition-all duration-400 transform ${
              focusedField === "members" || members.length > 0 || membersInput
                ? "translate-y-0 opacity-100"
                : "translate-y-2 opacity-0"
            }`}
          >
            Members
          </label>

          <div className="flex flex-row items-center gap-2">
            <div
              className="border-2 rounded-lg text-lg p-2 flex flex-wrap gap-2 overflow-y-auto items-start bg-black/10 w-100"
              onClick={() => setFocusedField("members")}
            >
              {members.map((member, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 bg-black/30 text-white/90 rounded-xl text-[1.05rem] px-2 py-1"
                >
                  {member}
                  <button
                    type="button"
                    onClick={() => removeMember(index)}
                    className="hover:text-white cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}

              <div className="flex items-center gap-2 flex-grow">
                <input
                  className="outline-none self-start w-full"
                  value={membersInput}
                  onChange={handleMembersChange}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setFocusedField("members")}
                  onBlur={() => setFocusedField("")}
                  placeholder={
                    focusedField === "members" ||
                    members.length > 0 ||
                    membersInput
                      ? ""
                      : "Members"
                  }
                />
              </div>
            </div>
            {memberCheckLoading ? (
              <ClipLoader color="#EABC25" size={30} />
            ) : memberAvailable === "yes" ? (
              <Check size={30} className="text-lime-300" />
            ) : memberAvailable === "no" ? (
              <X size={30} className="text-red-200" />
            ) : (
              <div style={{ width: 30, height: 30 }} />
            )}
          </div>
        </div>

        <div className="flex flex-row justify-end mt-6 pr-6">
          <div
            onClick={handleSubmit}
            className="w-30 flex gap-2 font-semibold border-2 rounded-2xl items-center p-2 border-[#20211E] cursor-pointer transition duration-200 hover:scale-101"
          >
            <Check />
            Submit
          </div>
        </div>

        <p
          className={`text-md text-[#ffe223] mt-1 transition-opacity duration-300 ${
            error ? "opacity-100" : "opacity-0"
          }`}
        >
          {error || "placeholder"}
        </p>
      </form>
    </div>
  );
}

export default CompletionForm;
