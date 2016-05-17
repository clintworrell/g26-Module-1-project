var baseUrl = "https://api.spotify.com";

var Artist = function(spotifyArtistJson) {
  this.id = spotifyArtistJson.id;
  this.name = spotifyArtistJson.name;
  this.imageUrl;
  for (var i = 0; i < spotifyArtistJson.images.length; i++) {
    if (spotifyArtistJson.images[i].height <= 1600 && spotifyArtistJson.images[i].width <= 1600) {
      this.imageUrl = spotifyArtistJson.images[i].url;
      break;
    }
  }
};

Artist.prototype.renderCurrentArtist = function () {
  $('#current-artist-name').append(this.name);
  $('#current-artist-image').css('background-image', `url(${this.imageUrl})`);
  // $('#current-artist-image').append(`<img src=${this.imageUrl}>`);
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
