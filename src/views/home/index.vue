<template>
  <div class="dashboard-editor-container">
    <panel-group/>
  </div>
</template>

<script>
import PanelGroup from '../../components/home/PanelGroup'
export default {
  name: 'Dashboard',
  components: {
    PanelGroup
  },
  data() {
    return {
    }
  },
  methods: {
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard-editor-container {
    padding: 32px;
    background-color: white;
    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }
</style>
