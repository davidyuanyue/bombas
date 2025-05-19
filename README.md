# Bombas App

Run this app with Docker is recommended because your machine may have different versions
of Node, NPM etc. which may screw things up

Please run the application in the following order (assuming you have Docker already installed)

- docker build -t bombas-app .
- docker run -p 5555:5555 bombas-app
- open your browser and type in http://localhost:5555/

If you feel like running it without Docker:

- npm install
- npm run dev