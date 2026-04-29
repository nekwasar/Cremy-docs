interface EmailTemplate {
  subject: string;
  html: string;
}

export function getVerificationEmailTemplate(
  verificationLink: string,
  userName: string
): EmailTemplate {
  return {
    subject: 'Verify your email address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Welcome, ${userName}!</h2>
        <p>Please verify your email address by clicking the link below:</p>
        <a href="${verificationLink}" style="display: inline-block; padding: 12px 24px; background: #0066cc; color: white; text-decoration: none; border-radius: 4px;">
          Verify Email
        </a>
        <p>This link expires in 24 hours.</p>
        <p>If you did not create an account, please ignore this email.</p>
      </div>
    `,
  };
}

export function getPasswordResetTemplate(
  resetLink: string,
  userName: string
): EmailTemplate {
  return {
    subject: 'Reset your password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset</h2>
        <p>Hello ${userName},</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background: #0066cc; color: white; text-decoration: none; border-radius: 4px;">
          Reset Password
        </a>
        <p>This link expires in 1 hour.</p>
        <p>If you did not request a password reset, please ignore this email.</p>
      </div>
    `,
  };
}

export function getCreditRewardTemplate(
  amount: number,
  userName: string
): EmailTemplate {
  return {
    subject: `${amount} Credits Added!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Congratulations, ${userName}!</h2>
        <p>${amount} credits have been added to your account.</p>
        <p>Start creating documents now!</p>
      </div>
    `,
  };
}

export function getCreditPurchaseTemplate(
  amount: number,
  price: number,
  userName: string
): EmailTemplate {
  return {
    subject: `Credit Purchase Confirmation`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Purchase Confirmed</h2>
        <p>Hello ${userName},</p>
        <p>${amount} credits have been added to your account for $${price}.</p>
      </div>
    `,
  };
}

export function getGiftEmailTemplate(
  senderName: string,
  amount: number,
  redemptionCode: string,
  recipientEmail: string
): EmailTemplate {
  return {
    subject: `${senderName} sent you ${amount} credits!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>You received ${amount} credits!</h2>
        <p>${senderName} has sent you ${amount} credits.</p>
        <p>Use code: <strong>${redemptionCode}</strong> to redeem.</p>
      </div>
    `,
  };
}