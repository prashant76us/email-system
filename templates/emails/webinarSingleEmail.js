// templates/emails/webinarSingleEmail.js

export const webinarSingleEmailTemplate = ({
  name,
  webinarTopic,
  webinarDate,
  webinarTime,
  zoomLink,
  speakers,
  communityLink,
}) => `
<html>
<head>
<style>
body {
    font-family: Arial, sans-serif;
    background-color: #e0f5ff;
    margin: 0;
    padding: 0;
    color: #000000;
}
.container {
    background-color: #f5f5f5;
    max-width: 600px;
    margin: 20px auto;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid #114769;
}
.header {
    background-color: #114769;
    color: #ffffff;
    padding: 15px;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
}
.content {
    padding: 20px;
    color: #000000;
    font-size: 16px;
    line-height: 20px;
    background-color: #ffffff;
}
.highlight {
    font-weight: bold;
    color: #002434;
}
.button-container {
    text-align: center;
    margin: 20px 0;
}
.btn {
    background-color: #f2f2f2;
    color: #0057a7;
    padding: 12px 24px;
    font-size: 16px;
    border: 1px solid #b3b3b3;
    border-radius: 6px;
    cursor: pointer;
    text-decoration: none;
    display: inline-block;
}
.btn:hover {
    background-color: #003d80;
    color: #ffffff;
    cursor: pointer;
}
.footer {
    background-color: #f1f1f1;
    text-align: center;
    padding: 12px;
    font-size: 13px;
    color: #666;
    border-top: 1px solid #abaaaa;
}
/* Dark mode overrides */
@media (prefers-color-scheme: dark) {
    body, .content {
        background-color: #1a1a1a !important;
        color: #ffffff !important;
    }
    .highlight {
        color: #ffcc00 !important;
    }
    .container {
        background-color: #2a2a2a !important;
        border-color: #666666 !important;
    }
    .header {   
        background-color: #004080 !important;
        color: #ffffff !important;
    }
    a, a b {
        color: #4da6ff !important;
    }
}
</style>
</head>
<body>
<div class="container">
    <div class="header">Exclusive Online Debate</div>
    <div class="content">
        <p>Dear ${name || "User"},</p>

<p class="highlight">🎯 Debate Topic:  ${webinarTopic}</p>
<p>Some say white-box models will prevail because transparency builds trust.
Others argue black-box algorithms will dominate through pure predictive power.</p>

<p>So who’s right?</p>
<p>Join the debate live on <br>
<p class="highlight">🗓️ Date: ${webinarDate}</p>
<p class="highlight">⏰ Time: ${webinarTime}</p>
<p>for Semifinal Eliminator 2: <b>👥 Instructor Team</b> Vs. <b>📈 Customer Service Team </b> —a clash for a spot in the Grand Finale.</p>

<p>🔗 <b>Join live on Zoom:</b> <a href="${zoomLink}" target="_blank">${zoomLink}</a></p>

 👉Join the Stressless Wealth  Community: <a href="${communityLink}" target="_blank">${communityLink}</a></p>
 
 <p>Warm regards,<br>
<b>Team Dozen Diamonds<b></p>
</div>

    <div class="footer">
        You are receiving this email because you registered for our webinars.<br/>
        Dozen Diamonds, ${process.env.COMPANY_ADDRESS}.<br/>
        <a href="${process.env.UNSUBSCRIBE_URL}">Unsubscribe</a>
    </div>
</div>
</body>
</html>
`;
