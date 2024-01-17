<template>
<table>
  <thead>
    <tr>
      <th>before</th>
      <th>after</th>
      <th>methods</th>
      <th>multi</th>
      <th>details</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>{{ before ? 'yes' : 'no' }}</td>
      <td>{{ after ? 'yes' : 'no' }}</td>
      <td>{{ methods.join(", ") }}</td>
      <td>{{ typeof multi === 'boolean' ? multi ? 'yes' : 'no' : multi }}</td>
      <td><a :href="source" target="_blank">source</a></td>
    </tr>
  </tbody>
</table>
</template>

<script setup lang="ts">


const props = defineProps<{
  before: boolean;
  after: boolean;
  methods: string[];
  multi: boolean | string;
  source: string;
}>();
</script>

<script lang="ts">
</script>
