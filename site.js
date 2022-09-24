const API_URL = "https://localhost:7092/";

$(document).ready(() => {
  getApiMetadata();
});

async function getApiMetadata() {
  console.log("Retrieving metadata from " + API_URL + "ApiData");
  $.ajax({
    url: API_URL + "ApiData",
    headers: { "Access-Control-Allow-Origin": API_URL },
    dataType: "json",
    crossDomain: true,
    success: function (data) {
      addRelations(data.relations);
      addQueryTypes(data.queryTypes);
      addChampionList(data.champions);
      addFormSection();
      return data;
    },
  });
}

function addRelations(data) {
  console.log("Adding relations");
  $.each(data, function (k, v) {
    $("#relation-dropdown").append(`<option id=${k}>` + v + "</option>");
  });
}

function addQueryTypes(data) {
  console.log("Adding QueryTypes");
  $.each(data, function (k, v) {
    $("#query-dropdown").append(`<option id=${k}>` + v + "</option>");
  });
}

function addChampionList(data) {
  console.log(data);
  console.log("Adding Champions");
  $.each(data, function (k, v) {
    $("#target").append(`<option id=${k}>` + v + "</option>");
  });
}

function addFormSection(el) {
  console.log("Adding section...");

  $(el).text("Remove");
  $(el).addClass("btn-danger");
  $(el).removeClass("btn-outline-secondary");
  $(el).prop("onclick", null).off("click");
  $(el).on("click", function (e) {
    console.log(e);
    $(e.target).parent().parent().remove();
  });

  var section = $("#input-section").children(0);
  $("#relation-section").append(section.clone());
  $("#relation-section button:last").prop("disabled", false);
}

function getResult() {
  console.log("retrieving...not");
  toggleSubmitButton();
  var request = {
    queryParts: [],
  };
  $("#relation-section")
    .children()
    .each(function (k, v) {
      console.log(v);
      var relationId = $(v)
        .find("#relation-dropdown option:selected")
        .attr("id");
      var championId = $(v).find("#target option:selected").attr("id");
      // var championId = $(v).find("#target").val();
      request.queryParts.push({
        relation: parseInt(relationId),
        champion: championId,
      });
    });
  request.queryType = parseInt($("#query-dropdown option:selected").attr("id"));
  request.summonerName = $("form #summonerName").val();
  console.log(request);
  $.ajax({
    url: API_URL + "Query",
    type: "POST",
    contentType: "application/json",
    data: JSON.stringify(request),
    success: function (data) {
      console.log("YAYAYAYAY");
      delete data.data.games;
      $("#results p").text(JSON.stringify(data, null, 2));
      toggleSubmitButton();
    },
  });
  // $("#results span").text("Not Happening.");
  return false;
}

function toggleSubmitButton() {
  if ($("#submitButton").text() == "") {
    $("#submitButton").text("Get Results");
    // $("#submitButton").children("span")[0].remove();
  } else {
    $("#submitButton").text("");
    $("#submitButton").append(
      "<span class='spinner-border spinner-border-sm' role='status'></span>"
    );
  }
}
