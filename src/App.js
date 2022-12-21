import logo from "./logo.svg"
import "./App.css"
import React, { useState, useEffect } from "react"
import droneService from "./services/drones"
import pilotService from "./services/pilots"

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

const timeDifferenceInMinutes = (date1, date2) => {
    const difference = date2.getTime() - date1.getTime()
    return Math.round(difference / 1000 / 60)
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
        }, 2 * 1000)
        return () => clearInterval(interval)
    }, [drones])

    // get violated drones
    useEffect(() => {
      const getViolatedDrones = async () => {
        for (let violatedDrone of calculateViolatedDrones(drones)) {

          // check if drone is already in violatedDrones
          if (
              violatedDrones.filter(
                  d => d.serialNumber === violatedDrone.serialNumber
              ).length === 0
          ) {
              setViolatedDrones(violatedDrones.concat(violatedDrone))

              // get pilot of violated drone
              const newPilot = await pilotService.getPilot(violatedDrone.serialNumber)
                if (pilots.filter(p => p.pilotId === newPilot.pilotId).length === 0){
                    const pilot = {...newPilot, violatedTime: new Date()}
                    setPilots(pilots.concat(pilot))
                    console.log("add new pilot")
                    console.log(pilots)
                  }
          }
        }
      }
      getViolatedDrones()

        
    }, [drones, violatedDrones, pilots])

     // remove expired pilots
     useEffect(() => {
      for (let pilot of pilots) {
          if (
              timeDifferenceInMinutes(pilot.violatedTime, new Date()) > 1
          ) {
              setPilots(pilots.filter(p => p.pilotId !== pilot.pilotId))
              console.log("remove expired pilot")
              console.log(pilots)
          }
      }
  }, [pilots])


    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.js</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    )
}

export default App
