<template>
    <b-container class="flens-container" fluid>
        <b-row align-v="stretch">
            <b-col cols="6" class="topology">
                <topology/>
            </b-col>
            <b-col class="searchDetail">
                <search-detail/>
            </b-col>
        </b-row>
    </b-container>
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
    min-height: 60rem;
}
</style>
