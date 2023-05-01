/**
 * Constructor function for Ranks
 * @param {string} email of the user
 * @param {string} username of the user (to be displayed)
 * @param {number} points of the user (to be displayed)
 * @param {number} rank of the user (1/2/3)
*/
function Rank ({email, username, points, rank} = {}) {
    this.email = email;
    this.username = username;
    this.points = points;
    this.rank = rank;
};

export { Rank }