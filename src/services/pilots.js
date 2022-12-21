import axios from "axios";
const URL = "/birdnest/pilots/";

const getPilot = async (serialNumber) => {
    const response = await axios.get(`${URL}/${serialNumber}`);
    return response.data;
}

export default { getPilot };