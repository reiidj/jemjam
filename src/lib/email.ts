import nodemailer from "nodemailer";

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD,
      },
    });
  }
  return transporter;
}

export async function sendLetterSealedEmail({
  to,
  title,
  sender_name,
  deliver_at,
}: {
  to: string;
  title: string;
  sender_name: string;
  deliver_at: string;
}) {
  const unlockDate = new Date(deliver_at).toLocaleString("en-US", {
    timeZone: "Asia/Manila",
    dateStyle: "long",
    timeStyle: "short",
  });

  return getTransporter().sendMail({
    from: `"JemJam Postmaster" <${process.env.EMAIL_USER}>`,
    to,
    subject: `${sender_name} sealed a letter for you`,
    html: `
<div style="background-color:#EDE7DD; padding:48px 20px; font-family: Georgia, 'Times New Roman', serif;">
  <table role="presentation" width="100%" style="max-width:480px; margin:0 auto; border-collapse:collapse;">
    <tr>
      <td>

        <!-- Envelope back -->
        <div style="background-color:#F3ECE0; border:1px solid #D9CFC0; border-radius:2px; padding:0; position:relative;">

          <!-- Envelope flap -->
          <div style="height:0; border-left:240px solid transparent; border-right:240px solid transparent; border-top:90px solid #E4DACB; margin:0 auto;"></div>

          <!-- Letter paper, overlapping the flap -->
          <div style="background-color:#FFFDF9; margin:-40px 24px 0 24px; padding:36px 32px 32px 32px; box-shadow:0 8px 24px rgba(0,0,0,0.12); border:1px solid #EDE4D3; position:relative;">

            <!-- Wax seal -->
            <div style="width:48px; height:48px; background-color:#7B1113; border-radius:50%; margin:-58px auto 20px auto; box-shadow:0 3px 6px rgba(0,0,0,0.25); display:flex; align-items:center; justify-content:center;">
              <table role="presentation" width="100%" height="100%"><tr><td align="center" valign="middle" style="color:#F3ECE0; font-size:20px; line-height:48px;">&#9993;</td></tr></table>
            </div>

            <div style="text-align:center;">
              <span style="font-size:10px; text-transform:uppercase; letter-spacing:2px; color:#7B1113;">Digital Mailbox</span>

              <h2 style="font-size:24px; color:#1F1F1F; margin:14px 0 22px 0; font-weight:normal; font-style:italic;">
                &ldquo;${title}&rdquo;
              </h2>

              <p style="font-size:15px; line-height:1.7; color:#4A4A4A; margin:0 0 8px 0;">
                A sealed envelope from <strong>${sender_name}</strong> is waiting for you.
              </p>
              <p style="font-size:15px; line-height:1.7; color:#4A4A4A; margin:0 0 28px 0;">
                It unlocks on <strong>${unlockDate}</strong>.
              </p>

              <a href="https://your-domain.com/mailbox" style="display:inline-block; padding:12px 28px; background-color:#7B1113; color:#FFFDF9; text-decoration:none; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; border-radius:2px;">
                View Mailbox
              </a>
            </div>
          </div>

          <div style="height:16px;"></div>
        </div>

      </td>
    </tr>
  </table>
</div>`,
  });
}

export async function sendEventAlertEmail({
  to,
  title,
  location,
}: {
  to: string;
  title: string;
  location?: string | null;
}) {
  return getTransporter().sendMail({
    from: `"JemJam Archive" <${process.env.EMAIL_USER}>`,
    to,
    subject: `Upcoming Plan: ${title}`,
    html: `
<div style="background-color:#EDE7DD; padding:48px 20px; font-family: Georgia, 'Times New Roman', serif;">
  <table role="presentation" width="100%" style="max-width:480px; margin:0 auto; border-collapse:collapse;">
    <tr>
      <td>

        <div style="background-color:#FFFDF9; border:1px solid #EDE4D3; box-shadow:0 8px 24px rgba(0,0,0,0.12); position:relative; padding:36px 32px 32px 32px;">

          <!-- Ticket notch accent -->
          <div style="width:48px; height:48px; background-color:#7B1113; border-radius:50%; margin:-58px auto 20px auto; box-shadow:0 3px 6px rgba(0,0,0,0.25); display:flex; align-items:center; justify-content:center;">
            <table role="presentation" width="100%" height="100%"><tr><td align="center" valign="middle" style="color:#F3ECE0; font-size:18px; line-height:48px;">&#128197;</td></tr></table>
          </div>

          <div style="text-align:center;">
            <span style="font-size:10px; text-transform:uppercase; letter-spacing:2px; color:#7B1113;">Itinerary Alert</span>

            <h2 style="font-size:24px; color:#1F1F1F; margin:14px 0 18px 0; font-weight:normal; font-style:italic;">
              ${title}
            </h2>

            <!-- Dashed divider like a ticket stub -->
            <div style="border-top:1px dashed #D9CFC0; margin:0 0 20px 0;"></div>

            <p style="font-size:15px; line-height:1.7; color:#4A4A4A; margin:0 0 28px 0;">
              This is happening <strong>tomorrow</strong>${location ? `, at <strong>${location}</strong>` : ""}.
            </p>

            <a href="https://your-domain.com/events" style="display:inline-block; padding:12px 28px; background-color:#7B1113; color:#FFFDF9; text-decoration:none; font-size:11px; letter-spacing:1.5px; text-transform:uppercase; border-radius:2px;">
              View Itinerary
            </a>
          </div>
        </div>

      </td>
    </tr>
  </table>
</div>`,
  });
}
