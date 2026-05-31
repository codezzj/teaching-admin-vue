<template>
  <div class="page">
    <el-card>
      <template #header>
        <div class="header">
          <div class="title">发布作业</div>
          <el-button @click="$router.back()">返回列表</el-button>
        </div>
      </template>

      <el-form
          ref="formRef"
          :model="form"
          :rules="rules"
          label-width="100px"
          class="form"
      >
        <el-form-item label="作业标题" prop="title">
          <el-input v-model="form.title" placeholder="请输入作业标题" />
        </el-form-item>

        <el-form-item label="关联课程" prop="courseId">
          <el-select
              v-model="form.courseId"
              placeholder="请选择课程"
              clearable
              class="select"
              @change="onCourseChange"
          >
            <el-option
                v-for="c in courses"
                :key="c.id"
                :label="`${c.name}（${c.className}）`"
                :value="c.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="截止时间" prop="deadline">
          <el-date-picker
              v-model="form.deadline"
              type="datetime"
              placeholder="请选择截止时间"
              value-format="YYYY-MM-DDTHH:mm"
              class="select"
          />
        </el-form-item>

        <el-form-item label="作业要求" prop="requirement">
          <el-input
              v-model="form.requirement"
              type="textarea"
              :rows="6"
              placeholder="请输入作业要求"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="saving" @click="onSubmit">发布</el-button>
          <el-button @click="$router.back()">取消</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { createHomework } from '../../api/homeworks'
import { getCourses } from '../../api/courses'

const router = useRouter()
const formRef = ref()
const saving = ref(false)
const courses = ref([])

const form = reactive({
  title: '',
  courseId: null,
  courseName: '',
  deadline: '',
  requirement: ''
})

const rules = {
  title: [{ required: true, message: '请输入作业标题', trigger: 'blur' }],
  courseId: [{ required: true, message: '请选择课程', trigger: 'change' }],
  deadline: [{ required: true, message: '请选择截止时间', trigger: 'change' }],
  requirement: [{ required: true, message: '请输入作业要求', trigger: 'blur' }]
}

function onCourseChange(id) {
  const target = courses.value.find((c) => c.id === id)
  form.courseName = target ? `${target.name}（${target.className}）` : ''
}

async function fetchCourses() {
  const res = await getCourses()
  courses.value = res.list || []
}

async function onSubmit() {
  await formRef.value.validate()
  saving.value = true
  try {
    await createHomework({ ...form })
    ElMessage.success('发布成功')
    router.push('/homeworks')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  fetchCourses()
})
</script>

<style scoped>
.page {
  width: 100%;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.title {
  font-weight: 700;
}
.form {
  max-width: 680px;
}
.select {
  width: 100%;
}
</style>