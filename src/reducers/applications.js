import {
    GET_APPLICATIONS_SUCCESS,
    CREATE_APPLICATION_SUCCESS,
    UPDATE_APPLICATION_SUCCESS,
    DELETE_APPLICATION_SUCCESS
} from '../actions/applications';

const initialState = {
    applications: [],
};

export default function runtime(state = initialState, action) {
    switch (action.type) {
        case GET_APPLICATIONS_SUCCESS:
            return {
                ...state,
                applications: action.payload,
            };
        case CREATE_APPLICATION_SUCCESS:
            return {
                ...state,
                applications: [...state.applications, action.payload],
            };
        case UPDATE_APPLICATION_SUCCESS:
            return {
                ...state,
                applications: state.applications.map(app =>
                    app.id === action.payload.id ? action.payload : app
                ),
            };
        case DELETE_APPLICATION_SUCCESS:
            return {
                ...state,
                applications: state.applications.filter(app => app.id !== action.payload.id),
            };
        default:
            return state;
    }
}