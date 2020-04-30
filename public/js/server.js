$(document).ready(function() {
	//loadPlayers()
	$('#serverToken').hide();

	$('#showServerTokenButton').click(function() {
		$(this).hide();
		$('#serverToken').show();
	});
});

function loadPlayers() {
	$.post("https://www.mcadmin.xyz/request/player/loadPlayers.php",
  		  {
  		    s: getSearchParameters()['s']
  		  },
  		  function(data, status){
  			  var obj = JSON.parse(data);
  			  $("#playerTableBody").empty();
  			  obj.players.forEach(processPlayer);
  		  });
}

function processPlayer(player) {r
	$("#playerTableBody").append('<tr id="' + player.uuid + '"></tr>');
	$("#" + player.uuid).append('<td>' + player.username + '</td>');
	$("#" + player.uuid).append('<td>' + player.uuid + '</td>');
	$("#" + player.uuid).append('<td>' + player.status + '</td>');
}

function getSearchParameters() {
    var prmstr = window.location.search.substr(1);
    return prmstr != null && prmstr != "" ? transformToAssocArray(prmstr) : {};
}

function transformToAssocArray( prmstr ) {
  var params = {};
  var prmarr = prmstr.split("&");
  for ( var i = 0; i < prmarr.length; i++) {
      var tmparr = prmarr[i].split("=");
      params[tmparr[0]] = tmparr[1];
  }
  return params;
}
