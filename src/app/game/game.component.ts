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
    frame: 1,
    throwNumber: 1,
    pinCount: 10,
    gameover: false,
    throwHistory: [],
    frameScore: { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [], 7: [], 8: [], 9: [], 10: [] },
    bonus: { 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: '', 10: '' },
    runningScore: { 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: '', 10: '' },
    runningTotal: 0,
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
    console.log(this.game)
    this.roll(pinsHit);
    console.log(this.game)
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
      if (this.game.throwNumber >= 2 && this.game.throwHistory[this.game.throwHistory.length-1] === 0) {
        this.game.frameScore[this.game.frame as keyof { 1: [] }].push("/");
        this.game.bonus[this.game.frame as keyof { 1: string }] = 'Spare';
      }
      else {
        this.game.frameScore[this.game.frame as keyof { 1: [] }].push("X");
        this.game.bonus[this.game.frame as keyof { 1: string }] = 'Strike';
      }

      extraThrow = true;
      //Setup Throw
      this.game.throwNumber++;
      this.game.pinCount = 10;

      //game over check
      if (this.game.throwNumber === 4) {
        this.gameOver(extraThrow);
      }
      return;
    }
    else if (((pinsHit + this.game.throwHistory[this.game.throwHistory.length-2]) === 10) && this.game.throwNumber > 1 ) {
      this.game.frameScore[this.game.frame as keyof { 1: [] }].push("/");
      this.game.bonus[this.game.frame as keyof { 1: string }] = 'Spare';

      extraThrow = true;
      //Setup Throw
      this.game.throwNumber++;
      this.game.pinCount = 10;

      //game over check
      if (this.game.throwNumber === 4) {
        this.gameOver(extraThrow);
      }
      return;
    }
    else {

      if (!extraThrow && (this.game.throwNumber >= 2)) {
        this.gameOver(extraThrow);
      }
      else {
        this.game.frameScore[this.game.frame as keyof { 1: [] }].push(pinsHit);
        this.setupThrow(pinsHit);
      }
    }
  };

  gameOver(thirdThrow: boolean): void {
    this.calculateFrameScore(thirdThrow);
    this.game.gameover = true;

  }

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
      var throw1 = this.game.throwHistory[this.game.throwHistory.length - 2]
      var throw2 = this.game.throwHistory[this.game.throwHistory.length - 1]
      var boxscore = throw1 + throw2;

    if (thirdThrow == true) {
      boxscore += this.game.throwHistory[this.game.throwHistory.length -3];
    }
    var bonus = this.calculateBonus();

    this.game.runningTotal += (boxscore + bonus);
    this.game.runningScore[this.game.frame as keyof { 1: [] }] = this.game.runningTotal.toString();
    return;
  };

  calculateBonus(): number {
    if (this.game.bonus[(this.game.frame - 1) as keyof { 1: string }] === 'Strike') {
      return this.game.throwHistory[this.game.throwHistory.length - 1] += this.game.throwHistory[this.game.throwHistory.length - 2];
    } else if (this.game.bonus[(this.game.frame - 1) as keyof { 1: string }] === 'Spare') {
      return this.game.throwHistory[this.game.throwHistory.length - 2];
    }
    else {
      return 0;
    }
  }
}