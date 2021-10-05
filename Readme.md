To install the project

```sudo docker run -it --rm --name tmp-name -v "$PWD":/usr/src/app -w /usr/src/app node:14 npm install```

To build in dev

```sudo docker run -it --rm --name tmp-name -v "$PWD":/usr/src/app -w /usr/src/app node:14 npm run dev```

To build in prod

```sudo docker run -it --rm --name tmp-name -v "$PWD":/usr/src/app -w /usr/src/app node:14 npm run build```

To lunch server

```sudo docker run -d -p 80:80 --name game-server -v "$PWD":/var/www/html php:7.0-apache```
