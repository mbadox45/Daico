<script setup>
// Vue Component
import { useLayout } from '@/layout/composables/layout';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';

const mainText = ref('white')
const hoverText = ref('gray-600')


</script>

<template>
    <section id="about" class="flex flex-column">
        <div class="relative">
            <div class="h-screen flex flex-column py-3 bg-gray-800 align-items-center px-8">
                <h3 class="text-white text-6xl">About</h3>
            </div>
        </div>
    </section>
</template>