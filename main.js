(function() {
  const cards = ['baseball-ball', 'basketball-ball', 'bowling-ball', 'dumbbell', 'football-ball', 'futbol', 'golf-ball', 'hockey-puck', 'quidditch', 'skating', 'skiing', 'skiing-nordic', 'snowboarding', 'table-tennis', 'volleyball-ball'];
  window.cards = cards;
  class Game {
    constructor(cards) {
      this.board = new Board(cards);
      this.moves = new Moves();
      this.elapsedTime = new ElapsedTime();

      // this.elapsedTime.startTimer();
    }
  }

  class Board {
    constructor(cards) {
      this.container = document.getElementById('board');
      this.cards = cards.map(card => {
        const cardInstance = new Card(card);
        cardInstance.htmlElement.addEventListener('click', this.onCardClick.bind(this, cardInstance));

        return cardInstance;
      });

      this.shuffleCards();
      this.placeCards();
    }

    onCardClick(cardInstance) {
      cardInstance.htmlElement.classList.toggle('face-up');
      cardInstance.htmlElement.classList.toggle('face-down');
    }

    shuffleCards() {
      this.cards.sort(() => Math.random() - 0.5);
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
      this.htmlElement = this.buildHtmlCard()
    }

    onClick() {}

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

      return cardContainer;
    }
  }

  class Moves {
    constructor() {
      this.count = 0;
      this.label = document.getElementById('moves');
    }

    addMove() {
      this.count++;
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
      this.label.innerText = this.time;
    }
  }

  window.game = new Game(cards.concat(cards));
})();