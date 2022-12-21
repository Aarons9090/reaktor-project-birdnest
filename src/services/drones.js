import axios from "axios";
const URL = "/birdnest/drones";

const getAllDrones = async () => {
    const response = await axios.get(URL);

    // parse xml data to object

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(response.data,"text/xml");

    console.log(typeof(xmlDoc));
    console.log(xmlDoc);
    const drones_xml = xmlDoc.getElementsByTagName("drone");
    console.log(drones_xml);
    let drones = [];

    for(let i = 0; i < drones_xml.length; i++){
        const drone = {
            model: drones_xml[0].getElementsByTagName("model")[0].textContent,
        }
        drones.push(drone);
    }
    console.log(drones)

    return response.data;
}

export default { getAllDrones };