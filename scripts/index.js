var jsonUrl;
var config = {
	colour: '#000',
	values: []
};
var xPadding = 30;
var yPadding = 30;
var piedata = [{
  label: "80 - 100",
  value: 0,
  color: "black"
}, {
  label: "60 - 80",
  value: 0,
  color: "red"
}, {
  label: "40 - 60",
  value: 0,
  color: "blue"
}, {
  label: "0 - 40",
  value: 0,
  color: "green"
}];

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
	//get the canvas elements
  var canvas1 = document.getElementById('barchartCanvas');
  var canvas2 = document.getElementById('linechartCanvas');
  var canvas3 = document.getElementById('histogramCanvas');
	//listen to click events on button
  $('#fetchbtn').click(function(event) {
    jsonUrl = $('input[name=jsonURL]').val();
		//initiate ajax request to obtain json
    $.ajax({
      type: "GET",
      dataType: "json",
      url: jsonUrl,
      timeout: 5000,
      error: function() {
        $('.response').append(fetchFail);
      }
    }).done(function(data) {
      $('.response').append(fetchSuccess);
			$('#fetchbtn').css("display", "none");
      $('#resetbtn').css("display", "block");
      $('.col-md-4 h5').css("display", "block");
      $('#resetbtn').click(function() {
				location.reload(true);
			});
			//push items from the json object to the config object
      for (var i = 0; i < data.length; i++) {
        config.values.push(data[i].score);
      }
			//draw bargraph using values in config object
      barGraph.draw(config.values);
			//function to obtain the largest item from values
      function getMax() {
        var max = Math.max.apply(null, config.values);
        max += 10 - max % 10;
        return max;
        console.log(max);
      };
			//function to obtain the x point for a line chart
      function getXPixel(val) {
          return ((canvas2.width - xPadding) / config.values.length) * val + (xPadding * 1.5);
      }
			//function to obtain the x point for a line chart
      function getYPixel(val) {
          return canvas2.height - (((canvas2.height - yPadding) / getMax()) * val) - yPadding;
      }
			//draw the axes on the line chart canvas
      c.beginPath();
      c.moveTo(xPadding, 0);
      c.lineTo(xPadding, canvas2.height - yPadding);
      c.lineTo(canvas2.width, canvas2.height - yPadding);
      c.stroke();
			//draw the values on x axis
      for(var i = 0; i < config.values.length; i += 1) {
          c.fillText(i + 1, getXPixel(i), canvas2.height - yPadding + 20);
      }
			//draw the values on y axis
      c.textAlign = "right"
      c.textBaseline = "middle";
      for(var i = 0; i < getMax(); i += 10) {
          c.fillText(i, xPadding - 10, getYPixel(i));
      }
      c.strokeStyle = '#000';
			//draw the line chart on canvas
      c.beginPath();
      c.moveTo(getXPixel(0), getYPixel(config.values[0]));
      for(var i = 1; i < config.values.length; i ++) {
          c.lineTo(getXPixel(i), getYPixel(config.values[i]));
      }
      c.stroke();
			//draw the points on the line chart
			c.fillStyle = '#333';
      for(var i = 0; i < config.values.length; i ++) {
          c.beginPath();
          c.arc(getXPixel(i), getYPixel(config.values[i]), 4, 0, Math.PI * 2, true);
          c.fill();
      }
			//arrays to hold values according to category
      var a = [], b = [], d = [], e = [];
			//divide the values into categories
      for (var i = 0; i < config.values.length; i++) {
        if(config.values[i] > 80 && config.values[i] < 100) {
          a.push(config.values[i]);
          piedata[0].value = a.length;
        }else if(config.values[i] > 60 && config.values[i] < 80) {
          b.push(config.values[i]);
          piedata[1].value = b.length;
        }else if(config.values[i] > 40 && config.values[i] < 60) {
          d.push(config.values[i]);
          piedata[2].value = d.length;
        }else if(config.values[i] > 0 && config.values[i] < 40) {
          e.push(config.values[i]);
          piedata[3].value = e.length;
        }
      }

			//draw pie chart
			new PieChart("piechartCanvas", piedata);

			//set value categories for histogram and draw it
			var histValues = [(a.length/config.values.length)*100, (b.length/config.values.length)*100, (d.length/config.values.length)*100, (e.length/config.values.length)*100];
      histogram.draw(histValues);

});
		//display data from json in table
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
		//initialize bargraph and histogram
    var barGraph = new BarGraph(canvas1);
    var histogram = new BarGraph(canvas3);
		//set label for the x axis for bargraph and histogram
    barGraph.xLabels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    histogram.xLabels = [];

		for (var i = 0; i < piedata.length; i++) {
			histogram.xLabels.push(piedata[i].label);
		}
		//histogram doesn't have margin
		histogram.margin = 0;
		//function to instatiate charts
    function Graph(canvas) {
      this.ctx = canvas.getContext('2d');
      this.width = canvas.width;
      this.height = canvas.height;
      this.bgColor = '#fff';
      this.font = 'bold 12px sans-serif';
      this.fontColor = '#333333';
      this.clearCanvas = function() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.graphAreaHeight = this.height;
      }
    }
		//prototype for bargraph
    BarGraph.prototype = new Graph();

    function BarGraph(canvas) {
      Graph.call(this, canvas);
      this.margin = 5;
      this.border = 1;
			//function to draw bargraph
      BarGraph.prototype.draw = function(values) {
        this.values = values;
        this.clearCanvas();
        var numOfBars = this.values.length, maxVal = 0, barWidth, barHeight, maxBarHeight, ratio, label;
        this.ctx.fillStyle = this.bgColor;
        this.ctx.fillRect(0, 0, this.width, this.graphAreaHeight);

        if(this.xLabels.length){
          this.graphAreaHeight -= 30;
        }

        barWidth = this.width / numOfBars - this.margin * 2;
        maxBarHeight = this.graphAreaHeight - 25;

        for(var i = 0; i < this.values.length; i++) {
          if(this.values[i] > maxVal){
            maxVal = this.values[i];
          }
        }

        for(var i = 0; i < this.values.length; i++) {
          if(this.maxYval){
            ratio = this.values[i] / this.maxYval;
          }else{
            ratio = this.values[i] / maxVal;
          }

          barHeight = ratio * maxBarHeight;
          this.ctx.fillStyle = '#000';
          this.ctx.fillRect(
            this.margin + i * this.width / numOfBars,
            this.graphAreaHeight - barHeight,
            barWidth,
            barHeight
          );
          this.ctx.fillStyle = this.fontColor;
          this.ctx.font = this.font;
          this.ctx.textAlign = 'center';

          this.ctx.beginPath();
          this.ctx.moveTo(0, 0);
          this.ctx.lineTo(0, this.height - 30);
          this.ctx.lineTo(this.width, this.height - 30);
          this.ctx.stroke();

          this.ctx.fillText(
            parseInt(this.values[i],10),
            i * this.width / numOfBars + (this.width / numOfBars) / 2,
            this.graphAreaHeight - barHeight - 10
          );

          if(this.xLabels[i]){
            label = (this.xLabels[i].length > this.maxTextLength) ? this.xLabels[i].substring(0,this.maxTextLength) + ".." : this.xLabels[i];
            this.ctx.fillStyle = this.fontColor;
            this.ctx.font = this.font;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(label, i * this.width / numOfBars + (this.width / numOfBars) / 2, this.height - 10);
          }
        }
      }
    }


  });
	//set context for linegraph and histogram
  var c = canvas2.getContext('2d');
	var h = canvas3.getContext('2d');
	//configure the linegraph context
  c.lineWidth = 2;
  c.strokeStyle = '#333';
  c.font = 'italic 8pt sans-serif';
  c.textAlign = "center";

  /*
  *Pie chart constructor
  */
  function PieChart(canvasId, data) {
    //User defined Properties
    this.canvas = document.getElementById(canvasId);
    this.data = data;

    //constants
    this.padding = 10;
    this.legendBorder = 2;
    this.pieBorder = 5;
    this.colorLabelSize = 10;
    this.borderColor = "#555";
    this.shadowColor = "#777";
    this.shadowBlur = 10;
    this.shadowX = 2;
    this.shadowY = 2;
    this.font = "12pt Calibri";

    //relationships
    this.context = this.canvas.getContext("2d");
    this.legendWidth = this.getLegendWidth();
    this.legendX = this.canvas.width - this.legendWidth;
    this.legendY = this.padding;
    this.pieAreaWidth = (this.canvas.width - this.legendWidth);
    this.pieAreaHeight = this.canvas.height;
    this.pieX = this.pieAreaWidth / 2;
    this.pieY = this.pieAreaHeight / 2;
    this.pieRadius = (Math.min(this.pieAreaWidth, this.pieAreaHeight) / 2) - (this.padding);

    //draw pie chart
    this.drawPieBorder();
    this.drawSlices();
    this.drawLegend();

  }

  /*
  *Gets the legend width based on the size of
  *the label text
  */

  PieChart.prototype.getLegendWidth = function() {
    /*
    *loop through all the labels and determine which
    *label is the longest. Use this information to
    *determine the label width
    */
    this.context.font = this.font;
    var labelWidth = 0;

    for (var n = 0; n < this.data.length; n++) {
      var label = this.data[n].label;
      labelWidth = Math.max(labelWidth, this.context.measureText(label).width);
    }
    return labelWidth + (this.padding * 2) + this.legendBorder + this.colorLabelSize;
  };

  PieChart.prototype.drawPieBorder = function() {
    var context = this.context;
    context.save();
    context.fillStyle = "white";
    context.shadowColor = this.shadowColor;
    context.shadowBlur = this.shadowBlur;
    context.shadowOffsetX = this.shadowX;
    context.shadowOffsetY = this.shadowY;
    context.beginPath();
    context.arc(this.pieX, this.pieY, this.pieRadius + this.pieBorder, 0, Math.PI * 2, false);
    context.fill();
    context.closePath();
    context.restore();
  };

  /*
  *Draws the slices for the pie chart
  */
  PieChart.prototype.drawSlices = function() {
    var context = this.context;
    context.save();
    var total = this.getTotalValue();
    var startAngle = 0;
    for (var n = 0; n < this.data.length; n++) {
      var slices = this.data[n];

      //draw slice
      var sliceAngle = 2 * Math.PI * slices.value / total;
      var endAngle = startAngle + sliceAngle;

      context.beginPath();
      context.moveTo(this.pieX, this.pieY);
      context.arc(this.pieX, this.pieY, this.pieRadius, startAngle, endAngle, false);
      context.fillStyle = slices.color;
      context.fill();
      context.closePath();
      startAngle = endAngle;
    }
    context.restore();
  };

  /*
  *Gets the total value of the labels by looping through
  *the data and adding up each value
  */
  PieChart.prototype.getTotalValue =  function() {
    var data = this.data;
    var total = 0;

    for (var n = 0; n < data.length; n++) {
      total += data[n].value
    }

    return total;
  }

  /*
  *Draws the legend
  */

  PieChart.prototype.drawLegend = function() {
    var context = this.context;
    context.save();
    var labelX = this.legendX;
    var labelY = this.legendY;

    context.strokeStyle = "black";
    context.lineWidth = this.legendBorder;
    context.font = this.font;
    context.textBaseline = "middle";

    for (var n = 0; n < this.data.length; n++) {
      var  slice = this.data[n]

      //draw legend label
      context.beginPath();
      context.rect(labelX, labelY, this.colorLabelSize, this.colorLabelSize);
      context.closePath();
      context.fillStyle = slice.color;
      context.fill();
      context.stroke();
      context.fillStyle = "black";
      context.fillText(slice.label, labelX + this.colorLabelSize + this.padding, labelY + this.colorLabelSize / 2);
      labelY += this.colorLabelSize + this.padding;
    }
    context.restore();
  };

});
