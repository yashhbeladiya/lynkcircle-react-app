//@ts-nocheck
import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  ListItemText,
} from "@mui/material";
import { BsTools } from "react-icons/bs";
import { AttachMoney, Schedule, CheckCircle } from "@mui/icons-material";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const WorkDetails = ({ workDetails, isOwnProfile, onSave }) => {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editedDetails, setEditedDetails] = useState({
    servicesOffered: workDetails?.servicesOffered || [],
    hourlyRate: workDetails?.hourlyRate || "",
    availability: {
      days: workDetails?.availability?.days || [],
      timeSlots: workDetails?.availability?.timeSlots || [{ start: "", end: "" }],
    },
  });

  const handleAddService = () => {
    const newService = prompt("Enter a service:");
    if (newService && !editedDetails.servicesOffered.includes(newService)) {
      setEditedDetails((prev) => ({
        ...prev,
        servicesOffered: [...prev.servicesOffered, newService],
      }));
    }
  };

  const handleRemoveService = (service) => {
    setEditedDetails((prev) => ({
      ...prev,
      servicesOffered: prev.servicesOffered.filter((s) => s !== service),
    }));
  };

  const handleAddTimeSlot = () => {
    setEditedDetails((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        timeSlots: [...prev.availability.timeSlots, { start: "", end: "" }],
      },
    }));
  };

  const handleTimeSlotChange = (index, field, value) => {
    const updatedTimeSlots = [...editedDetails.availability.timeSlots];
    updatedTimeSlots[index][field] = value;
    setEditedDetails((prev) => ({
      ...prev,
      availability: { ...prev.availability, timeSlots: updatedTimeSlots },
    }));
  };

  const handleSave = () => {
    onSave(editedDetails);
    setOpenEditDialog(false);
  };

  if (!workDetails) {
    return (
      <div className="bg-base-100 shadow-md rounded-lg p-6 text-center">
        <p className="text-lg font-semibold mb-4">No work details available</p>
        {isOwnProfile && (
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<BsTools />}
            onClick={() => setOpenEditDialog(true)}
          >
            Add Work Details
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-base-100 shadow-md rounded-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center">
          <BsTools className="mr-2 text-primary" /> Professional Details
        </h2>
        {isOwnProfile && (
          <button
            className="btn btn-outline btn-secondary"
            onClick={() => setOpenEditDialog(true)}
          >
            Edit
          </button>
        )}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Services Offered */}
        <div>
          <h3 className="text-lg font-medium flex items-center mb-2">
            <BsTools className="mr-2 text-primary" /> Services Offered
          </h3>
          <div className="flex flex-wrap gap-2">
            {workDetails?.servicesOffered?.map((service) => (
              <span key={service} className="badge badge-outline badge-secondary">
                {service}
              </span>
            ))}
          </div>
        </div>

        {/* Hourly Rate */}
        <div>
          <h3 className="text-lg font-medium flex items-center mb-2">
            <AttachMoney className="mr-2 text-primary" /> Hourly Rate
          </h3>
          <p>${workDetails?.hourlyRate || "Not specified"}</p>
        </div>

        {/* Availability */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-medium flex items-center mb-2">
            <Schedule className="mr-2 text-primary" /> Availability
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Working Days */}
            <div>
              <h4 className="text-md font-semibold mb-2">Working Days</h4>
              <div className="flex flex-wrap gap-2">
                {workDetails?.availability?.days?.map((day) => (
                  <span key={day} className="badge badge-outline badge-primary">
                    {day}
                  </span>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            <div>
              <h4 className="text-md font-semibold mb-2">Time Slots</h4>
              {workDetails?.availability?.timeSlots?.map((slot, index) => (
                <p key={index} className="text-sm">
                  {slot.start} - {slot.end}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Professional Details</DialogTitle>
        <DialogContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Services */}
            <div>
              <h4 className="text-md font-medium">Services Offered</h4>
              <div className="flex flex-wrap gap-2 mb-2">
                {editedDetails.servicesOffered.map((service) => (
                  <span
                    key={service}
                    className="badge badge-outline badge-error cursor-pointer"
                    onClick={() => handleRemoveService(service)}
                  >
                    {service}
                  </span>
                ))}
              </div>
              <button className="btn btn-sm btn-primary" onClick={handleAddService}>
                Add Service
              </button>
            </div>

            {/* Hourly Rate */}
            <div>
              <TextField
                fullWidth
                label="Hourly Rate"
                type="number"
                value={editedDetails.hourlyRate}
                onChange={(e) =>
                  setEditedDetails((prev) => ({
                    ...prev,
                    hourlyRate: e.target.value,
                  }))
                }
                InputLabelProps={{ shrink: true }}
              />
            </div>

            {/* Working Days */}
            <div className="col-span-2">
              <FormControl fullWidth>
                <InputLabel>Working Days</InputLabel>
                <Select
                  multiple
                  value={editedDetails.availability.days}
                  onChange={(e) =>
                    setEditedDetails((prev) => ({
                      ...prev,
                      availability: { ...prev.availability, days: e.target.value },
                    }))
                  }
                  renderValue={(selected) => selected.join(", ")}
                >
                  {DAYS.map((day) => (
                    <MenuItem key={day} value={day}>
                      <Checkbox
                        checked={editedDetails.availability.days.includes(day)}
                      />
                      <ListItemText primary={day} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* Time Slots */}
            <div className="col-span-2">
              <h4 className="text-md font-medium">Time Slots</h4>
              {editedDetails.availability.timeSlots.map((slot, index) => (
                <div key={index} className="flex gap-4 mb-2">
                  <TextField
                    label="Start Time"
                    type="time"
                    value={slot.start}
                    onChange={(e) =>
                      handleTimeSlotChange(index, "start", e.target.value)
                    }
                  />
                  <TextField
                    label="End Time"
                    type="time"
                    value={slot.end}
                    onChange={(e) =>
                      handleTimeSlotChange(index, "end", e.target.value)
                    }
                  />
                </div>
              ))}
              <button
                className="btn btn-sm btn-secondary"
                onClick={handleAddTimeSlot}
              >
                Add Time Slot
              </button>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <button className="btn btn-error" onClick={() => setOpenEditDialog(false)}>
            Cancel
          </button>
          <button className="btn btn-secondary" onClick={handleSave}>
            Save Changes
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default WorkDetails;
