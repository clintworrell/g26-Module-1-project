var baseUrl = "https://api.spotify.com"

$('#artist-search-submit').click(function () {
  var artistName = $('#artist-search-input').val();
  searchForArtist(artistName);
});

function searchForArtist(artistName) {
  $.ajax({
    url: `${baseUrl}/v1/search?q=${artistName}&type=artist`,
    method: "GET",
    success: function(results) {
      //toggle search area div off
      //toggle search results div on
      var artistId = results.artists.items[0].id;
      $('body').append(results.artists.items[0].name)
    }
  });
}
