<template>
  <div class="page">
    <el-card>
      <template #header>
        <div class="header">
          <div class="title">课程详情</div>
          <el-button @click="$router.back()">返回</el-button>
        </div>
      </template>

      <el-descriptions v-if="detail" :column="2" border>
        <el-descriptions-item label="学期">{{ detail.term }}</el-descriptions-item>
        <el-descriptions-item label="课程名称">{{ detail.name }}</el-descriptions-item>
        <el-descriptions-item label="授课教师">{{ detail.teacher }}</el-descriptions-item>
        <el-descriptions-item label="课程班">{{ detail.className }}</el-descriptions-item>
        <el-descriptions-item label="加课码">{{ detail.joinCode }}</el-descriptions-item>
      </el-descriptions>

      <el-empty v-else-if="!loading" description="未找到课程" />

      <div v-if="loading" class="loading">
        <el-skeleton :rows="6" animated />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getCourseDetail } from '../../api/courses'

const route = useRoute()
const loading = ref(false)
const detail = ref(null)

async function fetchDetail() {
  loading.value = true
  try {
    detail.value = await getCourseDetail(route.params.id)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDetail()
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
.loading {
  margin-top: 12px;
}
</style>