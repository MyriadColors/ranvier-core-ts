import { ChannelAudience } from './ChannelAudience';

/**
 * Audience class representing everyone in the game, except sender.
 * @extends ChannelAudience
 */
export class WorldAudience extends ChannelAudience {
	getBroadcastTargets() {
		return (this.state?.PlayerManager || []).filter(
			(player) => player !== this.sender
		);
	}
}
