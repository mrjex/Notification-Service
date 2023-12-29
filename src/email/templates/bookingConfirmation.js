// Email template for booking confirmations.
require('dotenv').config()

const bookingConfirmationEmail = {
    from: process.env.EMAIL_SENDER,
    to: "", // To will be populated.
    subject: "Booking confirmation",
    html: `
    <body>
        <div>
            <h3>Booking confirmation</h3>
            <ul>
                <li>Clinic: [clinic]</li>
                <li>Location: [location]</li>
                <li>Start time: [start_time]</li>
                <li>End time: [end_time]</li>
                <li>Patient: [patient]</li>
                <li>Dentist: [dentist]</li>
            </ul>
            <p><a href="https://patient-dusky.vercel.app/">Dentanoid</a></p>
            <p>kind regards, Dentanoid</p>
        </div>
    </body>`
}

module.exports = {
    bookingConfirmationEmail
}