import logo from "./logo.svg"
import "./App.css"
import React, { useState, useEffect } from "react"
import droneService from "./services/drones"

const calculateDistance = (x1,y1,x2,y2) => {


    const dist = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
    console.log("Distance: " + dist)
    return dist
}

const calculateDistanceToAllDrones = drones => {
    const violatedDrones = []
    for (let i = 0; i < drones.length; i++) {
      const drone = drones[i]
      if(calculateDistance(parseInt(drone.positionX), parseInt(drone.positionY), 250000, 250000) < 100000) {
        violatedDrones.push(drone)
      }
    }
    return violatedDrones
}


function App() {
    const [drones, setDrones] = useState([])

    // fetch drones every 2 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            const fetchDrones = async () => {
                const resp = await droneService.getAllDrones()
                console.log("Drones:")
                console.log(resp)
                setDrones(resp)
            }
            fetchDrones()
        }, 2 * 1000)
        return () => clearInterval(interval)
    }, [drones])

    useEffect(() => {
        const violatedDrones = calculateDistanceToAllDrones(drones)
        console.log("Violated drones:")
        console.log(violatedDrones)
    }, [drones])

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
