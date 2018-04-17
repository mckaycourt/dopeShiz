<template>
    <div>
        <h2>{{title}}</h2>
        <p>This is not the home page.</p>
    </div>
</template>

<script>
    export default {

        computed: {
            title() {
                return this.$route.params.title;
            }
        }
        
    }
</script>

<style scoped>

</style>