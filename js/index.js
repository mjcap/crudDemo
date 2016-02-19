"use strict";

//var server="localhost";
var server="odm.capbpm.com";

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}

var selectedVal="";

var operationsText =   "<input type=\"radio\" name=\"operations\" value=\"generateTable\">Generate Table</input><br>" +
    "<input type=\"radio\" name=\"operations\" value=\"createRecord\">Create Record</input><br>" +
    "<input type=\"radio\" name=\"operations\" value=\"readRecord\">Read Record</input><br>" +
    '<div id="readTableSelect"> </div>' +
    "<input type=\"radio\" name=\"operations\" value=\"updateRecord\">Update Record</input><br>" +
    "<input type=\"radio\" name=\"operations\" value=\"deleteRecord\">Delete Record</input><br>" +
    "<input type=\"radio\" name=\"operations\" value=\"dropTable\">Drop Table</input><br>" +
    "<input type=\"radio\" name=\"operations\" value=\"getComparisons\">Get Comparisons</input><br>" +
    "<input type=\"radio\" name=\"operations\" value=\"listTables\">List Tables</input><br>" +
    "<input type=\"radio\" name=\"operations\" value=\"listColumns\">List Columns</input><br>" +
    "<input type=\"radio\" name=\"operations\" value=\"queryTable\">Query</input><br>" +
    "<input type='button' value='Go' id='doOp'><br>";

var customerFormCreate="Customer Data<br>"+
    "<table>" +
    "<tr><td>First Name</td><td><textarea id='customerCreateFirstName' row='1' col='50'/></td></tr>"+
    "<tr><td>Last Name</td><td><textarea id='customerCreateLastName' row='1' col='50'/></td></tr>"+
    "<tr><td>Account Balance</td><td><textarea id='customerCreateAccountBalance' row='1' col='50'/></td></tr>"+
    "<tr><td>Age</td><td><textarea id='customerCreateAge' row='1' col='50'/></td></tr>"+
    "<tr><td>Active</td><td><textarea id='customerCreateActive' row='1' col='50'/></td></tr>"+
    "<tr><td>Start Date</td><td><textarea id='customerCreateStartDate' row='1' col='50'/></td></tr>"+
    "</table>" +
    "<br>"+
    "Customer Map Entry Data<br>"+
    "<table>" +
    "<tr><td>Key</td><td><textarea id='customerMapEntryCreateKey' row='1' col='50'/></td></tr>"+
    "<tr><td>Value</td><td><textarea id='customerMapEntryCreateValue' row='1' col='50'/></td></tr>"+
    "</table>" +
    "<button onclick='createRecord()'>Create Record</button>";

/*var customerReadInput="Read<br> <table><tr><td>Table</td><td><textarea id='tableName' row='1' col='10'/></td></tr><tr><td>Comparison Column Name</td><td><textarea id='compColName' row='1' col='10'/></td></tr><tr><td>Comparison Type</td><td><textarea id='compType' row='1' col='10'/></td></tr><tr><td>Comparison Value</td><td><textarea id='compValue' row='1' col='10'/></td></tr></table><button onclick='readRecord()'>Read Record</button>";*/

var customerUpdateInput="Update<br>"+
    "<table>" +
    "<tr><td>Table</td><td><textarea id='updateTableName' row='1' col='10'/></td></tr>" +
    "<tr><td>Update Column Name</td><td><textarea id='updateColName' row='1' col='10'/></td></tr>" +
    "<tr><td>Update Column Value</td><td><textarea id='updateColValue' row='1' col='10'/></td></tr>" +
    "<tr><td>Comparison Column Name</td><td><textarea id='updateCompColName' row='1' col='10'/></td></tr>" +
    "<tr><td>Comparison Type</td><td><textarea id='updateCompType' row='1' col='10'/></td></tr>" +
    "<tr><td>Comparison Value</td><td><textarea id='updateCompValue' row='1' col='10'/></td></tr>" +
    "</table>" +
    "<br>" +
    "<button onclick='updateRecord()'>Update Record</button>";

var customerUpdateInputGivenTable="Update<br>"+
    "<table>" +
    "<tr><td>Table</td><td><textarea id='updateTableName' row='1' col='10'/></td></tr>" +
    "<tr><td>Update Column Name</td><td><textarea id='updateColName' row='1' col='10'/></td></tr>" +
    "<tr><td>Update Column Value</td><td><textarea id='updateColValue' row='1' col='10'/></td></tr>" +
    "<tr><td>Comparison Column Name</td><td><textarea id='updateCompColName' row='1' col='10'/></td></tr>" +
    "<tr><td>Comparison Type</td><td><textarea id='updateCompType' row='1' col='10'/></td></tr>" +
    "<tr><td>Comparison Value</td><td><textarea id='updateCompValue' row='1' col='10'/></td></tr>" +
    "</table>" +
    "<br>" +
    "<button onclick='updateRecord()'>Update Record</button>";

var customerDeleteInput="Delete<br>" +
    "<table>"+
    "<tr><td>Table</td><td><textarea id='deleteTableName' row='1' col='10'/></td></tr>"+
    "<tr><td>Comparison Column Name</td><td><textarea id='deleteCompColName' row='1' col='10'/></td></tr>"+
    "<tr><td>Comparison Type</td><td><textarea id='deleteCompType' row='1' col='10'/></td></tr>"+
    "<tr><td>Comparison Value</td><td><textarea id='deleteCompValue' row='1' col='10'/></td></tr>"+
    "</table>"+
    "<br>" +
    "<button onclick='deleteRecord()'>Delete Record</button>";

