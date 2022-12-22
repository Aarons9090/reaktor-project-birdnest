import "./App.css"
import React, { useState, useEffect } from "react"
import droneService from "./services/drones"
import pilotService from "./services/pilots"
import PilotCardGrid from "./components/PilotCardGrid"

const PILOT_EXPIRATION_TIME = 10

const calculateDistance = (x1, y1, x2, y2) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

const calculateViolatedDrones = drones => {
    const violatedDrones = []
    for (let i = 0; i < drones.length; i++) {
        const drone = drones[i]
        if (
            calculateDistance(
                parseInt(drone.positionX),
                parseInt(drone.positionY),
                250000,
                250000
            ) < 100000
        ) {
            violatedDrones.push(drone)
        }
    }
    return violatedDrones
}

const removeExpiredPilots = pilots => {
    for (let pilot of pilots) {
        const timeDif = timeDifferenceInMinutes(pilot.violatedTime, new Date())

        return (timeDif > PILOT_EXPIRATION_TIME) ? 
            pilots.filter(p => p.pilotId !== pilot.pilotId) 
            : pilots
    }
}

const timeDifferenceInMinutes = (date1, date2) => {
    const difference = date2.getTime() - date1.getTime()
    return difference / 1000 / 60
}

const getUniquePilots = (pilots, pilot) => {
    if (pilots.filter(p => p.pilotId === pilot.pilotId).length === 0){
        return pilots.concat(pilot)
    }    
}

const isDroneInList = (violatedDrones, drone) => {
    return violatedDrones.filter(
        d => d.serialNumber === drone.serialNumber
    ).length === 0
}

function App() {
    const [drones, setDrones] = useState([])
    const [violatedDrones, setViolatedDrones] = useState([])
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
        for (let violatedDrone of calculateViolatedDrones(drones)) {

            // check if drone is already in violatedDrones
            if (
                isDroneInList(violatedDrones, violatedDrone)
            ) {
                setViolatedDrones(violatedDrones.concat(violatedDrone))

                // get pilot of violated drone
                const resp = await pilotService.getPilot(violatedDrone.serialNumber)
                const pilot = {...resp, violatedTime: new Date()}
                
                // add unique pilot only
                setPilots(pilots ? getUniquePilots(pilots, pilot) : [pilot])
            }
        }
    }
      getViolatedDrones()

        
    }, [drones, violatedDrones, pilots])


    return (
        <div className="App">
            {pilots ? <PilotCardGrid pilots={pilots} /> : null}
        </div>
    )
}

export default App
