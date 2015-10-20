/* 
	Marble Counters Game
	Add players, guess,
		find out who won!
	WORK IN PROGRESS
*/

/*
	IntroSection component
	IntroSection.jsx
*/

var IntroSection = React.createClass({

	render: function(){
		
		var fnLetsPlay = this.props.app.setGameStateToAdd;

		return (
				<div >
				<h3>Game Info:</h3>
				
				<dl>
					<dt>
					Objective:
					</dt>
					<dd>
					{'Players guess how many marbles there are in a jar. ' +
					'The player with the closest guess is the winner. ' +
					'Players with outlying guesses are also highlighted.'}
					</dd>
					
					<dt>
					How to play:
					</dt>
					<dd>
					Add players to the game on the next screen. 
					Players can vote on the screen after that. 
					Voting results appear on the final screen. 
					You can hit "Go Back" to return to a previous screen.
					</dd>

					<dt>
					Game states:
					</dt>
					<dd >
					This game has four states:
					<div className="center-block table-responsive">
					<table className="table table-condensed text-center">
						<thead>
							<tr>
								<th>#</th>
								<th>State</th>
								<th>Description</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>1</td>
								<td>Display Intro</td>
								<td>Describe the game. (this)</td>
							</tr>
							<tr>
								<td>2</td>
								<td>Player Adding</td>
								<td>Add players to the game. (hit "Let's Play")</td>
							</tr>
							<tr>
								<td>3</td>
								<td>Player Voting</td>
								<td>Players submit their votes.</td>
							</tr>
							<tr>
								<td>4</td>
								<td>Display Results</td>
								<td>Output voting results.</td>
							</tr>
						</tbody>
					</table>
					</div>
					</dd>
				</dl>

				<button
				onClick={fnLetsPlay} >
					Let&#39;s Play!
				</button>
				</div>
				);
	}

});







/*
	AddSection component
	AddSection.jsx
*/

var AddSection = React.createClass({

	render: function() {

		var app = this.props.app;

		var fnBackButton = app.setGameStateToIntro;
		var fnVoteButton = app.setGameStateToVote;

		var players = app.getPlayers();
		var hidden = !players.length ? 'hidden' : '';

		return (
				<div>
					<button
					className="pull-left"
					onClick={fnBackButton} >
					Go Back
					</button>

					<button
					className={"pull-right"}
					style={!players.length ? {visibility: "hidden"} : {}}
					onClick={fnVoteButton} >
					Go Vote
					</button>
					

					<h3>
					Adding players:
					</h3>


					<h4>
					{'Type the player\'s name into the form below, ' + 
						'and hit enter to add them to the game.'}
					</h4>


					<PlayerAdder app={app} />

					<div className={hidden}>
					<PlayerList app={app} />
					</div>

				</div>
				);
	},

});







/*
	VoteSection component
	VoteSection.jsx
*/

var VoteSection = React.createClass({

	render: function() {

		var app = this.props.app;
		
		var gameEnded = app.getGameEnded();
		var gameState = app.getGameState();
		var players = app.getPlayers();

		var fnBackButton = app.setGameStateToAdd;
		var fnResultsButton = app.setGameStateToResults;

		var fnAddPlayerVote = app.setPlayerVote;

		return (
				<div>
					<button
					className="pull-left"
					onClick={fnBackButton} >
					Go Back
					</button>

					<button
					className="pull-right"
					onClick={fnResultsButton} 
					disabled={!players}>
					Results
					</button>


					<h3>
					Voting:
					</h3>

					<small>
					Reminder: 
					There will either be<b> 100</b>,
										<b> 200</b>,
										<b> 300</b>,
										<b> 500</b>,
										<b> 800</b>,
									  or<b> 1300 </b> 
					marbles.
					</small>

					<pre className="pre-scrollable">
						<VoteList app={app} />
					</pre>

				</div>
				);
	}

});







/*
	ResultsSection component
	ResultsSection.jsx
*/

