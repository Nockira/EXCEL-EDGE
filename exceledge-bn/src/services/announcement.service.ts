import { prisma } from "../utils/prisma.service";

interface AnnouncementCreateInput {
  title: string;
  content: string;
  authorId: string;
}

interface AnnouncementUpdateInput {
  title?: string;
  content?: string;
}

export const createAnnouncement = async (data: AnnouncementCreateInput) => {
  return prisma.announcement.create({
    data,
  });
};

export const findAllAnnouncements = async () => {
  return prisma.announcement.findMany({
    include: {
      author: {
        select: {
          id: true,
          firstName: true,
          secondName: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
};

export const findAnnouncementById = async (id: string) => {
  return prisma.announcement.findUnique({
    where: { id },
    include: {
      author: {
        select: {
          id: true,
          firstName: true,
        },
      },
    },
  });
};

export const updateAnnouncement = async (
  id: string,
  data: AnnouncementUpdateInput
) => {
  return prisma.announcement.update({
    where: { id },
    data,
  });
};
export const deleteAnnouncement = async (id: string) => {
  return prisma.announcement.delete({
    where: { id },
  });
};

export const announcementExists = async (id: string): Promise<boolean> => {
  const count = await prisma.announcement.count({
    where: { id },
  });
  return count > 0;
};
