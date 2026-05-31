<template>
  <div class="page">
    <el-card>
      <div class="toolbar">
        <el-input
          v-model="keyword"
          class="toolbar__search"
          placeholder="按测试标题/课程名称搜索"
          clearable
          @keyup.enter="onSearch"
        />
        <el-button type="primary" @click="$router.push('/tests/create')">创建测试</el-button>
        <el-button @click="onSearch">查询</el-button>
      </div>

      <el-table :data="list" v-loading="loading" border class="table">
        <el-table-column prop="title" label="测试标题" min-width="220" />
        <el-table-column prop="courseName" label="关联课程" width="180" />
        <el-table-column label="题目数" width="80">
          <template #default="{ row }">{{ row.questions?.length || 0 }}</template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="160" />
        <el-table-column label="操作" width="180" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="$router.push(`/tests/${row.id}`)">进入批改</el-button>
            <el-button size="small" text type="danger" @click="onDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-empty v-if="!loading && list.length === 0" description="暂无测试" />

      <div class="pager">
        <el-pagination
          background
          layout="total, prev, pager, next, sizes"
          :total="total"
          :current-page="page"
          :page-size="pageSize"
          :page-sizes="[5, 10, 20, 50]"
          @current-change="onPageChange"
          @size-change="onSizeChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getTests, deleteTest } from '../../api/tests'

const loading = ref(false)
const keyword = ref('')
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const list = ref([])

async function fetchList() {
  loading.value = true
  try {
    const res = await getTests({
      page: page.value,
      pageSize: pageSize.value,
      keyword: keyword.value
    })
    list.value = res.list
    total.value = res.total
  } finally {
    loading.value = false
  }
}

function onSearch() {
  page.value = 1
  fetchList()
}

function onPageChange(p) {
  page.value = p
  fetchList()
}

function onSizeChange(ps) {
  pageSize.value = ps
  page.value = 1
  fetchList()
}

async function onDelete(row) {
  await ElMessageBox.confirm(`确认删除测试「${row.title}」？`, '删除确认', {
    type: 'warning',
    confirmButtonText: '删除',
    cancelButtonText: '取消'
  })
  await deleteTest(row.id)
  ElMessage.success('已删除')
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
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
}

.toolbar__search {
  width: 260px;
}

.table {
  width: 100%;
}

.pager {
  display: flex;
  justify-content: flex-end;
  margin-top: 12px;
}
</style>