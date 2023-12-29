const axios = require('axios');
const apiUrl = 'http://localhost:3000/';

async function getPatient(patient_ID){ // TODO: Sync with api and user service to fetch actual patient.
// axios.get(apiUrl + 'patients/:' + patient_ID)
//   .then(response => {
//     console.log('API Response:', response.data)
//     return response.data
//   })
//   .catch(error => {
//     console.error('Error fetching data from API:', error.message)
//     return 'Could not retrive patient'
//   })
    return {name: 'Patient 1', email: 'gusklouja@student.gu.se'} 
}

async function getDentist(dentist_ID){ // TODO: Sync with api and user service to fetch actual dentist.
  // axios.get(apiUrl + 'dentists/' + dentist_ID)
  //   .then(response => {
  //     console.log('API Response:', response.data)
  //     return response.data
  //   })
  //   .catch(error => {
  //     console.error('Error fetching data from API:', error.message)
  //     return 'Could not retrive dentist'
  //   })
    return {name: 'Dentist 1', email: 'gusklouja@student.gu.se'} 
  }

module.exports = { getPatient, getDentist }

