// utils/batchEmailSender.js
import pLimit from "p-limit";

/**
 * Universal Email Batch Sender
 * ------------------------------------------------------
 * - Handles batching + concurrency + delay between batches.
 * - Ensures safe sending rate to avoid spam flags.
 * - Works across all controllers (webinar, stmKosh, etc.).
 *
 * @param {Object} options
 * @param {Array} options.emails - List of email addresses or user objects
 * @param {number} [options.batchSize=100] - Emails per batch
 * @param {number} [options.delayMs=1000] - Delay between batches in ms
 * @param {function} options.sendEmailFn - Function that sends one email
 * @param {object} [options.logger] - Optional logger for info/error
 * @param {number} [options.concurrency=10] - Max concurrent sends per batch
 * @returns {Promise<Array>} - Array of results (email, success, error)
 */

export async function sendEmailsInBatches({
  emails,
  batchSize = parseInt(process.env.BATCH_SIZE) || 100,
  delayMs = parseInt(process.env.BATCH_DELAY_MS) || 1000,
  sendEmailFn,
  logger,
  concurrency = parseInt(process.env.MAX_CONCURRENT_REQUESTS) || 10,
}) {
  if (!emails || !emails.length) {
    throw new Error("No emails provided for batching.");
  }
  if (typeof sendEmailFn !== "function") {
    throw new Error("sendEmailFn must be a function.");
  }

  const totalBatches = Math.ceil(emails.length / batchSize);
  const limit = pLimit(concurrency);
  const results = [];

  logger?.info(
    `🚀 Starting batch process for ${emails.length} emails | Batch Size: ${batchSize} | Concurrency: ${concurrency}`
  );

  for (let i = 0; i < emails.length; i += batchSize) {
    const batch = emails.slice(i, i + batchSize);
    const batchNumber = Math.floor(i / batchSize) + 1;
    logger?.info(`📦 Sending Batch ${batchNumber} of ${totalBatches} (${batch.length} emails)`);

    const batchResults = await Promise.all(
      batch.map((email) =>
        limit(async () => {
          try {
            await sendEmailFn(email);
            return { email, success: true };
          } catch (err) {
            logger?.error?.(`❌ Failed for ${email}: ${err.message}`);
            return { email, success: false, error: err.message };
          }
        })
      )
    );

    results.push(...batchResults);

    if (i + batchSize < emails.length) {
      logger?.info(`⏳ Waiting ${delayMs / 1000}s before next batch...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  const successCount = results.filter((r) => r.success).length;
  const failCount = results.length - successCount;

  logger?.info(
    `✅ Batch process completed | Sent: ${successCount} | Failed: ${failCount} | Total: ${results.length}`
  );

  return results;
}
