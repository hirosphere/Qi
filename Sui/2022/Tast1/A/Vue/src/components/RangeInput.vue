<template>
	<div class="RangeInput">
		<label class="title">{{ title }}</label>
		<input class="input" type="range" :max="max" v-model="i_value" @input="onInputChange" />
		<span class="value">{{ i_value }}</span>
	</div>
</template>
<script>
export default
{
	name: "RangeInput",
	props:
	{
		title: String,
		value: Object,
		max: Number
	},
	data()
	{
		console.log( "data", this.value.con );
		return { i_value: this.value.con };
	},
	methods:
	{
		onInputChange( ev )
		{
			this.value.set( ev.target.value );
			this.i_value = ev.target.value;
		}
	}
}
</script>
<style>
.RangeInput
{
	display: flex;
	font-size: 15px;
	width: 500px;
	height: 3em;
	border-radius: 1ex;
	border: 2px solid hsl( 0, 0%, 50% );
	padding: 0 1em;
	align-items: center;
	gap: 4px;
}
.title
{
	width: 5ex;
}
.input
{
	flex-grow: 1;
}
.value
{
	width: 4ex;
	text-align: right;
}
</style>
