<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface User {
  id?: number
  name: string
  email: string
  age?: number
}

const users = ref<User[]>([])
const currentUser = ref<User>({ name: '', email: '', age: undefined })
const editingId = ref<number | null>(null)
const loading = ref(false)



const fetchUsers = async () => {
  try {
    loading.value = true
    const response = await fetch(`/api/example/users`)
    const data = await response.json()
    users.value = data.users || []
  } catch (error) {
    console.error('获取用户失败:', error)
    alert('获取用户失败')
  } finally {
    loading.value = false
  }
}

const saveUser = async () => {
  if (!currentUser.value.name || !currentUser.value.email) {
    alert('请填写姓名和邮箱')
    return
  }

  try {
    loading.value = true
    const url = editingId.value
      ? `/api/example/users/${editingId.value}`
      : `/api/example/users`

    const method = editingId.value ? 'PUT' : 'POST'

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(currentUser.value),
    })

    if (response.ok) {
      resetForm()
      await fetchUsers()
      alert('操作成功')
    } else {
      alert('操作失败')
    }
  } catch (error) {
    console.error('保存用户失败:', error)
    alert('操作失败')
  } finally {
    loading.value = false
  }
}

const editUser = (user: User) => {
  currentUser.value = { ...user }
  editingId.value = user.id!
}

