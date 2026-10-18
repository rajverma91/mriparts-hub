// const nodemailer = require('nodemailer');
// require('dotenv').config();

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: Number(process.env.SMTP_PORT),
//   secure: false,
//   auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
// });

// async function sendResetEmail(to, resetUrl) {
//   await transporter.sendMail({
//     from: process.env.MAIL_FROM,
//     to,
//     subject: 'Reset your MRI Parts Hub password',
//     html: `
//       <h2>Password Reset</h2>
//       <p>Click the link below to reset your password. It expires in 1 hour.</p>
//       <p><a href="${resetUrl}">${resetUrl}</a></p>
//       <p>If you didn't request this, ignore this email.</p>
//     `
//   });
// }

// async function sendInquiryEmail({ to, listingTitle, listingUrl, buyer }) {
//   await transporter.sendMail({
//     from: process.env.MAIL_FROM,
//     to,
//     replyTo: buyer.email,
//     subject: `New inquiry: ${listingTitle}`,
//     html: `
//       <h2>New buyer inquiry on MRI Parts Hub</h2>
//       <p><b>Listing:</b> <a href="${listingUrl}">${listingTitle}</a></p>
//       <hr/>
//       <p><b>From:</b> ${buyer.name} &lt;${buyer.email}&gt;</p>
//       ${buyer.phone ? `<p><b>Phone:</b> ${buyer.phone}</p>` : ''}
//       <p><b>Message:</b></p>
//       <p style="white-space:pre-line;border-left:3px solid #0d6efd;padding-left:10px;">
//         ${buyer.message}
//       </p>
//       <hr/>
//       <p style="color:#6b7280;font-size:13px;">
//         Reply directly to this email to answer ${buyer.name}.
//       </p>
//     `
//   });
// }
// async function sendVerificationEmail(to, name, verifyUrl) {
//   await transporter.sendMail({
//     from: process.env.MAIL_FROM,
//     to,
//     subject: 'Verify your MRI Parts Hub account',
//     html: `
//       <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111827">
//         <h2 style="color:#0d6efd">Welcome to MRI Parts Hub, ${name}!</h2>
//         <p>Please confirm your email address to activate your account and start listing medical equipment.</p>
//         <p style="margin:24px 0">
//           <a href="${verifyUrl}"
//              style="background:#0d6efd;color:#fff;padding:12px 24px;
//                     border-radius:8px;text-decoration:none;font-weight:600;display:inline-block">
//             Verify my email
//           </a>
//         </p>
//         <p style="color:#6b7280;font-size:13px">
//           Or copy this link into your browser:<br/>
//           <a href="${verifyUrl}" style="color:#0d6efd;word-break:break-all">${verifyUrl}</a>
//         </p>
//         <p style="color:#6b7280;font-size:13px">This link expires in 24 hours.</p>
//         <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
//         <p style="color:#9ca3af;font-size:12px">If you didn't create this account, ignore this email.</p>
//       </div>
//     `
//   });
// }

// async function sendPriceDropEmail({ to, name, listingTitle, listingUrl, listingImage, oldPrice, newPrice, currency }) {
//   const savings = oldPrice - newPrice;
//   const pct     = oldPrice > 0 ? ((savings / oldPrice) * 100).toFixed(1) : '0';
//   const fmt     = (n) => `${currency} ${Number(n).toLocaleString()}`;

//   await transporter.sendMail({
//     from: process.env.MAIL_FROM,
//     to,
//     subject: `Price drop: ${listingTitle} — save ${fmt(savings)}`,
//     html: `
//       <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:600px;margin:0 auto;background:#f7f8fa;padding:24px;color:#111827">
//         <div style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.05)">

//           <div style="background:linear-gradient(135deg,#0d6efd,#0a58ca);color:#fff;padding:20px 24px">
//             <div style="font-size:13px;opacity:.85;letter-spacing:.5px">PRICE DROP ALERT</div>
//             <div style="font-size:22px;font-weight:700;margin-top:4px">Good news, ${name}!</div>
//           </div>

//           ${listingImage ? `
//             <img src="${listingImage}" alt="" style="width:100%;height:220px;object-fit:cover;display:block" />
//           ` : ''}

//           <div style="padding:24px">
//             <h2 style="margin:0 0 12px;font-size:18px">${listingTitle}</h2>

//             <div style="display:flex;align-items:baseline;gap:12px;margin:14px 0">
//               <span style="color:#6b7280;text-decoration:line-through;font-size:16px">
//                 ${fmt(oldPrice)}
//               </span>
//               <span style="color:#0d6efd;font-weight:800;font-size:26px">
//                 ${fmt(newPrice)}
//               </span>
//             </div>

//             <div style="display:inline-block;background:#dcfce7;color:#166534;font-weight:700;
//                         padding:6px 12px;border-radius:8px;font-size:13px;margin-bottom:16px">
//               You save ${fmt(savings)} (${pct}% off)
//             </div>

//             <p style="color:#6b7280;font-size:14px;line-height:1.5">
//               The seller just dropped the price on a listing you saved. Move fast — good deals don't last.
//             </p>

//             <p style="margin:24px 0">
//               <a href="${listingUrl}"
//                  style="background:#0d6efd;color:#fff;padding:12px 26px;border-radius:8px;
//                         text-decoration:none;font-weight:600;display:inline-block">
//                 View listing →
//               </a>
//             </p>
//           </div>

