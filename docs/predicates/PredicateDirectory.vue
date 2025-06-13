<template>
    <div class="space-y-3">
        <div v-for="predicate in predicates" :ref="predicate.name" class="space-x-2">
            <a :href="predicate.path">
                <code>{{ predicate.name }}</code>
            </a>
            <span>{{ predicate.description }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Utility } from "../.vitepress/utilities"
const props = withDefaults(defineProps<{
    predicates: Utility[]
}>(), {});
</script>