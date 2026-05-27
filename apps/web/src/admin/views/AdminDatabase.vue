<template>
  <div class="database">
    <h2 class="database__title">数据库管理</h2>

    <div class="database__tables">
      <button
        v-for="t in tables"
        :key="t.name"
        class="table-card"
        :class="{ 'table-card--active': activeTable === t.name }"
        @click="loadTable(t.name)"
      >
        <span class="table-card__name">{{ t.name }}</span>
        <span class="table-card__count">{{ t.count }} 行</span>
        <span class="table-card__cols">{{ t.columns.length }} 列</span>
      </button>
    </div>

    <div v-if="activeTable" class="database__detail">
      <h3 class="database__subtitle">
        {{ activeTable }}
        <span class="database__row-count">（{{ tableRows.length }} 行）</span>
      </h3>

      <div class="database__schema">
        <span
          v-for="col in tableColumns"
          :key="col"
          class="schema-col"
        >{{ col }}</span>
      </div>

      <div class="database__table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th v-for="col in tableColumns" :key="col">{{ col }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, ri) in tableRows" :key="ri">
              <td v-for="col in tableColumns" :key="col">{{ formatCell(row[col]) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="tables.length === 0" class="database__empty">
      无法连接到数据库
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getDbInfo, getDbTable } from '@/services/api/admin.js';

const tables = ref([]);
const activeTable = ref('');
const tableColumns = ref([]);
const tableRows = ref([]);

function loadTables() {
  getDbInfo((res) => {
    tables.value = res.data?.tables || [];
  }, () => {});
}

function loadTable(name) {
  activeTable.value = name;
  getDbTable(name, (res) => {
    tableColumns.value = res.data?.columns || [];
    tableRows.value = res.data?.rows || [];
  }, () => {});
}

function formatCell(val) {
  if (val === null) return 'NULL';
  if (typeof val === 'object') return JSON.stringify(val);
  return String(val);
}

onMounted(loadTables);
</script>

<style scoped>
.database__title {
  font-family: var(--font-ink);
  font-size: 24px;
  font-weight: 600;
  color: #3a2f28;
  margin: 0 0 24px;
  letter-spacing: 0.06em;
}

.database__tables {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 28px;
}

.table-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  background: rgba(245, 240, 232, 0.6);
  border: 1px solid rgba(58, 47, 40, 0.1);
  border-radius: 6px;
  cursor: pointer;
  font-family: var(--font-ink);
  transition: border-color 0.2s, background 0.2s;
}

.table-card:hover {
  border-color: rgba(196, 30, 30, 0.15);
}

.table-card--active {
  border-color: #C41E1E;
  background: rgba(196, 30, 30, 0.04);
}

.table-card__name {
  font-size: 14px;
  font-weight: 500;
  color: #3a2f28;
  min-width: 80px;
}

.table-card__count {
  font-size: 12px;
  color: rgba(58, 47, 40, 0.45);
  padding: 1px 6px;
  background: rgba(58, 47, 40, 0.05);
  border-radius: 3px;
}

.table-card__cols {
  font-size: 12px;
  color: rgba(58, 47, 40, 0.35);
}

.database__subtitle {
  font-family: var(--font-ink);
  font-size: 17px;
  font-weight: 600;
  color: #3a2f28;
  margin: 0 0 14px;
  letter-spacing: 0.05em;
}

.database__row-count {
  font-weight: 400;
  font-size: 13px;
  color: rgba(58, 47, 40, 0.4);
}

.database__schema {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 14px;
}

.schema-col {
  font-family: var(--font-ink);
  font-size: 12px;
  padding: 3px 8px;
  background: rgba(58, 47, 40, 0.04);
  border: 1px solid rgba(58, 47, 40, 0.08);
  border-radius: 4px;
  color: rgba(58, 47, 40, 0.5);
}

.database__table-wrap {
  overflow-x: auto;
  border: 1px solid rgba(58, 47, 40, 0.08);
  border-radius: 6px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-ink);
  font-size: 13px;
}

.data-table th {
  text-align: left;
  padding: 10px 12px;
  background: rgba(58, 47, 40, 0.04);
  color: rgba(58, 47, 40, 0.5);
  font-weight: 500;
  font-size: 12px;
  white-space: nowrap;
  border-bottom: 2px solid rgba(58, 47, 40, 0.08);
}

.data-table td {
  padding: 8px 12px;
  color: #3a2f28;
  border-bottom: 1px solid rgba(58, 47, 40, 0.04);
  max-width: 280px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.data-table tr:hover td {
  background: rgba(245, 240, 232, 0.4);
}

.database__empty {
  font-family: var(--font-ink);
  color: rgba(58, 47, 40, 0.4);
  font-size: 15px;
  text-align: center;
  padding: 60px 0;
}
</style>
