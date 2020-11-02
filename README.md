To start the project, use command:   
```shell script
node --experimental-worker app.js
```
##Why threads
The potential bottleneck of the app is the size of the XML file we need to process.
Each item in the file requires an additional API call, which does not help.
Processing it in chunks in different threads can speed up the process.