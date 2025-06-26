import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import {
  Button,
  Card,
  Navbar,
  Container,
  ListGroup,
  Alert,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import "../assets/css/AvailabilityPage.css";

/**
 * @constant AvailabilityPage
 * @description Page for users to create and manage their available booking slots.
 * Allows selection of date, start time, and end time, and generates a unique booking link for each slot.
 *
 * @returns {JSX.Element} The rendered availability management page.
 */
const AvailabilityPage = () => {
  /**
   * @constant navigate
   * @description React Router navigation function.
   */
  const navigate = useNavigate();

  /**
   * @constant [selectedDate, setSelectedDate]
   * @description State for the currently selected date.
   */
  const [selectedDate, setSelectedDate] = useState(new Date());

  /**
   * @constant [startTime, setStartTime]
   * @description State for the selected start time.
   */
  const [startTime, setStartTime] = useState(null);

  /**
   * @constant [endTime, setEndTime]
   * @description State for the selected end time.
   */
  const [endTime, setEndTime] = useState(null);

  /**
   * @constant [slots, setSlots]
   * @description State for the list of all saved slots.
   */
  const [slots, setSlots] = useState([]);

  /**
   * @constant [generatedLink, setGeneratedLink]
   * @description State for the most recently generated booking link.
   */
  const [generatedLink, setGeneratedLink] = useState("");

  /**
   * @function useEffect
   * @description Clears slot-related data from localStorage on page refresh and resets state.
   */
  useEffect(() => {
    const keysToRemove = Object.keys(localStorage).filter(
      (key) => key.startsWith("slots_") || key === "all_slots"
    );
    keysToRemove.forEach((key) => localStorage.removeItem(key));

    setSlots([]);
    setGeneratedLink("");
  }, []);

  /**
   * @function handleLogout
   * @description Logs out the user by removing the token and navigating to the home page.
   */
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  /**
   * @function handleSave
   * @description Saves a new slot with the selected date and time, generates a booking link, and updates localStorage.
   */
  const handleSave = () => {
    if (!startTime || !endTime) {
      alert("Please select both Start and End Time.");
      return;
    }

    if (endTime <= startTime) {
      alert("End time must be after Start time.");
      return;
    }

    const dateStr = selectedDate.toISOString().split("T")[0];
    const startStr = startTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const existingSlots = JSON.parse(localStorage.getItem("all_slots")) || [];
    const exists = existingSlots.some(
      (slot) => slot.date === dateStr && slot.startTime === startStr
    );

    if (exists) {
      alert("A slot with the same date and start time already exists.");
      return;
    }

    const slotId = Date.now();
    const slot = {
      id: slotId,
      date: dateStr,
      startTime: startStr,
      endTime: endTime.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      link: `${window.location.origin}/booking/${slotId}`,
    };

    const updatedSlots = [...existingSlots, slot];
    localStorage.setItem("all_slots", JSON.stringify(updatedSlots));
    localStorage.setItem(`slots_${slotId}`, JSON.stringify(slot));

    setSlots(updatedSlots);
    setGeneratedLink(slot.link);

    // Reset fields
    setStartTime(null);
    setEndTime(null);
    setSelectedDate(new Date());
  };

  /**
   * @function handleGenerateLink
   * @description Copies the generated booking link to the clipboard and shows an alert.
   *
   * @param {string} link - The booking link to copy.
   */
  const handleGenerateLink = (link) => {
    navigator.clipboard.writeText(link);
    alert(`Link copied: ${link}`);
  };

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>Booking System</Navbar.Brand>
          <Button variant="outline-light" onClick={handleLogout}>
            Logout
          </Button>
        </Container>
      </Navbar>

      <div
        className="d-flex justify-content-center align-items-center bg-light"
        style={{ width: "100vw", height: "calc(100vh - 56px)" }}
      >
        <Card
          className="p-4 shadow-sm"
          style={{ width: "100%", maxWidth: "450px", borderRadius: "15px" }}
        >
          <h4 className="text-center mb-3">Select Booking Slot</h4>

          <div className="mb-3 align-items-center d-flex flex-column text-center">
            <label className="form-label">Select Date</label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              className="form-control"
              dateFormat="yyyy-MM-dd"
              minDate={new Date()}
            />
          </div>

          <div className="mb-3 align-items-center d-flex flex-column text-center">
            <label className="form-label">Start Time</label>
            <DatePicker
              selected={startTime}
              onChange={(time) => {
                setStartTime(time);
                setEndTime(null); // Reset end time if start time changes
              }}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={30}
              timeCaption="Start Time"
              dateFormat="h:mm aa"
              placeholderText="Select start time"
              className="form-control"
            />
          </div>

          <div className="mb-3 align-items-center d-flex flex-column text-center">
            <label className="form-label">End Time</label>
            <DatePicker
              selected={endTime}
              onChange={(time) => setEndTime(time)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={30}
              timeCaption="End Time"
              dateFormat="h:mm aa"
              placeholderText="Select end time"
              className="form-control"
              minTime={
                startTime ? new Date(startTime.getTime() + 30 * 60000) : null
              }
              maxTime={new Date(selectedDate).setHours(23, 59)}
              disabled={!startTime}
            />
          </div>

          <Button className="w-100 mb-3" onClick={handleSave}>
            Save Slot
          </Button>

          {generatedLink && (
            <Alert variant="success">
              <div className="d-flex justify-content-between align-items-center">
                <span>Link Generated</span>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => handleGenerateLink(generatedLink)}
                >
                  Copy Link
                </Button>
              </div>
              <div className="small text-break mt-2">{generatedLink}</div>
            </Alert>
          )}

          {slots.length > 0 && (
            <>
              <h5 className="mt-3">Saved Slots</h5>
              <ListGroup>
                {slots.map((slot) => (
                  <ListGroup.Item
                    key={slot.id}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <strong>{slot.date}</strong> <br />
                      {slot.startTime} - {slot.endTime}
                    </div>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleGenerateLink(slot.link)}
                    >
                      Copy Link
                    </Button>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </>
          )}
        </Card>
      </div>
    </>
  );
};

export default AvailabilityPage;
