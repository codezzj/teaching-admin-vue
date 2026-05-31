<template>
  <div class="page">
    <el-card>
      <div class="toolbar">
        <el-input
          v-model="keyword"
          class="toolbar__search"
          placeholder="按学期/课程名/教师/班级/加课码搜索"
          clearable
          @keyup.enter="onSearch"
        />
        <el-button type="primary" @click="openCreate">新增课程</el-button>
        <el-button :disabled="selectedIds.length === 0" type="danger" @click="onBatchDelete">
          批量删除（{{ selectedIds.length }}）
        </el-button>
        <el-button @click="onSearch">查询</el-button>
      </div>

      <!-- 卡片网格 -->
      <div class="course-grid">
        <div
          v-for="(item, idx) in list"
          :key="item.id"
          class="course-card"
          :class="`course-card--c${idx % 5}`"
          @click="goDetail(item)"
        >
          <!-- 选中框 -->
          <div class="course-card__check" @click.stop>
            <el-checkbox
              :model-value="selectedIds.includes(item.id)"
              @change="(val) => toggleSelect(item.id, val)"
            />
          </div>

          <!-- 课程名 + 学期标签 -->
          <div class="course-card__head">
            <div class="course-card__name">{{ item.name }}</div>
            <span class="course-card__term">{{ item.term }}</span>
          </div>

          <!-- 信息列表 -->
          <div class="course-card__body">
            <div class="course-card__row">
              <span class="course-card__label">👨‍🏫 教师</span>
              <span class="course-card__val">{{ item.teacher }}</span>
            </div>
            <div class="course-card__row">
              <span class="course-card__label">📖 班级</span>
              <span class="course-card__val">{{ item.className }}</span>
            </div>
            <div class="course-card__row course-card__row--code" @click.stop>
              <span class="course-card__label">🔑 加课码</span>
              <span class="course-card__val course-card__code" @click="openCodePop(item)">{{ item.joinCode }}</span>
            </div>
          </div>

          <!-- 底部操作 -->
          <div class="course-card__foot" @click.stop>
            <span class="course-card__count">共 32 人</span>
            <div class="course-card__btns">
              <el-button size="small" text @click="openEdit(item)">编辑</el-button>
              <el-button size="small" text type="danger" @click="onDelete(item)">删除</el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 加课码弹出卡片 -->
    <teleport to="body">
      <div v-if="codePopVisible" class="code-pop-overlay" @click="closeCodePop">
        <div class="code-pop-card" @click.stop>
          <div class="code-pop-title">课程加课码</div>
          <div class="code-pop-name">{{ codePopCourse?.name }}</div>
          <div class="code-pop-code">{{ codePopCourse?.joinCode }}</div>
          <div class="code-pop-actions">
            <el-button type="primary" size="small" @click="copyCode">复制加课码</el-button>
          </div>
          <div class="code-pop-tip">将加课码分享给学生即可加入课程</div>
        </div>
      </div>
    </teleport>

      <el-empty v-if="!loading && list.length === 0" description="暂无课程" />

      <div class="pagination">
        <el-pagination
          background
          layout="total, prev, pager, next, sizes"
          :total="total"
          :current-page="page"
          :page-size="pageSize"
          :page-sizes="[4, 8, 12, 20]"
          @current-change="onPageChange"
          @size-change="onSizeChange"
        />
      </div>

      <!-- 加载骨架屏 -->
      <div v-if="loading" class="skeleton-grid">
        <div v-for="n in pageSize" :key="n" class="skeleton-card">
          <el-skeleton animated>
            <template #template>
              <div style="padding:16px 16px 14px 26px">
                <div style="display:flex;justify-content:space-between;align-items:flex-start">
                  <el-skeleton-item variant="text" style="width:65%" />
                  <el-skeleton-item variant="text" style="width:50px;height:22px;border-radius:10px" />
                </div>
                <div style="margin-top:14px">
                  <el-skeleton-item variant="text" style="width:75%" />
                </div>
                <div style="margin-top:8px">
                  <el-skeleton-item variant="text" style="width:60%" />
                </div>
                <div style="margin-top:8px">
                  <el-skeleton-item variant="text" style="width:45%" />
                </div>
              </div>
              <div style="border-top:1px solid #f2f3f5;padding:14px 16px 14px 26px;display:flex;justify-content:flex-end">
                <el-skeleton-item variant="text" style="width:80px;height:28px" />
              </div>
            </template>
          </el-skeleton>
        </div>
      </div>
    </el-card>

    <!-- 弹窗不变 -->
    <el-dialog
      v-model="dialogVisible"
      :title="dialogMode === 'create' ? '新增课程' : '编辑课程'"
      width="520px"
      destroy-on-close
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="学期" prop="term">
          <el-input v-model="form.term" placeholder="如 2025-1" />
        </el-form-item>
        <el-form-item label="课程名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入课程名称" />
        </el-form-item>
        <el-form-item label="授课教师" prop="teacher">
          <el-input v-model="form.teacher" placeholder="请输入教师姓名" />
        </el-form-item>
        <el-form-item label="课程班" prop="className">
          <el-input v-model="form.className" placeholder="如 计科1班" />
        </el-form-item>
        <el-form-item label="加课码" prop="joinCode">
          <el-input v-model="form.joinCode" placeholder="如 ABC123" />
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
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  batchDeleteCourses
} from '../../api/courses'

