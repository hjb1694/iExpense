import { createRouter, createWebHistory } from 'vue-router'
import UserView from '@/views/UserView.vue'
import ExpenseView from '@/views/ExpenseView.vue'
import CompanyExpensesView from '@/views/CompanyExpenses.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'user',
      component: UserView
    }, 
    {
      path: '/expenses', 
      name: 'expenses', 
      component: ExpenseView
    }, 
    {
      path: '/company-expenses', 
      name: 'company-expenses', 
      component: CompanyExpensesView
    }
  ]
})

export default router
