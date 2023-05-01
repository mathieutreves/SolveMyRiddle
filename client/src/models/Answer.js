/**
 * Constructor function for Answers
 * @param {number} riddleid id of the riddle the answer is for
 * @param {number} userid id of the user that gave the answer
 * @param {string} user username of the user that gave the answer
 * @param {string} answer text of the answer given by the user
 * @param {number} correct the answer is correct/wrong (1/0)
*/
function Answer({riddleid, userid, user, answer, correct} = {}) {
    this.riddleid = riddleid;
    this.userid = userid;
    this.user = user;
    this.answer = answer;
    this.correct = correct;
};

export { Answer }