/*var generateTableInput="Generate Table<br>" +
    "<table>"+
    "<tr><td>XSD Name</td><td><textarea id='xsdName' row='1' col='50'/></td></tr>"+
    "<tr><td>Version Number</td><td><textarea id='versionNumber' row='1' col='100'>2064.374d42f7-af28-4f6d-a1c0-b34453c39b64T</textarea></td></tr>"+
    "</table>"+
    "<br>" +
    "<button onclick='generateTable()'>Generate Table</button>";
*/

var selectedTable="";

var tables = [];

function deleteRecord(){
    var deleteTable=$('textarea#deleteTableName').val();
    var deleteCompColName=$('textarea#deleteCompColName').val();
    var deleteCompType=$('textarea#deleteCompType').val();
    var deleteCompValue=$('textarea#deleteCompValue').val();
    var deleteString= "{\"table\":\""+deleteTable+"\", " +
	"\"comps\":[ {\"column\":\""+deleteCompColName+"\" , \"comp\":\""+deleteCompType+"\", \"value\":\""+deleteCompValue+"\" }]}";
    console.log("deleteString="+deleteString);

    $("#input").hide();
    $("#output").hide()
    $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    crossDomain: true,
            url:    "http://"+server+":8080/crudService"+selectedVal+"/delete?input="+deleteString,
            success: function(msg) {
		$("#output").html("<br> SUCCESS!  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            }
    });
}

function updateRecord(){
    var tableToUpdate=$('textarea#updateTableName').val();
    var updateColName = $('textarea#updateColName').val();
    var updateColValue = $('textarea#updateColValue').val();
    var updateCompColName = $('textarea#updateCompColName').val();
    var updateCompType = $('textarea#updateCompType').val();
    var updateCompValue = $('textarea#updateCompValue').val();

    var updateString = "{\"table\":\""+tableToUpdate+"\",\"colval\":[{\"column\":\""+updateColName+"\",\"value\":\""+updateColValue+"\"}],\"comps\":[ {\"column\":\""+updateCompColName+"\" , \"comp\":\""+updateCompType+"\",\"value\":\""+updateCompValue+"\" }]}";

    console.log("updateString="+updateString);

    $("#input").hide();
    $("#output").hide()
    $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    crossDomain: true,
            url:    "http://"+server+":8080/crudService"+selectedVal+"/update?input="+updateString,
            success: function(msg) {
		$("#output").html("<br> SUCCESS!  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            }
    });

}

function readRecord(){
    var tableToRead=$('textarea#tableName').val();
    var compColName=$('textarea#compColName').val();
    var compType=$('textarea#compType').val();
    var compValue=$('textarea#compValue').val();
    var readString;

    if (compType == "="){
      readString= "{\"table\":\""+tableToRead+"\", " +
  	      "\"comps\":[ {\"column\":\""+compColName+"\" , \"comp\":\""+compType+"\", \"value\":\""+compValue+"\" }]}";
    }
    else if (compType == "in"){
      readString= "{\"table\":\""+tableToRead+"\", " +
  	      "\"comps\":[ {\"column\":\""+compColName+"\" , \"comp\":\""+compType+"\", \"value\":["+compValue+"] }]}";
    }
    else{
      readString= "{\"table\":\""+tableToRead+"\", " +
  	      "\"comps\":[]}";
    }

    console.log("readString="+readString);

    $("#input").hide();
    $("#output").hide()
    $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    crossDomain: true,
            url:    "http://"+server+":8080/crudService"+selectedVal+"/read?input="+readString,
            success: function(msg) {
	        var formattedString = JSON.stringify(msg, null, 2);
		console.log("read formattedString="+formattedString);
		$("#output").html("<br> SUCCESS!  Service returned:  <pre>"+JSON.stringify(msg, null, 2)+"</pre>");
		$("#output").show();
            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            }
    });

}

function createSecondaryTable(serviceType,key,value){

    var createSecondaryTableString;
    if (selectedVal == "Mysql"){
	createSecondaryTableString="{\"table\":\"customermapentry\", \"colval\":[ {\"column\":\"keycol\", \"value\":\""+key+"\" }, {\"column\":\"value\" ,\"value\":\""+value+"\" }]}";
    }
    else{
	createSecondaryTableString="{\"table\":\"customermapentry\", \"colval\":[ {\"column\":\"key\", \"value\":\""+key+"\" }, {\"column\":\"value\" ,\"value\":\""+value+"\" }]}";
    }

    console.log("http://localhost:8080/crudService"+serviceType+"/create?input="+createSecondaryTableString);
    $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    crossDomain: true,
            url:    "http://"+server+":8080/crudService"+serviceType+"/create?input="+createSecondaryTableString,
            success: function(msg) {
                //need to build createCustomerMapEntryString and pass it to method that does that ajax call here

		$("#output").html("<br> SUCCESS!  Service returned:  "+JSON.stringify(msg));
            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            }
    });
}


