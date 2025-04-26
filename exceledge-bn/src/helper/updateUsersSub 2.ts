import { ServiceType } from "../../types";
import { prisma } from "../utils/prisma.service";

export const updateUserSubscription = async (
  userId: string,
  service: ServiceType,
  isActive: boolean
) => {
  const updateData: any = {};

  switch (service) {
    case "TIN_MANAGEMENT":
      updateData.isSubscribedToTin = isActive;
      break;
    case "BOOKS":
      updateData.isPurchasedBook = isActive;
      break;
    case "GOOGLE_LOCATION":
      updateData.hasGoogleLocationAccess = isActive;
      break;
  }

  await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });
};
