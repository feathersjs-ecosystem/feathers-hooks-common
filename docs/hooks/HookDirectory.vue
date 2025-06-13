<template>
    <div class="space-y-3">
        <div v-for="hook in hooks" :ref="hook.name" class="space-x-2">
            <a :href="hook.path">
                <code>{{ hook.name }}</code>
            </a>
            <span>{{ hook.description }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Utility } from "../.vitepress/utilities"
const props = withDefaults(defineProps<{
    hooks: Utility[]
}>(), {});
</script>