const router = useRouter()
const loading = ref(false)
const saving = ref(false)
const keyword = ref('')
const list = ref([])
const page = ref(1)
const pageSize = ref(8)
const total = ref(0)
const selectedIds = ref([])

function toggleSelect(id, checked) {
  const set = new Set(selectedIds.value)
  if (checked) set.add(id)
  else set.delete(id)
  selectedIds.value = Array.from(set)
}

function clearSelect() {
  selectedIds.value = []
}

// ===== 加课码弹窗 =====
const codePopVisible = ref(false)
const codePopCourse = ref(null)

function openCodePop(item) {
  codePopCourse.value = item
  codePopVisible.value = true
}

function closeCodePop() {
  codePopVisible.value = false
}

function copyCode() {
  if (!codePopCourse.value) return
  navigator.clipboard.writeText(codePopCourse.value.joinCode).then(() => {
    ElMessage.success('加课码已复制到剪贴板')
    closeCodePop()
  }).catch(() => {
    // fallback
    const input = document.createElement('input')
    input.value = codePopCourse.value.joinCode
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    document.body.removeChild(input)
    ElMessage.success('加课码已复制')
    closeCodePop()
  })
}

async function fetchList() {
  loading.value = true
  try {
    const res = await getCourses({ keyword: keyword.value, page: page.value, pageSize: pageSize.value })
    list.value = res.list
    total.value = res.total
    const set = new Set(list.value.map((i) => i.id))
    selectedIds.value = selectedIds.value.filter((id) => set.has(id))
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

function goDetail(item) {
  router.push(`/courses/${item.id}`)
}

const dialogVisible = ref(false)
const dialogMode = ref('create')
const editingId = ref(null)

const formRef = ref()
const form = reactive({
  term: '',
  name: '',
  teacher: '',
  className: '',
  joinCode: ''
})

const rules = {
  term: [{ required: true, message: '请输入学期', trigger: 'blur' }],
  name: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
  teacher: [{ required: true, message: '请输入授课教师', trigger: 'blur' }],
  className: [{ required: true, message: '请输入课程班', trigger: 'blur' }],
  joinCode: [{ required: true, message: '请输入加课码', trigger: 'blur' }]
}

function resetForm() {
  form.term = ''
  form.name = ''
  form.teacher = ''
  form.className = ''
  form.joinCode = ''
}

function openCreate() {
  dialogMode.value = 'create'
  editingId.value = null
  resetForm()
  dialogVisible.value = true
}

function openEdit(item) {
  dialogMode.value = 'edit'
  editingId.value = item.id
  form.term = item.term
  form.name = item.name
  form.teacher = item.teacher
  form.className = item.className
  form.joinCode = item.joinCode
  dialogVisible.value = true
}

async function onSave() {
  await formRef.value.validate()
  saving.value = true
  try {
    if (dialogMode.value === 'create') {
      await createCourse({ ...form })
      ElMessage.success('新增成功')
    } else {
      await updateCourse(editingId.value, { ...form })
      ElMessage.success('保存成功')
    }
    dialogVisible.value = false
    fetchList()
  } finally {
    saving.value = false
  }
}

async function onDelete(item) {
  await ElMessageBox.confirm(`确认删除课程：${item.name}？`, '提示', {
    type: 'warning',
    confirmButtonText: '删除',
    cancelButtonText: '取消'
  })
  await deleteCourse(item.id)
  ElMessage.success('删除成功')
  fetchList()
}

async function onBatchDelete() {
  await ElMessageBox.confirm(`确认批量删除 ${selectedIds.value.length} 门课程？`, '提示', {
    type: 'warning',
    confirmButtonText: '删除',
    cancelButtonText: '取消'
  })
  await batchDeleteCourses(selectedIds.value)
  ElMessage.success('批量删除成功')
  clearSelect()
  fetchList()
}

onMounted(() => {
  fetchList()
})
</script>

<style scoped>
.page { width: 100%; }

.toolbar { display: flex; gap: 12px; align-items: center; margin-bottom: 16px; }
.toolbar__search { width: 320px; }

.course-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

@media (max-width: 1400px) { .course-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 1000px) { .course-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; } }
@media (max-width: 600px)  { .course-grid { grid-template-columns: 1fr; gap: 10px; } }

.course-card {
  position: relative;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: transform .2s ease, box-shadow .2s ease;
  box-shadow: 0 1px 4px rgba(0,0,0,.06);
  border: 1px solid #eef0f5;
  display: flex;
  flex-direction: column;
}

.course-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,.08);
}

