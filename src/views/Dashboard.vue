<template>
  <div class="page">
    <div class="welcome">
      <div class="welcome__bar"></div>
      <div class="welcome__body">
        <div class="welcome__avatar">{{ avatarText }}</div>
        <div>
          <h2>欢迎回来，{{ username }}</h2>
          <p class="welcome__sub">智能教学辅助管理系统 · 教师端</p>
        </div>
      </div>
    </div>

    <div class="stats">
      <div
        v-for="(card, idx) in cards"
        :key="card.key"
        class="stat-card"
        :class="`stat-card--t${idx % 8}`"
        @click="$router.push(card.path)"
      >
        <div class="stat-card__inner">
          <div class="stat-card__left">
            <div class="stat-card__icon">{{ card.icon }}</div>
          </div>
          <div class="stat-card__right">
            <div class="stat-card__label">{{ card.label }}</div>
            <div class="stat-card__desc">{{ card.desc }}</div>
          </div>
          <span class="stat-card__arrow">→</span>
        </div>
      </div>
    </div>

    <div class="quickstart">
      <div class="quickstart__title">⏱ 快速开始</div>
      <div class="quickstart__body">
        本系统为<strong>教师端后台</strong>，提供学生管理、课程管理、作业发布、考勤签到、题库维护和测试批改等功能。如需修改密码或个人信息，请前往「个人中心」。
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive } from 'vue'
import { getUser } from '../utils/auth'

const username = computed(() => getUser()?.username || '教师')
const avatarText = computed(() => (getUser()?.username || '教')[0])

const cards = reactive([
  { key: 'students', icon: '👩‍🎓', label: '学生管理', desc: '管理学生信息', path: '/students' },
  { key: 'courses', icon: '📖', label: '课程管理', desc: '课程增删改查', path: '/courses' },
  { key: 'homeworks', icon: '📝', label: '作业管理', desc: '发布和查看作业', path: '/homeworks' },
  { key: 'attendances', icon: '📋', label: '考勤管理', desc: '签到与考勤统计', path: '/attendances' },
  { key: 'questions', icon: '❓', label: '题库管理', desc: '题目录入与AI生成', path: '/questions' },
  { key: 'tests', icon: '📊', label: '测试管理', desc: '创建测试与批改', path: '/tests' },
  { key: 'profile', icon: '👤', label: '个人中心', desc: '个人信息与密码', path: '/profile' },
  { key: 'homeworks_create', icon: '✏️', label: '发布作业', desc: '新建作业', path: '/homeworks/create' }
])
</script>

<style scoped>
.page { width: 100%; }

.welcome {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px; padding: 0; margin-bottom: 20px;
  overflow: hidden; position: relative;
}
.welcome__bar {
  height: 3px;
  background: linear-gradient(90deg, rgba(255,255,255,.7), rgba(255,255,255,0));
}
.welcome__body {
  display: flex; align-items: center; gap: 16px;
  padding: 22px 24px;
}
.welcome__avatar {
  width: 44px; height: 44px;
  border-radius: 50%;
  background: rgba(255,255,255,.2);
  display: flex; align-items: center; justify-content: center;
  font-size: 20px; font-weight: 700; color: #fff;
  flex-shrink: 0; user-select: none;
  border: 2px solid rgba(255,255,255,.25);
}
.welcome h2 {
  margin: 0 0 2px;
  font-size: 20px; font-weight: 700;
  color: #fff; letter-spacing: -.3px;
}
.welcome__sub {
  margin: 0;
  font-size: 13px;
  color: rgba(255,255,255,.75);
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  margin-bottom: 20px;
}
@media (max-width: 1100px) { .stats { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px)  { .stats { grid-template-columns: 1fr; } }

.stat-card {
  background: #fff;
  border: 1px solid #eef0f5;
  border-radius: 10px;
  cursor: pointer;
  transition: all .18s ease;
  overflow: hidden;
  position: relative;
}
.stat-card::after {
  content: '';
  position: absolute; top: 0; left: 0; right: 0;
  height: 3px;
  transition: all .18s ease;
}
.stat-card--t0::after { background: #667eea; }
.stat-card--t1::after { background: #f093fb; }
.stat-card--t2::after { background: #4facfe; }
.stat-card--t3::after { background: #43e97b; }
.stat-card--t4::after { background: #fa709a; }
.stat-card--t5::after { background: #f6d365; }
.stat-card--t6::after { background: #5ee7df; }
.stat-card--t7::after { background: #a18cd1; }

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,.08);
  border-color: #e0e3ea;
}

.stat-card__inner {
  display: flex; align-items: center; gap: 14px;
  padding: 18px 16px 16px;
}

.stat-card__left {}
.stat-card__icon {
  width: 44px; height: 44px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 22px;
}
.stat-card--t0 .stat-card__icon { background: #eeefff; }
.stat-card--t1 .stat-card__icon { background: #fef0ff; }
.stat-card--t2 .stat-card__icon { background: #eaf6ff; }
.stat-card--t3 .stat-card__icon { background: #e8fdf5; }
.stat-card--t4 .stat-card__icon { background: #fff0f5; }
.stat-card--t5 .stat-card__icon { background: #fffde8; }
.stat-card--t6 .stat-card__icon { background: #e7fcfb; }
.stat-card--t7 .stat-card__icon { background: #f3effc; }

.stat-card__right { flex: 1; min-width: 0; }
.stat-card__label {
  font-size: 14px; font-weight: 600;
  color: #1f2328; margin-bottom: 2px;
}
.stat-card__desc {
  font-size: 12px;
  color: #8b949e;
}
.stat-card__arrow {
  font-size: 16px; color: #d0d7de;
  transition: all .18s ease; flex-shrink: 0;
}
.stat-card:hover .stat-card__arrow {
  color: #667eea; transform: translateX(3px);
}

.quickstart {
  background: #fff;
  border: 1px solid #eef0f5;
  border-radius: 10px;
  padding: 20px 24px;
}
.quickstart__title {
  font-size: 14px; font-weight: 600;
  color: #1f2328; margin-bottom: 10px;
}
.quickstart__body {
  font-size: 13px; line-height: 1.8;
  color: #656d76;
}
</style>