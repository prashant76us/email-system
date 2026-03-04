// templates/emails/webinarReminder.js

export const webinarReminderTemplate = ({ name, webinarTopic, webinarDate, registrationLink }) => `
  <p>Hello ${name || "Participant"},</p>
  <p>This is a friendly reminder for our webinar: <strong>${webinarTopic}</strong> happening on <strong>${webinarDate}</strong>.</p>
  <p>Make sure to join: <a href="${registrationLink}">${registrationLink}</a></p>
  <p>We look forward to your participation!<br/>Dozen Diamonds Team</p>
  <hr/>
  <p>If you do not wish to receive emails, <a href="${process.env.UNSUBSCRIBE_URL}">unsubscribe here</a>.</p>
`;
