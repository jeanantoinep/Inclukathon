### Quick start ETNA
1) Installer mongodb, node v16.5, npm 7.19, et yarn
2) Pour information, le serveur est configuré de manière à se connecter a la bdd mongo suivante "mongodb://localhost/inclukathon-x-etna"
3) Lancer la commande "yarn" a la racine du dossier hackathon-master ET dans le dossier server
4) Faire un mongorestore du dossier dump/inclukathon-x-etna afin d'avoir une base de travail existante en BDD
5) Lancer la commande "yarn run devApi" a la racine de hackathon-master pour lancer le serveur contenant l'api back.
   Le serveur se relance automatiquement à chaque modification du dossier server.
6) Lancer la commande "yarn run devWeb" a la racine de hackathon-master a chaque modification du front (dossier web)
7) Se connecter a localhost afin de tester l'application
8) Un utilisateur avec le role admin est present avec les identifiants suivants :
    -id: admin@inclusionconseil.fr
    -pwd: admin
9) Une fois connecté, l'admin peut voir des boutons en bas de page afin de modifier les questions de l'incluscore.
10) Les incluscores pouvant être consultés sur la page de l'entreprise contiennent un lien afin de tester l'incluscore.


### DEV
    npm run devWeb
    npm run devApi

## Stack

### Front
    - React
    - FilePond
    - Bootstrap
    - JQuery
    - SCSS
    - animate.css
    - fontawesome
    - luxon
    - axios
    - scratchcard-js
    - rs-Slider
    - rangeInput
    - FullCalendar
    - https://pagination.js.org/docs/index.html
    - https://www.chartjs.org/docs/latest/charts/doughnut.html#pie
    - https://github.com/LuisEnMarroquin/json-as-xlsx
    - react-i18next
    - socket.io
    - country-flag-icons
### Back
    - Nest.js (with express)
### Tools
    - FuseBox
    - MongoDb
    - Mongoose
    - Bcrypt
    - nodemailer
    - Segment (analytics events)
    - Amplitude (analytics analyse)
    - Sentry (prod bug catcher)
### Setup:
    - node v16.5 / npm 7.19
    - a mongo db running on localhost, default port, with a db named inclukathon-x-etna
    - (PROD only) https credentials generated with https://letsencrypt.org/fr/ or another free SSL certificat generator
    - please configure eslint and prettier to ensure quality of code