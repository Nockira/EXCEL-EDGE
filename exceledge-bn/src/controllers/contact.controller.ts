import { Request, Response } from "express";
import { emitEvent } from "../server";
import {
  sendContactRequest,
  fetchAllNotification,
  modifyNotification,
  fetchNotificationById,
  removeNotification,
  fetchUnreadNotification,
} from "../services/contacts.service";

export const createContactRequest = async (req: Request, res: Response) => {
  try {
    const contactData = req.body;
    const contactNotification = await sendContactRequest(
      contactData,
      emitEvent
    );
    res.status(201).json(contactNotification);
  } catch (err) {
    res.status(500).json({
      message: "Failed to create contact request",
      error: err,
    });
  }
};

export const getAllNotification = async (_: Request, res: Response) => {
  const data = await fetchAllNotification();
  res.json(data);
};

export const getUnreadNotification = async (req: Request, res: Response) => {
  const data = await fetchUnreadNotification();
  res.json(data.length);
};

export const getNotificationById = async (req: Request, res: Response) => {
  const contact = await fetchNotificationById(req.params.id);
  if (!contact) return res.status(404).json({ error: "Not found" });
  res.json(contact);
};

export const updateNotification = async (req: Request, res: Response) => {
  try {
    const updated = await modifyNotification(req.params.id, req.body);
    res.json(updated);
  } catch {
    res.status(400).json({ error: "Update failed" });
  }
};

export const deleteNotification = async (req: Request, res: Response) => {
  try {
    await removeNotification(req.params.id);
    res.status(204).send();
  } catch {
    res.status(400).json({ error: "Delete failed" });
  }
};
