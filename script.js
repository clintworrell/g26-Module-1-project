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
  $('#current-artist-name').empty();
  $('#current-artist-name').append(`<h1>${this.name}</h1>`);
  $('#current-artist-image').css('background-image', `url(${this.imageUrl})`);
  // $('#current-artist-image').append(`<img src=${this.imageUrl}>`);
};

Artist.prototype.populateRelatedArtists = function () {
  var getRelatedArtistsUrl = `/v1/artists/${this.id}/related-artists`;
  $.ajax({
    url: `${baseUrl}${getRelatedArtistsUrl}`,
    method: "GET",
    success: function(relatedArtists) {
      var relatedArtistOne = $('#related-artist-1');
      var relatedArtistTwo = $('#related-artist-2');
      var relatedArtistThree = $('#related-artist-3');

      relatedArtistOne.text(relatedArtists.artists[0].name);
      relatedArtistOne[0].spotifyArtistId = relatedArtists.artists[0].id;
      relatedArtistOne.click(function () {
        getArtistJSON(relatedArtistOne[0].spotifyArtistId);
      });

      relatedArtistTwo.text(relatedArtists.artists[1].name);
      relatedArtistTwo[0].spotifyArtistId = relatedArtists.artists[1].id;
      relatedArtistTwo.click(function () {
        getArtistJSON(relatedArtistTwo[0].spotifyArtistId);
      });

      relatedArtistThree.text(relatedArtists.artists[2].name);
      relatedArtistThree[0].spotifyArtistId = relatedArtists.artists[2].id;
      relatedArtistThree.click(function () {
        getArtistJSON(relatedArtistThree[0].spotifyArtistId);
      });
    }
  });
};

Artist.prototype.getArtistTracks = function() {
  var self = this;
  var getArtistTracksUrl = `/v1/artists/${this.id}/top-tracks?country=US`;
  $.ajax({
    url: `${baseUrl}${getArtistTracksUrl}`,
    method: "GET",
    success: function(artistTracks) {
      self.previewTracks = [];
      for (var i = 0; i < artistTracks.tracks.length; i++) {
        self.previewTracks.push({trackUrl: artistTracks.tracks[i].preview_url, trackName: artistTracks.tracks[i].name});
      }
      var numTracksToDisplay = 3;
      self.createPreviewButtons();
    }
  });
};

$('#artist-search-input').focus();

$("#artist-search-input").keypress(function(e) {
  // e.preventDefault();
    if(e.which === 13) {
      var artistName = $('#artist-search-input').val();
      searchForArtist(artistName);
    }
});

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
      var artistJSON = results.artists.items[0];
      var artist = new Artist(artistJSON);
      $('#artist-search-row').toggle();
      $('.artist-results-div').toggle();
      $('#header-col-1').toggle();
      artist.renderCurrentArtist();
      artist.populateRelatedArtists();
      artist.getArtistTracks();
    }
  });
}

function getArtistJSON(artistId) {
  $.ajax({
    url: `${baseUrl}/v1/artists/${artistId}`,
    method: "GET",
    success: function(results) {
      var artistJSON = results;
      var artist = new Artist(artistJSON);
      artist.renderCurrentArtist();
      artist.populateRelatedArtists();
      artist.getArtistTracks();
    }
  });
}

Artist.prototype.createPreviewButtons = function () {
  $('#current-artist-tracks').empty();
  for (var i = 0; i < this.previewTracks.length; i++) {
    var playButton = $('<i class="fa fa-play fa-2x play-button" aria-hidden="true"></i>');
    var audio = new Audio(this.previewTracks[i].trackUrl);
    playButton[0].trackName = this.previewTracks[i].trackName;
    playButton.click(generateCallback(audio, playButton[0].trackName));
    $('#current-artist-tracks').append(playButton);
  }
};

function generateCallback(audio, trackName) {
  return function() {
    if (audio.paused) {
      audio.play();
      $(this).attr("class", "fa fa-play-circle fa-2x play-button");
    }
    else {
      audio.pause();
      $(this).attr("class", "fa fa-pause fa-2x play-button");
    }
    $('#current-artist-track-name').html(`Currently playing: <br> <b>${trackName}</b>`);
  };
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
