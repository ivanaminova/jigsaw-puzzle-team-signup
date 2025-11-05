import request from "./request";

export default {
  getSlots() {
    return request("GET", `https://eventia.eu.hpecorp.net/vibes/get_slots`);
  },
  checkTeam(team) {
    return request(
      "POST",
      `https://eventia.eu.hpecorp.net/vibes/check_team`,
      team
    );
  },
  checkParticipant(participant) {
    return request(
      "POST",
      `https://eventia.eu.hpecorp.net/vibes/check_participant`,
      participant
    );
  },
  createBooking(booking) {
    return request(
      "POST",
      `https://eventia.eu.hpecorp.net/vibes/create_booking`,
      booking
    );
  },
};
