<template>
  <div class="page">
    <div class="page-card">
      <div class="toolbar">
        <div class="toolbar__left">
          <el-select
            v-model="filterCourse"
            placeholder="按课程筛选"
            clearable
            class="toolbar__select"
            @change="onFilter"
          >
            <el-option v-for="c in courses" :key="c" :label="c" :value="c" />
          </el-select>
          <el-date-picker
            v-model="filterDate"
            type="date"
            placeholder="按日期筛选"
            clearable
            value-format="YYYY-MM-DD"
            class="toolbar__date"
            @change="onFilter"
          />
          <el-button @click="showStats = !showStats">
            {{ showStats ? '隐藏统计' : '查看统计' }}
          </el-button>
        </div>
        <el-button type="primary" @click="dialogVisible = true">创建签到</el-button>
      </div>

      <div v-if="showStats" class="stats">
        <div class="stats__title">考勤统计</div>
        <div class="stats__grid">
          <div class="stats__item">
            <div class="stats__item-label">总人次</div>
            <div class="stats__item-val stats__item-val--total">{{ stats.total }}</div>
          </div>
          <div class="stats__item">
            <div class="stats__item-label">正常</div>
            <div class="stats__item-val stats__item-val--normal">{{ stats.normal }}</div>
          </div>
          <div class="stats__item">
            <div class="stats__item-label">迟到</div>
            <div class="stats__item-val stats__item-val--late">{{ stats.late }}</div>
          </div>
          <div class="stats__item">
            <div class="stats__item-label">缺勤</div>
            <div class="stats__item-val stats__item-val--absent">{{ stats.absent }}</div>
          </div>
        </div>
      </div>

      <el-table class="table" :data="list" v-loading="loading" stripe>
        <el-table-column prop="studentName" label="学生姓名" width="120" />
        <el-table-column prop="courseName" label="课程" min-width="160" />
        <el-table-column prop="time" label="考勤时间" width="180" />
        <el-table-column label="考勤状态" width="110" align="center">
          <template #default="{ row }">
            <span
              class="status-tag"
              :class="{
                'status-tag--normal': row.status === '正常',
                'status-tag--late': row.status === '迟到',
                'status-tag--absent': row.status === '缺勤',
              }"
            >
              {{ row.status }}
            </span>
          </template>
        </el-table-column>
      </el-table>

      <div v-if="!loading && list.length === 0" class="empty-state">
        <div class="empty-state__icon">📋</div>
        <div class="empty-state__text">暂无考勤记录</div>
      </div>

      <div class="pagination">
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
      title="创建签到"
      width="460px"
      destroy-on-close
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="课程" prop="courseName">
          <el-select v-model="form.courseName" placeholder="请选择课程" class="select">
            <el-option v-for="c in courses" :key="c" :label="c" :value="c" />
          </el-select>
        </el-form-item>
        <el-form-item label="考勤时间" prop="attendanceTime">
          <el-date-picker
            v-model="form.attendanceTime"
            type="datetime"
            placeholder="请选择考勤时间"
            value-format="YYYY-MM-DDTHH:mm"
            class="select"
          />
        </el-form-item>
        <el-form-item label="有效期" prop="duration">
          <el-select v-model="form.duration" placeholder="请选择有效期" class="select">
            <el-option label="30 秒" :value="30" />
            <el-option label="1 分钟" :value="60" />
            <el-option label="2 分钟" :value="120" />
            <el-option label="3 分钟" :value="180" />
            <el-option label="5 分钟" :value="300" />
          </el-select>
        </el-form-item>
      </el-form>

      <div v-if="session" class="session-result">
        <div class="session-result__title">签到码已生成</div>
        <div class="session-result__code">{{ session.code }}</div>
        <div class="session-result__expires">
          有效期至：{{ session.expires }}（{{ session.durationSec }} 秒）
        </div>
      </div>

      <template #footer>
        <el-button @click="dialogVisible = false">关闭</el-button>
        <el-button type="primary" :loading="saving" @click="onCreateSession">生成签到码</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getAttendances, getAttendanceStats, createAttendanceSession } from '../../api/attendances'
import { getCourses } from '../../api/courses'

const loading = ref(false)
const saving = ref(false)
const showStats = ref(false)

