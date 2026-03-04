// templates/emails/webinarInvitation.js

export const webinarInvitationTemplate = ({ name, webinarTopic, webinarDate, registrationLink }) => `
  <p>Dear ${name || "Participant"},</p>
  <p>You are invited to our webinar: <strong>${webinarTopic}</strong> scheduled on <strong>${webinarDate}</strong>.</p>
  <p>Register here: <a href="${registrationLink}">${registrationLink}</a></p>
  <p>Thank you,<br/>Dozen Diamonds Team</p>
  <hr/>
  <p>If you do not wish to receive emails, <a href="${process.env.UNSUBSCRIBE_URL}">unsubscribe here</a>.</p>
`;
