import { Request, Response } from "express";
import * as AnnouncementService from "../services/announcement.service";
export const createAnnouncement = async (req: Request, res: Response) => {
  const user: any = req.user;
  try {
    const { title, content } = req.body;
    const announcementData = {
      title,
      content,
      authorId: user.id,
    };
    const announcement = await AnnouncementService.createAnnouncement(
      announcementData
    );
    res.status(201).json({
      message: "Announcement published",
      data: announcement,
    });
  } catch (error) {
    console.error("Error creating announcement:", error);
    res.status(500).json({ error: "Failed to create announcement" });
  }
};

export const getAnnouncements = async (req: Request, res: Response) => {
  try {
    const announcements = await AnnouncementService.findAllAnnouncements();

    res.status(200).json({
      message: "ANnouncement fetched successful",
      data: announcements,
    });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    res.status(500).json({ error: "Failed to fetch announcements" });
  }
};

export const getAnnouncementById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const announcement = await AnnouncementService.findAnnouncementById(id);

    if (!announcement) {
      res.status(404).json({ error: "Announcement not found" });
      return;
    }

    res.status(200).json({
      message: "Announcement fetched",
      data: announcement,
    });
  } catch (error) {
    console.error("Error fetching announcement:", error);
    res.status(500).json({ error: "Failed to fetch announcement" });
  }
};

export const updateAnnouncement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateAnnouncementData = req.body;

    const exists = await AnnouncementService.announcementExists(id);
    if (!exists) {
      res.status(404).json({ error: "Announcement not found" });
      return;
    }

    const updatedAnnouncement = await AnnouncementService.updateAnnouncement(
      id,
      updateAnnouncementData
    );
    res.status(200).json({
      message: "Announcement updated successful",
      updatedAnnouncement,
    });
  } catch (error) {
    console.error("Error updating announcement:", error);
    res.status(500).json({ error: "Failed to update announcement" });
  }
};

export const deleteAnnouncement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if announcement exists
    const exists = await AnnouncementService.announcementExists(id);
    if (!exists) {
      res.status(404).json({ error: "Announcement not found" });
      return;
    }

    await AnnouncementService.deleteAnnouncement(id);
    res.status(200).send({
      message: "Announcement deleted successful",
    });
  } catch (error) {
    console.error("Error deleting announcement:", error);
    res.status(500).json({ error: "Failed to delete announcement" });
  }
};
