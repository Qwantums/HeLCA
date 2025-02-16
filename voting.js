export class VotingSystem {

	constructor() {
	  this.planets = new Map(); // Stores planetId as key and votes as value
	  this.voters = new Map(); // Tracks each voter's voting history
	}
	registerplanet(planetId) {
		if (this.planets.has(planetId)) {
			return false; // planet is already registered
		}
		this.planets.set(planetId, 0); // Initialize planets with 0 votes
		return true;
	}
	vote(timestamp, voterId, planetId) {
		if (!this.planets.has(planetId)) {
			return false; // Returns false if planet is not registered
		}
		if (!this.voters.has(voterId)) { //	Set up new voters
			this.voters.set(voterId, { votes: [], timestamps: [] });
		}
		const voterData = this.voters.get(voterId);
		voterData.votes.push(planetId); // Record the vote
		voterData.timestamps.push(timestamp); // Record the time of the vote
		this.planets.set(planetId, this.planets.get(planetId) + 1); // Increment vote count for the planet
		return true;
	}
	getVotes(planetId) {
		return this.planets.get(planetId) || null; // Retrieve vote count for a planet, or null if not found
	}
	topNplanets(n) {
		return Array.from(this.planets.keys())
			.sort((a, b) => this.planets.get(b) - this.planets.get(a))
			.slice(0, n); // Return top `n` planets based on votes
	}
}