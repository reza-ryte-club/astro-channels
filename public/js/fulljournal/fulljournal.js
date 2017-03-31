$(document).ready(function() {
  var urlString = window.location.pathname;
  var jId = urlString.split('/', 3);
  jId = jId[2].replace(/ /g, ''); // remove white space

  $('.edit').click(function() {
    location.href = '/editjournal/' + jId;
  });

  getJSON('/journals/'+ jId)
    .then(function(data) {
      if(data.journal_type!==1) {
        $('.edit').show();
      }
      jQuery('<div/>', {
        class: 'fullJournalBody',
        html: data.title
      }).appendTo('.drum-title').css({});


      if (data.journal_type !== 1) {
        jQuery('<div/>', {
          class: 'fullJournalBody',
          html: data.content
        }).appendTo('.drum-body').css({});
      } else {
        var mylist_status = [];
        for (var m = 0; m < data.taskitems.length; m++) {
          var n = m+1;
          if(data.taskitems_status[m]) {
            mylist_status.push(1);
            jQuery('<div/>', {
              class: 'fullJournalBody',
              html: '<paper-checkbox class=\'green\' '+
              'id=\'' + n + '\' checked>' + data.taskitems[m]+
              '</paper-checkbox>'
            }).appendTo('.drum-body').css({});
          } else {
            mylist_status.push(0);
            jQuery('<div/>', {
              class: 'fullJournalBody',
              html: '<paper-checkbox class=\'green\' id=\''+
                n + '\' >' + data.taskitems[m] + '</paper-checkbox>'
            }).appendTo('.drum-body').css({});
          }
        }
        $('paper-checkbox').change(function() {
          if ($(this).prop('checked')) {
            mylist_status[parseInt($(this).prop('id'))-1]=1;
          } else {
            mylist_status[parseInt($(this).prop('id'))-1]=0;
          }

          var tasksUpdateData = {
            taskitems_status: mylist_status
          };

          $.ajax({
            type: 'PUT',
            url: '/journals/' + jId,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(tasksUpdateData),
            success: function(data) {
            }
          });
        });
      }
    });
});
