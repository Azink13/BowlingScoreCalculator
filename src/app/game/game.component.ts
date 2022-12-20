import { Component, OnInit } from '@angular/core';
import { start } from 'repl';
import { Game } from '../game';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {

  game: Game = {
    bonus: { 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: '', 10: '' },
    frame: 1,
    frameScore: { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [] },
    gameover: false,
    pinCount: 10,
    throwHistory: [],
    runningScore: { 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: '', 10: '' },
    runningTotal: 0,
    throwNumber: 1,
    finalFrame: 0,
  }
  constructor() {
  }

  ngOnInit(): void {
  }

  /* Scoring Methods */
  scoreShot(pinsHit: number): void {
    console.log(pinsHit);
    if (this.isRollValid(pinsHit) === false) {
      return;
    }
    this.roll(pinsHit);
  }

  roll(pinsHit: number): void {
    this.isRollValid(pinsHit);
    this.game.throwHistory.push(pinsHit);
    if (this.game.frame === 10) {
      this.finalFrame(pinsHit);
      return;
    };
    if (pinsHit === 10 && this.game.throwNumber === 1) {
      this.game.frameScore[this.game.frame as keyof { 1: [] }].push("X");
      this.game.bonus[this.game.frame as keyof { 1: string }] = 'Strike';
      this.nextFrame();
      return;
    } else if (((pinsHit + this.game.throwHistory[this.game.throwHistory.length - 2]) === 10) && (this.game.throwNumber > 1)) {
      this.game.frameScore[this.game.frame as keyof { 1: [] }].push("/");
      this.game.bonus[this.game.frame as keyof { 1: string }] = 'Spare';
      this.nextFrame();
      return;
    }
    else {
      this.game.frameScore[this.game.frame as keyof { 1: [] }].push(pinsHit)
      if (this.game.throwNumber === 2) {
        this.nextFrame();
      } else {
        this.setupThrow(pinsHit)
        return;
      }
    }
  };

  setupThrow(pinsHit: number): void {
    this.game.throwNumber++;
    this.game.pinCount -= pinsHit;
  };

  finalFrame(pinsHit: number): void {
    var extraThrow = false;
    if (pinsHit === 10) {
      if (this.game.throwNumber >= 2 && this.game.throwHistory[this.game.throwHistory.length - 2] === 0) {
        this.game.frameScore[this.game.frame as keyof { 1: [] }].push("/");
        this.game.finalFrame += 10
        return
      }
      else {
        this.game.frameScore[this.game.frame as keyof { 1: [] }].push("X");
        this.game.finalFrame += 10
      }

      extraThrow = true;
      //Setup Throw
      if (this.game.throwNumber === 3) {
        this.endGame(extraThrow);
      }
      else {
        this.game.throwNumber++;
        this.game.pinCount = 10;
      }
      return;
    }
    else if (((pinsHit + this.game.throwHistory[this.game.throwHistory.length - 2]) === 10) && this.game.throwNumber > 1) {
      if (pinsHit > 0) {
        this.game.frameScore[this.game.frame as keyof { 1: [] }].push("/");
      }
      else {
        this.game.frameScore[this.game.frame as keyof { 1: [] }].push(pinsHit);
      }
      this.game.finalFrame += pinsHit;

      extraThrow = true;
      //Setup Throw
      if (this.game.throwNumber === 3) {
        this.endGame(extraThrow);
      }
      else {
        this.game.throwNumber++;
        this.game.pinCount = 10;
      }
      return;
    }
    else {

      if (!extraThrow && (this.game.throwNumber >= 2)) {
        this.game.frameScore[this.game.frame as keyof { 1: [] }].push(pinsHit);
        this.game.finalFrame += pinsHit;
        this.endGame(extraThrow);
      }
      else {
        this.game.frameScore[this.game.frame as keyof { 1: [] }].push(pinsHit);
        this.game.finalFrame += pinsHit;
        this.setupThrow(pinsHit);
      }
    }
  };

  endGame(thirdThrow: boolean): void {
    this.game.gameover = true;
    this.calculateFrameScore(thirdThrow);
    console.log("Game over")
  }

  //Exapnd Validation
  isRollValid(pinsHit: number): boolean {
    if (pinsHit > this.game.pinCount) {
      throw new Error("only 10 pins per frame");
      return false;
    } else if (this.game.frame > 10) {
      this.game.gameover = true;
      throw new Error("Game Over");
      return false;
    } else {
      return true;
    }
  };

  // Next Frame Group
  nextFrame(): void {
    this.calculateFrameScore(false);
    this.rollReset();
    this.game.frame++;
    if (this.game.frame > 10) {
      console.log("Game Over")
      console.log("Final Score" + " " + this.game.runningTotal)
      return;
    }
  };

  rollReset(): void {
    this.game.throwNumber = 1;
    this.game.pinCount = 10;
  };

  calculateFrameScore(thirdThrow: boolean): void {
    var boxscore = 0;
    var bonus = 0;
    if (this.game.gameover) {
      boxscore = this.game.finalFrame;

      bonus = this.calculateFinalBonus();

      this.game.runningTotal += (boxscore + bonus);
      this.game.runningScore[this.game.frame as keyof { 1: [] }] = this.game.runningTotal.toString();
      return;
    }
    if (this.game.frame <= 2 && this.game.frameScore[1].includes("X")) {
      return;
    }
    else {
      var throw1 = this.game.throwHistory[this.game.throwHistory.length - 1];
      var throw2 = this.game.throwHistory[this.game.throwHistory.length - 2];
      if (throw1 === 10) {
        boxscore = 10
      }
      else {
        boxscore = throw1 + throw2;
      }
    }
    bonus = this.calculateBonus();

    this.game.runningTotal += (boxscore + bonus);
    this.game.runningScore[this.game.frame as keyof { 1: [] }] = this.game.runningTotal.toString();
    return;
  };

  calculateBonus(): number {
    if (this.game.frame === 1) {
      return 0;
    }
    var bonus = 0;
    if (this.game.gameover) {
      bonus += this.calculateFinalBonus();
      bonus += this.calculateFinalFrameBonus();
      return bonus;
    }

    if (this.game.bonus[(this.game.frame - 1) as keyof { 1: string }] === 'Spare') {
      bonus = this.game.frameScore[this.game.frame as keyof { 1: [] }].slice(0, 1)[0];
      if (bonus.toString() === "X") {
        bonus = 10
      }
      return bonus;
    }
    else if (this.game.bonus[(this.game.frame - 2) as keyof { 1: string }] === 'Strike') {
      if (this.game.bonus[(this.game.frame - 1) as keyof { 1: string }] != 'Strike') {
        bonus = this.game.throwHistory[this.game.throwHistory.length - 3] + this.game.throwHistory[this.game.throwHistory.length - 4];
        return bonus;
      }
      bonus = this.game.throwHistory[this.game.throwHistory.length - 1] + this.game.throwHistory[this.game.throwHistory.length - 2];
      return bonus;
    }
    else {
      return 0;
    }
  }

  calculateFinalBonus(): number {
    var bonus = 0;
    if (this.game.bonus[(this.game.frame - 1) as keyof { 1: string }] === 'Spare') {
      bonus = this.game.frameScore[this.game.frame as keyof { 1: [] }].slice(0, 1)[0];
      if (bonus.toString() === "X") {
        bonus = 10
      }
      return bonus;
    }
    else if (this.game.bonus[(this.game.frame - 1) as keyof { 1: string }] === 'Strike') {
      bonus = this.game.frameScore[this.game.frame as keyof { 1: [] }].slice(0, 2)[0] + this.game.frameScore[this.game.frame as keyof { 1: [] }].slice(0, 2)[1];
      if (bonus.toString() === "X") {
        bonus = 10
      }
      if (bonus.toString() === "XX") {
        bonus = 20
      }
      return bonus;
    }
    else {
      return 0;
    }
  }

  //
  calculateFinalFrameBonus(): number {
    var bonus = 0;
    if (this.game.bonus[(this.game.frame) as keyof { 1: string }] === 'Spare') {
      return this.game.throwHistory[this.game.throwHistory.length - 1];
    }
    else if (this.game.bonus[(this.game.frame) as keyof { 1: string }] === 'Strike') {
      //Plus 10 to Count the last strikes
      return this.game.throwHistory[this.game.throwHistory.length - 2] += this.game.throwHistory[this.game.throwHistory.length - 3] + 10;
    }
    else {
      return 0;
    }
  }
}