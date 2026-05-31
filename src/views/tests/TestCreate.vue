<template>
  <div class="page">
    <el-card>
      <template #header>
        <div class="header">
          <div class="title">创建测试</div>
          <el-button @click="$router.back()">返回</el-button>
        </div>
      </template>

      <el-form ref="formRef" :model="form" :rules="rules" label-width="90px" class="form">
        <el-form-item label="测试标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入测试标题" />
        </el-form-item>
        <el-form-item label="关联课程" prop="courseName">
          <el-select v-model="form.courseName" placeholder="请选择课程" class="select" @change="onCourseChange">
            <el-option v-for="c in courseNames" :key="c" :label="c" :value="c" />
          </el-select>
        </el-form-item>
        <el-form-item label="选择题目" prop="questionIds">
          <el-table
              :data="questionList"
              class="table"
              border
              max-height="360"
              @selection-change="onSelectionChange"
              ref="qTableRef"
          >
            <el-table-column type="selection" width="50" />
            <el-table-column prop="content" label="题干" min-width="260" show-overflow-tooltip />
            <el-table-column label="题型" width="80">
              <template #default="{ row }">
                <el-tag size="small">{{ typeLabel(row.type) }}</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" :loading="saving" @click="onSubmit">创建测试</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { createTest } from '../../api/tests'
import { getQuestions } from '../../api/questions'
import { getCourses } from '../../api/courses'

const router = useRouter()
const saving = ref(false)
const formRef = ref()
const qTableRef = ref()
const courseNames = ref([])
const questionList = ref([])
const selectedQuestions = ref([])

const form = reactive({ title: '', courseName: '', questionIds: [] })

const rules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  courseName: [{ required: true, message: '请选择课程', trigger: 'change' }]
}

function typeLabel(t) {
  return { single: '单选', multiple: '多选', judge: '判断', short: '简答' }[t] || t
}

async function fetchCourses() {
  const res = await getCourses()
  courseNames.value = [...new Set((res.list || []).map((c) => c.name))]
}

async function onCourseChange() {
  if (!form.courseName) { questionList.value = [] ; return }
  const res = await getQuestions({ course: form.courseName })
  questionList.value = res.list || []
}

function onSelectionChange(rows) {
  selectedQuestions.value = rows
  form.questionIds = rows.map((r) => r.id)
}

async function onSubmit() {
  if (form.questionIds.length === 0) { ElMessage.warning('请至少选择一道题目') ; return }
  await formRef.value.validate()
  saving.value = true
  try {
    await createTest({ ...form })
    ElMessage.success('创建成功')
    router.push('/tests')
  } finally { saving.value = false }
}

onMounted(() => { fetchCourses() })
</script>

<style scoped>
.page { width: 100% }
.header { display: flex; align-items: center; justify-content: space-between }
.title { font-weight: 700 }
.form { max-width: 780px }
.select { width: 100% }
.table { width: 100%; margin-top: 4px }
</style>