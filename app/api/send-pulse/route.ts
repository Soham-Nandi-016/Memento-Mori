import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { trusteeEmail, trusteeId, userEmail } = body;

    if (!trusteeEmail || !trusteeId || !userEmail) {
      return NextResponse.json(
        { error: "Missing required fields: trusteeEmail, trusteeId, userEmail" },
        { status: 400 }
      );
    }

    const verifyUrl = `http://localhost:3000/verify?id=${trusteeId}&user=${encodeURIComponent(userEmail)}`;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Memento Mori — Verification Pulse</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #0a0a0f;
      color: #e2e2ef;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      -webkit-font-smoothing: antialiased;
    }
  </style>
</head>
<body>
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0a0a0f; padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; width:100%;">

          <!-- Header glow bar -->
          <tr>
            <td style="height:2px; background:linear-gradient(90deg, transparent, #00f0ff, transparent); border-radius:999px;"></td>
          </tr>

          <!-- Logo / Brand -->
          <tr>
            <td align="center" style="padding:40px 48px 28px;">
              <p style="font-family:'Space Grotesk',sans-serif; font-size:11px; font-weight:600; letter-spacing:0.25em; color:#00f0ff; text-transform:uppercase; margin-bottom:12px;">
                MEMENTO MORI
              </p>
              <p style="font-family:'Space Grotesk',sans-serif; font-size:11px; letter-spacing:0.12em; color:rgba(255,255,255,0.3); text-transform:uppercase;">
                AUTONOMOUS DIGITAL LEGACY AGENT
              </p>
            </td>
          </tr>

          <!-- Main card -->
          <tr>
            <td style="padding:0 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#12121a; border-radius:16px; border:1px solid rgba(0,240,255,0.12); overflow:hidden;">

                <!-- Cyan accent bar -->
                <tr>
                  <td style="height:1px; background:linear-gradient(90deg, transparent 0%, rgba(0,240,255,0.5) 50%, transparent 100%);"></td>
                </tr>

                <!-- Card body -->
                <tr>
                  <td style="padding:48px 48px 40px;">

                    <!-- Icon circle -->
                    <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
                      <tr>
                        <td style="width:56px; height:56px; background:rgba(0,240,255,0.08); border:1px solid rgba(0,240,255,0.25); border-radius:14px; text-align:center; vertical-align:middle;">
                          <span style="font-size:24px;">🔐</span>
                        </td>
                      </tr>
                    </table>

                    <!-- Headline -->
                    <h1 style="font-family:'Space Grotesk',sans-serif; font-size:26px; font-weight:700; color:#ffffff; letter-spacing:-0.02em; margin-bottom:16px; line-height:1.2;">
                      Verification Pulse<br />
                      <span style="color:#00f0ff;">Received.</span>
                    </h1>

                    <!-- Body copy -->
                    <p style="font-size:14px; line-height:1.75; color:rgba(226,226,239,0.7); margin-bottom:12px;">
                      You have been designated as a <strong style="color:#e2e2ef;">Trusted Steward</strong> within a Memento Mori Digital Legacy Protocol.
                    </p>
                    <p style="font-size:14px; line-height:1.75; color:rgba(226,226,239,0.7); margin-bottom:32px;">
                      To activate your stewardship role and confirm your identity within the consensus network, you must complete verification below. This link is unique to your identity token.
                    </p>

                    <!-- Verify button -->
                    <table cellpadding="0" cellspacing="0" border="0" style="margin-bottom:40px;">
                      <tr>
                        <td style="border-radius:8px; background:linear-gradient(135deg, rgba(0,240,255,0.15) 0%, rgba(0,240,255,0.05) 100%); border:1px solid rgba(0,240,255,0.35); box-shadow:0 0 24px rgba(0,240,255,0.12);">
                          <a href="${verifyUrl}"
                            target="_blank"
                            style="display:inline-block; padding:14px 40px; font-family:'Space Grotesk',sans-serif; font-size:13px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:#00f0ff; text-decoration:none; white-space:nowrap;">
                            ⟶ &nbsp; VERIFY STEWARDSHIP
                          </a>
                        </td>
                      </tr>
                    </table>

                    <!-- Divider -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:32px;">
                      <tr>
                        <td style="height:1px; background:rgba(255,255,255,0.05);"></td>
                      </tr>
                    </table>

                    <!-- Token info block -->
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:rgba(0,0,0,0.3); border:1px solid rgba(255,255,255,0.05); border-radius:10px; margin-bottom:32px;">
                      <tr>
                        <td style="padding:20px 24px;">
                          <p style="font-family:'Space Grotesk',sans-serif; font-size:9px; font-weight:600; letter-spacing:0.2em; color:rgba(0,240,255,0.5); text-transform:uppercase; margin-bottom:12px;">IDENTITY VECTOR</p>
                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td style="font-size:11px; color:rgba(226,226,239,0.4); padding-bottom:6px; font-family:monospace;">TRUSTEE ID</td>
                              <td align="right" style="font-size:11px; color:rgba(226,226,239,0.7); padding-bottom:6px; font-family:monospace;">${trusteeId}</td>
                            </tr>
                            <tr>
                              <td style="font-size:11px; color:rgba(226,226,239,0.4); font-family:monospace;">PRINCIPAL</td>
                              <td align="right" style="font-size:11px; color:rgba(226,226,239,0.7); font-family:monospace;">${userEmail}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>

                    <!-- Warning copy -->
                    <p style="font-size:12px; line-height:1.7; color:rgba(226,226,239,0.35);">
                      If you did not expect this message, disregard it. No action is required. Your identity will not be registered without explicit verification.
                    </p>

                  </td>
                </tr>

                <!-- Bottom accent bar -->
                <tr>
                  <td style="height:1px; background:linear-gradient(90deg, transparent 0%, rgba(0,240,255,0.2) 50%, transparent 100%);"></td>
                </tr>

              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:32px 24px 16px;">
              <p style="font-size:11px; color:rgba(226,226,239,0.2); letter-spacing:0.08em; font-family:monospace; text-transform:uppercase;">
                MEMENTO MORI &nbsp;·&nbsp; AUTONOMOUS LEGACY PROTOCOL &nbsp;·&nbsp; ENCRYPTED TRANSMISSION
              </p>
            </td>
          </tr>

          <!-- Bottom glow bar -->
          <tr>
            <td style="height:1px; background:linear-gradient(90deg, transparent, rgba(0,240,255,0.2), transparent); border-radius:999px;"></td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const { data, error } = await resend.emails.send({
      from: "Memento Mori <onboarding@resend.dev>",
      to: [trusteeEmail],
      subject: "⟶ Verification Pulse — Memento Mori Legacy Protocol",
      html,
    });

    if (error) {
      console.error("[SEND-PULSE] Resend API error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("[SEND-PULSE] Email dispatched successfully. ID:", data?.id);
    return NextResponse.json({ success: true, emailId: data?.id }, { status: 200 });

  } catch (err: any) {
    console.error("[SEND-PULSE] Unhandled exception:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
