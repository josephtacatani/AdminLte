import { createFeature, createReducer, on } from '@ngrx/store';
import { Service } from 'src/app/interfaces/servicelist.interface';
import { ServicesActions } from './servicelsit.actions';


export interface ServicesState {
  isLoading: boolean;
  services: Service[];
  selectedService: Service | null;
  error: string | null;
  deleteMessage: string | null;
}

export const initialServicesState: ServicesState = {
  isLoading: false,
  services: [],
  selectedService: null,
  error: null,
  deleteMessage: null,
};

export const servicesFeature = createFeature({
  name: 'services',
  reducer: createReducer(
    initialServicesState,

    // ✅ Load all services
    on(ServicesActions.loadServices, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(ServicesActions.loadServicesSuccess, (state, { servicesResponse }) => ({
      ...state,
      isLoading: false,
      services: servicesResponse.data,
      error: null,
    })),
    on(ServicesActions.loadServicesFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),

    // ✅ Load service by ID
    on(ServicesActions.loadServiceById, (state) => ({
      ...state,
      isLoading: true,
      selectedService: null,
      error: null,
    })),
    on(ServicesActions.loadServiceByIdSuccess, (state, { serviceResponse }) => ({
      ...state,
      isLoading: false,
      selectedService: serviceResponse.data,
      error: null,
    })),
    on(ServicesActions.loadServiceByIdFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      selectedService: null,
      error,
    })),

    // ✅ Create a service
    on(ServicesActions.createService, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(ServicesActions.createServiceSuccess, (state, { serviceResponse }) => ({
      ...state,
      isLoading: false,
      services: [...state.services, serviceResponse.data],
      error: null,
    })),
    on(ServicesActions.createServiceFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),

    // ✅ Update a service
    on(ServicesActions.updateService, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(ServicesActions.updateServiceSuccess, (state, { serviceResponse }) => ({
      ...state,
      isLoading: false,
      services: state.services.map(service =>
        service.id === serviceResponse.data.id ? serviceResponse.data : service
      ),
      error: null,
    })),
    on(ServicesActions.updateServiceFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    })),

    // ✅ Delete a service
    on(ServicesActions.deleteService, (state) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(ServicesActions.deleteServiceSuccess, (state, { message }) => ({
      ...state,
      isLoading: false,
      services: state.services.filter(service => service.id !== state.selectedService?.id),
      selectedService: null,
      deleteMessage: message,
      error: null,
    })),
    on(ServicesActions.deleteServiceFailure, (state, { error }) => ({
      ...state,
      isLoading: false,
      error,
    }))
  ),
});

export const {
  name: servicesFeatureKey,
  reducer: servicesReducer,
  selectIsLoading,
  selectServices,
  selectSelectedService,
  selectError,
  selectDeleteMessage,
} = servicesFeature;
