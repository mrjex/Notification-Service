const axios = require('axios');
const apiUrl = 'http://localhost:3000/';

async function getClinic(clinic_id){ // TODO: Sync with api and clinic service to fetch actual clinic.
// axios.get(apiUrl + 'clinics/:' + clinic_id)
//   .then(response => {
//     console.log('API Response:', response.data);
//     return response.data
//   })
//   .catch(error => {
//     console.error('Error fetching data from API:', error.message);
//     return 'Could not retrive clinic'
//   });
    return {clinic: 'Fobar Clinic', location: 'Gothenburg 44'} 
}

module.exports = { getClinic }