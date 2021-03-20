<template>
    <div>
        <table>
            <tr>
                <td>
                    <select v-model="selectedSearchType">
                        <option 
                            v-for="(option,index) in searchTypeOptions" 
                            :key="index"
                            :value="option.value">
                        </option>
                    </select>
                </td>
                <td v-for="column in columns" :key="column.key">
                    <label>{{column.label}}</label>
                    <input v-model="column.value" type="text">
                </td>
                <td>
                    <button>Search</button>
                </td>
            </tr>
            <tr>
                <td>
                   <select></select> 
                </td>
                <td>
                    <select></select>
                </td>
                <td>
                    <input v-model="timeOut" type="number">
                </td>
                <td>
                    <button>Metric Filter</button>
                </td>
            </tr>
        </table>
        <div>
            <div>
                <select >

                </select>
            </div>
        </div>
    </div>
</template>

<script>
import {searchType} from '@/data/type/searchType'
export default {
    name: "SearchDetail",
    data() {
        return {
            selectedSearchType: searchType.FLOW,
            searchTypeOptions: [
                {text: 'Device', value: searchType.DEVICE},
                {text: 'Flow', value: searchType.FLOW},
                {text: 'Link', value: searchType.LINK}
            ],
            searchRequirements: [
                {label:"Src IP", value: "srcIp"},
                {label: "Dist IP", value: "distIP"},
                {label: "Dist IP", value: "distIP"},
            ],
            timeOut: 100
        }
    }
}
</script>

<style lang="scss">
</style>
