<template>
    <iframe src="/admin/alumni/auth" style="width: 100%; height: 100%; margin: 0;"></iframe>
</template>

<script>
    export default {
        name: "Old",
        mounted() {
            this.$emit("changeTitle", "旧版控制台")
        }
    }
</script>

<style scoped>

</style>