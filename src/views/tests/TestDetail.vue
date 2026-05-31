<template>
  <div class="page">
    <!-- 顶部 -->
    <div class="detail-header">
      <div class="detail-header__left">
        <h3 class="detail-title">{{ detail.title || '测试详情' }}</h3>
        <div class="detail-meta">
          <span>课程：{{ detail.courseName }}</span>
          <span class="dot">·</span>
          <span>共 {{ detail.questions?.length || 0 }} 题</span>
          <span class="dot">·</span>
          <span>已批 {{ gradedCount }} / {{ totalCount }}</span>
        </div>
      </div>
      <div class="detail-header__right">
        <el-button type="success" :loading="aiGrading" @click="onAiGrade">
          🤖 AI 一键批改
        </el-button>
        <el-button @click="$router.back()">返回列表</el-button>
      </div>
    </div>

    <!-- 主体：左侧题目导航 + 右侧题目详情 -->
    <div class="detail-body">
      <!-- 左边题目导航 -->
      <div class="q-nav">
        <div class="q-nav__title">题目列表</div>
        <div
            v-for="(q, qi) in detail.questions"
            :key="q.id"
            class="q-nav__item"
            :class="{
            'q-nav__item--active': activeIdx === qi,
            'q-nav__item--graded': q.isGraded,
            'q-nav__item--ungraded': !q.isGraded
          }"
            @click="activeIdx = qi"
        >
          <span class="q-nav__num">{{ qi + 1 }}</span>
          <span class="q-nav__type">{{ typeShort(q.type) }}</span>
          <span v-if="q.isGraded" class="q-nav__score">{{ q.aiScore !== undefined ? q.aiScore : q.score }}分</span>
        </div>
      </div>

      <!-- 右边详情 -->
      <div class="q-detail" v-if="currentQuestion">
        <div class="q-detail__header">
          <span class="q-detail__tag" :class="`q-detail__tag--${currentQuestion.type}`">
            {{ typeLabel(currentQuestion.type) }}
          </span>
          <span class="q-detail__num">第 {{ activeIdx + 1 }} 题</span>
          <span v-if="currentQuestion.isGraded" class="q-detail__graded-badge">已批改</span>
          <span v-else class="q-detail__graded-badge q-detail__graded-badge--no">待批改</span>
        </div>

        <!-- 题干 -->
        <div class="q-detail__content">{{ currentQuestion.content }}</div>

        <!-- 选项 -->
        <div v-if="currentQuestion.options?.length" class="q-detail__options">
          <div
              v-for="(opt, oi) in currentQuestion.options"
              :key="oi"
              class="q-detail__opt"
              :class="{
              'q-detail__opt--correct': isCorrectOpt(currentQuestion, String.fromCharCode(65 + oi)),
              'q-detail__opt--wrong': isWrongOpt(currentQuestion, String.fromCharCode(65 + oi))
            }"
          >
            {{ opt }}
          </div>
        </div>

        <!-- 答案对照：学生答案 vs 标准答案 -->
        <div class="q-detail__compare">
          <div class="q-detail__compare-item">
            <div class="q-detail__compare-label">📝 学生作答</div>
            <div class="q-detail__compare-value q-detail__compare-value--student">
              {{ currentQuestion.studentAnswer || '（未作答）' }}
            </div>
          </div>
          <div class="q-detail__arrow">➡</div>
          <div class="q-detail__compare-item">
            <div class="q-detail__compare-label">✅ 标准答案</div>
            <div class="q-detail__compare-value q-detail__compare-value--correct">
              {{ currentQuestion.answer }}
            </div>
          </div>
        </div>

        <!-- AI 批改结果 -->
        <div v-if="currentQuestion.isGraded && (currentQuestion.aiComment || currentQuestion.comment)" class="q-detail__result">
          <div class="q-detail__result-header">
            <span>📋 批改结果</span>
            <span class="q-detail__result-score">
              {{ currentQuestion.aiScore !== undefined ? currentQuestion.aiScore : currentQuestion.score }} 分
            </span>
          </div>
          <div class="q-detail__result-comment">
            {{ currentQuestion.aiComment || currentQuestion.comment }}
          </div>
        </div>

        <!-- 手动批改区 -->
        <div v-if="!currentQuestion.isGraded" class="q-detail__grade">
          <el-divider />
          <div class="q-detail__grade-title">✏️ 手动打分</div>
          <div class="q-detail__grade-row">
            <span class="q-detail__grade-label">得分：</span>
            <el-input-number
                v-model="currentQuestion._manualScore"
                :min="0"
                :max="currentQuestion.maxScore || currentQuestion.score || 10"
                size="small"
                controls-position="right"
            />
            <span class="q-detail__grade-hint">
              / {{ currentQuestion.maxScore || currentQuestion.score || 10 }} 分
            </span>
          </div>
          <div class="q-detail__grade-row">
            <span class="q-detail__grade-label">评语：</span>
            <el-input
                v-model="currentQuestion._manualComment"
                size="small"
                placeholder="简要评语（选填）"
                class="q-detail__grade-input"
            />
          </div>
          <el-button size="small" type="primary" style="margin-top: 8px" @click="onManualGrade(currentQuestion)">
            提交打分
          </el-button>
        </div>
      </div>

      <el-empty v-if="!loading && !currentQuestion" description="暂无可批改的题目" :image-size="80" />
    </div>

    <div v-if="loading" class="loading">
      <el-skeleton :rows="8" animated />
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getTestDetail, manualGrade, aiGrade } from '../../api/tests'

