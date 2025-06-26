import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import { Card, Button, Badge, Alert } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";

/**
 * @constant PublicBookingPage
 * @description Public page for booking available slots using a unique booking link.
 * Displays a calendar of available dates and time slots, and allows visitors to book a slot.
 * Booked slots are hidden for the current booking link.
 *
 * @returns {JSX.Element} The rendered public booking page.
 */
const PublicBookingPage = () => {
  /**
   * @constant linkId
   * @description Booking link identifier from the URL params.
   */
  const { linkId } = useParams();

  /**
   * @constant navigate
   * @description React Router navigation function.
   */
  const navigate = useNavigate();

  /**
   * @constant [allSlots, setAllSlots]
   * @description State for all upcoming available slots for this booking link.
   */
  const [allSlots, setAllSlots] = useState([]);

  /**
   * @constant [selectedDate, setSelectedDate]
   * @description State for the currently selected date.
   */
  const [selectedDate, setSelectedDate] = useState(null);

  /**
   * @constant [availableTimes, setAvailableTimes]
   * @description State for available time slots for the selected date.
   */
  const [availableTimes, setAvailableTimes] = useState([]);

  /**
   * @constant [selectedTime, setSelectedTime]
   * @description State for the currently selected time slot.
   */
  const [selectedTime, setSelectedTime] = useState(null);

  /**
   * @constant [bookedSlots, setBookedSlots]
   * @description State for all booked slots for this booking link.
   */
  const [bookedSlots, setBookedSlots] = useState([]);

  /**
   * @constant [message, setMessage]
   * @description State for feedback messages to the user.
   */
  const [message, setMessage] = useState("");

  /**
   * @function useEffect
   * @description Loads slot data and existing bookings from localStorage on mount.
   * Redirects to 404 if the booking link is invalid.
   */
  useEffect(() => {
    const slotData = JSON.parse(localStorage.getItem(`slots_${linkId}`));
    const savedSlots = JSON.parse(localStorage.getItem("all_slots")) || [];
    const upcomingSlots = savedSlots.filter(
      (slot) => new Date(slot.date) >= new Date(new Date().toDateString())
    );

    if (!slotData) {
      navigate("/404");
      return;
    }

    setAllSlots(upcomingSlots);
    setSelectedDate(new Date(upcomingSlots[0].date));

    const existingBookings =
      JSON.parse(localStorage.getItem("public_bookings")) || [];
    setBookedSlots(existingBookings);
  }, [navigate]);

  /**
   * @function useEffect
   * @description Updates available time slots when the selected date, all slots, or booked slots change.
   */
  useEffect(() => {
    if (!selectedDate) return;

    const dateStr = selectedDate.toISOString().split("T")[0];
    const slotsForDate = allSlots.filter((slot) => slot.date === dateStr);

    const times = [];
    slotsForDate.forEach((slot) => {
      const timeRange = `${slot.startTime} - ${slot.endTime}`;
      const isBooked = bookedSlots.some(
        (b) => b.date === dateStr && b.time === timeRange
      );
      if (!isBooked) {
        times.push(timeRange);
      }
    });

    setAvailableTimes(times);
    setSelectedTime(null);
  }, [selectedDate, allSlots, bookedSlots]);

  /**
   * @function handleBook
   * @description Handles booking a selected time slot for the current date and booking link.
   * Updates localStorage and UI state.
   */
  const handleBook = () => {
    if (!selectedTime) {
      setMessage("Please select a time slot to book.");
      return;
    }

    const booking = {
      date: selectedDate.toISOString().split("T")[0],
      time: selectedTime,
    };
    const updatedBookings = [...bookedSlots, booking];
    setBookedSlots(updatedBookings);
    localStorage.setItem("public_bookings", JSON.stringify(updatedBookings));

    setSelectedTime(null);
    setMessage(`Slot booked for ${booking.date} at ${booking.time}`);
  };

  /**
   * @function getAvailableDates
   * @description Returns an array of Date objects for all unique available slot dates.
   *
   * @returns {Date[]} Array of available dates.
   */
  const getAvailableDates = () => {
    const uniqueDates = [...new Set(allSlots.map((slot) => slot.date))];
    return uniqueDates.map((date) => new Date(date));
  };

  if (allSlots.length === 0) return null;

  return (
    <div
      className="d-flex flex-column align-items-center bg-light"
      style={{ width: "100vw", height: "100vh", padding: "20px" }}
    >
      <h2 className="mb-3 text-center">Book Your Slot</h2>

      {message && (
        <Alert
          variant="success"
          className="text-center"
          style={{ width: "100%", maxWidth: "500px" }}
        >
          {message}
        </Alert>
      )}

      <div>
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          inline
          includeDates={getAvailableDates()}
          minDate={new Date()}
        />
      </div>

      {availableTimes.length > 0 ? (
        <Card
          className="p-4 shadow-sm mt-4"
          style={{ width: "100%", maxWidth: "500px", borderRadius: "15px" }}
        >
          <h5>
            Available Time Slots for {selectedDate.toISOString().split("T")[0]}
          </h5>
          <div className="d-flex flex-wrap gap-2 mt-3 mb-3">
            {availableTimes.map((time, index) => (
              <Badge
                key={index}
                bg={selectedTime === time ? "primary" : "secondary"}
                style={{
                  cursor: "pointer",
                  padding: "10px 15px",
                  fontSize: "1rem",
                }}
                onClick={() => setSelectedTime(time)}
              >
                {time}
              </Badge>
            ))}
          </div>

          <Button className="w-100" onClick={handleBook}>
            Book Slot
          </Button>
        </Card>
      ) : (
        <Card
          className="p-4 shadow-sm mt-4"
          style={{ width: "100%", maxWidth: "500px", borderRadius: "15px" }}
        >
          <p className="text-muted text-center">
            No available slots for selected date.
          </p>
        </Card>
      )}
    </div>
  );
};

export default PublicBookingPage;
