import { toast } from 'react-toastify';
import api from '../services/api';

export const GET_APPLICATIONS_SUCCESS = 'GET_APPLICATIONS_SUCCESS';
export const CREATE_APPLICATION_SUCCESS = 'CREATE_APPLICATION_SUCCESS';
export const UPDATE_APPLICATION_SUCCESS = 'UPDATE_APPLICATION_SUCCESS';
export const DELETE_APPLICATION_SUCCESS = 'DELETE_APPLICATION_SUCCESS';

export function getApplications() {
    return async (dispatch) => {
        try {
            const result = await api.getApplications();
            dispatch({ type: GET_APPLICATIONS_SUCCESS, payload: result.applications });
        } catch (e) {
            toast.error(e.message);
        }
    };
}

export function createApplication(application) {
    return async (dispatch) => {
        try {
            const result = await api.createApplication(application);
            dispatch({ type: CREATE_APPLICATION_SUCCESS, payload: result.application });
            toast.success('Application created successfully!');
        } catch (e) {
            toast.error(e.message);
        }
    };
}

export function updateApplication(id, application) {
    return async (dispatch) => {
        try {
            const result = await api.updateApplication(id, application);
            dispatch({ type: UPDATE_APPLICATION_SUCCESS, payload: result.application });
            toast.success('Application updated successfully!');
        } catch (e) {
            toast.error(e.message);
        }
    };
}

export function deleteApplication(id) {
    return async (dispatch) => {
        try {
            await api.deleteApplication(id);
            dispatch({ type: DELETE_APPLICATION_SUCCESS, payload: { id } });
            toast.success('Application deleted successfully!');
        } catch (e) {
            toast.error(e.message);
        }
    };
}