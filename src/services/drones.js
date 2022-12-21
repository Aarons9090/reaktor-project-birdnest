import axios from "axios";
const URL = "/birdnest/drones";

const getStringFromXml = (xmlDoc, tagName) => xmlDoc.getElementsByTagName(tagName)[0].textContent

const getAllDrones = async () => {
    const response = await axios.get(URL);

    // parse xml data to HTMLObj
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(response.data,"text/xml");

    const drones_xml = xmlDoc.getElementsByTagName("drone");
    let drones = [];

    if(drones_xml.length === 0){
        return drones;
    }

    for(let i = 0; i < drones_xml.length; i++){
        const drone = {
            model: getStringFromXml(drones_xml[i], "model"),
            serialNumber: getStringFromXml(drones_xml[i], "serialNumber"),
            manufacturer: getStringFromXml(drones_xml[i], "manufacturer"),
            mac: getStringFromXml(drones_xml[i], "mac"),
            ipv4: getStringFromXml(drones_xml[i], "ipv4"),
            ipv6: getStringFromXml(drones_xml[i], "ipv6"),
            firmware: getStringFromXml(drones_xml[i], "firmware"),
            positionY: getStringFromXml(drones_xml[i], "positionY"),
            positionX: getStringFromXml(drones_xml[i], "positionX"),
            altitude: getStringFromXml(drones_xml[i], "altitude"),
        }
        drones.push(drone);
    }

    return drones;
}

export default { getAllDrones };