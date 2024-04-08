<script setup>
    // Vue Component
    import { useLayout } from '@/layout/composables/layout';
    import { ref, computed, onMounted, onUnmounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { useToast } from 'primevue/usetoast';

    const mainText = ref('gray-900')
    const hoverText = ref('gray-500')
    const mainText2 = ref('white')
    const hoverText2 = ref('yellow-500')

    // Section
    const menuSection = ref('opacity-100 fixed');
    const menuSection2 = ref('opacity-0 hidden');
    const isMenuFixed = ref(false);
    const activeSection = ref(null);


    onMounted(() => {
        window.addEventListener('scroll', handleScroll);
    });

    onUnmounted(() => {
        window.removeEventListener('scroll', handleScroll);
    });

    const handleScroll = () => {
        const scrollPosition = window.scrollY;

        // Check if the menu should be fixed based on scroll position
        isMenuFixed.value = scrollPosition > 600; // Adjust this value as needed
        if (scrollPosition <= 400) {
            menuSection.value = 'opacity-100 fixed'
            menuSection2.value = 'opacity-0 hidden'
        } else if (scrollPosition > 400 && scrollPosition <= 420) {
            menuSection.value = 'opacity-90 fixed'
            menuSection2.value = 'opacity-10 fixed'
        } else if (scrollPosition > 420 && scrollPosition <= 440) {
            menuSection.value = 'opacity-80 fixed'
            menuSection2.value = 'opacity-20 fixed'
        } else if (scrollPosition > 440 && scrollPosition <= 460) {
            menuSection.value = 'opacity-70 fixed'
            menuSection2.value = 'opacity-30 fixed'
        } else if (scrollPosition > 460 && scrollPosition <= 480) {
            menuSection.value = 'opacity-60 fixed'
            menuSection2.value = 'opacity-40 fixed'
        } else if (scrollPosition > 480 && scrollPosition <= 500) {
            menuSection.value = 'opacity-50 fixed'
            menuSection2.value = 'opacity-50 fixed'
        } else if (scrollPosition > 500 && scrollPosition <= 520) {
            menuSection.value = 'opacity-40 fixed'
            menuSection2.value = 'opacity-60 fixed'
        } else if (scrollPosition > 520 && scrollPosition <= 540) {
            menuSection.value = 'opacity-30 fixed'
            menuSection2.value = 'opacity-70 fixed'
        } else if (scrollPosition > 540 && scrollPosition <= 580) {
            menuSection.value = 'opacity-20 fixed'
            menuSection2.value = 'opacity-80 fixed'
        } else if (scrollPosition > 580 && scrollPosition <= 600) {
            menuSection.value = 'opacity-10 fixed'
            menuSection2.value = 'opacity-90 fixed'
        } else {
            menuSection2.value = 'opacity-100 fixed'
            menuSection.value = 'opacity-0 hidden'
        }

        activeSection.value = scrollPosition
        console.log(isMenuFixed.value)
        console.log(scrollPosition)
    };

    const scrollToSection = (sectionRef) => {
        document.querySelector(`#${sectionRef}`).scrollIntoView({behavior: 'smooth'})
    };

    const removeMenu = () => {
        isMenuVisible.value = false;
    };

</script>

<template>
    <section id="home" class="flex flex-column">
        <div class="relative ">
            <div :class="`py-5 px-6 transition-transform ${menuSection} w-full z-5`">
                <div class="bg-transparent py-3 px-4 md:px-5 border-round-3xl flex justify-content-between align-items-center">
                    <div class="flex flex-row align-items-center gap-3">
                        <img src="/x(2).png" alt="Mbadox45" class="w-3rem border-circle">
                        <span class="text-lg font-medium">Mbadox 45</span>
                    </div>
                    <button class="block md:hidden p-link layout-topbar-menu-button layout-topbar-button">
                        <i class="pi pi-ellipsis-v font-medium text-lg"></i>
                    </button>
                    <div class="hidden md:flex gap-3">
                        <span :class="`cursor-pointer px-3 py-2 border-round font-medium text-lg text-${mainText} hover:text-${hoverText}`" style="text-transform: uppercase;" @click="scrollToSection('home')">Home</span>
                        <span :class="`cursor-pointer px-3 py-2 border-round font-medium text-lg text-${mainText} hover:text-${hoverText}`" style="text-transform: uppercase;" @click="scrollToSection('about')">About</span>
                        <span :class="`cursor-pointer px-3 py-2 border-round font-medium text-lg text-${mainText} hover:text-${hoverText}`" style="text-transform: uppercase;" @click="scrollToSection('portofolio')">My portofolio</span>
                        <span :class="`cursor-pointer px-3 py-2 border-round font-medium text-lg text-${mainText} hover:text-${hoverText}`" style="text-transform: uppercase;" @click="scrollToSection('contact')">Contact</span>
                    </div>
                </div>
            </div>
            <div :class="`transition-transform duration-1000 ${menuSection2} bottom-0 z-5 w-full`">
                <div class="bg-yellow-500 flex flex-row justify-content-center gap-2 align-items-center px-1 ">
                    <!-- <div class="text-center flex flex-row align-items-center">
                        <img src="/x(2).png" alt="Mbadox45" class="w-3rem border-circle">
                    </div> -->
                    <div class="flex flex-row justify-content-center align-items-center h-full gap-6">
                        <span :class="`cursor-pointer transition-all transition-duration-500 px-3 py-3 font-medium text-lg text-${mainText2} bg-${hoverText2} hover:text-${hoverText2} hover:bg-${mainText2}`" style="text-transform: uppercase;" @click="scrollToSection('home')"><i class="text-xl pi pi-home"></i></span>
                        <span :class="`cursor-pointer transition-all transition-duration-500 px-3 py-3 font-medium text-lg text-${mainText2} bg-${hoverText2} hover:text-${hoverText2} hover:bg-${mainText2}`" style="text-transform: uppercase;" @click="scrollToSection('about')"><i class="text-xl pi pi-id-card"></i></span>
                        <span :class="`cursor-pointer transition-all transition-duration-500 px-3 py-3 font-medium text-lg text-${mainText2} bg-${hoverText2} hover:text-${hoverText2} hover:bg-${mainText2}`" style="text-transform: uppercase;" @click="scrollToSection('portofolio')"><i class="text-xl pi pi-th-large"></i></span>
                        <span :class="`cursor-pointer transition-all transition-duration-500 px-3 py-3 font-medium text-lg text-${mainText2} bg-${hoverText2} hover:text-${hoverText2} hover:bg-${mainText2}`" style="text-transform: uppercase;" @click="scrollToSection('contact')"><i class="text-xl pi pi-phone"></i></span>
                    </div>
                </div>
            </div>
            <div class="h-screen flex flex-row justify-content-between bg-white align-items-center px-8 bg-green-300">
                <div class="w-full flex flex-column gap-2">
                    <span class="text-6xl transition-all transition-duration-500 transition-ease-in fadeinleft animation-duration-1000 animation-ease-in">Welcome to my website</span>
                    <span class="transition-all transition-duration-500 transition-ease-in fadeinleft animation-duration-1000 animation-ease-in">Website ini adalah portofolio yang dibuat untuk memperkenalkan biografi saya sebagai Fullstack Developer</span>
                </div>
                <div class="w-full hidden justify-content-end md:flex">
                    <img src="/quotes.png" alt="My Picture" class="w-8rem md:w-30rem transition-all transition-duration-1000 transition-ease-in fadeinleft animation-duration-1000 animation-ease-in">
                </div>
            </div>
        </div>
        <div class="z-0 flex align-items-center px-0 md:px-8 absolute bottom-0 w-full">
            <div class="bg-gray-800 text-white md:border-round-top-xl h-5rem px-4 py-3 w-full flex flex-row justify-content-between align-items-center">
                <div class="w-full h-full align-items-center gap-3 flex flex-row justify-content-center text-center border-right-1">
                    <i class="pi pi-user text-lg md:text-4xl"></i>
                    <span class="text-xl md:text-5xl font-light underline">5,372</span>
                    <span class="text-sm md:text-xl font-light">Viewers</span>
                </div>
                <div class="w-full h-full align-items-center gap-3 flex flex-row justify-content-center text-center border-left-1">
                    <i class="pi pi-code text-lg md:text-4xl"></i>
                    <span class="text-xl md:text-5xl font-light underline">10</span>
                    <span class="text-sm md:text-xl font-light">My Projects</span>
                </div>
            </div>
        </div>
    </section>
</template>