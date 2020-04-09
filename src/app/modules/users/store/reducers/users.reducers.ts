import { createReducer, on, Action } from '@ngrx/store';

import { ISeniorityCount, ISubCategoryValue, IUser, IUserValues } from '@core/interfaces';
import * as usersActions from '../actions';

export interface UsersModuleState {
  users: UsersState;
}

export interface UsersState {
  loadingUsersDetails: boolean;
  loadingUsersSkills: boolean;
  loadingSkillsWithTitles: boolean;
  loadingUsersList: boolean;
  skillProgress: ISeniorityCount;
  otherUserDetails: IUserValues;
  otherUserSkillsProgress: ISubCategoryValue[];
  usersList: IUser[];
}

export const initialState: UsersState = {
  loadingUsersDetails: false,
  loadingUsersSkills: false,
  loadingSkillsWithTitles: false,
  loadingUsersList: false,
  skillProgress: {
    junior: 0,
    middle: 0,
    senior: 0,
  },
  otherUserSkillsProgress: null,
  otherUserDetails: null,
  usersList: null,
};

const USERS_REDUCER = createReducer(
  initialState,
  on(usersActions.loadTotalProgress, (state) => ({ ...state, loadingUsersSkills: true })),
  on(usersActions.computeTotalProgressSuccess, (state, { values }) => ({ ...state, loadingUsersSkills: false, skillProgress: values })),
  on(usersActions.computeTotalProgressFail, (state) => ({
    ...state,
    skillProgress: initialState.skillProgress,
    loadingUsersSkills: false,
  })),

  on(usersActions.loadOtherUserDetails, (state) => ({ ...state, loadingUsersDetails: true })),
  on(usersActions.loadOtherUserDetailsFail, (state) => ({ ...state, loadingUsersDetails: false })),
  on(usersActions.loadOtherUserSuccess, (state, { user }) => ({ ...state, otherUserDetails: user, loadingUsersDetails: false })),

  on(usersActions.loadSkillsWithTitles, (state) => ({ ...state, loadingSkillsWithTitles: true, otherUserSkillsProgress: null })),
  on(usersActions.loadSkillsWithTitlesFail, (state) => ({ ...state, loadingSkillsWithTitles: false })),
  on(usersActions.loadSkillsWithTitlesSuccess, (state, { values }) => ({
    ...state,
    loadingSkillsWithTitles: false,
    otherUserSkillsProgress: values,
  })),

  on(usersActions.loadUsersList, (state) => ({ ...state, loadingUsersList: true })),
  on(usersActions.loadUsersListSuccess, (state, { users }) => ({ ...state, usersList: users, loadingUsersList: false })),
  on(usersActions.loadUsersListFail, (state) => ({ ...state, usersList: null, loadingUsersList: false })),
);

export function usersReducer(state: UsersState, action: Action) {
  return USERS_REDUCER(state, action);
}