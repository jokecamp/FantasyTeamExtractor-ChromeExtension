
var getEplRoster = function(html) {

  var players = [];
  var rows = $("<table>" + html + "</table>").find("tbody tr");

  var txt = "";
  for(var i=0; i < rows.length; i++) {

    var team =  $(rows[i]).find("td > img.ismShirt").attr('title');
    var player = $(rows[i]).find(":nth-child(5)")[0].innerHTML;
    var viceCapt = $(rows[i]).find("img.ismViceCaptain.ismViceCaptainOn");
    var capt = $(rows[i]).find("img.ismCaptain.ismCaptainOn");

    var p = { name: player, team: team };

    if (viceCapt.length > 0) p.viceCaptain = true;
    if (capt.length > 0) p.captain = true;

    players.push(p)

  }

  var name = $(".ismTabHeading").text();
  var roster = {"name": name, "formation": "4-4-2", "players" : players };
  return roster;
}

var getYahooRoster = function(html) {

  var roster = {name: 'yahoo fantasy team', players:[]};

  var items = $(html).find(".pos-name");

  items.each(function(i) {
    console.log($(this).text());
    roster.players.push({
      name: $(this).text()
    })
  });

  return roster;
}

chrome.extension.onMessage.addListener(function(request, sender) {
  if (request.action == "getSource") {

    //console.log(request.source);
    console.log(request);

    var roster = {players: []};

    if (request.url.indexOf('sports.yahoo.com/fantasy/soccer') > -1) {
      roster = getYahooRoster(request.source);
    }else {
      roster = getEplRoster(request.source);
    }

    console.log(roster);
    $('#json').val(JSON.stringify(roster.players));

    if (roster.players.length == 15) {

        $.ajax({
          type: "POST",
          url: 'http://localhost:8080/api/rosters',
          contentType: 'application/json',
          data: JSON.stringify(roster),
          success: function(data, textStatus, jqXHR ) {
            console.log(textStatus);
            console.log(data);

            var href ="http://localhost:8080/index.html?id=" + data._id;
            $("#link").attr("href", href);
            $("#link").html("See Roster at " + href);
          }
        });
      }
    }
});

function onWindowLoad() {

  console.log("running popup.js on load");

  chrome.tabs.executeScript(null, {
    file: "getPageSource.js"
  }, function() {
    // If you try and inject into an extensions page or the webstore/NTP you'll get an error
    if (chrome.extension.lastError) {
      message.innerText = 'There was an error injecting script : \n' + chrome.extension.lastError.message;
    }
  });

}

window.onload = onWindowLoad;
