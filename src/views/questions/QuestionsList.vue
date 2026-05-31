<template>
  <div class="page">
    <!-- 顶部统计 + 操作 -->
    <div class="top-bar">
      <div class="top-bar__info">
        <span class="top-bar__count">共 <b>{{ list.length }}</b> 道题目</span>
      </div>
      <div class="top-bar__actions">
        <el-button type="primary" @click="openCreate">＋ 手动录入</el-button>
        <el-button type="success" @click="openAiDialog">🤖 AI 生成</el-button>
      </div>
    </div>

    <!-- 筛选区：课程 / 知识点 / 题型 / 难度 / 关键词 -->
    <div class="filters">
      <el-select v-model="filterCourse" placeholder="全部课程" clearable class="filter-item" @change="onSearch">
        <el-option v-for="c in courseNames" :key="c" :label="c" :value="c" />
      </el-select>

      <el-select v-model="filterTopic" placeholder="全部知识点" clearable class="filter-item" @change="onSearch">
        <el-option v-for="t in allTopics" :key="t" :label="t" :value="t" />
      </el-select>

      <el-radio-group v-model="filterType" class="filter-item filter-radio" size="small" @change="onSearch">
        <el-radio-button value="">全部题型</el-radio-button>
        <el-radio-button value="single">单选题</el-radio-button>
        <el-radio-button value="multiple">多选题</el-radio-button>
        <el-radio-button value="judge">判断题</el-radio-button>
        <el-radio-button value="short">简答题</el-radio-button>
      </el-radio-group>

      <el-select v-model="filterDifficulty" placeholder="全部难度" clearable class="filter-item" @change="onSearch">
        <el-option label="简单" value="简单" />
        <el-option label="中等" value="中等" />
        <el-option label="困难" value="困难" />
      </el-select>

      <el-input
          v-model="keyword"
          class="filter-search"
          placeholder="搜索题干关键词..."
          clearable
          @keyup.enter="onSearch"
          @clear="onSearch"
      >
        <template #prefix>
          <span style="color:#909399">🔍</span>
        </template>
      </el-input>
    </div>

    <!-- 题目卡片列表 -->
    <div v-loading="loading" class="card-list">
      <div
          v-for="(q, idx) in list"
          :key="q.id"
          class="q-card"
      >
        <div class="q-card__left">
          <span class="q-card__num">{{ idx + 1 }}</span>
        </div>

        <div class="q-card__body">
          <div class="q-card__header">
            <span class="q-card__tag" :class="`q-card__tag--${q.type}`">
              {{ typeLabel(q.type) }}
            </span>
            <span class="q-card__difficulty" :class="`q-card__difficulty--${q.difficulty}`">
              {{ q.difficulty }}
            </span>
            <span class="q-card__course">{{ q.courseName }}</span>
            <span v-if="q.topic" class="q-card__topic">#{{ q.topic }}</span>
          </div>

          <div class="q-card__content">{{ q.content }}</div>

          <div v-if="q.options?.length" class="q-card__options">
            <span
                v-for="(opt, oi) in q.options"
                :key="oi"
                class="q-card__opt"
                :class="{ 'q-card__opt--answer': isOptionAnswer(q, String.fromCharCode(65 + oi)) }"
            >
              {{ opt }}
            </span>
          </div>

          <div class="q-card__answer">
            <span class="q-card__label">答案：</span>
            <span class="q-card__answer-text">{{ q.answer }}</span>
          </div>
        </div>

        <div class="q-card__actions">
          <el-button size="small" text type="primary" @click="openEdit(q)">编辑</el-button>
          <el-button size="small" text type="danger" @click="onDelete(q)">删除</el-button>
        </div>
      </div>

      <el-empty v-if="!loading && list.length === 0" description="暂无题目" :image-size="80" />
    </div>

    <!-- 新增 / 编辑弹窗（保持不变） -->
    <el-dialog
        v-model="dialogVisible"
        :title="dialogMode === 'create' ? '录入题目' : '编辑题目'"
        width="640px"
        destroy-on-close
    >
      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px">
        <el-form-item label="课程" prop="courseName">
          <el-select v-model="form.courseName" placeholder="请选择课程" class="select">
            <el-option v-for="c in courseNames" :key="c" :label="c" :value="c" />
          </el-select>
        </el-form-item>
        <el-form-item label="知识点" prop="topic">
          <el-select v-model="form.topic" placeholder="请选择知识点" class="select">
            <el-option v-for="t in allTopics" :key="t" :label="t" :value="t" />
          </el-select>
        </el-form-item>
        <el-form-item label="题型" prop="type">
          <el-select v-model="form.type" placeholder="请选择题型" class="select" @change="onTypeChange">
            <el-option label="单选题" value="single" />
            <el-option label="多选题" value="multiple" />
            <el-option label="判断题" value="judge" />
            <el-option label="简答题" value="short" />
          </el-select>
        </el-form-item>
        <el-form-item label="难度" prop="difficulty">
          <el-select v-model="form.difficulty" class="select">
            <el-option label="简单" value="简单" />
            <el-option label="中等" value="中等" />
            <el-option label="困难" value="困难" />
          </el-select>
        </el-form-item>
        <el-form-item label="题干" prop="content">
          <el-input v-model="form.content" type="textarea" :rows="3" placeholder="请输入题干内容" />
        </el-form-item>
        <el-form-item v-if="form.type !== 'short'" label="选项">
          <div v-for="(opt, idx) in form.options" :key="idx" class="option-row">
            <el-input v-model="form.options[idx]" :placeholder="`选项 ${String.fromCharCode(65 + idx)}`">
              <template #prepend>{{ String.fromCharCode(65 + idx) }}</template>
            </el-input>
          </div>
        </el-form-item>
        <el-form-item label="答案" prop="answer">
          <el-input v-model="form.answer" type="textarea" :rows="2" placeholder="请输入正确答案" />
        </el-form-item>
        <el-form-item label="解析">
          <el-input v-model="form.analysis" type="textarea" :rows="2" placeholder="请输入题目解析（选填）" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="onSave">确认保存</el-button>
      </template>
    </el-dialog>

    <!-- AI 生成弹窗（保持不变） -->
    <el-dialog v-model="aiDialogVisible" title="AI 智能出题" width="460px" destroy-on-close>
      <el-form ref="aiFormRef" :model="aiForm" :rules="aiRules" label-width="90px">
        <el-form-item label="课程" prop="courseName">
          <el-select v-model="aiForm.courseName" placeholder="请选择课程" class="select">
            <el-option v-for="c in courseNames" :key="c" :label="c" :value="c" />
          </el-select>
        </el-form-item>
        <el-form-item label="知识点">
          <el-select v-model="aiForm.topic" placeholder="选填" clearable class="select">
            <el-option v-for="t in allTopics" :key="t" :label="t" :value="t" />
          </el-select>
        </el-form-item>
        <el-form-item label="生成数量">
          <el-input-number v-model="aiForm.count" :min="1" :max="5" />
        </el-form-item>
      </el-form>

      <div v-if="aiResult.length" class="ai-result">
        <div class="ai-result__title">✅ 已生成 {{ aiResult.length }} 道题目并自动入库</div>
        <el-tag
            v-for="(q, i) in aiResult"
            :key="i"
            class="ai-result__tag"
            size="small"
            :type="tagTypeFor(q.type)"
            @click="aiResultClick(q)"
        >
          {{ typeLabel(q.type) }}：{{ q.content.slice(0, 20) }}...
        </el-tag>
      </div>

      <template #footer>
        <el-button @click="aiDialogVisible = false">关闭</el-button>
        <el-button type="success" :loading="aiLoading" @click="onAiGenerate">🤖 开始生成</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getQuestions, createQuestion, updateQuestion, deleteQuestion, aiGenerateQuestions } from '../../api/questions'
