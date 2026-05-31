<template>
  <div class="page">
    <el-card>
      <div class="toolbar">
        <el-button type="primary" @click="$router.push('/homeworks/create')">发布作业</el-button>
      </div>

      <el-tabs v-model="activeTab" class="tabs" @tab-change="onTabChange">
        <el-tab-pane label="全部" name="all" />
        <el-tab-pane label="未截止" name="pending" />
        <el-tab-pane label="已截止" name="completed" />
      </el-tabs>

      <el-table :data="list" v-loading="loading" border class="table">
        <el-table-column prop="title" label="作业标题" min-width="180" />
        <el-table-column prop="courseName" label="关联课程" width="180" />
        <el-table-column prop="deadline" label="截止时间" width="160" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'pending' ? 'warning' : 'info'">
              {{ row.status === 'pending' ? '未截止' : '已截止' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="requirement" label="作业要求" min-width="260" show-overflow-tooltip />
      </el-table>

      <el-empty v-if="!loading && list.length === 0" description="暂无作业" />
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getHomeworks } from '../../api/homeworks'

const loading = ref(false)
const activeTab = ref('all')
const list = ref([])

async function fetchList() {
  loading.value = true
  try {
    const params = {}
    if (activeTab.value !== 'all') params.status = activeTab.value
    const res = await getHomeworks(params)
    list.value = res.list
  } finally {
    loading.value = false
  }
}

function onTabChange() {
  fetchList()
}

onMounted(() => {
  fetchList()
})
</script>

<style scoped>
.page {
  width: 100%;
}
.toolbar {
  margin-bottom: 12px;
}
.tabs {
  margin-bottom: 8px;
}
.table {
  width: 100%;
}
</style>