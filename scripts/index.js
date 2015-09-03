var jsonUrl;
var config = {
	colour: '#000',
	values: []
};
var xPadding = 30;
var yPadding = 30;
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

  var canvas1 = document.getElementById('barchartCanvas');
  var canvas2 = document.getElementById('linechartCanvas');

  $('#fetchbtn').click(function(event) {
    jsonUrl = $('input[name=jsonURL]').val();

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
      $('#fetchbtn').text("Reset data");
      $('.col-md-4 h5').css("display", "block");
      for (var i = 0; i < data.length; i++) {
        config.values.push(data[i].score);
      }

      barGraph.draw(config.values);

      function getMax() {
        var max = Math.max.apply(null, config.values);
        max += 10 - max % 10;
        return max;
        console.log(max);
      };

      function getXPixel(val) {
          return ((canvas2.width - xPadding) / config.values.length) * val + (xPadding * 1.5);
      }

      function getYPixel(val) {
          return canvas2.height - (((canvas2.height - yPadding) / getMax()) * val) - yPadding;
      }

      c.beginPath();
      c.moveTo(xPadding, 0);
      c.lineTo(xPadding, canvas2.height - yPadding);
      c.lineTo(canvas2.width, canvas2.height - yPadding);
      c.stroke();

      for(var i = 0; i < config.values.length; i += 1) {
          c.fillText(i + 1, getXPixel(i), canvas2.height - yPadding + 20);
      }

      c.textAlign = "right"
      c.textBaseline = "middle";

      for(var i = 0; i < getMax(); i += 10) {
          c.fillText(i, xPadding - 10, getYPixel(i));
      }

      c.strokeStyle = '#000';

      c.beginPath();
      c.moveTo(getXPixel(0), getYPixel(config.values[0]));
      for(var i = 1; i < config.values.length; i ++) {
          c.lineTo(getXPixel(i), getYPixel(config.values[i]));
      }
      c.stroke();

      c.fillStyle = '#333';

      for(var i = 0; i < config.values.length; i ++) {
          c.beginPath();
          c.arc(getXPixel(i), getYPixel(data.values[i].Y), 4, 0, Math.PI * 2, true);
          c.fill();
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

    var barGraph = new BarGraph(canvas1);
    barGraph.xLabels = ['1', '2', '3', '4', '5'];

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

    BarGraph.prototype = new Graph();

    function BarGraph(canvas) {
      Graph.call(this, canvas);
      this.margin = 5;
      this.border = 1;

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

        for(var i = 0; i < this.values.length; i++){
          if(this.values[i] > maxVal){
            maxVal = this.values[i];
          }
        }

        for(var i = 0; i < this.values.length; i++){
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

  var c = canvas2.getContext('2d');

  c.lineWidth = 2;
  c.strokeStyle = '#333';
  c.font = 'italic 8pt sans-serif';
  c.textAlign = "center";

});