import { getCourses } from '../../api/courses'

const loading = ref(false)
const saving = ref(false)

// ---------- 筛选 ----------
const keyword = ref('')
const filterCourse = ref('')
const filterTopic = ref('')
const filterType = ref('')
const filterDifficulty = ref('')
const list = ref([])
const courseNames = ref([])
const allTopics = ['Vue3基础', '路由', '组件通信', '状态管理', 'Axios', 'Element Plus']

function typeLabel(type) {
  return { single: '单选题', multiple: '多选题', judge: '判断题', short: '简答题' }[type] || type
}

function tagTypeFor(type) {
  return { single: 'primary', multiple: 'success', judge: 'warning', short: 'info' }[type] || ''
}

// 判断某个选项字母是否是正确答案（仅单选/多选/判断的高亮）
function isOptionAnswer(q, letter) {
  if (q.type === 'single') return q.answer === letter
  if (q.type === 'multiple') return q.answer.includes(letter)
  if (q.type === 'judge') {
    const idx = letter === 'A' ? 0 : 1
    return (q.options[idx] || '') === q.answer
  }
  return false
}

async function fetchCourses() {
  const res = await getCourses()
  courseNames.value = [...new Set((res.list || []).map((c) => c.name))]
}

async function fetchList() {
  loading.value = true
  try {
    const params = {}
    if (keyword.value) params.keyword = keyword.value
    if (filterCourse.value) params.course = filterCourse.value
    if (filterTopic.value) params.topic = filterTopic.value
    if (filterType.value) params.type = filterType.value
    if (filterDifficulty.value) params.difficulty = filterDifficulty.value

    const res = await getQuestions(params)

    // 前端再筛 type / difficulty（mock 接口不支持的话）
    let filtered = res.list
    if (filterType.value) filtered = filtered.filter((q) => q.type === filterType.value)
    if (filterDifficulty.value) filtered = filtered.filter((q) => q.difficulty === filterDifficulty.value)

    list.value = filtered
  } finally {
    loading.value = false
  }
}

