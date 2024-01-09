const axios = require('axios');
const apiUrl = 'http://localhost:3000/'

async function getClinic(clinic_id){
    try {
        const response = await axios.get(apiUrl + 'clinics/' + clinic_id)
        return response.data
      } catch (error) {
        throw new Error('UNABLE TO SEND EMAIL', 'CAUSE:', error.message)
      }
}

module.exports = { getClinic }