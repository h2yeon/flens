import Vue from 'vue'
import Vuex from 'vuex'
import {searchType} from '@/data/type/searchType';

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        selectedSearchType: searchType.DEVICE,
        selectedName: null,
        selectedRole: null
    },
    mutations: {
        SET_SELECTED_SEARCH_TYPE(state, searchType) {
            state.selectedSearchType = searchType;
        },
        SET_SELECTED_NAME(state, name) {
            state.selectedName = name;
        },
        SET_SELECTED_ROLE(state, role) {
            state.selectedRole = role
        }
    }
})