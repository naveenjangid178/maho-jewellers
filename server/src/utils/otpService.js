import twilio from "twilio";

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

export {
  generateOTP,
  sendSMS
};