var ResultsSection = React.createClass({

	render: function() {
		var app = this.props.app;
		var gameEnded = app.getGameEnded();
		var numberOfMarbles = app.getNumberOfMarbles();
		var closestPlayer = app.getClosestPlayer();
		var closestEmpty = (Object.getOwnPropertyNames(closestPlayer).length === 0);
		var meanVote = app.getMeanVote();
		var players = app.getPlayers();

		var haveVoted = players.filter(function(player) {return player.voted;})
							.map(function(player) {
								return (
									<div key={player.id}>
										Player #
										{player.id} - {player.name}:&nbsp;
										<b>{player.vote}</b>
										{ (player.vote < 0.8 * meanVote) ?
										 ' (>20% below mean)' : ''}
										{ (player.vote > 1.2 * meanVote) ? 
										 ' (>20% above mean)' : ''}
									</div>
							);
						});

		var haveNotVoted = players.filter(function(player) {return !player.voted;})
								.map(function(player) {
									return (
										<div key={player.id}>
											Player #{player.id} - {player.name}
										</div>
										);
							});

		var fnBackButton = app.setGameStateToVote;
		var fnEndGameButton = app.setGameEnded;
		var fnNewGameButton = app.setNewGame;

		return (
				<div>
					<button
					className="pull-left"
					onClick={fnBackButton} >
					Go Back
					</button>

					<button
					className="pull-right"
					onClick={!gameEnded ? fnEndGameButton :
											fnNewGameButton} >
					{!gameEnded ? 'End Game' : 'New Game'}
					</button>


					<h3>
					Results:
					</h3>

					<h4
					className={gameEnded ? '' : 'hidden'}>
					There were {numberOfMarbles} marbles!
					</h4>

					<h4
					className={gameEnded && !closestEmpty ? '' : 'hidden'}>
					Player #{closestPlayer.id} ({closestPlayer.name}) had 
					the closest vote: {closestPlayer.vote}
					</h4>

					<h4
					className={gameEnded && closestEmpty ? '' : 'hidden'}>
					No players voted, there is no closest guess. Oh well.
					</h4>

					<div className="row-fluid">
						<div className="col-xs-12 col-md-6">
							<h4
							className={gameEnded ? 'hidden' : ''}>
							Players who have voted:&nbsp;
							<small
							className={!meanVote ? 'hidden' : ''}>
							(mean: {Number.parseInt(meanVote)})
							</small>
							</h4>
							<h4
							className={gameEnded ? '' : 'hidden'}>
							Players who voted:&nbsp;
							<small
							className={!meanVote ? 'hidden' : ''}>
							(mean: {Number.parseInt(meanVote)})
							</small>
							</h4>
							


							<pre className="pre-scrollable">
								{haveVoted}
							</pre>
						</div>

						<div className="col-xs-12 col-md-6">
						<div className ="row-fluid">
							<h4 
							className={gameEnded ? 'hidden' : ''}>
							Players who have not voted:
							</h4>
							<h4 
							className={gameEnded ? '' : 'hidden'}>
							Players who did not vote:
							</h4>


							<pre className="pre-scrollable">
								{haveNotVoted}
							</pre>
						</div>
						</div>
					</div>

				</div>
				);
	}

});







/*
	PlayerAdder component
	PlayerAdder.jsx
*/

var PlayerAdder = React.createClass({
	
	handleKeyPress: function(e) {
		if (!e.target.value) return;
		if (e.charCode == 13) {
			this.props.app.setNewPlayer();
		}
	},

	handleChange: function(e) {
		this.props.app.setNewPlayerName(e.target.value);
	},

	render: function() {
		
		var placeholder = !this.props.gameEnded ?
							'Add a new player!' : 
							'The game has ended!';
		
		var app = this.props.app;
		var newPlayerName = app.getNewPlayerName();
		var gameEnded = app.getGameEnded();

		return (
			<div className="form-group" >
				<input 
					className="form-control" 
					type="text" 
					placeholder={placeholder} 
					value={newPlayerName}
					disabled={gameEnded}
					onKeyPress={this.handleKeyPress}
					onChange={this.handleChange} />
			</div>
			);
	}
});







/*
	PlayerList component
	PlayerList.jsx
*/

