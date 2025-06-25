class TwentyOneGoldGame {
  constructor(deck = null) {
    this.columns = [0, 0, 0, 0];
    this.columnCardCounts = [0, 0, 0, 0];
    this.columnCards = [[], [], [], []];
    this.score = 0;
    this.bustCount = 0;
    this.holdsUsed = 0;
    this.heldCard = null;
    this.consecutiveClears = 0;
    this.deckPosition = 0;
    this.gameOver = false;
    this.gameWon = false;
    this.lastMove = null;
    this.gameStateBeforeLastMove = null;
    this.deck = deck || this.generateShuffledDeck();
    this.currentCard = null;
    this.scoringLog = [];
    this.drawNextCard();
  }

  generateShuffledDeck() {
    const suits = ["h", "d", "c", "s"];
    const values = [
      "ace",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "jack",
      "queen",
      "king"
    ];
    const deck = [];

    for (let suit of suits) {
      for (let value of values) {
        deck.push(`${suit}-${value}`);
      }
    }

    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    return deck;
  }

  parseCard(cardString) {
    const [suit, value] = cardString.split("-");

    if (value === "jack" && (suit === "c" || suit === "s")) {
      return "wild-jack";
    }

    if (value === "ace") return 1;
    if (["jack", "queen", "king"].includes(value)) return 10;
    return parseInt(value);
  }

  drawNextCard() {
    if (this.deckPosition >= this.deck.length) {
      this.endGame(true);
      return null;
    }

    this.currentCard = this.parseCard(this.deck[this.deckPosition]);
    this.deckPosition++;
    return this.currentCard;
  }

  calculateColumnTotal(columnIndex) {
    const cards = this.columnCards[columnIndex];
    if (cards.length === 0) return 0;

    let total = 0;
    let aces = 0;

    for (let card of cards) {
      if (card === 1) {
        aces++;
      } else {
        total += card;
      }
    }

    total += aces;

    while (aces > 0 && total + 10 <= 21) {
      total += 10;
      aces--;
    }

    return total;
  }

  getAceDisplayValue(columnIndex) {
    const cards = this.columnCards[columnIndex];
    const aces = cards.filter((card) => card === 1).length;
    if (aces === 0) return "";

    const total = this.columns[columnIndex];
    const nonAceTotal = cards
      .filter((card) => card !== 1)
      .reduce((sum, card) => sum + card, 0);
    const acesAs11 = Math.floor((total - nonAceTotal - aces) / 10);
    const acesAs1 = aces - acesAs11;

    if (acesAs11 > 0 && acesAs1 > 0) {
      return ` (${acesAs11}×11, ${acesAs1}×1)`;
    } else if (acesAs11 > 0) {
      return ` (${acesAs11}×11)`;
    } else {
      return ` (${acesAs1}×1)`;
    }
  }

  saveStateForUndo() {
    this.gameStateBeforeLastMove = {
      columns: [...this.columns],
      columnCardCounts: [...this.columnCardCounts],
      columnCards: this.columnCards.map((col) => [...col]),
      score: this.score,
      bustCount: this.bustCount,
      holdsUsed: this.holdsUsed,
      heldCard: this.heldCard,
      consecutiveClears: this.consecutiveClears,
      deckPosition: this.deckPosition,
      currentCard: this.currentCard,
      scoringLog: [...this.scoringLog]
    };
  }

  playCard(column) {
    if (this.gameOver || column < 0 || column > 3) {
      return { success: false, message: "Invalid move" };
    }

    this.saveStateForUndo();
    this.lastMove = { type: "play", column, card: this.currentCard };

    const cardValue = this.currentCard;

    if (cardValue === "wild-jack") {
      this.columnCards[column].push(10);
      this.columnCardCounts[column]++;
      this.columns[column] = this.calculateColumnTotal(column);

      let points = 200;
      let message = `Wild jack played in column ${column + 1}`;

      if (this.columns[column] === 21) {
        points += 400;
        message += ` creating 21`;
        this.scoringLog.push(`Wild Jack + 21 clear: +${points}`);

        if (this.columnCardCounts[column] === 5) {
          points += 600;
          this.scoringLog.push(`Also 5-card bonus: +600`);
        }
      } else {
        this.scoringLog.push(`Wild Jack clear: +${points}`);
      }

      this.clearColumn(column, points);
      this.consecutiveClears++;
      this.drawNextCard();
      return { success: true, message: message };
    }

    this.columnCards[column].push(cardValue);
    this.columnCardCounts[column]++;
    this.columns[column] = this.calculateColumnTotal(column);

    if (this.columns[column] === 21) {
      let points = 400;
      if (this.columnCardCounts[column] === 5) {
        points += 600;
        this.scoringLog.push(`21 + 5-card clear: +${points}`);
      } else {
        this.scoringLog.push(`21 clear: +${points}`);
      }
      this.clearColumn(column, points);
      this.consecutiveClears++;
    } else if (
      this.columnCardCounts[column] === 5 &&
      this.columns[column] <= 21
    ) {
      this.scoringLog.push(`5-card clear: +600`);
      this.clearColumn(column, 600);
      this.consecutiveClears++;
    } else if (this.columns[column] > 21) {
      this.scoringLog.push(`Bust column ${column + 1}`);
      this.bustColumn(column);
      this.consecutiveClears = 0;
    } else {
      this.consecutiveClears = 0;
    }

    this.drawNextCard();

    if (cardValue === 1) {
      const aceValue = this.getAceDisplayValue(column);
      return {
        success: true,
        message: `Played Ace${aceValue} in column ${column + 1}`
      };
    }
    return {
      success: true,
      message: `Played ${cardValue} in column ${column + 1}`
    };
  }

  playHeldCard(column) {
    if (!this.heldCard || this.gameOver) {
      return { success: false, message: "No held card to play" };
    }

    this.saveStateForUndo();
    this.lastMove = { type: "play_held", column, card: this.heldCard };

    const cardValue = this.heldCard;

    if (cardValue === "wild-jack") {
      this.columnCards[column].push(10);
      this.columnCardCounts[column]++;
      this.columns[column] = this.calculateColumnTotal(column);

      let points = 200;
      let message = `Held wild jack played in column ${column + 1}`;

      if (this.columns[column] === 21) {
        points += 400;
        message += ` creating 21`;
        this.scoringLog.push(`Held Wild Jack + 21 clear: +${points}`);

        if (this.columnCardCounts[column] === 5) {
          points += 600;
          this.scoringLog.push(`Also 5-card bonus: +600`);
        }
      } else {
        this.scoringLog.push(`Held Wild Jack clear: +${points}`);
      }

      this.clearColumn(column, points);
      this.consecutiveClears++;
      this.heldCard = null;
      return { success: true, message: message };
    }

    this.columnCards[column].push(cardValue);
    this.columnCardCounts[column]++;
    this.columns[column] = this.calculateColumnTotal(column);

    if (this.columns[column] === 21) {
      let points = 400;
      if (this.columnCardCounts[column] === 5) {
        points += 600;
        this.scoringLog.push(`Held card + 21 + 5-card clear: +${points}`);
      } else {
        this.scoringLog.push(`Held card + 21 clear: +${points}`);
      }
      this.clearColumn(column, points);
      this.consecutiveClears++;
    } else if (
      this.columnCardCounts[column] === 5 &&
      this.columns[column] <= 21
    ) {
      this.scoringLog.push(`Held card + 5-card clear: +600`);
      this.clearColumn(column, 600);
      this.consecutiveClears++;
    } else if (this.columns[column] > 21) {
      this.scoringLog.push(`Held card bust column ${column + 1}`);
      this.bustColumn(column);
      this.consecutiveClears = 0;
    } else {
      this.consecutiveClears = 0;
    }

    this.heldCard = null;

    if (cardValue === 1) {
      const aceValue = this.getAceDisplayValue(column);
      return {
        success: true,
        message: `Played held Ace${aceValue} in column ${column + 1}`
      };
    }
    return {
      success: true,
      message: `Played held ${cardValue} in column ${column + 1}`
    };
  }

  clearColumn(column, basePoints) {
    this.score += basePoints;

    if (this.consecutiveClears > 0) {
      const bonus = 250 * this.consecutiveClears;
      this.score += bonus;
      this.scoringLog.push(
        `Consecutive bonus (${this.consecutiveClears + 1} in a row): +${bonus}`
      );
    }

    this.columns[column] = 0;
    this.columnCardCounts[column] = 0;
    this.columnCards[column] = [];
  }

  bustColumn(column) {
    this.bustCount++;
    this.columns[column] = 0;
    this.columnCardCounts[column] = 0;
    this.columnCards[column] = [];

    if (this.bustCount >= 3) {
      this.endGame(false);
    }
  }

  holdCard() {
    if (this.holdsUsed >= 5 || this.heldCard !== null) {
      return { success: false, message: "Cannot hold card" };
    }

    // cannot undo hold
    this.gameStateBeforeLastMove = null;
    this.lastMove = { type: "hold", card: this.currentCard };

    this.heldCard = this.currentCard;
    this.holdsUsed++;
    this.drawNextCard();

    return { success: true, message: `Held ${this.heldCard}` };
  }

  undoLastMove() {
    if (!this.gameStateBeforeLastMove) {
      return { success: false, message: "No move to undo" };
    }

    this.columns = [...this.gameStateBeforeLastMove.columns];
    this.columnCardCounts = [...this.gameStateBeforeLastMove.columnCardCounts];
    this.columnCards = this.gameStateBeforeLastMove.columnCards.map((col) => [
      ...col
    ]);
    this.score = this.gameStateBeforeLastMove.score;
    this.bustCount = this.gameStateBeforeLastMove.bustCount;
    this.holdsUsed = this.gameStateBeforeLastMove.holdsUsed;
    this.heldCard = this.gameStateBeforeLastMove.heldCard;
    this.consecutiveClears = this.gameStateBeforeLastMove.consecutiveClears;
    this.deckPosition = this.gameStateBeforeLastMove.deckPosition;
    this.currentCard = this.gameStateBeforeLastMove.currentCard;
    this.scoringLog = [...this.gameStateBeforeLastMove.scoringLog];

    this.gameStateBeforeLastMove = null;
    this.lastMove = null;

    return { success: true, message: "Move undone" };
  }

  endGame(won) {
    this.gameOver = true;
    this.gameWon = won;

    if (this.bustCount === 0) {
      this.score += 350;
      this.scoringLog.push("No-bust bonus: +350");
    }
  }

  getGameState() {
    return {
      columns: [...this.columns],
      columnCardCounts: [...this.columnCardCounts],
      columnCards: this.columnCards.map((col) => [...col]),
      score: this.score,
      bustCount: this.bustCount,
      holdsUsed: this.holdsUsed,
      heldCard: this.heldCard,
      consecutiveClears: this.consecutiveClears,
      currentCard: this.currentCard,
      deckPosition: this.deckPosition,
      remainingCards: this.deck.length - this.deckPosition,
      gameOver: this.gameOver,
      gameWon: this.gameWon,
      canHold: this.holdsUsed < 5 && this.heldCard === null,
      canUndo: this.gameStateBeforeLastMove !== null,
      scoringLog: [...this.scoringLog],
      remainingCardCounts: this.getRemainingCardCounts()
    };
  }

  getRemainingCardCounts() {
    const remainingDeck = this.deck.slice(this.deckPosition);
    const counts = {};

    for (let cardStr of remainingDeck) {
      const value = this.parseCard(cardStr);
      const key = value === "wild-jack" ? "wild-jack" : value;
      counts[key] = (counts[key] || 0) + 1;
    }

    return counts;
  }
}

// module.exports = TwentyOneGoldGame;
