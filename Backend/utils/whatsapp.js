const GRAPH_VERSION = "v21.0";

// Sends the approved "notification" template to the admin's WhatsApp number
// via the Cloud API. Throws on failure — callers should catch this the same
// way they already catch sendEmail() failures (log, don't block the request).
export const sendWhatsAppContactNotification = async ({ senderName, subject, message }) => {
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const to = process.env.WHATSAPP_ADMIN_PHONE_NUMBER;
  const templateName = process.env.WHATSAPP_TEMPLATE_NOTIFICATION;
  const languageCode = process.env.WHATSAPP_TEMPLATE_LANGUAGE || "en";

  if (!phoneNumberId || !token || !to || !templateName) {
    throw new Error(
      "WhatsApp is not fully configured (missing WHATSAPP_PHONE_NUMBER_ID / WHATSAPP_ACCESS_TOKEN / WHATSAPP_ADMIN_PHONE_NUMBER / WHATSAPP_TEMPLATE_NOTIFICATION)."
    );
  }

  const body = {
    messaging_product: "whatsapp",
    to,
    type: "template",
    template: {
      name: templateName,
      language: { code: languageCode },
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: senderName },
            { type: "text", text: subject },
            { type: "text", text: message },
          ],
        },
      ],
    },
  };

  const res = await fetch(
    `https://graph.facebook.com/${GRAPH_VERSION}/${phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
  );

  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      data?.error?.error_user_msg || data?.error?.message || "Failed to send WhatsApp notification."
    );
  }
  return data;
};
