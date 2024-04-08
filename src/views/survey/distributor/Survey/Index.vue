<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute  } from 'vue-router';

// API
import SurveyService from '@/api/SurveyService';
import { FormPreview } from '@/api/DataVariable';

const router = useRouter();
const route = useRoute();
const layout = ref('list');
const searchKeyword = ref('');
const sortOrder = ref(null);
const sortField = ref(null);
const params = route.params.id;
const loadings = ref(true)

const token = localStorage.getItem('usertoken');
const breadcrumbHome = ref({ icon: 'pi pi-home', to: '/home' });
const breadcrumbItems = ref([{ label: 'Home', to:'/home' }, { label: 'Survey', to:'/survey', class:'font-bold', disabled:true}]);

const listSurvey = ref([]);
const listSurveyAnswered = ref([]);


onMounted(() => {
    loadSurvey()
    // surveyAnswered()
});

const loadSurvey = async () => {
    console.log(token)
    try {
        // const response = await SurveyService.getSurveyAnswered();
        const response = await SurveyService.getSurveyAvailable();
        const answer = await surveyAnswered();
        console.log(answer)
        const load = response.data;
        if (load.code == 200) {
            const data = load.data;
            const list = [];
            for (let i = 0; i < data.length; i++) {
                let ket = false;
                if (answer.length > 0) {
                    for (let a = 0; a < answer.length; a++) {
                        if (data[i].id == answer[a].id) {
                            ket = true
                        }
                    }
                } else {
                    ket = false;
                }
                list[i] = {
                    id: data[i].id,
                    title: data[i].title,
                    desc: data[i].desc,
                    from: data[i].from,
                    to: data[i].to,
                    status: data[i].status,
                    ket: ket,
                }
            }
            listSurvey.value = list;
            console.log(list);
            loadings.value = false;
        }
    } catch (error) {
        const response = error.response.data
        console.log(response);
        listSurvey.value = []
        loadings.value = false;
    }
}

const surveyAnswered = async () => {
    try {
        const response = await SurveyService.getSurveyAnswered();
        // const response = await SurveyService.getSurveyAvailable();
        const load = response.data;
        if (load.code == 200) {
            const data = load.data;
            console.log(data);
            return data;
        }
    } catch (error) {
        const response = error.response.data
        // console.log(response);
        const data = []
        return data;
    }
}

const filteredList = computed(() => {
    return listSurvey.value.filter(item =>
        item.title.toLowerCase().includes(searchKeyword.value.toLowerCase())
    );
});

const previewQuestion = (id) => {
    console.log(router.push({path:`/form/preview/${id}`, target: '_blank'}));
}

</script>

<template>
    <div class="grid">
        <div class="col-12 md:col-12">
            <Breadcrumb :home="breadcrumbHome" :model="breadcrumbItems" class="bg-gray-300" />
        </div>
        <div class="col-12 md:col-12">
            <div class="card">
                <div class="grid align-items-center">
                    <div class="col-6 md:col-6 sm:col-6">
                        <h5>List Survey</h5>
                    </div>
                    <div class="col-6 md:col-6 sm:col-6 text-right">
                        <Button :icon="'pi pi-sync'" class="mb-2" :severity="'secondary'" label="Sync Data" outlined size="small" @click="loadSurvey"></Button>
                    </div>
                </div>
                <Divider/>
                <DataView :value="filteredList" :layout="layout" :paginator="true" :rows="9" :sortOrder="sortOrder" :sortField="sortField" v-if="listSurvey.length > 0">
                    <template #list="slotProps">
                        <div class="col-12 my-1">
                            <div class="flex flex-column md:flex-row align-items-center p-3 w-full border-round-md">
                                <img :src="slotProps.data.ket == true ? '/layout/check.png' : '/layout/inl-ori2.png'" :alt="slotProps.data.title" class="my-4 md:my-0 w-9 md:w-8rem mr-5" />
                                <div class="flex-1 text-center md:text-left">
                                    <div class="font-normal text-2xl text-yellow-500">{{ slotProps.data.title }}</div>
                                    <div class="mb-3 text-bluegray-200">{{ slotProps.data.desc }}</div>
                                    <div class="flex align-items-center">
                                        <i class="pi pi-clock text-blue-300 mr-2"></i>
                                        <span class="font-semibold text-blue-300">{{ slotProps.data.from }} - {{ slotProps.data.to }}</span>
                                    </div>
                                </div>
                                <div class="flex flex-row md:flex-column justify-content-between w-full md:w-auto align-items-center md:align-items-end mt-5 md:mt-0">
                                    <Button :icon="slotProps.data.ket == true ? 'pi pi-check-circle': 'pi pi-external-link'" class="mb-2" :severity="slotProps.data.ket == true ? 'success': 'primary'" v-tooltip.left="'Go to form'" outlined size="small" rounded @click="previewQuestion(slotProps.data.id)" :disabled="slotProps.data.ket == true ? true : false"></Button>
                                </div>
                            </div>
                        </div>
                    </template>
                </DataView>
                <div class="text-center mb-5 mt-2" v-else>
                    <span class="text-lg">{{ loadings == true ? '' : 'Data not found' }} </span>
                </div>
                <div class="flex align-items-center justify-content-center mb-3" v-if="loadings == true">
                    <div class="">
                        <ProgressSpinner aria-label="Loading" style="width: 50px; height: 50px" />
                    </div>
                    <div class="text-gray-500 font-semibold">Please wait ...</div>
                </div>
            </div>
        </div>
    </div>
    <!-- <h1 class="text-center">Survey</h1> -->
</template>