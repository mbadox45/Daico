<script setup>
    // Vue Component
    import { ref, onMounted, defineProps, defineEmits } from 'vue';
    import { useToast } from "primevue/usetoast";
    import moment from 'moment';
    import { useRouter, useRoute } from 'vue-router';

    // API
    import {list_product_type} from '@/api/DummyData.js';
    import {addAvgPrice, updateAvgPrice, forViewAvgPrice} from '@/views/load_data/avg_price.js';
    import {RekeningUnitKerja, addRekeningKerja, updateRekeningKerja} from '@/views/load_data/cash/rekening.js'
    import {loadAllKursJisdor} from '@/views/load_data/load_from_odoo.js'

    const route = useRoute();
    const router = useRouter();
    const toast = useToast();

    const product_type = ref(list_product_type)
    const loadingTable = ref(false)
    const time = ref(3000)
    const tgl = ref(moment().format('YYYY-MM-DD'))
    const forms = ref([
        {id: null, rekening_id: null, status: null, jenis_id: null, nama: null, nomor: null, keterangan: null, matauang: null, jenis: null, value: null, latest_date: null, tipe_id: null}
    ])

    onMounted(() => {
        updateData();
    })

    // const loadData = async() => {
    //     await updateData()
    // }

    const updateData = async () => {
        loadingTable.value = true
        try {
            // tgl.value = moment(waktu).format('YYYY-MM-DD');
            // const waktu = route.query.tgl
            const response = await RekeningUnitKerja()
            const jisdor = await loadAllKursJisdor()
            const filter = jisdor.filter(item => moment(item.name).format('YYYY-MM') == moment(tgl).format('YYYY-MM'))
            filter.sort((a, b) => b.id - a.id);
            const nilai_tukar = Number(filter[0].rate)
            const rekening = response.list_rekening
            const list = []
            for (let i = 0; i < rekening.length; i++) {
                let status = 'add'
                if (tgl.value == rekening[i].latest_date) {
                    status = 'update'
                }
                list.push({
                    id: rekening[i].id,
                    rekening_id: rekening[i].rekening_id,
                    jenis_id: rekening[i].jenis_id,
                    nama: rekening[i].nama,
                    nomor: rekening[i].nomor,
                    keterangan: rekening[i].keterangan,
                    matauang: rekening[i].matauang,
                    jenis: rekening[i].jenis,
                    value: rekening[i].value == null ? null : rekening[i].matauang == 'USD' ? Number(rekening[i].value) / nilai_tukar : Number(rekening[i].value),
                    latest_date: rekening[i].latest_date,
                    tipe_id: rekening[i].tipe_id,
                    status: status,
                })
            }
            console.log(list)
            forms.value = list;
            loadingTable.value = false
        } catch (error) {
            loadingTable.value = false
            forms.value = [
                {id: null, rekening_id: null, status: null, jenis_id: null, nama: null, nomor: null, keterangan: null, matauang: null, jenis: null, value: null, latest_date: null, tipe_id: null},
            ]
        }
    }

    const postData = async() => {
        loadingTable.value = true
        try {
            let total = 0
            const form = forms.value
            for (let i = 0; i < form.length; i++) {
                if (form[i].value != null) {
                    total += 1
                }
            }
            if (total >= form.length) {
                let berhasil = 0 , gagal = 0;
                for (let i = 0; i < form.length; i++) {
                    const list = {
                        id: form[i].id,
                        tanggal: tgl.value,
                        rekening_id: form[i].rekening_id,
                        value: form[i].value,
                    }
                    let response;
                    if (form[i].status == 'update') {
                        // console.log('update')
                        response = await updateRekeningKerja(form[i].id, list);
                    } else {
                        // console.log('add')
                        response = await addRekeningKerja(list);
                    }
                    if (response.success == true) {
                        berhasil += 1
                    } else {
                        gagal += 1
                    }
                    // console.log(response)
                }
                if (berhasil >= form.length && gagal == 0) {
                    toast.add({ severity: 'success', summary: 'Sukses', detail: 'Data berhasil di simpan', life: 3000 });
                } else {
                    toast.add({ severity: 'error', summary: 'Proses Input Error', detail: 'Data sudah ada', life: 3000 });
                }
                updateData();
                loadingTable.value = false
            } else {
                toast.add({ severity: 'warn', summary: 'Perhatian', detail: 'Harap data diisi dengan lengkap.', life: 3000 });
                loadingTable.value = false
            }
        } catch (error) {
            loadingTable.value = false
            toast.add({ severity: 'error', summary: 'Proses Input Error', detail: error.response.data.message, life: 3000 });
        }
    }

</script>
<template>
    <Toast />
    <div class="card shadow-3 flex flex-column gap-3">
        <div class="flex justify-content-between align-items-center gap-2">
            <span class="font-medium text-xl uppercase">Form Input Nilai Cash</span>
            <div class="flex gap-2">
                <Button label="Back" icon="pi pi-times" size="small" class="px-3 py-2" severity="danger" outlined @click="()=>{router.push('/cash')}"/>
                <Button label="Save" icon="pi pi-save" size="small" class="px-3 py-2" severity="success" @click="postData"/>
            </div>
        </div>
        <div v-if="loadingTable == true" class="flex flex-column-reverse justify-content-center align-items-center gap-3">
            <div>
                <span class="text-xl font-normal">Loading...</span>
            </div>
            <div>
                <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" animationDuration="1s" aria-label="Custom ProgressSpinner" />
            </div>
        </div>
        <form v-else class="flex flex-column gap-2">
            <div class="flex justify-content-end gap-1">
                <small class="font-medium">Note :</small>
                <small class="text-red-500">Apabila tidak ada nilai, bisa masukan nilai <span class="font-bold">0</span></small>
            </div>
            <div class="flex flex-column gap-3">
                <div class="flex flex-column gap-1">
                    <label for="bulan" class="font-medium text-sm text-gray-500">TANGGAL</label>
                    <InputText id="bulan" v-model="tgl" type="date" class="w-full" autocomplete="off" disabled/>
                </div>
                <Divider/>
                <div class="flex justify-content-between gap-5 align-items-center border-1 p-2 border-round border-gray-300" v-for="(item, index) in forms" :key="index">
                    <div class="flex flex-column gap-1 w-full">
                        <label for="rbdpo" class="font-medium text-lg text-blue-600">{{item.nama}} <small class="text-red-600">({{item.matauang}})</small></label>
                        <label for="rbdpo" class="font-medium text-xs">No. Rekening : <span class="text-gray-500">{{item.nomor}}</span></label>
                        <label for="rbdpo" class="font-medium text-xs font-italic text-yellow-500">{{item.keterangan}}</label>
                        <label for="rbdpo" class="font-medium text-xs font-italic text-gray-500">{{item.jenis}}</label>
                    </div>
                    <div class="flex flex-column gap-1 w-full">
                        <label for="rp_rbdpo" class="font-medium text-sm text-gray-500">VALUE <span class="font-bold text-red-500">*</span></label>
                        <InputNumber id="rp_rbdpo" v-model="item.value" class="w-full" :maxFractionDigits="5" inputId="locale-german" locale="de-DE" />
                    </div>
                </div>
            </div>
        </form>
    </div>
</template>