var PlayerList = React.createClass({

	sortByID: function(playerA, playerB) {
		if (playerA.id < playerB.id) {
			return -1;
		}
		if (playerA.id > playerB.id) {
			return 1;
		}

		return 0;
	},

	sortByName: function(playerA, playerB) {
		if (playerA.name.toLowerCase() < playerB.name.toLowerCase()) {
			return -1;
		}
		if (playerA.name.toLowerCase() > playerB.name.toLowerCase()) {
			return 1;
		}

		return this.sortByID(playerA, playerB);
	},

	sortByVoted: function(playerA, playerB) {
		if (!playerA.voted && playerB.voted) {
			return -1;
		}
		if (playerA.voted && !playerB.voted) {
			return 1;
		}

		return this.sortByName(playerA, playerB);
	},

	sortByVotedInv: function(playerA, playerB) {
		return this.sortByVoted(playerB, playerA);
	},

	sortByNameInv: function(playerA, playerB) {
		return this.sortByName(playerB, playerA);
	},

	sortByIDInv: function(playerA, playerB) {
		return this.sortByID(playerB, playerA);
	},

	render: function() {

		var app = this.props.app;

		var sortBy = app.getSortBy();
		var sortByfn = sortBy === 'voted' ? 
						this.sortByVoted : 
						sortBy === 'votedInv' ?
						this.sortByVotedInv :
						sortBy === 'name' ? 
						this.sortByName : 
						sortBy === 'nameInv' ?
						this.sortByNameInv : 
						sortBy === 'idInv' ?
						this.sortByIDInv : this.sortByID;

		var players = app.getPlayers();
		var playerList = players.sort(sortByfn)
							.map(function(player) {
									return (
											<tr key={player.id}>
												<td>{player.id}</td>
												<td>{player.name}</td>
												<td>{player.voted ? 'Y' : 'N'}</td>
											</tr>
											);
							});

		var fnSetSortByToID = app.setSortByToID;
		var fnSetSortByToName = app.setSortByToName;
		var fnSetSortByToVoted = app.setSortByToVoted;

		return (
			<div className="center-block table-responsive">
				<table className="table table-striped table-condensed">
					<thead>
						<tr>
							<th 
							className={(sortBy === 'id' || 
										sortBy === 'idInv') ? 
										'activeSort' : ''}
							onClick={fnSetSortByToID}>
							#
							</th>
							<th 
							className={(sortBy === 'name' || 
										sortBy === 'nameInv') ? 
										'activeSort' : ''}
							onClick={fnSetSortByToName}>
							Name
							</th>
							<th 
							className={(sortBy === 'voted' || 
										sortBy === 'votedInv') ? 
										'activeSort' : ''}
							onClick={fnSetSortByToVoted}>
							Voted?
							</th>
						</tr>
					</thead>
					<tbody>
						{playerList}
					</tbody>
				</table>
			</div>
			);
	}
});







/*
	VoteListItemEntry component
	VoteListItemEntry.jsx
*/

var VoteListItemEntry = React.createClass({

	handleKeyPress: function(e) {
		if (e.charCode == 13) {
			this.props.setPlayerVote(Number(e.target.value), this.props.player);
		}
	},


	render: function() {
		return (
			<div>
				<input 
					type="text" 
					placeholder="Guess" 
					onKeyPress={this.handleKeyPress} />
			</div>
			);
	}
});







/*
	VoteListItemName component
	VoteListItemName.jsx
*/

var VoteListItemName = React.createClass({

	render: function() {
		var player = this.props.player;

		var listItemName = (
							<h3 className="page-header">
								<small>
								{'Player #' + player.id + ': '}
								</small>
								{player.name}
							</h3>
							);

		return (
				<div>
					{listItemName}
				</div>
				);
	}

});







/*
	VoteListItem component
	VoteListItem.jsx
*/

var VoteListItem = React.createClass({

	render: function() {
		var app = this.props.app;
		var player = this.props.player;
		var fnSetPlayerVote = app.setPlayerVote;

		return (
				<div
				  className="list-group-item"
				  key={player.id}>

					<div 
					  className="list-group-item-heading" >
						
						<VoteListItemName player={player} />
					</div>

					<div 
					  className="list-group-item-text" >
						<VoteListItemEntry 
						  setPlayerVote={fnSetPlayerVote}
						  player={player} />
					</div>

				</div>
				);
	}
});







/*
	VoteList component
	VoteList.jsx
*/

var VoteList = React.createClass({

	render: function() {
		var app = this.props.app;
		var players = app.getPlayers();
		var noVotePlayers = players.filter(function(player) {return !player.voted});
		var gameEnded = app.getGameEnded();

		var voteList = <div></div>;

		if (gameEnded) {
			voteList = (
						<h4>
							The game has ended!
						</h4>
						);
		} else if (!players) {
			voteList = (
						<h4>
							Add players to start voting!
						</h4>
						);
		} else if (!noVotePlayers.length) {
			voteList = (
						<h4>
							All players have voted!
						</h4>
						);
		} else {
			voteList = noVotePlayers.map(function(player) {
				return <VoteListItem key={player.id} app={app} player={player} />;
			});
		}

		return (
				<div className="list-group">
					{voteList}
				</div>
				);
	}
});







