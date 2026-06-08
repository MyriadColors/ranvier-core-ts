import { Broadcastable } from ".";
import { ChannelAudience } from "./ChannelAudience";

/**
 * Audience class representing other players in the same group as the sender
 * @extends ChannelAudience
 */
export class PartyAudience extends ChannelAudience {
	getBroadcastTargets() {
		if (!this.sender?.party) {
			return [];
		}

		return this.sender.party
			.getBroadcastTargets()
			.filter((player: Broadcastable) => player !== this.sender);
	}
}
