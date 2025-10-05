import Ticket from "../models/Ticket.js";
import User from "../models/User.js";

const ticketController = {
  // @desc    Create a new ticket
  // @route   POST /api/tickets
  // @access  Private
  createTicket: async (req, res) => {
    try {
      const { title, description, priority, category, subcategory } = req.body;

      // Assuming auth middleware adds user to req
      const createdBy = req.user.id;
      const allUsers = await User.find({ id: { $ne: createdBy } });
      const assignedTo =
        allUsers[Math.floor(Math.random() * allUsers.length)]._id;

      console.log("createdBy: ", createdBy);
      console.log("assignedTo: ", assignedTo);

      const ticket = new Ticket({
        title,
        description,
        priority,
        category,
        subcategory,
        createdBy,
        assignedTo,
      });

      const createdTicket = await ticket.save();

      // Add ticket to user's created tickets
      await User.findByIdAndUpdate(createdBy, {
        $push: { ticketCreated: createdTicket._id },
      });

      // Add ticket to user's assigned tickets to random user
      await User.findByIdAndUpdate(assignedTo, {
        $push: { ticketAssigned: createdTicket._id },
      });

      res.status(201).json(createdTicket);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: "Server Error" });
    }
  },

  getMyTickets: async (req, res) => {
    try {
      const tickets = await Ticket.find({ createdBy: req.user.id })
        .populate("createdBy", "name email")
        .populate("assignedTo", "name email");
      res.json(tickets);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: "Server Error" });
    }
  },

  // @desc    Get all tickets
  // @route   GET /api/tickets
  // @access  Private
  getTickets: async (req, res) => {
    try {
      const tickets = await Ticket.find()
        .populate("createdBy", "name email")
        .populate("assignedTo", "name email");
      res.json(tickets);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: "Server Error" });
    }
  },

  // @desc    Get single ticket by ID
  // @route   GET /api/tickets/:id
  // @access  Private
  getTicketById: async (req, res) => {
    try {
      const ticket = await Ticket.findById(req.params.id)
        .populate("createdBy", "name email")
        .populate("assignedTo", "name email");

      if (!ticket) {
        return res.status(404).json({ msg: "Ticket not found" });
      }

      res.json(ticket);
    } catch (error) {
      console.error(error.message);
      if (error.kind === "ObjectId") {
        return res.status(404).json({ msg: "Ticket not found" });
      }
      res.status(500).json({ msg: "Server Error" });
    }
  },

  // @desc    Update a ticket
  // @route   PUT /api/tickets/:id
  // @access  Private
  updateTicket: async (req, res) => {
    try {
      const ticket = await Ticket.findById(req.params.id);

      if (!ticket) {
        return res.status(404).json({ msg: "Ticket not found" });
      }

      // Add authorization check if needed, e.g., only admin or assigned user can update

      const updatedTicket = await Ticket.findByIdAndUpdate(
        req.params.id,
        { $set: req.body },
        { new: true }
      );

      res.json(updatedTicket);
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ msg: "Server Error" });
    }
  },

  // @desc    Delete a ticket
  // @route   DELETE /api/tickets/:id
  // @access  Private/Admin
  deleteTicket: async (req, res) => {
    try {
      const ticket = await Ticket.findById(req.params.id);

      if (!ticket) {
        return res.status(404).json({ msg: "Ticket not found" });
      }

      // Add authorization check if needed, e.g., only admin can delete

      await ticket.deleteOne();

      // Optional: Remove ticket reference from user models
      await User.updateMany(
        {
          $or: [{ ticketCreated: ticket._id }, { ticketAssigned: ticket._id }],
        },
        { $pull: { ticketCreated: ticket._id, ticketAssigned: ticket._id } }
      );

      res.json({ msg: "Ticket removed" });
    } catch (error) {
      console.error(error.message);
      if (error.kind === "ObjectId") {
        return res.status(404).json({ msg: "Ticket not found" });
      }
      res.status(500).json({ msg: "Server Error" });
    }
  },
};

export default ticketController;
