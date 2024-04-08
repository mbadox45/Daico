<script setup>
import { useLayout } from '@/layout/composables/layout';
import { computed } from 'vue';

const { layoutConfig } = useLayout();

const logoUrl = computed(() => {
    return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});
</script>

<template>
    <div class="lg:text-right">
        <Divider/>
        <!-- <div class="grid">
            <div class="col-12 lg:col-6 md:col-6"></div>
        </div> -->
        <strong>SURVEY - INL </strong>
        <p><span class="font-semibold">ICT Development</span> <span class="mx-1">&copy;</span> 2023 - PT. Industri Nabati Lestari</p>
        <!-- <img :src="logoUrl" alt="Logo" height="20" class="mr-2" />
        by
        <span class="font-medium ml-2">PrimeVue</span> -->
    </div>
</template>
<style lang="scss" scoped></style>
