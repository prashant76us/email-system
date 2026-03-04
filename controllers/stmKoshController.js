import pool from "../config/db.js";
import mg from "../config/mailgun.js";
import logger from "../utils/logger.js";
import { stmKoshEmailTemplate } from "../templates/stmKoshEmailTemplate.js";
import { sendEmailsInBatches } from "../utils/batchEmailSender.js";

/**
 * Send Single STM & Kosh App Invitation
 * (Direct — No batching)
 */
export const sendSingleStmKosh = async (req, res) => {
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

    // Event details
    const eventDetails = {
      topic: "The Stressless Trading Method (STM) & Kosh App",
      date: "13th February 2026 (Friday)",
      time: "7:00 PM – 8:30 PM (IST)",
      speakers: ["Abhinav Panchal", "Nishant Upadhyay"],
      zoomLink: "https://us05web.zoom.us/j/3912888289?pwd=as6RTSmbj6RtZMKRqnRge86Jm4Jr9R.1",
      communityLink: "https://chat.whatsapp.com/B79yCAm61fOH00Ip2DEWjd",
    };

    const unsubscribeLink = `${process.env.UNSUBSCRIBE_URL}?email=${encodeURIComponent(
      user.email
    )}&id=${user.id}`;
    const htmlContent = stmKoshEmailTemplate({
      name: user.name,
      ...eventDetails,
      unsubscribeLink,
    });

    await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: process.env.FROM_EMAIL,
      to: user.email,
      subject: ` ${eventDetails.topic} – Build Stressless Wealth`,
      html: htmlContent,
    });

    logger.info(`✅ STM & Kosh invite sent successfully to ${user.email}`);
    return res.status(200).json({ message: `Invite sent to ${user.email}` });
  } catch (err) {
    logger.error(`❌ STM & Kosh single send failed: ${err.message}`);
    return res
      .status(500)
      .json({ message: "Failed to send email", error: err.message });
  }
};

/**
 * Bulk STM & Kosh Invitations (DB Users)
 * ✅ Uses universal batch sender
 */
export const sendBulkStmKosh = async (req, res) => {
  try {
    const [users] = await pool.query(
      "SELECT id, name, email FROM dd_user_webinar"
    );

    if (!users.length) {
      return res.status(404).json({ message: "No users found in database" });
    }

    const eventDetails = {
      topic: "The Stressless Trading Method (STM) & Kosh App",
      date: "13th February 2026 (Friday)",
      time: "7:00 PM – 8:30 PM (IST)",
      speakers: ["Abhinav Panchal", "Nishant Upadhyay"],
      zoomLink:
        "https://us05web.zoom.us/j/3912888289?pwd=as6RTSmbj6RtZMKRqnRge86Jm4Jr9R.1",
      communityLink: "https://chat.whatsapp.com/B79yCAm61fOH00Ip2DEWjd",
    };

    // Email sender for each user
    const sendEmailFn = async (user) => {
      const unsubscribeLink = `${process.env.UNSUBSCRIBE_URL}?email=${encodeURIComponent(
        user.email
      )}&id=${user.id}`;
      const htmlContent = stmKoshEmailTemplate({
        name: user.name,
        ...eventDetails,
        unsubscribeLink,
      });

      await mg.messages.create(process.env.MAILGUN_DOMAIN, {
        from: process.env.FROM_EMAIL,
        to: user.email,
        subject: `${eventDetails.topic} – Build Stressless Wealth`,
        html: htmlContent,
      });

      logger.info(`✅ STM & Kosh email sent to ${user.email}`);
    };

    // Use universal batch sender
    const results = await sendEmailsInBatches({
      emails: users, // users array, not just emails
      batchSize: parseInt(process.env.BATCH_SIZE) || 100,
      delayMs: parseInt(process.env.BATCH_DELAY_MS) || 1500,
      sendEmailFn,
      logger,
    });

    return res.status(200).json({
      message: "STM & Kosh bulk email process completed (with batching)",
      total: users.length,
      sent: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success),
    });
  } catch (err) {
    logger.error(`❌ STM & Kosh bulk send failed: ${err.message}`);
    return res
      .status(500)
      .json({ message: "Bulk email failed", error: err.message });
  }
};

/**
 * External Emails (Not in DB)
 * ✅ Uses universal batch sender
 */
export const sendExternalStmKosh = async (req, res) => {
  try {
    const fs = await import("fs");
    const path = await import("path");
    const filePath = path.join(process.cwd(), "externalEmails.txt");

    if (!fs.existsSync(filePath)) {
      return res
        .status(404)
        .json({ message: "externalEmails.txt file not found" });
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

    const eventDetails = {
      topic: "The Stressless Trading Method (STM) & Kosh App",
      date: "13th February 2026 (Friday)",
      time: "7:00 PM – 8:30 PM (IST)",
      speakers: ["Abhinav Panchal", "Nishant Upadhyay"],
      zoomLink:
        "https://us05web.zoom.us/j/3912888289?pwd=as6RTSmbj6RtZMKRqnRge86Jm4Jr9R.1",
      communityLink: "https://chat.whatsapp.com/B79yCAm61fOH00Ip2DEWjd",
    };

    // Email sender for external users
    const sendEmailFn = async (email) => {
      const unsubscribeLink = `${process.env.UNSUBSCRIBE_URL}?email=${encodeURIComponent(
        email
      )}`;
      const htmlContent = stmKoshEmailTemplate({
        name: "Participant",
        ...eventDetails,
        unsubscribeLink,
      });

      await mg.messages.create(process.env.MAILGUN_DOMAIN, {
        from: process.env.FROM_EMAIL,
        to: email,
        subject: ` ${eventDetails.topic} – Build Stressless Wealth`,
        html: htmlContent,
      });

      logger.info(`✅ STM & Kosh external email sent to ${email}`);
    };

    // Use universal batch sender
    const results = await sendEmailsInBatches({
      emails: allEmails,
      batchSize: parseInt(process.env.BATCH_SIZE) || 100,
      delayMs: parseInt(process.env.BATCH_DELAY_MS) || 1500,
      sendEmailFn,
      logger,
    });

    return res.status(200).json({
      message: "STM & Kosh external email process completed (with batching)",
      total: allEmails.length,
      sent: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success),
    });
  } catch (err) {
    logger.error(`❌ STM & Kosh external send failed: ${err.message}`);
    return res
      .status(500)
      .json({ message: "External email failed", error: err.message });
  }
};

export default {
  sendSingleStmKosh,
  sendBulkStmKosh,
  sendExternalStmKosh,
};
