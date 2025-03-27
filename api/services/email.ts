import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (
  to: string,
  subject: string,
  content: string
) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Megarray <notifications@megarray.com>',
      to,
      subject,
      html: content,
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};