function createRecord(){
    //Customer
    var customerCreateFirstName = $('textarea#customerCreateFirstName').val();
    var customerCreateLastName = $('textarea#customerCreateLastName').val();
    var customerCreateAccountBalance = $('textarea#customerCreateAccountBalance').val();
    var customerCreateAge = $('textarea#customerCreateAge').val();
    var customerCreateActive = $('textarea#customerCreateActive').val();
    var customerCreateStartDate = $('textarea#customerCreateStartDate').val();

    //Customer Map Entry Data
    var customerMapEntryCreateKey = $('textarea#customerMapEntryCreateKey').val();
    var customerMapEntryCreateValue = $('textarea#customerMapEntryCreateValue').val();

    console.log("customerCreateFirstName="+customerCreateFirstName);
    console.log("customerCreateLastName="+customerCreateLastName);
    console.log("customerCreateAccountBalance="+customerCreateAccountBalance);
    console.log("customerCreateAge="+customerCreateAge);
    console.log("customerCreateActive="+customerCreateActive);
    console.log("customerCreateStartDate="+customerCreateStartDate);

    //Customer Map Entry Data
    console.log("customerMapEntryCreateKey="+customerMapEntryCreateKey);     //need to use this value as aliascustomermapentry in Customer rec
    console.log("customerMapEntryCreateValue="+customerMapEntryCreateValue);


    var createCustomerString="{\"table\":\"customer\", \"colval\":[ {\"column\":\"startdate\", \"value\":\""+customerCreateStartDate+"\" }, {\"column\":\"accountbalance\" ,\"value\":\""+customerCreateAccountBalance+"\" }, {\"column\":\"age\" ,\"value\":\""+customerCreateAge+"\" }, {\"column\":\"firstname\" , \"value\":\""+customerCreateFirstName+"\" }, {\"column\":\"lastname\", \"value\":\""+customerCreateLastName+"\" }, {\"column\":\"isactive\" ,\"value\":\""+customerCreateActive+"\" }, {\"column\":\"aliascustomermapentry\" ,\"value\":\""+customerMapEntryCreateKey+"\" }]}";

    $("#input").hide();
    $("#output").hide();
    $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    crossDomain: true,
            url:    "http://"+server+":8080/crudService"+selectedVal+"/create?input="+createCustomerString,
            success: function(msg) {
                //need to build createCustomerMapEntryString and pass it to method that does that ajax call here

		$("#output").html("<br> SUCCESS!  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
		createSecondaryTable(selectedVal,customerMapEntryCreateKey,customerMapEntryCreateValue);
            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            }
    });


}


function handleDrop(){

    var tableName = $('textarea#tableToDrop').val()
    console.log("selectedVal="+selectedVal+" dropping table " + tableName);
    $("#input").hide();
    $("#output").hide();
   /*$.ajax({
            type: "GET",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    crossDomain: true,
            url:    "http://localhost:8080/crudService"+selectedVal+"/deleteTable?input="+tableName,
            success: function(msg) {
		$("#output").html("<br> SUCCESS!  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            }
	    });*/
    $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    //crossDomain: true,
            url:    "http://"+server+":8080/crudService"+selectedVal+"/deleteTable?input="+tableName,
            success: function(msg) {
		$("#output").html("<br> SUCCESS!  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            }
    });
}

function generateTable(){

        var xsdName = $('textarea#xsdName').val();
        var versionNumber = $('textarea#versionNumber').val();


        console.log("generateTable() xsdName="+xsdName.capitalize()+" versionNumber="+versionNumber);

        var unencodedInput = "https://bpm.capbpm.com:9443/webapi/ViewSchema.jsp?type="+xsdName.capitalize()+"&version="+versionNumber

	var encodedUrl = encodeURIComponent(unencodedInput);

    console.log("encodedUrl="+encodedUrl);

    $("#input").hide();
    $("#output").hide();

	$.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	        crossDomain: true,
            url:    "http://"+server+":8080/crudService"+selectedVal+"/generateTable3?input="+encodedUrl,
            success: function(msg) {
		                $("#output").html("<br> SUCCESS!  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            }
          });
}

function getComparisons(){
	$.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    crossDomain: true,
            url:    "http://"+server+":8080/crudService"+selectedVal+"/getComparisons",
            success: function(msg) {

		var s = '<select id="selectId" name="selectName">';
        s +=   '<option></option><br>';
                for(var idx in msg) {
		    console.log("idx="+idx+" msg[idx]="+msg[idx]);
		    s +=   '<option value="'+idx + '">' + msg[idx] + '</option><br>';
                }
		s += '</select>';

		$("#output").html("<br> SUCCESS!  Service returned:  "+JSON.stringify(msg) + "<br>"+s);

		$("#output").show();
            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            }
          });
}

function getTables(){

	$.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    crossDomain: true,
            url:    "http://"+server+":8080/crudService"+selectedVal+"/listTables",
            success: function(msg) {
                tables = new Array();
		var s = '<select id="selectTable" name="selectTableName">';
		var tableArr = msg.tableNames;
		var first = true;
		var tablesIdx = 0;
                for(var idx in tableArr) {
                    tables.push(tableArr[idx]);
                }

            },
            error: function(msg) {
		tables = new Array();
                alert("Unable to list available tables");
            }
          });
}

function showTables(divId, nextFunction){

    		var s = '<br><br><select id="selectTable" name="selectTableName">';
        s +=   '<option></option><br>';
		var first = true;
                for(var idx in tables) {
		    console.log("idx="+idx+" tables[idx]="+tables[idx]);
		    if (first){
			selectedTable = tables[idx];
			first = false;
		    }
		    s +=   '<option value="'+tables[idx] + '">' + tables[idx] + '</option><br>';
                }
		s += '</select></br></br>';

		$(divId).html(s);

		$(divId).show();

		$('#selectTable').on('change', function() {
		    selectedTable = this.value;
		    //list columns
		    listColumns2(divId,selectedTable, nextFunction);
		    //perform action
                });

}

function insertRec(inputObj){
    $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    crossDomain: true,
            url:    "http://"+server+":8080/crudService"+selectedVal+"/create?input="+JSON.stringify(inputObj),
            success: function(msg) {
                //need to build createCustomerMapEntryString and pass it to method that does that ajax call here

		$("#output").html("<br> SUCCESS!  Service returned:  "+JSON.stringify(msg));
            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            }
    });
}

