<template>
  <div class="page">
    <div class="profile-hero" v-loading="loading">
      <div class="profile-hero__avatar">
        <span class="profile-hero__avatar-text">{{ form.nickname?.charAt(0) || 'U' }}</span>
      </div>
      <div class="profile-hero__info">
        <div class="profile-hero__name">{{ form.nickname || '教师' }}</div>
        <div class="profile-hero__meta">
          <span class="profile-hero__meta-item">工号 {{ form.employeeNo }}</span>
          <span class="profile-hero__meta-divider">|</span>
          <span class="profile-hero__meta-item">{{ form.username }}</span>
        </div>
      </div>
      <div class="profile-hero__actions">
        <el-button v-if="!editing" type="primary" @click="startEdit">编辑资料</el-button>
        <template v-else>
          <el-button @click="cancelEdit">取消</el-button>
          <el-button type="primary" :loading="saving" @click="onSave">保存</el-button>
        </template>
      </div>
    </div>

    <div class="page-card">
      <div class="section-title">基本信息</div>
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="88px"
        :disabled="!editing"
        class="profile-form"
      >
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="请输入昵称" maxlength="20" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入手机号" maxlength="11" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="请输入邮箱" />
        </el-form-item>
      </el-form>
    </div>

    <div class="page-card">
      <div class="section-title">安全设置</div>
      <div class="security-item">
        <div class="security-item__info">
          <div class="security-item__label">登录密码</div>
          <div class="security-item__desc">定期更换密码可以保护账号安全</div>
        </div>
        <el-link type="primary" :underline="false" @click="pwdDialogVisible = true">修改密码</el-link>
      </div>
    </div>

    <el-dialog v-model="pwdDialogVisible" title="修改密码" width="440px" destroy-on-close>
      <div class="pwd-tip">
        修改 <strong>{{ form.username }}</strong> 的登录密码
      </div>
      <el-form ref="pwdFormRef" :model="pwdForm" :rules="pwdRules" label-width="100px" class="pwd-form">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input
            v-model="pwdForm.oldPassword"
            type="password"
            show-password
            placeholder="请输入旧密码"
          />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="pwdForm.newPassword"
            type="password"
            show-password
            placeholder="至少 6 位"
          />
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmPassword">
          <el-input
            v-model="pwdForm.confirmPassword"
            type="password"
            show-password
            placeholder="请再次输入新密码"
          />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="pwdDialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="pwdSaving" @click="onChangePwd">确认修改</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { getProfile, updateProfile, changePassword } from '../../api/profile'

const loading = ref(false)
const saving = ref(false)

const editing = ref(false)
const formRef = ref()
const detail = ref({})

const form = reactive({
  employeeNo: '',
  username: '',
  nickname: '',
  phone: '',
  email: ''
})

const rules = {
  nickname: [{ required: true, message: '请输入昵称', trigger: 'blur' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
  ]
}

async function fetchProfile() {
  loading.value = true
  try {
    const res = await getProfile()
    detail.value = res
    applyForm(res)
  } finally {
    loading.value = false
  }
}

function applyForm(data) {
  form.employeeNo = data.employeeNo || ''
  form.username = data.username || ''
  form.nickname = data.nickname || ''
  form.phone = data.phone || ''
  form.email = data.email || ''
}

function startEdit() {
  editing.value = true
}

function cancelEdit() {
  applyForm(detail.value)
  editing.value = false
}

async function onSave() {
  await formRef.value.validate()
  saving.value = true
  try {
    const res = await updateProfile({
      nickname: form.nickname,
      phone: form.phone,
      email: form.email
    })
    detail.value = res
    applyForm(res)
    editing.value = false
    ElMessage.success('保存成功')
  } finally {
    saving.value = false
  }
}

const pwdDialogVisible = ref(false)
const pwdSaving = ref(false)
const pwdFormRef = ref()
const pwdForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const validateConfirmPwd = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请再次输入新密码'))
  } else if (value !== pwdForm.newPassword) {
    callback(new Error('两次输入的新密码不一致'))
  } else {
    callback()
  }
}

const pwdRules = {
  oldPassword: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '新密码至少 6 位', trigger: 'blur' }
  ],
  confirmPassword: [{ validator: validateConfirmPwd, trigger: 'blur' }]
}

async function onChangePwd() {
  await pwdFormRef.value.validate()
  pwdSaving.value = true
  try {
    await changePassword({ ...pwdForm })
    ElMessage.success('密码修改成功')
    pwdForm.oldPassword = ''
    pwdForm.newPassword = ''
    pwdForm.confirmPassword = ''
    pwdDialogVisible.value = false
  } finally {
    pwdSaving.value = false
  }
}

onMounted(() => {
  fetchProfile()
})
</script>

<style scoped>
.page {
  max-width: 720px;
  margin: 0 auto;
}

.profile-hero {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 32px 28px;
  margin-bottom: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  position: relative;
  overflow: hidden;
}

.profile-hero::before {
  content: '';
  position: absolute;
  right: -40px;
  top: -40px;
  width: 180px;
  height: 180px;
  background: rgba(255, 255, 255, .06);
  border-radius: 50%;
  pointer-events: none;
}

