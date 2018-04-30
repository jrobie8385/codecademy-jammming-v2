import React from "react";
import TrackList from "../TrackList/TrackList.js";
import "./PlayList.css";

class PlayList extends React.Component {
  constructor(props){
    super(props);
    this.handleNameChange=this.handleNameChange.bind(this);
  }

handleNameChange(event) {
  this.props.onNameChange(event.target.value); //to pass in the "New Playlist" value to <input />
}

  render() {
    return (
    <div className="Playlist">
            <input onChange={this.handleNameChange} value={this.props.playlistName} placeholder='New Playlist' />
            <TrackList tracks={this.props.playlistTracks} onRemove={this.props.onRemove} isRemoval={true}/>
            <a className="Playlist-save" onClick={this.props.onSave}>SAVE TO SPOTIFY</a>
          </div>
        );
  }
}

export default PlayList;

/*
const track = {
  song: "Tiny Dancer",
  artist: "Elton John",
  album: "Tiny Dancer",
};
// https://beta.developer.spotify.com/documentation/web-api/reference/artists/get-artist/
const tracks = [
  track,
  track,
  track,
  track,
  track,
  track
];


{
  this.props.playlistTracks.map(track => {
    return <TrackList track={track} key={track.id}/>
  })
}

*/
