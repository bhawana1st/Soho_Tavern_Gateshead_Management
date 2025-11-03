import Checklist from "../models/ChecklistModel.js";


// Create new checklist entry
export const createChecklist = async (req, res, next) => {
  try {
    const checklist = await Checklist.create(req.body);
    res.status(201).json(checklist);
  } catch (error) {
    next(error);
  }
};

// Get all checklists
export const getChecklists = async (req, res, next) => {
  try {
    const checklists = await Checklist.find();
    res.status(200).json(checklists);
  } catch (error) {
    next(error);
  }
};
