# Running it
1. Requirements:
    1. docker and docker-compose
    2. nodejs and nodemon
2. From the root of the project, run: docker-compose up -d -> To start the Web Server and the Redis Server.
3. From the root of the project run:
    1. nodemon js/redis-server/redis-server.js -> To start the redis service
4. In your browser, go to: localhost:8008.
5. There you go! 
    1. First start listening to the API and running the Redis Server, on the left.
    2. Then connect to Diffusion on the right
    3. You'll see both charts being updated. Check the size of the data received by the charts and realize how much data you can save with Diffusion!