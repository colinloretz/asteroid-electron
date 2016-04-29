# asteroids

## Desktop Client

Desktop client for the [Fetch-a-Rock](https://2016.spaceappschallenge.org/challenges/solar-system/asteroid-mining/projects/fetch-a-rock) project for NASA Space Apps Challenge 2016.

#### Asteroid Simulation
This client displays an orbital mechanics simulation in which we are able to view the Earth, Moon and a prospective asteroid to mine. In this scenario, we have landed an asteroid repositioning rocket. If you tap on the screen, the simulation will apply thrust to that side of the asteroid.

Requires Node.js. Clone this repository and then run:

```
npm install && npm start
```

:warning: This client will not work without the python server component, which is available below. We are working on making this more portable than it is currently.

![asteroid client](https://media.giphy.com/media/12aMT6qXD8q4mc/giphy.gif)


## Server Component

The server side component is available at [https://github.com/bdhammel/asteroid-flask](https://github.com/bdhammel/asteroid-flask).

It requires python and Redis to be installed.
