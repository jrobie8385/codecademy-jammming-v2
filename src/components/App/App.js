import React, { Component } from 'react';
import PlayList from "../PlayList/PlayList.js";
import SearchBar from "../SearchBar/SearchBar.js";
import SearchResults from "../SearchResults/SearchResults.js";
import Spotify from "../../util/Spotify.js";
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        searchResults: [],
        playlistName: "New Playlist",
        playlistTracks: []
      };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName=this.updatePlaylistName.bind(this);
    this.savePlaylist=this.savePlaylist.bind(this);
    this.search=this.search.bind(this);
  }

addTrack(track) {
  if (this.state.playlistTracks.find(savedTrack => //why not curly brackets here?
  savedTrack.id === track.id)) { //track.id in this.state.playlistTracks.id not work because would need to go this.state.playlistTracks[0].id
    return;
  } else {
    this.setState({playlistTracks: this.state.playlistTracks.concat(track)}); //need to just concatenate a new track, not reset the whole thing.
  }
}

removeTrack(track) {
  this.setState({
    playlistTracks: this.state.playlistTracks.filter(remove => remove.id !== track.id)
  });
}

updatePlaylistName(name) {
  this.setState({
    playlistName: name
  });
}

savePlaylist() {
  const trackURIs = this.state.playlistTracks.map(track => track.uri);
  Spotify.savePlaylist(this.state.playlistName, trackURIs).then(() => {
    this.setState({
      playlistTracks: []
    });
    this.updatePlaylistName("New playlist");
  })
} //https://surge.sh/

search(searchTerm) {
  Spotify.search(searchTerm).then(
    results => Array.from(results)).then(trackArray => {
      this.setState({searchResults: trackArray})
    }
  )
}

  render() {
    return (
      <div>
      <h1>Ja<span className="highlight">mmm</span>ing</h1>
      <div className="App">
        <SearchBar onSearch={this.search}/>
        <div className="App-playlist">
          <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
          <PlayList playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist}/>
        </div>
      </div>
      </div>
    );
  }
}

export default App;

/*
{tracks.map(track => {
  return <Track track={track} />;
})
}

searchResults: {
  name: "",
  artist: "",
  album: "",
  id: "",
}


*/
