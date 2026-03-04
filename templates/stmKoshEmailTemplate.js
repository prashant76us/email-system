// templates/emails/stmKoshEmailTemplate.js

export const stmKoshEmailTemplate = ({
    name, 
    topic,
    date,
    time,
    speakers,
    zoomLink,
    communityLink, 
    unsubscribeLink }) => `
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
  border: 1px solid #0057a7;
}
.header {
  background-color: #0056b3;
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
  line-height: 22px;
  background-color: #ffffff;
}
.highlight {
  font-weight: bold;
  color: #002434;
}
.button-container {
  text-align: center;
  margin: 20px 0;
  color: #0057a7;
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
    <div class="header">Exclusive Online Event</div>
    <div class="content">
      <p>Hi ${name || "Participant"},</p>
      <p style="text-align: center;">Join The <b>Stressless Trading Method</b> Webinar</p>
      <p>Generate consistent income and recover losses automatically<br>
—whether the market rises or falls</p>
      

      <p class="highlight">Topic: ${topic}</p>
      <p class="highlight">🗓️ When: ${date}</p>
      <p class="highlight">⏰ Time: ${time}</p>
      <p class="highlight">🎙️ Speakers: ${speakers?.join(" & ")}</p>
      
      <div class="button-container">
        <a href="${zoomLink}" class="btn" target="_blank"><b>👉 Join the Webinar</b></a>
      </div>

      <p class="highlight">Why You Shouldn’t Miss This</p>
      <p>
        <b>💡 Steady Monthly Income Without Stress</b><br>
        Discover how the Stressless Trading Method (STM) turns market chaos into consistent income — with no panic, no over trading, and no late-night chart watching.
      </p>
      <p>
       <b>📱 Kosh App Live Demo</b><br>
        See how Kosh automates trading, recovers losses automatically, and creates “Extra Cash” during downturns. Zero prior market knowledge required.
      </p>
      <p>
        <b>🎤 Ask Experts, Get Real Answers</b><br>
        Skip the jargon. <b>Abhinav & Nishant</b> will break it down simply and directly — so you leave with clarity, not confusion.
      </p>

      <p>✨ If you want to grow wealth without making trading your full-time job, this session is for you.</p>

      <p style="text-align:center;">📌 Mark your calendar: 13th February, Friday at 7 PM.</p>

      <div class="button-container">
        <a href="${communityLink}" class="btn" target="_blank">👉 Join the Stressless Wealth Community</a>
      </div>
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
