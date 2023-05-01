/**
 * Constructor function for Riddles
 * @param {number} id unique ID for the riddle
 * @param {string} text of the riddle
 * @param {string} answer of the riddle
 * @param {string} hint1 first hint of the riddle
 * @param {string} hint2 second hint of the riddle
 * @param {number} difficulty of the riddle (easy (1) - medium (2) - hard (3))
 * @param {number} duration of the riddle (from the first answer)
 * @param {number} user the id of the user who belong the riddle
 * @param {number} rstatus status of the riddle (open (1) - closed (0))
 * @param {number} winner the id of the user who won the riddle (if riddle is closed and someone won)
 * @param {number} timestart the time when the first answer was submitted
 * @param {string} useranswer null if the current user has not responded to the riddle, otherwise contains his answer
*/
function Riddle({id, text, answer, hint1, hint2, difficulty, duration, user, rstatus, winner, timestart, useranswer} = {}) {

    this.id = id;
    this.text = text;
    this.answer = answer;
    this.hint1 = hint1;
    this.hint2 = hint2;
    this.difficulty = difficulty;
    this.duration = duration;
    this.user = user;
    this.rstatus = rstatus;
    this.winner = winner;
    this.timestart = timestart;
    this.useranswer = useranswer;
};

export { Riddle };