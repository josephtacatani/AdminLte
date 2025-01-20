import { createFeature, createReducer, on } from '@ngrx/store';
import { UserProfileResponse } from 'src/app/interfaces/user_profile.interface';
import { ProfileActions } from './user_profile.actions';

export interface ProfileState {
  profile: UserProfileResponse | null;
  loading: boolean;
  error: string | null;
}

export const initialProfileState: ProfileState = {
  profile: null,
  loading: false,
  error: null
};

export const profileFeature = createFeature({
  name: 'profile',
  reducer: createReducer(
    initialProfileState,

    on(ProfileActions.loadProfile, (state) => ({
      ...state,
      loading: true,
      error: null
    })),

    on(ProfileActions.loadProfileSuccess, (state, { profile }) => ({
      ...state,
      profile,
      loading: false
    })),

    on(ProfileActions.loadProfileFailure, (state, { error }) => ({
      ...state,
      loading: false,
      error
    }))
  )
});

export const {
  name: profileFeatureKey,
  reducer: profileReducer,
  selectProfile,
  selectLoading,
  selectError
} = profileFeature;
