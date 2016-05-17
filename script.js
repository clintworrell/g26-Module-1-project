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

Artist.prototype.getRelatedArtists = function () {
  var getRelatedArtistsUrl = `/v1/artists/${this.id}/related-artists`;
  $.ajax({
    url: `${baseUrl}${getRelatedArtistsUrl}`,
    method: "GET",
    success: function(relatedArtists) {
      $('#related-artist-1').append(relatedArtists.artists[0].name);
      $('#related-artist-2').append(relatedArtists.artists[1].name);
      $('#related-artist-3').append(relatedArtists.artists[2].name);
    }
  });
}

$('#artist-search-submit').click(function (e) {
  e.preventDefault();
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
      artist.getRelatedArtists();

      // var artistId = results.artists.items[0].id;
      // $('body').append(results.artists.items[0].name)
    }
  });
}