const deleteUser = async (id: number) => {
  if (!confirm('确定要删除这个用户吗？')) return

  try {
    loading.value = true
    const response = await fetch(`/api/example/users/${id}`, {
      method: 'DELETE',
    })

    if (response.ok) {
      await fetchUsers()
      alert('删除成功')
    } else {
      alert('删除失败')
    }
  } catch (error) {
    console.error('删除用户失败:', error)
    alert('删除失败')
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  currentUser.value = { name: '', email: '', age: undefined }
  editingId.value = null
}

onMounted(() => {
  console.log(import.meta.env);
  
  console.log('当前版本号:' + import.meta.env.VITE_APP_VERSION) // 输出当前版本号;
  fetchUsers()
})
</script>

<template>
  <div class="app">
    <!-- 表单区域 -->
    <div class="form-container">
      <div class="card-header">
        <h2 class="form-title">
          <span class="icon">{{ editingId ? '✏️' : '➕' }}</span>
          {{ editingId ? '编辑用户' : '添加用户' }}
        </h2>
      </div>

      <form @submit.prevent="saveUser" class="user-form">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">
              <span class="label-icon">👤</span>
              姓名
            </label>
            <input v-model="currentUser.name" type="text" class="form-input" placeholder="请输入姓名" required />
          </div>

          <div class="form-group">
            <label class="form-label">
              <span class="label-icon">📧</span>
              邮箱
            </label>
            <input v-model="currentUser.email" type="email" class="form-input" placeholder="请输入邮箱" required />
          </div>

          <div class="form-group">
            <label class="form-label">
              <span class="label-icon">🎂</span>
              年龄
            </label>
            <input v-model.number="currentUser.age" type="number" class="form-input" placeholder="请输入年龄" />
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" :disabled="loading" class="btn btn-primary">
            <span v-if="loading" class="loading-spinner"></span>
            {{ loading ? '处理中...' : (editingId ? '更新用户' : '创建用户') }}
          </button>
          <button type="button" @click="resetForm" v-if="editingId" class="btn btn-secondary">
            取消编辑
          </button>
        </div>
      </form>
    </div>

    <!-- 用户列表区域 -->
    <div class="users-container">
      <div class="list-header">
        <h2 class="list-title">
          <span class="icon">📋</span>
          用户列表
          <span class="user-count">({{ users.length }})</span>
        </h2>
        <button @click="fetchUsers" :disabled="loading" class="btn btn-refresh">
          <span class="refresh-icon">🔄</span>
          {{ loading ? '加载中...' : '刷新数据' }}
        </button>
      </div>

      <div v-if="loading && users.length === 0" class="loading-state">
        <div class="loading-spinner-large"></div>
        <p>正在加载用户数据...</p>
      </div>

      <div v-else-if="users.length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
        <h3>暂无用户数据</h3>
        <p>点击上方"创建用户"按钮添加第一个用户</p>
      </div>

      <div v-else class="users-grid">
        <div v-for="user in users" :key="user.id" class="user-card">
          <div class="user-avatar">
            <span class="avatar-text">{{ user.name.charAt(0).toUpperCase() }}</span>
          </div>

          <div class="user-info">
            <h3 class="user-name">{{ user.name }}</h3>
            <div class="user-details">
              <div class="detail-item">
                <span class="detail-icon">📧</span>
                <span class="detail-text">{{ user.email }}</span>
              </div>
              <div v-if="user.age" class="detail-item">
                <span class="detail-icon">🎂</span>
                <span class="detail-text">{{ user.age }} 岁</span>
              </div>
            </div>
          </div>

          <div class="user-actions">
            <button @click="editUser(user)" class="btn btn-edit">
              <span class="btn-icon">✏️</span>
              编辑
            </button>
            <button @click="deleteUser(user.id!)" class="btn btn-delete">
              <span class="btn-icon">🗑️</span>
              删除
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 全局样式 */
* {
  box-sizing: border-box;
}

.app {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

/* 主标题区域 */
.header {
  text-align: center;
  margin-bottom: 40px;
  padding: 40px 20px;
}

.main-title {
  font-size: 3rem;
  font-weight: 700;
  background: linear-gradient(135deg, #fff 0%, #f8f9ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 10px 0;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  font-weight: 300;
  margin: 0;
}

/* 卡片通用样式 */
.form-container,
.users-container {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 30px;
  overflow: hidden;
}

/* 表单容器样式 */
.card-header {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  padding: 25px 30px;
  border-bottom: none;
}

.form-title {
  color: white;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-title .icon {
  font-size: 1.3rem;
}

.user-form {
  padding: 30px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  margin-bottom: 30px;
}

.form-group {
  position: relative;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.label-icon {
  font-size: 1rem;
}

.form-input {
  width: 100%;
  padding: 15px 18px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 16px;
  transition: all 0.3s ease;
  background: #fafafa;
}

.form-input:focus {
  outline: none;
  border-color: #4f46e5;
  background: white;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
  transform: translateY(-1px);
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-start;
}

/* 按钮样式 */
.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.btn:active {
  transform: translateY(0);
}

.btn-primary {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
}

.btn-secondary {
  background: #6b7280;
  color: white;
}

.btn-refresh {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.btn-edit {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
  padding: 8px 16px;
  font-size: 13px;
}

.btn-delete {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
  padding: 8px 16px;
  font-size: 13px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

/* 加载动画 */
.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

.loading-spinner-large {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-radius: 50%;
  border-top-color: #4f46e5;
  animation: spin 1s ease-in-out infinite;
  margin: 0 auto 20px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 列表头部 */
.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 25px 30px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.list-title {
  color: #111827;
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-count {
  font-size: 1rem;
  color: #6b7280;
  font-weight: 400;
}

.refresh-icon {
  display: inline-block;
  transition: transform 0.3s ease;
}

.btn-refresh:hover .refresh-icon {
  transform: rotate(180deg);
}

/* 空状态和加载状态 */
.empty-state,
.loading-state {
  text-align: center;
  padding: 60px 30px;
  color: #6b7280;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.empty-state h3 {
  color: #374151;
  margin: 0 0 10px 0;
  font-size: 1.5rem;
}

.empty-state p {
  margin: 0;
  font-size: 1rem;
}

/* 用户网格 */
.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
  padding: 30px;
}

/* 用户卡片 */
.user-card {
  background: white;
  border-radius: 16px;
  padding: 25px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
  border: 1px solid #f3f4f6;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.user-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
}

.user-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

.user-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3);
}

.avatar-text {
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
}

.user-info {
  margin-bottom: 20px;
}

.user-name {
  color: #111827;
  margin: 0 0 15px 0;
  font-size: 1.3rem;
  font-weight: 600;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #6b7280;
  font-size: 0.9rem;
}

.detail-icon {
  font-size: 1rem;
  width: 20px;
}

.detail-text {
  flex: 1;
}

.user-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.btn-icon {
  font-size: 0.9rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app {
    padding: 15px;
  }

  .main-title {
    font-size: 2.5rem;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .list-header {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }

  .users-grid {
    grid-template-columns: 1fr;
    padding: 20px;
  }

  .user-card {
    padding: 20px;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .user-actions {
    flex-direction: column;
  }
}
</style>
