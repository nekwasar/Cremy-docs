const BREVO_API_URL = 'https://api.brevo.com/v3';

export async function sendEmailViaBrevo(
  apiKey: string,
  email: {
    subject: string;
    htmlContent: string;
    sender: { email: string; name: string };
    to: Array<{ email: string; name?: string }>;
  }
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const response = await fetch(`${BREVO_API_URL}/smtp/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify(email),
    });

    const data = await response.json();
    if (!response.ok) {
      return { success: false, error: data.message || 'Brevo API error' };
    }

    return { success: true, messageId: data.messageId };
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : 'Failed' };
  }
}

export async function createBrevoContact(
  apiKey: string,
  email: string,
  attributes: Record<string, string> = {}
): Promise<{ success: boolean }> {
  try {
    await fetch(`${BREVO_API_URL}/contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({ email, attributes }),
    });
    return { success: true };
  } catch {
    return { success: false };
  }
}
