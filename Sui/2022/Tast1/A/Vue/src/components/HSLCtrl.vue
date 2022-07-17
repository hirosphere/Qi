<template>
	<div class="HSL">
		<RangeInput title="Hue" :value="color.hue" :max=360 />
		<RangeInput title="Sat"  :value="color.sat" />
		<RangeInput title="Light"  :value="color.light" />
	</div>
</template>

<script>
import RangeInput from "./RangeInput.vue";
export default
{
    name: "HSLCtrl",
    components: { RangeInput },
	props:
	{
		color: Object,
	},
	setup( props )
	{
		console.log( "HSLCtrl", props.color.hue );
	}
}
</script>

<style>
.HSL
{
	display: flex;
	flex-direction: column;
	gap: 1px;
}
</style>
