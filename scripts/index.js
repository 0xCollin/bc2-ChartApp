var jsonUrl;
var fetchSuccess = '<div class="alert alert-success alert-dismissible" role="alert">'
                      +'<button type="button" class="close" data-dismiss="alert" aria-label="Close">'
                        +'<span aria-hidden="true">&times;</span>'
                      +'</button>Got data'
                    +'</div>'

var fetchFail = '<div class="alert alert-danger alert-dismissible" role="alert">'
                  +'<button type="button" class="close" data-dismiss="alert" aria-label="Close">'
                    +'<span aria-hidden="true">&times;</span>'
                  +'</button><strong>Failed to get data!</strong> Kindly check the link and try again.'
                +'</div>'

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
        $('#fetchurl').clear();
        $('#fetchbtn').text("Reset data");
      },
      error: function() {
        $('.response').append(fetchFail);
      }
    });

    $('#data-table').bootstrapTable({
      url: jsonUrl,
      height: 300,
      cache: true,
      columns: [{
        field: 'id',
        title: 'Item ID'
      }, {
        field: 'name',
        title: 'Item Name'
      }, {
        field: 'price',
        title: 'Item Price'
      }, ]
    });
  });
});
