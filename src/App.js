import "./styles/App.css"
import { useState, useEffect } from "react"
import droneService from "./services/drones"
import pilotService from "./services/pilots"
import PilotCardGrid from "./components/PilotCardGrid"
import Header from "./components/Header"

const PILOT_EXPIRATION_TIME = 10
const NDZ_RADIUS = 100000
const NDZ_CENTER = { x: 250000, y: 250000 }

/**
 * Calculates the distance between two points
 * @param {number} x1 
 * @param {number} y1 
 * @param {number} x2 
 * @param {number} y2 
 * @returns distance between two points
 */

const calculateDistance = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

/**
 * Calculates the violated drones from array of drones
 * @param {obj} drones 
 * @returns array of violated drones
 */
const calculateViolatedDrones = drones => {
    const violatedDrones = drones.map((drone) => {
        const distance = calculateDistance(
            parseInt(drone.positionX),
            parseInt(drone.positionY),
            NDZ_CENTER.x,
            NDZ_CENTER.y
        ) 

        // ignore drones outside NDZ
        if (distance >= NDZ_RADIUS) {
            return null
        }

        // set / update drone's distance
        if(!drone.distance){
            return {...drone, distance}
        }else{
            if(distance < drone.distance){
                drone.distance = distance
            }
            return drone
        }
    })

    return violatedDrones.filter(d => d)
}

/**
 * Remove pilots with expired violation time
 * @param {obj} pilots 
 * @returns array of remaining pilots
 */
const removeExpiredPilots = pilots => {
    for (const pilot of pilots) {
        const timeDif = timeDifferenceInMinutes(pilot.violatedTime, new Date())
        if (timeDif > PILOT_EXPIRATION_TIME) {
            pilots = pilots.filter(p => p.pilotId !== pilot.pilotId)
        }
    }
    return pilots
}

/**
 * Calculate time difference in between two dates in minutes
 * @param {Date} date1 
 * @param {Date} date2 
 * @returns time difference in minutes
 */
const timeDifferenceInMinutes = (date1, date2) => {
    const difference = date2.getTime() - date1.getTime()
    return difference / 1000 / 60
}

/**
 * Return true if drone is in pilots array
 * @param {obj} pilots 
 * @param {obj} drone 
 * @returns boolean
 */
const isNewDrone = (pilots, drone) => {
    return pilots ? pilots.filter(
        p => p.drone.serialNumber === drone.serialNumber
    ).length === 0 : true
}

function App() {
    const [drones, setDrones] = useState([])
    const [pilots, setPilots] = useState([])

    // fetch drones every 2 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            const fetchDrones = async () => {
                const resp = await droneService.getAllDrones()
                setDrones(resp)
            }
            fetchDrones()

            // check for expired pilots
            setPilots(pilots ? removeExpiredPilots(pilots) : pilots)
            
        }, 2 * 1000)
        return () => clearInterval(interval)
    }, [drones, pilots])

    // get violated drones
    useEffect(() => {
        const getViolatedDrones = async () => {
            const violatedDronesArray = calculateViolatedDrones(drones)
            for (const violatedDrone of violatedDronesArray) {

                if (isNewDrone(pilots, violatedDrone)) {

                    // get pilot of violated drone
                    const resp = await pilotService.getPilot(violatedDrone.serialNumber)
                    const pilot = {...resp, violatedTime: new Date(), "drone": violatedDrone}
                    if(pilot){
                        setPilots(pilots ? pilots.concat(pilot) : [pilot])
                    }
                
                }else{
                    // update pilot's violation time and drones distance
                    const pilot = pilots.find(p => p.drone.serialNumber === violatedDrone.serialNumber)
                    const updatedPilot = {...pilot, violatedTime: new Date()}

                    // take smallest distance
                    if(pilot.drone.distance > violatedDrone.distance){
                        updatedPilot.drone.distance = violatedDrone.distance
                    }

                    const updatedPilots = pilots.map(p => p.pilotId === updatedPilot.pilotId ? updatedPilot : p)
                    setPilots(updatedPilots)
                }
            }
        }
        getViolatedDrones()

    }, [drones])


    return (
        <div className="App">
            <Header />
            {pilots ? <PilotCardGrid pilots={pilots} /> : null}
        </div>
    )
}

export default App
