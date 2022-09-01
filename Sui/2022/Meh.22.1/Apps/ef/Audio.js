
const AudioPane = args =>
{
	return {
		type: "div",
		text: "Audio",
		parts:[
			{ type: "div", parts: [
				{ type: "button", text: "Push" }
			] },
		]
	};
};


export default { Pane: AudioPane };
