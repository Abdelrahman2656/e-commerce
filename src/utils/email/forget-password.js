export const forgetPasswordHtml = ( otp, recipientName = "User") => {
    return `
     <html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verification Code Email</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .email-container {
            background: #ffffff;
            max-width: 600px;
            margin: auto;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .email-header {
            text-align: center;
            padding: 20px;
            background-color: #f9f9f9;
            border-bottom: 1px solid #eaeaea;
        }
        .email-header img {
            max-width: 50px;
            margin-bottom: 10px;
        }
        .email-content {
            padding: 20px;
            text-align: center;
        }
        .email-content h1 {
            font-size: 24px;
            margin-bottom: 10px;
            color: #333333;
        }
        .verification-code {
            font-size: 36px;
            font-weight: bold;
            color: #333;
            background: #f0f0f0;
            padding: 10px 20px;
            border-radius: 8px;
            display: inline-block;
            margin: 20px 0;
        }
        .email-footer {
            text-align: center;
            padding: 15px;
            font-size: 14px;
            color: #666666;
            background-color: #f9f9f9;
            border-top: 1px solid #eaeaea;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <img src="../../../Images/download.png" width="50%" alt="Logo">
        </div>
        <div class="email-content">
            <h1>Hi${recipientName} ,</h1>
            <p>This is your one-time verification code.</p>
            <div class="verification-code">${otp}</div>
            <p>This code is only active for the next 5 minutes. Once the code expires, you will have to resubmit a request for a code.</p>
        </div>
        <div class="email-footer">
            Keep making awesome stuff!<br>
            UIDux
        </div>
    </div>
</body>
</html>
    `;
  };