const filterCourse = ref('')
const filterDate = ref('')
const list = ref([])
const courses = ref([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const stats = reactive({ total: 0, normal: 0, late: 0, absent: 0 })

const dialogVisible = ref(false)
const session = ref(null)

const formRef = ref()
const form = reactive({ courseName: '' , attendanceTime: '',duration: null})
const rules = {
  courseName: [{ required: true, message: '请选择课程', trigger: 'change' }],
  attendanceTime: [{ required: true, message: '请选择考勤时间', trigger: 'change' }],
  duration: [{ required: true, message: '请选择有效期', trigger: 'change' }]
}

const filterParams = computed(() => ({
  course: filterCourse.value,
  date: filterDate.value
}))

async function fetchList() {
  loading.value = true
  try {
    const res = await getAttendances({
      ...filterParams.value,
      page: page.value,
      pageSize: pageSize.value
    })
    list.value = res.list
    total.value = res.total
  } finally {
    loading.value = false
  }
}

async function fetchStats() {
  const res = await getAttendanceStats(filterParams.value)
  Object.assign(stats, res)
}

function onFilter() {
  page.value = 1
  fetchList()
  if (showStats.value) fetchStats()
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

async function fetchCourses() {
  const res = await getCourses()
  courses.value = [...new Set((res.list || []).map((c) => {
    return `${c.name}（${c.className}）`
  }))]
}

async function onCreateSession() {
  await formRef.value.validate()
  saving.value = true
  try {
    const res = await createAttendanceSession({
      courseName: form.courseName ,
      attendanceTime: form.attendanceTime,
      duration: form.duration
    })
    session.value = res
    ElMessage.success('签到码已生成')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchList()
  fetchStats()
  fetchCourses()
})
</script>

<style scoped>
.page { width: 100%; }

.toolbar {
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px; margin-bottom: 18px; flex-wrap: wrap;
}
.toolbar__left {
  display: flex; align-items: center; gap: 10px; flex-wrap: wrap;
}
.toolbar__select { width: 200px; }
.toolbar__date { width: 170px; }

.stats {
  margin-bottom: 18px; padding: 18px 20px;
  background: #fafbfc; border: 1px solid #eef0f5; border-radius: 10px;
}
.stats__title {
  font-size: 13px; font-weight: 600; color: #656d76; margin-bottom: 14px;
  letter-spacing: .3px;
}
.stats__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.stats__item {
  text-align: center;
  padding: 12px 8px;
  background: #fff;
  border-radius: 8px;
  border: 1px solid #eef0f5;
}
.stats__item-label {
  font-size: 12px; color: #8b949e; margin-bottom: 6px;
}
.stats__item-val {
  font-size: 24px; font-weight: 700;
}
.stats__item-val--total  { color: #667eea; }
.stats__item-val--normal { color: #1a7f37; }
.stats__item-val--late   { color: #9a6700; }
.stats__item-val--absent  { color: #cf222e; }

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

.status-tag {
  display: inline-block;
  padding: 3px 12px;
  font-size: 12px; font-weight: 500;
  border-radius: 12px;
}
.status-tag--normal { background: #dafbe1; color: #1a7f37; }
.status-tag--late   { background: #fff8c5; color: #9a6700; }
.status-tag--absent { background: #ffebe9; color: #cf222e; }

.pagination {
  display: flex; justify-content: flex-end;
  margin-top: 16px;
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
}

.select { width: 100%; }

.session-result {
  margin-top: 20px;
  padding: 24px 20px;
  text-align: center;
  background: linear-gradient(135deg, #eeefff 0%, #f5f3ff 100%);
  border-radius: 10px;
  border: 1px solid #e0ddff;
}
.session-result__title {
  font-size: 13px;
  color: #656d76;
  margin-bottom: 10px;
}
.session-result__code {
  font-size: 38px;
  font-weight: 800;
  letter-spacing: 8px;
  color: #667eea;
  font-family: 'Courier New', Consolas, monospace;
  user-select: all;
}
.session-result__expires {
  font-size: 12px;
  color: #8b949e;
  margin-top: 10px;
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
  .toolbar__select,
  .toolbar__date {
    width: 100%;
  }
  .stats__grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
  .stats__item-val {
    font-size: 20px;
  }
  :deep(.el-table) {
    font-size: 12px;
  }
}
</style>