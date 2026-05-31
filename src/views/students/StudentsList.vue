<template>
  <div class="page">
    <div class="page-card">
      <div class="toolbar">
        <div class="toolbar__left">
          <el-input
            v-model="keyword"
            class="toolbar__search"
            placeholder="搜索学号 / 姓名 / 班级"
            clearable
            @keyup.enter="onSearch"
          />
          <el-button type="primary" @click="onSearch">查询</el-button>
        </div>
        <el-button type="primary" @click="openCreate">+ 新增学生</el-button>
      </div>

      <div v-if="loading && list.length === 0" class="skeleton-table">
        <div v-for="n in 5" :key="n" class="skeleton-row">
          <el-skeleton animated>
            <template #template>
              <div class="sk-row">
                <div class="sk-col" style="width:140px"><el-skeleton-item variant="text" /></div>
                <div class="sk-col" style="width:120px"><el-skeleton-item variant="text" /></div>
                <div class="sk-col" style="flex:1"><el-skeleton-item variant="text" /></div>
                <div class="sk-col" style="width:180px"><el-skeleton-item variant="text" /></div>
                <div class="sk-col" style="width:160px"><el-skeleton-item variant="text" /></div>
              </div>
            </template>
          </el-skeleton>
        </div>
      </div>

      <div v-else-if="list.length === 0 && !loading" class="empty-state">
        <div class="empty-state__icon">📭</div>
        <div class="empty-state__text">暂无学生数据</div>
        <el-button type="primary" size="small" @click="openCreate">添加第一位学生</el-button>
      </div>

      <el-table v-else class="table" :data="list" v-loading="loading" stripe>
        <el-table-column prop="studentNo" label="学号" width="140" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="className" label="班级" min-width="140" />
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="140" fixed="right" align="center">
          <template #default="{ row }">
            <el-button class="action-btn" size="small" text @click="openEdit(row)">编辑</el-button>
            <el-button class="action-btn--danger" size="small" text @click="onDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

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
    </div>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogMode === 'create' ? '新增学生' : '编辑学生'"
      width="460px"
      destroy-on-close
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="学号" prop="studentNo">
          <el-input v-model="form.studentNo" placeholder="如 20250001" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="班级" prop="className">
          <el-input v-model="form.className" placeholder="如 计科1班" />
        </el-form-item>
        <el-form-item label="创建时间">
          <el-input v-model="form.createdAt" disabled placeholder="系统自动生成" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="onSave">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
/* script 部分不变 */
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getStudents, createStudent, updateStudent, deleteStudent } from '../../api/students'

const loading = ref(false)
const saving = ref(false)

const keyword = ref('')
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const list = ref([])

async function fetchList() {
  loading.value = true
  try {
    const res = await getStudents({
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

const dialogVisible = ref(false)
const dialogMode = ref('create')
const editingId = ref(null)

const formRef = ref()
const form = reactive({
  studentNo: '',
  name: '',
  className: '',
  createdAt: ''
})

const rules = {
  studentNo: [{ required: true, message: '请输入学号', trigger: 'blur' }],
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  className: [{ required: true, message: '请输入班级', trigger: 'blur' }]
}

function resetForm() {
  form.studentNo = ''
  form.name = ''
  form.className = ''
  form.createdAt = ''
}

function openCreate() {
  dialogMode.value = 'create'
  editingId.value = null
  resetForm()
  dialogVisible.value = true
}

function openEdit(row) {
  dialogMode.value = 'edit'
  editingId.value = row.id
  form.studentNo = row.studentNo
  form.name = row.name
  form.className = row.className
  form.createdAt = row.createdAt
  dialogVisible.value = true
}

async function onSave() {
  await formRef.value.validate()
  saving.value = true
  try {
    if (dialogMode.value === 'create') {
      await createStudent({
        studentNo: form.studentNo,
        name: form.name,
        className: form.className
      })
      ElMessage.success('新增成功')
    } else {
      await updateStudent(editingId.value, {
        studentNo: form.studentNo,
        name: form.name,
        className: form.className
      })
      ElMessage.success('保存成功')
    }
    dialogVisible.value = false
    fetchList()
  } finally {
    saving.value = false
  }
}

async function onDelete(row) {
  await ElMessageBox.confirm(`确认删除学生：${row.name}（${row.studentNo}）？`, '提示', {
    type: 'warning',
    confirmButtonText: '删除',
    cancelButtonText: '取消'
  })

  await deleteStudent(row.id)
  ElMessage.success('删除成功')

  const maxPage = Math.max(1, Math.ceil((total.value - 1) / pageSize.value))
  page.value = Math.min(page.value, maxPage)
  fetchList()
}

onMounted(() => {
  fetchList()
})
</script>

<style scoped>
.page { width: 100%; }

.toolbar {
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px; margin-bottom: 18px; flex-wrap: wrap;
}
.toolbar__left {
  display: flex; align-items: center; gap: 10px;
}
.toolbar__search { width: 260px; }

.table {
  width: 100%;
  --el-table-border-color: #eef0f5;
  --el-table-header-bg-color: #fafbfc;
  --el-table-row-hover-bg-color: #f7f5ff;
  --el-table-current-row-bg-color: #f7f5ff;
}

:deep(.el-table th.el-table__cell) {
  background: #fafbfc;
  color: #656d76;
  font-weight: 600;
  font-size: 13px;
  padding: 12px 0;
  border-bottom: 2px solid #eef0f5;
}

:deep(.el-table td.el-table__cell) {
  padding: 11px 0;
  font-size: 13px;
  color: #1f2328;
  border-bottom: 1px solid #f5f5f5;
}

:deep(.el-table__body tr:hover > td) {
  background: #f7f5ff;
}

:deep(.el-table .el-table__row--striped td.el-table__cell) {
  background: #fcfcfd;
}

.action-btn {
  color: #667eea !important;
  padding: 2px 8px;
  font-size: 12px;
  border-radius: 4px;
}
.action-btn:hover {
  background: #eeefff !important;
  color: #667eea !important;
}
.action-btn--danger {
  color: #cf222e !important;
  padding: 2px 8px;
  font-size: 12px;
  border-radius: 4px;
}
.action-btn--danger:hover {
  background: #ffebe9 !important;
  color: #cf222e !important;
}

.empty-state {
  text-align: center;
  padding: 48px 20px;
  color: #8b949e;
}
.empty-state__icon {
  font-size: 40px;
  margin-bottom: 10px;
}
.empty-state__text {
  font-size: 14px;
  margin-bottom: 14px;
}

.skeleton-table {
  border: 1px solid #eef0f5;
  border-radius: 8px;
  overflow: hidden;
}
.skeleton-row {
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
  background: #fff;
}
.skeleton-row:last-child { border-bottom: none; }
.sk-row { display: flex; gap: 0; padding: 0 12px; }
.sk-col { padding: 0 8px; }

.pager {
  display: flex; justify-content: flex-end;
  margin-top: 18px; padding-top: 12px;
  border-top: 1px solid #f5f5f5;
}

:deep(.el-dialog) {
  border-radius: 10px;
  --el-dialog-box-shadow: 0 8px 30px rgba(0,0,0,.12);
}

@media (max-width: 768px) {
  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }
  .toolbar__left {
    flex-direction: column;
    align-items: stretch;
  }
  .toolbar__search {
    width: 100%;
  }
  :deep(.el-table) {
    font-size: 12px;
  }
}
</style>