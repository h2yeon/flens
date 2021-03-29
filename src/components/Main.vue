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
    display: flex;
    min-height: 60rem;
    .item:nth-child(1) { 
	    flex-shrink: 0;
	    width: 1050px; }
    .item:nth-child(2) { flex-grow: 1; }
    
}
</style>
