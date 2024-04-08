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
    <section id="contact" class="flex flex-column">
        <div class="relative">
            <div class="h-screen flex flex-row align-items-center px-8">
                <h3 class="text-white">Contact</h3>
            </div>
        </div>
    </section>
</template>