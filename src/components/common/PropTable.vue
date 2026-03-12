<template>
  <div class="prop-table-container">
    <h2 class="demo-title">Props</h2>

    <div class="table-wrapper">
      <DataTable :value="data" class="props-table">
        <Column field="name" header="Property">
          <template #body="{ data }">
            <div class="code-cell">{{ data.name }}</div>
          </template>
        </Column>

        <Column field="type" header="Type">
          <template #body="{ data }">
            <span class="type-text">{{ data.type }}</span>
          </template>
        </Column>

        <Column field="default" header="Default">
          <template #body="{ data }">
            <div class="code-cell">{{ data.default || '—' }}</div>
          </template>
        </Column>

        <Column field="description" header="Description">
          <template #body="{ data }">
            <div class="description-text">{{ data.description }}</div>
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup lang="ts">
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

interface PropData {
  name: string;
  type: string;
  default: string;
  description: string;
}

defineProps<{
  data: PropData[];
}>();
</script>

<style scoped>
.prop-table-container {
  margin-top: 3rem;
}

.table-wrapper {
  overflow-x: auto;
  margin-top: 1.5rem;
}

.code-cell {
  font-family: monospace;
  padding: 0.25rem 0.5rem;
  border-radius: 5px;
  width: fit-content;
  font-weight: 500;
  color: #e9e9e9;
  background-color: #222;
  font-size: 14px;
}

.type-text {
  font-family: monospace;
  font-weight: 500;
  font-size: 14px;
  color: #fff;
  white-space: nowrap;
}

.description-text {
  max-width: 300px;
  color: #fff;
  font-weight: 400;
  line-height: 1.5;
  font-size: 14px;
}

:deep(.p-datatable) {
  background: transparent;
  border: none;
}

:deep(.p-datatable-header) {
  background: #111;
  border: 1px solid #333;
  border-bottom: none;
}

:deep(.p-datatable-thead > tr > th) {
  background: #111;
  border-right: 1px solid #333;
  border-bottom: 1px solid #333;
  color: #fff;
  font-weight: 600;
  text-transform: capitalize;
  letter-spacing: -0.5px;
  padding: 1rem;
  font-size: 14px;
}

:deep(.p-datatable-thead > tr > th:last-child) {
  border-right: none;
}

:deep(.p-datatable-tbody > tr > td) {
  background: #0b0b0b;
  border-right: 1px solid #333;
  border-bottom: 1px solid #333;
  color: #fff;
  padding: 1rem;
  font-size: 14px;
}

:deep(.p-datatable-tbody > tr > td:last-child) {
  border-right: none;
}

:deep(.p-datatable-tbody > tr:last-child > td) {
  border-bottom: none;
}

:deep(.p-datatable-tbody > tr:hover) {
  background: #0b0b0b;
}
</style>
