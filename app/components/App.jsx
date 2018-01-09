import React from 'react';
import Search from './Search.jsx';
import Summoner from './Summoner.jsx';
import MatchList from './MatchList.jsx';
import serverRequest from '../lib/serverRequest.js';
import champions from '../data/champions.js';

import { BrowserRouter as Router, Route } from 'react-router-dom';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      matchList: [],
      searchBar: 'ShepGG',
      accountInfo: {},
      soloQ: {},
      flexQ: {},
      summonerFound: true,
      matchesFound: false,
      updatedAt: null
    };

    setInterval(this.updateLastUpdated.bind(this), 30000);
  }

  searchName() {
    var object = {
      name: this.state.searchBar,
      endpoint: 'summoner'
    }

    serverRequest(object, (err, data) => {
      if (err) {
        this.setState({
          summonerFound: false,
          matchesFound: false,
          accountInfo: {},
          searchBar: ''
        });
      } else {
        this.setState({
          summonerFound: true,
          accountInfo: data.accountInfo,
          soloQ: data.soloQ,
          flexQ: data.flexQ,
          searchBar: '',
          matchesFound: true,
          matchList: data.matchList,
          updatedAt: data.updatedAt
        });
      }
    })
  }

  updateMatchHistory() {
    var object = {
      name: this.state.accountInfo.name,
      accountId: this.state.accountInfo.accountId,
      endpoint: 'matches'
    }

    serverRequest(object, (err, data) => {
      if (err) {
        this.setState({
          matchesFound: false,
        });
      } else {
        console.log(data);
        this.setState({
          matchesFound: true,
          matchList: data.matchList,
          updatedAt: data.updatedAt
        });
      }
    })
  }

  updateLastUpdated() {
    this.setState({
      updatedAt: this.state.updatedAt
    });
  }

  champFinder(champId) {
    var obj = champions.data;
    for (var key in obj) {
      if (obj[key].id === champId) {
        return obj[key].key;
      }
    }
  }

  nameChange(name) {
    this.setState({ searchBar: name });
  }

  handleEnterKeyPress(e) {
    if (e.key === 'Enter') {
      this.searchName();
    }
  }

  render() {
    return (
      <div className="container">
        <Router>
          <div>
            <Route path="/" render={props => (<Search searchBar={this.state.searchBar} searchName={this.searchName.bind(this)} nameChange={this.nameChange.bind(this)} handleEnterKeyPress={this.handleEnterKeyPress.bind(this)}/>)}/>
            <Route path="/summoner/:name" render={props => (<Summoner summonerFound={this.state.summonerFound} accountInfo={this.state.accountInfo} soloQ={this.state.soloQ} flexQ={this.state.flexQ} />)}/>
            <Route path="/summoner/:name" render={props => (<MatchList matchesFound={this.state.matchesFound} updateMatchHistory={this.updateMatchHistory.bind(this)} matchList={this.state.matchList} champFinder={this.champFinder.bind(this)} accountInfo={this.state.accountInfo} updatedAt={this.state.updatedAt} />)}/>
          </div>
        </Router>
      </div>
    )
  }
}