<script setup>
    // Vue Component
    import { ref, computed, onMounted } from 'vue';
    import { useRouter, useRoute } from 'vue-router';

    const router = useRouter();

</script>
<template>
    <div class="card shadow-3 flex flex-column gap-3">
        <div class="flex justify-content-between align-items-center gap-5">
            <div class="w-full flex gap-2">
                <span class="">Form Detail Allocation</span>
            </div>
            <div class="w-full flex justify-content-end">
                <Button icon="pi pi-angle-double-right" size="small"/>
            </div>
        </div>
    </div>
</template>