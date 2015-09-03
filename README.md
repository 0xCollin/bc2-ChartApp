# ChartApp
Chart application developed during @Andela class II bootcamp.

###Objectives.
1. The application should plot a chart based on data supplied.
2. The application should support various chart forms
  1. Pie Chart
  2. Histogram
  3. Bar Chart
  4. Line Chart


####Instructions.
ChartApp consumes data from a JSON endpoint to draw the charts.
An example of a json file with random data is included in this repo. The data
contained in the _data_._json_ file may be served up using json-server as follows:
```
$ npm install -g json-server
```
```
$ json-server data.json
```
If all goes well, passing the URL http://localhost:3000/db to ChartApp should draw the respective charts.