function showInputForm(tableForInsert){
    var divId = '#output';
    $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    //crossDomain: true,
            url:    "http://"+server+":8080/crudService"+selectedVal+"/listColumns?input="+tableForInsert,
        success: function(msg) {

            var columnNames = [];
	        var divIdCurrentHtml = $(divId).html();

	    var keys = listKeys(msg);
        var formattedString = "<table>";
        var translatedType = "";
	    for (var idx=0;idx<keys.length; idx++){
		    //console.log("listColumsn2 key="+keys[idx]+" val="+msg[keys[idx]].columnName+" "+msg[keys[idx]].columnType+" "+msg[keys[idx]].isKey);
            columnNames.push(msg[keys[idx]].columnName);
            if (msg[keys[idx]].columnType == "UTF8Type"){
                translatedType = "StringType";
            }
            else{
                translatedType = msg[keys[idx]].columnType;
            }

            if (translatedType == "TimestampType"){
               var now = new Date();
	           //$("#customerCreateStartDate").val(now.format("mm/dd/yyyy hh:MM:ss"));
               formattedString += "<tr><td>"+msg[keys[idx]].columnName+"</td><td>"+
                      translatedType+"</td><td><textarea id=\""+msg[keys[idx]].columnName+"\" >"+now.format("mm/dd/yyyy hh:MM:ss")+"</textarea></td></tr>";
            }
            else{
            formattedString += "<tr><td>"+msg[keys[idx]].columnName+"</td><td>"+
                      translatedType+"</td><td><textarea id=\""+msg[keys[idx]].columnName+"\" >"+"</textarea></td></tr>";
            }
	    }
	    formattedString+="<table><button id=\"insert\">Insert</button>";

		$(divId).html(divIdCurrentHtml+formattedString);
	        $(divId).show();
        $("#insert").click(function(){

            /*{"table":"customer","colval":[ {"column":"startDate", "value":"2015-11-23 12:00:00" },{"column":"accountBalance" ,"value":"1.00" }, {"column":"age","value":"32" }, {"column":"firstName" , "value":"joe" },{"column":"lastName", "value":"fabietz" }, {"column":"isActive","value":"true" }]}*/

            var inputObj = {};
            inputObj.table = tableForInsert;
            var colvalArr = [];

            for (var idx=0; idx<columnNames.length; idx++){
                var columnObj = {};
                var newValId = "#"+columnNames[idx];
                console.log("column="+columnNames[idx]+" value="+$(newValId).val());
                columnObj.column = columnNames[idx];
                columnObj.value = $(newValId).val();
                colvalArr.push(columnObj);
            }
            inputObj.colval = colvalArr;
            insertRec(inputObj);
            console.log(JSON.stringify(inputObj,null,2));
        });

            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            }
    });
}

function updateTable(updateString){
    console.log("updateString="+updateString);
    $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    crossDomain: true,
            url:    "http://"+server+":8080/crudService"+selectedVal+"/update?input="+updateString,
            success: function(msg) {
		$("#output").html("<br> SUCCESS!  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            }
    });
}
function deleteFromTable(deleteString){
    console.log("deleteString="+deleteString);
    console.log("server="+server);
    $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    crossDomain: true,
            url:    "http://"+server+":8080/crudService"+selectedVal+"/delete?input="+deleteString,
            success: function(msg) {
		$("#output").html("<br> SUCCESS!  Service returned:  <pre>"+JSON.stringify(msg, null, 2)+"</pre>");
		$("#output").show();
            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            }
    });
}
function readTable(readString){
    console.log("readString="+readString);
    console.log("server="+server);
    $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    crossDomain: true,
            url:    "http://"+server+":8080/crudService"+selectedVal+"/read?input="+readString,
            success: function(msg) {
		$("#output").html("<br> SUCCESS!  Service returned:  <pre>"+JSON.stringify(msg, null, 2)+"</pre>");
		$("#output").show();
            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            }
    });
}
function showInputFormForDelete(tableForDelete){

    //get columns for table
     var divId = '#output';
    var deleteInputGivenTable="Delete<br>"+
    "<table>" +
    "<tr><td>Table</td><td>"+tableForDelete+"</td></tr>" +
    "<tr><td>Comparison Column Name</td><td><textarea id='deleteCompColName' row='1' col='10'/></td></tr>" +
    "<tr><td>Comparison Type</td><td><textarea id='deleteCompType' row='1' col='10'/></td></tr>" +
    "<tr><td>Comparison Value</td><td><textarea id='deleteCompValue' row='1' col='10'/></td></tr>" +
    "</table>" +
    "<br>";


    $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            url:    "http://"+server+":8080/crudService"+selectedVal+"/listColumns?input="+tableForDelete,
        success: function(msg) {

            var columnNames = [];


        $(divId).html("");
	    var keys = listKeys(msg);
            console.log("msg="+JSON.stringify(msg,null,2));
        var formattedString = "<br>New Values<br><table>";
        var translatedType = "";
        var keyColumnName = "";

	    for (var idx=0;idx<keys.length; idx++){
            if (msg[keys[idx]].isKey == true){
                //$('#updateCompColName').val(msg[keys[idx]].columnName);
                keyColumnName = msg[keys[idx]].columnName

            }

	    }
        formattedString += "<table>";
            console.log("deleteInputGivenTable="+deleteInputGivenTable);
		$(divId).html(deleteInputGivenTable+"<br><button id='deleteRecord'>Delete Record</button>");
	        $(divId).show();
            $('#deleteCompColName').val(keyColumnName);
            $('#deleteCompType').val("=");
            $('#deleteCompColName').prop('readonly', true);
            $('#deleteCompType').prop('readonly', true);
        $("#deleteRecord").click(function(){
            /*{"table":"customer",
                "comps":[ {"column":"startDate" , "comp":"=", "value":"2015-11-23 12:00:00" }]}
            */
            var deleteObj = {};
            deleteObj.table = tableForDelete;

            var compColName = $('#deleteCompColName').val();
            var compColType = $('#deleteCompType').val();
            var compValue = $('#deleteCompValue').val();

            var compsArr = [];
            var compsObj = {};
            if ($('#deleteCompValue').val().trim() != ""){
                compsObj.column = $('#deleteCompColName').val();
                compsObj.comp = $('#deleteCompType').val();
                compsObj.value = $('#deleteCompValue').val();
                compsArr.push(compsObj);
                deleteObj.comps = compsArr;
                console.log("deleteObj="+JSON.stringify(deleteObj,null,2));
                deleteFromTable(JSON.stringify(deleteObj));
            }
            else{
                alert("You MUST specify a comparison to delete records");
            }


        });

            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            }
    });


    var currentHtml = $("#output").html();


		$("#output").html(currentHtml+"<br>"+customerUpdateInputGivenTable);
		$("#output").show();

}

