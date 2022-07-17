<script>
export default
{
	name: "HSLDisplay",
	props:
	{
		color: Object
	}
};
</script>
<template>
	<div class="HSLDisplay" v-bind:style="{ background: color.toString() }">
		<p>HSLDisplay</p>
		<p>{{ color.toString() }}</p>
	</div>
</template>
<style>
.HSLDisplay { text-align: center; }
</style>
