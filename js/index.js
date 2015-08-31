$(document).ready(function() {
  var d1 = [];
  for (var i = 0; i < 14; i += 0.1) {
    d1.push([i, Math.sin(i)]);
  }
  var d2 = [];
  for (var i = 0; i < 14; i += 0.1) {
    d2.push([i, Math.cos(i)]);
  }
  $.plot("#chart", [ d1, d2 ]);
  
  var data = [ ["January", 10], ["February", 8], ["March", 4], ["April", 13], ["May", 17], ["June", 9] ];
  $.plot("#chart1", [ data ], {
    series: {
      bars: {
        show: true,
        barWidth: 0.6,
        align: "center"
      }
    },
    xaxis: {
      mode: "categories",
      tickLength: 0
    }
  });

 });