function showInputFormForRead(tableForRead){

    //get columns for table
     var divId = '#output';
    var readInputGivenTable="Read<br>"+
    "<table>" +
    "<tr><td>Table</td><td>"+tableForRead+"</td></tr>" +
    "<tr><td>Comparison Column Name</td><td><textarea id='readCompColName' row='1' col='10'/></td></tr>" +
    "<tr><td>Comparison Type</td><td><textarea id='readCompType' row='1' col='10'/></td></tr>" +
    "<tr><td>Comparison Value</td><td><textarea id='readCompValue' row='1' col='10'/></td></tr>" +
    "</table>" +
    "<br>";


    $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    //crossDomain: true,
            url:    "http://"+server+":8080/crudService"+selectedVal+"/listColumns?input="+tableForRead,
        success: function(msg) {

            var columnNames = [];
	        //var divIdCurrentHtml = $(divId).html();

        $(divId).html("");
	    var keys = listKeys(msg);
            console.log("msg="+JSON.stringify(msg,null,2));
        var formattedString = "<br>New Values<br><table>";
        var translatedType = "";
        var keyColumnName = "";

	    for (var idx=0;idx<keys.length; idx++){
            if (msg[keys[idx]].isKey == true){
                //$('#updateCompColName').val(msg[keys[idx]].columnName);
                keyColumnName = msg[keys[idx]].columnName

            }

	    }
        formattedString += "<table>";
            console.log("readInputGivenTable="+readInputGivenTable);
		$(divId).html(readInputGivenTable+"<br><button id='readRecord'>Read Record</button>");
	        $(divId).show();
            $('#readCompColName').val(keyColumnName);
            $('#readCompType').val("=");
            $('#readCompColName').prop('readonly', true);
            $('#readCompType').prop('readonly', true);
        $("#readRecord").click(function(){
            /*{"table":"customer",
                "comps":[ {"column":"startDate" , "comp":"=", "value":"2015-11-23 12:00:00" }]}
            */
            var readObj = {};
            readObj.table = tableForRead;

            var compColName = $('#readCompColName').val();
            var compColType = $('#readCompType').val();
            var compValue = $('#readCompValue').val();

            var compsArr = [];
            var compsObj = {};
            if ($('#readCompValue').val().trim() != ""){
                compsObj.column = $('#readCompColName').val();
                compsObj.comp = $('#readCompType').val();
                compsObj.value = $('#readCompValue').val();
                compsArr.push(compsObj);
            }
            readObj.comps = compsArr;

            var colvalArr = [];
            var colvalObj;

            console.log("readObj="+JSON.stringify(readObj,null,2));

            readTable(JSON.stringify(readObj));

        });

            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            }
    });


    var currentHtml = $("#output").html();


		$("#output").html(currentHtml+"<br>"+customerUpdateInputGivenTable);
		$("#output").show();

}

