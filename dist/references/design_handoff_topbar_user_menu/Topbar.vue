:<!--
  Топбар админки: хлебные крошки, колокол, меню профиля по клику на аватар.
  ≤720px — нижний лист вместо поповера. Зависит от: stores/auth (имя, инициалы, logout).
-->
<script setup lang="ts">
import { Bell, ChevronDown, LogOut, Settings } from '@lucide/vue'

const auth = useAuthStore()
const route = useRoute()

const open = ref(false)
const narrow = ref(false)
const trigger = ref<HTMLButtonElement | null>(null)
const menu = ref<HTMLElement | null>(null)

let mq: MediaQueryList | null = null

const crumbs = computed(() => {
  if (route.path.startsWith('/admin/roles')) {
    return { group: 'Доступ', title: 'Роли' }
  }
  if (route.path.startsWith('/admin/permissions')) {
    return { group: 'Доступ', title: 'Права доступа' }
  }

  return { group: '', title: 'Админпанель' }
})

const initials = computed(() => {
  const name = auth.user?.name ?? ''

  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase()
})

function close(): void {
  open.value = false
}

async function toggle(): Promise<void> {
  open.value = !open.value

  if (open.value) {
    await nextTick()
    menu.value?.querySelector<HTMLElement>('[role="menuitem"]')?.focus()
  }
  else {
    trigger.value?.focus()
  }
}

function onDocumentDown(event: MouseEvent): void {
  if (!open.value) {
    return
  }
  if (!(event.target as HTMLElement).closest('.topbar__user, .topbar__sheet')) {
    close()
  }
}

function onKeydown(event: KeyboardEvent): void {
  if (event.key === 'Escape' && open.value) {
    close()
    trigger.value?.focus()
  }
}

function onMediaChange(event: MediaQueryListEvent): void {
  narrow.value = event.matches
  // Не «перетекаем» между поповером и листом на лету.
  close()
}

async function onLogout(): Promise<void> {
  close()
  await auth.logout()
  await navigateTo('/login')
}

watch(() => route.path, close)

// Пока открыт лист — страница под ним не скроллится.
watch([open, narrow], ([isOpen, isNarrow]) => {
  document.body.style.overflow = isOpen && isNarrow ? 'hidden' : ''
})

