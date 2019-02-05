(function() {
  const cards = ['baseball-ball', 'basketball-ball', 'bowling-ball', 'dumbbell', 'football-ball', 'futbol', 'golf-ball', 'hockey-puck', 'quidditch', 'skating', 'skiing', 'skiing-nordic', 'snowboarding', 'table-tennis', 'volleyball-ball'];
  window.cards = cards;
  class Game {
    constructor(cards) {
      this.board = new Board(cards);
      this.moves = new Moves();
      this.elapsedTime = new ElapsedTime();
      this.matches = {
        objective: cards / 2,
        done: 0
      }

      this.elapsedTime.startTimer();
    }

    pauseGame() {
      this.elapsedTime.stopTimer();
    }

    resumeGame() {
      this.elapsedTime.startTimer();
    }

    endGame() {
      this.elapsedTime.stopTimer();
    }

    addMatch() {
      this.matchedCards++;
      if (this.matchedCards === this.matchesToWin) {
        this.elapsedTime.stopTimer();
      }
    }
  }

  class Board {
    constructor(cards) {
      this.container = document.getElementById('board');
      this.cards = cards.map(card => {
        const cardInstance = new Card(card);

        return cardInstance;
      });
      this.matchedCards = 0;
      this.matchesToWin = cards / 2;

      this.pickedCard = null;

      this.shuffleCards();
      this.clearBoard();
      this.placeCards();
    }

    shuffleCards() {
      this.cards.sort(() => Math.random() - 0.5);
    }

    clearBoard() {
      const board = document.getElementById('board');
      
      for (let i = board.children.length - 1; i >= 0; i--) {
        board.removeChild(board.children[i]);
      }  
    }

    placeCards() {
      for (let card of this.cards) {
        this.container.appendChild(card.htmlElement);
      }
    }
  }

  class Card {
    constructor(cardContent) {
      this.content = cardContent;
      this.htmlElement = this.buildHtmlCard();
      this.matched = false;
    }

    onClick() {
      if (this.matched) {
        return;
      }

      this.htmlElement.classList.toggle('face-up');
      this.htmlElement.classList.toggle('face-down');
      if (game.board.pickedCard === null) {
        game.board.pickedCard = this;
      } else {
        const firstCard = game.board.pickedCard;
        game.board.pickedCard = null;
        if (firstCard.content === this.content) {
          firstCard.setMatched();
          this.setMatched();
        } else {
          setTimeout(function() {
            firstCard.htmlElement.classList.toggle('face-up');
            firstCard.htmlElement.classList.toggle('face-down');
            this.htmlElement.classList.toggle('face-up');
            this.htmlElement.classList.toggle('face-down');
          }.bind(this), 500);
        }

        game.moves.add();
      }
    }

    setMatched() {
      this.matched = true;
      this.htmlElement.classList.add('matched');
    }

    buildHtmlCard() {
      const cardContainer = document.createElement('div');
      cardContainer.classList.add('card');
      cardContainer.classList.add('face-down');

      const cardFrontFace = document.createElement('i');
      cardFrontFace.classList.add('fas')
      cardFrontFace.classList.add('fa-' + this.content);

      const cardBackFace = document.createElement('i');
      cardBackFace.classList.add('fas')
      cardBackFace.classList.add('fa-certificate');

      cardContainer.appendChild(cardFrontFace);
      cardContainer.appendChild(cardBackFace);

      cardContainer.addEventListener('click', this.onClick.bind(this));

      return cardContainer;
    }
  }

  class Moves {
    constructor() {
      this.count = 0;
      this.label = document.getElementById('moves');

      this.refreshLabel();
    }

    add() {
      this.count++;
      this.refreshLabel();
    }

    refreshLabel() {
      this.label.innerText = this.count;
    }
  }

  class ElapsedTime {
    constructor() {
      this.time = 0;
      this.label = document.getElementById('time-elapsed'),
      this.interval = null;

      this.refreshLabel();
    }

    startTimer () {
      this.interval = setInterval(function () {
        this.time++;
        this.refreshLabel();
      }.bind(this), 1000) 
    }

    stopTimer() {
      clearInterval(this.interval);
    }

    refreshLabel() {
      this.label.innerText = this.time.toString().toHHMMSS();
    }
  }

  String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10);
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
  }

  startNewGame = function() {
    if (window.game) {
      window.game.endGame();
    }
    window.game = new Game(cards.concat(cards));
  }

  showModalContainer = function() {
    document.getElementsByClassName('modal-container')[0].classList.add('opened');
  }

  hideModalContainer = function() {
    setTimeout(function() {
      document.getElementsByClassName('modal-container')[0].classList.remove('opened');
      game.resumeGame();
    }, 500);
  }

  showRestartModal = function() {
    game.pauseGame();
    showModalContainer();
    document.getElementById('modal-restart').classList.add('opened') 
  }

  hideRestartModal = function() {
    document.getElementById('modal-restart').classList.remove('opened');
    hideModalContainer();
  }

  hideModals = function() {
    hideRestartModal();
  }

  document.getElementById('restart-button').addEventListener('click', showRestartModal);
  document.getElementsByClassName('modal-container')[0].addEventListener('click', hideModals);

  startNewGame();
})();