import PilotCard from "./PilotCard"
import "../styles/PilotCardGrid.css"

const PilotCardGrid = ({ pilots }) => {
    return (
        <div className="pilotcard-grid">
            {pilots.map(pilot => (
                <PilotCard key={pilot.pilotId} pilot={pilot} />
            ))}
        </div>
    )
}

export default PilotCardGrid
