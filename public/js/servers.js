$(document).ready(function() {
	loadServers();
	$("#submitNewServerButton").hide();
	$("#cancelNewServerButton").hide();
	
	$("#newServerButton").click(function() {
		if (!$("#newServer").length) {
			$("#serverTableBody").append('<tr id="newServer"></tr>');
			$("#newServer").append('<td><input type="text" name="serverName" class="form-control" id="newServerName"></td>');
			$("#newServer").append('<td><input type="text" name="serverIP" class="form-control" id="newServerIP"></td>');
			$("#newServer").append('<td></td>');
		}
		
		$("#submitNewServerButton").show();
		$("#cancelNewServerButton").show();
		$(this).hide();

	});
	
	$("#cancelNewServerButton").click(function() {
		$(this).hide();
		$("#submitNewServerButton").hide();
		$("#newServer").remove();
		$("#newServerButton").show();
	});
});

function loadServers() {
	/*$.post("https://www.mcadmin.xyz/request/server/loadServers.php",
  		  {
  		  },
  		  function(data, status){
  			  var obj = JSON.parse(data);
  			  console.log(obj);
  			  $("#serverTableBody").empty();
  			  obj.forEach(processServer);
  		  });*/
}

function processServer(server) {
	$("#serverTableBody").append('<tr id="' + server.ID + '"></tr>');
	$("#" + server.ID).append('<td>' + server.name + '</td>');
	$("#" + server.ID).append('<td>' + server.ip + '</td>');
	$("#" + server.ID).append('<td>' + server.numPlayers + '</td>');
}