onMounted(() => {
  mq = window.matchMedia('(max-width: 720px)')
  narrow.value = mq.matches
  mq.addEventListener('change', onMediaChange)
  document.addEventListener('mousedown', onDocumentDown)
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  mq?.removeEventListener('change', onMediaChange)
  document.removeEventListener('mousedown', onDocumentDown)
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <header class="topbar">
    <div class="topbar__crumbs">
      <span>Админпанель</span>
      <template v-if="crumbs.group">
        <span class="topbar__sep">/</span>
        <span>{{ crumbs.group }}</span>
      </template>
      <span class="topbar__sep">/</span>
      <span class="topbar__current">{{ crumbs.title }}</span>
    </div>

    <button class="topbar__bell" title="Уведомления">
      <Bell :size="18" />
      <span class="topbar__dot" />
    </button>

    <div class="topbar__divider" />

    <div class="topbar__user">
      <button
        ref="trigger"
        class="topbar__profile"
        aria-haspopup="menu"
        :aria-expanded="open"
        @click="toggle"
      >
        <span class="topbar__avatar">{{ initials }}</span>
        <ChevronDown :size="15" class="topbar__chevron" />
      </button>

      <div v-if="open && !narrow" ref="menu" class="topbar__pop">
        <div class="topbar__menu" role="menu">
          <div class="topbar__card">
            <span class="topbar__card-avatar">{{ initials }}</span>
            <div class="topbar__card-text">
              <div class="topbar__card-name">
                {{ auth.user?.name }}
              </div>
              <div class="topbar__card-role">
                Администратор
              </div>
            </div>
          </div>

          <NuxtLink to="/admin/profile" class="topbar__action" role="menuitem" @click="close">
            <Settings :size="16" />
            <span>Настройки профиля</span>
          </NuxtLink>

          <button class="topbar__action topbar__action--danger" role="menuitem" @click="onLogout">
            <LogOut :size="16" />
            <span>Выход</span>
          </button>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <Transition name="sheet">
        <div v-if="open && narrow" class="topbar__sheet" @click.self="close">
          <div ref="menu" class="topbar__sheet-panel" role="menu">
            <span class="topbar__grabber" />

            <div class="topbar__card topbar__card--lg">
              <span class="topbar__card-avatar topbar__card-avatar--lg">{{ initials }}</span>
              <div class="topbar__card-text">
                <div class="topbar__card-name topbar__card-name--lg">
                  {{ auth.user?.name }}
                </div>
                <div class="topbar__card-role topbar__card-role--lg">
                  Администратор
                </div>
              </div>
            </div>

            <NuxtLink to="/admin/profile" class="topbar__row" role="menuitem" @click="close">
              <Settings :size="19" />
              <span>Настройки профиля</span>
            </NuxtLink>

            <button class="topbar__row topbar__row--danger" role="menuitem" @click="onLogout">
              <LogOut :size="19" />
              <span>Выход</span>
            </button>

            <button class="topbar__cancel" @click="close">
              Отмена
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </header>
</template>

<style scoped lang="scss">
.topbar {
  height: 64px;
  flex: 0 0 64px;
  background: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.07);
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 0 26px;

  &__crumbs {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 8px;
    font: var(--weight-regular) var(--text-sm) / 1 var(--font-sans);
    color: var(--ink-400);
  }

  &__sep { color: var(--ink-300); }

  &__current {
    color: var(--ink-900);
    font-weight: var(--weight-semibold);
  }

  &__bell {
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--border-subtle);
    background: #fff;
    border-radius: 50%;
    color: var(--ink-600);
    cursor: pointer;
    position: relative;
    transition: border-color 0.12s, color 0.12s;

    &:hover {
      border-color: var(--blue-500);
      color: var(--blue-600);
    }
  }

  &__dot {
    position: absolute;
    top: 7px;
    right: 8px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--blue-500);
    border: 2px solid #fff;
  }

  &__divider {
    width: 1px;
    height: 28px;
    background: rgba(0, 0, 0, 0.08);
  }

  &__user { position: relative; }

  &__profile {
    display: flex;
    align-items: center;
    gap: 10px;
    border: 0;
    background: transparent;
    cursor: pointer;
    padding: 4px 4px 4px 6px;
  }

  &__avatar {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--blue-500), var(--blue-600));
    display: flex;
    align-items: center;
    justify-content: center;
    font: var(--weight-bold) var(--text-xs) / 1 var(--font-sans);
    color: #fff;
  }

  &__chevron { color: var(--ink-400); }

  &__pop {
    position: absolute;
    top: 100%;
    right: 0;
    z-index: 60;
    padding-top: 8px;
  }

  &__menu {
    width: 244px;
    background: #fff;
    border: 1px solid rgba(42, 107, 155, 0.14);
    box-shadow: 0 16px 36px rgba(20, 46, 74, 0.18);
    border-radius: 14px;
    padding: 8px;
  }

  &__card {
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 8px 9px 12px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    margin-bottom: 6px;

    &--lg {
      gap: 13px;
      padding: 4px 10px 14px;
      margin-bottom: 8px;
    }
  }

  &__card-avatar {
    width: 36px;
    height: 36px;
    flex: 0 0 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--blue-500), var(--blue-600));
    display: flex;
    align-items: center;
    justify-content: center;
    font: var(--weight-bold) var(--text-sm) / 1 var(--font-sans);
    color: #fff;

    &--lg {
      width: 46px;
      height: 46px;
      flex: 0 0 46px;
      font-size: 16px;
    }
  }

  &__card-text { min-width: 0; }

  &__card-name {
    font: var(--weight-semibold) var(--text-sm) / 1.25 var(--font-sans);
    color: var(--ink-900);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &--lg { font-size: 15px; }
  }

  &__card-role {
    font: var(--weight-regular) 11.5px / 1.25 var(--font-sans);
    color: var(--ink-600);

    &--lg { font-size: 12.5px; line-height: 1.3; }
  }

  &__action {
    display: flex;
    align-items: center;
    gap: 11px;
    width: 100%;
    text-align: left;
    padding: 10px 11px;
    border: 0;
    border-radius: 9px;
    background: transparent;
    color: var(--ink-900);
    font: var(--weight-semibold) var(--text-sm) / 1 var(--font-sans);
    text-decoration: none;
    cursor: pointer;
    transition: background 0.12s, color 0.12s;

    &:hover {
      background: var(--blue-tint-050);
      color: var(--blue-600);
    }

    &--danger:hover {
      background: rgba(214, 69, 69, 0.08);
      color: #c33c3c;
    }
  }

  // ——— мобильный лист ———

  &__sheet {
    position: fixed;
    inset: 0;
    z-index: 70;
    background: rgba(16, 32, 48, 0.44);
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
  }

  &__sheet-panel {
    background: #fff;
    border-radius: 20px 20px 0 0;
    padding: 10px 12px calc(14px + env(safe-area-inset-bottom));
    box-shadow: 0 -12px 40px rgba(20, 46, 74, 0.24);
  }

  &__grabber {
    display: block;
    width: 38px;
    height: 4px;
    border-radius: 100px;
    background: rgba(0, 0, 0, 0.14);
    margin: 0 auto 12px;
  }

  &__row {
    display: flex;
    align-items: center;
    gap: 13px;
    width: 100%;
    min-height: 52px;
    text-align: left;
    padding: 0 12px;
    border: 0;
    border-radius: 12px;
    background: transparent;
    color: var(--ink-900);
    font: var(--weight-semibold) 15px / 1.2 var(--font-sans);
    text-decoration: none;
    cursor: pointer;

    &:active { background: var(--blue-tint-050); }

    &--danger {
      color: #c33c3c;

      &:active { background: rgba(214, 69, 69, 0.08); }
    }
  }

  &__cancel {
    display: block;
    width: 100%;
    min-height: 50px;
    margin-top: 8px;
    border: 0;
    border-radius: 12px;
    background: var(--surface-wash);
    color: var(--ink-600);
    font: var(--weight-semibold) 15px / 1.2 var(--font-sans);
    cursor: pointer;
  }
}

.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.16s linear;

  .topbar__sheet-panel {
    transition: transform 0.22s cubic-bezier(0.32, 0.72, 0, 1);
  }
}

.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;

  .topbar__sheet-panel { transform: translateY(100%); }
}

@media (prefers-reduced-motion: reduce) {
  .sheet-enter-active,
  .sheet-leave-active {
    .topbar__sheet-panel { transition: none; }
  }

  .sheet-enter-from,
  .sheet-leave-to {
    .topbar__sheet-panel { transform: none; }
  }
}
</style>
