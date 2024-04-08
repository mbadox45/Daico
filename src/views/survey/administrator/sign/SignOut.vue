<script setup>
import { onMounted, ref } from 'vue';

onMounted(() => {
    load();
});
const load = () => {
    localStorage.removeItem('usertoken');
    localStorage.removeItem('payload');
    router.push('/auth/login')
}
</script>

<template>
    <h1>Sign Out</h1>
</template>

<style lang="scss" scoped></style>
