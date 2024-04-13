<script setup>
    // Vue Component
    import { ref, computed, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { useToast } from 'primevue/usetoast';

    // API ========================================================================================================================================================
    import {database} from '@/api/DummyData.js'

    // VARIABLE
    const products = ref();
    const editingRows = ref([]);

    // Function ===================================================================================================================================================
    onMounted(() => {
        loadData()
    });

    const loadData = async() => {
        products.value = []
        for (let i = 0; i < database.length; i++) {
            products.value.push({id: database[i].id, code:database[i].code, name:database[i].name, status:database[i].status, price:database[i].price});
        }
    }

    const onRowEditSave = (event) => {
        let { newData, index } = event;

        products.value[index] = newData;
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    }

    const getStatusLabel = (status) => {
        switch (status) {
            case 'INSTOCK':
                return 'success';

            case 'LOWSTOCK':
                return 'warning';

            case 'OUTOFSTOCK':
                return 'danger';

            default:
                return null;
        }
    };

    const toggleRowEditing = (rowIndex) => {
        if (editingRows.value.includes(rowIndex)) {
            editingRows.value = editingRows.value.filter((row) => row !== rowIndex);
        } else {
            editingRows.value.push(rowIndex);
        }
    };

    const saveRowEdit = (rowIndex) => {
        // Emit an event or perform any necessary action to save the row edit
        editingRows.value = editingRows.value.filter((row) => row !== rowIndex);
    };

    const cancelRowEdit = (rowIndex) => {
        // Rollback changes or cancel editing mode
        editingRows.value = editingRows.value.filter((row) => row !== rowIndex);
    };
</script>

<template>
    <div class="card shadow-3">
        <DataTable v-model:editingRows="editingRows" :value="products" editMode="row" dataKey="id" @row-edit-save="onRowEditSave" >
            <Column field="code" header="Code" style="width: 20%">
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" />
                </template>
            </Column>
            <Column field="name" header="Name" style="width: 20%">
                <template #editor="{ data, field }">
                    <InputText v-model="data[field]" />
                </template>
            </Column>
            <Column field="inventoryStatus" header="Status" style="width: 20%">
                <template #editor="{ data, field }">
                    <Dropdown v-model="data[field]" :options="statuses" optionLabel="label" optionValue="value" placeholder="Select a Status">
                        <template #option="slotProps">
                            <Tag :value="slotProps.option.value" :severity="getStatusLabel(slotProps.option.value)" />
                        </template>
                    </Dropdown>
                </template>
                <template #body="slotProps">
                    <Tag :value="slotProps.data.inventoryStatus" :severity="getStatusLabel(slotProps.data.inventoryStatus)" />
                </template>
            </Column>
            <Column field="price" header="Price" style="width: 20%">
                <template #body="{ data, field }">
                    {{ formatCurrency(data[field]) }}
                </template>
                <template #editor="{ data, field }">
                    <InputNumber v-model="data[field]" mode="currency" currency="USD" locale="en-US" />
                </template>
            </Column>
            <Column style="width: 10%; min-width: 8rem" bodyStyle="text-align:center">
                <template #body="{ rowData, rowIndex }">
                    <Button
                        icon="pi pi-pencil"
                        text
                        :disabled="editingRows.length > 0 && !editingRows.includes(rowIndex)"
                        :class="`${!editingRows.includes(rowIndex) ? 'block' : 'hidden'}`"
                        @click="toggleRowEditing(rowIndex)"
                    />
                    <Button
                        icon="pi pi-check"
                        text
                        :disabled="!editingRows.includes(rowIndex)"
                        :class="`p-button-success ${!editingRows.includes(rowIndex) ? 'hidden' : 'block'}`"
                        @click="saveRowEdit(rowData)"
                    />
                    <Button
                        icon="pi pi-times"
                        text
                        :disabled="!editingRows.includes(rowIndex)"
                        :class="`p-button-danger ${!editingRows.includes(rowIndex) ? 'hidden' : 'block'}`"
                        @click="cancelRowEdit(rowData)"
                    />
                </template>
            </Column>
        </DataTable>
    </div>
</template>