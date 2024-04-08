<script setup>
// Vue Component
import { useLayout } from '@/layout/composables/layout';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import './../index.css'

// Components
import HomePage from '@/views/portofolio/home/components/Home.vue'
import AboutPage from '@/views/portofolio/home/components/About.vue'
import PortofolioPage from '@/views/portofolio/home/components/Portofolio.vue'
import ContactPage from '@/views/portofolio/home/components/Contact.vue'

</script>

<template>
    <div>
        <home-page/>
        <about-page/>
        <portofolio-page/>
        <contact-page/>
    </div>
</template>