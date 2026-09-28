import { Message } from "../models/messageSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { sendEmail } from "../utils/sendEmail.js";
import { sendWhatsAppContactNotification } from "../utils/whatsapp.js";

export const sendMessage = catchAsyncErrors(async (req, res, next) => {
  const { senderName, subject, message, email, phone } = req.body;
  if (!senderName || !subject || !message) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }
  const data = await Message.create({ senderName, subject, message, email, phone });

  const contactLines = [
    email && `Email: ${email}`,
    phone && `Phone: ${phone}`,
  ].filter(Boolean);
  const contactInfo = contactLines.length ? `\n\n${contactLines.join("\n")}` : "";

  try {
    await sendEmail({
      email: "gs9965416@gmail.com",
      subject: `New Portfolio Message: ${subject}`,
      message: `You have received a new message from ${senderName} via your portfolio contact form.\n\nSubject: ${subject}\n\nMessage:\n${message}${contactInfo}`,
    });
  } catch (error) {
    console.error("Email Sending Error:", error);
    // We don't return next(error) here because the message was already saved to DB successfully
  }

  try {
    // Fold email/phone into the message body rather than the approved
    // template's parameters, so adding them doesn't require re-submitting
    // the template for another Meta review cycle.
    await sendWhatsAppContactNotification({
      senderName,
      subject,
      message: `${message}${contactInfo}`,
    });
  } catch (error) {
    console.error("WhatsApp Notification Error:", error.message);
    // Same as email above — the message is already saved, don't fail the request over this.
  }

  res.status(201).json({
    success: true,
    message: "Message Sent",
    data,
  });
});

export const deleteMessage = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const message = await Message.findById(id);
  if (!message) {
    return next(new ErrorHandler("Message Already Deleted!", 400));
  }
  await message.deleteOne();
  res.status(201).json({
    success: true,
    message: "Message Deleted",
  });
});

export const getAllMessages = catchAsyncErrors(async (req, res, next) => {
  const messages = await Message.find();
  res.status(201).json({
    success: true,
    messages,
  });
});
