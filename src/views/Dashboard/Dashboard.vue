<script setup lang="ts">
import {
  LayoutDashboard,
  FileText,
  Building2,
  BarChart3,
  Settings,
  LogOut,
  Users,
  DollarSign,
} from "lucide-vue-next";

const emit = defineEmits<{
  (e: "navigate", page: string): void;
}>();

interface SidebarItems {
  icon: any;
  label: string;
  active: boolean;
  page: string;
}

interface StatsCards {
  title: string;
  value: string;
  subtitle: string;
  change: string;
  changeType: string;
  icon: any;
  color: string;
}

interface RecentActivities {
  title: string;
  time: string;
  user: string;
}

const sidebarItems: SidebarItems[] = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    active: true,
    page: "dashboard",
  },
  { icon: FileText, label: "Postagens", active: false, page: "posts" },
  { icon: Building2, label: "Campanhas", active: false, page: "campaigns" },
  { icon: BarChart3, label: "Relatórios", active: false, page: "analytics" },
  { icon: Settings, label: "Configurações", active: false, page: "settings" },
];

const statsCards: StatsCards[] = [
  {
    title: "Postagens Agendadas",
    value: "12",
    subtitle: "Próximos 7 Dias",
    change: "+15%",
    changeType: "positive",
    icon: FileText,
    color: "blue",
  },
  {
    title: "Engajamento Recente",
    value: "8.5k",
    subtitle: "Última Semana",
    change: "+23%",
    changeType: "positive",
    icon: Users,
    color: "green",
  },
  {
    title: "Investimento em Campanhas",
    value: "R$ 4.280",
    subtitle: "Campanha Ativa Principal",
    change: "-8%",
    changeType: "negative",
    icon: DollarSign,
    color: "purple",
  },
];

const recentActivities: RecentActivities[] = [
  {
    title: "Nova Postagem Criada",
    time: "há 2 horas",
    user: "Por João Silva",
  },
  {
    title: "Nova Postagem Criada",
    time: "há 2 horas",
    user: "Por João Silva",
  },
  {
    title: "Nova Postagem Criada",
    time: "há 2 horas",
    user: "Por João Silva",
  },
];
</script>

<template>
  <div class="flex h-screen bg-gray-50">
    <div class="w-64 bg-white shadow-sm border-r border-gray-200">
      <div class="p-6">
        <div class="flex items-center space-x-2">
          <i class="fa-solid fa-cubes text-2xl text-vibrant-green"></i>
          <span class="text-xl font-semibold text-gray-900">Dashboard</span>
        </div>
      </div>

      <nav class="mt-6">
        <button
          v-for="(item, index) in sidebarItems"
          :key="index"
          @click="emit('navigate', item.page)"
          :class="[
            'flex items-center px-6 py-3 text-sm font-medium transition-colors duration-200 w-full text-left',
            item.active
              ? 'text-vibrant-green bg-soft-green/30 border-r-2 border-vibrant-green'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50',
          ]"
        >
          <component :is="item.icon" class="w-5 h-5 mr-3" />
          {{ item.label }}
        </button>
      </nav>

      <div class="absolute bottom-6 left-6">
        <button
          class="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
        >
          <LogOut class="w-4 h-4 mr-2" />
          Sair
        </button>
      </div>
    </div>

    <div class="flex-1 overflow-auto">
      <div class="p-8">
        <div class="mb-8">
          <h1 class="text-2xl font-semibold text-gray-900 mb-2">
            Bem-vindo de volta!
          </h1>
          <p class="text-gray-600">
            Confira o resumo das suas atividades recentes
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div
            v-for="(card, index) in statsCards"
            :key="index"
            class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <div class="flex items-center justify-between mb-4">
              <div
                :class="[
                  'p-2 rounded-lg',
                  {
                    'bg-soft-green/30 text-vibrant-green':
                      card.color === 'blue',
                    'bg-vibrant-green/20 text-vibrant-green':
                      card.color === 'green',
                    'bg-gold-yellow/20 text-gold-yellow':
                      card.color !== 'blue' && card.color !== 'green',
                  },
                ]"
              >
                <component :is="card.icon" class="w-5 h-5" />
              </div>
              <span
                :class="[
                  'text-sm font-medium',
                  card.changeType === 'positive'
                    ? 'text-green-600'
                    : 'text-red-600',
                ]"
              >
                {{ card.change }}
              </span>
            </div>
            <h3 class="text-sm font-medium text-gray-600 mb-1">
              {{ card.title }}
            </h3>
            <p class="text-2xl font-semibold text-gray-900 mb-1">
              {{ card.value }}
            </p>
            <p class="text-sm text-gray-500">
              {{ card.subtitle }}
            </p>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow-sm border border-gray-200">
          <div class="p-6 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">
              Atividades Recentes
            </h2>
          </div>
          <div class="p-6">
            <div class="space-y-4">
              <div
                v-for="(activity, index) in recentActivities"
                :key="index"
                class="flex items-center space-x-4"
              >
                <div class="p-2 bg-soft-green/30 rounded-lg">
                  <FileText class="w-4 h-4 text-vibrant-green" />
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-gray-900">
                    {{ activity.title }}
                  </p>
                  <p class="text-sm text-gray-500">
                    {{ activity.time }}
                  </p>
                </div>
                <p class="text-sm text-gray-500">
                  {{ activity.user }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
