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

Artist.prototype.populateRelatedArtists = function () {
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

Artist.prototype.getArtistTracks = function() {
  var self = this;
  var getArtistTracksUrl = `/v1/artists/${this.id}/top-tracks?country=US`;
  $.ajax({
    url: `${baseUrl}${getArtistTracksUrl}`,
    method: "GET",
    success: function(artistTracks) {
      self.previewTracksUrls = [];
      for (var i = 0; i < artistTracks.tracks.length; i++) {
        self.previewTracksUrls.push(artistTracks.tracks[i].preview_url);
      }
      var numTracksToDisplay = 3;
      self.createPreviewButtons();
      // for (var )
    }
  });
};

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
      artist.populateRelatedArtists();
      artist.getArtistTracks();
      // var artistId = results.artists.items[0].id;
      // $('body').append(results.artists.items[0].name)
    }
  });
}

Artist.prototype.createPreviewButtons = function () {
  for (var i = 0; i < this.previewTracksUrls.length; i++) {
    // var playButton = $('<div>').text("play");
    var playButton = $('<i class="fa fa-play fa-2x" aria-hidden="true"></i>');
    var audio = new Audio(this.previewTracksUrls[i]);
    playButton.click(generateCallback(audio));
    $('#current-artist-tracks').append(playButton);
  }
}

function generateCallback(audio) {
  return function() {
    audio.play();
  }
}

// Tyler's attempt to show me the way to do createPreviewButtons
// the OOP way.
// Artist.prototype.createPreviewButtonsOopAttempt = function () {
//   for (var i = 0; i < this.previewTracksUrls.length; i++) {
//     var playButton = $('<div>').text("play");
//     var audio = new Audio(this.previewTracksUrls[i]);
//     playButton.trackPreviewAudio = audio;
//     playButton.click(function (e) {
//       e.currentTarget.trackPreviewAudio.play();
//     }(audio));
//     $('#current-artist-tracks').append(playButton);
//   }
// }