function showInputFormForUpdate(tableForUpdate){

    //get columns for table
     var divId = '#output';
    var customerUpdateInputGivenTable="Update<br>"+
    "<table>" +
    "<tr><td>Table</td><td>"+tableForUpdate+"</td></tr>" +
    "<tr><td>Comparison Column Name</td><td><textarea id='updateCompColName' row='1' col='10'/></td></tr>" +
    "<tr><td>Comparison Type</td><td><textarea id='updateCompType' row='1' col='10'/></td></tr>" +
    "<tr><td>Comparison Value</td><td><textarea id='updateCompValue' row='1' col='10'/></td></tr>" +
    "</table>" +
    "<br>";


    $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    //crossDomain: true,
            url:    "http://"+server+":8080/crudService"+selectedVal+"/listColumns?input="+tableForUpdate,
        success: function(msg) {

            var columnNames = [];
	        //var divIdCurrentHtml = $(divId).html();

        $(divId).html("");
	    var keys = listKeys(msg);
            console.log("msg="+JSON.stringify(msg,null,2));
        var formattedString = "<br>New Values<br><table>";
        var translatedType = "";
        var keyColumnName = "";

	    for (var idx=0;idx<keys.length; idx++){
            if (msg[keys[idx]].isKey == true){
                //$('#updateCompColName').val(msg[keys[idx]].columnName);
                keyColumnName = msg[keys[idx]].columnName

            }
            else{
                columnNames.push(msg[keys[idx]].columnName);
                if (msg[keys[idx]].columnType == "UTF8Type"){
                    translatedType = "StringType";
                }
                else{
                    translatedType = msg[keys[idx]].columnType;
                }

                if (translatedType == "TimestampType"){
                   var now = new Date();
                   formattedString += "<tr><td>"+msg[keys[idx]].columnName+"</td><td>"+
                          translatedType+"</td><td><textarea id=\""+msg[keys[idx]].columnName+
                          "\" >"+now.format("mm/dd/yyyy hh:MM:ss")+"</textarea></td></tr>";
                }
                else{
                formattedString += "<tr><td>"+msg[keys[idx]].columnName+"</td><td>"+
                          translatedType+"</td><td><textarea id=\""+msg[keys[idx]].columnName+
                          "\" >"+"</textarea></td></tr>";
                }
            }

	    }
        formattedString += "<table>";
            console.log("customerUpdateInputGivenTable="+customerUpdateInputGivenTable);
            console.log("formattedString="+formattedString);
		$(divId).html(customerUpdateInputGivenTable+"<br>"+formattedString+
                      "<br><button id='updateRecord'>Update Record</button>");
	        $(divId).show();
            $('#updateCompColName').val(keyColumnName);
            $('#updateCompType').val("=");
            $('#updateCompColName').prop('readonly', true);
            $('#updateCompType').prop('readonly', true);
        $("#updateRecord").click(function(){
            /*{"table":"customer",
              "colval":[{"column":"accountBalance","value":"71.00"},
                        {"column":"age" , "value":"132"},
                        {"column":"firstName","value":"joseph" },
                        {"column":"isActive","value":"false" }, ],
              "comps":[ {"column":"startDate" , "comp":"=","value":"2015-11-23 12:00:00" }]}*/
            var updateObj = {};
            updateObj.table = tableForUpdate;

            console.log("columnNames="+JSON.stringify(columnNames));
            var compColName = $('#updateCompColName').val();
            var compColType = $('#updateCompType').val();
            var compValue = $('#updateCompValue').val();

            var compsArr = [];
            var compsObj = {};
            compsObj.column = $('#updateCompColName').val();
            compsObj.comp = $('#updateCompType').val();
            compsObj.value = $('#updateCompValue').val();
            compsArr.push(compsObj);
            updateObj.comps = compsArr;

            var colvalArr = [];
            var colvalObj;

            console.log("compsArr = "+JSON.stringify(compsArr));
            for (var columnNamesIdx=0;columnNamesIdx < columnNames.length; columnNamesIdx++){
                var textAreaId = "#" + columnNames[columnNamesIdx];
                if ($(textAreaId).val().trim() != ""){
                  colvalObj = {};
                  colvalObj.column = columnNames[columnNamesIdx];
                  console.log("textAreaId="+textAreaId+" value="+$(textAreaId).val());
                  colvalObj.value=$(textAreaId).val().toString();
                  colvalArr.push(colvalObj);
                }
                else{
                    console.log(columnNames[columnNamesIdx]+" is blank");
                }
            }
            updateObj.colval = colvalArr;

            console.log("updateObj="+JSON.stringify(updateObj,null,2));

            updateTable(JSON.stringify(updateObj));

        });

            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            }
    });


    var currentHtml = $("#output").html();


		$("#output").html(currentHtml+"<br>"+customerUpdateInputGivenTable);
		$("#output").show();

}
function pickATableForDelete(){
	$.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    crossDomain: true,
            url:    "http://"+server+":8080/crudService"+selectedVal+"/listTables",
            success: function(msg) {

		var s = '<select id="selectTable" name="selectTableName">';
        s +=   '<option>' + '</option><br>';
		var tableArr = msg.tableNames;
		var first = true;
                for(var idx in tableArr) {
		    console.log("idx="+idx+" tableArr[idx]="+tableArr[idx]);
		    if (first){
			selectedTable = tableArr[idx];
			first = false;
		    }
		    s +=   '<option value="'+tableArr[idx] + '">' + tableArr[idx] + '</option><br>';
                }
		    s += '</select>';

		    $("#output").html("Tables:  "+s);

		    $("#output").show();

               $('#selectTable').on('change', function() {
                   selectedTable = this.value;
                   showInputFormForDelete(selectedTable);
                });
            },
            error: function(msg) {
		       $("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		       $("#output").show();
            }
          });
}
function pickATableForRead(){
	$.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    crossDomain: true,
            url:    "http://"+server+":8080/crudService"+selectedVal+"/listTables",
            success: function(msg) {

		var s = '<select id="selectTable" name="selectTableName">';
        s +=   '<option>' + '</option><br>';
		var tableArr = msg.tableNames;
		var first = true;
                for(var idx in tableArr) {
		    console.log("idx="+idx+" tableArr[idx]="+tableArr[idx]);
		    if (first){
			selectedTable = tableArr[idx];
			first = false;
		    }
		    s +=   '<option value="'+tableArr[idx] + '">' + tableArr[idx] + '</option><br>';
                }
		s += '</select>';

		$("#output").html("Tables:  "+s);

		$("#output").show();

               $('#selectTable').on('change', function() {
                   selectedTable = this.value;
                   showInputFormForRead(selectedTable);
                });
            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            }
          });
}
function pickATableForUpdate(){
	$.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    crossDomain: true,
            url:    "http://"+server+":8080/crudService"+selectedVal+"/listTables",
            success: function(msg) {

		var s = '<select id="selectTable" name="selectTableName">';
        s +=   '<option>' + '</option><br>';
		var tableArr = msg.tableNames;
		var first = true;
                for(var idx in tableArr) {
		    console.log("idx="+idx+" tableArr[idx]="+tableArr[idx]);
		    if (first){
			selectedTable = tableArr[idx];
			first = false;
		    }
		    s +=   '<option value="'+tableArr[idx] + '">' + tableArr[idx] + '</option><br>';
                }
		s += '</select>';

		$("#output").html("Tables:  "+s);

		$("#output").show();

               $('#selectTable').on('change', function() {
                   selectedTable = this.value;
                   showInputFormForUpdate(selectedTable);
                });
            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            }
          });
}

