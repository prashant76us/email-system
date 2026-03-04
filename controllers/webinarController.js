// controllers/webinarController.js
import pool from "../config/db.js";
import mg from "../config/mailgun.js";
import logger from "../utils/logger.js";
import { webinarSingleEmailTemplate } from "../templates/emails/webinarSingleEmail.js";
import { sendEmailsInBatches } from "../utils/batchEmailSender.js";

/**
 * Send Single Webinar Invitation
 * (Direct — No batching)
 */
export const sendSingleWebinar = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Fetch user details from database
    const [userRows] = await pool.query(
      "SELECT id, name, email FROM dd_user_webinar WHERE email = ?",
      [email]
    );

    if (!userRows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userRows[0];

    // Webinar details
    const webinarDetails = {
      webinarTopic: "White-box vs Black-box Algorithms, Which will survive widespread market adoption?",
      webinarDate: "23rd December 2025 (Tuesday)",
      webinarTime: "7:00 PM – 8:30 PM (IST)",
      zoomLink:
        "https://us05web.zoom.us/j/3912888289?pwd=as6RTSmbj6RtZMKRqnRge86Jm4Jr9R.1",
      speakers: [
        "👥 Instructor Team",
        "📈 Customer Service Team",
      ],
      communityLink: "https://chat.whatsapp.com/B79yCAm61fOH00Ip2DEWjd",
    };

    const unsubscribeLink = `${process.env.UNSUBSCRIBE_URL}?email=${encodeURIComponent(
      user.email
    )}&id=${user.id}`;

    const htmlContent = webinarSingleEmailTemplate({
      name: user.name,
      ...webinarDetails,
      unsubscribeLink,
    });

    await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: process.env.FROM_EMAIL,
      to: user.email,
      subject: `${webinarDetails.webinarTopic} on ${webinarDetails.webinarDate}`,
      html: htmlContent,
    });

    logger.info(`✅ Webinar invite sent successfully to ${user.email}`);
    return res.status(200).json({ message: `Invite sent to ${user.email}` });
  } catch (err) {
    logger.error(`❌ Webinar single send failed: ${err.message}`);
    return res
      .status(500)
      .json({ message: "Failed to send email", error: err.message });
  }
};

/**
 * Bulk Webinar Invitations (DB Users)
 * ✅ Uses universal batch sender
 */
export const sendBulkWebinar = async (req, res) => {
  try {
    const [users] = await pool.query(
      "SELECT id, name, email FROM dd_user_webinar"
    );

    if (!users.length) {
      return res.status(404).json({ message: "No users found in database" });
    }
//only change here 
    const webinarDetails = {
     webinarTopic: "White-box vs Black-box Algorithms, Which will survive widespread market adoption?",
      webinarDate: "23rd December 2025 (Tuesday)",
      webinarTime: "7:00 PM – 8:30 PM (IST)",
      zoomLink:
        "https://us05web.zoom.us/j/3912888289?pwd=as6RTSmbj6RtZMKRqnRge86Jm4Jr9R.1",
      speakers: [
        "👥 Instructor Team",
        "📈 Customer Service Team",
      ],
      communityLink: "https://chat.whatsapp.com/B79yCAm61fOH00Ip2DEWjd",
    };

    const sendEmailFn = async (user) => {
      const unsubscribeLink = `${process.env.UNSUBSCRIBE_URL}?email=${encodeURIComponent(
        user.email
      )}&id=${user.id}`;

      const htmlContent = webinarSingleEmailTemplate({
        name: user.name,
        ...webinarDetails,
        unsubscribeLink,
      });

      await mg.messages.create(process.env.MAILGUN_DOMAIN, {
        from: process.env.FROM_EMAIL,
        to: user.email,
        subject: `${webinarDetails.webinarTopic} on ${webinarDetails.webinarDate}`,
        html: htmlContent,
      });

      logger.info(`✅ Webinar email sent to ${user.email}`);
    };

    // Use batch sender utility
    const results = await sendEmailsInBatches({
      emails: users,
      batchSize: parseInt(process.env.BATCH_SIZE) || 100,
      delayMs: parseInt(process.env.BATCH_DELAY_MS) || 1500,
      sendEmailFn,
      logger,
    });

    return res.status(200).json({
      message: "Webinar bulk email process completed (with batching)",
      total: users.length,
      sent: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success),
    });
  } catch (err) {
    logger.error(`❌ Webinar bulk send failed: ${err.message}`);
    return res
      .status(500)
      .json({ message: "Bulk email failed", error: err.message });
  }
};

/**
 * External Webinar Invitations (Not in DB)
 * ✅ Uses universal batch sender
 */
export const sendExternalWebinar = async (req, res) => {
  try {
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.join(process.cwd(), "externalWebinarEmails.txt");

    if (!fs.existsSync(filePath)) {
      return res
        .status(404)
        .json({ message: "externalWebinarEmails.txt file not found" });
    }

    const content = fs.readFileSync(filePath, "utf8");
    const allEmails = content
      .split(/\r?\n/)
      .map((e) => e.trim())
      .filter(Boolean);

    if (!allEmails.length) {
      return res
        .status(404)
        .json({ message: "No external emails found in file" });
    }

    const webinarDetails = {
      webinarTopic: "White-box vs Black-box Algorithms, Which will survive widespread market adoption?",
      webinarDate: "23rd December 2025 (Tuesday)",
      webinarTime: "7:00 PM – 8:30 PM (IST)",
      zoomLink:
        "https://us05web.zoom.us/j/3912888289?pwd=as6RTSmbj6RtZMKRqnRge86Jm4Jr9R.1",
      speakers: [
        "👥 Instructor Team",
        "📈 Customer Service Team",
      ],
      communityLink: "https://chat.whatsapp.com/B79yCAm61fOH00Ip2DEWjd",
    };

    const sendEmailFn = async (email) => {
      const unsubscribeLink = `${process.env.UNSUBSCRIBE_URL}?email=${encodeURIComponent(
        email
      )}`;
      const htmlContent = webinarSingleEmailTemplate({
        name: "Participant",
        ...webinarDetails,
        unsubscribeLink,
      });

      await mg.messages.create(process.env.MAILGUN_DOMAIN, {
        from: process.env.FROM_EMAIL,
        to: email,
        subject: `${webinarDetails.webinarTopic} on ${webinarDetails.webinarDate}`,
        html: htmlContent,
      });

      logger.info(`✅ Webinar external email sent to ${email}`);
    };

    const results = await sendEmailsInBatches({
      emails: allEmails,
      batchSize: parseInt(process.env.BATCH_SIZE) || 100,
      delayMs: parseInt(process.env.BATCH_DELAY_MS) || 1500,
      sendEmailFn,
      logger,
    });

    return res.status(200).json({
      message: "Webinar external email process completed (with batching)",
      total: allEmails.length,
      sent: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success),
    });
  } catch (err) {
    logger.error(`❌ Webinar external send failed: ${err.message}`);
    return res
      .status(500)
      .json({ message: "External email failed", error: err.message });
  }
};

export default {
  sendSingleWebinar,
  sendBulkWebinar,
  sendExternalWebinar,
};