//           <div style="background:#f8fafc;padding:16px 24px;font-size:12px;color:#94a3b8;text-align:center">
//             You're receiving this because you saved this listing on MRI Parts Hub.<br/>
//             <a href="${process.env.FRONTEND_URL}/account/saved" style="color:#0d6efd">
//               Manage your saved listings
//             </a>
//           </div>

//         </div>
//       </div>
//     `
//   });
// }

// module.exports = { sendResetEmail, sendInquiryEmail, sendVerificationEmail, sendPriceDropEmail };



const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

async function sendResetEmail(to, resetUrl) {
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject: 'Reset your MRI Parts Hub password',
    html: `
      <h2>Password Reset</h2>
      <p>Click the link below to reset your password. It expires in 1 hour.</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>If you didn't request this, ignore this email.</p>
    `
  });
}

async function sendInquiryEmail({ to, bcc, listingTitle, listingUrl, buyer }) {
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    bcc, // ← ADD THIS LINE
    replyTo: buyer.email,
    subject: `New inquiry: ${listingTitle}`,
    html: `
      <h2>New buyer inquiry on MRI Parts Hub</h2>
      <p><b>Listing:</b> <a href="${listingUrl}">${listingTitle}</a></p>
      <hr/>
      <p><b>From:</b> ${buyer.name} &lt;${buyer.email}&gt;</p>
      ${buyer.phone ? `<p><b>Phone:</b> ${buyer.phone}</p>` : ''}
      <p><b>Message:</b></p>
      <p style="white-space:pre-line;border-left:3px solid #0d6efd;padding-left:10px;">
        ${buyer.message}
      </p>
      <hr/>
      <p style="color:#6b7280;font-size:13px;">Reply directly to this email to answer ${buyer.name}.</p>
    `
  });
}
async function sendVerificationEmail(to, name, verifyUrl) {
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject: 'Verify your MRI Parts Hub account',
    html: `
      <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#111827">
        <h2 style="color:#0d6efd">Welcome to MRI Parts Hub, ${name}!</h2>
        <p>Please confirm your email address to activate your account and start listing medical equipment.</p>
        <p style="margin:24px 0">
          <a href="${verifyUrl}"
             style="background:#0d6efd;color:#fff;padding:12px 24px;
                    border-radius:8px;text-decoration:none;font-weight:600;display:inline-block">
            Verify my email
          </a>
        </p>
        <p style="color:#6b7280;font-size:13px">
          Or copy this link into your browser:<br/>
          <a href="${verifyUrl}" style="color:#0d6efd;word-break:break-all">${verifyUrl}</a>
        </p>
        <p style="color:#6b7280;font-size:13px">This link expires in 24 hours.</p>
        <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
        <p style="color:#9ca3af;font-size:12px">If you didn't create this account, ignore this email.</p>
      </div>
    `
  });
}

async function sendPriceDropEmail({ to, name, listingTitle, listingUrl, listingImage, oldPrice, newPrice, currency }) {
  const savings = oldPrice - newPrice;
  const pct     = oldPrice > 0 ? ((savings / oldPrice) * 100).toFixed(1) : '0';
  const fmt     = (n) => `${currency} ${Number(n).toLocaleString()}`;

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject: `Price drop: ${listingTitle} — save ${fmt(savings)}`,
    html: `
      <div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:600px;margin:0 auto;background:#f7f8fa;padding:24px;color:#111827">
        <div style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.05)">

          <div style="background:linear-gradient(135deg,#0d6efd,#0a58ca);color:#fff;padding:20px 24px">
            <div style="font-size:13px;opacity:.85;letter-spacing:.5px">PRICE DROP ALERT</div>
            <div style="font-size:22px;font-weight:700;margin-top:4px">Good news, ${name}!</div>
          </div>

          ${listingImage ? `
            <img src="${listingImage}" alt="" style="width:100%;height:220px;object-fit:cover;display:block" />
          ` : ''}

          <div style="padding:24px">
            <h2 style="margin:0 0 12px;font-size:18px">${listingTitle}</h2>

            <div style="display:flex;align-items:baseline;gap:12px;margin:14px 0">
              <span style="color:#6b7280;text-decoration:line-through;font-size:16px">
                ${fmt(oldPrice)}
              </span>
              <span style="color:#0d6efd;font-weight:800;font-size:26px">
                ${fmt(newPrice)}
              </span>
            </div>

            <div style="display:inline-block;background:#dcfce7;color:#166534;font-weight:700;
                        padding:6px 12px;border-radius:8px;font-size:13px;margin-bottom:16px">
              You save ${fmt(savings)} (${pct}% off)
            </div>

            <p style="color:#6b7280;font-size:14px;line-height:1.5">
              The seller just dropped the price on a listing you saved. Move fast — good deals don't last.
            </p>

            <p style="margin:24px 0">
              <a href="${listingUrl}"
                 style="background:#0d6efd;color:#fff;padding:12px 26px;border-radius:8px;
                        text-decoration:none;font-weight:600;display:inline-block">
                View listing →
              </a>
            </p>
          </div>

          <div style="background:#f8fafc;padding:16px 24px;font-size:12px;color:#94a3b8;text-align:center">
            You're receiving this because you saved this listing on MRI Parts Hub.<br/>
            <a href="${process.env.FRONTEND_URL}/account/saved" style="color:#0d6efd">
              Manage your saved listings
            </a>
          </div>

        </div>
      </div>
    `
  });
}

module.exports = { sendResetEmail, sendInquiryEmail, sendVerificationEmail, sendPriceDropEmail };
