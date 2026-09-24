<template>
  <div class="successor-banner">
    <p>
      <strong>feathers-hooks-common</strong> has a successor:
      <a href="https://utils.feathersjs.com/">feathers-utils</a>.
      <span class="successor-banner-long">Check out the new docs for a modern, improved set of hooks and utilities.</span>
    </p>
  </div>
</template>

<style>
:root {
  --vp-layout-top-height: 48px;
}

@media (min-width: 768px) {
  :root {
    --vp-layout-top-height: 40px;
  }
}
</style>

<style scoped>
.successor-banner {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: var(--vp-z-index-layout-top);
  display: flex;
  align-items: center;
  justify-content: center;
  height: var(--vp-layout-top-height);
  padding: 0 16px;
  background-color: var(--vp-c-brand);
  color: #fff;
  font-size: 14px;
  line-height: 1.3;
  text-align: center;
}

.successor-banner p {
  margin: 0;
}

.successor-banner a {
  color: inherit;
  font-weight: 600;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.successor-banner a:hover {
  opacity: 0.85;
}

.successor-banner-long {
  display: none;
}

@media (min-width: 768px) {
  .successor-banner-long {
    display: inline;
  }
}
</style>
