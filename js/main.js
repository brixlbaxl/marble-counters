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

'use strict';

var IntroSection = React.createClass({
	displayName: 'IntroSection',

	render: function render() {

		var fnLetsPlay = this.props.app.setGameStateToAdd;

		return React.createElement(
			'div',
			null,
			React.createElement(
				'h3',
				null,
				'Game Info:'
			),
			React.createElement(
				'dl',
				null,
				React.createElement(
					'dt',
					null,
					'Objective:'
				),
				React.createElement(
					'dd',
					null,
					'Players guess how many marbles there are in a jar. ' + 'The player with the closest guess is the winner. ' + 'Players with outlying guesses are also highlighted.'
				),
				React.createElement(
					'dt',
					null,
					'How to play:'
				),
				React.createElement(
					'dd',
					null,
					'Add players to the game on the next screen. Players can vote on the screen after that. Voting results appear on the final screen. You can hit "Go Back" to return to a previous screen.'
				),
				React.createElement(
					'dt',
					null,
					'Game states:'
				),
				React.createElement(
					'dd',
					null,
					'This game has four states:',
					React.createElement(
						'div',
						{ className: 'center-block table-responsive' },
						React.createElement(
							'table',
							{ className: 'table table-condensed text-center' },
							React.createElement(
								'thead',
								null,
								React.createElement(
									'tr',
									null,
									React.createElement(
										'th',
										null,
										'#'
									),
									React.createElement(
										'th',
										null,
										'State'
									),
									React.createElement(
										'th',
										null,
										'Description'
									)
								)
							),
							React.createElement(
								'tbody',
								null,
								React.createElement(
									'tr',
									null,
									React.createElement(
										'td',
										null,
										'1'
									),
									React.createElement(
										'td',
										null,
										'Display Intro'
									),
									React.createElement(
										'td',
										null,
										'Describe the game. (this)'
									)
								),
								React.createElement(
									'tr',
									null,
									React.createElement(
										'td',
										null,
										'2'
									),
									React.createElement(
										'td',
										null,
										'Player Adding'
									),
									React.createElement(
										'td',
										null,
										'Add players to the game. (hit "Let\'s Play")'
									)
								),
								React.createElement(
									'tr',
									null,
									React.createElement(
										'td',
										null,
										'3'
									),
									React.createElement(
										'td',
										null,
										'Player Voting'
									),
									React.createElement(
										'td',
										null,
										'Players submit their votes.'
									)
								),
								React.createElement(
									'tr',
									null,
									React.createElement(
										'td',
										null,
										'4'
									),
									React.createElement(
										'td',
										null,
										'Display Results'
									),
									React.createElement(
										'td',
										null,
										'Output voting results.'
									)
								)
							)
						)
					)
				)
			),
			React.createElement(
				'button',
				{
					onClick: fnLetsPlay },
				'Let\'s Play!'
			)
		);
	}

});

/*
	AddSection component
	AddSection.jsx
*/

var AddSection = React.createClass({
	displayName: 'AddSection',

	render: function render() {

		var app = this.props.app;

		var fnBackButton = app.setGameStateToIntro;
		var fnVoteButton = app.setGameStateToVote;

		var players = app.getPlayers();
		var hidden = !players.length ? 'hidden' : '';

		return React.createElement(
			'div',
			null,
			React.createElement(
				'button',
				{
					className: 'pull-left',
					onClick: fnBackButton },
				'Go Back'
			),
			React.createElement(
				'button',
				{
					className: "pull-right",
					style: !players.length ? { visibility: "hidden" } : {},
					onClick: fnVoteButton },
				'Go Vote'
			),
			React.createElement(
				'h3',
				null,
				'Adding players:'
			),
			React.createElement(
				'h4',
				null,
				'Type the player\'s name into the form below, ' + 'and hit enter to add them to the game.'
			),
			React.createElement(PlayerAdder, { app: app }),
			React.createElement(
				'div',
				{ className: hidden },
				React.createElement(PlayerList, { app: app })
			)
		);
	}

});

/*
	VoteSection component
	VoteSection.jsx
*/

