
var React = require('react');
var ReactDOM = require('react-dom');
var swal = require('sweetalert');

function strip(html)
{
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}

var Journal = React.createClass({
  deleteJournalsFromServer: function() {

  },
  doDelete: function() {
    var journal_id = this.props.journal_id;


    swal({
      title: "Are you sure?",
      text: "You will not be able to recover this journal!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, delete it!",
      closeOnConfirm: false,
      showLoaderOnConfirm: true,
    }, function() {
      $.ajax({
        url: '/journals/' + journal_id,
        dataType: 'json',
        method: 'delete',
        cache: false,
        success: function(data) {
          this.setState({
            data: data
          });
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });

      setTimeout(function() {
        swal({
          title: "Deleted!",
          text: "Your journal has been deleted.",
          type: "success",
          timer: 1000,
          showConfirmButton: false
        });
      }, 2000);
    });



  },
  render: function() {
    var journal_id = this.props.journal_id;
    var journalUrl = "/fulljournal/" + journal_id;
    var journalEditUrl = "/editjournal/" + journal_id;
    var journal_type = this.props.journal_type;
    if(journal_type==1){
      return ( < div >
        <h2> <a href = {journalUrl} > {this.props.title} < /a></h2>

        < p > {
          this.props.children
        } < /p> < p >
         < a onClick = {
          this.doDelete
        }
        href = "#" > < span className = "glyphicon glyphicon-trash" > <
        /span></a >
        < /p>

        < hr / >
        < /div>

      );

    }else{
      return ( < div >
        <h2> <a href = {journalUrl} > {this.props.title} < /a></h2>

        < p > {
          this.props.children
        } < /p> < p > < a href = {journalEditUrl} > < span className =
        "glyphicon glyphicon-edit" > < /span></a >
        &nbsp; &nbsp; &nbsp; &nbsp; < a onClick = {
          this.doDelete
        }
        href = "#" > < span className = "glyphicon glyphicon-trash" > <
        /span></a >
        < /p>

        < hr / >
        < /div>

      );
    }

  }
});

var JournalBox = React.createClass({
  loadJournalsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({
          data: data
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },

  getInitialState: function() {
    return {
      data: []
    };
  },
  componentDidMount: function() {
    this.loadJournalsFromServer();
    setInterval(this.loadJournalsFromServer, this.props.pollInterval);
  },
  render: function() {
    return ( < div className = "journalBox" >
      < JournalList data = {
        this.state.data
      }
      />  </div >
    );
  }
});

var JournalList = React.createClass({
      render: function() {
        var journalNodes = this.props.data.map(function(journal) {

          var mainContent = journal.content;

          if (mainContent) {
            if (mainContent.length < 300) {
              mainContent = strip(journal.content);
            } else {
              mainContent = strip(journal.content.substr(0, 100))+ "... ... ...";
            }


          } else {
            if(journal.journal_type==1){//this is a list

              var tempContent="";
              for(var m=0;journal.taskitems[m];m++){
                if(m==journal.taskitems.length-1){
                    tempContent = tempContent + journal.taskitems[m]+".";
                }
                else{
                  tempContent = tempContent + journal.taskitems[m]+", ";
                }


              }

              mainContent = tempContent;

            }
            else{mainContent = "";}


          }

          return ( < Journal title = {
              journal.title
            }
            key = {
              journal._id
            }
            journal_id = {
              journal._id
            }
            journal_type = {journal.journal_type}
             > {
              mainContent
            } < /Journal>
          );
        });
        return ( < div className = "journalList" > {
            journalNodes
          } < /div>);
        }
      });



    ReactDOM.render( < JournalBox url = "/journals"
      pollInterval = {
        2000
      }
      />, document.getElementById('journals') );
