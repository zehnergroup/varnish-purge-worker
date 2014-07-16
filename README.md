# Varnish Purge Worker




### Setup

Create a `config.json` file and edit it as needed. You can use the sample (`config.json.sample`) as a template.

    cp config.json.sample config.json

Install dependencies

    npm install

### Run the worker

It's as simple as running the script with node.js. You'll need root privileges (or permissions) to access Varnish's secret file

    sudo node subscriber.js
