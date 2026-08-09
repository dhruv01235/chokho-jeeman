import { Resend } from 'resend'
import { RESTAURANT } from './restaurant'

export interface ReservationEmailData {
  to: string
  reservationId: string
  name: string
  date: string
  timeSlot: string
  partySize: number
  tableInfo?: string | null
  phone?: string | null
}

const RESEND_API_KEY = process.env.RESEND_API_KEY
const EMAIL_FROM = process.env.EMAIL_FROM || `Chokho Jeeman <${RESTAURANT.email}>`

function maskEmail(email: string | null | undefined): string {
  if (!email) return '(no-email)'
  const [local, domain] = email.split('@')
  if (!domain) return email
  const maskedLocal =
    local.length <= 2
      ? `${local[0]}${'*'.repeat(Math.max(1, local.length - 1))}`
      : `${local.slice(0, 2)}${'*'.repeat(Math.max(1, local.length - 2))}`
  return `${maskedLocal}@${domain}`
}

function buildReservationTemplate(data: ReservationEmailData): string {
  const {
    reservationId,
    name,
    date,
    timeSlot,
    partySize,
    tableInfo,
    phone,
  } = data

  const guests = partySize === 1 ? '1 guest' : `${partySize} guests`
  const table = tableInfo || 'Table assigned at arrival'

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Reservation Confirmed</title>
  </head>
  <body style="margin:0;padding:0;background-color:#1a120c;font-family:Georgia,'Times New Roman',serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#1a120c;padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#2a1f16;border:1px solid #b5903c;border-radius:8px;overflow:hidden;">
            <!-- Header -->
            <tr>
              <td style="background-color:#1a120c;border-bottom:1px solid #b5903c;padding:24px 32px;text-align:center;">
                <p style="margin:0;color:#b5903c;font-size:12px;letter-spacing:3px;text-transform:uppercase;">चोखो जीमण · मारवाड़ी जैन भोजनालय</p>
                <p style="margin:8px 0 0;color:#f5f0e8;font-size:26px;">Chokho Jeeman</p>
              </td>
            </tr>
            <!-- Body -->
            <tr>
              <td style="padding:32px;">
                <p style="margin:0 0 8px;color:#f5f0e8;font-size:18px;">Namaste, ${name} 🙏</p>
                <p style="margin:0 0 20px;color:#c4a77d;font-size:14px;line-height:1.6;">Your table reservation at Chokho Jeeman has been <strong style="color:#f5f0e8;">confirmed</strong>.</p>

                <!-- Booking details -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #b5903c;border-radius:6px;margin-bottom:20px;">
                  <tr>
                    <td style="padding:16px 20px;border-bottom:1px solid #b5903c;background-color:#1a120c;">
                      <p style="margin:0;color:#b5903c;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Booking ID</p>
                      <p style="margin:4px 0 0;color:#f5f0e8;font-size:18px;letter-spacing:1px;">${reservationId}</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding:16px 20px;">
                      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td style="padding:6px 0;color:#c4a77d;font-size:13px;">Date</td>
                          <td style="padding:6px 0;color:#f5f0e8;font-size:13px;text-align:right;">${date}</td>
                        </tr>
                        <tr>
                          <td style="padding:6px 0;color:#c4a77d;font-size:13px;">Time</td>
                          <td style="padding:6px 0;color:#f5f0e8;font-size:13px;text-align:right;">${timeSlot}</td>
                        </tr>
                        <tr>
                          <td style="padding:6px 0;color:#c4a77d;font-size:13px;">Guests</td>
                          <td style="padding:6px 0;color:#f5f0e8;font-size:13px;text-align:right;">${guests}</td>
                        </tr>
                        <tr>
                          <td style="padding:6px 0;color:#c4a77d;font-size:13px;">Table</td>
                          <td style="padding:6px 0;color:#f5f0e8;font-size:13px;text-align:right;">${table}</td>
                        </tr>
                        ${phone ? `<tr>
                          <td style="padding:6px 0;color:#c4a77d;font-size:13px;">Phone</td>
                          <td style="padding:6px 0;color:#f5f0e8;font-size:13px;text-align:right;">${phone}</td>
                        </tr>` : ''}
                      </table>
                    </td>
                  </tr>
                </table>

                <!-- Note -->
                <p style="margin:0 0 20px;color:#c4a77d;font-size:13px;line-height:1.6;">
                  Please present your <strong style="color:#f5f0e8;">Booking ID</strong> to our restaurant staff upon arrival.
                </p>

                <!-- Restaurant details -->
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#1a120c;border:1px solid #b5903c;border-radius:6px;">
                  <tr>
                    <td style="padding:16px 20px;">
                      <p style="margin:0 0 8px;color:#b5903c;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Chokho Jeeman</p>
                      <p style="margin:0 0 4px;color:#f5f0e8;font-size:13px;">${RESTAURANT.address.full}</p>
                      <p style="margin:0 0 4px;color:#c4a77d;font-size:13px;">${RESTAURANT.delivery.display[0]} · ${RESTAURANT.delivery.display[1]}</p>
                      <p style="margin:0 0 4px;color:#c4a77d;font-size:13px;">☎ ${RESTAURANT.phones.map(p => p.display).join(' · ')}</p>
                      <p style="margin:0;color:#c4a77d;font-size:13px;">✉ ${RESTAURANT.email}</p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <!-- Footer -->
            <tr>
              <td style="border-top:1px solid #b5903c;padding:16px 32px;text-align:center;">
                <p style="margin:0;color:#8a6d2e;font-size:11px;">Pure vegetarian · Marwari &amp; Jain food · No onion &amp; garlic options</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `
}

function logEmail(data: ReservationEmailData) {
  console.log('========================================')
  console.log('[Reservation Confirmation Email]')
  console.log(`To: ${data.to}`)
  console.log(`Reservation ID: ${data.reservationId}`)
  console.log(`Guest: ${data.name}`)
  console.log(`Date/Time: ${data.date} at ${data.timeSlot}`)
  console.log(`Party Size: ${data.partySize}`)
  if (data.tableInfo) console.log(`Table: ${data.tableInfo}`)
  if (data.phone) console.log(`Phone: ${data.phone}`)
  console.log('========================================')
}

export async function sendReservationConfirmationEmail(data: ReservationEmailData) {
  const maskedTo = maskEmail(data.to)

  try {
    if (!RESEND_API_KEY) {
      logEmail(data)
      return {
        success: false,
        error: 'RESEND_API_KEY is not configured. Email was not delivered (console-logged only).',
      }
    }

    const resend = new Resend(RESEND_API_KEY)

    console.log(
      JSON.stringify({
        event: 'reservation.email.sending',
        recipient: maskedTo,
        from: EMAIL_FROM,
        reservationId: data.reservationId,
      })
    )

    const response = await resend.emails.send({
      from: EMAIL_FROM,
      to: [data.to],
      subject: `Reservation Confirmed · ${data.reservationId}`,
      html: buildReservationTemplate(data),
    })

    if (response.error) {
      console.error(
        JSON.stringify({
          event: 'reservation.email.failed',
          recipient: maskedTo,
          from: EMAIL_FROM,
          reservationId: data.reservationId,
          httpStatus: (response.error as { statusCode?: number }).statusCode ?? null,
          errorName: (response.error as { name?: string }).name ?? null,
          errorMessage: (response.error as { message?: string }).message ?? null,
          raw: response.error,
        })
      )
      return { success: false, error: response.error }
    }

    const emailId = response.data?.id ?? null
    console.log(
      JSON.stringify({
        event: 'reservation.email.sent',
        recipient: maskedTo,
        from: EMAIL_FROM,
        reservationId: data.reservationId,
        emailId,
      })
    )
    return { success: true, emailId }
  } catch (error) {
    console.error(
      JSON.stringify({
        event: 'reservation.email.exception',
        recipient: maskedTo,
        from: EMAIL_FROM,
        reservationId: data.reservationId,
        error: error instanceof Error ? error.message : String(error),
      })
    )
    return { success: false, error }
  }
}
