const axios = require('axios');
const apiUrl = 'http://localhost:3000/';

async function getPatient(patient_ID){
  try {
    const response = await axios.get(apiUrl + 'patients/' + patient_ID)
    return response.data.patient
  } catch (error) {
    throw new Error('UNABLE TO SEND EMAIL', 'CAUSE:', error.message)
  }
}

async function getDentist(dentist_ID){
  try {
    const response = await axios.get(apiUrl + 'dentists/' + dentist_ID)
    return response.data.dentist
    } catch (error) {
      throw new Error('UNABLE TO SEND EMAIL', 'CAUSE:', error.message)
    }
  }

module.exports = { getPatient, getDentist }