function pickATable(){
	$.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    crossDomain: true,
            url:    "http://"+server+":8080/crudService"+selectedVal+"/listTables",
            success: function(msg) {

		var s = '<select id="selectTable" name="selectTableName">';
        s +=   '<option>' + '</option><br>';
		var tableArr = msg.tableNames;
		var first = true;
                for(var idx in tableArr) {
		    console.log("idx="+idx+" tableArr[idx]="+tableArr[idx]);
		    if (first){
			selectedTable = tableArr[idx];
			first = false;
		    }
		    s +=   '<option value="'+tableArr[idx] + '">' + tableArr[idx] + '</option><br>';
                }
		s += '</select>';

		$("#output").html("Tables:  "+s);

		$("#output").show();

               $('#selectTable').on('change', function() {
                   selectedTable = this.value;
                   showInputForm(selectedTable);
                });
            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            }
          });
}

function listTables(){
	$.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    crossDomain: true,
            url:    "http://"+server+":8080/crudService"+selectedVal+"/listTables",
            success: function(msg) {

		var s = '<select id="selectTable" name="selectTableName">';
        s +=   '<option></option><br>';
		var tableArr = msg.tableNames;
		var first = true;
                for(var idx in tableArr) {
		    console.log("idx="+idx+" tableArr[idx]="+tableArr[idx]);
		    if (first){
			selectedTable = tableArr[idx];
			first = false;
		    }
		    s +=   '<option value="'+tableArr[idx] + '">' + tableArr[idx] + '</option><br>';
                }
		s += '</select>';

		$("#output").html("<br> SUCCESS!  Service returned:  <pre>"+JSON.stringify(msg, null, 2) + "<pre><br>"+s);

		$("#output").show();

		$('#selectTable').on('change', function() {
		    selectedTable = this.value;
                });
            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            }
          });
}

function listKeys(jsonObject){

    var keys = [];
    for (var key in jsonObject) {
        if (jsonObject.hasOwnProperty(key)) {
           keys.push(key);
        }
    }
    return keys;
}

function listColumns2(divId, table, nextFunction){

    console.log("listColumns table="+table);

    $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    //crossDomain: true,
            url:    "http://"+server+":8080/crudService"+selectedVal+"/listColumns?input="+table,
        success: function(msg) {

	        var divIdCurrentHtml = $(divId).html();

	    var keys = listKeys(msg);
	    for (var idx=0;idx<keys.length; idx++){
		console.log("listColumsn2 key="+keys[idx]+" val="+msg[keys[idx]].columnName+" "+msg[keys[idx]].columnType+" "+msg[keys[idx]].isKey);
	    }

	        var formattedString = JSON.stringify(msg, null, 4);
		$(divId).html(divIdCurrentHtml+"<pre>"+formattedString+"</pre>");
	        $(divId).show();

	        nextFunction(msg);
            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            }
    });


}

function listColumns2Orig(divId, table){

    console.log("listColumns table="+table);

    $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    //crossDomain: true,
            url:    "http://"+server+":8080/crudService"+selectedVal+"/listColumns?input="+table,
            success: function(msg) {
	        var divIdCurrentHtml = $(divId).html();

	        var formattedString = JSON.stringify(msg, null, 4);
		$(divId).html(divIdCurrentHtml+"<pre>"+formattedString+"</pre>");
		$(divId).show();
            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            }
    });


}

function listColumns(table){

    console.log("listColumns table="+table);
    $("#input").hide();
    $("#output").hide();

    $.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	    //crossDomain: true,
            url:    "http://"+server+":8080/crudService"+selectedVal+"/listColumns?input="+table,
            success: function(msg) {
	        var formattedString = JSON.stringify(msg, null, 4);
		$("#output").html("<br> SUCCESS!  Service returned:  <pre>"+formattedString+"</pre>");
		$("#output").show();
            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            }
    });


}

var displayReadInputForCreateRecord = function(tableName, tableColumnType){

    var customerReadInput="Read<br> <table><tr><td>Table</td><td><textarea id='tableName' row='1' col='10'/></td></tr><tr><td>Comparison Column Name</td><td><textarea id='compColName' row='1' col='10'/></td></tr><tr><td>Comparison Type</td><td><textarea id='compType' row='1' col='10'/></td></tr><tr><td>Comparison Value</td><td><textarea id='compValue' row='1' col='10'/></td></tr></table><button onclick='readRecord()'>Read Record</button>";

    $("#input").html(customerReadInput);
    $("#input").show();
}

