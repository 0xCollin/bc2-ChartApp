var jsonUrl;
var fetchSuccess = '<div class="alert alert-success alert-dismissible" role="alert">'
                      +'<button type="button" class="close" data-dismiss="alert" aria-label="Close">'
                        +'<span aria-hidden="true">&times;</span>'
                      +'</button>Got data'
                    +'</div>';

var fetchFail = '<div class="alert alert-danger alert-dismissible" role="alert">'
                  +'<button type="button" class="close" data-dismiss="alert" aria-label="Close">'
                    +'<span aria-hidden="true">&times;</span>'
                  +'</button><strong>Failed to get data!</strong> Kindly check the link and try again.'
                +'</div>';

$(document).ready(function() {
  $('#fetchbtn').click(function(event) {
    jsonUrl = $('input[name=jsonURL]').val();

    $.ajax({
      type: "GET",
      dataType: "json",
      url: jsonUrl,
      timeout: 5000,
      success: function(data) {
        $('.response').append(fetchSuccess);
        // $('#fetchurl').clear();
        $('#fetchbtn').text("Reset data");
      },
      error: function() {
        $('.response').append(fetchFail);
      }
    });

    $('#data-table').bootstrapTable({
      url: jsonUrl,
      pagination: true,
      cache: true,
      columns: [{
        field: 'id',
        title: 'id'
      }, {
        field: 'regno',
        title: 'Registration #'
      }, {
        field: 'name',
        title: 'Student Name'
      }, {
        field: 'score',
        title: 'Marks scored'
      }, ]
    });

    function Chart(width, height, dataSource) {
    	this.setDataSource(dataSource);
    	this.initialiseCanvas(width, height);
    }

    Chart.prototype.initialiseCanvas = function (width, height) {
    	this.canvas = document.getElementById("chartCanvas");
    	this.context = this.canvas.getContext('2d');
    	this.setSize(width, height);
    };

    Chart.prototype.setSize = function (width, height) {
    	this.canvas.width = this.width = width;
    	this.canvas.height = this.height = height;
    };

    Chart.prototype.getCanvas = function () {
    	return this.canvas;
    };


    Chart.prototype.setDataSource = function (dataSource) {
    	this.dataSource = dataSource;
    };

    Chart.prototype.renderChart = function () {
    	this.clearCanvas();
    	this.drawDataSourceOntoCanvas();
    };

    Chart.prototype.clearCanvas = function () {
    	this.context.clearRect(0, 0, this.width, this.height);
    };

    Chart.prototype.drawDataSourceOntoCanvas = function () {};

    function LineChart() {
    	Chart.apply(this, arguments);
    }

    LineChart.prototype = Object.create(Chart.prototype);


    LineChart.prototype.setDataSource = function (dataSource) {
    	Chart.prototype.setDataSource.call(this, dataSource);
    	this.values = this.getDataSourceItemValues();
    	this.calculateDataSourceBounds();
    };

    LineChart.prototype.getDataSourceItemValues = function () {
    	var dataSource = this.dataSource;
    	var values = [];
    	var key;

    	for (key in dataSource) {
    		if (dataSource.hasOwnProperty(key)) {
    			values.push(dataSource[key].values);
    		}
    	}

    	return values;
    };

    LineChart.prototype.calculateDataSourceBounds = function () {
    	this.bounds = {
    		x: this.getLargestDataSourceItemLength(),
    		y: this.getLargestDataSourceItemValue()
    	};
    };

    LineChart.prototype.getLargestDataSourceItemLength = function () {
    	var values = this.values;
    	var length = values.length;
    	var max = 0;
    	var currentLength;
    	var i;

    	for (i = 0; i < length; i++) {
    		currentLength = values[i].length - 1; // Negative

    		if (currentLength > max) {
    			max = currentLength;
    		}
    	}

    	return max;
    };

    LineChart.prototype.getLargestDataSourceItemValue = function () {
    	var values = this.values;
    	var length = values.length;
    	var max = 0;
    	var currentItem;
    	var i;

    	for (i = 0; i < length; i++) {
    		currentItem = Math.max.apply(Math, values[i]);

    		if (currentItem  > max) {
    			max = currentItem;
    		}
    	}

    	return max;
    };


    LineChart.prototype.drawDataSourceOntoCanvas = function () {
    	var dataSource = this.dataSource;
    	var currentItem;
    	var key;

    	for (key in dataSource) {
    		if (dataSource.hasOwnProperty(key)) {
    			currentItem = dataSource[key];
    			this.plotValuesOntoCanvas(currentItem);
    		}
    	}
    };

    LineChart.prototype.plotValuesOntoCanvas = function (item) {
    	var context = this.context;
    	var points = item.values;
    	var length = points.length;
    	var currentPosition;
    	var previousPosition;
    	var i;

    	var radius = 2;
    	var startAngle = 0;
    	var endAngle = Math.PI * 2;

    	context.save();
    	context.fillStyle = context.strokeStyle = item.colour;
    	context.lineWidth = 2;

    	for (i = 0; i < length; i++) {
    		previousPosition = currentPosition;
    		currentPosition = this.calculatePositionForValue(i, points[i]);

    		context.beginPath();
    		context.arc(currentPosition.x, currentPosition.y, radius, startAngle, endAngle, false);
    		context.fill();

    		if (previousPosition) {
    			context.moveTo(previousPosition.x, previousPosition.y);
    			context.lineTo(currentPosition.x, currentPosition.y);
    			context.stroke();
    		}
    	}

    	context.restore();
    };


    LineChart.prototype.calculatePositionForValue = function (column, value) {
    	return {
    		x: this.width / this.bounds.x * column,
    		y: this.height - (this.height / this.bounds.y * value)
    	};
    };


    var exampleLineGraph = new LineChart(300, 200, {
    	consumptionSpeed: {
    		colour: '#FF0000',
    		values: [
    			0, 0, 0, 0, 0,
    			0, 0, 0, 0.1, 0.3,
    			0.8, 1, 3, 8, 16, 32
    		]
    	},
    	temperature: {
    		colour: '#0000FF',
    		values: [
    			80, 80, 80, 80, 80,
    			79, 78, 76, 72, 60,
    			55, 54, 40, 10, 10, 40
    		]
    	}
    });

    var exampleLineGraphCanvas = exampleLineGraph.getCanvas();
    console.log(exampleLineGraphCanvas);
    document.body.appendChild(exampleLineGraphCanvas);
    exampleLineGraph.renderChart();


  });
});