.profile-hero__avatar {
  flex-shrink: 0;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(255, 255, 255, .22);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 3px solid rgba(255, 255, 255, .3);
  position: relative;
  z-index: 1;
}

.profile-hero__avatar-text {
  font-size: 30px;
  font-weight: 700;
  color: #fff;
  user-select: none;
}

.profile-hero__info {
  flex: 1;
  min-width: 0;
  position: relative;
  z-index: 1;
}

.profile-hero__name {
  font-size: 22px;
  font-weight: 700;
  color: #fff;
  line-height: 1.3;
  margin-bottom: 6px;
}

.profile-hero__meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: rgba(255, 255, 255, .75);
}

.profile-hero__meta-divider {
  color: rgba(255, 255, 255, .35);
}

.profile-hero__actions {
  flex-shrink: 0;
  display: flex;
  gap: 8px;
  position: relative;
  z-index: 1;
}

.profile-hero__actions :deep(.el-button--primary) {
  --el-button-bg-color: rgba(255,255,255,.18);
  --el-button-border-color: rgba(255,255,255,.3);
  --el-button-hover-bg-color: rgba(255,255,255,.28);
  --el-button-hover-border-color: rgba(255,255,255,.45);
  --el-button-active-bg-color: rgba(255,255,255,.22);
}

.profile-hero__actions :deep(.el-button:not(.el-button--primary)) {
  --el-button-bg-color: rgba(255,255,255,.12);
  --el-button-border-color: rgba(255,255,255,.25);
  --el-button-text-color: #fff;
  --el-button-hover-bg-color: rgba(255,255,255,.22);
  --el-button-hover-border-color: rgba(255,255,255,.4);
  --el-button-hover-text-color: #fff;
  --el-button-active-bg-color: rgba(255,255,255,.16);
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #656d76;
  margin-bottom: 18px;
  padding-bottom: 12px;
  border-bottom: 1px solid #eef0f5;
  letter-spacing: .3px;
}

.profile-form {
  max-width: 480px;
}

.profile-form :deep(.el-form-item) {
  margin-bottom: 18px;
}

.profile-form :deep(.el-form-item__label) {
  color: #656d76;
  font-weight: 500;
  font-size: 13px;
}

.profile-form :deep(.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: 0 0 0 1px #eef0f5 inset;
  transition: box-shadow .2s;
}

.profile-form :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #c4c9d4 inset;
}

.profile-form :deep(.el-input.is-disabled .el-input__wrapper) {
  background: #fafbfc;
  box-shadow: 0 0 0 1px #eef0f5 inset;
}

.profile-form :deep(.el-input.is-disabled .el-input__inner) {
  color: #1f2328;
  -webkit-text-fill-color: #1f2328;
}

.profile-form :deep(.el-input__inner) {
  font-size: 13px;
}

.security-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 0;
}

.security-item__info {
  min-width: 0;
}

.security-item__label {
  font-size: 13px;
  font-weight: 500;
  color: #1f2328;
  margin-bottom: 4px;
}

.security-item__desc {
  font-size: 12px;
  color: #8b949e;
}

.pwd-tip {
  font-size: 13px;
  color: #656d76;
  margin-bottom: 18px;
  padding: 10px 14px;
  background: #fafbfc;
  border-radius: 8px;
  border: 1px solid #eef0f5;
}

.pwd-tip strong {
  color: #667eea;
}

.pwd-form :deep(.el-form-item) {
  margin-bottom: 16px;
}

.pwd-form :deep(.el-form-item__label) {
  color: #656d76;
  font-weight: 500;
  font-size: 13px;
}

.pwd-form :deep(.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: 0 0 0 1px #eef0f5 inset;
}

.pwd-form :deep(.el-input__wrapper:hover) {
  box-shadow: 0 0 0 1px #c4c9d4 inset;
}

:deep(.el-dialog) {
  border-radius: 10px;
  --el-dialog-box-shadow: 0 8px 30px rgba(0,0,0,.12);
}

:deep(.el-dialog__header) {
  padding: 22px 24px 16px;
}

:deep(.el-dialog__title) {
  font-size: 16px;
  font-weight: 700;
  color: #1f2328;
}

:deep(.el-dialog__body) {
  padding: 0 24px 24px;
}

:deep(.el-dialog__footer) {
  padding: 12px 24px 22px;
  border-top: 1px solid #eef0f5;
}

@media (max-width: 768px) {
  .page {
    max-width: 100%;
  }

  .profile-hero {
    flex-direction: column;
    text-align: center;
    padding: 28px 20px;
    gap: 14px;
  }

  .profile-hero__avatar {
    width: 64px;
    height: 64px;
  }

  .profile-hero__avatar-text {
    font-size: 26px;
  }

  .profile-hero__name {
    font-size: 19px;
  }

  .profile-hero__meta {
    justify-content: center;
  }

  .profile-hero__actions {
    width: 100%;
    justify-content: center;
  }

  .profile-form {
    max-width: 100%;
  }

  .security-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