var VoteSection = React.createClass({
	displayName: 'VoteSection',

	render: function render() {

		var app = this.props.app;

		var gameEnded = app.getGameEnded();
		var gameState = app.getGameState();
		var players = app.getPlayers();

		var fnBackButton = app.setGameStateToAdd;
		var fnResultsButton = app.setGameStateToResults;

		var fnAddPlayerVote = app.setPlayerVote;

		return React.createElement(
			'div',
			null,
			React.createElement(
				'button',
				{
					className: 'pull-left',
					onClick: fnBackButton },
				'Go Back'
			),
			React.createElement(
				'button',
				{
					className: 'pull-right',
					onClick: fnResultsButton,
					disabled: !players },
				'Results'
			),
			React.createElement(
				'h3',
				null,
				'Voting:'
			),
			React.createElement(
				'pre',
				{ className: 'pre-scrollable' },
				React.createElement(VoteList, { app: app })
			)
		);
	}

});

/*
	ResultsSection component
	ResultsSection.jsx
*/

var ResultsSection = React.createClass({
	displayName: 'ResultsSection',

	render: function render() {
		var app = this.props.app;
		var gameEnded = app.getGameEnded();
		var numberOfMarbles = app.getNumberOfMarbles();
		var closestPlayer = app.getClosestPlayer();
		var closestEmpty = Object.getOwnPropertyNames(closestPlayer).length === 0;
		var meanVote = app.getMeanVote();
		var players = app.getPlayers();

		var haveVoted = players.filter(function (player) {
			return player.voted;
		}).map(function (player) {
			return React.createElement(
				'div',
				{ key: player.id },
				'Player #',
				player.id,
				' - ',
				player.name,
				': ',
				React.createElement(
					'b',
					null,
					player.vote
				),
				player.vote < 0.8 * meanVote ? ' (>20% below mean)' : '',
				player.vote > 1.2 * meanVote ? ' (>20% above mean)' : ''
			);
		});

		var haveNotVoted = players.filter(function (player) {
			return !player.voted;
		}).map(function (player) {
			return React.createElement(
				'div',
				{ key: player.id },
				'Player #',
				player.id,
				' - ',
				player.name
			);
		});

		var fnBackButton = app.setGameStateToVote;
		var fnEndGameButton = app.setGameEnded;
		var fnNewGameButton = app.setNewGame;

		return React.createElement(
			'div',
			null,
			React.createElement(
				'button',
				{
					className: 'pull-left',
					onClick: fnBackButton },
				'Go Back'
			),
			React.createElement(
				'button',
				{
					className: 'pull-right',
					onClick: !gameEnded ? fnEndGameButton : fnNewGameButton },
				!gameEnded ? 'End Game' : 'New Game'
			),
			React.createElement(
				'h3',
				null,
				'Results:'
			),
			React.createElement(
				'h4',
				{
					className: gameEnded ? '' : 'hidden' },
				'There were ',
				numberOfMarbles,
				' marbles!'
			),
			React.createElement(
				'h4',
				{
					className: gameEnded && !closestEmpty ? '' : 'hidden' },
				'Player #',
				closestPlayer.id,
				' (',
				closestPlayer.name,
				') had the closest vote: ',
				closestPlayer.vote
			),
			React.createElement(
				'h4',
				{
					className: gameEnded && closestEmpty ? '' : 'hidden' },
				'No players voted, there is no closest guess. Oh well.'
			),
			React.createElement(
				'div',
				{ className: 'row-fluid' },
				React.createElement(
					'div',
					{ className: 'col-xs-12 col-md-6' },
					React.createElement(
						'h4',
						{
							className: gameEnded ? 'hidden' : '' },
						'Players who have voted: ',
						React.createElement(
							'small',
							{
								className: !meanVote ? 'hidden' : '' },
							'(mean: ',
							Number.parseInt(meanVote),
							')'
						)
					),
					React.createElement(
						'h4',
						{
							className: gameEnded ? '' : 'hidden' },
						'Players who voted: ',
						React.createElement(
							'small',
							{
								className: !meanVote ? 'hidden' : '' },
							'(mean: ',
							Number.parseInt(meanVote),
							')'
						)
					),
					React.createElement(
						'pre',
						{ className: 'pre-scrollable' },
						haveVoted
					)
				),
				React.createElement(
					'div',
					{ className: 'col-xs-12 col-md-6' },
					React.createElement(
						'div',
						{ className: 'row-fluid' },
						React.createElement(
							'h4',
							{
								className: gameEnded ? 'hidden' : '' },
							'Players who have not voted:'
						),
						React.createElement(
							'h4',
							{
								className: gameEnded ? '' : 'hidden' },
							'Players who did not vote:'
						),
						React.createElement(
							'pre',
							{ className: 'pre-scrollable' },
							haveNotVoted
						)
					)
				)
			)
		);
	}

});

