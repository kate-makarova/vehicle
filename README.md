To start the project without docker use command:   
```shell script
node --experimental-worker app.js
```

To start the project with docker use command:

```shell script
docker-compose up -d
```

##How to Test
1. Open the main page to find the links to every other page.
2. Download the data by calling /download page 
(you can follow the process in the console, it will tell you when everything is finished).
3. Open the /all page to check the data.
4. Go to Apollo to check the queries.
5. Schedule an update task with a short time interval.
For example, to update data every 5 minutes, go to /schedule/minute/5.  
Warning! With very small time intervals and high number of threads you risk to overwhelm the system,
because the new threads will start before the previous batch has finished.
6. Check via the console that the update task is running.
7. Stop the server to kill the update tasks.


##Download Time
The download time depends on the number of worker threads tasked with updating the data.  
The number of threads is defined in config/config.json file.  

With current number of nodes to process ~ 900, 30 threads require 
approximately 10 minutes to finish the download. 100 threads require 
approximately 5 minutes.  

I have not increased the number beyond 100 because I do not know
the limitations of the API. 