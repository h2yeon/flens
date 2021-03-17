<template>
    <div class="flens-container">
        <div class="item topology">
            <topology/>
        </div>
        <div class="item searchDetail">
            <search-detail/>
        </div>
    </div>
</template>

<script>
import Topology from "./Topology"
import SearchDetail from "./SearchDetail"
export default {
    name: "Main",
    components: {
        Topology,
        SearchDetail
    }
}
</script>

<style lang="scss">
.flens-container {
    display: grid;
    grid-template-columns: auto auto auto auto;
    grid-gap: 10px;
    min-height: 66rem;
    .item {
        justify-content: center;
        align-items: center;
    }
    .topology {
        grid-column-end: span 2;
    }
    .searchDetail {
    }
}
</style>