const route = useRoute()
const loading = ref(false)
const aiGrading = ref(false)
const activeIdx = ref(0)
const detail = reactive({ questions: [] })

const totalCount = computed(() => detail.questions?.length || 0)
const gradedCount = computed(() => (detail.questions || []).filter((q) => q.isGraded).length)
const currentQuestion = computed(() => detail.questions?.[activeIdx.value] || null)

function typeLabel(t) {
  return { single: '单选题', multiple: '多选题', judge: '判断题', short: '简答题' }[t] || t
}
function typeShort(t) {
  return { single: '单选', multiple: '多选', judge: '判断', short: '简答' }[t] || t
}

// 判断某个选项字母：正确 / 错误（学生选了但不对）
function isCorrectOpt(q, letter) {
  if (!q.isGraded) return false
  if (q.type === 'single') return q.answer === letter
  if (q.type === 'multiple') return q.answer.includes(letter)
  if (q.type === 'judge') {
    const idx = letter === 'A' ? 0 : 1
    return (q.options[idx] || '') === q.answer
  }
  return false
}
function isWrongOpt(q, letter) {
  if (!q.isGraded || q.studentAnswer === '') return false
  const student = q.studentAnswer || ''
  if (q.type === 'single') return student === letter && letter !== q.answer
  if (q.type === 'multiple') return student.includes(letter) && !q.answer.includes(letter)
  if (q.type === 'judge') {
    const idx = letter === 'A' ? 0 : 1
    return (q.options[idx] || '') === student && student !== q.answer
  }
  return false
}

async function fetchDetail() {
  loading.value = true
  try {
    const res = await getTestDetail(route.params.id)
    Object.assign(detail, res)
    ;(detail.questions || []).forEach((q, i) => {
      if (!Object.hasOwn(q, '_manualScore')) q._manualScore = q.maxScore || q.score || 10
      if (!q._manualComment) q._manualComment = ''
    })
    // 定位到第一个未批改的题目
    const firstUngraded = (detail.questions || []).findIndex((q) => !q.isGraded)
    activeIdx.value = firstUngraded >= 0 ? firstUngraded : 0
  } finally { loading.value = false }
}

async function onManualGrade(q) {
  await manualGrade(detail.id, {
    questionId: q.id,
    score: q._manualScore,
    comment: q._manualComment
  })
  q.score = q._manualScore
  q.comment = q._manualComment
  q.isGraded = true
  ElMessage.success('已提交打分')
}

async function onAiGrade() {
  aiGrading.value = true
  try {
    const res = await aiGrade(detail.id)
    Object.assign(detail, res)
    ElMessage.success('AI 批改完成')
  } finally { aiGrading.value = false }
}

onMounted(() => { fetchDetail() })
</script>

<style scoped>
.page { width: 100% }