/*
	PlayerAdder component
	PlayerAdder.jsx
*/

var PlayerAdder = React.createClass({
	displayName: 'PlayerAdder',

	handleKeyPress: function handleKeyPress(e) {
		if (!e.target.value) return;
		if (e.charCode == 13) {
			this.props.app.setNewPlayer();
		}
	},

	handleChange: function handleChange(e) {
		this.props.app.setNewPlayerName(e.target.value);
	},

	render: function render() {

		var placeholder = !this.props.gameEnded ? 'Add a new player!' : 'The game has ended!';

		var app = this.props.app;
		var newPlayerName = app.getNewPlayerName();
		var gameEnded = app.getGameEnded();

		return React.createElement(
			'div',
			{ className: 'form-group' },
			React.createElement('input', {
				className: 'form-control',
				type: 'text',
				placeholder: placeholder,
				value: newPlayerName,
				disabled: gameEnded,
				onKeyPress: this.handleKeyPress,
				onChange: this.handleChange })
		);
	}
});

/*
	PlayerList component
	PlayerList.jsx
*/

var PlayerList = React.createClass({
	displayName: 'PlayerList',

	sortByID: function sortByID(playerA, playerB) {
		if (playerA.id < playerB.id) {
			return -1;
		}
		if (playerA.id > playerB.id) {
			return 1;
		}

		return 0;
	},

	sortByName: function sortByName(playerA, playerB) {
		if (playerA.name.toLowerCase() < playerB.name.toLowerCase()) {
			return -1;
		}
		if (playerA.name.toLowerCase() > playerB.name.toLowerCase()) {
			return 1;
		}

		return this.sortByID(playerA, playerB);
	},

	sortByVoted: function sortByVoted(playerA, playerB) {
		if (!playerA.voted && playerB.voted) {
			return -1;
		}
		if (playerA.voted && !playerB.voted) {
			return 1;
		}

		return this.sortByName(playerA, playerB);
	},

	sortByVotedInv: function sortByVotedInv(playerA, playerB) {
		return this.sortByVoted(playerB, playerA);
	},

	sortByNameInv: function sortByNameInv(playerA, playerB) {
		return this.sortByName(playerB, playerA);
	},

	sortByIDInv: function sortByIDInv(playerA, playerB) {
		return this.sortByID(playerB, playerA);
	},

	render: function render() {

		var app = this.props.app;

		var sortBy = app.getSortBy();
		var sortByfn = sortBy === 'voted' ? this.sortByVoted : sortBy === 'votedInv' ? this.sortByVotedInv : sortBy === 'name' ? this.sortByName : sortBy === 'nameInv' ? this.sortByNameInv : sortBy === 'idInv' ? this.sortByIDInv : this.sortByID;

		var players = app.getPlayers();
		var playerList = players.sort(sortByfn).map(function (player) {
			return React.createElement(
				'tr',
				{ key: player.id },
				React.createElement(
					'td',
					null,
					player.id
				),
				React.createElement(
					'td',
					null,
					player.name
				),
				React.createElement(
					'td',
					null,
					player.voted ? 'Y' : 'N'
				)
			);
		});

		var fnSetSortByToID = app.setSortByToID;
		var fnSetSortByToName = app.setSortByToName;
		var fnSetSortByToVoted = app.setSortByToVoted;

		return React.createElement(
			'div',
			{ className: 'center-block table-responsive' },
			React.createElement(
				'table',
				{ className: 'table table-striped table-condensed' },
				React.createElement(
					'thead',
					null,
					React.createElement(
						'tr',
						null,
						React.createElement(
							'th',
							{
								className: sortBy === 'id' || sortBy === 'idInv' ? 'activeSort' : '',
								onClick: fnSetSortByToID },
							'#'
						),
						React.createElement(
							'th',
							{
								className: sortBy === 'name' || sortBy === 'nameInv' ? 'activeSort' : '',
								onClick: fnSetSortByToName },
							'Name'
						),
						React.createElement(
							'th',
							{
								className: sortBy === 'voted' || sortBy === 'votedInv' ? 'activeSort' : '',
								onClick: fnSetSortByToVoted },
							'Voted?'
						)
					)
				),
				React.createElement(
					'tbody',
					null,
					playerList
				)
			)
		);
	}
});

