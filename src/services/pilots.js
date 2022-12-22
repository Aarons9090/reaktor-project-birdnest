import axios from "axios"
const URL = "/birdnest/pilots/"
axios.defaults.withCredentials = true

const getPilot = async (serialNumber) => {
    const response = await axios.get(`${URL}/${serialNumber}`)
    return response.data
}

export default { getPilot }