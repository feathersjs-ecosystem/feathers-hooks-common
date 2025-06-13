<template>
<table>
  <thead>
    <tr>
      <th>type</th>
      <th>methods</th>
      <th>multi</th>
      <th>details</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>{{ typeOrder.join(", ") }}</td>
      <td>{{ methodOrder.join(", ") }}</td>
      <td>{{ typeof multi === 'boolean' ? multi ? 'yes' : 'no' : multi }}</td>
      <td><a :href="source" target="_blank">source</a></td>
    </tr>
  </tbody>
</table>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  type: HookType[]
  method: string[];
  multi: boolean | string;
  source: string;
}>(), {
  type: () => ([]),
  method: () => ([]),
});

const typeOrder = computed(() => {
  const result: HookType[] = [];

  hookTypeValues.forEach((type) => {
    if (props.type.includes(type)) {
      result.push(type);
    }
  });

  return result;
})

const methodOrder = computed(() => {
  const result: HookMethod[] = [];

  if (props.method.includes('all')) {
    return ['all']
  }

  methodValues.forEach((method) => {
    if (props.method.includes(method)) {
      result.push(method);
    }
  });

  return result;
});
</script>

<script lang="ts">
import { computed } from 'vue';

const hookTypeValues = ['before', 'after', 'around', 'error'] as const;
type HookType = (typeof hookTypeValues)[number];

const methodValues = ['find', 'get', 'create', 'update', 'patch', 'remove'] as const;
type HookMethod = (typeof methodValues)[number];
</script>
