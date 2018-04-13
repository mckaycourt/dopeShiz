<template>
    <div id="app">
        <p>This content is persistent accross routes</p>

        <!-- this content is route based -->
        <div id="content-area">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    export default {
        computed: {
            
        },
        methods: {
            
        }
    }
</script>

