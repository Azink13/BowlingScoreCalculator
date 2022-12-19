export interface Game {
    bonus: { 1: string, 2: string, 3: string, 4: string, 5: string, 6: string, 7: string, 8: string, 9: string, 10: string },
    frame: number;
    frameScore: { 1: [any?, any?], 2: [any?, any?], 3: [any?, any?], 4: [any?, any?], 5: [any?, any?], 6: [any?, any?], 7: [any?, any?], 8: [any?, any?], 9: [any?, any?], 10: [any?, any?, any?] };
    gameover: boolean;
    pinCount: number;
    throwHistory: number[];
    runningScore: { 1: string, 2: string, 3: string, 4: string, 5: string, 6: string, 7: string, 8: string, 9: string, 10: string },
    runningTotal: number
    throwNumber: number;
}