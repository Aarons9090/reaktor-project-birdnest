# Reaktor birdnest project

## Demo
[Link to deployed app](https://reaktor-project.fly.dev/)

## Project
Project description can be found [here](https://assignments.reaktor.com/birdnest).

This project shows the violators of the No Drone Zone from the last 10 minutes. 

## Implementation
The implementation consist of React frontend client and an Express proxy server which handles only the calls to the API. The main focus is on code readability and structuring. 

The client creates card elements for all violating pilots and updates the informations accordingly. The violator's card gets deleted after 10 minutes.


## Future development
What I realised too late was that the requirement
>-   **Immediately**  show the information from the last 10 minutes to anyone opening the application
>
is not possible with the current client and all the logic should be moved to the backend. This solution would be fairly straightforward but since I realised this too late and still want to enjoy my christmas holiday, I will only address this problem here.

## Thoughts
This project was overall very pleasent and I enjoyed coding React a lot. The documentation to this project was also done well <3. I also learned more about what logic belongs to the frontend and what in the backend so this was a great learning experience.
