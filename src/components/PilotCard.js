import "../styles/PilotCard.css"

const PilotCard = ({ pilot }) => {
    return (
        <div className="pilot-card">
            <div className="pilot-card__name">
                <h2>{pilot.firstName + " " + pilot.lastName}</h2>
            </div>
            <div className="pilot-card__info">
                <p>{pilot.email}</p>
                <p>{pilot.phoneNumber}</p>
            </div>
            <div className="pilot-card__distance">
                <h3>Closest distance:</h3>
                <p>110 m</p>
            </div>
            <div className="pilot-card__time">
                <h3>Violation time:</h3>
                <p>{pilot.violatedTime.toLocaleString()}</p>
            </div>
        </div>
    )
}

export default PilotCard