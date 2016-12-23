var tagsQuotaReached;
var tags;

  chrome.storage.local.get('apikey', function(storedItem) {
    if(jQuery.isEmptyObject(storedItem) === false) {
      tags = new Tags(storedItem.apikey);
    } else {
      window.location.href = "setKey.html"
    }
  });


$(document).ready(function() {
  var clipboard = new Clipboard('.copy');
  clipboard.on('success', function(e) {
    $(e.trigger).find('.action-name').html('Copied!');
    window.setTimeout(function(){
      $(e.trigger).find('.action-name').html('Copy');
    },1000);
    e.clearSelection();
  });
  
  tagsQuotaReached = false
});
 
$(document).on('click','.delete-tag',function(e){
  e.preventDefault();

  var t = $(this).prev().html();
  var f = $("#tags").val();

  if( f.indexOf( t ) === 0 ) $("#tags").val( f.replace(t+',','') );
  else $("#tags").val( f.replace(','+t,'') );
  tags.excludeTag(t);
  $(this).closest('.tag').remove();

  fill_tags();
});

$(document).on("click", "#get-tags", function(e) {
  if (tagsQuotaReached === false) {
    $(".explanation").addClass("hide"), $("#loading").removeClass("hide");
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {please: "get tags"}, function(response) {
        if  (response.error === "") {
          tags.setText(response.text);
//          tags.getTagsFull(true,  function(tagResponse) {		//this eliminates tags with too little relevance, including previously excluded tags...
          tags.getTagsFull(false,  function(tagResponse) {		
            $("#loading").addClass("hide");
            setTags(tagResponse);
          }, function (response) {
            $("#loading").addClass("hide"); 
            $(".explanation").removeClass("hide"); 
            $(".explanation").text(response); 
            $("#get-tags").text("UGRADE TO PREMIUM"); 
            $(".explanation").css("background-color", "#FFDBDB");
             $(".explanation").css("color", "#666");
             if(response === "Monthly quota reached. Please upgrade to an premium account") {  
               tagsQuotaReached = true;
             }
          });
        } else {
          alert(response.error);
        }
      });
    });
  } else {
    chrome.tabs.create({
      url: "http://www.tags.authorship.me"
    });
  }
});

$(document).on("click", ".email", function() {
  $(this).attr("href", "mailto:?subject=" + encodeURIComponent("Tags") + "&body=" + encodeURIComponent($("#tags").val()))
});

$(document).on("click", ".csv", function() {
  var b = ($("#tags").val(), [
      [$("#tags").val()]
    ]),
    c = "data:text/csv;charset=utf-8,";
  b.forEach(function(a, d) {
    dataString = a.join(","), c += d < b.length ? dataString + "\n" : dataString
  });
  var d = encodeURI(c);
  window.open(d)
});

function setTags (tagsArr) {
  var length = tagsArr.length;
  var tagsString = "";

  for (var i = 0; i < length; i++) {
    if(tagsArr[i].tag !=="") {
      if(tagsString === "") tagsString = tagsArr[i].tag;
      else tagsString = tagsString + "," + tagsArr[i].tag;
    }
  }
  $('#tags').val(tagsString);
  fill_tags();
}

var fill_tags = function(){

  var tagsArray = $('#tags').val().split(',');
  $('.tags-container').empty();
  $.each( tagsArray, function( i , v ){
    $('.tags-container').append("<div class='tag'><a href='#'>"+v+"</a><a class='hide delete-tag' href='#'><i class='fa fa-times-circle' aria-hidden='true'></i></a></div>");
  });

  $('#number-of-tags').html("Number of tags: " + ( tagsArray.length.toString() ) );
};
