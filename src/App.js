import logo from "./logo.svg"
import "./App.css"
import React, { useState, useEffect } from "react"
import droneService from "./services/drones"

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
            const violatedDrone = { ...drone, violatedTime: new Date() }
            violatedDrones.push(violatedDrone)
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
        for (let violatedDrone of calculateViolatedDrones(drones)) {
            if (
                violatedDrones.filter(
                    d => d.serialNumber === violatedDrone.serialNumber
                ).length === 0
            ) {
                setViolatedDrones(violatedDrones.concat(violatedDrone))
                console.log(violatedDrones)
            }
        }
    }, [drones, violatedDrones])

    // remove expired drones
    useEffect(() => {
        for (let violatedDrone of violatedDrones) {
            if(timeDifferenceInMinutes(violatedDrone.violatedTime, new Date()) > 1){
                setViolatedDrones(violatedDrones.filter(d => d.serialNumber !== violatedDrone.serialNumber))
                console.log(violatedDrones)
            }
        }
    }, [violatedDrones])

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
