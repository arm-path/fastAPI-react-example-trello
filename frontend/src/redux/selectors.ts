import type {RootState} from './store.ts'

export const selectProjects = (state: RootState) => state.projects

export const selectAuth = (state: RootState) => state.auth