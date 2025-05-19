# Bombas App

Run this app with Docker is recommended because your machine may have different versions
of Node, NPM etc. which may screw things up.

I tried to use as few framework as possible in the project to keep it simple.
But I did used frameworks like React, Tailwind .etc otherwise the amount of effort of building everthing from scratch would have been infeasible 


Please run the application in the following order (assuming you have Docker already installed)

- docker build -t bombas-app .
- docker run -p 5555:5555 bombas-app
- open your browser and type in http://localhost:5555/

If you feel like running it without Docker:

- npm install
- npm run dev