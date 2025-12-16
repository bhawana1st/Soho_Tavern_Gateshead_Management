import Checklist from "../models/ChecklistModel.js";

// Save (create or update by date & user)
export const saveChecklist = async (req, res, next) => {
  try {
    const payload = req.body;
    console.log("Received payload:", JSON.stringify(payload, null, 2));

    // Validate required fields
    if (!payload.date) {
      return res.status(400).json({ message: "Date is required" });
    }

    if (!payload.name) {
      return res.status(400).json({ message: "Name is required" });
    }

    // Check if checklist already exists for this date and user
    const filter = {
      date: payload.date,
      createdBy: req.user.id,
    };

    const existingDoc = await Checklist.findOne(filter);

    if (existingDoc) {
      return res.status(400).json({
        message:
          "Checklist already exists for this date. Please delete it first if you want to create a new one.",
        checklist: existingDoc,
      });
    }

    // Validate dishwasherChecks if provided
    if (payload.dishwasherChecks && Array.isArray(payload.dishwasherChecks)) {
      const validPeriods = payload.dishwasherChecks.filter(
        (check) => check.period === "AM" || check.period === "PM"
      );
      if (validPeriods.length !== payload.dishwasherChecks.length) {
        return res.status(400).json({
          message: "Invalid dishwasher check period. Must be 'AM' or 'PM'.",
        });
      }
    }

    // Ensure all boolean fields are properly set
    if (payload.openingChecks) {
      payload.openingChecks = payload.openingChecks.map((check) => ({
        ...check,
        yes: Boolean(check.yes),
      }));
    }

    if (payload.closingChecks) {
      payload.closingChecks = payload.closingChecks.map((check) => ({
        ...check,
        yes: Boolean(check.yes),
      }));
    }

    // Set creator
    payload.createdBy = req.user.id;

    // Create new checklist
    const newDoc = await Checklist.create(payload);

    console.log("Created checklist:", newDoc._id);

    return res.status(201).json({
      message: "Checklist created successfully",
      checklist: newDoc,
    });
  } catch (err) {
    console.error("Error saving checklist:", err);
    next(err);
  }
};

// Update existing checklist
export const updateChecklist = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body;

    // Find checklist and verify ownership
    const checklist = await Checklist.findOne({
      _id: id,
      createdBy: req.user.id,
    });

    if (!checklist) {
      return res.status(404).json({
        message: "Checklist not found or not authorized to update!",
      });
    }

    // Validate dishwasherChecks if provided
    if (payload.dishwasherChecks && Array.isArray(payload.dishwasherChecks)) {
      const validPeriods = payload.dishwasherChecks.filter(
        (check) => check.period === "AM" || check.period === "PM"
      );
      if (validPeriods.length !== payload.dishwasherChecks.length) {
        return res.status(400).json({
          message: "Invalid dishwasher check period. Must be 'AM' or 'PM'.",
        });
      }
    }

    // Ensure all boolean fields are properly set
    if (payload.openingChecks) {
      payload.openingChecks = payload.openingChecks.map((check) => ({
        ...check,
        yes: Boolean(check.yes),
      }));
    }

    if (payload.closingChecks) {
      payload.closingChecks = payload.closingChecks.map((check) => ({
        ...check,
        yes: Boolean(check.yes),
      }));
    }

    // Update fields
    Object.keys(payload).forEach((key) => {
      if (key !== "_id" && key !== "createdBy" && key !== "createdAt") {
        checklist[key] = payload[key];
      }
    });

    await checklist.save();

    return res.status(200).json({
      message: "Checklist updated successfully",
      checklist,
    });
  } catch (err) {
    console.error("Error updating checklist:", err);
    next(err);
  }
};

// Delete checklist
export const deleteChecklist = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Allow only the creator to delete their checklist
    const checklist = await Checklist.findOne({
      _id: id,
      createdBy: req.user.id,
    });

    if (!checklist) {
      return res.status(404).json({
        message: "Checklist not found or not authorized to delete!",
      });
    }

    await checklist.deleteOne();

    return res.status(200).json({ message: "Checklist deleted successfully!" });
  } catch (err) {
    console.error("Error deleting checklist:", err);
    next(err);
  }
};

// Get all checklists for logged-in user (sorted newest first)
export const getAllChecklists = async (req, res, next) => {
  try {
    const reports = await Checklist.find({})
      .populate("createdBy", "name email")
      .sort({ date: -1 });

    res.json(reports);
  } catch (err) {
    console.error("Error fetching checklists:", err);
    next(err);
  }
};

// Get all checklists (admin only - if needed)
export const getAllChecklistsAdmin = async (req, res, next) => {
  try {
    const reports = await Checklist.find()
      .populate("createdBy", "name email")
      .sort({ date: -1 });

    res.json(reports);
  } catch (err) {
    console.error("Error fetching all checklists:", err);
    next(err);
  }
};

// Get single checklist by date for current user
export const getChecklistByDate = async (req, res, next) => {
  try {
    const { date } = req.params;

    const report = await Checklist.findOne({
      date,
    }).populate("createdBy", "name email");

    if (!report) {
      return res.status(404).json({ message: "Checklist not found" });
    }

    res.json(report);
  } catch (err) {
    console.error("Error fetching checklist by date:", err);
    next(err);
  }
};

// Get single checklist by ID
export const getChecklistById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const report = await Checklist.findOne({
      _id: id,
      createdBy: req.user.id,
    }).populate("createdBy", "name email");

    if (!report) {
      return res.status(404).json({ message: "Checklist not found" });
    }

    res.json(report);
  } catch (err) {
    console.error("Error fetching checklist by ID:", err);
    next(err);
  }
};
