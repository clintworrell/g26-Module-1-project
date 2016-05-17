var baseUrl = "https://api.spotify.com";

var Artist = function(spotifyArtistJson) {
  this.id = spotifyArtistJson.id;
  this.name = spotifyArtistJson.name;
  this.imageUrl;
  for (var i = 0; i < spotifyArtistJson.images.length; i++) {
    if (spotifyArtistJson.images[i].height <= 700 && spotifyArtistJson.images[i].width <= 700) {
      this.imageUrl = spotifyArtistJson.images[i].url;
      break;
    }
  }
};

Artist.prototype.renderCurrentArtist = function () {
  $('#current-artist-name').append(this.name);
  $('#current-artist-image').append(`<img src=${this.imageUrl}></img>`);
};

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
      var firstReturnedArtist = results.artists.items[0];
      var artist = new Artist(firstReturnedArtist);
      $('#artist-search-row').toggle();
      $('.artist-results-div').toggle();
      artist.renderCurrentArtist();
      // var artistId = results.artists.items[0].id;
      // $('body').append(results.artists.items[0].name)
    }
  });
}