.course-card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; bottom: 0;
  width: 4px;
  border-radius: 3px 0 0 3px;
}
.course-card--c0::before { background: #4A90D9; }
.course-card--c1::before { background: #67c23a; }
.course-card--c2::before { background: #e6a23c; }
.course-card--c3::before { background: #f56c6c; }
.course-card--c4::before { background: #7B6FE8; }

.course-card__check {
  position: absolute;
  top: 12px;
  left: 14px;
  z-index: 2;
}

.course-card__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  padding: 16px 16px 0 26px;
}

.course-card__name {
  font-size: 17px;
  font-weight: 600;
  color: #1d2129;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
  min-width: 0;
}

.course-card:hover .course-card__name {
  color: #4A90D9;
}

.course-card__term {
  flex-shrink: 0;
  font-size: 12px;
  color: #4A90D9;
  background: #ecf3fd;
  padding: 2px 10px;
  border-radius: 10px;
  white-space: nowrap;
  margin-top: 2px;
}

.course-card__body {
  padding: 14px 16px 0 26px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.course-card__row {
  display: flex;
  align-items: center;
  font-size: 13px;
  line-height: 1.5;
}

.course-card__label {
  color: #86909c;
  flex-shrink: 0;
  margin-right: 6px;
}

.course-card__val {
  color: #4e5969;
}

.course-card__code {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: #4A90D9;
  background: #f5f8ff;
  padding: 1px 8px;
  border-radius: 4px;
  letter-spacing: 1px;
}

.course-card__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px 14px 26px;
  border-top: 1px solid #f2f3f5;
  margin-top: 14px;
}

.course-card__count {
  font-size: 12px;
  color: #c9cdd4;
}

.course-card__btns {
  display: flex;
  gap: 4px;
}

.course-card__btns :deep(.el-button) {
  font-size: 12px;
  padding: 4px 10px;
}

.skeleton-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
@media (max-width: 1400px) { .skeleton-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 1000px) { .skeleton-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; } }
@media (max-width: 600px)  { .skeleton-grid { grid-template-columns: 1fr; gap: 10px; } }
.skeleton-card {
  background: #fff;
  border-radius: 12px;
  padding: 0 0 10px;
  box-shadow: 0 2px 8px rgba(0,0,0,.04);
  overflow: hidden;
}

.pagination {
  display: flex; justify-content: flex-end;
  margin-top: 20px;
}

.code-pop-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,.35);
  z-index: 3000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeIn .2s ease;
}

@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.code-pop-card {
  background: #fff;
  border-radius: 16px;
  padding: 32px 36px 24px;
  width: 340px;
  max-width: 90vw;
  text-align: center;
  box-shadow: 0 20px 50px rgba(0,0,0,.18);
  animation: popIn .25s ease;
}

@keyframes popIn {
  from { transform: scale(.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.code-pop-title {
  font-size: 14px;
  color: #86909c;
  margin-bottom: 8px;
}

.code-pop-name {
  font-size: 16px;
  font-weight: 600;
  color: #1d2129;
  margin-bottom: 18px;
}

.code-pop-code {
  font-size: 36px;
  font-weight: 800;
  letter-spacing: 6px;
  color: #4A90D9;
  background: #f5f8ff;
  padding: 14px 8px;
  border-radius: 12px;
  border: 2px dashed #c5d9f2;
  font-family: 'Courier New', Consolas, monospace;
  margin-bottom: 20px;
  user-select: all;
}

.code-pop-actions {
  margin-bottom: 14px;
}

.code-pop-tip {
  font-size: 12px;
  color: #c9cdd4;
}

.course-card__row--code {
  cursor: pointer;
}

.course-card__row--code .course-card__code:hover {
  background: #e8f0ff;
  color: #2b6fd4;
}

@media (max-width: 600px) {
  .course-card__cover { height: 90px; }
  .course-card__code { font-size: 14px; letter-spacing: 1px; }
  .code-pop-card { padding: 24px 20px 20px; }
  .code-pop-code { font-size: 28px; letter-spacing: 4px; }
}
</style>
