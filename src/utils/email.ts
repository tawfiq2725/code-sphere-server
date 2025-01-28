const emailTemplate = (isTutor: boolean) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: ${isTutor ? "#4CAF50" : "#FF5722"};
      color: #ffffff;
      padding: 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 20px;
    }
    .content h2 {
      font-size: 20px;
      margin-bottom: 10px;
    }
    .content p {
      font-size: 16px;
      color: #555555;
    }
    .footer {
      background-color: #f9f9f9;
      padding: 15px;
      text-align: center;
      font-size: 12px;
      color: #888888;
    }
    .footer strong {
      color: #555555;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <!-- Header -->
    <div class="header">
      <h1>${isTutor ? "Congratulations!" : "Application Update"}</h1>
    </div>
    <!-- Content -->
    <div class="content">
      <h2>${isTutor ? "You're Approved!" : "We're Sorry to Inform You"}</h2>
      <p>
        ${
          isTutor
            ? "We are thrilled to inform you that your application to become a tutor on Code Sphere has been approved. Welcome aboard! We look forward to your contribution to our community of learners."
            : "Unfortunately, your application to become a tutor on Code Sphere was not approved at this time. We appreciate your interest and encourage you to reapply in the future after enhancing your qualifications."
        }
      </p>
      ${
        isTutor
          ? `
      <p>
        Please log in to your account to access your tutor dashboard and start setting up your profile.
      </p>
      `
          : ""
      }
    </div>
    <!-- Footer -->
    <div class="footer">
      <p>This email was sent from your account at <strong>Code Sphere</strong>.</p>
    </div>
  </div>
</body>
</html>
`;

export default emailTemplate;
