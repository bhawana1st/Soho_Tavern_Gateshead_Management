// backend/src/controllers/checklistController.js
import Checklist from "../models/ChecklistModel.js";

// Save (create or update by date & user)
export const saveChecklist = async (req, res, next) => {
  try {
    const payload = req.body;
    if (!payload.date)
      return res.status(400).json({ message: "Date is required" });

    const filter = { date: payload.date };
    let doc = await Checklist.findOne(filter);

    if (doc) {
      return res.status(400).json({
        message:
          "Checklist alreay present for this date, kindly delete it if you want to update!",
        checklist: doc,
      });
    }

    payload.createdBy = req.user.id;
    const newDoc = await Checklist.create(payload);
    return res.status(201).json({ message: "Created", checklist: newDoc });
  } catch (err) {
    next(err);
  }
};

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
    return res.status(200).json({ message: "Deleted successfully!" });
  } catch (err) {
    next(err);
  }
};

// Get all reports for logged-in user (sorted newest first)
export const getAllChecklists = async (req, res, next) => {
  try {
    const reports = await Checklist.find().sort({
      date: -1,
    });
    res.json(reports);
  } catch (err) {
    next(err);
  }
};

// Get single by date (for edit/view)
export const getChecklistByDate = async (req, res, next) => {
  try {
    const { date } = req.params;
    const report = await Checklist.findOne({ date });
    if (!report) return res.status(404).json({ message: "Not found" });
    res.json(report);
  } catch (err) {
    next(err);
  }
};
