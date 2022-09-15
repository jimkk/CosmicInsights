const API_URL = "https://localhost:7092/";

$(document).ready(() => {
  getApiMetadata();
  addFormSection();
});

function getApiMetadata() {
  console.log("Retrieving metadata from " + API_URL + "ApiData");
  $.ajax({
    url: API_URL + "ApiData",
    headers: { "Access-Control-Allow-Origin": API_URL },
    dataType: "json",
    crossDomain: true,
    success: function (data) {
      addRelations(data.relations);
      addQueryTypes(data.queryTypes);
      return data;
    },
  });
}

function addRelations(data) {
  $.each(data, function (k, v) {
    $("#relation-dropdown").append(`<option id=${k}>` + v + "</option>");
  });
}

function addQueryTypes(data) {
  $.each(data, function (k, v) {
    $("#query-dropdown").append(`<option id=${k}>` + v + "</option>");
  });
}

function addFormSection() {
  console.log("Adding section...");
  var section = $("#input-section").children(0);
  $("#relation-section").append(section.clone());
  $("#relation-section button").prop("disabled", true);
  $("#relation-section button:last").prop("disabled", false);
}

function getResult() {
  console.log("retrieving...not");
  $("#submitButton").text("");
  $("#submitButton").append(
    "<span class='spinner-border spinner-border-sm' role='status'></span>"
  );
  var form = $("#queryForm");
  console.log(form.serialize());
  $.ajax({
    url: API_URL + "Query",
    type: "POST",
    data: form.serialize(),
    success: function (data) {
      console.log("YAYAYAYAY");
      console.log(data);
    },
  });
  $("#results span").text("Not Happening.");
  return false;
}
