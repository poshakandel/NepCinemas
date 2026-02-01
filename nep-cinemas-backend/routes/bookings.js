import express from "express";
import Booking from "../models/Booking.js";
import verifyToken from "../middleware/auth.js";

const router = express.Router();

// Create booking (protected, admin blocked)
router.post("/", verifyToken, async (req, res) => {
  try {
    if (req.user.role === "admin") {
      return res.status(403).json({ message: "Admin cannot book movies" });
    }

    const booking = await Booking.create({
      ...req.body,
      user: req.user.id,
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// View ticket details by booking ID — place BEFORE the :userId route
router.get("/ticket/:id", verifyToken, async (req, res) => {
  try {
    const booking = await Booking
      .findById(req.params.id)
      .populate("movie");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get bookings for logged-in user only
router.get("/:userId", verifyToken, async (req, res) => {
  try {
    if (req.user.id !== req.params.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const bookings = await Booking.find({ user: req.user.id }).populate("movie");

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete booking by ID (user only)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await booking.deleteOne();
    res.json({ message: "Booking deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