function generateTable3(className, snapshotId){

        console.log("generateTable3() className="+className+" snapshotId="+snapshotId);

        var unencodedInput = "https://bpm.capbpm.com:9443/webapi/ViewSchema.jsp?type="+className+"&version="+snapshotId+"T";

	var encodedUrl = encodeURIComponent(unencodedInput);

    console.log("encodedUrl="+encodedUrl);

    $("#input").hide();
    $("#output").hide();

	$.ajax({
            type: "POST",
            contentType: "application/json; charset=utf-8",
            dataType: "json",
	        crossDomain: true,
            url:    "http://"+server+":8080/crudService"+selectedVal+"/generateTable3?input="+encodedUrl,
            success: function(msg) {
		                $("#output").html("<br> SUCCESS!  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            },
            error: function(msg) {
		$("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
		$("#output").show();
            }
          });
}


function getSnapshotIdClasses(snapshotId){
        $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url:    "http://"+server+":8080/crudService"+selectedVal+"/getSnapshotIdClasses?input="+snapshotId,
                success: function(msg) {

                    console.log("getSnapshotIdClasses msg="+JSON.stringify(msg, null, 2));
                var s = '<select id="selectClass" name="selectClassName">';
                s += '<option></option><br>';
                var classNameString = "";
                var first = true;
                for (var idx=0; idx<msg.length; idx++) {
                     if (first){
                       //selectedTable = tableArr[idx];
                       first = false;
                     }
                     classNameString =  msg[idx].name;
                     s += '<option value="'+classNameString + '">' + classNameString + '</option><br>';
                  }
                  s += '</select>';

                  $("#input").html("<br>Pick A Class:  "+s)  ;
                  $("#input").show();

                  $('#selectClass').on('change', function() {
                      var className = this.value;
                      generateTable3(className, snapshotId);
                      /*var generateTableInput="Generate Table<br>" +
                              "<table>"+
                              "<tr><td>Class Name</td><td><textarea id='xsdName' row='1' col='50'/></td></tr>"+
                              "<tr><td>Version Number</td><td><textarea id='versionNumber' row='1' col='100'>"+versionNumber+"</textarea></td></tr>"+
                              "</table>"+
                              "<br>" +
                              "<button onclick='generateTable()'>Generate Table</button>";
                      $("#input").html(generateTableInput);*/
                    });
                },
                error: function(msg) {
                  $("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
                  $("#output").show();
         }
        });
}

function queryTable(){

}
function handleDatabase(db, op){

    console.log("handleDatabase op="+op);
    getTables();

    if (op == "generateTable"){
        console.log("calling gen table");
        var unencodedUrl="https://bpm.capbpm.com:9443/rest/bpm/wle/v1/exposed/process";
        var encodedUrl = encodeURIComponent(unencodedUrl);
        $.ajax({
                type: "POST",
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                url:    "http://"+server+":8080/crudService"+selectedVal+"/getAppNameSnapshotId?input="+encodedUrl,
                success: function(msg) {

                var s = '<select id="selectApp" name="selectAppName">';
                s += '<option></option><br>';
                var valueString = "";
                var first = true;
                for (var idx=0; idx<msg.data.exposedItemsList.length; idx++) {
                     if (first){
                       //selectedTable = tableArr[idx];
                       first = false;
                     }
                     //valueString =  msg.data.exposedItemsList[idx].snapshotID+"T";
                     valueString =  msg.data.exposedItemsList[idx].snapshotID;
                     console.log("display="+msg.data.exposedItemsList[idx].display+" snapshotId="+valueString);
                     s += '<option value="'+valueString + '">' + msg.data.exposedItemsList[idx].display + '</option><br>';
                  }
                  s += '</select>';

                  $("#input").html("<br>Pick An Application:  "+s)  ;
                  $("#input").show();

                  $('#selectApp').on('change', function() {
                      var versionNumber = this.value;
                      getSnapshotIdClasses(versionNumber)
                      /*var generateTableInput="Generate Table<br>" +
                              "<table>"+
                              "<tr><td>Class Name</td><td><textarea id='xsdName' row='1' col='50'/></td></tr>"+
                              "<tr><td>Version Number</td><td><textarea id='versionNumber' row='1' col='100'>"+versionNumber+"</textarea></td></tr>"+
                              "</table>"+
                              "<br>" +
                              "<button onclick='generateTable()'>Generate Table</button>";
                      $("#input").html(generateTableInput);*/
                    });
                },
                error: function(msg) {
                  $("#output").html("<br> ERROR  Service returned:  "+JSON.stringify(msg));
                  $("#output").show();
         }
        });
    }
    else if (op == "dropTable"){
	$("#input").html("<br>Enter table to drop: <textarea id='tableToDrop' rows='1' cols='100'/><br><button onclick='handleDrop()'>Drop Table</button>");
	$("#input").show();
    }
    else if (op == "createRecord"){
	    pickATable();
	//$("#input").html(customerFormCreate);
	//$("#input").show();
	//var now = new Date();
	//$("#customerCreateStartDate").val(now.format("mm/dd/yyyy hh:MM:ss"));
    }
    else if (op == "readRecord"){
	  pickATableForRead();
    }
    else if (op == "updateRecord"){
        pickATableForUpdate();
	//$("#input").html(customerUpdateInput);
	//$("#input").show();
    }
    else if (op == "deleteRecord"){
        pickATableForDelete();
	    //$("#input").html(customerDeleteInput);
	    //$("#input").show();
    }
    else if (op == "getComparisons"){
	getComparisons();
    }
    else if (op == "listTables"){
	listTables();
    }
    else if (op == "queryTable"){
        console.log("we are in queryTable");
        window.open("http://"+server+":8080/queryBuilderCassandra")
    }
    else if (op == "listColumns"){
        if (selectedTable != ""){
            console.log("listColumns for table="+selectedTable);
            listColumns(selectedTable);
        }
    }
	else{
	    alert("you must List Tables and select a table");
	}

}



function myFunction(){

    console.log("HERE I AM");

$(document).on({
    ajaxStart: function() {console.log("Pend ajaxStart START"); $("body").addClass("loading");  $('#modalDiv').addClass("modal"); $('#modalDiv').show(); console.log("Pend ajaxStart END");  },
    ajaxStop: function() {console.log("Pend ajaxStop START"); $("body").removeClass("loading"); $('#modalDiv').removeClass("modal");  $('#modalDiv').hide(); console.log("Pend ajaxStop END"); }
});

      $("#isSelect").click(function () {

	  selectedVal = $('input:radio[name=sex]:checked').val();
          var selectedDb = selectedVal;

	  tables = getTables(selectedDb);
	  $("#operations").html("<br>you clicked "+selectedDb+"<br>"+operationsText);

          $("#doOp").click(function () {

	     $("#output").hide();
	     var selectedOp = $('input:radio[name=operations]:checked').val();
	     console.log ("you are going to do "+selectedOp+" for "+selectedVal);

	      if (selectedVal == "Cassandra"){
		  handleDatabase(selectedDb, selectedOp);
	      }
	      else if (selectedVal == "Mysql"){
		  handleDatabase(selectedDb, selectedOp);
	      }
	      else if (selectedVal == "Elasticsearch"){
		  handleDatabase(selectedDb, selectedOp);
	      }
	      else if (selectedVal == "Mongo"){
		  handleDatabase(selectedDb, selectedOp);
	      }
          });

      });



}