/*
	VoteListItemEntry component
	VoteListItemEntry.jsx
*/

var VoteListItemEntry = React.createClass({
	displayName: 'VoteListItemEntry',

	handleKeyPress: function handleKeyPress(e) {
		if (e.charCode == 13) {
			this.props.setPlayerVote(Number(e.target.value), this.props.player);
		}
	},

	render: function render() {
		return React.createElement(
			'div',
			null,
			React.createElement('input', {
				type: 'text',
				placeholder: 'Guess',
				onKeyPress: this.handleKeyPress })
		);
	}
});

/*
	VoteListItemName component
	VoteListItemName.jsx
*/

var VoteListItemName = React.createClass({
	displayName: 'VoteListItemName',

	render: function render() {
		var player = this.props.player;

		var listItemName = React.createElement(
			'h3',
			{ className: 'page-header' },
			React.createElement(
				'small',
				null,
				'Player #' + player.id + ': '
			),
			player.name
		);

		return React.createElement(
			'div',
			null,
			listItemName
		);
	}

});

/*
	VoteListItem component
	VoteListItem.jsx
*/

var VoteListItem = React.createClass({
	displayName: 'VoteListItem',

	render: function render() {
		var app = this.props.app;
		var player = this.props.player;
		var fnSetPlayerVote = app.setPlayerVote;

		return React.createElement(
			'div',
			{
				className: 'list-group-item',
				key: player.id },
			React.createElement(
				'div',
				{
					className: 'list-group-item-heading' },
				React.createElement(VoteListItemName, { player: player })
			),
			React.createElement(
				'div',
				{
					className: 'list-group-item-text' },
				React.createElement(VoteListItemEntry, {
					setPlayerVote: fnSetPlayerVote,
					player: player })
			)
		);
	}
});

/*
	VoteList component
	VoteList.jsx
*/

var VoteList = React.createClass({
	displayName: 'VoteList',

	render: function render() {
		var app = this.props.app;
		var players = app.getPlayers();
		var noVotePlayers = players.filter(function (player) {
			return !player.voted;
		});
		var gameEnded = app.getGameEnded();

		var voteList = React.createElement('div', null);

		if (gameEnded) {
			voteList = React.createElement(
				'h4',
				null,
				'The game has ended!'
			);
		} else if (!players) {
			voteList = React.createElement(
				'h4',
				null,
				'Add players to start voting!'
			);
		} else if (!noVotePlayers.length) {
			voteList = React.createElement(
				'h4',
				null,
				'All players have voted!'
			);
		} else {
			voteList = noVotePlayers.map(function (player) {
				return React.createElement(VoteListItem, { key: player.id, app: app, player: player });
			});
		}

		return React.createElement(
			'div',
			{ className: 'list-group' },
			voteList
		);
	}
});

/*
	App component
	App.jsx
*/

