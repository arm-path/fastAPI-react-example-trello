import type {RootState} from './store.ts'

export const selectApp = (state: RootState) => state.app

export const selectUser = (state: RootState) => state.user

export const selectProjects = (state: RootState) => state.projects

export const selectAuth = (state: RootState) => state.auth

export const selectDashboard = (state: RootState) => state.dashboard

export const selectTask = (state: RootState) => state.tasks