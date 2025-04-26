import { prisma } from "../utils/prisma.service";
import { sendEmail } from "../utils/sendEmail";

export const sendContactRequest = async (data: any, io: any) => {
  const notification = await prisma.notification.create({
    data: {
      type: "contact_request",
      message: `New message from ${data.name}`,
    },
  });
  // Emit socket.io event
  io("new_contact_request", notification);
  if (data.email) {
    await sendEmail({
      to: data.email,
      subject: "We received your message!",
      html: `<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
  <p>Hi <strong style="color: #2c3e50;">${data.name}</strong>,</p>

  <p>Thank you for reaching out to us. We truly appreciate you taking the time to contact Exceledge. One of our team members will review your message and get back to you as soon as possible.</p>

  <p>If your matter is urgent, feel free to email us directly at <a href="mailto:support@exceledge.com" style="color: #007bff;">support@exceledge.com</a>.</p>

  <p>Warm regards,</p>
  <p><strong>Exceledge Support Team</strong></p>

  <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />

  <footer style="font-size: 12px; color: #888;">
    <p>Exceledge</p>
    <p>142 KK 718 St, Kigali, Rwanda</p>
    <p><a href="mailto:support@exceledge.com" style="color: #888;">support@exceledge.com</a> | <a href="https://exceledge.com" style="color: #888;">www.exceledge.com</a></p>
  </footer>
</div>
`,
    });
  }

  await sendEmail({
    to: process.env.FROM_EMAIL_TO!,
    subject: "New Contact Request",
    html: `<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
  <p><strong style="color: #2c3e50;">${data.name}</strong> with phone number <strong style="color: #2c3e50;">${data.phone}</strong> </strong> with phone number <strong style="color: #2c3e50;">${data.email}</strong>  has sent you a message.</p>
  <p style="margin-top: 10px;">"${data.message}"</p>

  <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;" />

  <footer style="font-size: 12px; color: #888;">
    <p>Exceledge</p>
    <p>42 KK 718 St, Kigali, Rwanda</p>
    <p>Need help? Contact us at <a href="mailto:support@exceledge.com" style="color: #888;">support@exceledge.com</a></p>
  </footer>
</div>`,
  });
  return notification;
};

export const fetchAllNotification = () =>
  prisma.notification.findMany({
    orderBy: { createdAt: "desc" },
  });
export const fetchUnreadNotification = () =>
  prisma.notification.findMany({
    where: { isRead: false },
  });
export const fetchNotificationById = (id: string) =>
  prisma.notification.findUnique({ where: { id } });
export const modifyNotification = (id: string, data: any) =>
  prisma.notification.update({ where: { id }, data });
export const removeNotification = (id: string) =>
  prisma.notification.delete({ where: { id } });
