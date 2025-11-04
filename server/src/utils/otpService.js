import twilio from "twilio";
import axios from "axios"

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendSMS = async (phoneNumber, message) => {
  try {
    const result = await client.messages.create({
      body: `Your OTP is ${message}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber
    });

    console.log("✅ SMS sent via Twilio to", phoneNumber);
    return result;
  } catch (error) {
    console.error("❌ Twilio SMS error:", error);
    throw new Error("Failed to send SMS via Twilio");
  }
};

const WHATSAPP_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const WHATSAPP_BUSINESS_ACCOUNT_ID = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID

async function sendOTP(to, otp) {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v24.0/${PHONE_NUMBER_ID}/messages`,
      {
        messaging_product: "whatsapp",
        to: to,
        type: "template",
        template: {
          name: "whatsapp_otp", // your approved template name
          language: { code: "en" },
          components: [
            {
              type: "body",
              parameters: [
                {
                  type: "text",
                  text: otp, // OTP to send
                },
              ],
            },
            {
              "type": "button",
              "sub_type": "url",
              "index": "0",
              "parameters": [
                {
                  "type": "text",
                  "text": otp
                }
              ]
            }
          ],
        },
      },
      {
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ OTP sent successfully:", response.data);
  } catch (err) {
    console.error("❌ Error sending OTP:", err.response?.data || err.message);
  }
}


export {
  generateOTP,
  sendSMS,
  sendOTP
};