import PilotCard from "./PilotCard"
import "../styles/PilotCardGrid.css"

const PilotCardGrid = ({ pilots }) => {
    return (
        <div className="pilotcard-grid">
            {pilots ? pilots.map(pilot => (
                <PilotCard key={pilot.pilotId} pilot={pilot} />
            ))
                : null}
        </div>
    )
}

export default PilotCardGrid