var App = React.createClass({
	displayName: 'App',

	getInitialState: function getInitialState() {
		return {
			players: [],
			newPlayerName: '',
			gameState: 'intro',
			gameEnded: false,
			sortBy: 'id',
			numberOfMarbles: this.props.marbles
		};
	},

	setGameStateToIntro: function setGameStateToIntro() {
		this.setState({
			gameState: 'intro'
		});
	},

	setGameStateToAdd: function setGameStateToAdd() {
		this.setState({
			gameState: 'add'
		});
	},

	setGameStateToVote: function setGameStateToVote() {
		this.setState({
			gameState: 'vote'
		});
	},

	setGameStateToResults: function setGameStateToResults() {
		this.setState({
			gameState: 'results'
		});
	},

	setGameEnded: function setGameEnded() {
		this.setState({
			gameEnded: true
		});
	},

	setNewGame: function setNewGame() {
		this.setState(this.getInitialState());
	},

	setNewPlayerName: function setNewPlayerName(newPlayerName) {
		this.setState({
			newPlayerName: newPlayerName
		});
	},

	setNewPlayer: function setNewPlayer() {
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

	setSortByToID: function setSortByToID() {
		var oldSort = this.state.sortBy;
		var newSort = oldSort === 'id' ? 'idInv' : 'id';

		this.setState({
			sortBy: newSort
		});
	},

	setSortByToName: function setSortByToName() {
		var oldSort = this.state.sortBy;
		var newSort = oldSort === 'name' ? 'nameInv' : 'name';

		this.setState({
			sortBy: newSort
		});
	},

	setSortByToVoted: function setSortByToVoted() {
		var oldSort = this.state.sortBy;
		var newSort = oldSort === 'voted' ? 'votedInv' : 'voted';

		this.setState({
			sortBy: newSort
		});
	},

	setPlayerVote: function setPlayerVote(vote, player) {

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

	getPlayers: function getPlayers() {
		return this.state.players.slice();
	},

	getNumberOfMarbles: function getNumberOfMarbles() {
		return this.state.numberOfMarbles;
	},

	getClosestPlayer: function getClosestPlayer() {
		var players = this.getPlayers();
		var voters = players.filter(function (player) {
			return player.voted;
		});
		var marbles = this.getNumberOfMarbles();
		var difference = 1300;
		var closestPlayer = {};

		voters.forEach(function (voter) {
			if (Math.abs(marbles - voter.vote) < difference) {
				difference = Math.abs(marbles - voter.vote);
				closestPlayer = voter;
			}
		});

		return closestPlayer;
	},

	getMeanVote: function getMeanVote() {
		var players = this.getPlayers();
		var voters = players.filter(function (player) {
			return player.voted;
		});
		var votes = voters.map(function (voter) {
			return Number(voter.vote);
		});
		var sum = votes.reduce(function (total, vote) {
			return total + vote;
		}, 0);

		return sum / voters.length;
	},

	getGameEnded: function getGameEnded() {
		return this.state.gameEnded;
	},

	getGameState: function getGameState() {
		return this.state.gameState;
	},

	getNewPlayerName: function getNewPlayerName() {
		return this.state.newPlayerName;
	},

	getSortBy: function getSortBy() {
		return this.state.sortBy;
	},

	render: function render() {

		var content = React.createElement(
			'div',
			null,
			'Should be overwritten'
		);
		var gameState = this.getGameState();

		switch (gameState) {
			case 'intro':
				content = React.createElement(IntroSection, { app: this });
				break;
			case 'add':
				content = React.createElement(AddSection, { app: this });
				break;
			case 'vote':
				content = React.createElement(VoteSection, { app: this });
				break;
			case 'results':
				content = React.createElement(ResultsSection, { app: this });
				break;
			default:
				content = 'Uh-oh!';
		}

		return React.createElement(
			'div',
			{ className: 'app container' },
			React.createElement(
				'div',
				{ className: 'jumbotron state' },
				React.createElement(
					'h1',
					{ className: 'page-header h1' },
					'Marble Counters!'
				),
				React.createElement(
					'pre',
					{ className: 'container' },
					content
				)
			)
		);
	}
});

/*
	Main file - entry point
	main.jsx
*/

function randomValue(MAX_VALUE) {
	return Math.floor(MAX_VALUE * Math.random());
}

React.render(React.createElement(App, { marbles: randomValue(2000) }), document.body);
