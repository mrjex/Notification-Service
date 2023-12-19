// Import email templates and check that they include all the neccesary properties
const {newTimeslotsEmail} = require('../src/email/templates/newTimeslots')

test('newTimeslotsEmail is a email template expected to contain', () => {
    expect(newTimeslotsEmail).toHaveProperty('from')
    expect(newTimeslotsEmail).toHaveProperty('to')
    expect(newTimeslotsEmail).toHaveProperty('subject')
    expect(newTimeslotsEmail).toHaveProperty('text')
    expect(newTimeslotsEmail).toHaveProperty('html')
  })