function onSearch() {
  fetchList()
}

// ---------- CRUD ----------
const dialogVisible = ref(false)
const dialogMode = ref('create')
const editingId = ref(null)
const formRef = ref()
const form = reactive({
  courseName: '', topic: '', type: 'single', content: '',
  options: ['', '', '', ''], answer: '', analysis: '', difficulty: '中等'
})

const rules = {
  courseName: [{ required: true, message: '请选择课程', trigger: 'change' }],
  type: [{ required: true, message: '请选择题型', trigger: 'change' }],
  content: [{ required: true, message: '请输入题干', trigger: 'blur' }],
  answer: [{ required: true, message: '请输入答案', trigger: 'blur' }],
  difficulty: [{ required: true, message: '请选择难度', trigger: 'change' }]
}

function resetForm() {
  form.courseName = ''; form.topic = ''; form.type = 'single'; form.content = ''
  form.options = ['', '', '', '']; form.answer = ''; form.analysis = ''; form.difficulty = '中等'
}

function openCreate() {
  dialogMode.value = 'create'; editingId.value = null; resetForm(); dialogVisible.value = true
}

function openEdit(row) {
  dialogMode.value = 'edit'; editingId.value = row.id
  form.courseName = row.courseName; form.topic = row.topic || ''; form.type = row.type
  form.content = row.content
  form.options = row.type !== 'short' ? (row.options.length ? row.options : ['', '', '', '']) : []
  form.answer = row.answer; form.analysis = row.analysis || ''; form.difficulty = row.difficulty
  dialogVisible.value = true
}

function onTypeChange() {
  if (form.type === 'short') form.options = []
  else if (!form.options.length) form.options = ['', '', '', '']
}

async function onSave() {
  await formRef.value.validate()
  saving.value = true
  try {
    const data = {
      courseName: form.courseName,
      topic: form.topic,
      type: form.type,
      content: form.content,
      options: form.type === 'short' ? [] : form.options,
      answer: form.answer,
      analysis: form.analysis,
      difficulty: form.difficulty
    }
    if (dialogMode.value === 'create') {
      await createQuestion(data); ElMessage.success('录入成功')
    } else {
      await updateQuestion(editingId.value, data); ElMessage.success('保存成功')
    }
    dialogVisible.value = false; fetchList()
  } finally { saving.value = false }
}

async function onDelete(row) {
  await ElMessageBox.confirm(`确认删除题目「${row.content.slice(0, 30)}...」？`, '删除确认', {
    type: 'warning',
    confirmButtonText: '删除',
    cancelButtonText: '取消'
  })
  await deleteQuestion(row.id)
  ElMessage.success('已删除')
  fetchList()
}

