import { createStore } from 'vuex'

const state = {
    point_start: {
        name: '',
        lg: ''
    },
    point_target: {
        name: '',
        lg: ''
    },
    point_location_current: {
        name: '',
        lg: ''
    }
}

const mutations = {
    SET_POINT_START(state, payload) {
        state.point_start = payload
    },
    SET_POINT_TARGET(state, payload) {
        state.point_target = payload
    },
    SET_POINT_LOCATION_CURRENT(state, payload) {
        state.point_location_current = payload
    },
}

const actions = {

}

const getters = {

}

const store = createStore({
    state,
    mutations,
    actions,
    getters
})

export default store