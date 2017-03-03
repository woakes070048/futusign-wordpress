import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { POLLING_INTERVAL } from '../../strings';
import { fetchBase } from '../../apis/base';
import * as fromAppBlocking from '../../ducks/appBlocking';
import * as fromScreen from '../../ducks/screen';
import * as fromSlideDecks from '../../ducks/slideDecks';
import * as fromYoutubeVideos from '../../ducks/youtubeVideos';
import * as fromOfflinePlaying from '../../ducks/offlinePlaying';
import * as fromBadPlaying from '../../ducks/badPlaying';
import * as fromCurrentlyPlaying from '../../ducks/currentlyPlaying';
import Blocking from './Blocking';
import Offline from './Offline';
import Bad from './Bad';
import NoMedia from './NoMedia';
import Player from './Player';

class App extends Component {
  constructor() {
    super();
    this.fetch = this.fetch.bind(this);
  }
  componentDidMount() {
    this.fetch();
    window.setInterval(this.fetch, POLLING_INTERVAL * 1000);
  }
  fetch() {
    const {
      fetchScreen,
      fetchSlideDecks,
      fetchYoutubeVideos,
      resetSlideDecks,
      resetYoutubeVideos,
      setAppBlocking,
      setBadPlaying,
      setCurrentlyPlaying,
      setOfflinePlaying,
      slideDecks,
      youtubeVideos,
    } = this.props;
    fetchBase()
    .then(() => (
      fetchScreen()
    ))
    .then(screen => {
      if (screen.subscribedPlaylistIds.length === 0) {
        resetSlideDecks();
        resetYoutubeVideos();
        return Promise.resolve();
      }
      return Promise.all([
        fetchSlideDecks(screen.subscribedPlaylistIds),
        fetchYoutubeVideos(screen.subscribedPlaylistIds),
      ]);
    })
    .then(([nextSlideDecks, nextYoutubeVideos]) => {
      const lastSlideDecksHash = slideDecks.map(o => o.file).join();
      const nextSlideDecksHash = nextSlideDecks
        .response
        .result
        .map(o => nextSlideDecks.response.entities.slideDecks[o].file)
        .join();
      const lastYoutubeVideosHash = youtubeVideos.map(o => o.url).join();
      const nextYoutubeVideosHash = nextYoutubeVideos
        .response
        .result
        .map(o => nextYoutubeVideos.response.entities.youtubeVideos[o].url)
        .join();
      if (
        lastSlideDecksHash !== nextSlideDecksHash ||
        lastYoutubeVideosHash !== nextYoutubeVideosHash
      ) {
        setCurrentlyPlaying(fromCurrentlyPlaying.LOADING);
      }
      setOfflinePlaying(false);
      setBadPlaying(false);
      setAppBlocking(false);
      return null;
    })
    .catch(error => {
      setOfflinePlaying(true);
      setBadPlaying(false);
      setAppBlocking(false);
      if (process.env.NODE_ENV !== 'production'
        && error.name !== 'ServerException') {
        window.console.log(error);
        return;
      }
    });
  }
  render() {
    const {
      appBlocking,
      badPlaying,
      currentlyPlaying,
      offlinePlaying,
      setBadPlaying,
      setCurrentlyPlaying,
      setOfflinePlaying,
      slideDecks,
      youtubeVideos,
    } = this.props;
    if (appBlocking) return <Blocking />;
    if (offlinePlaying) return <Offline />;
    if (badPlaying) return <Bad />;
    if (
      slideDecks.length === 0 &&
      youtubeVideos.length === 0
    ) return <NoMedia />;
    return (
      <Player
        currentlyPlaying={currentlyPlaying}
        setBadPlaying={setBadPlaying}
        setCurrentlyPlaying={setCurrentlyPlaying}
        setOfflinePlaying={setOfflinePlaying}
        slideDecks={slideDecks}
        youtubeVideos={youtubeVideos}
      />
    );
  }
}
App.propTypes = {
  appBlocking: PropTypes.bool.isRequired,
  badPlaying: PropTypes.bool.isRequired,
  currentlyPlaying: PropTypes.string.isRequired,
  fetchScreen: PropTypes.func.isRequired,
  fetchSlideDecks: PropTypes.func.isRequired,
  fetchYoutubeVideos: PropTypes.func.isRequired,
  offlinePlaying: PropTypes.bool.isRequired,
  resetSlideDecks: PropTypes.func.isRequired,
  resetYoutubeVideos: PropTypes.func.isRequired,
  setAppBlocking: PropTypes.func.isRequired,
  setBadPlaying: PropTypes.func.isRequired,
  setCurrentlyPlaying: PropTypes.func.isRequired,
  setOfflinePlaying: PropTypes.func.isRequired,
  slideDecks: PropTypes.array.isRequired,
  youtubeVideos: PropTypes.array.isRequired,
};
export default connect(
  state => ({
    appBlocking: fromAppBlocking.getAppBlocking(state),
    badPlaying: fromBadPlaying.getBadPlaying(state),
    currentlyPlaying: fromCurrentlyPlaying.getCurrentlyPlaying(state),
    offlinePlaying: fromOfflinePlaying.getOfflinePlaying(state),
    slideDecks: fromSlideDecks.getSlideDecks(state),
    youtubeVideos: fromYoutubeVideos.getYoutubeVideos(state),
  }),
  {
    fetchScreen: fromScreen.fetchScreen,
    fetchSlideDecks: fromSlideDecks.fetchSlideDecks,
    fetchYoutubeVideos: fromYoutubeVideos.fetchYoutubeVideos,
    resetSlideDecks: fromSlideDecks.resetSlideDecks,
    resetYoutubeVideos: fromYoutubeVideos.resetYoutubeVideos,
    setAppBlocking: fromAppBlocking.setAppBlocking,
    setBadPlaying: fromBadPlaying.setBadPlaying,
    setCurrentlyPlaying: fromCurrentlyPlaying.setCurrentlyPlaying,
    setOfflinePlaying: fromOfflinePlaying.setOfflinePlaying,
  }
)(App);