/*
	App component
	App.jsx
*/

var App = React.createClass({

	getInitialState: function() {
		return {
			players: [],
			newPlayerName: '',
			gameState: 'intro',
			gameEnded: false,
			sortBy: 'id',
			numberOfMarbles: this.props.marbles
		};
	},

	setGameStateToIntro: function() {
		this.setState({
			gameState: 'intro'
		});
	},

	setGameStateToAdd: function() {
		this.setState({
			gameState: 'add'
		});
	},

	setGameStateToVote: function() {
		this.setState({
			gameState: 'vote'
		});
	},

	setGameStateToResults: function() {
		this.setState({
			gameState: 'results'
		});
	},

	setGameEnded: function() {
		this.setState({
			gameEnded: true
		});
	},

	setNewGame: function() {
		this.setState(this.getInitialState());
	},

	setNewPlayerName: function(newPlayerName) {
		this.setState({
			newPlayerName: newPlayerName
		});
	},

	setNewPlayer: function() {
		var players = this.getPlayers();

		var newPlayerName = this.getNewPlayerName();
		var newPlayer = {
				name: newPlayerName,
				id: players.length,
				vote: 0,
				voted: false,
				outlier: false
		};

		this.setState({
			players: players.concat(newPlayer),
			newPlayerName: ''
		});
	},

	setSortByToID: function() {
		var oldSort = this.state.sortBy;
		var newSort = oldSort === 'id' ? 'idInv' : 'id';

		this.setState({
			sortBy: newSort
		});
	},

	setSortByToName: function() {
		var oldSort = this.state.sortBy;
		var newSort = oldSort === 'name' ? 'nameInv' : 'name';

		this.setState({
			sortBy: newSort
		});
	},

	setSortByToVoted: function() {
		var oldSort = this.state.sortBy;
		var newSort = oldSort === 'voted' ? 'votedInv' : 'voted';

		this.setState({
			sortBy: newSort
		});
	},

	setPlayerVote: function(vote, player) {

		vote = Number(vote); 
		if (!Number.isInteger(vote)) return;
		player.vote = vote;
		player.voted = true;
		var players = this.getPlayers();
		players[player.id] = player;

		this.setState({
			players: players
		});

	},

	getPlayers: function() {
		return this.state.players.slice();
	},

	getNumberOfMarbles: function() {
		return this.state.numberOfMarbles;
	},

	getClosestPlayer: function() {
		var players = this.getPlayers();
		var voters = players.filter(function(player) {
				return player.voted;
			});
		var marbles = this.getNumberOfMarbles();
		var difference = 1300;
		var closestPlayer = {};

		voters.forEach(function(voter) {
			if (Math.abs(marbles - voter.vote) < difference) {
				difference = Math.abs(marbles - voter.vote);
				closestPlayer = voter;
			}
		})

		return closestPlayer;
	},

	getMeanVote: function(){
		var players = this.getPlayers();
		var voters = players.filter(function(player) {
				return player.voted;
			});
		var votes = voters.map(function(voter) {
				return Number(voter.vote);
			});
		var sum = votes.reduce(function(total, vote) {
				return total + vote;
			}, 0);

		return sum / voters.length;
	},

	getGameEnded: function() {
		return this.state.gameEnded;
	},

	getGameState: function() {
		return this.state.gameState;
	},

	getNewPlayerName: function() {
		return this.state.newPlayerName;
	},

	getSortBy: function() {
		return this.state.sortBy;
	},

	render: function() {
		
		var content = (<div>Should be overwritten</div>);
		var gameState = this.getGameState();

		switch (gameState) {
			case 'intro':
				content = <IntroSection app={this} />;
				break;
			case 'add':
				content = <AddSection app={this} />
				break;
			case 'vote':
				content = <VoteSection app={this} />
				break;
			case 'results':
				content = <ResultsSection app={this} />
				break;
			default:
				content = 'Uh-oh!';
		}

		return (
			<div className="app container">
				<div className="jumbotron state">
					<h1 className="page-header h1">
						Marble Counters!
					</h1>
					<pre className="container">
						{content}
					</pre>
				</div>
			</div>

		);
	}
});







/*
	Main file - entry point
	main.jsx
*/

function randomValue(MAX_VALUE) {
	return array[Math.floor(MAX_VALUE * Math.random())];
}

React.render(
	<App marbles={randomValue(2000)}/>,
	document.body
	);
