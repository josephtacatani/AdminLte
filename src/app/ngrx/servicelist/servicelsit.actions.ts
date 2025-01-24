import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Service, ServiceResponse, ServicesListResponse } from 'src/app/interfaces/servicelist.interface';


export const ServicesActions = createActionGroup({
  source: 'Services',
  events: {
    // ✅ Load all services
    'Load Services': emptyProps(),
    'Load Services Success': props<{ servicesResponse: ServicesListResponse }>(),
    'Load Services Failure': props<{ error: string }>(),

    // ✅ Load service by ID
    'Load Service By Id': props<{ id: number }>(),
    'Load Service By Id Success': props<{ serviceResponse: ServiceResponse }>(),
    'Load Service By Id Failure': props<{ error: string }>(),

    // ✅ Create service
    'Create Service': props<{ serviceData: Partial<Service> }>(),
    'Create Service Success': props<{ serviceResponse: ServiceResponse }>(),
    'Create Service Failure': props<{ error: string }>(),

    // ✅ Update service
    'Update Service': props<{ id: number; updateData: Partial<Service> }>(),
    'Update Service Success': props<{ serviceResponse: ServiceResponse }>(),
    'Update Service Failure': props<{ error: string }>(),

    // ✅ Delete service
    'Delete Service': props<{ id: number }>(),
    'Delete Service Success': props<{ message: string }>(),
    'Delete Service Failure': props<{ error: string }>(),
  },
});
