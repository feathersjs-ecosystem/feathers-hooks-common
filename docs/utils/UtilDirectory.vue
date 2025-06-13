<template>
    <div class="space-y-3">
        <div v-for="util in utils" :ref="util.name" class="space-x-2">
            <a :href="util.path">
                <code>{{ util.name }}</code>
            </a>
            <span>{{ util.description }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Utility } from "../.vitepress/utilities"
const props = withDefaults(defineProps<{
    utils: Utility[]
}>(), {});
</script>