// ---------- AI 生成 ----------
const aiDialogVisible = ref(false)
const aiLoading = ref(false)
const aiResult = ref([])
const aiFormRef = ref()
const aiForm = reactive({ courseName: '', topic: '', count: 3 })
const aiRules = {
  courseName: [{ required: true, message: '请选择课程', trigger: 'change' }]
}

function openAiDialog() {
  aiForm.courseName = ''; aiForm.topic = ''; aiForm.count = 3; aiResult.value = []; aiDialogVisible.value = true
}

function aiResultClick(q) {
  aiDialogVisible.value = false
  openEdit(q)
}

async function onAiGenerate() {
  await aiFormRef.value.validate()
  aiLoading.value = true
  try {
    const res = await aiGenerateQuestions({
      courseName: aiForm.courseName,
      topic: aiForm.topic,
      count: aiForm.count
    })
    aiResult.value = res.list || []
    ElMessage.success('AI 出题成功，已自动入库')
    fetchList()
  } finally { aiLoading.value = false }
}

onMounted(() => { fetchCourses(); fetchList() })
</script>

<style scoped>
.page { width: 100% }

.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.top-bar__count { font-size: 14px; color: #909399 }
.top-bar__count b { color: #303133 }

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  margin-bottom: 16px;
}
.filter-item { width: 150px }
.filter-radio { width: auto }
.filter-search { width: 200px }

.card-list { display: flex; flex-direction: column; gap: 10px }

.q-card {
  display: flex;
  gap: 0;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  transition: box-shadow .2s ease;
  overflow: hidden;
}
.q-card:hover { box-shadow: 0 2px 12px rgba(0,0,0,.08) }

.q-card__left {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  background: #fafafa;
  flex-shrink: 0;
}
.q-card__num {
  font-size: 15px;
  font-weight: 600;
  color: #909399;
}

.q-card__body {
  flex: 1;
  padding: 14px 16px;
  min-width: 0;
}

.q-card__header {
  display: flex;
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
}

.q-card__tag {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}
.q-card__tag--single   { background: #ecf5ff; color: #409eff }
.q-card__tag--multiple { background: #f0f9eb; color: #67c23a }
.q-card__tag--judge    { background: #fdf6ec; color: #e6a23c }
.q-card__tag--short    { background: #f5f7fa; color: #909399 }

.q-card__difficulty {
  font-size: 12px;
  padding: 0 6px;
  border-radius: 3px;
}
.q-card__difficulty--简单 { color: #67c23a }
.q-card__difficulty--中等 { color: #e6a23c }
.q-card__difficulty--困难 { color: #f56c6c; font-weight: 500 }

.q-card__course {
  font-size: 12px;
  color: #909399;
}
.q-card__topic {
  font-size: 12px;
  color: #409eff;
  background: #ecf5ff;
  padding: 1px 6px;
  border-radius: 3px;
}

.q-card__content {
  font-size: 14px;
  line-height: 1.7;
  color: #303133;
  margin-bottom: 8px;
}

.q-card__options {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 16px;
  margin-bottom: 8px;
}
.q-card__opt {
  font-size: 13px;
  color: #606266;
  padding: 2px 8px;
  border-radius: 4px;
  background: #f5f7fa;
}
.q-card__opt--answer {
  color: #67c23a;
  background: #f0f9eb;
  font-weight: 500;
}

.q-card__answer {
  font-size: 13px;
}
.q-card__label { color: #909399 }
.q-card__answer-text { color: #409eff; font-weight: 500 }

.q-card__actions {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  padding: 0 12px;
  border-left: 1px solid #ebeef5;
  flex-shrink: 0;
}

.select { width: 100% }
.option-row { margin-bottom: 8px }

.ai-result {
  margin-top: 16px; padding: 12px;
  background: #f0f9eb; border-radius: 8px;
}
.ai-result__title { margin-bottom: 8px; font-size: 13px; font-weight: 600; color: #67c23a }
.ai-result__tag { margin: 3px; cursor: pointer }
</style>