/* 顶部 */
.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.detail-title { margin: 0; font-size: 18px }
.detail-meta {
  margin-top: 6px;
  font-size: 13px;
  color: #909399;
}
.detail-meta .dot { margin: 0 6px }

/* 主体左右布局 */
.detail-body {
  display: flex;
  gap: 16px;
  min-height: 400px;
}

/* 左侧题目导航 */
.q-nav {
  width: 140px;
  flex-shrink: 0;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 12px 0;
  overflow-y: auto;
  max-height: 600px;
}
.q-nav__title {
  font-size: 13px;
  font-weight: 600;
  color: #303133;
  padding: 0 12px 10px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 4px;
}
.q-nav__item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 12px;
  cursor: pointer;
  font-size: 13px;
  transition: background .15s;
}
.q-nav__item:hover { background: #f5f7fa }
.q-nav__item--active { background: #ecf5ff !important }
.q-nav__item--graded .q-nav__num { color: #67c23a }
.q-nav__item--ungraded .q-nav__num { color: #f56c6c }
.q-nav__num { font-weight: 600; min-width: 20px }
.q-nav__type { color: #909399; font-size: 12px; flex: 1 }
.q-nav__score { color: #67c23a; font-size: 12px; font-weight: 500 }

/* 右侧题目详情 */
.q-detail {
  flex: 1;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  padding: 20px 24px;
}

.q-detail__header {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 16px;
}
.q-detail__tag {
  padding: 3px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}
.q-detail__tag--single   { background: #ecf5ff; color: #409eff }
.q-detail__tag--multiple { background: #f0f9eb; color: #67c23a }
.q-detail__tag--judge    { background: #fdf6ec; color: #e6a23c }
.q-detail__tag--short    { background: #f4f4f5; color: #909399 }

.q-detail__num { font-weight: 600; font-size: 14px }
.q-detail__graded-badge {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  color: #67c23a;
  background: #f0f9eb;
}
.q-detail__graded-badge--no {
  color: #e6a23c;
  background: #fdf6ec;
}

.q-detail__content {
  font-size: 15px;
  line-height: 1.8;
  color: #303133;
  margin-bottom: 16px;
}

/* 选项 */
.q-detail__options {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}
.q-detail__opt {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  background: #f5f7fa;
  border: 1px solid #f0f0f0;
}
.q-detail__opt--correct {
  background: #f0f9eb;
  border-color: #b3e19d;
  color: #67c23a;
}
.q-detail__opt--wrong {
  background: #fef0f0;
  border-color: #fab6b6;
  color: #f56c6c;
}

/* 作答对照 */
.q-detail__compare {
  display: flex;
  gap: 12px;
  align-items: stretch;
  margin-bottom: 20px;
}
.q-detail__compare-item {
  flex: 1;
  padding: 14px;
  border-radius: 8px;
}
.q-detail__compare-item:first-child { background: #f5f7fa }
.q-detail__compare-item:last-child { background: #f0f9eb }
.q-detail__compare-label {
  font-size: 13px;
  margin-bottom: 6px;
  color: #909399;
}
.q-detail__compare-value {
  font-size: 14px;
  line-height: 1.6;
}
.q-detail__compare-value--student { color: #606266 }
.q-detail__compare-value--correct { color: #67c23a; font-weight: 500 }
.q-detail__arrow {
  display: flex;
  align-items: center;
  font-size: 18px;
  color: #c0c4cc;
}

/* 批改结果 */
.q-detail__result {
  padding: 14px;
  background: #f0f9eb;
  border-radius: 8px;
  margin-bottom: 20px;
}
.q-detail__result-header {
  display: flex;
  justify-content: space-between;
  font-weight: 600;
  font-size: 14px;
  margin-bottom: 8px;
}
.q-detail__result-score { color: #67c23a }
.q-detail__result-comment { font-size: 14px; line-height: 1.7; color: #303133 }

/* 手动批改 */
.q-detail__grade-title {
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 10px;
}
.q-detail__grade-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}
.q-detail__grade-label {
  width: 50px;
  font-size: 13px;
  color: #606266;
}
.q-detail__grade-hint {
  font-size: 13px;
  color: #909399;
  margin-left: 8px;
}
.q-detail__grade-input {
  flex: 1;
  max-width: 300px;
}

.loading {
  padding: 24px;
}
</style>