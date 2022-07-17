<template>
	<HSLDisplay :color="color" />
	<HSLCtrl :color="color" />
	<p>22. 07. 17. Vue-1</p>
</template>

<script>
import HSLCtrl from './components/HSLCtrl.vue'
import HSLDisplay from './components/HSLDisplay.vue'
import { Branch } from "./Leaf"

const HSL = Branch.newType (
	{
		fields: { hue: Number, sat: Number, light: Number },
		methods: { toString() { return `HSL( ${ this.hue.value }, ${ this.sat.value }%, ${ this.light.value }% )`; } }
	}
);

export default
{
	name: 'App',
	components:
	{
		HSLCtrl,
		HSLDisplay
	},
	data()
	{
		return {
			// color: { hue: 240, sat: 55, light: 45 },
			color: new HSL( { value: { hue: 180, sat: 70, light: 50 } } ),
		}
	}
}
</script>

<style>
#app {
	display: flex;  flex-direction: column; gap: 13px; align-items: center;

	font-family: Avenir, Helvetica, Arial, sans-serif;
	color: #2c3e50;
	margin-top: 60px;
}

.HSLDisplay
{
	width: 740px;
	height: 120px;
	border: 2px solid hsl( 0, 0%, 40% );
}
</style>
