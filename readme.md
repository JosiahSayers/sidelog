[![Contributors][contributors-shield]][contributors-url]
[![Codecov master branch][codecov-master-shield]][codecov-url]
[![Codecov develop branch][codecov-develop-shield]][codecov-url]
[![LinkedIn][linkedin-shield]][linkedin-url]

<br />
<p align="center">
  <h1 align="center">sidelog</h3>

  <p align="center">
    Easy logging for your side projects
    <br />
    <a href="https://github.com/JosiahSayers/sidelog/issues">Report Bug</a>
    ·
    <a href="https://github.com/JosiahSayers/sidelog/issues">Request Feature</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
* [Usage](#usage)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)
* [Acknowledgements](#acknowledgements)



<!-- ABOUT THE PROJECT -->
## About The Project

I built sidelog out of the desire to have an easy to use, easy to consume, and cheap logging solution for my side projects.

### Built With

* [Node.js](https://github.com/nodejs/node)
* [Express](https://github.com/expressjs/express)
* [TypeScript](https://github.com/microsoft/TypeScript)



## Getting Started

To get started with sidelog follow these simple steps.

### Prerequisites

* [Node.js](https://nodejs.org/en/download/)
* [Docker](https://www.docker.com/get-started) - Only required to use the preset development environment (see [Contributing](#contributing) for more information)

### Installation

1. Clone the repo
```sh
git clone https://github.com/JosiahSayers/sidelog.git
```
2. Install NPM packages
```sh
npm install
```
3. Create config file
  - A sample config file can be found in `config-dev/docker-mongo.config.json`
  - Config Schema:
  ```
  {
    "database": {
      "type": "mongo", // Only mongo is supported at the moment with more options coming soon
      "connectionString": "" // String used to authenticate and connect to your database
    },
    "applications": [
      {
        "name": "MyAwesomeApplication", // Every application gets its own table in the database, alpha characters only.
        "clientId": "24a32b74-c22e-470a-84a5-ce74894626d5", // Identifier used in API requests.
        "approvedOrigins": [ // Optional, if provided only requests with an approved origin header will succeed.
          "https://test.com",
          "https://www.test.com"
        ],
        "autoLogHeaders": [ // Optional, if provided the headers contained in this array will automatically be added to each log statement's json field
          // The supported values for this array can be found in the AutoLogHeaderEnum: https://github.com/JosiahSayers/sidelog/blob/develop/src/interfaces/application-config.interface.ts
          "ip",
          "origin"
        ]
      }
    ]
  }
  ```
4. (A) Run application (using config file on disk)
```sh
CONFIG_PATH=<path_to_config_file> npm start

// CONFIG_PATH=./config-dev/docker-mongo.config.json npm start //
```
4. (B) Run application (using config passed in as JSON string)
```sh
CONFIG_JSON=<stringified config content> npm start
```

Optional Environment Variables
  - ENV_FILE: Used to specify a path to an `env` file to use instead of passing in values at runtime, defaults to '.env';
  - PORT: Used to specify which port sidelog should run on, defaults to 3000.
  - LOG_SERVER_ERRORS: Used to specify whether sidelog should log any server errors into the database for future reference/bug fixes. Pass false to disable, defaults to enabled.



## Usage

Adding new log statements from your side projects is accomplished through a `POST` request to the `/logs` endpoint. There should be a `clientId` header that is set to one of the client IDs passed in the applications array of your config file.

The body of the request should be shaped like the following example:

```
{
    "message": "Test Message", // Required
    "level": "info", // Required. Valid values are: 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'trace'
    "json": { // Optional. Can be any object
        "string": "This is a test string",
        "number": 400
    }
}
```

sidelog will automatically log the creation date and time of each request, so there's no need to send that in.

Please refer to the [Postman Collection](https://github.com/JosiahSayers/sidelog/blob/develop/config-dev/sidelog.postman_collection.json) for more details on how to send a log request.

## Roadmap

See the [open issues](https://github.com/JosiahSayers/sidelog/issues) for a list of proposed features (and known issues).



## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

I've tried to make it as painless as possible to get a local dev environment up and running. As long as you have Docker installed and running on your system you can run the following command to start up a working local development environment:

```sh
docker-compose up
```

Running this command will start two docker containers. The first is a Node.js container that will watch for changes in the repo folder and automatically rebuild the application when they're detected. The second is a MongoDb container with a persistent storage volume so that you don't lose your previous database additions between development sessions.

To contribute:

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request


## License

[Distributed under the MIT License.](https://josiah-sayers.mit-license.org/)



## Contact

Josiah Sayers - josiah.sayers15+sidelog@gmail.com

Project Link: [https://github.com/JosiahSayers/sidelog](https://github.com/JosiahSayers/sidelog)





<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/JosiahSayers/sidelog.svg?style=flat-square
[contributors-url]: https://github.com/JosiahSayers/sidelog/graphs/contributors

[codecov-develop-shield]: https://img.shields.io/codecov/c/github/JosiahSayers/sidelog/develop?style=flat-square&label=coverage%20%28develop%29
[codecov-master-shield]: https://img.shields.io/codecov/c/github/JosiahSayers/sidelog/master?style=flat-square&label=coverage%20%28master%29
[codecov-url]: https://codecov.io/gh/JosiahSayers/sidelog

[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=flat-square&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/josiah-sayers
[product-screenshot]: images/screenshot.png
